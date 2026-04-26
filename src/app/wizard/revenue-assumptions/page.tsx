import { TopNav } from '@/components/top-nav';
import { WizardStepShell } from '@/components/wizard-step-shell';
import { getLanguage } from '@/lib/i18n';

type Props = { searchParams: { lang?: string } };

export default function RevenueAssumptionsPage({ searchParams }: Props) {
  const lang = getLanguage(searchParams.lang);

  return (
    <>
      <TopNav currentPath="/wizard/revenue-assumptions" lang={lang} />
      <WizardStepShell
        backHref="/wizard/transition-assumptions"
        description={
          lang === 'es'
            ? 'Primera pantalla de supuestos de ingresos: base para modelar crecimiento, precio y volumen.'
            : 'First revenue assumptions screen: foundation for modeling growth, price, and volume.'
        }
        lang={lang}
        step={7}
        title={lang === 'es' ? 'Supuestos de ingresos' : 'Revenue assumptions'}
        total={7}
      >
        <p className="text-mutedInk">{lang === 'es' ? 'Placeholder para lógica de ingresos (fase 2).' : 'Placeholder for revenue logic (stage 2).'}</p>
      </WizardStepShell>
    </>
  );
}
