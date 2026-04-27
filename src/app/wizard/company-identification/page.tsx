import { TopNav } from '@/components/top-nav';
import { CompanyIdentificationForm } from '@/components/company-identification-form';
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
        inlineButtons
        lang={lang}
        nextHref="/wizard/unit-fiscal-year"
        step={2}
        title={labels.title}
        total={7}
      >
        <CompanyIdentificationForm
          foundationYears={FOUNDATION_YEARS}
          lang={lang}
          labels={labels}
          provinces={PROVINCES}
          revenueOptions={REVENUE_OPTIONS}
        />
      </WizardStepShell>
    </>
  );
}
