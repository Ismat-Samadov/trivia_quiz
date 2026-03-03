import { Question } from './api';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ALL_QUESTIONS: Omit<Question, 'all_answers'>[] = [
  // General Knowledge
  {
    question: 'What is the capital of Australia?',
    correct_answer: 'Canberra',
    incorrect_answers: ['Sydney', 'Melbourne', 'Perth'],
    category: 'General Knowledge',
    difficulty: 'easy',
  },
  {
    question: 'How many sides does a hexagon have?',
    correct_answer: '6',
    incorrect_answers: ['5', '7', '8'],
    category: 'General Knowledge',
    difficulty: 'easy',
  },
  {
    question: 'What is the largest planet in our solar system?',
    correct_answer: 'Jupiter',
    incorrect_answers: ['Saturn', 'Neptune', 'Uranus'],
    category: 'General Knowledge',
    difficulty: 'easy',
  },
  {
    question: 'Who painted the Mona Lisa?',
    correct_answer: 'Leonardo da Vinci',
    incorrect_answers: ['Michelangelo', 'Raphael', 'Donatello'],
    category: 'General Knowledge',
    difficulty: 'easy',
  },
  {
    question: 'What element has the chemical symbol "Au"?',
    correct_answer: 'Gold',
    incorrect_answers: ['Silver', 'Copper', 'Iron'],
    category: 'General Knowledge',
    difficulty: 'medium',
  },
  {
    question: 'In what year did World War II end?',
    correct_answer: '1945',
    incorrect_answers: ['1943', '1944', '1946'],
    category: 'History',
    difficulty: 'easy',
  },
  {
    question: 'Which country invented pizza?',
    correct_answer: 'Italy',
    incorrect_answers: ['France', 'Greece', 'Spain'],
    category: 'General Knowledge',
    difficulty: 'easy',
  },
  {
    question: 'What is the speed of light (approx) in km/s?',
    correct_answer: '300,000',
    incorrect_answers: ['150,000', '450,000', '200,000'],
    category: 'Science',
    difficulty: 'medium',
  },
  // Science & Technology
  {
    question: 'What does "HTTP" stand for?',
    correct_answer: 'HyperText Transfer Protocol',
    incorrect_answers: [
      'HyperText Transmission Protocol',
      'HighText Transfer Protocol',
      'HyperText Transport Protocol',
    ],
    category: 'Science: Computers',
    difficulty: 'easy',
  },
  {
    question: 'Who is known as the father of computers?',
    correct_answer: 'Charles Babbage',
    incorrect_answers: ['Alan Turing', 'John von Neumann', 'Bill Gates'],
    category: 'Science: Computers',
    difficulty: 'medium',
  },
  {
    question: 'What programming language was created by Guido van Rossum?',
    correct_answer: 'Python',
    incorrect_answers: ['Ruby', 'Perl', 'Go'],
    category: 'Science: Computers',
    difficulty: 'easy',
  },
  {
    question: 'What does "RAM" stand for?',
    correct_answer: 'Random Access Memory',
    incorrect_answers: [
      'Read Access Memory',
      'Rapid Access Memory',
      'Run-time Allocated Memory',
    ],
    category: 'Science: Computers',
    difficulty: 'easy',
  },
  {
    question: 'Which company developed the Java programming language?',
    correct_answer: 'Sun Microsystems',
    incorrect_answers: ['Microsoft', 'Apple', 'IBM'],
    category: 'Science: Computers',
    difficulty: 'medium',
  },
  {
    question: 'How many bones are in the adult human body?',
    correct_answer: '206',
    incorrect_answers: ['195', '213', '220'],
    category: 'Science',
    difficulty: 'medium',
  },
  {
    question: 'What is the powerhouse of the cell?',
    correct_answer: 'Mitochondria',
    incorrect_answers: ['Nucleus', 'Ribosome', 'Golgi apparatus'],
    category: 'Science',
    difficulty: 'easy',
  },
  // Geography
  {
    question: 'What is the longest river in the world?',
    correct_answer: 'Nile',
    incorrect_answers: ['Amazon', 'Yangtze', 'Mississippi'],
    category: 'Geography',
    difficulty: 'easy',
  },
  {
    question: 'Which country has the most natural lakes?',
    correct_answer: 'Canada',
    incorrect_answers: ['Russia', 'USA', 'Brazil'],
    category: 'Geography',
    difficulty: 'medium',
  },
  {
    question: 'What is the smallest country in the world?',
    correct_answer: 'Vatican City',
    incorrect_answers: ['Monaco', 'San Marino', 'Liechtenstein'],
    category: 'Geography',
    difficulty: 'easy',
  },
  {
    question: 'Which mountain is the tallest in the world?',
    correct_answer: 'Mount Everest',
    incorrect_answers: ['K2', 'Kangchenjunga', 'Lhotse'],
    category: 'Geography',
    difficulty: 'easy',
  },
  {
    question: 'What is the capital of Canada?',
    correct_answer: 'Ottawa',
    incorrect_answers: ['Toronto', 'Vancouver', 'Montreal'],
    category: 'Geography',
    difficulty: 'medium',
  },
  // History
  {
    question: 'In which year did the Titanic sink?',
    correct_answer: '1912',
    incorrect_answers: ['1910', '1914', '1908'],
    category: 'History',
    difficulty: 'easy',
  },
  {
    question: 'Who was the first President of the United States?',
    correct_answer: 'George Washington',
    incorrect_answers: ['John Adams', 'Thomas Jefferson', 'Benjamin Franklin'],
    category: 'History',
    difficulty: 'easy',
  },
  {
    question: 'The Berlin Wall fell in which year?',
    correct_answer: '1989',
    incorrect_answers: ['1987', '1991', '1985'],
    category: 'History',
    difficulty: 'easy',
  },
  {
    question: 'Which ancient wonder was located in Alexandria?',
    correct_answer: 'The Lighthouse of Alexandria',
    incorrect_answers: [
      'The Colossus of Rhodes',
      'The Hanging Gardens',
      'The Temple of Artemis',
    ],
    category: 'History',
    difficulty: 'medium',
  },
  // Sports
  {
    question: 'How many players are on a standard soccer team?',
    correct_answer: '11',
    incorrect_answers: ['10', '12', '9'],
    category: 'Sports',
    difficulty: 'easy',
  },
  {
    question: 'In which sport would you perform a "slam dunk"?',
    correct_answer: 'Basketball',
    incorrect_answers: ['Volleyball', 'Tennis', 'Baseball'],
    category: 'Sports',
    difficulty: 'easy',
  },
  {
    question: 'How often are the Summer Olympic Games held?',
    correct_answer: 'Every 4 years',
    incorrect_answers: ['Every 2 years', 'Every 3 years', 'Every 5 years'],
    category: 'Sports',
    difficulty: 'easy',
  },
  {
    question: 'Which country has won the most FIFA World Cups?',
    correct_answer: 'Brazil',
    incorrect_answers: ['Germany', 'Italy', 'Argentina'],
    category: 'Sports',
    difficulty: 'easy',
  },
  // Film & Music
  {
    question: 'Which film won the first ever Academy Award for Best Picture?',
    correct_answer: 'Wings',
    incorrect_answers: ['Sunrise', 'The Jazz Singer', 'Ben-Hur'],
    category: 'Entertainment: Film',
    difficulty: 'hard',
  },
  {
    question: 'Who sang "Bohemian Rhapsody"?',
    correct_answer: 'Queen',
    incorrect_answers: ['Led Zeppelin', 'The Beatles', 'Pink Floyd'],
    category: 'Entertainment: Music',
    difficulty: 'easy',
  },
  {
    question: 'How many strings does a standard guitar have?',
    correct_answer: '6',
    incorrect_answers: ['4', '5', '7'],
    category: 'Entertainment: Music',
    difficulty: 'easy',
  },
  {
    question: 'What is the best-selling album of all time?',
    correct_answer: 'Thriller by Michael Jackson',
    incorrect_answers: [
      'Back in Black by AC/DC',
      'The Dark Side of the Moon by Pink Floyd',
      'Come On Over by Shania Twain',
    ],
    category: 'Entertainment: Music',
    difficulty: 'medium',
  },
  // Math
  {
    question: 'What is the value of Pi (to 2 decimal places)?',
    correct_answer: '3.14',
    incorrect_answers: ['3.12', '3.16', '3.18'],
    category: 'Science: Mathematics',
    difficulty: 'easy',
  },
  {
    question: 'What is the square root of 144?',
    correct_answer: '12',
    incorrect_answers: ['11', '13', '14'],
    category: 'Science: Mathematics',
    difficulty: 'easy',
  },
  {
    question: 'What is 15% of 200?',
    correct_answer: '30',
    incorrect_answers: ['25', '35', '20'],
    category: 'Science: Mathematics',
    difficulty: 'easy',
  },
];

export function getFallbackQuestions(
  count: number,
  _category: string,
  _difficulty: string
): Question[] {
  const shuffled = shuffle(ALL_QUESTIONS);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));
  return selected.map((q) => ({
    ...q,
    all_answers: shuffle([q.correct_answer, ...q.incorrect_answers]),
  }));
}
