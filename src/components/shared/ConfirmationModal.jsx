import React from 'react';
import './ConfirmationModal.css';

function ConfirmationModal({ isOpen, onConfirm, onCancel, title, message, confirmText = "Yes", cancelText = "No" }) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button 
            className="modal-button modal-button-cancel" 
            onClick={onCancel}
            autoFocus
          >
            {cancelText}
          </button>
          <button 
            className="modal-button modal-button-confirm" 
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;