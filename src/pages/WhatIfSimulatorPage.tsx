import React, { useState, useMemo } from 'react';
import {
  Sliders,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Car,
  Zap,
  Utensils,
  Trash2,
  RotateCcw,
  TreePine,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Info,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';
import {
  FootprintRecord,
  FootprintCalculationInputs,
  VehicleType,
  DietType,
  DietFrequency,
  PlasticUsageLevel,
  ActivePage,
  WhatIfAIExplanation,
} from '../types';
import { calculateFullFootprint } from '../utils/calculator';
import { WhatIfComparisonChart } from '../components/charts/WhatIfComparisonChart';
import { fetchSimulatorExplanation } from '../services/api';
import { motion } from 'motion/react';

interface Props {
  currentRecord: FootprintRecord | null;
  onNavigate: (page: ActivePage) => void;
}

const DEFAULT_BASELINE_INPUTS: FootprintCalculationInputs = {
  transportation: {
    vehicleType: 'petrol_car',
    distanceKmPerDay: 20,
    travelDaysPerWeek: 5,
  },
  electricity: {
    monthlyKwh: 160,
    acHoursPerDay: 3,
    computerHoursPerDay: 5,
  },
  food: {
    dietType: 'non_vegetarian',
    frequency: 'moderate',
  },
  waste: {
    wasteKgPerWeek: 6,
    recycledPercentage: 25,
    plasticUsage: 'high',
  },
};

export const WhatIfSimulatorPage: React.FC<Props> = ({ currentRecord, onNavigate }) => {
  // Baseline inputs: use latest user record inputs or default baseline
  const baseInputs: FootprintCalculationInputs = useMemo(() => {
    return currentRecord ? currentRecord.inputs : DEFAULT_BASELINE_INPUTS;
  }, [currentRecord]);

  // Selected Category being modified in What-If
  const [selectedCategory, setSelectedCategory] = useState<'transportation' | 'electricity' | 'food' | 'waste'>('transportation');

  // Simulated state adjustments
  // Transportation
  const [simVehicle, setSimVehicle] = useState<VehicleType>('bus');
  const [simDistanceKm, setSimDistanceKm] = useState<number>(baseInputs.transportation.distanceKmPerDay);
  const [simTravelDays, setSimTravelDays] = useState<number>(baseInputs.transportation.travelDaysPerWeek);

  // Electricity
  const [simMonthlyKwh, setSimMonthlyKwh] = useState<number>(Math.max(0, Math.round(baseInputs.electricity.monthlyKwh * 0.7)));
  const [simAcHours, setSimAcHours] = useState<number>(Math.max(0, (baseInputs.electricity.acHoursPerDay || 0) - 1));
  const [simPcHours, setSimPcHours] = useState<number>(baseInputs.electricity.computerHoursPerDay || 5);

  // Food
  const [simDietType, setSimDietType] = useState<DietType>('vegetarian');
  const [simDietFrequency, setSimDietFrequency] = useState<DietFrequency>('moderate');

  // Waste
  const [simWasteKg, setSimWasteKg] = useState<number>(baseInputs.waste.wasteKgPerWeek);
  const [simRecycledPct, setSimRecycledPct] = useState<number>(80);
  const [simPlasticUsage, setSimPlasticUsage] = useState<PlasticUsageLevel>('minimal');

  const [scenarioName, setScenarioName] = useState<string>('Switch Solo Car Commute to Public Transit');

  // AI Explanation State
  const [aiExplanation, setAiExplanation] = useState<WhatIfAIExplanation | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // 1. Current Deterministic Calculation
  const currentBreakdown = useMemo(() => {
    return calculateFullFootprint(baseInputs);
  }, [baseInputs]);

  // 2. Simulated Inputs according to the selected modification
  const simulatedInputs: FootprintCalculationInputs = useMemo(() => {
    const next: FootprintCalculationInputs = JSON.parse(JSON.stringify(baseInputs));

    if (selectedCategory === 'transportation') {
      next.transportation = {
        vehicleType: simVehicle,
        distanceKmPerDay: simDistanceKm,
        travelDaysPerWeek: simTravelDays,
      };
    } else if (selectedCategory === 'electricity') {
      next.electricity = {
        monthlyKwh: simMonthlyKwh,
        acHoursPerDay: simAcHours,
        computerHoursPerDay: simPcHours,
      };
    } else if (selectedCategory === 'food') {
      next.food = {
        dietType: simDietType,
        frequency: simDietFrequency,
      };
    } else if (selectedCategory === 'waste') {
      next.waste = {
        wasteKgPerWeek: simWasteKg,
        recycledPercentage: simRecycledPct,
        plasticUsage: simPlasticUsage,
      };
    }
    return next;
  }, [
    baseInputs,
    selectedCategory,
    simVehicle,
    simDistanceKm,
    simTravelDays,
    simMonthlyKwh,
    simAcHours,
    simPcHours,
    simDietType,
    simDietFrequency,
    simWasteKg,
    simRecycledPct,
    simPlasticUsage,
  ]);

  // 3. Simulated Deterministic Calculation
  const simulatedBreakdown = useMemo(() => {
    return calculateFullFootprint(simulatedInputs);
  }, [simulatedInputs]);

  // 4. Mathematical Comparison Metrics
  const currentTotal = currentBreakdown.total;
  const newTotal = simulatedBreakdown.total;
  const reductionKg = Number((currentTotal - newTotal).toFixed(1));
  const percentageReduction = currentTotal > 0
    ? Number(((reductionKg / currentTotal) * 100).toFixed(1))
    : 0;
  const annualSavedKg = Number((reductionKg * 12).toFixed(1));
  const treesEquivalent = Math.max(0, Math.ceil(annualSavedKg / 22));

  // Quick Preset Handlers
  const applyPreset = (preset: 'transit' | 'ac' | 'plant' | 'recycle') => {
    if (preset === 'transit') {
      setSelectedCategory('transportation');
      setSimVehicle('bus');
      setSimDistanceKm(baseInputs.transportation.distanceKmPerDay);
      setSimTravelDays(Math.max(1, baseInputs.transportation.travelDaysPerWeek - 1));
      setScenarioName('Swap Car Commute to Campus Bus & Rail');
    } else if (preset === 'ac') {
      setSelectedCategory('electricity');
      setSimMonthlyKwh(Math.max(30, Math.round(baseInputs.electricity.monthlyKwh * 0.75)));
      setSimAcHours(1);
      setScenarioName('Reduce AC Runtime to 1 Hr & Cut Phantom Loads');
    } else if (preset === 'plant') {
      setSelectedCategory('food');
      setSimDietType('vegetarian');
      setSimDietFrequency('moderate');
      setScenarioName('Switch to Plant-Based Cafeteria Meals');
    } else if (preset === 'recycle') {
      setSelectedCategory('waste');
      setSimRecycledPct(85);
      setSimPlasticUsage('minimal');
      setScenarioName('Achieve 85% Recycling & Zero Single-Use Plastics');
    }
    setAiExplanation(null);
  };

  // AI Explanation Request
  const handleExplainWithAI = async () => {
    setLoadingAi(true);
    try {
      const categoryNames: Record<string, string> = {
        transportation: 'Transportation',
        electricity: 'Electricity',
        food: 'Food',
        waste: 'Waste',
      };
      const res = await fetchSimulatorExplanation({
        currentTotal,
        newTotal,
        reductionKg,
        percentageReduction,
        categoryModified: categoryNames[selectedCategory] || 'Lifestyle',
        scenarioDescription: scenarioName,
      });

      if (res.success) {
        setAiExplanation({
          explanation: res.explanation,
          practicalTips: res.practicalTips,
          annualImpact: res.annualImpact,
          source: res.source,
          note: res.note,
        });
      }
    } catch {
      // handled in service
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto pb-16 space-y-8"
    >
      {/* Header */}
      <div className="pb-3 border-b border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
            <Sliders className="w-4 h-4 text-emerald-600" />
            <span>Interactive Modeling</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            What-If Scenario Simulator
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
            Test hypothetical lifestyle changes before making them in real life. All numbers use deterministic calculation formulas; Gemini AI provides contextual explanations.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-2.5 px-3 rounded-xl border border-slate-200/80 shadow-2xs">
          <Info className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Baseline: <strong>{currentTotal.toFixed(1)} kg CO₂e/mo</strong>
          </span>
        </div>
      </div>

      {/* QUICK PRESET BUTTONS ROW */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          One-Click What-If Scenarios:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => applyPreset('transit')}
            className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
              selectedCategory === 'transportation'
                ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                : 'border-slate-200/80 bg-white hover:border-slate-300'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block leading-snug">
                1. Switch to Campus Bus / Rail
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                Slash solo vehicle combustion
              </span>
            </div>
          </button>

          <button
            onClick={() => applyPreset('ac')}
            className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
              selectedCategory === 'electricity'
                ? 'border-amber-600 bg-amber-50/70 ring-2 ring-amber-500/20'
                : 'border-slate-200/80 bg-white hover:border-slate-300'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block leading-snug">
                2. Reduce AC & Dorm Power
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                Cut compressor and standby kWh
              </span>
            </div>
          </button>

          <button
            onClick={() => applyPreset('plant')}
            className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
              selectedCategory === 'food'
                ? 'border-cyan-600 bg-cyan-50/70 ring-2 ring-cyan-500/20'
                : 'border-slate-200/80 bg-white hover:border-slate-300'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center shrink-0 mt-0.5">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block leading-snug">
                3. Plant-Forward Cafeteria Diet
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                Lower livestock enteric methane
              </span>
            </div>
          </button>

          <button
            onClick={() => applyPreset('recycle')}
            className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
              selectedCategory === 'waste'
                ? 'border-violet-600 bg-violet-50/70 ring-2 ring-violet-500/20'
                : 'border-slate-200/80 bg-white hover:border-slate-300'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-800 flex items-center justify-center shrink-0 mt-0.5">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block leading-snug">
                4. Zero-Waste & 85% Recycling
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                Prevent landfill anaerobic methane
              </span>
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* LEFT COLUMN: INTERACTIVE SCENARIO CONTROLS */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-700">
                Simulation Activity
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Select to adjust</span>
            </div>

            {/* Category Selector Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl">
              {[
                { id: 'transportation', label: 'Travel', icon: Car },
                { id: 'electricity', label: 'Energy', icon: Zap },
                { id: 'food', label: 'Food', icon: Utensils },
                { id: 'waste', label: 'Waste', icon: Trash2 },
              ].map((t) => {
                const Icon = t.icon;
                const active = selectedCategory === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedCategory(t.id as any);
                      setAiExplanation(null);
                    }}
                    className={`flex flex-col items-center gap-1 py-2 rounded-lg text-xs font-bold transition-all ${
                      active
                        ? 'bg-white text-emerald-800 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DYNAMIC SCENARIO CONTROLS */}
          {selectedCategory === 'transportation' && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Simulated Commute Mode
                </label>
                <select
                  value={simVehicle}
                  onChange={(e) => {
                    setSimVehicle(e.target.value as VehicleType);
                    setScenarioName(`Switch travel to ${e.target.value.replace('_', ' ')}`);
                    setAiExplanation(null);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-semibold"
                >
                  <option value="bus">City / Campus Bus (~89g CO₂e/km)</option>
                  <option value="train">Train / Metro Rail (~35g CO₂e/km)</option>
                  <option value="cycling">Bicycle / E-Bike (0g direct CO₂e)</option>
                  <option value="walking">Walking (0g direct CO₂e)</option>
                  <option value="electric_vehicle">Electric Car (~45g CO₂e/km)</option>
                  <option value="motorcycle">Motorcycle / Scooter (~103g CO₂e/km)</option>
                  <option value="petrol_car">Petrol Car (~170g CO₂e/km)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Simulated Distance</span>
                  <span className="font-bold text-slate-900">{simDistanceKm} km/day</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="1"
                  value={simDistanceKm}
                  onChange={(e) => {
                    setSimDistanceKm(Number(e.target.value));
                    setAiExplanation(null);
                  }}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Simulated Days / Week</span>
                  <span className="font-bold text-slate-900">{simTravelDays} days/wk</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="7"
                  step="1"
                  value={simTravelDays}
                  onChange={(e) => {
                    setSimTravelDays(Number(e.target.value));
                    setAiExplanation(null);
                  }}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>
          )}

          {selectedCategory === 'electricity' && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Monthly Grid Usage</span>
                  <span className="font-bold text-slate-900">{simMonthlyKwh} kWh</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="400"
                  step="10"
                  value={simMonthlyKwh}
                  onChange={(e) => {
                    setSimMonthlyKwh(Number(e.target.value));
                    setAiExplanation(null);
                  }}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block">Baseline was {baseInputs.electricity.monthlyKwh} kWh</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>AC Cooling Runtime</span>
                  <span className="font-bold text-slate-900">{simAcHours} hrs/day</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={simAcHours}
                  onChange={(e) => {
                    setSimAcHours(Number(e.target.value));
                    setAiExplanation(null);
                  }}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>
            </div>
          )}

          {selectedCategory === 'food' && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Simulated Diet Choice
                </label>
                <select
                  value={simDietType}
                  onChange={(e) => {
                    setSimDietType(e.target.value as DietType);
                    setScenarioName(`Adopt ${e.target.value.replace('_', ' ')} diet style`);
                    setAiExplanation(null);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-semibold"
                >
                  <option value="vegetarian">Vegetarian (Plant-based base: 90 kg/mo)</option>
                  <option value="mixed">Mixed Flexitarian (Moderate meat/dairy: 150 kg/mo)</option>
                  <option value="non_vegetarian">Non-Vegetarian (Regular meat: 225 kg/mo)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Portion & Caloric Factor
                </label>
                <select
                  value={simDietFrequency}
                  onChange={(e) => {
                    setSimDietFrequency(e.target.value as DietFrequency);
                    setAiExplanation(null);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-semibold"
                >
                  <option value="low">Light Meals / Intermittent (0.85x)</option>
                  <option value="moderate">Standard 3 Meals (1.00x)</option>
                  <option value="high">Heavy Meat Portions (1.25x)</option>
                </select>
              </div>
            </div>
          )}

          {selectedCategory === 'waste' && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Recycling Proportion</span>
                  <span className="font-bold text-slate-900">{simRecycledPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={simRecycledPct}
                  onChange={(e) => {
                    setSimRecycledPct(Number(e.target.value));
                    setAiExplanation(null);
                  }}
                  className="w-full accent-violet-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Single-Use Plastics Habit
                </label>
                <select
                  value={simPlasticUsage}
                  onChange={(e) => {
                    setSimPlasticUsage(e.target.value as PlasticUsageLevel);
                    setAiExplanation(null);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-semibold"
                >
                  <option value="minimal">Minimal (Flask, tote bags, bulk snacks)</option>
                  <option value="moderate">Moderate (Occasional takeaway cups)</option>
                  <option value="high">High (Daily packaged bottled drinks)</option>
                </select>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={handleExplainWithAI}
              disabled={loadingAi}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold py-3 rounded-xl shadow-xs transition-all text-xs disabled:opacity-60"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{loadingAi ? 'Synthesizing with Gemini AI...' : 'Explain Impact with Gemini AI'}</span>
            </button>
          </div>
        </div>

        {/* RIGHT TWO COLUMNS: DETERMINISTIC RESULTS & COMPARISON CHART */}
        <div className="lg:col-span-2 space-y-6">
          {/* RESULTS CARD */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                  Simulation Outcome
                </span>
                <h3 className="text-lg font-bold text-slate-900 font-heading mt-0.5">
                  {scenarioName}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 text-xs font-black px-3 py-1.5 rounded-xl border ${
                    reductionKg > 0
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80'
                      : reductionKg === 0
                      ? 'bg-slate-100 text-slate-700 border-slate-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  {reductionKg > 0 ? (
                    <TrendingDown className="w-4 h-4 text-emerald-600" />
                  ) : null}
                  <span>
                    {reductionKg > 0
                      ? `-${reductionKg} kg CO₂e (-${percentageReduction}%)`
                      : reductionKg === 0
                      ? 'No Change'
                      : `+${Math.abs(reductionKg)} kg CO₂e (+${Math.abs(percentageReduction)}%)`}
                  </span>
                </span>
              </div>
            </div>

            {/* 4 STAT BOXES (Current, New, Reduction, Annual Impact) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-400 font-bold block">Current Baseline</span>
                <p className="text-2xl font-black text-slate-800 font-heading mt-0.5">
                  {currentTotal.toFixed(1)}
                </p>
                <span className="text-[10px] text-slate-500 font-medium">kg CO₂e/mo</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                <span className="text-[11px] text-emerald-700 font-bold block">Simulated Footprint</span>
                <p className="text-2xl font-black text-emerald-800 font-heading mt-0.5">
                  {newTotal.toFixed(1)}
                </p>
                <span className="text-[10px] text-emerald-700 font-medium">kg CO₂e/mo</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-400 font-bold block">Monthly Reduction</span>
                <p className="text-2xl font-black text-emerald-700 font-heading mt-0.5">
                  {reductionKg > 0 ? `-${reductionKg}` : `${reductionKg}`}
                </p>
                <span className="text-[10px] text-slate-500 font-medium">kg saved/mo</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-400 font-bold block">Tree Equiv. (Yr)</span>
                <p className="text-2xl font-black text-slate-900 font-heading mt-0.5 flex items-center gap-1">
                  <TreePine className="w-4 h-4 text-emerald-600 inline" />
                  {treesEquivalent}
                </p>
                <span className="text-[10px] text-slate-500 font-medium">mature trees</span>
              </div>
            </div>

            {/* COMPARISON CHART */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Side-by-Side Category Comparison
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Deterministic Bar Visualizer</span>
              </div>
              <WhatIfComparisonChart
                currentBreakdown={currentBreakdown}
                simulatedBreakdown={simulatedBreakdown}
                height={260}
              />
            </div>
          </div>

          {/* AI EXPLANATION & STUDENT TIPS SECTION */}
          {aiExplanation && (
            <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-7 shadow-xs space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Gemini AI Qualitative Explanation</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-300 bg-white/10 px-2 py-0.5 rounded">
                  {aiExplanation.source || 'gemini-3.8-flash'}
                </span>
              </div>

              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                {aiExplanation.explanation}
              </p>

              {aiExplanation.annualImpact && (
                <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 text-xs text-emerald-200 leading-relaxed">
                  🌍 <strong>Annual Impact:</strong> {aiExplanation.annualImpact}
                </div>
              )}

              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2">
                  Campus Implementation Tips:
                </span>
                <div className="space-y-2">
                  {aiExplanation.practicalTips.map((tip, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 flex items-start gap-2.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[10px] text-slate-400 pt-2 border-t border-white/10">
                Notice: All numbers were computed deterministically by EcoTrack's calculation engine. Google Gemini provided language explanations and practical tips.
              </p>
            </div>
          )}

          {!aiExplanation && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  Click <strong>Explain Impact with Gemini AI</strong> to receive personalized qualitative mentoring on this scenario.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
