export interface LeaderboardEntry {
  name: string;
  score: number;
  total: number;
  pct: number;
  category: string;
  difficulty: string;
  date: string;
}

const KEY = 'trivia-leaderboard';

export function getScores(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addScore(entry: LeaderboardEntry): void {
  if (typeof window === 'undefined') return;
  const scores = getScores();
  scores.push(entry);
  scores.sort((a, b) => b.pct - a.pct || b.score - a.score);
  const top20 = scores.slice(0, 20);
  localStorage.setItem(KEY, JSON.stringify(top20));
}

export function clearScores(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
}
