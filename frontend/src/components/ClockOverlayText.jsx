import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDate, formatTime } from '../lib/dateFormat';

export default function ClockOverlayText({ clock }) {
  const { i18n } = useTranslation();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const {
    dateTimePosition,
    dateFormatStyle,
    timeFormatStyle,
    customDateFormat1,
    customDateFormat2,
    customTimeFormat1,
    customTimeFormat2,
    textColor,
    font,
    fontSize,
  } = clock;

  const locale = i18n.language;
  const dateStr = formatDate(now, dateFormatStyle, customDateFormat1, customDateFormat2, locale);
  const timeStr = formatTime(now, timeFormatStyle, customTimeFormat1, customTimeFormat2, locale);

  const showDate = dateTimePosition !== 'timeOnly';
  const showTime = dateTimePosition !== 'dateOnly';
  const isHorizontal = ['dateTimeHorizontal', 'timeDateHorizontal'].includes(dateTimePosition);
  const dateFirst = ['dateTimeVertical', 'dateTimeHorizontal', 'dateOnly'].includes(dateTimePosition);

  const dateEl = showDate && (
    <span
      key="date"
      style={{
        fontSize: `${fontSize}px`,
        whiteSpace: 'nowrap',
      }}
    >
      {dateStr}
    </span>
  );

  const timeEl = showTime && (
    <span
      key="time"
      style={{
        fontSize: `${fontSize}px`,
        whiteSpace: 'nowrap',
      }}
    >
      {timeStr}
    </span>
  );

  const elements = dateFirst ? [dateEl, timeEl] : [timeEl, dateEl];

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center pointer-events-none ${
        isHorizontal ? 'flex-row gap-2' : 'flex-col gap-0.5'
      }`}
      style={{
        color: textColor,
        fontFamily: font,
        textShadow: '0 1px 3px rgba(0,0,0,0.6)',
      }}
    >
      {elements}
    </div>
  );
}
