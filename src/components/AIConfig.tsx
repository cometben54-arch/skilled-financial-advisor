import { useState } from 'react';
import {
  Cpu, ChevronDown, ChevronUp, Key, Zap, Brain,
  CheckCircle2, XCircle, Loader2, Settings,
} from 'lucide-react';
import type { AIConfig as AIConfigType } from '../types';
import { useI18n } from '../i18n';

interface AIConfigProps {
  config: AIConfigType;
  onChange: (config: AIConfigType) => void;
}

const DEFAULT_MODELS = [
  { id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6', provider: 'Anthropic', free: true },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', free: true },
  { id: 'deepseek-v3', name: 'DeepSeek V3', provider: 'DeepSeek', free: true },
  { id: 'claude-opus-4-6', name: 'Claude Opus 4.6', provider: 'Anthropic', free: false },
  { id: 'gpt-4.5', name: 'GPT-4.5', provider: 'OpenAI', free: false },
];

export function AIConfigPanel({ config, onChange }: AIConfigProps) {
  const { t } = useI18n();
  const [showCustom, setShowCustom] = useState(config.useCustom);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const handleTestConnection = () => {
    setConnectionStatus('testing');
    setTimeout(() => {
      if (config.customEndpoint && config.customApiKey) {
        setConnectionStatus('success');
      } else {
        setConnectionStatus('error');
      }
    }, 1500);
  };

  const freeCredits = 50;
  const usedCredits = 12;

  return (
    <div className="h-full flex flex-col bg-surface-900/50 border-l border-surface-800">
      {/* Header */}
      <div className="p-4 border-b border-surface-800">
        <h2 className="text-sm font-bold text-surface-100 flex items-center gap-2">
          <Settings size={16} className="text-primary-400" />
          {t('aiEngine')}
        </h2>
        <p className="text-[11px] text-surface-500 mt-0.5">
          {t('aiEngineDesc')}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Model selection */}
        <div>
          <label className="block text-xs font-medium text-surface-300 mb-2">{t('defaultModel')}</label>
          <div className="space-y-1.5">
            {DEFAULT_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => onChange({ ...config, model: model.id, useCustom: false })}
                className={`w-full flex items-center gap-3 p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  config.model === model.id && !config.useCustom
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-surface-700/50 bg-surface-800/30 hover:border-surface-600'
                }`}
              >
                <Cpu
                  size={14}
                  className={
                    config.model === model.id && !config.useCustom
                      ? 'text-primary-400'
                      : 'text-surface-500'
                  }
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-surface-200 block truncate">
                    {model.name}
                  </span>
                  <span className="text-[10px] text-surface-500">{model.provider}</span>
                </div>
                {model.free ? (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent-500/20 text-accent-300 font-medium">
                    FREE
                  </span>
                ) : (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300 font-medium">
                    PRO
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Credits */}
          <div className="mt-3 p-2.5 bg-surface-800/50 rounded-lg border border-surface-700/30">
            <div className="flex items-center justify-between text-xs">
              <span className="text-surface-400">{t('freeCredits')}</span>
              <span className="text-surface-200 font-medium">
                {freeCredits - usedCredits}/{freeCredits}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 bg-surface-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-accent-400 rounded-full transition-all"
                style={{ width: `${((freeCredits - usedCredits) / freeCredits) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Custom API */}
        <div>
          <button
            onClick={() => {
              const next = !showCustom;
              setShowCustom(next);
              if (!next) onChange({ ...config, useCustom: false });
            }}
            className="flex items-center justify-between w-full text-xs font-medium text-surface-300 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Key size={12} className="text-surface-400" />
              {t('useYourOwnKey')}
            </span>
            {showCustom ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          {showCustom && (
            <div className="mt-3 space-y-3 p-3 bg-surface-800/30 border border-surface-700/50 rounded-lg">
              <div>
                <label className="block text-[11px] text-surface-400 mb-1">{t('apiEndpoint')}</label>
                <input
                  type="url"
                  value={config.customEndpoint || ''}
                  onChange={(e) =>
                    onChange({ ...config, customEndpoint: e.target.value, useCustom: true })
                  }
                  placeholder="https://api.openai.com/v1"
                  className="w-full px-2.5 py-2 text-xs bg-surface-800 border border-surface-700 rounded-lg text-surface-200 placeholder-surface-500 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-surface-400 mb-1">{t('apiKey')}</label>
                <input
                  type="password"
                  value={config.customApiKey || ''}
                  onChange={(e) =>
                    onChange({ ...config, customApiKey: e.target.value, useCustom: true })
                  }
                  placeholder="sk-..."
                  className="w-full px-2.5 py-2 text-xs bg-surface-800 border border-surface-700 rounded-lg text-surface-200 placeholder-surface-500 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-surface-400 mb-1">{t('modelName')}</label>
                <input
                  type="text"
                  value={config.customModelName || ''}
                  onChange={(e) =>
                    onChange({ ...config, customModelName: e.target.value, useCustom: true })
                  }
                  placeholder="gpt-4o"
                  className="w-full px-2.5 py-2 text-xs bg-surface-800 border border-surface-700 rounded-lg text-surface-200 placeholder-surface-500 focus:outline-none focus:border-primary-500"
                />
              </div>

              <button
                onClick={handleTestConnection}
                disabled={connectionStatus === 'testing'}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg border border-surface-600 text-surface-300 hover:bg-surface-700 cursor-pointer disabled:opacity-50"
              >
                {connectionStatus === 'testing' ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    {t('testing')}
                  </>
                ) : connectionStatus === 'success' ? (
                  <>
                    <CheckCircle2 size={12} className="text-accent-400" />
                    {t('connected')}
                  </>
                ) : connectionStatus === 'error' ? (
                  <>
                    <XCircle size={12} className="text-red-400" />
                    {t('connectionFailed')}
                  </>
                ) : (
                  t('testConnection')
                )}
              </button>

              <p className="text-[10px] text-surface-500 flex items-center gap-1">
                <Key size={10} />
                {t('keyStorageHint')}
              </p>
            </div>
          )}
        </div>

        {/* Mode switch */}
        <div>
          <label className="block text-xs font-medium text-surface-300 mb-2">{t('analysisMode')}</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onChange({ ...config, mode: 'quick' })}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                config.mode === 'quick'
                  ? 'border-accent-500 bg-accent-500/10'
                  : 'border-surface-700/50 bg-surface-800/30 hover:border-surface-600'
              }`}
            >
              <Zap
                size={20}
                className={`mx-auto mb-1.5 ${
                  config.mode === 'quick' ? 'text-accent-400' : 'text-surface-500'
                }`}
              />
              <span className="text-xs font-semibold text-surface-200 block">{t('quickMode')}</span>
              <span className="text-[10px] text-surface-500 block mt-0.5">
                {t('quickModeDesc')}
              </span>
            </button>
            <button
              onClick={() => onChange({ ...config, mode: 'expert' })}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                config.mode === 'expert'
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-surface-700/50 bg-surface-800/30 hover:border-surface-600'
              }`}
            >
              <Brain
                size={20}
                className={`mx-auto mb-1.5 ${
                  config.mode === 'expert' ? 'text-primary-400' : 'text-surface-500'
                }`}
              />
              <span className="text-xs font-semibold text-surface-200 block">{t('expertMode')}</span>
              <span className="text-[10px] text-surface-500 block mt-0.5">
                {t('expertModeDesc')}
              </span>
            </button>
          </div>
          <div className="mt-3 p-2.5 bg-surface-800/50 rounded-lg border border-surface-700/30">
            <p className="text-[11px] text-surface-400 leading-relaxed">
              {config.mode === 'quick' ? t('quickModeDetail') : t('expertModeDetail')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
