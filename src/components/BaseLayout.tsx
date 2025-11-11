import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const BaseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };



  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Professional Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 w-full">
            {/* Logo */}
            <div className="flex items-center mr-8">
              <Link to="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                ModuWeb
              </Link>
            </div>

            {/* Main Navigation - Centered */}
            <nav className="hidden md:flex items-center space-x-4 flex-1 justify-center">
              {!user && (
                <Link to="/login" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  Login
                </Link>
              )}
              {user && (
                <>
                  <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                    Homepage
                  </Link>
                  <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                    Dashboard
                  </Link>
                  <Link to="/dashboard/bookings" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                    Bookings
                  </Link>
                </>
              )}
              <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                About
              </Link>
            </nav>

            {/* User Menu - Right aligned */}
            <div className="flex items-center space-x-4 flex-shrink-0 ml-8">
              {user && (
                <>
                  <span className="text-gray-600 font-medium">Welcome, {user.userName}</span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-red-600 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Professional Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-center">
            <Link to="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BaseLayout;