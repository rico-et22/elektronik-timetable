import React from 'react';
import Link from 'next/link';
import {
  AcademicCapIcon as ClassIcon,
  UserGroupIcon as TeacherIcon,
  MapPinIcon as RoomIcon,
} from '@heroicons/react/24/outline';
import { ListItem } from '@wulkanowy/timetable-parser';
import { TimeTableData } from 'types/TimeTable';
import { Replacement } from 'types/Replacements';

interface IconProps {
  type: DataLinkProps['type'];
}

function Icon({ type }: IconProps): JSX.Element {
  const className = `h-3 w-3 mr-1 ${''}`;

  // if(type === "teacher") {
  //     teacherClass = small ? "w-3/5 xxs:w-auto" : "w-1/2";

  //  }

  if (type === 'class') {
    return <ClassIcon className={className} />;
  }
  if (type === 'room') {
    return <RoomIcon className={className} />;
  }
  if (type === 'teacher') {
    return <TeacherIcon className={className} />;
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
}
interface DataLinkProps {
  type: TimeTableData['type'];

  data: ListItem | undefined;
  replacementData: ListItem | undefined;

  small: boolean;
}

function CustomLink({ type, data, replacementData, small }: DataLinkProps) {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!data && !replacementData) return <></>;

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
