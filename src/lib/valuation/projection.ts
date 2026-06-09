import { calculateDepreciationForYear, createDepreciationScheduleState } from "./depreciation";
import { calculateEnterpriseValue } from "./enterprise-value";
import {
  DCF_PROJECTION_YEARS,
  TAX_RATE,
  type CashFlowProjectionLine,
  type DcfInput,
  type DcfResult,
  type DcfYear,
  type ProjectionYearIndex,
} from "./types";
import { validateDcfInput } from "./validation";

const projectionYearIndexes = [1, 2, 3, 4, 5] as const satisfies readonly ProjectionYearIndex[];

const emptyTerminalAndEnterpriseValue = {
  FCFF6: null,
  terminalValue: null,
  presentValueOfFCFFs: null,
  presentValueOfTerminalValue: null,
  enterpriseValue: null,
};

const toProjectionLine = (year: DcfYear): CashFlowProjectionLine => ({
  yearIndex: year.yearIndex as ProjectionYearIndex,
  revenue: year.revenue,
  EBITDA: year.EBITDA,
  EBIT: year.EBIT,
  taxes: year.taxes,
  NOPAT: year.NOPAT,
  addBackDepreciationAndAmortization: year.depreciationAndAmortization,
  CAPEX: year.capexTotal,
  changeInNWC: year.deltaNWC,
  FCFF: year.FCFF,
});

const createHistoricalAnchor = (input: DcfInput): DcfYear => {
  const historical = input.historical;
  const NWC = historical.accountsReceivable + historical.inventories - historical.suppliers;
  const EBITDA =
    historical.revenue -
    historical.cogs -
    historical.personnelExpenses -
    historical.administrativeExpenses;
  const EBIT = EBITDA - historical.depreciationAndAmortization;
  const taxes = TAX_RATE * Math.max(EBIT, 0);
  const NOPAT = EBIT - taxes;

  return {
    yearIndex: 0,
    isHistorical: true,
    revenue: historical.revenue,
    accountsReceivable: historical.accountsReceivable,
    inventories: historical.inventories,
    cogs: historical.cogs,
    purchases: historical.cogs,
    suppliers: historical.suppliers,
    administrativeExpenses: historical.administrativeExpenses,
    personnelExpenses: historical.personnelExpenses,
    openingBaseAmortization: 0,
    openingBaseRemaining: historical.fixedAssetsGross + historical.intangibleAssetsGross,
    capexVintageAmortization: 0,
    capexVintageAmortizations: [],
    depreciationAndAmortization: historical.depreciationAndAmortization,
    EBITDA,
    EBIT,
    taxes,
    NOPAT,
    NWC,
    deltaNWC: 0,
    capexFixedAssets: 0,
    capexIntangibleAssets: 0,
    capexTotal: 0,
    FCFF: 0,
  };
};

export const calculateDcf = (input: DcfInput): DcfResult => {
  const validation = validateDcfInput(input);
  const historicalAnchor = createHistoricalAnchor(input);

  if (validation.errors.length > 0) {
    return {
      cashFlowProjection: { years: [] },
      waccCalculation: {
        wacc: input.assumptions.wacc,
        terminalGrowth: input.assumptions.terminalGrowth,
        warnings: validation.warnings.filter((warning) => warning.includes("WACC")),
      },
      terminalAndEnterpriseValue: emptyTerminalAndEnterpriseValue,
      years: [historicalAnchor],
      warnings: validation.warnings,
      errors: validation.errors,
    };
  }

  const years: DcfYear[] = [historicalAnchor];
  const depreciationState = createDepreciationScheduleState(
    input.historical.fixedAssetsGross + input.historical.intangibleAssetsGross,
    input.historical.depreciationAndAmortization,
  );

  for (const yearIndex of projectionYearIndexes) {
    const projectionOffset = yearIndex - 1;
    const previousYear = years[years.length - 1];

    const revenue = input.assumptions.revenue[projectionOffset];
    const cogs = input.assumptions.cogs[projectionOffset];
    const accountsReceivable = (revenue * input.assumptions.dsoDays) / 365;
    const inventories = (cogs * input.assumptions.dioDays) / 365;
    const purchases = cogs + (inventories - previousYear.inventories);
    const suppliers = (purchases * input.assumptions.dpoDays) / 365;
    const administrativeExpenses = input.assumptions.administrativeExpenses[projectionOffset];
    const personnelExpenses = input.assumptions.personnelExpenses[projectionOffset];
    const capexFixedAssets = input.assumptions.capexFixedAssets[projectionOffset];
    const capexIntangibleAssets = input.assumptions.capexIntangibleAssets[projectionOffset];
    const capexTotal = capexFixedAssets + capexIntangibleAssets;
    const depreciation = calculateDepreciationForYear(depreciationState, yearIndex, capexTotal);
    const EBITDA = revenue - cogs - personnelExpenses - administrativeExpenses;
    const EBIT = EBITDA - depreciation.depreciationAndAmortization;
    const taxes = TAX_RATE * Math.max(EBIT, 0);
    const NOPAT = EBIT - taxes;
    const NWC = accountsReceivable + inventories - suppliers;
    const deltaNWC = NWC - previousYear.NWC;
    const FCFF = NOPAT + depreciation.depreciationAndAmortization - capexTotal - deltaNWC;

    years.push({
      yearIndex,
      isHistorical: false,
      revenue,
      accountsReceivable,
      inventories,
      cogs,
      purchases,
      suppliers,
      administrativeExpenses,
      personnelExpenses,
      openingBaseAmortization: depreciation.openingBaseAmortization,
      openingBaseRemaining: depreciation.openingBaseRemaining,
      capexVintageAmortization: depreciation.capexVintageAmortization,
      capexVintageAmortizations: depreciation.capexVintageAmortizations,
      depreciationAndAmortization: depreciation.depreciationAndAmortization,
      EBITDA,
      EBIT,
      taxes,
      NOPAT,
      NWC,
      deltaNWC,
      capexFixedAssets,
      capexIntangibleAssets,
      capexTotal,
      FCFF,
    });
  }

  const projectedYears = years.slice(1);
  if (projectedYears.length !== DCF_PROJECTION_YEARS) {
    throw new Error("DCF projection must produce exactly five projected years.");
  }

  const terminalAndEnterpriseValue = calculateEnterpriseValue(
    projectedYears.map((year) => year.FCFF) as [number, number, number, number, number],
    input.assumptions.wacc,
    input.assumptions.terminalGrowth,
  );

  const errors = terminalAndEnterpriseValue.enterpriseValue === null
    ? ["Enterprise Value could not be calculated because the valuation output was not finite."]
    : [];

  return {
    cashFlowProjection: { years: projectedYears.map(toProjectionLine) },
    waccCalculation: {
      wacc: input.assumptions.wacc,
      terminalGrowth: input.assumptions.terminalGrowth,
      warnings: validation.warnings.filter((warning) => warning.includes("WACC")),
    },
    terminalAndEnterpriseValue,
    years,
    warnings: validation.warnings,
    errors,
  };
};
