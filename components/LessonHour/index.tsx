import React from 'react';

import { ListItem } from '@wulkanowy/timetable-parser';

import { Replacement } from 'types/Replacements';
import CustomLink from './CustomLink';

interface Props {
  subject: string;
  replacement: Replacement | undefined;
  groupName: string | undefined;

  small: boolean;

  lessonRemoved: boolean;

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

  lessonRemoved,
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
        {hasReplacement && (
          <>
            {!lessonRemoved && (
              <span className="text-zastepstwo-yellow">
                {replacement.subject}
              </span>
            )}
            <span className="text-elektronik-red">
              {lessonRemoved && replacement.deputy} {replacement.notes}
            </span>
            <br />
            {subject && (
              <>
                <del>{subject}</del>
                <br />
              </>
            )}
          </>
        )}
        {groupName && ` (${groupName})`}
      </p>

      <div className="text-sm flex">
        <CustomLink
          type="class"
          data={classData}
          replacementData={replacedClassData}
          small={small}
        />

        <CustomLink
          type="teacher"
          data={teacherData}
          replacementData={replacedTeacherData}
          small={small}
        />

        <CustomLink
          type="room"
          data={roomData}
          replacementData={replacedRoomData}
          small={small}
        />
      </div>
    </>
  );
}
