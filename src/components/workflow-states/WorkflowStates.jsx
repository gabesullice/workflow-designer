import React, { useState } from 'react';
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


  const handleAddState = (e) => {
    e.preventDefault();
    if (addState(newStateLabel)) {
      setNewStateLabel('');
    }
  };

  return (
    <div>
      <h2>States</h2>
      <DraggableItemList
        items={states}
        setItems={updateStates}
        renderItem={(state) => <StateItem state={state} />}
        itemClassName="state-item"
        onDelete={(state) => removeState(state.id)}
      />
      <form onSubmit={handleAddState} className="add-state-form">
        <input
          type="text"
          value={newStateLabel}
          onChange={(e) => setNewStateLabel(e.target.value)}
          placeholder="Enter state label"
        />
        <button type="submit">Add State</button>
        {validationError && <div className="validation-error">{validationError}</div>}
      </form>
    </div>
  );
}

export default WorkflowStates;