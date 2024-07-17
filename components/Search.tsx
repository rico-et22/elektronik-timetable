import {
  AcademicCapIcon,
  MapPinIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { ListItem } from '@wulkanowy/timetable-parser';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SettingsContext } from 'pages/_app';
import useKeyPress from 'hooks/useKeyPress';

type SearchProps = {
  classes: ListItem[];
  teachers?: ListItem[];
  rooms?: ListItem[];
};

type ReducerState = {
  selectedIndex: number;
};

enum ActionKind {
  arrowUp = 'arrowUp',
  arrowDown = 'arrowDown',
  select = 'select',
}

type ReducerAction = {
  type: ActionKind;
  payload: number;
};

const Search = ({ classes, teachers, rooms }: SearchProps) => {
  const router = useRouter();

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [value, setValue] = React.useState('');

  const filteredLinks = React.useMemo(() => {
    if (value) {
      const filteredClasses = classes.map((singleClass) => ({
        ...singleClass,
        type: 'class',
      }));
      const filteredTeachers = teachers
        ? teachers.map((singleTeacher) => ({
            ...singleTeacher,
            type: 'teacher',
          }))
        : [];
      const filteredRooms = rooms
        ? rooms.map((singleRoom) => ({ ...singleRoom, type: 'room' }))
        : [];
      return [...filteredClasses, ...filteredTeachers, ...filteredRooms].filter(
        (link) =>
          link.name.toLowerCase().includes(value.toLowerCase()) ||
          link.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Match all unicode character modifiers from decomposited string. Example: ś => s (U+0073) + (U+0301)
            .replace(/\u0142/g, 'l') // Match ł character manually since it doesn't get decomposited into l
            .includes(value.toLowerCase())
      );
    }
    return [];
  }, [classes, rooms, teachers, value]);

  const roundedClass = React.useMemo(() => {
    if (value.length > 0) return 'rounded-t-lg';
    return 'rounded-lg';
  }, [value]);

  const initialState: ReducerState = { selectedIndex: 0 };

  const reducer = (state: ReducerState, action: ReducerAction) => {
    switch (action.type) {
      case ActionKind.arrowUp:
        return {
          selectedIndex:
            state.selectedIndex !== 0
              ? state.selectedIndex - 1
              : filteredLinks.length - 1,
        };
      case ActionKind.arrowDown:
        if (inputRef.current === document.activeElement) {
          return {
            selectedIndex: 0,
          };
        }
        return {
          selectedIndex:
            state.selectedIndex !== filteredLinks.length - 1
              ? state.selectedIndex + 1
              : 0,
        };
      case ActionKind.select:
        return { selectedIndex: action.payload };
      default:
        throw new Error();
    }
  };

  const arrowUpPressed = useKeyPress('ArrowUp');
  const arrowDownPressed = useKeyPress('ArrowDown');
  const [state, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    if (arrowUpPressed && filteredLinks.length > 0) {
      dispatch({ type: ActionKind.arrowUp, payload: 0 });
    }
  }, [arrowUpPressed, filteredLinks]);

  React.useEffect(() => {
    if (arrowDownPressed && filteredLinks.length > 0) {
      dispatch({ type: ActionKind.arrowDown, payload: 0 });
    }
  }, [arrowDownPressed, filteredLinks]);

  React.useEffect(() => {
    document.getElementById(`link-${state.selectedIndex}`)?.focus();
  }, [state]);

  const { setBottomBarExpanded } = React.useContext(SettingsContext);

  const handleLinkClick = (index: number) => {
    if (setBottomBarExpanded) {
      setBottomBarExpanded(false);
    }
    dispatch({ type: ActionKind.select, payload: index });
  };

  return (
    <div className="mb-8">
      <div className="relative">
        <div className="absolute top-0 left-0 h-full flex items-center ml-4">
          <MagnifyingGlassIcon className="h-5 w-5" />
        </div>
        <input
          type="text"
          className={`bg-gray-100 dark:bg-zinc-900 w-full px-12 py-3 flex justify-between items-center transition-all duration-75 text-inherit border border-gray-400 dark:border-zinc-600 placeholder:text-neutral-500 placeholder:dark:text-neutral-400 disabled:opacity-25 disabled:cursor-not-allowed ${roundedClass}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Szukaj..."
          autoComplete="off"
          disabled={!(classes.length || teachers?.length || rooms?.length)}
          name="search-value"
          ref={inputRef}
        />
        {value.length > 0 && (
          <button
            type="button"
            className="absolute top-0 right-0 h-full flex items-center mr-4"
            onClick={() => setValue('')}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>
      <div className="rounded-b-lg overflow-hidden">
        {value.length > 0 && (
          <div className="bg-gray-50 dark:bg-zinc-900 transition-all max-h-[27vh] lg:max-h-[50vh] overflow-auto rounded-b-lg border border-gray-300 dark:border-zinc-700 border-t-0">
            {filteredLinks &&
              filteredLinks.length > 0 &&
              filteredLinks.map((link, index) => (
                <Link // TODO - fix this
                  legacyBehavior
                  key={`search-${link.type}-${link.value}`}
                  href={`/${link.type}/${link.value}`}
                  prefetch={false}
                >
                  <a
                    id={`link-${index}`}
                    className={`mb-2 mx-4 first:mt-4 last:mb-4 px-1 py-px rounded transition duration-100 hover:bg-gray-100 hover:dark:bg-zinc-800 focus:bg-gray-100 focus:dark:bg-zinc-800 flex ${
                      router.asPath === `/${link.type}/${link.value}`
                        ? 'bg-gray-200 dark:bg-zinc-700 hover:bg-gray-200 hover:dark:bg-zinc-700 focus:bg-gray-200 focus:dark:bg-zinc-700 font-bold'
                        : ''
                    }`}
                    onClick={() => handleLinkClick(index)}
                  >
                    {link.type === 'class' && (
                      <AcademicCapIcon className="h-4 w-4 mr-2 mt-1 shrink-0" />
                    )}
                    {link.type === 'teacher' && (
                      <UserGroupIcon className="h-4 w-4 mr-2 mt-1 shrink-0" />
                    )}
                    {link.type === 'room' && (
                      <MapPinIcon className="h-4 w-4 mr-2 mt-1 shrink-0" />
                    )}
                    {link.name}
                  </a>
                </Link>
              ))}
            {filteredLinks && filteredLinks.length === 0 && (
              <p className="text-center my-4">Nie znaleziono</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

Search.defaultProps = {
  teachers: undefined,
  rooms: undefined,
};

export default Search;
