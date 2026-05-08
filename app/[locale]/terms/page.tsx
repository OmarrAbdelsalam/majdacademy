import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import WhatsAppButton from "../../components/WhatsAppButton";

export const metadata: Metadata = {
  title: "الشروط والأحكام | Golden Circle Trading",
  description: "الشروط والأحكام الخاصة باستخدام خدمات Golden Circle Trading لشراء السبائك.",
};

export default async function TermsAndConditionsPage({
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
              {isArabic ? "الشروط والأحكام" : "Terms and Conditions"}
            </h1>
          </div>
          
          {/* Content */}
          <div className="space-y-12 text-zinc-600 dark:text-zinc-300 leading-relaxed text-lg">
            
            {/* Section 1 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                {isArabic ? "1. قبول الشروط" : "1. Acceptance of Terms"}
              </h2>
              <p>
                {isArabic 
                  ? "باستخدامك لموقع وتطبيق Golden Circle Trading، فإنك توافق على الالتزام بجميع الشروط والأحكام المذكورة هنا. إذا كنت لا توافق على أي من هذه الشروط، يرجى التوقف عن استخدام خدماتنا فوراً."
                  : "By accessing and using the Golden Circle Trading website and app, you agree to be bound by all the terms and conditions outlined here. If you do not agree with any of these terms, please stop using our services immediately."}
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                {isArabic ? "2. طبيعة الخدمات" : "2. Nature of Services"}
              </h2>
              <p>
                {isArabic 
                  ? "توفر Golden Circle Trading منصة موثوقة وآمنة لشراء السبائك الذهبية والفضية، متوافقة تماماً مع الشريعة الإسلامية ومطابقة لأعلى معايير الجودة (نقاء 999.9 و 999)."
                  : "Golden Circle Trading provides a reliable and secure platform for buying gold and silver bars, fully compliant with Islamic Sharia and meeting the highest quality standards (999.9 and 999 purity)."}
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                {isArabic ? "3. الأسعار والمعاملات" : "3. Prices and Transactions"}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-zinc-500 dark:text-zinc-400 ml-4 rtl:mr-4 rtl:ml-0">
                <li>{isArabic ? "الأسعار المعروضة قابلة للتغير اللحظي بناءً على حركة الأسواق العالمية للذهب والفضة." : "Displayed prices are subject to real-time changes based on global gold and silver market movements."}</li>
                <li>{isArabic ? "يتم تأكيد السعر النهائي للمعاملة فقط عند إتمام عملية الشراء بنجاح." : "The final transaction price is confirmed only upon successful completion of the purchase."}</li>
                <li>{isArabic ? "يجب أن تكون جميع المدفوعات من خلال الطرق المعتمدة في التطبيق أو الموقع." : "All payments must be made through approved methods within the app or website."}</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                {isArabic ? "4. التسليم" : "4. Delivery"}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-zinc-500 dark:text-zinc-400 ml-4 rtl:mr-4 rtl:ml-0">
                <li>{isArabic ? "بمجرد إتمام الشراء، سنقوم بتوصيل السبائك بشكل مؤمن إلى باب المنزل." : "Once the purchase is complete, we will securely deliver the bars to your doorstep."}</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                {isArabic ? "5. إلغاء المعاملات" : "5. Cancellations"}
              </h2>
              <p>
                {isArabic 
                  ? "عمليات الشراء المكتملة غير قابلة للإلغاء."
                  : "Completed purchases cannot be canceled."}
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                {isArabic ? "6. إخلاء المسؤولية" : "6. Disclaimer"}
              </h2>
              <p>
                {isArabic 
                  ? "على الرغم من بذلنا أقصى جهد لضمان دقة واستقرار المنصة، إلا أننا لا نتحمل المسؤولية عن أي خسائر قد تنشأ بسبب تقلبات الأسواق العالمية أو قرارات الشراء التي يتخذها المستخدم."
                  : "While we make every effort to ensure the accuracy and stability of the platform, we are not liable for any losses arising from global market fluctuations or purchasing decisions made by the user."}
              </p>
            </section>

            {/* Section 7 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                {isArabic ? "7. التعديلات" : "7. Amendments"}
              </h2>
              <p>
                {isArabic 
                  ? "تحتفظ Golden Circle Trading بالحق في تعديل هذه الشروط في أي وقت. سيتم نشر أي تغييرات على هذه الصفحة وتُعتبر سارية فور نشرها."
                  : "Golden Circle Trading reserves the right to amend these terms at any time. Any changes will be posted on this page and will become effective immediately."}
              </p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
