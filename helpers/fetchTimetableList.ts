import { TimeTableStatus, TimeTableListResponse } from 'types/TimeTable';
import { List, TimetableList } from '@wulkanowy/timetable-parser';

function isTimetableListEmpty(list: List) {
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

  const timeTableList = new TimetableList(await response.text()).getList();

  let status: TimeTableStatus; // this V looks better than Conditional (ternary) operator

  if (response.ok) {
    status = 'ok';
    if (isTimetableListEmpty(timeTableList)) {
      status = 'empty';
    }
  } else {
    status = 'error';
  }

  console.log(timeTableList);

  return { timeTableList, status };
}

export default fetchTimeTableList;
