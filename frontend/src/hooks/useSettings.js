import { useState, useCallback } from 'react';

const DEFAULT_SETTINGS = {
  clock: {
    mode: 'analog',
    textColor: '#ffffff',
    font: 'system-ui',
    fontSize: 24,
    windowSize: 150,
    showDate: true,
  },
  indicator: {
    colors: {
      ja: '#e74c3c',
      en: '#3498db',
      ko: '#9b59b6',
      'zh-Hant': '#a8e063',
      'zh-Hans': '#2ecc71',
    },
    size: 40,
    opacity: 100,
    position: { x: 90, y: 10 },
  },
};

const LANGUAGE_LABELS = {
  ja: 'あ',
  en: 'A',
  ko: '한',
  'zh-Hant': '繁',
  'zh-Hans': '简',
};

export default function useSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [currentLang, setCurrentLang] = useState('ja');

  const backgroundColor = settings.indicator.colors[currentLang];

  const updateClock = useCallback((key, value) => {
    setSettings((prev) => ({
      ...prev,
      clock: { ...prev.clock, [key]: value },
    }));
  }, []);

  const updateIndicator = useCallback((key, value) => {
    setSettings((prev) => ({
      ...prev,
      indicator: { ...prev.indicator, [key]: value },
    }));
  }, []);

  const updateIndicatorColor = useCallback((lang, color) => {
    setSettings((prev) => ({
      ...prev,
      indicator: {
        ...prev.indicator,
        colors: { ...prev.indicator.colors, [lang]: color },
      },
    }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    setCurrentLang('ja');
  }, []);

  return {
    settings,
    setSettings,
    currentLang,
    setCurrentLang,
    backgroundColor,
    languageLabel: LANGUAGE_LABELS[currentLang],
    updateClock,
    updateIndicator,
    updateIndicatorColor,
    resetSettings,
    LANGUAGE_LABELS,
  };
}
