import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';
import Navbar from '../components/NavBar';
import api from '../api';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const bookingDetails = location.state;

  if (!bookingDetails) {
    navigate('/dashboard');
    return null;
  }

  const { court, slot, players, sport } = bookingDetails;

  const handlePayment = async () => {
    setProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create booking
      await api.post('/bookings', {
        userId: user.id,
        slotId: slot.id
      });

      // Show success and redirect
      alert('🎉 Booking confirmed! Check your dashboard for details.');
      navigate('/dashboard');
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setProcessing(false);
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Booking
          </h1>
          <p className="text-gray-600">
            Review your booking details and complete the payment
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Booking Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="mr-2">{sport.icon}</span>
              Booking Details
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Sport:</span>
                <span className="font-medium">{sport.name}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Court:</span>
                <span className="font-medium">{court.name}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{court.location.name}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{formatDate(slot.start)}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">
                  {formatTime(slot.start)} - {formatTime(slot.end)}
                </span>
              </div>
              
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{sport.duration}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Players:</span>
                <span className="font-medium">{players}</span>
              </div>
              
              <div className="flex justify-between py-3 text-lg font-bold border-t">
                <span>Total Amount:</span>
                <span className="text-indigo-600">₹{court.price}</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
            
            <div className="space-y-4">
              {/* Payment Method Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose Payment Method
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2"
                    />
                    <span>💳 Credit/Debit Card</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2"
                    />
                    <span>📱 UPI</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="wallet"
                      checked={paymentMethod === 'wallet'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2"
                    />
                    <span>👛 Digital Wallet</span>
                  </label>
                </div>
              </div>

              {/* Card Details (if card selected) */}
              {paymentMethod === 'card' && (
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
              )}

              {/* UPI Details */}
              {paymentMethod === 'upi' && (
                <div className="pt-4 border-t">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              )}

              {/* Wallet Selection */}
              {paymentMethod === 'wallet' && (
                <div className="pt-4 border-t">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Wallet
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="border border-gray-300 rounded-md p-3 hover:border-indigo-500">
                      Paytm
                    </button>
                    <button className="border border-gray-300 rounded-md p-3 hover:border-indigo-500">
                      PhonePe
                    </button>
                    <button className="border border-gray-300 rounded-md p-3 hover:border-indigo-500">
                      Google Pay
                    </button>
                    <button className="border border-gray-300 rounded-md p-3 hover:border-indigo-500">
                      Amazon Pay
                    </button>
                  </div>
                </div>
              )}

              {/* Security Notice */}
              <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-6">
                <div className="flex items-center">
                  <span className="text-green-600 mr-2">🔒</span>
                  <span className="text-sm text-green-800">
                    Your payment information is secure and encrypted
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6">
                <button
                  onClick={() => navigate(-1)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-md font-medium hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-md font-medium hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    `Pay ₹${court.price}`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}