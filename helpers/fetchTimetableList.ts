export default async function fetchTimetableList() {
  let timeTableData = "";
  let timeTableOk = false;
  await fetch(
    `${process.env.NEXT_PUBLIC_PROXY_URL ? `${process.env.NEXT_PUBLIC_PROXY_URL}/` : ""}${process.env.NEXT_PUBLIC_TIMETABLE_BASE_URL}/lista.html`
  )
    .then((response) => {
      timeTableOk = response.ok;
      return response.text();
    })
    .then((data) => (timeTableData = data));
  return {data: timeTableData, ok: timeTableOk};
}
