export function filterWorkflowByRoles(workflow, selectedRoleIds = []) {
  console.assert(workflow && typeof workflow === 'object', 'Workflow must be an object');
  console.assert(Array.isArray(workflow.states), 'Workflow.states must be an array');
  console.assert(Array.isArray(workflow.transitions), 'Workflow.transitions must be an array');
  console.assert(Array.isArray(workflow.roles), 'Workflow.roles must be an array');
  console.assert(Array.isArray(selectedRoleIds), 'selectedRoleIds must be an array');

  // If no roles are selected, return the original workflow
  if (selectedRoleIds.length === 0) {
    return workflow;
  }

  // Get all transitions that at least one of the selected roles has permission for
  const allowedTransitions = workflow.transitions.filter(transition => {
    return selectedRoleIds.some(roleId => {
      const role = workflow.roles.find(r => r.id === roleId);
      return role && role.permissions.includes(transition.id);
    });
  });

  // Get all state IDs that are referenced by allowed transitions
  const referencedStateIds = new Set();
  allowedTransitions.forEach(transition => {
    transition.fromStates.forEach(stateId => referencedStateIds.add(stateId));
    referencedStateIds.add(transition.toState);
  });

  // Include all states (both referenced and orphaned)
  // Orphaned states will be handled by the diagram generator
  const filteredStates = workflow.states;

  return {
    ...workflow,
    states: filteredStates,
    transitions: allowedTransitions
  };
}

export function getInaccessibleTransitions(workflow, selectedRoleIds = []) {
  console.assert(workflow && typeof workflow === 'object', 'Workflow must be an object');
  console.assert(Array.isArray(workflow.transitions), 'Workflow.transitions must be an array');
  console.assert(Array.isArray(workflow.roles), 'Workflow.roles must be an array');
  console.assert(Array.isArray(selectedRoleIds), 'selectedRoleIds must be an array');

  // If no roles are selected, return empty array (all transitions are accessible)
  if (selectedRoleIds.length === 0) {
    return [];
  }

  // Get transitions that none of the selected roles have permission for
  return workflow.transitions.filter(transition => {
    return !selectedRoleIds.some(roleId => {
      const role = workflow.roles.find(r => r.id === roleId);
      return role && role.permissions.includes(transition.id);
    });
  });
}