export default async function fetchTimetable(id: string) {
  let timeTableData = "";
  let timeTableOk = false;
  await fetch(
    `${process.env.NEXT_PUBLIC_PROXY_URL}/${process.env.NEXT_PUBLIC_TIMETABLE_BASE_URL}/plany/${id}.html`
  )
    .then((response) => {
      timeTableOk = response.ok;
      return response.text();
    })
    .then((data) => (timeTableData = data));
  return {data: timeTableData, ok: timeTableOk};
}
