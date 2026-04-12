import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiDollarSign, FiUsers, FiShoppingBag, FiPackage, FiLogOut, FiRefreshCw, FiEdit, FiTrash2, FiX } from 'react-icons/fi';
import '../App.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ revenue: 0, totalOrders: 0, totalUsers: 0, totalBottles: 0 });
  
  const [editingEmail, setEditingEmail] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  
  const [expandedOrderId, setExpandedOrderId] = useState(null); // NEW: For expanding order details

  const fetchAdminData = () => {
    let allOrders = [];
    const savedUsers = JSON.parse(localStorage.getItem('wineShopUsers') || '[]');
    savedUsers.forEach(u => {
      const userOrders = JSON.parse(localStorage.getItem(`orders_${u.email}`) || '[]');
      allOrders = allOrders.concat(userOrders);
    });
    allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    setOrders(allOrders);
    setUsers(savedUsers);
  };

  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') { navigate('/admin-login'); return; }
    fetchAdminData();
    const handleStorageChange = () => fetchAdminData();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate]);

  useEffect(() => {
    const activeOrders = orders.filter(o => o.status !== 6);
    const revenue = activeOrders.reduce((sum, order) => sum + order.total, 0);
    const bottles = activeOrders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
    setStats({ revenue, totalOrders: activeOrders.length, totalUsers: users.length, totalBottles: bottles });
  }, [orders, users]);

  const handleLogout = () => { localStorage.removeItem('isAdmin'); navigate('/'); };

  // --- USER MANAGEMENT ---
  const handleStartEdit = (user) => { setEditingEmail(user.email); setEditName(user.name); setEditEmail(user.email); setEditPassword(user.password); };

  const handleSaveEdit = () => {
    const oldEmail = editingEmail;
    const newEmail = editEmail.trim();
    const updatedUsers = users.map(u => u.email === oldEmail ? { ...u, name: editName, email: newEmail, password: editPassword } : u);
    if (oldEmail !== newEmail) {
      ['orders_', 'cart_', 'notif_'].forEach(prefix => {
        const oldKey = prefix + oldEmail; const newKey = prefix + newEmail; const data = localStorage.getItem(oldKey);
        if (data) {
          localStorage.setItem(newKey, data); localStorage.removeItem(oldKey);
          if (prefix === 'orders_') localStorage.setItem(newKey, JSON.stringify(JSON.parse(data).map(o => ({...o, customerEmail: newEmail}))));
        }
      });
    }
    setUsers(updatedUsers); localStorage.setItem('wineShopUsers', JSON.stringify(updatedUsers)); setEditingEmail(null); fetchAdminData();
  };

  const handleDeleteUser = (email) => {
    if (window.confirm('Are you sure? This deletes the user and all their data.')) {
      setUsers(users.filter(u => u.email !== email)); localStorage.setItem('wineShopUsers', JSON.stringify(users.filter(u => u.email !== email)));
      localStorage.removeItem(`orders_${email}`); localStorage.removeItem(`cart_${email}`); localStorage.removeItem(`notif_${email}`); fetchAdminData();
    }
  };

  // --- ORDER MANAGEMENT ---
  const handleStatusChange = (orderId, newStatus) => {
    const orderToUpdate = orders.find(o => o.id === orderId);
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: parseInt(newStatus) } : o));
    const tK = `orders_${orderToUpdate.customerEmail}`;
    localStorage.setItem(tK, JSON.stringify(JSON.parse(localStorage.getItem(tK) || '[]').map(o => o.id === orderId ? {...o, status: parseInt(newStatus)} : o)));
    const fw = orderToUpdate?.items[0];
    const sm = { '1': 'Order Placed', '2': 'is being Prepared', '3': 'has been Shipped! 🚚', '4': 'has been Delivered! ✅' };
    localStorage.setItem(`alert_${orderToUpdate.customerEmail}`, JSON.stringify({ message: sm[newStatus], type: 'order', image: fw?.image || null, wineName: fw?.wine || "Your Wines" }));
  };

  const handleConfirmCancel = (orderId, customerEmail) => {
    const tK = `orders_${customerEmail}`;
    localStorage.setItem(tK, JSON.stringify(JSON.parse(localStorage.getItem(tK) || '[]').map(o => o.id === orderId ? {...o, status: 6} : o)));
    setOrders(orders.map(o => o.id === orderId ? {...o, status: 6} : o));
    localStorage.setItem(`alert_${customerEmail}`, JSON.stringify({ message: "has been Cancelled.", type: 'order', image: null, wineName: "Your Order #" + orderId.toString().slice(-6) }));
  };

  const handleDeclineCancel = (orderId, customerEmail) => {
    const tK = `orders_${customerEmail}`;
    localStorage.setItem(tK, JSON.stringify(JSON.parse(localStorage.getItem(tK) || '[]').map(o => o.id === orderId ? {...o, status: 1} : o)));
    setOrders(orders.map(o => o.id === orderId ? {...o, status: 1} : o));
    localStorage.setItem(`alert_${customerEmail}`, JSON.stringify({ message: "cancellation was declined.", type: 'order', image: null, wineName: "Cancel Request" }));
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Dashboard Analytics</h1>
        <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
          <button onClick={fetchAdminData} className="refresh-btn"><FiRefreshCw /> Refresh Data</button>
          <button onClick={handleLogout} className="logout-btn" style={{color: 'white', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><FiLogOut /> Logout</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-icon" style={{background: 'rgba(197, 160, 89, 0.2)', color: '#C5A059'}}><FiDollarSign /></div><div><p className="stat-number">${stats.revenue.toFixed(2)}</p><p className="stat-label">Total Revenue</p></div></div>
        <div className="stat-card"><div className="stat-icon" style={{background: 'rgba(114, 47, 55, 0.2)', color: '#722F37'}}><FiShoppingBag /></div><div><p className="stat-number">{stats.totalOrders}</p><p className="stat-label">Active Orders</p></div></div>
        <div className="stat-card"><div className="stat-icon" style={{background: 'rgba(255, 255, 255, 0.1)', color: 'white'}}><FiUsers /></div><div><p className="stat-number">{stats.totalUsers}</p><p className="stat-label">Registered Users</p></div></div>
        <div className="stat-card"><div className="stat-icon" style={{background: 'rgba(39, 174, 96, 0.2)', color: '#27ae60'}}><FiPackage /></div><div><p className="stat-number">{stats.totalBottles}</p><p className="stat-label">Bottles Sold</p></div></div>
      </div>

      <div className="admin-tables-grid">
        
        {/* ORDERS TABLE */}
        <div className="admin-table-container" style={{gridColumn: 'span 2'}}> {/* Made table full width to fit info better */}
          <h3>Manage Orders & Shipping</h3>
          <p style={{color:'#888', fontSize:'0.85rem', marginBottom:'1rem'}}>Click an Order ID to view delivery details</p>
          {orders.length === 0 ? <p className="empty-table">No orders yet.</p> : (
            <table className="admin-table">
              <thead><tr><th style={{width:'100px'}}>Order ID</th><th>Customer</th><th>Total</th><th style={{width:'180px'}}>Status</th></tr></thead>
              <tbody>
                {orders.map(order => {
                  const isPendingCancel = order.status === 5;
                  const isCancelled = order.status === 6;
                  const isExpanded = expandedOrderId === order.id;
                  const info = order.shippingInfo; // Shorthand for checkout data
                  
                  return (
                    <React.Fragment key={order.id}>
                      <tr className={isCancelled ? 'cancelled-table-row' : ''} style={{cursor:'pointer'}} onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}>
                        <td style={{color: '#C5A059', fontWeight:'bold'}}>
                          #{order.id.toString().slice(-6)} 
                          <span style={{fontSize:'0.7rem', color:'#888', display:'block'}}>▼ Click to expand</span>
                        </td>
                        <td style={{color:'#ccc'}}>{order.customerName || 'Guest'}</td>
                        <td style={{color: isCancelled ? '#666' : '#C5A059', fontWeight: 'bold', textDecoration: isCancelled ? 'line-through' : 'none'}}>${order.total.toFixed(2)}</td>
                        <td onClick={(e) => e.stopPropagation()}>
                          {isPendingCancel ? (
                            <div className="admin-cancel-actions">
                              <button onClick={() => handleConfirmCancel(order.id, order.customerEmail)} className="admin-confirm-cancel-btn">Confirm</button>
                              <button onClick={() => handleDeclineCancel(order.id, order.customerEmail)} className="admin-decline-cancel-btn">Decline</button>
                            </div>
                          ) : isCancelled ? (
                            <span className="badge-cancelled">Cancelled</span>
                          ) : (
                            <select value={order.status || 1} onChange={(e) => handleStatusChange(order.id, e.target.value)} className="status-select">
                              <option value="1">📦 Order Placed</option><option value="2">🔍 Preparing</option><option value="3">🚚 Shipped</option><option value="4">✅ Delivered</option>
                            </select>
                          )}
                        </td>
                      </tr>

                      {/* EXPANDED DELIVERY INFO ROW */}
                      {isExpanded && (
                        <tr>
                          <td colSpan="4" style={{padding: 0}}>
                            <div className="expanded-order-info">
                              <div className="shipping-grid">
                                <div className="shipping-col">
                                  <h4>📍 Delivery Address</h4>
                                  <p><strong>Name:</strong> {info?.name || 'N/A'}</p>
                                  <p><strong>Phone:</strong> {info?.phone || 'N/A'}</p>
                                  <p><strong>Address:</strong> {info?.address || 'N/A'}</p>
                                  <p><strong>City/Zip:</strong> {info?.city || 'N/A'} {info?.zip || 'N/A'}</p>
                                </div>
                                <div className="shipping-col">
                                  <h4>💳 Payment & Notes</h4>
                                  <p><strong>Method:</strong> {order.paymentMethod === 'cod' ? '💵 Cash on Delivery' : order.paymentMethod || 'N/A'}</p>
                                  <p><strong>Email:</strong> {info?.email || 'N/A'}</p>
                                  <p className="shipping-notes"><strong>Notes:</strong> {info?.instructions || 'None'}</p>
                                </div>
                                <div className="shipping-col">
                                  <h4>📦 Items Ordered</h4>
                                  {order.items.map(item => (
                                    <div key={item.id} style={{display:'flex', gap:'0.5rem', marginBottom:'0.5rem', alignItems:'center'}}>
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

        {/* USERS TABLE (Moved to separate row below) */}
        <div className="admin-table-container" style={{gridColumn: 'span 2', marginTop: '2rem'}}>
          <h3>Registered Buyers</h3>
          {users.length === 0 ? <p className="empty-table">No users registered yet.</p> : (
            <table className="admin-table">
              <tbody>
                {users.map((user) => (
                  <React.Fragment key={user.email}>
                    <tr>
                      <td>{editingEmail === user.email ? <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="admin-edit-input" autoFocus /> : user.name}</td>
                      <td style={{color:'#888', fontSize:'0.85rem'}}>{user.email}</td>
                      <td>
                        <div className="admin-cancel-actions">
                          {editingEmail === user.email ? (
                            <><button onClick={handleSaveEdit} className="admin-action-btn save">Save</button><button onClick={() => setEditingEmail(null)} className="admin-action-btn cancel-edit">✕</button></>
                          ) : (
                            <><button onClick={() => handleStartEdit(user)} className="admin-action-btn edit"><FiEdit /> Edit</button><button onClick={() => handleDeleteUser(user.email)} className="admin-action-btn delete"><FiTrash2 /> Delete</button></>
                          )}
                        </div>
                      </td>
                    </tr>
                    {editingEmail === user.email && (
                      <tr>
                        <td colSpan="3" style={{padding: 0}}>
                          <div className="expanded-edit-form">
                            <div className="edit-grid">
                              <div className="form-group"><label>Name</label><input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="admin-edit-input"/></div>
                              <div className="form-group"><label>Email</label><input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="admin-edit-input"/></div>
                              <div className="form-group" style={{gridColumn: 'span 2'}}><label>Password</label><input type="text" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} className="admin-edit-input"/></div>
                            </div>
                            <div className="edit-actions">
                              <button onClick={handleSaveEdit} className="admin-action-btn save">Save Changes</button>
                              <button onClick={() => setEditingEmail(null)} className="admin-action-btn cancel-edit"><FiX /> Cancel</button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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