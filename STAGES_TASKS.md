# صفحات المراحل الدراسية — خطة التنفيذ

## الهيكل العام
3 صفحات متشابهة بنفس الهيكل، الفرق في المحتوى:
- `/ar/stages/primary` — المرحلة الابتدائية (الصف 1-5)
- `/ar/stages/middle` — المرحلة المتوسطة (الصف 6-9)
- `/ar/stages/secondary` — المرحلة الثانوية (الصف 10-12)

صفحة واحدة dynamic تستقبل parameter وتعرض المحتوى حسب المرحلة.

---

## التاسكات (بالترتيب)

### 1. Hero Section
- **Reference**: `KodlandHero.tsx`
- عنوان المرحلة (مثلاً "المرحلة الابتدائية") + highlight بالليموني
- subtitle يوصف المرحلة
- CTA "احجز حصة تجريبية" → BookingModal
- باكجراوند bg-ellipse

### 2. Grades Grid Section (السنين الدراسية)
- **Reference**: `InterestsSection.tsx` (cards pattern)
- Grid من الصفوف (مثلاً الصف 1، 2، 3، 4، 5 للابتدائي)
- كل صف: كارد بـ rounded-[32px] + رقم الصف + اسمه
- ألوان الكاردات: card-warm, card-pink, card-green بالتبادل

### 3. Subjects Section (المواد)
- **Reference**: `SubjectsSection.tsx` (2 cards)
- كارد اللغة العربية + كارد التربية الإسلامية
- نفس الستايل بالظبط (stickers + CTA)

### 4. What They'll Learn Section (إيش بيتعلمون في المرحلة دي)
- **Reference**: `WhyMajdFeatures.tsx` (feature list with colored active)
- 4 نقاط خاصة بالمرحلة (مختلفة لكل مرحلة)
- صورة ثابتة على الجنب

### 5. Pricing Section
- **Reference**: `PackagesSection.tsx`
- نفس الباقتين (شاملة 600 + أساسية 400)
- CTA → BookingModal

### 6. CTA Banner
- **Reference**: `GuaranteesSection.tsx`
- "ابدأ رحلة ولدك" + CTA → BookingModal

### 7. Page Assembly
- صفحة dynamic واحدة: `app/[locale]/stages/[stage]/page.tsx`
- تقرأ الـ stage parameter وتعرض المحتوى المناسب
- Navbar → Hero → Grades → Subjects → WhatTheyLearn → Pricing → CTA → Footer

---

## المحتوى حسب المرحلة

### الابتدائية (primary) — الصف 1-5
- **الوصف**: نبني أساس قوي في القراءة والكتابة والحساب بأسلوب ممتع
- **النقاط**: تأسيس القراءة، الكتابة الإبداعية، الحساب الذهني، حب التعلم
- **الصفوف**: 1، 2، 3، 4، 5

### المتوسطة (middle) — الصف 6-9
- **الوصف**: نطوّر مهارات التفكير التحليلي والفهم العميق
- **النقاط**: التفكير التحليلي، الفهم العميق، مهارات البحث، الاستعداد للثانوي
- **الصفوف**: 6، 7، 8، 9

### الثانوية (secondary) — الصف 10-12
- **الوصف**: نجهّز الطالب للامتحانات النهائية والإمسات
- **النقاط**: تحضير EmSAT، مراجعات مكثفة، خطة مخصصة، دعم نفسي
- **الصفوف**: 10، 11، 12

---

## ملاحظات
- صفحة dynamic واحدة (مش 3 صفحات منفصلة)
- كل component أقل من 200 سطر
- المحتوى في object واحد مقسم بالـ stage key
- كل CTA يفتح BookingModal
- عربي إماراتي + إنجليزي
- الكاردات في "اعرف أكثر" في InterestsSection تلنك لهنا
