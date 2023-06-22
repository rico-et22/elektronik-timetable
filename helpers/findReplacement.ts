import { List, TableLesson } from '@wulkanowy/timetable-parser';
import { Replacement, Replacements } from 'types/Replacements';
import { TimeTableData } from 'types/TimeTable';
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
  { rows, dayIndex: replacementDayIndex }: Replacements,
  { type: dataType }: TimeTableData,
  timeTableList: List
): Replacement | undefined {
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

      if (replacementLesson.teacher.shortString !== teacherShortString)
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
