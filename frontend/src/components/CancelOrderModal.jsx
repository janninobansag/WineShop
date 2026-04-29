import React, { useState } from 'react';
import { FiX, FiAlertCircle } from 'react-icons/fi';
import '../App.css';

const CancelOrderModal = ({ isOpen, onClose, onSubmit, orderNumber }) => {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!reason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }
    
    setSubmitting(true);
    await onSubmit(reason);
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Cancel Order</h3>
          <button className="modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="modal-warning">
            <FiAlertCircle />
            <p>Are you sure you want to cancel order <strong>#{orderNumber}</strong>?</p>
          </div>
          
          <div className="form-group">
            <label>Reason for cancellation *</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please tell us why you want to cancel this order..."
              className="checkout-textarea"
              rows="4"
              disabled={submitting}
            />
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="modal-btn cancel" onClick={onClose} disabled={submitting}>
            Go Back
          </button>
          <button className="modal-btn confirm" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Cancellation Request'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;