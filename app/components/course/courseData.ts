export interface CourseData {
  slug: string;
  ar: CourseDetails;
  en: CourseDetails;
  seo: {
    ar: { title: string; description: string; keywords: string };
    en: { title: string; description: string; keywords: string };
  };
}

export interface CourseDetails {
  title: string;
  subtitle: string;
  intro: string;
  details: string[];
  featuresList: string[];
  whatYouWillLearn: string[];
  expectedOutcomes: string[];
  conclusion: string;
  image: string;
  features: string[];
  price?: string;
  period?: string;
}

export const coursesData: CourseData[] = [
  {
    slug: "arab-kids-abroad",
    seo: {
      ar: {
        title: "دورة تأسيس لغة عربية للأطفال في الخارج | مَجْد أكاديمي",
        description: "تعلم اللغة العربية للأطفال أونلاين عبر دروس ممتعة تساعد أطفال العرب في المهجر على الحفاظ على لغتهم الأم وتعلم القراءة والكتابة والمحادثة بطلاقة.",
        keywords: "تعلم اللغة العربية للأطفال, دورة لغة عربية للأطفال, مدرس لغة عربية أونلاين, تأسيس لغة عربية للأطفال, الحفاظ على اللغة الأم, تعلم العربية في الخارج"
      },
      en: {
        title: "Learn Arabic for Arab Kids Abroad | Majd Academy",
        description: "Online Arabic classes for kids. Help your children abroad maintain their mother tongue, learn reading, writing, and speak Arabic fluently.",
        keywords: "learn arabic for kids, online arabic tutor, arabic course for kids, native arabic classes, arab kids abroad, learn speaking arabic"
      }
    },
    ar: {
      title: "العربية لأطفال العرب في الخارج",
      subtitle: "لأن لغتهم هي هويتهم.. دورة مخصصة للحفاظ على اللغة الأم وتعلم القراءة والكتابة.",
      intro: "هل يتردد طفلك عند التحدث بالعربية؟ تقدم منصة مَجْد أكاديمي دورة لغة عربية للأطفال مصممة خصيصاً لأبنائنا في المهجر، لتمنحهم طريقة ممتعة وتفاعلية لتأسيس اللغة من الصفر بطلاقة وثقة.",
      details: [
        "نعلم أن توفير بيئة تتحدث العربية بالكامل في الخارج هو تحدٍ حقيقي. مع الوقت، قد تلاحظ أن طفلك يلجأ للغة الأجنبية للتعبير عن نفسه، مما يخلق فجوة في تواصله مع عائلته الممتدة وجذوره الثقافية.",
        "في مَجْد أكاديمي، لا نقدم مجرد \"دروس لغة عربية\" تقليدية. نحن نقدم تجربة لغوية تبني جسراً من الثقة. نعتمد على استراتيجيات التأسيس الصحيح التي تربط الطفل بمواقف يومية مألوفة، لتصبح العربية لغة قريبة لقلبه ولسانه، ويتحول تعثر الكلمات إلى محادثة سلسة."
      ],
      featuresList: [
        "شرح تفاعلي بالصور والألعاب يناسب عقلية الطفل المعتاد على التعليم الأجنبي.",
        "مدرسون محترفون لغتهم الأم هي العربية (Native Speakers) ومدربون للتعامل مع الأطفال في الخارج.",
        "تبسيط القواعد النحوية وتحويلها من قواعد جافة إلى ممارسة يومية.",
        "تدريبات مكثفة على نطق مخارج الحروف الصحيحة التي يصعب تعلمها في الخارج.",
        "متابعة دقيقة وتقارير دورية لأولياء الأمور لقياس التطور الملحوظ."
      ],
      whatYouWillLearn: [
        "إتقان القراءة والكتابة العربية من الصفر حتى تكوين الجمل.",
        "بناء حصيلة لغوية غنية تمكن الطفل من التعبير عن احتياجاته اليومية.",
        "التحدث بطلاقة وبدون خجل مع الأهل والأقارب في الوطن العربي.",
        "الارتباط العميق بالهوية والقيم والعادات العربية الأصيلة."
      ],
      expectedOutcomes: [
        "طفل فخور بلغته يتحدثها بثقة ووضوح أمام الجميع.",
        "اختفاء التردد واستبدال الكلمات الأجنبية بمفردات عربية صحيحة.",
        "سهولة قراءة القصص والكتب العربية المخصصة لعمره.",
        "جاهزية كاملة للاندماج في أي مجتمع عربي عند السفر أو الزيارة."
      ],
      conclusion: "لا تترك لغة طفلك الأم تضيع وسط زحام اللغات الأجنبية. الاستثمار في لغة طفلك اليوم هو استثمار في هويته مدى الحياة. احجز حصتك التجريبية الآن في مَجْد أكاديمي وابدأ رحلة التأسيس الممتعة!",
      image: "/icon1.webp",
      features: [
        "من سن 5 إلى 15 عاماً",
        "تأسيس لغة عربية من الصفر",
        "تقييم مستمر لمستوى الطفل",
        "حصص أونلاين تفاعلية 100%"
      ],
    },
    en: {
      title: "Arabic for Arab Kids Abroad",
      subtitle: "Because their language is their identity. A dedicated course to maintain the mother tongue.",
      intro: "Does your child hesitate to speak Arabic? Majd Academy offers an online Arabic course tailored specifically for our children abroad, providing a fun and interactive way to build language skills from scratch with confidence.",
      details: [
        "We know that providing an all-Arabic speaking environment abroad is a real challenge. Over time, you may notice your child resorting to a foreign language to express themselves, creating a gap in their connection with extended family and cultural roots.",
        "At Majd Academy, we don't just offer traditional 'Arabic classes'. We provide a linguistic experience that builds a bridge of confidence. We rely on foundational strategies that connect the child to familiar daily situations, making Arabic close to their heart and turning word stumbling into smooth conversation."
      ],
      featuresList: [
        "Interactive explanation using images and games suited for a child accustomed to foreign education.",
        "Professional native Arabic tutors specialized in teaching kids living abroad.",
        "Simplifying grammar and turning it from dry rules into daily practice.",
        "Intensive training on the correct pronunciation of Arabic sounds.",
        "Close follow-up and regular reports for parents to measure noticeable progress."
      ],
      whatYouWillLearn: [
        "Mastering Arabic reading and writing from scratch to forming sentences.",
        "Building a rich vocabulary enabling the child to express daily needs.",
        "Speaking fluently and without shyness with relatives in the Arab world.",
        "A deep connection to authentic Arab identity, values, and customs."
      ],
      expectedOutcomes: [
        "A child proud of their language, speaking it confidently and clearly.",
        "Disappearance of hesitation and replacing foreign words with correct Arabic vocabulary.",
        "Ease of reading Arabic stories and books suitable for their age.",
        "Complete readiness to integrate into any Arab community when traveling."
      ],
      conclusion: "Don't let your child's mother tongue get lost amid foreign languages. Investing in your child's language today is an investment in their lifelong identity. Book your trial class now at Majd Academy and start the joyful foundational journey!",
      image: "/icon1.webp",
      features: [
        "Ages 5 to 15 years",
        "Learning Arabic from scratch",
        "Continuous level assessment",
        "100% Interactive online classes"
      ],
    },
  },
  {
    slug: "expat-kids",
    seo: {
      ar: {
        title: "دروس لغة عربية لغير الناطقين بها للمدارس الدولية | مَجْد أكاديمي",
        description: "دورة تقوية اللغة العربية للأطفال الأجانب والمقيمين. نساعد طفلك على اجتياز مناهج المدارس الدولية وتعلم العربية للمبتدئين بكل سهولة.",
        keywords: "دروس لغة عربية لغير الناطقين بها, دورة لغة عربية للاجانب, تقوية لغة عربية للمدارس الدولية, مدرس عربي في الامارات, تعلم العربية للمبتدئين"
      },
      en: {
        title: "Arabic Classes for Expat Kids & Non-Natives | Majd Academy",
        description: "Boost your child's Arabic school grades in the UAE. Specialized Arabic classes for non-native kids focusing on school curriculum and daily conversation.",
        keywords: "arabic classes for non natives, learn arabic uae, arabic tutor for expat kids, school arabic support, beginners arabic course"
      }
    },
    ar: {
      title: "العربية للأطفال الأجانب والمقيمين",
      subtitle: "الحل الأمثل لتخطي تحديات منهج المدرسة الدولية وتعلم التواصل اليومي بثقة.",
      intro: "هل يواجه طفلك صعوبة في مادة اللغة العربية في مدرسته داخل الإمارات أو دول الخليج؟ منصة مَجْد أكاديمي تقدم دورة تقوية لغة عربية لغير الناطقين بها، مصممة خصيصاً لمساعدة طفلك على التفوق الأكاديمي والتأقلم بثقة.",
      details: [
        "نعلم أن تعلم اللغة العربية كلفة ثانية يبدو أمراً شاقاً للطفل، وغالباً ما تتحول أوقات الواجبات المدرسية إلى ضغط يومي يرهق الآباء والأبناء. هذا التراجع في المادة يؤثر سلباً على ثقة الطفل بنفسه وسط زملائه.",
        "الحل يكمن في التبسيط التدريجي. نحن نبدأ بكسر حاجز الخوف من اللغة عبر منهجية تركز على الاستماع والمحادثة في المواقف اليومية. مدرسونا المتخصصون يساعدون الطالب على هضم المنهج المدرسي بأسلوب ممتع يحول اللغة العربية من \"مادة معقدة\" إلى \"مهارة ممتعة\"."
      ],
      featuresList: [
        "شرح تفاعلي مبسط يطابق مستوى المبتدئين تماماً بدون أي تعقيد.",
        "دعم مباشر في الواجبات المدرسية وتسهيل فهم المصطلحات الصعبة.",
        "التدريب المكثف على الاستماع والمحادثة لبناء الثقة في التحدث السريع.",
        "نخبة من المعلمين المحترفين (Native Speakers) المتخصصين في تعليم لغير الناطقين بها بأسلوب مرح.",
        "تقارير مستمرة لتوضيح قفزات التطور في مستوى الطفل الأكاديمي."
      ],
      whatYouWillLearn: [
        "التحدث بثقة في المواقف اليومية الأساسية (التحية، التعارف، المدرسة).",
        "قراءة الكلمات وتكوين الجمل البسيطة بشكل صحيح.",
        "الاستيعاب السريع للدروس المدرسية ورفع معدل درجات مادة اللغة العربية.",
        "اكتساب مفردات ثقافية واجتماعية تساعده على الاندماج في المجتمع المحلي."
      ],
      expectedOutcomes: [
        "تجاوز كابوس الواجبات المدرسية بحماس واعتماد على النفس.",
        "تحسن ملحوظ ومثبت في درجات وتقييمات المادة بالمدرسة.",
        "قدرة الطفل على بدء محادثات عربية قصيرة بثقة خارج المنزل.",
        "بناء أساس لغوي صلب يجعله مستعداً للمراحل الدراسية المتقدمة بسلاسة."
      ],
      conclusion: "التعلم يزدهر عندما يتحول من واجب ثقيل إلى اكتشاف ممتع! امنح طفلك التفوق في مدرسته والراحة في مجتمعه. انضموا إلى مَجْد أكاديمي الآن واحجزوا خطة الدعم المثالية لطفلك.",
      image: "/icon2.webp",
      features: [
        "دعم المناهج المدرسية الدولية",
        "معلمون متخصصون لغير الناطقين",
        "جداول مرنة تناسب المدارس",
        "التركيز على المحادثة والاستماع"
      ],
    },
    en: {
      title: "Arabic for Expat Kids",
      subtitle: "The optimal solution to overcome school curriculum challenges and learn daily communication.",
      intro: "Does your child struggle with Arabic as a second language at their school in the UAE or Gulf? Majd Academy offers specialized Arabic classes for non-native kids, designed to help them excel academically and adapt with confidence.",
      details: [
        "We know that learning Arabic as a second language can seem daunting to a child, and homework time often turns into a daily stress for both parents and kids. This struggle can negatively impact a child's confidence among their peers.",
        "The solution lies in gradual simplification. We begin by breaking the fear barrier through a methodology that focuses on listening and conversational daily situations. Our specialized tutors help the student digest the school curriculum in a fun way, turning Arabic from a 'complex subject' into an 'enjoyable skill'."
      ],
      featuresList: [
        "Simplified interactive explanations perfectly matched for absolute beginners.",
        "Direct support with school homework and clarifying difficult terms.",
        "Intensive training in listening and speaking to build conversational confidence.",
        "Elite professional native Arabic tutors experienced in teaching non-native children in a fun way.",
        "Continuous reports highlighting the child's academic leaps and progress."
      ],
      whatYouWillLearn: [
        "Speaking confidently in basic daily situations (greetings, introductions, school).",
        "Reading words and forming simple sentences correctly.",
        "Quickly grasping school lessons and boosting Arabic subject grades.",
        "Acquiring cultural and social vocabulary to help integrate into the local community."
      ],
      expectedOutcomes: [
        "Overcoming the homework nightmare with enthusiasm and self-reliance.",
        "Noticeable and proven improvement in school grades and assessments.",
        "The child's ability to initiate short Arabic conversations confidently outside the home.",
        "Building a solid linguistic foundation, making them ready for advanced grades."
      ],
      conclusion: "Learning flourishes when it transforms from a heavy chore into an enjoyable discovery! Give your child academic excellence and comfort in their community. Join Majd Academy now and book the perfect support plan for your child.",
      image: "/icon2.webp",
      features: [
        "International school curriculum support",
        "Specialized non-native tutors",
        "Flexible school-friendly schedules",
        "Focus on listening & speaking"
      ],
    },
  },
  {
    slug: "adults",
    seo: {
      ar: {
        title: "دورة لغة عربية للكبار ولغير الناطقين بها | مَجْد أكاديمي",
        description: "تعلم المحادثة العربية للكبار والبيئة المهنية مع دورات لغة عربية مخصصة. ابنِ علاقاتك وارفع فرصك المهنية في العالم العربي عبر مدرسين محترفين.",
        keywords: "دورة محادثة لغة عربية للكبار, تعلم العربية لغير الناطقين بها أونلاين, دورة لغة عربية للاعمال, تعلم العربية من الصفر للكبار"
      },
      en: {
        title: "Arabic Course for Adults & Professionals | Majd Academy",
        description: "Learn Arabic from scratch. Practical conversation courses for adults, expats, and professionals seeking career growth and cultural integration.",
        keywords: "learn arabic for adults, arabic conversation course, business arabic, arabic classes for expats, speak arabic online"
      }
    },
    ar: {
      title: "العربية للكبار ولغير الناطقين",
      subtitle: "افتح أبواباً مهنية واجتماعية جديدة بتعلم لغة الأعمال والمجتمع بأسلوب عملي 100%.",
      intro: "هل تفوتك فرص مهنية أو اجتماعية بسبب حاجز اللغة؟ تقدم مَجْد أكاديمي دورة محادثة لغة عربية للكبار مصممة خصيصاً للمحترفين والمقيمين، لتنقلك من الصفر إلى إجادة التواصل بكل ثقة.",
      details: [
        "الاعتماد الدائم على تطبيقات الترجمة أو الشعور بالعزلة أثناء نقاشات زملاء العمل والمجتمع المحلي هو أمر محبط. كشخص بالغ، ليس لديك الوقت لتعلم القواعد النحوية المعقدة التي لن تستخدمها في الشارع أو المكتب.",
        "لذلك، منهجيتنا مختلفة تماماً. نحن نتبنى النهج العملي التطبيقي. 80% من الدورة مخصصة لممارسة المحادثة الحقيقية، والتدرب على سيناريوهات ومواقف العمل والحياة اليومية. نوفر لك الكلمات والعبارات التي تحتاجها اليوم، لتتمكن من بناء العلاقات وتوسيع شبكتك في العالم العربي بكفاءة."
      ],
      featuresList: [
        "منهج مرن ومصمم ليناسب أهدافك الخاصة (عربي للأعمال، للسفر، للتواصل اليومي).",
        "التركيز بنسبة 80% على المحادثة والاستماع والتطبيق العملي السريع.",
        "أوقات حصص مرنة جداً لتلائم جداول الموظفين وأصحاب الأعمال المزدحمة.",
        "مدربون محترفون لغتهم الأصلية هي العربية، بخبرة واسعة في تعليم الكبار بأسلوب راقٍ وتفاعلي.",
        "دمج عميق لثقافة المنطقة وعاداتها لفهم \"سياق\" الحديث وليس الكلمات فقط."
      ],
      whatYouWillLearn: [
        "تأسيس فوري في قراءة الحروف وتكوين الجمل العملية السليمة.",
        "إدارة حوارات حقيقية في بيئة العمل، الاجتماعات، والمناسبات الاجتماعية.",
        "فهم وقراءة المراسلات والنصوص العربية المبسطة الخاصة بقطاعك.",
        "التعبير عن أفكارك وآرائك بوضوح وطلاقة لتبدو واثقاً ومندمجاً."
      ],
      expectedOutcomes: [
        "القدرة الفعلية على بدء وقيادة نقاشات يومية بثقة، والتخلص من التردد.",
        "توسيع دائرة علاقاتك المهنية والاجتماعية في منطقة الخليج والشرق الأوسط.",
        "التقاط الفروق الثقافية الدقيقة التي تصنع الفارق في عقد الصفقات وبناء الثقة.",
        "امتلاك مهارة استثنائية تفتح لك آفاقاً أوسع وترفع من قيمتك في سوق العمل."
      ],
      conclusion: "لا يهم متى تبدأ.. المهم أن تتعلم بطريقة ذكية تناسب وقتك وأهدافك. انضم إلى صفوة المحترفين في مَجْد أكاديمي واجعل حاجز اللغة من الماضي. تواصل معنا الآن لنحدد مستواك ونبدأ رحلة نجاحك الممتعة!",
      image: "/icon3.webp",
      features: [
        "أوقات حصص فائقة المرونة",
        "تأسيس المحادثة من الصفر",
        "محتوى مخصص لأهدافك",
        "أسلوب تعليم عملي بعيد عن التعقيد"
      ],
    },
    en: {
      title: "Arabic for Adults & Non-Natives",
      subtitle: "Open new professional and social doors by learning practical business and community Arabic.",
      intro: "Are you missing out on professional or social opportunities because of the language barrier? Majd Academy offers a conversational Arabic course specifically designed for adults and professionals, taking you from scratch to confident communication.",
      details: [
        "Constantly relying on translation apps or feeling isolated during discussions with colleagues and the local community can be frustrating. As an adult, you don't have time to learn complex grammatical rules that you won't use in the office or on the street.",
        "That's why our methodology is completely different. We adopt a practical, hands-on approach. 80% of the course is dedicated to real conversation practice, focusing on business and daily life scenarios. We equip you with the exact words and phrases you need today to build relationships and expand your network efficiently in the Arab world."
      ],
      featuresList: [
        "Flexible curriculum customized to your specific goals (Business, Travel, Daily Life).",
        "80% focus on conversation, listening, and rapid practical application.",
        "Highly flexible class schedules to fit the busy lives of employees and business owners.",
        "Professional native Arabic trainers with extensive experience in teaching adults interactively.",
        "Deep integration of regional culture and customs to understand 'context', not just words."
      ],
      whatYouWillLearn: [
        "Immediate foundation in reading the alphabet and forming correct practical sentences.",
        "Managing real dialogues in the workplace, meetings, and social events.",
        "Understanding and reading simplified Arabic correspondence relevant to your sector.",
        "Expressing your thoughts and opinions clearly and fluently to appear confident."
      ],
      expectedOutcomes: [
        "The actual ability to initiate and lead daily discussions with confidence, eliminating hesitation.",
        "Expanding your professional and social network across the Gulf and the Middle East.",
        "Grasping cultural nuances that make all the difference in closing deals and building trust.",
        "Possessing an exceptional skill that opens wider horizons and boosts your market value."
      ],
      conclusion: "It doesn't matter when you start; what matters is learning smartly in a way that fits your time and goals. Join the elite professionals at Majd Academy and make the language barrier a thing of the past. Contact us now to assess your level and begin your rewarding journey!",
      image: "/icon3.webp",
      features: [
        "Highly flexible class timings",
        "Conversation from scratch",
        "Content tailored to your goals",
        "Practical, uncomplicated teaching"
      ],
    },
  },
];
