import React from 'react';
import ReactDOM from 'react-dom';
import HostBookingsWithLayout from '@src/hostBookings/hostBookingsWithLayout';
import '@src/hostBookings/hostBookings.scss';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('host-bookings');
  if (container) {
    ReactDOM.render(<HostBookingsWithLayout />, container);
  }
});