import { TimeTableStatus, TimeTableListResponse } from 'types/TimeTable';
import { List, TimetableList } from '@wulkanowy/timetable-parser';

function isTimetableListEmpty(timetableList: TimetableList) {
  const list: List = timetableList.getList();

  return !list.classes?.length || !list.teachers?.length || !list.rooms?.length;
}

async function fetchTimeTableList(): Promise<TimeTableListResponse> {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_PROXY_URL
        ? `${process.env.NEXT_PUBLIC_PROXY_URL}/`
        : ''
    }${process.env.NEXT_PUBLIC_TIMETABLE_BASE_URL}/lista.html`,
  );

  const timeTableList = new TimetableList(await response.text());

  let status: TimeTableStatus; // this V looks better than Conditional (ternary) operator

  if (response.ok) {
    status = 'ok';
    if (isTimetableListEmpty(timeTableList)) {
      status = 'empty';
    }
  } else {
    status = 'error';
  }

  return { timeTableList, status };
}

export default fetchTimeTableList;
