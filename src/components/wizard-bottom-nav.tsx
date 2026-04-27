import Link from 'next/link';

import { labels, type Language } from '@/lib/i18n';

type Props = {
  lang: Language;
  backHref?: string;
  nextHref?: string;
  step: number;
  total: number;
  mode?: 'full' | 'buttons' | 'meta';
};

const withLang = (href: string, lang: Language) => `${href}${href.includes('?') ? '&' : '?'}lang=${lang}`;

export function WizardBottomNav({ lang, backHref, nextHref, step, total, mode = 'full' }: Props) {
  const t = labels[lang].wizard;

  const buttons = (
    <div className="flex items-center justify-end gap-3">
      {backHref ? (
        <Link className="rounded-full border border-line px-6 py-3 text-base" href={withLang(backHref, lang)}>
          {t.back}
        </Link>
      ) : (
        <span className="rounded-full border border-line px-6 py-3 text-base text-mutedInk">{t.back}</span>
      )}
      {nextHref ? (
        <Link className="rounded-full bg-accent px-6 py-3 text-base text-ivory" href={withLang(nextHref, lang)}>
          {t.next}
        </Link>
      ) : (
        <span className="rounded-full bg-line px-6 py-3 text-base text-mutedInk">{t.next}</span>
      )}
    </div>
  );

  if (mode === 'buttons') {
    return buttons;
  }

  const meta = (
    <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-4">
      <button className="text-sm text-slateInk underline decoration-line underline-offset-4">{t.doubts}</button>
      <div className="flex min-w-44 justify-end gap-2">
        {Array.from({ length: total }, (_, index) => {
          const filled = index < step;
          return (
            <span
              key={`progress-${index + 1}`}
              className={`h-3 w-3 rounded-[2px] border ${filled ? 'border-accent bg-accent' : 'border-line bg-white'}`}
            />
          );
        })}
      </div>
    </div>
  );

  if (mode === 'meta') {
    return <footer className="mt-8 border-t border-line pt-6">{meta}</footer>;
  }

  return (
    <footer className="mt-8 border-t border-line pt-6">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-4">
        {buttons}
        <button className="text-sm text-slateInk underline decoration-line underline-offset-4">{t.doubts}</button>
        <div className="flex min-w-44 justify-end gap-2">
          {Array.from({ length: total }, (_, index) => {
            const filled = index < step;
            return (
              <span
                key={`progress-${index + 1}`}
                className={`h-3 w-3 rounded-[2px] border ${filled ? 'border-accent bg-accent' : 'border-line bg-white'}`}
              />
            );
          })}
        </div>
      </div>
    </footer>
  );
}
