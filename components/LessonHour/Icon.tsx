import React from 'react';

import {
  AcademicCapIcon as ClassIcon,
  UserGroupIcon as TeacherIcon,
  MapPinIcon as RoomIcon,
} from '@heroicons/react/24/outline';
import { TimeTableData } from 'types/TimeTable';

interface Props {
  type: TimeTableData['type'];
}

export default function Icon({ type }: Props): JSX.Element {
  const className = `h-3 w-3 mr-1 shrink-0`;

  if (type === 'class') {
    return <ClassIcon className={className} />;
  }
  if (type === 'room') {
    return <RoomIcon className={className} />;
  }
  if (type === 'teacher') {
    return <TeacherIcon className={className} />;
  }

  throw new Error(`Unknown icon type: ${type}`);
}
