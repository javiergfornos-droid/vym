import { TopNav } from '@/components/top-nav';
import { WizardStepShell } from '@/components/wizard-step-shell';
import { getLanguage } from '@/lib/i18n';

type Props = { searchParams: { lang?: string } };

export default function UnitFiscalYearPage({ searchParams }: Props) {
  const lang = getLanguage(searchParams.lang);

  return (
    <>
      <TopNav currentPath="/wizard/unit-fiscal-year" lang={lang} />
      <WizardStepShell
        backHref="/wizard/company-identification"
        description={
          lang === 'es'
            ? 'Define la unidad monetaria y el último ejercicio fiscal para normalizar la información cargada.'
            : 'Set currency unit and latest fiscal year to normalize loaded information.'
        }
        lang={lang}
        nextHref="/wizard/income-statement"
        step={3}
        title={lang === 'es' ? 'Unidad y último ejercicio fiscal' : 'Unit + latest fiscal year'}
        total={7}
      >
        <p className="text-mutedInk">{lang === 'es' ? 'Placeholder para selección de divisa y año.' : 'Placeholder for currency and year selection.'}</p>
      </WizardStepShell>
    </>
  );
}
