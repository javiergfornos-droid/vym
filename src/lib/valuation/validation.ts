import type { DcfInput, ProjectionVector, ValidationResult } from "./types";

const projectionFields = [
  "revenue",
  "cogs",
  "administrativeExpenses",
  "personnelExpenses",
  "capexFixedAssets",
  "capexIntangibleAssets",
] as const;

const historicalFields = [
  "revenue",
  "cogs",
  "administrativeExpenses",
  "personnelExpenses",
  "depreciationAndAmortization",
  "financialIncome",
  "financialExpenses",
  "corporateTax",
  "fixedAssetsGross",
  "intangibleAssetsGross",
  "longTermInvestments",
  "inventories",
  "accountsReceivable",
  "otherAssets",
  "cash",
  "shareCapital",
  "reserves",
  "longTermFinancialDebt",
  "provisions",
  "shortTermFinancialDebt",
  "suppliers",
  "otherLiabilities",
] as const;

const isFiniteNumber = (value: number) => Number.isFinite(value);

const validateProjectionVector = (
  name: string,
  vector: ProjectionVector,
  errors: string[],
) => {
  if (!Array.isArray(vector) || vector.length !== 5) {
    errors.push(`${name} must contain exactly five projected values for years 1 through 5.`);
    return;
  }

  vector.forEach((value, index) => {
    if (!isFiniteNumber(value)) {
      errors.push(`${name}[${index + 1}] must be a finite number.`);
    }
  });
};

export const validateDcfInput = (input: DcfInput): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [
    "Opening fixed assets and intangible assets are treated as the initial amortizable asset base for this MVP, even if entered balances represent net book values.",
  ];

  historicalFields.forEach((field) => {
    if (!isFiniteNumber(input.historical[field])) {
      errors.push(`historical.${field} must be a finite number.`);
    }
  });

  projectionFields.forEach((field) => {
    validateProjectionVector(`assumptions.${field}`, input.assumptions[field], errors);
  });

  input.assumptions.capexFixedAssets.forEach((value, index) => {
    if (value < 0) {
      errors.push(`assumptions.capexFixedAssets[${index + 1}] cannot be negative.`);
    }
  });

  input.assumptions.capexIntangibleAssets.forEach((value, index) => {
    if (value < 0) {
      errors.push(`assumptions.capexIntangibleAssets[${index + 1}] cannot be negative.`);
    }
  });

  (["dsoDays", "dioDays", "dpoDays"] as const).forEach((field) => {
    const value = input.assumptions[field];
    if (!isFiniteNumber(value)) {
      errors.push(`assumptions.${field} must be a finite number.`);
    } else if (value < 0) {
      errors.push(`assumptions.${field} cannot be negative.`);
    }
  });

  (["wacc", "terminalGrowth"] as const).forEach((field) => {
    if (!isFiniteNumber(input.assumptions[field])) {
      errors.push(`assumptions.${field} must be a finite number.`);
    }
  });

  if (isFiniteNumber(input.assumptions.wacc) && input.assumptions.wacc <= -1) {
    errors.push("assumptions.wacc must be greater than -100% to avoid a zero or negative discount base.");
  }

  if (
    isFiniteNumber(input.assumptions.wacc) &&
    isFiniteNumber(input.assumptions.terminalGrowth) &&
    input.assumptions.wacc <= input.assumptions.terminalGrowth
  ) {
    const message = "WACC must be greater than terminal growth to calculate a valid terminal value and Enterprise Value.";
    errors.push(message);
    warnings.push(message);
  }

  return { errors, warnings };
};

export const isFiniteValuationNumber = (value: number) => Number.isFinite(value) && !Number.isNaN(value);
