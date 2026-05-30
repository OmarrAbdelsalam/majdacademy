export type GradeData = {
  id: number;
  name: string;
  stage: "primary" | "middle" | "secondary";
  stageName: string;
  description: string;
  subjects: {
    name: string;
    desc: string;
    cta: string;
  }[];
  features: {
    title: string;
    desc: string;
  }[];
  cta: string;
};

export function getStageFromGrade(grade: number): "primary" | "middle" | "secondary" {
  if (grade >= 1 && grade <= 5) return "primary";
  if (grade >= 6 && grade <= 9) return "middle";
  return "secondary";
}

export const gradesContent: {
  ar: Record<number, GradeData>;
  en: Record<number, GradeData>;
} = {
  ar: {
    1: {
      id: 1,
      name: "الصف الأول",
      stage: "primary",
      stageName: "المرحلة الابتدائية",
      description: "نبدأ مع طفلك من الأساس — نعلّمه الحروف والقراءة والكتابة بأسلوب ممتع يخليه يحب التعلم من أول يوم.",
      subjects: [
        {
          name: "اللغة العربية",
          desc: "نعلّم طفلك الحروف والأصوات ونبني عنده حب القراءة من خلال قصص وأنشطة تفاعلية تناسب عمره.",
          cta: "احجز حصة مجانية",
        },
        {
          name: "التربية الإسلامية",
          desc: "نعرّف الطفل على ربه وأركان الإسلام بأسلوب بسيط ومحبب يغرس القيم من الصغر.",
          cta: "احجز حصة مجانية",
        },
      ],
      features: [
        { title: "تعلّم الحروف", desc: "نعلّم الطفل الحروف العربية بطريقة ممتعة مع الأصوات والحركات." },
        { title: "القراءة الأولى", desc: "نبدأ معاه يقرأ كلمات وجمل بسيطة بثقة وبدون خوف." },
        { title: "الكتابة بخط واضح", desc: "نساعده يمسك القلم صح ويكتب حروف وكلمات بخط مرتب." },
        { title: "حب التعلم", desc: "نخلق بيئة ممتعة تخلي الطفل يحب يروح الحصة ويتعلم أكثر." },
      ],
      cta: "احجز حصة تجريبية",
    },
    2: {
      id: 2,
      name: "الصف الثاني",
      stage: "primary",
      stageName: "المرحلة الابتدائية",
      description: "نكمّل بناء المهارات الأساسية — نقوّي القراءة والكتابة ونوسّع مفردات الطفل بأسلوب تفاعلي.",
      subjects: [
        {
          name: "اللغة العربية",
          desc: "نقوّي مهارة القراءة ونوسّع المفردات عند الطفل من خلال نصوص قصيرة وتمارين كتابية ممتعة.",
          cta: "احجز حصة مجانية",
        },
        {
          name: "التربية الإسلامية",
          desc: "نعلّم الطفل السور القصيرة والأذكار اليومية ونربط الدين بحياته بأسلوب قريب منه.",
          cta: "احجز حصة مجانية",
        },
      ],
      features: [
        { title: "طلاقة القراءة", desc: "نطوّر سرعة القراءة عند الطفل مع الفهم والاستيعاب." },
        { title: "توسيع المفردات", desc: "نزيد حصيلة الكلمات عنده من خلال قصص ونصوص متنوعة." },
        { title: "التعبير الكتابي", desc: "نعلّمه يكتب جمل كاملة ويعبّر عن أفكاره بوضوح." },
        { title: "الثقة بالنفس", desc: "نشجّعه يشارك ويقرأ بصوت عالي بدون تردد." },
      ],
      cta: "احجز حصة تجريبية",
    },
    3: {
      id: 3,
      name: "الصف الثالث",
      stage: "primary",
      stageName: "المرحلة الابتدائية",
      description: "نعزّز مهارات الفهم والتعبير — الطفل يبدأ يقرأ نصوص أطول ويكتب فقرات بأسلوبه الخاص.",
      subjects: [
        {
          name: "اللغة العربية",
          desc: "نركّز على فهم النصوص والتعبير الكتابي ونعلّم الطفل يستخرج المعلومات ويلخّص بأسلوبه.",
          cta: "احجز حصة مجانية",
        },
        {
          name: "التربية الإسلامية",
          desc: "نعمّق فهم الطفل للعبادات والسيرة النبوية بأسلوب قصصي يحببه بالدين.",
          cta: "احجز حصة مجانية",
        },
      ],
      features: [
        { title: "فهم المقروء", desc: "نعلّم الطفل يفهم اللي يقرأه ويستخرج الأفكار الرئيسية." },
        { title: "كتابة الفقرات", desc: "ينتقل من الجمل للفقرات ويتعلم ينظّم أفكاره." },
        { title: "القواعد الأساسية", desc: "نبدأ معاه أساسيات النحو بطريقة مبسطة وعملية." },
        { title: "الإبداع والتعبير", desc: "نشجّعه يكتب قصص قصيرة ويعبّر عن خياله." },
      ],
      cta: "احجز حصة تجريبية",
    },
    4: {
      id: 4,
      name: "الصف الرابع",
      stage: "primary",
      stageName: "المرحلة الابتدائية",
      description: "نرفع مستوى التحدي — الطفل يتعلم يحلل نصوص ويكتب مواضيع متكاملة مع تقوية القواعد.",
      subjects: [
        {
          name: "اللغة العربية",
          desc: "نقوّي القواعد النحوية ونطوّر مهارة كتابة المواضيع مع التركيز على التحليل والاستنتاج.",
          cta: "احجز حصة مجانية",
        },
        {
          name: "التربية الإسلامية",
          desc: "نوسّع معرفة الطالب بالأحكام الفقهية والقصص القرآنية مع ربطها بالقيم الأخلاقية.",
          cta: "احجز حصة مجانية",
        },
      ],
      features: [
        { title: "تحليل النصوص", desc: "نعلّمه يقرأ بعمق ويحلل الأفكار والمعاني في النص." },
        { title: "النحو والصرف", desc: "نبني عنده أساس قوي في القواعد بأمثلة عملية." },
        { title: "كتابة المواضيع", desc: "يتعلم يكتب موضوع متكامل بمقدمة وعرض وخاتمة." },
        { title: "مهارات الاستماع", desc: "نطوّر قدرته على الاستماع والفهم والتلخيص الشفهي." },
      ],
      cta: "احجز حصة تجريبية",
    },
    5: {
      id: 5,
      name: "الصف الخامس",
      stage: "primary",
      stageName: "المرحلة الابتدائية",
      description: "نجهّز الطالب للمرحلة المتوسطة — نقوّي كل المهارات ونتأكد إنه جاهز للمستوى الجاي.",
      subjects: [
        {
          name: "اللغة العربية",
          desc: "نراجع ونقوّي كل المهارات اللغوية ونجهّز الطالب لمستوى أعلى من التحليل والكتابة.",
          cta: "احجز حصة مجانية",
        },
        {
          name: "التربية الإسلامية",
          desc: "نعزّز الفهم العميق للعقيدة والفقه ونربط المفاهيم بالتطبيق العملي في حياة الطالب.",
          cta: "احجز حصة مجانية",
        },
      ],
      features: [
        { title: "التلخيص والتحليل", desc: "يتعلم يلخّص نصوص طويلة ويستخرج الأفكار بدقة." },
        { title: "الكتابة المتقدمة", desc: "يكتب مواضيع أطول وأعمق مع حجج وأدلة." },
        { title: "القواعد المتقدمة", desc: "نوسّع معرفته بالنحو والصرف ونطبّق على نصوص حقيقية." },
        { title: "الاستعداد للمتوسط", desc: "نجهّزه أكاديمياً ونفسياً للمرحلة الجاية بثقة." },
      ],
      cta: "احجز حصة تجريبية",
    },
    6: {
      id: 6,
      name: "الصف السادس",
      stage: "middle",
      stageName: "المرحلة المتوسطة",
      description: "بداية المرحلة المتوسطة — نطوّر التفكير التحليلي ونعلّم الطالب يفهم المادة بعمق مش بس يحفظ.",
      subjects: [
        {
          name: "اللغة العربية",
          desc: "نطوّر مهارات التحليل الأدبي والنقد ونعلّم الطالب يفهم النصوص بعمق ويكتب بأسلوب متقدم.",
          cta: "احجز حصة مجانية",
        },
        {
          name: "التربية الإسلامية",
          desc: "نعمّق فهم الطالب للتشريعات الإسلامية والسيرة مع تطوير مهارة الاستدلال والربط.",
          cta: "احجز حصة مجانية",
        },
      ],
      features: [
        { title: "التفكير التحليلي", desc: "نعلّم الطالب يحلل النصوص ويفهم المعاني العميقة ورا الكلام." },
        { title: "الفهم العميق", desc: "مش حفظ — نركّز إن الطالب يفهم المادة ويقدر يطبّقها." },
        { title: "مهارات البحث", desc: "نطوّر عنده القدرة يبحث ويستنتج ويربط المعلومات ببعض." },
        { title: "التعبير المتقدم", desc: "يتعلم يكتب مقالات ويعبّر عن رأيه بحجج قوية." },
      ],
      cta: "احجز حصة تجريبية",
    },
    7: {
      id: 7,
      name: "الصف السابع",
      stage: "middle",
      stageName: "المرحلة المتوسطة",
      description: "نعمّق المهارات التحليلية — الطالب يتعلم يقرأ بين السطور ويكتب بأسلوب أكاديمي منظم.",
      subjects: [
        {
          name: "اللغة العربية",
          desc: "نركّز على البلاغة والنحو المتقدم ونعلّم الطالب يكتب مقالات منظمة بأسلوب أكاديمي.",
          cta: "احجز حصة مجانية",
        },
        {
          name: "التربية الإسلامية",
          desc: "نوسّع معرفة الطالب بالفقه المقارن والتفسير ونطوّر مهارة التفكير النقدي الديني.",
          cta: "احجز حصة مجانية",
        },
      ],
      features: [
        { title: "البلاغة والأدب", desc: "نعرّف الطالب على الأساليب البلاغية ونطوّر ذوقه الأدبي." },
        { title: "النحو المتقدم", desc: "نبني فهم عميق للقواعد النحوية مع تطبيقات عملية." },
        { title: "الكتابة الأكاديمية", desc: "يتعلم يكتب بأسلوب منظم مع مقدمة وحجج وخاتمة." },
        { title: "التفكير النقدي", desc: "نشجّعه يسأل ويناقش ويكوّن رأيه الخاص بأدلة." },
      ],
      cta: "احجز حصة تجريبية",
    },
    8: {
      id: 8,
      name: "الصف الثامن",
      stage: "middle",
      stageName: "المرحلة المتوسطة",
      description: "نرفع مستوى التحدي الأكاديمي — الطالب يتعامل مع نصوص معقدة ويطوّر أسلوبه الكتابي.",
      subjects: [
        {
          name: "اللغة العربية",
          desc: "نتعمّق في الأدب والنقد الأدبي ونقوّي مهارات الكتابة الإبداعية والتحليلية عند الطالب.",
          cta: "احجز حصة مجانية",
        },
        {
          name: "التربية الإسلامية",
          desc: "نناقش قضايا معاصرة من منظور إسلامي ونطوّر قدرة الطالب على الاستدلال الشرعي.",
          cta: "احجز حصة مجانية",
        },
      ],
      features: [
        { title: "النقد الأدبي", desc: "نعلّم الطالب يقيّم النصوص ويحلل الأساليب الأدبية." },
        { title: "الكتابة الإبداعية", desc: "نطوّر أسلوبه الكتابي ونشجّعه يبدع في التعبير." },
        { title: "البحث والاستقصاء", desc: "يتعلم يجمع معلومات من مصادر متعددة ويقدّمها بشكل منظم." },
        { title: "الاستعداد للثانوي", desc: "نبني عنده المهارات اللي يحتاجها للمرحلة الثانوية." },
      ],
      cta: "احجز حصة تجريبية",
    },
    9: {
      id: 9,
      name: "الصف التاسع",
      stage: "middle",
      stageName: "المرحلة المتوسطة",
      description: "آخر سنة في المتوسط — نتأكد إن الطالب جاهز للثانوي بمهارات قوية وثقة عالية.",
      subjects: [
        {
          name: "اللغة العربية",
          desc: "نراجع ونقوّي كل المهارات اللغوية المتقدمة ونجهّز الطالب لمتطلبات المرحلة الثانوية.",
          cta: "احجز حصة مجانية",
        },
        {
          name: "التربية الإسلامية",
          desc: "نعزّز الفهم الشامل للدين ونجهّز الطالب لمواضيع أعمق في المرحلة الثانوية.",
          cta: "احجز حصة مجانية",
        },
      ],
      features: [
        { title: "المراجعة الشاملة", desc: "نراجع كل المهارات الأساسية ونتأكد ما في ثغرات." },
        { title: "التحليل المتقدم", desc: "نرفع مستوى التحليل والنقد لنصوص أكثر تعقيداً." },
        { title: "مهارات العرض", desc: "نعلّمه يقدّم أفكاره شفهياً بثقة وتنظيم." },
        { title: "الجاهزية للثانوي", desc: "نجهّزه أكاديمياً ونفسياً للمرحلة الجاية بكل ثقة." },
      ],
      cta: "احجز حصة تجريبية",
    },
    10: {
      id: 10,
      name: "الصف العاشر",
      stage: "secondary",
      stageName: "المرحلة الثانوية",
      description: "بداية المرحلة الثانوية — نبني أساس أكاديمي قوي ونبدأ التحضير المبكر للإمسات.",
      subjects: [
        {
          name: "اللغة العربية",
          desc: "نركّز على المهارات المطلوبة في الإمسات ونقوّي التحليل الأدبي والكتابة الأكاديمية المتقدمة.",
          cta: "احجز حصة مجانية",
        },
        {
          name: "التربية الإسلامية",
          desc: "نتعمّق في الفقه وأصوله والتفسير مع التركيز على المنهجية العلمية في فهم النصوص.",
          cta: "احجز حصة مجانية",
        },
      ],
      features: [
        { title: "تحضير EmSAT مبكر", desc: "نبدأ التحضير للإمسات من بدري عشان الطالب يكون جاهز." },
        { title: "مراجعات منظمة", desc: "حصص مراجعة دورية تغطي المنهج بشكل منظم ومرتب." },
        { title: "استراتيجيات الامتحان", desc: "نعلّمه كيف يدير وقته ويجاوب بذكاء في الامتحانات." },
        { title: "خطة دراسية مخصصة", desc: "نصمم جدول يناسب مستواه وأهدافه الأكاديمية." },
      ],
      cta: "احجز حصة تجريبية",
    },
    11: {
      id: 11,
      name: "الصف الحادي عشر",
      stage: "secondary",
      stageName: "المرحلة الثانوية",
      description: "سنة حاسمة — نكثّف التحضير للإمسات ونركّز على المواضيع الأساسية مع متابعة مستمرة.",
      subjects: [
        {
          name: "اللغة العربية",
          desc: "تدريب مكثف على نماذج الإمسات مع تقوية نقاط الضعف والتركيز على مهارات الكتابة المتقدمة.",
          cta: "احجز حصة مجانية",
        },
        {
          name: "التربية الإسلامية",
          desc: "مراجعة شاملة للمنهج مع التركيز على الفهم العميق والتطبيق في أسئلة الامتحانات.",
          cta: "احجز حصة مجانية",
        },
      ],
      features: [
        { title: "تدريب EmSAT مكثف", desc: "نماذج وتدريبات مكثفة على نمط أسئلة الإمسات الفعلية." },
        { title: "مراجعات أسبوعية", desc: "حصص مراجعة أسبوعية تضمن ما ينسى شي من المنهج." },
        { title: "تقوية نقاط الضعف", desc: "نحدد نقاط الضعف ونشتغل عليها بشكل مركّز." },
        { title: "دعم نفسي ومعنوي", desc: "نساعد الطالب يتعامل مع الضغط ويحافظ على تركيزه." },
      ],
      cta: "احجز حصة تجريبية",
    },
    12: {
      id: 12,
      name: "الصف الثاني عشر",
      stage: "secondary",
      stageName: "المرحلة الثانوية",
      description: "السنة الأخيرة والأهم — تحضير شامل ومكثف للإمسات مع مراجعات نهائية وخطة واضحة للنجاح.",
      subjects: [
        {
          name: "اللغة العربية",
          desc: "تحضير نهائي شامل للإمسات مع حل نماذج سابقة ومراجعة مكثفة لكل أجزاء المنهج.",
          cta: "احجز حصة مجانية",
        },
        {
          name: "التربية الإسلامية",
          desc: "مراجعة نهائية شاملة مع التركيز على أنماط الأسئلة وتقنيات الإجابة المثالية.",
          cta: "احجز حصة مجانية",
        },
      ],
      features: [
        { title: "تحضير EmSAT نهائي", desc: "خطة مكثفة للإمسات مع نماذج سابقة وتدريبات يومية." },
        { title: "مراجعات شاملة", desc: "نغطي كل المنهج بمراجعات منظمة قبل الامتحان النهائي." },
        { title: "محاكاة الامتحان", desc: "امتحانات تجريبية بنفس ظروف الامتحان الحقيقي." },
        { title: "متابعة يومية", desc: "متابعة مستمرة ودعم يومي لحد ما يخلّص الامتحانات." },
      ],
      cta: "احجز حصة تجريبية",
    },
  },
  en: {
    1: {
      id: 1,
      name: "Grade 1",
      stage: "primary",
      stageName: "Primary Stage",
      description: "We start from the basics — teaching your child letters, reading, and writing in a fun way that makes them love learning from day one.",
      subjects: [
        {
          name: "Arabic Language",
          desc: "We teach your child letters and sounds, building a love of reading through stories and interactive activities suited to their age.",
          cta: "Book a free class",
        },
        {
          name: "Islamic Education",
          desc: "We introduce the child to their faith and the pillars of Islam in a simple, engaging way that instills values from a young age.",
          cta: "Book a free class",
        },
      ],
      features: [
        { title: "Learning Letters", desc: "We teach letters in a fun way with sounds and movements." },
        { title: "First Reading", desc: "We start with simple words and sentences, building confidence." },
        { title: "Clear Handwriting", desc: "We help them hold the pen correctly and write neatly." },
        { title: "Love of Learning", desc: "We create a fun environment that makes children excited to learn." },
      ],
      cta: "Book a trial class",
    },
    2: {
      id: 2,
      name: "Grade 2",
      stage: "primary",
      stageName: "Primary Stage",
      description: "We continue building foundational skills — strengthening reading and writing while expanding your child's vocabulary interactively.",
      subjects: [
        {
          name: "Arabic Language",
          desc: "We strengthen reading skills and expand vocabulary through short texts and engaging writing exercises.",
          cta: "Book a free class",
        },
        {
          name: "Islamic Education",
          desc: "We teach short surahs and daily adhkar, connecting faith to the child's everyday life in a relatable way.",
          cta: "Book a free class",
        },
      ],
      features: [
        { title: "Reading Fluency", desc: "We develop reading speed with comprehension and understanding." },
        { title: "Vocabulary Expansion", desc: "We increase word knowledge through diverse stories and texts." },
        { title: "Written Expression", desc: "We teach them to write complete sentences and express ideas clearly." },
        { title: "Self-Confidence", desc: "We encourage participation and reading aloud without hesitation." },
      ],
      cta: "Book a trial class",
    },
    3: {
      id: 3,
      name: "Grade 3",
      stage: "primary",
      stageName: "Primary Stage",
      description: "We enhance comprehension and expression skills — the child starts reading longer texts and writing paragraphs in their own style.",
      subjects: [
        {
          name: "Arabic Language",
          desc: "We focus on text comprehension and written expression, teaching the child to extract information and summarize in their own words.",
          cta: "Book a free class",
        },
        {
          name: "Islamic Education",
          desc: "We deepen the child's understanding of worship and the Prophet's biography through engaging storytelling.",
          cta: "Book a free class",
        },
      ],
      features: [
        { title: "Reading Comprehension", desc: "We teach them to understand what they read and extract main ideas." },
        { title: "Paragraph Writing", desc: "They move from sentences to paragraphs, learning to organize thoughts." },
        { title: "Basic Grammar", desc: "We introduce grammar fundamentals in a simplified, practical way." },
        { title: "Creativity & Expression", desc: "We encourage writing short stories and expressing imagination." },
      ],
      cta: "Book a trial class",
    },
    4: {
      id: 4,
      name: "Grade 4",
      stage: "primary",
      stageName: "Primary Stage",
      description: "We raise the challenge level — the child learns to analyze texts and write complete essays while strengthening grammar.",
      subjects: [
        {
          name: "Arabic Language",
          desc: "We strengthen grammar rules and develop essay writing skills with a focus on analysis and reasoning.",
          cta: "Book a free class",
        },
        {
          name: "Islamic Education",
          desc: "We expand knowledge of Islamic rulings and Quranic stories while connecting them to moral values.",
          cta: "Book a free class",
        },
      ],
      features: [
        { title: "Text Analysis", desc: "We teach deep reading and analyzing ideas and meanings in texts." },
        { title: "Grammar & Morphology", desc: "We build a strong foundation in grammar with practical examples." },
        { title: "Essay Writing", desc: "They learn to write complete essays with introduction, body, and conclusion." },
        { title: "Listening Skills", desc: "We develop their ability to listen, understand, and summarize orally." },
      ],
      cta: "Book a trial class",
    },
    5: {
      id: 5,
      name: "Grade 5",
      stage: "primary",
      stageName: "Primary Stage",
      description: "We prepare the student for middle school — strengthening all skills and ensuring they're ready for the next level.",
      subjects: [
        {
          name: "Arabic Language",
          desc: "We review and strengthen all language skills, preparing the student for a higher level of analysis and writing.",
          cta: "Book a free class",
        },
        {
          name: "Islamic Education",
          desc: "We reinforce deep understanding of creed and jurisprudence, connecting concepts to practical application.",
          cta: "Book a free class",
        },
      ],
      features: [
        { title: "Summarizing & Analysis", desc: "They learn to summarize long texts and extract ideas precisely." },
        { title: "Advanced Writing", desc: "They write longer, deeper essays with arguments and evidence." },
        { title: "Advanced Grammar", desc: "We expand grammar knowledge and apply it to real texts." },
        { title: "Middle School Readiness", desc: "We prepare them academically and mentally for the next stage." },
      ],
      cta: "Book a trial class",
    },
    6: {
      id: 6,
      name: "Grade 6",
      stage: "middle",
      stageName: "Middle Stage",
      description: "The start of middle school — we develop analytical thinking and teach students to understand material deeply, not just memorize.",
      subjects: [
        {
          name: "Arabic Language",
          desc: "We develop literary analysis and critical skills, teaching students to understand texts deeply and write in an advanced style.",
          cta: "Book a free class",
        },
        {
          name: "Islamic Education",
          desc: "We deepen understanding of Islamic legislation and biography while developing reasoning and connection skills.",
          cta: "Book a free class",
        },
      ],
      features: [
        { title: "Analytical Thinking", desc: "We teach students to analyze texts and understand deeper meanings." },
        { title: "Deep Understanding", desc: "Not memorization — we focus on understanding and application." },
        { title: "Research Skills", desc: "We develop their ability to research, conclude, and connect information." },
        { title: "Advanced Expression", desc: "They learn to write articles and express opinions with strong arguments." },
      ],
      cta: "Book a trial class",
    },
    7: {
      id: 7,
      name: "Grade 7",
      stage: "middle",
      stageName: "Middle Stage",
      description: "We deepen analytical skills — the student learns to read between the lines and write in an organized academic style.",
      subjects: [
        {
          name: "Arabic Language",
          desc: "We focus on rhetoric and advanced grammar, teaching students to write organized articles in an academic style.",
          cta: "Book a free class",
        },
        {
          name: "Islamic Education",
          desc: "We expand knowledge of comparative jurisprudence and interpretation while developing critical religious thinking.",
          cta: "Book a free class",
        },
      ],
      features: [
        { title: "Rhetoric & Literature", desc: "We introduce rhetorical devices and develop literary appreciation." },
        { title: "Advanced Grammar", desc: "We build deep understanding of grammar rules with practical applications." },
        { title: "Academic Writing", desc: "They learn to write in an organized style with introduction, arguments, and conclusion." },
        { title: "Critical Thinking", desc: "We encourage questioning, discussing, and forming evidence-based opinions." },
      ],
      cta: "Book a trial class",
    },
    8: {
      id: 8,
      name: "Grade 8",
      stage: "middle",
      stageName: "Middle Stage",
      description: "We raise the academic challenge — the student handles complex texts and develops their writing style.",
      subjects: [
        {
          name: "Arabic Language",
          desc: "We dive deep into literature and literary criticism while strengthening creative and analytical writing skills.",
          cta: "Book a free class",
        },
        {
          name: "Islamic Education",
          desc: "We discuss contemporary issues from an Islamic perspective and develop the student's ability in religious reasoning.",
          cta: "Book a free class",
        },
      ],
      features: [
        { title: "Literary Criticism", desc: "We teach students to evaluate texts and analyze literary techniques." },
        { title: "Creative Writing", desc: "We develop their writing style and encourage creative expression." },
        { title: "Research & Investigation", desc: "They learn to gather information from multiple sources and present it organized." },
        { title: "Secondary Readiness", desc: "We build the skills they need for the secondary stage." },
      ],
      cta: "Book a trial class",
    },
    9: {
      id: 9,
      name: "Grade 9",
      stage: "middle",
      stageName: "Middle Stage",
      description: "The final year of middle school — we ensure the student is ready for secondary with strong skills and high confidence.",
      subjects: [
        {
          name: "Arabic Language",
          desc: "We review and strengthen all advanced language skills, preparing the student for secondary stage requirements.",
          cta: "Book a free class",
        },
        {
          name: "Islamic Education",
          desc: "We reinforce comprehensive understanding of religion and prepare the student for deeper topics in secondary.",
          cta: "Book a free class",
        },
      ],
      features: [
        { title: "Comprehensive Review", desc: "We review all core skills and ensure there are no gaps." },
        { title: "Advanced Analysis", desc: "We elevate analysis and criticism to more complex texts." },
        { title: "Presentation Skills", desc: "We teach them to present ideas orally with confidence and organization." },
        { title: "Secondary Readiness", desc: "We prepare them academically and mentally for the next stage with full confidence." },
      ],
      cta: "Book a trial class",
    },
    10: {
      id: 10,
      name: "Grade 10",
      stage: "secondary",
      stageName: "Secondary Stage",
      description: "The start of secondary — we build a strong academic foundation and begin early EmSAT preparation.",
      subjects: [
        {
          name: "Arabic Language",
          desc: "We focus on EmSAT-required skills and strengthen literary analysis and advanced academic writing.",
          cta: "Book a free class",
        },
        {
          name: "Islamic Education",
          desc: "We dive deep into jurisprudence and its principles and interpretation, focusing on scientific methodology in understanding texts.",
          cta: "Book a free class",
        },
      ],
      features: [
        { title: "Early EmSAT Prep", desc: "We start EmSAT preparation early so the student is fully ready." },
        { title: "Organized Reviews", desc: "Regular review sessions covering the curriculum in an organized manner." },
        { title: "Exam Strategies", desc: "We teach time management and smart answering techniques for exams." },
        { title: "Custom Study Plan", desc: "We design a schedule that fits their level and academic goals." },
      ],
      cta: "Book a trial class",
    },
    11: {
      id: 11,
      name: "Grade 11",
      stage: "secondary",
      stageName: "Secondary Stage",
      description: "A crucial year — we intensify EmSAT preparation and focus on core topics with continuous follow-up.",
      subjects: [
        {
          name: "Arabic Language",
          desc: "Intensive training on EmSAT models while strengthening weak points and focusing on advanced writing skills.",
          cta: "Book a free class",
        },
        {
          name: "Islamic Education",
          desc: "Comprehensive curriculum review focusing on deep understanding and application in exam questions.",
          cta: "Book a free class",
        },
      ],
      features: [
        { title: "Intensive EmSAT Training", desc: "Intensive models and exercises matching actual EmSAT question patterns." },
        { title: "Weekly Reviews", desc: "Weekly review sessions ensuring nothing from the curriculum is forgotten." },
        { title: "Weakness Strengthening", desc: "We identify weak points and work on them with focused attention." },
        { title: "Mental & Moral Support", desc: "We help students handle pressure and maintain their focus." },
      ],
      cta: "Book a trial class",
    },
    12: {
      id: 12,
      name: "Grade 12",
      stage: "secondary",
      stageName: "Secondary Stage",
      description: "The final and most important year — comprehensive intensive EmSAT preparation with final reviews and a clear plan for success.",
      subjects: [
        {
          name: "Arabic Language",
          desc: "Final comprehensive EmSAT preparation with past paper solutions and intensive review of all curriculum sections.",
          cta: "Book a free class",
        },
        {
          name: "Islamic Education",
          desc: "Final comprehensive review focusing on question patterns and optimal answering techniques.",
          cta: "Book a free class",
        },
      ],
      features: [
        { title: "Final EmSAT Prep", desc: "Intensive EmSAT plan with past papers and daily practice." },
        { title: "Comprehensive Reviews", desc: "We cover the entire curriculum with organized reviews before the final exam." },
        { title: "Exam Simulation", desc: "Mock exams under the same conditions as the real exam." },
        { title: "Daily Follow-up", desc: "Continuous follow-up and daily support until exams are complete." },
      ],
      cta: "Book a trial class",
    },
  },
};
