import { Replacements, ReplacementsApiResponse } from 'types/Replacements';
import { shortDayNamesLowerCase } from './ShortDayNames';

export const defaultReplacements: Replacements = {
  status: 'not configured',

  date: 'Dzień: 1.1.1970 (czw.)',
  shortDayName: 'czw.',
  dayIndex: 0,

  generated: '',
  cols: [],
  rows: [],
};

export default async function fetchReplacements(): Promise<Replacements> {
  const replacements: Replacements = Object.create(defaultReplacements);

  const url = process.env.NEXT_PUBLIC_REPLACEMENTS_API_URL;
  if (url) {
    try {
      // https://developer.mozilla.org/en-US/docs/Web/API/fetch https://developer.mozilla.org/en-US/docs/Web/API/Request/cache
      const replacementsResponse: ReplacementsApiResponse = await fetch(url, {
        cache: 'no-store',
      }).then((response) => response.json());

      // Można też użyć wyrażenia regularnego (RegExp)
      const shortDayName = <Replacements['shortDayName']>replacements.date
        .split(' ')[2] // (pon.)
        .slice(1, -1); // pon.

      const dayIndex = <Replacements['dayIndex']>(
        shortDayNamesLowerCase.indexOf(replacements.shortDayName)
      );

      Object.assign(replacements, {
        status: 'ok',

        ...replacementsResponse,

        shortDayName,
        dayIndex,
      });
    } catch (e) {
      console.error(
        "Couldn't fetch replacements (zastępstwa) api. Are you sure you have configured the right link?",
        e
      );
      replacements.status = 'error';
    }
  }

  return replacements;
}
