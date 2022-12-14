import * as React from 'react';
import {
  DesktopComputerIcon,
  SunIcon,
  MoonIcon,
  ChevronDownIcon,
} from '@heroicons/react/outline';
import { Themes } from 'types/SettingsContext';
import { SettingsContext } from 'pages/_app';

type ThemeSwitcherItem = {
  name: Themes;
  text: string;
};

const themeSwitcherItems: ThemeSwitcherItem[] = [
  {
    name: Themes.system,
    text: 'Systemowy',
  },
  {
    name: Themes.light,
    text: 'Jasny',
  },
  {
    name: Themes.dark,
    text: 'Ciemny',
  },
];

const ThemeSwitcher = () => {
  const { theme, setTheme } = React.useContext(SettingsContext);

  React.useEffect(() => {
    const localTheme = window.localStorage.getItem('theme');
    if (localTheme && setTheme) {
      setTheme(JSON.parse(localTheme) as Themes);
    } else {
      window.localStorage.setItem('theme', JSON.stringify(Themes.system));
    }
  }, [setTheme]);

  React.useEffect(() => {
    window.localStorage.setItem('theme', JSON.stringify(theme));

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const root = window.document.documentElement;

    if (
      theme === Themes.dark ||
      (theme === Themes.system && mediaQuery.matches)
    ) {
      root.classList.add(Themes.dark);
    } else {
      root.classList.remove(Themes.dark);
    }

    const setClass = () => {
      if (theme === Themes.system && mediaQuery.matches) {
        root.classList.add(Themes.dark);
      } else if (theme === Themes.system && !mediaQuery.matches) {
        root.classList.remove(Themes.dark);
      }
    };

    mediaQuery.addEventListener('change', setClass);

    return () => {
      mediaQuery.removeEventListener('change', setClass);
    };
  }, [theme]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (setTheme) {
      setTheme(event.target.value as Themes);
    }
  };

  return (
    <div className="w-20 flex items-center relative bg-gray-50 dark:lg:bg-zinc-800 dark:bg-zinc-900 rounded border border-gray-300 dark:border-zinc-700">
      {theme === Themes.system && (
        <DesktopComputerIcon className="h-8 left-2 absolute text-gray-700 dark:text-zinc-300 pointer-events-none" />
      )}
      {theme === Themes.light && (
        <SunIcon className="h-8 left-2 absolute text-gray-700 dark:text-zinc-300 pointer-events-none" />
      )}
      {theme === Themes.dark && (
        <MoonIcon className="h-8 left-2 absolute text-gray-700 dark:text-zinc-300 pointer-events-none" />
      )}
      <select
        title="Motyw"
        onChange={handleChange}
        value={theme}
        className="appearance-none py-2 w-full opacity-0 cursor-pointer"
      >
        {themeSwitcherItems.map((item) => (
          <option value={item.name} key={item.name}>
            {item.text}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="h-6 right-2 absolute text-gray-700 dark:text-zinc-300 pointer-events-none" />
    </div>
  );
};

export default ThemeSwitcher;
