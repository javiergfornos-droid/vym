import { ReactNode } from 'react';

import { type Language } from '@/lib/i18n';
import { WizardBottomNav, WizardInlineNavButtons } from './wizard-bottom-nav';

type Props = {
  lang: Language;
  title: string;
  description: ReactNode;
  children?: ReactNode;
  step: number;
  total: number;
  backHref?: string;
  nextHref?: string;
  inlineButtons?: boolean;
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
  inlineButtons = false,
}: Props) {
  return (
    <main className="mx-auto max-w-4xl px-6 pb-14 pt-28">
      <header className="mb-8 border-b border-line pb-6">
        <h1 className="font-editorial text-4xl text-slateInk">{title}</h1>
        <p className="mt-3 max-w-2xl text-mutedInk">{description}</p>
      </header>
      <section className="rounded-2xl border border-line bg-white p-8 shadow-whisper">
        <div className="space-y-8">
          {children}
          {inlineButtons ? <WizardInlineNavButtons backHref={backHref} lang={lang} nextHref={nextHref} /> : null}
        </div>
      </section>
      <WizardBottomNav backHref={backHref} hideButtons={inlineButtons} lang={lang} nextHref={nextHref} step={step} total={total} />
    </main>
  );
}
