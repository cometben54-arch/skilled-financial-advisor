import { useState, useCallback } from 'react';
import { Compass } from 'lucide-react';
import type { Skill, PortfolioItem, AIConfig, ChatMessage, AnalysisReport } from './types';
import { defaultSkills } from './data/skills';
import { demoPortfolio, demoReport } from './data/demo';
import { SkillMarketplace } from './components/SkillMarketplace';
import { PortfolioInput } from './components/PortfolioInput';
import { ReportView } from './components/ReportView';
import { AIConfigPanel } from './components/AIConfig';
import { ChatPanel } from './components/ChatPanel';

function App() {
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
      'Parsing portfolio holdings...',
      `Loading ${activeSkill?.name || 'Skill'} mindset...`,
      'Evaluating sector allocation...',
      'Computing risk metrics...',
      'Generating recommendations...',
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setLoadingStep(steps[i]);
        i++;
      } else {
        clearInterval(interval);
        setReport(demoReport);
        setIsGenerating(false);
        setLoadingStep('');
      }
    }, 700);
  }, [activeSkill]);

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

      // Simulate AI response
      setTimeout(() => {
        const responses: Record<string, string> = {
          default: `Great question! Based on the **${activeSkill?.name || 'current'}** framework and your portfolio analysis:\n\nYour portfolio's tech concentration at 60% does create meaningful risk. A more **conservative approach** would shift toward a 40/30/20/10 split (equities/bonds/alternatives/cash).\n\nKey adjustments:\n- Reduce NVDA and AAPL by 5% each\n- Add 5% to BND and 5% to a short-term treasury ETF (SHV)\n- Consider adding 3% international exposure via VXUS\n\nThis would bring your health score from **72 to ~81** while maintaining growth potential.`,
        };

        const aiMsg: ChatMessage = {
          id: `msg-${Date.now()}-ai`,
          role: 'assistant',
          content: responses.default,
          timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, aiMsg]);
        setIsChatResponding(false);
      }, 1500);
    },
    [activeSkill]
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
            BETA
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-surface-400">
          <span>
            Model: <strong className="text-surface-200">{aiConfig.useCustom ? (aiConfig.customModelName || 'Custom') : aiConfig.model}</strong>
          </span>
          <span className="w-px h-4 bg-surface-700" />
          <span>
            Mode: <strong className="text-surface-200">{aiConfig.mode === 'quick' ? 'Quick' : 'Expert'}</strong>
          </span>
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
            {/* Portfolio Input */}
            <PortfolioInput
              activeSkill={activeSkill}
              portfolio={portfolio}
              onPortfolioChange={setPortfolio}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              hasReport={!!report}
            />

            {/* Report */}
            {(isGenerating || report) && (
              <ReportView
                report={report || demoReport}
                isExpert={aiConfig.mode === 'expert'}
                loading={isGenerating}
                loadingStep={loadingStep}
              />
            )}

            {/* Chat */}
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
