import React, { useState, useRef } from 'react';
import './WorkflowTransitions.css';
import DraggableItemList from '../shared/DraggableItemList.jsx';
import ConfirmationModal from '../shared/ConfirmationModal.jsx';
import { useWorkflowTransitions } from '../../hooks/useWorkflowTransitions.js';

function TransitionItem({ transition, getStateLabel }) {
  return (
    <div className="transition-item-content">
      <div className="transition-header">
        <strong>{transition.label}</strong>
        <span className="item-id">{transition.id}</span>
      </div>
      <div className="transition-flow">
        {transition.fromStates.map(stateId => getStateLabel(stateId)).join(', ')} 
        <span className="transition-arrow">→</span> {getStateLabel(transition.toState)}
      </div>
    </div>
  );
}

function WorkflowTransitions() {
  const {
    transitions,
    states: availableStates,
    addTransition,
    removeTransition,
    updateTransitions,
    getStateLabel,
    hasRolePermissions,
    getAffectedRoles,
    validationError,
    setValidationError
  } = useWorkflowTransitions();
  
  const [newTransitionLabel, setNewTransitionLabel] = useState('');
  const [selectedFromStates, setSelectedFromStates] = useState([]);
  const [selectedToState, setSelectedToState] = useState('');
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    transitionId: null,
    transitionLabel: '',
    affectedRoles: []
  });
  const inputRef = useRef(null);


  const handleAddTransition = (e) => {
    e.preventDefault();
    const success = addTransition(newTransitionLabel, selectedFromStates, selectedToState);
    if (success) {
      setNewTransitionLabel('');
      setSelectedFromStates([]);
      setSelectedToState('');
      setIsFormExpanded(false);
    }
  };

  const handleExpandForm = () => {
    setIsFormExpanded(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };


  const handleFromStateChange = (stateId) => {
    setSelectedFromStates(prev => 
      prev.includes(stateId) 
        ? prev.filter(id => id !== stateId)
        : [...prev, stateId]
    );
  };

  const handleRemoveTransition = (transitionId) => {
    const transition = transitions.find(t => t.id === transitionId);
    
    if (hasRolePermissions(transitionId)) {
      const affectedRoles = getAffectedRoles(transitionId);
      setConfirmationModal({
        isOpen: true,
        transitionId,
        transitionLabel: transition.label,
        affectedRoles
      });
    } else {
      removeTransition(transitionId);
    }
  };

  const handleConfirmRemoval = () => {
    removeTransition(confirmationModal.transitionId);
    setConfirmationModal({
      isOpen: false,
      transitionId: null,
      transitionLabel: '',
      affectedRoles: []
    });
  };

  const handleCancelRemoval = () => {
    setConfirmationModal({
      isOpen: false,
      transitionId: null,
      transitionLabel: '',
      affectedRoles: []
    });
  };



  return (
    <div className="workflow-transitions">
      <h2>Transitions</h2>
      <DraggableItemList
        items={transitions}
        setItems={updateTransitions}
        renderItem={(transition) => (
          <TransitionItem 
            transition={transition}
            getStateLabel={getStateLabel}
          />
        )}
        itemClassName="transition-item"
        onDelete={(transition) => handleRemoveTransition(transition.id)}
      />
      {!isFormExpanded ? (
        <button onClick={handleExpandForm} className="add-item-trigger">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>Add Transition</span>
        </button>
      ) : (
        <form onSubmit={handleAddTransition} className="add-item-form add-transition-form">
        <div className="form-field">
          <input
            ref={inputRef}
            type="text"
            className="form-input"
            value={newTransitionLabel}
            onChange={(e) => setNewTransitionLabel(e.target.value)}
            placeholder="Enter transition label"
          />
        </div>
        <div className="form-fields-row">
          <div className="form-field">
            <label>From States:</label>
            <div className="checkbox-group">
              {availableStates.map(state => (
                <label key={state.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={selectedFromStates.includes(state.id)}
                    onChange={() => handleFromStateChange(state.id)}
                  />
                  <span>{state.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="form-field">
            <label>To State:</label>
            <div className="radio-group">
              {availableStates.map(state => (
                <label key={state.id} className="radio-item">
                  <input
                    type="radio"
                    name="toState"
                    value={state.id}
                    checked={selectedToState === state.id}
                    onChange={(e) => setSelectedToState(e.target.value)}
                  />
                  <span>{state.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Add Transition</button>
          <button type="button" onClick={() => setIsFormExpanded(false)} className="btn btn-secondary">Cancel</button>
        </div>
        {validationError && <div className="validation-error">{validationError}</div>}
      </form>
      )}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onConfirm={handleConfirmRemoval}
        onCancel={handleCancelRemoval}
        title="Remove Transition"
        message={`Removing "${confirmationModal.transitionLabel}" will also remove permissions for these roles: ${confirmationModal.affectedRoles.join(', ')}. Are you sure you want to continue?`}
        confirmText="Remove"
        cancelText="Cancel"
      />
    </div>
  );
}

export default WorkflowTransitions;