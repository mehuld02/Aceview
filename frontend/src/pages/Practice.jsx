import React, { useState, useEffect, useRef } from 'react';

// --- DATA for PracticeLab (Restructured for Categories) ---
const practiceData = {
    dsa: {
        categoryName: "Data Structures & Algorithms",
        topics: {
            arrays: {
                topicName: "Arrays",
                notes: `
                    <p class="mb-3 text-gray-300">An array is a data structure that stores a collection of elements, each identified by at least one array index or key. Arrays are stored in contiguous memory locations, which allows for efficient access to elements using their index (O(1) time complexity).</p>
                    <h4 class="font-semibold text-lg text-white mt-4 mb-2">Key Characteristics:</h4>
                    <ul class="list-disc list-inside text-gray-300 space-y-1 pl-2">
                        <li><strong>Fixed Size:</strong> The size of an array is determined at the time of creation and generally cannot be changed.</li>
                        <li><strong>Contiguous Memory:</strong> Elements are stored one after another in memory.</li>
                        <li><strong>Indexed Access:</strong> Elements can be accessed directly using their numerical index, starting from 0.</li>
                    </ul>
                    <h4 class="font-semibold text-lg text-white mt-4 mb-2">Common Operations & Time Complexity:</h4>
                    <ul class="list-disc list-inside text-gray-300 space-y-1 pl-2">
                        <li><strong>Access:</strong> O(1)</li>
                        <li><strong>Search (unsorted):</strong> O(n)</li>
                        <li><strong>Insertion/Deletion (at end):</strong> O(1) amortized</li>
                        <li><strong>Insertion/Deletion (at beginning/middle):</strong> O(n)</li>
                    </ul>
                `,
                mcqs: [
                    { question: "What is the time complexity for accessing an element in an array by its index?", options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"], answer: "O(1)" },
                    { question: "Which of the following is a disadvantage of arrays?", options: ["Elements are stored in contiguous memory locations", "Fixed size", "Fast access to elements", "Can store multiple data types"], answer: "Fixed size" }
                ],
                coding: [
                    { title: "Two Sum", difficulty: "Easy", description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.", examples: [{ input: "nums = [2,7,11,15], target = 9", output: "[0,1]" }, { input: "nums = [3,2,4], target = 6", output: "[1,2]" }], starterCode: `function twoSum(nums, target) {\n  // Your code here\n}` },
                    { title: "Rotate Array", difficulty: "Medium", description: "Given an array, rotate the array to the right by `k` steps, where `k` is non-negative.", examples: [{ input: "nums = [1,2,3,4,5,6,7], k = 3", output: "[5,6,7,1,2,3,4]" }], starterCode: `function rotate(nums, k) {\n  // Your code here\n}` }
                ]
            },
            linkedLists: {
                topicName: "Linked Lists",
                notes: `<p class="mb-3 text-gray-300">A linked list is a linear data structure where elements are not stored at contiguous memory locations...</p>`,
                mcqs: [{ question: "Which of these is not a type of linked list?", options: ["Singly Linked List", "Doubly Linked List", "Circular Linked List", "Array Linked List"], answer: "Array Linked List" }],
                coding: [{ title: "Reverse Linked List", difficulty: "Easy", description: "Given the `head` of a singly linked list, reverse the list, and return the reversed list.", examples: [], starterCode: `function reverseList(head) {\n  // Your code here\n}` }]
            }
        }
    },
    frontend: {
        categoryName: "Frontend Development",
        topics: {
            htmlCss: {
                topicName: "HTML & CSS",
                notes: `
                    <p class="mb-3 text-gray-300">HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser. CSS (Cascading Style Sheets) is a style sheet language used for describing the presentation of a document written in a markup language like HTML.</p>
                    <h4 class="font-semibold text-lg text-white mt-4 mb-2">Key Concepts:</h4>
                    <ul class="list-disc list-inside text-gray-300 space-y-1 pl-2">
                        <li><strong>HTML Tags:</strong> Building blocks of web pages (e.g., &lt;div&gt;, &lt;p&gt;, &lt;h1&gt;).</li>
                        <li><strong>CSS Selectors:</strong> Patterns used to select the element(s) you want to style.</li>
                        <li><strong>Box Model:</strong> A box that wraps around every HTML element, consisting of: margins, borders, padding, and the actual content.</li>
                    </ul>
                `,
                mcqs: [
                    { question: "What does CSS stand for?", options: ["Cascading Style Sheets", "Creative Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"], answer: "Cascading Style Sheets" },
                    { question: "Which HTML tag is used to define an internal style sheet?", options: ["<style>", "<script>", "<css>", "<link>"], answer: "<style>" }
                ],
                coding: [
                    { title: "Create a Profile Card", difficulty: "Easy", description: "Create a simple user profile card using HTML and CSS. It should include an image placeholder, a name, and a short bio.", examples: [], starterCode: `<!-- Write your HTML and CSS here -->\n<style>\n\n</style>\n\n<div>\n\n</div>` }
                ]
            },
            javascript: {
                topicName: "JavaScript",
                notes: `
                    <p class="mb-3 text-gray-300">JavaScript is a programming language that enables you to create dynamically updating content, control multimedia, animate images, and pretty much everything else. It's one of the core technologies of the World Wide Web, alongside HTML and CSS.</p>
                    <h4 class="font-semibold text-lg text-white mt-4 mb-2">Core Features:</h4>
                    <ul class="list-disc list-inside text-gray-300 space-y-1 pl-2">
                        <li><strong>Variables:</strong> Containers for storing data values (let, const, var).</li>
                        <li><strong>Functions:</strong> Blocks of code designed to perform a particular task.</li>
                        <li><strong>DOM Manipulation:</strong> Interacting with the HTML and CSS of a page.</li>
                    </ul>
                `,
                mcqs: [
                    { question: "How do you declare a constant variable in JavaScript?", options: ["const", "let", "var", "constant"], answer: "const" },
                    { question: "Which method is used to select an HTML element by its ID?", options: ["document.getElementById()", "document.querySelector()", "document.getElement()", "document.selectById()"], answer: "document.getElementById()" }
                ],
                coding: [
                    { title: "Simple Counter", difficulty: "Easy", description: "Create a counter with buttons to increment, decrement, and reset a number displayed on the page.", examples: [], starterCode: `<!-- HTML for your counter -->\n<p>Count: <span id="count">0</span></p>\n<button id="incrementBtn">Increment</button>\n<button id="decrementBtn">Decrement</button>\n\n<script>\n// Your JavaScript logic here\n</script>` }
                ]
            },
            react: {
                topicName: "React",
                notes: `
                    <p class="mb-3 text-gray-300">React is a free and open-source front-end JavaScript library for building user interfaces based on components. It is maintained by Meta and a community of individual developers and companies.</p>
                    <h4 class="font-semibold text-lg text-white mt-4 mb-2">Main Concepts:</h4>
                    <ul class="list-disc list-inside text-gray-300 space-y-1 pl-2">
                        <li><strong>Components:</strong> Reusable pieces of UI (e.g., a button or a form).</li>
                        <li><strong>State:</strong> Data that a component maintains. When state changes, the component re-renders.</li>
                        <li><strong>Props:</strong> Data passed from a parent component to a child component.</li>
                    </ul>
                `,
                mcqs: [
                    { question: "What is JSX?", options: ["A syntax extension for JavaScript", "A JavaScript library", "A database query language", "A styling language"], answer: "A syntax extension for JavaScript" },
                    { question: "How do you manage state in a functional React component?", options: ["useState() Hook", "this.state", "props", "State is not used in functional components"], answer: "useState() Hook" }
                ],
                coding: [
                    { title: "Create a Toggle Button", difficulty: "Medium", description: "Build a React component that shows a button. When clicked, it should toggle a message 'ON' or 'OFF' on the screen.", examples: [], starterCode: `import React, { useState } from 'react';\n\nfunction Toggle() {\n  // Your state and logic here\n\n  return (\n    <div>\n      {/* Your JSX here */}\n    </div>\n  );\n}\n\nexport default Toggle;` }
                ]
            }
        }
    },
    backend: {
        categoryName: "Backend Development",
        topics: {
            nodejs: {
                topicName: "Node.js & Express",
                notes: `
                    <p class="mb-3 text-gray-300">Node.js is a back-end JavaScript runtime environment that runs on the V8 engine and executes JavaScript code outside a web browser. Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.</p>
                `,
                mcqs: [
                    { question: "What is Node.js primarily used for?", options: ["Server-side scripting", "Styling web pages", "Client-side scripting", "Database management"], answer: "Server-side scripting" }
                ],
                coding: [
                    { title: "Create a Greeting API", difficulty: "Easy", description: "Write a simple Express server that responds with 'Hello, World!' to a GET request at the '/hello' endpoint.", examples: [], starterCode: `const express = require('express');\nconst app = express();\nconst port = 3000;\n\n// Your route here\n\napp.listen(port, () => {\n  console.log(\`Server running at http://localhost:\${port}/\`);\n});` }
                ]
            }
        }
    },
    databases: {
        categoryName: "Databases",
        topics: {
            sql: {
                topicName: "Databases (SQL)",
                notes: `
                    <p class="mb-3 text-gray-300">SQL (Structured Query Language) is a standard language for storing, manipulating and retrieving data in relational databases. It allows you to perform operations like creating, reading, updating, and deleting data.</p>
                `,
                mcqs: [
                    { question: "Which SQL statement is used to extract data from a database?", options: ["SELECT", "GET", "EXTRACT", "OPEN"], answer: "SELECT" }
                ],
                coding: [
                    { title: "Select Users by Country", difficulty: "Easy", description: "Given a 'Users' table with columns 'id', 'name', and 'country', write a SQL query to select all users who are from 'Canada'.", examples: [], starterCode: `SELECT * FROM Users\nWHERE ...` }
                ]
            }
        }
    }
};

// --- Helper & Sub-Components for PracticeLab ---
const DifficultyBadge = ({ difficulty }) => {
    const colors = {
        Easy: 'bg-green-600 text-green-100',
        Medium: 'bg-yellow-600 text-yellow-100',
        Hard: 'bg-red-600 text-red-100'
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[difficulty] || 'bg-gray-600'}`}>{difficulty}</span>;
};

const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-4">
        <div className="loader border-4 border-t-4 border-gray-200 border-t-indigo-500 rounded-full w-10 h-10 animate-spin"></div>
    </div>
);

// --- PracticeLab Component ---
const PracticeLab = () => {
    const [selectedCategoryKey, setSelectedCategoryKey] = useState(null);
    const [selectedTopicKey, setSelectedTopicKey] = useState(null);
    const [activeTab, setActiveTab] = useState('problems');
    const [selectedProblemIndex, setSelectedProblemIndex] = useState(null);
    const [userCodes, setUserCodes] = useState({});
    const [apiResponses, setApiResponses] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const selectedTopic = selectedCategoryKey && selectedTopicKey ? practiceData[selectedCategoryKey].topics[selectedTopicKey] : null;
    const selectedProblem = selectedTopic && selectedProblemIndex !== null ? selectedTopic.coding[selectedProblemIndex] : null;

    useEffect(() => {
        setSelectedTopicKey(null);
        setSelectedProblemIndex(null);
        setActiveTab('problems');
        setApiResponses({});
        setUserCodes({});
    }, [selectedCategoryKey]);
    
    useEffect(() => {
        setSelectedProblemIndex(null);
        setActiveTab('problems');
        setApiResponses({});
        setUserCodes({});
    }, [selectedTopicKey]);

    const callGeminiAPI = async (prompt, responseKey) => {
        setApiResponses(prev => ({ ...prev, [responseKey]: { loading: true } }));
        const apiKey = ""; 
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "Could not get a response.";
            
            let htmlText = text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/```javascript\n([\s\S]*?)```/g, '<pre class="bg-gray-900 rounded-md p-4 text-sm font-fira my-2 overflow-x-auto"><code>$1</code></pre>')
                .replace(/`([^`]+)`/g, '<code class="bg-gray-700 rounded px-1 py-0.5 font-fira text-sm">$1</code>')
                .replace(/\n/g, '<br>');

            setApiResponses(prev => ({ ...prev, [responseKey]: { loading: false, content: htmlText } }));
        } catch (error) {
            console.error("Gemini API call failed:", error);
            setApiResponses(prev => ({ ...prev, [responseKey]: { loading: false, content: `<p class="text-red-400">An error occurred.</p>` } }));
        }
    };
    
    const handleExplainConcept = () => {
        if (!selectedTopic?.notes) return;
        setIsLoading(true);
        setIsModalOpen(true);
        const prompt = `Please explain the following computer science concept in a simple and easy-to-understand way for a beginner. Use an analogy to make it clearer. Concept:\n\n${selectedTopic.notes}`;
        callGeminiAPI(prompt, 'modal').then(() => setIsLoading(false));
    };

    const handleGetHint = (problem, problemIndex) => {
        const responseKey = `hint-${problemIndex}`;
        const prompt = `I'm stuck on a coding problem. Can you give me one helpful hint to point me in the right direction? Do not give away the full solution or write any code. Problem: "${problem.description}"`;
        callGeminiAPI(prompt, responseKey);
    };

    const handleSubmitSolution = (problem, problemIndex) => {
        const responseKey = `feedback-${problemIndex}`;
        const userCode = userCodes[problemIndex] || problem.starterCode;
        const prompt = `Act as a coding judge. A student has submitted a solution. First, state if the solution is "Correct" or "Incorrect" based on typical test cases. Then, provide the Time Complexity and Space Complexity. Don't provide other explanations or code.\n\nProblem: "${problem.description}"\n\nStudent's Code:\n\`\`\`javascript\n${userCode}\n\`\`\``;
        callGeminiAPI(prompt, responseKey);
    };


    const handleCodeChange = (problemIndex, code) => {
        setUserCodes(prev => ({ ...prev, [problemIndex]: code }));
    };

    const Mcq = ({ mcq, topicKey, index }) => {
        const [result, setResult] = useState('');
        const checkAnswer = (e) => {
            e.preventDefault();
            const selected = new FormData(e.target).get(`mcq-${topicKey}-${index}`);
            if (!selected) {
                setResult({ text: 'Please select an option!', color: 'text-yellow-400' });
                return;
            }
            if(selected === mcq.answer) {
                 setResult({ text: 'Correct!', color: 'text-green-400' });
            } else {
                 setResult({ text: 'Incorrect. Try again!', color: 'text-red-400' });
            }
        };

        return (
            <form onSubmit={checkAnswer} className="bg-gray-800 p-6 rounded-lg mb-4 border border-gray-700">
                <p className="font-semibold mb-4">{index + 1}. {mcq.question}</p>
                <div className="space-y-2">
                    {mcq.options.map(option => (
                        <label key={option} className="flex items-center p-3 rounded-md hover:bg-gray-700 cursor-pointer">
                            <input type="radio" name={`mcq-${topicKey}-${index}`} value={option} className="mr-3 form-radio bg-gray-900 border-gray-600 text-indigo-500 focus:ring-indigo-500" />
                            <span className="font-fira text-sm">{option}</span>
                        </label>
                    ))}
                </div>
                <div className="mt-4">
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md text-sm">Check Answer</button>
                    {result && <span className={`ml-4 text-sm font-medium ${result.color}`}>{result.text}</span>}
                </div>
            </form>
        );
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-900 text-gray-200">
            <aside className="w-full md:w-64 bg-gray-800 p-6 border-r border-gray-700 flex-shrink-0">
                 <div className="flex items-center mb-8">
                    {selectedCategoryKey && (
                        <button 
                            onClick={() => setSelectedCategoryKey(null)} 
                            className="text-gray-400 hover:text-white mr-2 p-1 rounded-full hover:bg-gray-700"
                            aria-label="Go back to categories"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                        </button>
                    )}
                    <h1 className="text-2xl font-bold text-white truncate">
                        {selectedCategoryKey ? practiceData[selectedCategoryKey].categoryName : "Practice Topics"}
                    </h1>
                </div>
                <nav className="space-y-2">
                    {!selectedCategoryKey ? (
                         Object.keys(practiceData).map(key => (
                            <a href="#" key={key} onClick={() => setSelectedCategoryKey(key)} className="block px-4 py-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white">
                                {practiceData[key].categoryName}
                            </a>
                        ))
                    ) : (
                        Object.keys(practiceData[selectedCategoryKey].topics).map(topicKey => (
                            <a 
                                href="#" 
                                key={topicKey} 
                                onClick={() => setSelectedTopicKey(topicKey)} 
                                className={`block px-4 py-2 rounded-md transition-colors duration-200 ${selectedTopicKey === topicKey ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                            >
                                {practiceData[selectedCategoryKey].topics[topicKey].topicName}
                            </a>
                        ))
                    )}
                </nav>
            </aside>
            <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                {!selectedTopic ? (
                    <div className="text-center h-full flex flex-col justify-center items-center">
                        <svg className="w-16 h-16 text-indigo-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                        <h2 className="text-3xl font-bold text-white">Welcome to the Practice Lab</h2>
                        <p className="text-gray-400 mt-2">
                            {selectedCategoryKey ? 'Select a topic to start practicing.' : 'Select a category from the sidebar to begin.'}
                        </p>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-6">{selectedTopic.topicName}</h2>
                        <div className="flex border-b border-gray-700 mb-6">
                            <button onClick={() => setActiveTab('problems')} className={`tab-btn py-2 px-4 font-semibold border-b-2 ${activeTab === 'problems' ? 'active text-white border-indigo-500' : 'border-transparent text-gray-400'}`}>Problems</button>
                            <button onClick={() => setActiveTab('concepts')} className={`tab-btn py-2 px-4 font-semibold border-b-2 ${activeTab === 'concepts' ? 'active text-white border-indigo-500' : 'border-transparent text-gray-400'}`}>Concepts</button>
                        </div>
                        {activeTab === 'problems' && (
                            <div className="grid lg:grid-cols-4 gap-6">
                                <div className="lg:col-span-1 bg-gray-800 rounded-lg p-4 border border-gray-700">
                                    <h3 className="text-lg font-semibold mb-4 text-white">Challenges</h3>
                                    <div className="space-y-2">
                                        {selectedTopic.coding.map((problem, index) => (
                                            <a href="#" key={index} onClick={() => setSelectedProblemIndex(index)} className={`problem-link flex justify-between items-center p-3 rounded-md hover:bg-gray-700 transition-colors ${selectedProblemIndex === index ? 'active bg-indigo-600 text-white' : ''}`}>
                                                <span>{problem.title}</span>
                                                <DifficultyBadge difficulty={problem.difficulty} />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                                <div className="lg:col-span-3">
                                    {!selectedProblem ? (
                                        <div className="flex items-center justify-center text-gray-500 h-full">Select a problem to start coding.</div>
                                    ) : (
                                        <div className="gfg-layout" style={{height: 'calc(100vh - 100px)'}}>
                                            <div className="gfg-panel bg-gray-800 rounded-lg border border-gray-700 p-6 overflow-y-auto mb-6">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="text-2xl font-bold text-white">{selectedProblem.title}</h3>
                                                    <DifficultyBadge difficulty={selectedProblem.difficulty} />
                                                </div>
                                                <p className="text-gray-300" dangerouslySetInnerHTML={{ __html: selectedProblem.description }}></p>
                                                {selectedProblem.examples.map((ex, i) => (
                                                    <div key={i} className="mt-4">
                                                        <p className="font-semibold text-sm text-gray-300">Example:</p>
                                                        <div className="font-fira text-sm bg-gray-900 p-3 rounded-md mt-1">
                                                            <p><strong className="text-gray-400">Input:</strong> {ex.input}</p>
                                                            <p><strong className="text-gray-400">Output:</strong> {ex.output}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="gfg-panel flex flex-col bg-gray-800 rounded-lg border border-gray-700 p-6">
                                                <textarea value={userCodes[selectedProblemIndex] || selectedProblem.starterCode} onChange={(e) => handleCodeChange(selectedProblemIndex, e.target.value)} className=" h-40 font-fira w-full flex-grow bg-gray-900 border border-gray-700 rounded-lg p-4 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" spellCheck="false"></textarea>
                                                <div className="mt-4 flex items-center space-x-4 flex-shrink-0">
                                                    <button onClick={() => handleSubmitSolution(selectedProblem, selectedProblemIndex)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md text-sm">Submit</button>
                                                    <button onClick={() => handleGetHint(selectedProblem, selectedProblemIndex)} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md text-sm" disabled={apiResponses[`hint-${selectedProblemIndex}`]?.loading}>
                                                        {apiResponses[`hint-${selectedProblemIndex}`]?.loading ? '...' : '✨ Get a Hint'}
                                                        </button>
                                                </div>
                                                <div className="mt-4">
                                                     {apiResponses[`hint-${selectedProblemIndex}`] && (
                                                         apiResponses[`hint-${selectedProblemIndex}`].loading ? <LoadingSpinner /> : <div className="bg-gray-700/50 border-gray-600 border p-4 rounded-lg text-gray-300 text-sm" dangerouslySetInnerHTML={{ __html: apiResponses[`hint-${selectedProblemIndex}`].content }} />
                                                     )}
                                                      {apiResponses[`feedback-${selectedProblemIndex}`] && (
                                                         apiResponses[`feedback-${selectedProblemIndex}`].loading ? <LoadingSpinner /> : <div className="mt-2 bg-blue-900/30 border-blue-700 border p-4 rounded-lg text-gray-300 text-sm" dangerouslySetInnerHTML={{ __html: apiResponses[`feedback-${selectedProblemIndex}`].content }} />
                                                     )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {activeTab === 'concepts' && (
                             <div>
                                <h3 className="text-2xl font-semibold text-indigo-400 mb-4">Study Notes</h3>
                                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-10">
                                    <div dangerouslySetInnerHTML={{ __html: selectedTopic.notes }} />
                                    <div className="mt-4">
                                        <button onClick={handleExplainConcept} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md text-sm">✨ Explain This Concept</button>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-semibold text-indigo-400 mb-4">Multiple Choice Questions</h3>
                                {selectedTopic.mcqs.map((mcq, index) => <Mcq key={index} mcq={mcq} topicKey={selectedTopicKey} index={index}/>)}
                            </div>
                        )}
                    </div>
                )}
            </main>
            {isModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl border border-gray-700" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">✨ AI Explanation</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                        </div>
                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                           {isLoading || apiResponses.modal?.loading ? <LoadingSpinner/> : <div dangerouslySetInnerHTML={{__html: apiResponses.modal?.content}}/>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default function App() {
    return (
        <div className="bg-gray-900 text-gray-200 min-h-screen">
            <PracticeLab />
        </div>
    );
}

