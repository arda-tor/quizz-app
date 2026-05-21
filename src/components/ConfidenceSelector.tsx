import { confidenceOptions } from '../data/confidence'
import type { ConfidenceLevel } from '../types/quiz'

interface ConfidenceSelectorProps {
  selectedConfidence: ConfidenceLevel
  isSubmitted: boolean
  onConfidence: (confidence: ConfidenceLevel) => void
}

function ConfidenceSelector({
  selectedConfidence,
  isSubmitted,
  onConfidence,
}: ConfidenceSelectorProps) {
  const selectedLabel = confidenceOptions.find(
    (option) => option.value === selectedConfidence,
  )?.label

  return (
    <section className="mt-6 border-t border-border pt-5" aria-labelledby="confidence-title">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 id="confidence-title" className="text-sm font-bold text-text-h">
          Confidence Compass
        </h3>
        <span className="text-xs font-semibold uppercase tracking-widest text-accent">
          {selectedLabel}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 max-sm:grid-cols-1">
        {confidenceOptions.map((option) => {
          const isActive = selectedConfidence === option.value

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onConfidence(option.value)}
              disabled={isSubmitted}
              className={
                'rounded-xl border-2 px-3 py-2 text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ' +
                (isActive
                  ? 'border-accent bg-accent-bg text-text-h'
                  : 'border-border bg-bg text-text hover:border-accent-border') +
                (isSubmitted ? ' cursor-not-allowed' : '')
              }
            >
              <span className="block text-sm font-bold">{option.label}</span>
              <span className="block text-xs leading-5">{option.detail}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default ConfidenceSelector
