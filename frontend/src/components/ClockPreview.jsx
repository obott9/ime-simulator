import { useTranslation } from 'react-i18next';
import AnalogClock from './AnalogClock';
import DigitalClock from './DigitalClock';
import ClockOverlayText from './ClockOverlayText';

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function ClockPreview({ settings, backgroundColor }) {
  const { t } = useTranslation();
  const clock = settings.clock;
  const bgWithOpacity = hexToRgba(backgroundColor, clock.bgOpacity / 100);

  return (
    <div className="flex flex-col items-center gap-3">
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
        {t('clock.preview')}
      </h2>
      <div
        className="relative shadow-lg inline-flex items-center justify-center overflow-hidden"
        style={{
          width: clock.windowWidth,
          height: clock.windowHeight,
          borderRadius: 10,
          backgroundColor: bgWithOpacity,
        }}
      >
        {clock.mode === 'analog' ? (
          <>
            <AnalogClock
              size={clock.analogClockSize}
              analogColor={clock.analogColor}
              showSeconds={clock.showSeconds}
            />
            <ClockOverlayText clock={clock} />
          </>
        ) : (
          <DigitalClock
            width={clock.windowWidth}
            height={clock.windowHeight}
            textColor={clock.textColor}
            font={clock.font}
            fontSize={clock.fontSize}
            dateTimePosition={clock.dateTimePosition}
            dateFormatStyle={clock.dateFormatStyle}
            timeFormatStyle={clock.timeFormatStyle}
            customDateFormat1={clock.customDateFormat1}
            customDateFormat2={clock.customDateFormat2}
            customTimeFormat1={clock.customTimeFormat1}
            customTimeFormat2={clock.customTimeFormat2}
          />
        )}
      </div>
    </div>
  );
}
