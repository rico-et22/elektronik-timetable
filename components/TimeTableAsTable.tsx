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
import getClassDataByCode from "../helpers/getClassDataByCode";
import getHourData from "../helpers/getHourData";
import getRoomDataByNumber from "../helpers/getRoomDataByNumber";
import getTeacherDataByCode from "../helpers/getTeacherDataByCode";
import { SettingsContext } from "../pages/_app";
import { TimeTableData } from "../types/TimeTable";

interface Props {
  timeTable: TimeTableData;
  timeTableList: List;
}

const TimeTableAsTable = ({ timeTable, timeTableList }: Props) => {
  const shortDayNames = ["Pon.", "Wt.", "Śr.", "Czw.", "Pt."];

  const { showShortHours, shortHours } = React.useContext(SettingsContext);

  const router = useRouter();

  const getClassData = React.useCallback(
    (classCode: string | undefined) => {
      return getClassDataByCode(timeTableList, classCode);
    },
    [timeTableList]
  );

  const getTeacherData = React.useCallback(
    (teacherCode: string | undefined) => {
      return getTeacherDataByCode(timeTableList, teacherCode);
    },
    [timeTableList]
  );

  const getRoomData = React.useCallback(
    (roomNumber: string | undefined) => {
      return getRoomDataByNumber(timeTableList, roomNumber);
    },
    [timeTableList]
  );

  const isCurrentLesson = React.useCallback(
    (startTime: string, endTime: string) => {
      const startTimeSplit = startTime.split(":").map((n) => Number(n));
      const endTimeSplit = endTime.split(":").map((n) => Number(n));
      const currentDate = new Date();
      const currentTimeSplit = [
        currentDate.getHours(),
        currentDate.getMinutes(),
      ];
      return (
        new Date().setHours(currentTimeSplit[0], currentTimeSplit[1]) >=
          new Date().setHours(startTimeSplit[0], startTimeSplit[1]) &&
        new Date().setHours(currentTimeSplit[0], currentTimeSplit[1]) <=
          new Date().setHours(endTimeSplit[0], endTimeSplit[1])
      );
    },
    []
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

  const hourData = React.useMemo(() => {
    if (showShortHours)
      return getHourData(timeTable.hours, shortHours)
    else return timeTable.hours;
  }, [shortHours, showShortHours, timeTable.hours]);

  return (
    <div className="px-10 pb-16 mt-8">
      <table className="w-full table-fixed border-separate border-0 shadow-lg rounded-lg border-spacing-0 ">
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
          {Object.entries(hourData).map((key, index) => {
            return (
              <tr key={`table-hour-${key}`} className="text-xs">
                <td
                  className={`text-center p-2 text-sm ${
                    index === Object.entries(timeTable.hours).length - 1
                      ? "rounded-bl-lg"
                      : ""
                  } ${
                    isCurrentLesson(key[1].timeFrom, key[1].timeTo)
                      ? "bg-green-200"
                      : "bg-red-200"
                  }`}
                >
                  <span className="font-bold">{key[1].number}</span>
                </td>
                <td
                  className={`text-center p-2 ${
                    isCurrentLesson(key[1].timeFrom, key[1].timeTo)
                      ? "bg-green-200"
                      : "bg-red-200"
                  }`}
                >
                  {key[1].timeFrom} - {key[1].timeTo}
                </td>
                {timeTable.dayNames.map((dayName, dayIndex) => (
                  <React.Fragment key={`table-hour-${key}-dayName-${dayName}`}>
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
                              timeTable.days[dayIndex][index].length - 1
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
                                          getRoomData(subject.room)?.name.split(
                                            " "
                                          )[0]
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
