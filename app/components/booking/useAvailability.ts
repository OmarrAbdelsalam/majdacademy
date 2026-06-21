import { useState, useEffect } from 'react';
import { addDays, format } from 'date-fns';

export interface TimeSlot {
  start: string;
  end: string;
  formattedTime: string;
}

export function useAvailability() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate next 14 days for the date picker
  const upcomingDates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i + 1));

  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots([]);
      return;
    }

    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    setIsLoading(true);
    setError(null);

    fetch(`/api/availability?date=${dateStr}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setAvailableSlots(data.availableSlots || []);
        }
      })
      .catch(err => {
        setError('فشل في جلب المواعيد المتاحة');
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedDate]);

  return {
    upcomingDates,
    selectedDate,
    setSelectedDate,
    availableSlots,
    isLoading,
    error
  };
}
