import { List } from '@wulkanowy/timetable-parser';
import { NextRouter } from 'next/router';
import { RouteContext } from 'types/RouteContext';

const getRouteContext = (router: NextRouter, timeTableList: List) => {
  const { classes, rooms, teachers } = timeTableList;
  const returnedValue: RouteContext = {
    type: undefined,
    typeName: undefined,
    name: undefined,
  };
  if (router.query.all && router.query.all.length > 1) {
    const [firstQueryParam] = router.query.all;
    returnedValue.type = firstQueryParam as RouteContext['type'];
    const value = router.query.all[1];
    if (returnedValue.type === 'class' && classes.length > 0) {
      returnedValue.typeName = 'Oddziały';
      returnedValue.name = classes.find(
        (singleClass) => singleClass.value === value
      )?.name;
    } else if (returnedValue.type === 'room' && rooms && rooms.length > 0) {
      returnedValue.typeName = 'Sale';
      returnedValue.name = rooms.find(
        (singleRoom) => singleRoom.value === value
      )?.name;
    } else if (
      returnedValue.type === 'teacher' &&
      teachers &&
      teachers.length > 0
    ) {
      returnedValue.typeName = 'Nauczyciele';
      returnedValue.name = teachers.find(
        (singleTeacher) => singleTeacher.value === value
      )?.name;
    }
  }
  return returnedValue;
};

export default getRouteContext;
