import React from 'react';
import ReactDOM from 'react-dom';
import MyBookings from '@src/myBookings/myBookings';
import '@src/myBookings/myBookings.scss';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('my-bookings');
  if (container) {
    ReactDOM.render(<MyBookings />, container);
  }
});