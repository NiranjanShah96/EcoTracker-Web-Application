/**
 * EcoTrack - Environmental Emission Factors & Constants
 *
 * All factors are defined here in a standalone configuration module.
 * The application performs deterministic numerical calculations using these values.
 * References:
 * - UK Department for Environment, Food & Rural Affairs (DEFRA) Conversion Factors
 * - United States Environmental Protection Agency (US EPA) Greenhouse Gas Equivalencies
 * - IPCC (Intergovernmental Panel on Climate Change) Fifth Assessment Report (AR5)
 * - Poore & Nemecek (Science 2018) global food system lifecycle assessment
 *
 * NOTE: Values are practical educational approximations for college student awareness.
 */

import { VehicleType, DietType, DietFrequency, PlasticUsageLevel } from '../types';

/**
 * Transportation emission factors in kg CO₂ equivalent per kilometer (kg CO₂e / km).
 * Includes passenger car average occupancy and public transit allocated factors.
 */
export const TRANSPORTATION_FACTORS_KG_PER_KM: Record<VehicleType, number> = {
  // Average mid-sized petrol passenger car (~170 g CO2/km)
  petrol_car: 0.170,
  // Average mid-sized diesel passenger car (~165 g CO2/km)
  diesel_car: 0.165,
  // Commuter motorcycle / scooter (~103 g CO2/km)
  motorcycle: 0.103,
  // Municipal bus transit per passenger-km (average load) (~89 g CO2/km)
  bus: 0.089,
  // Passenger electric/diesel rail transit per passenger-km (~35 g CO2/km)
  train: 0.035,
  // Electric Vehicle accounting for grid generation transmission losses (~45 g CO2/km)
  electric_vehicle: 0.045,
  // Zero direct operational emissions
  walking: 0.0,
  // Zero direct operational emissions
  cycling: 0.0,
};

export const VEHICLE_DETAILS: Record<
  VehicleType,
  { label: string; description: string; factor: number; iconName: string; isZeroEmission: boolean }
> = {
  petrol_car: {
    label: 'Petrol Car',
    description: 'Mid-sized combustion engine car (~170g CO₂e/km)',
    factor: 0.170,
    iconName: 'Car',
    isZeroEmission: false,
  },
  diesel_car: {
    label: 'Diesel Car',
    description: 'Diesel vehicle (~165g CO₂e/km)',
    factor: 0.165,
    iconName: 'Car',
    isZeroEmission: false,
  },
  motorcycle: {
    label: 'Motorcycle / Scooter',
    description: 'Two-wheeler commuter (~103g CO₂e/km)',
    factor: 0.103,
    iconName: 'Bike',
    isZeroEmission: false,
  },
  bus: {
    label: 'City Bus',
    description: 'Shared public bus transit (~89g CO₂e/passenger-km)',
    factor: 0.089,
    iconName: 'Bus',
    isZeroEmission: false,
  },
  train: {
    label: 'Train / Metro',
    description: 'Suburban train or urban metro (~35g CO₂e/passenger-km)',
    factor: 0.035,
    iconName: 'Train',
    isZeroEmission: false,
  },
  electric_vehicle: {
    label: 'Electric Vehicle (EV)',
    description: 'Battery electric car via grid charging (~45g CO₂e/km)',
    factor: 0.045,
    iconName: 'Zap',
    isZeroEmission: false,
  },
  cycling: {
    label: 'Bicycle / E-Bike',
    description: 'Active human-powered mobility (0g direct CO₂e)',
    factor: 0.0,
    iconName: 'Bike',
    isZeroEmission: true,
  },
  walking: {
    label: 'Walking',
    description: 'Foot travel (0g direct CO₂e)',
    factor: 0.0,
    iconName: 'Footprints',
    isZeroEmission: true,
  },
};

/**
 * Grid Electricity emission intensity factor in kg CO₂e per kilowatt-hour (kWh).
 * Based on national grid averages (combination of coal, gas, and renewables).
 */
export const ELECTRICITY_FACTOR_KG_PER_KWH = 0.710;

/**
 * Estimated power ratings (kW) for optional appliance calculations:
 */
export const APPLIANCE_RATINGS = {
  airConditionerKw: 1.5, // 1.5 kW average split AC
  computerKw: 0.12,       // 120W laptop + monitor workstation
};

/**
 * Diet emission baseline factors in kg CO₂e per month.
 * Derived from Poore & Nemecek lifecycle agricultural supply chain data.
 */
export const DIET_FACTORS_KG_PER_MONTH: Record<DietType, number> = {
  // Plant-based diet rich in grains, legumes, vegetables, and dairy alternatives (~3.0 kg CO2e/day)
  vegetarian: 90.0,
  // Flexitarian/mixed diet with moderate poultry/fish and dairy (~5.0 kg CO2e/day)
  mixed: 150.0,
  // Meat-intensive diet with regular beef, lamb, pork, and dairy (~7.5 kg CO2e/day)
  non_vegetarian: 225.0,
};

export const DIET_FREQUENCY_MULTIPLIERS: Record<DietFrequency, number> = {
  // 1-2 moderate meals or low portion sizes
  low: 0.85,
  // Standard 3 meals per day
  moderate: 1.0,
  // High consumption / frequent eating out or high animal protein
  high: 1.25,
};

/**
 * Waste factors:
 * Non-recycled municipal solid waste sent to landfills produces methane.
 * Factor: ~0.58 kg CO₂e per kg waste.
 * Recycled waste reduces landfill impact and yields materials avoidance credit.
 * Plastic life-cycle intensity adds ~2.1 kg CO₂e per kg.
 */
export const WASTE_LANDFILL_FACTOR_PER_KG = 0.58;
export const WEEKS_PER_MONTH = 4.33;

export const PLASTIC_USAGE_MONTHLY_ADDITION_KG_CO2: Record<PlasticUsageLevel, number> = {
  // Uses cloth tote bags, stainless bottle, zero plastic wrap
  minimal: 2.0,
  // Occasional plastic packaging, takeout containers
  moderate: 7.5,
  // Regular bottled drinks, packaged snacks, single-use bags
  high: 18.0,
};

/**
 * Global and Student Benchmark Reference Points (kg CO₂e per month):
 * - Target for 1.5°C climate goals: ~165-200 kg CO₂e / month (~2.0-2.4 tonnes/year)
 * - Average global citizen: ~380-450 kg CO₂e / month (~4.5-5.4 tonnes/year)
 * - Average high-consumption country: ~800-1,200 kg CO₂e / month
 */
export const BENCHMARKS = {
  targetMonthlyKg: 200,
  averageGlobalMonthlyKg: 420,
  highEmitterMonthlyKg: 850,
};
