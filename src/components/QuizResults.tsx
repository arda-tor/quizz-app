import { confidenceLabels, confidenceOptions } from '../data/confidence'
import type { AnswerJournalItem } from '../types/quiz'
import type { ConfidenceStats } from '../utils/quizStats'

interface QuizResultsProps {
  score: number
  totalQuestions: number
  scorePercent: number
  compassMessage: string
  confidenceStats: ConfidenceStats
  studyRoute: AnswerJournalItem[]
  onRestart: () => void
}

function QuizResults({
  score,
  totalQuestions,
  scorePercent,
  compassMessage,
  confidenceStats,
  studyRoute,
  onRestart,
}: QuizResultsProps) {
  return (
    <div className="text-center">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-accent-bg px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent">
        Quiz Complete
      </div>
      <h2 className="mb-3 text-3xl font-bold text-text-h">
        You scored {score} / {totalQuestions}
      </h2>
      <p className="mb-7 text-base text-text">
        That&apos;s {scorePercent}% correct. {compassMessage}
      </p>

      <div className="mb-8 border-y border-border py-5 text-left">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">
          Confidence Compass
        </p>
        <div className="grid grid-cols-3 gap-3 max-sm:grid-cols-1">
          {confidenceOptions.map((option) => (
            <div key={option.value} className="rounded-2xl border border-border bg-bg p-3">
              <p className="mb-3 text-sm font-bold text-text-h">{option.label}</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {confidenceStats[option.value].correct}
                  </p>
                  <p className="text-xs text-text">correct</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">
                    {confidenceStats[option.value].incorrect}
                  </p>
                  <p className="text-xs text-text">missed</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8 text-left">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">
          Study Route
        </p>
        {studyRoute.length > 0 ? (
          <div className="space-y-3">
            {studyRoute.map((item) => (
              <div
                key={item.questionIndex}
                className="rounded-2xl border border-border bg-bg px-4 py-3"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-accent">
                    Q{item.questionIndex + 1} - {confidenceLabels[item.confidence]}
                  </span>
                  <span
                    className={
                      'text-xs font-bold ' +
                      (item.correct ? 'text-green-600' : 'text-red-600')
                    }
                  >
                    {item.correct ? 'Hidden strength' : 'Review first'}
                  </span>
                </div>
                <p className="text-sm font-semibold leading-6 text-text-h">{item.question}</p>
                {!item.correct && (
                  <p className="mt-1 text-sm text-text">
                    Your answer: {item.selectedAnswer}. Correct: {item.correctAnswer}.
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-border bg-bg px-4 py-3 text-sm text-text">
            No urgent review cards. Your answers and confidence were in sync.
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onRestart}
        className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Restart Quiz
      </button>
    </div>
  )
}

export default QuizResults
