import React, { useState } from 'react';
import {
  Sparkles,
  RotateCcw,
  CheckCircle2,
  TreePine,
  Car,
  Zap,
  Utensils,
  Trash2,
  ArrowRight,
  BookmarkCheck,
  Award,
  Sliders,
} from 'lucide-react';
import { FootprintRecord, ActivePage } from '../types';
import { CategoryDoughnutChart } from '../components/charts/CategoryDoughnutChart';
import { motion } from 'motion/react';

interface Props {
  record: FootprintRecord;
  onNavigate: (page: ActivePage) => void;
}

export const ResultsPage: React.FC<Props> = ({ record, onNavigate }) => {
  const [savedNotification, setSavedNotification] = useState(false);

  const { breakdown, largestCategory, largestPercentage, sustainabilityScore } = record;

  const transportPct = Math.round((breakdown.transportation / breakdown.total) * 100) || 0;
  const electricityPct = Math.round((breakdown.electricity / breakdown.total) * 100) || 0;
  const foodPct = Math.round((breakdown.food / breakdown.total) * 100) || 0;
  const wastePct = Math.round((breakdown.waste / breakdown.total) * 100) || 0;

  // Tree absorption equivalent: 1 tree absorbs ~22 kg CO2 per year (~1.83 kg/month)
  const treesNeeded = Math.ceil(breakdown.total / 1.83);

  const handleSaveAgain = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto pb-16 space-y-8"
    >
      {/* Page Title */}
      <div className="text-center max-w-xl mx-auto">
        <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60 inline-flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Diagnostic Complete</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight font-heading">
          Your Carbon Footprint
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-600">
          Estimated greenhouse gas emissions recorded on {record.dateFormatted}.
        </p>
      </div>

      {/* Main Results Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Column: Totals & Primary Finding */}
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                Total Estimated Emissions
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-5xl font-black text-slate-900 font-heading tracking-tight">
                  {breakdown.total.toFixed(1)}
                </span>
                <span className="text-sm font-bold text-slate-500">kg CO₂e / month</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Annual run rate: ~{((breakdown.total * 12) / 1000).toFixed(2)} metric tonnes CO₂e.
              </p>
            </div>

            {/* Largest Emission Source Banner */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                Primary Reduction Leverage
              </span>
              <p className="text-base font-bold text-slate-900 mt-0.5">
                Your largest emission source is {largestCategory}.
              </p>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Represents {largestPercentage}% of your total monthly carbon output (
                {breakdown[largestCategory.toLowerCase() as keyof typeof breakdown].toFixed(1)} kg CO₂e).
              </p>
            </div>

            {/* Sustainability Score & Tree Equivalency */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-500 font-semibold">Sustainability Score</span>
                <p className="text-2xl font-black text-emerald-700 mt-1 font-heading">
                  {sustainabilityScore}
                  <span className="text-xs font-normal text-slate-400"> / 100</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-500 font-semibold">Tree Absorption Equiv.</span>
                <p className="text-2xl font-black text-emerald-800 mt-1 font-heading flex items-center gap-1.5">
                  <TreePine className="w-5 h-5 text-emerald-600 inline" />
                  {treesNeeded}
                  <span className="text-xs font-normal text-slate-400"> trees/yr</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Doughnut Chart */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
            <h3 className="text-xs uppercase font-bold text-slate-500 mb-2">Category Ratio</h3>
            <CategoryDoughnutChart breakdown={breakdown} height={240} />
          </div>
        </div>

        {/* Breakdown Progress Bars */}
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Emissions by Source Category</h3>

          {/* Transportation */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5 font-semibold">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-emerald-600" />
                <span className="text-slate-800">Transportation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">{breakdown.transportation.toFixed(1)} kg</span>
                <span className="text-slate-400 font-normal">({transportPct}%)</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${transportPct}%` }}
                transition={{ duration: 0.8 }}
                className="bg-emerald-600 h-2.5 rounded-full"
              />
            </div>
          </div>

          {/* Electricity */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5 font-semibold">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-600" />
                <span className="text-slate-800">Electricity</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">{breakdown.electricity.toFixed(1)} kg</span>
                <span className="text-slate-400 font-normal">({electricityPct}%)</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${electricityPct}%` }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="bg-amber-600 h-2.5 rounded-full"
              />
            </div>
          </div>

          {/* Food */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5 font-semibold">
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-cyan-600" />
                <span className="text-slate-800">Food & Diet</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">{breakdown.food.toFixed(1)} kg</span>
                <span className="text-slate-400 font-normal">({foodPct}%)</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${foodPct}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-cyan-600 h-2.5 rounded-full"
              />
            </div>
          </div>

          {/* Waste */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5 font-semibold">
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-violet-600" />
                <span className="text-slate-800">Waste & Plastics</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">{breakdown.waste.toFixed(1)} kg</span>
                <span className="text-slate-400 font-normal">({wastePct}%)</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${wastePct}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="bg-violet-600 h-2.5 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Action Triggers */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('simulator')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold px-5 py-3 rounded-xl transition-all text-sm shadow-2xs"
            >
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>Simulate Reductions</span>
            </button>
            <button
              onClick={() => onNavigate('ai-insights')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold px-6 py-3 rounded-xl shadow-xs hover:shadow transition-all text-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Get AI Recommendations</span>
            </button>
            <button
              onClick={handleSaveAgain}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-4 py-3 rounded-xl text-sm transition-colors"
            >
              <BookmarkCheck className="w-4 h-4 text-slate-600" />
              <span>{savedNotification ? 'Saved in History!' : 'Save Result'}</span>
            </button>
          </div>

          <button
            onClick={() => onNavigate('calculator')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Recalculate with different values</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
