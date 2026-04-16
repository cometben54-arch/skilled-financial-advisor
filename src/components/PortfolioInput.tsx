import { useState } from 'react';
import { Upload, FileImage, Sparkles, ChevronUp, ChevronDown, Trash2, Plus, Loader2 } from 'lucide-react';
import type { Skill, PortfolioItem } from '../types';
import { useI18n } from '../i18n';

/** Compress image to maxDim px on longest side, JPEG quality, returns data URL */
function compressImage(file: File, maxDim: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        const scale = maxDim / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas not supported')); return; }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

interface PortfolioInputProps {
  activeSkill: Skill | null;
  portfolio: PortfolioItem[];
  onPortfolioChange: (items: PortfolioItem[]) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  hasReport: boolean;
}

export function PortfolioInput({
  activeSkill,
  portfolio,
  onPortfolioChange,
  onGenerate,
  isGenerating,
  hasReport,
}: PortfolioInputProps) {
  const { t, locale } = useI18n();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);

  const skillDisplayName = activeSkill?.nameKey ? t(activeSkill.nameKey) : activeSkill?.name;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFile = async (file: File) => {
    setUploadedFileName(file.name);
    setIsOcrProcessing(true);
    setOcrError(null);

    try {
      // Compress image client-side: resize to max 1600px and JPEG 0.8 quality
      // This keeps the base64 payload under ~500KB instead of 5-10MB
      const dataUrl = await compressImage(file, 1600, 0.8);

      // Call vision API
      const res = await fetch('/api/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataUrl, locale }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' })) as { error?: string; detail?: string };
        const msg = err.error || `API error ${res.status}`;
        const detail = err.detail ? `\n${typeof err.detail === 'string' ? err.detail.slice(0, 200) : JSON.stringify(err.detail).slice(0, 200)}` : '';
        throw new Error(msg + detail);
      }

      const data = await res.json() as { content: string };
      const raw = data.content;

      // Try to parse JSON response
      let parsed: { holdings?: PortfolioItem[]; rawText?: string } | null = null;
      try {
        const fenceMatch = raw.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
        const jsonStr = fenceMatch ? fenceMatch[1] : raw;
        const braceMatch = jsonStr.match(/\{[\s\S]*\}/);
        if (braceMatch) parsed = JSON.parse(braceMatch[0]);
      } catch { /* fall through */ }

      if (parsed?.holdings && parsed.holdings.length > 0) {
        // Update portfolio table with extracted holdings
        onPortfolioChange(parsed.holdings.map((h) => ({
          ticker: h.ticker || '',
          name: h.name || '',
          weight: h.weight || 0,
          costBasis: h.costBasis || undefined,
          currentPrice: h.currentPrice || undefined,
          sector: h.sector || '',
        })));
        // Also put a summary in the text box
        const summary = parsed.holdings
          .map((h) => `${h.ticker} - ${h.name} - ${h.weight}%${h.currentPrice ? ` ($${h.currentPrice})` : ''}`)
          .join('\n');
        setTextInput(`${t('ocrDetected')} ${file.name}:\n\n${summary}${parsed.rawText ? `\n\n${parsed.rawText}` : ''}`);
      } else if (parsed?.rawText) {
        setTextInput(`${t('ocrDetected')} ${file.name}:\n\n${parsed.rawText}`);
      } else {
        // Couldn't parse JSON — put raw AI response in text box
        setTextInput(`${t('ocrDetected')} ${file.name}:\n\n${raw}`);
      }
    } catch (err) {
      console.warn('Vision OCR failed:', err);
      setOcrError(String(err instanceof Error ? err.message : err));
    } finally {
      setIsOcrProcessing(false);
    }
  };

  const updateItem = (index: number, field: keyof PortfolioItem, value: string | number) => {
    const updated = [...portfolio];
    updated[index] = { ...updated[index], [field]: value };
    onPortfolioChange(updated);
  };

  const addItem = () => {
    onPortfolioChange([
      ...portfolio,
      { ticker: '', name: '', weight: 0, sector: '' },
    ]);
  };

  const removeItem = (index: number) => {
    onPortfolioChange(portfolio.filter((_, i) => i !== index));
  };

  if (hasReport && isCollapsed) {
    return (
      <div className="bg-surface-800/50 border border-surface-700/50 rounded-xl p-3">
        <button
          onClick={() => setIsCollapsed(false)}
          className="w-full flex items-center justify-between text-sm text-surface-300 hover:text-surface-100 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <FileImage size={14} className="text-primary-400" />
            <span>{t('portfolio')}: {portfolio.length} {t('positions')}</span>
            {activeSkill && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-300">
                {skillDisplayName}
              </span>
            )}
          </div>
          <ChevronDown size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface-800/30 border border-surface-700/50 rounded-xl overflow-hidden">
      {/* Active skill bar */}
      {activeSkill && (
        <div className="px-4 py-2.5 bg-primary-500/10 border-b border-primary-500/20 flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary-500 flex items-center justify-center text-[10px] font-bold text-white">
            {activeSkill.icon}
          </div>
          <span className="text-xs text-primary-200">
            {t('activeSkillLabel')}<strong>{skillDisplayName}</strong>
          </span>
          <span className="text-[10px] text-primary-400 ml-auto">
            {activeSkill.tags.join(' · ')}
          </span>
        </div>
      )}

      <div className="p-4 space-y-4">
        {hasReport && (
          <button
            onClick={() => setIsCollapsed(true)}
            className="flex items-center gap-1 text-xs text-surface-500 hover:text-surface-300 cursor-pointer"
          >
            <ChevronUp size={12} /> {t('collapseInput')}
          </button>
        )}

        {/* Image upload zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
            dragActive
              ? 'border-primary-400 bg-primary-500/10'
              : 'border-surface-700 hover:border-surface-500'
          }`}
        >
          {isOcrProcessing ? (
            <>
              <Loader2 size={24} className="mx-auto text-primary-400 mb-2 animate-spin" />
              <p className="text-xs text-primary-300">{t('ocrProcessing')}</p>
              <p className="text-[10px] text-surface-500 mt-1">{t('ocrProcessingHint')}</p>
            </>
          ) : (
            <>
              <Upload size={24} className="mx-auto text-surface-500 mb-2" />
              <p className="text-xs text-surface-400">
                {t('dragDropText')}{' '}
                <label className="text-primary-400 hover:text-primary-300 cursor-pointer underline">
                  {t('browse')}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  />
                </label>
              </p>
              <p className="text-[10px] text-surface-500 mt-1">
                {t('ocrHint')}
              </p>
            </>
          )}
          {uploadedFileName && !isOcrProcessing && (
            <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-accent-400 bg-accent-500/10 px-2.5 py-1 rounded-full">
              <FileImage size={12} />
              {uploadedFileName}
            </div>
          )}
          {ocrError && (
            <div className="mt-2 text-xs text-red-400">{t('ocrFailed')}: {ocrError}</div>
          )}
        </div>

        {/* Text input */}
        <div>
          <label className="block text-xs font-medium text-surface-300 mb-1.5">
            {t('portfolioQuestions')}
          </label>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={t('portfolioPlaceholder')}
            rows={4}
            className="w-full px-3 py-2.5 text-sm bg-surface-800 border border-surface-700 rounded-lg text-surface-200 placeholder-surface-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 resize-none"
          />
        </div>

        {/* Portfolio table */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-surface-300">
              {t('holdingsDetail')}
            </label>
            <button
              onClick={addItem}
              className="flex items-center gap-1 text-[11px] text-primary-400 hover:text-primary-300 cursor-pointer"
            >
              <Plus size={12} /> {t('addPosition')}
            </button>
          </div>
          <div className="space-y-1.5">
            <div className="grid grid-cols-[80px_1fr_70px_80px_32px] gap-2 text-[10px] text-surface-500 px-1">
              <span>{t('ticker')}</span>
              <span>{t('name')}</span>
              <span>{t('weightPct')}</span>
              <span>{t('cost')}</span>
              <span></span>
            </div>
            {portfolio.map((item, i) => (
              <div
                key={i}
                className="grid grid-cols-[80px_1fr_70px_80px_32px] gap-2 items-center"
              >
                <input
                  value={item.ticker}
                  onChange={(e) => updateItem(i, 'ticker', e.target.value.toUpperCase())}
                  className="px-2 py-1.5 text-xs bg-surface-800 border border-surface-700 rounded text-surface-200 focus:outline-none focus:border-primary-500"
                  placeholder="AAPL"
                />
                <input
                  value={item.name}
                  onChange={(e) => updateItem(i, 'name', e.target.value)}
                  className="px-2 py-1.5 text-xs bg-surface-800 border border-surface-700 rounded text-surface-200 focus:outline-none focus:border-primary-500"
                  placeholder="Apple Inc."
                />
                <input
                  type="number"
                  value={item.weight || ''}
                  onChange={(e) => updateItem(i, 'weight', Number(e.target.value))}
                  className="px-2 py-1.5 text-xs bg-surface-800 border border-surface-700 rounded text-surface-200 focus:outline-none focus:border-primary-500"
                  placeholder="25"
                />
                <input
                  type="number"
                  value={item.costBasis || ''}
                  onChange={(e) => updateItem(i, 'costBasis', Number(e.target.value))}
                  className="px-2 py-1.5 text-xs bg-surface-800 border border-surface-700 rounded text-surface-200 focus:outline-none focus:border-primary-500"
                  placeholder="$145"
                />
                <button
                  onClick={() => removeItem(i)}
                  className="p-1 text-surface-600 hover:text-red-400 cursor-pointer"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={onGenerate}
          disabled={isGenerating || !activeSkill}
          className={`w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            isGenerating
              ? 'bg-primary-700 text-primary-200 cursor-wait'
              : !activeSkill
              ? 'bg-surface-700 text-surface-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 shadow-lg shadow-primary-600/25'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-300 border-t-transparent rounded-full animate-spin" />
              {t('analyzingPortfolio')}
            </>
          ) : (
            <>
              <Sparkles size={16} />
              {t('generateAdvice')}
            </>
          )}
        </button>
        {!activeSkill && (
          <p className="text-[10px] text-surface-500 text-center -mt-2">
            {t('selectSkillFirst')}
          </p>
        )}
      </div>
    </div>
  );
}
