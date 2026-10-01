import React from 'react';
import { Leaf, Award, ShieldCheck, Heart } from 'lucide-react';
import { ActivePage } from '../../types';

interface Props {
  onNavigate: (page: ActivePage) => void;
}

export const Footer: React.FC<Props> = ({ onNavigate }) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Project Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-2xs">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-slate-900 text-base font-heading">EcoTrack</span>
              <span className="text-xs text-slate-400">· College ESE Project</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed">
              An AI-assisted environmental diagnostics application designed to help university students
              and households estimate greenhouse gas emissions across transportation,
              electricity, diet, and waste.
            </p>
            <div className="pt-2 text-xs text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                <span>End Semester Examination Demonstration Project</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Conversion factors grounded in UK DEFRA, US EPA & IPCC AR5 data</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Application Modules
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-emerald-700 transition-colors"
                >
                  Analytics Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('calculator')}
                  className="hover:text-emerald-700 transition-colors"
                >
                  Carbon Footprint Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('simulator')}
                  className="hover:text-emerald-700 transition-colors"
                >
                  What-If Scenario Simulator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ai-insights')}
                  className="hover:text-emerald-700 transition-colors"
                >
                  AI Environmental Assistant
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('chat')}
                  className="hover:text-emerald-700 transition-colors"
                >
                  Eco Q&A Chatbot
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tips')}
                  className="hover:text-emerald-700 transition-colors"
                >
                  Student Sustainability Tips
                </button>
              </li>
            </ul>
          </div>

          {/* Project Details */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Technical Stack
            </h4>
            <div className="text-xs text-slate-500 space-y-1.5">
              <p><strong className="text-slate-700 font-semibold">Frontend:</strong> React 19, TypeScript, Tailwind CSS</p>
              <p><strong className="text-slate-700 font-semibold">Visuals:</strong> Chart.js 4 (Canvas)</p>
              <p><strong className="text-slate-700 font-semibold">Intelligence:</strong> Google Gemini 3.8 Flash</p>
              <p><strong className="text-slate-700 font-semibold">Storage:</strong> Client-side localStorage</p>
              <p><strong className="text-slate-700 font-semibold">Architecture:</strong> Full-stack with Express API</p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('about')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
                >
                  View Architecture & Prompts →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 EcoTrack. Developed for College End Semester Examination.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with care for climate education</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
