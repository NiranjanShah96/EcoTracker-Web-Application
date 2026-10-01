export type VehicleType =
  | 'petrol_car'
  | 'diesel_car'
  | 'motorcycle'
  | 'bus'
  | 'train'
  | 'electric_vehicle'
  | 'walking'
  | 'cycling';

export type DietType = 'vegetarian' | 'mixed' | 'non_vegetarian';

export type DietFrequency = 'low' | 'moderate' | 'high';

export type PlasticUsageLevel = 'minimal' | 'moderate' | 'high';

export interface TransportationInput {
  vehicleType: VehicleType;
  distanceKmPerDay: number;
  travelDaysPerWeek: number;
}

export interface ElectricityInput {
  monthlyKwh: number;
  acHoursPerDay?: number;
  computerHoursPerDay?: number;
}

export interface FoodInput {
  dietType: DietType;
  frequency: DietFrequency;
}

export interface WasteInput {
  wasteKgPerWeek: number;
  recycledPercentage: number;
  plasticUsage: PlasticUsageLevel;
}

export interface FootprintCalculationInputs {
  transportation: TransportationInput;
  electricity: ElectricityInput;
  food: FoodInput;
  waste: WasteInput;
}

export interface EmissionBreakdown {
  transportation: number; // in kg CO2e / month
  electricity: number;    // in kg CO2e / month
  food: number;           // in kg CO2e / month
  waste: number;          // in kg CO2e / month
  total: number;          // in kg CO2e / month
}

export interface FootprintRecord {
  id: string;
  timestamp: number;
  dateFormatted: string;
  breakdown: EmissionBreakdown;
  largestCategory: 'Transportation' | 'Electricity' | 'Food' | 'Waste';
  largestPercentage: number;
  sustainabilityScore: number; // 0 - 100
  inputs: FootprintCalculationInputs;
  notes?: string;
}

export interface AIInsightsData {
  summary: string;
  mainEmissionSource: string;
  keyObservations: string[];
  recommendedActions: string[];
  expectedImprovementAreas: string[];
  source?: string;
  note?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type ActivePage =
  | 'home'
  | 'dashboard'
  | 'calculator'
  | 'results'
  | 'simulator'
  | 'ai-insights'
  | 'chat'
  | 'history'
  | 'tips'
  | 'about';

export interface WhatIfSimulationResult {
  currentBreakdown: EmissionBreakdown;
  simulatedBreakdown: EmissionBreakdown;
  reductionKg: number;
  percentageReduction: number;
  annualSavedKg: number;
  treesEquivalent: number;
  categoryModified: 'Transportation' | 'Electricity' | 'Food' | 'Waste';
  scenarioDescription: string;
}

export interface WhatIfAIExplanation {
  explanation: string;
  practicalTips: string[];
  annualImpact: string;
  source?: string;
  note?: string;
}
