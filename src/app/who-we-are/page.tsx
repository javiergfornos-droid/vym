import { NavDestinationShell } from '@/components/nav-destination-shell';
import { TopNav } from '@/components/top-nav';
import { getLanguage } from '@/lib/i18n';

type Props = { searchParams: { lang?: string } };

export default function WhoWeArePage({ searchParams }: Props) {
  const lang = getLanguage(searchParams.lang);

  return (
    <>
      <TopNav currentPath="/who-we-are" lang={lang} />
      <NavDestinationShell lang={lang} title={lang === 'es' ? 'Quiénes somos' : 'Who we are'} />
    </>
  );
}
