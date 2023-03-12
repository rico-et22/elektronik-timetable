export interface Replacements {
  date: string;
  generated: string;
  cols: {
    name: string;
    slug: string;
  }[];
  rows: {
    classgroup: string[];
    deputy: string;
    lesson: string;
    notes: string;
    room: string;
    subject: string;
    teacher: string;
  }[];
}
