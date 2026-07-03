import type { Metadata } from "next";

// ─── Constants ───────────────────────────────────────────────────────────────

export const BASE_URL = "https://majdacademy.ae";

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface PageMetadataConfig {
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  keywords: { ar: string[]; en: string[] };
  ogImage?: string;
  path: string;
}

export interface PageMeta extends PageMetadataConfig {
  changefreq: "daily" | "weekly" | "monthly";
  priority: number;
}

// ─── Metadata Generator ──────────────────────────────────────────────────────

export function createPageMetadata(
  config: PageMetadataConfig,
  locale: string
): Metadata {
  const lang = locale === "ar" ? "ar" : "en";
  const title = config.title[lang];
  const description = config.description[lang];
  const keywords = config.keywords[lang];
  const ogImage = config.ogImage || "https://majdedu.com/majd.png";
  const ogImageUrl = ogImage.startsWith("http") ? ogImage : `${BASE_URL}${ogImage}`;

  const pagePath = config.path === "/" ? "" : config.path;
  const canonicalUrl = `${BASE_URL}/${lang}${pagePath}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ar: `${BASE_URL}/ar${pagePath}`,
        en: `${BASE_URL}/en${pagePath}`,
      },
    },
    openGraph: {
      title,
      description,
      images: [ogImageUrl],
      locale: lang === "ar" ? "ar_AE" : "en_US",
      siteName: "Majd Academy",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

// ─── Public Pages Registry ───────────────────────────────────────────────────

export const PUBLIC_PAGES: Record<string, PageMeta> = {
  "/": {
    title: {
      ar: "أكاديمية مَجْد | لغة عربية وتربية إسلامية في الإمارات",
      en: "Majd Academy | Arabic Language & Islamic Education in UAE",
    },
    description: {
      ar: "أكاديمية مَجْد تقدم تعليم اللغة العربية والتربية الإسلامية في الإمارات من Grade 1 إلى Grade 12، مع برنامج خاص للعربية لغير الناطقين.",
      en: "Majd Academy offers Arabic language and Islamic education in the UAE from Grade 1 to Grade 12, with a special program for non-native Arabic speakers.",
    },
    keywords: {
      ar: [
        "أكاديمية لغة عربية",
        "تربية إسلامية",
        "تعليم عربي في الإمارات",
        "دروس عربية للأطفال",
        "تعليم إسلامي أونلاين",
      ],
      en: [
        "Arabic tutor UAE",
        "Islamic education UAE",
        "Arabic for children",
        "online Arabic classes",
        "UAE parents education",
      ],
    },
    path: "/",
    changefreq: "weekly",
    priority: 1.0,
  },
  "/learn-arabic": {
    title: {
      ar: "تعلم العربية | دورات عربية لغير الناطقين بها",
      en: "Learn Arabic | Arabic Language Courses for Non-Native Speakers",
    },
    description: {
      ar: "دورات تعلم اللغة العربية لغير الناطقين بها - برنامج مخصص للبالغين والمغتربين الراغبين في تعلم العربية أونلاين.",
      en: "Learn Arabic online with courses designed for adult non-native speakers and expats. Professional Arabic language tutoring tailored to your level.",
    },
    keywords: {
      ar: [
        "تعلم العربية أونلاين",
        "دورات عربية للبالغين",
        "عربية لغير الناطقين",
        "تعلم العربية للمغتربين",
      ],
      en: [
        "learn Arabic online",
        "Arabic for expats",
        "Arabic language course for adults",
        "Arabic for non-native speakers",
        "online Arabic tutoring",
      ],
    },
    path: "/learn-arabic",
    changefreq: "weekly",
    priority: 0.9,
  },
  "/about": {
    title: {
      ar: "عن أكاديمية مَجْد | من نحن",
      en: "About Majd Academy | Who We Are",
    },
    description: {
      ar: "تعرف على أكاديمية مَجْد - رؤيتنا ورسالتنا في تقديم تعليم عربي وإسلامي متميز في الإمارات.",
      en: "Learn about Majd Academy - our vision and mission to provide outstanding Arabic and Islamic education in the UAE.",
    },
    keywords: {
      ar: ["عن أكاديمية مجد", "رؤية أكاديمية مجد", "تعليم عربي"],
      en: ["about Majd Academy", "Majd Academy mission", "Arabic education UAE"],
    },
    path: "/about",
    changefreq: "monthly",
    priority: 0.7,
  },
  "/grades": {
    title: {
      ar: "المراحل الدراسية | من Grade 1 إلى Grade 12",
      en: "School Grades | Grade 1 to Grade 12",
    },
    description: {
      ar: "اكتشف برامجنا التعليمية لجميع المراحل الدراسية من الصف الأول إلى الصف الثاني عشر.",
      en: "Discover our educational programs for all school grades from Grade 1 to Grade 12.",
    },
    keywords: {
      ar: ["مراحل دراسية", "صفوف مدرسية", "تعليم عربي للأطفال"],
      en: ["school grades", "Arabic education grades", "Grade 1 to 12"],
    },
    path: "/grades",
    changefreq: "monthly",
    priority: 0.8,
  },
  "/stages": {
    title: {
      ar: "المراحل التعليمية | أكاديمية مَجْد",
      en: "Educational Stages | Majd Academy",
    },
    description: {
      ar: "تعرف على المراحل التعليمية المختلفة في أكاديمية مَجْد وكيف نخدم كل مرحلة عمرية.",
      en: "Learn about the different educational stages at Majd Academy and how we serve each age group.",
    },
    keywords: {
      ar: ["مراحل تعليمية", "مراحل عمرية", "تعليم أطفال"],
      en: ["educational stages", "age groups", "children education"],
    },
    path: "/stages",
    changefreq: "monthly",
    priority: 0.7,
  },
  "/contact": {
    title: {
      ar: "تواصل معنا | أكاديمية مَجْد",
      en: "Contact Us | Majd Academy",
    },
    description: {
      ar: "تواصل مع أكاديمية مَجْد للاستفسار عن برامجنا التعليمية والتسجيل.",
      en: "Contact Majd Academy to inquire about our educational programs and enrollment.",
    },
    keywords: {
      ar: ["تواصل مع أكاديمية مجد", "استفسار", "تسجيل"],
      en: ["contact Majd Academy", "inquiry", "enrollment"],
    },
    path: "/contact",
    changefreq: "monthly",
    priority: 0.6,
  },
  "/prices": {
    title: {
      ar: "الأسعار | أكاديمية مَجْد",
      en: "Pricing | Majd Academy",
    },
    description: {
      ar: "تعرف على أسعار وباقات أكاديمية مَجْد للتعليم العربي والإسلامي.",
      en: "View Majd Academy pricing and packages for Arabic and Islamic education.",
    },
    keywords: {
      ar: ["أسعار أكاديمية مجد", "باقات تعليمية", "رسوم دراسية"],
      en: ["Majd Academy prices", "education packages", "tuition fees"],
    },
    path: "/prices",
    changefreq: "weekly",
    priority: 0.8,
  },
  "/news": {
    title: {
      ar: "الأخبار | أكاديمية مَجْد",
      en: "News | Majd Academy",
    },
    description: {
      ar: "آخر أخبار وفعاليات أكاديمية مَجْد.",
      en: "Latest news and events from Majd Academy.",
    },
    keywords: {
      ar: ["أخبار أكاديمية مجد", "فعاليات", "مستجدات"],
      en: ["Majd Academy news", "events", "updates"],
    },
    path: "/news",
    changefreq: "daily",
    priority: 0.6,
  },
  "/subjects": {
    title: {
      ar: "المواد الدراسية | أكاديمية مَجْد",
      en: "Subjects | Majd Academy",
    },
    description: {
      ar: "اكتشف المواد الدراسية التي تقدمها أكاديمية مَجْد في اللغة العربية والتربية الإسلامية.",
      en: "Discover the subjects offered by Majd Academy in Arabic language and Islamic education.",
    },
    keywords: {
      ar: ["مواد دراسية", "لغة عربية", "تربية إسلامية", "مناهج"],
      en: ["subjects", "Arabic language", "Islamic education", "curriculum"],
    },
    path: "/subjects",
    changefreq: "monthly",
    priority: 0.7,
  },
};

// ─── Private Path Prefixes ───────────────────────────────────────────────────

export const PRIVATE_PATH_PREFIXES = [
  "/academy",
  "/login",
  "/payment",
  "/ipn",
  "/sanctum",
  "/api",
  "/register",
  "/forgot-password",
  "/dashboard",
  "/cart",
  "/checkout",
];
