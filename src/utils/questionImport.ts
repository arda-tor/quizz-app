import type { QuizQuestion } from '../types/quiz'

interface OpenTriviaQuestion {
  question: string
  correct_answer: string
  incorrect_answers: string[]
}

function decodeHtml(value: string) {
  const parser = new DOMParser()
  return parser.parseFromString(value, 'text/html').documentElement.textContent ?? value
}

function shuffleAnswers(answers: string[]) {
  return answers
    .map((answer) => ({ answer, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ answer }) => answer)
}

function isOpenTriviaQuestion(item: unknown): item is OpenTriviaQuestion {
  if (!item || typeof item !== 'object') return false

  const question = (item as OpenTriviaQuestion).question
  const correctAnswer = (item as OpenTriviaQuestion).correct_answer
  const incorrectAnswers = (item as OpenTriviaQuestion).incorrect_answers

  return (
    typeof question === 'string' &&
    typeof correctAnswer === 'string' &&
    Array.isArray(incorrectAnswers) &&
    incorrectAnswers.every((answer) => typeof answer === 'string')
  )
}

function transformOpenTriviaQuestions(items: OpenTriviaQuestion[]): QuizQuestion[] {
  return items.map((item) => {
    const correctAnswer = decodeHtml(item.correct_answer)
    const answers = shuffleAnswers([
      correctAnswer,
      ...item.incorrect_answers.map((answer) => decodeHtml(answer)),
    ])

    return {
      question: decodeHtml(item.question),
      answers,
      correctIndex: answers.indexOf(correctAnswer),
    }
  })
}

function getQuestionArray(data: unknown) {
  if (Array.isArray(data)) return data

  if (
    data &&
    typeof data === 'object' &&
    'results' in data &&
    Array.isArray((data as { results: unknown }).results) &&
    (data as { results: unknown[] }).results.every(isOpenTriviaQuestion)
  ) {
    return transformOpenTriviaQuestions((data as { results: OpenTriviaQuestion[] }).results)
  }

  if (
    data &&
    typeof data === 'object' &&
    'questions' in data &&
    Array.isArray((data as { questions: unknown }).questions)
  ) {
    return (data as { questions: unknown[] }).questions
  }

  throw new Error('JSON must be an array of questions or an object with a questions array.')
}

export function validateQuestions(data: unknown): QuizQuestion[] {
  const items = getQuestionArray(data)

  if (items.length === 0) {
    throw new Error('Add at least one question before importing.')
  }

  return items.map((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`Question ${index + 1} must be an object.`)
    }

    const question = (item as QuizQuestion).question
    const answers = (item as QuizQuestion).answers
    const correctIndex = (item as QuizQuestion).correctIndex

    if (typeof question !== 'string' || question.trim().length === 0) {
      throw new Error(`Question ${index + 1} needs a question string.`)
    }

    if (
      !Array.isArray(answers) ||
      answers.length < 2 ||
      !answers.every((answer) => typeof answer === 'string' && answer.trim().length > 0)
    ) {
      throw new Error(`Question ${index + 1} needs at least two answer strings.`)
    }

    if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= answers.length) {
      throw new Error(`Question ${index + 1} needs a valid correctIndex.`)
    }

    return {
      question: question.trim(),
      answers: answers.map((answer) => answer.trim()),
      correctIndex,
    }
  })
}

export async function parseQuestionsFromJson(text: string) {
  const data = await Promise.resolve(JSON.parse(text))
  return validateQuestions(data)
}
