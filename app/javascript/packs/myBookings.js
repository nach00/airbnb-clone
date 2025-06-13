import React from 'react';
import ReactDOM from 'react-dom';
import MyBookingsWithLayout from '@src/myBookings/myBookingsWithLayout';
import '@src/myBookings/myBookings.scss';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('my-bookings');
  if (container) {
    ReactDOM.render(<MyBookingsWithLayout />, container);
  }
});