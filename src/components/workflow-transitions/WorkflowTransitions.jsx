import React, { useState } from 'react';
import './WorkflowTransitions.css';
import { validateMachineName, generateMachineNameFromLabel } from '../../utils/machine-name.js';
import DraggableItemList from '../shared/DraggableItemList.jsx';

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

function WorkflowTransitions({ initialTransitions = [], allowedStates = [] }) {
  console.assert(allowedStates.length > 0 || initialTransitions.length === 0, 'allowedStates prop must not be empty when transitions are provided');
  
  const [transitions, setTransitions] = useState(initialTransitions);
  const [newTransitionLabel, setNewTransitionLabel] = useState('');
  const [selectedFromStates, setSelectedFromStates] = useState([]);
  const [selectedToState, setSelectedToState] = useState('');
  const [validationError, setValidationError] = useState('');

  const availableStates = allowedStates;


  const addTransition = (e) => {
    e.preventDefault();
    if (!newTransitionLabel.trim()) {
      setValidationError('Transition label is required');
      return;
    }
    
    if (selectedFromStates.length === 0) {
      setValidationError('At least one "from" state must be selected');
      return;
    }
    
    if (!selectedToState) {
      setValidationError('A "to" state must be selected');
      return;
    }
    
    const id = generateMachineNameFromLabel(newTransitionLabel);
    
    if (!validateMachineName(id)) {
      setValidationError('ID must contain only lowercase letters and underscores');
      return;
    }
    
    if (transitions.some(transition => transition.id === id)) {
      setValidationError('ID must be unique');
      return;
    }
    
    setValidationError('');
    const newTransition = {
      id,
      label: newTransitionLabel.trim(),
      fromStates: [...selectedFromStates],
      toState: selectedToState
    };
    setTransitions([...transitions, newTransition]);
    setNewTransitionLabel('');
    setSelectedFromStates([]);
    setSelectedToState('');
  };

  const removeTransition = (transitionId) => {
    setTransitions(transitions.filter(transition => transition.id !== transitionId));
  };

  const handleFromStatesChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedFromStates(selectedOptions);
  };

  const getStateLabel = (stateId) => {
    const state = availableStates.find(s => s.id === stateId);
    return state ? state.label : stateId;
  };


  return (
    <div>
      <h2>Workflow Transitions</h2>
      <form onSubmit={addTransition}>
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
        setItems={setTransitions}
        renderItem={(transition) => (
          <TransitionItem 
            transition={transition}
            getStateLabel={getStateLabel}
            onRemove={removeTransition}
          />
        )}
        itemClassName="transition-item"
      />
    </div>
  );
}

export default WorkflowTransitions;