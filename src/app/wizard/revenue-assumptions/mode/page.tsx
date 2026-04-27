import Link from 'next/link';

import { TopNav } from '@/components/top-nav';
import { WizardBottomNav } from '@/components/wizard-bottom-nav';
import { getLanguage } from '@/lib/i18n';

type Props = { searchParams: { lang?: string } };

const withLang = (href: string, lang: string) => `${href}${href.includes('?') ? '&' : '?'}lang=${lang}`;

export default function RevenueAssumptionsModePage({ searchParams }: Props) {
  const lang = getLanguage(searchParams.lang);

  return (
    <>
      <TopNav currentPath="/wizard/revenue-assumptions" lang={lang} />
      <main className="mx-auto max-w-4xl px-6 pb-14 pt-28">
        <section className="rounded-2xl border border-line bg-white p-8 shadow-whisper">
          <h1 className="font-editorial text-4xl tracking-premium text-slateInk md:text-5xl">
            {lang === 'es' ? '¿Cómo quieres definir tus hipótesis?' : 'How would you like to define your assumptions?'}
          </h1>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <Link
              className="group rounded-2xl border border-line bg-ivory p-6 transition hover:border-accent"
              href={withLang('/wizard/revenue-assumptions?track=speed', lang)}
            >
              <h2 className="font-editorial text-3xl text-slateInk">Speed-track</h2>
              <p className="mt-3 text-mutedInk">
                {lang === 'es' ? 'Introduce tus hipótesis en un solo paso.' : 'Enter your assumptions in a single step.'}
              </p>
            </Link>

            <Link
              className="group rounded-2xl border border-line bg-ivory p-6 transition hover:border-accent"
              href={withLang('/wizard/revenue-assumptions?track=step', lang)}
            >
              <h2 className="font-editorial text-3xl text-slateInk">{lang === 'es' ? 'Paso a paso' : 'Step by step'}</h2>
              <p className="mt-3 text-mutedInk">
                {lang === 'es'
                  ? 'Analizaremos paso a paso para una comprensión detallada y comparando con benchmarks del sector.'
                  : 'We will analyze them step by step for a more detailed understanding and to compare them against sector benchmarks.'}
              </p>
            </Link>
          </div>
        </section>

        <WizardBottomNav backHref="/wizard/transition-assumptions" lang={lang} nextHref={undefined} step={7} total={7} />
      </main>
    </>
  );
}
