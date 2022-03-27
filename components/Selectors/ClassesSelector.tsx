import { useState, useRef, RefObject, useEffect, useContext } from "react";
import {
  AcademicCapIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/outline";
import { ListItem } from "@wulkanowy/timetable-parser";
import { SortedListItem } from "../../types/SortedListItem";
import Link from "next/link";
import { useRouter } from "next/dist/client/router";
import { SettingsContext } from "../../pages/_app";

type ClassesSelectorProps = {
  classes: ListItem[];
};

const ClassesSelector = ({ classes }: ClassesSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [sortedClasses, setSortedClasses] = useState<SortedListItem[]>([]);
  const router = useRouter();
  const getRoundedClass = (stateValue: boolean) => {
    if (stateValue) return "rounded-t-lg";
    else return "rounded-lg";
  };
  const selectorRef = useRef<HTMLDivElement>(null);
  const handleClick = (
    state: boolean,
    stateChangeFunction: Function,
    ref: RefObject<HTMLDivElement>
  ) => {
    if (!state && ref && null !== ref.current)
      ref.current.style.maxHeight = `${ref.current.scrollHeight}px`;
    else if (null !== ref.current) ref.current.style.maxHeight = "0";
    stateChangeFunction(!state);
  };
  const { setBottomBarExpanded } = useContext(SettingsContext);

  useEffect(() => {
    if (classes && classes.length > 0) {
      setSortedClasses(
        Array.from(new Set(classes.map((singleClass) => singleClass.name[0])))
          .sort((a, b) => a.localeCompare(b))
          .map((char) => {
            return {
              char,
              items: classes.filter(
                (singleClass) => singleClass.name[0] === char
              ),
            };
          })
      );
    }
  }, [classes]);

  const handleLinkClick = () => {
    if (setBottomBarExpanded) setBottomBarExpanded(false);
  };

  return (
    <div className="mb-8">
      <button
        onClick={() => handleClick(open, setOpen, selectorRef)}
        className={`bg-blue-100 w-full px-4 py-3 flex justify-between items-center transition-all duration-75 ${getRoundedClass(
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
        className="bg-blue-50 rounded-b-lg overflow-hidden transition-all"
        style={{ maxHeight: 0 }}
        ref={selectorRef}
      >
        {sortedClasses && sortedClasses.length > 0 ? (
          sortedClasses.map((sortedItem) => {
            return (
              <div key={`bottomBar-class-letter-${sortedItem.char}`}>
                <h3 className="text-xl mb-2 px-4 first:pt-4 last:pb-4 font-medium">
                  {sortedItem.char}
                </h3>
                {sortedItem.items.map((item, index) => {
                  return (
                    <Link
                      key={`bottomBar-class-letter-${sortedItem.char}-${index}`}
                      href={`/class/${item.value}`}
                    >
                      <a
                        className={`mb-2 px-4 first:pt-4 last:pb-4 block ${
                          router.asPath === `/class/${item.value}`
                            ? "font-bold"
                            : ""
                        }`}
                        onClick={() => handleLinkClick()}
                      >
                        {item.name}
                      </a>
                    </Link>
                  );
                })}
              </div>
            );
          })
        ) : (
          <p>Brak danych</p>
        )}
      </div>
    </div>
  );
};

export default ClassesSelector;
