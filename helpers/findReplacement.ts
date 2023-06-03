import { List, TableLesson } from '@wulkanowy/timetable-parser';
import { Replacement, Replacements } from 'types/Replacements';
import { TimeTableData } from 'types/TimeTable';
import { getTeacherDataByCode } from 'helpers/getTeacherData';

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
  { rows: replacementLessons, dayIndex: replacementDayIndex }: Replacements,
  { type: dataType }: TimeTableData,
  timeTableList: List
): Replacement | undefined {
  if (dayIndex !== replacementDayIndex) return undefined;

  const group = groupName ? normalizeGroup(groupName) : undefined;
  return replacementLessons.find((replacementLesson) => {
    const replacementLessonIndex = Number(replacementLesson.lesson) - 1;
    if (replacementLessonIndex !== hourIndex) return false;

    if (dataType === 'class') {
      const replacementClassName = replacementLesson.classgroup[0];
      if (replacementClassName !== className) return false; // the className is set by completeTimeTableData
    } else if (dataType === 'room') {
      if (replacementLesson.room !== room) return false;
    } else if (dataType === 'teacher') {
      if (teacher === undefined) return false;
      const [surname, name] = replacementLesson.teacher.split(' ');
      const replacedTeacherString = `${name[0]}.${surname}`.toLowerCase();

      const teacherString = getTeacherDataByCode(timeTableList, teacher)
        ?.name.toLowerCase()
        .split(' ')
        .shift();

      if (replacedTeacherString !== teacherString) return false;
    } else {
      return false;
    }

    if (group) {
      const replacementGroups = replacementLesson.classgroup
        .slice(1)
        .find((replacementGroup) => normalizeGroup(replacementGroup) === group);

      if (!replacementGroups) return false;
    }

    return true;
  });
}
