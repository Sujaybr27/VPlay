import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/NavBar';
import { AuthContext } from '../contexts/AuthContext.jsx';
import api from '../api';

export default function LocationOwner() {
  const { user } = useContext(AuthContext);
  const [locations, setLocations] = useState([]);
  const [courts, setCourts] = useState([]);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [showAddCourt, setShowAddCourt] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  const [locationForm, setLocationForm] = useState({
    name: '',
    address: '',
    ownerId: user?.id || 1
  });

  const [courtForm, setCourtForm] = useState({
    name: '',
    sport: 'Badminton',
    description: '',
    maxPlayers: 4,
    price: 300,
    locationId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const locationsRes = await api.get('/locations/my-locations');
      setLocations(locationsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = async (e) => {
    e.preventDefault();
    try {
      await api.post('/locations', locationForm);
      setLocationForm({ name: '', address: '', ownerId: 1 });
      setShowAddLocation(false);
      fetchData();
      alert('Location added successfully!');
    } catch (error) {
      console.error('Error adding location:', error);
      alert('Failed to add location');
    }
  };

  const handleAddCourt = async (e) => {
    e.preventDefault();
    try {
      await api.post('/courts', courtForm);
      setCourtForm({
        name: '',
        sport: 'Badminton',
        description: '',
        maxPlayers: 4,
        price: 300,
        locationId: ''
      });
      setShowAddCourt(false);
      fetchData();
      alert('Court added successfully!');
    } catch (error) {
      console.error('Error adding court:', error);
      alert('Failed to add court');
    }
  };

  const generateSlots = async (courtId) => {
    try {
      await api.post(`/slots/generate/${courtId}`);
      fetchData();
      alert('Slots generated successfully!');
    } catch (error) {
      console.error('Error generating slots:', error);
      alert('Failed to generate slots');
    }
  };

  const sportOptions = [
    { value: 'Badminton', maxPlayers: 4, defaultPrice: 300 },
    { value: 'Cricket', maxPlayers: 22, defaultPrice: 1200 },
    { value: 'Tennis', maxPlayers: 4, defaultPrice: 400 },
    { value: 'Football', maxPlayers: 22, defaultPrice: 800 }
  ];

  const handleSportChange = (sport) => {
    const sportData = sportOptions.find(s => s.value === sport);
    setCourtForm({
      ...courtForm,
      sport,
      maxPlayers: sportData.maxPlayers,
      price: sportData.defaultPrice
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
            Location Management
          </h1>
          <p className="text-gray-600">
            Manage your sports facilities and courts
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setShowAddLocation(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            + Add Location
          </button>
          <button
            onClick={() => setShowAddCourt(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            + Add Court
          </button>
        </div>

        {/* Add Location Modal */}
        {showAddLocation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add New Location</h2>
              <form onSubmit={handleAddLocation}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location Name
                    </label>
                    <input
                      type="text"
                      value={locationForm.name}
                      onChange={(e) => setLocationForm({...locationForm, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      value={locationForm.address}
                      onChange={(e) => setLocationForm({...locationForm, address: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      rows="3"
                      required
                    />
                  </div>
                </div>
                <div className="flex space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddLocation(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
                  >
                    Add Location
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Court Modal */}
        {showAddCourt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add New Court</h2>
              <form onSubmit={handleAddCourt}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <select
                      value={courtForm.locationId}
                      onChange={(e) => setCourtForm({...courtForm, locationId: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    >
                      <option value="">Select Location</option>
                      {locations.map(location => (
                        <option key={location.id} value={location.id}>
                          {location.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Court Name
                    </label>
                    <input
                      type="text"
                      value={courtForm.name}
                      onChange={(e) => setCourtForm({...courtForm, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sport
                    </label>
                    <select
                      value={courtForm.sport}
                      onChange={(e) => handleSportChange(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      {sportOptions.map(sport => (
                        <option key={sport.value} value={sport.value}>
                          {sport.value}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={courtForm.description}
                      onChange={(e) => setCourtForm({...courtForm, description: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      rows="2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Players
                      </label>
                      <input
                        type="number"
                        value={courtForm.maxPlayers}
                        onChange={(e) => setCourtForm({...courtForm, maxPlayers: parseInt(e.target.value)})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        min="1"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        value={courtForm.price}
                        onChange={(e) => setCourtForm({...courtForm, price: parseFloat(e.target.value)})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        min="0"
                        step="50"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddCourt(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
                  >
                    Add Court
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Locations List */}
        <div className="grid gap-6">
          {locations.map((location) => (
            <div key={location.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">{location.name}</h2>
                  <p className="text-gray-600">{location.address}</p>
                </div>
                <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                  Active
                </span>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {location.courts.map((court) => (
                  <div key={court.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{court.name}</h3>
                        <p className="text-sm text-gray-600">{court.sport}</p>
                      </div>
                      <span className="text-lg font-bold text-indigo-600">
                        ₹{court.price}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-3">{court.description}</p>
                    
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                      <span>Max: {court.maxPlayers} players</span>
                      <span>{court.slots?.length || 0} slots</span>
                    </div>
                    
                    <button
                      onClick={() => generateSlots(court.id)}
                      className="w-full bg-blue-600 text-white py-2 rounded-md text-sm hover:bg-blue-700"
                    >
                      Generate Slots
                    </button>
                  </div>
                ))}
              </div>

              {location.courts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No courts added yet</p>
                  <button
                    onClick={() => setShowAddCourt(true)}
                    className="mt-2 text-indigo-600 hover:text-indigo-800"
                  >
                    Add your first court
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {locations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏢</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Locations Yet
            </h2>
            <p className="text-gray-600 mb-4">
              Start by adding your first sports facility location
            </p>
            <button
              onClick={() => setShowAddLocation(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
            >
              Add Your First Location
            </button>
          </div>
        )}
      </div>
    </div>
  );
}