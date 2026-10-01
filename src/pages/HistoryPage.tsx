import React, { useState } from 'react';
import {
  History,
  Trash2,
  Eye,
  GitCompare,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  AlertTriangle,
  RotateCcw,
  Check,
  Calendar,
  Layers,
} from 'lucide-react';
import { FootprintRecord, ActivePage } from '../types';
import { HistoricalTrendChart } from '../components/charts/HistoricalTrendChart';
import { ComparisonBarChart } from '../components/charts/ComparisonBarChart';
import { motion } from 'motion/react';

interface Props {
  records: FootprintRecord[];
  onSelectRecord: (record: FootprintRecord) => void;
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
  onRestoreDemo: () => void;
  onNavigate: (page: ActivePage) => void;
}

export const HistoryPage: React.FC<Props> = ({
  records,
  onSelectRecord,
  onDeleteRecord,
  onClearAll,
  onRestoreDemo,
  onNavigate,
}) => {
  const [compareMode, setCompareMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmClear, setConfirmClear] = useState(false);

  // Toggle selection for comparison (max 2)
  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      if (selectedIds.length >= 2) {
        setSelectedIds([selectedIds[1], id]);
      } else {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const recordA = records.find((r) => r.id === selectedIds[0]);
  const recordB = records.find((r) => r.id === selectedIds[1]);

  if (records.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <History className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-heading">
          No Historical Records Found
        </h2>
        <p className="mt-2 text-slate-600 text-sm max-w-sm mx-auto leading-relaxed">
          Your saved carbon calculation history will appear here so you can monitor emission reductions over time.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('calculator')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl shadow-xs text-xs"
          >
            <span>Launch Calculator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onRestoreDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold px-5 py-3 rounded-xl border border-slate-200 text-xs shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Load Demo History</span>
          </button>
        </div>
      </div>
    );
  }

  // Calculate overall trend
  const oldest = records[0];
  const newest = records[records.length - 1];
  const overallDiff = newest.breakdown.total - oldest.breakdown.total;
  const isOverallReduced = overallDiff < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto pb-16 space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
              Historical Timeline
            </h1>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200/60">
              {records.length} logs recorded
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Track historical emissions progression and perform side-by-side comparative analysis.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              if (records.length < 2) return;
              setCompareMode(!compareMode);
              if (!compareMode && records.length >= 2 && selectedIds.length < 2) {
                // Pre-select latest two
                setSelectedIds([records[records.length - 2].id, records[records.length - 1].id]);
              }
            }}
            disabled={records.length < 2}
            title={records.length < 2 ? 'Requires at least 2 saved assessments' : 'Compare 2 assessments'}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
              records.length < 2
                ? 'opacity-50 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200'
                : compareMode
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>{compareMode ? 'Exit Comparison' : 'Compare 2 Records'}</span>
          </button>

          {!confirmClear ? (
            <button
              onClick={() => setConfirmClear(true)}
              className="p-2.5 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-100"
              title="Delete all records"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
              <span className="text-xs text-rose-700 font-bold">Clear all?</span>
              <button
                onClick={() => {
                  onClearAll();
                  setConfirmClear(false);
                }}
                className="text-xs font-black text-rose-800 hover:underline"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                className="text-xs text-slate-500 hover:underline"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* TREND CHART */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Emissions Trend Over Time</h2>
            <p className="text-[11px] text-slate-500">
              Reference goal is 200 kg CO₂e / month (equivalent to the global 1.5°C climate pathway).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg border ${
                isOverallReduced
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80'
                  : 'bg-amber-50 text-amber-800 border-amber-200/80'
              }`}
            >
              {isOverallReduced ? (
                <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
              )}
              <span>
                {Math.abs(overallDiff).toFixed(1)} kg {isOverallReduced ? 'net reduction' : 'net increase'}
              </span>
            </span>
          </div>
        </div>

        <HistoricalTrendChart records={records} height={260} />
      </div>

      {/* COMPARISON VIEW (if active) */}
      {compareMode && (
        <div className="bg-white rounded-2xl p-6 sm:p-7 border-2 border-emerald-500/40 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                <GitCompare className="w-3.5 h-3.5 text-emerald-600" />
                <span>Side-by-Side Comparison</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading mt-0.5">
                {recordA && recordB
                  ? `${recordA.dateFormatted} vs ${recordB.dateFormatted}`
                  : 'Select any 2 assessments below to calculate differences'}
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {selectedIds.length}/2 selected
            </span>
          </div>

          {recordA && recordB ? (
            <div className="space-y-6">
              <ComparisonBarChart recordA={recordA} recordB={recordB} height={260} />

              {/* Delta Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2.5 font-bold">Category</th>
                      <th className="py-2.5 font-bold">{recordA.dateFormatted}</th>
                      <th className="py-2.5 font-bold">{recordB.dateFormatted}</th>
                      <th className="py-2.5 font-bold">Delta (B - A)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {[
                      { name: 'Transportation', valA: recordA.breakdown.transportation, valB: recordB.breakdown.transportation },
                      { name: 'Electricity', valA: recordA.breakdown.electricity, valB: recordB.breakdown.electricity },
                      { name: 'Food & Diet', valA: recordA.breakdown.food, valB: recordB.breakdown.food },
                      { name: 'Waste & Plastics', valA: recordA.breakdown.waste, valB: recordB.breakdown.waste },
                      { name: 'Total Monthly', valA: recordA.breakdown.total, valB: recordB.breakdown.total, isTotal: true },
                    ].map((row, i) => {
                      const diff = row.valB - row.valA;
                      const isBetter = diff <= 0;
                      return (
                        <tr key={i} className={row.isTotal ? 'font-bold bg-slate-50/80' : ''}>
                          <td className="py-2.5 text-slate-900">{row.name}</td>
                          <td className="py-2.5">{row.valA.toFixed(1)} kg</td>
                          <td className="py-2.5">{row.valB.toFixed(1)} kg</td>
                          <td className={`py-2.5 font-black ${isBetter ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {diff > 0 ? `+${diff.toFixed(1)} kg` : `${diff.toFixed(1)} kg`}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              Please check the checkboxes beside any two rows in the records table below to compute delta statistics.
            </p>
          )}
        </div>
      )}

      {/* RECORDS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 font-heading">Logged Checkpoints</h2>
          <span className="text-[11px] text-slate-500">Stored locally in browser</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 text-slate-600 font-bold border-b border-slate-200/60">
              <tr>
                {compareMode && <th className="p-3 w-10">Select</th>}
                <th className="p-3">Date</th>
                <th className="p-3">Total</th>
                <th className="p-3">Transportation</th>
                <th className="p-3">Electricity</th>
                <th className="p-3">Food</th>
                <th className="p-3">Waste</th>
                <th className="p-3">Rating</th>
                <th className="p-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {[...records].reverse().map((r) => {
                const isSelected = selectedIds.includes(r.id);
                return (
                  <tr
                    key={r.id}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      isSelected ? 'bg-emerald-50/40' : ''
                    }`}
                  >
                    {compareMode && (
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(r.id)}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                      </td>
                    )}
                    <td className="p-3 font-semibold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{r.dateFormatted}</span>
                      </div>
                    </td>
                    <td className="p-3 font-bold text-slate-900 font-heading">
                      {r.breakdown.total.toFixed(1)} kg
                    </td>
                    <td className="p-3">{r.breakdown.transportation.toFixed(1)} kg</td>
                    <td className="p-3">{r.breakdown.electricity.toFixed(1)} kg</td>
                    <td className="p-3">{r.breakdown.food.toFixed(1)} kg</td>
                    <td className="p-3">{r.breakdown.waste.toFixed(1)} kg</td>
                    <td className="p-3">
                      <span className="font-bold text-emerald-700">{r.sustainabilityScore}/100</span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => {
                            onSelectRecord(r);
                            onNavigate('results');
                          }}
                          className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="View Result Breakdown"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteRecord(r.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
