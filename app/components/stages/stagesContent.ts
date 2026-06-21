export type StageKey = "kindergarten" | "primary" | "middle" | "secondary";

export const stagesContent = {
  ar: {
    kindergarten: {
      title: "مرحلة الروضة",
      badge: "سن 4-5 سنوات",
      subtitle: "نبني أساساً تعليمياً ممتعاً للأطفال الصغار من خلال الألعاب والأناشيد والقصص — ليحبّوا التعلّم منذ اليوم الأول.",
      cta: "احجز حصة تجريبية",
      grades: [
        { id: "KG1", label: "الروضة الأولى" },
        { id: "KG2", label: "الروضة الثانية" },
      ],
      features: [
        { title: "تعلّم الحروف", desc: "نعرّف الطفل على الحروف العربية بطريقة مرحة من خلال الأناشيد والألوان." },
        { title: "القرآن والأخلاق", desc: "نحفّظ الطفل السور القصيرة ونغرس فيه القيم والأخلاق الإسلامية بطريقة مبسطة." },
        { title: "مهارات اللغة", desc: "نطوّر مهارات الاستماع والكلام والتعبير عن الأفكار والمشاعر بثقة." },
        { title: "مهارات الحياة", desc: "نغرس قيم التعاون والمشاركة والإبداع في بيئة آمنة ومحفزة." },
      ],
    },
    primary: {
      title: "المرحلة الابتدائية",
      badge: "الصفوف 1-5",
      subtitle: "نبني أساساً قوياً في القراءة والكتابة بأسلوب ممتع يُحبّب الطفل في التعلّم منذ البداية.",
      cta: "احجز حصة تجريبية",
      grades: [
        { id: 1, label: "الصف الأول" },
        { id: 2, label: "الصف الثاني" },
        { id: 3, label: "الصف الثالث" },
        { id: 4, label: "الصف الرابع" },
        { id: 5, label: "الصف الخامس" },
      ],
      features: [
        { title: "تأسيس القراءة", desc: "نعلّم الطفل القراءة بطلاقة بدءاً من الحروف وصولاً إلى الجمل والقصص القصيرة." },
        { title: "الكتابة الإبداعية", desc: "نطوّر مهارة التعبير الكتابي بأسلوب ممتع يُشجّع الطفل على الكتابة." },
        { title: "الحساب الذهني", desc: "نبني أساساً رياضياً قوياً بطرق تفاعلية تجعل فهم الأرقام سهلاً." },
        { title: "حب التعلم", desc: "نخلق بيئة تعليمية ممتعة تُحفّز الطفل على التعلّم والتساؤل والاستكشاف." },
      ],
    },
    middle: {
      title: "المرحلة المتوسطة",
      badge: "الصفوف 6-9",
      subtitle: "نطوّر مهارات التفكير التحليلي والفهم العميق مع التركيز على المواد الأساسية في المنهج الإماراتي.",
      cta: "احجز حصة تجريبية",
      grades: [
        { id: 6, label: "الصف السادس" },
        { id: 7, label: "الصف السابع" },
        { id: 8, label: "الصف الثامن" },
        { id: 9, label: "الصف التاسع" },
      ],
      features: [
        { title: "التفكير التحليلي", desc: "نعلّم الطالب كيفية تحليل النصوص وفهم المعاني العميقة الكامنة وراء الكلمات." },
        { title: "الفهم العميق", desc: "بعيداً عن التلقين — نركز على فهم الطالب للمادة وقدرته على تطبيقها." },
        { title: "مهارات البحث", desc: "نطوّر لديه القدرة على البحث والاستنتاج وربط المعلومات ببعضها." },
        { title: "الاستعداد للثانوي", desc: "نُعدّه أكاديمياً ونفسياً للمرحلة القادمة بكل ثقة." },
      ],
    },
    secondary: {
      title: "المرحلة الثانوية",
      badge: "الصفوف 10-12",
      subtitle: "نُعدّ الطالب للامتحانات النهائية لا سيما اختبارات الإمسات (EmSAT) بمتابعة مكثفة ومراجعات شاملة.",
      cta: "احجز حصة تجريبية",
      grades: [
        { id: 10, label: "الصف العاشر" },
        { id: 11, label: "الصف الحادي عشر" },
        { id: 12, label: "الصف الثاني عشر" },
      ],
      features: [
        { title: "تحضير EmSAT", desc: "خطة مخصصة لاختبارات الإمسات مع تدريبات ونماذج سابقة." },
        { title: "مراجعات مكثفة", desc: "حصص مراجعة قبل كل امتحان تغطي كامل المنهج بشكل منظم." },
        { title: "خطة مخصصة", desc: "نصمم جدولاً دراسياً يتناسب مع مستوى الطالب وأهدافه." },
        { title: "الدعم النفسي", desc: "نساعد الطالب على التعامل مع ضغط الامتحانات ليخوضها بثقة تامة." },
      ],
    },
  },
  en: {
    kindergarten: {
      title: "Kindergarten Stage",
      badge: "Ages 4-5",
      subtitle: "We build a joyful learning foundation for young children through play, songs, and stories — so they love learning from day one.",
      cta: "Book a trial class",
      grades: [
        { id: "KG1", label: "KG 1" },
        { id: "KG2", label: "KG 2" },
      ],
      features: [
        { title: "Learning Letters", desc: "We introduce Arabic letters in a fun way through songs and colors." },
        { title: "Quran & Ethics", desc: "We help children memorize short Surahs and instill Islamic values and ethics in a simple way." },
        { title: "Language Skills", desc: "We develop listening, speaking, and expressing ideas and feelings with confidence." },
        { title: "Life Skills", desc: "We instill values of cooperation, sharing, and creativity in a safe and stimulating environment." },
      ],
    },
    primary: {
      title: "Primary Stage",
      badge: "Grades 1-5",
      subtitle: "We build a strong foundation in reading and writing with an engaging approach that makes children love learning.",
      cta: "Book a trial class",
      grades: [
        { id: 1, label: "Grade 1" },
        { id: 2, label: "Grade 2" },
        { id: 3, label: "Grade 3" },
        { id: 4, label: "Grade 4" },
        { id: 5, label: "Grade 5" },
      ],
      features: [
        { title: "Reading Foundation", desc: "We teach children to read fluently from letters to sentences and short stories." },
        { title: "Creative Writing", desc: "We develop written expression skills in a fun way that encourages writing." },
        { title: "Mental Math", desc: "We build a strong mathematical foundation with interactive methods." },
        { title: "Love of Learning", desc: "We create a fun learning environment that makes children love to learn and discover." },
      ],
    },
    middle: {
      title: "Middle Stage",
      badge: "Grades 6-9",
      subtitle: "We develop analytical thinking and deep understanding skills, focusing on core subjects in the UAE curriculum.",
      cta: "Book a trial class",
      grades: [
        { id: 6, label: "Grade 6" },
        { id: 7, label: "Grade 7" },
        { id: 8, label: "Grade 8" },
        { id: 9, label: "Grade 9" },
      ],
      features: [
        { title: "Analytical Thinking", desc: "We teach students to analyze texts and understand deeper meanings." },
        { title: "Deep Understanding", desc: "Not memorization — we focus on understanding and application." },
        { title: "Research Skills", desc: "We develop their ability to research, conclude, and connect information." },
        { title: "Secondary Readiness", desc: "We prepare them academically and mentally for the next stage." },
      ],
    },
    secondary: {
      title: "Secondary Stage",
      badge: "Grades 10-12",
      subtitle: "We prepare students for final exams and EmSAT with intensive follow-up and comprehensive reviews.",
      cta: "Book a trial class",
      grades: [
        { id: 10, label: "Grade 10" },
        { id: 11, label: "Grade 11" },
        { id: 12, label: "Grade 12" },
      ],
      features: [
        { title: "EmSAT Preparation", desc: "Custom plan for EmSAT exams with practice tests and past papers." },
        { title: "Intensive Reviews", desc: "Review sessions before every exam covering the entire curriculum." },
        { title: "Custom Plan", desc: "We design a study schedule that fits the student's level and goals." },
        { title: "Mental Support", desc: "We help students handle exam pressure and enter with confidence." },
      ],
    },
  },
};
