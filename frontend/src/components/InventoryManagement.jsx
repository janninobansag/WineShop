import React, { useState, useEffect } from 'react';
import { FiPackage, FiAlertCircle, FiPlus, FiMinus, FiEdit, FiSave, FiX, FiRefreshCw, FiTrendingUp } from 'react-icons/fi';
import { useNotification } from '../context/NotificationContext';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ quantity: '', lowStockThreshold: '', supplier: '' });
  const [adjustModal, setAdjustModal] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState(0);
  const [adjustReason, setAdjustReason] = useState('');
  const [stats, setStats] = useState({ totalItems: 0, lowStock: 0, totalValue: 0 });
  const { addNotification } = useNotification();

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      const response = await fetch('http://localhost:5000/api/inventory', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      console.log('Inventory items:', data);
      setInventory(Array.isArray(data) ? data : []);
      
      const statsResponse = await fetch('http://localhost:5000/api/inventory/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const statsData = await statsResponse.json();
      console.log('Stats data:', statsData);
      
      setStats({
        totalItems: statsData.totalItems || 0,
        lowStock: statsData.lowStock || 0,
        totalValue: statsData.totalValue || 0
      });
    } catch (error) {
      console.error('Error fetching inventory:', error);
      addNotification('Failed to load inventory', 'error', null, null);
    } finally {
      setLoading(false);
    }
  };

  const handleInitialize = async () => {
    if (window.confirm('This will create inventory entries for all wines. Continue?')) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:5000/api/inventory/initialize', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        addNotification(`Inventory initialized: ${data.created} created, ${data.updated} updated`, 'success', null, null);
        fetchInventory();
      } catch (error) {
        addNotification('Failed to initialize inventory', 'error', null, null);
      }
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setEditForm({
      quantity: item.quantity,
      lowStockThreshold: item.lowStockThreshold,
      supplier: item.supplier || ''
    });
  };

  // ✅ UPDATED handleSaveEdit FUNCTION
  const handleSaveEdit = async (item) => {
  try {
    const token = localStorage.getItem('authToken');
    
    // IMPORTANT: Use wineId (not _id) for the API call
    // The backend expects the wineId parameter, not the inventory _id
    const wineId = item.wineId;
    
    console.log('Saving inventory for wineId:', wineId);
    console.log('New quantity:', editForm.quantity);
    
    const response = await fetch(`http://localhost:5000/api/inventory/${wineId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        quantity: parseInt(editForm.quantity),
        lowStockThreshold: parseInt(editForm.lowStockThreshold),
        supplier: editForm.supplier
      })
    });
    
    if (response.ok) {
      const updatedItem = await response.json();
      console.log('Update successful! New quantity:', updatedItem.quantity);
      addNotification('Inventory updated successfully', 'success', null, null);
      setEditingId(null);
      fetchInventory(); // Refresh the list
    } else {
      const error = await response.json();
      addNotification(error.message || 'Failed to update inventory', 'error', null, null);
    }
  } catch (error) {
    console.error('Error updating inventory:', error);
    addNotification('Error updating inventory', 'error', null, null);
  }
};


  const handleAdjustStock = async (item) => {
    if (adjustAmount === 0) {
      addNotification('Please enter an amount', 'error', null, null);
      return;
    }
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/inventory/${item.wineId}/adjust`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ adjustment: adjustAmount, reason: adjustReason })
      });
      
      if (response.ok) {
        addNotification(`Stock ${adjustAmount > 0 ? 'increased' : 'decreased'} by ${Math.abs(adjustAmount)}`, 'success', null, null);
        setAdjustModal(null);
        setAdjustAmount(0);
        setAdjustReason('');
        fetchInventory();
      } else {
        addNotification('Failed to adjust stock', 'error', null, null);
      }
    } catch (error) {
      addNotification('Error adjusting stock', 'error', null, null);
    }
  };

  const getStockStatus = (quantity, threshold) => {
    if (quantity === 0) return { text: 'Out of Stock', color: '#e74c3c', icon: '🔴' };
    if (quantity <= threshold) return { text: 'Low Stock', color: '#f1c40f', icon: '⚠️' };
    if (quantity <= threshold * 2) return { text: 'Running Low', color: '#e67e22', icon: '🟡' };
    return { text: 'In Stock', color: '#27ae60', icon: '✅' };
  };

  if (loading) {
    return <div className="loader-container"><div className="loader"></div><p>Loading inventory...</p></div>;
  }

  return (
    <div className="inventory-management">
      {/* Header */}
      <div className="inventory-header">
        <h2><FiPackage /> Inventory Management</h2>
        <div className="inventory-actions">
          <button onClick={fetchInventory} className="refresh-btn">
            <FiRefreshCw /> Refresh
          </button>
          <button onClick={handleInitialize} className="init-btn">
            Initialize Inventory
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="inventory-stats">
        <div className="stat-card">
          <FiPackage size={24} />
          <div>
            <span>{stats.totalItems}</span>
            <small>Total Products</small>
          </div>
        </div>
        <div className="stat-card warning">
          <FiAlertCircle size={24} />
          <div>
            <span>{stats.lowStock}</span>
            <small>Low Stock Items</small>
          </div>
        </div>
        <div className="stat-card">
          <FiTrendingUp size={24} />
          <div>
            <span>${stats.totalValue.toLocaleString()}</span>
            <small>Inventory Value</small>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Wine</th>
              <th>Winery</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Low Stock Alert</th>
              <th>Supplier</th>
              <th>Last Restocked</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => {
              const status = getStockStatus(item.quantity, item.lowStockThreshold);
              const isEditing = editingId === item._id;
              
              return (
                <tr key={item._id} className={item.quantity === 0 ? 'out-of-stock' : ''}>
                  <td className="wine-name">{item.wineName}</td>
                  <td className="winery">{item.winery || '—'}</td>
                  <td className={`stock-quantity ${item.quantity <= item.lowStockThreshold ? 'low' : ''}`}>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editForm.quantity}
                        onChange={(e) => setEditForm({...editForm, quantity: parseInt(e.target.value) || 0})}
                        className="stock-input"
                        min="0"
                      />
                    ) : (
                      <span>{item.quantity}</span>
                    )}
                  </td>
                  <td>
                    <span className="stock-status" style={{ color: status.color }}>
                      {status.icon} {status.text}
                    </span>
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editForm.lowStockThreshold}
                        onChange={(e) => setEditForm({...editForm, lowStockThreshold: parseInt(e.target.value) || 0})}
                        className="stock-input"
                        min="1"
                      />
                    ) : (
                      <span>{item.lowStockThreshold}</span>
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.supplier}
                        onChange={(e) => setEditForm({...editForm, supplier: e.target.value})}
                        className="supplier-input"
                        placeholder="Supplier name"
                      />
                    ) : (
                      <span>{item.supplier || '—'}</span>
                    )}
                  </td>
                  <td>{item.lastRestocked ? new Date(item.lastRestocked).toLocaleDateString() : '—'}</td>
                  <td className="actions">
                    {isEditing ? (
                      <>
                        {/* ✅ UPDATED BUTTON TO PASS ENTIRE ITEM */}
                        <button onClick={() => handleSaveEdit(item)} className="save-btn" title="Save">
                          <FiSave />
                        </button>
                        <button onClick={() => setEditingId(null)} className="cancel-btn" title="Cancel">
                          <FiX />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(item)} className="edit-btn" title="Edit">
                          <FiEdit />
                        </button>
                        <button onClick={() => setAdjustModal(item)} className="adjust-btn" title="Adjust Stock">
                          {item.quantity === 0 ? <FiPlus /> : <FiMinus />}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Adjust Stock Modal */}
      {adjustModal && (
        <div className="modal-overlay" onClick={() => setAdjustModal(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Adjust Stock: {adjustModal.wineName}</h3>
              <button className="modal-close" onClick={() => setAdjustModal(null)}><FiX /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Current Stock: <strong>{adjustModal.quantity}</strong></label>
              </div>
              <div className="form-group">
                <label>Adjustment Amount</label>
                <div className="adjust-buttons">
                  <button onClick={() => setAdjustAmount(prev => prev - 1)} className="adjust-btn-small">-1</button>
                  <button onClick={() => setAdjustAmount(prev => prev - 5)} className="adjust-btn-small">-5</button>
                  <input
                    type="number"
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(parseInt(e.target.value) || 0)}
                    className="adjust-input"
                  />
                  <button onClick={() => setAdjustAmount(prev => prev + 1)} className="adjust-btn-small">+1</button>
                  <button onClick={() => setAdjustAmount(prev => prev + 5)} className="adjust-btn-small">+5</button>
                </div>
                <small>Positive = Add stock | Negative = Remove stock</small>
              </div>
              <div className="form-group">
                <label>Reason for adjustment (optional)</label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g., New shipment, Damaged items, Return"
                  className="reason-input"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn cancel" onClick={() => setAdjustModal(null)}>Cancel</button>
              <button className="modal-btn confirm" onClick={() => handleAdjustStock(adjustModal)}>
                Apply Adjustment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;