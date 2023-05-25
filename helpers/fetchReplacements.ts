import {
  ReplacementsResponse,
  Replacements,
  ReplacementsStatus,
} from 'types/Replacements';

const fetchReplacements = async (): Promise<ReplacementsResponse> => {
  let replacements: Replacements;
  let status: ReplacementsStatus = 'ok';

  const url = process.env.NEXT_PUBLIC_REPLACEMENTS_API_URL;
  if (url) {
    try {
      const response = await fetch(url);
      replacements = await response.json();
    } catch (e) {
      console.error(
        "Couldn't fetch replacements (zastępstwa) api. Are you sure you have configured the right link?",
        e,
      );
      status = 'error';
    }
  } else {
    status = 'not configured';
  }

  if (!replacements!) {
    replacements = {
      date: status,
      generated: status,
      cols: [],
      rows: [],
    };
  }
  return {
    replacements,
    status,
  };
};

export default fetchReplacements;
