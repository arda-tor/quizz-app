import { useState } from 'react'
import { questions } from './data/question'
import QuestionCard from './components/QuestionCard'

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null)
  const currentQuestion = questions[currentQuestionIndex]
  const isFirstQuestion = currentQuestionIndex === 0
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  function handlePreviousQuestion() {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex((prev) => prev - 1)
      setSelectedAnswerIndex(null)
    }
  }

  function handleNextQuestion() {
    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedAnswerIndex(null)
    }
  }

  return (
    <div className="min-h-svh flex flex-col items-center justify-center px-4 py-12 bg-linear-to-br from-white to-[#f5f0ff]">
      <header className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-accent-bg text-accent text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
          Quiz App
        </div>
        <h1 className="text-5xl font-bold tracking-[-1.5px] mb-3 text-text-h max-lg:text-3xl">
          Test Your Knowledge
        </h1>
        <p className="text-text text-base">Answer all questions and see how you do</p>
      </header>

      <main className="w-full max-w-xl bg-white/80 backdrop-blur-sm border border-border rounded-3xl p-10 shadow-(--shadow) box-border max-lg:px-6 max-lg:py-8">
        <div className="flex items-center justify-between mb-6">
          <span className="text-accent text-sm font-bold tracking-wide">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <div className="flex gap-1.5">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-6 rounded-full transition-colors duration-300 ${i === currentQuestionIndex ? 'bg-accent' : 'bg-border'}`}
              />
            ))}
          </div>
        </div>

        <QuestionCard
          question={currentQuestion.question}
          answers={currentQuestion.answers}
          selectedAnswerIndex={selectedAnswerIndex}
          onAnswer={(index) => setSelectedAnswerIndex(index)}
        />

        <div className="flex justify-between gap-3 mt-8">
          {!isFirstQuestion ? (
            <button
              type="button"
              onClick={handlePreviousQuestion}
              className="px-6 py-2.5 border-2 border-border rounded-xl bg-transparent text-text-h text-sm font-semibold cursor-pointer transition-all duration-200 hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              ← Previous
            </button>
          ) : <div />}

          {!isLastQuestion && (
            <button
              type="button"
              onClick={handleNextQuestion}
              className="ml-auto px-6 py-2.5 bg-accent text-white text-sm font-semibold rounded-xl cursor-pointer transition-all duration-200 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              Next →
            </button>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
