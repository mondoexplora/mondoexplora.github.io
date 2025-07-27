import { redirect } from 'next/navigation';

export default function LocaleHomePage({
  params,
}: {
  params: { lang: string };
}) {
  // Redirect to the main homepage for now
  // Later we can add language-specific content
  redirect('/');
} 