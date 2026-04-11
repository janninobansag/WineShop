import React from 'react';
import '../App.css';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader"></div>
      <p>Loading wines...</p>
    </div>
  );
};

export default Loader;