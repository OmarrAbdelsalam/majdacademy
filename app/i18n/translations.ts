export type Lang = "en" | "ar";

export const t = {
  en: {
    // Navbar
    nav: {
      home: "Home",
      about: "About",
      faq: "FAQ",
      contact: "Contact Us",
      download: "Download Now",
      login: "Log in",
    },

    // Hero
    hero: {
      badge: "Sharia-Compliant · Secure Vaults",
      h1a: "Secure Your Money,",
      h1b: "Buy Gold Bars.",
      h1c: "",
      sub: "Buy certified gold & silver bars. GCT Gold is the easiest and most trusted way to protect the value of your money.",
      cta1: "Download Now",
      cta2: "Get Started",
      storeApple: "App Store",
      storeGoogle: "Google Play",
      storeAppleSub: "Download on the",
      storeGoogleSub: "Get it on",
      stats: {
        users: "15K+ Users",
        rating: "4.9 Rating",
        purity: "999.9 Purity"
      },
      ticker: [
        "Live 24K Gold Price: EGP 8,100/g",
        "Live 999 Silver Price: EGP 130/g",
        "Buy Gold Now",
        "Secure Your Wealth with GCT Gold"
      ],
      featuresGrid: {
        headline: "Why Choose GCT Gold?",
        subheadline: "We've developed investment tools that meet your aspirations and ensure the safety of your funds at every step.",
        items: [
          { title: "Flexible Liquidity", desc: "Easily liquidate your assets anytime you choose." },
          { title: "Secure Delivery", desc: "We provide fully insured delivery right to your doorstep, whenever you need it." },
          { title: "Instant Withdrawals", desc: "All your withdrawal requests are processed instantly upon request without delays." },
          { title: "Trust & Security", desc: "Trusted by many. We continuously work hard to improve our security systems to minimize any potential risks." },
          { title: "Licensed & Sharia Compliant", desc: "An officially licensed Egyptian company since 2023, fully compliant with Islamic Sharia." },
          { title: "Zero Commissions", desc: "Flexible investment starting with any amount, zero commissions, and 24/7 technical support." }
        ]
      },
      phone: {
        greeting: "Good morning",
        portfolio: "My Portfolio",
        totalValue: "Total Value",
        weekChange: "↑ 3.2% this week",
        gold: "Gold 24K",
        silver: "Silver 999",
        goldWeight: "2.5g",
        silverWeight: "50g",
        goldChange: "+1.8%",
        silverChange: "+0.5%",
        liveGold: "Gold 24K / gram",
        liveSilver: "Silver 999 / gram",
      },
    },

    // Calculator
    calc: {
      eyebrow: "Ready to make a move?",
      h2a: "Easily calculate the value of your",
      h2b: "gold and silver",
      h2c: "with the Calculator.",
      chooseMetal: "Choose Metal",
      gold: "Gold",
      silver: "Silver",
      wantTo: "You want to",
      buy: "Buy",
      sell: "Sell",
      enterAmount: "Enter Amount of Money or Weight",
      livePrice: "Live price",
      perGram: "/ gram",
      youGet: "You get",
      costs: "Costs",
      disclaimer: "* Prices are indicative. Live prices available in the app.",
      h3: "Track, Calculate, and Make",
      h3b: "Informed",
      h3c: "Gold & Silver Decisions.",
      desc: "Effortlessly calculate the value of your metals with GCT Gold's Gold & Silver Calculator. Stay updated on live market prices and make confident choices.",
      tags: ["Live 24K Gold Prices", "999 Silver Prices", "Price Alerts", "EGP Calculator"],
    },

    // How it works
    how: {
      eyebrow: "Simple Process",
      h2a: "How to Get",
      h2b: "Started?",
      steps: [
        { num: "01", title: "Download", desc: "Download the app from your preferred store to get started." },
        { num: "02", title: "Register", desc: "Create your secure account and begin your journey." },
        { num: "03", title: "Deposit Funds", desc: "Add funds to your wallet quickly and manage them securely." },
        { num: "04", title: "Manage Gold & Silver", desc: "Easily buy and track your assets through your personal Portfolio." },
      ],
    },

    // Features
    features: {
      eyebrow: "Why GCT Gold",
      h2a: "What",
      h2b: "You Get?",
      items: [
        { title: "Real-Time Price Tracking.", desc: "Stay updated with live 24K gold & 999 silver prices and set alerts for your target price.", screenLabel: "Live Prices" },
        { title: "Easy Wallet & Transactions.", desc: "Add money, invest in gold & silver, and manage your transaction history with ease.", screenLabel: "My Wallet" },        { title: "Sharia Compliant.", desc: "Our platform adheres to Islamic financial principles, ensuring all transactions are Halal.", screenLabel: "Compliance" },
        { title: "Gold Collection Option.", desc: "In-person collection is available for gold starting from 5g bars and silver starting from 500g bars, only for weights listed on the app's Purchases page.", screenLabel: "Collection" },
        { title: "Smooth, Intuitive Experience.", desc: "Enjoy a smooth, user-friendly interface for all your gold & silver transactions.", screenLabel: "Portfolio" },
      ],
    },

    // Security
    security: {
      eyebrow: "Security First",
      h2a: "Your Gold & Silver are",
      h2b: "Safe",
      h2c: "with Us.",
      p1: "Your metals are stored in secure, audited vaults with industry-leading safety standards.",
      p2: "Advanced security protocols protect both your assets and your data.",
      badges: ["Shariah Compliant", "Assay & Weights Authority"],
      stats: [
        { value: "100%", label: "Halal Certified" },
        { value: "256-bit", label: "SSL Encryption" },
        { value: "24/7", label: "Vault Monitoring" },
        { value: "ISO", label: "Certified Storage" },
      ],
    },

    // Download
    download: {
      eyebrow: "Get the App",
      h2a: "Your Gold & Silver, at Your",
      h2b: "Fingertips.",
      sub: "Your metals, always within reach. Download GCT Gold and manage your investments anytime, anywhere.",
      apple: "App Store",
      google: "Google Play",
      appleSub: "Download on the",
      googleSub: "Get it on",
      stats: [
        { val: "4.8★", sub: "App Store" },
        { val: "4.7★", sub: "Google Play" },
        { val: "100K+", sub: "Downloads" },
      ],
    },

    newArrivals: {
      new: "Newly Arrived",
      shopNow: "Shop Now",
      perfectFor: "Perfect for Gifting",
      zeroTax: "Zero Tax",
      startsFrom: "Starts from",
      addToCart: "Add to Cart",
      currency: "EGP",
      products: [
        { title: "RG 24K Gold Bar 10g", price: 6136 },
        { title: "RG 24K Gold Bar 15g", price: 9138 },
        { title: "RG 24K Gold Bar 20g", price: 12176 },
      ]
    },

    // Footer
    footer: {
      desc: "Your trusted destination to buy and sell gold & silver. Sharia-compliant and secure.",
      company: "Company",
      resources: "Resources",
      legal: "Legal",
      contact: "Contact Information",
      ourStory: "Our Story",
      faq: "FAQ",
      support: "Help & Support",
      privacy: "Privacy Policy",
      terms: "Terms of Use",
      address: "5 Golden Gate Tower, Zahraa El Maadi, Cairo, Egypt",
      phone: "+2 01124310589",
      email: "info@sabika.app",
      rights: "All rights reserved.",
    },
  },

  ar: {
    nav: {
      home: "الرئيسية",
      about: "من نحن",
      faq: "الأسئلة الشائعة",
      contact: "تواصل معنا",
      download: "حمّل التطبيق",
      login: "تسجيل دخول",
    },

    hero: {
      badge: "متوافق مع الشريعة · خزائن آمنة",
      h1a: "خليك في المضمون،",
      h1b: "اشتري سبائك دهب.",
      h1c: "",
      sub: "اشتري سبائك دهب وفضة معتمدة. GCT Gold هي الحل الأسهل والأضمن عشان تحمي قيمة ثروتك.",
      cta1: "حمّل التطبيق",
      cta2: "ابدأ الآن",
      storeApple: "App Store",
      storeGoogle: "Google Play",
      storeAppleSub: "حمّل من",
      storeGoogleSub: "احصل عليه من",
      stats: {
        users: "+15 ألف مستخدم",
        rating: "4.9 تقييم",
        purity: "نقاء 999.9"
      },
      ticker: [
        "سعر الذهب عيار 24 اليوم: 8,100 ج.م/جرام",
        "سعر الفضة عيار 999 اليوم: 130 ج.م/جرام",
        "اشتري الذهب الآن",
        "احمِ ثروتك مع GCT Gold"
      ],
      featuresGrid: {
        headline: "لماذا تختار GCT Gold؟",
        subheadline: "نوفر لك أداة استثمار موثوقة تلبي احتياجاتك وتضمن أمان ثروتك.",
        items: [
          { title: "سيولة مرنة", desc: "ينفع تفك السيولة في أي وقت." },
          { title: "توصيل لحد الباب", desc: "توصيل مؤمن ١٠٠٪ لحد باب بيتك في أي وقت تحتاجه." },
          { title: "سحب فوري", desc: "جميع طلبات السحب لدينا تُعالج على الفور بمجرد الطلب." },
          { title: "ثقة وأمان", desc: "نحن نحظى بثقة عدد كبير من الأشخاص. نعمل بجد باستمرار على تحسين مستوى نظامنا الأمني وتقليل المخاطر المحتملة." },
          { title: "مرخصة وشرعية", desc: "شركة مصرية مرخّصة رسميًا وتعمل في السوق منذ عام ٢٠٢٣، واستثمار حلال ١٠٠٪." },
          { title: "مرونة وبدون عمولات", desc: "استثمار مرن بأي مبلغ، بدون عمولات مخفية، ودعم فني مستمر." }
        ]
      },
      phone: {
        greeting: "صباح الخير",
        portfolio: "محفظتي",
        totalValue: "إجمالي القيمة",
        weekChange: "↑ 3.2% هذا الأسبوع",
        gold: "ذهب 24 قيراط",
        silver: "فضة 999",
        goldWeight: "2.5 جم",
        silverWeight: "50 جم",
        goldChange: "+1.8%",
        silverChange: "+0.5%",
        liveGold: "ذهب 24 قيراط / جم",
        liveSilver: "فضة 999 / جم",
      },
    },

    calc: {
      eyebrow: "هل أنت مستعد للشراء؟",
      h2a: "احسب قيمة",
      h2b: "ذهبك وفضتك",
      h2c: "بسهولة مع الآلة الحاسبة.",
      chooseMetal: "اختر المعدن",
      gold: "ذهب",
      silver: "فضة",
      wantTo: "تريد أن",
      buy: "تشتري",
      sell: "تبيع",
      enterAmount: "أدخل المبلغ أو الوزن",
      livePrice: "السعر الحي",
      perGram: "/ جم",
      youGet: "ستحصل على",
      costs: "التكلفة",
      disclaimer: "* الأسعار استرشادية. الأسعار الحية متاحة في التطبيق.",
      h3: "تتبّع، احسب، واتخذ قرارات",
      h3b: "مدروسة",
      h3c: "في الذهب والفضة.",
      desc: "احسب قيمة دهبك وفضتك بسهولة مع حاسبة GCT Gold. تابع الأسعار لحظة بلحظة وخد قرارك وأنت مطمن.",
      tags: ["أسعار ذهب 24 قيراط", "أسعار فضة 999", "تنبيهات الأسعار", "حاسبة جنيه"],
    },

    how: {
      eyebrow: "خطوات بسيطة",
      h2a: "كيف",
      h2b: "تبدأ؟",
      steps: [
        { num: "01", title: "حمّل التطبيق", desc: "حمّل التطبيق من متجرك المفضل للبدء." },
        { num: "02", title: "سجّل حسابك", desc: "أنشئ حسابك الآمن وابدأ رحلتك الاستثمارية." },
        { num: "03", title: "أضف رصيدك", desc: "أضف أموالاً إلى محفظتك بسرعة وأدِرها بأمان." },
        { num: "04", title: "أدِر ذهبك وفضتك", desc: "اشترِ وتتبّع أصولك بسهولة من خلال محفظتك الشخصية." },
      ],
    },

    features: {
      eyebrow: "ليه تختار GCT Gold",
      h2a: "ماذا",
      h2b: "ستحصل عليه؟",
      items: [
        { title: "تتبّع الأسعار في الوقت الحقيقي.", desc: "ابقَ على اطلاع بأسعار الذهب 24 قيراط والفضة 999 الحية، وضع تنبيهات للسعر المستهدف.", screenLabel: "الأسعار الحية" },
        { title: "محفظة ومعاملات سهلة.", desc: "أضف أموالاً، استثمر في الذهب والفضة، وأدِر سجل معاملاتك بكل سهولة.", screenLabel: "محفظتي" },
        { title: "متوافق مع الشريعة الإسلامية.", desc: "منصتنا تلتزم بمبادئ التمويل الإسلامي، مما يضمن أن جميع المعاملات حلال.", screenLabel: "الامتثال" },
        { title: "خيار استلام الذهب.", desc: "الاستلام الشخصي متاح للذهب ابتداءً من سبائك 5 جم وللفضة ابتداءً من 500 جم، للأوزان المدرجة في صفحة المشتريات.", screenLabel: "الاستلام" },
        { title: "تجربة سلسة وبديهية.", desc: "استمتع بواجهة سهلة الاستخدام لجميع معاملات الذهب والفضة.", screenLabel: "المحفظة" },
      ],
    },

    security: {
      eyebrow: "الأمان أولاً",
      h2a: "ذهبك وفضتك",
      h2b: "بأمان",
      h2c: "معنا.",
      p1: "تُخزَّن معادنك في خزائن آمنة وخاضعة للتدقيق وفق أعلى معايير السلامة في الصناعة.",
      p2: "بروتوكولات أمان متقدمة تحمي أصولك وبياناتك معاً.",
      badges: ["متوافق مع الشريعة", "هيئة المعايرة والأوزان"],
      stats: [
        { value: "100%", label: "معتمد حلال" },
        { value: "256-bit", label: "تشفير SSL" },
        { value: "24/7", label: "مراقبة الخزائن" },
        { value: "ISO", label: "تخزين معتمد" },
      ],
    },

    download: {
      eyebrow: "حمّل التطبيق",
      h2a: "ذهبك وفضتك",
      h2b: "في متناول يدك.",
      sub: "استثماراتك دايماً معاك. حمّل GCT Gold وتابع محفظتك في أي وقت وأي مكان.",
      apple: "App Store",
      google: "Google Play",
      appleSub: "حمّل من",
      googleSub: "احصل عليه من",
      stats: [
        { val: "4.8★", sub: "App Store" },
        { val: "4.7★", sub: "Google Play" },
        { val: "+100K", sub: "تحميل" },
      ],
    },

    newArrivals: {
      new: "وصل حديثاً",
      shopNow: "تسوق الآن",
      perfectFor: "مناسب للإهداء والاقتناء",
      zeroTax: "صفر ضريبة",
      startsFrom: "يبدأ من",
      addToCart: "إضافة للسلة",
      currency: "ر.س",
      products: [
        { title: "سبيكة ذهب آر جي عيار 24 بوزن 10 غرام", price: 6136 },
        { title: "سبيكة ذهب آر جي عيار 24 بوزن 15 غرام", price: 9138 },
        { title: "سبيكة ذهب آر جي عيار 24 بوزن 20 غرام", price: 12176 },
      ]
    },

    footer: {
      desc: "وجهتك الموثوقة لشراء وبيع الذهب والفضة. متوافق مع الشريعة وآمن.",
      company: "الشركة",
      resources: "الموارد",
      legal: "القانونية",
      contact: "معلومات التواصل",
      ourStory: "قصتنا",
      faq: "الأسئلة الشائعة",
      support: "المساعدة والدعم",
      privacy: "سياسة الخصوصية",
      terms: "شروط الاستخدام",
      address: "5 برج البوابة الذهبية، زهراء المعادي، القاهرة، مصر",
      phone: "+2 01124310589",
      email: "info@sabika.app",
      rights: "جميع الحقوق محفوظة.",
    },
  },
} as const;

// Use a structural type that works for both languages
export type Translations = {
  nav: { home: string; about: string; faq: string; contact: string; download: string; login: string };
  hero: {
    badge: string; h1a: string; h1b: string; h1c: string; sub: string;
    cta1: string; cta2: string; storeApple: string; storeGoogle: string;
    storeAppleSub: string; storeGoogleSub: string;
    stats: { users: string; rating: string; purity: string };
    ticker: readonly string[];
    featuresGrid: {
      headline: string;
      subheadline: string;
      items: readonly { title: string; desc: string }[];
    };
    phone: { greeting: string; portfolio: string; totalValue: string; weekChange: string;
      gold: string; silver: string; goldWeight: string; silverWeight: string;
      goldChange: string; silverChange: string; liveGold: string; liveSilver: string };
  };
  calc: {
    eyebrow: string; h2a: string; h2b: string; h2c: string; chooseMetal: string;
    gold: string; silver: string; wantTo: string; buy: string; sell: string;
    enterAmount: string; livePrice: string; perGram: string; youGet: string;
    costs: string; disclaimer: string; h3: string; h3b: string; h3c: string;
    desc: string; tags: readonly string[];
  };
  how: {
    eyebrow: string; h2a: string; h2b: string;
    steps: readonly { num: string; title: string; desc: string }[];
  };
  features: {
    eyebrow: string; h2a: string; h2b: string;
    items: readonly { title: string; desc: string; screenLabel: string }[];
  };
  security: {
    eyebrow: string; h2a: string; h2b: string; h2c: string;
    p1: string; p2: string; badges: readonly string[];
    stats: readonly { value: string; label: string }[];
  };
  download: {
    eyebrow: string; h2a: string; h2b: string; sub: string;
    apple: string; google: string; appleSub: string; googleSub: string;
    stats: readonly { val: string; sub: string }[];
  };
  newArrivals: {
    new: string;
    shopNow: string;
    perfectFor: string;
    zeroTax: string;
    startsFrom: string;
    addToCart: string;
    currency: string;
    products: readonly { title: string; price: number }[];
  };
  footer: {
    desc: string; company: string; resources: string; legal: string; contact: string;
    ourStory: string; faq: string; support: string; privacy: string; terms: string;
    address: string; phone: string; email: string; rights: string;
  };
};
