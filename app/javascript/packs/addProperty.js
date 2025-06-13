import React from 'react';
import ReactDOM from 'react-dom';
import AddProperty from '@src/addProperty/addProperty';
import '@src/addProperty/addProperty.scss';

// Debug: Simple alert to test if JS is executing
alert('JavaScript is loading!');

// Simple test component with bright colors
const TestComponent = () => (
  <div style={{
    padding: '30px', 
    backgroundColor: 'red', 
    margin: '20px',
    border: '5px solid black',
    fontSize: '24px',
    color: 'white'
  }}>
    <h1>🚀 REACT IS WORKING! 🚀</h1>
    <p>If you see this big red box, JavaScript and React are executing properly.</p>
    <AddProperty />
  </div>
);

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 AddProperty DOM loaded');
  const container = document.getElementById('add-property');
  console.log('🚀 Container found:', container);
  if (container) {
    console.log('🚀 Rendering AddProperty component');
    ReactDOM.render(<TestComponent />, container);
  } else {
    console.error('❌ No container with id "add-property" found');
  }
});