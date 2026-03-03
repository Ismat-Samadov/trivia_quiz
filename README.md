# TriviaBlitz 🧠

A fast-paced, visually stunning trivia quiz game built with Next.js 15 and Tailwind CSS.

**Live Demo:** [trivia-quiz-tau-brown.vercel.app](https://trivia-quiz-tau-brown.vercel.app)

---

## Features

- **14 categories** — General, Science, History, Geography, Sports, Film, Music, Math, Computers, Animals, Art, Books, Politics, Vehicles
- **3 difficulty levels** — Easy (30s), Medium (20s), Hard (15s)
- **Countdown timer** with urgent pulse animation when time runs low
- **Immediate feedback** — green/red highlight on answer selection
- **Sound effects** via Web Audio API (no audio files needed)
- **Animations** powered by Framer Motion — card transitions, star reveals, score counter
- **Leaderboard** persisted to localStorage (top 20 scores)
- **Fallback questions** — works offline with 35+ hardcoded questions
- **Dark & vibrant UI** — neon purple/cyan on deep dark background

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 15 (App Router) | Framework |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| Framer Motion | Animations |
| Open Trivia DB API | Questions |
| Web Audio API | Sound effects |
| localStorage | Leaderboard |

---

## Getting Started

```bash
git clone <repo-url>
cd trivia_quiz
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Build & Deploy

```bash
npm run build   # production build
npm start       # run production server
```

**Vercel:** Connect your GitHub repo to Vercel — zero config required. No environment variables needed.

---

## API

Questions sourced from [Open Trivia Database](https://opentdb.com/) — free, no API key required.

When the API is unavailable, 35+ hardcoded fallback questions are used automatically.

---

## Project Structure

```
app/
  layout.tsx          # Root layout, fonts, background blobs
  page.tsx            # Home screen
  quiz/page.tsx       # Quiz gameplay
  leaderboard/page.tsx # Leaderboard
components/
  HomeScreen.tsx      # Category/difficulty/name selector
  QuizCard.tsx        # Question + answer buttons
  Timer.tsx           # Circular countdown timer
  ProgressBar.tsx     # Question progress bar
  ResultsScreen.tsx   # End screen with stars & score
  Leaderboard.tsx     # Top 10 scores
lib/
  api.ts              # Open Trivia DB fetch + HTML decode
  fallbackQuestions.ts # 35+ hardcoded questions
  storage.ts          # localStorage helpers
  sounds.ts           # Web Audio API sound effects
hooks/
  useTimer.ts         # Countdown timer hook
```
