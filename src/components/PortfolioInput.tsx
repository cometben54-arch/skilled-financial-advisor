import { useState } from 'react';
import { Upload, FileImage, Sparkles, ChevronUp, ChevronDown, Trash2, Plus } from 'lucide-react';
import type { Skill, PortfolioItem } from '../types';

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFile = (file: File) => {
    setUploadedFileName(file.name);
    // Simulate OCR processing — in production would call OCR service
    setTimeout(() => {
      setTextInput(
        `Detected from ${file.name}:\n\nAAPL - Apple Inc. - 25%\nMSFT - Microsoft Corp. - 20%\nNVDA - NVIDIA Corp. - 15%\nAMZN - Amazon.com Inc. - 12%\nJPM - JPMorgan Chase - 8%\nJNJ - Johnson & Johnson - 7%\nVTI - Vanguard Total Stock ETF - 8%\nBND - Vanguard Total Bond ETF - 5%`
      );
    }, 800);
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
            <span>Portfolio: {portfolio.length} positions</span>
            {activeSkill && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-300">
                {activeSkill.name}
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
            Active: <strong>{activeSkill.name}</strong>
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
            <ChevronUp size={12} /> Collapse input
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
          <Upload size={24} className="mx-auto text-surface-500 mb-2" />
          <p className="text-xs text-surface-400">
            Drag & drop a portfolio screenshot here, or{' '}
            <label className="text-primary-400 hover:text-primary-300 cursor-pointer underline">
              browse
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </label>
          </p>
          <p className="text-[10px] text-surface-500 mt-1">
            Supports screenshots from brokers — OCR will extract holdings
          </p>
          {uploadedFileName && (
            <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-accent-400 bg-accent-500/10 px-2.5 py-1 rounded-full">
              <FileImage size={12} />
              {uploadedFileName}
            </div>
          )}
        </div>

        {/* Text input */}
        <div>
          <label className="block text-xs font-medium text-surface-300 mb-1.5">
            Portfolio & Questions
          </label>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={`Enter your holdings and questions, e.g.:\n\nAAPL 25%, MSFT 20%, NVDA 15%\n\nShould I reduce my tech concentration?`}
            rows={4}
            className="w-full px-3 py-2.5 text-sm bg-surface-800 border border-surface-700 rounded-lg text-surface-200 placeholder-surface-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 resize-none"
          />
        </div>

        {/* Portfolio table */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-surface-300">
              Holdings Detail
            </label>
            <button
              onClick={addItem}
              className="flex items-center gap-1 text-[11px] text-primary-400 hover:text-primary-300 cursor-pointer"
            >
              <Plus size={12} /> Add Position
            </button>
          </div>
          <div className="space-y-1.5">
            <div className="grid grid-cols-[80px_1fr_70px_80px_32px] gap-2 text-[10px] text-surface-500 px-1">
              <span>Ticker</span>
              <span>Name</span>
              <span>Weight %</span>
              <span>Cost</span>
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
              Analyzing Portfolio...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Generate Advice
            </>
          )}
        </button>
        {!activeSkill && (
          <p className="text-[10px] text-surface-500 text-center -mt-2">
            Select a skill from the marketplace to begin
          </p>
        )}
      </div>
    </div>
  );
}
