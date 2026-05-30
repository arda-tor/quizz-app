import { useState } from 'react'
import ConfidenceSelector from './components/ConfidenceSelector'
import QuestionCard from './components/QuestionCard'
import QuestionImport from './components/QuestionImport'
import QuizResults from './components/QuizResults'
import { questions as starterQuestions } from './data/question'
import { getAnswerInsight, getQuizResults } from './utils/quizStats'
import type { AnswerState, ConfidenceLevel, QuizQuestion } from './types/quiz'

function App() {
  const [questions, setQuestions] = useState<QuizQuestion[]>(starterQuestions)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, AnswerState>>({})

  const currentQuestion = questions[currentQuestionIndex]
  const currentAnswer = answers[currentQuestionIndex]
  const selectedAnswerIndex = currentAnswer?.selectedIndex ?? null
  const selectedConfidence: ConfidenceLevel = currentAnswer?.confidence ?? 2
  const isSubmitted = currentAnswer?.submitted ?? false
  const isFirstQuestion = currentQuestionIndex === 0
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const isCorrect = isSubmitted && selectedAnswerIndex === currentQuestion.correctIndex
  const isFinished = isLastQuestion && isSubmitted
  const quizResults = getQuizResults(questions, answers)
  const answerInsight = getAnswerInsight(isSubmitted, isCorrect, selectedConfidence)

  function handlePreviousQuestion() {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  function handleNextQuestion() {
    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  function handleSelectAnswer(index: number) {
    if (isSubmitted) return
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: {
        selectedIndex: index,
        submitted: false,
        confidence: prev[currentQuestionIndex]?.confidence ?? selectedConfidence,
      },
    }))
  }

  function handleSetConfidence(confidence: ConfidenceLevel) {
    if (isSubmitted) return
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: {
        selectedIndex: prev[currentQuestionIndex]?.selectedIndex ?? selectedAnswerIndex ?? -1,
        submitted: false,
        confidence,
      },
    }))
  }

  function handleSubmit() {
    if (selectedAnswerIndex === null || selectedAnswerIndex < 0 || isSubmitted) return
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: {
        selectedIndex: selectedAnswerIndex,
        submitted: true,
        confidence: selectedConfidence,
      },
    }))
  }

  function handleRestart() {
    setAnswers({})
    setCurrentQuestionIndex(0)
  }

  function handleQuestionsLoaded(nextQuestions: QuizQuestion[]) {
    setQuestions(nextQuestions)
    handleRestart()
  }

  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-linear-to-br from-white via-[#f8fbff] to-[#fff6df] px-4 py-12">
      <header className="mb-10 text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-accent-bg px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent">
          Quiz App
        </div>
        <h1 className="mb-3 text-5xl font-bold text-text-h max-lg:text-3xl">
          Test Your Knowledge
        </h1>
        <p className="text-base text-text">Answer questions and map how confident you feel</p>
      </header>

      <main className="w-full max-w-xl rounded-3xl border border-border bg-white/85 p-10 shadow-(--shadow) backdrop-blur-sm max-lg:px-6 max-lg:py-8">
        <QuestionImport onQuestionsLoaded={handleQuestionsLoaded} />

        {isFinished ? (
          <QuizResults
            score={quizResults.score}
            totalQuestions={questions.length}
            scorePercent={quizResults.scorePercent}
            compassMessage={quizResults.compassMessage}
            confidenceStats={quizResults.confidenceStats}
            studyRoute={quizResults.studyRoute}
            onRestart={handleRestart}
          />
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between gap-3 max-sm:flex-wrap">
              <span className="text-sm font-bold tracking-wide text-accent">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-sm font-bold tracking-wide text-accent">
                Score: {quizResults.score} / {questions.length}
              </span>
              <div className="flex gap-1.5 max-sm:w-full">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    className={
                      'h-1.5 flex-1 rounded-full transition-colors duration-300 sm:w-6 ' +
                      (index === currentQuestionIndex ? 'bg-accent' : 'bg-border')
                    }
                  />
                ))}
              </div>
            </div>

            <QuestionCard
              question={currentQuestion.question}
              answers={currentQuestion.answers}
              correctIndex={currentQuestion.correctIndex}
              selectedAnswerIndex={selectedAnswerIndex}
              isSubmitted={isSubmitted}
              onAnswer={handleSelectAnswer}
            />

            <ConfidenceSelector
              selectedConfidence={selectedConfidence}
              isSubmitted={isSubmitted}
              onConfidence={handleSetConfidence}
            />

            {isSubmitted && (
              <p
                className={
                  'mt-6 text-sm font-semibold ' +
                  (isCorrect ? 'text-green-600' : 'text-red-600')
                }
              >
                {isCorrect
                  ? `Correct! ${answerInsight}`
                  : `Incorrect - the answer is ${currentQuestion.answers[currentQuestion.correctIndex] ?? 'not available'}. ${answerInsight}`}
              </p>
            )}

            <div className="mt-8 flex justify-between gap-3">
              {!isFirstQuestion ? (
                <button
                  type="button"
                  onClick={handlePreviousQuestion}
                  className="rounded-xl border-2 border-border bg-transparent px-6 py-2.5 text-sm font-semibold text-text-h transition-all duration-200 hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Previous
                </button>
              ) : (
                <div />
              )}

              {!isSubmitted ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={selectedAnswerIndex === null || selectedAnswerIndex < 0}
                  className="ml-auto rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Submit
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="ml-auto rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Next
                </button>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default App
