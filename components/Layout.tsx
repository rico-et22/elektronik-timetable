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
  const { desktopComponent } = React.useContext(SettingsContext);

  React.useEffect(() => {
    if (timeTableList.classes.length > 0 && router.asPath === "/") {
      router.push(`/class/${timeTableList.classes[0].value}`);
    }
  }, [router, timeTableList.classes]);

  return (
    <>
      <div
        className={`${
          timeTableStatus === "ok" ? "" : "h-screen flex flex-col "
        } lg:hidden`}
      >
        <HeaderBar />
        {timeTable && (
          <TimeTableAsList
            timeTable={timeTable}
            timeTableList={timeTableList}
          />
        )}
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
        <div className="w-3/4 h-screen overflow-y-auto">
          {timeTable && (
            <>
              <TopBar timeTableList={timeTableList} />
              {desktopComponent === "list" && (
                <TimeTableAsList
                  timeTable={timeTable}
                  timeTableList={timeTableList}
                />
              )}
              {desktopComponent === "table" && (
                <TimeTableAsTable
                  timeTable={timeTable}
                  timeTableList={timeTableList}
                />
              )}
            </>
          )}
          {timeTableStatus && timeTableStatus !== "ok" && (
            <NoTimeTableError status={timeTableStatus} />
          )}
        </div>
      </div>
    </>
  );
};

export default Layout;
