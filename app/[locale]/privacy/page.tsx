import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import WhatsAppButton from "../../components/WhatsAppButton";

export const metadata: Metadata = {
  title: "سياسة الخصوصية | Golden Circle Gold",
  description: "سياسة الخصوصية وكيفية حماية وتأمين بياناتك الشخصية في Golden Circle Gold.",
};

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isArabic = locale === "ar";

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-40 pb-24 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-6 font-playfair tracking-tight">
              {isArabic ? "سياسة الخصوصية" : "Privacy Policy"}
            </h1>
          </div>
          
          {/* Content */}
          <div className="space-y-12 text-zinc-600 dark:text-zinc-300 leading-relaxed text-lg">
            
            {/* Section 1 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                {isArabic ? "1. المقدمة" : "1. Introduction"}
              </h2>
              <p>
                {isArabic 
                  ? "في Golden Circle Gold، نولي أهمية قصوى لخصوصيتك وحماية بياناتك الشخصية. توضح سياسة الخصوصية هذه كيفية جمعنا للمعلومات، استخدامها، وحمايتها عند زيارتك لموقعنا أو استخدام خدماتنا لشراء السبائك."
                  : "At Golden Circle Gold, we prioritize your privacy and the protection of your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or use our services to buy precious metals."}
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                {isArabic ? "2. المعلومات التي نجمعها" : "2. Information We Collect"}
              </h2>
              <p>
                {isArabic ? "قد نقوم بجمع الأنواع التالية من المعلومات:" : "We may collect the following types of information:"}
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-500 dark:text-zinc-400 ml-4 rtl:mr-4 rtl:ml-0">
                <li>{isArabic ? "المعلومات الشخصية (الاسم، البريد الإلكتروني، رقم الهاتف، العنوان) عند التسجيل." : "Personal Information (Name, Email, Phone number, Address) upon registration."}</li>

                <li>{isArabic ? "معلومات المعاملات (سجل الشراء، تفاصيل الدفع) ولكن لا نحتفظ ببيانات بطاقات الدفع بشكل كامل." : "Transaction details (purchase history, payment info), though we do not store full payment card details."}</li>
                <li>{isArabic ? "معلومات الاستخدام والتحليلات لتحسين تجربة المستخدم." : "Usage and analytics data to improve the user experience."}</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                {isArabic ? "3. كيف نستخدم معلوماتك" : "3. How We Use Your Information"}
              </h2>
              <p>
                {isArabic ? "نستخدم بياناتك للأغراض التالية:" : "We use your data for the following purposes:"}
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-500 dark:text-zinc-400 ml-4 rtl:mr-4 rtl:ml-0">
                <li>{isArabic ? "معالجة المعاملات المالية وشراء السبائك." : "Processing financial transactions and buying bars."}</li>
                <li>{isArabic ? "تأمين وتوثيق حسابك بما يتوافق مع القوانين المصرية." : "Securing and verifying your account in compliance with Egyptian laws."}</li>
                <li>{isArabic ? "توصيل المنتجات إلى عنوانك بأمان." : "Delivering products securely to your address."}</li>
                <li>{isArabic ? "إرسال التحديثات الهامة حول حسابك أو تغييرات الخدمة." : "Sending important updates regarding your account or service changes."}</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                {isArabic ? "4. حماية البيانات" : "4. Data Protection"}
              </h2>
              <p>
                {isArabic 
                  ? "نحن نستخدم أحدث تقنيات التشفير (SSL) وبروتوكولات الأمان لضمان حماية بياناتك من الوصول غير المصرح به أو التعديل أو الإفصاح. يتم تشفير جميع المعلومات الحساسة وحفظها في خوادم آمنة."
                  : "We employ the latest encryption technologies (SSL) and security protocols to ensure your data is protected from unauthorized access, alteration, or disclosure. All sensitive information is encrypted and stored on secure servers."}
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                {isArabic ? "5. مشاركة المعلومات" : "5. Sharing of Information"}
              </h2>
              <p>
                {isArabic 
                  ? "نحن لا نبيع أو نؤجر معلوماتك الشخصية لأي طرف ثالث. قد نشارك بياناتك فقط مع الجهات الرسمية إذا تطلب القانون ذلك، أو مع شركاء موثوقين (مثل شركات الشحن) بالقدر اللازم لتقديم الخدمة."
                  : "We do not sell or rent your personal information to third parties. We may share your data only with official authorities if required by law, or with trusted partners (e.g., shipping companies) strictly to provide our services."}
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                {isArabic ? "6. حقوقك" : "6. Your Rights"}
              </h2>
              <p>
                {isArabic 
                  ? "يحق لك الوصول إلى معلوماتك الشخصية، تعديلها، أو طلب حذفها في أي وقت. كما يمكنك سحب موافقتك على استخدام البيانات التسويقية عبر إعدادات حسابك أو التواصل معنا."
                  : "You have the right to access, modify, or request the deletion of your personal information at any time. You can also withdraw your consent for marketing communications through your account settings or by contacting us."}
              </p>
            </section>

            {/* Section 7 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                {isArabic ? "7. تواصل معنا" : "7. Contact Us"}
              </h2>
              <p>
                {isArabic 
                  ? "إذا كان لديك أي أسئلة أو استفسارات حول سياسة الخصوصية، يرجى التواصل معنا عبر:"
                  : "If you have any questions or concerns regarding this Privacy Policy, please contact us at:"}
              </p>
              <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 mt-4">
                <p className="flex justify-between md:justify-start md:gap-4"><strong>{isArabic ? "البريد الإلكتروني:" : "Email:"}</strong> <span>Support@golden-circle.net</span></p>
                <p className="mt-2 flex justify-between md:justify-start md:gap-4"><strong>{isArabic ? "رقم الهاتف:" : "Phone:"}</strong> <span dir="ltr">02 2124 7767</span></p>
                <p className="mt-2 flex justify-between md:justify-start md:gap-4"><strong>{isArabic ? "واتساب:" : "WhatsApp:"}</strong> <span dir="ltr">0107 008 5405</span></p>
              </div>
            </section>

          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
