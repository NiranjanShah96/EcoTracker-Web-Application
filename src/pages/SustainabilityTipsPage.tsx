import React, { useState } from 'react';
import {
  Lightbulb,
  Sparkles,
  Car,
  Zap,
  Utensils,
  Trash2,
  Clock,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  Tag,
} from 'lucide-react';
import { FootprintRecord, ActivePage } from '../types';
import { SUSTAINABILITY_TIPS, SustainabilityTip } from '../data/sustainabilityTips';
import { motion } from 'motion/react';

interface Props {
  currentRecord: FootprintRecord | null;
  onNavigate: (page: ActivePage) => void;
}

export const SustainabilityTipsPage: React.FC<Props> = ({ currentRecord, onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Tips', icon: Lightbulb },
    { id: 'transportation', label: 'Transportation', icon: Car },
    { id: 'energy', label: 'Energy & Power', icon: Zap },
    { id: 'food', label: 'Food & Diet', icon: Utensils },
    { id: 'waste', label: 'Waste Reduction', icon: Trash2 },
    { id: 'daily', label: 'Daily Habits', icon: Clock },
  ];

  const filteredTips =
    selectedCategory === 'all'
      ? SUSTAINABILITY_TIPS
      : SUSTAINABILITY_TIPS.filter((t) => t.category === selectedCategory);

  // Personalized tips logic based on user's largest category
  const largest = currentRecord?.largestCategory || 'Transportation';
  const categoryKeyMap: Record<string, 'transportation' | 'energy' | 'food' | 'waste'> = {
    Transportation: 'transportation',
    Electricity: 'energy',
    Food: 'food',
    Waste: 'waste',
  };
  const targetCategoryKey = categoryKeyMap[largest] || 'transportation';

  const personalizedTips = SUSTAINABILITY_TIPS.filter((t) => t.category === targetCategoryKey).slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto pb-16 space-y-10"
    >
      {/* Header */}
      <div className="pb-2 border-b border-slate-200/60">
        <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
          <Lightbulb className="w-4 h-4 text-emerald-600" />
          <span>Practical Action Playbook</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
          Student Sustainability Guide
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
          Curated everyday habits engineered specifically for college students and households to maximize emission reductions with minimal effort.
        </p>
      </div>

      {/* AI PERSONALIZED TIPS BANNER */}
      {currentRecord && (
        <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Personalized For Your Lifestyle Profile</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight font-heading">
              Priority Focus: Reducing Your {largest} Emissions
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Based on your latest checkpoint, <strong>{largest}</strong> is your primary carbon driver ({currentRecord.largestPercentage}% of total). Here are your top 3 highest-leverage actions:
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {personalizedTips.map((tip) => (
                <div
                  key={tip.id}
                  className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-emerald-300 font-bold mb-2">
                      <span>Priority Action</span>
                      <span className="text-emerald-200">-{tip.impactKgMonth} kg/mo</span>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-2 leading-snug">{tip.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{tip.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-emerald-200">
                    💡 <strong>Student Tip:</strong> {tip.studentInsight}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY FILTER TABS */}
      <div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200/80">
          {categories.map((c) => {
            const Icon = c.icon;
            const isActive = selectedCategory === c.id;
            const count =
              c.id === 'all'
                ? SUSTAINABILITY_TIPS.length
                : SUSTAINABILITY_TIPS.filter((t) => t.category === c.id).length;

            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{c.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TIPS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTips.map((tip) => {
          return (
            <div
              key={tip.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-sm hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                    {tip.category}
                  </span>
                  <span className="font-extrabold text-emerald-700 text-xs">
                    Est. -{tip.impactKgMonth} kg CO₂e / mo
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 font-heading leading-snug mb-2">
                  {tip.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {tip.description}
                </p>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                  <span className="font-bold text-emerald-800 block mb-0.5 text-[11px]">
                    Campus Reality Check:
                  </span>
                  <span className="text-[11px] leading-relaxed">{tip.studentInsight}</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-slate-500">Difficulty:</span>
                  <span className="font-bold text-slate-700">{tip.difficulty}</span>
                </div>

                <div className="flex items-center gap-1 text-slate-400">
                  {tip.tags.map((tag, i) => (
                    <span key={i}>
                      {tag}
                      {i < tip.tags.length - 1 && ' · '}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA to Chat */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-slate-900 text-sm font-heading">
            Need customized advice for dorm restrictions?
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">
            Ask EcoTrack AI Chat for tailored routines on meal prepping, travel passes, or eco study spaces.
          </p>
        </div>
        <button
          onClick={() => onNavigate('chat')}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-2xs shrink-0"
        >
          <span>Ask Chat Assistant</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};
