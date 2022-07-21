import { TableHour } from '@wulkanowy/timetable-parser';
import { ShortHour } from 'types/ShortHour';

const getHourData = (
  timeTableHours: Record<number, TableHour>,
  shortHours: ShortHour[],
) =>
  Object.fromEntries(
    Object.entries(timeTableHours).map((key) => {
      const shortHour = shortHours.find(
        (hour) => hour.number === Number(key[0]),
      );
      if (shortHour) return [key[0], shortHour];
      return [key[0], key[1]];
    }),
  );

export default getHourData;
