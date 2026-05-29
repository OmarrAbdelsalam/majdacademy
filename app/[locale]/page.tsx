import AcademyLanding2 from "../components/AcademyLanding2";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const normalizedLocale = locale === "en" ? "en" : "ar";

  return <AcademyLanding2 locale={normalizedLocale} />;
}
