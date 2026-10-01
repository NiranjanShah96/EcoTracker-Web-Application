import {
  TRANSPORTATION_FACTORS_KG_PER_KM,
  ELECTRICITY_FACTOR_KG_PER_KWH,
  DIET_FACTORS_KG_PER_MONTH,
  DIET_FREQUENCY_MULTIPLIERS,
  WASTE_LANDFILL_FACTOR_PER_KG,
  WEEKS_PER_MONTH,
  PLASTIC_USAGE_MONTHLY_ADDITION_KG_CO2,
  BENCHMARKS,
} from '../data/emissionFactors';
import {
  FootprintCalculationInputs,
  EmissionBreakdown,
  FootprintRecord,
} from '../types';

/**
 * Calculates monthly Transportation CO₂e in kg.
 */
export function calculateTransportationEmissions(
  vehicleType: keyof typeof TRANSPORTATION_FACTORS_KG_PER_KM,
  distanceKmPerDay: number,
  travelDaysPerWeek: number
): number {
  if (isNaN(distanceKmPerDay) || isNaN(travelDaysPerWeek) || distanceKmPerDay <= 0 || travelDaysPerWeek <= 0) {
    return 0;
  }
  const factor = TRANSPORTATION_FACTORS_KG_PER_KM[vehicleType] ?? 0.170;
  const safeDailyKm = Math.max(0, distanceKmPerDay);
  const safeDays = Math.min(7, Math.max(0, travelDaysPerWeek));
  const weeklyKm = safeDailyKm * safeDays;
  const monthlyKm = weeklyKm * WEEKS_PER_MONTH;
  return Number((monthlyKm * factor).toFixed(2));
}

/**
 * Calculates monthly Electricity CO₂e in kg.
 * Combines base monthly meter kWh with optional appliance compressor/hardware hours.
 */
export function calculateElectricityEmissions(
  monthlyKwh: number,
  acHoursPerDay = 0,
  computerHoursPerDay = 0
): number {
  const baseKwh = isNaN(monthlyKwh) ? 0 : Math.max(0, monthlyKwh);

  // 1.5 kW split AC compressor rating, 30 days/month
  const acMonthlyKwh = (isNaN(acHoursPerDay) ? 0 : Math.max(0, acHoursPerDay)) * 1.5 * 30;

  // 0.12 kW laptop/workstation rating, 30 days/month
  const pcMonthlyKwh = (isNaN(computerHoursPerDay) ? 0 : Math.max(0, computerHoursPerDay)) * 0.12 * 30;

  const effectiveKwh = baseKwh + acMonthlyKwh + pcMonthlyKwh;
  return Number((effectiveKwh * ELECTRICITY_FACTOR_KG_PER_KWH).toFixed(2));
}

/**
 * Calculates monthly Food CO₂e in kg.
 */
export function calculateFoodEmissions(
  dietType: keyof typeof DIET_FACTORS_KG_PER_MONTH,
  frequency: keyof typeof DIET_FREQUENCY_MULTIPLIERS
): number {
  const base = DIET_FACTORS_KG_PER_MONTH[dietType] ?? 150;
  const multiplier = DIET_FREQUENCY_MULTIPLIERS[frequency] ?? 1.0;
  return Number((base * multiplier).toFixed(2));
}

/**
 * Calculates monthly Waste CO₂e in kg.
 */
export function calculateWasteEmissions(
  wasteKgPerWeek: number,
  recycledPercentage: number,
  plasticUsage: keyof typeof PLASTIC_USAGE_MONTHLY_ADDITION_KG_CO2
): number {
  const safeKgPerWeek = isNaN(wasteKgPerWeek) ? 0 : Math.max(0, wasteKgPerWeek);
  const safeRecycleRate = Math.min(100, Math.max(0, isNaN(recycledPercentage) ? 0 : recycledPercentage)) / 100;
  const monthlyTotalWaste = safeKgPerWeek * WEEKS_PER_MONTH;

  const uncycledWaste = monthlyTotalWaste * (1 - safeRecycleRate);
  const landfillEmissions = uncycledWaste * WASTE_LANDFILL_FACTOR_PER_KG;
  const plasticEmissions = PLASTIC_USAGE_MONTHLY_ADDITION_KG_CO2[plasticUsage] ?? 7.5;

  return Number((landfillEmissions + plasticEmissions).toFixed(2));
}

/**
 * Comprehensive calculator for all 4 categories.
 */
export function calculateFullFootprint(inputs: FootprintCalculationInputs): EmissionBreakdown {
  const transportation = calculateTransportationEmissions(
    inputs.transportation.vehicleType,
    inputs.transportation.distanceKmPerDay,
    inputs.transportation.travelDaysPerWeek
  );

  const electricity = calculateElectricityEmissions(
    inputs.electricity.monthlyKwh,
    inputs.electricity.acHoursPerDay,
    inputs.electricity.computerHoursPerDay
  );

  const food = calculateFoodEmissions(
    inputs.food.dietType,
    inputs.food.frequency
  );

  const waste = calculateWasteEmissions(
    inputs.waste.wasteKgPerWeek,
    inputs.waste.recycledPercentage,
    inputs.waste.plasticUsage
  );

  const total = Number((transportation + electricity + food + waste).toFixed(2));

  return {
    transportation,
    electricity,
    food,
    waste,
    total,
  };
}

/**
 * Computes sustainability score (0 - 100, higher is better).
 */
export function calculateSustainabilityScore(monthlyTotalKg: number): number {
  if (isNaN(monthlyTotalKg) || monthlyTotalKg <= 0) return 95;
  if (monthlyTotalKg <= 120) return 95;
  if (monthlyTotalKg <= BENCHMARKS.targetMonthlyKg) {
    const pct = (monthlyTotalKg - 120) / (BENCHMARKS.targetMonthlyKg - 120);
    return Math.round(95 - pct * 15);
  }
  if (monthlyTotalKg <= BENCHMARKS.averageGlobalMonthlyKg) {
    const pct = (monthlyTotalKg - BENCHMARKS.targetMonthlyKg) / (BENCHMARKS.averageGlobalMonthlyKg - BENCHMARKS.targetMonthlyKg);
    return Math.round(80 - pct * 30);
  }
  if (monthlyTotalKg <= BENCHMARKS.highEmitterMonthlyKg) {
    const pct = (monthlyTotalKg - BENCHMARKS.averageGlobalMonthlyKg) / (BENCHMARKS.highEmitterMonthlyKg - BENCHMARKS.averageGlobalMonthlyKg);
    return Math.round(50 - pct * 32);
  }
  return Math.max(5, Math.round(18 - ((monthlyTotalKg - 850) / 400) * 13));
}

/**
 * Formats a raw breakdown into a full record object for history/state.
 */
export function createFootprintRecord(
  inputs: FootprintCalculationInputs,
  id = `calc_${Date.now()}`
): FootprintRecord {
  const breakdown = calculateFullFootprint(inputs);

  const categories: Array<{ name: 'Transportation' | 'Electricity' | 'Food' | 'Waste'; value: number }> = [
    { name: 'Transportation', value: breakdown.transportation },
    { name: 'Electricity', value: breakdown.electricity },
    { name: 'Food', value: breakdown.food },
    { name: 'Waste', value: breakdown.waste },
  ];

  categories.sort((a, b) => b.value - a.value);
  const largest = categories[0] || { name: 'Transportation', value: 0 };
  const largestPercentage = breakdown.total > 0
    ? Math.round((largest.value / breakdown.total) * 100)
    : 0;

  const score = calculateSustainabilityScore(breakdown.total);
  const now = new Date();

  return {
    id,
    timestamp: now.getTime(),
    dateFormatted: now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    breakdown,
    largestCategory: largest.name,
    largestPercentage,
    sustainabilityScore: score,
    inputs,
  };
}

export function formatKg(val: number): string {
  if (isNaN(val)) return '0.0 kg';
  return `${val.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg`;
}
