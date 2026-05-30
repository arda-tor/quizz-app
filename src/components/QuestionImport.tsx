import { useState } from 'react'
import { parseQuestionsFromJson, validateQuestions } from '../utils/questionImport'
import type { QuizQuestion } from '../types/quiz'

interface QuestionImportProps {
  onQuestionsLoaded: (questions: QuizQuestion[]) => void
}

function QuestionImport({ onQuestionsLoaded }: QuestionImportProps) {
  const [questionJson, setQuestionJson] = useState('')
  const [apiUrl, setApiUrl] = useState('')
  const [importMessage, setImportMessage] = useState('')
  const [importError, setImportError] = useState('')
  const [isImporting, setIsImporting] = useState(false)

  function handleLoaded(nextQuestions: QuizQuestion[]) {
    onQuestionsLoaded(nextQuestions)
    setImportMessage(`Loaded ${nextQuestions.length} question${nextQuestions.length === 1 ? '' : 's'}.`)
  }

  async function handleImportJson() {
    setImportError('')
    setImportMessage('')

    if (questionJson.trim().length === 0) {
      setImportError('Paste quiz JSON before importing.')
      return
    }

    setIsImporting(true)

    try {
      const nextQuestions = await parseQuestionsFromJson(questionJson)
      handleLoaded(nextQuestions)
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Unable to import this JSON.')
    } finally {
      setIsImporting(false)
    }
  }

  async function handleFetchQuestions() {
    setImportError('')
    setImportMessage('')

    if (apiUrl.trim().length === 0) {
      setImportError('Enter an API URL before fetching.')
      return
    }

    setIsImporting(true)

    try {
      const response = await fetch(apiUrl.trim())

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}.`)
      }

      const data: unknown = await response.json()
      const nextQuestions = validateQuestions(data)
      handleLoaded(nextQuestions)
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Unable to fetch questions.')
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <section className="mb-9 border-b border-border pb-8">
      <div className="mb-4 flex items-end justify-between gap-4 max-sm:flex-col max-sm:items-start">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-accent">
            Question Import
          </p>
          <h2 className="text-xl font-bold text-text-h">Bring your own quiz</h2>
        </div>
        <span className="rounded-full bg-accent-bg px-3 py-1 text-xs font-bold text-accent">
          JSON
        </span>
      </div>

      <label htmlFor="question-json" className="mb-2 block text-sm font-semibold text-text-h">
        Paste questions
      </label>
      <textarea
        id="question-json"
        value={questionJson}
        onChange={(event) => setQuestionJson(event.target.value)}
        placeholder='[{"question":"What is 2 + 2?","answers":["3","4","5"],"correctIndex":1}]'
        className="min-h-36 w-full resize-y rounded-2xl border border-border bg-bg px-4 py-3 font-mono text-sm leading-6 text-text-h transition-colors duration-200 placeholder:text-text/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-bg"
      />

      <div className="mt-4 flex gap-3 max-sm:flex-col">
        <input
          type="url"
          value={apiUrl}
          onChange={(event) => setApiUrl(event.target.value)}
          placeholder="https://opentdb.com/api.php?amount=10&type=multiple"
          aria-label="Question API URL"
          className="min-w-0 flex-1 rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-text-h transition-colors duration-200 placeholder:text-text/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-bg"
        />
        <button
          type="button"
          onClick={handleFetchQuestions}
          disabled={isImporting}
          className="rounded-xl border-2 border-border bg-transparent px-4 py-2.5 text-sm font-semibold text-text-h transition-all duration-200 hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          Fetch URL
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 max-sm:flex-col max-sm:items-stretch">
        <p className="text-xs leading-5 text-text">
          Supports custom JSON or Open Trivia Database API responses.
        </p>
        <button
          type="button"
          onClick={handleImportJson}
          disabled={isImporting}
          className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isImporting ? 'Loading...' : 'Use Pasted JSON'}
        </button>
      </div>

      {(importError || importMessage) && (
        <p
          className={
            'mt-4 rounded-xl px-4 py-3 text-sm font-semibold ' +
            (importError ? 'bg-red-500/10 text-red-600' : 'bg-green-500/10 text-green-700')
          }
        >
          {importError || importMessage}
        </p>
      )}
    </section>
  )
}

export default QuestionImport
