import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth to access the context
import Logo from '../assets/Logo.png';

function Navbar() {
  // Get the current user from the global AuthContext
  const { user } = useAuth(); 
  const navigate = useNavigate();

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center shadow-md">
      <img src={Logo} alt="logo" className="w-16 h-16" />
      <div className="space-x-4 flex items-center">
        <Link to="/" className="hover:text-cyan-300 transition">
          Home
        </Link>
        <Link to="/practice" className="hover:text-cyan-300 transition">
          Practice
        </Link>
        <Link to="/games" className="hover:text-cyan-300 transition">
          Games
        </Link>
        <Link
          to="https://aceview-mentorshiplive.netlify.app/"
          className="hover:text-cyan-300 transition"
        >
          SkillSwap
        </Link>
        <Link to="/mock-interview" className="hover:text-cyan-300 transition">
          Mock Interview
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {/* Conditionally render Login button or user info */}
        {!user ? (
          <Link
            to="/login"
            className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-500 transition"
          >
            Login
          </Link>
        ) : (
          <>
            <img
              src={
                user.photoURL ||
                `https://ui-avatars.com/api/?name=${user.displayName || user.email}&background=0D8ABC&color=fff`
              }
              alt="User Avatar"
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-cyan-400"
              onClick={() => navigate("/profile")}
              title="Go to Profile"
            />
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

