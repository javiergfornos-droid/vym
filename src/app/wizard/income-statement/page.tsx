import { IncomeStatementForm } from '@/components/income-statement-form';
import { TopNav } from '@/components/top-nav';
import { WizardStepShell } from '@/components/wizard-step-shell';
import { getLanguage } from '@/lib/i18n';

type Props = { searchParams: { lang?: string; unit?: string; fiscalYear?: string } };

const UNIT_LABELS: Record<string, string> = {
  eur: 'Euros',
  'k-eur': 'Miles de euros',
  'm-eur': 'Millones de euros',
};

export default function IncomeStatementPage({ searchParams }: Props) {
  const lang = getLanguage(searchParams.lang);
  const unit = searchParams.unit ?? 'eur';
  const unitLabel = UNIT_LABELS[unit] ?? 'Euros';
  const fiscalYear = searchParams.fiscalYear ?? '2025';

  return (
    <>
      <TopNav currentPath="/wizard/income-statement" lang={lang} />
      <WizardStepShell
        backHref="/wizard/unit-fiscal-year"
        description={
          lang === 'es'
            ? `Introduce la cuenta de resultados del ejercicio ${fiscalYear}.`
            : `Enter the income statement for fiscal year ${fiscalYear}.`
        }
        inlineButtons
        lang={lang}
        nextHref={`/wizard/balance-sheet?unit=${unit}&fiscalYear=${fiscalYear}`}
        step={4}
        title={lang === 'es' ? 'Cuenta de resultados' : 'Income statement'}
        total={7}
      >
        <IncomeStatementForm lang={lang} unitLabel={unitLabel} />
      </WizardStepShell>
    </>
  );
}
