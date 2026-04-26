import Link from 'next/link';

import { labels, type Language } from '@/lib/i18n';
import { LanguageSwitcher } from './language-switcher';

type Props = {
  lang: Language;
  currentPath: string;
};

const withLang = (path: string, lang: Language) => `${path}?lang=${lang}`;

export function TopNav({ lang, currentPath }: Props) {
  const t = labels[lang];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ivory/95 backdrop-blur">
      <nav className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <div>
          <p className="font-editorial text-2xl tracking-premium text-slateInk">{t.brand}</p>
          <p className="text-xs uppercase tracking-[0.15em] text-mutedInk">{t.subtitle}</p>
        </div>
        <div className="hidden items-center gap-7 text-sm text-slateInk lg:flex">
          <Link href={withLang('/#how-it-works', lang)}>{t.nav.how}</Link>
          <Link href={withLang('/#what-we-do', lang)}>{t.nav.what}</Link>
          <Link href={withLang('/#who-we-are', lang)}>{t.nav.who}</Link>
          <Link href={withLang('/#contact', lang)}>{t.nav.contact}</Link>
          <LanguageSwitcher current={lang} href={currentPath} />
          <Link
            className="rounded-full bg-accent px-5 py-2 text-xs uppercase tracking-[0.15em] text-ivory transition hover:bg-slateInk"
            href={withLang('/wizard/intro', lang)}
          >
            {t.cta}
          </Link>
        </div>
      </nav>
    </header>
  );
}
