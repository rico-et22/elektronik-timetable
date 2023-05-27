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

export interface Replacement {
  lesson: string; // na której lekcji. liczy od 1
  room: string; // w której sali lekcyjnej
  subject: string; // co się teraz ma
  deputy: string; // nauczyciel z którym ma się teraz lekcję
  classgroup: string[]; // pierwsza wartość to, która klasa, a wszystkie inne to które grupy (grupy nie muszą występować jeżeli jest to dla całej klasy)
  notes: string; // notatki

  teacher: string; // poprzedni nauczyciel
}

export interface Replacements {
  status: 'ok' | 'not configured' | 'error';
  generated: string;

  date: string; // Dzień: 29.05.2023 (pon.)
  shortDayName: string; // pon.
  dayIndex: number; // 0

  cols: {
    name: string;
    slug: string;
  }[];
  rows: Replacement[];
}
