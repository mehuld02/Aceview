import React, { useState, useEffect, useRef } from 'react';

// The CSS can be placed in a separate .css file and imported.
// For this example, we'll keep it as a constant to be used in a <style> tag.
const componentStyles = `
    body {
        font-family: 'Inter', sans-serif;
    }
    @keyframes pulse-red {
        0%, 100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
        }
        70% {
            box-shadow: 0 0 0 15px rgba(239, 68, 68, 0);
        }
    }
    .animate-pulse-red {
        animation: pulse-red 2s infinite;
    }
    .modal-backdrop {
        background-color: rgba(0,0,0,0.75);
    }
`;

const MockInterview = () => {
    // --- State Management ---
    const [isSetupModalOpen, setIsSetupModalOpen] = useState(true);
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [view, setView] = useState('start'); // 'start', 'mic', 'loading'
    
    const [interviewTopic, setInterviewTopic] = useState('General Software Engineer');
    const [geminiApiKey, setGeminiApiKey] = useState('AIzaSyC0ZoJPtNWhvqbDt0LNelI0bYxf6Rm9KAQ'); // Set your key here
    
    const [currentQuestion, setCurrentQuestion] = useState("Complete the setup to begin.");
    const [feedback, setFeedback] = useState('');
    const [userResponse, setUserResponse] = useState('');
    const [micError, setMicError] = useState('');
    
    const [interviewHistory, setInterviewHistory] = useState([]);
    const [summaryContent, setSummaryContent] = useState('');

    // --- Refs ---
    const recognitionRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);

    // --- Gemini API Configuration ---
    // CORRECTED: API_URL must be a string. Removed the trailing semicolon.
    const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
    
    // --- Speech Recognition & Synthesis Setup (useEffect) ---
   // --- Speech Recognition & Synthesis Setup (useEffect) ---
useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event) => {
            console.error("Speech Recognition Error:", event.error);
            setMicError(`Speech recognition error: ${event.error}. Please ensure your microphone is enabled.`);
            setIsListening(false);
        };
        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript.trim();
            setUserResponse(`You said: "${transcript}"`);
            recognition.stop();
            sendResponseToBackend(transcript);
        };
        recognitionRef.current = recognition;
    } else {
        setMicError("Speech recognition is not supported in your browser. Please use Google Chrome.");
    }

    // ✅ CLEANUP runs when the component unmounts (page change, etc.)
    return () => {
        if (recognitionRef.current) {
            recognitionRef.current.onresult = null;
            recognitionRef.current.onend = null;
            recognitionRef.current.onerror = null;
            recognitionRef.current.stop();
        }
        if (synthRef.current && synthRef.current.speaking) {
            synthRef.current.cancel();
        }
        setIsListening(false);
        setView("start");
        setUserResponse("");
        setFeedback("");
        setCurrentQuestion("Complete the setup to begin.");
    };
}, []); 
 // Empty dependency array ensures this runs only once on mount

    // --- Core Logic Functions ---
    const speak = (text, callback) => {
        const synth = synthRef.current;
        if (synth.speaking) {
            synth.cancel();
        }
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => {
            if (callback) callback();
        };
        synth.speak(utterance);
    };

    const handleMicClick = () => {
        const recognition = recognitionRef.current;
        if (!recognition) return;

        if (isListening) {
            recognition.stop();
        } else {
            try {
                setMicError(''); // Clear previous errors
                recognition.start();
            } catch (e) {
                console.error("Error starting recognition:", e);
                setMicError("Microphone could not be started.");
            }
        }
    };
    
    const handleStartInterview = () => {
        setView('loading');
        setMicError('');
        setUserResponse('');
        setFeedback('');
        
        const firstQuestion = "Hello! Thank you for coming in today. To start, can you tell me a little bit about yourself and your background?";
        const initialHistory = [{ role: 'model', parts: [{ text: firstQuestion }] }];

        setInterviewHistory(initialHistory);
        setCurrentQuestion(firstQuestion);
        speak(firstQuestion, () => {
            setView('mic');
            handleMicClick();
        });
    };

    const handleSaveSetup = () => {
        setIsSetupModalOpen(false);
        setCurrentQuestion("Welcome! When you're ready, click 'Start Interview' to begin.");
    };

    const getSystemInstruction = () => ({
        role: "system",
        parts: [{
        text: `You are an expert AI interviewer for a ${interviewTopic} role. Your goal is to conduct a realistic job interview.
        1.  After the user responds, provide brief, constructive feedback on their answer. The feedback should be encouraging but also offer a specific point for improvement relevant to the ${interviewTopic} position.
        2.  Then, ask a relevant follow-up question that is specific to the ${interviewTopic} field.
        3.  Your entire response MUST be a single, valid JSON object with two string keys: "feedback" and "nextQuestion". Example: {"feedback": "That's a great example.", "nextQuestion": "Tell me about a time you had a conflict."}`
        }]
    });

    // --- API Integration ---
    const sendResponseToBackend = async (transcript) => {
        setView('loading');
        setFeedback("✨ Evaluating your response...");

        const currentHistory = [...interviewHistory, { role: 'user', parts: [{ text: transcript }] }];

        const payload = {
            contents: currentHistory,
            systemInstruction: getSystemInstruction(),
            generationConfig: {
                responseMimeType: "application/json",
            }
        };

        try {
            // CORRECTED: Used backticks (`) for template literal in fetch URL.
            const response = await fetch(`${API_URL}?key=${geminiApiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                // CORRECTED: Used backticks (`) for template literal.
                throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
            }
            
            const result = await response.json();
            const aiResponseText = result.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!aiResponseText) throw new Error("Invalid response structure from AI.");
            
            const aiResponse = JSON.parse(aiResponseText);
            
            setFeedback(aiResponse.feedback);
            setCurrentQuestion(aiResponse.nextQuestion);
            setInterviewHistory([...currentHistory, { role: 'model', parts: [{ text: aiResponse.nextQuestion }] }]);

            speak(aiResponse.nextQuestion, () => {
                setView('mic');
                setUserResponse('');
                handleMicClick();
            });

        } catch (error) {
            console.error("Gemini API Error:", error);
            // CORRECTED: Used backticks (`) for template literal.
            setMicError(`An error occurred: ${error.message}. Check your API key and network connection.`);
            setView('mic');
        }
    };
    
    const getInterviewSummary = async () => {
        setView('loading');
        setSummaryContent(''); // Clear previous summary before showing modal
        setIsSummaryModalOpen(true);
        
        // CORRECTED: Used backticks (`) for template literal.
        const transcript = interviewHistory.map(item => `${item.role === 'model' ? 'AI' : 'You'}: ${item.parts[0].text}`).join('\n\n');
        
        const payload = {
             // CORRECTED: Used backticks (`) for template literal.
             contents: [{ parts: [{ text: `Based on the following interview transcript for a ${interviewTopic} role, please provide a summary of the candidate's performance. Structure your feedback with a "Strengths" section and an "Areas for Improvement" section. Make the feedback specific to the skills required for a ${interviewTopic}. Use markdown for formatting (bold headings and bullet points).\n\nTranscript:\n${transcript}` }] }]
        };

        try {
            const response = await fetch(`${API_URL}?key=${geminiApiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                 const errorData = await response.json();
                 // CORRECTED: Used backticks (`) for template literal.
                throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
            }
            
            const result = await response.json();
            const summaryText = result.candidates?.[0]?.content?.parts?.[0]?.text || "Could not generate a summary.";

            let htmlSummary = summaryText
                .replace(/\*\*(.*?)\*\*/g, '<h3 class="font-bold text-lg mt-4 mb-2 text-cyan-300">$1</h3>')
                .replace(/\* (.*?)(?:\n|$)/g, '<li class="ml-5 list-disc">$1</li>')
                .replace(/\n/g, '<br />');

            setSummaryContent(htmlSummary);

        } catch (error) {
            console.error("Gemini Summary Error:", error);
            // CORRECTED: Used backticks (`) for template literal to create an HTML string.
            setSummaryContent(`<p class="text-red-400">Sorry, an error occurred while generating the summary: ${error.message}</p>`);
        } finally {
            setView('mic');
        }
    };
    
    // --- Render Logic ---
    const hasAnsweredEnoughForSummary = interviewHistory.filter(i => i.role === 'user').length >= 2;

    return (
        <>
            <style>{componentStyles}</style>
            <div className="bg-slate-900">

                {/* Setup Modal */}
                {isSetupModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
                        <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 space-y-6 w-full max-w-md">
                            <h2 className="text-2xl font-bold text-cyan-400">Interview Setup</h2>
                            <p className="text-slate-400">First, configure your practice session.</p>
                            <div className="space-y-4">
                                <div style={{display: 'none'}}>
                                    <label htmlFor="api-key-input" className="block text-sm font-medium text-slate-300 mb-1">Gemini API Key</label>
                                    <input type="password" id="api-key-input" value={geminiApiKey} onChange={(e) => setGeminiApiKey(e.target.value)} />
                                </div>
                                <div>
                                    <label htmlFor="interview-topic-select" className="block text-sm font-medium text-slate-300 mb-1">Interview For:</label>
                                    <select 
                                        id="interview-topic-select" 
                                        value={interviewTopic}
                                        onChange={(e) => setInterviewTopic(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none" 
                                        // CORRECTED: `url(...)` needs to be inside a string for the style property.
                                        style={{backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%2394a3b8%22%3E%3Cpath%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20/%3E%3C/svg%3E')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em'}}>
                                        <option>General Software Engineer</option>
                                        <option>Frontend Developer</option>
                                        <option>Backend Developer</option>
                                        <option>Full-Stack Developer</option>
                                        <option>Data Analyst</option>
                                        <option>UX/UI Designer</option>
                                    </select>
                                </div>
                            </div>
                            <button onClick={handleSaveSetup} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105">Save and Continue</button>
                        </div>
                    </div>
                )}
                
                {/* Summary Modal */}
                {isSummaryModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
                         <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 space-y-4 w-full max-w-2xl max-h-[90vh] flex flex-col">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-cyan-400">✨ Interview Performance Summary</h2>
                                <button onClick={() => setIsSummaryModalOpen(false)} className="text-slate-400 hover:text-white text-3xl leading-none">&times;</button>
                            </div>
                            <div className="text-slate-300 overflow-y-auto pr-2">
                                {/* CORRECTED: Used conditional rendering. The value of `dangerouslySetInnerHTML` must be a string, not JSX. */}
                                {summaryContent ? (
                                    <div dangerouslySetInnerHTML={{ __html: summaryContent }} />
                                ) : (
                                    <div className="text-center">
                                        <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-purple-400 mx-auto"></div>
                                        <p className="text-center mt-2">Generating your summary...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Main App */}
                <div className="min-h-screen flex items-center justify-center text-white p-4">
                    <div className="w-full max-w-3xl bg-slate-800 rounded-2xl shadow-2xl p-6 md:p-10 space-y-8">
                        {/* Header */}
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-cyan-400">AI Mock Interview</h1>
                            <p className="text-slate-400 mt-2">
                                {/* CORRECTED: Used backticks (`) for template literal in the ternary expression. */}
                                {isSetupModalOpen ? "Practice your interview skills with an AI-powered assistant." : `Practicing for: ${interviewTopic}`}
                            </p>
                        </div>

                        {/* Interview Display */}
                        <div className="bg-slate-900/50 rounded-lg p-6 space-y-6 min-h-[300px] flex flex-col justify-between">
                            <div>
                                <p className="text-slate-400 text-sm font-medium">AI Interviewer:</p>
                                <p className="text-xl text-cyan-300 leading-relaxed">{currentQuestion}</p>
                            </div>
                            {feedback && (
                                <div className="border-t border-slate-700 pt-4">
                                    <p className="text-slate-400 text-sm font-medium">Feedback:</p>
                                    <p className="text-slate-300 italic">{feedback}</p>
                                </div>
                            )}
                        </div>

                        {/* User Response & Controls */}
                        <div className="space-y-4">
                            <div className="min-h-[50px] text-center text-slate-300"><p>{userResponse}</p></div>
                            {micError && <div className="text-center text-red-400 bg-red-900/50 p-3 rounded-lg">{micError}</div>}
                            
                            <div className="flex justify-center items-center h-20 space-x-4">
                                {view === 'start' && (
                                    <div className="text-center">
                                        <button onClick={handleStartInterview} disabled={isSetupModalOpen} className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105">
                                            Start Interview
                                        </button>
                                    </div>
                                )}
                                
                                {view === 'mic' && (
                                    <>
                                        <div className="flex-grow flex justify-center">
                                            <button 
                                                id="mic-btn" 
                                                onClick={handleMicClick}
                                                // CORRECTED: className must be a string. Used backticks (`) for template literal.
                                                className={`relative w-20 h-20 rounded-full transition-all duration-300 flex items-center justify-center shadow-lg ${isListening ? 'bg-red-500 shadow-red-500/50 animate-pulse-red' : 'bg-cyan-500 shadow-cyan-500/50'}`} 
                                                aria-label={isListening ? "Stop Listening" : "Start Listening"}
                                            >
                                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                                            </button>
                                        </div>
                                        {hasAnsweredEnoughForSummary && (
                                             <button onClick={getInterviewSummary} className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105">
                                                 Get Summary ✨
                                             </button>
                                        )}
                                    </>
                                )}

                                {view === 'loading' && (
                                    <div className="text-center">
                                        <div className="w-10 h-10 border-4 border-dashed rounded-full animate-spin border-cyan-400 mx-auto"></div>
                                        <p className="mt-2 text-slate-400">AI is thinking...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MockInterview;