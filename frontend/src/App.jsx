import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ClockPreview from './components/ClockPreview';
import IMEIndicator from './components/IMEIndicator';
import LanguageSwitcher from './components/LanguageSwitcher';
import SettingsPanel from './components/SettingsPanel';
import useSettings from './hooks/useSettings';
import usePresets from './hooks/usePresets';

export default function App() {
  const { t } = useTranslation();
  const { user } = useAuthContext();
  const {
    settings,
    currentLang,
    setCurrentLang,
    clockBackgroundColor,
    indicatorColor,
    languageLabel,
    updateClock,
    updateIndicator,
    updateIndicatorColor,
    updateIndicatorText,
    resetSettings,
    loadPreset,
    activePresetId,
    isDirty,
  } = useSettings();

  const {
    defaultPresets,
    popularPresets,
    myPresets,
    myLikes,
    loading: presetsLoading,
    savePreset,
    updatePreset,
    deletePreset,
    sharePreset,
    toggleLike,
    fetchByShareCode,
  } = usePresets(user);

  // Handle ?share=xxx query parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shareCode = params.get('share');
    if (!shareCode) return;

    fetchByShareCode(shareCode).then((preset) => {
      if (preset) {
        loadPreset(preset.id, preset.settings);
      }
      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete('share');
      window.history.replaceState({}, '', url.pathname + url.search);
    });
  }, [fetchByShareCode, loadPreset]);

  const presetProps = {
    defaultPresets,
    popularPresets,
    myPresets,
    myLikes,
    loading: presetsLoading,
    activePresetId,
    isDirty,
    onLoad: loadPreset,
    onSave: savePreset,
    onUpdate: updatePreset,
    onDelete: deletePreset,
    onShare: sharePreset,
    onLike: toggleLike,
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      <Header />

      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Settings Panel (sidebar) */}
        <aside className="w-full lg:w-80 bg-gray-900/50 border-b lg:border-b-0 lg:border-r border-gray-800 overflow-y-auto order-2 lg:order-1">
          <SettingsPanel
            settings={settings}
            updateClock={updateClock}
            updateIndicator={updateIndicator}
            updateIndicatorColor={updateIndicatorColor}
            updateIndicatorText={updateIndicatorText}
            resetSettings={resetSettings}
            presetProps={presetProps}
          />
        </aside>

        {/* Preview Area */}
        <section className="flex-1 flex flex-col items-center justify-center gap-8 p-8 order-1 lg:order-2">
          <ClockPreview settings={settings} backgroundColor={clockBackgroundColor} />

          <div className="flex flex-col items-center gap-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              {t('indicator.preview')}
            </h2>
            <IMEIndicator
              label={languageLabel}
              backgroundColor={indicatorColor}
              size={settings.indicator.size}
              fontSizeRatio={settings.indicator.fontSizeRatio}
              opacity={settings.indicator.opacity}
            />
          </div>

          <LanguageSwitcher currentLang={currentLang} onLangChange={setCurrentLang} />

          <p className="text-xs text-gray-600 text-center max-w-md">
            {t('general.desktopNote')}{' '}
            <a
              href="https://obott9.github.io/imeindicatorclock.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-400"
            >
              {t('general.downloadHere')}
            </a>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
