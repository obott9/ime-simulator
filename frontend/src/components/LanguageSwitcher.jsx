import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'ja', flag: '\u{1F1EF}\u{1F1F5}' },
  { code: 'en', flag: '\u{1F1FA}\u{1F1F8}' },
  { code: 'ko', flag: '\u{1F1F0}\u{1F1F7}' },
  { code: 'zh-Hant', flag: '\u{1F1F9}\u{1F1FC}' },
  { code: 'zh-Hans', flag: '\u{1F1E8}\u{1F1F3}' },
];

export default function LanguageSwitcher({ currentLang, onLangChange }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-sm text-gray-400">{t('general.switchIME')}</span>
      <div className="flex gap-2">
        {LANGUAGES.map(({ code, flag }) => (
          <button
            key={code}
            onClick={() => onLangChange(code)}
            title={t(`languages.${code}`)}
            className={`text-2xl p-2 rounded-lg transition-all duration-150 cursor-pointer ${
              currentLang === code
                ? 'bg-white/20 ring-2 ring-white/40 scale-110'
                : 'hover:bg-white/10'
            }`}
          >
            {flag}
          </button>
        ))}
      </div>
    </div>
  );
}
