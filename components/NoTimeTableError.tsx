import {
  FaceFrownIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import * as React from 'react';
import { TimeTableData } from 'types/TimeTable';

interface Props {
  status: TimeTableData['status'];
}

const NoTimeTableError = ({ status: timeTableStatus }: Props) => (
  <div className="flex flex-col items-center text-gray-500 dark:text-zinc-300 mt-20">
    {timeTableStatus === 'empty' && (
      <>
        <FaceFrownIcon className="w-20 h-20" />
        <p className="mt-4">Brak danych.</p>
      </>
    )}
    {timeTableStatus === 'error' && (
      <>
        <ExclamationCircleIcon className="w-20 h-20" />
        <p className="mt-4">Błąd pobierania danych.</p>
      </>
    )}
  </div>
);

export default NoTimeTableError;
