import { EmojiSadIcon, ExclamationCircleIcon } from "@heroicons/react/outline";
import * as React from "react";
import { TimeTableStatus } from "../types/TimeTable";

interface Props {
  status: TimeTableStatus;
}

const NoTimeTableError = ({ status: timeTableStatus }: Props) => {
  return (
    <div className="flex flex-col items-center text-gray-500 mt-20">
      {timeTableStatus === "empty" && (
        <>
          <EmojiSadIcon className="w-20 h-20" />
          <p className="mt-4">Brak danych.</p>
        </>
      )}
      {timeTableStatus === "error" && (
        <>
          <ExclamationCircleIcon className="w-20 h-20" />
          <p className="mt-4">Błąd pobierania danych.</p>
        </>
      )}
    </div>
  );
};

export default NoTimeTableError;
