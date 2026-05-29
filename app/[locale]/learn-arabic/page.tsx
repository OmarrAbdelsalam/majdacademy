import { redirect } from "next/navigation";

export default async function LearnArabicPage({
  params,
}: {
  params: Promise<{ locale: "ar" | "en" }>;
}) {
  const { locale } = await params;

  // Placeholder — redirect to main page for now
  // TODO: Build dedicated "Learn Arabic for Non-Native Speakers" landing page
  redirect(`/${locale}`);
}
