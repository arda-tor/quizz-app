interface AnswerButtonProps {
  letter: string
  answer: string
  isSelected: boolean
  isCorrect: boolean
  isIncorrect: boolean
  isSubmitted: boolean
  onClick: () => void
}

function AnswerButton({
  letter,
  answer,
  isSelected,
  isCorrect,
  isIncorrect,
  isSubmitted,
  onClick,
}: AnswerButtonProps) {
  const stateClasses = isCorrect
    ? 'border-green-500 bg-green-500/10'
    : isIncorrect
      ? 'border-red-500 bg-red-500/10'
      : isSelected
        ? 'border-accent bg-accent-bg'
        : 'border-border bg-bg hover:border-accent-border hover:bg-accent-bg'

  const letterClasses = isCorrect
    ? 'bg-green-500 text-white'
    : isIncorrect
      ? 'bg-red-500 text-white'
      : isSelected
        ? 'bg-accent text-white'
        : 'bg-accent-bg text-accent'

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isSubmitted}
      className={`flex items-center gap-3 w-full px-4 py-3.5 border-2 rounded-xl text-left text-[15px] text-text-h transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
        isSubmitted ? 'cursor-not-allowed' : 'cursor-pointer'
      } ${stateClasses}`}
    >
      <span
        className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-[13px] font-bold shrink-0 ${letterClasses}`}
      >
        {letter}
      </span>
      <span className="flex-1 leading-[135%]">{answer}</span>
    </button>
  )
}

export default AnswerButton
