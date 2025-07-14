import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';
import Navbar from '../components/NavBar';

export default function Hero() {
  const { user } = useContext(AuthContext);

  const sports = [
    {
      name: 'Badminton',
      description: 'Indoor synthetic courts with professional lighting',
      image: '🏸',
      courts: 8,
      maxPlayers: 4
    },
    {
      name: 'Cricket',
      description: 'Outdoor turf pitches with professional equipment',
      image: '🏏',
      courts: 3,
      maxPlayers: 22
    },
    {
      name: 'Tennis',
      description: 'Hard courts with floodlights for evening play',
      image: '🎾',
      courts: 6,
      maxPlayers: 4
    },
    {
      name: 'Football',
      description: 'Full-size grass pitches with changing rooms',
      image: '⚽',
      courts: 2,
      maxPlayers: 22
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Book Your Perfect Court
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              India's smartest court booking platform. Find, book, and play at premium sports facilities near you.
            </p>
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/login" 
                  className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition"
                >
                  Get Started
                </Link>
                <Link 
                  to="/admin" 
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-indigo-600 transition"
                >
                  Admin Portal
                </Link>
              </div>
            ) : (
              <Link 
                to="/dashboard" 
                className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition inline-block"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose VPlay?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of sports facility booking with our cutting-edge platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Instant Booking</h3>
              <p className="text-gray-600">Book courts in seconds with real-time availability</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
              <p className="text-gray-600">Safe and secure online payment processing</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold mb-2">Mobile Friendly</h3>
              <p className="text-gray-600">Book on-the-go with our responsive design</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sports Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Available Sports
            </h2>
            <p className="text-xl text-gray-600">
              Choose from our wide range of premium sports facilities
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sports.map((sport) => (
              <div key={sport.name} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition">
                <div className="text-4xl mb-4 text-center">{sport.image}</div>
                <h3 className="text-xl font-bold mb-2 text-center">{sport.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{sport.description}</p>
                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <span>{sport.courts} Courts</span>
                  <span>Max {sport.maxPlayers} Players</span>
                </div>
                {user ? (
                  <Link 
                    to={`/book/${sport.name.toLowerCase()}`}
                    className="block w-full bg-indigo-600 text-white text-center py-2 rounded-md hover:bg-indigo-700 transition"
                  >
                    Book Now
                  </Link>
                ) : (
                  <Link 
                    to="/login"
                    className="block w-full bg-gray-300 text-gray-600 text-center py-2 rounded-md"
                  >
                    Login to Book
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">VPlay</h3>
          <p className="text-gray-400 mb-4">
            Making sports accessible to everyone, everywhere.
          </p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-white">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white">Terms</a>
            <a href="#" className="text-gray-400 hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
