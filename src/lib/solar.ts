// ----------------------------------------------------------------------------
// Core domain math for the solar savings + subsidy calculator.
// These functions are pure and unit-testable, and are the single source of
// truth used by both the public calculator and server-side lead creation.
// ----------------------------------------------------------------------------

import {
  MAX_KW,
  MIN_KW,
  SUBSIDY_CAP,
  SUBSIDY_FIRST_2KW_PER_KW,
  SUBSIDY_THIRD_KW,
  SYSTEM_COST_PER_KW,
  TARIFF_PER_UNIT,
  UNITS_PER_KW_PER_MONTH,
} from "./config";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Round to the nearest 0.5. */
function roundToHalf(value: number): number {
  return Math.round(value * 2) / 2;
}

/**
 * Recommended system size (kW) from a monthly electricity bill.
 *   monthlyUnits = monthlyBill / tariff
 *   requiredKW   = monthlyUnits / 120, rounded to nearest 0.5,
 *                  min 1 kW, capped at 10 kW.
 */
export function recommendedKW(
  monthlyBill: number,
  tariff = TARIFF_PER_UNIT,
): number {
  const monthlyUnits = monthlyBill / tariff;
  const raw = monthlyUnits / UNITS_PER_KW_PER_MONTH;
  const rounded = roundToHalf(raw);
  return clamp(rounded, MIN_KW, MAX_KW);
}

/**
 * PM Surya Ghar subsidy (Central Financial Assistance):
 *   first 2 kW -> ₹30,000/kW
 *   3rd kW     -> ₹18,000/kW
 *   above 3 kW -> nothing extra
 *   hard cap   -> ₹78,000
 *
 * Sanity: 1kW->30,000  2kW->60,000  3kW+ ->78,000
 */
export function subsidyForKW(kW: number): number {
  const subsidy =
    Math.min(kW, 2) * SUBSIDY_FIRST_2KW_PER_KW +
    clamp(kW - 2, 0, 1) * SUBSIDY_THIRD_KW;
  return Math.min(Math.round(subsidy), SUBSIDY_CAP);
}

export interface SolarEstimate {
  monthlyBill: number;
  monthlyUnits: number;
  recommendedKW: number;
  grossCost: number;
  subsidy: number;
  netCost: number;
  monthlySavings: number;
  annualSavings: number;
  paybackYears: number;
}

/**
 * Full estimate used to render the calculator result and to store on a Lead.
 */
export function estimateFromBill(
  monthlyBill: number,
  opts: {
    tariff?: number;
    systemCostPerKW?: number;
  } = {},
): SolarEstimate {
  const tariff = opts.tariff ?? TARIFF_PER_UNIT;
  const systemCostPerKW = opts.systemCostPerKW ?? SYSTEM_COST_PER_KW;

  const monthlyUnits = monthlyBill / tariff;
  const kW = recommendedKW(monthlyBill, tariff);
  const subsidy = subsidyForKW(kW);

  const grossCost = kW * systemCostPerKW;
  const netCost = grossCost - subsidy;

  // Generation is capped at actual consumption (no value for surplus here).
  const monthlyGenerationUnits = Math.min(kW * UNITS_PER_KW_PER_MONTH, monthlyUnits);
  const monthlySavings = monthlyGenerationUnits * tariff;
  const annualSavings = monthlySavings * 12;
  const paybackYears = annualSavings > 0 ? netCost / annualSavings : 0;

  return {
    monthlyBill,
    monthlyUnits: Math.round(monthlyUnits),
    recommendedKW: kW,
    grossCost: Math.round(grossCost),
    subsidy,
    netCost: Math.round(netCost),
    monthlySavings: Math.round(monthlySavings),
    annualSavings: Math.round(annualSavings),
    paybackYears: Math.round(paybackYears * 10) / 10,
  };
}
