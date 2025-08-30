import React from 'react';

const interviewTopics = [
  {
    title: 'Frontend Developer',
    description: 'HTML, CSS, JavaScript, React-based questions.',
    icon: '🎨',
  },
  {
    title: 'Backend Developer',
    description: 'Node.js, Express, MongoDB, API design & architecture.',
    icon: '🔧',
  },
  {
    title: 'Data Structures & Algorithms',
    description: 'Coding questions to test logic and problem-solving.',
    icon: '📊',
  },
  {
    title: 'System Design',
    description: 'Design scalable systems with real-world problems.',
    icon: '🧠',
  },
  {
    title: 'HR Round',
    description: 'Behavioral and situational interview questions.',
    icon: '🗣️',
  },
];

const MockInterview = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-5 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-600 mb-10">
          🎤 Mock Interview Practice
        </h1>

        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Choose an interview type and prepare like a pro! These mock interviews are designed to help you gain confidence and test your skills in real-world interview scenarios.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviewTopics.map((topic, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className="text-5xl mb-4">{topic.icon}</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {topic.title}
              </h2>
              <p className="text-gray-600">{topic.description}</p>
              <button
                className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
              >
                Start Interview
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MockInterview;
