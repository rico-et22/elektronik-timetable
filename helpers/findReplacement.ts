import { TableLesson } from '@wulkanowy/timetable-parser';
import { Replacements } from 'types/Replacements';
/*
const test = {
  "subject": "Wychowanie fizyczne",
  "lesson": "7",
  "teacher": "Poprzedni nauczyciel",
  "deputy": "Uczniowie zwolnieni do domu",
  "classgroup": [
    "3i",
    "1/3" // dlaczego
  ],
  "room": "s5",
  "notes": ""
}
const test2 = {
  "lesson": "5",
  "subject": "Wychowanie fizyczne",
  "room": "210",
  "deputy": "Poprzedni nauczyciel",
  "teacher": "Zastępstwo z",
  "classgroup": [
      "3j",
      "gr1" // dlaczego
  ],
  "notes": "Złączenie grup",
}
*/

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
  { rows }: Replacements,
  { className, groupName }: TableLesson,
  hourIndex: number,
) {
  const group = groupName ? normaliseGroup(groupName) : undefined;

  return rows.find((replacementLesson) => {
    const replacementClassName = replacementLesson.classgroup[0];
    const replacementGroups = replacementLesson.classgroup
      .slice(1)
      .map((replacementGroup) => normaliseGroup(replacementGroup));
    const replacementLessonIndex = Number(replacementLesson.lesson) - 1;

    const isLessonIndexTheSame = replacementLessonIndex === hourIndex;

    const isClassTheSame =
      className === undefined || replacementClassName === className;

    // the group isn't defined when lesson is for the whole class
    const isGroupTheSame =
      group === undefined ||
      (replacementGroups.length > 0 &&
        !!replacementGroups.find(
          (replacementGroup) => replacementGroup === group,
        ));

    if (
      replacementClassName === '1h' &&
      isLessonIndexTheSame &&
      isClassTheSame &&
      isGroupTheSame
    )
      window.console.log(
        { replacementClassName, replacementGroups, replacementLessonIndex },
        { className, group, lessonIndex: hourIndex },
        { isClassTheSame, isLessonIndexTheSame, isGroupTheSame },
      );

    return isLessonIndexTheSame && isClassTheSame && isGroupTheSame;
  });
}
