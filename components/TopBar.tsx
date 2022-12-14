import {
  CollectionIcon,
  TableIcon,
  PrinterIcon,
} from '@heroicons/react/outline';
import { List } from '@wulkanowy/timetable-parser';
import { useReactToPrint } from 'react-to-print';
import { useRouter } from 'next/router';
import * as React from 'react';
import getRouteContext from 'helpers/getRouteContext';
import { SettingsContext } from 'pages/_app';
import { DesktopComponent } from 'types/SettingsContext';
import ShortHoursSwitcher from 'components/ShortHoursSwitcher';
import ThemeSwitcher from 'components/ThemeSwitcher';

type TopBarProps = {
  timeTableList: List;
  printRef: React.RefObject<HTMLDivElement>;
};

const TopBar = ({ timeTableList, printRef }: TopBarProps) => {
  const router = useRouter();
  const { desktopComponent, setDesktopComponent } =
    React.useContext(SettingsContext);

  const routeContext = React.useMemo(
    () => getRouteContext(router, timeTableList),
    [router, timeTableList],
  );

  const handleDesktopComponentButtonClick = (value: DesktopComponent) => {
    if (setDesktopComponent) setDesktopComponent(value);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `${routeContext.name} - Plan lekcji express`,
  });

  return (
    <div className="bg-gray-100 dark:bg-zinc-900 flex h-[4.5rem] px-10 filter drop-shadow-xl dark:drop-shadow-none dark:border-b dark:border-zinc-700">
      <div className="w-full flex items-center">
        <ShortHoursSwitcher />
      </div>
      <div className=" w-full mx-4 flex justify-center items-center">
        <h2 className="text-lg truncate">
          {routeContext.name && routeContext.typeName && (
            <span className="text-gray-500 dark:text-zinc-400">
              {routeContext.typeName} /{' '}
            </span>
          )}
          {routeContext.name && (
            <span className="font-medium">{routeContext.name}</span>
          )}
        </h2>
      </div>
      <div className="w-full flex items-center justify-end print:invisible">
        <button
          type="button"
          onClick={handlePrint}
          title="Drukuj"
          aria-label="Drukuj"
          className="bg-gray-50 dark:bg-zinc-800 px-2 py-1 rounded border border-gray-300 dark:border-zinc-700"
        >
          <PrinterIcon className="h-8 text-gray-700 dark:text-zinc-300" />
        </button>
        <div className="bg-gray-50 dark:bg-zinc-800 mx-4 flex items-center rounded border border-gray-300 dark:border-zinc-700">
          <button
            type="button"
            onClick={() => handleDesktopComponentButtonClick('table')}
            title="Tabela"
            aria-label="Tabela"
            className={`px-2 py-1 rounded-l ${
              desktopComponent === 'table' ? 'bg-blue-200' : ''
            }`}
          >
            <TableIcon
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
            title="Lista"
            aria-label="Lista"
            className={`px-2 py-1 rounded-r ${
              desktopComponent === 'list' ? 'bg-blue-200' : ''
            }`}
          >
            <CollectionIcon
              className={`h-8 ${
                desktopComponent === 'list'
                  ? 'dark:text-zinc-700'
                  : 'text-gray-700 dark:text-zinc-300'
              }`}
            />
          </button>
        </div>
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default TopBar;
