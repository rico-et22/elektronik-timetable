import * as React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { List } from '@wulkanowy/timetable-parser';
import { TimeTableStatus } from 'types/TimeTable';
import Layout from 'components/Layout';
import { Replacements } from 'types/Replacements';

type HomeProps = {
  timeTableList: List;
  timeTableListStatus: TimeTableStatus;
  replacements: Replacements;
  showReplacements: boolean;
};

const Home: NextPage<HomeProps> = (props: HomeProps) => (
  <>
    <Head>
      <title>Elektronik - plan lekcji express</title>
      <meta property="og:title" content="Elektronik - plan lekcji express" />
    </Head>
    <Layout {...props} />
  </>
);

export default Home;
