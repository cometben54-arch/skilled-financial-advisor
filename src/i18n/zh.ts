export const zh = {
  // Header
  beta: 'BETA',
  model: '模型',
  mode: '模式',
  quick: '快速',
  expert: '专家',

  // Skill Marketplace
  skillMarketplace: '技能包市场',
  skillMarketplaceDesc: '选择一位投资大师的思维模式',
  searchSkills: '搜索技能包...',
  all: '全部',
  popular: '热门',
  latest: '最新',
  topLiked: '最赞',
  uploadNewSkill: '上传新技能包',
  noSkillsFound: '未找到匹配的技能包',
  official: '官方',
  community: '社区',
  by: '创建者',

  // Upload Modal
  uploadSkillTitle: '上传新技能包',
  skillName: '技能包名称',
  skillNamePlaceholder: '例如：动量交易者',
  description: '描述',
  descriptionPlaceholder: '简述投资哲学...',
  promptTemplate: 'Prompt 模板',
  promptTemplatePlaceholder: '你是一位有特定投资理念的投资顾问...\n\n分析以下持仓：{{portfolio_context}}',
  promptTemplateHint: '(使用 {{portfolio_context}} 作为占位符)',
  tags: '标签',
  addTag: '添加标签',
  addTagPlaceholder: '添加标签...',
  makePublic: '公开此技能包',
  cancel: '取消',
  uploadSkill: '上传技能包',

  // Portfolio Input
  portfolio: '持仓',
  positions: '个持仓',
  collapseInput: '收起输入',
  activeSkillLabel: '当前使用：',
  dragDropText: '拖拽上传持仓截图，或',
  browse: '浏览',
  ocrHint: '支持券商截图 — OCR 将自动提取持仓',
  portfolioQuestions: '持仓与问题',
  portfolioPlaceholder: '输入持仓和问题，例如：\n\nAAPL 25%，MSFT 20%，NVDA 15%\n\n是否需要降低科技股集中度？',
  holdingsDetail: '持仓明细',
  addPosition: '添加持仓',
  ticker: '代码',
  name: '名称',
  weightPct: '占比%',
  cost: '成本',
  generateAdvice: '生成建议',
  analyzingPortfolio: '正在分析持仓...',
  selectSkillFirst: '请先从技能包市场选择一个技能包',

  // Report
  analysisReport: '分析报告',
  copy: '复制',
  copied: '已复制！',
  share: '分享',
  sectorAllocation: '行业配置',
  riskProfile: '风险画像',
  healthScore: '健康评分',
  strong: '优秀',
  moderate: '中等',
  needsWork: '待改善',
  shortTermActions: '短期操作建议（1-3个月）',
  longTermView: '长期资产配置观点（1-3年）',
  riskWarnings: '风险提示',
  allocation: '配置',

  // Loading
  parsingHoldings: '正在解析持仓...',
  evaluatingRisk: '正在评估风险指标...',
  generatingRecs: '正在生成建议...',
  expertModeHint: '专家模式可能需要更多时间',

  // AI Config
  aiEngine: 'AI 引擎',
  aiEngineDesc: '配置模型与分析模式',
  defaultModel: '默认模型',
  freeCredits: '免费额度',
  useYourOwnKey: '使用自定义密钥',
  apiEndpoint: 'API 端点 URL',
  apiKey: 'API 密钥',
  modelName: '模型名称',
  testConnection: '测试连接',
  testing: '测试中...',
  connected: '已连接！',
  connectionFailed: '失败 — 请检查凭据',
  keyStorageHint: '密钥仅保存在浏览器 localStorage（加密存储）',
  analysisMode: '分析模式',
  quickMode: '快速',
  quickModeDesc: '结构化 JSON，单次调用',
  expertMode: '专家',
  expertModeDesc: '思维链，多步推理',
  quickModeDetail: '快速模式：限制 Token 输出，单次 LLM 调用返回结构化建议。适合快速持仓扫描。',
  expertModeDetail: '专家模式：启用思维链推理，支持多步分析。可能触发额外 API 调用（新闻搜索、指标计算）。输出详细研报风格报告。',

  // Chat
  followUpDiscussion: '追问与讨论',
  contextLabel: '上下文：当前分析会话',
  askFollowUp: '针对分析结果提出追问',
  askPlaceholder: '输入追问问题...',
  suggestedQ1: '如果我想更保守一点呢？',
  suggestedQ2: '5年期视角下会有什么变化？',
  suggestedQ3: '是否需要加入加密货币？',

  // Actions
  buy: '买入',
  sell: '卖出',
  hold: '持有',

  // Skill descriptions (presets)
  skill_buffett_name: '沃伦·巴菲特',
  skill_buffett_desc: '价值投资 — 关注内在价值、护城河与安全边际',
  skill_cathie_name: '凯瑟琳·伍德',
  skill_cathie_desc: '颠覆式创新 — AI、基因组学、金融科技、机器人、储能',
  skill_bridgewater_name: '桥水全天候',
  skill_bridgewater_desc: '风险平价 — 跨经济周期均衡配置',
  skill_swensen_name: '大卫·斯文森',
  skill_swensen_desc: '耶鲁捐赠基金模式 — 另类资产多元化配置与再平衡',
  skill_lynch_name: '彼得·林奇',
  skill_lynch_desc: '合理价格成长 — 投资你了解的，关注 PEG 比率',
  skill_bogle_name: '约翰·博格',
  skill_bogle_desc: '指数投资 — 低成本、广泛分散、坚持到底',

  // Demo report translations
  demo_summary: '基于**沃伦·巴菲特的价值投资**理念，您的持仓包含优质企业，但科技板块集中度过高。尽管苹果和微软等公司具有持久的竞争护城河，但在当前估值下 60% 的科技配置违反了安全边际原则。建议逐步再平衡至更多元化的配置，纳入低估值板块和保护性固收仓位。',
  demo_longTerm: `**资产配置方案（1-3年期）**

您的持仓高度偏向大型科技股（合计权重 60%）。虽然都是具有持久竞争优势的优质企业，但集中度在板块轮动时会带来显著回撤风险。

**建议目标配置：**
- 科技：35-40%（从 60% 下调）
- 宽基/国际市场：20%（从 8% 上调）
- 固定收益：15-20%（从 5% 上调）
- 实物资产（REITs、大宗商品）：5-10%（新增配置）
- 医疗/防御板块：10%（从 7% 上调）

**理由：** 当前市场周期有利于逐步分散化。科技股估值已大幅扩张，更均衡的配置将在完整市场周期中提供更好的风险调整后收益，同时保持上行参与度。`,
  demo_actions: [
    { action: 'sell', ticker: 'NVDA', detail: '减仓 5% — 当前估值下持仓已超过单只股票集中度阈值' },
    { action: 'buy', ticker: 'VTI', detail: '加仓 3% — 增加宽基分散化以降低个股风险' },
    { action: 'buy', ticker: 'BND', detail: '加仓 5% — 增加固收配置以提升持仓稳定性' },
    { action: 'buy', ticker: 'GLD', detail: '建仓 3% — 增加通胀对冲和非相关资产' },
    { action: 'hold', ticker: 'AAPL', detail: '维持持仓 — 强劲现金流、合理估值、股票回购计划' },
  ] as const,
  demo_risks: [
    '板块集中：60% 科技敞口在板块轮动时存在显著回撤风险',
    '固收偏低：5% 债券配置不足以维持持仓稳定 — 中等风险偏好建议 15-20%',
    '缺乏国际分散：100% 美股配置错失全球增长机会，增加地域集中风险',
    '通胀保护不足：无实物资产或 TIPS 配置，持仓易受持续通胀影响',
  ],
  demo_chatResponse: '好问题！基于**{skill}**框架和您的持仓分析：\n\n您持仓 60% 的科技集中度确实存在较大风险。更**保守的方案**建议调整为 40/30/20/10 的配比（股票/债券/另类/现金）。\n\n关键调整：\n- 分别减持 NVDA 和 AAPL 各 5%\n- 增加 5% BND 和 5% 短期国债 ETF（SHV）\n- 考虑通过 VXUS 增加 3% 国际市场敞口\n\n这将使您的健康评分从 **72 提升至约 81**，同时保持增长潜力。',

  // Sector names
  sector_tech: '科技',
  sector_consumer: '消费',
  sector_financials: '金融',
  sector_healthcare: '医疗',
  sector_broadMarket: '宽基市场',
  sector_fixedIncome: '固定收益',

  // Risk metrics
  metric_concentration: '集中度',
  metric_volatility: '波动性',
  metric_diversification: '分散化',
  metric_incomeYield: '收益率',
  metric_downsideProtection: '下行保护',

  // Admin panel
  adminSettings: '管理员设置',
  adminPasswordPrompt: '请输入管理员密码',
  adminPasswordPlaceholder: '输入密码...',
  adminLogin: '登录',
  adminPasswordWrong: '密码错误，请重试',
  adminModelDesc: '配置默认 AI 模型和 API 密钥。未配置 API 的模型不会显示在前端。',
  adminAddModel: '添加模型',
  adminNoModels: '暂无配置的模型。点击"添加模型"开始配置。',
  adminModelName: '模型名称',
  adminProvider: '提供商',
  adminModelId: '模型 ID',
  adminSave: '保存',
  adminEdit: '编辑',
  adminSetDefault: '设为默认',

  // Investment quotes
  quote_1: '"价格是你付出的，价值是你得到的。" —— 沃伦·巴菲特',
  quote_2: '"投资中最重要的品质不是智力，而是性格。" —— 沃伦·巴菲特',
  quote_3: '"在别人贪婪时恐惧，在别人恐惧时贪婪。" —— 沃伦·巴菲特',
  quote_4: '"股市是将钱从没有耐心的人转移到有耐心的人手中的工具。" —— 沃伦·巴菲特',
  quote_5: '"认识你自己的无知是知识的黎明。" —— 查理·芒格',
  quote_6: '"分散投资是对无知的保护。" —— 沃伦·巴菲特',
  quote_7: '"时间是优秀企业的朋友，平庸企业的敌人。" —— 沃伦·巴菲特',
  quote_8: '"市场短期是投票机，长期是称重机。" —— 本杰明·格雷厄姆',
  quote_9: '"最好的投资就是投资自己。" —— 沃伦·巴菲特',
  quote_10: '"复利是世界第八大奇迹。" —— 阿尔伯特·爱因斯坦',
} as const;

export type TranslationKey = keyof typeof zh;
