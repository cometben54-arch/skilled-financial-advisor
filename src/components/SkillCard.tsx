import { Heart, BarChart3, Download } from 'lucide-react';
import type { Skill } from '../types';
import { useI18n } from '../i18n';

function downloadSkillMd(skill: Skill, displayName: string, displayDesc: string) {
  const md = `# ${displayName}

> ${displayDesc}

## Tags
${skill.tags.map((tag) => `- ${tag}`).join('\n')}

## Creator
${skill.creator}${skill.isSystem ? ' (Official)' : ' (Community)'}

## Prompt Template

\`\`\`
${skill.promptTemplate}
\`\`\`
`;
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${skill.name.replace(/\s+/g, '_')}_skill.md`;
  a.click();
  URL.revokeObjectURL(url);
}

interface SkillCardProps {
  skill: Skill;
  isActive: boolean;
  onSelect: (skill: Skill) => void;
  onLike: (skillId: string) => void;
}

export function SkillCard({ skill, isActive, onSelect, onLike }: SkillCardProps) {
  const { t } = useI18n();
  const displayName = skill.nameKey ? t(skill.nameKey) : skill.name;
  const displayDesc = skill.descriptionKey ? t(skill.descriptionKey) : skill.description;

  return (
    <button
      onClick={() => onSelect(skill)}
      className={`w-full text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer group ${
        isActive
          ? 'border-primary-500 bg-primary-500/10 shadow-lg shadow-primary-500/10'
          : 'border-surface-700/50 bg-surface-800/50 hover:border-surface-500 hover:bg-surface-800'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
            isActive
              ? 'bg-primary-500 text-white'
              : 'bg-surface-700 text-surface-300 group-hover:bg-surface-600'
          }`}
        >
          {skill.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm text-surface-100 truncate">
              {displayName}
            </span>
            {skill.isSystem && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary-500/20 text-primary-300 font-medium shrink-0">
                {t('official')}
              </span>
            )}
            {!skill.isSystem && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-500/20 text-accent-300 font-medium shrink-0">
                {t('community')}
              </span>
            )}
          </div>
          <p className="text-xs text-surface-400 mt-0.5 line-clamp-2 leading-relaxed">
            {displayDesc}
          </p>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {skill.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-700/80 text-surface-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-surface-700/50">
        <span className="text-[11px] text-surface-500">
          {t('by')} {skill.creator}
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              downloadSkillMd(skill, displayName, displayDesc);
            }}
            className="flex items-center gap-1 text-xs text-surface-500 hover:text-primary-400 cursor-pointer transition-colors"
            title="Download .md"
          >
            <Download size={12} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike(skill.id);
            }}
            className={`flex items-center gap-1 text-xs cursor-pointer transition-colors ${
              skill.liked ? 'text-red-400' : 'text-surface-500 hover:text-red-400'
            }`}
          >
            <Heart size={12} fill={skill.liked ? 'currentColor' : 'none'} />
            {skill.likes.toLocaleString()}
          </button>
          <span className="flex items-center gap-1 text-xs text-surface-500">
            <BarChart3 size={12} />
            {skill.uses.toLocaleString()}
          </span>
        </div>
      </div>
    </button>
  );
}
