export const DCF_PROJECTION_YEARS = 5;
export const TAX_RATE = 0.25;
export const CAPEX_AMORTIZATION_YEARS = 10;

export type ProjectionYearIndex = 1 | 2 | 3 | 4 | 5;
export type DcfYearIndex = 0 | ProjectionYearIndex;
export type ProjectionVector = readonly [number, number, number, number, number];

export type HistoricalFinancials = {
  revenue: number;
  cogs: number;
  administrativeExpenses: number;
  personnelExpenses: number;
  depreciationAndAmortization: number;
  financialIncome: number;
  financialExpenses: number;
  corporateTax: number;
  fixedAssetsGross: number;
  intangibleAssetsGross: number;
  longTermInvestments: number;
  inventories: number;
  accountsReceivable: number;
  otherAssets: number;
  cash: number;
  shareCapital: number;
  reserves: number;
  longTermFinancialDebt: number;
  provisions: number;
  shortTermFinancialDebt: number;
  suppliers: number;
  otherLiabilities: number;
};

export type DcfAssumptions = {
  revenue: ProjectionVector;
  cogs: ProjectionVector;
  administrativeExpenses: ProjectionVector;
  personnelExpenses: ProjectionVector;
  capexFixedAssets: ProjectionVector;
  capexIntangibleAssets: ProjectionVector;
  dsoDays: number;
  dioDays: number;
  dpoDays: number;
  wacc: number;
  terminalGrowth: number;
};

export type DcfInput = {
  historical: HistoricalFinancials;
  assumptions: DcfAssumptions;
};

export type CapexVintageAmortization = {
  vintageYearIndex: ProjectionYearIndex;
  capexVintage: number;
  annualAmortization: number;
  amortization: number;
};

export type DcfYear = {
  yearIndex: DcfYearIndex;
  isHistorical: boolean;
  revenue: number;
  accountsReceivable: number;
  inventories: number;
  cogs: number;
  purchases: number;
  suppliers: number;
  administrativeExpenses: number;
  personnelExpenses: number;
  openingBaseAmortization: number;
  openingBaseRemaining: number;
  capexVintageAmortization: number;
  capexVintageAmortizations: CapexVintageAmortization[];
  depreciationAndAmortization: number;
  EBITDA: number;
  EBIT: number;
  taxes: number;
  NOPAT: number;
  NWC: number;
  deltaNWC: number;
  capexFixedAssets: number;
  capexIntangibleAssets: number;
  capexTotal: number;
  FCFF: number;
};

export type CashFlowProjectionLine = {
  yearIndex: ProjectionYearIndex;
  revenue: number;
  EBITDA: number;
  EBIT: number;
  taxes: number;
  NOPAT: number;
  addBackDepreciationAndAmortization: number;
  CAPEX: number;
  changeInNWC: number;
  FCFF: number;
};

export type CashFlowProjectionSection = {
  years: CashFlowProjectionLine[];
};

export type WaccCalculationSection = {
  wacc: number;
  terminalGrowth: number;
  warnings: string[];
};

export type TerminalAndEnterpriseValueSection = {
  FCFF6: number | null;
  terminalValue: number | null;
  presentValueOfFCFFs: number | null;
  presentValueOfTerminalValue: number | null;
  enterpriseValue: number | null;
};

export type DcfResult = {
  cashFlowProjection: CashFlowProjectionSection;
  waccCalculation: WaccCalculationSection;
  terminalAndEnterpriseValue: TerminalAndEnterpriseValueSection;
  years: DcfYear[];
  warnings: string[];
  errors: string[];
};

export type ValidationResult = {
  errors: string[];
  warnings: string[];
};
