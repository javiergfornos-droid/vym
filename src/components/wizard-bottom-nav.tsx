import Link from 'next/link';

import { labels, type Language } from '@/lib/i18n';

type Props = {
  lang: Language;
  backHref?: string;
  nextHref?: string;
  step: number;
  total: number;
};

const withLang = (href: string, lang: Language) => `${href}?lang=${lang}`;

export function WizardBottomNav({ lang, backHref, nextHref, step, total }: Props) {
  const t = labels[lang].wizard;
  const progress = Math.round((step / total) * 100);

  return (
    <footer className="mt-16 border-t border-line pt-6">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-3">
          {backHref ? (
            <Link className="rounded-full border border-line px-4 py-2 text-sm" href={withLang(backHref, lang)}>
              {t.back}
            </Link>
          ) : (
            <span className="rounded-full border border-line px-4 py-2 text-sm text-mutedInk">{t.back}</span>
          )}
          {nextHref ? (
            <Link className="rounded-full bg-accent px-4 py-2 text-sm text-ivory" href={withLang(nextHref, lang)}>
              {t.next}
            </Link>
          ) : (
            <span className="rounded-full bg-line px-4 py-2 text-sm text-mutedInk">{t.next}</span>
          )}
        </div>
        <button className="text-sm text-slateInk underline decoration-line underline-offset-4">{t.doubts}</button>
        <div className="min-w-44">
          <p className="text-xs uppercase tracking-[0.16em] text-mutedInk">
            {t.progress}: {progress}%
          </p>
          <p className="text-sm text-slateInk">
            {t.stepLabel} {step}/{total}
          </p>
        </div>
      </div>
    </footer>
  );
}
