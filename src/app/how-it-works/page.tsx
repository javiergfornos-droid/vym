import { NavDestinationShell } from '@/components/nav-destination-shell';
import { TopNav } from '@/components/top-nav';
import { getLanguage } from '@/lib/i18n';

type Props = { searchParams: { lang?: string } };

export default function HowItWorksPage({ searchParams }: Props) {
  const lang = getLanguage(searchParams.lang);

  return (
    <>
      <TopNav currentPath="/how-it-works" lang={lang} />
      <NavDestinationShell lang={lang} title={lang === 'es' ? 'Cómo funciona' : 'How it works'} />
    </>
  );
}
