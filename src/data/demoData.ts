import { FootprintRecord } from '../types';

export const INITIAL_DEMO_RECORDS: FootprintRecord[] = [
  {
    id: 'demo_rec_1',
    timestamp: Date.now() - 35 * 86400000,
    dateFormatted: 'Aug 26, 2026',
    breakdown: {
      transportation: 135.2,
      electricity: 142.0,
      food: 225.0,
      waste: 28.5,
      total: 530.7,
    },
    largestCategory: 'Food',
    largestPercentage: 42,
    sustainabilityScore: 41,
    inputs: {
      transportation: {
        vehicleType: 'petrol_car',
        distanceKmPerDay: 20,
        travelDaysPerWeek: 5,
      },
      electricity: {
        monthlyKwh: 200,
        acHoursPerDay: 4,
        computerHoursPerDay: 6,
      },
      food: {
        dietType: 'non_vegetarian',
        frequency: 'moderate',
      },
      waste: {
        wasteKgPerWeek: 8,
        recycledPercentage: 15,
        plasticUsage: 'high',
      },
    },
    notes: 'Baseline campus assessment before adopting sustainability goals.',
  },
  {
    id: 'demo_rec_2',
    timestamp: Date.now() - 21 * 86400000,
    dateFormatted: 'Sep 09, 2026',
    breakdown: {
      transportation: 98.4,
      electricity: 113.6,
      food: 150.0,
      waste: 21.2,
      total: 383.2,
    },
    largestCategory: 'Food',
    largestPercentage: 39,
    sustainabilityScore: 54,
    inputs: {
      transportation: {
        vehicleType: 'motorcycle',
        distanceKmPerDay: 18,
        travelDaysPerWeek: 5,
      },
      electricity: {
        monthlyKwh: 160,
        acHoursPerDay: 2,
        computerHoursPerDay: 5,
      },
      food: {
        dietType: 'mixed',
        frequency: 'moderate',
      },
      waste: {
        wasteKgPerWeek: 6,
        recycledPercentage: 40,
        plasticUsage: 'moderate',
      },
    },
    notes: 'Switched to mixed flexitarian diet and reduced AC hours.',
  },
  {
    id: 'demo_rec_3',
    timestamp: Date.now() - 7 * 86400000,
    dateFormatted: 'Sep 23, 2026',
    breakdown: {
      transportation: 46.2,
      electricity: 85.2,
      food: 127.5,
      waste: 14.8,
      total: 273.7,
    },
    largestCategory: 'Food',
    largestPercentage: 47,
    sustainabilityScore: 68,
    inputs: {
      transportation: {
        vehicleType: 'bus',
        distanceKmPerDay: 12,
        travelDaysPerWeek: 4,
      },
      electricity: {
        monthlyKwh: 120,
        acHoursPerDay: 1,
        computerHoursPerDay: 4,
      },
      food: {
        dietType: 'vegetarian',
        frequency: 'high',
      },
      waste: {
        wasteKgPerWeek: 4,
        recycledPercentage: 60,
        plasticUsage: 'minimal',
      },
    },
    notes: 'Using city bus transit and dorm recycling bins.',
  },
  {
    id: 'demo_rec_4',
    timestamp: Date.now() - 1 * 86400000,
    dateFormatted: 'Sep 30, 2026',
    breakdown: {
      transportation: 18.2,
      electricity: 71.0,
      food: 90.0,
      waste: 11.4,
      total: 190.6,
    },
    largestCategory: 'Food',
    largestPercentage: 47,
    sustainabilityScore: 82,
    inputs: {
      transportation: {
        vehicleType: 'train',
        distanceKmPerDay: 10,
        travelDaysPerWeek: 4,
      },
      electricity: {
        monthlyKwh: 100,
        acHoursPerDay: 0,
        computerHoursPerDay: 4,
      },
      food: {
        dietType: 'vegetarian',
        frequency: 'moderate',
      },
      waste: {
        wasteKgPerWeek: 3,
        recycledPercentage: 75,
        plasticUsage: 'minimal',
      },
    },
    notes: 'Met 1.5°C climate threshold target with campus train + cycling.',
  },
];
