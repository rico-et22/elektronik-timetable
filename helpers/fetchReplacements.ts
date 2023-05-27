import { Replacements } from 'types/Replacements';

export default async function fetchReplacements(): Promise<Replacements> {
  const replacements: Replacements = {
    status: 'not configured',
    date: '',
    generated: '',
    cols: [],
    rows: [],
  };

  const url = process.env.NEXT_PUBLIC_REPLACEMENTS_API_URL;
  if (url) {
    try {
      const response = await fetch(url);
      Object.assign(replacements, await response.json());
      replacements.status = 'ok';
    } catch (e) {
      console.error(
        "Couldn't fetch replacements (zastępstwa) api. Are you sure you have configured the right link?",
        e,
      );
      replacements.status = 'error';
    }
  }

  return replacements;
}
