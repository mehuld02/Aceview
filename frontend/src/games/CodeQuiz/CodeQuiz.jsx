import React, { useState } from 'react';
import questions from './questions';

const CodeQuiz = () => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore(score + 1);
    const next = current + 1;
    if (next < questions.length) setCurrent(next);
    else setShowResult(true);
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
      {showResult ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">You scored {score} / {questions.length}</h2>
          <button onClick={() => { setCurrent(0); setScore(0); setShowResult(false); }}
            className="mt-2 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
            Restart
          </button>
        </div>
      ) : (
        <>
          <h3 className="text-xl font-semibold mb-2">{questions[current].question}</h3>
          <div className="space-y-2">
            {questions[current].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt === questions[current].answer)}
                className="w-full bg-gray-200 hover:bg-purple-200 py-2 px-4 rounded"
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CodeQuiz;
