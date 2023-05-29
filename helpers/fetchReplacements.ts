import { Replacements } from 'types/Replacements';

const shortDayNames = ['pon.', 'wt.', 'śr.', 'czw.', 'pt.'];

export const defaultReplacements: Replacements = {
  status: 'not configured',

  date: '',
  shortDayName: '',
  dayIndex: -1,

  generated: '',
  cols: [],
  rows: [],
};

export default async function fetchReplacements(): Promise<Replacements> {
  const replacements: Replacements = Object.create(defaultReplacements);

  const url = process.env.NEXT_PUBLIC_REPLACEMENTS_API_URL;
  if (url) {
    try {
      const response = await fetch(url);
      Object.assign(replacements, await response.json());
      replacements.status = 'ok';

      replacements.shortDayName = replacements.date.split(' ')[2].slice(1, -1);
      replacements.dayIndex = shortDayNames.indexOf(replacements.shortDayName);
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
