import { CollectionIcon, TableIcon } from "@heroicons/react/outline";
import { List } from "@wulkanowy/timetable-parser";
import { useRouter } from "next/router";
import * as React from "react";
import { SettingsContext } from "../pages/_app";
import { DesktopComponent } from "../types/SettingsContext";

type TopBarProps = {
  timeTableList: List;
};

type RouteContext = {
  type: string | undefined;
  typeName: string | undefined;
  name: string | undefined;
};

const TopBar = ({ timeTableList }: TopBarProps) => {
  const { classes, rooms, teachers } = timeTableList;
  const router = useRouter();
  const { desktopComponent, setDesktopComponent } = React.useContext(SettingsContext);

  const routeContext = React.useMemo(() => {
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

  const handleButtonClick = (value: DesktopComponent) => {
    if (setDesktopComponent) setDesktopComponent(value);
  };

  return (
    <div className="bg-gray-100 flex h-[4.5rem] px-10">
      <div className="w-full" />
      <div className=" w-full flex justify-center items-center">
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
      <div className="w-full flex items-center justify-end">
        <div className="bg-gray-50 flex items-center rounded">
          <button
            onClick={() => handleButtonClick("table")}
            aria-label="Tabela"
            className={`px-2 py-1 rounded-l ${desktopComponent === "table" ? "bg-blue-200" : ""}`}
          >
            <TableIcon className="h-8 text-gray-700" />
          </button>
          <button
            onClick={() => handleButtonClick("list")}
            aria-label="Lista"
            className={`px-2 py-1 rounded-r ${desktopComponent === "list" ? "bg-blue-200" : ""}`}
          >
            <CollectionIcon className="h-8 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
