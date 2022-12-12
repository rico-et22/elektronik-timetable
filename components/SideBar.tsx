import * as React from 'react';
import { List } from '@wulkanowy/timetable-parser';
import ClassesSelector from 'components/Selectors/ClassesSelector';
import TeachersSelector from 'components/Selectors/TeachersSelector';
import RoomsSelector from 'components/Selectors/RoomsSelector';
import Credits from 'components/Credits';
import Search from 'components/Search';

type BottomBarProps = {
  timeTableList: List;
  generatedDate: string | undefined;
};

const SideBar = ({ timeTableList, generatedDate }: BottomBarProps) => {
  const { classes, rooms, teachers } = timeTableList;

  return (
    <div className="w-full transform-gpu bg-gray-200 dark:bg-gray-800 filter drop-shadow-xl dark:drop-shadow-none dark:border-r dark:border-gray-700 h-[calc(100vh-4.5rem)] overflow-y-auto flex flex-col">
      <div className="p-4">
        <Search classes={classes} teachers={teachers} rooms={rooms} />
        <ClassesSelector classes={classes} />
        <TeachersSelector teachers={teachers} />
        <RoomsSelector rooms={rooms} />
      </div>
      <div className="px-4 mb-5 mt-auto">
        {generatedDate && (
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-4">
            Wygenerowano {generatedDate}
          </p>
        )}
        <Credits />
      </div>
    </div>
  );
};

export default SideBar;
