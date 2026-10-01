import React, { useState } from 'react';
import {
  Leaf,
  LayoutDashboard,
  Calculator,
  Sparkles,
  History,
  Lightbulb,
  Info,
  Menu,
  X,
  MessageSquare,
  ArrowRight,
  Award,
  Sliders,
} from 'lucide-react';
import { ActivePage } from '../../types';

interface Props {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  recordCount: number;
  onOpenPresentation?: () => void;
}

export const Navbar: React.FC<Props> = ({
  activePage,
  onNavigate,
  recordCount,
  onOpenPresentation,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: Array<{ id: ActivePage; label: string; icon: React.ReactNode }> = [
    { id: 'home', label: 'Home', icon: <Leaf className="w-3.5 h-3.5" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { id: 'calculator', label: 'Calculator', icon: <Calculator className="w-3.5 h-3.5" /> },
    { id: 'simulator', label: 'Simulator', icon: <Sliders className="w-3.5 h-3.5" /> },
    { id: 'ai-insights', label: 'AI Insights', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'chat', label: 'AI Chat', icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { id: 'history', label: 'History', icon: <History className="w-3.5 h-3.5" /> },
    { id: 'tips', label: 'Tips', icon: <Lightbulb className="w-3.5 h-3.5" /> },
    { id: 'about', label: 'About', icon: <Info className="w-3.5 h-3.5" /> },
  ];

  const handleNav = (page: ActivePage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 pt-2 sm:pt-3 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-xs transition-all">
        <div className="flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6">
          {/* Logo */}
          <div
            onClick={() => handleNav('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-200">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base text-slate-900 tracking-tight font-heading">
                  EcoTrack
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60 hidden sm:inline-block">
                  AI ESE
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block leading-none">
                Carbon Diagnostics
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5 bg-slate-100/70 p-1 rounded-xl border border-slate-200/50">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    isActive
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.id === 'history' && recordCount > 0 && (
                    <span
                      className={`text-[10px] font-bold px-1 rounded ${
                        isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {recordCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* CTA Actions */}
          <div className="hidden sm:flex items-center gap-2">
            {onOpenPresentation && (
              <button
                onClick={onOpenPresentation}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-3 py-2 rounded-xl transition-all shadow-2xs"
                title="Launch End Semester Examination Demonstration Presentation"
              >
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>ESE Demo Guide</span>
              </button>
            )}
            <button
              onClick={() => handleNav('chat')}
              className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors"
              title="Open AI Environmental Chat"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleNav('calculator')}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs hover:shadow transition-all"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Calculate</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            {onOpenPresentation && (
              <button
                onClick={onOpenPresentation}
                className="p-1.5 px-2 text-amber-900 bg-amber-50 rounded-lg text-xs font-bold border border-amber-200/80 flex items-center gap-1"
              >
                <Award className="w-3 h-3 text-amber-600" />
                <span>ESE</span>
              </button>
            )}
            <button
              onClick={() => handleNav('calculator')}
              className="p-1.5 px-2.5 text-emerald-800 bg-emerald-50 rounded-lg text-xs font-bold border border-emerald-200/60"
            >
              Calculate
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 max-w-7xl mx-auto border border-slate-200 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg space-y-1">
          <div className="grid grid-cols-2 gap-1 pb-2 border-b border-slate-100">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.id === 'history' && recordCount > 0 && (
                    <span className="ml-auto text-[10px] text-slate-400 font-bold">
                      {recordCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="pt-2 flex items-center justify-between px-1 gap-2">
            {onOpenPresentation && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPresentation();
                }}
                className="flex-1 bg-amber-50 text-amber-900 border border-amber-200 font-bold py-2 rounded-xl text-xs"
              >
                ESE Guide
              </button>
            )}
            <button
              onClick={() => handleNav('calculator')}
              className="flex-1 text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs shadow-xs"
            >
              Launch Calculator
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
