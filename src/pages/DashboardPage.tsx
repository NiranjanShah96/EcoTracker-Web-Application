import React, { useState } from 'react';
import {
  TrendingDown,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Car,
  Zap,
  Utensils,
  Trash2,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  BarChart3,
  Calendar,
  Layers,
  Award,
  Sliders,
} from 'lucide-react';
import { FootprintRecord, ActivePage } from '../types';
import { CategoryDoughnutChart } from '../components/charts/CategoryDoughnutChart';
import { HistoricalTrendChart } from '../components/charts/HistoricalTrendChart';
import { WeeklyBarChart } from '../components/charts/WeeklyBarChart';
import { motion } from 'motion/react';

interface Props {
  records: FootprintRecord[];
  onNavigate: (page: ActivePage) => void;
  onClearDemoData: () => void;
  onRestoreDemoData: () => void;
}

export const DashboardPage: React.FC<Props> = ({
  records,
  onNavigate,
  onClearDemoData,
  onRestoreDemoData,
}) => {
  const [activeChartTab, setActiveChartTab] = useState<'all' | 'doughnut' | 'trend'>('all');

  // Get latest record
  const latest = records[records.length - 1];
  const previous = records.length > 1 ? records[records.length - 2] : null;

  // If no records at all
  if (!latest) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <BarChart3 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-heading">
          No Emission Data Yet
        </h2>
        <p className="mt-2 text-slate-600 text-sm max-w-sm mx-auto leading-relaxed">
          Calculate your personal carbon footprint or load pre-built demo records to explore the interactive analytics suite.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('calculator')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-xs transition-all"
          >
            <span>Launch Carbon Calculator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onRestoreDemoData}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-5 py-3 rounded-xl border border-slate-200 shadow-xs transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Load Sample Dataset</span>
          </button>
        </div>
      </div>
    );
  }

  // Metrics calculation
  const monthlyTotal = latest.breakdown.total;
  const weeklyTotal = Number((monthlyTotal / 4.33).toFixed(1));
  const dailyTotal = Number((monthlyTotal / 30).toFixed(1));

  // Percentage change vs previous record
  let pctChange: number | null = null;
  let isReduction = false;
  if (previous && previous.breakdown.total > 0) {
    const diff = monthlyTotal - previous.breakdown.total;
    pctChange = Number(((diff / previous.breakdown.total) * 100).toFixed(1));
    isReduction = pctChange < 0;
  }

  // Category percentage breakdown
  const transportPct = Math.round((latest.breakdown.transportation / monthlyTotal) * 100) || 0;
  const electricityPct = Math.round((latest.breakdown.electricity / monthlyTotal) * 100) || 0;
  const foodPct = Math.round((latest.breakdown.food / monthlyTotal) * 100) || 0;
  const wastePct = Math.round((latest.breakdown.waste / monthlyTotal) * 100) || 0;

  // Sustainability score interpretation
  const score = latest.sustainabilityScore;
  let scoreTheme = {
    badge: 'text-emerald-800 bg-emerald-50 border-emerald-200/80',
    bar: 'bg-emerald-600',
    label: '1.5°C Climate Target Met',
  };
  if (score < 50) {
    scoreTheme = {
      badge: 'text-rose-800 bg-rose-50 border-rose-200/80',
      bar: 'bg-rose-500',
      label: 'High Carbon Intensity',
    };
  } else if (score < 75) {
    scoreTheme = {
      badge: 'text-amber-800 bg-amber-50 border-amber-200/80',
      bar: 'bg-amber-500',
      label: 'Moderate Carbon Level',
    };
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 pb-16"
    >
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
              Environmental Diagnostics
            </h1>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100/90 px-2 py-0.5 rounded-md border border-slate-200/60 hidden sm:inline-block">
              {latest.dateFormatted}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Personal greenhouse emissions evaluated against UK DEFRA & US EPA coefficients.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('simulator')}
            className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all shadow-2xs"
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-600" />
            <span>What-If Simulator</span>
          </button>
          <button
            onClick={() => onNavigate('ai-insights')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs hover:shadow transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Insights</span>
          </button>
          <button
            onClick={() => onNavigate('calculator')}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-xs transition-all"
          >
            <span>Recalculate</span>
          </button>
        </div>
      </div>

      {/* STATISTIC CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Monthly Total */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Monthly Footprint</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 font-heading tracking-tight">
              {monthlyTotal.toFixed(1)}
            </span>
            <span className="text-xs font-semibold text-slate-500">kg CO₂e</span>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-slate-100">
            {pctChange !== null ? (
              <span className={`inline-flex items-center gap-1 font-bold ${isReduction ? 'text-emerald-700' : 'text-rose-700'}`}>
                {isReduction ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                {Math.abs(pctChange)}% vs last log
              </span>
            ) : (
              <span className="text-slate-500 font-medium">Initial Baseline</span>
            )}
            <span className="text-slate-500 text-[11px]">~{(monthlyTotal * 12 / 1000).toFixed(1)} t/year</span>
          </div>
        </div>

        {/* Card 2: Daily Rate */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Daily Average Impact</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <BarChart3 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 font-heading tracking-tight">
              {dailyTotal.toFixed(1)}
            </span>
            <span className="text-xs font-semibold text-slate-500">kg CO₂e/day</span>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-slate-100 text-slate-500">
            <span>Weekly run rate:</span>
            <span className="font-bold text-slate-800">{weeklyTotal.toFixed(1)} kg/wk</span>
          </div>
        </div>

        {/* Card 3: Largest Emission Category */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Primary Emission Driver</span>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
              {latest.largestPercentage}% share
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-slate-900 font-heading tracking-tight">
              {latest.largestCategory}
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-slate-100 text-slate-500">
            <span>Subtotal:</span>
            <span className="font-bold text-slate-800">
              {latest.breakdown[latest.largestCategory.toLowerCase() as keyof typeof latest.breakdown].toFixed(1)} kg
            </span>
          </div>
        </div>

        {/* Card 4: Sustainability Score */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Sustainability Rating</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${scoreTheme.badge}`}>
              {scoreTheme.label}
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-emerald-700 font-heading tracking-tight">
              {score}
            </span>
            <span className="text-xs font-bold text-slate-500">/ 100</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className={`${scoreTheme.bar} h-2 rounded-full transition-all duration-700`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORY BREAKDOWN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doughnut Chart Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Emissions Distribution</h3>
                <p className="text-[11px] text-slate-500">Percentage share per category</p>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Ratio
              </span>
            </div>
            <CategoryDoughnutChart breakdown={latest.breakdown} height={220} />
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span className="text-slate-700 font-medium">Transport ({transportPct}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-600" />
              <span className="text-slate-700 font-medium">Electricity ({electricityPct}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-600" />
              <span className="text-slate-700 font-medium">Food ({foodPct}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-violet-600" />
              <span className="text-slate-700 font-medium">Waste ({wastePct}%)</span>
            </div>
          </div>
        </div>

        {/* Detailed Category Bars Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Activity Breakdown</h3>
                <p className="text-[11px] text-slate-500">Absolute monthly values in kg CO₂ equivalent</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span>Target:</span>
                <span className="font-bold text-emerald-700">≤ 200 kg/mo</span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Transportation */}
              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-slate-900">Transportation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">
                      {latest.breakdown.transportation.toFixed(1)} kg
                    </span>
                    <span className="text-slate-500">({transportPct}%)</span>
                  </div>
                </div>
                <div className="w-full bg-slate-200/70 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-700"
                    style={{ width: `${transportPct}%` }}
                  />
                </div>
              </div>

              {/* Electricity */}
              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-slate-900">Electricity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">
                      {latest.breakdown.electricity.toFixed(1)} kg
                    </span>
                    <span className="text-slate-500">({electricityPct}%)</span>
                  </div>
                </div>
                <div className="w-full bg-slate-200/70 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-600 h-2 rounded-full transition-all duration-700"
                    style={{ width: `${electricityPct}%` }}
                  />
                </div>
              </div>

              {/* Food */}
              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-cyan-600" />
                    <span className="font-bold text-slate-900">Food & Diet</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">
                      {latest.breakdown.food.toFixed(1)} kg
                    </span>
                    <span className="text-slate-500">({foodPct}%)</span>
                  </div>
                </div>
                <div className="w-full bg-slate-200/70 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-cyan-600 h-2 rounded-full transition-all duration-700"
                    style={{ width: `${foodPct}%` }}
                  />
                </div>
              </div>

              {/* Waste */}
              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-violet-600" />
                    <span className="font-bold text-slate-900">Waste & Packaging</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">
                      {latest.breakdown.waste.toFixed(1)} kg
                    </span>
                    <span className="text-slate-500">({wastePct}%)</span>
                  </div>
                </div>
                <div className="w-full bg-slate-200/70 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-violet-600 h-2 rounded-full transition-all duration-700"
                    style={{ width: `${wastePct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              Primary target: cut {latest.largestCategory} emissions first for maximum reduction leverage.
            </span>
            <button
              onClick={() => onNavigate('ai-insights')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              <span>Explain with Gemini AI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* TREND & MULTI-PERIOD CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Historical Line Trend */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Historical Trend</h3>
              <p className="text-[11px] text-slate-500">Emissions trajectory across saved records</p>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {records.length} logs
            </span>
          </div>
          <HistoricalTrendChart records={records} height={250} />
        </div>

        {/* Stacked Category Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Composition</h3>
              <p className="text-[11px] text-slate-500">Category mix over last checkpoints</p>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Stacked
            </span>
          </div>
          <WeeklyBarChart records={records} height={250} />
        </div>
      </div>

      {/* DEMO DATA CONTROLS & FOOTNOTE */}
      <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-slate-500 shrink-0" />
          <span>
            Values are educational approximations. Demonstrates algorithmic emission modeling.
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 font-semibold">
          <button
            onClick={onClearDemoData}
            className="hover:text-rose-600 transition-colors"
          >
            Clear Records
          </button>
          <span className="text-slate-300">·</span>
          <button
            onClick={onRestoreDemoData}
            className="text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            Reset Sample Dataset
          </button>
        </div>
      </div>
    </motion.div>
  );
};
