import { ShortDayNameLowerCase, DayIndex } from 'helpers/ShortDayNames';

/*
{
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
{
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

// nauczyciele są zapisani w ten sposób "<nazwisko> <pełne imię>"
export interface Replacement {
  /** na której lekcji. liczy od 1 */
  lesson: string;
  room: string; // w której sali lekcyjnej
  subject: string; // co się teraz ma
  deputy: string; // nauczyciel z którym ma się teraz lekcję lub wiadomość "Uczniowie zwolnieni do dom" lub "Uczniowie przychodzą później"
  classgroup: string[]; // pierwsza wartość to, która klasa, a wszystkie inne to które grupy (grupy nie muszą występować jeżeli jest to dla całej klasy)
  notes: string; // notatki

  teacher: string; // poprzedni nauczyciel
}

export interface ReplacementsApiResponse {
  generated: string;

  /** Dzień: DD.MM.YYYY (pon.) */
  date: `Dzień: ${number}.${number}.${number} (${ShortDayNameLowerCase})`;

  cols: {
    name: string;
    slug: string;
  }[];
  rows: Replacement[];
}

export interface Replacements extends ReplacementsApiResponse {
  status: 'ok' | 'not configured' | 'fetching' | 'error';

  shortDayName: ShortDayNameLowerCase;
  dayIndex: DayIndex;
}
