import { useState } from 'react';
import { Search, SlidersHorizontal, Plus, X, TrendingUp } from 'lucide-react';
import type { Skill, SortMode } from '../types';
import { SkillCard } from './SkillCard';
import { useI18n } from '../i18n';

interface SkillMarketplaceProps {
  skills: Skill[];
  activeSkill: Skill | null;
  onSelectSkill: (skill: Skill) => void;
  onLikeSkill: (skillId: string) => void;
  onUploadSkill: (skill: Omit<Skill, 'id' | 'likes' | 'uses' | 'liked' | 'isSystem' | 'creator'>) => void;
}

export function SkillMarketplace({
  skills,
  activeSkill,
  onSelectSkill,
  onLikeSkill,
  onUploadSkill,
}: SkillMarketplaceProps) {
  const { t } = useI18n();
  const [search, setSearch] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('popular');
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const allTags = Array.from(new Set(skills.flatMap((s) => s.tags)));

  const filteredSkills = skills
    .filter((s) => {
      const name = s.nameKey ? t(s.nameKey) : s.name;
      const desc = s.descriptionKey ? t(s.descriptionKey) : s.description;
      const q = search.toLowerCase();
      const matchesSearch =
        name.toLowerCase().includes(q) ||
        desc.toLowerCase().includes(q) ||
        s.tags.some((tag) => tag.toLowerCase().includes(q));
      const matchesTag = !filterTag || s.tags.includes(filterTag);
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      if (sortMode === 'popular') return b.uses + b.likes - (a.uses + a.likes);
      if (sortMode === 'most-liked') return b.likes - a.likes;
      return 0;
    });

  return (
    <div className="h-full flex flex-col bg-surface-900/50 border-r border-surface-800">
      {/* Header */}
      <div className="p-4 border-b border-surface-800">
        <h2 className="text-sm font-bold text-surface-100 flex items-center gap-2">
          <TrendingUp size={16} className="text-primary-400" />
          {t('skillMarketplace')}
        </h2>
        <p className="text-[11px] text-surface-500 mt-0.5">
          {t('skillMarketplaceDesc')}
        </p>
      </div>

      {/* Search */}
      <div className="p-3 space-y-2 border-b border-surface-800">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-surface-500" />
          <input
            type="text"
            placeholder={t('searchSkills')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs bg-surface-800 border border-surface-700 rounded-lg text-surface-200 placeholder-surface-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30"
          />
        </div>

        {/* Tag filters */}
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setFilterTag(null)}
            className={`text-[10px] px-2 py-1 rounded-full transition-colors cursor-pointer ${
              !filterTag
                ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                : 'bg-surface-800 text-surface-400 border border-surface-700 hover:border-surface-600'
            }`}
          >
            {t('all')}
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag(filterTag === tag ? null : tag)}
              className={`text-[10px] px-2 py-1 rounded-full transition-colors cursor-pointer ${
                filterTag === tag
                  ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                  : 'bg-surface-800 text-surface-400 border border-surface-700 hover:border-surface-600'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1">
          <SlidersHorizontal size={11} className="text-surface-500" />
          {[
            { key: 'popular' as const, labelKey: 'popular' },
            { key: 'newest' as const, labelKey: 'latest' },
            { key: 'most-liked' as const, labelKey: 'topLiked' },
          ].map(({ key, labelKey }) => (
            <button
              key={key}
              onClick={() => setSortMode(key)}
              className={`text-[10px] px-2 py-0.5 rounded transition-colors cursor-pointer ${
                sortMode === key
                  ? 'bg-surface-700 text-surface-200'
                  : 'text-surface-500 hover:text-surface-300'
              }`}
            >
              {t(labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* Skill list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredSkills.map((skill) => (
          <SkillCard
            key={skill.id}
            skill={skill}
            isActive={activeSkill?.id === skill.id}
            onSelect={onSelectSkill}
            onLike={onLikeSkill}
          />
        ))}
        {filteredSkills.length === 0 && (
          <div className="text-center py-8 text-surface-500 text-xs">
            {t('noSkillsFound')}
          </div>
        )}
      </div>

      {/* Upload button */}
      <div className="p-3 border-t border-surface-800">
        <button
          onClick={() => setShowUpload(true)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-medium rounded-lg bg-primary-600 hover:bg-primary-500 text-white transition-colors cursor-pointer"
        >
          <Plus size={14} />
          {t('uploadNewSkill')}
        </button>
      </div>

      {/* Upload modal */}
      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSubmit={(data) => {
            onUploadSkill(data);
            setShowUpload(false);
          }}
        />
      )}
    </div>
  );
}

function UploadModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (data: Omit<Skill, 'id' | 'likes' | 'uses' | 'liked' | 'isSystem' | 'creator'>) => void;
}) {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [promptTemplate, setPromptTemplate] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [, setIsPublic] = useState(true);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-900 border border-surface-700 rounded-2xl w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-surface-800">
          <h3 className="text-sm font-bold text-surface-100">{t('uploadSkillTitle')}</h3>
          <button onClick={onClose} className="text-surface-500 hover:text-surface-300 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-surface-300 mb-1">{t('skillName')}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('skillNamePlaceholder')}
              className="w-full px-3 py-2 text-sm bg-surface-800 border border-surface-700 rounded-lg text-surface-200 placeholder-surface-500 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-surface-300 mb-1">{t('description')}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('descriptionPlaceholder')}
              rows={2}
              className="w-full px-3 py-2 text-sm bg-surface-800 border border-surface-700 rounded-lg text-surface-200 placeholder-surface-500 focus:outline-none focus:border-primary-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-surface-300 mb-1">
              {t('promptTemplate')}
              <span className="text-surface-500 font-normal ml-1">
                {t('promptTemplateHint')}
              </span>
            </label>
            <textarea
              value={promptTemplate}
              onChange={(e) => setPromptTemplate(e.target.value)}
              placeholder={t('promptTemplatePlaceholder')}
              rows={6}
              className="w-full px-3 py-2 text-sm bg-surface-800 border border-surface-700 rounded-lg text-surface-200 placeholder-surface-500 focus:outline-none focus:border-primary-500 resize-none font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-surface-300 mb-1">{t('tags')}</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder={t('addTagPlaceholder')}
                className="flex-1 px-3 py-2 text-sm bg-surface-800 border border-surface-700 rounded-lg text-surface-200 placeholder-surface-500 focus:outline-none focus:border-primary-500"
              />
              <button
                onClick={handleAddTag}
                className="px-3 py-2 text-xs bg-surface-700 rounded-lg text-surface-300 hover:bg-surface-600 cursor-pointer"
              >
                {t('addTag')}
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-300 flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => setTags(tags.filter((tt) => tt !== tag))}
                      className="hover:text-white cursor-pointer"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4 rounded border-surface-600 bg-surface-800 text-primary-500 focus:ring-primary-500/30"
            />
            <span className="text-xs text-surface-300">{t('makePublic')}</span>
          </label>
        </div>

        <div className="p-4 border-t border-surface-800 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-xs font-medium rounded-lg bg-surface-800 text-surface-300 hover:bg-surface-700 cursor-pointer"
          >
            {t('cancel')}
          </button>
          <button
            onClick={() => {
              if (name && promptTemplate) {
                onSubmit({
                  name,
                  description,
                  promptTemplate,
                  tags,
                  icon: name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
                });
              }
            }}
            disabled={!name || !promptTemplate}
            className="flex-1 py-2.5 text-xs font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {t('uploadSkill')}
          </button>
        </div>
      </div>
    </div>
  );
}
