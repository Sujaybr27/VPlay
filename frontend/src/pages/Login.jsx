import React, { useState, useContext } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';
import api from '../api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '', name: '', isLocationOwner: false, locationName: '', locationAddress: '', courts: [] });
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/google', {
        token: credentialResponse.credential
      });
      login(response.data.token);
      // Small delay to ensure context is updated
      setTimeout(() => {
        if (response.data.user?.isAdmin) {
          navigate('/location-owner');
        } else {
          navigate('/dashboard');
        }
      }, 100);
    } catch (error) {
      console.error('Google login failed:', error);
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await api.post(endpoint, form);
      
      if (isLogin) {
        login(response.data.token, response.data.user);
        // Small delay to ensure context is updated
        setTimeout(() => {
          if (response.data.user?.isAdmin) {
            navigate('/location-owner');
          } else {
            navigate('/dashboard');
          }
        }, 100);
      } else {
        alert('Registration successful! Please login.');
        setIsLogin(true);
        setForm({ email: '', password: '' });
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addCourt = () => {
    setForm({
      ...form,
      courts: [...form.courts, { name: '', sport: 'Badminton', description: '', maxPlayers: 4, price: 300 }]
    });
  };

  const updateCourt = (index, field, value) => {
    const updatedCourts = form.courts.map((court, i) => 
      i === index ? { ...court, [field]: value } : court
    );
    setForm({ ...form, courts: updatedCourts });
  };

  const removeCourt = (index) => {
    setForm({ ...form, courts: form.courts.filter((_, i) => i !== index) });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center">
          <h2 className="text-3xl font-bold text-indigo-600">VPlay</h2>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? 'Sign in to your account' : 'Create your account'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Google Login */}
          <div className="mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
              <p className="text-sm text-yellow-800">
                ⚠️ Google OAuth is not configured. Please set up Google OAuth credentials to enable Google login.
              </p>
            </div>
            {/* Temporarily disable Google Login until properly configured */}
            {/* <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.log('Login Failed')}
              size="large"
              width="100%"
            /> */}
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {!isLogin && (
              <>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isLocationOwner"
                    checked={form.isLocationOwner}
                    onChange={(e) => setForm({...form, isLocationOwner: e.target.checked})}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">
                    I want to register as a Location Owner
                  </label>
                </div>

                {form.isLocationOwner && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Location Name
                      </label>
                      <input
                        type="text"
                        name="locationName"
                        value={form.locationName}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Location Address
                      </label>
                      <textarea
                        name="locationAddress"
                        value={form.locationAddress}
                        onChange={handleChange}
                        required
                        rows="2"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Courts (Optional)
                        </label>
                        <button
                          type="button"
                          onClick={addCourt}
                          className="text-sm bg-indigo-600 text-white px-2 py-1 rounded"
                        >
                          + Add Court
                        </button>
                      </div>
                      
                      {form.courts.map((court, index) => (
                        <div key={index} className="border p-3 rounded mb-2">
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <input
                              type="text"
                              placeholder="Court Name"
                              value={court.name}
                              onChange={(e) => updateCourt(index, 'name', e.target.value)}
                              className="px-2 py-1 border rounded text-sm"
                            />
                            <select
                              value={court.sport}
                              onChange={(e) => updateCourt(index, 'sport', e.target.value)}
                              className="px-2 py-1 border rounded text-sm"
                            >
                              <option value="Badminton">Badminton</option>
                              <option value="Cricket">Cricket</option>
                              <option value="Tennis">Tennis</option>
                              <option value="Football">Football</option>
                            </select>
                          </div>
                          <div className="grid grid-cols-3 gap-2 mb-2">
                            <input
                              type="number"
                              placeholder="Max Players"
                              value={court.maxPlayers}
                              onChange={(e) => updateCourt(index, 'maxPlayers', parseInt(e.target.value))}
                              className="px-2 py-1 border rounded text-sm"
                            />
                            <input
                              type="number"
                              placeholder="Price"
                              value={court.price}
                              onChange={(e) => updateCourt(index, 'price', parseFloat(e.target.value))}
                              className="px-2 py-1 border rounded text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => removeCourt(index)}
                              className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                            >
                              Remove
                            </button>
                          </div>
                          <input
                            type="text"
                            placeholder="Description"
                            value={court.description}
                            onChange={(e) => updateCourt(index, 'description', e.target.value)}
                            className="w-full px-2 py-1 border rounded text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign in' : 'Sign up')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-600 hover:text-indigo-500"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
          
          {/* Demo Login */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800 mb-2">Demo Login:</p>
            <p className="text-xs text-blue-600">Email: test@vplay.com</p>
            <p className="text-xs text-blue-600">Password: password</p>
          </div>
        </div>
      </div>
    </div>
  );
}
