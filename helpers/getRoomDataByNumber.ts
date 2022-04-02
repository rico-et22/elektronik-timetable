import { List } from "@wulkanowy/timetable-parser";

const getRoomDataByNumber = (timeTableList: List, roomNumber?: string) => {
  return timeTableList.rooms?.find(
    (room) => room.name.split(" ")[0] === roomNumber
  );
}

export default getRoomDataByNumber
