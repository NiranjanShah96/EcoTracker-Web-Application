/**
 * EcoTrack – AI-Powered Carbon Footprint Tracker
 * College End Semester Examination (ESE) Project
 */

import React, { useState, useEffect } from 'react';
import { ActivePage, FootprintRecord } from './types';
import { INITIAL_DEMO_RECORDS } from './data/demoData';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { ResultsPage } from './pages/ResultsPage';
import { AIInsightsPage } from './pages/AIInsightsPage';
import { AIChatPage } from './pages/AIChatPage';
import { HistoryPage } from './pages/HistoryPage';
import { SustainabilityTipsPage } from './pages/SustainabilityTipsPage';
import { AboutPage } from './pages/AboutPage';
import { WhatIfSimulatorPage } from './pages/WhatIfSimulatorPage';
import { EsePresentationModal } from './components/presentation/EsePresentationModal';

const STORAGE_KEY = 'ecotrack_carbon_records_v1';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);

  const [records, setRecords] = useState<FootprintRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed reading localStorage, using demo records:', e);
    }
    return INITIAL_DEMO_RECORDS;
  });

  // Currently active or inspected assessment record
  const [activeRecord, setActiveRecord] = useState<FootprintRecord | null>(() => {
    return records.length > 0 ? records[records.length - 1] : null;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.warn('Failed saving to localStorage:', e);
    }
  }, [records]);

  // Scroll to top on navigation
  const navigateTo = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCalculationComplete = (newRecord: FootprintRecord) => {
    setRecords((prev) => [...prev, newRecord]);
    setActiveRecord(newRecord);
  };

  const handleDeleteRecord = (id: string) => {
    const updated = records.filter((r) => r.id !== id);
    setRecords(updated);
    if (activeRecord && activeRecord.id === id) {
      setActiveRecord(updated.length > 0 ? updated[updated.length - 1] : null);
    }
  };

  const handleClearAll = () => {
    setRecords([]);
    setActiveRecord(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // non-critical
    }
  };

  const handleRestoreDemo = () => {
    setRecords(INITIAL_DEMO_RECORDS);
    setActiveRecord(INITIAL_DEMO_RECORDS[INITIAL_DEMO_RECORDS.length - 1]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activePage={activePage}
        onNavigate={navigateTo}
        recordCount={records.length}
        onOpenPresentation={() => setIsPresentationOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activePage === 'home' && (
          <LandingPage
            onNavigate={navigateTo}
            latestRecord={activeRecord || undefined}
          />
        )}

        {activePage === 'dashboard' && (
          <DashboardPage
            records={records}
            onNavigate={navigateTo}
            onClearDemoData={handleClearAll}
            onRestoreDemoData={handleRestoreDemo}
          />
        )}

        {activePage === 'calculator' && (
          <CalculatorPage
            onCalculationComplete={handleCalculationComplete}
            onNavigate={navigateTo}
          />
        )}

        {activePage === 'results' && activeRecord && (
          <ResultsPage
            record={activeRecord}
            onNavigate={navigateTo}
          />
        )}

        {activePage === 'results' && !activeRecord && (
          <div className="text-center py-16">
            <p className="text-sm text-slate-500">No active result found.</p>
            <button
              onClick={() => navigateTo('calculator')}
              className="mt-4 bg-emerald-600 text-white text-xs px-4 py-2 rounded-lg font-semibold"
            >
              Start New Calculation
            </button>
          </div>
        )}

        {activePage === 'simulator' && (
          <WhatIfSimulatorPage
            currentRecord={activeRecord}
            onNavigate={navigateTo}
          />
        )}

        {activePage === 'ai-insights' && (
          <AIInsightsPage
            currentRecord={activeRecord}
            onNavigate={navigateTo}
          />
        )}

        {activePage === 'chat' && (
          <AIChatPage
            currentRecord={activeRecord}
          />
        )}

        {activePage === 'history' && (
          <HistoryPage
            records={records}
            onSelectRecord={(rec) => {
              setActiveRecord(rec);
            }}
            onDeleteRecord={handleDeleteRecord}
            onClearAll={handleClearAll}
            onRestoreDemo={handleRestoreDemo}
            onNavigate={navigateTo}
          />
        )}

        {activePage === 'tips' && (
          <SustainabilityTipsPage
            currentRecord={activeRecord}
            onNavigate={navigateTo}
          />
        )}

        {activePage === 'about' && (
          <AboutPage />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigateTo} />

      {/* ESE Presentation Modal */}
      <EsePresentationModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        onNavigate={navigateTo}
      />
    </div>
  );
}
