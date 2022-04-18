import { List } from "@wulkanowy/timetable-parser";
import { useRouter } from "next/router";
import * as React from "react";
import { TimeTableData, TimeTableStatus } from "../types/TimeTable";
import BottomBar from "./BottomBar";
import NoTimeTableError from "./NoTimeTableError";
import SideBar from "./SideBar";
import TimeTableAsList from "./TimeTableAsList";
import TimeTableAsTable from "./TimeTableAsTable";
import HeaderBar from "./HeaderBar";
import TopBar from "./TopBar";
import { SettingsContext } from "../pages/_app";
import Spinner from "./Spinner";

interface Props {
  timeTableList: List;
  timeTableListStatus: TimeTableStatus;
  timeTable?: TimeTableData;
  timeTableStatus?: TimeTableStatus;
}

const Layout = ({
  timeTableList,
  timeTableListStatus,
  timeTable,
  timeTableStatus,
}: Props) => {
  const router = useRouter();
  const { desktopComponent, showSpinner } = React.useContext(SettingsContext);
  const desktopLayoutRef = React.useRef<HTMLDivElement>(null);

  const lastPathKey = "elektronik-timetable-last-path";

  // Get last opened path saved in localStorage.
  // If the path corresponds to a valid class/teacher/room in timeTableList, redirect to it.
  // Otherwise, if possible, redirect to the first class in the list.
  // This code runs only on index page "/".
  React.useEffect(() => {
    const lastPath = window.localStorage.getItem(lastPathKey);
    if (router.asPath === "/") {
      let isCorrect = false;
      const parsedPath: string = lastPath ? JSON.parse(lastPath) : "";
      if (typeof window !== "undefined" && lastPath) {
        const splittedPath = parsedPath.split("/");
        if (
          (splittedPath[1] === "class" &&
            timeTableList.classes.find(
              (singleClass) => singleClass.value === splittedPath[2]
            )) ||
          (splittedPath[1] === "teacher" &&
            timeTableList.teachers?.find(
              (singleTeacher) => singleTeacher.value === splittedPath[2]
            )) ||
          (splittedPath[1] === "room" &&
            timeTableList.rooms?.find(
              (singleRoom) => singleRoom.value === splittedPath[2]
            ))
        ) {
          isCorrect = true;
        }
      }
      if (isCorrect) router.push(parsedPath);
      else if (timeTableList.classes.length > 0) {
        router.push(`/class/${timeTableList.classes[0].value}`);
      }
    }
  }, [
    router,
    timeTableList.classes,
    timeTableList.rooms,
    timeTableList.teachers,
  ]);

  // If the timetable is valid, save its path to localStorage.
  // The app will automatically redirect to it when opening the app from the index page - if the path is still valid in timeTableList.
  React.useEffect(() => {
    if (router.asPath) {
      if (typeof window !== "undefined" && timeTableStatus === "ok") {
        window.localStorage.setItem(lastPathKey, JSON.stringify(router.asPath));
      }
    }
  }, [router.asPath, timeTableStatus]);

  React.useEffect(() => {
    if (showSpinner) desktopLayoutRef.current?.scrollTo(0, 0);
  }, [showSpinner]);

  return (
    <>
      <div
        className={`${
          timeTableStatus === "ok" ? "" : "h-screen flex flex-col "
        } lg:hidden`}
      >
        <HeaderBar />
        <div
          className={`relative min-h-[calc(100vh-4.5rem)] ${
            showSpinner ? "h-[calc(100vh-9.75rem)] overflow-hidden" : ""
          }`}
        >
          {timeTable && (
            <TimeTableAsList
              timeTable={timeTable}
              timeTableList={timeTableList}
            />
          )}
          {showSpinner && <Spinner />}
        </div>
        {timeTableListStatus === "ok" && (
          <BottomBar timeTableList={timeTableList} />
        )}
        {timeTableStatus && timeTableStatus !== "ok" && (
          <NoTimeTableError status={timeTableStatus} />
        )}
      </div>
      <div className="hidden lg:flex">
        <div className="w-1/4 relative h-screen">
          <HeaderBar />
          {timeTableListStatus === "ok" && (
            <SideBar timeTableList={timeTableList} />
          )}
        </div>
        <div
          className={`w-3/4 h-screen relative ${
            showSpinner ? "overflow-hidden" : "overflow-y-auto"
          }`}
          ref={desktopLayoutRef}
        >
          {timeTable && (
            <>
              <TopBar timeTableList={timeTableList} />
              {desktopComponent === "list" && timeTableStatus === "ok" && (
                <TimeTableAsList
                  timeTable={timeTable}
                  timeTableList={timeTableList}
                />
              )}
              {desktopComponent === "table" && timeTableStatus === "ok" && (
                <TimeTableAsTable
                  timeTable={timeTable}
                  timeTableList={timeTableList}
                />
              )}
            </>
          )}{" "}
          {timeTableStatus && timeTableStatus !== "ok" && (
            <NoTimeTableError status={timeTableStatus} />
          )}
          {showSpinner && <Spinner />}
        </div>
      </div>
    </>
  );
};

export default Layout;
