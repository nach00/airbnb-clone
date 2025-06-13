import React from 'react';
import { createRoot } from 'react-dom/client';
import AddProperty from '@src/addProperty/addProperty';
import '@src/addProperty/addProperty.scss';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('add-property');
  if (container) {
    const root = createRoot(container);
    root.render(<AddProperty />);
  }
});