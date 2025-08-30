import React, { useState } from 'react';

const BugHunt = () => {
  const [code, setCode] = useState(`function add(a, b) {
  return a - b; // Bug: should be a + b
}`);

  const [fixed, setFixed] = useState(false);

  const handleFix = () => {
    if (code.includes('a + b')) setFixed(true);
    else alert('Bug still exists!');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Find and Fix the Bug 🐞</h2>
      <textarea
        className="w-full h-40 p-2 border rounded font-mono"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        onClick={handleFix}
      >
        Submit Fix
      </button>
      {fixed && <p className="mt-4 text-green-600 font-semibold">✅ Bug fixed! Great job.</p>}
    </div>
  );
};

export default BugHunt;
