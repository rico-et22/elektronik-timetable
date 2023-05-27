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

const TimeTableAsList = ({ timeTable, timeTableList, replacements }: Props) => {
  const [selectedDayIndex, setSelectedDayIndex] = React.useState<
    number | undefined
  >();

  const { showShortHours, shortHours } = React.useContext(SettingsContext);

  const router = useRouter();

  const [isClientSide, setIsClientSide] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClientSide(true);
    }
  }, []);

  React.useEffect(() => {
    if (timeTable?.dayNames?.length > 0) {
      const dayNumber = new Date().getDay();
      if (dayNumber >= 1 && dayNumber <= 5) setSelectedDayIndex(dayNumber - 1);
      else setSelectedDayIndex(0);
    }
  }, [timeTable.dayNames, router.asPath]);

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
      if (selectedDayIndex === new Date().getDay() - 1 && isClientSide)
        return (
          new Date().setHours(currentTimeSplit[0], currentTimeSplit[1]) >=
            new Date().setHours(startTimeSplit[0], startTimeSplit[1]) &&
          new Date().setHours(currentTimeSplit[0], currentTimeSplit[1]) <=
            new Date().setHours(endTimeSplit[0], endTimeSplit[1])
        );
      return false;
    },
    [selectedDayIndex, isClientSide],
  );

  const dayTrimData = React.useMemo(
    () => ({
      firstNotEmptyIndex: timeTable.days.map((day) =>
        day.findIndex((dayHour) => dayHour.length > 0),
      ),
      lastNotEmptyIndex: timeTable.days.map(
        (day) =>
          day.length -
          1 -
          day
            .slice()
            .reverse()
            .findIndex((dayHour) => dayHour.length > 0),
      ),
    }),
    [timeTable.days],
  );

  const hourData = React.useMemo(() => {
    if (showShortHours) return getHourData(timeTable.hours, shortHours);
    return timeTable.hours;
  }, [shortHours, showShortHours, timeTable.hours]);

  return (
    <div className="pb-24 lg:pb-4">
      <div className="bg-gray-200 dark:bg-zinc-700 flex justify-between px-6 mb-8 sticky top-0">
        {timeTable.dayNames.map((dayName, index) => (
          <button
            type="button"
            key={`dayName-${dayName}`}
            className={`py-3 lg:py-2 w-1/5 ${
              selectedDayIndex === index ? 'bg-elektronik-blue text-white' : ''
            }`}
            onClick={() => setSelectedDayIndex(index)}
          >
            <span className="hidden xs:inline">{dayName}</span>
            <span className="xs:hidden">{timeTable.shortDayNames[index]}</span>
          </button>
        ))}
      </div>
      <div className="px-6">
        {Object.entries(hourData).map((hour, hourIndex) => {
          if (
            selectedDayIndex !== undefined &&
            hourIndex >= dayTrimData.firstNotEmptyIndex[selectedDayIndex] &&
            hourIndex <= dayTrimData.lastNotEmptyIndex[selectedDayIndex]
          ) {
            const lessonHour = timeTable.days[selectedDayIndex][hourIndex];
            return (
              <div
                key={`hour-${hour}`}
                className="shadow dark:shadow-none mb-5 flex"
              >
                <div
                  className={`text-white w-24 rounded-l py-1 flex-shrink-0 flex flex-col justify-center ${
                    isCurrentLesson(hour[1].timeFrom, hour[1].timeTo)
                      ? 'bg-green-600'
                      : 'bg-elektronik-red'
                  }`}
                >
                  <span className="block text-center font-bold mb-1">
                    {hour[1].number}
                  </span>
                  <span className="block text-center text-sm">
                    {hour[1].timeFrom} - {hour[1].timeTo}
                  </span>
                </div>
                <div className="rounded-r bg-gray-50 dark:bg-zinc-800 dark:border-r dark:border-t dark:border-b dark:border-zinc-700 w-full px-4 py-1 overflow-hidden">
                  {lessonHour.map((lesson, lessonIndex) => {
                    const replacement = findReplacement(
                      lesson,
                      hourIndex,
                      selectedDayIndex,
                      replacements,
                      timeTable,
                    );

                    return (
                      <div
                        // eslint-disable-next-line react/no-array-index-key
                        key={`day-${selectedDayIndex}-${hourIndex}-${lessonIndex}`}
                        className={
                          lessonIndex !==
                          timeTable.days[selectedDayIndex][hourIndex].length - 1
                            ? 'mb-2'
                            : ''
                        }
                      >
                        <p className="font-bold mb-1">
                          {replacement?.subject || lesson.subject}
                          {lesson.groupName && ` (${lesson.groupName})`}
                        </p>
                        <div className="text-sm flex">
                          {lesson.className && (
                            <div className="flex items-center mr-4">
                              <AcademicCapIcon className="h-3 w-3 mr-1 shrink-0" />
                              <Link
                                href={`/class/${
                                  getClassData(lesson.className)?.value
                                }`}
                              >
                                <a className="text-elektronik-blue">
                                  {
                                    getClassData(lesson.className)?.name.split(
                                      ' ',
                                    )[0]
                                  }
                                </a>
                              </Link>
                            </div>
                          )}
                          {(replacement?.deputy || lesson.teacher) && (
                            <div className="flex items-center mr-4 w-3/5 xxs:w-auto">
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
                              <MapPinIcon className="h-3 w-3 mr-1 shrink-0" />
                              <Link
                                href={`/room/${
                                  getRoomData(replacement?.room || lesson.room)
                                    ?.value
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
                  })}
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

export default TimeTableAsList;
