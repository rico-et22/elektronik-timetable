import * as React from 'react';
import { Tooltip } from 'react-tooltip';
import { Replacements, Replacement } from 'types/Replacements';
import sortReplacementsRows from 'helpers/sort';
import ReplacementsInfo from './ReplacementsInfo';

interface Props {
  replacements: Replacements;
}

interface SortedColumn {
  name: keyof Replacement;
  type: 'asc' | 'desc';
}

const ReplacementsTable = ({ replacements }: Props) => {
  const replacementsSortingSettings = window.localStorage.getItem(
    'replacements-sorting-settings'
  );

  const defaultReplacementsSortingSettings = {
    name: replacementsSortingSettings
      ? JSON.parse(replacementsSortingSettings).name
      : 'lesson',
    type: replacementsSortingSettings
      ? JSON.parse(replacementsSortingSettings).type
      : 'asc',
  };

  const [sortedColumn, setSortedColumn] = React.useState<SortedColumn>(
    defaultReplacementsSortingSettings
  );

  React.useEffect(() => {
    window.localStorage.setItem(
      'replacements-sorting-settings',
      JSON.stringify(sortedColumn)
    );
  }, [sortedColumn]);

  const sortRows = React.useCallback(
    (a: Replacement, b: Replacement) =>
      sortReplacementsRows(a, b, sortedColumn.name, sortedColumn.type),
    [sortedColumn]
  );

  const handleColumnTitleClick = (name: string) => {
    setSortedColumn((prev) => ({
      name: (name === 'classgroup' ? 'className' : name) as keyof Replacement,
      type:
        (prev.name === name ||
          (prev.name === 'className' && name === 'classgroup')) &&
        prev.type === 'asc'
          ? 'desc'
          : 'asc',
    }));
  };

  return (
    <>
      <div className="px-4 lg:px-10 pb-24 lg:pb-16 overflow-x-auto dark:bg-zinc-900">
        <ReplacementsInfo date={replacements.PLDate} />
        <table className="w-full border-separate border-0 drop-shadow-lg mb-5 lg:mb-0 dark:drop-shadow-none rounded-lg border-spacing-0">
          <thead className="rounded">
            <tr className="text-white text-sm rounded-t-lg">
              {replacements.cols
                // .slice(0, replacements.cols.length - 1)
                .map((col, index) => (
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
                      sortedColumn.name === col.slug &&
                      sortedColumn.type === 'asc'
                        ? 'Sortuj malejąco'
                        : 'Sortuj rosnąco'
                    }
                    onClick={() => handleColumnTitleClick(col.slug)}
                  >
                    <span>{col.name}</span>
                  </th>
                ))}
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
