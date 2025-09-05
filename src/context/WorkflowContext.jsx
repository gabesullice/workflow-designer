import React, { createContext, useContext, useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { removeWorkflowFromUrl } from '../utils/workflow-sharing.js';
import { validateMachineName, generateMachineNameFromLabel } from '../utils/machine-name.js';

const WorkflowContext = createContext();

export function WorkflowProvider({ children, initialWorkflow }) {
  const [workflow, setWorkflowLocalStorage] = useLocalStorage('workflow', initialWorkflow);
  const [selectedRoleIds, setSelectedRoleIds] = useState(workflow.roles.map(role => role.id));
  const [hiddenStateIds, setHiddenStateIds] = useState([]);

  const setWorkflow = (newWorkflow) => {
    setWorkflowLocalStorage(newWorkflow);
    setSelectedRoleIds(newWorkflow.roles.map(role => role.id));
    setHiddenStateIds([]);
    removeWorkflowFromUrl();
  };

  const updateStates = (newStates) => {
    const currentStateIds = workflow.states.map(state => state.id);
    const newStateIds = newStates.map(state => state.id);
    
    // Find states that were removed
    const removedStateIds = currentStateIds.filter(id => !newStateIds.includes(id));
    
    // Remove any hidden states that no longer exist
    const updatedHiddenStateIds = hiddenStateIds.filter(id => !removedStateIds.includes(id));
    
    setWorkflowLocalStorage({ ...workflow, states: newStates });
    setHiddenStateIds(updatedHiddenStateIds);
    removeWorkflowFromUrl();
  };

  const updateTransitions = (newTransitions) => {
    setWorkflow({ ...workflow, transitions: newTransitions });
  };

  const removeTransition = (transitionId) => {
    // Filter out the transition
    const updatedTransitions = workflow.transitions.filter(transition => transition.id !== transitionId);
    
    // Update roles to remove permissions for this transition
    const updatedRoles = workflow.roles.map(role => ({
      ...role,
      permissions: role.permissions.filter(permission => permission !== transitionId)
    }));
    
    // Update both transitions and roles atomically
    setWorkflow({ 
      ...workflow, 
      transitions: updatedTransitions,
      roles: updatedRoles 
    });
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
    removeWorkflowFromUrl();
  };

  const updateSelectedRoleIds = (roleIds) => {
    setSelectedRoleIds(roleIds);
  };

  const updateHiddenStateIds = (stateId, isHidden) => {
    if (isHidden) {
      setHiddenStateIds([...hiddenStateIds, stateId]);
    } else {
      setHiddenStateIds(hiddenStateIds.filter(id => id !== stateId));
    }
  };

  const resetWorkflow = () => {
    const emptyWorkflow = { states: [], transitions: [], roles: [] };
    setWorkflow(emptyWorkflow);
  };

  const addState = (label) => {
    if (!label.trim()) {
      return { success: false, error: 'State label is required' };
    }
    
    const id = generateMachineNameFromLabel(label);
    
    if (!validateMachineName(id)) {
      return { success: false, error: 'ID must contain only lowercase letters and underscores' };
    }
    
    if (workflow.states.some(state => state.id === id)) {
      return { success: false, error: 'ID must be unique' };
    }
    
    const newState = { id, label: label.trim() };
    const updatedWorkflow = {
      ...workflow,
      states: [...workflow.states, newState]
    };
    setWorkflowLocalStorage(updatedWorkflow);
    removeWorkflowFromUrl();
    return { success: true };
  };

  const removeState = (stateId) => {
    // Find transitions that reference this state
    const referencingTransitions = workflow.transitions.filter(transition => 
      transition.fromStates.includes(stateId) || transition.toState === stateId
    );
    
    // Remove the state and all referencing transitions
    const updatedStates = workflow.states.filter(state => state.id !== stateId);
    const updatedTransitions = workflow.transitions.filter(transition => 
      !transition.fromStates.includes(stateId) && transition.toState !== stateId
    );
    
    // Remove role permissions for deleted transitions
    const deletedTransitionIds = referencingTransitions.map(t => t.id);
    const updatedRoles = workflow.roles.map(role => ({
      ...role,
      permissions: role.permissions.filter(permission => 
        !deletedTransitionIds.includes(permission)
      )
    }));
    
    const updatedHiddenStateIds = hiddenStateIds.filter(id => id !== stateId);
    
    setWorkflowLocalStorage({ 
      ...workflow, 
      states: updatedStates,
      transitions: updatedTransitions,
      roles: updatedRoles
    });
    setHiddenStateIds(updatedHiddenStateIds);
    removeWorkflowFromUrl();
    return { success: true };
  };

  const addTransition = (label, fromStates, toState) => {
    if (!label.trim()) {
      return { success: false, error: 'Transition label is required' };
    }
    
    if (fromStates.length === 0) {
      return { success: false, error: 'At least one "from" state must be selected' };
    }
    
    if (!toState) {
      return { success: false, error: 'A "to" state must be selected' };
    }
    
    const id = generateMachineNameFromLabel(label);
    
    if (!validateMachineName(id)) {
      return { success: false, error: 'ID must contain only lowercase letters and underscores' };
    }
    
    if (workflow.transitions.some(transition => transition.id === id)) {
      return { success: false, error: 'ID must be unique' };
    }
    
    const newTransition = {
      id,
      label: label.trim(),
      fromStates: [...fromStates],
      toState
    };
    
    const updatedWorkflow = {
      ...workflow,
      transitions: [...workflow.transitions, newTransition]
    };
    setWorkflowLocalStorage(updatedWorkflow);
    removeWorkflowFromUrl();
    return { success: true };
  };

  const addRole = (label) => {
    if (!label.trim()) {
      return { success: false, error: 'Role label is required' };
    }
    
    const id = generateMachineNameFromLabel(label);
    
    if (!validateMachineName(id)) {
      return { success: false, error: 'ID must contain only lowercase letters and underscores' };
    }
    
    if (workflow.roles.some(role => role.id === id)) {
      return { success: false, error: 'ID must be unique' };
    }
    
    const newRole = { id, label: label.trim(), permissions: [] };
    const updatedWorkflow = {
      ...workflow,
      roles: [...workflow.roles, newRole]
    };
    setWorkflowLocalStorage(updatedWorkflow);
    setSelectedRoleIds([...selectedRoleIds, id]);
    removeWorkflowFromUrl();
    return { success: true };
  };

  const removeRole = (roleId) => {
    const updatedRoles = workflow.roles.filter(role => role.id !== roleId);
    const updatedSelectedRoleIds = selectedRoleIds.filter(id => id !== roleId);
    
    setWorkflowLocalStorage({ ...workflow, roles: updatedRoles });
    setSelectedRoleIds(updatedSelectedRoleIds);
    removeWorkflowFromUrl();
    return { success: true };
  };

  const togglePermission = (roleId, transitionId) => {
    const updatedRoles = workflow.roles.map(role => {
      if (role.id === roleId) {
        const hasPermission = role.permissions.includes(transitionId);
        const newPermissions = hasPermission
          ? role.permissions.filter(id => id !== transitionId)
          : [...role.permissions, transitionId];
        return { ...role, permissions: newPermissions };
      }
      return role;
    });
    
    setWorkflowLocalStorage({ ...workflow, roles: updatedRoles });
    removeWorkflowFromUrl();
    return { success: true };
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
    hiddenStateIds,
    updateStates,
    updateTransitions,
    removeTransition,
    updateRoles,
    updateSelectedRoleIds,
    updateHiddenStateIds,
    resetWorkflow,
    loadSampleWorkflow,
    addState,
    removeState,
    addTransition,
    addRole,
    removeRole,
    togglePermission
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