import { List } from '@wulkanowy/timetable-parser';
import { TimeTableData } from 'types/TimeTable';

export default function completeTimeTableData(
  { days, type: dataType, id }: TimeTableData,
  timeTableList: List,
) {
  // used in _app.tsx
  const idAsString = String(id);

  switch (dataType) {
    case 'class': {
      // { name: '1a 1automatyk', value: '1' },
      // 1a 1automatyk
      const { name: classFullName } =
        timeTableList.classes.find(({ value }) => value === idAsString) || {};
      const className = classFullName?.split(' ')[0];

      if (className) {
        // 1a

        days.forEach((day) => {
          day.forEach((lessonHour) => {
            lessonHour.forEach((lesson) => {
              lesson.className = className;
              // lesson.classId = idAsString // gdybyśmy przenieśli się na @wulkanowy/timetable-parser@1.5.0 lub na jakąś jego zmodyifkowaną wersję
            });
          });
        });
      }
      break;
    }
    case 'teacher': {
      // { name: 'J.Kowalski (KJ)', value: '1' }
      const { name: teacherFullName } =
        timeTableList.teachers?.find(({ value }) => value === idAsString) || {};
      // KJ
      const teacherCode = teacherFullName?.split(' ').pop()?.slice(1, -1);

      if (teacherCode) {
        days.forEach((day) => {
          day.forEach((lessonHour) => {
            lessonHour.forEach((lesson) => {
              lesson.teacher = teacherCode;
              // lesson.teacherId = idAsString
            });
          });
        });
      }
      break;
    }
    case 'room': {
      // { name: '0.3 Sala', value: '1' },
      const { name: classroomFullName } =
        timeTableList.rooms?.find(({ value }) => value === idAsString) || {};
      const classroomName = classroomFullName?.split(' ')[0];

      if (classroomName) {
        // 0.3

        days.forEach((day) => {
          day.forEach((lessonHour) => {
            lessonHour.forEach((lesson) => {
              lesson.room = classroomName;
              // lesson.roomId = idAsString
            });
          });
        });
      }
      break;
    }
    default: {
      break;
    }
  }
}
