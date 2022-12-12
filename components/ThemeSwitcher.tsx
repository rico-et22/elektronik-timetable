import * as React from 'react';
import {
  DesktopComputerIcon,
  SunIcon,
  MoonIcon,
  ChevronDownIcon,
} from '@heroicons/react/outline';

enum Themes {
  system = 'system',
  light = 'light',
  dark = 'dark',
}

type ThemeSwitcherItems = {
  name: Themes;
  text: string;
};

const themeSwitcherItems: ThemeSwitcherItems[] = [
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
  const [selected, setSelected] = React.useState<Themes>(Themes.system);

  React.useEffect(() => {
    const theme = window.localStorage.getItem('theme');
    if (theme) {
      setSelected(JSON.parse(theme) as Themes);
    } else {
      window.localStorage.setItem('theme', JSON.stringify(Themes.system));
    }
  }, []);

  React.useEffect(() => {
    window.localStorage.setItem('theme', JSON.stringify(selected));

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const root = window.document.documentElement;

    if (
      selected === Themes.dark ||
      (selected === Themes.system && mediaQuery.matches)
    ) {
      root.classList.add(Themes.dark);
    } else {
      root.classList.remove(Themes.dark);
    }

    const setTheme = () => {
      if (selected === Themes.system && mediaQuery.matches) {
        root.classList.add(Themes.dark);
      } else if (selected === Themes.system && !mediaQuery.matches) {
        root.classList.remove(Themes.dark);
      }
    };

    mediaQuery.addEventListener('change', setTheme);

    return () => {
      mediaQuery.removeEventListener('change', setTheme);
    };
  }, [selected]);

  return (
    <div className="flex items-center relative">
      {selected === Themes.system && (
        <DesktopComputerIcon className="h-8 left-2 absolute text-gray-700 dark:text-gray-300 pointer-events-none" />
      )}
      {selected === Themes.light && (
        <SunIcon className="h-8 left-2 absolute text-gray-700 dark:text-gray-300 pointer-events-none" />
      )}
      {selected === Themes.dark && (
        <MoonIcon className="h-8 left-2 absolute text-gray-700 dark:text-gray-300 pointer-events-none" />
      )}
      <select
        onChange={(event) => setSelected(event.target.value as Themes)}
        value={selected}
        className="appearance-none px-12 py-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 cursor-pointer"
      >
        {themeSwitcherItems.map((item) => (
          <option value={item.name} key={item.name}>
            {item.text}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="h-6 right-2 absolute text-gray-700 dark:text-gray-300 pointer-events-none" />
    </div>
  );
};

export default ThemeSwitcher;
