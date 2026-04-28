'use client';

import { type ReactNode, useMemo, useState } from 'react';

import { WizardStepShell } from '@/components/wizard-step-shell';
import { type Language } from '@/lib/i18n';

type Props = {
  lang: Language;
  unit?: string;
};

type RevenueMode = 'initial-plus-growth' | 'year1-year5' | 'constant-5y';
type CostMode = 'keep-ratio' | 'constant-growth' | 'benchmark-growth' | 'converge-benchmark';
type PersonnelFteMode = 'add-employees' | 'grow-cost-per-employee' | 'benchmark-cpe-growth' | 'inflation-cpe-growth';
type CapexMode = 'investment-plan' | 'reinvest-maintain' | 'constant-ratio' | 'converge-benchmark-5y';

const YEARS = [1, 2, 3, 4, 5] as const;

const BENCHMARK_RATE = 8.2;
const BENCHMARK_PEOPLE_COST = 78_000;
const INFLATION_REF = 2;
const BASE_REVENUE = 100;
const CURRENT_PURCHASES = 44;
const CURRENT_ADMIN = 12;
const CURRENT_PERSONNEL = 22;
const CURRENT_FTE = 250;
const CURRENT_FIXED_ASSETS = 28;
const CURRENT_INTANGIBLE_ASSETS = 9;
const DEPRECIATION_PROXY = [7, 7, 7, 7, 7];

const BENCHMARK_PURCHASES_RATIO = 42;
const BENCHMARK_ADMIN_RATIO = 10;
const BENCHMARK_PERSONNEL_RATIO = 18;
const BENCHMARK_FIXED_RATIO = 8;
const BENCHMARK_INTANGIBLE_RATIO = 3;

const formatNumber = (value: number, lang: Language, max = 1) =>
  new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: max,
  }).format(value);

const formatMoney = (value: number, lang: Language) =>
  new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'en-US', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value * 1_000_000);

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5 shadow-whisper">
      <h2 className="font-editorial text-[28px] leading-tight tracking-premium text-slateInk">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function SummaryGrid({
  current,
  assumption,
  benchmark,
  year5,
}: {
  current: ReactNode;
  assumption: ReactNode;
  benchmark: ReactNode;
  year5: ReactNode;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      {[
        { label: 'Current', content: current },
        { label: 'Assumption', content: assumption },
        { label: 'Benchmark', content: benchmark },
        { label: 'Year 5', content: year5 },
      ].map((item) => (
        <div className="rounded-xl border border-line bg-ivory p-3" key={item.label}>
          <p className="font-editorial text-sm text-mutedInk">{item.label}</p>
          <div className="mt-1 space-y-1 font-editorial text-sm text-slateInk">{item.content}</div>
        </div>
      ))}
    </div>
  );
}

function OptionCard({
  selected,
  title,
  subtext,
  onClick,
}: {
  selected: boolean;
  title: string;
  subtext: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`rounded-xl border p-3 text-left ${selected ? 'border-accent bg-ivory' : 'border-line bg-white'}`}
      onClick={onClick}
      type="button"
    >
      <p className="font-editorial text-[15px] text-slateInk">{title}</p>
      <p className="mt-1 text-sm text-mutedInk">{subtext}</p>
    </button>
  );
}

export function RevenueAssumptionsSpeedTrack({ lang, unit }: Props) {
  const t = {
    revenueTitle: lang === 'es' ? 'Hipótesis de ingresos' : 'Revenue assumptions',
    revenueQuestion: lang === 'es' ? '¿Cómo quieres proyectar tus ingresos?' : 'How would you like to project your revenue?',
    additionalRevenueTitle:
      lang === 'es'
        ? 'Añadir los ingresos adicionales de una nueva línea de negocio'
        : 'Add additional revenue from a new business line',
    additionalRevenueSupport:
      lang === 'es'
        ? 'Introduce el importe adicional en la unidad seleccionada. Este ingreso adicional se mantendrá constante durante los próximos 5 años.'
        : 'Enter the additional amount in the selected unit. This additional revenue will remain constant over the next 5 years.',
    viewImpact: lang === 'es' ? 'Ver impacto' : 'View impact',
    purchasesQuestion:
      lang === 'es'
        ? '¿Cómo quieres proyectar tus compras / aprovisionamientos?'
        : 'How would you like to project your purchases / cost of goods sold?',
    adminQuestion:
      lang === 'es'
        ? '¿Cómo quieres proyectar tus gastos administrativos?'
        : 'How would you like to project your administrative expenses?',
    personnelQuestion:
      lang === 'es' ? '¿Cómo quieres proyectar tus gastos de personal?' : 'How would you like to project your personnel expenses?',
    fteQuestion:
      lang === 'es'
        ? '¿Quieres introducir número de empleados / headcount / FTE?'
        : 'Do you want to enter number of employees / headcount / FTE?',
    capexQuestion:
      lang === 'es' ? '¿Cómo quieres proyectar tus inversiones / CAPEX?' : 'How would you like to project your investments / CAPEX?',
  };

  const [showImpact, setShowImpact] = useState(false);

  const [revenueMode, setRevenueMode] = useState<RevenueMode>('initial-plus-growth');
  const [baseRevenue, setBaseRevenue] = useState(BASE_REVENUE);
  const [revenueGrowth, setRevenueGrowth] = useState(8);
  const [year1Revenue, setYear1Revenue] = useState(BASE_REVENUE * 1.08);
  const [year5RevenueTarget, setYear5RevenueTarget] = useState(147);
  const [constantRevenue, setConstantRevenue] = useState(BASE_REVENUE);
  const [additionalRevenueAmount, setAdditionalRevenueAmount] = useState(0);

  const [purchasesMode, setPurchasesMode] = useState<CostMode>('keep-ratio');
  const [purchasesGrowth, setPurchasesGrowth] = useState(3);
  const [purchasesConvergeYears, setPurchasesConvergeYears] = useState(3);

  const [adminMode, setAdminMode] = useState<CostMode>('keep-ratio');
  const [adminGrowth, setAdminGrowth] = useState(3);
  const [adminConvergeYears, setAdminConvergeYears] = useState(3);

  const [useFtePath, setUseFtePath] = useState(false);
  const [personnelMode, setPersonnelMode] = useState<CostMode>('keep-ratio');
  const [personnelGrowth, setPersonnelGrowth] = useState(3);
  const [personnelConvergeYears, setPersonnelConvergeYears] = useState(3);

  const [currentFte, setCurrentFte] = useState(CURRENT_FTE);
  const [fteMode, setFteMode] = useState<PersonnelFteMode>('add-employees');
  const [additionalEmployees, setAdditionalEmployees] = useState([5, 5, 5, 5, 5]);
  const [costPerEmployeeGrowth, setCostPerEmployeeGrowth] = useState(3);

  const [capexMode, setCapexMode] = useState<CapexMode>('investment-plan');
  const [fixedPlan, setFixedPlan] = useState([5, 5, 5, 5, 5]);
  const [intangiblePlan, setIntangiblePlan] = useState([2, 2, 2, 2, 2]);
  const [fixedRatio, setFixedRatio] = useState((CURRENT_FIXED_ASSETS / BASE_REVENUE) * 100);
  const [intangibleRatio, setIntangibleRatio] = useState((CURRENT_INTANGIBLE_ASSETS / BASE_REVENUE) * 100);

  const revenueProjectionYear5 = useMemo(() => {
    const projectedBase =
      revenueMode === 'initial-plus-growth'
        ? baseRevenue * (1 + revenueGrowth / 100) ** 5
        : revenueMode === 'year1-year5'
          ? year5RevenueTarget
          : constantRevenue;
    return projectedBase + additionalRevenueAmount;
  }, [revenueMode, baseRevenue, revenueGrowth, year5RevenueTarget, constantRevenue, additionalRevenueAmount]);

  const impliedRevenueCagr = useMemo(() => {
    if (baseRevenue <= 0 || revenueProjectionYear5 <= 0) return null;
    return (Math.pow(revenueProjectionYear5 / baseRevenue, 1 / 5) - 1) * 100;
  }, [baseRevenue, revenueProjectionYear5]);

  const revenueBenchmarkPosition = useMemo(() => {
    if (impliedRevenueCagr === null) return lang === 'es' ? 'en línea' : 'in line';
    if (Math.abs(impliedRevenueCagr - BENCHMARK_RATE) < 0.2) return lang === 'es' ? 'en línea' : 'in line';
    return impliedRevenueCagr > BENCHMARK_RATE ? (lang === 'es' ? 'por encima' : 'above') : lang === 'es' ? 'por debajo' : 'below';
  }, [impliedRevenueCagr, lang]);

  const purchasesRatioCurrent = (CURRENT_PURCHASES / BASE_REVENUE) * 100;
  const adminRatioCurrent = (CURRENT_ADMIN / BASE_REVENUE) * 100;
  const personnelRatioCurrent = (CURRENT_PERSONNEL / BASE_REVENUE) * 100;

  const personnelCostPerEmployeeCurrent = CURRENT_PERSONNEL * 1_000_000 / Math.max(currentFte, 1);

  const impliedPolicyFlags = useMemo(() => {
    const flags: string[] = [];
    if (impliedRevenueCagr !== null && impliedRevenueCagr < 0) {
      flags.push('Revenue implied CAGR is negative. [APPROVAL REQUIRED]');
    }
    if (purchasesMode === 'converge-benchmark' && BENCHMARK_PURCHASES_RATIO < 0) {
      flags.push('Purchases benchmark convergence result is negative. [APPROVAL REQUIRED]');
    }
    if (adminMode === 'converge-benchmark' && BENCHMARK_ADMIN_RATIO < 0) {
      flags.push('Administrative expenses benchmark convergence result is negative. [APPROVAL REQUIRED]');
    }
    if (!useFtePath && personnelMode === 'converge-benchmark' && BENCHMARK_PERSONNEL_RATIO < 0) {
      flags.push('Personnel expenses benchmark convergence result is negative. [APPROVAL REQUIRED]');
    }
    if (capexMode === 'converge-benchmark-5y' && (BENCHMARK_FIXED_RATIO < 0 || BENCHMARK_INTANGIBLE_RATIO < 0)) {
      flags.push('CAPEX benchmark convergence result is negative. [APPROVAL REQUIRED]');
    }
    return flags;
  }, [adminMode, capexMode, impliedRevenueCagr, personnelMode, purchasesMode, useFtePath]);

  return (
    <WizardStepShell
      backHref="/wizard/revenue-assumptions/mode"
      description=""
      lang={lang}
      step={7}
      title={t.revenueTitle}
      total={7}
    >
      <div className="space-y-5">
        <SectionCard title={t.revenueTitle}>
          <p className="font-editorial text-lg text-slateInk">{t.revenueQuestion}</p>
          <div className="grid gap-2 md:grid-cols-3">
            {[
              lang === 'es' ? 'Proyectar un crecimiento anual constante a una tasa' : 'Project a constant annual growth rate',
              lang === 'es' ? 'Tengo un objetivo de ventas que alcanzar dentro de 5 años' : 'I have a revenue target to reach within 5 years',
              lang === 'es' ? 'No preveo ningún crecimiento' : 'I do not expect any growth',
              lang === 'es' ? 'Utilizaré el crecimiento del benchmark' : 'I will use benchmark growth',
            ].map((copy, index) => (
              <button
                className={`rounded-xl border px-3 py-2 text-left font-editorial text-sm ${
                  (index === 0 && revenueMode === 'initial-plus-growth') ||
                  (index === 1 && revenueMode === 'year1-year5') ||
                  (index === 2 && revenueMode === 'constant-5y') ||
                  (index === 3 && revenueMode === 'initial-plus-growth')
                    ? 'border-accent bg-ivory'
                    : 'border-line bg-white'
                }`}
                key={copy}
                onClick={() => setRevenueMode(index === 1 ? 'year1-year5' : index === 2 ? 'constant-5y' : 'initial-plus-growth')}
                type="button"
              >
                {copy}
              </button>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="font-editorial text-sm text-mutedInk">
              base revenue
              <input
                className="mt-1 w-full rounded-lg border border-line px-3 py-2 font-editorial text-slateInk"
                onChange={(e) => setBaseRevenue(Number(e.target.value) || 0)}
                type="number"
                value={baseRevenue}
              />
            </label>
            {revenueMode === 'initial-plus-growth' && (
              <label className="font-editorial text-sm text-mutedInk">
                annual growth
                <input
                  className="mt-1 w-full rounded-lg border border-line px-3 py-2 font-editorial text-slateInk"
                  onChange={(e) => setRevenueGrowth(Number(e.target.value) || 0)}
                  type="number"
                  value={revenueGrowth}
                />
              </label>
            )}
            {revenueMode === 'year1-year5' && (
              <>
                <label className="font-editorial text-sm text-mutedInk">
                  Valor inicial en Año 1 + valor final en Año 5
                  <input
                    className="mt-1 w-full rounded-lg border border-line px-3 py-2 font-editorial text-slateInk"
                    onChange={(e) => setYear1Revenue(Number(e.target.value) || 0)}
                    type="number"
                    value={year1Revenue}
                  />
                </label>
                <label className="font-editorial text-sm text-mutedInk">
                  year 5 revenue
                  <input
                    className="mt-1 w-full rounded-lg border border-line px-3 py-2 font-editorial text-slateInk"
                    onChange={(e) => setYear5RevenueTarget(Number(e.target.value) || 0)}
                    type="number"
                    value={year5RevenueTarget}
                  />
                </label>
              </>
            )}
            {revenueMode === 'constant-5y' && (
              <label className="font-editorial text-sm text-mutedInk">
                constant value
                <input
                  className="mt-1 w-full rounded-lg border border-line px-3 py-2 font-editorial text-slateInk"
                  onChange={(e) => setConstantRevenue(Number(e.target.value) || 0)}
                  type="number"
                  value={constantRevenue}
                />
              </label>
            )}
          </div>

          <div className="rounded-xl border border-line bg-ivory p-3">
            <p className="font-editorial text-sm text-slateInk">{t.additionalRevenueTitle}</p>
            <p className="mt-1 font-editorial text-sm text-mutedInk">{t.additionalRevenueSupport}</p>
            <p className="mt-3 font-editorial text-xs text-mutedInk">
              {unit === 'k-eur' ? (lang === 'es' ? 'Miles de euros' : 'Thousand euros') : unit === 'm-eur' ? (lang === 'es' ? 'Millones de euros' : 'Million euros') : lang === 'es' ? 'Euros' : 'Euros'}
            </p>
            <input
              aria-label={lang === 'es' ? 'Ingresos adicionales' : 'Additional revenue'}
              className="mt-1 w-full rounded-lg border border-line px-3 py-2 font-editorial text-slateInk"
              min={0}
              onChange={(e) => setAdditionalRevenueAmount(Math.max(0, Number(e.target.value) || 0))}
              type="number"
              value={additionalRevenueAmount}
            />
          </div>

          <div className="rounded-xl border border-line bg-ivory p-3">
            <p className="font-editorial text-sm text-slateInk">
              {lang === 'es' ? `Referencia VYM: ${formatNumber(BENCHMARK_RATE, lang)} %` : `VYM reference: ${formatNumber(BENCHMARK_RATE, lang)}%`}
            </p>
            <p className="text-sm text-mutedInk">{lang === 'es' ? 'Comparables: 20 empresas · España' : 'Comparables: 20 companies · Spain'}</p>
          </div>

          <SummaryGrid
            assumption={
              <>
                {revenueMode === 'initial-plus-growth' && <p>{`annual growth: ${formatNumber(revenueGrowth, lang)}%`}</p>}
                {revenueMode === 'year1-year5' && <p>{`or implied CAGR: ${formatNumber(impliedRevenueCagr ?? 0, lang)}%`}</p>}
                {revenueMode === 'constant-5y' && <p>{`or constant value: ${formatMoney(constantRevenue, lang)}`}</p>}
                <p>{`additional revenue (constant 5 years): ${formatMoney(additionalRevenueAmount, lang)}`}</p>
              </>
            }
            benchmark={
              <>
                <p>{`benchmark growth over the last 3 years: ${formatNumber(BENCHMARK_RATE, lang)}%`}</p>
                <p>number of comparables: 20</p>
                <p>geography: Spain</p>
              </>
            }
            current={<p>{`current revenue: ${formatMoney(baseRevenue, lang)}`}</p>}
            year5={<p>{`projected Year 5 revenue: ${formatMoney(revenueProjectionYear5, lang)}`}</p>}
          />

          <button className="rounded-full bg-accent px-5 py-2 font-editorial text-sm text-ivory" onClick={() => setShowImpact(true)} type="button">
            {t.viewImpact}
          </button>
          {showImpact && (
            <div className="rounded-xl border border-line p-3 text-sm text-slateInk">
              <p>{`base revenue: ${formatMoney(baseRevenue, lang)}`}</p>
              <p>{`year 5 revenue: ${formatMoney(revenueProjectionYear5, lang)}`}</p>
              <p>{`implied CAGR if applicable: ${impliedRevenueCagr === null ? '—' : `${formatNumber(impliedRevenueCagr, lang)}%`}`}</p>
              <p>{`benchmark position: ${revenueBenchmarkPosition}`}</p>
            </div>
          )}
        </SectionCard>

        <SectionCard title="Purchases / COGS">
          <p className="font-editorial text-lg text-slateInk">{t.purchasesQuestion}</p>
          <div className="grid gap-2">
            <OptionCard
              onClick={() => setPurchasesMode('keep-ratio')}
              selected={purchasesMode === 'keep-ratio'}
              subtext={
                lang === 'es'
                  ? 'Usaremos como referencia el porcentaje actual de compras sobre ventas de tu empresa.'
                  : 'We will use your company’s current purchases-to-revenue ratio as a reference.'
              }
              title={lang === 'es' ? 'Mantener compras como porcentaje de ventas' : 'Keep purchases as a percentage of revenue'}
            />
            <OptionCard
              onClick={() => setPurchasesMode('constant-growth')}
              selected={purchasesMode === 'constant-growth'}
              subtext={
                lang === 'es'
                  ? 'Define una tasa anual de crecimiento para las compras durante los próximos 5 años.'
                  : 'Define an annual growth rate for purchases over the next 5 years.'
              }
              title={lang === 'es' ? 'Hacer crecer las compras a una tasa constante' : 'Grow purchases at a constant rate'}
            />
            <OptionCard
              onClick={() => setPurchasesMode('benchmark-growth')}
              selected={purchasesMode === 'benchmark-growth'}
              subtext={
                lang === 'es'
                  ? 'Aplicaremos el nivel del benchmark y la tasa de crecimiento observada en los últimos 3 años.'
                  : 'We will apply the benchmark level and the growth rate observed over the last 3 years.'
              }
              title={lang === 'es' ? 'Usar benchmark sectorial y su crecimiento reciente' : 'Use the sector benchmark and its recent growth'}
            />
            <OptionCard
              onClick={() => setPurchasesMode('converge-benchmark')}
              selected={purchasesMode === 'converge-benchmark'}
              subtext={
                lang === 'es'
                  ? 'La empresa irá convergiendo desde su nivel actual hasta el benchmark sectorial en el plazo que indiques.'
                  : 'The company will move from its current level toward the sector benchmark over the period you choose.'
              }
              title={lang === 'es' ? 'Converger con el benchmark en X años' : 'Converge to the benchmark over X years'}
            />
          </div>
          {purchasesMode === 'constant-growth' && (
            <label className="block text-sm text-mutedInk">
              annual growth %
              <input className="mt-1 w-full rounded-lg border border-line px-3 py-2 font-editorial text-slateInk" onChange={(e) => setPurchasesGrowth(Number(e.target.value) || 0)} type="number" value={purchasesGrowth} />
            </label>
          )}
          {purchasesMode === 'converge-benchmark' && (
            <label className="block text-sm text-mutedInk">
              X years
              <input
                className="mt-1 w-full rounded-lg border border-line px-3 py-2 font-editorial text-slateInk"
                min={1}
                onChange={(e) => setPurchasesConvergeYears(Math.max(1, Number(e.target.value) || 1))}
                type="number"
                value={purchasesConvergeYears}
              />
            </label>
          )}
          <SummaryGrid
            assumption={
              <>
                {purchasesMode === 'keep-ratio' && <p>{`current ratio: ${formatNumber(purchasesRatioCurrent, lang)}%`}</p>}
                {purchasesMode === 'constant-growth' && <p>{`growth rate: ${formatNumber(purchasesGrowth, lang)}%`}</p>}
                {purchasesMode === 'benchmark-growth' && <p>{`benchmark + benchmark growth: ${formatNumber(BENCHMARK_PURCHASES_RATIO, lang)}% + ${formatNumber(BENCHMARK_RATE, lang)}%`}</p>}
                {purchasesMode === 'converge-benchmark' && <p>{`linear convergence in X years: ${purchasesConvergeYears}`}</p>}
              </>
            }
            benchmark={
              <>
                <p>{`benchmark Purchases / Revenue: ${formatNumber(BENCHMARK_PURCHASES_RATIO, lang)}%`}</p>
                <p>{`benchmark growth over the last 3 years: ${formatNumber(BENCHMARK_RATE, lang)}%`}</p>
              </>
            }
            current={
              <>
                <p>{`current purchases: ${formatMoney(CURRENT_PURCHASES, lang)}`}</p>
                <p>{`current Purchases / Revenue: ${formatNumber(purchasesRatioCurrent, lang)}%`}</p>
              </>
            }
            year5={
              <>
                <p>{`Year 5 purchases: ${formatMoney(CURRENT_PURCHASES * 1.1, lang)}`}</p>
                <p>{`Year 5 Purchases / Revenue: ${formatNumber(BENCHMARK_PURCHASES_RATIO, lang)}%`}</p>
              </>
            }
          />
        </SectionCard>

        <SectionCard title="Administrative expenses">
          <p className="font-editorial text-lg text-slateInk">{t.adminQuestion}</p>
          <div className="grid gap-2">
            <OptionCard
              onClick={() => setAdminMode('keep-ratio')}
              selected={adminMode === 'keep-ratio'}
              subtext={
                lang === 'es'
                  ? 'Usaremos como referencia el porcentaje actual de gastos administrativos sobre ventas de tu empresa.'
                  : 'We will use your company’s current administrative-expenses-to-revenue ratio as a reference.'
              }
              title={lang === 'es' ? 'Mantener gastos administrativos como porcentaje de ventas' : 'Keep administrative expenses as a percentage of revenue'}
            />
            <OptionCard
              onClick={() => setAdminMode('constant-growth')}
              selected={adminMode === 'constant-growth'}
              subtext={
                lang === 'es'
                  ? 'Define una tasa anual de crecimiento para los gastos administrativos durante los próximos 5 años.'
                  : 'Define an annual growth rate for administrative expenses over the next 5 years.'
              }
              title={lang === 'es' ? 'Hacer crecer los gastos administrativos a una tasa constante' : 'Grow administrative expenses at a constant rate'}
            />
            <OptionCard
              onClick={() => setAdminMode('benchmark-growth')}
              selected={adminMode === 'benchmark-growth'}
              subtext={
                lang === 'es'
                  ? 'Aplicaremos el nivel del benchmark y la tasa de crecimiento observada en los últimos 3 años.'
                  : 'We will apply the benchmark level and the growth rate observed over the last 3 years.'
              }
              title={lang === 'es' ? 'Usar benchmark sectorial y su crecimiento reciente' : 'Use the sector benchmark and its recent growth'}
            />
            <OptionCard
              onClick={() => setAdminMode('converge-benchmark')}
              selected={adminMode === 'converge-benchmark'}
              subtext={
                lang === 'es'
                  ? 'La empresa irá convergiendo desde su nivel actual hasta el benchmark sectorial en el plazo que indiques.'
                  : 'The company will move from its current level toward the sector benchmark over the period you choose.'
              }
              title={lang === 'es' ? 'Converger con el benchmark en X años' : 'Converge to the benchmark over X years'}
            />
          </div>
          {adminMode === 'constant-growth' && (
            <label className="block text-sm text-mutedInk">
              annual growth %
              <input className="mt-1 w-full rounded-lg border border-line px-3 py-2 font-editorial text-slateInk" onChange={(e) => setAdminGrowth(Number(e.target.value) || 0)} type="number" value={adminGrowth} />
            </label>
          )}
          {adminMode === 'converge-benchmark' && (
            <label className="block text-sm text-mutedInk">
              X years
              <input
                className="mt-1 w-full rounded-lg border border-line px-3 py-2 font-editorial text-slateInk"
                min={1}
                onChange={(e) => setAdminConvergeYears(Math.max(1, Number(e.target.value) || 1))}
                type="number"
                value={adminConvergeYears}
              />
            </label>
          )}
          <SummaryGrid
            assumption={
              <>
                {adminMode === 'keep-ratio' && <p>{`current ratio: ${formatNumber(adminRatioCurrent, lang)}%`}</p>}
                {adminMode === 'constant-growth' && <p>{`growth rate: ${formatNumber(adminGrowth, lang)}%`}</p>}
                {adminMode === 'benchmark-growth' && <p>{`benchmark + benchmark growth: ${formatNumber(BENCHMARK_ADMIN_RATIO, lang)}% + ${formatNumber(BENCHMARK_RATE, lang)}%`}</p>}
                {adminMode === 'converge-benchmark' && <p>{`linear convergence: ${adminConvergeYears} years`}</p>}
              </>
            }
            benchmark={
              <>
                <p>{`benchmark Administrative Expenses / Revenue: ${formatNumber(BENCHMARK_ADMIN_RATIO, lang)}%`}</p>
                <p>{`benchmark growth over the last 3 years: ${formatNumber(BENCHMARK_RATE, lang)}%`}</p>
              </>
            }
            current={
              <>
                <p>{`current administrative expenses: ${formatMoney(CURRENT_ADMIN, lang)}`}</p>
                <p>{`current Administrative Expenses / Revenue: ${formatNumber(adminRatioCurrent, lang)}%`}</p>
              </>
            }
            year5={
              <>
                <p>{`Year 5 administrative expenses: ${formatMoney(CURRENT_ADMIN * 1.1, lang)}`}</p>
                <p>{`Year 5 Administrative Expenses / Revenue: ${formatNumber(BENCHMARK_ADMIN_RATIO, lang)}%`}</p>
              </>
            }
          />
        </SectionCard>

        <SectionCard title="Personnel expenses">
          <p className="font-editorial text-lg text-slateInk">{t.personnelQuestion}</p>
          <p className="font-editorial text-base text-slateInk">{t.fteQuestion}</p>
          <div className="flex gap-2">
            <button className={`rounded-full border px-4 py-1 text-sm ${useFtePath ? 'border-accent bg-ivory' : 'border-line bg-white'}`} onClick={() => setUseFtePath(true)} type="button">
              {t.yes}
            </button>
            <button className={`rounded-full border px-4 py-1 text-sm ${!useFtePath ? 'border-accent bg-ivory' : 'border-line bg-white'}`} onClick={() => setUseFtePath(false)} type="button">
              {t.no}
            </button>
          </div>

          {useFtePath ? (
            <>
              <label className="block text-sm text-mutedInk">
                current FTE
                <input className="mt-1 w-full rounded-lg border border-line px-3 py-2 font-editorial text-slateInk" min={1} onChange={(e) => setCurrentFte(Math.max(1, Number(e.target.value) || 1))} type="number" value={currentFte} />
              </label>
              <div className="grid gap-2">
                <OptionCard
                  onClick={() => setFteMode('add-employees')}
                  selected={fteMode === 'add-employees'}
                  subtext={
                    lang === 'es'
                      ? 'Introduce los empleados adicionales que esperas incorporar y visualiza el total acumulado.'
                      : 'Enter the additional employees you expect to hire and visualize the cumulative total.'
                  }
                  title={lang === 'es' ? 'Añadir empleados adicionales' : 'Add additional employees'}
                />
                <OptionCard
                  onClick={() => setFteMode('grow-cost-per-employee')}
                  selected={fteMode === 'grow-cost-per-employee'}
                  subtext={
                    lang === 'es'
                      ? 'Define una tasa anual de crecimiento para el coste medio por empleado.'
                      : 'Define an annual growth rate for the average cost per employee.'
                  }
                  title={lang === 'es' ? 'Hacer crecer el coste por empleado a una tasa constante' : 'Grow cost per employee at a constant rate'}
                />
                <OptionCard
                  onClick={() => setFteMode('benchmark-cpe-growth')}
                  selected={fteMode === 'benchmark-cpe-growth'}
                  subtext={
                    lang === 'es'
                      ? 'Aplicaremos la referencia sectorial de coste por empleado para proyectar su evolución.'
                      : 'We will apply the sector reference for cost per employee to project its evolution.'
                  }
                  title={lang === 'es' ? 'Usar benchmark para el crecimiento del coste por empleado' : 'Use a benchmark for cost-per-employee growth'}
                />
                <OptionCard
                  onClick={() => setFteMode('inflation-cpe-growth')}
                  selected={fteMode === 'inflation-cpe-growth'}
                  subtext={
                    lang === 'es'
                      ? 'Aplicaremos la inflación de referencia de VYM, indicando la fuente utilizada.'
                      : 'We will apply the VYM inflation reference and indicate the source used.'
                  }
                  title={
                    lang === 'es'
                      ? 'Referenciar el crecimiento del coste por empleado a la inflación'
                      : 'Tie cost-per-employee growth to inflation'
                  }
                />
              </div>
              {fteMode === 'add-employees' && (
                <div className="grid gap-2 sm:grid-cols-5">
                  {YEARS.map((year, index) => (
                    <label className="text-sm text-mutedInk" key={`add-emp-${year}`}>
                      {`Year ${year}`}
                      <input
                        className="mt-1 w-full rounded-lg border border-line px-2 py-2"
                        onChange={(e) => {
                          const next = [...additionalEmployees];
                          next[index] = Number(e.target.value) || 0;
                          setAdditionalEmployees(next);
                        }}
                        type="number"
                        value={additionalEmployees[index]}
                      />
                    </label>
                  ))}
                </div>
              )}
              {fteMode === 'grow-cost-per-employee' && (
                <label className="block text-sm text-mutedInk">
                  cost-per-employee growth
                  <input
                    className="mt-1 w-full rounded-lg border border-line px-3 py-2 font-editorial text-slateInk"
                    onChange={(e) => setCostPerEmployeeGrowth(Number(e.target.value) || 0)}
                    type="number"
                    value={costPerEmployeeGrowth}
                  />
                </label>
              )}
              <SummaryGrid
                assumption={
                  <>
                    {fteMode === 'add-employees' && <p>{`additional employees by year: ${additionalEmployees.join(', ')}`}</p>}
                    {fteMode === 'grow-cost-per-employee' && <p>{`cost-per-employee growth: ${formatNumber(costPerEmployeeGrowth, lang)}%`}</p>}
                    {fteMode === 'benchmark-cpe-growth' && <p>benchmark</p>}
                    {fteMode === 'inflation-cpe-growth' && <p>{`inflation 2%: ${INFLATION_REF}%`}</p>}
                  </>
                }
                benchmark={
                  <>
                    <p>{`benchmark cost per employee: ${new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'en-US').format(BENCHMARK_PEOPLE_COST)}`}</p>
                    <p>{`inflation reference 2% if applicable: ${INFLATION_REF}%`}</p>
                  </>
                }
                current={
                  <>
                    <p>{`current FTE: ${formatNumber(currentFte, lang, 0)}`}</p>
                    <p>{`current personnel expense: ${formatMoney(CURRENT_PERSONNEL, lang)}`}</p>
                    <p>{`current cost per employee: ${new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'en-US').format(personnelCostPerEmployeeCurrent)}`}</p>
                  </>
                }
                year5={
                  <>
                    <p>{`Year 5 FTE: ${formatNumber(currentFte + additionalEmployees.reduce((a, b) => a + b, 0), lang, 0)}`}</p>
                    <p>{`Year 5 cost per employee: ${new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'en-US').format(personnelCostPerEmployeeCurrent * 1.1)}`}</p>
                    <p>{`Year 5 total personnel expense: ${formatMoney(CURRENT_PERSONNEL * 1.15, lang)}`}</p>
                  </>
                }
              />
            </>
          ) : (
            <>
              <div className="grid gap-2">
                <OptionCard
                  onClick={() => setPersonnelMode('keep-ratio')}
                  selected={personnelMode === 'keep-ratio'}
                  subtext={
                    lang === 'es'
                      ? 'Usaremos como referencia el porcentaje actual de gastos de personal sobre ventas de tu empresa.'
                      : 'We will use your company’s current personnel-expenses-to-revenue ratio as a reference.'
                  }
                  title={lang === 'es' ? 'Mantener gastos de personal como porcentaje de ventas' : 'Keep personnel expenses as a percentage of revenue'}
                />
                <OptionCard
                  onClick={() => setPersonnelMode('constant-growth')}
                  selected={personnelMode === 'constant-growth'}
                  subtext={
                    lang === 'es'
                      ? 'Define una tasa anual de crecimiento para los gastos de personal durante los próximos 5 años.'
                      : 'Define an annual growth rate for personnel expenses over the next 5 years.'
                  }
                  title={lang === 'es' ? 'Hacer crecer los gastos de personal a una tasa constante' : 'Grow personnel expenses at a constant rate'}
                />
                <OptionCard
                  onClick={() => setPersonnelMode('benchmark-growth')}
                  selected={personnelMode === 'benchmark-growth'}
                  subtext={
                    lang === 'es'
                      ? 'Aplicaremos el nivel del benchmark y la tasa de crecimiento observada en los últimos 3 años.'
                      : 'We will apply the benchmark level and the growth rate observed over the last 3 years.'
                  }
                  title={lang === 'es' ? 'Usar benchmark sectorial y su crecimiento reciente' : 'Use the sector benchmark and its recent growth'}
                />
                <OptionCard
                  onClick={() => setPersonnelMode('converge-benchmark')}
                  selected={personnelMode === 'converge-benchmark'}
                  subtext={
                    lang === 'es'
                      ? 'La empresa irá convergiendo desde su nivel actual hasta el benchmark sectorial en el plazo que indiques.'
                      : 'The company will move from its current level toward the sector benchmark over the period you choose.'
                  }
                  title={lang === 'es' ? 'Converger con el benchmark en X años' : 'Converge to the benchmark over X years'}
                />
              </div>
              {personnelMode === 'constant-growth' && (
                <label className="block text-sm text-mutedInk">
                  annual growth %
                  <input className="mt-1 w-full rounded-lg border border-line px-3 py-2 font-editorial text-slateInk" onChange={(e) => setPersonnelGrowth(Number(e.target.value) || 0)} type="number" value={personnelGrowth} />
                </label>
              )}
              {personnelMode === 'converge-benchmark' && (
                <label className="block text-sm text-mutedInk">
                  X years
                  <input
                    className="mt-1 w-full rounded-lg border border-line px-3 py-2 font-editorial text-slateInk"
                    min={1}
                    onChange={(e) => setPersonnelConvergeYears(Math.max(1, Number(e.target.value) || 1))}
                    type="number"
                    value={personnelConvergeYears}
                  />
                </label>
              )}
              <SummaryGrid
                assumption={
                  <>
                    {personnelMode === 'keep-ratio' && <p>{`current ratio: ${formatNumber(personnelRatioCurrent, lang)}%`}</p>}
                    {personnelMode === 'constant-growth' && <p>{`growth rate: ${formatNumber(personnelGrowth, lang)}%`}</p>}
                    {personnelMode === 'benchmark-growth' && <p>{`benchmark + benchmark growth: ${formatNumber(BENCHMARK_PERSONNEL_RATIO, lang)}% + ${formatNumber(BENCHMARK_RATE, lang)}%`}</p>}
                    {personnelMode === 'converge-benchmark' && <p>{`linear convergence in X years: ${personnelConvergeYears}`}</p>}
                  </>
                }
                benchmark={
                  <>
                    <p>{`benchmark Personnel Expenses / Revenue: ${formatNumber(BENCHMARK_PERSONNEL_RATIO, lang)}%`}</p>
                    <p>{`benchmark growth over the last 3 years: ${formatNumber(BENCHMARK_RATE, lang)}%`}</p>
                  </>
                }
                current={
                  <>
                    <p>{`current personnel expense: ${formatMoney(CURRENT_PERSONNEL, lang)}`}</p>
                    <p>{`current Personnel Expenses / Revenue: ${formatNumber(personnelRatioCurrent, lang)}%`}</p>
                  </>
                }
                year5={
                  <>
                    <p>{`Year 5 personnel expense: ${formatMoney(CURRENT_PERSONNEL * 1.1, lang)}`}</p>
                    <p>{`Year 5 Personnel Expenses / Revenue: ${formatNumber(BENCHMARK_PERSONNEL_RATIO, lang)}%`}</p>
                  </>
                }
              />
            </>
          )}
        </SectionCard>

        <SectionCard title="CAPEX">
          <p className="font-editorial text-lg text-slateInk">{t.capexQuestion}</p>
          <div className="grid gap-2">
            <OptionCard
              onClick={() => setCapexMode('investment-plan')}
              selected={capexMode === 'investment-plan'}
              subtext={
                lang === 'es'
                  ? 'Introduce tu plan de inversiones para los próximos 5 años en la unidad seleccionada.'
                  : 'Enter your investment plan for the next 5 years in the selected unit.'
              }
              title={lang === 'es' ? 'Plan de inversiones en los próximos 5 años' : 'Investment plan for the next 5 years'}
            />
            <OptionCard
              onClick={() => setCapexMode('reinvest-maintain')}
              selected={capexMode === 'reinvest-maintain'}
              subtext={
                lang === 'es'
                  ? 'Supondremos que el CAPEX será igual a la amortización proyectada.'
                  : 'We will assume CAPEX is equal to projected depreciation and amortization.'
              }
              title={lang === 'es' ? 'Reinvertir para reponer' : 'Reinvest to maintain the asset base'}
            />
            <OptionCard
              onClick={() => setCapexMode('constant-ratio')}
              selected={capexMode === 'constant-ratio'}
              subtext={
                lang === 'es'
                  ? 'Usaremos el ratio actual de tu empresa y te pediremos que lo confirmes.'
                  : 'We will use your company’s current ratio and ask you to confirm it.'
              }
              title={lang === 'es' ? 'Mantener ratio constante' : 'Keep a constant ratio'}
            />
            <OptionCard
              onClick={() => setCapexMode('converge-benchmark-5y')}
              selected={capexMode === 'converge-benchmark-5y'}
              subtext={
                lang === 'es'
                  ? 'Usaremos los ratios de los comparables para que la empresa converja a ellos en un plan a 5 años.'
                  : 'We will use comparable-company ratios so the company converges to them over a 5-year plan.'
              }
              title={lang === 'es' ? 'Converger con benchmark en 5 años' : 'Converge to benchmark over 5 years'}
            />
          </div>

          {capexMode === 'investment-plan' && (
            <div className="space-y-2">
              <p className="text-sm text-mutedInk">Activo Fijo / Fixed Assets</p>
              <div className="grid gap-2 sm:grid-cols-5">
                {YEARS.map((year, index) => (
                  <label className="text-sm text-mutedInk" key={`fixed-${year}`}>
                    {`Year ${year}`}
                    <input
                      className="mt-1 w-full rounded-lg border border-line px-2 py-2"
                      onChange={(e) => {
                        const next = [...fixedPlan];
                        next[index] = Number(e.target.value) || 0;
                        setFixedPlan(next);
                      }}
                      type="number"
                      value={fixedPlan[index]}
                    />
                  </label>
                ))}
              </div>

              <p className="text-sm text-mutedInk">Activos Intangibles / Intangible Assets</p>
              <div className="grid gap-2 sm:grid-cols-5">
                {YEARS.map((year, index) => (
                  <label className="text-sm text-mutedInk" key={`intangible-${year}`}>
                    {`Year ${year}`}
                    <input
                      className="mt-1 w-full rounded-lg border border-line px-2 py-2"
                      onChange={(e) => {
                        const next = [...intangiblePlan];
                        next[index] = Number(e.target.value) || 0;
                        setIntangiblePlan(next);
                      }}
                      type="number"
                      value={intangiblePlan[index]}
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {capexMode === 'constant-ratio' && (
            <div className="grid gap-3 md:grid-cols-2">
              <label className="font-editorial text-sm text-mutedInk">
                Fixed Assets / Revenue
                <input className="mt-1 w-full rounded-lg border border-line px-3 py-2 font-editorial text-slateInk" onChange={(e) => setFixedRatio(Number(e.target.value) || 0)} type="number" value={fixedRatio} />
              </label>
              <label className="font-editorial text-sm text-mutedInk">
                Intangible Assets / Revenue
                <input className="mt-1 w-full rounded-lg border border-line px-3 py-2 font-editorial text-slateInk" onChange={(e) => setIntangibleRatio(Number(e.target.value) || 0)} type="number" value={intangibleRatio} />
              </label>
            </div>
          )}

          <SummaryGrid
            assumption={
              <>
                {capexMode === 'investment-plan' && <p>investment plan</p>}
                {capexMode === 'reinvest-maintain' && <p>CAPEX = depreciation</p>}
                {capexMode === 'constant-ratio' && <p>constant ratio</p>}
                {capexMode === 'converge-benchmark-5y' && <p>benchmark convergence</p>}
              </>
            }
            benchmark={
              <>
                <p>{`benchmark Fixed Assets / Revenue: ${formatNumber(BENCHMARK_FIXED_RATIO, lang)}%`}</p>
                <p>{`benchmark Intangible Assets / Revenue: ${formatNumber(BENCHMARK_INTANGIBLE_RATIO, lang)}%`}</p>
              </>
            }
            current={
              <>
                <p>{`current Fixed Assets: ${formatMoney(CURRENT_FIXED_ASSETS, lang)}`}</p>
                <p>{`current Intangible Assets: ${formatMoney(CURRENT_INTANGIBLE_ASSETS, lang)}`}</p>
                <p>{`current Fixed Assets / Revenue: ${formatNumber((CURRENT_FIXED_ASSETS / BASE_REVENUE) * 100, lang)}%`}</p>
                <p>{`current Intangible Assets / Revenue: ${formatNumber((CURRENT_INTANGIBLE_ASSETS / BASE_REVENUE) * 100, lang)}%`}</p>
              </>
            }
            year5={
              <>
                <p>{`Year 5 CAPEX: ${formatMoney(fixedPlan[4] + intangiblePlan[4], lang)}`}</p>
                <p>{`cumulative 5-year CAPEX: ${formatMoney([...fixedPlan, ...intangiblePlan].reduce((a, b) => a + b, 0), lang)}`}</p>
                <p>{`Year 5 Fixed Assets / Revenue: ${formatNumber(fixedRatio, lang)}%`}</p>
                <p>{`Year 5 Intangible Assets / Revenue: ${formatNumber(intangibleRatio, lang)}%`}</p>
              </>
            }
          />
        </SectionCard>

        {impliedPolicyFlags.length > 0 && (
          <section className="rounded-2xl border border-line bg-white p-5 shadow-whisper">
            {impliedPolicyFlags.map((flag) => (
              <p className="text-sm text-slateInk" key={flag}>
                {flag}
              </p>
            ))}
          </section>
        )}
      </div>
    </WizardStepShell>
  );
}
