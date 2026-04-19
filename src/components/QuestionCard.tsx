import AnswerButton from './AnswerButton'

interface QuestionCardProps {
  question: string
  answers: string[]
  selectedAnswerIndex: number | null
  onAnswer: (index: number) => void
}

function QuestionCard({
  question,
  answers,
  selectedAnswerIndex,
  onAnswer,
}: QuestionCardProps) {
  return (
    <div>
      <h2 className="text-[22px] font-medium leading-[140%] text-text-h mb-9 tracking-[-0.2px]">
        {question}
      </h2>
      <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
        {answers.map((answer, index) => (
          <AnswerButton
            key={index}
            letter={String.fromCharCode(65 + index)}
            answer={answer}
            isSelected={selectedAnswerIndex === index}
            onClick={() => onAnswer(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default QuestionCard
