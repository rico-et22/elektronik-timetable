import * as React from 'react';
import { List } from '@wulkanowy/timetable-parser';
import ClassesSelector from 'components/Selectors/ClassesSelector';
import TeachersSelector from 'components/Selectors/TeachersSelector';
import RoomsSelector from 'components/Selectors/RoomsSelector';
import Credits from 'components/Credits';
import Search from 'components/Search';

type BottomBarProps = {
  timeTableList: List;
};

const SideBar = ({ timeTableList }: BottomBarProps) => {
  const { classes, rooms, teachers } = timeTableList;

  return (
    <div className="w-full transform-gpu bg-gray-200 filter drop-shadow-xl h-[calc(100vh-4.5rem)] overflow-y-auto flex flex-col">
      <div className="p-4">
        <Search classes={classes} teachers={teachers} rooms={rooms} />
        <ClassesSelector classes={classes} />
        <TeachersSelector teachers={teachers} />
        <RoomsSelector rooms={rooms} />
      </div>
      <div className="px-4 mb-5 mt-auto">
        <Credits />
      </div>
    </div>
  );
};

export default SideBar;
