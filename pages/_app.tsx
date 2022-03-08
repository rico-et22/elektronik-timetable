import "../styles/globals.css";
import type { AppContext, AppProps } from "next/app";
import { TimeTableListResponse, TimeTableStatus } from "../types/TimeTable";
import fetchTimetableList from "../helpers/fetchTimetableList";
import { TimetableList } from "@wulkanowy/timetable-parser";
import App from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  let timeTableResponse: TimeTableListResponse = {
    data: "",
    ok: false,
  };
  let timeTableListStatus: TimeTableStatus | null = null;
  await fetchTimetableList().then((response) => {
    timeTableResponse = response;
  });
  let timeTableList: TimetableList | null = new TimetableList(
    timeTableResponse.data
  );
  if (
    timeTableResponse?.ok &&
    (timeTableList.getList().classes.length > 0 ||
      timeTableList.getList().teachers?.length ||
      timeTableList.getList().rooms?.length)
  ) {
    timeTableListStatus = "ok";
  } else if (timeTableResponse?.ok) {
    timeTableListStatus = "empty";
  } else timeTableListStatus = "error";

  const appProps = await App.getInitialProps(appContext);

  return {
    ...appProps,
    pageProps: {
      timeTableList: timeTableList.getList(),
      timeTableListStatus,
    },
  };
};

export default MyApp;
