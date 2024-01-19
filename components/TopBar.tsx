import {
  RectangleStackIcon,
  TableCellsIcon,
  PrinterIcon,
} from '@heroicons/react/24/outline';
import { List } from '@wulkanowy/timetable-parser';
import { useReactToPrint } from 'react-to-print';
import { useRouter } from 'next/router';
import * as React from 'react';
import getRouteContext from 'helpers/getRouteContext';
import { SettingsContext } from 'pages/_app';
import { DesktopComponent } from 'types/SettingsContext';
import ShortHoursSwitcher from 'components/ShortHoursSwitcher';
import ThemeSwitcher from 'components/ThemeSwitcher';
import { Tooltip } from 'react-tooltip';

type TopBarProps = {
  timeTableList: List;
  printRef: React.RefObject<HTMLDivElement>;
  showReplacements: boolean;
};

const TopBar = ({ timeTableList, printRef, showReplacements }: TopBarProps) => {
  const router = useRouter();
  const { desktopComponent, setDesktopComponent } =
    React.useContext(SettingsContext);

  const routeContext = React.useMemo(
    () => getRouteContext(router, timeTableList),
    [router, timeTableList]
  );

  const handleDesktopComponentButtonClick = (value: DesktopComponent) => {
    if (setDesktopComponent) setDesktopComponent(value);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `${routeContext.name} - Plan lekcji express`,
  });

  return (
    <div className="bg-gray-100 dark:bg-zinc-900 flex h-[4.5rem] px-10 shadow-xl dark:shadow-none dark:border-b dark:border-zinc-700 sticky top-0 z-10">
      <div className="w-full flex items-center">
        {!showReplacements && <ShortHoursSwitcher />}
      </div>
      <div className=" w-full mx-4 flex justify-center items-center">
        <h2 className="text-lg truncate">
          {!showReplacements ? (
            <>
              {routeContext.name && routeContext.typeName && (
                <span className="text-gray-500 dark:text-zinc-400">
                  {routeContext.typeName} /{' '}
                </span>
              )}
              {routeContext.name && (
                <span className="font-medium">{routeContext.name}</span>
              )}
            </>
          ) : (
            'Lista zastępstw'
          )}
        </h2>
      </div>
      <div className="w-full flex items-center justify-end print:invisible">
        <button
          type="button"
          onClick={handlePrint}
          aria-label="Drukuj"
          className={`bg-gray-50 dark:bg-zinc-800 px-2 py-1 rounded border border-gray-300 dark:border-zinc-700 topbar-tooltip ${
            showReplacements ? 'mr-4' : ''
          }`}
          data-tooltip-content="Drukuj"
        >
          <PrinterIcon className="h-8 text-gray-700 dark:text-zinc-300" />
        </button>
        {!showReplacements && (
          <div className="bg-gray-50 dark:bg-zinc-800 mx-4 flex items-center rounded border border-gray-300 dark:border-zinc-700">
            <button
              type="button"
              onClick={() => handleDesktopComponentButtonClick('table')}
              aria-label="Tabela"
              className={`px-2 py-1 rounded-l-0_18 topbar-tooltip ${
                desktopComponent === 'table' ? 'bg-blue-200' : ''
              }`}
              data-tooltip-content="Tabela"
            >
              <TableCellsIcon
                className={`h-8 ${
                  desktopComponent === 'table'
                    ? 'dark:text-zinc-700'
                    : 'text-gray-700 dark:text-zinc-300'
                }`}
              />
            </button>
            <button
              type="button"
              onClick={() => handleDesktopComponentButtonClick('list')}
              aria-label="Lista"
              className={`px-2 py-1 rounded-r-0_18 topbar-tooltip ${
                desktopComponent === 'list' ? 'bg-blue-200' : ''
              }`}
              data-tooltip-content="Lista"
            >
              <RectangleStackIcon
                className={`h-8 ${
                  desktopComponent === 'list'
                    ? 'dark:text-zinc-700'
                    : 'text-gray-700 dark:text-zinc-300'
                }`}
              />
            </button>
          </div>
        )}
        <ThemeSwitcher />
        <Tooltip anchorSelect=".topbar-tooltip" />
      </div>
    </div>
  );
};

export default TopBar;
