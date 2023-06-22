import {
  List,
  ListItem,
  TableHour,
  TableLesson,
} from '@wulkanowy/timetable-parser';
import { ShortHour } from 'types/ShortHour';
import { NextRouter } from 'next/router';
import { Replacements } from 'types/Replacements';
import { TimeTableData } from 'types/TimeTable';
import { spaceRegExp } from './sharedVariables';
// eslint-disable-next-line import/no-cycle
import findReplacement from './findReplacement';

export const getTeacherDataByCode = (
  timeTableList: List,
  teacherCode?: string
) =>
  timeTableList.teachers?.find(
    (teacher) => teacher.name.split(spaceRegExp)[1] === `(${teacherCode})`
  );

export const getTeacherDataByShortName = (
  timeTableList: List,
  teacherShortName?: string
) =>
  timeTableList.teachers?.find(
    (teacher) =>
      teacher.name.split(spaceRegExp)[0].toLowerCase() ===
      teacherShortName?.toLowerCase()
  );
/**
 *
 * @param timeTableList
 * @param classCode e.g. 1h, 4ffs
 * @returns
 */
export const getClassDataByCode = (timeTableList: List, classCode?: string) =>
  timeTableList.classes?.find(
    (singleClass) => singleClass.name.split(spaceRegExp)[0] === classCode
  );

/**
 *
 * @param timeTableList
 * @param roomCode 202, s4 - sala gimnastyczna 4, 0.8 - piwnica, sgD - sala gimnastyczna dziewczyn
 * @returns
 */
export const getRoomDataByCode = (timeTableList: List, roomCode?: string) =>
  timeTableList.rooms?.find(
    (room) => room.name.split(spaceRegExp)[0] === roomCode
  );

export const getHourData = (
  timeTableHours: Record<number, TableHour>,
  shortHours: ShortHour[]
) =>
  Object.fromEntries(
    Object.entries(timeTableHours).map((key) => {
      const shortHour = shortHours.find(
        (hour) => hour.number === Number(key[0])
      );
      if (shortHour) return [key[0], shortHour];

      return [key[0], key[1]];
    })
  );

export const getReplacementData = (
  lesson: TableLesson,
  router: NextRouter,
  timeTableList: List,
  replacements: Replacements | null,
  hourIndex: number,
  dayIndex: number,
  timeTable: TimeTableData
) => {
  const classData =
    router.query.all && router.query.all[0] !== 'class'
      ? getClassDataByCode(timeTableList, lesson.className)
      : undefined;
  const teacherData =
    router.query.all && router.query.all[0] !== 'teacher'
      ? getTeacherDataByCode(timeTableList, lesson.teacher)
      : undefined;
  const roomData =
    (router.query.all &&
      router.query.all[0] !== 'room' &&
      getRoomDataByCode(timeTableList, lesson.room)) ||
    undefined;

  const replacement = replacements
    ? findReplacement(
        lesson,
        hourIndex,
        dayIndex,
        replacements,
        timeTable,
        timeTableList
      )
    : undefined;
  let replacedClassData: ListItem | undefined;
  let replacedTeacherData: ListItem | undefined;
  let replacedRoomData: ListItem | undefined;

  if (replacement) {
    replacedClassData = getClassDataByCode(
      timeTableList,
      replacement.className
    );
    if (replacedClassData === classData) replacedClassData = undefined;
    // if you wonder what it does search for replacements type

    if (replacement.deputy) {
      // if lesson is removed it has no value
      replacedTeacherData = getTeacherDataByShortName(
        timeTableList,
        replacement.deputy.shortString
      ) || {
        name: replacement.deputy.shortString, // replacement.deputy.notParsed // it gets split so it can't be used
        value: '-1',
      };
      if (replacedTeacherData === teacherData) replacedTeacherData = undefined;
    }

    replacedRoomData = getRoomDataByCode(timeTableList, replacement.room) || {
      // sal też może nie być
      name: replacement.room, // replacement.deputy // it gets split so it can't be used
      value: '-1',
    };
    if (replacedRoomData === roomData) replacedRoomData = undefined;
    // if(replacedTeacherData) replacedTeacherData.value = replacement!.teacher; // bad idea
  }
  return {
    classData,
    teacherData,
    roomData,
    replacedClassData,
    replacedRoomData,
    replacedTeacherData,
    replacement,
  };
};
