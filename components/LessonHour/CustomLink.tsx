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
    <div
      className={`flex items-center mr-4 ${
        type === 'teacher' && !small ? 'w-1/2' : ''
      }`}
    >
      <Icon type={type} />
      {replacementData && (
        <div>
          {replacementData.value !== '-1' ? (
            <span className="text-zastepstwo-yellow">
              <Link href={`/${type}/${replacementData.value}`}>
                {shortReplacementName}
              </Link>
            </span>
          ) : (
            shortReplacementName
          )}
        </div>
      )}
      {data && (
        <div
          className={`text-elektronik-blue truncate ${
            replacementData ? 'line-through' : ''
          } ${type === 'teacher' && !small ? 'truncate' : ''}`}
        >
          <Link href={`/${type}/${data.value}`}>{shortName}</Link>
        </div>
      )}
    </div>
  );
}
