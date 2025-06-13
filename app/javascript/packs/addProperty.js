import React from 'react';
import ReactDOM from 'react-dom';
import AddProperty from '@src/addProperty/addProperty';
import '@src/addProperty/addProperty.scss';

// Simple test component
const TestComponent = () => (
  <div style={{padding: '20px', backgroundColor: 'lightblue', margin: '20px'}}>
    <h1>Test Component Loaded Successfully!</h1>
    <p>If you see this, React is working.</p>
    <AddProperty />
  </div>
);

document.addEventListener('DOMContentLoaded', () => {
  console.log('AddProperty DOM loaded');
  const container = document.getElementById('add-property');
  console.log('Container found:', container);
  if (container) {
    console.log('Rendering AddProperty component');
    ReactDOM.render(<TestComponent />, container);
  } else {
    console.error('No container with id "add-property" found');
  }
});