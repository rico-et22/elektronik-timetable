import { List, TableHour, TableLesson } from '@wulkanowy/timetable-parser';

export interface TimeTableData {
  type: 'class' | 'teacher' | 'room';
  id: number;
  status: 'ok' | 'empty' | 'error';

  title: string;
  generatedDate?: string;

  dayNames: string[];
  days: TableLesson[][][];
  hours: Record<number, TableHour>;
}

export interface TimeTableListResponse {
  timeTableList: List;
  status: TimeTableData['status'];
}
