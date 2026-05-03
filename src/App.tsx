import { useState } from 'react'
import { questions } from './data/question'
import QuestionCard from './components/QuestionCard'
import type { AnswerState } from './types/quiz'

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, AnswerState>>({})

  const currentQuestion = questions[currentQuestionIndex]
  const currentAnswer = answers[currentQuestionIndex]
  const selectedAnswerIndex = currentAnswer?.selectedIndex ?? null
  const isSubmitted = currentAnswer?.submitted ?? false
  const isFirstQuestion = currentQuestionIndex === 0
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const isCorrect = isSubmitted && selectedAnswerIndex === currentQuestion.correctIndex
  const isFinished = isLastQuestion && isSubmitted

  const score = Object.entries(answers).reduce((sum, [idx, a]) => {
    if (a.submitted && a.selectedIndex === questions[Number(idx)].correctIndex) {
      return sum + 1
    }
    return sum
  }, 0)

  const scorePercent = Math.round((score / questions.length) * 100)

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
      [currentQuestionIndex]: { selectedIndex: index, submitted: false },
    }))
  }

  function handleSubmit() {
    if (selectedAnswerIndex === null || isSubmitted) return
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: { selectedIndex: selectedAnswerIndex, submitted: true },
    }))
  }

  function handleRestart() {
    setAnswers({})
    setCurrentQuestionIndex(0)
  }

  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-linear-to-br from-white to-[#f5f0ff] px-4 py-12">
      <header className="mb-10 text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-accent-bg px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent">
          Quiz App
        </div>
        <h1 className="mb-3 text-5xl font-bold tracking-[-1.5px] text-text-h max-lg:text-3xl">
          Test Your Knowledge
        </h1>
        <p className="text-base text-text">Answer all questions and see how you do</p>
      </header>

      <main className="w-full max-w-xl rounded-3xl border border-border bg-white/80 p-10 shadow-(--shadow) backdrop-blur-sm max-lg:px-6 max-lg:py-8">
        {isFinished ? (
          <div className="text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-accent-bg px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent">
              Quiz Complete
            </div>
            <h2 className="mb-3 text-3xl font-bold tracking-[-0.5px] text-text-h">
              You scored {score} / {questions.length}
            </h2>
            <p className="mb-8 text-base text-text">
              That&apos;s {scorePercent}% correct.
            </p>
            <button
              type="button"
              onClick={handleRestart}
              className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Restart Quiz
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between gap-3">
              <span className="text-sm font-bold tracking-wide text-accent">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-sm font-bold tracking-wide text-accent">
                Score: {score} / {questions.length}
              </span>
              <div className="flex gap-1.5">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 w-6 rounded-full transition-colors duration-300 ${
                      index === currentQuestionIndex ? 'bg-accent' : 'bg-border'
                    }`}
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

            {isSubmitted && (
              <p
                className={`mt-6 text-sm font-semibold ${
                  isCorrect ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {isCorrect
                  ? 'Correct!'
                  : `Incorrect — the answer is ${currentQuestion.answers[currentQuestion.correctIndex] ?? 'not available'}.`}
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
                  disabled={selectedAnswerIndex === null}
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
