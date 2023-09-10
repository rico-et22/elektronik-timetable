import { Replacement } from 'types/Replacements';

const sortReplacementsRows = (
  a: Replacement,
  b: Replacement,
  columnName: keyof Replacement,
  type: 'asc' | 'desc'
) => {
  let aValueRaw = a[columnName];
  let bValueRaw = b[columnName];

  const extractNumbers = (value: string) => {
    if (columnName === 'className' && a.replacedGroups.length > 0) {
      return [];
    }

    const matches = value.match(/(\d+)/g);
    return matches ? matches.map(Number) : [];
  };

  if (typeof aValueRaw === 'object') {
    if (columnName === 'teacher') {
      aValueRaw = a.teacher.notParsed;
    } else if (a.lessonRemoved) {
      aValueRaw = a.lessonRemovedReason;
    } else {
      aValueRaw = a.deputy?.notParsed || '';
    }
  }

  if (typeof bValueRaw === 'object') {
    if (columnName === 'teacher') {
      bValueRaw = b.teacher.notParsed;
    } else if (b.lessonRemoved) {
      bValueRaw = b.lessonRemovedReason;
    } else {
      bValueRaw = b.deputy?.notParsed || '';
    }
  }

  if (columnName === 'className' && a.replacedGroups.length > 0) {
    aValueRaw = `${a.className} ${a.replacedGroups.join(' ')}`;
  }

  if (columnName === 'className' && b.replacedGroups.length > 0) {
    bValueRaw = `${b.className} ${b.replacedGroups.join(' ')}`;
  }

  const aValue = aValueRaw === null ? '' : String(aValueRaw);
  const bValue = bValueRaw === null ? '' : String(bValueRaw);

  const numericA = extractNumbers(aValue);
  const numericB = extractNumbers(bValue);

  const minLen = Math.min(numericA.length, numericB.length);

  for (let i = 0; i < minLen; i += 1) {
    const diff = numericA[i] - numericB[i];
    if (diff !== 0) {
      return type === 'desc' ? -diff : diff;
    }
  }

  const comparison = aValue.localeCompare(bValue);

  return type === 'desc' ? -comparison : comparison;
};

export default sortReplacementsRows;
