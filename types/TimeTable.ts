import { TableHour, TableLesson } from '@wulkanowy/timetable-parser';

export type TimeTableStatus = 'ok' | 'empty' | 'error';

export interface TimeTableListResponse {
  data: string;
  ok: boolean;
}

export interface TimeTableData {
  dayNames: string[];
  days: TableLesson[][][];
  hours: Record<number, TableHour>;
  generatedDate: string;
}
