import { TopNav } from '@/components/top-nav';
import { WizardStepShell } from '@/components/wizard-step-shell';
import { getLanguage } from '@/lib/i18n';

type Props = { searchParams: { lang?: string } };

export default function IntroPage({ searchParams }: Props) {
  const lang = getLanguage(searchParams.lang);

  return (
    <>
      <TopNav currentPath="/wizard/intro" lang={lang} />
      <WizardStepShell
        backHref="/"
        description={
          lang === 'es'
            ? 'Comenzamos con una introducción breve del método VYM antes de capturar los datos financieros.'
            : 'We begin with a brief introduction to the VYM method before capturing financial data.'
        }
        lang={lang}
        nextHref="/wizard/company-identification"
        step={1}
        title={lang === 'es' ? 'Introducción al proceso' : 'Process introduction'}
        total={7}
      >
        <p className="text-mutedInk">{lang === 'es' ? 'Pantalla base preparada para contenido guiado.' : 'Base screen prepared for guided content.'}</p>
      </WizardStepShell>
    </>
  );
}
