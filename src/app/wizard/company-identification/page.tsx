import { TopNav } from '@/components/top-nav';
import { WizardStepShell } from '@/components/wizard-step-shell';
import { getLanguage } from '@/lib/i18n';

type Props = { searchParams: { lang?: string } };

export default function CompanyIdentificationPage({ searchParams }: Props) {
  const lang = getLanguage(searchParams.lang);

  return (
    <>
      <TopNav currentPath="/wizard/company-identification" lang={lang} />
      <WizardStepShell
        backHref="/wizard/intro"
        description={
          lang === 'es'
            ? 'Identifica la compañía, su estructura legal y el sector económico (NACE) para enmarcar la valoración.'
            : 'Identify the company, legal structure, and sector (NACE) to frame the valuation.'
        }
        lang={lang}
        nextHref="/wizard/unit-fiscal-year"
        step={2}
        title={lang === 'es' ? 'Identificación y sector/NACE' : 'Company identification + sector/NACE'}
        total={7}
      >
        <p className="text-mutedInk">{lang === 'es' ? 'Placeholder para formulario de identificación.' : 'Placeholder for identification form.'}</p>
      </WizardStepShell>
    </>
  );
}
