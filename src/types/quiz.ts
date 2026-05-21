type ConfidenceLevel = 1 | 2 | 3

interface QuizQuestion {
  question: string
  answers: string[]
  correctIndex: number
}

interface AnswerState {
  selectedIndex: number
  submitted: boolean
  confidence: ConfidenceLevel
}

interface ConfidenceOption {
  value: ConfidenceLevel
  label: string
  detail: string
}

interface ConfidenceBucket {
  correct: number
  incorrect: number
}

interface AnswerJournalItem {
  questionIndex: number
  question: string
  correct: boolean
  confidence: ConfidenceLevel
  selectedAnswer: string | undefined
  correctAnswer: string | undefined
}

export type {
  AnswerJournalItem,
  AnswerState,
  ConfidenceBucket,
  ConfidenceLevel,
  ConfidenceOption,
  QuizQuestion,
}
