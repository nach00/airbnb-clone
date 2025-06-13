import React from 'react';
import { createRoot } from 'react-dom/client';
import MyBookings from '@src/myBookings/myBookings';
import '@src/myBookings/myBookings.scss';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('my-bookings');
  if (container) {
    const root = createRoot(container);
    root.render(<MyBookings />);
  }
});