import { useState, useRef, RefObject, useEffect, useMemo } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
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

const BottomBar = ({ timeTableList }: BottomBarProps) => {
  const { classes, rooms, teachers } = timeTableList;
  const [expanded, setExpanded] = useState(false);
  const [isRoomsTabOpen, setIsRoomsTabOpen] = useState(false);
  const router = useRouter();

  const getRoundedClass = (stateValue: boolean) => {
    if (stateValue) return "rounded-t-lg";
    else return "rounded-lg";
  };
  const roomsList = useRef<HTMLDivElement>(null);
  const handleClick = (
    state: boolean,
    stateChangeFunction: Function,
    ref: RefObject<HTMLDivElement>
  ) => {
    if (!state && ref && null !== ref.current)
      ref.current.style.maxHeight = `${ref.current.scrollHeight}px`;
    else if (null !== ref.current) ref.current.style.maxHeight = "0";
    stateChangeFunction(!state);
  };

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

  useEffect(() => {
    setExpanded(false);
  }, [routeContext]);

  useEffect(() => {
    if (expanded) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
  }, [expanded])

  return (
    <div
      className={`w-full fixed bottom-0 transition-all duration-500 transform-gpu ease-in-out bg-gray-300 filter drop-shadow-2xl ${
        expanded ? "h-full overflow-y-auto" : "h-[5.25rem] overflow-hidden"
      }`}
    >
      <div className="sticky top-0 bg-gray-300 p-4">
        <button
          onClick={() => setExpanded(!expanded)}
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
          {expanded && <ChevronDownIcon className="h-5 w-5" />}
          {!expanded && <ChevronUpIcon className="h-5 w-5" />}
        </button>
      </div>
      <div className="p-4">
        <ClassesSelector classes={classes} />
        <TeachersSelector teachers={teachers} />
        <RoomsSelector rooms={rooms} />
      </div>
    </div>
  );
};

export default BottomBar;
