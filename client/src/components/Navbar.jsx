import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Theme toggle removed

  return (
  <nav className="bg-navbar-bg text-navbar-text">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold flex items-center">
            <span className="animate-pulse">🌱</span>
            <span className="ml-2 text-navbar-text dark:text-navbar-text-dark">Greenlands</span>
           {/* ...existing code... */}
          </Link>
          
          {/* Hamburger menu for mobile */}
          <button 
            className="md:hidden text-navbar-text focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-green-600 transition duration-300 ease-in-out transform hover:scale-105 text-navbar-text">Home</Link>
            <Link to="/marketplace" className="hover:text-green-600 transition duration-300 ease-in-out transform hover:scale-105 text-navbar-text">Marketplace</Link>
            <Link to="/contact" className="hover:text-green-600 transition duration-300 ease-in-out transform hover:scale-105 text-navbar-text">Contact Us</Link>
            {user ? (
              <>
                <span className="hidden md:inline text-navbar-text">Welcome, {user.name}</span>
                <Link 
                  to="/dashboard" 
                  className="hover:text-green-600 transition duration-300 ease-in-out transform hover:scale-105 text-navbar-text"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 text-white"
                >
                  Logout
                </button>
              </>
            ) : null}
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="hover:text-green-600 transition duration-300 ease-in-out font-medium text-lg text-navbar-text" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/marketplace" className="hover:text-green-600 transition duration-300 ease-in-out font-medium text-lg text-navbar-text" onClick={() => setIsMenuOpen(false)}>Marketplace</Link>
              <Link to="/contact" className="hover:text-green-600 transition duration-300 ease-in-out font-medium text-lg text-navbar-text" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
              {user && (
                <>
                  <span className="font-medium text-lg text-navbar-text">Welcome, {user.name}</span>
                  <Link
                    to="/dashboard"
                    className="hover:text-green-600 transition duration-300 ease-in-out font-medium text-lg text-navbar-text"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition duration-300 ease-in-out w-full font-medium text-lg text-white"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;