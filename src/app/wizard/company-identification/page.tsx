import { TopNav } from '@/components/top-nav';
import { WizardStepShell } from '@/components/wizard-step-shell';
import { getLanguage } from '@/lib/i18n';

type Props = { searchParams: { lang?: string } };

export default function CompanyIdentificationPage({ searchParams }: Props) {
  const lang = getLanguage(searchParams.lang);
  const labels =
    lang === 'es'
      ? {
          title: 'Cuéntanos algo sobre tu empresa',
          subtitlePrefix: 'Cuanta más información compartas, mejor podremos contextualizar tu valoración.',
          subtitleEmphasis: 'No es obligatorio',
          subtitleSuffix: 'identificar la empresa para continuar.',
          companyName: 'Nombre de la empresa',
          website: 'Sitio web',
          nace: 'Código NACE',
          sector: 'Sector',
          province: 'Provincia',
          revenue: 'Facturación aproximada',
          foundingYear: 'Año de fundación',
          businessType: 'Tipo de empresa',
          sidebar:
            'Esta información nos ayuda a comparar tu empresa con referencias sectoriales más cercanas. Si prefieres, puedes continuar con información mínima.',
        }
      : {
          title: 'Tell us something about your company',
          subtitlePrefix: 'The more information you provide, the better we can contextualize your valuation.',
          subtitleEmphasis: 'It is not required',
          subtitleSuffix: 'to identify the company in order to continue.',
          companyName: 'Company name',
          website: 'Website',
          nace: 'NACE code',
          sector: 'Sector',
          province: 'Province',
          revenue: 'Approximate revenue',
          foundingYear: 'Founding year',
          businessType: 'Business type',
          sidebar:
            'This information helps us compare your company with more relevant sector references. If you prefer, you can continue with minimal information.',
        };

  return (
    <>
      <TopNav currentPath="/wizard/company-identification" lang={lang} />
      <WizardStepShell
        backHref="/wizard/intro"
        description={
          <>
            {labels.subtitlePrefix}{' '}
            <strong>{labels.subtitleEmphasis}</strong> {labels.subtitleSuffix}
          </>
        }
        lang={lang}
        nextHref="/wizard/unit-fiscal-year"
        step={2}
        title={labels.title}
        total={7}
      >
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="grid gap-4 md:grid-cols-3">
              <label className="md:col-span-2">
                <span className="mb-2 block text-sm text-mutedInk">{labels.companyName}</span>
                <input className="w-full rounded-xl border border-line bg-ivory/60 px-4 py-3 text-slateInk outline-none transition focus:border-accent" type="text" />
              </label>
              <label>
                <span className="mb-2 block text-sm text-mutedInk">{labels.website}</span>
                <input className="w-full rounded-xl border border-line bg-ivory/60 px-4 py-3 text-slateInk outline-none transition focus:border-accent" type="url" />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label>
                <span className="mb-2 block text-sm text-mutedInk">{labels.nace}</span>
                <input className="w-full rounded-xl border border-line bg-ivory/60 px-4 py-3 text-slateInk outline-none transition focus:border-accent" type="text" />
              </label>
              <label>
                <span className="mb-2 block text-sm text-mutedInk">{labels.sector}</span>
                <input className="w-full rounded-xl border border-line bg-ivory/60 px-4 py-3 text-slateInk outline-none transition focus:border-accent" type="text" />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label>
                <span className="mb-2 block text-sm text-mutedInk">{labels.province}</span>
                <input className="w-full rounded-xl border border-line bg-ivory/60 px-4 py-3 text-slateInk outline-none transition focus:border-accent" type="text" />
              </label>
              <label>
                <span className="mb-2 block text-sm text-mutedInk">{labels.revenue}</span>
                <input className="w-full rounded-xl border border-line bg-ivory/60 px-4 py-3 text-slateInk outline-none transition focus:border-accent" type="text" />
              </label>
              <label>
                <span className="mb-2 block text-sm text-mutedInk">{labels.foundingYear}</span>
                <input className="w-full rounded-xl border border-line bg-ivory/60 px-4 py-3 text-slateInk outline-none transition focus:border-accent" type="number" />
              </label>
              <label>
                <span className="mb-2 block text-sm text-mutedInk">{labels.businessType}</span>
                <input className="w-full rounded-xl border border-line bg-ivory/60 px-4 py-3 text-slateInk outline-none transition focus:border-accent" type="text" />
              </label>
            </div>
          </div>
          <aside className="h-fit rounded-2xl border border-line bg-ivory/70 p-5 text-sm leading-relaxed text-mutedInk">
            {labels.sidebar}
          </aside>
        </div>
      </WizardStepShell>
    </>
  );
}
