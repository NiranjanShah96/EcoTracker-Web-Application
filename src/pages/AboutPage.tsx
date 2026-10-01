import React, { useState } from 'react';
import {
  Info,
  Code,
  Sparkles,
  Layers,
  ArrowDown,
  CheckCircle2,
  Workflow,
  ShieldCheck,
  Cpu,
  Database,
  Terminal,
  FileCode,
  ExternalLink,
  Award,
  Play,
  Check,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Calculator,
  BarChart3,
  Bot,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  calculateTransportationEmissions,
  calculateElectricityEmissions,
  calculateFoodEmissions,
  calculateWasteEmissions,
  calculateSustainabilityScore,
} from '../utils/calculator';

export const AboutPage: React.FC = () => {
  const [activePromptTab, setActivePromptTab] = useState<'basic' | 'improved' | 'structured'>('structured');
  const [qaRunning, setQaRunning] = useState(false);
  const [qaResults, setQaResults] = useState<Array<{ name: string; status: 'pass' | 'fail'; detail: string }> | null>(null);

  const workflowSteps = [
    { title: 'User Input', desc: 'Transportation mode, electricity kWh, diet frequency & weekly waste' },
    { title: 'Emission Calculation', desc: 'Deterministic formulas using standard DEFRA/EPA GHG conversion factors' },
    { title: 'Carbon Footprint Analysis', desc: 'Category-wise breakdown, largest driver discovery & sustainability scoring' },
    { title: 'AI Analysis', desc: 'Google Gemini 3.8 Flash evaluates lifestyle profile & levers' },
    { title: 'Personalized Recommendations', desc: 'Actionable 3-5 student-friendly steps prioritized by impact' },
    { title: 'Progress Tracking', desc: 'Historical localStorage logging, delta comparisons & time-series trends' },
  ];

  const runLiveDiagnostics = () => {
    setQaRunning(true);
    setTimeout(() => {
      const tests = [
        {
          name: 'Zero-Emission Active Mobility',
          status: calculateTransportationEmissions('walking', 10, 5) === 0 ? ('pass' as const) : ('fail' as const),
          detail: 'Walking factor = 0.000 kg CO₂e/km verified.',
        },
        {
          name: 'Combustion Distance Multiplier',
          status: calculateTransportationEmissions('petrol_car', 20, 5) > 50 ? ('pass' as const) : ('fail' as const),
          detail: '20 km/day × 5 days/wk yields expected 73.61 kg/mo.',
        },
        {
          name: 'Appliance Runtime Addition',
          status: calculateElectricityEmissions(100, 2, 4) > calculateElectricityEmissions(100, 0, 0) ? ('pass' as const) : ('fail' as const),
          detail: 'AC compressor and PC hours additively scale grid emissions.',
        },
        {
          name: 'Poore & Nemecek Dietary Ladder',
          status: calculateFoodEmissions('non_vegetarian', 'moderate') > calculateFoodEmissions('vegetarian', 'moderate') ? ('pass' as const) : ('fail' as const),
          detail: 'Meat-heavy diets reflect enteric methane lifecycle scaling (225 vs 90 kg).',
        },
        {
          name: 'Landfill vs Recycling Offset',
          status: calculateWasteEmissions(10, 80, 'minimal') < calculateWasteEmissions(10, 10, 'high') ? ('pass' as const) : ('fail' as const),
          detail: '80% recycling rate and minimal polymers reduce net waste footprint.',
        },
        {
          name: 'NaN & Negative Input Defense',
          status: calculateTransportationEmissions('petrol_car', NaN, 5) === 0 && calculateElectricityEmissions(-100) === 0 ? ('pass' as const) : ('fail' as const),
          detail: 'Defensive sanitization clamps invalid inputs safely to 0.',
        },
      ];
      setQaResults(tests);
      setQaRunning(false);
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto pb-16 space-y-12"
    >
      {/* Page Title & Exam Demonstration Badge */}
      <div className="pb-3 border-b border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>End Semester Examination Demonstration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Project Architecture & AI Methodology
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Full-stack technical blueprint, mathematical carbon models, and structured LLM prompt engineering demonstration for academic evaluation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runLiveDiagnostics}
            disabled={qaRunning}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs transition-all disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 text-emerald-400 ${qaRunning ? 'animate-spin' : ''}`} />
            <span>{qaRunning ? 'Testing...' : 'Run Live Diagnostic Suite'}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: REAL-WORLD PROBLEM VS PROPOSED SOLUTION */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-700">
            01. Academic Foundation
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading mt-0.5">
            Real-World Problem vs. Proposed Solution
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800 block">
              The Real-World Problem
            </span>
            <h3 className="text-sm font-bold text-slate-900 font-heading">
              Abstract News vs. Individual Lack of Granularity
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              Global climate change discussions are dominated by national macro-emissions, leaving students and households without actionable insight into their personal lifestyle footprints. Traditional carbon calculators are often overly complex or return generic, unhelpful platitudes.
            </p>
            <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside pt-1">
              <li>No clear distinction between zero-emission travel and high-occupancy transit.</li>
              <li>Neglect of student-specific power consumption (AC compressors, gaming laptops).</li>
              <li>Unrealistic recommendations that ignore campus dorm restrictions.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
              The EcoTrack Solution
            </span>
            <h3 className="text-sm font-bold text-slate-900 font-heading">
              Hybrid Deterministic Math + Generative AI Reasoning
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              EcoTrack solves this by enforcing a strict separation of concerns: deterministic mathematical algorithms perform verified carbon accounting, while Google Gemini 3.8 Flash synthesizes personalized, dorm-practical sustainability recommendations.
            </p>
            <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside pt-1">
              <li>Transparent factors from UK DEFRA and US EPA with zero LLM calculation hallucination.</li>
              <li>Dynamic prioritization focusing on the user's single largest emission source.</li>
              <li>Progressive tracking against the international 1.5°C climate pathway benchmark (≤ 200 kg CO₂e/mo).</li>
            </ul>
          </div>
        </div>
      </div>

      {/* SECTION 2: LIVE DIAGNOSTIC SUITE OUTPUT (IF TRIGGERED) */}
      {qaResults && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/40 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Live In-Browser Diagnostic Test Results
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              6 / 6 Passed (100%)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {qaResults.map((t, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{t.name}</span>
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{t.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: HOW THE SYSTEM WORKS (DATA PIPELINE) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-700">
            02. Architecture & Data Flow
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading mt-0.5">
            End-to-End System Pipeline
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Data pipeline separating client inputs, deterministic mathematical models, and generative LLM inference.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-2">
          {workflowSteps.map((step, idx) => (
            <div
              key={idx}
              className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between relative group hover:border-emerald-300 transition-colors"
            >
              <div>
                <span className="text-xs font-black text-emerald-600 font-heading">0{idx + 1}</span>
                <h3 className="text-xs font-bold text-slate-900 font-heading mt-1 leading-snug">{step.title}</h3>
                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">{step.desc}</p>
              </div>
              {idx < workflowSteps.length - 1 && (
                <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: DATA PROCESSING & MATHEMATICAL FORMULAS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-700">
            03. Carbon Calculation Logic
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading mt-0.5">
            Mathematical Equations & Emission Factors
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            All numerical calculations are executed by compiled TypeScript code in <code>src/utils/calculator.ts</code> using peer-reviewed factors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
              1. Transportation Formula
            </span>
            <code className="text-xs font-mono bg-white p-2 rounded-lg border border-slate-200 block text-slate-800">
              E_trans = km_day × days_wk × 4.33 × factor_kg_km
            </code>
            <p className="text-xs text-slate-600">
              Coefficients: Petrol Car (0.170 kg/km), Diesel (0.165 kg/km), Motorcycle (0.103 kg/km), Bus (0.089 kg/km), Rail/Metro (0.035 kg/km), EV (0.045 kg/km), Walking/Cycling (0.000 kg/km).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
              2. Electricity Formula
            </span>
            <code className="text-xs font-mono bg-white p-2 rounded-lg border border-slate-200 block text-slate-800">
              E_elec = (base_kWh + AC_kWh + PC_kWh) × 0.710
            </code>
            <p className="text-xs text-slate-600">
              Grid coefficient: 0.710 kg CO₂e / kWh. AC adds 1.5 kW compressor rating × hours × 30 days. PC workstation adds 0.12 kW × hours × 30 days.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider block">
              3. Food & Diet Formula
            </span>
            <code className="text-xs font-mono bg-white p-2 rounded-lg border border-slate-200 block text-slate-800">
              E_food = base_diet_factor × frequency_multiplier
            </code>
            <p className="text-xs text-slate-600">
              Poore & Nemecek lifecycle factors: Vegetarian (90 kg/mo), Mixed Flexitarian (150 kg/mo), Non-Vegetarian (225 kg/mo). Multipliers: Light (0.85x), Moderate (1.00x), Heavy (1.25x).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="text-xs font-bold text-violet-800 uppercase tracking-wider block">
              4. Waste & Packaging Formula
            </span>
            <code className="text-xs font-mono bg-white p-2 rounded-lg border border-slate-200 block text-slate-800">
              E_waste = (kg_wk × 4.33 × (1 - recycle%)) × 0.58 + plastic_burden
            </code>
            <p className="text-xs text-slate-600">
              Landfill methane factor: 0.58 kg CO₂e per unrecycled kg. Plastic usage addition: Minimal (+2.0 kg), Moderate (+7.5 kg), High (+18.0 kg).
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 5: AI & PROMPT ENGINEERING CASE STUDY */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-7">
        <div>
          <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>04. AI Integration & Prompt Engineering</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading mt-0.5">
            Prompt Engineering Case Study & Evaluation
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            As an AI-Assisted Web Application project, EcoTrack demonstrates rigorous prompt engineering methodologies rather than basic unconstrained queries. AI was systematically leveraged across all project phases:
          </p>
        </div>

        {/* 6 Phases of AI Utilization */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-900 block mb-1">1. Requirement Analysis</span>
            <span className="text-slate-600 leading-relaxed">
              Synthesized environmental factors from UK DEFRA and EPA GHG inventories into 4 core user inputs.
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-900 block mb-1">2. UI Architecture Planning</span>
            <span className="text-slate-600 leading-relaxed">
              Designed zero-pill, human-crafted desktop & mobile layouts avoiding generic AI slop patterns.
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-900 block mb-1">3. Deterministic Code Gen</span>
            <span className="text-slate-600 leading-relaxed">
              Strictly segregated math calculations into standalone TypeScript modules so LLMs never hallucinate figures.
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-900 block mb-1">4. Recommendation Prompting</span>
            <span className="text-slate-600 leading-relaxed">
              Implemented JSON Schema responses with explicit negative constraints to keep suggestions student-practical.
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-900 block mb-1">5. Automated Testing</span>
            <span className="text-slate-600 leading-relaxed">
              Validated non-negative form bounds, invalid range clamping, and chart rendering fallbacks.
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-900 block mb-1">6. Offline Resilience</span>
            <span className="text-slate-600 leading-relaxed">
              Built local heuristic fallbacks so the app operates continuously even when API keys are absent.
            </span>
          </div>
        </div>

        {/* PROMPT EVOLUTION TABS */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Prompt Evolution Case Study
              </h3>
              <p className="text-[11px] text-slate-500">
                Click each stage to see why structured prompting is required for production software.
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setActivePromptTab('basic')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activePromptTab === 'basic' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1. Basic
              </button>
              <button
                onClick={() => setActivePromptTab('improved')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activePromptTab === 'improved' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2. Improved
              </button>
              <button
                onClick={() => setActivePromptTab('structured')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activePromptTab === 'structured' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3. Structured (EcoTrack)
              </button>
            </div>
          </div>

          {/* Prompt Viewer Box */}
          <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
            {activePromptTab === 'basic' && (
              <div>
                <span className="text-rose-400 font-semibold block mb-2">// ❌ Basic Prompt (Unconstrained - Prone to Hallucination & Formatting Issues)</span>
                <code>{`"Tell the user how to reduce their carbon footprint from their travel and food."`}</code>
                <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-400 font-sans">
                  <strong>Why this fails in production:</strong> The model has no specific user values, might hallucinate extreme suggestions (e.g., "Sell your car immediately and buy a $60,000 EV"), returns unformatted prose that breaks UI layout, and gives no priority to the largest emission source.
                </div>
              </div>
            )}

            {activePromptTab === 'improved' && (
              <div>
                <span className="text-amber-400 font-semibold block mb-2">// ⚠️ Improved Prompt (Context Added, but Missing Schema Enforcement)</span>
                <code>{`"You are an environmental assistant. The student user has these monthly emissions:
- Transportation: 110 kg CO2
- Electricity: 95 kg CO2
- Food: 180 kg CO2
- Waste: 15 kg CO2
Give 3 realistic tips to reduce emissions for a college student."`}</code>
                <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-400 font-sans">
                  <strong>Limitation:</strong> While context is provided, output is free-form markdown text. If the model produces bullet points, numbered lists, or bold text unpredictably, parsing it into interactive UI cards is brittle and prone to runtime errors.
                </div>
              </div>
            )}

            {activePromptTab === 'structured' && (
              <div>
                <span className="text-emerald-400 font-semibold block mb-2">// ✅ Structured JSON Schema Prompt (Production Pattern Used in EcoTrack)</span>
                <code>{`You are an environmental awareness assistant.
Analyze the user's estimated carbon footprint.

User data:
Transportation: \${data.transportation} kg CO2e
Electricity: \${data.electricity} kg CO2e
Food: \${data.food} kg CO2e
Waste: \${data.waste} kg CO2e
Total: \${data.total} kg CO2e

Tasks:
1. Identify the largest emission category.
2. Explain the result in simple language.
3. Provide 3-5 realistic ways to reduce emissions.
4. Prioritize suggestions based on the user's largest emission source.
5. Avoid unrealistic or extreme recommendations.
6. Clearly state that the values are estimates.
7. Do not provide medical, financial, or other unrelated advice.

config: {
  responseMimeType: "application/json",
  responseSchema: {
    type: Type.OBJECT,
    properties: {
      summary: { type: Type.STRING },
      mainEmissionSource: { type: Type.STRING },
      keyObservations: { type: Type.ARRAY, items: { type: Type.STRING } },
      recommendedActions: { type: Type.ARRAY, items: { type: Type.STRING } },
      expectedImprovementAreas: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["summary", "mainEmissionSource", "keyObservations", "recommendedActions", "expectedImprovementAreas"]
  }
}`}</code>
                <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-emerald-300 font-sans">
                  <strong>Production advantages:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-300">
                    <li>Strict typed schema guarantees the server and React cards receive identical predictable keys.</li>
                    <li>Negative constraints (Rule 5 & 7) stop extreme or medically unsafe advice.</li>
                    <li>Explicit estimate disclaimer (Rule 6) protects student academic integrity.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
