import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiDollarSign, FiUsers, FiShoppingBag, FiPackage, FiLogOut, FiRefreshCw } from 'react-icons/fi';
import '../App.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ revenue: 0, totalOrders: 0, totalUsers: 0, totalBottles: 0 });

  const fetchAdminData = () => {
    let allOrders = [];
    const savedUsers = JSON.parse(localStorage.getItem('wineShopUsers') || '[]');
    
    // Loop through every registered user and grab THEIR specific orders
    savedUsers.forEach(u => {
      const userOrderKey = `orders_${u.email}`;
      const userOrders = JSON.parse(localStorage.getItem(userOrderKey) || '[]');
      allOrders = allOrders.concat(userOrders);
    });

    // Sort orders so newest are at the top
    allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

    setOrders(allOrders);
    setUsers(savedUsers);

    const revenue = allOrders.reduce((sum, order) => sum + order.total, 0);
    const bottles = allOrders.reduce((sum, order) => 
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

    setStats({
      revenue: revenue,
      totalOrders: allOrders.length,
      totalUsers: savedUsers.length,
      totalBottles: bottles
    });
  };

  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') {
      navigate('/admin-login');
      return;
    }
    fetchAdminData();
    
    const handleStorageChange = () => fetchAdminData();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate]);

  // THIS WAS MISSING:
  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  const handleStatusChange = (orderId, newStatus) => {
    const orderToUpdate = orders.find(o => o.id === orderId);
    
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: parseInt(newStatus) } : order
    );
    setOrders(updatedOrders);

    // Update in that SPECIFIC USER'S LocalStorage
    const targetKey = `orders_${orderToUpdate.customerEmail}`;
    const targetUserOrders = JSON.parse(localStorage.getItem(targetKey) || '[]');
    const updatedTargetOrders = targetUserOrders.map(o => o.id === orderId ? {...o, status: parseInt(newStatus)} : o);
    localStorage.setItem(targetKey, JSON.stringify(updatedTargetOrders));

    // Send alert ONLY to the customer who placed the order
    const firstWine = orderToUpdate?.items[0];
    const statusMessages = {
      '1': 'Order Placed',
      '2': 'is being Prepared',
      '3': 'has been Shipped! 🚚',
      '4': 'has been Delivered! ✅'
    };
    
    localStorage.setItem(`alert_${orderToUpdate.customerEmail}`, JSON.stringify({
      message: statusMessages[newStatus],
      type: 'order',
      image: firstWine?.image || null,
      wineName: firstWine?.wine || "Your Wines"
    }));
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Dashboard Analytics</h1>
        <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
          <button onClick={fetchAdminData} className="refresh-btn">
            <FiRefreshCw /> Refresh Data
          </button>
          <button onClick={handleLogout} className="logout-btn" style={{color: 'white', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <FiLogOut /> Logout
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'rgba(197, 160, 89, 0.2)', color: '#C5A059'}}><FiDollarSign /></div>
          <div>
            <p className="stat-number">${stats.revenue.toFixed(2)}</p>
            <p className="stat-label">Total Revenue</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'rgba(114, 47, 55, 0.2)', color: '#722F37'}}><FiShoppingBag /></div>
          <div>
            <p className="stat-number">{stats.totalOrders}</p>
            <p className="stat-label">Total Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'rgba(255, 255, 255, 0.1)', color: 'white'}}><FiUsers /></div>
          <div>
            <p className="stat-number">{stats.totalUsers}</p>
            <p className="stat-label">Registered Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'rgba(39, 174, 96, 0.2)', color: '#27ae60'}}><FiPackage /></div>
          <div>
            <p className="stat-number">{stats.totalBottles}</p>
            <p className="stat-label">Bottles Sold</p>
          </div>
        </div>
      </div>

      <div className="admin-tables-grid">
        <div className="admin-table-container">
          <h3>Manage Orders & Shipping</h3>
          {orders.length === 0 ? <p className="empty-table">No orders yet.</p> : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Shipping Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id.toString().slice(-6)}</td>
                    <td style={{color:'#ccc'}}>{order.customerName || 'Guest'}</td>
                    <td style={{color: '#C5A059', fontWeight: 'bold'}}>${order.total.toFixed(2)}</td>
                    <td>
                      <select 
                        value={order.status || 1} 
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="status-select"
                      >
                        <option value="1">📦 Order Placed</option>
                        <option value="2">🔍 Preparing</option>
                        <option value="3">🚚 Shipped</option>
                        <option value="4">✅ Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="admin-table-container">
          <h3>Registered Buyers</h3>
          {users.length === 0 ? <p className="empty-table">No users registered yet.</p> : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td><span className="badge-active">Active</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;