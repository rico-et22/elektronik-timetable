import { Dispatch, SetStateAction } from "react";
import { ShortHour } from "./ShortHour";

export type DesktopComponent = "table" | "list"

export interface SettingsContextType {
  desktopComponent: DesktopComponent;
  setDesktopComponent?: Dispatch<SetStateAction<DesktopComponent>>;
  showSpinner: boolean;
  bottomBarExpanded: boolean;
  setBottomBarExpanded?: Dispatch<SetStateAction<boolean>>;
  shortHours: ShortHour[];
  showShortHours: boolean;
  setShowShortHours?: Dispatch<SetStateAction<boolean>>;
}
