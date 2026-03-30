import './App.css'

interface QuizQuestion {
  question: string
  answers: string[]
  correctIndex: number
}

const sampleQuestion: QuizQuestion = {
  question: 'What is the capital city of Japan?',
  answers: ['Beijing', 'Seoul', 'Tokyo', 'Bangkok'],
  correctIndex: 2,
}

function App() {
  return (
    <div className="quiz-wrapper">
      <header className="quiz-header">
        <h1 className="quiz-title">Quiz App</h1>
        <p className="quiz-subtitle">Test your knowledge</p>
      </header>

      <main className="quiz-card">
        <div className="question-area">
          <span className="question-label">Question 1 of 10</span>
          <h2 className="question-text">{sampleQuestion.question}</h2>
        </div>

        <div className="answers-grid">
          {sampleQuestion.answers.map((answer, index) => (
            <button key={index} type="button" className="answer-btn">
              <span className="answer-letter">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="answer-text">{answer}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}

export default App
