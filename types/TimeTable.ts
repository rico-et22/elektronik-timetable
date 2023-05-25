import {
  List,
  Table,
  TableHour,
  TableLesson,
} from '@wulkanowy/timetable-parser';

export type TimeTableStatus = 'ok' | 'empty' | 'error';

export interface TimeTableResponse {
  timeTable: Table;
  status: TimeTableStatus;
}

export interface TimeTableListResponse {
  timeTableList: List;
  status: TimeTableStatus;
}

export interface TimeTableData {
  dayNames: string[];
  days: TableLesson[][][];
  hours: Record<number, TableHour>;
  generatedDate: string;
}
