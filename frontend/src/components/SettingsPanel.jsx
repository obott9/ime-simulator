import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ClockSettings from './ClockSettings';
import IndicatorSettings from './IndicatorSettings';
import PresetManager from './PresetManager';

const TABS = ['clock', 'indicator', 'presets'];

export default function SettingsPanel({
  settings,
  updateClock,
  updateIndicator,
  updateIndicatorColor,
  updateIndicatorText,
  resetSettings,
  presetProps,
}) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('clock');

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex border-b border-gray-800 shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-sm font-medium cursor-pointer transition-colors ${
              activeTab === tab
                ? 'text-white border-b-2 border-blue-500 bg-gray-800/50'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {t(`tabs.${tab}`)}
          </button>
        ))}
      </div>

      {/* API connection indicator (visible on all tabs) */}
      {presetProps.loading && activeTab !== 'presets' && (
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border-b border-blue-500/20">
          <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin shrink-0" />
          <span className="text-xs text-blue-400">{t('presets.connecting')}</span>
        </div>
      )}

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'clock' && (
          <div className="space-y-2">
            <ClockSettings settings={settings.clock} onUpdate={updateClock} />
            <button
              onClick={resetSettings}
              className="w-full py-2 text-sm text-gray-400 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer mt-4"
            >
              {t('clock.reset')}
            </button>
          </div>
        )}

        {activeTab === 'indicator' && (
          <div className="space-y-2">
            <IndicatorSettings
              settings={settings.indicator}
              onUpdate={updateIndicator}
              onColorChange={updateIndicatorColor}
              onTextChange={updateIndicatorText}
            />
            <button
              onClick={resetSettings}
              className="w-full py-2 text-sm text-gray-400 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer mt-4"
            >
              {t('indicator.reset')}
            </button>
          </div>
        )}

        {activeTab === 'presets' && (
          <PresetManager settings={settings} {...presetProps} />
        )}
      </div>
    </div>
  );
}
