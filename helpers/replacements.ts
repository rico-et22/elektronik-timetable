import { Replacement } from 'types/Replacements';

const processValueRaw = (
  valueRaw: Replacement[typeof columnName],
  columnName: keyof Replacement,
  data: Replacement
) => {
  if (typeof valueRaw === 'object') {
    if (columnName === 'teacher') {
      valueRaw = data.teacher.notParsed;
    } else if (data.lessonRemoved) {
      valueRaw = data.lessonRemovedReason;
    } else {
      valueRaw = data.deputy?.notParsed || '';
    }
  }

  if (columnName === 'className' && data.replacedGroups.length > 0) {
    valueRaw = `${data.className} ${data.replacedGroups.join(' ')}`;
  }

  return valueRaw;
};

const extractNumbers = (
  value: string,
  columnName: keyof Replacement,
  data: Replacement
) => {
  if (columnName === 'className' && data.replacedGroups.length > 0) {
    return [];
  }

  const matches = value.match(/(\d+)/g);
  return matches ? matches.map(Number) : [];
};

const sortReplacementsRows = (
  a: Replacement,
  b: Replacement,
  columnName: keyof Replacement,
  orderType: 'asc' | 'desc'
) => {
  const aValueRaw = processValueRaw(a[columnName], columnName, a);
  const bValueRaw = processValueRaw(b[columnName], columnName, b);

  const aValue = aValueRaw === null ? '' : String(aValueRaw);
  const bValue = bValueRaw === null ? '' : String(bValueRaw);

  const numericA = extractNumbers(aValue, columnName, a);
  const numericB = extractNumbers(bValue, columnName, b);

  const minLen = Math.min(numericA.length, numericB.length);

  for (let i = 0; i < minLen; i += 1) {
    const diff = numericA[i] - numericB[i];
    if (diff !== 0) {
      return orderType === 'desc' ? -diff : diff;
    }
  }

  const comparison = aValue.localeCompare(bValue);

  return orderType === 'desc' ? -comparison : comparison;
};

export default sortReplacementsRows;
