import { useState } from 'react';
import { validateMachineName, generateMachineNameFromLabel } from '../utils/machine-name.js';
import { useWorkflowContext } from '../context/WorkflowContext.jsx';

export function useWorkflowRoles() {
  const { workflow, updateRoles } = useWorkflowContext();
  const [validationError, setValidationError] = useState('');
  const roles = workflow.roles;
  const transitions = workflow.transitions;

  const addRole = (label) => {
    if (!label.trim()) {
      setValidationError('Role label is required');
      return false;
    }
    
    const id = generateMachineNameFromLabel(label);
    
    if (!validateMachineName(id)) {
      setValidationError('ID must contain only lowercase letters and underscores');
      return false;
    }
    
    if (roles.some(role => role.id === id)) {
      setValidationError('ID must be unique');
      return false;
    }
    
    setValidationError('');
    const newRole = { id, label: label.trim(), permissions: [] };
    updateRoles([...roles, newRole]);
    return true;
  };

  const removeRole = (roleId) => {
    updateRoles(roles.filter(role => role.id !== roleId));
  };

  const togglePermission = (roleId, transitionId) => {
    const updatedRoles = roles.map(role => {
      if (role.id === roleId) {
        const hasPermission = role.permissions.includes(transitionId);
        const newPermissions = hasPermission
          ? role.permissions.filter(id => id !== transitionId)
          : [...role.permissions, transitionId];
        return { ...role, permissions: newPermissions };
      }
      return role;
    });
    updateRoles(updatedRoles);
  };

  return {
    roles,
    transitions,
    addRole,
    removeRole,
    togglePermission,
    updateRoles,
    validationError,
    setValidationError
  };
}