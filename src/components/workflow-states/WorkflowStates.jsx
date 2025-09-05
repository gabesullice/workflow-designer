import React, { useState, useRef } from 'react';
import './WorkflowStates.css';
import { useWorkflowStates } from '../../hooks/useWorkflowStates.js';
import { useWorkflowContext } from '../../context/WorkflowContext.jsx';
import DraggableItemList from '../shared/DraggableItemList.jsx';

function StateItem({ state }) {
  const { hiddenStateIds, updateHiddenStateIds } = useWorkflowContext();
  const isHidden = hiddenStateIds.includes(state.id);

  const handleToggleVisibility = () => {
    updateHiddenStateIds(state.id, !isHidden);
  };

  return (
    <div className="state-item-content">
      <div className="state-info">
        <strong>{state.label}</strong>
        <span className="item-id">{state.id}</span>
      </div>
      <button 
        onClick={handleToggleVisibility}
        className={`visibility-toggle ${isHidden ? 'hidden' : 'visible'}`}
        title={isHidden ? 'Show state' : 'Hide state'}
        type="button"
      >
        {isHidden ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        )}
      </button>
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