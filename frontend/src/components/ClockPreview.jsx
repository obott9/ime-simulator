import { useTranslation } from 'react-i18next';
import AnalogClock from './AnalogClock';
import DigitalClock from './DigitalClock';
import ClockOverlayText from './ClockOverlayText';

export default function ClockPreview({ settings, backgroundColor }) {
  const { t } = useTranslation();
  const clock = settings.clock;
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
          backgroundColor: backgroundColor,
          opacity: clock.bgOpacity / 100,
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
