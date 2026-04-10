import { useState, useCallback } from 'react';
import { Compass, Globe } from 'lucide-react';
import type { Skill, PortfolioItem, AIConfig, ChatMessage, AnalysisReport } from './types';
import { defaultSkills } from './data/skills';
import { demoPortfolio } from './data/demo';
import { SkillMarketplace } from './components/SkillMarketplace';
import { PortfolioInput } from './components/PortfolioInput';
import { ReportView } from './components/ReportView';
import { AIConfigPanel } from './components/AIConfig';
import { ChatPanel } from './components/ChatPanel';
import { useI18n } from './i18n';
import { getDemoReport } from './data/demo';

function App() {
  const { locale, setLocale, t } = useI18n();

  // Skills state
  const [skills, setSkills] = useState<Skill[]>(defaultSkills);
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);

  // Portfolio state
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(demoPortfolio);

  // AI config state
  const [aiConfig, setAIConfig] = useState<AIConfig>({
    model: 'claude-sonnet-4-6',
    mode: 'expert',
    useCustom: false,
  });

  // Report state
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatResponding, setIsChatResponding] = useState(false);

  const handleSelectSkill = useCallback((skill: Skill) => {
    setActiveSkill(skill);
  }, []);

  const handleLikeSkill = useCallback((skillId: string) => {
    setSkills((prev) =>
      prev.map((s) =>
        s.id === skillId
          ? { ...s, liked: !s.liked, likes: s.liked ? s.likes - 1 : s.likes + 1 }
          : s
      )
    );
  }, []);

  const handleUploadSkill = useCallback(
    (data: Omit<Skill, 'id' | 'likes' | 'uses' | 'liked' | 'isSystem' | 'creator'>) => {
      const newSkill: Skill = {
        ...data,
        id: `custom-${Date.now()}`,
        likes: 0,
        uses: 0,
        liked: false,
        isSystem: false,
        creator: 'You',
      };
      setSkills((prev) => [newSkill, ...prev]);
      setActiveSkill(newSkill);
    },
    []
  );

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    setReport(null);
    setChatMessages([]);

    const steps = [
      t('parsingHoldings'),
      `${t('activeSkillLabel')}${activeSkill?.name || 'Skill'}...`,
      t('evaluatingRisk'),
      t('generatingRecs'),
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setLoadingStep(steps[i]);
        i++;
      } else {
        clearInterval(interval);
        setReport(getDemoReport(locale));
        setIsGenerating(false);
        setLoadingStep('');
      }
    }, 700);
  }, [activeSkill, t, locale]);

  const handleChatSend = useCallback(
    (message: string) => {
      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: message,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, userMsg]);
      setIsChatResponding(true);

      setTimeout(() => {
        const responseTemplate = t('demo_chatResponse') as string;
        const response = responseTemplate.replace('{skill}', activeSkill?.name || 'current');

        const aiMsg: ChatMessage = {
          id: `msg-${Date.now()}-ai`,
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, aiMsg]);
        setIsChatResponding(false);
      }, 1500);
    },
    [activeSkill, t]
  );

  return (
    <div className="h-screen flex flex-col bg-surface-950">
      {/* Top bar */}
      <header className="h-12 border-b border-surface-800 bg-surface-900/80 backdrop-blur-sm flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <Compass size={16} className="text-white" />
          </div>
          <span className="text-sm font-bold text-surface-100">Portfolio Pilot</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary-500/20 text-primary-300 font-medium">
            {t('beta')}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-surface-400">
          <span>
            {t('model')}: <strong className="text-surface-200">{aiConfig.useCustom ? (aiConfig.customModelName || 'Custom') : aiConfig.model}</strong>
          </span>
          <span className="w-px h-4 bg-surface-700" />
          <span>
            {t('mode')}: <strong className="text-surface-200">{aiConfig.mode === 'quick' ? t('quick') : t('expert')}</strong>
          </span>
          <span className="w-px h-4 bg-surface-700" />
          {/* Language toggle */}
          <button
            onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-surface-700 hover:border-primary-500 hover:bg-primary-500/10 text-surface-300 hover:text-primary-300 transition-all cursor-pointer"
          >
            <Globe size={13} />
            <span className="font-medium">{locale === 'zh' ? 'EN' : '中文'}</span>
          </button>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar — Skill Marketplace */}
        <aside className="w-72 shrink-0 overflow-hidden">
          <SkillMarketplace
            skills={skills}
            activeSkill={activeSkill}
            onSelectSkill={handleSelectSkill}
            onLikeSkill={handleLikeSkill}
            onUploadSkill={handleUploadSkill}
          />
        </aside>

        {/* Center — Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto p-6 space-y-4">
            <PortfolioInput
              activeSkill={activeSkill}
              portfolio={portfolio}
              onPortfolioChange={setPortfolio}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              hasReport={!!report}
            />

            {(isGenerating || report) && (
              <ReportView
                report={report!}
                isExpert={aiConfig.mode === 'expert'}
                loading={isGenerating}
                loadingStep={loadingStep}
              />
            )}

            <ChatPanel
              messages={chatMessages}
              onSend={handleChatSend}
              isResponding={isChatResponding}
              hasReport={!!report}
            />
          </div>
        </main>

        {/* Right sidebar — AI Config */}
        <aside className="w-80 shrink-0 overflow-hidden">
          <AIConfigPanel config={aiConfig} onChange={setAIConfig} />
        </aside>
      </div>
    </div>
  );
}

export default App;
