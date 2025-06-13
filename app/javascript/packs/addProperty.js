import React from 'react';
import ReactDOM from 'react-dom';
import AddPropertyWithLayout from '@src/addProperty/addPropertyWithLayout';
import '@src/addProperty/addProperty.scss';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('add-property');
  if (container) {
    ReactDOM.render(<AddPropertyWithLayout />, container);
  }
});