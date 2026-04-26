import Link from 'next/link';

import { TopNav } from '@/components/top-nav';
import { WizardStepShell } from '@/components/wizard-step-shell';
import { getLanguage } from '@/lib/i18n';

type Props = { searchParams: { lang?: string; unit?: string; fiscalYear?: string } };

type UnitValue = 'eur' | 'k-eur' | 'm-eur';

const UNIT_OPTIONS: Array<{ value: UnitValue; label: string }> = [
  { value: 'eur', label: 'Euros' },
  { value: 'k-eur', label: 'Miles de euros' },
  { value: 'm-eur', label: 'Millones de euros' },
];

const YEAR_OPTIONS = ['2025', '2024'];

export default function UnitFiscalYearPage({ searchParams }: Props) {
  const lang = getLanguage(searchParams.lang);
  const selectedUnit = UNIT_OPTIONS.find((option) => option.value === searchParams.unit)?.value ?? 'eur';
  const selectedYear = YEAR_OPTIONS.includes(searchParams.fiscalYear ?? '') ? (searchParams.fiscalYear as string) : '2025';
  const nextHref = `/wizard/income-statement?unit=${selectedUnit}&fiscalYear=${selectedYear}`;

  const labels =
    lang === 'es'
      ? {
          title: 'Unidad y último ejercicio fiscal',
          description: 'Define la unidad y el último ejercicio fiscal para normalizar la información cargada.',
          unit: 'Unidad',
          latestFiscalYear: 'Último ejercicio fiscal',
        }
      : {
          title: 'Unit and latest fiscal year',
          description: 'Set unit and latest fiscal year to normalize loaded information.',
          unit: 'Unit',
          latestFiscalYear: 'Latest fiscal year',
        };

  return (
    <>
      <TopNav currentPath="/wizard/unit-fiscal-year" lang={lang} />
      <WizardStepShell
        backHref="/wizard/company-identification"
        description={labels.description}
        lang={lang}
        nextHref={nextHref}
        step={3}
        title={labels.title}
        total={7}
      >
        <div className="space-y-8">
          <section>
            <h2 className="mb-3 text-sm text-mutedInk">{labels.unit}</h2>
            <div className="flex flex-wrap gap-3">
              {UNIT_OPTIONS.map((option) => {
                const active = option.value === selectedUnit;
                const href = `/wizard/unit-fiscal-year?lang=${lang}&unit=${option.value}&fiscalYear=${selectedYear}`;
                return (
                  <Link
                    key={option.value}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      active
                        ? 'border border-accent bg-accent text-ivory'
                        : 'border border-line text-slateInk hover:border-accent'
                    }`}
                    href={href}
                  >
                    {option.label}
                  </Link>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm text-mutedInk">{labels.latestFiscalYear}</h2>
            <div className="flex flex-wrap gap-3">
              {YEAR_OPTIONS.map((year) => {
                const active = year === selectedYear;
                const href = `/wizard/unit-fiscal-year?lang=${lang}&unit=${selectedUnit}&fiscalYear=${year}`;
                return (
                  <Link
                    key={year}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      active
                        ? 'border border-accent bg-accent text-ivory'
                        : 'border border-line text-slateInk hover:border-accent'
                    }`}
                    href={href}
                  >
                    {year}
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </WizardStepShell>
    </>
  );
}
