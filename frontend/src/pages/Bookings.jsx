import React, { useState, useEffect } from 'react';
import api from '../api';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [courts, setCourts] = useState([]);
  const [form, setForm] = useState({ courtId: '', date: '' });

  useEffect(() => {
    api.get('/bookings').then(r => setBookings(r.data));
    api.get('/courts').then(r => setCourts(r.data));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/bookings', { ...form, courtId: parseInt(form.courtId) });
    alert('Booked!');
    window.location.reload();
  };

  return (
    <div>
      <h1>Your Bookings</h1>
      <ul>{bookings.map(b => <li key={b.id}>Court: {b.court.name} | Date: {new Date(b.date).toLocaleString()}</li>)}</ul>
      <h2>New Booking</h2>
      <form onSubmit={handleSubmit}>
        <select name="courtId" onChange={handleChange} required>
          <option>Select court</option>
          {courts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input type="datetime-local" name="date" onChange={handleChange} required />
        <button type="submit">Book</button>
      </form>
    </div>
  );
}
