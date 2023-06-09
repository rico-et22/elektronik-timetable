import { List, TableHour } from '@wulkanowy/timetable-parser';
import { ShortHour } from 'types/ShortHour';
import { spaceRegExp } from './sharedVariables';

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

/**
 *
 * @param type getter type
 */
const getData = (
  type:
    | 'teacherDataByCode'
    | 'teacherDataByShortName'
    | 'classDataByCode'
    | 'roomDataByCode',
  timeTableList: List
) => {};

export default getData;
