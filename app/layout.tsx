import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'TriviaBlitz — Test Your Knowledge',
  description:
    'A fast-paced trivia quiz game with multiple categories, difficulty levels, and a live leaderboard.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body className="antialiased relative">
        {/* Background blobs */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 overflow-hidden -z-10"
        >
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-900/30 blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-900/25 blur-[100px]" />
          <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-fuchsia-900/15 blur-[80px]" />
        </div>
        {children}
      </body>
    </html>
  );
}
