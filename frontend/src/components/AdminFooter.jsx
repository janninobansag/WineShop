import React from 'react';
import '../App.css';

const AdminFooter = () => {
  return (
    <footer className="admin-footer">
      <p>&copy; {new Date().getFullYear()} WineShop Admin Portal. All rights reserved.</p>
      <p style={{ fontSize: '0.75rem', color: '#444' }}>Restricted Access Only</p>
    </footer>
  );
};

export default AdminFooter;