import React from 'react';
import { createRoot } from 'react-dom/client';
import HostBookings from '@src/hostBookings/hostBookings';
import '@src/hostBookings/hostBookings.scss';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('host-bookings');
  if (container) {
    const root = createRoot(container);
    root.render(<HostBookings />);
  }
});