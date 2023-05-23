import { Table } from '@wulkanowy/timetable-parser';
import { TimeTableResponse } from 'types/TimeTable';

async function fetchTimetable(id: string): Promise<TimeTableResponse> {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_PROXY_URL
        ? `${process.env.NEXT_PUBLIC_PROXY_URL}/`
        : ''
    }${process.env.NEXT_PUBLIC_TIMETABLE_BASE_URL}/plany/${id}.html`,
  );

  const timeTable = new Table(await response.text());
  const status = response.ok ? 'ok' : 'error';

  return { timeTable, status };
}

export default fetchTimetable;
