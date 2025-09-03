import React, { useState } from 'react';
import './WorkflowRoles.css';

function WorkflowRoles({ initialRoles = [], availableTransitions = [] }) {
  console.assert(availableTransitions.length > 0 || initialRoles.length === 0, 'availableTransitions prop must not be empty when roles are provided');
  const [roles, setRoles] = useState(initialRoles);
  const [newRoleLabel, setNewRoleLabel] = useState('');
  const [validationError, setValidationError] = useState('');
  const [draggedIndex, setDraggedIndex] = useState(null);

  const validateId = (id) => {
    const validIdPattern = /^[a-z_]+$/;
    return validIdPattern.test(id);
  };

  const addRole = (e) => {
    e.preventDefault();
    if (!newRoleLabel.trim()) return;
    
    const id = newRoleLabel.toLowerCase().replace(/\s+/g, '_');
    
    if (!validateId(id)) {
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

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newRoles = [...roles];
    const draggedItem = newRoles[draggedIndex];
    
    newRoles.splice(draggedIndex, 1);
    newRoles.splice(dropIndex, 0, draggedItem);
    
    setRoles(newRoles);
    setDraggedIndex(null);
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
      <ul>
        {roles.map((role, index) => (
          <li 
            key={role.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`role-item ${draggedIndex === index ? 'dragging' : ''}`}
          >
            <div className="role-header">
              <strong>{role.label}</strong> (ID: {role.id})
              <button onClick={() => removeRole(role.id)}>Remove</button>
            </div>
            {availableTransitions.length > 0 && (
              <div className="role-permissions">
                <h4>Allowed Transitions:</h4>
                {availableTransitions.map(transition => (
                  <label key={transition.id} className="permission-checkbox">
                    <input
                      type="checkbox"
                      checked={role.permissions.includes(transition.id)}
                      onChange={() => togglePermission(role.id, transition.id)}
                    />
                    {transition.label}
                  </label>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WorkflowRoles;