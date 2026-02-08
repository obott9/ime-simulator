const LANG_NAMES = {
  ja: 'Japanese',
  en: 'English',
  ko: 'Korean',
  'zh-Hant': 'Traditional Chinese',
  'zh-Hans': 'Simplified Chinese',
};

export default function IndicatorSettings({
  settings,
  onUpdate,
  onColorChange,
}) {
  const { colors, size, opacity } = settings;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
        Indicator Settings
      </h3>

      {/* Language colors */}
      <div className="space-y-2">
        <label className="text-sm text-gray-400">Background Colors</label>
        {Object.entries(colors).map(([lang, color]) => (
          <div key={lang} className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{LANG_NAMES[lang]}</span>
            <input
              type="color"
              value={color}
              onChange={(e) => onColorChange(lang, e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
            />
          </div>
        ))}
      </div>

      {/* Size */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm text-gray-400">Size</label>
          <span className="text-sm text-gray-500">{size}px</span>
        </div>
        <input
          type="range"
          min="20"
          max="100"
          value={size}
          onChange={(e) => onUpdate('size', Number(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>

      {/* Opacity */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm text-gray-400">Opacity</label>
          <span className="text-sm text-gray-500">{opacity}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={opacity}
          onChange={(e) => onUpdate('opacity', Number(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>
    </div>
  );
}
