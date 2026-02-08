import { useState, useEffect } from 'react';

export default function DigitalClock({
  size,
  backgroundColor,
  textColor,
  font,
  fontSize,
  showDate,
}) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n) => n.toString().padStart(2, '0');
  const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const dateStr = `${now.getFullYear()}/${pad(now.getMonth() + 1)}/${pad(now.getDate())}`;

  return (
    <div
      className="flex flex-col items-center justify-center rounded-lg"
      style={{
        width: size,
        height: size,
        backgroundColor,
      }}
    >
      <span
        style={{
          color: textColor,
          fontFamily: font,
          fontSize: `${fontSize}px`,
          fontWeight: 'bold',
          lineHeight: 1.2,
        }}
      >
        {timeStr}
      </span>
      {showDate && (
        <span
          style={{
            color: textColor,
            fontFamily: font,
            fontSize: `${Math.max(10, fontSize * 0.5)}px`,
            marginTop: 4,
            opacity: 0.8,
          }}
        >
          {dateStr}
        </span>
      )}
    </div>
  );
}
