interface QuizQuestion {
  question: string
  answers: string[]
  correctIndex: number
}

interface AnswerState {
  selectedIndex: number
  submitted: boolean
}

export type { QuizQuestion, AnswerState }
