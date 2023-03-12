import * as React from 'react';
import { Replacements } from 'types/Replacements';

interface Props {
  replacements: Replacements;
}

const ReplacementsTable = ({ replacements }: Props) => (
  <div className="px-4 lg:px-10 pb-24 lg:pb-16 overflow-x-auto">
    <table className="w-full border-separate border-0 drop-shadow-lg dark:drop-shadow-none rounded-lg border-spacing-0">
      <thead className="rounded">
        <tr className="text-white text-sm rounded-t-lg">
          {replacements.cols
            .slice(0, replacements.cols.length - 1)
            .map((col, index) => (
              <th
                key={`replacementsTable-col-${index}`}
                className={`py-3 border bg-elektronik-red border-gray-100/50 dark:border-zinc-700/50 ${
                  index === 0 ? 'rounded-tl-lg' : ''
                } ${
                  index === replacements.cols.length - 2 ? 'rounded-tr-lg' : ''
                }`}
              >
                <span>{col.name}</span>
              </th>
            ))}
        </tr>
      </thead>
      <tbody>
        {replacements.rows.map((row, index) => (
          <tr key={`replacementsTable-row-${index}`} className="text-xs">
            <td
              className={`bg-gray-50 dark:bg-zinc-800 p-2 border dark:border-zinc-700 ${
                index === replacements.rows.length - 1 ? 'rounded-bl-lg' : ''
              }`}
            >
              {row.lesson}
            </td>
            <td className="bg-gray-50 dark:bg-zinc-800 p-2 border dark:border-zinc-700">
              {row.teacher}
            </td>
            <td className="bg-gray-50 dark:bg-zinc-800 p-2 border dark:border-zinc-700">
              {row.classgroup.map(
                (x, classGroupIndex) =>
                  `${x} ${
                    classGroupIndex !== row.classgroup.length - 1 ? '- ' : ''
                  }`,
              )}
            </td>
            <td className="bg-gray-50 dark:bg-zinc-800 p-2 border dark:border-zinc-700">
              {row.subject}
            </td>
            <td className="bg-gray-50 dark:bg-zinc-800 p-2 border dark:border-zinc-700">
              {row.room}
            </td>
            <td
              className={`bg-gray-50 dark:bg-zinc-800 p-2 border dark:border-zinc-700 ${
                index === replacements.rows.length - 1 ? 'rounded-br-lg' : ''
              }`}
            >
              {row.deputy}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ReplacementsTable;
