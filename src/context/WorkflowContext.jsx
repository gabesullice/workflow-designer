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
    const currentRoleIds = workflow.roles.map(role => role.id);
    const newRoleIds = newRoles.map(role => role.id);
    
    // Find roles that were removed
    const removedRoleIds = currentRoleIds.filter(id => !newRoleIds.includes(id));
    
    // Find roles that were added
    const addedRoleIds = newRoleIds.filter(id => !currentRoleIds.includes(id));
    
    // Update selectedRoleIds: remove deleted roles, add new roles, preserve existing
    const updatedSelectedRoleIds = selectedRoleIds
      .filter(id => !removedRoleIds.includes(id)) // Remove deleted roles
      .concat(addedRoleIds); // Add new roles (auto-selected)
    
    // Update workflow data without using setWorkflow to avoid resetting selections
    setWorkflowLocalStorage({ ...workflow, roles: newRoles });
    setSelectedRoleIds(updatedSelectedRoleIds);
  };

  const updateSelectedRoleIds = (roleIds) => {
    setSelectedRoleIds(roleIds);
  };

  const resetWorkflow = () => {
    const emptyWorkflow = { states: [], transitions: [], roles: [] };
    setWorkflow(emptyWorkflow);
  };

  const loadSampleWorkflow = () => {
    const sampleWorkflow = {
      states: [
        { id: 'draft', label: 'Draft' },
        { id: 'review', label: 'In Review' },
        { id: 'approved', label: 'Approved' },
        { id: 'published', label: 'Published' }
      ],
      transitions: [
        {
          id: 'submit_for_review',
          label: 'Submit for Review',
          fromStates: ['draft'],
          toState: 'review'
        },
        {
          id: 'approve',
          label: 'Approve',
          fromStates: ['review'],
          toState: 'approved'
        },
        {
          id: 'send_back',
          label: 'Send Back',
          fromStates: ['review', 'approved'],
          toState: 'draft'
        },
        {
          id: 'publish',
          label: 'Publish',
          fromStates: ['approved'],
          toState: 'published'
        }
      ],
      roles: [
        {
          id: 'writer',
          label: 'Writer',
          permissions: ['submit_for_review']
        },
        {
          id: 'editor',
          label: 'Editor',
          permissions: ['approve', 'send_back', 'publish']
        },
        {
          id: 'admin',
          label: 'Admin',
          permissions: ['submit_for_review', 'approve', 'send_back', 'publish']
        }
      ]
    };
    setWorkflow(sampleWorkflow);
  };

  const value = {
    workflow,
    selectedRoleIds,
    updateStates,
    updateTransitions,
    updateRoles,
    updateSelectedRoleIds,
    resetWorkflow,
    loadSampleWorkflow
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