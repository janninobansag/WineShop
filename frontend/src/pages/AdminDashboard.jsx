import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiDollarSign, FiUsers, FiShoppingBag, FiPackage, FiLogOut, FiRefreshCw, 
  FiEdit, FiTrash2, FiX, FiMapPin, FiCreditCard, FiMail, FiPhone, 
  FiCheckCircle, FiTruck, FiSettings, FiBox, FiClock, FiAlertCircle,
  FiPlus, FiSave, FiList, FiUser, FiShoppingCart, FiChevronLeft, FiChevronRight,
  FiLoader, FiPackage as FiOrderIcon, FiTrendingUp, FiLock
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import '../App.css';
import Analytics from '../components/Analytics';
import InventoryManagement from '../components/InventoryManagement';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { addNotification } = useNotification();
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [wines, setWines] = useState([]);
  const [stats, setStats] = useState({ revenue: 0, totalOrders: 0, totalUsers: 0, totalBottles: 0, totalWines: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  
  // Wine Pagination
  const [currentWinePage, setCurrentWinePage] = useState(1);
  const winesPerPage = 10;
  
  // User editing state
  const [editingEmail, setEditingEmail] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  
  // Wine form state
  const [showWineForm, setShowWineForm] = useState(false);
  const [editingWine, setEditingWine] = useState(null);
  const [wineForm, setWineForm] = useState({
    winery: '',
    wine: '',
    location: '',
    image: '',
    price: '',
    category: 'reds',
    type: 'Red',
    vintage: '',
    description: ''
  });
  
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Pagination calculations for wines
  const indexOfLastWine = currentWinePage * winesPerPage;
  const indexOfFirstWine = indexOfLastWine - winesPerPage;
  const currentWines = wines.slice(indexOfFirstWine, indexOfLastWine);
  const totalWinePages = Math.ceil(wines.length / winesPerPage);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      // Fetch users
      const usersResponse = await fetch('https://wineshop-api.onrender.com/api/auth/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const usersData = await usersResponse.json();
      setUsers(Array.isArray(usersData) ? usersData : []);
      
      // Fetch orders
      const ordersResponse = await fetch('https://wineshop-api.onrender.com/api/orders/admin/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const ordersData = await ordersResponse.json();
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      
      // Fetch ALL wines from all categories
      const categories = ['reds', 'whites', 'rose', 'sparkling'];
      let allWines = [];
      
      for (const category of categories) {
        try {
          const response = await fetch(`https://wineshop-api.onrender.com/api/wines/${category}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await response.json();
          if (data && data.data && Array.isArray(data.data)) {
            allWines = [...allWines, ...data.data];
          }
        } catch (err) {
          console.error(`Error fetching ${category}:`, err);
        }
      }
      
      setWines(allWines);
      console.log(`Loaded ${allWines.length} wines total`);
      
    } catch (error) {
      console.error('Error fetching admin data:', error);
      addNotification('Failed to fetch admin data', 'error', null, null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('wineShopUser') || '{}');
    if (user.role !== 'admin') {
      navigate('/admin-login');
      return;
    }
    fetchAdminData();
  }, [navigate]);

  useEffect(() => {
    const activeOrders = orders.filter(o => o.status !== 'cancelled');
    const revenue = activeOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const bottles = activeOrders.reduce((sum, order) => sum + (order.items?.reduce((itemSum, item) => itemSum + (item.quantity || 0), 0) || 0), 0);
    setStats({ 
      revenue, 
      totalOrders: activeOrders.length, 
      totalUsers: users.length, 
      totalBottles: bottles,
      totalWines: wines.length
    });
  }, [orders, users, wines]);

  useEffect(() => {
    setCurrentWinePage(1);
  }, [wines.length]);

  // FIXED: Admin Logout Function
  const handleLogout = () => {
    // Clear all authentication and session data
    localStorage.removeItem('authToken');
    localStorage.removeItem('wineShopUser');
    localStorage.removeItem('adminAccess'); 
    sessionStorage.removeItem('adminAccess');
    
    // Call the auth context logout
    logout();
    
    // Force navigate to admin login page instead of user home page
    navigate('/admin-login');
  };

  // User Management
  const [editingUser, setEditingUser] = useState(null);
  const [editUserData, setEditUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  const handleStartEdit = (user) => { 
    setEditingUser(user);
    setEditUserData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      role: user.role || 'user'
    });
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      const updateData = {
        name: editUserData.name,
        email: editUserData.email,
        role: editUserData.role
      };
      
      if (editUserData.password && editUserData.password.trim() !== '') {
        updateData.password = editUserData.password;
      }
      
      const response = await fetch(`https://wineshop-api.onrender.com/api/auth/users/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        addNotification('User updated successfully', 'success', null, null);
        setEditingUser(null);
        fetchAdminData();
      } else {
        addNotification(data.message || 'Failed to update user', 'error', null, null);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      addNotification('Error updating user', 'error', null, null);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditUserData({
      name: '',
      email: '',
      password: '',
      role: 'user'
    });
  };

  const handleDeleteUser = async (userId) => {
    const userToDelete = users.find(u => u._id === userId);
    const currentUserEmail = JSON.parse(localStorage.getItem('wineShopUser') || '{}').email;
    
    if (userToDelete?.role === 'admin') {
      addNotification('Admin accounts cannot be deleted!', 'error', null, null);
      return;
    }
    
    if (userToDelete?.email === currentUserEmail) {
      addNotification('You cannot delete your own account!', 'error', null, null);
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete user "${userToDelete?.name}"? This action cannot be undone.`)) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`https://wineshop-api.onrender.com/api/auth/users/${userId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          addNotification('User deleted successfully', 'success', null, null);
          fetchAdminData();
        } else {
          addNotification('Failed to delete user', 'error', null, null);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        addNotification('Error deleting user', 'error', null, null);
      }
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`https://wineshop-api.onrender.com/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        const order = orders.find(o => o._id === orderId);
        
        const statusMessages = {
          'processing': `⚙️ Your order #${order.orderNumber?.slice(-8)} is now being processed.`,
          'shipped': `🚚 Your order #${order.orderNumber?.slice(-8)} has been shipped!`,
          'delivered': `✅ Your order #${order.orderNumber?.slice(-8)} has been delivered!`
        };
        
        if (statusMessages[newStatus]) {
          const notifKey = `notif_${order.userEmail}`;
          const existingNotifs = JSON.parse(localStorage.getItem(notifKey) || '[]');
          
          const newNotification = {
            id: Date.now(),
            message: statusMessages[newStatus],
            type: 'order',
            image: order.items?.[0]?.image || null,
            wineName: order.items?.[0]?.wine || "Your Order",
            orderId: orderId,
            read: false,
            timestamp: Date.now()
          };
          
          existingNotifs.unshift(newNotification);
          localStorage.setItem(notifKey, JSON.stringify(existingNotifs.slice(0, 50)));
          
          window.dispatchEvent(new StorageEvent('storage', {
            key: notifKey,
            newValue: JSON.stringify(existingNotifs.slice(0, 50))
          }));
        }
        
        addNotification(`Order status updated to ${newStatus}`, 'success', null, null);
        fetchAdminData();
      } else {
        addNotification('Failed to update order status', 'error', null, null);
      }
    } catch (error) {
      console.error('Error updating order:', error);
      addNotification('Error updating order', 'error', null, null);
    }
  };

  const handleConfirmCancel = async (orderId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`https://wineshop-api.onrender.com/api/orders/${orderId}/cancel-approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        addNotification('Order cancelled successfully', 'success', null, null);
        fetchAdminData();
      } else {
        addNotification('Failed to cancel order', 'error', null, null);
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      addNotification('Error cancelling order', 'error', null, null);
    }
  };

  const handleDeclineCancel = async (orderId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`https://wineshop-api.onrender.com/api/orders/${orderId}/cancel-reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        addNotification('Cancellation request declined', 'info', null, null);
        fetchAdminData();
      } else {
        addNotification('Failed to decline cancellation', 'error', null, null);
      }
    } catch (error) {
      console.error('Error declining cancellation:', error);
      addNotification('Error declining cancellation', 'error', null, null);
    }
  };

  // Wine Management
  const handleAddWine = () => {
    setEditingWine(null);
    setWineForm({
      winery: '',
      wine: '',
      location: '',
      image: '',
      price: '',
      category: 'reds',
      type: 'Red',
      vintage: '',
      description: ''
    });
    setShowWineForm(true);
  };

  const handleEditWine = (wine) => {
    setEditingWine(wine);
    setWineForm({
      winery: wine.winery || '',
      wine: wine.wine || '',
      location: wine.location || '',
      image: wine.image || '',
      price: wine.price || '',
      category: wine.category || 'reds',
      type: wine.type || 'Red',
      vintage: wine.vintage || '',
      description: wine.description || ''
    });
    setShowWineForm(true);
  };

  const handleDeleteWine = async (wineId, wineName) => {
    if (window.confirm(`Are you sure you want to delete "${wineName}"?`)) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`https://wineshop-api.onrender.com/api/wines/${wineId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          addNotification(`"${wineName}" deleted successfully`, 'success', null, null);
          fetchAdminData();
        } else {
          addNotification('Failed to delete wine', 'error', null, null);
        }
      } catch (error) {
        console.error('Error deleting wine:', error);
        addNotification('Error deleting wine', 'error', null, null);
      }
    }
  };

  const handleSaveWine = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const wineData = {
        ...wineForm,
        price: parseFloat(wineForm.price),
        rating: { average: 0, reviews: 0 }
      };
      
      let response;
      if (editingWine) {
        response = await fetch(`https://wineshop-api.onrender.com/api/wines/${editingWine._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(wineData)
        });
      } else {
        response = await fetch('https://wineshop-api.onrender.com/api/wines', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(wineData)
        });
      }
      
      if (response.ok) {
        addNotification(editingWine ? 'Wine updated successfully' : 'Wine added successfully', 'success', null, null);
        setShowWineForm(false);
        fetchAdminData();
      } else {
        addNotification('Failed to save wine', 'error', null, null);
      }
    } catch (error) {
      console.error('Error saving wine:', error);
      addNotification('Error saving wine', 'error', null, null);
    }
  };

  const goToPreviousWinePage = () => {
    if (currentWinePage > 1) {
      setCurrentWinePage(currentWinePage - 1);
    }
  };

  const goToNextWinePage = () => {
    if (currentWinePage < totalWinePages) {
      setCurrentWinePage(currentWinePage + 1);
    }
  };

  const goToWinePage = (pageNum) => {
    setCurrentWinePage(pageNum);
  };

  const getWinePageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentWinePage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalWinePages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FiClock size={14} />;
      case 'processing': return <FiSettings size={14} />;
      case 'shipped': return <FiTruck size={14} />;
      case 'delivered': return <FiCheckCircle size={14} />;
      default: return <FiPackage size={14} />;
    }
  };

  if (loading) {
    return <div className="loader-container"><div className="loader"></div><p>Loading dashboard...</p></div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Dashboard Analytics</h1>
        <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
          <button onClick={fetchAdminData} className="refresh-btn"><FiRefreshCw /> Refresh</button>
          <button onClick={handleLogout} className="logout-btn" style={{color: 'white', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><FiLogOut /> Logout</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'rgba(197, 160, 89, 0.2)', color: '#C5A059'}}><FiDollarSign /></div>
          <div><p className="stat-number">${stats.revenue.toFixed(2)}</p><p className="stat-label">Total Revenue</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'rgba(114, 47, 55, 0.2)', color: '#722F37'}}><FiShoppingBag /></div>
          <div><p className="stat-number">{stats.totalOrders}</p><p className="stat-label">Active Orders</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'rgba(255, 255, 255, 0.1)', color: 'white'}}><FiUsers /></div>
          <div><p className="stat-number">{stats.totalUsers}</p><p className="stat-label">Registered Users</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'rgba(39, 174, 96, 0.2)', color: '#27ae60'}}><FiPackage /></div>
          <div><p className="stat-number">{stats.totalBottles}</p><p className="stat-label">Bottles Sold</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'rgba(197, 160, 89, 0.2)', color: '#C5A059'}}><FiList /></div>
          <div><p className="stat-number">{stats.totalWines}</p><p className="stat-label">Total Wines</p></div>
        </div>
      </div>

      <div className="admin-tabs">
        <button className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
          <FiShoppingCart /> Orders
        </button>
        <button className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
          <FiUsers /> Users
        </button>
        <button className={`admin-tab ${activeTab === 'wines' ? 'active' : ''}`} onClick={() => setActiveTab('wines')}>
          <FiList /> Wines
        </button>
        <button className={`admin-tab ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
          <FiTrendingUp /> Analytics
        </button>
        <button className={`admin-tab ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>
          <FiPackage /> Inventory
        </button>
      </div>

      {/* ORDERS SECTION */}
      {activeTab === 'orders' && (
        <div className="admin-table-container">
          <h3>Manage Orders & Shipping</h3>
          <p style={{color:'#888', fontSize:'0.85rem', marginBottom:'1rem'}}>Click an Order ID to view delivery details</p>
          {orders.length === 0 ? (
            <p className="empty-table">No orders yet.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{width:'100px'}}>Order #</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th style={{width:'220px'}}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  const isPendingCancel = order.status === 'cancellation_requested';
                  const isCancelled = order.status === 'cancelled';
                  const isExpanded = expandedOrderId === order._id;
                  
                  return (
                    <React.Fragment key={order._id}>
                      <tr className={isCancelled ? 'cancelled-table-row' : ''} style={{cursor:'pointer'}} onClick={() => setExpandedOrderId(isExpanded ? null : order._id)}>
                        <td style={{color: '#C5A059', fontWeight:'bold'}}>
                          #{order.orderNumber?.slice(-8) || order._id?.slice(-8)}
                          <span style={{fontSize:'0.7rem', color:'#888', display:'block'}}>▼ Click to expand</span>
                        </td>
                        <td style={{color:'#ccc'}}>{order.userName}</td>
                        <td style={{color: isCancelled ? '#666' : '#C5A059', fontWeight: 'bold', textDecoration: isCancelled ? 'line-through' : 'none'}}>${(order.total || 0).toFixed(2)}</td>
                        <td onClick={(e) => e.stopPropagation()}>
                              {isPendingCancel ? (
                                <div className="admin-cancel-actions">
                                  <button onClick={() => handleConfirmCancel(order._id)} className="admin-confirm-cancel-btn">
                                    <FiCheckCircle size={14} /> Confirm Cancel
                                  </button>
                                  <button onClick={() => handleDeclineCancel(order._id)} className="admin-decline-cancel-btn">
                                    <FiX size={14} /> Decline
                                  </button>
                                </div>
                              ) : isCancelled ? (
                                <span className="badge-cancelled"><FiX size={12} /> Cancelled</span>
                              ) : (
                                <select value={order.status || 'pending'} onChange={(e) => handleStatusChange(order._id, e.target.value)} className="status-select">
                                  <option value="pending">📦 Order Placed</option>
                                  <option value="processing">⚙️ Processing</option>
                                  <option value="shipped">🚚 Shipped</option>
                                  <option value="delivered">✅ Delivered</option>
                                </select>
                              )}
                            </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan="4" style={{padding: 0}}>
                            <div className="expanded-order-info">
                              <div className="shipping-grid">
                                <div className="shipping-col">
                                  <h4><FiMapPin /> Delivery Address</h4>
                                  <p><FiUser size={12} /> <strong>Name:</strong> {order.shippingAddress?.fullName || 'N/A'}</p>
                                  <p><FiPhone size={12} /> <strong>Phone:</strong> {order.shippingAddress?.phone || 'N/A'}</p>
                                  <p><FiMapPin size={12} /> <strong>Address:</strong> {order.shippingAddress?.address || 'N/A'}</p>
                                </div>
                                <div className="shipping-col">
                                  <h4><FiCreditCard /> Payment & Notes</h4>
                                  <p><FiCreditCard size={12} /> <strong>Method:</strong> {order.paymentMethod === 'cash' ? 'Cash on Delivery' : order.paymentMethod || 'N/A'}</p>
                                  {order.shippingAddress?.deliveryInstructions && (
                                    <p className="shipping-notes"><FiAlertCircle size={12} /> <strong>Instructions:</strong> {order.shippingAddress.deliveryInstructions}</p>
                                  )}
                                </div>
                                <div className="shipping-col">
                                  <h4><FiBox /> Items Ordered</h4>
                                  {order.items?.map((item, idx) => (
                                    <div key={idx} style={{display:'flex', gap:'0.5rem', marginBottom:'0.5rem', alignItems:'center'}}>
                                      <img src={item.image} alt="wine" style={{width:'25px', height:'35px', objectFit:'contain', background:'#141414', borderRadius:'4px'}} />
                                      <span style={{color:'#ccc', fontSize:'0.85rem'}}>{item.wine} (x{item.quantity})</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* USERS SECTION */}
      {activeTab === 'users' && (
        <div className="admin-table-container">
          <h3>Manage Users</h3>
          {users.length === 0 ? (
            <p className="empty-table">No users registered yet.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th style={{width:'180px'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const isCurrentAdmin = user.email === JSON.parse(localStorage.getItem('wineShopUser') || '{}').email;
                  const isAdmin = user.role === 'admin';
                  
                  return (
                    <React.Fragment key={user._id}>
                      <tr>
                        <td>{editingUser?._id === user._id ? (
                          <input type="text" value={editUserData.name} onChange={(e) => setEditUserData({...editUserData, name: e.target.value})} className="admin-edit-input" />
                        ) : user.name}</td>
                        <td>{editingUser?._id === user._id ? (
                          <input type="email" value={editUserData.email} onChange={(e) => setEditUserData({...editUserData, email: e.target.value})} className="admin-edit-input" />
                        ) : user.email}</td>
                        <td>
                          {editingUser?._id === user._id ? (
                            <select value={editUserData.role} onChange={(e) => setEditUserData({...editUserData, role: e.target.value})} className="admin-edit-select">
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                          ) : (
                            <span className={`badge-${user.role}`}>
                              {user.role === 'admin' ? <FiUsers size={12} /> : <FiUser size={12} />}
                              {' '}{user.role}
                            </span>
                          )}
                        </td>
                        <td>
                          <div className="admin-cancel-actions">
                            {editingUser?._id === user._id ? (
                              <>
                                <button onClick={handleSaveEdit} className="admin-action-btn save">
                                  <FiSave /> Save
                                </button>
                                <button onClick={handleCancelEdit} className="admin-action-btn cancel-edit">
                                  <FiX /> Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => handleStartEdit(user)} className="admin-action-btn edit">
                                  <FiEdit /> Edit
                                </button>
                                {!isAdmin && (
                                  <button onClick={() => handleDeleteUser(user._id)} className="admin-action-btn delete">
                                    <FiTrash2 /> Delete
                                  </button>
                                )}
                                {isAdmin && (
                                  <span className="admin-protected-badge" title="Admin accounts cannot be deleted">
                                    <FiLock size={14} />
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                      
                      {editingUser?._id === user._id && (
                        <tr>
                          <td colSpan="4" style={{padding: 0, background: '#252525'}}>
                            <div className="expanded-edit-form">
                              <div className="edit-password-section">
                                <label>Change Password (optional)</label>
                                <input 
                                  type="password" 
                                  value={editUserData.password} 
                                  onChange={(e) => setEditUserData({...editUserData, password: e.target.value})} 
                                  className="admin-edit-input" 
                                  placeholder="Enter new password (leave blank to keep current)"
                                />
                                <small style={{color: '#888', display: 'block', marginTop: '5px'}}>
                                  Only enter a password if you want to change it
                                </small>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* WINES SECTION WITH PAGINATION */}
      {activeTab === 'wines' && (
        <div className="admin-table-container">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
            <h3>Manage Wines</h3>
            <button onClick={handleAddWine} className="add-wine-btn">
              <FiPlus /> Add New Wine
            </button>
          </div>
          
          {wines.length === 0 ? (
            <p className="empty-table">No wines found.</p>
          ) : (
            <>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Wine</th>
                    <th>Winery</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th style={{width:'100px'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentWines.map((wine) => (
                    <tr key={wine._id}>
                      <td><img src={wine.image} alt={wine.wine} style={{width:'30px', height:'40px', objectFit:'contain', background:'#141414', borderRadius:'4px'}} /></td>
                      <td><strong>{wine.wine}</strong></td>
                      <td>{wine.winery}</td>
                      <td style={{color:'#C5A059'}}>${(wine.price || 0).toFixed(2)}</td>
                      <td><span className="badge-category">{wine.category}</span></td>
                      <td>
                        <div className="admin-cancel-actions">
                          <button onClick={() => handleEditWine(wine)} className="admin-action-btn edit"><FiEdit /> Edit</button>
                          <button onClick={() => handleDeleteWine(wine._id, wine.wine)} className="admin-action-btn delete"><FiTrash2 /> Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalWinePages > 1 && (
                <div className="admin-pagination">
                  <button onClick={goToPreviousWinePage} disabled={currentWinePage === 1} className="pagination-btn">
                    <FiChevronLeft /> Previous
                  </button>
                  
                  <div className="pagination-numbers">
                    {getWinePageNumbers().map(pageNum => (
                      <button key={pageNum} onClick={() => goToWinePage(pageNum)} className={`pagination-num ${currentWinePage === pageNum ? 'active' : ''}`}>
                        {pageNum}
                      </button>
                    ))}
                  </div>
                  
                  <button onClick={goToNextWinePage} disabled={currentWinePage === totalWinePages} className="pagination-btn">
                    Next <FiChevronRight />
                  </button>
                </div>
              )}
              
              <div className="pagination-info">
                Showing {indexOfFirstWine + 1} to {Math.min(indexOfLastWine, wines.length)} of {wines.length} wines
              </div>
            </>
          )}
        </div>
      )}

      {/* ANALYTICS SECTION */}
      {activeTab === 'analytics' && (
        <Analytics orders={orders} users={users} wines={wines} />
      )}

      {/* INVENTORY SECTION */}
      {activeTab === 'inventory' && (
        <InventoryManagement />
      )}

      {/* Wine Form Modal */}
      {showWineForm && (
        <div className="modal-overlay" onClick={() => setShowWineForm(false)}>
          <div className="modal-container wine-form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingWine ? 'Edit Wine' : 'Add New Wine'}</h3>
              <button className="modal-close" onClick={() => setShowWineForm(false)}><FiX /></button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Wine Name *</label>
                  <input type="text" value={wineForm.wine} onChange={(e) => setWineForm({...wineForm, wine: e.target.value})} placeholder="e.g., Cabernet Sauvignon 2018" />
                </div>
                <div className="form-group">
                  <label>Winery *</label>
                  <input type="text" value={wineForm.winery} onChange={(e) => setWineForm({...wineForm, winery: e.target.value})} placeholder="e.g., Domaine de la Romanée-Conti" />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input type="text" value={wineForm.location} onChange={(e) => setWineForm({...wineForm, location: e.target.value})} placeholder="e.g., France · Bordeaux" />
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input type="text" value={wineForm.image} onChange={(e) => setWineForm({...wineForm, image: e.target.value})} placeholder="https://example.com/wine.jpg" />
                </div>
                <div className="form-group">
                  <label>Price ($) *</label>
                  <input type="number" step="0.01" value={wineForm.price} onChange={(e) => setWineForm({...wineForm, price: e.target.value})} placeholder="29.99" />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select value={wineForm.category} onChange={(e) => setWineForm({...wineForm, category: e.target.value})}>
                    <option value="reds">Red Wines</option>
                    <option value="whites">White Wines</option>
                    <option value="rose">Rosé Wines</option>
                    <option value="sparkling">Sparkling Wines</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select value={wineForm.type} onChange={(e) => setWineForm({...wineForm, type: e.target.value})}>
                    <option value="Red">Red</option>
                    <option value="White">White</option>
                    <option value="Rosé">Rosé</option>
                    <option value="Sparkling">Sparkling</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Vintage</label>
                  <input type="text" value={wineForm.vintage} onChange={(e) => setWineForm({...wineForm, vintage: e.target.value})} placeholder="2020" />
                </div>
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea value={wineForm.description} onChange={(e) => setWineForm({...wineForm, description: e.target.value})} rows="3" placeholder="Wine description..." />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn cancel" onClick={() => setShowWineForm(false)}>Cancel</button>
              <button className="modal-btn confirm" onClick={handleSaveWine}><FiSave /> {editingWine ? 'Update Wine' : 'Add Wine'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;