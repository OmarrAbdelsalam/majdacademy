# صفحة "تعلّم العربية لغير الناطقين" — خطة التنفيذ

## الهيكل العام
صفحة landing مستقلة على `/ar/learn-arabic` و `/en/learn-arabic`
تستخدم نفس الـ Navbar والـ Footer بتاع اللاندنج الرئيسية.

---

## التاسكات (بالترتيب)

### 1. Hero Section
- **Reference**: `KodlandHero.tsx`
- **المحتوى**: عنوان رئيسي + subtitle + CTA يفتح BookingModal
- **الباكجراوند**: `bg-ellipse.webp` (نفس الهيرو الرئيسي)
- **العنوان**: "علّم ولدك العربية" + highlight "من الصفر"
- **الـ subtitle**: شرح بسيط إن الكورس لغير الناطقين، كل الأعمار، بدون منهج محدد
- **CTA**: "احجز حصة تجريبية" → يفتح BookingModal

---

### 2. Who Is This For Section (لمين الكورس؟)
- **Reference**: `InterestsSection.tsx` (3 cards with stickers)
- **3 كاردات**:
  - أطفال عرب في الخارج (يحافظون على لغتهم)
  - أطفال أجانب في الإمارات (يتعلمون العربية للمدرسة)
  - كبار يبون يتعلمون العربية (للعمل أو الثقافة)
- **كل كارد**: sticker image + عنوان + وصف + CTA

---

### 3. What They'll Learn Section (إيش بيتعلمون؟)
- **Reference**: `WhyMajdFeatures.tsx` (feature list with colored active states)
- **4 عناصر**:
  - القراءة والكتابة (الحروف، التشكيل، الكلمات)
  - المحادثة اليومية (جمل عملية، مواقف حقيقية)
  - القواعد الأساسية (بأسلوب مبسط بدون تعقيد)
  - الثقافة العربية (عادات، تعبيرات، أمثال)
- **صورة ثابتة** على الجنب

---

### 4. How It Works Section (كيف نشتغل؟)
- **Reference**: `TrialStepsSection.tsx` (step-by-step with image)
- **3 خطوات**:
  - تقييم المستوى (نحدد وين الطالب ونبدأ من عنده)
  - خطة مخصصة (نصمم المنهج حسب عمره وهدفه)
  - حصص تفاعلية (يتعلم بالممارسة مش الحفظ)

---

### 5. Pricing Section (الباقات)
- **Reference**: `PackagesSection.tsx`
- **باقتين**:
  - باقة أساسية: 4 حصص/شهر — 350 درهم
  - باقة مكثفة: 8 حصص/شهر — 600 درهم
- **CTA**: يفتح BookingModal

---

### 6. FAQ Section
- **Reference**: `FAQSection.tsx`
- **5 أسئلة** خاصة بكورس العربية:
  - هل لازم يعرف حروف عربية قبل؟
  - كم عمر الطالب المناسب؟
  - الحصص بالعربي ولا بالإنجليزي؟
  - كم مدة الحصة؟
  - هل فيه شهادة؟

---

### 7. CTA Banner (احجز حصتك)
- **Reference**: `GuaranteesSection.tsx` (lime gradient banner)
- **عنوان**: "ابدأ رحلة ولدك مع العربية"
- **CTA**: يفتح BookingModal

---

### 8. Page Assembly
- تجميع كل السكاشن في `app/[locale]/learn-arabic/page.tsx`
- الترتيب: Navbar → Hero → Who → What → How → Pricing → FAQ → CTA Banner → Footer
- التأكد من الـ RTL/LTR والترجمة

---

## ملاحظات مهمة
- كل CTA "احجز" يفتح `BookingModal`
- كل النصوص بالعربي (إماراتي) + إنجليزي
- الألوان والسبيسنج من الـ design system بالظبط
- كل component يكون أقل من 300 سطر
- الصور تستخدم `loading="lazy"` (ما عدا الهيرو)
