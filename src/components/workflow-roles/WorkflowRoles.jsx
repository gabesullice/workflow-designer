import React, { useState, useRef } from 'react';
import './WorkflowRoles.css';
import DraggableItemList from '../shared/DraggableItemList.jsx';
import { useWorkflowContext } from '../../context/WorkflowContext.jsx';

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

function WorkflowRoles({ 
  onAddRole, 
  onRemoveRole, 
  onTogglePermission, 
  validationError, 
  isFormExpanded,
  setIsFormExpanded 
}) {
  const { workflow: { roles, transitions: availableTransitions }, updateRoles } = useWorkflowContext();
  
  const [newRoleLabel, setNewRoleLabel] = useState('');
  const inputRef = useRef(null);


  const handleAddRole = (e) => {
    e.preventDefault();
    const success = onAddRole(newRoleLabel);
    if (success) {
      setNewRoleLabel('');
    }
  };

  const handleExpandForm = () => {
    setIsFormExpanded(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <div className="workflow-roles">
      <h2>Roles</h2>
      <DraggableItemList
        items={roles}
        setItems={updateRoles}
        renderItem={(role) => (
          <RoleItem 
            role={role} 
            availableTransitions={availableTransitions}
            onTogglePermission={onTogglePermission}
          />
        )}
        itemClassName="role-item"
        onDelete={(role) => onRemoveRole(role.id)}
      />
      {!isFormExpanded ? (
        <button onClick={handleExpandForm} className="add-item-trigger">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>Add Role</span>
        </button>
      ) : (
        <form onSubmit={handleAddRole} className="add-item-form add-role-form">
          <input
            ref={inputRef}
            type="text"
            className="form-input"
            value={newRoleLabel}
            onChange={(e) => setNewRoleLabel(e.target.value)}
            placeholder="Enter role label"
          />
          <button type="submit" className="btn btn-primary">Add Role</button>
          <button type="button" onClick={() => setIsFormExpanded(false)} className="btn btn-secondary">Cancel</button>
          {validationError && <div className="validation-error">{validationError}</div>}
        </form>
      )}
    </div>
  );
}

export default WorkflowRoles;