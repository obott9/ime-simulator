function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function IMEIndicator({
  label,
  backgroundColor,
  size,
  fontSizeRatio = 0.5,
  opacity,
}) {
  const op = opacity / 100;
  const color = backgroundColor;

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
      }}
    >
      {/* Layer 1: Outer glow (radial gradient) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${hexToRgba(color, op * 0.6)}, ${hexToRgba(color, op * 0.3)}, transparent)`,
        }}
      />

      {/* Layer 2: Inner circle (80% size, linear gradient + white border) */}
      <div
        style={{
          position: 'absolute',
          left: '10%',
          top: '10%',
          width: '80%',
          height: '80%',
          borderRadius: '50%',
          background: `linear-gradient(to bottom right, ${hexToRgba(color, op)}, ${hexToRgba(color, op * 0.7)})`,
          border: '2px solid rgba(255, 255, 255, 0.3)',
          boxSizing: 'border-box',
        }}
      />

      {/* Layer 3: Text (white, bold, shadow) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontWeight: 'bold',
          fontSize: size * fontSizeRatio,
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
          lineHeight: 1,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      >
        {label}
      </div>
    </div>
  );
}
