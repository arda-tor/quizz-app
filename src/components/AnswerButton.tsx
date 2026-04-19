interface AnswerButtonProps {
  letter: string
  answer: string
  isSelected: boolean
  onClick: () => void
}

function AnswerButton({ letter, answer, isSelected, onClick }: AnswerButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-3.5 border-2 rounded-xl cursor-pointer text-left text-[15px] text-text-h transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
        isSelected
          ? 'border-accent bg-accent-bg'
          : 'border-border bg-bg hover:border-accent-border hover:bg-accent-bg'
      }`}
    >
      <span
        className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-[13px] font-bold shrink-0 ${
          isSelected ? 'bg-accent text-white' : 'bg-accent-bg text-accent'
        }`}
      >
        {letter}
      </span>
      <span className="flex-1 leading-[135%]">{answer}</span>
    </button>
  )
}

export default AnswerButton
