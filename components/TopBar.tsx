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
    <div className="bg-gray-100 flex h-[4.5rem] px-10 filter drop-shadow-xl">
      <div className="w-full flex items-center">
        <ShortHoursSwitcher />
      </div>
      <div className=" w-full flex justify-center items-center">
        <h2 className="text-lg truncate">
          {routeContext.name && routeContext.typeName && (
            <span className="text-gray-500">{routeContext.typeName} / </span>
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
          aria-label="Drukuj"
          className="bg-gray-50 mr-4 px-2 py-1 rounded border border-gray-300"
        >
          <PrinterIcon className="h-8 text-gray-700" />
        </button>
        <div className="bg-gray-50 flex items-center rounded border border-gray-300">
          <button
            type="button"
            onClick={() => handleDesktopComponentButtonClick('table')}
            aria-label="Tabela"
            className={`px-2 py-1 rounded-l ${
              desktopComponent === 'table' ? 'bg-blue-200' : ''
            }`}
          >
            <TableIcon className="h-8 text-gray-700" />
          </button>
          <button
            type="button"
            onClick={() => handleDesktopComponentButtonClick('list')}
            aria-label="Lista"
            className={`px-2 py-1 rounded-r ${
              desktopComponent === 'list' ? 'bg-blue-200' : ''
            }`}
          >
            <CollectionIcon className="h-8 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
