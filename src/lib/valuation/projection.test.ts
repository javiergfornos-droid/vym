import assert from "node:assert/strict";
import test from "node:test";
import { calculateDcf, type DcfInput } from "./index";

const fixture: DcfInput = {
  historical: {
    revenue: 900,
    cogs: 400,
    administrativeExpenses: 90,
    personnelExpenses: 180,
    depreciationAndAmortization: 70,
    financialIncome: 5,
    financialExpenses: 999_999,
    corporateTax: 20,
    fixedAssetsGross: 120,
    intangibleAssetsGross: 80,
    longTermInvestments: 0,
    inventories: 50,
    accountsReceivable: 90,
    otherAssets: 10,
    cash: 25,
    shareCapital: 100,
    reserves: 50,
    longTermFinancialDebt: 300,
    provisions: 15,
    shortTermFinancialDebt: 40,
    suppliers: 30,
    otherLiabilities: 20,
  },
  assumptions: {
    revenue: [1_000, 1_100, 1_210, 1_331, 1_464.1],
    cogs: [400, 440, 484, 532.4, 585.64],
    administrativeExpenses: [100, 105, 110, 115, 120],
    personnelExpenses: [200, 210, 220, 230, 240],
    capexFixedAssets: [120, 60, 0, 0, 0],
    capexIntangibleAssets: [84, 0, 0, 0, 0],
    dsoDays: 36.5,
    dioDays: 36.5,
    dpoDays: 30.4166666667,
    wacc: 0.08,
    terminalGrowth: 0.02,
  },
};

const near = (actual: number, expected: number) => {
  assert.ok(Math.abs(actual - expected) < 1e-9, `Expected ${actual} to equal ${expected}`);
};

test("DCF engine preserves sequential FCFF recurrences and calculates Enterprise Value only", () => {
  const result = calculateDcf(fixture);

  assert.deepEqual(result.errors, []);
  assert.equal(result.years[0].yearIndex, 0);
  assert.equal(result.years[5].yearIndex, 5);

  const year0 = result.years[0];
  const year1 = result.years[1];
  const year2 = result.years[2];

  near(year0.NWC, 110);
  near(year1.deltaNWC, year1.NWC - year0.NWC);
  near(year2.deltaNWC, year2.NWC - year1.NWC);

  assert.notEqual(year1.cogs, year1.purchases);
  near(year1.EBITDA, year1.revenue - year1.cogs - year1.personnelExpenses - year1.administrativeExpenses);

  near(year1.openingBaseAmortization, 70);
  near(year2.openingBaseAmortization, 70);
  near(result.years[3].openingBaseAmortization, 60);
  near(result.years[4].openingBaseAmortization, 0);
  near(year1.capexVintageAmortization, 20.4);
  near(year2.capexVintageAmortization, 26.4);

  near(year1.taxes, 0.25 * Math.max(year1.EBIT, 0));

  const comparison = calculateDcf({
    ...fixture,
    historical: {
      ...fixture.historical,
      financialExpenses: 0,
    },
  });
  near(comparison.years[1].FCFF, year1.FCFF);
  near(comparison.terminalAndEnterpriseValue.enterpriseValue ?? Number.NaN, result.terminalAndEnterpriseValue.enterpriseValue ?? Number.NaN);

  assert.ok(result.terminalAndEnterpriseValue.FCFF6 !== null);
  assert.ok(result.terminalAndEnterpriseValue.terminalValue !== null);
  assert.ok(result.terminalAndEnterpriseValue.enterpriseValue !== null);
  assert.equal("equityValue" in result.terminalAndEnterpriseValue, false);
});

test("DCF validation rejects invalid valuation and CAPEX assumptions", () => {
  const result = calculateDcf({
    ...fixture,
    assumptions: {
      ...fixture.assumptions,
      capexFixedAssets: [120, -1, 0, 0, 0],
      wacc: 0.02,
      terminalGrowth: 0.02,
    },
  });

  assert.ok(result.errors.some((error) => error.includes("capexFixedAssets[2]")));
  assert.ok(result.errors.some((error) => error.includes("WACC")));
  assert.equal(result.terminalAndEnterpriseValue.enterpriseValue, null);
});
