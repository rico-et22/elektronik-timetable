import * as React from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import { List } from "@wulkanowy/timetable-parser";
import ClassesSelector from "./Selectors/ClassesSelector";
import TeachersSelector from "./Selectors/TeachersSelector";
import RoomsSelector from "./Selectors/RoomsSelector";
import { useRouter } from "next/dist/client/router";
import Credits from "./Credits";
import { SettingsContext } from "../pages/_app";
import getRouteContext from "../helpers/getRouteContext";
import Search from "./Search";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";

type BottomBarProps = {
  timeTableList: List;
};

const BottomBar = ({ timeTableList }: BottomBarProps) => {
  const { classes, rooms, teachers } = timeTableList;
  const router = useRouter();
  const { bottomBarExpanded, setBottomBarExpanded } =
    React.useContext(SettingsContext);

  const routeContext = React.useMemo(() => {
    return getRouteContext(router, timeTableList);
  }, [router, timeTableList]);

  const handleToggleButtonClick = () => {
    if (setBottomBarExpanded) setBottomBarExpanded(!bottomBarExpanded);
  };

  React.useEffect(() => {
    const targetElement = document.querySelector("#bottomBar");
    if (bottomBarExpanded && targetElement) {
      // First, disable body scroll via body-scroll-lock library
      disableBodyScroll(targetElement);
      // Then, make CSS changes to fix body width & height issues caused by the library
      document.body.style.width = "100%";
      document.getElementsByTagName("html")[0].style.height = "100vh";
    } else if (targetElement) {
      enableBodyScroll(targetElement);
      document.body.style.width = "";
      document.getElementsByTagName("html")[0].style.height = "";
    }
    return function cleanup() {
      if (targetElement) clearAllBodyScrollLocks()
    }
  }, [bottomBarExpanded]);

  return (
    <div
      className={`w-full fixed bottom-0 transition-all duration-300 transform-gpu ease-out bg-gray-200 filter drop-shadow-2xl flex flex-col z-50 ${
        bottomBarExpanded
          ? "h-full overflow-y-auto"
          : "h-[5.25rem] overflow-hidden"
      }`}
      id="bottomBar"
    >
      <div className="sticky top-0 bg-gray-300 p-4 z-50">
        <button
          onClick={() => handleToggleButtonClick()}
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
          {bottomBarExpanded && <ChevronDownIcon className="h-5 w-5" />}
          {!bottomBarExpanded && <ChevronUpIcon className="h-5 w-5" />}
        </button>
      </div>
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

export default BottomBar;
