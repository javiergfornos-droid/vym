'use client';

import { useMemo, useState } from 'react';

import { WizardStepShell } from '@/components/wizard-step-shell';
import { type Language } from '@/lib/i18n';

type RevenueMode = 'constant-growth' | 'year-by-year-growth' | 'year-5-target' | 'vym-sector-reference';

type Props = {
  lang: Language;
};

const BENCHMARK_RATE = 8.2;
const BASE_REVENUE_DEFAULT = 100;

const formatCurrency = (value: number, lang: Language) =>
  new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'en-US', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value * 1_000_000);

const formatRate = (value: number, lang: Language) =>
  new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);

function projectRevenue(mode: RevenueMode, baseRevenue: number, constantGrowth: number, yearRates: number[], targetYear5: number) {
  if (mode === 'constant-growth') {
    return baseRevenue * (1 + constantGrowth / 100) ** 5;
  }

  if (mode === 'year-by-year-growth') {
    return yearRates.reduce((acc, rate) => acc * (1 + rate / 100), baseRevenue);
  }

  if (mode === 'year-5-target') {
    return targetYear5;
  }

  return baseRevenue * (1 + BENCHMARK_RATE / 100) ** 5;
}

function impliedCagr(baseRevenue: number, year5Revenue: number) {
  if (baseRevenue <= 0 || year5Revenue <= 0) return null;
  return (Math.pow(year5Revenue / baseRevenue, 1 / 5) - 1) * 100;
}

export function RevenueAssumptionsSpeedTrack({ lang }: Props) {
  const [mode, setMode] = useState<RevenueMode>('constant-growth');
  const [baseRevenue, setBaseRevenue] = useState(BASE_REVENUE_DEFAULT);
  const [constantGrowth, setConstantGrowth] = useState(8);
  const [yearRates, setYearRates] = useState([8, 8, 8, 8, 8]);
  const [targetYear5, setTargetYear5] = useState(147);
  const [showImpact, setShowImpact] = useState(false);

  const year5Revenue = useMemo(
    () => projectRevenue(mode, baseRevenue, constantGrowth, yearRates, targetYear5),
    [mode, baseRevenue, constantGrowth, yearRates, targetYear5],
  );

  const cagr = useMemo(() => impliedCagr(baseRevenue, year5Revenue), [baseRevenue, year5Revenue]);

  const benchmarkPosition = useMemo(() => {
    if (cagr === null) return lang === 'es' ? 'en línea' : 'in line';
    if (Math.abs(cagr - BENCHMARK_RATE) < 0.2) return lang === 'es' ? 'en línea' : 'in line';
    return cagr > BENCHMARK_RATE ? (lang === 'es' ? 'por encima' : 'above') : lang === 'es' ? 'por debajo' : 'below';
  }, [cagr, lang]);

  return (
    <WizardStepShell
      backHref="/wizard/revenue-assumptions/mode"
      description=""
      lang={lang}
      step={7}
      title={lang === 'es' ? 'Hipótesis de ingresos' : 'Revenue assumptions'}
      total={7}
    >
      <div className="space-y-6">
        <div className="grid gap-2 md:grid-cols-2">
          {[
            {
              key: 'constant-growth',
              en: 'My company will grow at a constant rate over the next 5 years',
              es: 'Mi empresa va a tener un crecimiento constante los próximos 5 años',
            },
            {
              key: 'year-by-year-growth',
              en: 'My company will grow differently each year',
              es: 'Mi empresa va a crecer de forma diferente cada año',
            },
            {
              key: 'year-5-target',
              en: 'I want to reach a revenue target in year 5',
              es: 'Quiero alcanzar un objetivo de ventas en el año 5',
            },
            {
              key: 'vym-sector-reference',
              en: 'I want to use a VYM sector reference',
              es: 'Quiero usar una referencia sectorial de VYM',
            },
          ].map((item) => {
            const selected = mode === item.key;
            return (
              <button
                key={item.key}
                className={`rounded-xl border px-4 py-3 text-left ${selected ? 'border-accent bg-ivory' : 'border-line bg-white'}`}
                onClick={() => setMode(item.key as RevenueMode)}
                type="button"
              >
                <span className="font-editorial text-[15px] leading-snug tracking-[0.01em] text-slateInk">
                  {lang === 'es' ? item.es : item.en}
                </span>
              </button>
            );
          })}
        </div>

        <div className="rounded-xl border border-line p-4 font-editorial">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="text-sm text-mutedInk">
              {lang === 'es' ? 'base revenue' : 'base revenue'}
              <input
                className="mt-1 w-full rounded-lg border border-line px-3 py-2 font-editorial text-slateInk"
                min={1}
                onChange={(e) => setBaseRevenue(Number(e.target.value) || 0)}
                type="number"
                value={baseRevenue}
              />
            </label>

            {mode === 'constant-growth' && (
              <label className="text-sm text-mutedInk">
                CAGR %
                <input
                  className="mt-1 w-full rounded-lg border border-line px-3 py-2 font-editorial text-slateInk"
                  onChange={(e) => setConstantGrowth(Number(e.target.value) || 0)}
                  type="number"
                  value={constantGrowth}
                />
              </label>
            )}

            {mode === 'year-5-target' && (
              <label className="text-sm text-mutedInk">
                {lang === 'es' ? 'year 5 revenue' : 'year 5 revenue'}
                <input
                  className="mt-1 w-full rounded-lg border border-line px-3 py-2 font-editorial text-slateInk"
                  min={1}
                  onChange={(e) => setTargetYear5(Number(e.target.value) || 0)}
                  type="number"
                  value={targetYear5}
                />
              </label>
            )}

            {mode === 'year-by-year-growth' && (
              <div className="md:col-span-2">
                <div className="grid gap-2 sm:grid-cols-5">
                  {yearRates.map((rate, index) => (
                    <label className="text-xs text-mutedInk" key={`year-rate-${index + 1}`}>
                      Y{index + 1} %
                      <input
                        className="mt-1 w-full rounded-lg border border-line px-2 py-2 font-editorial text-slateInk"
                        onChange={(e) => {
                          const next = [...yearRates];
                          next[index] = Number(e.target.value) || 0;
                          setYearRates(next);
                        }}
                        type="number"
                        value={rate}
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {mode === 'vym-sector-reference' && (
              <div className="rounded-lg bg-ivory px-3 py-2 text-sm text-mutedInk">
                {lang === 'es' ? 'Referencia sectorial VYM aplicada automáticamente.' : 'VYM sector reference applied automatically.'}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-line bg-ivory p-4 font-editorial">
          <p className="text-sm text-slateInk">
            {lang === 'es' ? `Referencia VYM: ${formatRate(BENCHMARK_RATE, lang)} %` : `VYM reference: ${formatRate(BENCHMARK_RATE, lang)}%`}
          </p>
          <p className="text-sm text-mutedInk">{lang === 'es' ? 'Comparables: 20 empresas · España' : 'Comparables: 20 companies · Spain'}</p>
        </div>

        <button
          className="rounded-full bg-accent px-5 py-2 font-editorial text-sm text-ivory"
          onClick={() => setShowImpact(true)}
          type="button"
        >
          {lang === 'es' ? 'Ver impacto' : 'View impact'}
        </button>

        {showImpact && (
          <div className="rounded-xl border border-line p-4 font-editorial">
            <div className="grid gap-2 text-sm text-slateInk sm:grid-cols-2">
              <p>{`${lang === 'es' ? 'base revenue' : 'base revenue'}: ${formatCurrency(baseRevenue, lang)}`}</p>
              <p>{`${lang === 'es' ? 'year 5 revenue' : 'year 5 revenue'}: ${formatCurrency(year5Revenue, lang)}`}</p>
              <p>
                {lang === 'es' ? 'implied CAGR if applicable' : 'implied CAGR if applicable'}:{' '}
                {cagr === null ? '—' : `${formatRate(cagr, lang)}%`}
              </p>
              <p>{`${lang === 'es' ? 'benchmark position' : 'benchmark position'}: ${benchmarkPosition}`}</p>
            </div>
          </div>
        )}
      </div>
    </WizardStepShell>
  );
}
