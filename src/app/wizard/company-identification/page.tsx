import { TopNav } from '@/components/top-nav';
import { WizardStepShell } from '@/components/wizard-step-shell';
import { getLanguage } from '@/lib/i18n';

type Props = { searchParams: { lang?: string } };

const REVENUE_OPTIONS = ['<1m', '1-3m', '3-5m', '5-10m', '>10m'];
const PROVINCES = [
  'Álava',
  'Albacete',
  'Alicante',
  'Almería',
  'Asturias',
  'Ávila',
  'Badajoz',
  'Barcelona',
  'Burgos',
  'Cáceres',
  'Cádiz',
  'Cantabria',
  'Castellón',
  'Ciudad Real',
  'Córdoba',
  'Cuenca',
  'Girona',
  'Granada',
  'Guadalajara',
  'Guipúzcoa',
  'Huelva',
  'Huesca',
  'Illes Balears',
  'Jaén',
  'La Coruña',
  'La Rioja',
  'Las Palmas',
  'León',
  'Lleida',
  'Lugo',
  'Madrid',
  'Málaga',
  'Murcia',
  'Navarra',
  'Ourense',
  'Palencia',
  'Pontevedra',
  'Salamanca',
  'Santa Cruz de Tenerife',
  'Segovia',
  'Sevilla',
  'Soria',
  'Tarragona',
  'Teruel',
  'Toledo',
  'Valencia',
  'Valladolid',
  'Vizcaya',
  'Zamora',
  'Zaragoza',
];

const FOUNDATION_YEARS = Array.from({ length: 2026 - 1960 + 1 }, (_, index) => String(2026 - index));

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
          selectPlaceholder: 'Selecciona una opción',
          single: 'Único Accionista',
          multiple: 'Múltiples Accionistas',
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
          nace: 'NACE',
          sector: 'Sector',
          province: 'Province',
          revenue: 'Approximate revenue',
          foundingYear: 'Founding year',
          businessType: 'Business type',
          selectPlaceholder: 'Select one option',
          single: 'Single Shareholder',
          multiple: 'Multiple Shareholders',
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
                <input
                  className="w-full rounded-xl border border-line bg-ivory/60 px-4 py-3 text-slateInk outline-none transition focus:border-accent"
                  type="text"
                />
              </label>
              <label>
                <span className="mb-2 block text-sm text-mutedInk">{labels.website}</span>
                <input
                  className="w-full rounded-xl border border-line bg-ivory/60 px-4 py-3 text-slateInk outline-none transition focus:border-accent"
                  type="url"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label>
                <span className="mb-2 block text-sm text-mutedInk">{labels.nace}</span>
                <input
                  className="w-full rounded-xl border border-line bg-ivory/60 px-4 py-3 text-slateInk outline-none transition focus:border-accent"
                  type="text"
                />
              </label>
              <label>
                <span className="mb-2 block text-sm text-mutedInk">{labels.sector}</span>
                <input
                  className="w-full rounded-xl border border-line bg-ivory/60 px-4 py-3 text-slateInk outline-none transition focus:border-accent"
                  type="text"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label>
                <span className="mb-2 block text-sm text-mutedInk">{labels.province}</span>
                <select className="w-full rounded-xl border border-line bg-ivory/60 px-4 py-3 text-slateInk outline-none transition focus:border-accent">
                  <option value="">{labels.selectPlaceholder}</option>
                  {PROVINCES.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </label>

              <div>
                <span className="mb-2 block text-sm text-mutedInk">{labels.revenue}</span>
                <div className="flex flex-wrap gap-2">
                  {REVENUE_OPTIONS.map((option) => (
                    <button
                      key={option}
                      className="rounded-full border border-line px-4 py-2 text-sm text-slateInk transition hover:border-accent"
                      type="button"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <label>
                <span className="mb-2 block text-sm text-mutedInk">{labels.foundingYear}</span>
                <select className="w-full rounded-xl border border-line bg-ivory/60 px-4 py-3 text-slateInk outline-none transition focus:border-accent">
                  <option value="">{labels.selectPlaceholder}</option>
                  {FOUNDATION_YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>

              <div>
                <span className="mb-2 block text-sm text-mutedInk">{labels.businessType}</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="rounded-full border border-line px-4 py-2 text-sm text-slateInk transition hover:border-accent"
                    type="button"
                  >
                    {labels.single}
                  </button>
                  <button
                    className="rounded-full border border-line px-4 py-2 text-sm text-slateInk transition hover:border-accent"
                    type="button"
                  >
                    {labels.multiple}
                  </button>
                </div>
              </div>
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
