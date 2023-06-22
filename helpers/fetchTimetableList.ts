import { TimeTableListResponse } from 'types/TimeTable';
import { List, TimetableList } from '@wulkanowy/timetable-parser';

function isTimetableListEmpty(list: List) {
  return !list.classes.length || !list.teachers?.length || !list.rooms?.length;
}

async function fetchTimeTableList(): Promise<TimeTableListResponse> {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_PROXY_URL
        ? `${process.env.NEXT_PUBLIC_PROXY_URL}/`
        : ''
    }${process.env.NEXT_PUBLIC_TIMETABLE_BASE_URL}/lista.html`
  );

  const timeTableList = new TimetableList(await response.text()).getList();

  let status: TimeTableListResponse['status'];

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
