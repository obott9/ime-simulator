const FONTS = [
  { value: 'system-ui', label: 'System Default' },
  { value: 'monospace', label: 'Monospace' },
  { value: 'serif', label: 'Serif' },
  { value: 'sans-serif', label: 'Sans-serif' },
  { value: '"Courier New", monospace', label: 'Courier New' },
  { value: '"Georgia", serif', label: 'Georgia' },
];

export default function ClockSettings({ settings, onUpdate }) {
  const { mode, textColor, font, fontSize, windowSize, showDate } = settings;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
        Clock Settings
      </h3>

      {/* Mode toggle */}
      <div className="flex items-center justify-between">
        <label className="text-sm text-gray-400">Mode</label>
        <div className="flex bg-gray-700 rounded-lg overflow-hidden">
          {['analog', 'digital'].map((m) => (
            <button
              key={m}
              onClick={() => onUpdate('mode', m)}
              className={`px-3 py-1.5 text-sm capitalize cursor-pointer transition-colors ${
                mode === m ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Text color */}
      <div className="flex items-center justify-between">
        <label className="text-sm text-gray-400">Text Color</label>
        <input
          type="color"
          value={textColor}
          onChange={(e) => onUpdate('textColor', e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
        />
      </div>

      {/* Font (digital only) */}
      {mode === 'digital' && (
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-400">Font</label>
          <select
            value={font}
            onChange={(e) => onUpdate('font', e.target.value)}
            className="bg-gray-700 text-white text-sm rounded px-2 py-1.5 border border-gray-600"
          >
            {FONTS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Font size (digital only) */}
      {mode === 'digital' && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm text-gray-400">Font Size</label>
            <span className="text-sm text-gray-500">{fontSize}pt</span>
          </div>
          <input
            type="range"
            min="8"
            max="72"
            value={fontSize}
            onChange={(e) => onUpdate('fontSize', Number(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>
      )}

      {/* Window size */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm text-gray-400">Window Size</label>
          <span className="text-sm text-gray-500">{windowSize}px</span>
        </div>
        <input
          type="range"
          min="50"
          max="300"
          value={windowSize}
          onChange={(e) => onUpdate('windowSize', Number(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>

      {/* Show date */}
      <div className="flex items-center justify-between">
        <label className="text-sm text-gray-400">Show Date</label>
        <button
          onClick={() => onUpdate('showDate', !showDate)}
          className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
            showDate ? 'bg-blue-600' : 'bg-gray-600'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
              showDate ? 'translate-x-5' : ''
            }`}
          />
        </button>
      </div>
    </div>
  );
}
