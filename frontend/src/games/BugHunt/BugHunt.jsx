import React, { useState, useEffect } from 'react';

// --- Game Data: An array of bug challenges ---
// Each bug has a description, the buggy code, a hint, and a function to verify the fix.
// Using a function for `isFixed` is more robust than a simple string check.
const bugs = [
  {
    id: 1,
    title: 'Simple Arithmetic Error',
    description: 'This function should add two numbers, but it\'s giving the wrong result. Can you fix the operator?',
    buggyCode: `function add(a, b) {\n  // Bug: This should be addition, not subtraction.\n  return a - b;\n}`,
    hint: 'The plus symbol (+) is used for addition in JavaScript.',
    isFixed: (code) => code.includes('a + b') && !code.includes('a - b'),
  },
  {
    id: 2,
    title: 'Off-by-One Error',
    description: 'We want to get the last element of the array, but the code is returning "undefined". What\'s wrong with the index?',
    buggyCode: `function getLastElement(arr) {\n  // Bug: Array indices start at 0.\n  return arr[arr.length];\n}`,
    hint: 'The last element of an array is at index `length - 1`.',
    isFixed: (code) => code.includes('arr.length - 1'),
  },
  {
    id: 3,
    title: 'Incorrect String Concatenation',
    description: 'This function should sum two numbers from a form, but it\'s treating them like text. How do you convert strings to numbers?',
    buggyCode: `function sumInputValues(val1, val2) {\n  // Bug: Input values are strings by default.\n  return val1 + val2;\n}`,
    hint: 'You can use `parseInt()` or `Number()` to convert a string to a number.',
    isFixed: (code) => code.toLowerCase().includes('parseint') || code.toLowerCase().includes('number('),
  },
  {
    id: 4,
    title: 'Classic Asynchronous Bug',
    description: 'This code tries to print 0, 1, 2 after a delay, but it prints 3 three times instead. The issue is with how the loop variable is scoped.',
    buggyCode: `function delayedLoop() {\n  for (var i = 0; i < 3; i++) {\n    setTimeout(() => {\n      // Bug: By the time this runs, 'i' is already 3.\n      console.log(i);\n    }, 1000);\n  }\n}`,
    hint: 'Changing `var` to `let` will create a new scope for `i` in each loop iteration.',
    isFixed: (code) => code.includes('let i'),
  },
];

const BugHunt = () => {
  const [currentBugIndex, setCurrentBugIndex] = useState(0);
  const [userCode, setUserCode] = useState(bugs[0].buggyCode);
  const [isSolved, setIsSolved] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' }); // type: 'success', 'error', 'hint'
  const [gameComplete, setGameComplete] = useState(false);

  // Effect to update the user's code when the bug challenge changes
  useEffect(() => {
    setUserCode(bugs[currentBugIndex].buggyCode);
    setIsSolved(false);
    setFeedback({ message: '', type: '' });
  }, [currentBugIndex]);

  const currentBug = bugs[currentBugIndex];

  const handleSubmit = () => {
    if (currentBug.isFixed(userCode)) {
      setFeedback({ message: '✅ Bug fixed! Fantastic job.', type: 'success' });
      setIsSolved(true);
    } else {
      setFeedback({ message: '❌ Not quite. The bug is still lurking in there. Try again!', type: 'error' });
    }
  };
  
  const handleShowHint = () => {
      setFeedback({ message: `💡 Hint: ${currentBug.hint}`, type: 'hint' });
  };

  const handleNextBug = () => {
    const nextIndex = currentBugIndex + 1;
    if (nextIndex < bugs.length) {
      setCurrentBugIndex(nextIndex);
    } else {
      setGameComplete(true);
    }
  };

  const handleReset = () => {
      setGameComplete(false);
      setCurrentBugIndex(0);
  };

  if (gameComplete) {
    return (
        <div className="p-8 max-w-3xl mx-auto bg-slate-800 text-white shadow-2xl rounded-2xl text-center border-2 border-green-500">
            <h2 className="text-4xl font-bold mb-4 text-green-400">🎉 You squashed all the bugs! 🎉</h2>
            <p className="text-xl text-slate-300 mb-6">You're a true Bug Hunter. Well done!</p>
            <button
                onClick={handleReset}
                className="mt-4 bg-cyan-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-cyan-500 transition-transform transform hover:scale-105"
            >
                Play Again
            </button>
        </div>
    );
  }

  // Dynamically set feedback text color based on its type
  const feedbackColor = {
      success: 'text-green-400',
      error: 'text-red-400',
      hint: 'text-cyan-400',
  }[feedback.type];

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto bg-slate-800 text-white shadow-2xl rounded-2xl">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2 text-cyan-400">Find and Fix the Bug 🐞</h2>
        <p className="text-slate-400">Challenge {currentBug.id} of {bugs.length}: <span className="font-semibold text-slate-300">{currentBug.title}</span></p>
      </div>

      <div className="bg-slate-900 p-4 rounded-lg mb-4 border border-slate-700">
        <p className="text-slate-300">{currentBug.description}</p>
      </div>

      <textarea
        className="w-full h-52 md:h-64 p-4 border-2 border-slate-700 bg-slate-900 rounded-lg font-mono text-base text-green-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 selection:bg-cyan-500 selection:text-white"
        value={userCode}
        onChange={(e) => setUserCode(e.target.value)}
        spellCheck="false"
      />
      
      {/* Feedback Area */}
      {feedback.message && (
        <div className={`mt-4 p-3 text-center rounded-lg bg-slate-900/50 ${feedbackColor} font-semibold`}>
          {feedback.message}
        </div>
      )}

      {/* Controls Area */}
      <div className="mt-6 flex flex-wrap gap-4 items-center justify-center">
        {!isSolved ? (
          <>
            <button
              className="bg-green-600 text-white font-bold px-5 py-2.5 rounded-lg hover:bg-green-500 transition-transform transform hover:scale-105"
              onClick={handleSubmit}
            >
              Submit Fix
            </button>
            <button
              className="bg-slate-600 text-white font-bold px-5 py-2.5 rounded-lg hover:bg-slate-500 transition-transform transform hover:scale-105"
              onClick={handleShowHint}
            >
              💡 Show Hint
            </button>
          </>
        ) : (
          <button
            className="bg-cyan-600 text-white font-bold px-5 py-2.5 rounded-lg hover:bg-cyan-500 transition-transform transform hover:scale-105 animate-pulse"
            onClick={handleNextBug}
          >
            {currentBugIndex === bugs.length - 1 ? 'Finish Game 🎉' : 'Next Bug ➡️'}
          </button>
        )}
      </div>
    </div>
  );
};

export default BugHunt;
