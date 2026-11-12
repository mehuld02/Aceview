import React from "react";
import { Link } from "react-router-dom";
import "../index.css"; 
import logo from '../assets/Logo.png'; 
import TypingQuote from "../TypingQuote"; 

import { FiCode, FiUsers, FiAward } from "react-icons/fi";
import { FaArrowRight } from "react-icons/fa";

const codingQuotes = [
  "Code is like humor. When you have to explain it, it’s bad.",
  "First, solve the problem. Then, write the code.",
  "Talk is cheap. Show me the code.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "The best error message is the one that never appears.",
];

export default function Home() {
  return (
    <div className="fade-in">
      
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden my-19">
        <div className="absolute inset-0 w-full h-full bg-gray-900 animated-gradient z-0"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-20 lg:gap-40">
            
            <div className="flex-shrink-0 md:w-1/3 flex flex-col items-center animate-slide-in-left">
              <img 
                src={logo} 
                alt="PrepMateX Logo" 
                className="w-80 h-80" 
              />
              {/* 3. ADD the TypingQuote component here */}
              <TypingQuote quotes={codingQuotes} />
            </div>

            {/* Right Column: Text and Buttons */}
            <div className="text-center md:text-left md:w-2/3 animate-slide-in-right">
              <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-8 tracking-tight">
                Empower Your <span className="text-indigo-400">Learning Journey</span>
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto md:mx-0">
                Practice, play, collaborate and get interview-ready with AceView. <br />
                The one-stop platform for future tech stars.
              </p>
              <div className="mt-12 flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/practice"
                  className="group bg-indigo-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-indigo-500 transition-transform transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>Start Practicing</span>
                  <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/games"
                  className="group bg-pink-500 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-pink-400 transition-transform transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>Play Games</span>
                  <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="mt-16 mb-20 grid md:grid-cols-3 gap-8 px-6">
        {/* ... (Your feature cards remain unchanged) ... */}
        <div className="feature-card">
          <FiAward className="text-indigo-400 w-10 h-10 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Mock Interviews
          </h3>
          <p className="text-gray-400">
            Simulate real-world interviews with intelligent questions & peer/practice
            sessions.
          </p>
        </div>
        <div className="feature-card">
          <FiUsers className="text-indigo-400 w-10 h-10 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">SkillSwap</h3>
          <p className="text-gray-400">
            Teach what you know, learn what you don’t. Exchange skills with other
            learners.
          </p>
        </div>
        <div className="feature-card">
          <FiCode className="text-indigo-400 w-10 h-10 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Interactive Coding Games
          </h3>
          <p className="text-gray-400">
            Learn by playing. Sharpen your skills while solving fun, real-world coding
            puzzles.
          </p>
        </div>
      </section>
    </div>
  );
}