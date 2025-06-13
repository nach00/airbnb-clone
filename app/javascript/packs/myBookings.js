import React from 'react';
import ReactDOM from 'react-dom';
import MyBookings from '@src/myBookings/myBookings';
import '@src/myBookings/myBookings.scss';

document.addEventListener('DOMContentLoaded', () => {
  console.log('MyBookings DOM loaded');
  const container = document.getElementById('my-bookings');
  console.log('Container found:', container);
  if (container) {
    console.log('Rendering MyBookings component');
    ReactDOM.render(<MyBookings />, container);
  } else {
    console.error('No container with id "my-bookings" found');
  }
});