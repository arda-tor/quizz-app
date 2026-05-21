import type { ConfidenceLevel, ConfidenceOption } from '../types/quiz'

export const confidenceOptions: ConfidenceOption[] = [
  { value: 1, label: 'Guess', detail: 'I need a clue' },
  { value: 2, label: 'Maybe', detail: 'I can explain a bit' },
  { value: 3, label: 'Certain', detail: 'I would teach it' },
]

export const confidenceLabels: Record<ConfidenceLevel, string> = {
  1: 'Guess',
  2: 'Maybe',
  3: 'Certain',
}
