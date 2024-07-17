import * as React from 'react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { ListItem } from '@wulkanowy/timetable-parser';
import Link from 'next/link';
import { useRouter } from 'next/dist/client/router';
import { SortedListItem } from 'types/SortedListItem';
import { SettingsContext } from 'pages/_app';

type RoomsSelectorProps = {
  rooms?: ListItem[];
};

const RoomsSelector = ({ rooms }: RoomsSelectorProps) => {
  const [open, setOpen] = React.useState(false);
  const [sortedRooms, setSortedRooms] = React.useState<SortedListItem[]>([]);
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

  const handleLinkClick = () => {
    if (setBottomBarExpanded) setBottomBarExpanded(false);
  };
  React.useEffect(() => {
    if (rooms && rooms.length > 0) {
      setSortedRooms(
        /* [
        {
          char: "Piwnice",
          items: rooms
            .filter((room) => room.name.split(" ")[0][0] === "0")
            .sort((a, b) => a.name.localeCompare(b.name, undefined, {numeric: true})),
        },
        {
          char: "Sale „...w”",
          items: rooms
            .filter((room) => room.name.split(" ")[0][1] === "w")
            .sort((a, b) => a.name.localeCompare(b.name, undefined, {numeric: true})),
        },
        {
          char: "Sale gimnastyczne",
          items: rooms
            .filter((room) => room.name.split(" ")[0][0] === "s")
            .sort((a, b) => a.name.localeCompare(b.name, undefined, {numeric: true})),
        },
        {
          char: "Parter",
          items: rooms
            .filter(
              (room) =>
                Number(room.name.split(" ")[0]) >= 1 &&
                Number(room.name.split(" ")[0]) < 100
            )
            .sort((a, b) => a.name.localeCompare(b.name, undefined, {numeric: true})),
        },
      ] */ [
          {
            char: '',
            items: rooms,
          },
        ]
      );
    }
  }, [rooms]);
  return (
    <div className="mb-8">
      <button
        type="button"
        onClick={() => handleClick(open, setOpen, selectorRef)}
        className={`bg-green-700 text-white bg-opacity-75 w-full px-4 py-3 flex justify-between items-center transition-all duration-75 ${getRoundedClass(
          open
        )}`}
      >
        <div className="flex items-center">
          <MapPinIcon className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-medium">Sale</h2>
        </div>
        {!open && <ChevronDownIcon className="h-5 w-5" />}
        {open && <ChevronUpIcon className="h-5 w-5" />}
      </button>
      <div
        className="bg-white dark:bg-zinc-900 rounded-b-lg overflow-hidden transition-all"
        style={{ maxHeight: 0 }}
        ref={selectorRef}
      >
        {sortedRooms && sortedRooms.length > 0 ? (
          sortedRooms.map((sortedItem) => (
            <div key={`bottomBar-room-${sortedItem.char}`}>
              <h3 className="text-xl mb-2 px-4 first:pt-4 last:pb-4 font-medium">
                {sortedItem.char}
              </h3>
              {sortedItem.items.map((item) => (
                <Link
                  legacyBehavior
                  key={`bottomBar-room-letter-${sortedItem.char}-${item.value}`}
                  href={`/room/${item.value}`}
                  prefetch={false}
                >
                  <a
                    className={`mb-2 mx-4 first:pt-4 last:mb-4 block px-1 py-px rounded transition duration-100 hover:bg-green-100 dark:hover:text-gray-700 ${
                      router.asPath === `/room/${item.value}`
                        ? 'bg-green-200 dark:text-zinc-700 hover:bg-green-200 font-bold'
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

RoomsSelector.defaultProps = {
  rooms: undefined,
};

export default RoomsSelector;
