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
        type === 'teacher' && !small ? 'w-1/2 overflow-hidden' : ''
      } ${small ? 'text-sm' : ''}`}
    >
      <Icon type={type} />
      <div
        className={
          replacementData ? 'flex flex-col overflow-hidden' : 'overflow-hidden'
        }
      >
        {data && (
          <div
            className={`text-elektronik-blue ${
              replacementData ? 'line-through text-gray-500' : ''
            } ${type === 'teacher' ? 'truncate' : ''}`}
          >
            <Link
              href={`/${type}/${data.value}`}
              className="block truncate"
              prefetch={false}
            >
              {shortName}
            </Link>
          </div>
        )}
        {replacementData && (
          <div>
            {replacementData.value !== '-1' ? (
              <span className="text-zastepstwo-yellow block truncate">
                <Link
                  href={`/${type}/${replacementData.value}`}
                  prefetch={false}
                >
                  {shortReplacementName}
                </Link>
              </span>
            ) : (
              <span className="text-zastepstwo-yellow block truncate">
                {shortReplacementName}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
