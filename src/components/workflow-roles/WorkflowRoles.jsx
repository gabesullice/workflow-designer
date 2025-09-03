import React, { useState } from 'react';
import './WorkflowRoles.css';

function WorkflowRoles({ initialRoles = [] }) {
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
    const newRole = { id, label: newRoleLabel.trim() };
    setRoles([...roles, newRole]);
    setNewRoleLabel('');
  };

  const removeRole = (roleId) => {
    setRoles(roles.filter(role => role.id !== roleId));
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
            <strong>{role.label}</strong> (ID: {role.id})
            <button onClick={() => removeRole(role.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WorkflowRoles;