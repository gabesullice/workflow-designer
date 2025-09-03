import { useState } from 'react';
import { validateMachineName, generateMachineNameFromLabel } from '../utils/machine-name.js';
import { useWorkflowContext } from '../context/WorkflowContext.jsx';

export function useWorkflowStates() {
  const { workflow, updateStates } = useWorkflowContext();
  const [validationError, setValidationError] = useState('');
  const states = workflow.states;

  const addState = (label) => {
    if (!label.trim()) {
      setValidationError('State label is required');
      return false;
    }
    
    const id = generateMachineNameFromLabel(label);
    
    if (!validateMachineName(id)) {
      setValidationError('ID must contain only lowercase letters and underscores');
      return false;
    }
    
    if (states.some(state => state.id === id)) {
      setValidationError('ID must be unique');
      return false;
    }
    
    setValidationError('');
    const newState = { id, label: label.trim() };
    updateStates([...states, newState]);
    return true;
  };

  const removeState = (stateId) => {
    updateStates(states.filter(state => state.id !== stateId));
  };

  return {
    states,
    addState,
    removeState,
    validationError,
    setValidationError
  };
}