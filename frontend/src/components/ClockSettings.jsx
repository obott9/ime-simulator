import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDate, formatTime, DATE_SAMPLES, TIME_SAMPLES } from '../lib/dateFormat';

const FONTS = [
  { value: 'system-ui', label: 'System Default' },
  { value: 'monospace', label: 'Monospace' },
  { value: 'serif', label: 'Serif' },
  { value: 'sans-serif', label: 'Sans-serif' },
  { value: '"Courier New", monospace', label: 'Courier New' },
  { value: '"Georgia", serif', label: 'Georgia' },
];

function Section({ title, children }) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-800 pb-1">
        {title}
      </h4>
      {children}
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
        value ? 'bg-blue-600' : 'bg-gray-600'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
          value ? 'translate-x-5' : ''
        }`}
      />
    </button>
  );
}

function SamplePicker({ samples, onSelect, formatter, label }) {
  const [open, setOpen] = useState(false);
  const now = new Date();

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer mt-1"
      >
        {label}
      </button>
    );
  }

  return (
    <div className="mt-1 bg-gray-800 rounded border border-gray-600 max-h-40 overflow-y-auto">
      {samples.map((fmt) => (
        <button
          key={fmt}
          onClick={() => { onSelect(fmt); setOpen(false); }}
          className="w-full text-left px-2 py-1 text-xs hover:bg-gray-700 cursor-pointer flex justify-between gap-2"
        >
          <span className="text-gray-400 font-mono">{fmt}</span>
          <span className="text-gray-300">{formatter(now, fmt)}</span>
        </button>
      ))}
    </div>
  );
}

export default function ClockSettings({ settings, onUpdate }) {
  const { t, i18n } = useTranslation();
  const {
    mode, dateTimePosition, showSeconds,
    dateFormatStyle, timeFormatStyle,
    customDateFormat1, customDateFormat2,
    customTimeFormat1, customTimeFormat2,
    useIndicatorColors, bgColorOff, bgColorOn, bgOpacity,
    textColor, analogColor, font, fontSize,
    windowWidth, windowHeight, analogClockSize,
  } = settings;

  const now = new Date();
  const locale = i18n.language;

  const DATE_TIME_POSITIONS = [
    { value: 'dateTimeVertical', label: t('clock.layoutDateTimeVertical') },
    { value: 'dateTimeHorizontal', label: t('clock.layoutDateTimeHorizontal') },
    { value: 'timeDateVertical', label: t('clock.layoutTimeDateVertical') },
    { value: 'timeDateHorizontal', label: t('clock.layoutTimeDateHorizontal') },
    { value: 'dateOnly', label: t('clock.layoutDateOnly') },
    { value: 'timeOnly', label: t('clock.layoutTimeOnly') },
  ];

  const DATE_FORMATS = [
    { value: 'numeric', label: t('clock.dateFormatNumeric') },
    { value: 'abbreviated', label: t('clock.dateFormatAbbreviated') },
    { value: 'long', label: t('clock.dateFormatLong') },
    { value: 'complete', label: t('clock.dateFormatComplete') },
    { value: 'custom1', label: t('clock.dateFormatCustom1') },
    { value: 'custom2', label: t('clock.dateFormatCustom2') },
  ];

  const TIME_FORMATS = [
    { value: 'standard', label: t('clock.timeFormatStandard') },
    { value: 'shortened', label: t('clock.timeFormatShortened') },
    { value: 'complete', label: t('clock.timeFormatComplete') },
    { value: 'custom1', label: t('clock.timeFormatCustom1') },
    { value: 'custom2', label: t('clock.timeFormatCustom2') },
  ];

  return (
    <div className="space-y-5">

      {/* ── Basic ── */}
      <Section title={t('clock.sectionBasic')}>
        {/* Style */}
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-400">{t('clock.style')}</label>
          <div className="flex bg-gray-700 rounded-lg overflow-hidden">
            {['analog', 'digital'].map((m) => (
              <button
                key={m}
                onClick={() => onUpdate('mode', m)}
                className={`px-3 py-1.5 text-sm cursor-pointer transition-colors ${
                  mode === m ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {t(`clock.style${m.charAt(0).toUpperCase() + m.slice(1)}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Content (layout) */}
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-400">{t('clock.content')}</label>
          <select
            value={dateTimePosition}
            onChange={(e) => onUpdate('dateTimePosition', e.target.value)}
            className="bg-gray-700 text-white text-sm rounded px-2 py-1.5 border border-gray-600 max-w-[180px]"
          >
            {DATE_TIME_POSITIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* Show Seconds */}
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-400">{t('clock.showSeconds')}</label>
          <Toggle value={showSeconds} onChange={(v) => onUpdate('showSeconds', v)} />
        </div>
      </Section>

      {/* ── Font ── */}
      <Section title={t('clock.sectionFont')}>
        {/* Font family */}
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-400">{t('clock.fontFamily')}</label>
          <select
            value={font}
            onChange={(e) => onUpdate('font', e.target.value)}
            className="bg-gray-700 text-white text-sm rounded px-2 py-1.5 border border-gray-600"
          >
            {FONTS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* Font size */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm text-gray-400">{t('clock.fontSize')}</label>
            <span className="text-sm text-gray-500">{fontSize}pt</span>
          </div>
          <input
            type="range" min="12" max="100" value={fontSize}
            onChange={(e) => onUpdate('fontSize', Number(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>
      </Section>

      {/* ── Date Format ── */}
      {dateTimePosition !== 'timeOnly' && (
        <Section title={t('clock.sectionDateFormat')}>
          <select
            value={dateFormatStyle}
            onChange={(e) => onUpdate('dateFormatStyle', e.target.value)}
            className="w-full bg-gray-700 text-white text-sm rounded px-2 py-1.5 border border-gray-600"
          >
            {DATE_FORMATS.map(({ value, label }) => {
              const preview = !value.startsWith('custom')
                ? ` — ${formatDate(now, value, customDateFormat1, customDateFormat2, locale)}`
                : '';
              return <option key={value} value={value}>{label}{preview}</option>;
            })}
          </select>
          {dateFormatStyle === 'custom1' && (
            <>
              <input type="text" value={customDateFormat1}
                onChange={(e) => onUpdate('customDateFormat1', e.target.value)}
                placeholder="yyyy/MM/dd E"
                className="w-full bg-gray-700 text-white text-sm rounded px-2 py-1.5 border border-gray-600"
              />
              <SamplePicker samples={DATE_SAMPLES}
                onSelect={(fmt) => onUpdate('customDateFormat1', fmt)}
                formatter={(d, fmt) => formatDate(d, 'custom1', fmt, fmt, locale)}
                label={`${t('clock.samples')} ▼`}
              />
            </>
          )}
          {dateFormatStyle === 'custom2' && (
            <>
              <input type="text" value={customDateFormat2}
                onChange={(e) => onUpdate('customDateFormat2', e.target.value)}
                placeholder="M/d (EEE)"
                className="w-full bg-gray-700 text-white text-sm rounded px-2 py-1.5 border border-gray-600"
              />
              <SamplePicker samples={DATE_SAMPLES}
                onSelect={(fmt) => onUpdate('customDateFormat2', fmt)}
                formatter={(d, fmt) => formatDate(d, 'custom2', fmt, fmt, locale)}
                label={`${t('clock.samples')} ▼`}
              />
            </>
          )}
        </Section>
      )}

      {/* ── Time Format ── */}
      {dateTimePosition !== 'dateOnly' && (
        <Section title={t('clock.sectionTimeFormat')}>
          <select
            value={timeFormatStyle}
            onChange={(e) => onUpdate('timeFormatStyle', e.target.value)}
            className="w-full bg-gray-700 text-white text-sm rounded px-2 py-1.5 border border-gray-600"
          >
            {TIME_FORMATS.map(({ value, label }) => {
              const preview = !value.startsWith('custom')
                ? ` — ${formatTime(now, value, customTimeFormat1, customTimeFormat2, locale)}`
                : '';
              return <option key={value} value={value}>{label}{preview}</option>;
            })}
          </select>
          {timeFormatStyle === 'custom1' && (
            <>
              <input type="text" value={customTimeFormat1}
                onChange={(e) => onUpdate('customTimeFormat1', e.target.value)}
                placeholder="HH:mm:ss"
                className="w-full bg-gray-700 text-white text-sm rounded px-2 py-1.5 border border-gray-600"
              />
              <SamplePicker samples={TIME_SAMPLES}
                onSelect={(fmt) => onUpdate('customTimeFormat1', fmt)}
                formatter={(d, fmt) => formatTime(d, 'custom1', fmt, fmt, locale)}
                label={`${t('clock.samples')} ▼`}
              />
            </>
          )}
          {timeFormatStyle === 'custom2' && (
            <>
              <input type="text" value={customTimeFormat2}
                onChange={(e) => onUpdate('customTimeFormat2', e.target.value)}
                placeholder="H:mm"
                className="w-full bg-gray-700 text-white text-sm rounded px-2 py-1.5 border border-gray-600"
              />
              <SamplePicker samples={TIME_SAMPLES}
                onSelect={(fmt) => onUpdate('customTimeFormat2', fmt)}
                formatter={(d, fmt) => formatTime(d, 'custom2', fmt, fmt, locale)}
                label={`${t('clock.samples')} ▼`}
              />
            </>
          )}
        </Section>
      )}

      {/* ── Color ── */}
      <Section title={t('clock.sectionColor')}>
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-400">{t('clock.textColor')}</label>
          <input type="color" value={textColor}
            onChange={(e) => onUpdate('textColor', e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
          />
        </div>
        {mode === 'analog' && (
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-400">{t('clock.analogColor')}</label>
            <input type="color" value={analogColor}
              onChange={(e) => onUpdate('analogColor', e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
            />
          </div>
        )}

        {/* Use Indicator Colors toggle */}
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-400">{t('clock.useIndicatorColors')}</label>
          <Toggle value={useIndicatorColors} onChange={(v) => onUpdate('useIndicatorColors', v)} />
        </div>

        {/* BG color OFF / ON (only when NOT using indicator colors) */}
        {!useIndicatorColors && (
          <>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-400">{t('clock.bgColorOff')}</label>
              <input type="color" value={bgColorOff}
                onChange={(e) => onUpdate('bgColorOff', e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-400">{t('clock.bgColorOn')}</label>
              <input type="color" value={bgColorOn}
                onChange={(e) => onUpdate('bgColorOn', e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
              />
            </div>
          </>
        )}

        {/* Background opacity */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm text-gray-400">{t('clock.opacity')}</label>
            <span className="text-sm text-gray-500">{bgOpacity}%</span>
          </div>
          <input type="range" min="10" max="100" value={bgOpacity}
            onChange={(e) => onUpdate('bgOpacity', Number(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>
      </Section>

      {/* ── Size ── */}
      <Section title={t('clock.sectionSize')}>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm text-gray-400">{t('clock.width')}</label>
            <span className="text-sm text-gray-500">{windowWidth}px</span>
          </div>
          <input type="range" min="100" max="500" value={windowWidth}
            onChange={(e) => onUpdate('windowWidth', Number(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm text-gray-400">{t('clock.height')}</label>
            <span className="text-sm text-gray-500">{windowHeight}px</span>
          </div>
          <input type="range" min="100" max="500" value={windowHeight}
            onChange={(e) => onUpdate('windowHeight', Number(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>
        {mode === 'analog' && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm text-gray-400">{t('clock.analogSize')}</label>
              <span className="text-sm text-gray-500">{analogClockSize}px</span>
            </div>
            <input type="range" min="40" max="500" value={analogClockSize}
              onChange={(e) => onUpdate('analogClockSize', Number(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
        )}
      </Section>
    </div>
  );
}
