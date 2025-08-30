import React from 'react';

const topics = [
  {
    title: 'Data Structures',
    description: 'Master arrays, linked lists, stacks, queues, and more.',
    icon: '📚',
    link: '/practice/data-structures',
  },
  {
    title: 'Algorithms',
    description: 'Practice sorting, searching, recursion, and dynamic programming.',
    icon: '⚙️',
    link: '/practice/algorithms',
  },
  {
    title: 'System Design',
    description: 'Learn how to design scalable systems like real-world apps.',
    icon: '🖥️',
    link: '/practice/system-design',
  },
  {
    title: 'Database Queries',
    description: 'Solve SQL challenges and practice database operations.',
    icon: '🗄️',
    link: '/practice/databases',
  },
  {
    title: 'Frontend Challenges',
    description: 'Improve HTML, CSS, and JavaScript skills with real tasks.',
    icon: '🎨',
    link: '/practice/frontend',
  },
];

const Practice = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-10">
          🚀 Practice Your Skills
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className="text-5xl mb-4">{topic.icon}</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {topic.title}
              </h2>
              <p className="text-gray-600">{topic.description}</p>
              <a
                href={topic.link}
                className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Start Practicing
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Practice;
