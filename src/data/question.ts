import type { QuizQuestion } from '../types/quiz'

export const questions: QuizQuestion[] = [
  {
    question: 'What is the capital city of Japan?',
    answers: ['Beijing', 'Seoul', 'Tokyo', 'Bangkok'],
    correctIndex: 2,
  },
  {
    question: 'Which planet is known as the Red Planet?',
    answers: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctIndex: 1,
  },
  {
    question: 'What is the largest ocean on Earth?',
    answers: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
    correctIndex: 3,
  },
  {
    question: 'Who painted the Mona Lisa?',
    answers: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Claude Monet'],
    correctIndex: 2,
  },
  {
    question: 'What is the chemical symbol for gold?',
    answers: ['Go', 'Gd', 'Au', 'Ag'],
    correctIndex: 2,
  },
  {
    question: 'In which year did World War II end?',
    answers: ['1943', '1945', '1947', '1950'],
    correctIndex: 1,
  },
]
