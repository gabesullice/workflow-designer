import React, { useState, useRef } from 'react';
import './WorkflowStates.css';
import { useWorkflowStates } from '../../hooks/useWorkflowStates.js';
import DraggableItemList from '../shared/DraggableItemList.jsx';

function StateItem({ state }) {
  return (
    <div className="state-item-content">
      <strong>{state.label}</strong>
      <span className="item-id">{state.id}</span>
    </div>
  );
}

function WorkflowStates() {
  const { states, addState, removeState, updateStates, validationError, setValidationError } = useWorkflowStates();
  const [newStateLabel, setNewStateLabel] = useState('');
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const inputRef = useRef(null);


  const handleAddState = (e) => {
    e.preventDefault();
    if (addState(newStateLabel)) {
      setNewStateLabel('');
      setIsFormExpanded(false);
    }
  };

  const handleExpandForm = () => {
    setIsFormExpanded(true);
    // Focus the input after the form expands
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <div className="workflow-states">
      <h2>States</h2>
      <DraggableItemList
        items={states}
        setItems={updateStates}
        renderItem={(state) => <StateItem state={state} />}
        itemClassName="state-item"
        onDelete={(state) => removeState(state.id)}
      />
      {!isFormExpanded ? (
        <button onClick={handleExpandForm} className="add-item-trigger">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>Add State</span>
        </button>
      ) : (
        <form onSubmit={handleAddState} className="add-item-form add-state-form">
          <input
            ref={inputRef}
            type="text"
            className="form-input"
            value={newStateLabel}
            onChange={(e) => setNewStateLabel(e.target.value)}
            placeholder="Enter state label"
          />
          <button type="submit" className="btn btn-primary">Add State</button>
          <button type="button" onClick={() => setIsFormExpanded(false)} className="btn btn-secondary">Cancel</button>
          {validationError && <div className="validation-error">{validationError}</div>}
        </form>
      )}
    </div>
  );
}

export default WorkflowStates;