import { useRef, useEffect } from 'react';

export default function AnalogClock({ size, backgroundColor, textColor, showDate }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    let animationId;

    function draw() {
      const now = new Date();
      const cx = size / 2;
      const cy = size / 2;
      const radius = size / 2 - 4;

      ctx.clearRect(0, 0, size, size);

      // Background circle
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = backgroundColor;
      ctx.fill();

      // Hour numbers
      ctx.fillStyle = textColor;
      ctx.font = `${Math.max(10, size / 12)}px system-ui`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i = 1; i <= 12; i++) {
        const angle = (i * Math.PI) / 6 - Math.PI / 2;
        const numRadius = radius * 0.78;
        const x = cx + Math.cos(angle) * numRadius;
        const y = cy + Math.sin(angle) * numRadius;
        ctx.fillText(i.toString(), x, y);
      }

      // Tick marks
      for (let i = 0; i < 60; i++) {
        const angle = (i * Math.PI) / 30 - Math.PI / 2;
        const isHour = i % 5 === 0;
        const innerR = radius * (isHour ? 0.88 : 0.92);
        const outerR = radius * 0.95;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * innerR, cy + Math.sin(angle) * innerR);
        ctx.lineTo(cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR);
        ctx.strokeStyle = textColor;
        ctx.lineWidth = isHour ? 2 : 1;
        ctx.stroke();
      }

      const hours = now.getHours() % 12;
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      // Hour hand
      const hourAngle = ((hours + minutes / 60) * Math.PI) / 6 - Math.PI / 2;
      drawHand(ctx, cx, cy, hourAngle, radius * 0.5, 3, textColor);

      // Minute hand
      const minuteAngle = ((minutes + seconds / 60) * Math.PI) / 30 - Math.PI / 2;
      drawHand(ctx, cx, cy, minuteAngle, radius * 0.68, 2, textColor);

      // Second hand
      const secondAngle = (seconds * Math.PI) / 30 - Math.PI / 2;
      drawHand(ctx, cx, cy, secondAngle, radius * 0.72, 1, '#ff4444');

      // Center dot
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = textColor;
      ctx.fill();

      // Date
      if (showDate) {
        const dateStr = `${now.getMonth() + 1}/${now.getDate()}`;
        ctx.fillStyle = textColor;
        ctx.font = `${Math.max(9, size / 14)}px system-ui`;
        ctx.textAlign = 'center';
        ctx.fillText(dateStr, cx, cy + radius * 0.35);
      }

      animationId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [size, backgroundColor, textColor, showDate]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
    />
  );
}

function drawHand(ctx, cx, cy, angle, length, width, color) {
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(angle) * length, cy + Math.sin(angle) * length);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.stroke();
}
