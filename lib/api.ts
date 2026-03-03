export interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  all_answers: string[];
  category: string;
  difficulty: string;
}

const CATEGORY_MAP: Record<string, number> = {
  general: 9,
  books: 10,
  film: 11,
  music: 12,
  science: 17,
  computers: 18,
  math: 19,
  sports: 21,
  geography: 22,
  history: 23,
  politics: 24,
  art: 25,
  animals: 27,
  vehicles: 28,
};

function decodeHTML(html: string): string {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&ldquo;/g, '\u201C')
    .replace(/&rdquo;/g, '\u201D')
    .replace(/&lsquo;/g, '\u2018')
    .replace(/&rsquo;/g, '\u2019')
    .replace(/&hellip;/g, '\u2026')
    .replace(/&mdash;/g, '\u2014')
    .replace(/&ndash;/g, '\u2013')
    .replace(/&eacute;/g, 'é')
    .replace(/&egrave;/g, 'è')
    .replace(/&agrave;/g, 'à')
    .replace(/&auml;/g, 'ä')
    .replace(/&ouml;/g, 'ö')
    .replace(/&uuml;/g, 'ü')
    .replace(/&szlig;/g, 'ß')
    .replace(/&ntilde;/g, 'ñ')
    .replace(/&pi;/g, 'π');
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function fetchQuestions(
  count: number,
  category: string,
  difficulty: string
): Promise<Question[]> {
  const catId = CATEGORY_MAP[category] ?? '';
  const url = `https://opentdb.com/api.php?amount=${count}&category=${catId}&difficulty=${difficulty}&type=multiple`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    if (data.response_code !== 0 || !data.results?.length) {
      throw new Error('No results');
    }
    return data.results.map(
      (q: {
        question: string;
        correct_answer: string;
        incorrect_answers: string[];
        category: string;
        difficulty: string;
      }) => {
        const all = shuffle([
          decodeHTML(q.correct_answer),
          ...q.incorrect_answers.map(decodeHTML),
        ]);
        return {
          question: decodeHTML(q.question),
          correct_answer: decodeHTML(q.correct_answer),
          incorrect_answers: q.incorrect_answers.map(decodeHTML),
          all_answers: all,
          category: decodeHTML(q.category),
          difficulty: q.difficulty,
        };
      }
    );
  } catch {
    const { getFallbackQuestions } = await import('./fallbackQuestions');
    return getFallbackQuestions(count, category, difficulty);
  }
}
