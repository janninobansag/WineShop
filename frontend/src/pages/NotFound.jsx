import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <Link to="/">Go Home</Link>
    </div>
  );
};

export default NotFound;