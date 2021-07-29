import { useState } from "react";

function Quiz({ questions }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerButtonClick = (isCorrect) => {
    if (isCorrect === true) {
      setScore(score + 1);
    }

    const nextQuestions = currentQuestion + 1;

    console.log(nextQuestions);

    if (nextQuestions < questions.length) {
      setCurrentQuestion(nextQuestions);
    } else {
      setShowScore(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(0);
    setShowScore(false);
  };

  return (
    <>
      {showScore ? (
        <div className="course__quiz-score">
          Your score {score}/{questions.length}{" "}
          {score < 5 ? (
            ""
          ) : (
            <span role="img" aria-label="confetti">
              🎉
            </span>
          )}
          <button className="course__quiz-restart" onClick={handleRestart}>
            Play Again
          </button>
        </div>
      ) : (
        <>
          <div className="course__quiz-question">
            {questions[currentQuestion].question}
          </div>

          <div className="course__quiz-options">
            {questions[currentQuestion].options.map((answerOptions) => (
              <button
                key={answerOptions.answer}
                onClick={() => handleAnswerButtonClick(answerOptions.isCorrect)}
                className="course__quiz-select"
              >
                {answerOptions.answer}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default Quiz;
