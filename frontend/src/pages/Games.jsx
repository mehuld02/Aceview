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
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-purple-600 mb-10">🕹️ Fun Games to Sharpen Your Skills</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gamesList.map((game, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="text-5xl mb-4">{game.icon}</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">{game.title}</h2>
              <p className="text-gray-600">{game.description}</p>
              <a
                href={game.link}
                className="mt-4 inline-block bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
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
