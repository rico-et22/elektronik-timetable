import * as React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { List } from '@wulkanowy/timetable-parser';
import { TimeTableData } from 'types/TimeTable';
import Layout from 'components/Layout';
import { useRouter } from 'next/router';
import { Replacements } from 'types/Replacements';

interface ReplacementsPageProps {
  timeTableList: List;
  timeTableListStatus: TimeTableData['status'];
  replacements: Replacements;
}

const ReplacementsPage: NextPage<ReplacementsPageProps> = (
  props: ReplacementsPageProps,
) => {
  const { replacements } = props;
  const router = useRouter();
  React.useEffect(() => {
    if (!replacements) router.push('/');
  });
  return (
    <>
      <Head>
        <title>Zastępstwa | Elektronik - plan lekcji express</title>
        <meta
          property="og:title"
          content="Zastępstwa | Elektronik - plan lekcji express"
        />
      </Head>
      <Layout {...props} showReplacements />
    </>
  );
};

export default ReplacementsPage;
