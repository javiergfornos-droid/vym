import { TopNav } from '@/components/top-nav';
import { WizardStepShell } from '@/components/wizard-step-shell';
import { getLanguage } from '@/lib/i18n';

type Props = { searchParams: { lang?: string } };

export default function TransitionAssumptionsPage({ searchParams }: Props) {
  const lang = getLanguage(searchParams.lang);

  return (
    <>
      <TopNav currentPath="/wizard/transition-assumptions" lang={lang} />
      <WizardStepShell
        backHref="/wizard/balance-sheet"
        description={
          lang === 'es'
            ? 'Pantalla puente para preparar el bloque de supuestos y criterios de proyección.'
            : 'Bridge screen to prepare assumptions block and projection criteria.'
        }
        inlineButtons
        lang={lang}
        nextHref="/wizard/revenue-assumptions"
        step={6}
        title={lang === 'es' ? 'Transición a supuestos' : 'Transition to assumptions'}
        total={7}
      >
        <p className="text-mutedInk">{lang === 'es' ? 'Placeholder para guía metodológica de supuestos.' : 'Placeholder for assumptions methodology guide.'}</p>
      </WizardStepShell>
    </>
  );
}
