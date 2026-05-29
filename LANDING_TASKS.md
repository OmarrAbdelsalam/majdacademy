# 📋 تاسكات تحسين Landing Page — مَجْد أكاديمي

**الهدف:** تحسين تجربة المستخدم وزيادة معدل التحويل (conversion) للصفحة الرئيسية.
**التارجت:** أولياء أمور (أمهات بالأخص) + طلاب مدارس (صف 1-12) في الإمارات.
**الصفحة:** `app/[locale]/landing2/page.tsx` → `app/components/AcademyLanding2.tsx`

---

## الترتيب الحالي للسكشنات:

```
1. Hero (LiteratureReviewBanner) — فيديو + CTA
2. اختار الصف (ChooseYourGrade)
3. ليش مَجْد (WhyMajdSection) — مميزات zigzag
4. بانر الباقات (PremiumPackagesHero) — pink gradient + صورة
5. تفاصيل الباقات (PackagesSection) — كارتين
6. الضمانات (GuaranteesSection) — 6 ضمانات + shield
7. الأسئلة الشائعة (FAQSection) — pink bg + waves
8. تجارب أولياء الأمور (StudentTestimonials) — WhatsApp cards
9. Footer (Foot)
```

## الترتيب المقترح بعد التحسين:

```
1. Hero (فيديو + CTA)
2. ★ Trust Bar (أرقام سريعة) ← Task 1
3. اختار الصف
4. ليش مَجْد + ★ CTA وسطي ← Task 5
5. بانر الباقات
6. تفاصيل الباقات
7. ★ كيف تبدأ (Steps) ← Task 4
8. الضمانات + ★ CTA وسطي ← Task 5
9. ★ المعلمين ← Task 2
10. الأسئلة الشائعة
11. تجارب أولياء الأمور
12. ★ CTA أخير كبير ← Task 3
13. Footer
```

---

## 🔴 أولوية عالية

### Task 1: Trust Bar بعد الـ Hero

**الوصف:** شريط أفقي بسيط يظهر مباشرة بعد الـ Hero يعرض أرقام سريعة تبني ثقة فورية.

**الموقع:** بين `LiteratureReviewBanner` و `ChooseYourGrade`

**المحتوى:**
- +500 طالب وطالبة (أيقونة: Users)
- 4.9 تقييم أولياء الأمور (أيقونة: Star)
- منهج إماراتي معتمد (أيقونة: ShieldCheck)
- +50 معلم متخصص (أيقونة: GraduationCap)

**الستايل:**
- خلفية: `#f9fafb` أو شفافة
- الأرقام: font-black text-[#1B2D4F] text-2xl
- الوصف: text-[#8B6E96] text-sm
- Layout: flex row مع dividers (أو grid 4 أعمدة)
- على الموبايل: grid 2x2
- Padding: py-8 md:py-12
- مفيش عنوان — بس الأرقام

**الملف:** `app/components/TrustBar.tsx`

---

### Task 2: سكشن المعلمين

**الوصف:** سكشن يعرض فريق المعلمين عشان الأمهات يحسوا بالأمان ويعرفوا مين هيدرّس عيالهم.

**الموقع:** بعد `GuaranteesSection` وقبل `FAQSection`

**المحتوى (4 معلمين):**
| الاسم | التخصص | الخبرة | ملاحظة |
|-------|--------|--------|--------|
| أ. آية محمد | لغة عربية وتربية إسلامية | 5 سنوات | متخصصة بالمنهج الإماراتي |
| أ. لجين أحمد | رياضيات وعلوم | 4 سنوات | أسلوب تفاعلي محبب |
| أ. سارة خالد | لغة إنجليزية | 6 سنوات | خبرة بالمناهج الدولية والإماراتية |
| أ. نورة سالم | دراسات اجتماعية | 3 سنوات | متابعة مستمرة لولي الأمر |

**الستايل:**
- Header: "تعرّف على معلمين مَجْد" (مَجْد بالـ pink)
- Subtitle: "معلمين مختارين بعناية، يحبون التدريس ويفهمون عيالكم"
- Grid: 4 أعمدة desktop، 2 tablet، 1 mobile
- كل كارد:
  - صورة دائرية (placeholder: حرف أول بـ gradient)
  - الاسم: font-black text-[#1B2D4F]
  - التخصص: text-[#F0548B] font-bold text-sm
  - الخبرة: text-[#8B6E96] text-xs
  - ملاحظة قصيرة: text-[#8B6E96] text-[13px]
- Hover: translate-y-1 + shadow
- خلفية الكارد: white مع border خفيف

**الملف:** `app/components/TeachersSection.tsx`

---

### Task 3: CTA أخير كبير قبل الـ Footer

**الوصف:** سكشن ختامي يكون آخر فرصة لإقناع ولي الأمر بالتسجيل قبل ما يمشي.

**الموقع:** بعد `StudentTestimonials` وقبل `Foot`

**المحتوى:**
- عنوان: "جاهز تبدأ رحلة ولدك نحو المَجْد؟"
- وصف قصير: "احجز حصة مجانية الحين وشوف الفرق بنفسك"
- زر كبير: "احجز حصتك المجانية" (gold bg)
- زر ثانوي: "تواصل معنا على الواتساب" (outline)

**الستايل:**
- خلفية: gradient خفيف (من white لـ rose-50) أو solid `#fef0f5`
- العنوان: text-[32px] md:text-[44px] font-black text-[#1B2D4F]
- كل شيء centered
- Padding: py-16 md:py-[100px]
- الأزرار: نفس ستايل الـ Hero buttons

**الملف:** `app/components/FinalCTA.tsx`

---

## 🟡 أولوية متوسطة

### Task 4: إرجاع سكشن "كيف تبدأ" (Steps)

**الوصف:** سكشن يوضح الخطوات البسيطة للتسجيل — يجاوب سؤال "طيب كيف أبدأ؟"

**الموقع:** بعد `PackagesSection` وقبل `GuaranteesSection`

**المحتوى (4 خطوات):**
1. سجّل بياناتك — "عبّي النموذج البسيط واختار صف ولدك"
2. اختار المواد — "حدد المواد اللي يحتاجها ولدك"
3. احجز الحصة المجانية — "جرّب قبل ما تلتزم"
4. ابدأ رحلة التفوق — "اختار باقتك وابدأ المشوار"

**الستايل:**
- نفس الـ layout السابق: steps يمين + visual وسط + steps شمال
- أو بديل أبسط: 4 كروت أفقية بأرقام كبيرة
- أيقونات: UserPlus, BookMarked, CalendarCheck, Rocket
- ألوان الأيقونات: pink, gold, navy, pink

**الملف:** `app/components/HowToStartSection.tsx` (موجود — بس محتاج يترجع في AcademyLanding2)

---

### Task 5: إضافة CTAs وسطية

**الوصف:** أزرار CTA صغيرة inline بين السكشنات عشان ما يمشي مسافة طويلة بدون فرصة تحويل.

**المواقع:**
1. بعد `WhyMajdSection` — "جرب حصة مجانية الحين"
2. بعد `GuaranteesSection` — "سجل ولدك بكل ثقة"

**الستايل:**
- مش سكشن كامل — بس div صغير centered بـ py-8
- زر واحد: pink bg, white text, rounded-full
- أو نص + زر: "مقتنع؟ [احجز حصتك المجانية]"

**التنفيذ:** ممكن يكون component واحد `InlineCTA.tsx` يستقبل النص كـ prop

---

### Task 6: ChooseYourGrade — إضافة action عند الضغط

**الوصف:** حالياً لما تضغط على صف مفيش حاجة بتحصل. محتاج يكون فيه action.

**الخيارات:**
- Option A: لما يضغط → يعمل smooth scroll لسكشن الباقات
- Option B: لما يضغط → يفتح WhatsApp مع رسالة "أبي أسجل ولدي في [الصف]"
- Option C: لما يضغط → يروح لصفحة تسجيل مع الصف محدد

**المقترح:** Option B (أسهل وأسرع conversion)

**التنفيذ:**
- حول كل grade card لـ `<a>` أو `<button>` مع `onClick`
- الـ WhatsApp link: `https://wa.me/971000000000?text=أبي أسجل ولدي في ${grade}`

---

## 🟢 أولوية لاحقة

### Task 7: Video Modal لزر "شوف كيف ندرّس"

**الوصف:** لما يضغط الزر الثانوي في الـ Hero → يفتح modal فيه فيديو YouTube.

**التنفيذ:**
- State: `showVideo` boolean
- Modal: fixed overlay مع backdrop blur
- جواه: iframe YouTube (أو video tag)
- زر X لإغلاق
- الـ modal يقفل لما يضغط بره

**الملف:** تعديل على `LiteratureReviewBanner.tsx` + component `VideoModal.tsx`

---

### Task 8: إضافة صور حقيقية

**الوصف:** استبدال الـ placeholders بصور حقيقية لما تكون جاهزة.

**الأماكن:**
- `WhyMajdSection` — 4 صور (حصة أونلاين، معلمة، جدول، تقرير)
- `TeachersSection` — صور المعلمين
- `PremiumPackagesHero` — صورة الطالب (موجودة `/student_mirror_reflection.png`)

**ملاحظة:** الصور محتاجة تكون:
- Format: WebP أو PNG
- Size: max 500KB لكل صورة
- Dimensions: حسب الـ aspect ratio المحدد في كل مكان

---

### Task 9: بانر Urgency / Scarcity

**الوصف:** عنصر يخلق إحساس بالاستعجال عشان ولي الأمر يسجل دلوقتي مش بكرة.

**الخيارات:**
- Option A: شريط sticky فوق الـ navbar: "⏰ الأماكن محدودة — سجل قبل [تاريخ]"
- Option B: Badge صغير جوا سكشن الباقات: "باقي 5 أماكن فقط"
- Option C: Countdown timer في الـ Hero أو الباقات

**المقترح:** Option A (أبسط وأوضح)

**الستايل:**
- خلفية: `#1B2D4F` أو `#FFC843`
- نص: أبيض أو navy، font-bold، text-sm
- ارتفاع: h-10 أو h-12
- يختفي لما يعمل scroll (أو يفضل ثابت)

---

### Task 10: تحسين الـ Footer

**الوصف:** الـ Footer الحالي (Foot) محتاج يتحسن ويكون فيه كل المعلومات المهمة.

**المحتوى المطلوب:**
- **عمود 1:** لوجو + وصف قصير عن مَجْد (سطرين)
- **عمود 2:** روابط سريعة (الرئيسية، البرامج، المراحل، الأسئلة، سياسة الخصوصية)
- **عمود 3:** تواصل معنا (واتساب، إيميل، إنستجرام، تويتر)
- **عمود 4:** ساعات العمل + العنوان (لو فيه)
- **أسفل:** "© 2024 مَجْد أكاديمي. جميع الحقوق محفوظة"

**الستايل:**
- خلفية: `#1B2D4F` (navy غامق)
- نص: أبيض/رمادي فاتح
- Grid: 4 أعمدة desktop، 2 tablet، 1 mobile
- أيقونات سوشيال: دوائر صغيرة بـ hover effect

---

## ملاحظات عامة:

- كل الـ components الجديدة تكون في `app/components/`
- الألوان الأساسية: `#F0548B` (pink), `#FFC843` (gold), `#1B2D4F` (navy), `#8B6E96` (muted purple)
- كل الـ inline styles (مفيش dynamic Tailwind classes)
- RTL layout
- Mobile-first responsive
- أيقونات من Lucide React
