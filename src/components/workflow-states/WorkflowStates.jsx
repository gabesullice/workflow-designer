import React, { useState } from 'react';
import './WorkflowStates.css';
import { useWorkflowStates } from '../../hooks/useWorkflowStates.js';
import DraggableItemList from '../shared/DraggableItemList.jsx';

function StateItem({ state, onRemove }) {
  return (
    <div className="state-item-content">
      <strong>{state.label}</strong> (ID: {state.id})
      <button onClick={() => onRemove(state.id)}>Remove</button>
    </div>
  );
}

function WorkflowStates() {
  const { states, addState, removeState, updateStates, validationError, setValidationError } = useWorkflowStates();
  const [newStateLabel, setNewStateLabel] = useState('');


  const handleAddState = (e) => {
    e.preventDefault();
    if (addState(newStateLabel)) {
      setNewStateLabel('');
    }
  };

  return (
    <div>
      <h2>Workflow States</h2>
      <form onSubmit={handleAddState}>
        <input
          type="text"
          value={newStateLabel}
          onChange={(e) => setNewStateLabel(e.target.value)}
          placeholder="Enter state label"
        />
        <button type="submit">Add State</button>
        {validationError && <div className="validation-error">{validationError}</div>}
      </form>
      <DraggableItemList
        items={states}
        setItems={updateStates}
        renderItem={(state) => <StateItem state={state} onRemove={removeState} />}
        itemClassName="state-item"
      />
    </div>
  );
}

export default WorkflowStates;