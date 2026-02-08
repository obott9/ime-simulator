import ClockSettings from './ClockSettings';
import IndicatorSettings from './IndicatorSettings';

export default function SettingsPanel({
  settings,
  updateClock,
  updateIndicator,
  updateIndicatorColor,
  resetSettings,
}) {
  return (
    <div className="space-y-6 p-4">
      <ClockSettings settings={settings.clock} onUpdate={updateClock} />

      <hr className="border-gray-700" />

      <IndicatorSettings
        settings={settings.indicator}
        onUpdate={updateIndicator}
        onColorChange={updateIndicatorColor}
      />

      <hr className="border-gray-700" />

      <button
        onClick={resetSettings}
        className="w-full py-2 text-sm text-gray-400 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
      >
        Reset to Defaults
      </button>
    </div>
  );
}
