import { useState, useEffect } from 'react';

export default function AnalogClock({ size, analogColor, showSeconds }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const hourAngle = (hours + minutes / 60) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = seconds * 6;

  const borderWidth = Math.max(1, size * 0.02);

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
      }}
    >
      {/* Circle outline */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: `${borderWidth}px solid ${analogColor}`,
          boxSizing: 'border-box',
        }}
      />

      {/* 12 hour markers (rectangles, no numbers) */}
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={`tick-${i}`}
          style={{
            position: 'absolute',
            inset: 0,
            transform: `rotate(${i * 30}deg)`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: size * 0.05,
              width: size * 0.02,
              height: size * 0.1,
              transform: 'translateX(-50%)',
              backgroundColor: analogColor,
              borderRadius: 1,
            }}
          />
        </div>
      ))}

      {/* Hour hand */}
      <div style={{ position: 'absolute', inset: 0, transform: `rotate(${hourAngle}deg)` }}>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '50%',
            width: size * 0.04,
            height: size * 0.25,
            transform: 'translateX(-50%)',
            backgroundColor: analogColor,
            borderRadius: 2,
          }}
        />
      </div>

      {/* Minute hand */}
      <div style={{ position: 'absolute', inset: 0, transform: `rotate(${minuteAngle}deg)` }}>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '50%',
            width: size * 0.03,
            height: size * 0.35,
            transform: 'translateX(-50%)',
            backgroundColor: analogColor,
            borderRadius: 2,
          }}
        />
      </div>

      {/* Second hand (only if showSeconds) */}
      {showSeconds && (
        <div style={{ position: 'absolute', inset: 0, transform: `rotate(${secondAngle}deg)` }}>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: '50%',
              width: size * 0.01,
              height: size * 0.4,
              transform: 'translateX(-50%)',
              backgroundColor: analogColor,
              borderRadius: 1,
            }}
          />
        </div>
      )}

      {/* Center dot */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: size * 0.06,
          height: size * 0.06,
          borderRadius: '50%',
          backgroundColor: analogColor,
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  );
}
