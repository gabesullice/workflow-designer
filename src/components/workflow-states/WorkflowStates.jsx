import React, { useState } from 'react';
import './WorkflowStates.css';
import { validateMachineName, generateMachineNameFromLabel } from '../../utils/machine-name.js';
import DraggableItemList from '../shared/DraggableItemList.jsx';

function StateItem({ state, onRemove }) {
  return (
    <div className="state-item-content">
      <strong>{state.label}</strong> (ID: {state.id})
      <button onClick={() => onRemove(state.id)}>Remove</button>
    </div>
  );
}

function WorkflowStates({ initialStates = [] }) {
  const [states, setStates] = useState(initialStates);
  const [newStateLabel, setNewStateLabel] = useState('');
  const [validationError, setValidationError] = useState('');


  const addState = (e) => {
    e.preventDefault();
    if (!newStateLabel.trim()) return;
    
    const id = generateMachineNameFromLabel(newStateLabel);
    
    if (!validateMachineName(id)) {
      setValidationError('ID must contain only lowercase letters and underscores');
      return;
    }
    
    if (states.some(state => state.id === id)) {
      setValidationError('ID must be unique');
      return;
    }
    
    setValidationError('');
    const newState = { id, label: newStateLabel.trim() };
    setStates([...states, newState]);
    setNewStateLabel('');
  };

  const removeState = (stateId) => {
    setStates(states.filter(state => state.id !== stateId));
  };


  return (
    <div>
      <h2>Workflow States</h2>
      <form onSubmit={addState}>
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
        setItems={setStates}
        renderItem={(state) => <StateItem state={state} onRemove={removeState} />}
        itemClassName="state-item"
      />
    </div>
  );
}

export default WorkflowStates;