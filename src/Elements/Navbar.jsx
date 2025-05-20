import React, { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="navbar bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 shadow-lg px-6 py-3">
      <div className="flex-1 flex items-center space-x-3">
        {/* Logo and Title */}
        <a href="/" className="flex items-center space-x-3 hover:scale-110 transition-transform duration-300">
          <img
            src="/logo.svg"
            alt="WebRTC Logo"
            className="w-10 h-10 rounded-full border-2 border-white shadow-md"
          />
          <span className="text-white font-extrabold text-2xl tracking-wide drop-shadow-lg">
            WebRTC
          </span>
        </a>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-4 items-center">
        <button
          className="btn btn-outline btn-sm text-white border-white hover:bg-white hover:text-purple-600 transition-all duration-300 shadow-md"
          onClick={() => alert('Connecting...')}
        >
          Connect
        </button>
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center">
        <button
          className="btn btn-square btn-ghost text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 right-6 bg-purple-700 rounded-lg shadow-lg py-3 px-5 flex flex-col space-y-3 md:hidden z-50">
          <button
            className="btn btn-outline btn-sm text-white border-white hover:bg-white hover:text-purple-600 transition-all duration-300"
            onClick={() => alert('Connecting...')}
          >
            Connect
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
