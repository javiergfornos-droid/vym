import { WizardStepShell } from '@/components/wizard-step-shell';
import { type Language } from '@/lib/i18n';

type Props = {
  lang: Language;
};

export function RevenueAssumptionsStepByStep({ lang }: Props) {
  return (
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
      <p className="text-mutedInk">
        {lang === 'es' ? 'Placeholder para lógica de ingresos (fase 2).' : 'Placeholder for revenue logic (stage 2).'}
      </p>
    </WizardStepShell>
  );
}
