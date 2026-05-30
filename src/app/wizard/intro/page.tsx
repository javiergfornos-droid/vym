import { TopNav } from '@/components/top-nav';
import { WizardStepShell } from '@/components/wizard-step-shell';
import { getLanguage } from '@/lib/i18n';

type Props = { searchParams: { lang?: string } };

export default function IntroPage({ searchParams }: Props) {
  const lang = getLanguage(searchParams.lang);
  const introCopy =
    lang === 'es'
      ? {
          title: 'Antes de empezar',
          body:
            'Construiremos una primera valoración a partir de tus datos financieros y de las hipótesis que definas en el modelo. Puedes avanzar con información mínima y ajustar cada supuesto antes de ver el resultado.',
        }
      : {
          title: 'Before you start',
          body:
            'We will build an initial valuation based on your financial information and the assumptions you define in the model. You can continue with minimal information and adjust each assumption before seeing the result.',
        };

  return (
    <>
      <TopNav currentPath="/wizard/intro" lang={lang} />
      <WizardStepShell
        backHref="/"
        description={introCopy.body}
        lang={lang}
        nextHref="/wizard/company-identification"
        step={1}
        title={introCopy.title}
        total={7}
      />
    </>
  );
}
