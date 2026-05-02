# 📋 Golden Circle — Prices Page Tasks

> **الهدف:** بناء صفحة أسعار شاملة مستوحاة من [market.isagha.com/prices](https://market.isagha.com/prices) ولكن بنفس ستايل الديزاين الخاص بينا (الـ Landing Page الحالية).

---

## 🎨 Design System Reference (ستايلنا الحالي)

يجب الالتزام بنفس الديزاين سيستم الموجود في اللاندنج:

| Token | Value | Usage |
|-------|-------|-------|
| `--gold` | `#C9A84C` | Primary gold accent |
| `--gold-light` | `#E8C96A` | Gold highlights |
| Gold Gradient | `linear-gradient(135deg, #C9A84C, #E8C96A, #C9A84C)` | Buttons, accents |
| Dark BG | `#0A0A0A` | Main dark background |
| Dark Card | `#111111` | Card backgrounds |
| Dark Border | `#1E1E1E` | Borders on dark |
| Light BG | `#FDFBF5` | Light section background (hero-style) |
| Font | `var(--font-tajawal)` | Arabic + English |
| Scrollbar | `#E9C237` | Gold scrollbar thumb |
| Button Style | `btn-primary` class | Gold gradient buttons |
| Card Radius | `rounded-[28px]` to `rounded-2xl` | Consistent radius |
| Animations | `framer-motion` | fadeInUp, float, whileInView |
| Noise Texture | SVG feTurbulence overlay | Premium texture feel |
| Grid Pattern | CSS background-image grid lines | Subtle background |

---

## 📄 Page Structure Overview

الصفحة هتتكون من الأقسام دي (من فوق لتحت):

```
┌────────────────────────────────────────┐
│  Navbar (موجود — إعادة استخدام)          │
├────────────────────────────────────────┤
│  1. Prices Hero — أسعار الذهب والفضة      │
│     ├─ Tabs: ذهب | فضة | عملات ذهبية     │
│     ├─ جدول الأسعار (شراء/بيع/تغيير)     │
│     └─ آخر تحديث + مؤشر live             │
├────────────────────────────────────────┤
│  2. Gold Calculator — حاسبة الذهب        │
│     └─ ادخل الوزن → احسب السعر           │
├────────────────────────────────────────┤
│  3. Products Showcase — منتجاتنا         │
│     ├─ سبائك ذهب                        │
│     └─ سبائك فضة                        │
├────────────────────────────────────────┤
│  4. About Us — مين احنا                  │
│     ├─ نبذة عن الشركة                   │
│     ├─ فروعنا                           │
│     └─ شهادات الثقة / Trust Badges       │
├────────────────────────────────────────┤
│  5. Latest News — آخر الأخبار            │
│     └─ أحدث المقالات والأخبار            │
├────────────────────────────────────────┤
│  Footer (موجود — إعادة استخدام)          │
│  WhatsApp Button (موجود)                │
└────────────────────────────────────────┘
```

---

## 📁 File Structure (الملفات المطلوب إنشاؤها)

```
app/
├── [locale]/
│   └── prices/
│       └── page.tsx              ← تعديل (تجميع كل الأقسام)
└── components/
    ├── prices/
    │   ├── PricesHero.tsx        ← جديد — القسم الرئيسي للأسعار
    │   ├── PriceTable.tsx        ← جديد — جدول الأسعار مع tabs
    │   └── GoldCalculator.tsx    ← جديد — حاسبة الذهب
    ├── ProductsShowcase.tsx      ← جديد — عرض المنتجات (مختلف عن السلايدر)
    ├── AboutUs.tsx               ← جديد — مين احنا
    └── LatestNews.tsx            ← جديد — آخر الأخبار
```

---

## ✅ Task 1: Prices Hero Section (قسم الأسعار الرئيسي)

### الوصف
بناء القسم الأول في الصفحة — جدول أسعار الذهب والفضة الحية مع tabs للتبديل بينهم.

### الملفات
- `app/components/prices/PricesHero.tsx`
- `app/components/prices/PriceTable.tsx`

### الديزاين
- **Background:** Light section مثل الـ Hero (`#FDFBF5`) مع نفس الـ Grid Pattern و Noise Texture
- **Gold glows:** نفس الـ radial-gradient blurs الموجودة في الـ Hero
- **Title:** عنوان كبير bold مع gold accent — "أسعار الذهب والفضة اليوم"
- **Live indicator:** نقطة خضراء متحركة (pulse) بجانب "تحديث مباشر"
- **Tabs:** 3 tabs (ذهب | فضة | عملات ذهبية)
  - Tab نشط: `bg-[#1a1a1a] text-white rounded-full`
  - Tab عادي: `text-[#777] hover:text-[#1a1a1a]`

### جدول الأسعار

| Column | Arabic | English |
|--------|--------|---------|
| العيار | Caliber | 24K / 21K / 18K |
| سعر البيع | Sell Price | من الـ API |
| سعر الشراء | Buy Price | من الـ API |
| التغيير | Change | فرق السعر عن أمس |

- **Card style:** `bg-white rounded-[28px] border border-[#f0f0f0] shadow-sm`
- **Price text:** `font-extrabold text-[#1a1a1a]` مع `text-[#C9A84C]` للـ currency
- **Change indicator:** أخضر `↑` للارتفاع، أحمر `↓` للانخفاض
- **Animation:** `framer-motion` — `whileInView` fadeInUp لكل صف

### API Endpoint
```
GET /api/current-prices
```
Response يحتوي على: `buy_24`, `buy_21`, `buy_18`, `silver_buy`, إلخ

### Subtasks
- [x] 1.1 إنشاء `PricesHero.tsx` — الـ wrapper مع background و title
- [x] 1.2 إنشاء `PriceTable.tsx` — جدول الأسعار مع tab switching
- [x] 1.3 ربط الـ API — استخدام `getCurrentPrices()` من `lib/api.ts`
- [x] 1.4 إضافة auto-refresh كل 30 ثانية
- [x] 1.5 إضافة skeleton loading state
- [x] 1.6 إضافة stale indicator عند فشل التحديث
- [x] 1.7 تصميم responsive — mobile-first

---

## ✅ Task 2: Gold Calculator (حاسبة الذهب)

### الوصف
أداة حساب سعر الذهب بناءً على الوزن والعيار — المستخدم يدخل الوزن ويختار العيار ويشوف السعر.

### الملف
- `app/components/prices/GoldCalculator.tsx`

### الديزاين
- **Background:** Dark section (`#0A0A0A`) مع gold glow من فوق (نفس ستايل `TrustStats`)
- **Card:** `bg-[#111111] rounded-[28px] border border-[#1E1E1E]` — glassmorphism
- **Input:** Dark input field مع gold border on focus
- **Select:** Karat selector (24K / 21K / 18K / فضة)
- **Result:** السعر يظهر بـ gold gradient text كبير + animation عند التغيير
- **Button:** `btn-primary` style — "احسب السعر"

### الحساب
```
السعر = الوزن (جرام) × سعر الجرام للعيار المختار
```

### Subtasks
- [x] 2.1 إنشاء `GoldCalculator.tsx`
- [x] 2.2 حقل الوزن (number input) مع validation
- [x] 2.3 اختيار العيار (radio buttons أو select)
- [x] 2.4 عرض النتيجة بـ animated counter
- [x] 2.5 ربط بالأسعار الحية من الـ API
- [x] 2.6 تصميم responsive

---

## ✅ Task 3: Products Showcase (منتجاتنا)

### الوصف
عرض المنتجات المتاحة (سبائك ذهب + فضة) بشكل grid cards — مشابه لقسم المنتجات في اللاندنج ولكن بـ layout مختلف.

### الملف
- `app/components/ProductsShowcase.tsx`

### الديزاين
- **Background:** White section مع gold gradient banner في الأعلى (مثل `ProductsSlider`)
- **Section Title:** "منتجاتنا" / "Our Products" — centered, bold
- **Cards Grid:** 
  - Desktop: 4 columns
  - Tablet: 2 columns  
  - Mobile: 1 column (أو horizontal scroll)
- **Card Design:** نفس ستايل الـ ProductsSlider cards:
  - `bg-white rounded-[28px] border border-gray-100`
  - صورة المنتج في الأعلى مع `mix-blend-multiply`
  - اسم المنتج + الوزن
  - السعر بـ bold مع EGP/ج.م
  - زر "اشتر الآن" أسود rounded
  - Hover effect: `shadow-[0_12px_25px_rgba(0,0,0,0.04)] -translate-y-1`

### API Endpoints
```
GET /api/products-live?metal_type=gold
GET /api/products-live?metal_type=silver
```

### Subtasks
- [x] 3.1 إنشاء `ProductsShowcase.tsx`
- [x] 3.2 جلب المنتجات من الـ API (ذهب + فضة)
- [x] 3.3 تصميم الـ product card
- [x] 3.4 إضافة tab filter (كل المنتجات / ذهب / فضة)
- [x] 3.5 إضافة product popup عند الضغط (إعادة استخدام `ProductPopup` الموجود)
- [x] 3.6 Skeleton loading + empty state
- [x] 3.7 "عرض المزيد" button

---

## ✅ Task 4: About Us Section (مين احنا)

### الوصف
قسم تعريفي عن الشركة — من نحن، فروعنا، ولماذا نحن.

### الملف
- `app/components/AboutUs.tsx`

### الديزاين
- **Background:** Dark section (`#0A0A0A`) — نفس ستايل الـ TrustStats
- **Layout:** Two columns (Desktop) / stacked (Mobile)
  - يسار: نص تعريفي + badges
  - يمين: صورة أو illustration

### المحتوى
```
العربي:
  العنوان: "عن جولدن سيركل"
  الوصف: "منصة مرخصة ومتوافقة مع الشريعة الإسلامية للاستثمار في الذهب والفضة. 
          نوفر لك سبائك وجنيهات ذهبية وفضية بأسعار تنافسية وتوصيل لباب بيتك."

English:
  Title: "About Golden Circle"
  Description: "A licensed, Sharia-compliant platform for gold and silver investment. 
               We offer gold and silver bars and coins at competitive prices with doorstep delivery."
```

### Trust Badges (3 عناصر)
| Badge | Arabic | English |
|-------|--------|---------|
| 🏛️ مرخص | مرخص ومعتمد | Licensed & Certified |
| ☪️ شرعي | متوافق مع الشريعة | Sharia Compliant |
| 🚚 توصيل | توصيل لباب البيت | Doorstep Delivery |

### الفروع
عرض الفروع الـ 3 (مصر الجديدة، طنطا، شبين الكوم) في cards صغيرة:
- `bg-[#111111] rounded-2xl border border-[#1E1E1E]`
- أيقونة location + اسم الفرع + المدينة
- Animation: stagger fadeInUp

### API Endpoint
```
GET /api/branches        ← لجلب الفروع
GET /api/pages/about     ← لجلب نص "من نحن" (اختياري)
```

### Subtasks
- [x] 4.1 إنشاء `AboutUs.tsx`
- [x] 4.2 تصميم الـ hero text section
- [x] 4.3 تصميم الـ trust badges
- [x] 4.4 عرض الفروع من الـ API
- [x] 4.5 إضافة animations مع `framer-motion`
- [x] 4.6 تصميم responsive

---

## ✅ Task 5: Latest News Section (آخر الأخبار)

### الوصف
عرض آخر الأخبار والمقالات المتعلقة بسوق الذهب — مشابه لقسم الأخبار في isagha.

### الملف
- `app/components/LatestNews.tsx`

### الديزاين
- **Background:** Light section (`#FDFBF5` أو `white`)
- **Section Title:** "آخر الأخبار" / "Latest News"
- **Cards Layout:**
  - Desktop: 3 columns grid
  - Mobile: horizontal scroll أو stacked
- **Card Design:**
  - `bg-white rounded-2xl border border-[#f0f0f0] overflow-hidden`
  - صورة في الأعلى (16:9 ratio)
  - العنوان (2 lines max, truncated)
  - التاريخ بلون `text-[#999]`
  - Hover: subtle lift + shadow

### API Endpoint
```
GET /api/news            ← قائمة الأخبار
GET /api/fixedNews       ← الأخبار المثبتة
```

### Subtasks
- [x] 5.1 إنشاء `LatestNews.tsx`
- [x] 5.2 جلب الأخبار من الـ API
- [x] 5.3 تصميم الـ news card
- [x] 5.4 تحديد عدد الأخبار المعروضة (6 مثلاً)
- [x] 5.5 Skeleton loading
- [x] 5.6 "عرض المزيد" button (link لصفحة أخبار مستقبلية)

---

## ✅ Task 6: Page Assembly & Routing (تجميع الصفحة)

### الوصف
تعديل ملف `app/[locale]/prices/page.tsx` لتجميع كل الأقسام.

### الملف
- `app/[locale]/prices/page.tsx` (تعديل)

### الهيكل النهائي
```tsx
import Navbar from "../../components/Navbar";
import PricesHero from "../../components/prices/PricesHero";
import GoldCalculator from "../../components/prices/GoldCalculator";
import ProductsShowcase from "../../components/ProductsShowcase";
import AboutUs from "../../components/AboutUs";
import LatestNews from "../../components/LatestNews";
import Footer from "../../components/Footer";
import WhatsAppButton from "../../components/WhatsAppButton";

export default function PricesPage() {
  return (
    <>
      <Navbar />
      <main>
        <PricesHero />
        <GoldCalculator />
        <ProductsShowcase />
        <AboutUs />
        <LatestNews />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
```

### Subtasks
- [x] 6.1 تعديل `prices/page.tsx` — import كل الـ components
- [x] 6.2 التأكد من الـ routing شغال (`/ar/prices` و `/en/prices`)
- [x] 6.3 إضافة link في الـ Navbar للصفحة الجديدة
- [x] 6.4 اختبار التحول بين اللغات AR/EN
- [x] 6.5 اختبار responsive على كل الأجهزة

---

## ✅ Task 7: SEO & Meta Tags

### الوصف
إضافة meta tags و SEO optimization للصفحة.

### Subtasks
- [x] 7.1 إضافة `metadata` export في `prices/page.tsx`:
  ```tsx
  export const metadata = {
    title: "أسعار الذهب والفضة اليوم | Golden Circle",
    description: "تحديث مباشر لأسعار الذهب عيار 24 و21 و18 وأسعار الفضة في مصر بالجنيه المصري",
  };
  ```
- [x] 7.2 التأكد من `h1` واحد فقط في الصفحة
- [x] 7.3 إضافة `alt` tags لكل الصور
- [x] 7.4 إضافة `aria-label` للعناصر التفاعلية

---

## 🔧 ملاحظات تقنية

### APIs المستخدمة
| API | Usage |
|-----|-------|
| `GET /api/current-prices` | أسعار الذهب والفضة الحية |
| `GET /api/products-live?metal_type=gold` | منتجات الذهب |
| `GET /api/products-live?metal_type=silver` | منتجات الفضة |
| `GET /api/branches` | الفروع |
| `GET /api/news` | الأخبار |
| `GET /api/fixedNews` | الأخبار المثبتة |
| `GET /api/pages/about` | صفحة من نحن |

### Bilingual Support
كل الـ components لازم تدعم AR/EN باستخدام:
```tsx
const { isRTL, lang } = useLang();
```

### Reusable Components (الموجود حالياً)
- ✅ `Navbar` — إعادة استخدام كما هو
- ✅ `Footer` — إعادة استخدام كما هو
- ✅ `WhatsAppButton` — إعادة استخدام كما هو
- ✅ `ProductPopup` — إعادة استخدام من `ProductsSlider.tsx`

### Design Consistency Checklist
- [ ] نفس الـ color palette (gold + dark)
- [ ] نفس الـ border-radius values
- [ ] نفس الـ shadow styles
- [ ] نفس الـ font weights و sizes
- [ ] نفس الـ animation patterns (framer-motion)
- [ ] نفس الـ noise texture overlay
- [ ] نفس الـ responsive breakpoints
- [ ] نفس الـ scrollbar styling

---

## 📊 Priority Order (ترتيب التنفيذ)

| # | Task | Priority | Estimated Time |
|---|------|----------|---------------|
| 1 | Prices Hero + Table | 🔴 عالي | 2-3 ساعات |
| 2 | Gold Calculator | 🟡 متوسط | 1-2 ساعة |
| 3 | Products Showcase | 🔴 عالي | 2-3 ساعات |
| 4 | About Us | 🟡 متوسط | 1-2 ساعة |
| 5 | Latest News | 🟢 منخفض | 1-2 ساعة |
| 6 | Page Assembly | 🔴 عالي | 30 دقيقة |
| 7 | SEO & Meta | 🟢 منخفض | 30 دقيقة |

**الإجمالي المتوقع: ~8-13 ساعة عمل**

---

## 🎯 Next.js Custom SEO & AEO Plugin Tasks (تحويل الكود لـ SEO Engine)

بناءً على خطة الـ SEO & AEO المعمارية، تم تقسيم العمل لمهام (Tasks) صغيرة وقابلة للتنفيذ تدريجياً لضمان بناء "بلوجن" مدمج جوة الكود (Native Next.js SEO):

### ✅ Task 1: Dynamic Meta Data Engine
- [ ] إعداد `Metadata` الثابتة في `app/layout.tsx` (Title templates, Description, OpenGraph, Twitter Cards).
- [ ] إعداد `generateMetadata` في الصفحات الرئيسية (`app/[locale]/page.tsx` و `app/[locale]/prices/page.tsx`).
- [ ] ربط الـ Meta Tags بتغيير اللغات (i18n) مع استخدام `alternates.languages` للـ hreflang.

### ✅ Task 2: Automated XML Sitemaps (`sitemap.ts`)
- [ ] إنشاء ملف `app/sitemap.ts`.
- [ ] توليد مسارات الـ Static Routes (الرئيسية، الأسعار، الفروع).
- [ ] توليد مسارات الـ Dynamic Routes من الـ API (لو في صفحات منفصلة للمنتجات أو الأخبار).
- [ ] تحديد الـ `priority` والـ `changeFrequency` لكل مسار.

### ✅ Task 3: Automated Robots.txt (`robots.ts`)
- [ ] إنشاء ملف `app/robots.ts`.
- [ ] السماح بـ `Allow` لكل الـ Bots الأساسية (جوجل، بينج، وعناكب الـ AI زي GPTBot).
- [ ] منع `Disallow` للـ APIs أو الصفحات الخاصة لتوفير الـ Crawl Budget.
- [ ] ربط مسار الـ `sitemap.xml` داخل الملف.

### ✅ Task 4: Structured Data / JSON-LD Injector (AEO)
- [ ] إنشاء Component عام باسم `SchemaMarkup.tsx` يقبل تمرير الـ JSON.
- [ ] حقن سكيما `Organization` و `LocalBusiness` في الـ Layout أو الـ Footer.
- [ ] حقن سكيما `FAQPage` في الـ FAQ Component (مهم جداً لمحركات الـ AI).
- [ ] حقن سكيما `Review` في الـ TrustStats / Reviews section.
- [ ] حقن سكيما `Product` في صفحات عرض الذهب لربط السعر المباشر بالبحث.

### ✅ Task 5: Dynamic Breadcrumbs & Redirection
- [ ] إنشاء Component `<Breadcrumbs />` يقرأ الـ URL ويولد مسار التصفح.
- [ ] دمج سكيما `BreadcrumbList` JSON-LD داخل الـ Component.
- [ ] ضبط الـ Redirects الأساسية في `next.config.ts` أو إنشاء Custom 404 Page تدعم الـ AEO لتوجيه الزوار لروابط مفيدة بدل فقدانهم.

### ✅ Task 6: Core Web Vitals & Performance (أساسي للتصدر)
- [ ] التأكد من أن جميع الصور تستخدم `next/image` مع `priority` للصور اللي فوق الـ Fold (LCP Optimization).
- [ ] تصغير خطوط الـ CSS والـ JS وتفعيل الـ Gzip/Brotli compression (Next.js بيعمل جزء كبير منها، بس محتاجين نراجع).
- [ ] تقليل الـ Cumulative Layout Shift (CLS) عن طريق إعطاء أبعاد ثابتة للـ Skeletons وقت التحميل.

### ✅ Task 7: Content Architecture (التفوق على المنافسين)
- [ ] تجهيز قسم Blog / الأخبار بمقالات تجيب على أسئلة المستخدمين (Long-tail keywords) زي: "كيفية الاستثمار في الذهب"، "توقعات أسعار الذهب".
- [ ] بناء Internal Linking قوي بين المقالات وصفحات شراء المنتجات.
- [ ] تطبيق مبادئ E-E-A-T (إضافة صفحة المؤلفين، المصادر، وتوثيق الثقة).
