import { TopNav } from '@/components/top-nav';
import { WizardStepShell } from '@/components/wizard-step-shell';
import { getLanguage } from '@/lib/i18n';

type Props = { searchParams: { lang?: string } };

export default function BalanceSheetPage({ searchParams }: Props) {
  const lang = getLanguage(searchParams.lang);

  return (
    <>
      <TopNav currentPath="/wizard/balance-sheet" lang={lang} />
      <WizardStepShell
        backHref="/wizard/income-statement"
        description={
          lang === 'es'
            ? 'Estructura para cargar balance histórico antes de pasar a hipótesis operativas.'
            : 'Structure for loading historical balance sheet before moving to operating assumptions.'
        }
        lang={lang}
        nextHref="/wizard/transition-assumptions"
        step={5}
        title={lang === 'es' ? 'Balance de situación' : 'Balance sheet'}
        total={7}
      >
        <p className="text-mutedInk">{lang === 'es' ? 'Placeholder para activos, pasivos y equity.' : 'Placeholder for assets, liabilities, and equity.'}</p>
      </WizardStepShell>
    </>
  );
}
