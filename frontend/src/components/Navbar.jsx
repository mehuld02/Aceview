import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between">
      <h1 className="text-xl font-bold">PrepMateX</h1>
      <div className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/practice">Practice</Link>
        <Link to="/games">Games</Link>
        <Link to="/skillswap">SkillSwap</Link>
        <Link to="/mock-interview">Mock Interview</Link>
        <Link to="/profile">Profile</Link>
          <Link to="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;