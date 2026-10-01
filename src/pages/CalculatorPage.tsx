import React, { useState } from 'react';
import {
  Car,
  Zap,
  Utensils,
  Trash2,
  ArrowRight,
  Calculator,
  Info,
  Check,
  AlertCircle,
  Sparkles,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import {
  VehicleType,
  DietType,
  DietFrequency,
  PlasticUsageLevel,
  FootprintCalculationInputs,
  FootprintRecord,
  ActivePage,
} from '../types';
import { VEHICLE_DETAILS } from '../data/emissionFactors';
import {
  calculateTransportationEmissions,
  calculateElectricityEmissions,
  calculateFoodEmissions,
  calculateWasteEmissions,
  createFootprintRecord,
} from '../utils/calculator';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';

interface Props {
  onCalculationComplete: (record: FootprintRecord) => void;
  onNavigate: (page: ActivePage) => void;
}

export const CalculatorPage: React.FC<Props> = ({
  onCalculationComplete,
  onNavigate,
}) => {
  // Section A: Transportation
  const [vehicleType, setVehicleType] = useState<VehicleType>('bus');
  const [distanceKm, setDistanceKm] = useState<number>(15);
  const [travelDays, setTravelDays] = useState<number>(5);

  // Section B: Electricity
  const [monthlyKwh, setMonthlyKwh] = useState<number>(120);
  const [acHours, setAcHours] = useState<number>(2);
  const [computerHours, setComputerHours] = useState<number>(5);

  // Section C: Food
  const [dietType, setDietType] = useState<DietType>('mixed');
  const [dietFrequency, setDietFrequency] = useState<DietFrequency>('moderate');

  // Section D: Waste
  const [wasteKgPerWeek, setWasteKgPerWeek] = useState<number>(5);
  const [recycledPercentage, setRecycledPercentage] = useState<number>(40);
  const [plasticUsage, setPlasticUsage] = useState<PlasticUsageLevel>('moderate');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Real-time live subtotal calculations
  const liveTransport = calculateTransportationEmissions(
    vehicleType,
    distanceKm > 0 ? distanceKm : 0,
    travelDays > 0 ? travelDays : 0
  );
  const liveElectricity = calculateElectricityEmissions(
    monthlyKwh > 0 ? monthlyKwh : 0,
    acHours > 0 ? acHours : 0,
    computerHours > 0 ? computerHours : 0
  );
  const liveFood = calculateFoodEmissions(dietType, dietFrequency);
  const liveWaste = calculateWasteEmissions(
    wasteKgPerWeek > 0 ? wasteKgPerWeek : 0,
    recycledPercentage >= 0 ? recycledPercentage : 0,
    plasticUsage
  );
  const liveTotal = Number(
    (liveTransport + liveElectricity + liveFood + liveWaste).toFixed(1)
  );

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (distanceKm < 0) {
      errs.distanceKm = 'Distance cannot be negative';
    } else if (distanceKm > 500) {
      errs.distanceKm = 'Daily distance appears unusually high (>500 km)';
    }

    if (travelDays < 0 || travelDays > 7) {
      errs.travelDays = 'Travel days must be between 0 and 7';
    }

    if (monthlyKwh < 0) {
      errs.monthlyKwh = 'Electricity consumption cannot be negative';
    }

    if (acHours < 0 || acHours > 24) {
      errs.acHours = 'AC hours must be between 0 and 24';
    }

    if (wasteKgPerWeek < 0) {
      errs.wasteKgPerWeek = 'Waste weight cannot be negative';
    }

    if (recycledPercentage < 0 || recycledPercentage > 100) {
      errs.recycledPercentage = 'Recycling rate must be between 0% and 100%';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const inputs: FootprintCalculationInputs = {
      transportation: {
        vehicleType,
        distanceKmPerDay: Number(distanceKm) || 0,
        travelDaysPerWeek: Number(travelDays) || 0,
      },
      electricity: {
        monthlyKwh: Number(monthlyKwh) || 0,
        acHoursPerDay: Number(acHours) || 0,
        computerHoursPerDay: Number(computerHours) || 0,
      },
      food: {
        dietType,
        frequency: dietFrequency,
      },
      waste: {
        wasteKgPerWeek: Number(wasteKgPerWeek) || 0,
        recycledPercentage: Number(recycledPercentage) || 0,
        plasticUsage,
      },
    };

    const record = createFootprintRecord(inputs);
    onCalculationComplete(record);

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#10b981', '#34d399', '#0284c7'],
      });
    } catch {
      // non-critical
    }

    onNavigate('results');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto pb-16"
    >
      {/* Header */}
      <div className="mb-8 pb-4 border-b border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span>Multi-Section Calculator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Personal Carbon Assessment
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
            Estimate greenhouse gas emissions across transportation, household power, dietary supply chains, and landfill waste.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-2 px-3 rounded-xl border border-slate-200/80 shadow-2xs">
          <Info className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Formulas based on UK DEFRA & EPA data</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Multi-section Form */}
        <form onSubmit={handleCalculate} className="lg:col-span-2 space-y-6">
          {/* SECTION A: TRANSPORTATION */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  A
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Transportation & Commuting</h2>
                  <p className="text-[11px] text-slate-500">Vehicle combustion and active mobility factors</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                {liveTransport.toFixed(1)} kg CO₂e/mo
              </span>
            </div>

            {/* Vehicle Mode Grid */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Primary Commute Mode
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(Object.keys(VEHICLE_DETAILS) as VehicleType[]).map((type) => {
                  const item = VEHICLE_DETAILS[type];
                  const isSelected = vehicleType === type;
                  return (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setVehicleType(type)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{item.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                        {item.isZeroEmission ? 'Zero Emission' : `${Math.round(item.factor * 1000)}g/km`}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Distance & Days with dual Range Slider + Direct Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Daily Distance</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="500"
                      value={distanceKm || ''}
                      onChange={(e) => setDistanceKm(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                      className="w-16 px-2 py-0.5 text-right font-bold text-slate-900 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500"
                    />
                    <span className="text-slate-500 text-[11px]">km</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={Math.min(100, distanceKm)}
                  onChange={(e) => setDistanceKm(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0 km</span>
                  <span>50 km</span>
                  <span>100+ km</span>
                </div>
                {errors.distanceKm && (
                  <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.distanceKm}</span>
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Travel Days / Week</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="7"
                      value={travelDays || ''}
                      onChange={(e) => setTravelDays(e.target.value === '' ? 0 : Math.min(7, Math.max(0, Number(e.target.value))))}
                      className="w-14 px-2 py-0.5 text-right font-bold text-slate-900 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500"
                    />
                    <span className="text-slate-500 text-[11px]">days</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="7"
                  step="1"
                  value={travelDays}
                  onChange={(e) => setTravelDays(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0 days</span>
                  <span>3 days</span>
                  <span>7 days</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION B: ELECTRICITY */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                  B
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Electricity & Power</h2>
                  <p className="text-[11px] text-slate-500">Grid electricity (0.710 kg CO₂e / kWh) and major appliances</p>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                {liveElectricity.toFixed(1)} kg CO₂e/mo
              </span>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Monthly Grid Meter Consumption</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="5000"
                      value={monthlyKwh || ''}
                      onChange={(e) => setMonthlyKwh(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                      className="w-20 px-2 py-0.5 text-right font-bold text-slate-900 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-amber-500"
                    />
                    <span className="text-slate-500 text-[11px]">kWh</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="600"
                  step="10"
                  value={Math.min(600, monthlyKwh)}
                  onChange={(e) => setMonthlyKwh(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0 kWh</span>
                  <span>150 kWh (Student Dorm)</span>
                  <span>300 kWh</span>
                  <span>600+ kWh</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>AC Cooling Usage</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        max="24"
                        value={acHours || ''}
                        onChange={(e) => setAcHours(e.target.value === '' ? 0 : Math.min(24, Math.max(0, Number(e.target.value))))}
                        className="w-12 px-1.5 py-0.5 text-right font-bold text-slate-900 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-amber-500"
                      />
                      <span className="text-slate-500 text-[10px]">hrs/day</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="12"
                    step="1"
                    value={acHours}
                    onChange={(e) => setAcHours(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">~1.5 kW compressor rating</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Computer / Gaming Load</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        max="24"
                        value={computerHours || ''}
                        onChange={(e) => setComputerHours(e.target.value === '' ? 0 : Math.min(24, Math.max(0, Number(e.target.value))))}
                        className="w-12 px-1.5 py-0.5 text-right font-bold text-slate-900 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-amber-500"
                      />
                      <span className="text-slate-500 text-[10px]">hrs/day</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="16"
                    step="1"
                    value={computerHours}
                    onChange={(e) => setComputerHours(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Laptop, external monitor, consoles</p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION C: FOOD */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold text-xs">
                  C
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Food & Diet</h2>
                  <p className="text-[11px] text-slate-500">Agricultural lifecycle methane & feed supply chain</p>
                </div>
              </div>
              <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100">
                {liveFood.toFixed(1)} kg CO₂e/mo
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Diet Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Dietary Style
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'vegetarian', title: 'Vegetarian / Plant-Based', sub: '90 kg base (pulses, grains, local vegetables)' },
                    { id: 'mixed', title: 'Mixed / Flexitarian', sub: '150 kg base (balanced poultry, eggs, dairy)' },
                    { id: 'non_vegetarian', title: 'Non-Vegetarian', sub: '225 kg base (frequent red meat & poultry)' },
                  ].map((d) => (
                    <button
                      type="button"
                      key={d.id}
                      onClick={() => setDietType(d.id as DietType)}
                      className={`w-full p-3 rounded-xl border text-left transition-all ${
                        dietType === d.id
                          ? 'border-cyan-600 bg-cyan-50/70 ring-2 ring-cyan-500/20'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{d.title}</span>
                        {dietType === d.id && <Check className="w-3.5 h-3.5 text-cyan-600" />}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">{d.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Diet Frequency */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Portion & Caloric Factor
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'low', title: 'Light / Small Portions', sub: 'Low meal frequency or light breakfast (0.85x)' },
                    { id: 'moderate', title: 'Standard / 3 Meals', sub: 'Typical student daily intake (1.00x)' },
                    { id: 'high', title: 'High Calorie / Heavy Takeout', sub: 'High animal protein or large dining portions (1.25x)' },
                  ].map((f) => (
                    <button
                      type="button"
                      key={f.id}
                      onClick={() => setDietFrequency(f.id as DietFrequency)}
                      className={`w-full p-3 rounded-xl border text-left transition-all ${
                        dietFrequency === f.id
                          ? 'border-cyan-600 bg-cyan-50/70 ring-2 ring-cyan-500/20'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{f.title}</span>
                        {dietFrequency === f.id && <Check className="w-3.5 h-3.5 text-cyan-600" />}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">{f.sub}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION D: WASTE */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-violet-100 text-violet-800 flex items-center justify-center font-bold text-xs">
                  D
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Waste & Plastics</h2>
                  <p className="text-[11px] text-slate-500">Landfill decomposition methane and polymer life-cycle</p>
                </div>
              </div>
              <span className="text-xs font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded border border-violet-100">
                {liveWaste.toFixed(1)} kg CO₂e/mo
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Weekly Waste</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      value={wasteKgPerWeek || ''}
                      onChange={(e) => setWasteKgPerWeek(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                      className="w-16 px-1.5 py-0.5 text-right font-bold text-slate-900 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-violet-500"
                    />
                    <span className="text-slate-500 text-[10px]">kg</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="20"
                  step="0.5"
                  value={Math.min(20, wasteKgPerWeek)}
                  onChange={(e) => setWasteKgPerWeek(Number(e.target.value))}
                  className="w-full accent-violet-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block">Dorm average: ~4-6 kg/wk</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Recycled Portion</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={recycledPercentage || ''}
                      onChange={(e) => setRecycledPercentage(e.target.value === '' ? 0 : Math.min(100, Math.max(0, Number(e.target.value))))}
                      className="w-14 px-1.5 py-0.5 text-right font-bold text-slate-900 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-violet-500"
                    />
                    <span className="text-slate-500 text-[10px]">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={recycledPercentage}
                  onChange={(e) => setRecycledPercentage(Number(e.target.value))}
                  className="w-full accent-violet-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block">Paper, aluminium, plastic bottles</span>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Single-Use Plastic
                </label>
                <select
                  value={plasticUsage}
                  onChange={(e) => setPlasticUsage(e.target.value as PlasticUsageLevel)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-xs bg-white"
                >
                  <option value="minimal">Minimal (Reusable flasks & bags)</option>
                  <option value="moderate">Moderate (Occasional takeaway)</option>
                  <option value="high">High (Daily packaged bottled items)</option>
                </select>
                <span className="text-[10px] text-slate-500 block mt-1">Lifecycle polymer addition</span>
              </div>
            </div>
          </div>

          {/* Form Action */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              Deterministic calculations based on DEFRA conversion tables.
            </span>

            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold px-7 py-3 rounded-xl shadow-xs hover:shadow transition-all text-sm"
            >
              <span>Calculate My Footprint</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Live Calculation Sidebar (Desktop) */}
        <div className="space-y-6">
          <div className="sticky top-24 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <div>
              <span className="text-[11px] uppercase font-bold tracking-wider text-slate-500">
                Live Subtotal Preview
              </span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
                  {liveTotal.toFixed(1)}
                </span>
                <span className="text-xs font-semibold text-slate-500">kg CO₂e / mo</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Annual equivalent: ~{((liveTotal * 12) / 1000).toFixed(2)} metric tonnes
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span className="text-slate-700 font-semibold">Transportation</span>
                </div>
                <span className="font-bold text-slate-900">{liveTransport.toFixed(1)} kg</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                  <span className="text-slate-700 font-semibold">Electricity</span>
                </div>
                <span className="font-bold text-slate-900">{liveElectricity.toFixed(1)} kg</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-600" />
                  <span className="text-slate-700 font-semibold">Food</span>
                </div>
                <span className="font-bold text-slate-900">{liveFood.toFixed(1)} kg</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-violet-600" />
                  <span className="text-slate-700 font-semibold">Waste</span>
                </div>
                <span className="font-bold text-slate-900">{liveWaste.toFixed(1)} kg</span>
              </div>
            </div>

            {/* Benchmark Gauge Comparison */}
            <div className="pt-4 border-t border-slate-100 text-xs space-y-2.5">
              <div className="flex items-center justify-between text-slate-600">
                <span>1.5°C Climate Goal:</span>
                <span className="font-bold text-emerald-700">≤ 200 kg/mo</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Global Average:</span>
                <span className="font-bold text-slate-800">420 kg/mo</span>
              </div>

              <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px] text-slate-600 leading-relaxed">
                Clicking <strong>Calculate My Footprint</strong> commits this record to your historical tracker and triggers tailored Gemini AI recommendations.
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
