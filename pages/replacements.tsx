import * as React from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { List } from '@wulkanowy/timetable-parser';
import { TimeTableStatus } from 'types/TimeTable';
import Layout from 'components/Layout';
import { useRouter } from 'next/router';
import { Replacements } from 'types/Replacements';
import fetchReplacements from 'helpers/fetchReplacements';

interface ReplacementsPageProps {
  timeTableList: List;
  timeTableListStatus: TimeTableStatus;
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

// export const getServerSideProps: GetServerSideProps = async () => {
//   const replacements = await fetchReplacements();
//   return {
//     props: {
//       replacements,
//       isReplacements: true, // helper variable
//     },
//   };
// };

export default ReplacementsPage;
