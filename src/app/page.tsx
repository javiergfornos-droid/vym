import { SectionShell } from '@/components/section-shell';
import { TopNav } from '@/components/top-nav';
import { getLanguage, labels } from '@/lib/i18n';

type Props = {
  searchParams: { lang?: string };
};

export default function Home({ searchParams }: Props) {
  const lang = getLanguage(searchParams.lang);
  const t = labels[lang];

  return (
    <>
      <TopNav currentPath="/" lang={lang} />
      <main className="pt-24">
        <section className="border-b border-line py-28">
          <div className="mx-auto max-w-6xl px-6">
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-mutedInk">{t.heroKicker}</p>
            <h1 className="max-w-3xl font-editorial text-6xl leading-tight tracking-premium text-slateInk">{t.heroTitle}</h1>
            <p className="mt-8 max-w-2xl text-lg text-mutedInk">{t.heroBody}</p>
          </div>
        </section>

        <SectionShell eyebrow="01" id="what-we-do" title={t.sections.benefits}>
          <p className="text-mutedInk">
            {lang === 'es'
              ? 'Bloques modulares para valorar compañías con consistencia metodológica, narrativa clara y outputs listos para comité.'
              : 'Modular blocks to value companies with methodological consistency, clear narrative, and committee-ready outputs.'}
          </p>
        </SectionShell>

        <SectionShell eyebrow="02" id="how-it-works" title={t.sections.how}>
          <p className="text-mutedInk">
            {lang === 'es'
              ? 'Un asistente paso a paso guía desde la identificación de empresa hasta supuestos de ingresos, preservando trazabilidad en cada decisión.'
              : 'A step-by-step assistant guides from company identification to revenue assumptions while preserving traceability in each decision.'}
          </p>
        </SectionShell>

        <SectionShell eyebrow="03" id="who-we-are" title={t.sections.products}>
          <p className="text-mutedInk">
            {lang === 'es'
              ? 'Diseñado para founders, CFOs e inversores que valoran precisión, discreción y estética editorial en finanzas corporativas.'
              : 'Designed for founders, CFOs, and investors who value precision, discretion, and an editorial aesthetic in corporate finance.'}
          </p>
        </SectionShell>

        <footer id="contact" className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-sm uppercase tracking-[0.18em] text-mutedInk">{t.footer}</p>
        </footer>
      </main>
    </>
  );
}
