export default function IMEIndicator({
  label,
  backgroundColor,
  size,
  opacity,
  textColor = '#ffffff',
}) {
  return (
    <div
      className="flex items-center justify-center rounded-lg font-bold shadow-md transition-all duration-200"
      style={{
        width: size,
        height: size,
        backgroundColor,
        opacity: opacity / 100,
        fontSize: size * 0.45,
        color: textColor,
      }}
    >
      {label}
    </div>
  );
}
