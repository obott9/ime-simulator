import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../contexts/AuthContext';
import ShareDialog from './ShareDialog';

export default function PresetManager({
  defaultPresets,
  popularPresets,
  myPresets,
  myLikes,
  loading,
  activePresetId,
  isDirty,
  settings,
  onLoad,
  onSave,
  onUpdate,
  onDelete,
  onShare,
  onLike,
}) {
  const { t } = useTranslation();
  const { user } = useAuthContext();
  const [saveName, setSaveName] = useState('');
  const [showSave, setShowSave] = useState(false);
  const [shareCode, setShareCode] = useState(null);
  const [operationLoading, setOperationLoading] = useState(null);

  const handleSave = async () => {
    if (!saveName.trim()) return;
    setOperationLoading('save');
    try {
      await onSave(saveName.trim(), settings);
      setSaveName('');
      setShowSave(false);
    } catch {
      // error handled upstream
    }
    setOperationLoading(null);
  };

  const handleUpdate = async (preset) => {
    setOperationLoading(preset.id);
    try {
      await onUpdate(preset.id, preset.name, settings);
    } catch {
      // error handled upstream
    }
    setOperationLoading(null);
  };

  const handleDelete = async (id) => {
    setOperationLoading(id);
    try {
      await onDelete(id);
    } catch {
      // error handled upstream
    }
    setOperationLoading(null);
  };

  const handleShare = async (id) => {
    setOperationLoading(id);
    try {
      const code = await onShare(id);
      if (code) setShareCode(code);
    } catch {
      // error handled upstream
    }
    setOperationLoading(null);
  };

  const handleLike = async (id) => {
    try {
      await onLike(id);
    } catch {
      // error handled upstream
    }
  };

  const PresetCard = ({ preset, showActions = false }) => {
    const isActive = preset.id === activePresetId;
    return (
      <div
        className={`flex items-center justify-between p-2.5 rounded-lg border transition-colors ${
          isActive
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-gray-700 bg-gray-800/50 hover:bg-gray-800'
        }`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-white truncate">{preset.name}</span>
            {isActive && (
              <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                {isDirty ? t('presets.modified') : t('presets.active')}
              </span>
            )}
          </div>
          {preset.likes_count > 0 && (
            <span className="text-[10px] text-gray-500">
              {preset.likes_count} {t('presets.likesCount')}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-2">
          {/* Like button */}
          {user && !preset.is_default && preset.share_code && preset.user_id !== user?.id && (
            <button
              onClick={() => handleLike(preset.id)}
              className={`p-1 rounded cursor-pointer transition-colors ${
                myLikes.has(preset.id)
                  ? 'text-red-400 hover:text-red-300'
                  : 'text-gray-500 hover:text-red-400'
              }`}
              title={t('presets.like')}
            >
              <svg className="w-4 h-4" fill={myLikes.has(preset.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          )}

          {/* Load button */}
          <button
            onClick={() => onLoad(preset.id, preset.settings)}
            className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 cursor-pointer transition-colors"
          >
            {t('presets.load')}
          </button>

          {showActions && (
            <>
              {/* Update button (when active and dirty) */}
              {isActive && isDirty && (
                <button
                  onClick={() => handleUpdate(preset)}
                  disabled={operationLoading === preset.id}
                  className="px-2 py-1 text-xs bg-green-600/80 text-white rounded hover:bg-green-600 cursor-pointer transition-colors disabled:opacity-50"
                >
                  {t('presets.update')}
                </button>
              )}

              {/* Share button */}
              <button
                onClick={() => handleShare(preset.id)}
                disabled={operationLoading === preset.id}
                className="p-1 text-gray-500 hover:text-blue-400 cursor-pointer transition-colors disabled:opacity-50"
                title={t('presets.share')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>

              {/* Delete button */}
              <button
                onClick={() => handleDelete(preset.id)}
                disabled={operationLoading === preset.id}
                className="p-1 text-gray-500 hover:text-red-400 cursor-pointer transition-colors disabled:opacity-50"
                title={t('presets.delete')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* My Presets */}
      {user && (
        <section>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-300">{t('presets.myPresets')}</h3>
            <button
              onClick={() => setShowSave(!showSave)}
              className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer"
            >
              {showSave ? t('presets.cancel') : t('presets.saveNew')}
            </button>
          </div>

          {showSave && (
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder={t('presets.namePlaceholder')}
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              />
              <button
                onClick={handleSave}
                disabled={!saveName.trim() || operationLoading === 'save'}
                className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-500 disabled:opacity-50 cursor-pointer transition-colors"
              >
                {t('presets.save')}
              </button>
            </div>
          )}

          {myPresets.length > 0 ? (
            <div className="space-y-1.5">
              {myPresets.map((p) => (
                <PresetCard key={p.id} preset={p} showActions />
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-600 py-2">{t('presets.noMyPresets')}</p>
          )}
        </section>
      )}

      {/* Default Presets */}
      <section>
        <h3 className="text-sm font-semibold text-gray-300 mb-2">{t('presets.defaultPresets')}</h3>
        <div className="space-y-1.5">
          {defaultPresets.map((p) => (
            <PresetCard key={p.id} preset={p} />
          ))}
        </div>
      </section>

      {/* Popular Presets */}
      {popularPresets.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-gray-300 mb-2">{t('presets.popularPresets')}</h3>
          <div className="space-y-1.5">
            {popularPresets.map((p) => (
              <PresetCard key={p.id} preset={p} />
            ))}
          </div>
        </section>
      )}

      {/* Login prompt for unauthenticated users */}
      {!user && (
        <p className="text-xs text-gray-500 text-center py-2">{t('presets.loginToSave')}</p>
      )}

      {shareCode && (
        <ShareDialog shareCode={shareCode} onClose={() => setShareCode(null)} />
      )}
    </div>
  );
}
