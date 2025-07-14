import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';
import Navbar from '../components/NavBar';
import api from '../api';

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, locationsRes] = await Promise.all([
          api.get(`/bookings/user/${user.id}`),
          api.get('/locations')
        ]);
        setBookings(bookingsRes.data);
        setLocations(locationsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const sports = [
    { name: 'Badminton', icon: '🏸', color: 'bg-blue-500' },
    { name: 'Cricket', icon: '🏏', color: 'bg-green-500' },
    { name: 'Tennis', icon: '🎾', color: 'bg-yellow-500' },
    { name: 'Football', icon: '⚽', color: 'bg-red-500' }
  ];

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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back! 🚀
          </h1>
          <p className="text-gray-600">
            Ready to book your next game? Choose a sport below or check your upcoming bookings.
          </p>
        </div>

        {/* Quick Book Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Quick Book</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sports.map((sport) => (
              <Link
                key={sport.name}
                to={`/book/${sport.name.toLowerCase()}`}
                className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition"
              >
                <div className={`w-12 h-12 ${sport.color} rounded-full flex items-center justify-center text-white text-xl mb-2`}>
                  {sport.icon}
                </div>
                <span className="font-medium">{sport.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* My Bookings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">My Bookings</h2>
            {bookings.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🏸</div>
                <p className="text-gray-500 mb-4">No bookings yet</p>
                <Link 
                  to="/book/badminton"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Make Your First Booking
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="border-l-4 border-indigo-500 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{booking.slot.court.name}</h3>
                        <p className="text-sm text-gray-600">
                          {booking.slot.court.sport} • {booking.slot.court.location.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(booking.slot.start).toLocaleDateString()} at {' '}
                          {new Date(booking.slot.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Confirmed
                      </span>
                    </div>
                  </div>
                ))}
                {bookings.length > 5 && (
                  <p className="text-sm text-gray-500 text-center">
                    And {bookings.length - 5} more bookings...
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Available Locations */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Available Locations</h2>
            <div className="space-y-4">
              {locations.map((location) => (
                <div key={location.id} className="border rounded-lg p-4">
                  <h3 className="font-medium mb-1">{location.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{location.address}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {location.courts.length} courts available
                    </span>
                    <div className="flex space-x-2">
                      {[...new Set(location.courts.map(c => c.sport))].map(sport => (
                        <span key={sport} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                          {sport}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
