import { NavDestinationShell } from '@/components/nav-destination-shell';
import { TopNav } from '@/components/top-nav';
import { getLanguage } from '@/lib/i18n';

type Props = { searchParams: { lang?: string } };

export default function WhatWeDoPage({ searchParams }: Props) {
  const lang = getLanguage(searchParams.lang);

  return (
    <>
      <TopNav currentPath="/what-we-do" lang={lang} />
      <NavDestinationShell lang={lang} title={lang === 'es' ? 'Qué hacemos' : 'What we do'} />
    </>
  );
}
