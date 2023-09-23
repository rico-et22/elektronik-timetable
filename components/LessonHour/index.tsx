import React from 'react';

import { ListItem } from '@wulkanowy/timetable-parser';

import { Replacement } from 'types/Replacements';
import CustomLink from './CustomLink';

interface Props {
  subject: string;
  replacement: Replacement | undefined;
  groupName: string | undefined;

  small: boolean;

  replacedClassData: ListItem | undefined;
  replacedTeacherData: ListItem | undefined;
  replacedRoomData: ListItem | undefined;

  classData: ListItem | undefined;
  teacherData: ListItem | undefined;
  roomData: ListItem | undefined;
}

export default function LessonHour({
  subject,
  replacement,
  groupName,

  small,

  replacedClassData,
  replacedTeacherData,
  replacedRoomData,

  classData,
  teacherData,
  roomData,
}: Props) {
  const hasReplacement = !!replacement;

  return (
    <>
      <p className="font-bold mb-1">
        {!hasReplacement && subject}
        {!hasReplacement && groupName && ` (${groupName})`}
        {hasReplacement && (
          <>
            {subject && (
              <span className="line-through text-gray-500">{subject}</span>
            )}
            {groupName && (
              <span className="line-through text-gray-500"> ({groupName})</span>
            )}
            <br />
            {!replacement.lessonRemoved && (
              <span className="text-zastepstwo-yellow">
                {replacement.subject}
              </span>
            )}
            <span className="text-elektronik-red">
              {replacement.lessonRemoved && replacement.lessonRemovedReason}
              <br />
              {replacement.notes}
            </span>
          </>
        )}
      </p>

      <div className="flex">
        {classData && (
          <CustomLink
            type="class"
            data={classData}
            replacementData={replacedClassData}
            small={small}
          />
        )}

        {teacherData && (
          <CustomLink
            type="teacher"
            data={teacherData}
            replacementData={replacedTeacherData}
            small={small}
          />
        )}

        {roomData && (
          <CustomLink
            type="room"
            data={roomData}
            replacementData={replacedRoomData}
            small={small}
          />
        )}
      </div>
    </>
  );
}
