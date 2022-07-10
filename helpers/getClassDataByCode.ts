import { List } from '@wulkanowy/timetable-parser';

const getClassDataByCode = (timeTableList: List, classCode?: string) => timeTableList.classes?.find(
    (singleClass) => singleClass.name.split(' ')[0] === classCode,
  );

export default getClassDataByCode;
