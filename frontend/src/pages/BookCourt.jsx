import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';
import Navbar from '../components/NavBar';
import api from '../api';

export default function BookCourt() {
  const { sport } = useParams();
  const [courts, setCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [players, setPlayers] = useState(1);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const sportInfo = {
    badminton: {
      name: 'Badminton',
      icon: '🏸',
      description: 'Indoor synthetic courts with professional lighting and equipment',
      maxPlayers: 4,
      duration: '1 hour'
    },
    cricket: {
      name: 'Cricket',
      icon: '🏏',
      description: 'Outdoor turf pitches with professional equipment and changing rooms',
      maxPlayers: 22,
      duration: '3 hours'
    },
    tennis: {
      name: 'Tennis',
      icon: '🎾',
      description: 'Hard courts with floodlights for evening play',
      maxPlayers: 4,
      duration: '1 hour'
    },
    football: {
      name: 'Football',
      icon: '⚽',
      description: 'Full-size grass pitches with changing rooms and equipment',
      maxPlayers: 22,
      duration: '2 hours'
    }
  };

  const currentSport = sportInfo[sport] || sportInfo.badminton;

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const response = await api.get('/courts');
        const filteredCourts = response.data.filter(
          court => court.sport.toLowerCase() === sport.toLowerCase()
        );
        setCourts(filteredCourts);
      } catch (error) {
        console.error('Error fetching courts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourts();
  }, [sport]);

  const handleCourtSelect = (court) => {
    setSelectedCourt(court);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleBooking = () => {
    if (!selectedSlot) return;
    
    // Navigate to payment page with booking details
    navigate('/payment', {
      state: {
        court: selectedCourt,
        slot: selectedSlot,
        players,
        sport: currentSport
      }
    });
  };

  const getAvailableSlots = (court) => {
    return court.slots.filter(slot => !slot.isBooked);
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <span className="text-4xl mr-4">{currentSport.icon}</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Book {currentSport.name} Court
              </h1>
              <p className="text-gray-600">{currentSport.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <span>🕰️ Duration: {currentSport.duration}</span>
            <span>👥 Max Players: {currentSport.maxPlayers}</span>
          </div>
        </div>

        {courts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😟</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No {currentSport.name} Courts Available
            </h2>
            <p className="text-gray-600 mb-4">
              Sorry, we don't have any {currentSport.name.toLowerCase()} courts available at the moment.
            </p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Court Selection */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold mb-4">Select a Court</h2>
              <div className="grid gap-4">
                {courts.map((court) => {
                  const availableSlots = getAvailableSlots(court);
                  return (
                    <div
                      key={court.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                        selectedCourt?.id === court.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleCourtSelect(court)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg">{court.name}</h3>
                          <p className="text-gray-600 text-sm">{court.description}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            📍 {court.location.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-indigo-600">
                            ₹{court.price}
                          </p>
                          <p className="text-sm text-gray-500">per {currentSport.duration}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {availableSlots.length} slots available
                        </span>
                        {selectedCourt?.id === court.id && (
                          <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded">
                            Selected
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Time Slot Selection */}
              {selectedCourt && (
                <div className="mt-8">
                  <h2 className="text-xl font-bold mb-4">Select Time Slot</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {getAvailableSlots(selectedCourt).map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => handleSlotSelect(slot)}
                        className={`p-3 border-2 rounded-lg text-sm transition ${
                          selectedSlot?.id === slot.id
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium">{formatDate(slot.start)}</div>
                        <div className="text-xs text-gray-600">
                          {formatTime(slot.start)} - {formatTime(slot.end)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
                
                {selectedCourt ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Players
                      </label>
                      <select
                        value={players}
                        onChange={(e) => setPlayers(parseInt(e.target.value))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        {Array.from({ length: currentSport.maxPlayers }, (_, i) => i + 1).map(num => (
                          <option key={num} value={num}>{num} Player{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between mb-2">
                        <span>Court:</span>
                        <span className="font-medium">{selectedCourt.name}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Location:</span>
                        <span className="text-sm">{selectedCourt.location.name}</span>
                      </div>
                      {selectedSlot && (
                        <>
                          <div className="flex justify-between mb-2">
                            <span>Date:</span>
                            <span>{formatDate(selectedSlot.start)}</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span>Time:</span>
                            <span>{formatTime(selectedSlot.start)} - {formatTime(selectedSlot.end)}</span>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between mb-2">
                        <span>Players:</span>
                        <span>{players}</span>
                      </div>
                      <div className="border-t pt-2 mt-4">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total:</span>
                          <span className="text-indigo-600">₹{selectedCourt.price}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleBooking}
                      disabled={!selectedSlot}
                      className="w-full bg-indigo-600 text-white py-3 rounded-md font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                    >
                      {selectedSlot ? 'Proceed to Payment' : 'Select a Time Slot'}
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Select a court to see booking details
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
