import {
  AcademicCapIcon,
  LocationMarkerIcon,
  SearchIcon,
  UserGroupIcon,
  XIcon,
} from '@heroicons/react/outline';
import { ListItem } from '@wulkanowy/timetable-parser';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SettingsContext } from 'pages/_app';

type SearchProps = {
  classes: ListItem[];
  teachers?: ListItem[];
  rooms?: ListItem[];
};

const Search = ({ classes, teachers, rooms }: SearchProps) => {
  const router = useRouter();

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
            .includes(value.toLowerCase()),
      );
    }
    return [];
  }, [classes, rooms, teachers, value]);

  const roundedClass = React.useMemo(() => {
    if (value.length > 0) return 'rounded-t-lg';
    return 'rounded-lg';
  }, [value]);

  const { setBottomBarExpanded } = React.useContext(SettingsContext);

  const handleLinkClick = () => {
    if (setBottomBarExpanded) setBottomBarExpanded(false);
  };

  return (
    <div className="mb-8">
      <div className="relative">
        <div className="absolute top-0 left-0 h-full flex items-center ml-4">
          <SearchIcon className="h-5 w-5" />
        </div>
        <input
          type="text"
          className={`bg-gray-100 w-full px-12 py-3 flex justify-between items-center transition-all duration-75 text-inherit border border-gray-400 placeholder:text-neutral-500 disabled:opacity-25 disabled:cursor-not-allowed ${roundedClass}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Szukaj..."
          autoComplete="off"
          disabled={!(classes.length || teachers?.length || rooms?.length)}
          name="search-value"
        />
        {value.length > 0 && (
          <button
            type="button"
            className="absolute top-0 right-0 h-full flex items-center mr-4"
            onClick={() => setValue('')}
          >
            <XIcon className="h-5 w-5" />
          </button>
        )}
      </div>
      <div className="rounded-b-lg overflow-hidden">
        {value.length > 0 && (
          <div className="bg-gray-50 transition-all max-h-[27vh] lg:max-h-[50vh] overflow-auto rounded-b-lg border border-gray-300 border-t-0">
            {filteredLinks &&
              filteredLinks.length > 0 &&
              filteredLinks.map((link) => (
                <Link
                  key={`search-${link.type}-${link.value}`}
                  href={`/${link.type}/${link.value}`}
                >
                  <a
                    className={`mb-2 mx-4 first:mt-4 last:mb-4 px-1 py-px rounded transition duration-100 hover:bg-gray-100 flex ${
                      router.asPath === `/${link.type}/${link.value}`
                        ? 'bg-gray-200 hover:bg-gray-200 font-bold'
                        : ''
                    }`}
                    onClick={() => handleLinkClick()}
                  >
                    {link.type === 'class' && (
                      <AcademicCapIcon className="h-4 w-4 mr-2 mt-1 shrink-0" />
                    )}
                    {link.type === 'teacher' && (
                      <UserGroupIcon className="h-4 w-4 mr-2 mt-1 shrink-0" />
                    )}
                    {link.type === 'room' && (
                      <LocationMarkerIcon className="h-4 w-4 mr-2 mt-1 shrink-0" />
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
