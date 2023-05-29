import { Dispatch, SetStateAction } from 'react';
import { ShortHour } from 'types/ShortHour';
import { Replacements } from './Replacements';

export type DesktopComponent = 'table' | 'list';

export enum Themes {
  system = 'system',
  light = 'light',
  dark = 'dark',
}

export interface SettingsContextType {
  desktopComponent: DesktopComponent;
  setDesktopComponent?: Dispatch<SetStateAction<DesktopComponent>>;
  showSpinner: boolean;
  bottomBarExpanded: boolean;
  setBottomBarExpanded?: Dispatch<SetStateAction<boolean>>;
  shortHours: ShortHour[];
  showShortHours: boolean;
  setShowShortHours?: Dispatch<SetStateAction<boolean>>;
  theme: Themes;
  setTheme?: Dispatch<SetStateAction<Themes>>;
  supportsPWA: boolean;
  promptInstall?: Event | null;

  replacements: Replacements;
}
