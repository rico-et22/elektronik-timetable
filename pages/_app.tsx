import * as React from 'react';
import 'styles/globals.css';
import type { AppContext, AppProps } from 'next/app';
import App from 'next/app';
import { useRouter } from 'next/router';
import {
  DesktopComponent,
  SettingsContextType,
  Themes,
} from 'types/SettingsContext';
import fetchTimeTableList from 'helpers/fetchTimetableList';
import { TimeTableListResponse } from 'types/TimeTable';

const shortHours = [
  {
    number: 1,
    timeFrom: '7:10',
    timeTo: '7:40',
  },
  {
    number: 2,
    timeFrom: '7:45',
    timeTo: '8:15',
  },
  {
    number: 3,
    timeFrom: '8:20',
    timeTo: '8:50',
  },
  {
    number: 4,
    timeFrom: '8:55',
    timeTo: '9:25',
  },
  {
    number: 5,
    timeFrom: '9:45',
    timeTo: '10:15',
  },
  {
    number: 6,
    timeFrom: '10:20',
    timeTo: '10:50',
  },
  {
    number: 7,
    timeFrom: '10:55',
    timeTo: '11:25',
  },
  {
    number: 8,
    timeFrom: '11:30',
    timeTo: '12:00',
  },
  {
    number: 9,
    timeFrom: '12:05',
    timeTo: '12:35',
  },
  {
    number: 10,
    timeFrom: '12:40',
    timeTo: '13:10',
  },
  {
    number: 11,
    timeFrom: '13:15',
    timeTo: '13:45',
  },
  {
    number: 12,
    timeFrom: '14:00',
    timeTo: '14:30',
  },
  {
    number: 13,
    timeFrom: '14:35',
    timeTo: '15:05',
  },
  {
    number: 14,
    timeFrom: '15:10',
    timeTo: '15:40',
  },
];

const defaultContextValue: SettingsContextType = {
  desktopComponent: 'table',
  showSpinner: false,
  bottomBarExpanded: false,
  shortHours,
  showShortHours: false,
  theme: Themes.system,
  supportsPWA: false,
};

export const SettingsContext =
  React.createContext<SettingsContextType>(defaultContextValue);

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [desktopComponent, setDesktopComponent] =
    React.useState<DesktopComponent>(defaultContextValue.desktopComponent);
  const [showSpinner, setShowSpinner] = React.useState(
    defaultContextValue.showSpinner,
  );
  const [bottomBarExpanded, setBottomBarExpanded] = React.useState(
    defaultContextValue.bottomBarExpanded,
  );
  const [showShortHours, setShowShortHours] = React.useState(
    defaultContextValue.showShortHours,
  );
  const [theme, setTheme] = React.useState(defaultContextValue.theme);
  const [supportsPWA, setSupportsPWA] = React.useState(false);
  const [promptInstall, setPromptInstall] = React.useState<Event | null>(null);

  const router = useRouter();

  React.useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  React.useEffect(() => {
    const startLoading = () => {
      setShowSpinner(true);
    };
    const stopLoading = () => {
      setShowSpinner(false);
    };

    router.events.on('routeChangeStart', startLoading);
    router.events.on('routeChangeComplete', stopLoading);
    router.events.on('routeChangeError', stopLoading);

    return () => {
      router.events.off('routeChangeStart', startLoading);
      router.events.off('routeChangeComplete', stopLoading);
      router.events.off('routeChangeError', stopLoading);
    };
  }, [router.events]);

  const contextValue = React.useMemo(
    () => ({
      desktopComponent,
      setDesktopComponent,
      showSpinner,
      bottomBarExpanded,
      setBottomBarExpanded,
      shortHours,
      showShortHours,
      setShowShortHours,
      theme,
      setTheme,
      supportsPWA,
      promptInstall,
    }),
    [
      bottomBarExpanded,
      desktopComponent,
      promptInstall,
      showShortHours,
      showSpinner,
      supportsPWA,
      theme,
    ],
  );

  return (
    <SettingsContext.Provider value={contextValue}>
      <Component {...pageProps} />
    </SettingsContext.Provider>
  );
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  const { timeTableList, status: timeTableListStatus }: TimeTableListResponse =
    await fetchTimeTableList();

  const appProps = await App.getInitialProps(appContext);

  return {
    ...appProps,
    pageProps: {
      timeTableList: timeTableList.getList(),
      timeTableListStatus,
    },
  };
};

export default MyApp;
