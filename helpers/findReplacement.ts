import { TableLesson } from '@wulkanowy/timetable-parser';
import { Replacement, Replacements } from 'types/Replacements';
import { TimeTableData } from 'types/TimeTable';

function normaliseGroup(group: string) {
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
): Replacement | undefined {
  if (dayIndex !== replacementDayIndex) return undefined;

  const group = groupName ? normaliseGroup(groupName) : undefined;
  return replacementLessons.find((replacementLesson) => {
    const replacementLessonIndex = Number(replacementLesson.lesson) - 1;
    if (replacementLessonIndex !== hourIndex) return false;

    if (dataType === 'class') {
      const replacementClassName = replacementLesson.classgroup[0];
      if (replacementClassName !== className) return false; // the className is set by completeTimeTableData
    } else if (dataType === 'room') {
      if (replacementLesson.room !== room) return false;
    } else {
      // checking teacher is hard to implement with this replacements api. Because
      // timeTableList.teachers?
      return false;
    }

    if (group) {
      const replacementGroups = replacementLesson.classgroup
        .slice(1)
        .find((replacementGroup) => normaliseGroup(replacementGroup) === group);

      if (!replacementGroups) return false;
    }

    return true;
  });
}
