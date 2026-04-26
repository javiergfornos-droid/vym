import Link from 'next/link';

import { type Language } from '@/lib/i18n';

type Props = {
  current: Language;
  href: string;
};

const buildHref = (href: string, lang: Language) => {
  const separator = href.includes('?') ? '&' : '?';
  return `${href}${separator}lang=${lang}`;
};

export function LanguageSwitcher({ current, href }: Props) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-line px-3 py-1 text-xs uppercase tracking-[0.2em]">
      <Link className={current === 'es' ? 'text-slateInk' : 'text-mutedInk'} href={buildHref(href, 'es')}>
        ES
      </Link>
      <span className="text-line">/</span>
      <Link className={current === 'en' ? 'text-slateInk' : 'text-mutedInk'} href={buildHref(href, 'en')}>
        EN
      </Link>
    </div>
  );
}
