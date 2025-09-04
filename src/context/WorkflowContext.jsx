import React, { createContext, useContext, useState } from 'react';

const WorkflowContext = createContext();

export function WorkflowProvider({ children, initialWorkflow = { states: [], transitions: [], roles: [] } }) {
  const [workflow, setWorkflow] = useState(initialWorkflow);
  const [selectedRoleIds, setSelectedRoleIds] = useState(initialWorkflow.roles.map(role => role.id));

  const updateStates = (newStates) => {
    setWorkflow(prev => ({ ...prev, states: newStates }));
  };

  const updateTransitions = (newTransitions) => {
    setWorkflow(prev => ({ ...prev, transitions: newTransitions }));
  };

  const updateRoles = (newRoles) => {
    setWorkflow(prev => ({ ...prev, roles: newRoles }));
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