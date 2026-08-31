import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  X, 
  Calendar, 
  Clock, 
  PieChart, 
  Award, 
  RotateCcw, 
  Flame
} from 'lucide-react';
import type { TimeStats } from '../hooks/useTimeTracker';
import { formatTimeSummary } from '../hooks/useTimeTracker';

interface AnalyticsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  stats: TimeStats;
  onReset: () => void;
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({
  isOpen,
  onClose,
  stats,
  onReset
}) => {
  const daySummary = formatTimeSummary(stats.daySeconds);
  const weekSummary = formatTimeSummary(stats.weekSeconds);
  const monthSummary = formatTimeSummary(stats.monthSeconds);
  const yearSummary = formatTimeSummary(stats.yearSeconds);
  const sessionSummary = formatTimeSummary(stats.sessionSeconds);

  // Benchmarks for visual progress calculation (in seconds)
  const DAY_BENCHMARK = 8 * 3600;   // 8 hours
  const WEEK_BENCHMARK = 40 * 3600; // 40 hours
  const MONTH_BENCHMARK = 160 * 3600; // 160 hours
  const YEAR_BENCHMARK = 2000 * 3600; // 2000 hours

  const dayPercent = Math.min(100, Math.round((stats.daySeconds / DAY_BENCHMARK) * 100)) || 2;
  const weekPercent = Math.min(100, Math.round((stats.weekSeconds / WEEK_BENCHMARK) * 100)) || 2;
  const monthPercent = Math.min(100, Math.round((stats.monthSeconds / MONTH_BENCHMARK) * 100)) || 2;
  const yearPercent = Math.min(100, Math.round((stats.yearSeconds / YEAR_BENCHMARK) * 100)) || 2;

  const categories = [
    {
      id: 'day',
      title: 'Today',
      badge: 'Day',
      icon: <Calendar className="w-5 h-5 text-accent" />,
      main: daySummary.main,
      sub: daySummary.sub,
      percent: dayPercent,
      color: 'bg-accent',
      description: 'Total active time spent today'
    },
    {
      id: 'week',
      title: 'This Week',
      badge: 'Week',
      icon: <Clock className="w-5 h-5 text-cyan-400" />,
      main: weekSummary.main,
      sub: weekSummary.sub,
      percent: weekPercent,
      color: 'bg-cyan-400',
      description: 'Past 7 days accumulated time'
    },
    {
      id: 'month',
      title: 'This Month',
      badge: 'Month',
      icon: <PieChart className="w-5 h-5 text-purple-400" />,
      main: monthSummary.main,
      sub: monthSummary.sub,
      percent: monthPercent,
      color: 'bg-purple-400',
      description: 'Current calendar month activity'
    },
    {
      id: 'year',
      title: 'This Year',
      badge: 'Year',
      icon: <Award className="w-5 h-5 text-amber-400" />,
      main: yearSummary.main,
      sub: yearSummary.sub,
      percent: yearPercent,
      color: 'bg-amber-400',
      description: 'Total accumulated annual time'
    }
  ];

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Slide-out Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-card/85 backdrop-blur-2xl border-l border-divider z-50 p-6 overflow-y-auto shadow-2xl glass-panel text-text"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-accent/20 border border-accent/40 text-accent">
              <BarChart3 size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Time Analysis</h2>
              <p className="text-xs opacity-60 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Active Session: <span className="font-mono font-semibold">{sessionSummary.main}</span>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            aria-label="Close Analysis"
          >
            <X size={24} />
          </button>
        </div>

        {/* 4 Analysis Category Cards */}
        <div className="space-y-4 mb-8">
          <h3 className="text-xs font-semibold uppercase tracking-wider opacity-60">Time Category Breakdown</h3>
          
          <div className="grid grid-cols-1 gap-3.5">
            {categories.map((cat) => (
              <div 
                key={cat.id}
                className="p-4 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-md shadow-md hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2.5">
                    {cat.icon}
                    <span className="font-semibold text-sm">{cat.title}</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/10 opacity-80 border border-white/10">
                    {cat.badge}
                  </span>
                </div>

                <div className="flex items-baseline justify-between my-1">
                  <span className="text-3xl font-extrabold tracking-tight font-mono">
                    {cat.main}
                  </span>
                  <span className="text-xs opacity-60 font-mono">
                    {cat.sub}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[11px] opacity-50 mb-1">
                    <span>{cat.description}</span>
                    <span>{cat.percent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden border border-white/5">
                    <motion.div 
                      className={`h-full rounded-full ${cat.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.percent}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Analysis Summary */}
        <div className="p-4 rounded-2xl bg-accent/10 border border-accent/30 backdrop-blur-md mb-8">
          <div className="flex items-center space-x-2.5 mb-2 text-accent">
            <Flame size={18} />
            <h4 className="font-semibold text-sm">Focus Insights</h4>
          </div>
          <p className="text-xs opacity-80 leading-relaxed">
            Your focus time is tracked across <strong className="text-text">Day, Week, Month, and Year</strong> categories during active user-set timer sessions!
          </p>
        </div>

        {/* Action Controls */}
        <div className="pt-2 border-t border-divider flex items-center justify-between">
          <span className="text-xs opacity-50">Local Analysis Data</span>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to reset your time analysis stats?')) {
                onReset();
              }
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-medium transition-colors"
          >
            <RotateCcw size={14} />
            <span>Reset Stats</span>
          </button>
        </div>
      </motion.div>
    </>
  );
};
