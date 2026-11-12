import React from 'react';

const gamesList = [
  {
    title: 'Code Quiz',
    description: 'Test your programming knowledge with timed quizzes.',
    icon: '🧠',
    link: '/games/code-quiz',
  },
  {
    title: 'Memory Match',
    description: 'Improve memory by matching programming terms.',
    icon: '🧩',
    link: '/games/memory-match',
  },
  {
    title: 'Bug Hunt',
    description: 'Find and fix bugs in snippets of code.',
    icon: '🔍',
    link: '/games/bug-hunt',
  },
];

const Games = () => {
  return (
    <div className="min-h-screen bg-gray-900 py-10 px-5">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-teal-400 mb-10">
          🕹️ Fun Games to Sharpen Your Skills
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gamesList.map((game, idx) => (
            <div
              key={idx}
              className="bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="text-5xl mb-4">{game.icon}</div>
              <h2 className="text-2xl font-semibold text-gray-300 mb-2">
                {game.title}
              </h2>
              <p className="text-gray-400">{game.description}</p>
              <a
                href={game.link}
                className="mt-4 inline-block bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-400 transition"
              >
                Play Now
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Games;
