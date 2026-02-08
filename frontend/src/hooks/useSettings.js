import { useState, useCallback, useRef } from 'react';

export const DEFAULT_SETTINGS = {
  clock: {
    mode: 'analog',
    dateTimePosition: 'dateTimeVertical',
    showSeconds: true,
    dateFormatStyle: 'complete',
    timeFormatStyle: 'standard',
    customDateFormat1: 'yyyy/MM/dd E',
    customDateFormat2: 'M/d (EEE)',
    customTimeFormat1: 'HH:mm:ss',
    customTimeFormat2: 'H:mm',
    useIndicatorColors: true,
    bgColorOff: '#0096ff',
    bgColorOn: '#ff2600',
    bgOpacity: 60,
    textColor: '#ffffff',
    analogColor: '#fffc00',
    font: 'system-ui',
    fontSize: 24,
    windowWidth: 320,
    windowHeight: 220,
    analogClockSize: 200,
  },
  indicator: {
    colors: {
      ja: '#e74c3c',
      en: '#3498db',
      ko: '#9b59b6',
      'zh-Hant': '#a8e063',
      'zh-Hans': '#2ecc71',
    },
    texts: {
      ja: 'あ',
      en: 'A',
      ko: '한',
      'zh-Hant': '繁',
      'zh-Hans': '简',
    },
    size: 40,
    fontSizeRatio: 0.5,
    opacity: 100,
    position: { x: 90, y: 10 },
  },
};

export default function useSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [currentLang, setCurrentLang] = useState('ja');
  const [activePresetId, setActivePresetId] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const snapshotRef = useRef(null);

  const clockBackgroundColor = settings.clock.useIndicatorColors
    ? settings.indicator.colors[currentLang]
    : currentLang === 'en'
      ? settings.clock.bgColorOff
      : settings.clock.bgColorOn;
  const languageLabel = settings.indicator.texts[currentLang];

  const markDirty = useCallback(() => {
    if (snapshotRef.current !== null) {
      setIsDirty(true);
    }
  }, []);

  const updateClock = useCallback((key, value) => {
    setSettings((prev) => ({
      ...prev,
      clock: { ...prev.clock, [key]: value },
    }));
    markDirty();
  }, [markDirty]);

  const updateIndicator = useCallback((key, value) => {
    setSettings((prev) => ({
      ...prev,
      indicator: { ...prev.indicator, [key]: value },
    }));
    markDirty();
  }, [markDirty]);

  const updateIndicatorColor = useCallback((lang, color) => {
    setSettings((prev) => ({
      ...prev,
      indicator: {
        ...prev.indicator,
        colors: { ...prev.indicator.colors, [lang]: color },
      },
    }));
    markDirty();
  }, [markDirty]);

  const updateIndicatorText = useCallback((lang, text) => {
    setSettings((prev) => ({
      ...prev,
      indicator: {
        ...prev.indicator,
        texts: { ...prev.indicator.texts, [lang]: text },
      },
    }));
    markDirty();
  }, [markDirty]);

  const loadPreset = useCallback((presetId, presetSettings) => {
    setSettings(presetSettings);
    setActivePresetId(presetId);
    setIsDirty(false);
    snapshotRef.current = JSON.stringify(presetSettings);
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    setCurrentLang('ja');
    setActivePresetId(null);
    setIsDirty(false);
    snapshotRef.current = null;
  }, []);

  const indicatorColor = settings.indicator.colors[currentLang];

  return {
    settings,
    setSettings,
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
  };
}
