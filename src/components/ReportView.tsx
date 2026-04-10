import { useState } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';
import {
  TrendingUp, TrendingDown, Minus, AlertTriangle,
  Copy, Share2, ChevronDown, ChevronUp, Shield,
} from 'lucide-react';
import type { AnalysisReport } from '../types';
import { useI18n } from '../i18n';

interface ReportViewProps {
  report: AnalysisReport;
  isExpert: boolean;
  loading: boolean;
  loadingStep?: string;
}

export function ReportView({ report, isExpert, loading, loadingStep }: ReportViewProps) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(isExpert);
  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <div className="bg-surface-800/30 border border-surface-700/50 rounded-xl p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
            <SparkleIcon className="absolute inset-0 m-auto text-primary-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-surface-200">{loadingStep || t('analyzingPortfolio')}</p>
            <p className="text-[11px] text-surface-500 mt-1">{t('expertModeHint')}</p>
          </div>
          <div className="w-full max-w-xs space-y-2">
            {[t('parsingHoldings'), t('evaluatingRisk'), t('generatingRecs')].map((step, i) => (
              <div key={step} className="flex items-center gap-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-accent-400 animate-pulse' : i === 1 ? 'bg-primary-400 animate-pulse' : 'bg-surface-600'}`} />
                <span className={i < 2 ? 'text-surface-300' : 'text-surface-500'}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!report) return null;

  const handleCopy = () => {
    const text = `${t('analysisReport')}\n\n${t('healthScore')}: ${report.healthScore}/100\n\n${report.summary}\n\n${t('shortTermActions')}:\n${report.shortTermActions.map((a) => `- ${a.action.toUpperCase()} ${a.ticker}: ${a.detail}`).join('\n')}\n\n${t('longTermView')}:\n${report.longTermView}\n\n${t('riskWarnings')}:\n${report.riskWarnings.map((w) => `- ${w}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scoreColor =
    report.healthScore >= 80
      ? 'text-accent-400'
      : report.healthScore >= 60
      ? 'text-yellow-400'
      : 'text-red-400';

  const scoreRingColor =
    report.healthScore >= 80
      ? '#34d399'
      : report.healthScore >= 60
      ? '#fbbf24'
      : '#f87171';

  const scoreLabel =
    report.healthScore >= 80
      ? t('strong')
      : report.healthScore >= 60
      ? t('moderate')
      : t('needsWork');

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="bg-surface-800/30 border border-surface-700/50 rounded-xl p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-sm font-bold text-surface-100 flex items-center gap-2">
            <Shield size={16} className="text-primary-400" />
            {t('analysisReport')}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] text-surface-400 hover:text-surface-200 cursor-pointer"
            >
              <Copy size={12} />
              {copied ? t('copied') : t('copy')}
            </button>
            <button className="flex items-center gap-1 text-[11px] text-surface-400 hover:text-surface-200 cursor-pointer">
              <Share2 size={12} />
              {t('share')}
            </button>
          </div>
        </div>
        <p className="text-sm text-surface-300 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: report.summary
              .replace(/\*\*(.*?)\*\*/g, '<strong class="text-surface-100">$1</strong>'),
          }}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Pie chart */}
        <div className="bg-surface-800/30 border border-surface-700/50 rounded-xl p-4">
          <h4 className="text-xs font-semibold text-surface-300 mb-3">{t('sectorAllocation')}</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={report.sectorAllocation}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {report.sectorAllocation.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#e2e8f0',
                  }}
                  formatter={(value) => [`${value}%`, t('allocation')]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
            {report.sectorAllocation.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5 text-[10px] text-surface-400">
                <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                {s.name} {s.value}%
              </div>
            ))}
          </div>
        </div>

        {/* Health score + radar */}
        <div className="bg-surface-800/30 border border-surface-700/50 rounded-xl p-4">
          <h4 className="text-xs font-semibold text-surface-300 mb-3">{t('riskProfile')}</h4>
          <div className="flex items-center gap-4 mb-2">
            <div className="relative w-20 h-20">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={scoreRingColor}
                  strokeWidth="3"
                  strokeDasharray={`${report.healthScore}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-lg font-bold ${scoreColor}`}>{report.healthScore}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-surface-400">{t('healthScore')}</p>
              <p className={`text-sm font-semibold ${scoreColor}`}>{scoreLabel}</p>
            </div>
          </div>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={report.riskMetrics.map((m) => ({ ...m, fullMark: m.max }))}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="label" tick={{ fontSize: 9, fill: '#94a3b8' }} />
                <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                <Radar
                  dataKey="value"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Short-term actions */}
      <div className="bg-surface-800/30 border border-surface-700/50 rounded-xl p-4">
        <h4 className="text-xs font-semibold text-surface-300 mb-3 flex items-center gap-2">
          <TrendingUp size={14} className="text-accent-400" />
          {t('shortTermActions')}
        </h4>
        <div className="space-y-2">
          {report.shortTermActions.map((action, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 bg-surface-800/50 rounded-lg border border-surface-700/30"
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  action.action === 'buy'
                    ? 'bg-accent-500/20 text-accent-400'
                    : action.action === 'sell'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}
              >
                {action.action === 'buy' ? (
                  <TrendingUp size={14} />
                ) : action.action === 'sell' ? (
                  <TrendingDown size={14} />
                ) : (
                  <Minus size={14} />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-surface-100">{action.ticker}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-medium uppercase ${
                      action.action === 'buy'
                        ? 'bg-accent-500/20 text-accent-300'
                        : action.action === 'sell'
                        ? 'bg-red-500/20 text-red-300'
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}
                  >
                    {t(action.action)}
                  </span>
                </div>
                <p className="text-xs text-surface-400 mt-0.5 leading-relaxed">{action.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Long-term view */}
      <div className="bg-surface-800/30 border border-surface-700/50 rounded-xl overflow-hidden">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full p-4 flex items-center justify-between cursor-pointer hover:bg-surface-800/30"
        >
          <h4 className="text-xs font-semibold text-surface-300 flex items-center gap-2">
            <TrendingUp size={14} className="text-primary-400" />
            {t('longTermView')}
          </h4>
          {expanded ? <ChevronUp size={14} className="text-surface-500" /> : <ChevronDown size={14} className="text-surface-500" />}
        </button>
        {expanded && (
          <div className="px-4 pb-4 border-t border-surface-700/50 pt-3">
            <div
              className="text-sm text-surface-300 leading-relaxed prose prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: report.longTermView
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="text-surface-100">$1</strong>')
                  .replace(/\n/g, '<br/>'),
              }}
            />
          </div>
        )}
      </div>

      {/* Risk warnings */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
        <h4 className="text-xs font-semibold text-red-300 mb-3 flex items-center gap-2">
          <AlertTriangle size={14} />
          {t('riskWarnings')}
        </h4>
        <ul className="space-y-2">
          {report.riskWarnings.map((warning, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-red-200/80 leading-relaxed">
              <span className="text-red-400 mt-0.5 shrink-0">•</span>
              {warning}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
    </svg>
  );
}
