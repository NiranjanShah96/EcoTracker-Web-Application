import React from 'react';
import {
  Car,
  Zap,
  Utensils,
  Trash2,
  ArrowRight,
  Sparkles,
  BarChart3,
  TrendingDown,
  Globe2,
  CheckCircle2,
  BookOpen,
  Award,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { ActivePage, FootprintRecord } from '../types';
import { motion } from 'motion/react';

interface Props {
  onNavigate: (page: ActivePage) => void;
  latestRecord?: FootprintRecord;
}

export const LandingPage: React.FC<Props> = ({ onNavigate, latestRecord }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-20 pb-16"
    >
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-6 md:pt-14 pb-12">
        {/* Subtle background ambient gradients */}
        <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-16 left-1/4 -z-10 w-80 h-80 bg-teal-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI-Assisted College Sustainability Initiative</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12] font-heading">
            Track Your <span className="bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">Carbon Footprint</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Understand your environmental impact and discover practical ways to reduce it.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => onNavigate('calculator')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-xs hover:shadow transition-all text-sm"
            >
              <span>Start Tracking</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold px-7 py-3.5 rounded-xl border border-slate-300/80 shadow-2xs transition-all text-sm"
            >
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <span>View Dashboard</span>
            </button>
          </div>

          {/* Metric Snapshot Banner */}
          <div className="mt-12 max-w-2xl mx-auto grid grid-cols-3 gap-2 sm:gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-left">
            <div className="px-3 py-2 border-r border-slate-100">
              <span className="text-[11px] text-slate-500 font-semibold block">1.5°C Target</span>
              <p className="text-lg font-black text-emerald-700 font-heading">200 kg</p>
              <span className="text-[10px] text-slate-400 font-medium">CO₂e / person / mo</span>
            </div>
            <div className="px-3 py-2 border-r border-slate-100">
              <span className="text-[11px] text-slate-500 font-semibold block">Global Average</span>
              <p className="text-lg font-black text-slate-800 font-heading">420 kg</p>
              <span className="text-[10px] text-slate-400 font-medium">CO₂e / person / mo</span>
            </div>
            <div className="px-3 py-2">
              <span className="text-[11px] text-slate-500 font-semibold block">Your Latest</span>
              <p className="text-lg font-black text-slate-900 font-heading">
                {latestRecord ? `${latestRecord.breakdown.total.toFixed(0)} kg` : 'Untracked'}
              </p>
              <span className="text-[10px] text-emerald-700 font-bold">
                {latestRecord ? `Score: ${latestRecord.sustainabilityScore}/100` : 'Calculate now'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FOUR CORE PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-700 mb-1 block">
            Comprehensive Analysis
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading tracking-tight">
            Four Core Pillars of Personal Emissions
          </h2>
          <p className="mt-2 text-slate-600 text-xs sm:text-sm">
            We evaluate daily routines against verifiable emissions factors to uncover where your carbon footprint originates.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Transportation */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all flex flex-col justify-between group">
            <div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Car className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-heading mb-1">Transportation</h3>
              <p className="text-[11px] text-slate-500 mb-2.5">Vehicle commute & transit modes</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Calculates combustion emissions from petrol/diesel vehicles and transit against zero-emission walking and cycling.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>0.0 - 0.170 kg/km</span>
              <span className="font-bold text-emerald-700">High Impact</span>
            </div>
          </div>

          {/* Card 2: Electricity */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-amber-300 hover:shadow-sm transition-all flex flex-col justify-between group">
            <div>
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-heading mb-1">Electricity</h3>
              <p className="text-[11px] text-slate-500 mb-2.5">Residential kWh & appliances</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Evaluates consumption from lighting, computers, and AC compressors using average grid generation intensity.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>0.710 kg/kWh</span>
              <span className="font-bold text-amber-700">Controllable</span>
            </div>
          </div>

          {/* Card 3: Food */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-cyan-300 hover:shadow-sm transition-all flex flex-col justify-between group">
            <div>
              <div className="w-11 h-11 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Utensils className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-heading mb-1">Food & Diet</h3>
              <p className="text-[11px] text-slate-500 mb-2.5">Agricultural lifecycle impact</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Accounts for agricultural land clearing, livestock enteric methane, and transport for plant-based vs meat diets.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>90 - 225 kg/mo</span>
              <span className="font-bold text-cyan-700">Daily Choice</span>
            </div>
          </div>

          {/* Card 4: Waste */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-violet-300 hover:shadow-sm transition-all flex flex-col justify-between group">
            <div>
              <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-heading mb-1">Waste & Plastics</h3>
              <p className="text-[11px] text-slate-500 mb-2.5">Landfill methane & packaging</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Calculates municipal landfill decomposition, single-use plastic burdens, and recycling offset credits.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>0.58 kg/kg waste</span>
              <span className="font-bold text-violet-700">Divertible</span>
            </div>
          </div>
        </div>
      </section>

      {/* WHY TRACK CARBON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 overflow-hidden relative">
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-bold tracking-wider text-emerald-400 uppercase">
              Student Climate Leadership
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mt-2 tracking-tight font-heading">
              Why Track Your Carbon Footprint?
            </h2>
            <p className="mt-3 text-slate-300 text-xs sm:text-sm leading-relaxed">
              You cannot reduce what you do not measure. Most college students are surprised to discover
              that small daily habits can inadvertently produce hundreds of kilograms of unnecessary greenhouse emissions every semester.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-white">Quantifiable Personal Impact</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Convert abstract climate news into manageable kilogram benchmarks.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-white">Budget & Energy Savings</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Cutting electricity and solo vehicle fuel directly saves student budgets.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-white">Targeted Gemini AI Advice</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Receive realistic suggestions specifically mapped to your single largest emission source.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-white">Progressive Tracking</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Watch your footprint decrease week-over-week as you adopt greener campus habits.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-700 mb-1 block">
            Streamlined Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading tracking-tight">
            How EcoTrack Works
          </h2>
          <p className="mt-2 text-slate-600 text-xs sm:text-sm">
            Four simple steps from entering your basic daily habits to receiving AI-powered climate action advice.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <span className="text-2xl font-black text-emerald-600/40 font-heading">01</span>
            <h4 className="text-sm font-bold text-slate-900 mt-2 font-heading">Enter Daily Activities</h4>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Fill in your travel distance, monthly electricity consumption, diet style, and weekly trash habits.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <span className="text-2xl font-black text-emerald-600/40 font-heading">02</span>
            <h4 className="text-sm font-bold text-slate-900 mt-2 font-heading">Deterministic Calculation</h4>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Our calculation engine applies transparent DEFRA/EPA emission factors to compute accurate CO₂e estimates.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <span className="text-2xl font-black text-emerald-600/40 font-heading">03</span>
            <h4 className="text-sm font-bold text-slate-900 mt-2 font-heading">Gemini AI Synthesis</h4>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Google Gemini analyzes your breakdown and returns structured, student-realistic ways to reduce impact.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <span className="text-2xl font-black text-emerald-600/40 font-heading">04</span>
            <h4 className="text-sm font-bold text-slate-900 mt-2 font-heading">Track & Compare</h4>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Store results in localStorage, view historical reduction trends, and compare multiple time periods.
            </p>
          </div>
        </div>
      </section>

      {/* SUSTAINABILITY TIPS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-50/70 border border-emerald-100/90 rounded-3xl p-6 sm:p-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-emerald-800">
                Actionable Habits
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading tracking-tight mt-1">
                Practical Student Recommendations
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
                Targeted lifestyle changes that can save over 50 kg CO₂e every month without disrupting student routines.
              </p>
            </div>
            <button
              onClick={() => onNavigate('tips')}
              className="inline-flex items-center gap-1.5 text-emerald-800 hover:text-emerald-950 font-bold text-xs sm:text-sm"
            >
              <span>Explore All 15+ Sustainability Tips</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Transportation</span>
                <h4 className="text-sm font-bold text-slate-900 mt-1 font-heading">Cycle for Trips &lt;3 km</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Cold combustion engines have disproportionate emissions. Active walking or cycling cuts local pollution completely.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-emerald-800">
                Est. Savings: ~22 kg CO₂e / mo
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Electricity</span>
                <h4 className="text-sm font-bold text-slate-900 mt-1 font-heading">Set AC to 24°C (75°F)</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Each degree higher on the thermostat reduces compressor load by 6-8%, saving power plant grid burn.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-amber-800">
                Est. Savings: ~32 kg CO₂e / mo
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-cyan-700 uppercase tracking-wider">Food</span>
                <h4 className="text-sm font-bold text-slate-900 mt-1 font-heading">Adopt "Meatless Mondays"</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Substituting plant protein in cafeteria meals two days a week drastically cuts agricultural methane and feed transit.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-cyan-800">
                Est. Savings: ~45 kg CO₂e / mo
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-3xl mx-auto text-center px-4">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading tracking-tight">
          Ready to Calculate Your Carbon Footprint?
        </h3>
        <p className="mt-2 text-slate-600 text-xs sm:text-sm max-w-lg mx-auto">
          It takes under 2 minutes. Enter your daily estimates and receive immediate visual breakdowns and AI-generated recommendations.
        </p>
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => onNavigate('calculator')}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-xs hover:shadow transition-all text-sm"
          >
            <span>Launch Carbon Calculator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </motion.div>
  );
};
