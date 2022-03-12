import { useEffect, useMemo } from "react";
import { List } from "@wulkanowy/timetable-parser";
import ClassesSelector from "./Selectors/ClassesSelector";
import TeachersSelector from "./Selectors/TeachersSelector";
import RoomsSelector from "./Selectors/RoomsSelector";
import { useRouter } from "next/dist/client/router";

type BottomBarProps = {
  timeTableList: List;
};

type RouteContext = {
  type: string | undefined;
  typeName: string | undefined;
  name: string | undefined;
};

const SideBar = ({ timeTableList }: BottomBarProps) => {
  const { classes, rooms, teachers } = timeTableList;
  const router = useRouter();

  const routeContext = useMemo(() => {
    const returnedValue: RouteContext = {
      type: undefined,
      typeName: undefined,
      name: undefined,
    };
    if (router.query.all && router.query.all.length > 1) {
      returnedValue.type = router.query.all[0];
      const value = router.query.all[1];
      if (returnedValue.type === "class" && classes.length > 0) {
        returnedValue.typeName = "Oddziały";
        returnedValue.name = classes.find(
          (singleClass) => singleClass.value === value
        )?.name;
      } else if (returnedValue.type === "room" && rooms && rooms.length > 0) {
        returnedValue.typeName = "Sale";
        returnedValue.name = rooms.find(
          (singleRoom) => singleRoom.value === value
        )?.name;
      } else if (
        returnedValue.type === "teacher" &&
        teachers &&
        teachers.length > 0
      ) {
        returnedValue.typeName = "Nauczyciele";
        returnedValue.name = teachers.find(
          (singleTeacher) => singleTeacher.value === value
        )?.name;
      }
    }
    return returnedValue;
  }, [classes, rooms, router.query.all, teachers]);

  return (
    <div
      className="w-full transform-gpu bg-gray-300 filter drop-shadow-2xl h-[calc(100vh-4.5rem)] overflow-y-auto"
    >
      <div className="sticky top-0 bg-gray-300 p-4">
        <div
          className={`bg-gray-100 w-full px-4 py-3 flex justify-between items-center transition-all duration-75 rounded-lg`}
        >
          <h2 className="text-lg truncate">
            {routeContext.name && routeContext.typeName && (
              <span className="text-gray-500">{routeContext.typeName} / </span>
            )}
            {routeContext.name && (
              <span className="font-medium">{routeContext.name}</span>
            )}
            {!routeContext.name && "Wybierz z listy..."}
          </h2>
        </div>
      </div>
      <div className="p-4">
        <ClassesSelector classes={classes} />
        <TeachersSelector teachers={teachers} />
        <RoomsSelector rooms={rooms} />
      </div>
    </div>
  );
};

export default SideBar;
