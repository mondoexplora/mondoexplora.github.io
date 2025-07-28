import { redirect } from 'next/navigation';

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  // Redirect to the main homepage for now
  // Later we can add language-specific content
  redirect('/');
}

export async function generateStaticParams() {
  return [
    { lang: 'en' },
    { lang: 'es' },
    { lang: 'fr' },
    { lang: 'it' }
  ];
} 