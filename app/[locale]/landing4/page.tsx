import KodlandLanding from "@/app/components/KodlandLanding";

export default async function Landing4Page({
  params,
}: {
  params: Promise<{ locale: "ar" | "en" }>;
}) {
  const { locale } = await params;
  return <KodlandLanding locale={locale} />;
}
