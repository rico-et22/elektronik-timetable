import React from 'react';
import { SettingsContext } from 'pages/_app';
import { List, ListItem } from '@wulkanowy/timetable-parser';
import { useRouter } from 'next/dist/client/router';

import {
  getTeacherDataByCode,
  getTeacherDataByShortName,
  getClassDataByCode,
  getHourData,
  getRoomDataByCode,
} from 'helpers/dataGetters';

import { TimeTableData } from 'types/TimeTable';
import { Replacements } from 'types/Replacements';

import findReplacement from 'helpers/findReplacement';
import { shortDayNames } from 'helpers/ShortDayNames';
import LessonHour from './LessonHour';

interface Props {
  timeTable: TimeTableData;
  timeTableList: List;
  replacements: Replacements | null;
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
    (teacherShortName: string | undefined) =>
      getTeacherDataByShortName(timeTableList, teacherShortName),
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
      lastNotEmptyIndex: timeTable.days.map((day) =>
        day.findLastIndex((dayHour) => dayHour.length > 0)
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
            <span className="xs:hidden">{shortDayNames[index]}</span>
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

                    const replacement = replacements
                      ? findReplacement(
                          lesson,
                          hourIndex,
                          selectedDayIndex,
                          replacements,
                          timeTable,
                          timeTableList
                        )
                      : undefined;

                    let replacedClassData: ListItem | undefined;
                    let replacedTeacherData: ListItem | undefined;
                    let replacedRoomData: ListItem | undefined;

                    if (replacement) {
                      replacedClassData = getClassData(replacement.className);
                      if (replacedClassData === classData)
                        replacedClassData = undefined;
                      // if you wonder what it does search for replacements type

                      if (replacement.deputy) {
                        // if lesson is removed it has no value
                        replacedTeacherData = getTeacherDataUsingShortName(
                          replacement.deputy.shortString
                        ) || {
                          name: replacement.deputy.shortString, // replacement.deputy.notParsed // it gets split so it can't be used
                          value: '-1',
                        };
                        if (replacedTeacherData === teacherData)
                          replacedTeacherData = undefined;
                      }

                      replacedRoomData = getRoomData(replacement.room) || {
                        // sal też może nie być
                        name: replacement.room, // replacement.deputy // it gets split so it can't be used
                        value: '-1',
                      };
                      if (replacedRoomData === roomData)
                        replacedRoomData = undefined;
                      // if(replacedTeacherData) replacedTeacherData.value = replacement!.teacher; // bad idea
                    }
                    return (
                      <div
                        key={`day-${selectedDayIndex}-${hourIndex}-${lessonIndex}`}
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
