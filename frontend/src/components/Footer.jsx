// src/Footer.js
import React from "react";
import { Link } from "react-router-dom";
import logo from '../assets/Logo.png'; // Make sure the path to your logo is correct

// We'll use social media icons from react-icons
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-400 relative pt-1">

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 pt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Column 1: Logo and Brand */}
          <div className="flex flex-col items-center md:items-start">
            <img src={logo} alt="PrepMateX Logo" className="w-20 h-20 mb-4" />
            <h3 className="text-white text-xl font-bold">PrepMateX</h3>
            <p className="text-center md:text-left mt-2">
              The one-stop platform for future tech stars.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="text-white font-semibold text-lg mb-4">Quick Links</h4>
            <ul>
              <li className="mb-2">
                <Link to="/practice" className="hover:text-indigo-400 transition-colors">Practice</Link>
              </li>
              <li className="mb-2">
                <Link to="/games" className="hover:text-indigo-400 transition-colors">Play Games</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-indigo-400 transition-colors">About Us</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Social Media */}
          <div className="text-center md:text-left">
            <h4 className="text-white font-semibold text-lg mb-4">Follow Us</h4>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-transform transform hover:scale-110">
                <FaGithub size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-transform transform hover:scale-110">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-transform transform hover:scale-110">
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-center">
          <p>© {new Date().getFullYear()} PrepMateX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;