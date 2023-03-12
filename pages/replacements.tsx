import * as React from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { List } from '@wulkanowy/timetable-parser';
import { TimeTableStatus } from 'types/TimeTable';
import Layout from 'components/Layout';
import { useRouter } from 'next/router';
import { Replacements } from 'types/Replacements';

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
      <Layout {...props} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const url = process.env.NEXT_PUBLIC_REPLACEMENTS_API_URL;
  if (url) {
    const replacements = await fetch(url).then((response) => response.json());
    return {
      props: {
        replacements,
      },
    };
  }
  return {
    props: {
      replacements: null,
    },
  };
};

export default ReplacementsPage;
