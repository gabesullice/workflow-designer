import React from 'react';
import { useWorkflowContext } from '../../context/WorkflowContext.jsx';
import { getRoleColor } from '../../utils/role-colors.js';
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
      <div className="role-filter-controls">
        {workflow.roles.map(role => (
          <button
            key={role.id}
            className={`role-toggle-button ${selectedRoleIds.includes(role.id) ? 'active' : ''}`}
            onClick={() => handleRoleToggle(role.id)}
          >
            <span 
              className="role-color-dot"
              style={{ backgroundColor: getRoleColor(role.id) }}
            ></span>
            {role.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default RoleFilter;