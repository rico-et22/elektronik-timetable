import {
  ReplacementsApiResponse,
  Replacement as ApiReplacement,
} from 'types/ApiReplacements';
import { Replacements, Replacement, TeacherInfo } from 'types/Replacements';
import {
  shortDayNamesLowerCase,
  ShortDayNameLowerCase,
  DayIndex,
} from 'helpers/ShortDayNames';
import { spaceRegExp } from './sharedVariables';
// const groupRegExp = /\((\d+)\/(\d+)\)/

function parseTeacher(teacherString: string): TeacherInfo {
  const [surname, name] = teacherString.split(spaceRegExp);

  return {
    notParsed: teacherString,
    shortString: name ? `${name}.${surname}` : surname,

    name,
    surname,
  };
}

function normalizeApiReplacement(replacement: ApiReplacement): Replacement {
  const lessonRemoved =
    replacement.deputy.includes('Uczniowie') ||
    replacement.deputy.includes('Zastępstwo');
  const lessonRemovedReason = lessonRemoved ? replacement.deputy : null;

  const [className, ...replacedGroups] = replacement.classgroup;

  const teacher = parseTeacher(replacement.teacher);

  let deputy: Replacement['deputy'] = null;

  if (!lessonRemoved) {
    deputy = parseTeacher(replacement.deputy);
  }

  return {
    lessonRemoved,
    lessonRemovedReason,

    lesson: Number(replacement.lesson),
    subject: replacement.subject,
    room: replacement.room,

    className,
    replacedGroups,

    teacher,
    deputy,

    notes: replacement.notes,
  };
}

// const dateRegExp =
//   /(?<day>\d{1,2})\.(?<month>\d{2})\.(?<year>\d{4,})\s+\((?<shortDayName>\w{2,3}\.)\)/gm;

// interface DateRegExpGroups {
//   day: string;
//   month: string;
//   year: string;
//   shortDayName: ShortDayNameLowerCase;
// }

export default async function fetchReplacements(): Promise<Replacements | null> {
  const url = process.env.NEXT_PUBLIC_REPLACEMENTS_API_URL;
  if (url) {
    try {
      // https://developer.mozilla.org/en-US/docs/Web/API/fetch https://developer.mozilla.org/en-US/docs/Web/API/Request/cache
      const replacementsResponse: ReplacementsApiResponse = await fetch(url, {
        cache: 'no-store',
      }).then((response) => response.json());

      // eslint-disable-next-line prefer-const
      const [, PLDate, shortDayNameWithBrackets] =
        replacementsResponse.date.split(spaceRegExp);
      const shortDayName = <ShortDayNameLowerCase>(
        shortDayNameWithBrackets.slice(1, -1)
      );

      // if(!dateInfo) throw new Error(`Couldn't parse date from replacements api. Got: ${replacementsResponse.date}`);
      const [day, month, year] = PLDate.split('.');

      const dayIndex = <DayIndex>shortDayNamesLowerCase.indexOf(shortDayName);

      const replacements = replacementsResponse.rows
        .map((apiReplacement) => normalizeApiReplacement(apiReplacement))
        .sort((a, b) => a.lesson - b.lesson);

      return {
        generatedDate: replacementsResponse.generated,

        PLDate,
        date: `${year}-${month}-${day}`,
        shortDayName,
        dayIndex,

        cols: replacementsResponse.cols,
        rows: replacements,
      };
    } catch (e) {
      console.error(
        "Couldn't fetch replacements (zastępstwa) api. Are you sure you have configured the right link?\n",
        e
      );
    }
  }

  return null;
}
