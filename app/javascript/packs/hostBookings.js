import React from 'react';
import ReactDOM from 'react-dom';
import HostBookings from '@src/hostBookings/hostBookings';
import '@src/hostBookings/hostBookings.scss';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('host-bookings');
  if (container) {
    ReactDOM.render(<HostBookings />, container);
  }
});