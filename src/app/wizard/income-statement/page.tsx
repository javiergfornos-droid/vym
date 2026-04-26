import { TopNav } from '@/components/top-nav';
import { WizardStepShell } from '@/components/wizard-step-shell';
import { getLanguage } from '@/lib/i18n';

type Props = { searchParams: { lang?: string } };

export default function IncomeStatementPage({ searchParams }: Props) {
  const lang = getLanguage(searchParams.lang);

  return (
    <>
      <TopNav currentPath="/wizard/income-statement" lang={lang} />
      <WizardStepShell
        backHref="/wizard/unit-fiscal-year"
        description={
          lang === 'es'
            ? 'Plantilla inicial para cargar cuenta de resultados histórica y revisar estructura de márgenes.'
            : 'Initial template to upload historical income statement and review margin structure.'
        }
        lang={lang}
        nextHref="/wizard/balance-sheet"
        step={4}
        title={lang === 'es' ? 'Cuenta de resultados' : 'Income statement'}
        total={7}
      >
        <p className="text-mutedInk">{lang === 'es' ? 'Placeholder para tabla de P&L.' : 'Placeholder for P&L table.'}</p>
      </WizardStepShell>
    </>
  );
}
