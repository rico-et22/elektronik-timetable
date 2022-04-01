import {
  AcademicCapIcon,
  LocationMarkerIcon,
  UserGroupIcon,
} from "@heroicons/react/outline";
import { List } from "@wulkanowy/timetable-parser";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import * as React from "react";
import InlineSVG from "react-inlinesvg";
import { TimeTableData } from "../types/TimeTable";

interface Props {
  timeTable: TimeTableData;
  timeTableList: List;
}

const TimeTableAsTable = ({ timeTable, timeTableList }: Props) => {

  const shortDayNames = ["Pon.", "Wt.", "Śr.", "Czw.", "Pt."];

  const router = useRouter();

  const getClassData = React.useCallback(
    (classCode: string | undefined) => {
      return timeTableList.classes?.find(
        (singleClass) => singleClass.name.split(" ")[0] === classCode
      );
    },
    [timeTableList.classes]
  );

  const getTeacherData = React.useCallback(
    (teacherCode: string | undefined) => {
      return timeTableList.teachers?.find(
        (teacher) => teacher.name.replace(/\s+/g, ' ').split(" ")[1] === `(${teacherCode})`
      );
    },
    [timeTableList.teachers]
  );

  const getRoomData = React.useCallback(
    (roomNumber: string | undefined) => {
      return timeTableList.rooms?.find(
        (room) => room.name.split(" ")[0] === roomNumber
      );
    },
    [timeTableList.rooms]
  );

  const dayTrimData = React.useMemo(() => {
    return {
      firstNotEmptyIndex: timeTable.days.map((day) =>
        day.findIndex((dayHour) => dayHour.length > 0)
      ),
      lastNotEmptyIndex: timeTable.days.map(
        (day) =>
          day.length -
          1 -
          day
            .slice()
            .reverse()
            .findIndex((dayHour) => dayHour.length > 0)
      ),
    };
  }, [timeTable.days]);

  return (
    <div className="px-10 pb-16 mt-4">
      <table className="w-full table-fixed border-separate border-0 shadow-lg rounded-lg border-spacing-0">
        <thead className="rounded">
          <tr className="bg-elektronik-red text-white text-sm rounded-t-lg">
            <th className="py-3 w-10 border border-gray-100/50 rounded-tl-lg">
              Nr
            </th>
            <th className="py-3 w-24 border border-gray-100/50">Godz.</th>
            {timeTable.dayNames.map((dayName, index) => (
              <th
                key={`table-dayName-${dayName}`}
                className={`py-3 border border-gray-100/50  ${
                  index === timeTable.dayNames.length - 1 ? "rounded-tr-lg" : ""
                }`}
              >
                <span>{dayName}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(timeTable.hours).map((key, index) => {
              return (
                <tr key={`table-hour-${key}`} className="text-xs">
                  <td
                    className={`bg-red-200 text-center p-2 text-sm ${
                      index === Object.entries(timeTable.hours).length - 1
                        ? "rounded-bl-lg"
                        : ""
                    }`}
                  >
                    <span className="font-bold">{key[1].number}</span>
                  </td>
                  <td className="bg-red-200 text-center p-2">
                    {key[1].timeFrom} - {key[1].timeTo}
                  </td>
                  {timeTable.dayNames.map((dayName, dayIndex) => (
                    <React.Fragment
                      key={`table-hour-${key}-dayName-${dayName}`}
                    >
                      <td
                        className={`bg-gray-50 p-2 border
                                  ${
                                    index ===
                                      Object.entries(timeTable.hours).length -
                                        1 &&
                                    dayIndex === timeTable.dayNames.length - 1
                                      ? "rounded-br-lg"
                                      : ""
                                  }`}
                      >
                        {timeTable.days[dayIndex][index].map(
                          (subject, subjectIndex) => (
                            <div
                              key={`day-${dayIndex}-${index}-${subjectIndex}`}
                              className={
                                subjectIndex !==
                                timeTable.days[dayIndex][index].length -
                                  1
                                  ? "mb-2"
                                  : ""
                              }
                            >
                              <p className="font-bold mb-1">
                                {subject.subject}
                                {subject.groupName && ` (${subject.groupName})`}
                              </p>
                              <div className="flex">
                                {router.query.all &&
                                  router.query.all[0] !== "class" &&
                                  subject.className && (
                                    <div className="flex items-center mr-4">
                                      <AcademicCapIcon className="h-3 w-3 mr-1" />
                                      <Link
                                        href={`/class/${
                                          getClassData(subject.className)?.value
                                        }`}
                                      >
                                        <a className="text-elektronik-blue">
                                          {
                                            getClassData(
                                              subject.className
                                            )?.name.split(" ")[0]
                                          }
                                        </a>
                                      </Link>
                                    </div>
                                  )}
                                {router.query.all &&
                                  router.query.all[0] !== "teacher" &&
                                  subject.teacher && (
                                    <div className="flex items-center mr-4 w-1/2">
                                      <UserGroupIcon className="h-3 w-3 mr-1 shrink-0" />
                                      <Link
                                        href={`/teacher/${
                                          getTeacherData(subject.teacher)?.value
                                        }`}
                                      >
                                        <a className="text-elektronik-blue truncate">
                                          {
                                            getTeacherData(
                                              subject.teacher
                                            )?.name.split(" ")[0]
                                          }
                                        </a>
                                      </Link>
                                    </div>
                                  )}{" "}
                                {router.query.all &&
                                  router.query.all[0] !== "room" &&
                                  subject.room && (
                                    <div className="flex items-center">
                                      <LocationMarkerIcon className="h-3 w-3 mr-1" />
                                      <Link
                                        href={`/room/${
                                          getRoomData(subject.room)?.value
                                        }`}
                                      >
                                        <a className="text-elektronik-blue">
                                          {
                                            getRoomData(
                                              subject.room
                                            )?.name.split(" ")[0]
                                          }
                                        </a>
                                      </Link>
                                    </div>
                                  )}
                              </div>
                            </div>
                          )
                        )}
                      </td>
                    </React.Fragment>
                  ))}
                </tr>
              );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TimeTableAsTable;
