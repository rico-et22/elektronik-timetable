import {
  AcademicCapIcon,
  MapPinIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { List } from '@wulkanowy/timetable-parser';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import * as React from 'react';
import getClassDataByCode from 'helpers/getClassDataByCode';
import getHourData from 'helpers/getHourData';
import getRoomDataByNumber from 'helpers/getRoomDataByNumber';
import getTeacherDataByCode from 'helpers/getTeacherDataByCode';
import { SettingsContext } from 'pages/_app';
import { TimeTableData } from 'types/TimeTable';
import { Replacements } from 'types/Replacements';
import findReplacement from 'helpers/findReplacement';

interface Props {
  timeTable: TimeTableData;
  timeTableList: List;
  replacements: Replacements;
}

const TimeTableAsTable = ({
  timeTable,
  timeTableList,
  replacements,
}: Props) => {
  const { showShortHours, shortHours } = React.useContext(SettingsContext);

  const [isClientSide, setIsClientSide] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClientSide(true);
    }
  }, []);

  const router = useRouter();

  const getClassData = React.useCallback(
    (classCode: string | undefined) =>
      getClassDataByCode(timeTableList, classCode),
    [timeTableList],
  );

  const getTeacherData = React.useCallback(
    (teacherCode: string | undefined) =>
      getTeacherDataByCode(timeTableList, teacherCode),
    [timeTableList],
  );

  const getRoomData = React.useCallback(
    (roomNumber: string | undefined) =>
      getRoomDataByNumber(timeTableList, roomNumber),
    [timeTableList],
  );

  const isCurrentLesson = React.useCallback(
    (startTime: string, endTime: string) => {
      const startTimeSplit = startTime.split(':').map((n) => Number(n));
      const endTimeSplit = endTime.split(':').map((n) => Number(n));
      const currentDate = new Date();
      const currentTimeSplit = [
        currentDate.getHours(),
        currentDate.getMinutes(),
      ];
      if (isClientSide)
        return (
          new Date().setHours(currentTimeSplit[0], currentTimeSplit[1]) >=
            new Date().setHours(startTimeSplit[0], startTimeSplit[1]) &&
          new Date().setHours(currentTimeSplit[0], currentTimeSplit[1]) <=
            new Date().setHours(endTimeSplit[0], endTimeSplit[1])
        );
      return false;
    },
    [isClientSide],
  );

  const hourData = React.useMemo(() => {
    if (showShortHours) return getHourData(timeTable.hours, shortHours);
    return timeTable.hours;
  }, [shortHours, showShortHours, timeTable.hours]);

  return (
    <div className="px-10 pb-16 mt-8">
      <table className="w-full table-fixed border-separate border-0 drop-shadow-lg dark:drop-shadow-none rounded-lg border-spacing-0 ">
        <thead className="rounded">
          <tr className="text-white text-sm rounded-t-lg">
            <th className="py-3 w-10 border border-gray-100/50 dark:border-zinc-700/50 bg-elektronik-red rounded-tl-lg">
              Nr
            </th>
            <th className="py-3 w-24 border bg-elektronik-red border-gray-100/50 dark:border-zinc-700/50">
              Godz.
            </th>
            {timeTable.dayNames.map((dayName, index) => (
              <th
                key={`table-dayName-${dayName}`}
                className={`py-3 border bg-elektronik-red border-gray-100/50 dark:border-zinc-700/50 ${
                  index === timeTable.dayNames.length - 1 ? 'rounded-tr-lg' : ''
                }`}
              >
                <span>{dayName}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(hourData).map((hour, hourIndex) => (
            <tr key={`table-hour-${hour}`} className="text-xs">
              <td
                className={`text-center p-2 text-sm ${
                  hourIndex === Object.entries(timeTable.hours).length - 1
                    ? 'rounded-bl-lg'
                    : ''
                } ${
                  isCurrentLesson(hour[1].timeFrom, hour[1].timeTo)
                    ? 'bg-green-200 dark:text-zinc-700'
                    : 'bg-gray-200 dark:bg-zinc-700'
                }`}
              >
                <span className="font-bold">{hour[1].number}</span>
              </td>
              <td
                className={`text-center p-2 ${
                  isCurrentLesson(hour[1].timeFrom, hour[1].timeTo)
                    ? 'bg-green-200 dark:text-zinc-700'
                    : 'bg-gray-200 dark:bg-zinc-700'
                }`}
              >
                {hour[1].timeFrom} - {hour[1].timeTo}
              </td>
              {timeTable.dayNames.map((dayName, dayIndex) => (
                <React.Fragment key={`table-hour-${hour}-dayName-${dayName}`}>
                  <td
                    className={`bg-gray-50 dark:bg-zinc-800 p-2 border dark:border-zinc-700
                                  ${
                                    hourIndex ===
                                      Object.entries(timeTable.hours).length -
                                        1 &&
                                    dayIndex === timeTable.dayNames.length - 1
                                      ? 'rounded-br-lg'
                                      : ''
                                  }`}
                  >
                    {timeTable.days[dayIndex][hourIndex].map(
                      (lesson, lessonIndex) => {
                        const replacement = findReplacement(
                          lesson,
                          hourIndex,
                          dayIndex,
                          replacements,
                          timeTable,
                        );
                        return (
                          <div
                            // eslint-disable-next-line react/no-array-index-key
                            key={`day-${dayIndex}-${hourIndex}-${lessonIndex}`}
                            className={
                              lessonIndex !==
                              timeTable.days[dayIndex][hourIndex].length - 1
                                ? 'mb-2'
                                : ''
                            }
                          >
                            <p className="font-bold mb-1">
                              {replacement?.subject || lesson.subject}
                              {lesson.groupName && ` (${lesson.groupName})`}
                            </p>
                            <div className="flex">
                              {lesson.className && (
                                <div className="flex items-center mr-4">
                                  <AcademicCapIcon className="h-3 w-3 mr-1" />
                                  <Link
                                    href={`/class/${
                                      getClassData(lesson.className)?.value
                                    }`}
                                  >
                                    <a className="text-elektronik-blue">
                                      {
                                        getClassData(
                                          lesson.className,
                                        )?.name.split(' ')[0]
                                      }
                                    </a>
                                  </Link>
                                </div>
                              )}
                              {(replacement?.deputy || lesson.teacher) && (
                                <div className="flex items-center mr-4 w-1/2">
                                  <UserGroupIcon className="h-3 w-3 mr-1 shrink-0" />
                                  {replacement?.deputy || (
                                    <Link
                                      href={`/teacher/${
                                        getTeacherData(lesson.teacher)?.value
                                      }`}
                                    >
                                      <a className="text-elektronik-blue truncate">
                                        {
                                          getTeacherData(
                                            lesson.teacher,
                                          )?.name.split(' ')[0]
                                        }
                                      </a>
                                    </Link>
                                  )}
                                </div>
                              )}{' '}
                              {(replacement?.room || lesson.room) && (
                                <div className="flex items-center">
                                  <MapPinIcon className="h-3 w-3 mr-1" />
                                  <Link
                                    href={`/room/${
                                      getRoomData(
                                        replacement?.room || lesson.room,
                                      )?.value
                                    }`}
                                  >
                                    <a className="text-elektronik-blue">
                                      {
                                        getRoomData(
                                          replacement?.room || lesson.room,
                                        )?.name.split(' ')[0]
                                      }
                                    </a>
                                  </Link>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      },
                    )}
                  </td>
                </React.Fragment>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimeTableAsTable;
