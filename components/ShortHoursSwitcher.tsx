import * as React from 'react';
import { SettingsContext } from 'pages/_app';

interface Props {
  small?: boolean;
}

const ShortHoursSwitcher = ({ small }: Props) => {
  const { showShortHours, setShowShortHours } =
    React.useContext(SettingsContext);

  const handleShortHoursButtonClick = (value: boolean) => {
    if (setShowShortHours) setShowShortHours(value);
  };

  return (
    <div
      className={`bg-gray-50 flex items-center rounded border border-gray-300 ${
        small ? 'text-xs' : ''
      }`}
    >
      <button
        type="button"
        onClick={() => handleShortHoursButtonClick(false)}
        aria-label="Normalne lekcje - 45 minut"
        className={`px-2 py-1 rounded-l ${
          !showShortHours ? 'bg-blue-200' : ''
        }`}
      >
        45’
      </button>
      <button
        type="button"
        onClick={() => handleShortHoursButtonClick(true)}
        aria-label="Skrócone lekcje - 30 minut"
        className={`px-2 py-1 rounded-r ${showShortHours ? 'bg-blue-200' : ''}`}
      >
        30’
      </button>
    </div>
  );
};

ShortHoursSwitcher.defaultProps = {
  small: false,
};

export default ShortHoursSwitcher;
