import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { List, Table, Timetable } from "@wulkanowy/timetable-parser";
import BottomBar from "../components/BottomBar/BottomBar";
import TopBar from "../components/TopBar";
import NoTimeTableError from "../components/NoTimeTableError";
import {
  TimeTableData,
  TimeTableListResponse,
  TimeTableStatus,
} from "../types/TimeTable";
import fetchTimetable from "../helpers/fetchTimetable";
import TimeTableMobile from "../components/TimeTableMobile";

type TablePageProps = {
  timeTableList: List;
  timeTableListStatus: TimeTableStatus;
  timeTable: TimeTableData;
  timeTableStatus: TimeTableStatus;
};

const TablePage: NextPage<TablePageProps> = ({
  timeTableList,
  timeTableListStatus,
  timeTable,
  timeTableStatus,
}) => {
  return (
    <>
      <Head>
        <title>Plany lekcji</title>
      </Head>
      <div
        className={`${
          timeTableStatus === "ok" ? "" : "h-screen flex flex-col "
        }`}
      >
        <TopBar />
        <TimeTableMobile timeTable={timeTable} timeTableList={timeTableList} />
        {timeTableListStatus === "ok" && (
          <BottomBar timeTableList={timeTableList} />
        )}
        {timeTableStatus !== "ok" && (
          <NoTimeTableError status={timeTableStatus} />
        )}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  let timeTableResponse: TimeTableListResponse = {
    data: "",
    ok: false,
  };
  let timeTableStatus: TimeTableStatus | null = null;
  let id = "";
  if (context.params?.all) {
    if (context.params.all[0] === "class") id = `o${context.params.all[1]}`;
    if (context.params.all[0] === "teacher") id = `n${context.params.all[1]}`;
    if (context.params.all[0] === "room") id = `s${context.params.all[1]}`;
  }
  await fetchTimetable(id).then((response) => {
    timeTableResponse = response;
  });
  let timeTable: Table | null = new Table(timeTableResponse.data);
  if (timeTableResponse?.ok) {
    timeTableStatus = "ok";
  } else timeTableStatus = "error";

  return {
    props: {
      timeTable: {
        days: timeTable.getDays(),
        dayNames: timeTable.getDayNames(),
        hours: timeTable.getHours(),
      },
      timeTableStatus,
    },
  };
};

export default TablePage;
