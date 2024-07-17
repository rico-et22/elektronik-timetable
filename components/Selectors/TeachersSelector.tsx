import * as React from 'react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { ListItem } from '@wulkanowy/timetable-parser';
import Link from 'next/link';
import { useRouter } from 'next/dist/client/router';
import { SortedListItem } from 'types/SortedListItem';
import { SettingsContext } from 'pages/_app';

type TeachersSelectorProps = {
  teachers?: ListItem[];
};

const TeachersSelector = ({ teachers }: TeachersSelectorProps) => {
  const [open, setOpen] = React.useState(false);
  const [sortedTeachers, setSortedTeachers] = React.useState<SortedListItem[]>(
    []
  );
  const router = useRouter();
  const getRoundedClass = (stateValue: boolean) => {
    if (stateValue) return 'rounded-t-lg';
    return 'rounded-lg';
  };
  const selectorRef = React.useRef<HTMLDivElement>(null);
  const handleClick = (
    state: boolean,
    stateChangeFunction: Function,
    ref: React.RefObject<HTMLDivElement>
  ) => {
    if (!state && ref && ref.current !== null) {
      ref.current.style.maxHeight = `${ref.current.scrollHeight}px`;
    } else if (ref.current !== null) ref.current.style.maxHeight = '0';
    stateChangeFunction(!state);
  };
  const { setBottomBarExpanded } = React.useContext(SettingsContext);

  React.useEffect(() => {
    if (teachers && teachers.length > 0) {
      setSortedTeachers(
        Array.from(
          new Set(teachers.map((singleTeacher) => singleTeacher.name[2]))
        )
          .sort((a, b) => a.localeCompare(b))
          .map((char) => ({
            char,
            items: teachers.filter(
              (singleTeacher) => singleTeacher.name[2] === char
            ),
          }))
      );
    }
  }, [teachers]);

  const handleLinkClick = () => {
    if (setBottomBarExpanded) setBottomBarExpanded(false);
  };

  return (
    <div className="mb-8">
      <button
        type="button"
        onClick={() => handleClick(open, setOpen, selectorRef)}
        className={`bg-elektronik-red text-white bg-opacity-75 w-full px-4 py-3 flex justify-between items-center transition-all duration-75 ${getRoundedClass(
          open
        )}`}
      >
        <div className="flex items-center">
          <UserGroupIcon className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-medium">Nauczyciele</h2>
        </div>
        {!open && <ChevronDownIcon className="h-5 w-5" />}
        {open && <ChevronUpIcon className="h-5 w-5" />}
      </button>
      <div
        className="bg-white dark:bg-zinc-900 rounded-b-lg overflow-hidden transition-all"
        style={{ maxHeight: 0 }}
        ref={selectorRef}
      >
        {sortedTeachers && sortedTeachers.length > 0 ? (
          sortedTeachers.map((sortedItem) => (
            <div key={`bottomBar-teacher-letter-${sortedItem.char}`}>
              <h3 className="text-xl mb-2 px-4 first:pt-4 last:pb-4 font-medium">
                {sortedItem.char}
              </h3>
              {sortedItem.items.map((item) => (
                <Link
                  legacyBehavior
                  key={`bottomBar-teacher-letter-${sortedItem.char}-${item.value}`}
                  href={`/teacher/${item.value}`}
                  prefetch={false}
                >
                  <a
                    className={`mb-2 mx-4 first:pt-4 last:mb-4 block px-1 py-px rounded transition duration-100 hover:bg-red-100 dark:hover:text-gray-700 ${
                      router.asPath === `/teacher/${item.value}`
                        ? 'bg-red-200 dark:text-zinc-700 hover:bg-red-200 font-bold'
                        : ''
                    }`}
                    onClick={() => handleLinkClick()}
                  >
                    {item.name}
                  </a>
                </Link>
              ))}
            </div>
          ))
        ) : (
          <p>Brak danych</p>
        )}
      </div>
    </div>
  );
};

TeachersSelector.defaultProps = {
  teachers: undefined,
};

export default TeachersSelector;
