import React, { createContext, useContext, useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.js';

const WorkflowContext = createContext();

export function WorkflowProvider({ children, initialWorkflow = { states: [], transitions: [], roles: [] } }) {
  const [workflow, setWorkflowLocalStorage] = useLocalStorage('workflow', initialWorkflow);
  const [selectedRoleIds, setSelectedRoleIds] = useState(workflow.roles.map(role => role.id));

  const setWorkflow = (newWorkflow) => {
    setWorkflowLocalStorage(newWorkflow);
    setSelectedRoleIds(newWorkflow.roles.map(role => role.id));
  };

  const updateStates = (newStates) => {
    setWorkflow({ ...workflow, states: newStates });
  };

  const updateTransitions = (newTransitions) => {
    setWorkflow({ ...workflow, transitions: newTransitions });
  };

  const updateRoles = (newRoles) => {
    setWorkflow({ ...workflow, roles: newRoles });
  };

  const updateSelectedRoleIds = (roleIds) => {
    setSelectedRoleIds(roleIds);
  };

  const value = {
    workflow,
    selectedRoleIds,
    updateStates,
    updateTransitions,
    updateRoles,
    updateSelectedRoleIds
  };

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflowContext() {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflowContext must be used within a WorkflowProvider');
  }
  return context;
}