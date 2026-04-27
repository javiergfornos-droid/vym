import { ReactNode } from 'react';

import { type Language } from '@/lib/i18n';
import { WizardBottomNav } from './wizard-bottom-nav';

type Props = {
  lang: Language;
  title: string;
  description: ReactNode;
  children?: ReactNode;
  step: number;
  total: number;
  backHref?: string;
  nextHref?: string;
};

export function WizardStepShell({
  lang,
  title,
  description,
  children,
  step,
  total,
  backHref,
  nextHref,
}: Props) {
  return (
    <main className="mx-auto max-w-4xl px-6 pb-14 pt-28">
      <header className="mb-8 border-b border-line pb-6">
        <h1 className="font-editorial text-4xl text-slateInk">{title}</h1>
        <p className="mt-3 max-w-2xl text-mutedInk">{description}</p>
      </header>
      <section className="rounded-2xl border border-line bg-white p-8 shadow-whisper">
        {children}
        <div className="mt-8 flex justify-end">
          <WizardBottomNav
            backHref={backHref}
            lang={lang}
            mode="buttons"
            nextHref={nextHref}
            step={step}
            total={total}
          />
        </div>
      </section>
      <WizardBottomNav backHref={backHref} lang={lang} mode="meta" nextHref={nextHref} step={step} total={total} />
    </main>
  );
}
