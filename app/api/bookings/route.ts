import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getValidGoogleToken } from '../../../lib/googleAuth';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import nodemailer from 'nodemailer';
import { nextDay, startOfDay, addHours, isBefore, isAfter, format } from 'date-fns';
import { toDate, formatInTimeZone } from 'date-fns-tz';

const ADMIN_EMAIL = 'omar3328101@gmail.com';
const DURATION_MINUTES = 60;
const TIMEZONE = 'Asia/Dubai';

const dayNameToNumber: Record<string, 0|1|2|3|4|5|6> = {
  'sunday': 0,
  'monday': 1,
  'tuesday': 2,
  'wednesday': 3,
  'thursday': 4,
  'friday': 5,
  'saturday': 6,
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Now receiving generic day and block start/end along with form details
    const { 
      studentName, studentEmail, studentPhone, childAge, 
      selectedDay, blockStartHour, blockEndHour,
      courseType, curriculum, grade, subject, packageName, studentLevel
    } = body;

    if (!studentName || !studentEmail || !selectedDay || blockStartHour == null || blockEndHour == null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Calculate the exact Date of the "next" selected day
    const dayNumber = dayNameToNumber[selectedDay.toLowerCase()];
    if (dayNumber === undefined) {
      return NextResponse.json({ error: 'Invalid day selected' }, { status: 400 });
    }

    const now = new Date();
    // Get the next occurrence of the selected day (or today if it matches)
    let targetDate = nextDay(now, dayNumber);
    
    // Create the start and end bounds in Dubai time for that day
    const targetDateStr = format(targetDate, 'yyyy-MM-dd');
    const boundsStart = toDate(`${targetDateStr}T${blockStartHour.toString().padStart(2, '0')}:00:00`, { timeZone: TIMEZONE });
    const boundsEnd = toDate(`${targetDateStr}T${blockEndHour.toString().padStart(2, '0')}:00:00`, { timeZone: TIMEZONE });

    let authClient = null;
    try {
      authClient = await getValidGoogleToken(ADMIN_EMAIL);
    } catch (e) {
      console.warn("Google Calendar not connected, skipping calendar event creation.");
    }

    let meetLink = 'غير متاح (التقويم غير متصل)';
    let eventId = 'no-event-' + Date.now();

    let busyPeriods: { start: string, end: string }[] = [];

    // 1. Fetch busy periods from Google Calendar
    if (authClient) {
      const calendar = google.calendar({ version: 'v3', auth: authClient });
      const freeBusyResponse = await calendar.freebusy.query({
        requestBody: {
          timeMin: boundsStart.toISOString(),
          timeMax: boundsEnd.toISOString(),
          timeZone: TIMEZONE,
          items: [{ id: 'primary' }]
        }
      });
      const calBusy = freeBusyResponse.data.calendars?.primary?.busy || [];
      busyPeriods.push(...calBusy.map(b => ({ start: b.start as string, end: b.end as string })));
    }

    // 2. Fetch busy periods from Supabase Database
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: dbBookings, error: dbError } = await supabase
      .from('bookings')
      .select('start_time, end_time')
      .gte('start_time', boundsStart.toISOString())
      .lt('start_time', boundsEnd.toISOString())
      .in('status', ['confirmed']);

    if (dbBookings && !dbError) {
      busyPeriods.push(...dbBookings.map(b => ({ start: b.start_time, end: b.end_time })));
    }

    // 3. Find the first available 1-hour slot in this block
    let foundSlotStart: Date | null = null;
    let foundSlotEnd: Date | null = null;
    
    let currentCheckStart = boundsStart;
    
    while (isBefore(currentCheckStart, boundsEnd)) {
      const currentCheckEnd = addHours(currentCheckStart, 1);
      if (isAfter(currentCheckEnd, boundsEnd)) break; // Not enough time left in block

      // Check if this 1-hour slot overlaps with any busy period
      const isOverlapping = busyPeriods.some(busy => {
        if (!busy.start || !busy.end) return false;
        const bStart = new Date(busy.start);
        const bEnd = new Date(busy.end);
        return isBefore(currentCheckStart, bEnd) && isAfter(currentCheckEnd, bStart);
      });

      if (!isOverlapping) {
        foundSlotStart = currentCheckStart;
        foundSlotEnd = currentCheckEnd;
        break; // Found our slot!
      }

      // Move to next hour
      currentCheckStart = addHours(currentCheckStart, 1);
    }

    if (!foundSlotStart || !foundSlotEnd) {
      return NextResponse.json({ 
        error: 'عذراً، هذا الوقت ممتلئ بالكامل في التقويم، يرجى اختيار فترة أو يوم آخر.' 
      }, { status: 409 });
    }

    // 4. Create the Google Calendar Event with Google Meet link
    const event = {
      summary: `حصة تجريبية - ${studentName}`,
      description: `
اسم الطالب: ${studentName}
العمر/الصف: ${childAge || grade || 'غير محدد'}
رقم الهاتف: ${studentPhone || 'غير محدد'}
البريد الإلكتروني: ${studentEmail}

تفاصيل الحجز:
نوع الحصة: ${courseType || 'غير محدد'}
المنهج: ${curriculum || 'غير محدد'}
المادة: ${subject || 'غير محدد'}
الباقة: ${packageName || 'غير محدد'}
المستوى (للعربية): ${studentLevel || 'غير محدد'}

تم اختيار الفترة: ${blockStartHour}:00 إلى ${blockEndHour}:00 بتوقيت دبي.
      `,
      start: { dateTime: foundSlotStart.toISOString() },
      end: { dateTime: foundSlotEnd.toISOString() },
      attendees: [
        { email: studentEmail }
      ],
      conferenceData: {
        createRequest: {
          requestId: `majd-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' }
        }
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 }
        ]
      }
    };

    const createdEvent = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      sendUpdates: 'all', // Send email to attendees
      requestBody: event,
    });

    meetLink = createdEvent.data.hangoutLink || meetLink;
    eventId = createdEvent.data.id || eventId;
    } // End of if (authClient)

    // 5. Save booking to Supabase
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    
    const { data: booking, error: dbError } = await supabase
      .from('bookings')
      .insert({
        student_name: studentName,
        student_email: studentEmail,
        student_phone: studentPhone,
        child_age: childAge,
        course_type: courseType,
        curriculum: curriculum,
        grade: grade,
        subject: subject,
        package_name: packageName,
        student_level: studentLevel,
        start_time: foundSlotStart.toISOString(),
        end_time: foundSlotEnd.toISOString(),
        google_event_id: eventId,
        status: 'confirmed'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Failed to save booking to Supabase:', dbError);
    }

    // 6. Send Custom Email
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const formattedDateAr = new Intl.DateTimeFormat('ar-EG', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          hour: 'numeric', minute: 'numeric', timeZone: TIMEZONE
        }).format(foundSlotStart);

        // Send Admin Email
        await transporter.sendMail({
          from: `"نظام أكاديمية مجد" <${process.env.EMAIL_USER}>`,
          to: ADMIN_EMAIL,
          subject: `حجز حصة تجريبية جديد - ${studentName}`,
          html: `
            <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h2 style="color: #ef5da8;">يوجد حجز حصة تجريبية جديد!</h2>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin: 15px 0;">
                <p><strong>اسم الطالب:</strong> ${studentName}</p>
                <p><strong>رقم التواصل:</strong> ${studentPhone || 'غير محدد'}</p>
                <p><strong>الدولة/المنهج:</strong> ${curriculum || 'غير محدد'}</p>
                <p><strong>الصف/العمر:</strong> ${childAge || grade || 'غير محدد'}</p>
                <p><strong>نوع الحصة:</strong> ${courseType || 'غير محدد'}</p>
                <p><strong>المادة/المستوى:</strong> ${subject || studentLevel || 'غير محدد'}</p>
                <p><strong>الباقة المتوقعة:</strong> ${packageName || 'غير محدد'}</p>
                <p><strong>وقت الحصة الدقيق (بتوقيت دبي):</strong> ${formattedDateAr}</p>
                <p><strong>رابط ميت:</strong> <a href="${meetLink}">${meetLink}</a></p>
              </div>
            </div>
          `
        });
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
      }
    }

    return NextResponse.json({ 
      success: true, 
      meetLink, 
      bookingId: booking?.id, 
      exactTime: foundSlotStart.toISOString(),
      calendarSkipped: !authClient
    });

  } catch (error: any) {
    console.error('Booking Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create booking' }, { status: 500 });
  }
}
