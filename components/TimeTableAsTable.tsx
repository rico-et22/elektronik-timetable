import { List } from '@wulkanowy/timetable-parser';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import {
  getTeacherDataByCode,
  getTeacherDataByShortName,
  getClassDataByCode,
  getHourData,
  getRoomDataByCode,
  getReplacementData,
} from 'helpers/dataGetters';
import { SettingsContext } from 'pages/_app';
import { TimeTableData } from 'types/TimeTable';
import { Replacements } from 'types/Replacements';
import LessonHour from './LessonHour';

interface Props {
  timeTable: TimeTableData;
  timeTableList: List;
  replacements: Replacements | null;
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
    [timeTableList]
  );

  const getTeacherDataUsingCode = React.useCallback(
    (teacherCode: string | undefined) =>
      getTeacherDataByCode(timeTableList, teacherCode),
    [timeTableList]
  );
  const getTeacherDataUsingShortName = React.useCallback(
    (shortName: string | undefined) =>
      getTeacherDataByShortName(timeTableList, shortName),
    [timeTableList]
  );

  const getRoomData = React.useCallback(
    (roomNumber: string | undefined) =>
      getRoomDataByCode(timeTableList, roomNumber),
    [timeTableList]
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
    [isClientSide]
  );

  /**
   * changes to shortHours if it needs to show shorthours
   */
  const hourData = React.useMemo(
    () =>
      showShortHours
        ? getHourData(timeTable.hours, shortHours)
        : timeTable.hours,
    [shortHours, showShortHours, timeTable.hours]
  );

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
                                    /* if it's the last element of table then make a round corner */
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
                        const {
                          replacement,
                          replacedClassData,
                          replacedTeacherData,
                          replacedRoomData,
                          classData,
                          teacherData,
                          roomData,
                        } = getReplacementData(
                          lesson,
                          router,
                          timeTableList,
                          replacements,
                          hourIndex,
                          dayIndex,
                          timeTable
                        );
                        return (
                          <div
                            key={`day-${dayIndex}-${hourIndex}-${lessonIndex}`}
                            className={
                              lessonIndex !==
                              timeTable.days[dayIndex][hourIndex].length - 1
                                ? 'mb-2'
                                : ''
                            }
                          >
                            <LessonHour
                              replacement={replacement}
                              subject={lesson.subject}
                              groupName={lesson.groupName}
                              replacedClassData={replacedClassData}
                              replacedTeacherData={replacedTeacherData}
                              replacedRoomData={replacedRoomData}
                              classData={classData}
                              teacherData={teacherData}
                              roomData={roomData}
                              small={false}
                            />
                          </div>
                        );
                      }
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
