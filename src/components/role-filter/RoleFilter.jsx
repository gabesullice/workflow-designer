import React from 'react';
import { useWorkflowContext } from '../../context/WorkflowContext.jsx';
import './RoleFilter.css';

function RoleFilter() {
  const { workflow, selectedRoleIds, updateSelectedRoleIds } = useWorkflowContext();

  if (workflow.roles.length === 0) {
    return null;
  }

  const handleRoleToggle = (roleId) => {
    const newSelectedRoleIds = selectedRoleIds.includes(roleId)
      ? selectedRoleIds.filter(id => id !== roleId)
      : [...selectedRoleIds, roleId];
    
    updateSelectedRoleIds(newSelectedRoleIds);
  };

  const handleSelectAll = () => {
    updateSelectedRoleIds([]);
  };

  const allSelected = selectedRoleIds.length === 0;

  return (
    <div className="role-filter">
      <h3>Filter by Role</h3>
      <div className="role-filter-controls">
        <button 
          className={`role-toggle-button ${allSelected ? 'active' : ''}`}
          onClick={handleSelectAll}
        >
          All Roles
        </button>
        {workflow.roles.map(role => (
          <button
            key={role.id}
            className={`role-toggle-button ${selectedRoleIds.includes(role.id) ? 'active' : ''}`}
            onClick={() => handleRoleToggle(role.id)}
          >
            {role.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default RoleFilter;