import React from 'react';
import Link from 'next/link';
import { ListItem } from '@wulkanowy/timetable-parser';

import { TimeTableData } from 'types/TimeTable';

import Icon from './Icon';

interface Props {
  type: TimeTableData['type'];

  data: ListItem | undefined;
  replacementData: ListItem | undefined;

  small: boolean;
}

export default function CustomLink({
  type,
  data,
  replacementData,
  small,
}: Props) {
  if (!data && !replacementData) return null;

  // /class/6
  // 1h 1Informatyk
  const shortName = data?.name.split(' ')[0]; // 1h // 203 // J.Kowalski
  const shortReplacementName = replacementData?.name.split(' ')[0];
  // const smallClass = small ? "shrink-0" : "";

  return (
    <div className="flex items-center mr-4">
      <Icon type={type} />
      <table>
        {replacementData && (
          <tr>
            {replacementData.value !== '-1' ? (
              <Link href={`/${type}/${replacementData.value}`}>
                <a className="text-zastepstwo-yellow">{shortReplacementName}</a>
              </Link>
            ) : (
              <div>{shortReplacementName}</div>
            )}
          </tr>
        )}
        {data && (
          <tr>
            <Link href={`/${type}/${data.value}`}>
              <a className="text-elektronik-blue">
                {replacementData ? <del>{shortName}</del> : shortName}
              </a>
            </Link>
          </tr>
        )}
      </table>
    </div>
  );
}
