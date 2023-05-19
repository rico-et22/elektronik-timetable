import * as React from 'react';
import { SettingsContext } from 'pages/_app';
import { Tooltip } from 'react-tooltip';

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
      className={`bg-gray-50 dark:bg-zinc-800 flex items-center rounded border border-gray-300 dark:border-zinc-700 ${
        small ? 'text-xs' : ''
      }`}
    >
      <button
        type="button"
        onClick={() => handleShortHoursButtonClick(false)}
        aria-label="Normalne lekcje - 45 minut"
        className={`px-2 py-1 rounded-l-0_18 shorthours-tooltip ${
          !showShortHours
            ? 'bg-blue-200 dark:text-zinc-700'
            : 'dark:text-zinc-300'
        }`}
        data-tooltip-content="Normalne lekcje - 45 minut"
      >
        45’
      </button>
      <button
        type="button"
        onClick={() => handleShortHoursButtonClick(true)}
        aria-label="Skrócone lekcje - 30 minut"
        className={`px-2 py-1 rounded-r-0_18 shorthours-tooltip ${
          showShortHours
            ? 'bg-blue-200 dark:text-zinc-700'
            : 'dark:text-zinc-300'
        }`}
        data-tooltip-content="Skrócone lekcje - 30 minut"
      >
        30’
      </button>
      <Tooltip anchorSelect=".shorthours-tooltip" />
    </div>
  );
};

ShortHoursSwitcher.defaultProps = {
  small: false,
};

export default ShortHoursSwitcher;
