import {
  CAPEX_AMORTIZATION_YEARS,
  type CapexVintageAmortization,
  type ProjectionYearIndex,
} from "./types";

export type DepreciationScheduleState = {
  openingBaseRemaining: number;
  openingBaseAnnualAmortization: number;
  vintages: CapexVintageAmortization[];
};

export type DepreciationForYear = {
  openingBaseAmortization: number;
  openingBaseRemaining: number;
  capexVintageAmortization: number;
  capexVintageAmortizations: CapexVintageAmortization[];
  depreciationAndAmortization: number;
};

export const createDepreciationScheduleState = (
  openingAmortizableBase: number,
  openingBaseAnnualAmortization: number,
): DepreciationScheduleState => ({
  openingBaseRemaining: openingAmortizableBase,
  openingBaseAnnualAmortization,
  vintages: [],
});

export const calculateDepreciationForYear = (
  state: DepreciationScheduleState,
  yearIndex: ProjectionYearIndex,
  capexVintage: number,
): DepreciationForYear => {
  const openingBaseAmortization = Math.min(
    state.openingBaseAnnualAmortization,
    state.openingBaseRemaining,
  );
  const openingBaseRemaining = Math.max(0, state.openingBaseRemaining - openingBaseAmortization);

  const newVintage: CapexVintageAmortization = {
    vintageYearIndex: yearIndex,
    capexVintage,
    annualAmortization: capexVintage / CAPEX_AMORTIZATION_YEARS,
    amortization: capexVintage / CAPEX_AMORTIZATION_YEARS,
  };

  const activeVintages = [...state.vintages, newVintage].map((vintage) => ({
    ...vintage,
    amortization: vintage.annualAmortization,
  }));
  const capexVintageAmortization = activeVintages.reduce(
    (total, vintage) => total + vintage.amortization,
    0,
  );

  state.openingBaseRemaining = openingBaseRemaining;
  state.vintages = activeVintages;

  return {
    openingBaseAmortization,
    openingBaseRemaining,
    capexVintageAmortization,
    capexVintageAmortizations: activeVintages,
    depreciationAndAmortization: openingBaseAmortization + capexVintageAmortization,
  };
};
