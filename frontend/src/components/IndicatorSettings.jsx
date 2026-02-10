import { useTranslation } from 'react-i18next';

const LANG_CODES = ['en', 'ja', 'zh-Hans', 'zh-Hant', 'ko'];

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

export default function IndicatorSettings({
  settings,
  onUpdate,
  onColorChange,
  onTextChange,
}) {
  const { t } = useTranslation();
  const { colors, texts, size, fontSizeRatio, opacity } = settings;

  return (
    <div className="space-y-5">

      {/* ── Size ── */}
      <Section title={t('indicator.sectionSize')}>
        {/* Indicator size + presets */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm text-gray-400">{t('indicator.indicatorSize')}</label>
            <span className="text-sm text-gray-500">{size}px</span>
          </div>
          <input
            type="range" min="30" max="200" value={size}
            onChange={(e) => onUpdate('size', Number(e.target.value))}
            className="w-full accent-blue-500"
          />
          <div className="flex justify-between mt-1">
            {[
              { val: 40, key: 'sizeSmall' },
              { val: 60, key: 'sizeMedium' },
              { val: 80, key: 'sizeLarge' },
              { val: 100, key: 'sizeXLarge' },
            ].map(({ val, key }) => (
              <button
                key={val}
                onClick={() => onUpdate('size', val)}
                className={`text-xs px-2 py-0.5 rounded cursor-pointer ${
                  size === val
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                {t(`indicator.${key}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Text size (fontSizeRatio) + presets */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm text-gray-400">{t('indicator.textSize')}</label>
            <span className="text-sm text-gray-500">{Math.round(fontSizeRatio * 100)}%</span>
          </div>
          <input
            type="range" min="30" max="80" value={fontSizeRatio * 100}
            onChange={(e) => onUpdate('fontSizeRatio', Number(e.target.value) / 100)}
            className="w-full accent-blue-500"
          />
          <div className="flex justify-between mt-1">
            {[
              { val: 0.4, key: 'textSmall' },
              { val: 0.5, key: 'textNormal' },
              { val: 0.6, key: 'textLarge' },
            ].map(({ val, key }) => (
              <button
                key={val}
                onClick={() => onUpdate('fontSizeRatio', val)}
                className={`text-xs px-2 py-0.5 rounded cursor-pointer ${
                  fontSizeRatio === val
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                {t(`indicator.${key}`)}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Language Settings ── */}
      <Section title={t('indicator.sectionLanguage')}>
        {/* Header row */}
        <div className="flex items-center text-xs text-gray-500 gap-2 px-1">
          <span className="flex-1"></span>
          <span className="w-16 text-center">{t('indicator.textLabel')}</span>
          <span className="w-8 text-center">{t('indicator.colorLabel')}</span>
        </div>

        {/* Language rows */}
        {LANG_CODES.map((lang) => (
          <div key={lang} className="flex items-center gap-2">
            <span className="flex-1 text-sm text-gray-400 truncate">{t(`languages.${lang}`)}</span>
            <input
              type="text"
              value={texts[lang]}
              onChange={(e) => onTextChange(lang, e.target.value)}
              className="w-16 bg-gray-700 text-white text-sm text-center rounded px-1 py-1 border border-gray-600"
              maxLength={4}
            />
            <input
              type="color"
              value={colors[lang]}
              onChange={(e) => onColorChange(lang, e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent shrink-0"
            />
          </div>
        ))}
      </Section>

      {/* ── Color ── */}
      <Section title={t('indicator.sectionColor')}>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm text-gray-400">{t('indicator.opacity')}</label>
            <span className="text-sm text-gray-500">{opacity}%</span>
          </div>
          <input
            type="range" min="10" max="100" value={opacity}
            onChange={(e) => onUpdate('opacity', Number(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>
      </Section>
    </div>
  );
}
