import { List } from '@wulkanowy/timetable-parser';
import { useRouter } from 'next/router';
import * as React from 'react';
import { TimeTableData, TimeTableStatus } from 'types/TimeTable';
import BottomBar from 'components/BottomBar';
import NoTimeTableError from 'components/NoTimeTableError';
import SideBar from 'components/SideBar';
import TimeTableAsList from 'components/TimeTableAsList';
import TimeTableAsTable from 'components/TimeTableAsTable';
import HeaderBar from 'components/HeaderBar';
import TopBar from 'components/TopBar';
import { SettingsContext } from 'pages/_app';
import Spinner from 'components/Spinner';

interface Props {
  timeTableList: List;
  timeTableListStatus: TimeTableStatus;
  timeTable?: TimeTableData;
  timeTableStatus?: TimeTableStatus;
}

const Layout = ({
  timeTableList,
  timeTableListStatus,
  timeTable,
  timeTableStatus,
}: Props) => {
  const router = useRouter();
  const { desktopComponent, showSpinner } = React.useContext(SettingsContext);
  const desktopLayoutRef = React.useRef<HTMLDivElement>(null);
  const printRef = React.useRef<HTMLDivElement>(null);

  const lastPathKey = 'elektronik-timetable-last-path';

  // Get last opened path saved in localStorage.
  // If the path corresponds to a valid class/teacher/room in timeTableList, redirect to it.
  // Otherwise, if possible, redirect to the first class in the list.
  // This code runs only on index page "/".
  React.useEffect(() => {
    const lastPath = window.localStorage.getItem(lastPathKey);
    if (router.asPath === '/') {
      let isCorrect = false;
      const parsedPath: string = lastPath ? JSON.parse(lastPath) : '';
      if (typeof window !== 'undefined' && lastPath) {
        const splittedPath = parsedPath.split('/');
        if (
          (splittedPath[1] === 'class' &&
            timeTableList.classes.find(
              (singleClass) => singleClass.value === splittedPath[2],
            )) ||
          (splittedPath[1] === 'teacher' &&
            timeTableList.teachers?.find(
              (singleTeacher) => singleTeacher.value === splittedPath[2],
            )) ||
          (splittedPath[1] === 'room' &&
            timeTableList.rooms?.find(
              (singleRoom) => singleRoom.value === splittedPath[2],
            ))
        ) {
          isCorrect = true;
        }
      }
      if (isCorrect) router.replace(parsedPath);
      else if (timeTableList.classes.length > 0) {
        router.replace(`/class/${timeTableList.classes[0].value}`);
      }
    }
  }, [
    router,
    timeTableList.classes,
    timeTableList.rooms,
    timeTableList.teachers,
  ]);

  // If the timetable is valid, save its path to localStorage.
  // The app will automatically redirect to it when opening the app from the index page - if the path is still valid in timeTableList.
  React.useEffect(() => {
    if (router.asPath) {
      if (typeof window !== 'undefined' && timeTableStatus === 'ok') {
        window.localStorage.setItem(lastPathKey, JSON.stringify(router.asPath));
      }
    }
  }, [router.asPath, timeTableStatus]);

  React.useEffect(() => {
    if (showSpinner) desktopLayoutRef.current?.scrollTo(0, 0);
  }, [showSpinner]);

  return (
    <>
      <div
        className={`${
          timeTableStatus === 'ok' ? '' : 'h-screen flex flex-col '
        } lg:hidden`}
      >
        <HeaderBar />
        <div
          className={`relative min-h-[calc(100vh-4.5rem)] dark:bg-zinc-900 ${
            showSpinner ? 'h-[calc(100vh-9.75rem)] overflow-hidden' : ''
          }`}
        >
          {timeTable && (
            <TimeTableAsList
              timeTable={timeTable}
              timeTableList={timeTableList}
            />
          )}
          {showSpinner && <Spinner />}
        </div>
        {timeTableListStatus === 'ok' && (
          <BottomBar
            timeTableList={timeTableList}
            generatedDate={timeTable?.generatedDate}
          />
        )}
        {timeTableStatus && timeTableStatus !== 'ok' && (
          <NoTimeTableError status={timeTableStatus} />
        )}
      </div>
      <div className="hidden lg:flex">
        <div className="w-1/4 relative h-screen dark:bg-zinc-800">
          <HeaderBar />
          {timeTableListStatus === 'ok' && (
            <SideBar
              timeTableList={timeTableList}
              generatedDate={timeTable?.generatedDate}
            />
          )}
        </div>
        <div
          className={`w-3/4 h-screen relative dark:bg-zinc-900 ${
            showSpinner ? 'overflow-hidden' : 'overflow-y-auto'
          }`}
          ref={desktopLayoutRef}
        >
          {timeTable && (
            <div ref={printRef}>
              <TopBar timeTableList={timeTableList} printRef={printRef} />
              {desktopComponent === 'list' && timeTableStatus === 'ok' && (
                <TimeTableAsList
                  timeTable={timeTable}
                  timeTableList={timeTableList}
                />
              )}
              {desktopComponent === 'table' && timeTableStatus === 'ok' && (
                <TimeTableAsTable
                  timeTable={timeTable}
                  timeTableList={timeTableList}
                />
              )}
            </div>
          )}{' '}
          {timeTableStatus && timeTableStatus !== 'ok' && (
            <NoTimeTableError status={timeTableStatus} />
          )}
          {showSpinner && <Spinner />}
        </div>
      </div>
    </>
  );
};

Layout.defaultProps = {
  timeTable: undefined,
  timeTableStatus: undefined,
};

export default Layout;
