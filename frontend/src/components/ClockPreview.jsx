import AnalogClock from './AnalogClock';
import DigitalClock from './DigitalClock';

export default function ClockPreview({ settings, backgroundColor }) {
  const { mode, textColor, font, fontSize, windowSize, showDate } = settings.clock;

  return (
    <div className="flex flex-col items-center gap-3">
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
        Clock Preview
      </h2>
      <div className="rounded-xl bg-gray-800/50 p-4 shadow-lg inline-flex items-center justify-center">
        {mode === 'analog' ? (
          <AnalogClock
            size={windowSize}
            backgroundColor={backgroundColor}
            textColor={textColor}
            showDate={showDate}
          />
        ) : (
          <DigitalClock
            size={windowSize}
            backgroundColor={backgroundColor}
            textColor={textColor}
            font={font}
            fontSize={fontSize}
            showDate={showDate}
          />
        )}
      </div>
    </div>
  );
}
