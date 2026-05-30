# صفحة "من نحن" — خطة إعادة البناء

## الهيكل العام
صفحة على `/ar/about` و `/en/about`
تستخدم نفس الـ Navbar والـ Footer. مقسمة لـ components منفصلة.

---

## التاسكات (بالترتيب)

### 1. Hero Section
- **Reference**: `KodlandHero.tsx`
- عنوان "من نحن" + subtitle + باكجراوند bg-ellipse
- مقدمة عن مَجد أكاديمي

### 2. Mission & Vision Section
- **Reference**: `InterestsSection.tsx` (2 cards)
- كارد الرسالة + كارد الرؤية
- بنفس ستايل الكاردات (rounded-[32px], sticker, card colors)

### 3. Values Section
- **Reference**: `GuaranteesSection.tsx` (grid items on lime banner)
- 4 قيم في بانر ليموني
- كل قيمة: أيقونة + عنوان + وصف

### 4. Why Us Section
- **Reference**: `WhyMajdFeatures.tsx` (feature list)
- 6 نقاط بأرقام
- CTA يفتح BookingModal

### 5. Page Assembly
- تجميع في `app/[locale]/about/page.tsx`
- Navbar → Hero → Mission/Vision → Values → WhyUs → Footer + FloatingWhatsApp

---

## ملاحظات
- كل component أقل من 150 سطر
- كل CTA يفتح BookingModal
- الـ spacing من الـ design system (py-12 md:py-16)
- عربي إماراتي + إنجليزي
