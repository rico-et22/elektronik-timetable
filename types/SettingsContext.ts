import { Dispatch, SetStateAction } from "react";

export type DesktopComponent = "table" | "list"

export interface SettingsContextType {
  desktopComponent: DesktopComponent;
  setDesktopComponent?: Dispatch<SetStateAction<DesktopComponent>>;
}
