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
  ocrHint: '支持券商截图 — AI 将自动识别并提取持仓',
  ocrProcessing: 'AI 正在识别图片内容...',
  ocrProcessingHint: '正在分析截图并提取持仓数据',
  ocrDetected: '从图片识别到的持仓',
  ocrFailed: '图片识别失败',
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
  demo_summary: '基于**{skillName}**理念，您的持仓包含优质企业，但科技板块集中度过高（60%）。苹果当前交易价格约 $198.36（P/E 32.1x），微软约 $441.20（P/E 36.8x），NVIDIA 约 $124.58（P/E 64.2x）—— 这些估值均高于历史均值。尽管它们具有持久的竞争护城河（品牌、生态系统、AI 基础设施垄断），但在当前估值水平下，60% 的科技配置风险较高。同时，您的固定收益仅占 5%（BND 约 $72.15），远低于稳健配置所需的 15-20%。建议逐步再平衡，纳入低估值板块和保护性固收仓位，以在下一轮市场调整中保持韧性。',
  demo_longTerm: `**资产配置方案（1-3年期）**

您的持仓高度偏向大型科技股（合计权重 60%）。虽然都是具有持久竞争优势的优质企业，但集中度在板块轮动时会带来显著回撤风险。以 2022 年为例，纳斯达克指数下跌 33%，类似配置的持仓将面临远超市场平均水平的回撤。

**当前持仓估值诊断：**
- AAPL $198.36 — P/E 32.1x（5年均值 27x），自由现金流收益率 3.1%，当前估值偏高约 19%
- MSFT $441.20 — P/E 36.8x（5年均值 31x），AI 云业务增长强劲但已计入预期
- NVDA $124.58 — P/E 64.2x，AI 芯片垄断地位稳固，但估值包含大量未来增长预期
- AMZN $198.42 — P/E 58.3x，AWS 利润率持续扩张，电商业务趋于稳定
- JPM $243.80 — P/E 12.1x，估值合理，净息差受益于高利率环境
- JNJ $156.20 — P/E 14.8x，防御性佳，股息率 3.2%，估值具有吸引力

**建议目标配置：**
- 科技：35-40%（从 60% 下调） — 保留核心科技持仓，但减少单只集中度
- 宽基/国际市场：20%（从 8% 上调） — 增加 VXUS（国际）和 VTI（宽基）
- 固定收益：15-20%（从 5% 上调） — BND + 短期国债 ETF（SHV）
- 实物资产（REITs、大宗商品）：5-10%（新增） — VNQ（REITs）+ GLD（黄金）
- 医疗/防御板块：10%（从 7% 上调） — JNJ + XLV（医疗 ETF）

**再平衡路径：** 建议分 3-6 个月逐步调整，而非一次性大幅变动。每月减持科技 3-5%，同步增加固收和国际市场配置。利用市场回调窗口加速再平衡，避免在估值高点追涨。

**理由：** 当前市场周期处于 AI 驱动的科技牛市后期阶段，估值扩张已持续 18 个月。历史数据表明，在此类阶段进行逐步分散化，可在完整市场周期中提供更好的风险调整后收益（夏普比率提升 0.3-0.5），同时保持 70-80% 的上行参与度。`,
  demo_actions: [
    { action: 'sell', ticker: 'NVDA', detail: '减仓 5%（当前 $124.58，P/E 64.2x）— 单只持仓 15% 超出集中度阈值。AI 芯片龙头地位无疑，但当前估值已透支未来 2-3 年增长预期。建议将目标仓位降至 10%，锁定部分利润' },
    { action: 'sell', ticker: 'AAPL', detail: '减仓 3%（当前 $198.36，P/E 32.1x）— iPhone 增长放缓，但服务业务毛利率 72% 提供稳定现金流。将仓位从 25% 降至 22%，释放资金配置至低相关性资产' },
    { action: 'buy', ticker: 'BND', detail: '加仓 5%（当前 $72.15，到期收益率 4.8%）— 当前利率环境下债券收益率处于 15 年高位，锁定高收益同时提供下行保护。目标配置 10%' },
    { action: 'buy', ticker: 'VXUS', detail: '建仓 4%（当前 $57.82）— 新增国际市场敞口。欧洲和新兴市场估值（P/E 13-14x）远低于美股，提供估值修复机会和地域分散化' },
    { action: 'buy', ticker: 'GLD', detail: '建仓 3%（当前 $241.50）— 在地缘政治不确定性和通胀粘性背景下，黄金提供非相关性通胀对冲。央行持续增持黄金储备' },
    { action: 'hold', ticker: 'JPM', detail: '维持持仓（当前 $243.80，P/E 12.1x，股息率 2.1%）— 估值合理，净息差受益于高利率环境，强劲的资本回报计划。银行板块提供与科技股的低相关性分散' },
    { action: 'hold', ticker: 'JNJ', detail: '维持持仓（当前 $156.20，P/E 14.8x，股息率 3.2%）— 防御性龙头，连续 62 年增加股息。在市场回调中提供缓冲，药品管线有多个潜在重磅产品' },
  ] as const,
  demo_risks: [
    '板块集中风险：60% 科技敞口在板块轮动时存在显著回撤风险。2022 年纳斯达克下跌 33%，类似配置将面临 -25% 至 -30% 的最大回撤',
    '估值风险：NVDA P/E 64.2x、MSFT P/E 36.8x 均处于历史高位区间。若 AI 增长预期未能兑现，估值压缩可能导致 20-30% 的回调',
    '固收严重不足：5% 债券配置远低于稳健组合标准（15-20%）。在经济衰退场景中，缺乏固收缓冲将放大整体波动',
    '零国际分散化：100% 美股配置错失全球增长机会（欧洲/新兴市场 P/E 13-14x vs 美股 22x），同时美元走弱时将完全暴露于汇率风险',
    '通胀保护缺失：无实物资产（REITs、大宗商品）或 TIPS 配置。若通胀率维持在 3%+ 水平，实际购买力将持续被侵蚀',
    '个股集中度超标：AAPL（25%）和 NVDA（15%）单只持仓过高，任一公司出现黑天鹅事件（监管、产品问题）将对整体组合造成重大冲击',
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

  // Admin skill management
  adminTabModels: 'AI 模型',
  adminTabSkills: '技能包管理',
  adminSkillDesc: '管理系统默认技能包。可添加、编辑或删除预设投资大师策略。',
  adminAddSkill: '添加技能包',
  adminNoSkills: '暂无技能包。点击"添加技能包"开始。',
  adminResetSkills: '恢复默认',
  adminSkillIcon: '图标',
  adminSkillUntitled: '未命名技能包',
  adminSaving: '同步中...',

  // AI fallback & credits
  aiFallbackNotice: 'AI 接口暂不可用，当前显示的是示例报告。请检查管理员 AI 模型配置',
  creditsExhausted: '免费额度已用完。请在右侧面板"使用自定义密钥"中填入您自己的 API Key 继续使用。',
  loadingActions: '正在生成操作建议...',
  loadingLongTerm: '正在分析长期配置观点...',

  // Report — price & detail
  currentPrice: '当前价格',
  priceAsOf: '截至',
  costBasisLabel: '成本',
  returnPct: '收益率',
  holdingDetail: '持仓明细',

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
