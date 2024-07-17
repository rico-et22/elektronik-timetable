import * as React from 'react';
import {
  AcademicCapIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import { ListItem } from '@wulkanowy/timetable-parser';
import Link from 'next/link';
import { useRouter } from 'next/dist/client/router';
import { SortedListItem } from 'types/SortedListItem';
import { SettingsContext } from 'pages/_app';

type ClassesSelectorProps = {
  classes: ListItem[];
};

const ClassesSelector = ({ classes }: ClassesSelectorProps) => {
  const [open, setOpen] = React.useState(false);
  const [sortedClasses, setSortedClasses] = React.useState<SortedListItem[]>(
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
    if (!state && ref && ref.current !== null)
      ref.current.style.maxHeight = `${ref.current.scrollHeight}px`;
    else if (ref.current !== null) ref.current.style.maxHeight = '0';
    stateChangeFunction(!state);
  };
  const { setBottomBarExpanded } = React.useContext(SettingsContext);

  React.useEffect(() => {
    if (classes && classes.length > 0) {
      setSortedClasses(
        Array.from(new Set(classes.map((singleClass) => singleClass.name[0])))
          .sort((a, b) => a.localeCompare(b))
          .map((char) => ({
            char,
            items: classes.filter(
              (singleClass) => singleClass.name[0] === char
            ),
          }))
      );
    }
  }, [classes]);

  const handleLinkClick = () => {
    if (setBottomBarExpanded) setBottomBarExpanded(false);
  };

  return (
    <div className="mb-8">
      <button
        type="button"
        onClick={() => handleClick(open, setOpen, selectorRef)}
        className={`bg-elektronik-blue text-white w-full px-4 py-3 flex justify-between items-center transition-all duration-75 ${getRoundedClass(
          open
        )}`}
      >
        <div className="flex items-center">
          <AcademicCapIcon className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-medium">Oddziały</h2>
        </div>
        {!open && <ChevronDownIcon className="h-5 w-5" />}
        {open && <ChevronUpIcon className="h-5 w-5" />}
      </button>
      <div
        className="bg-white dark:bg-zinc-900 rounded-b-lg overflow-hidden transition-all"
        style={{ maxHeight: 0 }}
        ref={selectorRef}
      >
        {sortedClasses && sortedClasses.length > 0 ? (
          sortedClasses.map((sortedItem) => (
            <div key={`bottomBar-class-letter-${sortedItem.char}`}>
              <h3 className="text-xl mb-2 px-4 first:pt-4 last:pb-4 font-medium">
                {sortedItem.char}
              </h3>
              {sortedItem.items.map((item) => (
                <Link
                  legacyBehavior
                  key={`bottomBar-class-letter-${sortedItem.char}-${item.value}`}
                  href={`/class/${item.value}`}
                  prefetch={false}
                >
                  <a
                    className={`mb-2 mx-4 first:pt-4 last:mb-4 block px-1 py-px rounded transition duration-100 hover:bg-blue-100 dark:hover:text-gray-700 ${
                      router.asPath === `/class/${item.value}`
                        ? 'bg-blue-200 dark:text-zinc-700 hover:bg-blue-200 font-bold'
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

export default ClassesSelector;
