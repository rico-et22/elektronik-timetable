import { List } from "@wulkanowy/timetable-parser";

const getTeacherDataByCode = (timeTableList: List, teacherCode?: string) => {
  return timeTableList.teachers?.find(
    (teacher) => teacher.name.replace(/\s+/g, ' ').split(" ")[1] === `(${teacherCode})`
  );
}

export default getTeacherDataByCode
