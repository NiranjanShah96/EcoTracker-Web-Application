import React, { useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Calculator,
  BarChart3,
  Bot,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  ArrowRight,
  BookOpen,
  Award,
  Globe2,
  Code2,
  Sliders,
} from 'lucide-react';
import { ActivePage } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: ActivePage) => void;
}

export const EsePresentationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      id: 'problem',
      tag: '01. Real-World Problem',
      title: 'The Carbon Visibility & Action Gap',
      icon: <Globe2 className="w-5 h-5 text-emerald-600" />,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            While climate change is universally recognized, the average student or household produces between <strong>380 kg and 850 kg CO₂e per month</strong> without knowing which daily activities contribute the most.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-slate-900 block mb-1">Key Challenges:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs">
                <li>Abstract macro statistics fail to trigger personal habit changes.</li>
                <li>Carbon accounting equations feel intimidating to students.</li>
                <li>Lack of personalized, realistic reduction advice for dorm life.</li>
              </ul>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
              <span className="font-bold text-emerald-900 block mb-1">Academic Target:</span>
              <p className="text-emerald-800 text-xs leading-relaxed">
                Empower university students with quantifiable personal benchmarks to achieve the <strong>1.5°C climate pathway target of ≤ 200 kg CO₂e/month</strong>.
              </p>
            </div>
          </div>
        </div>
      ),
      jumpTo: 'home' as ActivePage,
      jumpLabel: 'Explore Landing Overview',
    },
    {
      id: 'solution',
      tag: '02. Proposed Solution',
      title: 'EcoTrack: AI-Assisted Diagnostics & Tracking',
      icon: <Layers className="w-5 h-5 text-emerald-600" />,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            <strong>EcoTrack</strong> is an AI-assisted web application combining <strong>deterministic mathematical modeling</strong> with <strong>generative intelligence (Google Gemini 3.8 Flash)</strong>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-slate-900 block text-xs mb-1">1. Exact Calculations</span>
              <p className="text-slate-600 text-xs">
                Built-in algorithms apply standard DEFRA/EPA GHG conversion factors with zero LLM hallucination.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-slate-900 block text-xs mb-1">2. Gemini AI Reasoning</span>
              <p className="text-slate-600 text-xs">
                Evaluates user data to prioritize top reduction levers and generate dorm-practical habit changes.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-slate-900 block text-xs mb-1">3. Progress Monitoring</span>
              <p className="text-slate-600 text-xs">
                Persistent time-series tracking via HTML5 localStorage and multi-period comparative analytics.
              </p>
            </div>
          </div>
        </div>
      ),
      jumpTo: 'dashboard' as ActivePage,
      jumpLabel: 'View Analytics Dashboard',
    },
    {
      id: 'math',
      tag: '03. Carbon Calculation Logic',
      title: 'Deterministic Formulas & Emission Coefficients',
      icon: <Calculator className="w-5 h-5 text-emerald-600" />,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            Calculations are segregated into <code>src/utils/calculator.ts</code> using peer-reviewed factors:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 font-mono">
              <span className="font-bold text-emerald-800 font-sans block mb-1">Transportation:</span>
              <code>E_trans = km/day × days/wk × 4.33 × factor</code>
              <p className="text-slate-500 font-sans mt-1">
                Petrol car: 0.170 kg/km | Bus: 0.089 kg/km | Walk/Cycle: 0.000 kg/km
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 font-mono">
              <span className="font-bold text-amber-800 font-sans block mb-1">Electricity:</span>
              <code>E_elec = (base_kWh + AC_kWh + PC_kWh) × 0.710</code>
              <p className="text-slate-500 font-sans mt-1">
                National average grid factor: 0.710 kg CO₂e / kWh
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 font-mono">
              <span className="font-bold text-cyan-800 font-sans block mb-1">Food & Diet:</span>
              <code>E_food = base_diet_factor × frequency_multiplier</code>
              <p className="text-slate-500 font-sans mt-1">
                Veg: 90 kg/mo | Mixed: 150 kg/mo | Meat: 225 kg/mo
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 font-mono">
              <span className="font-bold text-violet-800 font-sans block mb-1">Waste & Plastics:</span>
              <code>E_waste = (unrecycled_waste × 0.58) + plastic_burden</code>
              <p className="text-slate-500 font-sans mt-1">
                Landfill anaerobic decomposition methane: 0.58 kg CO₂e/kg
              </p>
            </div>
          </div>
        </div>
      ),
      jumpTo: 'calculator' as ActivePage,
      jumpLabel: 'Test Live Calculator',
    },
    {
      id: 'what-if',
      tag: '04. What-If Scenario Modeling',
      title: 'Hypothetical Lifestyle Simulation & Delta Charts',
      icon: <Sliders className="w-5 h-5 text-emerald-600" />,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            The <strong>What-If Simulator</strong> allows users to test changing individual behaviors (e.g. reducing vehicle travel, turning down AC, switching diet, increasing recycling) before adopting them in real life.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-slate-900 block mb-1">Deterministic Outputs:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Baseline monthly footprint (kg CO₂e)</li>
                <li>New simulated footprint (kg CO₂e)</li>
                <li>Net carbon reduction & % reduction</li>
                <li>Side-by-side grouped comparison bar chart</li>
              </ul>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
              <span className="font-bold text-emerald-900 block mb-1">Strict AI Role Separation:</span>
              <p className="text-emerald-800 leading-relaxed">
                As required by scientific integrity, AI is <strong>never used to calculate the numbers</strong>. Google Gemini is prompted solely to explain the qualitative significance and provide 3 actionable student implementation tips.
              </p>
            </div>
          </div>
        </div>
      ),
      jumpTo: 'simulator' as ActivePage,
      jumpLabel: 'Launch What-If Simulator',
    },
    {
      id: 'ai-prompt',
      tag: '05. AI Integration & Prompt Engineering',
      title: 'Server-Side Architecture & Strict JSON Schema',
      icon: <Sparkles className="w-5 h-5 text-emerald-600" />,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            AI interaction is mediated through an Express backend (<code>server.ts</code>) using the <code>@google/genai</code> SDK with client API key isolation.
          </p>
          <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto">
            <span className="text-emerald-400 font-bold block mb-1">// Structured JSON Schema Prompt Configuration</span>
            {`responseMimeType: "application/json",
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
}`}
          </div>
          <p className="text-xs text-slate-600">
            <strong>Prompt Engineering Strategy:</strong> Employs explicit negative constraints (no medical/financial advice, no extreme suggestions like buying an expensive EV) and strict output formatting so results directly bind to UI components without markdown parsing bugs.
          </p>
        </div>
      ),
      jumpTo: 'ai-insights' as ActivePage,
      jumpLabel: 'Inspect AI Recommendations',
    },
    {
      id: 'visualization',
      tag: '06. Data Visualization & Analytics',
      title: 'Chart.js Visual Diagnostics',
      icon: <BarChart3 className="w-5 h-5 text-emerald-600" />,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            Visual analytics are powered by <strong>Chart.js 4</strong> with responsive canvas rendering:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-slate-900 block text-xs mb-1">Doughnut Chart</span>
              <p className="text-slate-600 text-xs">
                Displays percentage contribution per category with a central monthly total readout.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-slate-900 block text-xs mb-1">Progression Line</span>
              <p className="text-slate-600 text-xs">
                Monitors emission trajectories over time against the dashed 200 kg 1.5°C threshold.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-slate-900 block text-xs mb-1">Comparative Bars</span>
              <p className="text-slate-600 text-xs">
                Facilitates delta comparisons between any two logged historical assessments.
              </p>
            </div>
          </div>
        </div>
      ),
      jumpTo: 'history' as ActivePage,
      jumpLabel: 'Open Comparison & Trends',
    },
    {
      id: 'qa',
      tag: '07. Quality Assurance & Testing',
      title: 'Robustness, Edge-Cases & Offline Resilience',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            The codebase features automated QA test cases and defensive programming:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-slate-900 block mb-1">Input Clamping & NaN Defense</span>
              <p className="text-slate-600 leading-relaxed">
                All math helper functions sanitize inputs against <code>NaN</code>, negative distances, and out-of-range bounds.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-slate-900 block mb-1">Graceful Heuristic Fallback</span>
              <p className="text-slate-600 leading-relaxed">
                If the Gemini API key is missing or encounters demand spikes, the app seamlessly provides benchmark insights so examiners can test uninterrupted.
              </p>
            </div>
          </div>
        </div>
      ),
      jumpTo: 'about' as ActivePage,
      jumpLabel: 'View Full Architecture & Tests',
    },
  ];

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 font-heading block leading-none">
                End Semester Examination Demonstration Guide
              </span>
              <span className="text-[11px] text-slate-500">
                EcoTrack · AI-Assisted Web Application
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Content Area */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/60">
              {slide.tag}
            </span>
            <span className="text-xs font-bold text-slate-400">
              Slide {currentSlide + 1} of {slides.length}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading tracking-tight">
            {slide.title}
          </h3>

          <div className="pt-2">{slide.content}</div>
        </div>

        {/* Modal Bottom Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
              disabled={currentSlide === 0}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1))}
              disabled={currentSlide === slides.length - 1}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 ml-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentSlide === i ? 'bg-emerald-600 w-5' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                onNavigate(slide.jumpTo);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-3.5 py-2 rounded-xl transition-all"
            >
              <span>{slide.jumpLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
