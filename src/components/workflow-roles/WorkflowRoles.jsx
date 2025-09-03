import React, { useState } from 'react';
import './WorkflowRoles.css';
import DraggableItemList from '../shared/DraggableItemList.jsx';
import { useWorkflowRoles } from '../../hooks/useWorkflowRoles.js';

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

function WorkflowRoles() {
  const {
    roles,
    transitions: availableTransitions,
    addRole,
    removeRole,
    togglePermission,
    updateRoles,
    validationError,
    setValidationError
  } = useWorkflowRoles();
  
  const [newRoleLabel, setNewRoleLabel] = useState('');


  const handleAddRole = (e) => {
    e.preventDefault();
    const success = addRole(newRoleLabel);
    if (success) {
      setNewRoleLabel('');
    }
  };




  return (
    <div>
      <h2>Workflow Roles</h2>
      <form onSubmit={handleAddRole}>
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
        setItems={updateRoles}
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