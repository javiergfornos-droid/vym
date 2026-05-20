'use client';

import { type ReactNode, useMemo, useState } from 'react';

import { WizardStepShell } from '@/components/wizard-step-shell';
import { type Language } from '@/lib/i18n';

type Props = {
  lang: Language;
};

type RevenueMode = 'initial-plus-growth' | 'year1-year5' | 'constant-5y' | 'benchmark-growth';
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
  labels,
  current,
  assumption,
  benchmark,
  year5,
}: {
  labels: { current: string; assumption: string; benchmark: string; year5: string };
  current: ReactNode;
  assumption: ReactNode;
  benchmark: ReactNode;
  year5: ReactNode;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      {[
        { label: labels.current, content: current },
        { label: labels.assumption, content: assumption },
        { label: labels.benchmark, content: benchmark },
        { label: labels.year5, content: year5 },
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

type RevenueAssumptionsTranslations = {
  summary: { current: string; assumption: string; benchmark: string; year5: string };
  labels: Record<string, string>;
  revenueTitle: string;
  revenueQuestion: string;
  addLinesQuestion: string;
  viewImpact: string;
  yes: string;
  no: string;
  purchasesQuestion: string;
  adminQuestion: string;
  personnelQuestion: string;
  fteQuestion: string;
  capexQuestion: string;
  amortizationQuestion: string;
};

export function RevenueAssumptionsSpeedTrack({ lang }: Props) {
  const t: RevenueAssumptionsTranslations = {
    summary: { current: lang === 'es' ? 'Actual' : 'Current', assumption: lang === 'es' ? 'Hipótesis' : 'Assumption', benchmark: 'Benchmark', year5: lang === 'es' ? 'Año 5' : 'Year 5' },
    labels: {
      baseRevenue: lang === 'es' ? 'Ventas base' : 'base revenue',
      annualGrowth: lang === 'es' ? 'Crecimiento anual' : 'annual growth',
      additionalRevenue: lang === 'es' ? 'Ingresos adicionales' : 'additional revenue',
      currentRevenue: lang === 'es' ? 'Ventas actuales' : 'current revenue',
      projectedYear5Revenue: lang === 'es' ? 'Ventas proyectadas en el año 5' : 'projected Year 5 revenue',
      year5Revenue: lang === 'es' ? 'Ventas año 5' : 'year 5 revenue',
      impliedCagr: lang === 'es' ? 'CAGR implícito, si aplica' : 'implied CAGR if applicable',
      benchmarkPosition: lang === 'es' ? 'posición frente a las empresas comparables' : 'benchmark position',
      benchmarkGrowth3y: lang === 'es' ? 'Crecimiento de empresas comparables de los últimos 3 años' : 'benchmark growth over the last 3 years',
      comparables: lang === 'es' ? 'Número de empresas comparables' : 'number of comparables',
      geography: lang === 'es' ? 'Geografía: España' : 'geography: Spain',
      currentPurchases: lang === 'es' ? 'Compras actuales' : 'current purchases',
      purchasesRevenue: lang === 'es' ? 'Ratio Compras/Ventas' : 'purchases / revenue',
      currentAdmin: lang === 'es' ? 'Otros Gastos de Explotación actuales' : 'current administrative expenses',
      adminRevenue: lang === 'es' ? 'Ratio [Otros Gastos de Explotación/Ventas]' : 'administrative expenses / revenue',
      currentFte: lang === 'es' ? 'Número de empleados actuales' : 'current FTE',
      currentPersonnelExpense: lang === 'es' ? 'Gastos de personal actuales' : 'current personnel expense',
      currentCostPerEmployee: lang === 'es' ? 'Coste actual por empleado' : 'current cost per employee',
      benchmarkCostPerEmployee: lang === 'es' ? 'Coste por empleado de empresas comparables' : 'benchmark cost per employee',
      inflationRef: lang === 'es' ? 'Referencia de inflación 2%, si aplica' : 'inflation reference 2% if applicable',
      year5Fte: lang === 'es' ? 'Ratio [Número de empleados/FTE] año en el año 5' : 'Year 5 FTE',
      year5CostPerEmployee: lang === 'es' ? 'Coste por empleado en el año 5' : 'Year 5 cost per employee',
      year5TotalPersonnelExpense: lang === 'es' ? 'Gasto total de personal en el año 5' : 'Year 5 total personnel expense',
      costPerEmployeeGrowth: lang === 'es' ? 'Crecimiento del coste por empleado' : 'cost-per-employee growth',

      currentRatio: lang === 'es' ? 'Current ratio' : 'current ratio',
      growthRate: lang === 'es' ? 'growth rate' : 'growth rate',
      benchmarkPlusGrowth: lang === 'es' ? 'benchmark + benchmark growth' : 'benchmark + benchmark growth',
      linearConvergenceXYears: lang === 'es' ? 'linear convergence in X years' : 'linear convergence in X years',
      linearConvergence: lang === 'es' ? 'linear convergence' : 'linear convergence',
      benchmarkPurchasesRevenue: lang === 'es' ? 'Ratio [Compras/Ventas] de empresas comparables' : 'benchmark Purchases / Revenue',
      year5Purchases: lang === 'es' ? 'Compras en el año 5' : 'Year 5 purchases',
      year5PurchasesRevenue: lang === 'es' ? 'Ratio [Compras/Ventas] en el año 5' : 'Year 5 Purchases / Revenue',
      benchmarkAdminRevenue: lang === 'es' ? 'Ratio [Otros Gastos de Explotación/Ventas] de empresas comparables' : 'benchmark Administrative Expenses / Revenue',
      year5AdminExpenses: lang === 'es' ? 'Otros Gastos de Explotación en el año 5' : 'Year 5 administrative expenses',
      year5AdminRevenue: lang === 'es' ? 'Ratio [Otros Gastos de Explotación/Ventas] en el año 5' : 'Year 5 Administrative Expenses / Revenue',
      currentPersonnelRevenue: lang === 'es' ? 'Ratio [Gastos de personal/Ventas] actual' : 'current Personnel Expenses / Revenue',
      benchmarkPersonnelRevenue: lang === 'es' ? 'Ratio [Gastos de personal/Ventas] de empresas comparables' : 'benchmark Personnel Expenses / Revenue',
      year5PersonnelExpense: lang === 'es' ? 'Gastos de personal en el año 5' : 'Year 5 personnel expense',
      year5PersonnelRevenue: lang === 'es' ? 'Ratio [Gastos de personal/Ventas] en el año 5' : 'Year 5 Personnel Expenses / Revenue',
      benchmarkFixedRevenue: lang === 'es' ? 'Ratio [Activo Fijo/Ventas] de empresas comparables' : 'benchmark Fixed Assets / Revenue',
      benchmarkIntangibleRevenue: lang === 'es' ? 'Ratio [Activo Intangible/Ventas] de empresas comparables' : 'benchmark Intangible Assets / Revenue',
      currentFixedAssets: lang === 'es' ? 'Activo Fijo actual' : 'current Fixed Assets',
      currentIntangibleAssets: lang === 'es' ? 'Activos intangibles actuales' : 'current Intangible Assets',
      fixedAssetsRevenue: lang === 'es' ? 'Ratio [Activo Fijo/Ventas]' : 'fixed assets / revenue',
      intangibleAssetsRevenue: lang === 'es' ? 'Ratio [Activo Intangibles/Ventas]' : 'intangible assets / revenue',
      year5Capex: lang === 'es' ? 'CAPEX en el año 5' : 'Year 5 CAPEX',
      cumulative5yCapex: lang === 'es' ? 'CAPEX acumulado a los 5 años' : 'cumulative 5-year CAPEX',
      year5FixedRevenue: lang === 'es' ? 'Ratio [Activo Fijo/Ventas] en el año 5' : 'year 5 fixed assets / revenue',
      year5IntangibleRevenue: lang === 'es' ? 'Ratio [Activo Intangible/Ventas] en el año 5' : 'year 5 intangible assets / revenue',
      benchmarkGrowthLast3y: lang === 'es' ? 'Crecimiento del benchmark en los últimos 3 años' : 'benchmark growth over the last 3 years',
      annualGrowthLabel: lang === 'es' ? 'Crecimiento anual %' : 'annual growth %',
      xYears: lang === 'es' ? 'X años' : 'X years',
      yearLabel: lang === 'es' ? 'Año' : 'Year',
      fixedAssets: lang === 'es' ? 'Activo Fijo' : 'Fixed Assets',
      intangibleAssets: lang === 'es' ? 'Activos Intangibles' : 'Intangible Assets',
      fixedAssetsRevenueLabel: lang === 'es' ? 'Ratio [Activo Fijo/Ventas]' : 'Fixed Assets / Revenue',
      intangibleAssetsRevenueLabel: lang === 'es' ? 'Ratio [Activos Intangibles/Ventas]' : 'Intangible Assets / Revenue',
      investmentPlan: lang === 'es' ? 'Plan de Inversiones' : 'investment plan',
      currentAmortization: lang === 'es' ? 'Amortizaciones actuales' : 'Current depreciation and amortization',
      currentAmortizableAssets: lang === 'es' ? 'Activos amortizables actuales' : 'Current amortizable assets',
      amortizationOverAmortizableAssets:
        lang === 'es' ? 'Amortizaciones / activos amortizables' : 'Depreciation and amortization / amortizable assets',
      amortizationOverRevenue: lang === 'es' ? 'Amortizaciones / ventas' : 'Depreciation and amortization / revenue',
      amortizationRatioAssumption: lang === 'es' ? 'Ratio sobre activos amortizables' : 'Ratio over amortizable assets',
      amortizationOverRevenueBenchmark:
        lang === 'es' ? 'Amortizaciones / ventas benchmark' : 'Benchmark depreciation and amortization / revenue',
      year5Amortization: lang === 'es' ? 'Amortizaciones año 5' : 'Year 5 depreciation and amortization',
      year5AmortizationOverRevenue:
        lang === 'es' ? 'Amortizaciones / ventas año 5' : 'Year 5 depreciation and amortization / revenue',
    },
    revenueTitle: lang === 'es' ? 'Hipótesis de ingresos' : 'Revenue assumptions',
    revenueQuestion: lang === 'es' ? '¿Cómo quieres proyectar tus ingresos?' : 'How would you like to project your revenue?',
    addLinesQuestion:
      lang === 'es'
        ? 'Añadir los ingresos adicionales de una nueva línea de negocio'
        : 'Add additional revenue from a new business line',
    viewImpact: lang === 'es' ? 'Ver impacto' : 'View impact',
    yes: lang === 'es' ? 'Sí' : 'Yes',
    no: lang === 'es' ? 'No' : 'No',
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
    amortizationQuestion:
      lang === 'es'
        ? '¿Cómo quieres proyectar las amortizaciones?'
        : 'How would you like to project depreciation and amortization?',
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
    if (revenueMode === 'initial-plus-growth') return baseRevenue * (1 + revenueGrowth / 100) ** 5;
    if (revenueMode === 'year1-year5') return year5RevenueTarget;
    if (revenueMode === 'benchmark-growth') return baseRevenue * (1 + BENCHMARK_RATE / 100) ** 5;
    return constantRevenue;
  }, [revenueMode, baseRevenue, revenueGrowth, year5RevenueTarget, constantRevenue]);

  const revenueProjectionYear5WithAdditional = revenueProjectionYear5 + additionalRevenueAmount;
  const currentAmortization = DEPRECIATION_PROXY[0];
  const currentAmortizableAssets = CURRENT_FIXED_ASSETS + CURRENT_INTANGIBLE_ASSETS;
  const currentAmortizationRatio = currentAmortizableAssets > 0 ? currentAmortization / currentAmortizableAssets : 0;
  const currentAmortizationRevenueRatio = BASE_REVENUE > 0 ? (currentAmortization / BASE_REVENUE) * 100 : 0;
  const projectedYear5AmortizableAssets = currentAmortizableAssets + fixedPlan.reduce((a, b) => a + b, 0) + intangiblePlan.reduce((a, b) => a + b, 0);
  const projectedYear5Amortization = projectedYear5AmortizableAssets * currentAmortizationRatio;
  const year5AmortizationRevenueRatio = revenueProjectionYear5WithAdditional > 0 ? (projectedYear5Amortization / revenueProjectionYear5WithAdditional) * 100 : 0;
  const benchmarkAmortizationRevenueRatio = currentAmortizationRevenueRatio;

  const impliedRevenueCagr = useMemo(() => {
    if (baseRevenue <= 0 || revenueProjectionYear5WithAdditional <= 0) return null;
    return (Math.pow(revenueProjectionYear5WithAdditional / baseRevenue, 1 / 5) - 1) * 100;
  }, [baseRevenue, revenueProjectionYear5WithAdditional]);

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
          <div className="grid gap-2 md:grid-cols-2">
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
                  (index === 3 && revenueMode === 'benchmark-growth')
                    ? 'border-accent bg-ivory'
                    : 'border-line bg-white'
                }`}
                key={copy}
                onClick={() =>
                  setRevenueMode(
                    index === 0 ? 'initial-plus-growth' : index === 1 ? 'year1-year5' : index === 2 ? 'constant-5y' : 'benchmark-growth',
                  )
                }
                type="button"
              >
                {copy}
              </button>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="font-editorial text-sm text-mutedInk">
              {t.labels.baseRevenue}
              <input
                className="no-spinner mt-1 w-full rounded-lg border border-line px-3 py-2 font-editorial"
                onChange={(e) => setBaseRevenue(Number(e.target.value) || 0)}
                type="number"
                value={baseRevenue}
              />
            </label>
            {revenueMode === 'initial-plus-growth' && (
              <label className="font-editorial text-sm text-mutedInk">
                {t.labels.annualGrowth}
                <input
                  className="no-spinner mt-1 w-full rounded-lg border border-line px-3 py-2 font-editorial"
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
                    className="no-spinner mt-1 w-full rounded-lg border border-line px-3 py-2 font-editorial"
                    onChange={(e) => setYear1Revenue(Number(e.target.value) || 0)}
                    type="number"
                    value={year1Revenue}
                  />
                </label>
                <label className="font-editorial text-sm text-mutedInk">
                  {t.labels.year5Revenue}
                  <input
                    className="no-spinner mt-1 w-full rounded-lg border border-line px-3 py-2 font-editorial"
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
                  className="no-spinner mt-1 w-full rounded-lg border border-line px-3 py-2 font-editorial"
                  onChange={(e) => setConstantRevenue(Number(e.target.value) || 0)}
                  type="number"
                  value={constantRevenue}
                />
              </label>
            )}
          </div>

          <div className="rounded-xl border border-line bg-white p-3">
            <p className="font-editorial text-lg text-slateInk">{t.addLinesQuestion}</p>
            <p className="font-editorial text-sm text-mutedInk">
              {lang === 'es'
                ? 'Introduce el importe adicional en la unidad seleccionada. Este ingreso adicional se mantendrá constante durante los próximos 5 años.'
                : 'Enter the additional amount in the selected unit. This additional revenue will remain constant over the next 5 years.'}
            </p>
            <label className="mt-2 block font-editorial text-sm text-mutedInk">
              {lang === 'es' ? 'Importe adicional' : 'Additional amount'}
              <input
                className="no-spinner mt-1 w-full rounded-lg border border-line px-3 py-2 font-editorial"
                min={0}
                onChange={(e) => setAdditionalRevenueAmount(Math.max(0, Number(e.target.value) || 0))}
                type="number"
                value={additionalRevenueAmount}
              />
            </label>
          </div>

          <div className="rounded-xl border border-line bg-ivory p-3 font-editorial">
            <p className="font-editorial text-sm text-slateInk">
              {lang === 'es' ? `Referencia VYM: ${formatNumber(BENCHMARK_RATE, lang)} %` : `VYM reference: ${formatNumber(BENCHMARK_RATE, lang)}%`}
            </p>
            <p className="text-sm text-mutedInk">{lang === 'es' ? 'Comparables: 20 empresas · España' : 'Comparables: 20 companies · Spain'}</p>
          </div>

          <SummaryGrid
            labels={t.summary}
            assumption={
              <>
                {revenueMode === 'initial-plus-growth' && <p>{`${t.labels.annualGrowth}: ${formatNumber(revenueGrowth, lang)}%`}</p>}
                {revenueMode === 'year1-year5' && <p>{`or implied CAGR: ${formatNumber(impliedRevenueCagr ?? 0, lang)}%`}</p>}
                {revenueMode === 'constant-5y' && <p>{`or constant value: ${formatMoney(constantRevenue, lang)}`}</p>}
                {revenueMode === 'benchmark-growth' && <p>{`Benchmark ${t.labels.annualGrowth.toLowerCase()}: ${formatNumber(BENCHMARK_RATE, lang)}%`}</p>}
                <p>{`${t.labels.additionalRevenue}: ${formatMoney(additionalRevenueAmount, lang)}`}</p>
              </>
            }
            benchmark={
              <>
                <p>{`${t.labels.benchmarkGrowth3y}: ${formatNumber(BENCHMARK_RATE, lang)}%`}</p>
                <p>{`${t.labels.comparables}: 20`}</p>
                <p>{t.labels.geography}</p>
              </>
            }
            current={<p>{`${t.labels.currentRevenue}: ${formatMoney(baseRevenue, lang)}`}</p>}
            year5={<p>{`${t.labels.projectedYear5Revenue}: ${formatMoney(revenueProjectionYear5WithAdditional, lang)}`}</p>}
          />

          <button className="rounded-full bg-accent px-5 py-2 font-editorial text-sm text-ivory" onClick={() => setShowImpact(true)} type="button">
            {t.viewImpact}
          </button>
          {showImpact && (
            <div className="rounded-xl border border-line p-3 font-editorial text-sm text-slateInk">
              <p>{`${t.labels.baseRevenue}: ${formatMoney(baseRevenue, lang)}`}</p>
              <p>{`${t.labels.year5Revenue}: ${formatMoney(revenueProjectionYear5WithAdditional, lang)}`}</p>
              <p>{`${t.labels.impliedCagr}: ${impliedRevenueCagr === null ? '—' : `${formatNumber(impliedRevenueCagr, lang)}%`}`}</p>
              <p>{`${t.labels.benchmarkPosition}: ${revenueBenchmarkPosition}`}</p>
            </div>
          )}
        </SectionCard>

        <SectionCard title={lang === 'es' ? 'Compras / Aprovisionamientos' : 'Purchases / COGS'}>
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
              {t.labels.annualGrowthLabel}
              <input className="no-spinner mt-1 w-full rounded-lg border border-line px-3 py-2" onChange={(e) => setPurchasesGrowth(Number(e.target.value) || 0)} type="number" value={purchasesGrowth} />
            </label>
          )}
          {purchasesMode === 'converge-benchmark' && (
            <label className="block text-sm text-mutedInk">
              {t.labels.xYears}
              <input
                className="no-spinner mt-1 w-full rounded-lg border border-line px-3 py-2"
                min={1}
                onChange={(e) => setPurchasesConvergeYears(Math.max(1, Number(e.target.value) || 1))}
                type="number"
                value={purchasesConvergeYears}
              />
            </label>
          )}
          <SummaryGrid
            labels={t.summary}
            assumption={
              <>
                {purchasesMode === 'keep-ratio' && <p>{`${t.labels.currentRatio}: ${formatNumber(purchasesRatioCurrent, lang)}%`}</p>}
                {purchasesMode === 'constant-growth' && <p>{`${t.labels.growthRate}: ${formatNumber(purchasesGrowth, lang)}%`}</p>}
                {purchasesMode === 'benchmark-growth' && <p>{`${t.labels.benchmarkPlusGrowth}: ${formatNumber(BENCHMARK_PURCHASES_RATIO, lang)}% + ${formatNumber(BENCHMARK_RATE, lang)}%`}</p>}
                {purchasesMode === 'converge-benchmark' && <p>{`${t.labels.linearConvergenceXYears}: ${purchasesConvergeYears}`}</p>}
              </>
            }
            benchmark={
              <>
                <p>{`${t.labels.benchmarkPurchasesRevenue}: ${formatNumber(BENCHMARK_PURCHASES_RATIO, lang)}%`}</p>
                <p>{`${t.labels.benchmarkGrowthLast3y}: ${formatNumber(BENCHMARK_RATE, lang)}%`}</p>
              </>
            }
            current={
              <>
                <p>{`${t.labels.currentPurchases}: ${formatMoney(CURRENT_PURCHASES, lang)}`}</p>
                <p>{`${t.labels.purchasesRevenue}: ${formatNumber(purchasesRatioCurrent, lang)}%`}</p>
              </>
            }
            year5={
              <>
                <p>{`${t.labels.year5Purchases}: ${formatMoney(CURRENT_PURCHASES * 1.1, lang)}`}</p>
                <p>{`${t.labels.year5PurchasesRevenue}: ${formatNumber(BENCHMARK_PURCHASES_RATIO, lang)}%`}</p>
              </>
            }
          />
        </SectionCard>

        <SectionCard title={lang === 'es' ? 'Gastos Administrativos' : 'Administrative expenses'}>
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
              {t.labels.annualGrowthLabel}
              <input className="no-spinner mt-1 w-full rounded-lg border border-line px-3 py-2" onChange={(e) => setAdminGrowth(Number(e.target.value) || 0)} type="number" value={adminGrowth} />
            </label>
          )}
          {adminMode === 'converge-benchmark' && (
            <label className="block text-sm text-mutedInk">
              {t.labels.xYears}
              <input
                className="no-spinner mt-1 w-full rounded-lg border border-line px-3 py-2"
                min={1}
                onChange={(e) => setAdminConvergeYears(Math.max(1, Number(e.target.value) || 1))}
                type="number"
                value={adminConvergeYears}
              />
            </label>
          )}
          <SummaryGrid
            labels={t.summary}
            assumption={
              <>
                {adminMode === 'keep-ratio' && <p>{`${t.labels.currentRatio}: ${formatNumber(adminRatioCurrent, lang)}%`}</p>}
                {adminMode === 'constant-growth' && <p>{`${t.labels.growthRate}: ${formatNumber(adminGrowth, lang)}%`}</p>}
                {adminMode === 'benchmark-growth' && <p>{`${t.labels.benchmarkPlusGrowth}: ${formatNumber(BENCHMARK_ADMIN_RATIO, lang)}% + ${formatNumber(BENCHMARK_RATE, lang)}%`}</p>}
                {adminMode === 'converge-benchmark' && <p>{`${t.labels.linearConvergence}: ${adminConvergeYears} ${lang === 'es' ? 'años' : 'years'}`}</p>}
              </>
            }
            benchmark={
              <>
                <p>{`${t.labels.benchmarkAdminRevenue}: ${formatNumber(BENCHMARK_ADMIN_RATIO, lang)}%`}</p>
                <p>{`${t.labels.benchmarkGrowthLast3y}: ${formatNumber(BENCHMARK_RATE, lang)}%`}</p>
              </>
            }
            current={
              <>
                <p>{`${t.labels.currentAdmin}: ${formatMoney(CURRENT_ADMIN, lang)}`}</p>
                <p>{`${t.labels.adminRevenue}: ${formatNumber(adminRatioCurrent, lang)}%`}</p>
              </>
            }
            year5={
              <>
                <p>{`${t.labels.year5AdminExpenses}: ${formatMoney(CURRENT_ADMIN * 1.1, lang)}`}</p>
                <p>{`${t.labels.year5AdminRevenue}: ${formatNumber(BENCHMARK_ADMIN_RATIO, lang)}%`}</p>
              </>
            }
          />
        </SectionCard>

        <SectionCard title={lang === 'es' ? 'Gastos de Personal' : 'Personnel expenses'}>
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
                {t.labels.currentFte}
                <input className="no-spinner mt-1 w-full rounded-lg border border-line px-3 py-2" min={1} onChange={(e) => setCurrentFte(Math.max(1, Number(e.target.value) || 1))} type="number" value={currentFte} />
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
                      {`${t.labels.yearLabel} ${year}`}
                      <input
                        className="no-spinner mt-1 w-full rounded-lg border border-line px-2 py-2"
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
                  {t.labels.costPerEmployeeGrowth}
                  <input
                    className="no-spinner mt-1 w-full rounded-lg border border-line px-3 py-2"
                    onChange={(e) => setCostPerEmployeeGrowth(Number(e.target.value) || 0)}
                    type="number"
                    value={costPerEmployeeGrowth}
                  />
                </label>
              )}
              <SummaryGrid
                labels={t.summary}
                assumption={
                  <>
                    {fteMode === 'add-employees' && <p>{`additional employees by year: ${additionalEmployees.join(', ')}`}</p>}
                    {fteMode === 'grow-cost-per-employee' && <p>{`${t.labels.costPerEmployeeGrowth}: ${formatNumber(costPerEmployeeGrowth, lang)}%`}</p>}
                    {fteMode === 'benchmark-cpe-growth' && <p>benchmark</p>}
                    {fteMode === 'inflation-cpe-growth' && <p>{`inflation 2%: ${INFLATION_REF}%`}</p>}
                  </>
                }
                benchmark={
                  <>
                    <p>{`${t.labels.benchmarkCostPerEmployee}: ${new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'en-US').format(BENCHMARK_PEOPLE_COST)}`}</p>
                    <p>{`${t.labels.inflationRef}: ${INFLATION_REF}%`}</p>
                  </>
                }
                current={
                  <>
                    <p>{`${t.labels.currentFte}: ${formatNumber(currentFte, lang, 0)}`}</p>
                    <p>{`${t.labels.currentPersonnelExpense}: ${formatMoney(CURRENT_PERSONNEL, lang)}`}</p>
                    <p>{`${t.labels.currentCostPerEmployee}: ${new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'en-US').format(personnelCostPerEmployeeCurrent)}`}</p>
                  </>
                }
                year5={
                  <>
                    <p>{`${t.labels.year5Fte}: ${formatNumber(currentFte + additionalEmployees.reduce((a, b) => a + b, 0), lang, 0)}`}</p>
                    <p>{`${t.labels.year5CostPerEmployee}: ${new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'en-US').format(personnelCostPerEmployeeCurrent * 1.1)}`}</p>
                    <p>{`${t.labels.year5TotalPersonnelExpense}: ${formatMoney(CURRENT_PERSONNEL * 1.15, lang)}`}</p>
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
                  {t.labels.annualGrowthLabel}
                  <input className="no-spinner mt-1 w-full rounded-lg border border-line px-3 py-2" onChange={(e) => setPersonnelGrowth(Number(e.target.value) || 0)} type="number" value={personnelGrowth} />
                </label>
              )}
              {personnelMode === 'converge-benchmark' && (
                <label className="block text-sm text-mutedInk">
                  {t.labels.xYears}
                  <input
                    className="no-spinner mt-1 w-full rounded-lg border border-line px-3 py-2"
                    min={1}
                    onChange={(e) => setPersonnelConvergeYears(Math.max(1, Number(e.target.value) || 1))}
                    type="number"
                    value={personnelConvergeYears}
                  />
                </label>
              )}
              <SummaryGrid
                labels={t.summary}
                assumption={
                  <>
                    {personnelMode === 'keep-ratio' && <p>{`${t.labels.currentRatio}: ${formatNumber(personnelRatioCurrent, lang)}%`}</p>}
                    {personnelMode === 'constant-growth' && <p>{`${t.labels.growthRate}: ${formatNumber(personnelGrowth, lang)}%`}</p>}
                    {personnelMode === 'benchmark-growth' && <p>{`${t.labels.benchmarkPlusGrowth}: ${formatNumber(BENCHMARK_PERSONNEL_RATIO, lang)}% + ${formatNumber(BENCHMARK_RATE, lang)}%`}</p>}
                    {personnelMode === 'converge-benchmark' && <p>{`${t.labels.linearConvergenceXYears}: ${personnelConvergeYears}`}</p>}
                  </>
                }
                benchmark={
                  <>
                    <p>{`${t.labels.benchmarkPersonnelRevenue}: ${formatNumber(BENCHMARK_PERSONNEL_RATIO, lang)}%`}</p>
                    <p>{`${t.labels.benchmarkGrowthLast3y}: ${formatNumber(BENCHMARK_RATE, lang)}%`}</p>
                  </>
                }
                current={
                  <>
                    <p>{`${t.labels.currentPersonnelExpense}: ${formatMoney(CURRENT_PERSONNEL, lang)}`}</p>
                    <p>{`${t.labels.currentPersonnelRevenue}: ${formatNumber(personnelRatioCurrent, lang)}%`}</p>
                  </>
                }
                year5={
                  <>
                    <p>{`${t.labels.year5PersonnelExpense}: ${formatMoney(CURRENT_PERSONNEL * 1.1, lang)}`}</p>
                    <p>{`${t.labels.year5PersonnelRevenue}: ${formatNumber(BENCHMARK_PERSONNEL_RATIO, lang)}%`}</p>
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
              <p className="text-sm text-mutedInk">{t.labels.fixedAssets}</p>
              <div className="grid gap-2 sm:grid-cols-5">
                {YEARS.map((year, index) => (
                  <label className="text-sm text-mutedInk" key={`fixed-${year}`}>
                    {`${t.labels.yearLabel} ${year}`}
                    <input
                      className="no-spinner mt-1 w-full rounded-lg border border-line px-2 py-2"
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

              <p className="text-sm text-mutedInk">{t.labels.intangibleAssets}</p>
              <div className="grid gap-2 sm:grid-cols-5">
                {YEARS.map((year, index) => (
                  <label className="text-sm text-mutedInk" key={`intangible-${year}`}>
                    {`${t.labels.yearLabel} ${year}`}
                    <input
                      className="no-spinner mt-1 w-full rounded-lg border border-line px-2 py-2"
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
              <label className="text-sm text-mutedInk">
                {t.labels.fixedAssetsRevenueLabel}
                <input className="no-spinner mt-1 w-full rounded-lg border border-line px-3 py-2" onChange={(e) => setFixedRatio(Number(e.target.value) || 0)} type="number" value={fixedRatio} />
              </label>
              <label className="text-sm text-mutedInk">
                {t.labels.intangibleAssetsRevenueLabel}
                <input className="no-spinner mt-1 w-full rounded-lg border border-line px-3 py-2" onChange={(e) => setIntangibleRatio(Number(e.target.value) || 0)} type="number" value={intangibleRatio} />
              </label>
            </div>
          )}

          <SummaryGrid
            labels={t.summary}
            assumption={
              <>
                {capexMode === 'investment-plan' && <p>{t.labels.investmentPlan}</p>}
                {capexMode === 'reinvest-maintain' && <p>CAPEX = depreciation</p>}
                {capexMode === 'constant-ratio' && <p>constant ratio</p>}
                {capexMode === 'converge-benchmark-5y' && <p>benchmark convergence</p>}
              </>
            }
            benchmark={
              <>
                <p>{`${t.labels.benchmarkFixedRevenue}: ${formatNumber(BENCHMARK_FIXED_RATIO, lang)}%`}</p>
                <p>{`${t.labels.benchmarkIntangibleRevenue}: ${formatNumber(BENCHMARK_INTANGIBLE_RATIO, lang)}%`}</p>
              </>
            }
            current={
              <>
                <p>{`${t.labels.currentFixedAssets}: ${formatMoney(CURRENT_FIXED_ASSETS, lang)}`}</p>
                <p>{`${t.labels.currentIntangibleAssets}: ${formatMoney(CURRENT_INTANGIBLE_ASSETS, lang)}`}</p>
                <p>{`${t.labels.fixedAssetsRevenue}: ${formatNumber((CURRENT_FIXED_ASSETS / BASE_REVENUE) * 100, lang)}%`}</p>
                <p>{`${t.labels.intangibleAssetsRevenue}: ${formatNumber((CURRENT_INTANGIBLE_ASSETS / BASE_REVENUE) * 100, lang)}%`}</p>
              </>
            }
            year5={
              <>
                <p>{`${t.labels.year5Capex}: ${formatMoney(fixedPlan[4] + intangiblePlan[4], lang)}`}</p>
                <p>{`${t.labels.cumulative5yCapex}: ${formatMoney([...fixedPlan, ...intangiblePlan].reduce((a, b) => a + b, 0), lang)}`}</p>
                <p>{`${t.labels.year5FixedRevenue}: ${formatNumber(fixedRatio, lang)}%`}</p>
                <p>{`${t.labels.year5IntangibleRevenue}: ${formatNumber(intangibleRatio, lang)}%`}</p>
              </>
            }
          />
        </SectionCard>

        <SectionCard title={lang === 'es' ? 'Amortizaciones' : 'Depreciation & amortization'}>
          <p className="font-editorial text-lg text-slateInk">{t.amortizationQuestion}</p>
          <div className="rounded-xl border border-accent bg-ivory p-3">
            <p className="font-editorial text-[15px] text-slateInk">
              {lang === 'es'
                ? 'Proyectar amortizaciones como porcentaje de activos amortizables'
                : 'Project depreciation and amortization as a percentage of amortizable assets'}
            </p>
            <p className="mt-1 text-sm text-mutedInk">
              {lang === 'es'
                ? 'Usaremos el ratio actual de amortizaciones sobre activos amortizables de tu empresa.'
                : 'We will use your company’s current depreciation and amortization ratio over amortizable assets.'}
            </p>
          </div>
          <p className="text-sm text-mutedInk">
            {lang === 'es' ? 'Activos amortizables = Inmovilizado Fijo + Activos Intangibles' : 'Amortizable assets = Fixed Assets + Intangible Assets'}
          </p>
          <SummaryGrid
            labels={t.summary}
            assumption={<p>{`${t.labels.amortizationRatioAssumption}: ${formatNumber(currentAmortizationRatio * 100, lang)}%`}</p>}
            benchmark={
              <>
                <p>Benchmark</p>
                <p>{`${t.labels.amortizationOverRevenueBenchmark}: ${formatNumber(benchmarkAmortizationRevenueRatio, lang)}%`}</p>
              </>
            }
            current={
              <>
                <p>{`${t.labels.currentAmortization}: ${formatMoney(currentAmortization, lang)}`}</p>
                <p>{`${t.labels.currentAmortizableAssets}: ${formatMoney(currentAmortizableAssets, lang)}`}</p>
                <p>{`${t.labels.amortizationOverAmortizableAssets}: ${formatNumber(currentAmortizationRatio * 100, lang)}%`}</p>
                <p>{`${t.labels.amortizationOverRevenue}: ${formatNumber(currentAmortizationRevenueRatio, lang)}%`}</p>
              </>
            }
            year5={
              <>
                <p>{`${t.labels.year5Amortization}: ${formatMoney(projectedYear5Amortization, lang)}`}</p>
                <p>{`${t.labels.year5AmortizationOverRevenue}: ${formatNumber(year5AmortizationRevenueRatio, lang)}%`}</p>
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
