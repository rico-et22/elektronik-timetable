import * as React from "react";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { List, Table, Timetable } from "@wulkanowy/timetable-parser";
import BottomBar from "../components/BottomBar";
import HeaderBar from "../components/HeaderBar";
import NoTimeTableError from "../components/NoTimeTableError";
import {
  TimeTableData,
  TimeTableListResponse,
  TimeTableStatus,
} from "../types/TimeTable";
import fetchTimetable from "../helpers/fetchTimetable";
import Layout from "../components/Layout";
import getRouteContext from "../helpers/getRouteContext";
import { useRouter } from "next/router";

interface TablePageProps {
  timeTableList: List;
  timeTableListStatus: TimeTableStatus;
  timeTable: TimeTableData;
  timeTableStatus: TimeTableStatus;
};

const TablePage: NextPage<TablePageProps> = (props) => {
  const router = useRouter()

  const routeContext = React.useMemo(() => {
    return getRouteContext(router, props.timeTableList);
  }, [props.timeTableList, router]); 

  const titleText = React.useMemo(() => {
    if (routeContext.type === "class") return `Klasa ${routeContext.name}`
    if (routeContext.type === "teacher") return `Nauczyciel ${routeContext.name}`
    if (routeContext.type === "room") return `Sala ${routeContext.name}`
  }, [routeContext.name, routeContext.type])

  return (
    <>
      <Head>
        <title>{`${titleText} | Elektronik - plan lekcji express`}</title>
        <meta property="og:title" content={`${titleText} | Elektronik - plan lekcji express`} />
      </Head>
      <Layout {...props} />
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
