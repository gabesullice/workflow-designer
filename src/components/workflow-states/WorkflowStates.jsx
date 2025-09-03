import React, { useState } from 'react';
import './WorkflowStates.css';

function WorkflowStates({ initialStates = [] }) {
  const [states, setStates] = useState(initialStates);
  const [newStateLabel, setNewStateLabel] = useState('');
  const [validationError, setValidationError] = useState('');
  const [draggedIndex, setDraggedIndex] = useState(null);

  const validateId = (id) => {
    const validIdPattern = /^[a-z_]+$/;
    return validIdPattern.test(id);
  };

  const addState = (e) => {
    e.preventDefault();
    if (!newStateLabel.trim()) return;
    
    const id = newStateLabel.toLowerCase().replace(/\s+/g, '_');
    
    if (!validateId(id)) {
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

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newStates = [...states];
    const draggedItem = newStates[draggedIndex];
    
    newStates.splice(draggedIndex, 1);
    newStates.splice(dropIndex, 0, draggedItem);
    
    setStates(newStates);
    setDraggedIndex(null);
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
      <ul>
        {states.map((state, index) => (
          <li 
            key={state.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`state-item ${draggedIndex === index ? 'dragging' : ''}`}
          >
            <strong>{state.label}</strong> (ID: {state.id})
            <button onClick={() => removeState(state.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WorkflowStates;