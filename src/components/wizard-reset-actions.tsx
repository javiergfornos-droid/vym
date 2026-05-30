'use client';

import { useRouter } from 'next/navigation';

import { clearAllWizardStorage } from '@/lib/wizard-storage';

type Props = {
  lang: 'es' | 'en';
  onClearScreen: () => void;
};

export function WizardResetActions({ lang, onClearScreen }: Props) {
  const router = useRouter();

  const labels =
    lang === 'es'
      ? {
          clearScreen: 'Limpiar esta pantalla',
          returnToStart: 'Volver al inicio',
        }
      : {
          clearScreen: 'Clear this screen',
          returnToStart: 'Return to start',
        };

  const handleReturnToStart = () => {
    clearAllWizardStorage();
    router.push(`/wizard/intro?lang=${lang}`);
  };

  return (
    <div className="flex flex-wrap justify-end gap-2">
      <button
        className="rounded-full border border-line px-4 py-2 font-editorial text-sm text-slateInk transition hover:border-accent"
        type="button"
        onClick={onClearScreen}
      >
        {labels.clearScreen}
      </button>
      <button
        className="rounded-full border border-line px-4 py-2 font-editorial text-sm text-slateInk transition hover:border-accent"
        type="button"
        onClick={handleReturnToStart}
      >
        {labels.returnToStart}
      </button>
    </div>
  );
}
