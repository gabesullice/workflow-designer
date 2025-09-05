import { useState } from 'react';
import { validateMachineName, generateMachineNameFromLabel } from '../utils/machine-name.js';
import { useWorkflowContext } from '../context/WorkflowContext.jsx';

export function useWorkflowTransitions() {
  const { workflow, updateTransitions, removeTransition } = useWorkflowContext();
  const [validationError, setValidationError] = useState('');
  const transitions = workflow.transitions;
  const states = workflow.states;
  const roles = workflow.roles;

  const addTransition = (label, fromStates, toState) => {
    if (!label.trim()) {
      setValidationError('Transition label is required');
      return false;
    }
    
    if (fromStates.length === 0) {
      setValidationError('At least one "from" state must be selected');
      return false;
    }
    
    if (!toState) {
      setValidationError('A "to" state must be selected');
      return false;
    }
    
    const id = generateMachineNameFromLabel(label);
    
    if (!validateMachineName(id)) {
      setValidationError('ID must contain only lowercase letters and underscores');
      return false;
    }
    
    if (transitions.some(transition => transition.id === id)) {
      setValidationError('ID must be unique');
      return false;
    }
    
    setValidationError('');
    const newTransition = {
      id,
      label: label.trim(),
      fromStates: [...fromStates],
      toState
    };
    updateTransitions([...transitions, newTransition]);
    return true;
  };


  const hasRolePermissions = (transitionId) => {
    return roles.some(role => role.permissions.includes(transitionId));
  };

  const getAffectedRoles = (transitionId) => {
    return roles
      .filter(role => role.permissions.includes(transitionId))
      .map(role => role.label);
  };

  const getStateLabel = (stateId) => {
    const state = states.find(s => s.id === stateId);
    return state ? state.label : stateId;
  };

  return {
    transitions,
    states,
    addTransition,
    removeTransition,
    updateTransitions,
    getStateLabel,
    hasRolePermissions,
    getAffectedRoles,
    validationError,
    setValidationError
  };
}