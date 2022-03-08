import type { NextPage } from "next";
import Head from "next/head";
import { List } from "@wulkanowy/timetable-parser";
import BottomBar from "../components/BottomBar/BottomBar";
import TopBar from "../components/TopBar";
import NoTimeTableError from "../components/NoTimeTableError";
import { TimeTableStatus } from "../types/TimeTable";

type HomeProps = {
  timeTableList: List;
  timeTableListStatus: TimeTableStatus;
};

const Home: NextPage<HomeProps> = ({ timeTableList, timeTableListStatus }) => {
  return (
    <>
      <Head>
        <title>Plany lekcji</title>
      </Head>
      <div
        className={`h-screen flex flex-col ${
          timeTableListStatus === "ok" ? "justify-between" : ""
        }`}
      >
        <TopBar />
        {timeTableListStatus === "ok" && (
          <BottomBar timeTableList={timeTableList} />
        )}
        {timeTableListStatus !== "ok" && (
          <NoTimeTableError status={timeTableListStatus} />
        )}
      </div>
    </>
  );
};

export default Home;
