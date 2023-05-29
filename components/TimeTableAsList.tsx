import {
  AcademicCapIcon,
  MapPinIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { List, ListItem } from '@wulkanowy/timetable-parser';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import * as React from 'react';
import getClassDataByCode from 'helpers/getClassDataByCode';
import getHourData from 'helpers/getHourData';
import getRoomDataByNumber from 'helpers/getRoomDataByNumber';
import {
  getTeacherDataByCode,
  getTeacherDataByShortName,
} from 'helpers/getTeacherData';
import { SettingsContext } from 'pages/_app';
import { TimeTableData } from 'types/TimeTable';
import { Replacements } from 'types/Replacements';
import findReplacement from 'helpers/findReplacement';
import LessonHour from './LessonHour';

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
    [timeTableList]
  );

  const getTeacherDataUsingCode = React.useCallback(
    (teacherCode: string | undefined) =>
      getTeacherDataByCode(timeTableList, teacherCode),
    [timeTableList]
  );
  const getTeacherDataUsingShortName = React.useCallback(
    (teacherCode: string | undefined) =>
      getTeacherDataByCode(timeTableList, teacherCode),
    [timeTableList]
  );

  const getRoomData = React.useCallback(
    (roomNumber: string | undefined) =>
      getRoomDataByNumber(timeTableList, roomNumber),
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
      if (selectedDayIndex === new Date().getDay() - 1 && isClientSide)
        return (
          new Date().setHours(currentTimeSplit[0], currentTimeSplit[1]) >=
            new Date().setHours(startTimeSplit[0], startTimeSplit[1]) &&
          new Date().setHours(currentTimeSplit[0], currentTimeSplit[1]) <=
            new Date().setHours(endTimeSplit[0], endTimeSplit[1])
        );
      return false;
    },
    [selectedDayIndex, isClientSide]
  );

  const dayTrimData = React.useMemo(
    () => ({
      firstNotEmptyIndex: timeTable.days.map((day) =>
        day.findIndex((dayHour) => dayHour.length > 0)
      ),
      lastNotEmptyIndex: timeTable.days.map(
        (day) =>
          day.length -
          1 -
          day
            .slice()
            .reverse()
            .findIndex((dayHour) => dayHour.length > 0)
      ),
    }),
    [timeTable.days]
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
                    const classData = getClassData(lesson.className);
                    const teacherData = getTeacherDataUsingCode(lesson.teacher);
                    const roomData = getRoomData(lesson.room);

                    const replacement = findReplacement(
                      lesson,
                      hourIndex,
                      selectedDayIndex,
                      replacements,
                      timeTable,
                      timeTableList
                    );
                    let replacedClassData: ListItem | undefined;
                    let replacedTeacherData: ListItem | undefined;
                    let replacedRoomData: ListItem | undefined;
                    let lessonRemoved = false;

                    if (replacement) {
                      lessonRemoved =
                        !!replacement.deputy.includes('Uczniowie');

                      replacedClassData = getClassData(
                        replacement.classgroup[0]
                      );
                      if (replacedClassData === classData)
                        replacedClassData = undefined;
                      // if you wonder what it does search for replacements type

                      if (!lessonRemoved) {
                        const [surname, name] = replacement.deputy.split(
                          ' '
                        ) || ['', ''];
                        const replacedTeacherString = `${name[0]}.${surname}`;

                        replacedTeacherData = getTeacherDataUsingShortName(
                          replacedTeacherString
                        ) || {
                          name: replacedTeacherString, // replacement.deputy // it gets split so it can't be used
                          value: '-1',
                        };
                        if (replacedTeacherData === teacherData)
                          replacedTeacherData = undefined;
                      }
                      // if(replacedTeacherData) replacedTeacherData.value = replacement!.teacher; // bad idea

                      replacedRoomData = getRoomData(replacement.room);
                      if (replacedRoomData === roomData)
                        replacedRoomData = undefined;
                    }

                    return (
                      <div
                        key={`day-${selectedDayIndex}-${hourIndex}-${lessonIndex}`}
                      >
                        <LessonHour
                          replacement={replacement}
                          subject={lesson.subject}
                          groupName={lesson.groupName}
                          lessonRemoved={lessonRemoved}
                          replacedClassData={replacedClassData}
                          replacedTeacherData={replacedTeacherData}
                          replacedRoomData={replacedRoomData}
                          classData={classData}
                          teacherData={teacherData}
                          roomData={roomData}
                          small
                        />
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
