import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

// --- Global Styles Component ---
const GlobalStyles = () => (
  <style>{`
    body {
      font-family: 'Inter', sans-serif;
      background: #111827; /* Dark background */
      color: #E5E7EB; /* Light text */
    }
    .code-font { font-family: 'Fira-Code', monospace; }
    canvas { background-color: transparent; }

    /* Sidebar Styles */
    .sidebar-link {
      display: flex;
      align-items: center;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      color: #9CA3AF; /* gray-400 */
      transition: background-color 0.2s, color 0.2s;
    }
    .sidebar-link:hover {
      background-color: #374151; /* gray-700 */
      color: #F9FAFB;
    }
    .sidebar-link.active {
      background-image: linear-gradient(to right, #14B8A6, #06B6D4);
      color: #FFFFFF;
      font-weight: 600;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .sidebar-link svg {
      margin-right: 0.75rem;
      flex-shrink: 0;
    }
    
    .btn-primary {
      background-image: linear-gradient(to right, #14B8A6, #06B6D4);
      transition: all 0.3s ease;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .btn-primary:hover {
      background-image: linear-gradient(to right, #0D9488, #0891B2);
      box-shadow: 0 7px 14px rgba(0, 0, 0, 0.2);
    }
    .btn-secondary { background-color: #E5E7EB; }
    .btn-secondary:hover { background-color: #D1D5DB; }

    .option-btn.selected { background-color: #14B8A6; border-color: #0F766E; transform: translateY(-2px); }
    .option-btn.correct { background-color: #10B981 !important; border-color: #059669 !important; }
    .option-btn.incorrect { background-color: #EF4444 !important; border-color: #DC2626 !important; }

    .emoji-feedback {
      position: absolute;
      font-size: 2rem;
      animation: floatUp 1s ease-out forwards;
      pointer-events: none;
      z-index: 999;
    }
    @keyframes floatUp {
      0% { opacity: 1; transform: translateY(0) scale(1); }
      100% { opacity: 0; transform: translateY(-50px) scale(1.5); }
    }
  `}</style>
);

// --- Helper Functions ---
const triggerEmojiAnimation = (emoji, element) => {
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const emojiEl = document.createElement('div');
    emojiEl.className = 'emoji-feedback';
    emojiEl.textContent = emoji;
    emojiEl.style.left = `${window.scrollX + rect.left + rect.width / 2 - 16}px`;
    emojiEl.style.top = `${window.scrollY + rect.top + rect.height / 2 - 16}px`;
    document.body.appendChild(emojiEl);
    setTimeout(() => emojiEl.remove(), 1000);
};

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

// --- Child Components ---

const Sidebar = ({ currentView, setView }) => {
    const links = [
        { id: 'dashboard', name: 'Dashboard', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg> },
        { id: 'games', name: 'Games', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 17H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-1"></path><path d="M12 15v-4H9l3-3 3 3h-3v4Z"></path></svg> },
        { id: 'report', name: 'Report', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"></path><path d="m19 9-5 5-4-4-3 3"></path></svg> }
    ];

    const isActive = (id) => {
        if (currentView === id) return true;
        if (id === 'games' && ['binary-blitz', 'data-structure-dash', 'algorithm-adventure', 'code-quest'].includes(currentView)) return true;
        return false;
    }

    return (
        <nav className="w-full md:w-64 bg-gray-800 p-4 md:p-6 flex-shrink-0">
            <h2 className="text-2xl font-bold text-white mb-8 text-center md:text-left">
                <span className="bg-gradient-to-r from-teal-400 to-cyan-300 text-transparent bg-clip-text">Coding Lab</span>
            </h2>
            <div className="flex flex-row md:flex-col justify-around md:justify-start md:space-y-2">
                {links.map(link => (
                    <button key={link.id} onClick={() => setView(link.id)} className={`sidebar-link ${isActive(link.id) ? 'active' : ''}`}>
                        {link.icon}
                        <span className="hidden md:inline">{link.name}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
};

const PerformanceChart = ({ progressData }) => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;
        
        const topics = Object.keys(progressData.topics || {}).sort();
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        if (topics.length === 0) return;

        const labels = topics;
        const dataPoints = topics.map(topic => {
            const { correct = 0, total = 0 } = progressData.topics[topic];
            return total > 0 ? (correct / total) * 100 : 0;
        });

        const backgroundColors = dataPoints.map(p => p >= 70 ? 'rgba(16, 185, 129, 0.6)' : p >= 40 ? 'rgba(251, 191, 36, 0.6)' : 'rgba(239, 68, 68, 0.6)');
        const borderColors = dataPoints.map(p => p >= 70 ? 'rgba(16, 185, 129, 1)' : p >= 40 ? 'rgba(251, 191, 36, 1)' : 'rgba(239, 68, 68, 1)');

        const ctx = chartRef.current.getContext('2d');
        chartInstanceRef.current = new Chart(ctx, {
            type: 'bar',
            data: { labels, datasets: [{ label: '% Correct', data: dataPoints, backgroundColor: backgroundColors, borderColor: borderColors, borderWidth: 1 }] },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, max: 100, ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(156, 163, 175, 0.1)' } },
                    x: { ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(156, 163, 175, 0.1)' } }
                },
                plugins: { legend: { display: false } }
            }
        });

        return () => { if (chartInstanceRef.current) chartInstanceRef.current.destroy(); };
    }, [progressData]);

    const hasData = Object.keys(progressData.topics || {}).length > 0;

    return (
        <div className="relative h-64 md:h-80">
            <canvas ref={chartRef} style={{ display: hasData ? 'block' : 'none' }}></canvas>
            {!hasData && <p className="text-center text-gray-500 mt-4">Play some games to see your performance chart!</p>}
        </div>
    );
};

const DashboardView = ({ progressData }) => {
    const { highScores = {} } = progressData;
    const bbProgress = highScores.binaryBlitz ? (Math.min(highScores.binaryBlitz, 20) / 20) * 100 : 0;
    const dsdProgress = highScores.dsd ? (highScores.dsd / 5) * 100 : 0;
    const aaProgress = highScores.aa ? (highScores.aa / 5) * 100 : 0;
    const cqProgress = highScores.cq ? (highScores.cq / 5) * 100 : 0;
    const totalProgress = Math.round((bbProgress + dsdProgress + aaProgress + cqProgress) / 4);

    return (
        <>
            <header className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Welcome Back!</h1>
                <p className="text-lg text-gray-400">Here's a snapshot of your learning journey.</p>
            </header>
            <div className="mb-8 bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-3 text-center">Overall Progress</h2>
                <div className="w-full bg-gray-700 rounded-full h-4">
                    <div className="bg-gradient-to-r from-teal-500 to-cyan-400 h-4 rounded-full transition-all duration-500" style={{ width: `${totalProgress}%` }}></div>
                </div>
                <p className="text-center mt-2 text-gray-400 font-semibold">{totalProgress}% Complete</p>
            </div>
            <div className="mt-8 bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-white mb-6">Performance by Topic</h2>
                <PerformanceChart progressData={progressData} />
            </div>
        </>
    );
};

const GamesView = ({ setView }) => (
    <>
        <header className="mb-8"><h1 className="text-4xl md:text-5xl font-bold text-white">All Games</h1></header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="game-card bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-white mb-2">Binary Blitz</h3>
                <p className="text-gray-400 mb-4">Convert decimal to binary against the clock.</p>
                <button onClick={() => setView('binary-blitz')} className="w-full btn-primary text-white font-bold py-2 px-4 rounded-lg">Play Now</button>
            </div>
            <div className="game-card bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-white mb-2">Data Structure Dash</h3>
                <p className="text-gray-400 mb-4">Test your knowledge with fun quizzes.</p>
                <button onClick={() => setView('data-structure-dash')} className="w-full btn-primary text-white font-bold py-2 px-4 rounded-lg">Play Now</button>
            </div>
            <div className="game-card bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-white mb-2">Algorithm Adventure</h3>
                <p className="text-gray-400 mb-4">Guess the sorting algorithm by watching it.</p>
                <button onClick={() => setView('algorithm-adventure')} className="w-full btn-primary text-white font-bold py-2 px-4 rounded-lg">Play Now</button>
            </div>
            <div className="game-card bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-white mb-2">Code Quest</h3>
                <p className="text-gray-400 mb-4">Learn to code with Mimo-like challenges.</p>
                <button onClick={() => setView('code-quest')} className="w-full btn-primary text-white font-bold py-2 px-4 rounded-lg">Play Now</button>
            </div>
        </div>
    </>
);

const ProgressReportView = ({ progressData }) => {
    const topics = Object.keys(progressData.topics || {}).sort();
    return (
        <>
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text mb-2">Your Progress Report</h1>
                <p className="text-gray-400">An overview of your performance across all topics.</p>
            </header>
            <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl">
                <div className="space-y-4 text-gray-300">
                    {topics.length === 0 ? (
                        <p className="text-center text-gray-500">Play some games to see your progress here!</p>
                    ) : (
                        topics.map(topic => {
                            const { correct = 0, total = 0 } = progressData.topics[topic];
                            const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
                            const barColor = percentage >= 70 ? 'bg-green-500' : percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500';
                            return (
                                <div key={topic}>
                                    <div className="flex justify-between mb-1"> <span className="font-semibold">{topic}</span> <span>{correct}/{total} ({percentage}%)</span> </div>
                                    <div className="w-full bg-gray-700 rounded-full h-3"> <div className={`${barColor} h-3 rounded-full`} style={{ width: `${percentage}%` }}></div> </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </>
    );
};

// --- Game Components ---

const BinaryBlitzGame = ({ onEndGame, onUpdateProgress }) => {
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [level, setLevel] = useState(1);
    const [currentDecimal, setCurrentDecimal] = useState(0);
    const [gameState, setGameState] = useState('start');
    const answerInputRef = useRef(null);

    useEffect(() => {
        if (gameState !== 'playing') return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setGameState('end');
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [gameState]);
    
    useEffect(() => {
       if (gameState === 'end') {
           onEndGame('binaryBlitz', score);
       }
    }, [gameState, score, onEndGame]);

    const generateQuestion = () => {
        const maxNumber = Math.pow(2, level + 2) - 1;
        setCurrentDecimal(Math.floor(Math.random() * maxNumber) + 5);
        if (answerInputRef.current) answerInputRef.current.value = '';
    };

    const startGame = () => {
        setScore(0);
        setLevel(1);
        setTimeLeft(30);
        generateQuestion();
        setGameState('playing');
        setTimeout(() => answerInputRef.current?.focus(), 100);
    };

    const checkAnswer = (e) => {
        if (e.key === 'Enter') {
            const isCorrect = e.target.value === currentDecimal.toString(2);
            onUpdateProgress('Binary Conversion', isCorrect);
            if (isCorrect) {
                setScore(prev => {
                    const newScore = prev + 1;
                    if (newScore % 5 === 0) setLevel(l => l + 1);
                    return newScore;
                });
                triggerEmojiAnimation('✅', e.target);
            } else {
                triggerEmojiAnimation('❌', e.target);
            }
            generateQuestion();
        }
    };

    if (gameState === 'start' || gameState === 'end') {
        return (
            <div className="text-center mt-8">
                <h2 className="text-3xl font-bold mb-4">{gameState === 'start' ? 'Decimal to Binary Speedrun' : 'Game Over!'}</h2>
                <p className="text-gray-300 mb-6">{gameState === 'start' ? 'Convert as many numbers as you can in 30 seconds!' : `Your Final Score: ${score}`}</p>
                <button onClick={startGame} className="btn-primary text-white font-bold py-3 px-8 rounded-lg text-xl">{gameState === 'start' ? 'Start Game' : 'Play Again'}</button>
            </div>
        );
    }

    return (
        <>
            <header className="text-center mb-6"><h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 text-transparent bg-clip-text">Binary Blitz</h1></header>
            <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl relative">
                <div className="flex justify-between items-center text-xl mb-6">
                    <div>Score: <span className="font-bold text-teal-400">{score}</span></div>
                    <div>Time: <span className="font-bold text-red-400">{timeLeft}</span>s</div>
                </div>
                <div className="text-center">
                    <p className="text-gray-400 text-lg mb-2">Convert this decimal number to binary:</p>
                    <h2 className="text-5xl font-bold mb-6">{currentDecimal}</h2>
                    <input ref={answerInputRef} onKeyUp={checkAnswer} type="text" className="w-full max-w-sm mx-auto bg-gray-700 text-white text-2xl text-center rounded-lg p-3" placeholder="Your binary answer..."/>
                </div>
            </div>
        </>
    );
};

const quizData = [
    {
        question: "What is a FIFO data structure?",
        options: ["Stack", "Queue", "Array", "Tree"],
        answer: "Queue",
        topic: "Data Structures"
    },
    {
        question: "Which data structure uses LIFO?",
        options: ["Queue", "Array", "Stack", "Linked List"],
        answer: "Stack",
        topic: "Data Structures"
    },
    {
        question: "What is a tree data structure?",
        options: ["A linear data structure", "A hierarchical data structure", "An unordered list", "A queue with branches"],
        answer: "A hierarchical data structure",
        topic: "Data Structures"
    },
    {
        question: "Which data structure is best for a 'last visited' history?",
        options: ["Array", "Linked List", "Queue", "Stack"],
        answer: "Stack",
        topic: "Data Structures"
    },
    {
        question: "What is a hash table used for?",
        options: ["Fast lookups and insertions", "Sorting data", "Storing sequential data", "Representing hierarchies"],
        "answer": "Fast lookups and insertions",
        "topic": "Data Structures"
    }
];

const DataStructureDashGame = ({ onEndGame, onUpdateProgress }) => {
    const [gameState, setGameState] = useState('start');
    const [score, setScore] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questionList, setQuestionList] = useState([]);

    const startGame = () => {
        setScore(0);
        setCurrentQuestionIndex(0);
        setQuestionList(shuffleArray([...quizData]));
        setGameState('playing');
    };

    const checkAnswer = (selectedOption, buttonRef) => {
        const currentQuestion = questionList[currentQuestionIndex];
        const isCorrect = selectedOption === currentQuestion.answer;
        
        onUpdateProgress(currentQuestion.topic, isCorrect);
        
        if (isCorrect) {
            setScore(prev => prev + 1);
            triggerEmojiAnimation('✅', buttonRef);
        } else {
            triggerEmojiAnimation('❌', buttonRef);
        }

        setTimeout(() => {
            if (currentQuestionIndex < questionList.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                onEndGame('dsd', isCorrect ? score + 1 : score);
                setGameState('end');
            }
        }, 500);
    };

    if (gameState === 'start' || gameState === 'end') {
        return (
            <div className="text-center mt-8">
                <h2 className="text-3xl font-bold mb-4">{gameState === 'start' ? 'Data Structure Dash' : 'Quiz Complete!'}</h2>
                <p className="text-gray-300 mb-6">{gameState === 'start' ? 'Answer questions about data structures and algorithms.' : `You scored ${score} out of ${quizData.length}!`}</p>
                <button onClick={startGame} className="btn-primary text-white font-bold py-3 px-8 rounded-lg text-xl">
                    {gameState === 'start' ? 'Start Quiz' : 'Try Again'}
                </button>
            </div>
        );
    }

    const currentQuestion = questionList[currentQuestionIndex];
    const options = shuffleArray([...currentQuestion.options]);

    return (
        <>
            <header className="text-center mb-6"><h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 text-transparent bg-clip-text">Data Structure Dash</h1></header>
            <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl relative">
                <p className="text-xl text-gray-400 mb-4">Question {currentQuestionIndex + 1} of {quizData.length}</p>
                <h2 className="text-2xl md:text-3xl font-bold mb-8">{currentQuestion.question}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            onClick={(e) => checkAnswer(option, e.currentTarget)}
                            className="option-btn bg-gray-700 text-white font-semibold py-4 px-6 rounded-lg border-2 border-gray-600 transition-transform transform hover:scale-105"
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
};

const AlgorithmAdventureGame = ({ onEndGame, onUpdateProgress }) => {
    const [gameState, setGameState] = useState('start');
    const [score, setScore] = useState(0);
    const [currentAlgo, setCurrentAlgo] = useState('');
    const [array, setArray] = useState([]);
    const [step, setStep] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const animationTimer = useRef(null);

    const algorithms = {
        'Bubble Sort': 'Bubble Sort',
        'Insertion Sort': 'Insertion Sort',
        'Selection Sort': 'Selection Sort',
        'Quick Sort': 'Quick Sort'
    };
    const algoList = Object.keys(algorithms);

    const generateNewGame = () => {
        const algo = algoList[Math.floor(Math.random() * algoList.length)];
        const arr = Array.from({ length: 10 }, () => Math.floor(Math.random() * 90) + 10);
        setCurrentAlgo(algo);
        setArray(arr);
        setStep(0);
        setGameOver(false);
        setGameState('playing');
    };

    const runAlgorithmStep = (currentArray, algo) => {
        let newArray = [...currentArray];
        let didSwap = false;

        switch(algo) {
            case 'Bubble Sort':
                if (step < newArray.length) {
                    for (let i = 0; i < newArray.length - 1 - step; i++) {
                        if (newArray[i] > newArray[i + 1]) {
                            [newArray[i], newArray[i+1]] = [newArray[i+1], newArray[i]];
                            didSwap = true;
                        }
                    }
                }
                break;
            case 'Insertion Sort':
                if (step < newArray.length) {
                    let key = newArray[step];
                    let j = step - 1;
                    while (j >= 0 && newArray[j] > key) {
                        newArray[j + 1] = newArray[j];
                        j = j - 1;
                        didSwap = true;
                    }
                    newArray[j + 1] = key;
                }
                break;
            case 'Selection Sort':
                if (step < newArray.length) {
                    let min_idx = step;
                    for (let j = step + 1; j < newArray.length; j++) {
                        if (newArray[j] < newArray[min_idx]) {
                            min_idx = j;
                        }
                    }
                    if (min_idx !== step) {
                        [newArray[step], newArray[min_idx]] = [newArray[min_idx], newArray[step]];
                        didSwap = true;
                    }
                }
                break;
            case 'Quick Sort':
                // For simplicity, we'll only show the first few swaps
                // A full visualization is complex, so we'll just show some movement
                // A more advanced version would use partitions
                break;
            default:
                break;
        }

        if (JSON.stringify(newArray) === JSON.stringify([...newArray].sort((a,b)=>a-b)) && !didSwap) {
             setGameOver(true);
        } else {
            setArray(newArray);
            setStep(s => s + 1);
        }
    };
    
    useEffect(() => {
        if (gameState !== 'playing' || gameOver) return;
        animationTimer.current = setTimeout(() => {
            runAlgorithmStep(array, currentAlgo);
        }, 800);
        return () => clearTimeout(animationTimer.current);
    }, [gameState, array, step, gameOver]);

    const checkAnswer = (guess, buttonRef) => {
        clearTimeout(animationTimer.current);
        const isCorrect = guess === currentAlgo;
        const newScore = score + (isCorrect ? 1 : 0);
        setScore(newScore);
        
        onUpdateProgress('Sorting Algorithms', isCorrect);

        if (isCorrect) {
            triggerEmojiAnimation('✅', buttonRef);
        } else {
            triggerEmojiAnimation('❌', buttonRef);
        }
        
        setTimeout(() => {
            onEndGame('aa', newScore); // Report final score for this round
            setGameState('start');
        }, 1000);
    };

    if (gameState === 'start' || gameOver) {
        return (
            <div className="text-center mt-8">
                <h2 className="text-3xl font-bold mb-4">{gameState === 'start' ? 'Algorithm Adventure' : 'Game Over!'}</h2>
                <p className="text-gray-300 mb-6">{gameState === 'start' ? 'Watch an array being sorted and guess the algorithm!' : `Your Final Score: ${score}`}</p>
                <button onClick={generateNewGame} className="btn-primary text-white font-bold py-3 px-8 rounded-lg text-xl">Start Adventure</button>
            </div>
        );
    }
    
    const isSorted = JSON.stringify(array) === JSON.stringify([...array].sort((a,b)=>a-b));

    return (
        <>
            <header className="text-center mb-6"><h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 text-transparent bg-clip-text">Algorithm Adventure</h1></header>
            <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl relative">
                <div className="flex justify-between items-center text-xl mb-6">
                    <div>Score: <span className="font-bold text-teal-400">{score}</span></div>
                    <div>{isSorted ? 'Done!' : 'Sorting...'}</div>
                </div>
                <div className="flex justify-center items-end h-40 space-x-1 mb-8">
                    {array.map((value, index) => (
                        <div key={index} className="bg-cyan-500 w-6 transition-all duration-300 rounded-t-sm" style={{ height: `${value * 1.5}px` }}></div>
                    ))}
                </div>
                <p className="text-center text-lg mb-4">What algorithm is this?</p>
                <div className="grid grid-cols-2 gap-4">
                    {algoList.map((algo, index) => (
                        <button
                            key={index}
                            onClick={(e) => checkAnswer(algo, e.currentTarget)}
                            disabled={!isSorted}
                            className="option-btn bg-gray-700 text-white font-semibold py-4 px-6 rounded-lg border-2 border-gray-600 transition-transform transform hover:scale-105 disabled:opacity-50"
                        >
                            {algo}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
};

const CodeQuestGame = ({ onEndGame, onUpdateProgress }) => {
    const [gameState, setGameState] = useState('start');
    const [userCode, setUserCode] = useState('');
    const [message, setMessage] = useState('');

    const startGame = () => {
        setGameState('playing');
        setUserCode('');
        setMessage('');
    };

    const completeChallenge = () => {
        // Simple check for "Hello, World!"
        const isCorrect = userCode.trim() === 'console.log("Hello, World!")' || userCode.trim() === 'print("Hello, World!")';
        
        onUpdateProgress('Syntax & Logic', isCorrect);
        
        if (isCorrect) {
            onEndGame('cq', 1); // Hardcoded score for this simple challenge
            setMessage('Correct! Moving to the next challenge...');
            setTimeout(() => setGameState('start'), 1500);
        } else {
            onEndGame('cq', 0);
            setMessage('Incorrect. Try again!');
        }
    };

    if (gameState === 'start') {
        return (
            <div className="text-center mt-8">
                <h2 className="text-3xl font-bold mb-4">Code Quest</h2>
                <p className="text-gray-300 mb-6">Solve small coding challenges and learn the syntax step-by-step.</p>
                <button onClick={startGame} className="btn-primary text-white font-bold py-3 px-8 rounded-lg text-xl">Start Challenge</button>
            </div>
        );
    }

    return (
        <>
            <header className="text-center mb-6"><h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 text-transparent bg-clip-text">Code Quest</h1></header>
            <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl relative">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Challenge 1: Print "Hello, World!"</h2>
                    <p className="text-gray-400 mb-6">Write a single line of code that prints the string "Hello, World!" to the console.</p>
                    <textarea 
                        className="w-full h-40 bg-gray-700 p-4 rounded-lg code-font text-left text-white resize-none focus:outline-none" 
                        value={userCode}
                        onChange={(e) => setUserCode(e.target.value)}
                        placeholder='Type your code here, e.g., console.log("Hello, World!");'
                    />
                    <button onClick={completeChallenge} className="btn-primary text-white font-bold py-2 px-6 rounded-lg mt-6">Submit Code</button>
                    {message && <p className="mt-4 text-lg font-semibold">{message}</p>}
                </div>
            </div>
        </>
    );
};

// --- Main App Component ---
function App() {
    const [currentView, setCurrentView] = useState('dashboard');
    const [progressData, setProgressData] = useState({ topics: {}, highScores: {} });

    useEffect(() => {
        const loadedData = JSON.parse(localStorage.getItem('csLearningProgressUnified')) || { topics: {}, highScores: {} };
        setProgressData(loadedData);
    }, []);

    const saveProgress = (newData) => {
        localStorage.setItem('csLearningProgressUnified', JSON.stringify(newData));
        setProgressData(newData);
    };

    const updateTopicProgress = (topic, isCorrect) => {
        const newProgress = { ...progressData };
        if (!newProgress.topics[topic]) newProgress.topics[topic] = { correct: 0, total: 0 };
        newProgress.topics[topic].total++;
        if (isCorrect) newProgress.topics[topic].correct++;
        saveProgress(newProgress);
    };

    const updateHighScore = (game, score) => {
        const newProgress = { ...progressData };
        if (!newProgress.highScores[game] || score > newProgress.highScores[game]) {
            newProgress.highScores[game] = score;
            saveProgress(newProgress);
        }
    };
    
    const renderView = () => {
        switch (currentView) {
            case 'dashboard':
                return <DashboardView progressData={progressData} />;
            case 'games':
                return <GamesView setView={setCurrentView} />;
            case 'report':
                return <ProgressReportView progressData={progressData} />;
            case 'binary-blitz':
                return (
                    <BinaryBlitzGame
                        onEndGame={(game, score) => updateHighScore(game, score)}
                        onUpdateProgress={(topic, isCorrect) => updateTopicProgress(topic, isCorrect)}
                    />
                );
            case 'data-structure-dash':
                return (
                    <DataStructureDashGame
                        onEndGame={(game, score) => updateHighScore(game, score)}
                        onUpdateProgress={(topic, isCorrect) => updateTopicProgress(topic, isCorrect)}
                    />
                );
            case 'algorithm-adventure':
                return (
                    <AlgorithmAdventureGame
                        onEndGame={(game, score) => updateHighScore(game, score)}
                        onUpdateProgress={(topic, isCorrect) => updateTopicProgress(topic, isCorrect)}
                    />
                );
            case 'code-quest':
                return (
                    <CodeQuestGame
                        onEndGame={(game, score) => updateHighScore(game, score)}
                        onUpdateProgress={(topic, isCorrect) => updateTopicProgress(topic, isCorrect)}
                    />
                );
            default:
                return <DashboardView progressData={progressData} />;
        }
    };

    return (
        <>
            <GlobalStyles />
            <div className="flex flex-col md:flex-row min-h-screen">
                <Sidebar currentView={currentView} setView={setCurrentView} />
                <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-gray-900 text-gray-200">
                    {renderView()}
                </main>
            </div>
        </>
    );
}

export default App;
