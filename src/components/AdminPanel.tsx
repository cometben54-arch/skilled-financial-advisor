import { useState } from 'react';
import { Settings, X, Plus, Trash2, Save, Lock } from 'lucide-react';
import { useI18n } from '../i18n';

export interface AdminModelConfig {
  id: string;
  name: string;
  provider: string;
  apiEndpoint: string;
  apiKey: string;
  modelId: string;
  isDefault: boolean;
}

const ADMIN_PASSWORD = 'W@ng2BO';
const STORAGE_KEY = 'pp-admin-models';

function loadAdminModels(): AdminModelConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAdminModels(models: AdminModelConfig[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(models));
}

export function useAdminModels() {
  const [models, setModels] = useState<AdminModelConfig[]>(loadAdminModels);

  const update = (newModels: AdminModelConfig[]) => {
    setModels(newModels);
    saveAdminModels(newModels);
  };

  return { models, update };
}

export function AdminPanel() {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [models, setModels] = useState<AdminModelConfig[]>(loadAdminModels);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleSave = (model: AdminModelConfig) => {
    const updated = models.some((m) => m.id === model.id)
      ? models.map((m) => (m.id === model.id ? model : m))
      : [...models, model];
    setModels(updated);
    saveAdminModels(updated);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    const updated = models.filter((m) => m.id !== id);
    setModels(updated);
    saveAdminModels(updated);
  };

  const handleAdd = () => {
    const newModel: AdminModelConfig = {
      id: `admin-${Date.now()}`,
      name: '',
      provider: '',
      apiEndpoint: '',
      apiKey: '',
      modelId: '',
      isDefault: models.length === 0,
    };
    setModels([...models, newModel]);
    setEditingId(newModel.id);
  };

  const handleSetDefault = (id: string) => {
    const updated = models.map((m) => ({ ...m, isDefault: m.id === id }));
    setModels(updated);
    saveAdminModels(updated);
  };

  return (
    <>
      {/* Gear button — fixed bottom right */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-11 h-11 rounded-full bg-surface-800 border border-surface-700 hover:border-primary-500 hover:bg-surface-700 flex items-center justify-center text-surface-400 hover:text-primary-400 shadow-lg transition-all cursor-pointer z-40"
        title={t('adminSettings') || 'Admin Settings'}
      >
        <Settings size={18} />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-surface-900 border border-surface-700 rounded-2xl w-full max-w-2xl mx-4 max-h-[85vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-surface-800">
              <h3 className="text-sm font-bold text-surface-100 flex items-center gap-2">
                <Settings size={16} className="text-primary-400" />
                {t('adminSettings')}
              </h3>
              <button
                onClick={() => { setIsOpen(false); setIsAuthenticated(false); setPassword(''); }}
                className="text-surface-500 hover:text-surface-300 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {!isAuthenticated ? (
                <div className="flex flex-col items-center gap-4 py-8">
                  <Lock size={32} className="text-surface-500" />
                  <p className="text-sm text-surface-300">{t('adminPasswordPrompt')}</p>
                  <div className="flex gap-2 w-64">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setPasswordError(false); }}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                      placeholder={t('adminPasswordPlaceholder')}
                      className={`flex-1 px-3 py-2 text-sm bg-surface-800 border rounded-lg text-surface-200 placeholder-surface-500 focus:outline-none ${
                        passwordError ? 'border-red-500' : 'border-surface-700 focus:border-primary-500'
                      }`}
                    />
                    <button
                      onClick={handleLogin}
                      className="px-4 py-2 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-500 cursor-pointer"
                    >
                      {t('adminLogin')}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-xs text-red-400">{t('adminPasswordWrong')}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-surface-400">{t('adminModelDesc')}</p>
                    <button
                      onClick={handleAdd}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-500 cursor-pointer"
                    >
                      <Plus size={12} />
                      {t('adminAddModel')}
                    </button>
                  </div>

                  {models.length === 0 && (
                    <div className="text-center py-8 text-surface-500 text-xs">
                      {t('adminNoModels')}
                    </div>
                  )}

                  {models.map((model) => (
                    <ModelRow
                      key={model.id}
                      model={model}
                      isEditing={editingId === model.id}
                      onEdit={() => setEditingId(model.id)}
                      onSave={handleSave}
                      onDelete={handleDelete}
                      onSetDefault={handleSetDefault}
                      onCancel={() => {
                        if (!model.name) {
                          handleDelete(model.id);
                        }
                        setEditingId(null);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ModelRow({
  model,
  isEditing,
  onEdit,
  onSave,
  onDelete,
  onSetDefault,
  onCancel,
}: {
  model: AdminModelConfig;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (model: AdminModelConfig) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  onCancel: () => void;
}) {
  const { t } = useI18n();
  const [draft, setDraft] = useState(model);

  if (isEditing) {
    return (
      <div className="p-4 bg-surface-800/50 border border-surface-700 rounded-xl space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] text-surface-400 mb-1">{t('adminModelName')}</label>
            <input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="Claude Sonnet 4.6"
              className="w-full px-2.5 py-2 text-xs bg-surface-800 border border-surface-700 rounded-lg text-surface-200 placeholder-surface-500 focus:outline-none focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-[11px] text-surface-400 mb-1">{t('adminProvider')}</label>
            <input
              value={draft.provider}
              onChange={(e) => setDraft({ ...draft, provider: e.target.value })}
              placeholder="Anthropic"
              className="w-full px-2.5 py-2 text-xs bg-surface-800 border border-surface-700 rounded-lg text-surface-200 placeholder-surface-500 focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-[11px] text-surface-400 mb-1">{t('apiEndpoint')}</label>
          <input
            value={draft.apiEndpoint}
            onChange={(e) => setDraft({ ...draft, apiEndpoint: e.target.value })}
            placeholder="https://api.anthropic.com/v1"
            className="w-full px-2.5 py-2 text-xs bg-surface-800 border border-surface-700 rounded-lg text-surface-200 placeholder-surface-500 focus:outline-none focus:border-primary-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] text-surface-400 mb-1">{t('apiKey')}</label>
            <input
              type="password"
              value={draft.apiKey}
              onChange={(e) => setDraft({ ...draft, apiKey: e.target.value })}
              placeholder="sk-..."
              className="w-full px-2.5 py-2 text-xs bg-surface-800 border border-surface-700 rounded-lg text-surface-200 placeholder-surface-500 focus:outline-none focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-[11px] text-surface-400 mb-1">{t('adminModelId')}</label>
            <input
              value={draft.modelId}
              onChange={(e) => setDraft({ ...draft, modelId: e.target.value })}
              placeholder="claude-sonnet-4-6"
              className="w-full px-2.5 py-2 text-xs bg-surface-800 border border-surface-700 rounded-lg text-surface-200 placeholder-surface-500 focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => { if (draft.name) onSave(draft); }}
            disabled={!draft.name}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-500 disabled:opacity-50 cursor-pointer"
          >
            <Save size={12} />
            {t('adminSave')}
          </button>
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-surface-700 text-surface-300 hover:bg-surface-600 cursor-pointer"
          >
            {t('cancel')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-surface-800/30 border border-surface-700/50 rounded-xl">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-surface-200">{model.name}</span>
          <span className="text-[10px] text-surface-500">{model.provider}</span>
          {model.isDefault && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent-500/20 text-accent-300 font-medium">
              DEFAULT
            </span>
          )}
        </div>
        <span className="text-[10px] text-surface-500 block mt-0.5">
          {model.modelId} · {model.apiEndpoint ? new URL(model.apiEndpoint).host : '—'}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        {!model.isDefault && (
          <button
            onClick={() => onSetDefault(model.id)}
            className="text-[10px] px-2 py-1 rounded bg-surface-700 text-surface-400 hover:text-accent-300 cursor-pointer"
          >
            {t('adminSetDefault')}
          </button>
        )}
        <button
          onClick={onEdit}
          className="text-[10px] px-2 py-1 rounded bg-surface-700 text-surface-400 hover:text-primary-300 cursor-pointer"
        >
          {t('adminEdit')}
        </button>
        <button
          onClick={() => onDelete(model.id)}
          className="p-1 text-surface-600 hover:text-red-400 cursor-pointer"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}
