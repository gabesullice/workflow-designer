import React, { createContext, useContext, useState } from 'react';

const WorkflowContext = createContext();

export function WorkflowProvider({ children, initialWorkflow = { states: [], transitions: [], roles: [] } }) {
  const [workflow, setWorkflow] = useState(initialWorkflow);

  const updateStates = (newStates) => {
    setWorkflow(prev => ({ ...prev, states: newStates }));
  };

  const updateTransitions = (newTransitions) => {
    setWorkflow(prev => ({ ...prev, transitions: newTransitions }));
  };

  const updateRoles = (newRoles) => {
    setWorkflow(prev => ({ ...prev, roles: newRoles }));
  };

  const value = {
    workflow,
    updateStates,
    updateTransitions,
    updateRoles
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