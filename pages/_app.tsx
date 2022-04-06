import "../styles/globals.css";
import type { AppContext, AppProps } from "next/app";
import { TimeTableListResponse, TimeTableStatus } from "../types/TimeTable";
import fetchTimetableList from "../helpers/fetchTimetableList";
import { TimetableList } from "@wulkanowy/timetable-parser";
import App from "next/app";
import { createContext, useEffect, useState } from "react";
import {
  DesktopComponent,
  SettingsContextType,
} from "../types/SettingsContext";
import { useRouter } from "next/router";

const shortHours = [
  {
    number: 1,
    timeFrom: "7:10",
    timeTo: "7:40",
  },
  {
    number: 2,
    timeFrom: "7:45",
    timeTo: "8:15",
  },
  {
    number: 3,
    timeFrom: "8:20",
    timeTo: "8:50",
  },
  {
    number: 4,
    timeFrom: "8:55",
    timeTo: "9:25",
  },
  {
    number: 5,
    timeFrom: "9:45",
    timeTo: "10:15",
  },
  {
    number: 6,
    timeFrom: "10:20",
    timeTo: "10:50",
  },
  {
    number: 7,
    timeFrom: "10:55",
    timeTo: "11:25",
  },
  {
    number: 8,
    timeFrom: "11:30",
    timeTo: "12:00",
  },
  {
    number: 9,
    timeFrom: "12:05",
    timeTo: "12:35",
  },
  {
    number: 10,
    timeFrom: "12:40",
    timeTo: "13:10",
  },
  {
    number: 11,
    timeFrom: "13:15",
    timeTo: "13:45",
  },
  {
    number: 12,
    timeFrom: "14:00",
    timeTo: "14:30",
  },
  {
    number: 13,
    timeFrom: "14:35",
    timeTo: "15:05",
  },
  {
    number: 14,
    timeFrom: "15:10",
    timeTo: "15:40",
  },
];

const defaultContextValue: SettingsContextType = {
  desktopComponent: "table",
  showSpinner: false,
  bottomBarExpanded: false,
  shortHours,
  showShortHours: false,
};

export const SettingsContext =
  createContext<SettingsContextType>(defaultContextValue);

function MyApp({ Component, pageProps }: AppProps) {
  const [desktopComponent, setDesktopComponent] = useState<DesktopComponent>(
    defaultContextValue.desktopComponent
  );
  const [showSpinner, setShowSpinner] = useState(
    defaultContextValue.showSpinner
  );
  const [bottomBarExpanded, setBottomBarExpanded] = useState(
    defaultContextValue.bottomBarExpanded
  );
  const [showShortHours, setShowShortHours]
 = useState(defaultContextValue.showShortHours)
  const router = useRouter();

  useEffect(() => {
    const startLoading = () => {
      setShowSpinner(true);
    };
    const stopLoading = () => {
      setShowSpinner(false);
    };

    router.events.on("routeChangeStart", startLoading);
    router.events.on("routeChangeComplete", stopLoading);
    router.events.on("routeChangeError", stopLoading);

    return () => {
      router.events.off("routeChangeStart", startLoading);
      router.events.off("routeChangeComplete", stopLoading);
      router.events.off("routeChangeError", stopLoading);
    };
  }, [router.events]);

  return (
    <SettingsContext.Provider
      value={{
        desktopComponent,
        setDesktopComponent,
        showSpinner,
        bottomBarExpanded,
        setBottomBarExpanded,
        shortHours,
        showShortHours,
        setShowShortHours
      }}
    >
      <Component {...pageProps} />
    </SettingsContext.Provider>
  );
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
