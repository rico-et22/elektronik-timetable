import { ShortDayNameLowerCase, DayIndex } from 'helpers/ShortDayNames';

/*
{
  "lesson": "7",
  "subject": "Wychowanie fizyczne",
  "room": "s5",
  "deputy": "Uczniowie zwolnieni do domu",
  "teacher": "Poprzedni nauczyciel",
  "classgroup": [
    "3i",
    "1/3" // dlaczego
  ],
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

{
  "lesson": "5",
  "teacher": "Poprzedni nauczyciel",
  "classgroup": [
    "2h",
    "gr2"
  ],
  "subject": "poprzednia lekcja",
  "room": "17",
  "deputy": "Zajęcia zorganizowane",
  "notes": "historia za l. 8"
},
*/

// nauczyciele są zapisani w ten sposób "<nazwisko> <pełne imię>"
export interface Replacement {
  /** na której lekcji. liczy od 1 */
  lesson: string;
  room: string; // w której sali lekcyjnej
  subject: string; // co się teraz ma
  /**
   * Uczniowie zwolnieni do domu
   * Jeżeli przyjmie wartość "Zajęcia zorganizowane" to "notes", przyjmie wartość podobną do "historia za l. 8" czyli historii na lekcji 8 nie będzie
   *
   */
  deputy: string; // nauczyciel z którym ma się teraz lekcję lub wiadomość "Uczniowie zwolnieni do dom" lub "Uczniowie przychodzą później"
  classgroup: string[]; // pierwsza wartość to, która klasa, a wszystkie inne to które grupy (grupy nie muszą występować jeżeli jest to dla całej klasy)
  /**
   * Uczniowie zwolnieni do domu
   * za nieobecny oddział
   * Matura próbna z matematyki
   */
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
