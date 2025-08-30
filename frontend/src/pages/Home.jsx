import React from "react";
import { Link } from "react-router-dom";
import '../index.css'

export default function Home() {
  return (
    <>

      <section className="text-center mt-20">
        <h2 className="text-5xl font-extrabold text-indigo-800 mb-6">Empower Your Coding Journey</h2>
        <p className="text-lg text-gray-700 max-w-xl mx-auto">
          Practice, play, collaborate and get interview-ready with PrepMateX. The one-stop platform for future tech stars.
        </p>
        <div className="mt-10 flex justify-center space-x-4">
          <Link to="/practice" className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-indigo-500 transition">Start Practicing</Link>
          <Link to="/games" className="bg-pink-500 text-white px-6 py-3 rounded-xl text-lg hover:bg-pink-400 transition">Play Games</Link>
        </div>
      </section>

      <section className="mt-24 grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-indigo-700 mb-2">Mock Interviews</h3>
          <p className="text-gray-600">Simulate real-world interviews with intelligent questions & peer/practice sessions.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-indigo-700 mb-2">SkillSwap</h3>
          <p className="text-gray-600">Teach what you know, learn what you don’t. Exchange skills with other learners.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-indigo-700 mb-2">Interactive Coding Games</h3>
          <p className="text-gray-600">Learn by playing. Sharpen your skills while solving fun, real-world coding puzzles.</p>
        </div>
      </section>

      <footer className="text-center text-gray-500 mt-20 py-6">
        © {new Date().getFullYear()} PrepMateX. All rights reserved.
      </footer>

    </>
  );
}
