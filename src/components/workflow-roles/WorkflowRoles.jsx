import React, { useState } from 'react';
import './WorkflowRoles.css';
import { validateMachineName, generateMachineNameFromLabel } from '../../utils/machine-name.js';
import DraggableItemList from '../shared/DraggableItemList.jsx';

function RoleItem({ role, availableTransitions, onRemove, onTogglePermission }) {
  return (
    <div className="role-item-content">
      <div className="role-header">
        <strong>{role.label}</strong> (ID: {role.id})
        <button onClick={() => onRemove(role.id)}>Remove</button>
      </div>
      {availableTransitions.length > 0 && (
        <div className="role-permissions">
          <h4>Allowed Transitions:</h4>
          {availableTransitions.map(transition => (
            <label key={transition.id} className="permission-checkbox">
              <input
                type="checkbox"
                checked={role.permissions.includes(transition.id)}
                onChange={() => onTogglePermission(role.id, transition.id)}
              />
              {transition.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function WorkflowRoles({ initialRoles = [], availableTransitions = [] }) {
  console.assert(availableTransitions.length > 0 || initialRoles.length === 0, 'availableTransitions prop must not be empty when roles are provided');
  const [roles, setRoles] = useState(initialRoles);
  const [newRoleLabel, setNewRoleLabel] = useState('');
  const [validationError, setValidationError] = useState('');


  const addRole = (e) => {
    e.preventDefault();
    if (!newRoleLabel.trim()) return;
    
    const id = generateMachineNameFromLabel(newRoleLabel);
    
    if (!validateMachineName(id)) {
      setValidationError('ID must contain only lowercase letters and underscores');
      return;
    }
    
    if (roles.some(role => role.id === id)) {
      setValidationError('ID must be unique');
      return;
    }
    
    setValidationError('');
    const newRole = { id, label: newRoleLabel.trim(), permissions: [] };
    setRoles([...roles, newRole]);
    setNewRoleLabel('');
  };

  const removeRole = (roleId) => {
    setRoles(roles.filter(role => role.id !== roleId));
  };

  const togglePermission = (roleId, transitionId) => {
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        const hasPermission = role.permissions.includes(transitionId);
        const newPermissions = hasPermission
          ? role.permissions.filter(id => id !== transitionId)
          : [...role.permissions, transitionId];
        return { ...role, permissions: newPermissions };
      }
      return role;
    }));
  };


  return (
    <div>
      <h2>Workflow Roles</h2>
      <form onSubmit={addRole}>
        <input
          type="text"
          value={newRoleLabel}
          onChange={(e) => setNewRoleLabel(e.target.value)}
          placeholder="Enter role label"
        />
        <button type="submit">Add Role</button>
        {validationError && <div className="validation-error">{validationError}</div>}
      </form>
      <DraggableItemList
        items={roles}
        setItems={setRoles}
        renderItem={(role) => (
          <RoleItem 
            role={role} 
            availableTransitions={availableTransitions}
            onRemove={removeRole}
            onTogglePermission={togglePermission}
          />
        )}
        itemClassName="role-item"
      />
    </div>
  );
}

export default WorkflowRoles;