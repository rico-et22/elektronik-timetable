import { List, TimetableList } from '@wulkanowy/timetable-parser';
import { useRouter } from 'next/router';
import * as React from 'react';
import { TimeTableData, TimeTableListResponse } from 'types/TimeTable';
import BottomBar from 'components/BottomBar';
import NoTimeTableError from 'components/NoTimeTableError';
import SideBar from 'components/SideBar';
import TimeTableAsList from 'components/TimeTableAsList';
import TimeTableAsTable from 'components/TimeTableAsTable';
import HeaderBar from 'components/HeaderBar';
import TopBar from 'components/TopBar';
import { SettingsContext } from 'pages/_app';
import Spinner from 'components/utils/Spinner';
import { Replacements } from 'types/Replacements';
import completeTimeTableData from 'helpers/completeTimeTableData';
import ReplacementsTable from './ReplacementsTable';
import ReplacementsInfo from './ReplacementsInfo';

interface Props {
  timeTableList: List;
  timeTableListStatus: TimeTableListResponse['status'];
  timeTable?: TimeTableData;
  replacements: Replacements;
  showReplacements: boolean;
}

const Layout = ({
  timeTableList,
  timeTableListStatus,
  timeTable,
  replacements,
  showReplacements,
}: Props) => {
  const router = useRouter();
  const { desktopComponent, showSpinner } = React.useContext(SettingsContext);
  const desktopLayoutRef = React.useRef<HTMLDivElement>(null);
  const printRef = React.useRef<HTMLDivElement>(null);

  const lastPathKey = 'elektronik-timetable-last-path';
  if (timeTable) completeTimeTableData(timeTable, timeTableList);

  // Get last opened path saved in localStorage.
  // If the path corresponds to a valid class/teacher/room in timeTableList, redirect to it.
  // Otherwise, if possible, redirect to the first class in the list.
  // This code runs only on index page "/".
  React.useEffect(() => {
    if (router.asPath === '/') {
      const lastPath = window?.localStorage.getItem(lastPathKey);
      let isCorrect = false;

      const parsedPath: string = lastPath ? JSON.parse(lastPath) : '';
      if (parsedPath.length) {
        const [, tab, id] = parsedPath.split('/');
        if (
          (tab === 'class' &&
            timeTableList.classes.find(
              (singleClass) => singleClass.value === id
            )) ||
          (tab === 'teacher' &&
            timeTableList.teachers?.find(
              (singleTeacher) => singleTeacher.value === id
            )) ||
          (tab === 'room' &&
            timeTableList.rooms?.find((singleRoom) => singleRoom.value === id))
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
      if (typeof window !== 'undefined' && timeTable?.status === 'ok') {
        window.localStorage.setItem(lastPathKey, JSON.stringify(router.asPath));
      }
    }
  }, [router.asPath, timeTable?.status]);

  React.useEffect(() => {
    if (showSpinner) desktopLayoutRef.current?.scrollTo(0, 0);
  }, [showSpinner]);

  return (
    <>
      {/* Small screens */}
      <div
        className={`${
          timeTable?.status === 'ok' ? '' : 'h-screen flex flex-col '
        } lg:hidden`}
      >
        <HeaderBar hideHoursSwitcher={showReplacements} />
        <div
          className={`relative min-h-[calc(100vh-4.5rem)] dark:bg-zinc-900 ${
            showSpinner ? 'h-[calc(100vh-9.75rem)] overflow-hidden' : ''
          }`}
        >
          {timeTable && (
            <TimeTableAsList
              timeTable={timeTable}
              timeTableList={timeTableList}
              replacements={replacements}
            />
          )}
          {showReplacements && (
            <>
              <ReplacementsInfo date={replacements.date} />
              <ReplacementsTable replacements={replacements} />
            </>
          )}
          {showSpinner && <Spinner />}
        </div>
        {timeTableListStatus === 'ok' && (
          <BottomBar
            timeTableList={timeTableList}
            generatedDate={timeTable?.generatedDate}
            showReplacements={showReplacements}
          />
        )}
        {timeTable && timeTable.status !== 'ok' && (
          <NoTimeTableError status={timeTable.status} />
        )}
      </div>
      {/* Large screens */}
      <div className="hidden lg:flex">
        <div className="w-1/4 relative h-screen dark:bg-zinc-800">
          <HeaderBar hideHoursSwitcher={showReplacements} />

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
              <TopBar
                timeTableList={timeTableList}
                printRef={printRef}
                showReplacements={showReplacements}
              />
              {timeTable.status === 'ok' && (
                <>
                  {desktopComponent === 'list' && (
                    <TimeTableAsList
                      timeTable={timeTable}
                      timeTableList={timeTableList}
                      replacements={replacements}
                    />
                  )}
                  {desktopComponent === 'table' && (
                    <TimeTableAsTable
                      timeTable={timeTable}
                      timeTableList={timeTableList}
                      replacements={replacements}
                    />
                  )}
                </>
              )}
            </div>
          )}
          {showReplacements && (
            <div ref={printRef}>
              <TopBar
                timeTableList={timeTableList}
                showReplacements={showReplacements}
                printRef={printRef}
              />
              <ReplacementsInfo date={replacements.date} />
              <ReplacementsTable replacements={replacements} />
            </div>
          )}
          {timeTable && timeTable.status !== 'ok' && (
            <NoTimeTableError status={timeTable.status} />
          )}
          {showSpinner && <Spinner />}
        </div>
      </div>
    </>
  );
};

Layout.defaultProps = {
  timeTable: undefined,
};

export default Layout;
