export type StageKey = "primary" | "middle" | "secondary";

export const stagesContent = {
  ar: {
    primary: {
      title: "المرحلة الابتدائية",
      badge: "الصف 1-5",
      subtitle: "نبني أساس قوي في القراءة والكتابة بأسلوب ممتع يحبب الطفل بالتعلم من البداية.",
      cta: "احجز حصة تجريبية",
      grades: [
        { id: 1, label: "الصف الأول" },
        { id: 2, label: "الصف الثاني" },
        { id: 3, label: "الصف الثالث" },
        { id: 4, label: "الصف الرابع" },
        { id: 5, label: "الصف الخامس" },
      ],
      features: [
        { title: "تأسيس القراءة", desc: "نعلّم الطفل يقرأ بطلاقة من الحروف لحد الجمل والقصص القصيرة." },
        { title: "الكتابة الإبداعية", desc: "نطوّر مهارة التعبير الكتابي بأسلوب ممتع يشجع الطفل يكتب." },
        { title: "الحساب الذهني", desc: "نبني أساس رياضي قوي بطرق تفاعلية تخلي الأرقام سهلة." },
        { title: "حب التعلم", desc: "نخلق بيئة تعليمية ممتعة تخلي الطفل يحب يتعلم ويسأل ويكتشف." },
      ],
    },
    middle: {
      title: "المرحلة المتوسطة",
      badge: "الصف 6-9",
      subtitle: "نطوّر مهارات التفكير التحليلي والفهم العميق مع التركيز على المواد الأساسية بالمنهج الإماراتي.",
      cta: "احجز حصة تجريبية",
      grades: [
        { id: 6, label: "الصف السادس" },
        { id: 7, label: "الصف السابع" },
        { id: 8, label: "الصف الثامن" },
        { id: 9, label: "الصف التاسع" },
      ],
      features: [
        { title: "التفكير التحليلي", desc: "نعلّم الطالب يحلل النصوص ويفهم المعاني العميقة ورا الكلام." },
        { title: "الفهم العميق", desc: "مش حفظ — نركز إن الطالب يفهم المادة ويقدر يطبقها." },
        { title: "مهارات البحث", desc: "نطوّر عنده القدرة يبحث ويستنتج ويربط المعلومات ببعض." },
        { title: "الاستعداد للثانوي", desc: "نجهّزه أكاديمياً ونفسياً للمرحلة الجاية بثقة." },
      ],
    },
    secondary: {
      title: "المرحلة الثانوية",
      badge: "الصف 10-12",
      subtitle: "نجهّز الطالب للامتحانات النهائية والإمسات بمتابعة مكثفة ومراجعات شاملة.",
      cta: "احجز حصة تجريبية",
      grades: [
        { id: 10, label: "الصف العاشر" },
        { id: 11, label: "الصف الحادي عشر" },
        { id: 12, label: "الصف الثاني عشر" },
      ],
      features: [
        { title: "تحضير EmSAT", desc: "خطة مخصصة لاختبارات الإمسات مع تدريبات ونماذج سابقة." },
        { title: "مراجعات مكثفة", desc: "حصص مراجعة قبل كل امتحان تغطي كل المنهج بشكل منظم." },
        { title: "خطة مخصصة", desc: "نصمم جدول دراسي يناسب مستوى الطالب وأهدافه." },
        { title: "دعم نفسي", desc: "نساعد الطالب يتعامل مع ضغط الامتحانات ويدخلها بثقة." },
      ],
    },
  },
  en: {
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
