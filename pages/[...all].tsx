import * as React from 'react';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from 'components/Layout';
import getRouteContext from 'helpers/getRouteContext';

import { List } from '@wulkanowy/timetable-parser';
import { TimeTableData, TimeTableListResponse } from 'types/TimeTable';
import fetchTimetableData from 'helpers/fetchTimetable';
import fetchTimeTableList from 'helpers/fetchTimetableList';
import { Replacements } from 'types/Replacements';

interface TablePageProps {
  timeTableList: List;
  timeTableListStatus: TimeTableListResponse['status'];
  timeTable: TimeTableData;
  replacements: Replacements;
}

const TablePage: NextPage<TablePageProps> = (props: TablePageProps) => {
  const { timeTableList } = props;

  const router = useRouter();

  const routeContext = React.useMemo(
    () => getRouteContext(router, timeTableList),
    [timeTableList, router]
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
      <Layout {...props} showReplacements={false} />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { timeTableList } = await fetchTimeTableList();

  const { classes, teachers, rooms } = timeTableList;
  const classesPaths = classes?.map((classItem) => `/class/${classItem.value}`);
  const teachersPaths = teachers?.map(
    (teacherItem) => `/teacher/${teacherItem.value}`
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
  const [tab, value] = context.params?.all || [];

  let timeTableData: TimeTableData | null = null;

  if (tab === 'class' || tab === 'teacher' || tab === 'room')
    timeTableData = await fetchTimetableData(tab, Number(value));

  return {
    props: {
      timeTable: timeTableData,
    },
    revalidate: 12 * 3600,
  };
};

export default TablePage;
