import React, { useState } from 'react';
import './WorkflowRoles.css';
import DraggableItemList from '../shared/DraggableItemList.jsx';
import { useWorkflowRoles } from '../../hooks/useWorkflowRoles.js';

function RoleItem({ role, availableTransitions, onTogglePermission }) {
  return (
    <div className="role-item-content">
      <div className="role-header">
        <strong>{role.label}</strong>
        <span className="item-id">{role.id}</span>
      </div>
      {availableTransitions.length > 0 && (
        <div className="role-permissions">
          <div className="permission-checkboxes">
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
      <h2>Roles</h2>
      <DraggableItemList
        items={roles}
        setItems={updateRoles}
        renderItem={(role) => (
          <RoleItem 
            role={role} 
            availableTransitions={availableTransitions}
            onTogglePermission={togglePermission}
          />
        )}
        itemClassName="role-item"
        onDelete={(role) => removeRole(role.id)}
      />
      <form onSubmit={handleAddRole} className="add-role-form">
        <input
          type="text"
          value={newRoleLabel}
          onChange={(e) => setNewRoleLabel(e.target.value)}
          placeholder="Enter role label"
        />
        <button type="submit">Add Role</button>
        {validationError && <div className="validation-error">{validationError}</div>}
      </form>
    </div>
  );
}

export default WorkflowRoles;