import { List, TableLesson } from '@wulkanowy/timetable-parser';
import { Replacement, Replacements } from 'types/Replacements';
import { TimeTableData } from 'types/TimeTable';
// eslint-disable-next-line import/no-cycle
import { getTeacherDataByCode } from 'helpers/dataGetters';
import { spaceRegExp } from './sharedVariables';

function normalizeGroup(group: string) {
  // 1/3
  let split = group.split('/')[0];
  // "abc".split("/") === ["abc"]
  if (split === group) split = '';

  // gr2
  const slice = group.slice(2);

  return Number(split || slice);
}

export default function findReplacement(
  { className, groupName, teacher, room }: TableLesson,
  hourIndex: number,
  dayIndex: number,
  { rows, dayIndex: replacementDayIndex, date }: Replacements,
  { type: dataType }: TimeTableData,
  timeTableList: List
): Replacement | undefined {
  const [year, month, day] = date.split('-');
  const replacementDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  );

  // Show only replacements valid this week or later (to be extended by introducing calendar to tables and calculating dates for each day of week as it's passing)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monday = new Date(today);
  monday.setDate(
    today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1)
  );

  if (replacementDate < monday) {
    return undefined;
  }

  if (replacementDayIndex !== dayIndex) return undefined;

  const group = groupName ? normalizeGroup(groupName) : undefined;

  return rows.find((replacementLesson) => {
    if (replacementLesson.lesson - 1 !== hourIndex) return false;

    if (dataType === 'class') {
      if (replacementLesson?.className !== className) return false;
    } else if (dataType === 'room') {
      if (replacementLesson.room !== room) return false;
    } else if (dataType === 'teacher') {
      if (teacher === undefined) return false;

      const teacherShortString = getTeacherDataByCode(timeTableList, teacher)
        ?.name.split(spaceRegExp)
        .shift()
        ?.toLowerCase();

      if (
        replacementLesson.teacher.shortString.toLowerCase() !==
        teacherShortString
      )
        return false;
    } else {
      return false;
    }

    if (group) {
      const replacementGroup = replacementLesson.replacedGroups.find(
        (grp) => normalizeGroup(grp) === group
      );

      if (!replacementGroup) return false;
    }

    return true;
  });
}
