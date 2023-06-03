import { List, Table } from '@wulkanowy/timetable-parser';
import { TimeTableData } from 'types/TimeTable';
import completeTimeTableData from 'helpers/completeTimeTableData';

function constructURL(dataType: TimeTableData['type'], id: number) {
  const prefix = process.env.NEXT_PUBLIC_PROXY_URL
    ? `${process.env.NEXT_PUBLIC_PROXY_URL}/`
    : '';

  const planPrefix = ['o', 'n', 's'].at(
    ['class', 'teacher', 'room'].indexOf(dataType)
  );

  return `${prefix}${process.env.NEXT_PUBLIC_TIMETABLE_BASE_URL}/plany/${planPrefix}${id}.html`;
}

// @wulkanowy/timetable-parser@1.5.0 źle analizuje plany lekcji ZSE np. https://zse.rzeszow.pl/plan-lekcji/plany/s8.html
export default async function fetchTimetableData(
  dataType: TimeTableData['type'],
  id: number,
  timeTableList?: List
): Promise<TimeTableData> {
  const response = await fetch(constructURL(dataType, id));

  const timeTable = new Table(await response.text());
  const status = response.ok ? 'ok' : 'error';

  // 2023-05-05 -> 05.05.2023
  const generatedDate: string | undefined = timeTable
    .getGeneratedDate()
    ?.split('-')
    .reverse()
    .join('.');

  const timeTableData: TimeTableData = {
    type: dataType,
    id,
    status,

    title: timeTable.getTitle(),
    generatedDate,

    dayNames: timeTable.getDayNames(),
    days: timeTable.getDays(),
    hours: timeTable.getHours(),
  };

  if (timeTableList) completeTimeTableData(timeTableData, timeTableList);

  return timeTableData;
}
