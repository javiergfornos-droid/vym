import type { TerminalAndEnterpriseValueSection } from "./types";
import { isFiniteValuationNumber } from "./validation";

export const calculateEnterpriseValue = (
  fcffs: readonly [number, number, number, number, number],
  wacc: number,
  terminalGrowth: number,
): TerminalAndEnterpriseValueSection => {
  const FCFF6 = fcffs[4] * (1 + terminalGrowth);
  const terminalValue = FCFF6 / (wacc - terminalGrowth);
  const presentValueOfFCFFs = fcffs.reduce(
    (total, fcff, index) => total + fcff / Math.pow(1 + wacc, index + 1),
    0,
  );
  const presentValueOfTerminalValue = terminalValue / Math.pow(1 + wacc, 5);
  const enterpriseValue = presentValueOfFCFFs + presentValueOfTerminalValue;

  const values = [
    FCFF6,
    terminalValue,
    presentValueOfFCFFs,
    presentValueOfTerminalValue,
    enterpriseValue,
  ];

  if (!values.every(isFiniteValuationNumber)) {
    return {
      FCFF6: null,
      terminalValue: null,
      presentValueOfFCFFs: null,
      presentValueOfTerminalValue: null,
      enterpriseValue: null,
    };
  }

  return {
    FCFF6,
    terminalValue,
    presentValueOfFCFFs,
    presentValueOfTerminalValue,
    enterpriseValue,
  };
};
