import React from 'react';
import ReactDOM from 'react-dom';
import AddProperty from '@src/addProperty/addProperty';
import '@src/addProperty/addProperty.scss';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('add-property');
  if (container) {
    ReactDOM.render(<AddProperty />, container);
  }
});