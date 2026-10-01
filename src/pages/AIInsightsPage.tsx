import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RotateCcw,
  AlertCircle,
  Lightbulb,
  CheckCircle,
  ArrowUpRight,
  TrendingDown,
  Layers,
  ShieldCheck,
  Bot,
  HelpCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { FootprintRecord, AIInsightsData, ActivePage } from '../types';
import { fetchAIInsights } from '../services/api';
import { motion } from 'motion/react';

interface Props {
  currentRecord: FootprintRecord | null;
  onNavigate: (page: ActivePage) => void;
}

export const AIInsightsPage: React.FC<Props> = ({ currentRecord, onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<AIInsightsData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [apiSource, setApiSource] = useState<string>('gemini-3.8-flash');
  const [notice, setNotice] = useState<string | null>(null);

  const [analyzedRecordId, setAnalyzedRecordId] = useState<string | null>(null);

  const loadInsights = async () => {
    if (!currentRecord) return;
    setLoading(true);
    setErrorMsg(null);
    setNotice(null);
    setAnalyzedRecordId(currentRecord.id);

    try {
      const res = await fetchAIInsights(currentRecord.breakdown);
      if (res.success && res.insights) {
        setInsights(res.insights);
        setApiSource(res.source || 'gemini-3.8-flash');
        if (res.note) {
          setNotice(res.note);
        }
      } else {
        throw new Error('Could not parse AI response');
      }
    } catch (err: any) {
      setErrorMsg('Failed to generate insights. Showing default recommendations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentRecord && currentRecord.id !== analyzedRecordId) {
      loadInsights();
    }
  }, [currentRecord, analyzedRecordId]);

  if (!currentRecord) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-heading">
          No Calculation to Analyze
        </h2>
        <p className="mt-2 text-slate-600 text-sm max-w-sm mx-auto leading-relaxed">
          Please run the carbon calculator first so the Gemini Environmental Assistant can evaluate your emissions and provide personalized action steps.
        </p>
        <button
          onClick={() => onNavigate('calculator')}
          className="mt-6 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl shadow-xs text-xs"
        >
          <span>Open Carbon Calculator</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const { breakdown } = currentRecord;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto pb-16 space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
              AI Environmental Assistant
            </h1>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 flex items-center gap-1">
              <Bot className="w-3 h-3 text-emerald-600" />
              <span>{apiSource === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash' : 'Benchmark Engine'}</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Personalized lifestyle analysis synthesized using structured Google GenAI prompts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadInsights}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs transition-all disabled:opacity-60"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-600' : 'text-slate-500'}`} />
            <span>{loading ? 'Analyzing...' : 'Regenerate'}</span>
          </button>
          <button
            onClick={() => onNavigate('chat')}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs transition-all"
          >
            <span>Ask Follow-up</span>
          </button>
        </div>
      </div>

      {/* Input Metrics Summary Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <div>
          <span className="text-slate-400 font-medium block">Transportation</span>
          <p className="font-bold text-slate-900 mt-0.5">{breakdown.transportation.toFixed(1)} kg</p>
        </div>
        <div>
          <span className="text-slate-400 font-medium block">Electricity</span>
          <p className="font-bold text-slate-900 mt-0.5">{breakdown.electricity.toFixed(1)} kg</p>
        </div>
        <div>
          <span className="text-slate-400 font-medium block">Food & Diet</span>
          <p className="font-bold text-slate-900 mt-0.5">{breakdown.food.toFixed(1)} kg</p>
        </div>
        <div>
          <span className="text-slate-400 font-medium block">Waste & Plastics</span>
          <p className="font-bold text-slate-900 mt-0.5">{breakdown.waste.toFixed(1)} kg</p>
        </div>
        <div className="col-span-2 sm:col-span-1 border-t sm:border-t-0 sm:border-l border-slate-100 sm:pl-3 pt-2 sm:pt-0">
          <span className="text-slate-500 font-semibold block">Total Monthly</span>
          <p className="font-extrabold text-emerald-700 mt-0.5">{breakdown.total.toFixed(1)} kg CO₂e</p>
        </div>
      </div>

      {/* Notice Banner */}
      {notice && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-800 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>{notice}</span>
        </div>
      )}

      {/* Shimmer Loading State */}
      {loading && (
        <div className="space-y-6">
          <div className="h-28 bg-white border border-slate-200/60 rounded-2xl p-6 relative overflow-hidden animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-1/4 mb-3" />
            <div className="h-6 bg-slate-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-slate-200 rounded w-2/3" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-56 bg-white border border-slate-200/60 rounded-2xl p-6 animate-pulse" />
            <div className="h-56 bg-white border border-slate-200/60 rounded-2xl p-6 animate-pulse" />
          </div>
          <div className="h-48 bg-white border border-slate-200/60 rounded-2xl p-6 animate-pulse" />
        </div>
      )}

      {/* Structured AI Insights */}
      {!loading && insights && (
        <div className="space-y-6">
          {/* Executive Summary Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs relative overflow-hidden">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Executive Synthesis</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-heading mb-3">
              {insights.mainEmissionSource}
            </h2>
            <p className="text-slate-700 text-sm leading-relaxed">
              {insights.summary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Observations */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                  <Layers className="w-3.5 h-3.5 text-slate-500" />
                  <span>Key Observations</span>
                </div>
                <ul className="space-y-3">
                  {insights.keyObservations.map((obs, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                      <span>{obs}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>All values are estimates for student awareness.</span>
              </div>
            </div>

            {/* Expected Improvement Areas */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3">
                  <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Projected Reductions</span>
                </div>
                <ul className="space-y-3">
                  {insights.expectedImprovementAreas.map((area, idx) => (
                    <li key={idx} className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-950 font-medium leading-relaxed flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
                Targeting largest emission sources first yields quickest climate results.
              </div>
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Recommended Priority Actions</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">3-5 student steps</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {insights.recommendedActions.map((action, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900 leading-snug">
                      {action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footnote */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                EcoTrack AI recommendations do not provide financial or medical advice. Values are educational approximations.
              </span>
            </div>
            <button
              onClick={() => onNavigate('tips')}
              className="shrink-0 text-emerald-700 font-bold hover:underline"
            >
              Browse Tips Library →
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
