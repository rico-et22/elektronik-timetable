import { List } from '@wulkanowy/timetable-parser';

export const getTeacherDataByCode = (
  timeTableList: List,
  teacherCode?: string
) =>
  timeTableList.teachers?.find(
    (teacher) =>
      teacher.name.replace(/\s+/g, ' ').split(' ')[1] === `(${teacherCode})`
  );

export const getTeacherDataByShortName = (
  timeTableList: List,
  teacherShortName?: string
) =>
  timeTableList.teachers?.find(
    (teacher) =>
      teacher.name.replace(/\s+/g, ' ').split(' ')[0].toLowerCase() ===
      teacherShortName?.toLowerCase()
  );
