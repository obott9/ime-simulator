import Header from './components/Header';
import Footer from './components/Footer';
import ClockPreview from './components/ClockPreview';
import IMEIndicator from './components/IMEIndicator';
import LanguageSwitcher from './components/LanguageSwitcher';
import SettingsPanel from './components/SettingsPanel';
import useSettings from './hooks/useSettings';

export default function App() {
  const {
    settings,
    currentLang,
    setCurrentLang,
    backgroundColor,
    languageLabel,
    updateClock,
    updateIndicator,
    updateIndicatorColor,
    resetSettings,
  } = useSettings();

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
            resetSettings={resetSettings}
          />
        </aside>

        {/* Preview Area */}
        <section className="flex-1 flex flex-col items-center justify-center gap-8 p-8 order-1 lg:order-2">
          <ClockPreview settings={settings} backgroundColor={backgroundColor} />

          <div className="flex flex-col items-center gap-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              IME Indicator
            </h2>
            <IMEIndicator
              label={languageLabel}
              backgroundColor={backgroundColor}
              size={settings.indicator.size}
              opacity={settings.indicator.opacity}
            />
          </div>

          <LanguageSwitcher currentLang={currentLang} onLangChange={setCurrentLang} />

          <p className="text-xs text-gray-600 text-center max-w-md">
            * Actual IME auto-detection requires the desktop app.{' '}
            <a
              href="https://obott9.github.io/imeindicatorclock.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-400"
            >
              Download here
            </a>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
