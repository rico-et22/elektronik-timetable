import { Replacements } from 'types/Replacements';

const fetchReplacements = async () => {
  let replacements: Replacements | null = null;
  const url = process.env.NEXT_PUBLIC_REPLACEMENTS_API_URL;
  if (url) {
    replacements = await fetch(url)
      .then((response) => response.json())
      .catch((reason) => {
        if (process.env.NODE_ENV === 'development')
          console.warn(
            "Couldn't fetch replacements (zastępstwa) api. Are you sure you have the right link?",
            reason,
          ); // https://www.elektronik.rzeszow.pl/api/replacements.json
        return null;
      });
  }

  return replacements;
};

export default fetchReplacements;
