function pad(n) {
  return n.toString().padStart(2, '0');
}

// Swift DateFormatter.dateStyle mapping:
//   .short   → numeric
//   .medium  → abbreviated
//   .long    → long
//   .full    → complete
export function formatDate(now, style, custom1, custom2, locale = 'en') {
  switch (style) {
    case 'numeric':
      return new Intl.DateTimeFormat(locale, { dateStyle: 'short' }).format(now);
    case 'abbreviated':
      return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(now);
    case 'long':
      return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(now);
    case 'complete':
      return new Intl.DateTimeFormat(locale, { dateStyle: 'full' }).format(now);
    case 'custom1':
      return applyCustomFormat(now, custom1, locale);
    case 'custom2':
      return applyCustomFormat(now, custom2, locale);
    default:
      return new Intl.DateTimeFormat(locale, { dateStyle: 'short' }).format(now);
  }
}

// Swift DateFormatter.timeStyle mapping:
//   .short   → shortened
//   .medium  → standard
//   .long    → complete
export function formatTime(now, style, custom1, custom2, locale = 'en') {
  switch (style) {
    case 'standard':
      return new Intl.DateTimeFormat(locale, { timeStyle: 'medium' }).format(now);
    case 'shortened':
      return new Intl.DateTimeFormat(locale, { timeStyle: 'short' }).format(now);
    case 'complete':
      return new Intl.DateTimeFormat(locale, { timeStyle: 'long' }).format(now);
    case 'custom1':
      return applyCustomTimeFormat(now, custom1);
    case 'custom2':
      return applyCustomTimeFormat(now, custom2);
    default:
      return new Intl.DateTimeFormat(locale, { timeStyle: 'medium' }).format(now);
  }
}

// Locale-aware helpers for custom format patterns
function getWeekday(date, locale, style) {
  return new Intl.DateTimeFormat(locale, { weekday: style }).format(date);
}

function getMonth(date, locale, style) {
  return new Intl.DateTimeFormat(locale, { month: style }).format(date);
}

function applyCustomFormat(now, fmt, locale) {
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();
  return fmt
    .replace('yyyy', y)
    .replace('MMMM', getMonth(now, locale, 'long'))
    .replace('MMM', getMonth(now, locale, 'short'))
    .replace('MM', pad(m + 1))
    .replace(/(?<![My])M(?!M)/, m + 1)
    .replace('dd', pad(d))
    .replace(/(?<![dE])d(?!d)/, d)
    .replace('EEEE', getWeekday(now, locale, 'long'))
    .replace('EEE', getWeekday(now, locale, 'long'))
    .replace(/(?<!E)E(?!E)/, getWeekday(now, locale, 'short'));
}

function applyCustomTimeFormat(now, fmt) {
  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();
  const h12 = h % 12 || 12;
  const ampm = h < 12 ? 'AM' : 'PM';
  return fmt
    .replace('HH', pad(h))
    .replace(/(?<![Hh])H(?!H)/, h)
    .replace('hh', pad(h12))
    .replace(/(?<![Hh])h(?!h)/, h12)
    .replace('mm', pad(m))
    .replace(/\bss\b/, pad(s))
    .replace('SSS', String(now.getMilliseconds()).padStart(3, '0'))
    .replace(/\ba\b/, ampm)
    .trim();
}

export const DATE_SAMPLES = [
  'yyyy/MM/dd',
  'yyyy.MM.dd EEEE',
  'yyyy-MM-dd (E)',
  'yyyy.MM.dd',
  'M/d (E)',
  'yyyy年M月d日',
  'yyyy年M月d日 E',
  'd MMM yyyy',
  'MMM d, yyyy',
  'MMMM d',
];

export const TIME_SAMPLES = [
  'HH:mm',
  'HH:mm:ss',
  'H:mm',
  'h:mm a',
  'h:mm:ss a',
  'HH:mm:ss.SSS',
  'H時mm分',
  'H時mm分ss秒',
  'HH:mm:ss',
  'HH:mm',
];
