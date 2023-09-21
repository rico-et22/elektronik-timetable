import * as React from 'react';
import { Tooltip } from 'react-tooltip';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { Replacements, Replacement } from 'types/Replacements';
import sortReplacementsRows from 'helpers/replacements';
import ReplacementsInfo from './ReplacementsInfo';

interface Props {
  replacements: Replacements;
}

interface SortingSettings {
  columnName: keyof Replacement;
  orderType: 'asc' | 'desc';
}

const ReplacementsTable = ({ replacements }: Props) => {
  const replacementsSortingSettingsKey = 'replacements-sorting-settings';

  const replacementsSortingSettings = window.localStorage.getItem(
    replacementsSortingSettingsKey
  );

  const defaultReplacementsSortingSettings: SortingSettings =
    replacementsSortingSettings
      ? (JSON.parse(replacementsSortingSettings) as SortingSettings)
      : {
          columnName: 'lesson',
          orderType: 'asc',
        };

  const [sortingSettings, setSortingSettings] = React.useState<SortingSettings>(
    defaultReplacementsSortingSettings
  );

  React.useEffect(() => {
    window.localStorage.setItem(
      replacementsSortingSettingsKey,
      JSON.stringify(sortingSettings)
    );
  }, [sortingSettings]);

  const sortRows = React.useCallback(
    (a: Replacement, b: Replacement) =>
      sortReplacementsRows(
        a,
        b,
        sortingSettings.columnName,
        sortingSettings.orderType
      ),
    [sortingSettings]
  );

  const handleColumnTitleClick = (columnName: string) => {
    setSortingSettings((prev) => ({
      columnName: (columnName === 'classgroup'
        ? 'className'
        : columnName) as keyof Replacement,
      orderType:
        (prev.columnName === columnName ||
          (prev.columnName === 'className' && columnName === 'classgroup')) &&
        prev.orderType === 'asc'
          ? 'desc'
          : 'asc',
    }));
  };

  const dateParts = replacements.PLDate.split('.').map((datePart) =>
    parseInt(datePart, 10)
  );

  return (
    <>
      <div className="px-4 lg:px-10 pb-24 lg:pb-16 overflow-x-auto dark:bg-zinc-900">
        <ReplacementsInfo
          date={new Date(dateParts[2], dateParts[1] - 1, dateParts[0])}
        />
        <table className="w-full border-separate border-0 drop-shadow-lg mb-5 lg:mb-0 dark:drop-shadow-none rounded-lg border-spacing-0">
          <thead className="rounded">
            <tr className="text-white text-sm rounded-t-lg">
              {replacements.cols.map((col, index) => {
                const isSorting =
                  sortingSettings.columnName === col.slug ||
                  (sortingSettings.columnName === 'className' &&
                    col.slug === 'classgroup');

                return (
                  <th
                    key={`replacementsTable-col-${index}`}
                    className={`py-3 border bg-elektronik-red border-gray-100/50 dark:border-zinc-700/50 cursor-pointer sort-replacements-tooltip ${
                      index === 0 ? 'rounded-tl-lg' : ''
                    } ${
                      index === replacements.cols.length - 1
                        ? 'rounded-tr-lg'
                        : ''
                    }`}
                    data-tooltip-content={
                      isSorting && sortingSettings.orderType === 'asc'
                        ? 'Sortuj malejąco'
                        : 'Sortuj rosnąco'
                    }
                    onClick={() => handleColumnTitleClick(col.slug)}
                  >
                    <div className="flex justify-center items-center">
                      <span>{col.name}</span>
                      {isSorting &&
                        (sortingSettings.orderType === 'asc' ? (
                          <ChevronDownIcon className="h-3 w-3 ml-2 stroke-[4px]" />
                        ) : (
                          <ChevronUpIcon className="h-3 w-3 ml-2 stroke-[4px]" />
                        ))}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {replacements.rows.sort(sortRows).map((row, index) => (
              <tr key={`replacementsTable-row-${index}`} className="text-xs">
                <td
                  className={`bg-gray-50 dark:bg-zinc-800 p-2 border dark:border-zinc-700 ${
                    index === replacements.rows.length - 1
                      ? 'rounded-bl-lg'
                      : ''
                  }`}
                >
                  {row.lesson}
                </td>
                <td className="bg-gray-50 dark:bg-zinc-800 p-2 border dark:border-zinc-700">
                  {row.teacher.notParsed}
                </td>
                <td className="bg-gray-50 dark:bg-zinc-800 p-2 border dark:border-zinc-700">
                  <b>{row.className}</b> {row.replacedGroups.join(' - ')}
                </td>
                <td className="bg-gray-50 dark:bg-zinc-800 p-2 border dark:border-zinc-700">
                  {row.subject}
                </td>
                <td className="bg-gray-50 dark:bg-zinc-800 p-2 border dark:border-zinc-700">
                  {row.room}
                </td>
                <td className="bg-gray-50 dark:bg-zinc-800 p-2 border dark:border-zinc-700">
                  {row.deputy?.notParsed || row.lessonRemovedReason}
                </td>
                <td
                  className={`bg-gray-50 dark:bg-zinc-800 p-2 border dark:border-zinc-700 ${
                    index === replacements.rows.length - 1
                      ? 'rounded-br-lg'
                      : ''
                  }`}
                >
                  {row.notes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Tooltip anchorSelect=".sort-replacements-tooltip" />
    </>
  );
};

export default ReplacementsTable;
