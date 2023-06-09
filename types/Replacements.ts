import { ShortDayNameLowerCase, DayIndex } from 'helpers/ShortDayNames';
import { ReplacementsApiResponse } from './ApiReplacements';

export interface TeacherInfo {
  notParsed: string;
  shortString: string;
  name: string;
  surname: string;
}

export interface Replacement {
  /**
   * Is the lesson removed
   */
  lessonRemoved: boolean;
  // TODO - Trzeba zrobić tak aby przenosiło lekcje poprawnie i ich informacje poprawnie, tylko trzeba na to mądry sposób
  /**
   * Może przyjąć wartości takie jak:
   * Uczniowie zwolnieni do domu\
   * Jeżeli przyjmie wartość "Zajęcia zorganizowane" to "notes", przyjmie wartość podobną do "historia za l. 8" czyli historii na lekcji 8 nie będzie, ale będzie na tej
   */
  lessonRemovedReason: string | null;
  lesson: number;
  subject: string;
  room: string;

  className: string;
  replacedGroups: string[];

  teacher: TeacherInfo;
  deputy: TeacherInfo | null;

  notes: string;
}

export interface Replacements {
  // status: 'ok' | 'not configured' | 'fetching' | 'error';
  generatedDate: string;

  // notParsed: ReplacementsApiResponse["date"];
  /**
   * It's ISO 8601 Date: YYYY-MM-DD\
   * It's like that to make creating a Date instance easier
   */
  date: string;
  /**
   * DD-MM-YYYY\
   */
  PLDate: string;
  shortDayName: ShortDayNameLowerCase;
  dayIndex: DayIndex;

  cols: {
    name: string;
    slug: string;
  }[];

  rows: Replacement[];
}
