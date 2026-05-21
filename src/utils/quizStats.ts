import type {
  AnswerJournalItem,
  AnswerState,
  ConfidenceBucket,
  ConfidenceLevel,
  QuizQuestion,
} from '../types/quiz'

type ConfidenceStats = Record<ConfidenceLevel, ConfidenceBucket>

function createEmptyConfidenceStats(): ConfidenceStats {
  return {
    1: { correct: 0, incorrect: 0 },
    2: { correct: 0, incorrect: 0 },
    3: { correct: 0, incorrect: 0 },
  }
}

function getSubmittedAnswers(answers: Record<number, AnswerState>) {
  return Object.entries(answers).filter(([, answer]) => answer.submitted)
}

function buildAnswerJournal(
  questions: QuizQuestion[],
  submittedAnswers: [string, AnswerState][],
): AnswerJournalItem[] {
  return submittedAnswers.map(([idx, answer]) => {
    const questionIndex = Number(idx)
    const question = questions[questionIndex]
    const correct = answer.selectedIndex === question.correctIndex

    return {
      questionIndex,
      question: question.question,
      correct,
      confidence: answer.confidence,
      selectedAnswer: question.answers[answer.selectedIndex],
      correctAnswer: question.answers[question.correctIndex],
    }
  })
}

function buildStudyRoute(answerJournal: AnswerJournalItem[]) {
  return answerJournal
    .filter((item) => !item.correct || item.confidence === 1)
    .sort((a, b) => {
      if (a.correct !== b.correct) return a.correct ? 1 : -1
      return b.confidence - a.confidence
    })
    .slice(0, 3)
}

export function getAnswerInsight(
  isSubmitted: boolean,
  isCorrect: boolean,
  selectedConfidence: ConfidenceLevel,
) {
  if (!isSubmitted) return ''

  if (isCorrect) {
    if (selectedConfidence === 1) return 'Nice surprise: you guessed, but your instinct was right.'
    if (selectedConfidence === 3) return 'Strong signal: you knew it and proved it.'
    return 'Good read: your confidence matched a correct answer.'
  }

  if (selectedConfidence === 3) return 'Important review card: this one felt certain but was incorrect.'
  if (selectedConfidence === 1) return 'Fair miss: you already knew this was a guess.'
  return 'Almost there: review the detail that separated the choices.'
}

export function getQuizResults(questions: QuizQuestion[], answers: Record<number, AnswerState>) {
  const submittedAnswers = getSubmittedAnswers(answers)
  const confidenceStats = createEmptyConfidenceStats()

  const score = submittedAnswers.reduce((sum, [idx, answer]) => {
    const correct = answer.selectedIndex === questions[Number(idx)].correctIndex
    const key = correct ? 'correct' : 'incorrect'

    confidenceStats[answer.confidence][key] += 1

    return correct ? sum + 1 : sum
  }, 0)

  const answerJournal = buildAnswerJournal(questions, submittedAnswers)
  const scorePercent = Math.round((score / questions.length) * 100)
  const compassMessage =
    confidenceStats[3].incorrect > 0
      ? 'Your compass found a few overconfident spots to review first.'
      : confidenceStats[1].correct > 0
        ? 'Your guesses hid some real knowledge. Trust those instincts more.'
        : 'Your confidence matched your answers nicely.'

  return {
    answerJournal,
    compassMessage,
    confidenceStats,
    score,
    scorePercent,
    studyRoute: buildStudyRoute(answerJournal),
  }
}

export type { ConfidenceStats }
