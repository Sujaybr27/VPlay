import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            VPlay
          </Link>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md"
                >
                  Dashboard
                </Link>
                {user.isAdmin && (
                  <>
                    <Link 
                      to="/admin" 
                      className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md"
                    >
                      Admin
                    </Link>
                    <Link 
                      to="/location-owner" 
                      className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md"
                    >
                      Manage Courts
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}