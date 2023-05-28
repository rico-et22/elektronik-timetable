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
import StrikeThrough from './utils/StrikeThrough';

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

  name: ListItem['name'];
  id: ListItem['value'];

  small: boolean;
}

function CustomLink({ type, name, id, small }: DataLinkProps) {
  // /class/6
  const url = `/${type}/${id}`;
  // 1h 1Informatyk
  const shortName = name.split(' ')[0]; // 1h // 203 // J.Kowalski
  // const smallClass = small ? "shrink-0" : "";

  return (
    <div className="flex items-center mr-4">
      <Icon type={type} />
      <Link href={url}>
        <a className="text-elektronik-blue">{shortName}</a>
      </Link>
    </div>
  );
}

interface Props {
  subject: string;
  replacement: Replacement | undefined;
  groupName: string | undefined;

  small: boolean;

  classData: ListItem | undefined;
  teacherData: ListItem | undefined;
  roomData: ListItem | undefined;
}

export default function LessonHour({
  subject,
  replacement,
  groupName,

  small,

  classData,
  teacherData,
  roomData,
}: Props) {
  const lessonRemoved = !!replacement?.deputy.includes('Uczniowie');
  // const Teacher

  return (
    <>
      <p className="font-bold mb-1">
        {!replacement && subject}
        {replacement && (
          <>
            {subject && (
              <>
                <StrikeThrough>{subject}</StrikeThrough>
                <br />
              </>
            )}
            {!lessonRemoved && replacement.subject}
            {lessonRemoved && `${replacement.deputy}`} {replacement.notes}
          </>
        )}
        {groupName && ` (${groupName})`}
      </p>

      <div className="text-sm flex">
        {classData && (
          <CustomLink
            type="class"
            name={classData.name}
            id={classData.value}
            small={small}
          />
        )}

        {teacherData && (
          <CustomLink
            type="teacher"
            name={teacherData.name}
            id={teacherData.value}
            small={small}
          />
        )}

        {roomData && (
          <CustomLink
            type="room"
            name={roomData.name}
            id={roomData.value}
            small={small}
          />
        )}
      </div>
    </>
  );
}
