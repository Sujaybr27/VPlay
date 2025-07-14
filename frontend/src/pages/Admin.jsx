import React, { useEffect, useState } from 'react';
import Navbar from '../components/NavBar';
import api from '../api';

export default function Admin() {
  const [locations, setLocations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeLocations: 0,
    totalCourts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locationsRes, bookingsRes] = await Promise.all([
          api.get('/locations'),
          api.get('/bookings')
        ]);
        
        setLocations(locationsRes.data);
        setBookings(bookingsRes.data);
        
        // Calculate stats
        const totalCourts = locationsRes.data.reduce((sum, loc) => sum + loc.courts.length, 0);
        const totalRevenue = bookingsRes.data.reduce((sum, booking) => {
          return sum + (booking.slot?.court?.price || 0);
        }, 0);
        
        setStats({
          totalBookings: bookingsRes.data.length,
          totalRevenue,
          activeLocations: locationsRes.data.length,
          totalCourts
        });
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage locations, courts, and monitor platform activity
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                📊
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                💰
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                📍
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Locations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeLocations}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                🏟️
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Courts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourts}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Locations Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Registered Locations</h2>
            <div className="space-y-4">
              {locations.map((location) => (
                <div key={location.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold">{location.name}</h3>
                      <p className="text-sm text-gray-600">{location.address}</p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Active
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-gray-500">
                      {location.courts.length} courts
                    </span>
                    <div className="flex space-x-2">
                      {[...new Set(location.courts.map(c => c.sport))].map(sport => (
                        <span key={sport} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                          {sport}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Courts:</span>
                        <div className="mt-1">
                          {location.courts.map(court => (
                            <div key={court.id} className="text-xs text-gray-500">
                              {court.name} - ₹{court.price}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
            <div className="space-y-4">
              {bookings.slice(0, 10).map((booking) => (
                <div key={booking.id} className="border-l-4 border-indigo-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{booking.slot?.court?.name}</h3>
                      <p className="text-sm text-gray-600">
                        {booking.slot?.court?.sport} • {booking.slot?.court?.location?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(booking.slot?.start)} at {formatTime(booking.slot?.start)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-indigo-600">
                        ₹{booking.slot?.court?.price}
                      </p>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Confirmed
                      </span>
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
