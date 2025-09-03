import React, { useState } from 'react';
import './WorkflowTransitions.css';
import DraggableItemList from '../shared/DraggableItemList.jsx';
import ConfirmationModal from '../shared/ConfirmationModal.jsx';
import { useWorkflowTransitions } from '../../hooks/useWorkflowTransitions.js';

function TransitionItem({ transition, getStateLabel, onRemove }) {
  return (
    <div className="transition-item-content">
      <strong>{transition.label}</strong> (ID: {transition.id})
      <div className="transition-flow">
        {transition.fromStates.map(stateId => getStateLabel(stateId)).join(', ')} 
        → {getStateLabel(transition.toState)}
      </div>
      <button onClick={() => onRemove(transition.id)}>Remove</button>
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
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    transitionId: null,
    transitionLabel: '',
    affectedRoles: []
  });


  const handleAddTransition = (e) => {
    e.preventDefault();
    const success = addTransition(newTransitionLabel, selectedFromStates, selectedToState);
    if (success) {
      setNewTransitionLabel('');
      setSelectedFromStates([]);
      setSelectedToState('');
    }
  };


  const handleFromStatesChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedFromStates(selectedOptions);
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
    <div>
      <h2>Workflow Transitions</h2>
      <form onSubmit={handleAddTransition}>
        <div>
          <input
            type="text"
            value={newTransitionLabel}
            onChange={(e) => setNewTransitionLabel(e.target.value)}
            placeholder="Enter transition label"
          />
        </div>
        <div>
          <label>From States (hold Ctrl/Cmd to select multiple):</label>
          <select
            multiple
            value={selectedFromStates}
            onChange={handleFromStatesChange}
            size="4"
          >
            {availableStates.map(state => (
              <option key={state.id} value={state.id}>
                {state.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>To State:</label>
          <select
            value={selectedToState}
            onChange={(e) => setSelectedToState(e.target.value)}
          >
            <option value="">Select destination state</option>
            {availableStates.map(state => (
              <option key={state.id} value={state.id}>
                {state.label}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Add Transition</button>
        {validationError && <div className="validation-error">{validationError}</div>}
      </form>
      <DraggableItemList
        items={transitions}
        setItems={updateTransitions}
        renderItem={(transition) => (
          <TransitionItem 
            transition={transition}
            getStateLabel={getStateLabel}
            onRemove={handleRemoveTransition}
          />
        )}
        itemClassName="transition-item"
      />
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