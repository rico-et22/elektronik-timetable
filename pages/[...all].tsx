import * as React from 'react';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from 'components/Layout';
import getRouteContext from 'helpers/getRouteContext';

import { List } from '@wulkanowy/timetable-parser';
import {
  TimeTableData,
  TimeTableResponse,
  TimeTableStatus,
} from 'types/TimeTable';
import fetchTimetable from 'helpers/fetchTimetable';
import fetchTimeTableList from 'helpers/fetchTimetableList';
import fetchReplacements from 'helpers/fetchReplacements';

interface TablePageProps {
  timeTableList: List;
  timeTableListStatus: TimeTableStatus;
  timeTable: TimeTableData;
  timeTableStatus: TimeTableStatus;
}

const TablePage: NextPage<TablePageProps> = (props: TablePageProps) => {
  const { timeTableList } = props;
  const router = useRouter();

  const routeContext = React.useMemo(
    () => getRouteContext(router, timeTableList),
    [timeTableList, router],
  );

  const titleText = React.useMemo(() => {
    if (routeContext.type === 'class') return `Klasa ${routeContext.name}`;
    if (routeContext.type === 'teacher')
      return `Nauczyciel ${routeContext.name}`;
    if (routeContext.type === 'room') return `Sala ${routeContext.name}`;
    return '';
  }, [routeContext.name, routeContext.type]);

  return (
    <>
      <Head>
        <title>{`${titleText} | Elektronik - plan lekcji express`}</title>
        <meta
          property="og:title"
          content={`${titleText} | Elektronik - plan lekcji express`}
        />
      </Head>
      <Layout {...props} />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { timeTableList } = await fetchTimeTableList();

  const { classes, teachers, rooms } = timeTableList.getList();
  const classesPaths = classes?.map((classItem) => `/class/${classItem.value}`);
  const teachersPaths = teachers?.map(
    (teacherItem) => `/teacher/${teacherItem.value}`,
  );
  const roomsPaths = rooms?.map((roomItem) => `/room/${roomItem.value}`);
  if (!classesPaths || !teachersPaths || !roomsPaths)
    throw Error('Unable to obtain all paths');
  return {
    paths: [...classesPaths, ...teachersPaths, ...roomsPaths],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  let id = '';

  if (context.params?.all) {
    // if someone wondered what all is https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes#catch-all-segments
    if (context.params.all[0] === 'class') id = `o${context.params.all[1]}`;
    if (context.params.all[0] === 'teacher') id = `n${context.params.all[1]}`;
    if (context.params.all[0] === 'room') id = `s${context.params.all[1]}`;
  }

  const { timeTable, status: timeTableStatus }: TimeTableResponse =
    await fetchTimetable(id);

  const tableCellText: string = timeTable
    .$('.op  table:nth-child(1) tr:nth-child(1) > td:nth-child(1)')
    .text();
  const date: string | undefined = tableCellText
    .trim()
    .split('\n')[0]
    .split(' ')
    .pop();

  // const replacements = await fetchReplacements();

  return {
    props: {
      timeTable: {
        days: timeTable.getDays(),
        dayNames: timeTable.getDayNames(),
        hours: timeTable.getHours(),
        generatedDate: date,
      },
      timeTableStatus,
      // replacements,
    },
    revalidate: 12 * 3600,
  };
};

export default TablePage;
