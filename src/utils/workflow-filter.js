export function filterWorkflowByRoles(workflow, selectedRoleIds = []) {
  console.assert(workflow && typeof workflow === 'object', 'Workflow must be an object');
  console.assert(Array.isArray(workflow.states), 'Workflow.states must be an array');
  console.assert(Array.isArray(workflow.transitions), 'Workflow.transitions must be an array');
  console.assert(Array.isArray(workflow.roles), 'Workflow.roles must be an array');
  console.assert(Array.isArray(selectedRoleIds), 'selectedRoleIds must be an array');

  // Annotate transitions with their allowed roles
  const annotatedTransitions = workflow.transitions.map(transition => {
    // Find all roles that have permission for this transition
    const allowedRoles = workflow.roles
      .filter(role => role.permissions.includes(transition.id))
      .map(role => role.id);

    // If no roles are selected (showing all), use all allowed roles
    // Otherwise, filter to only selected roles that are also allowed
    let filteredRoles;
    if (selectedRoleIds.length === 0) {
      filteredRoles = allowedRoles;
    } else {
      filteredRoles = allowedRoles.filter(roleId => selectedRoleIds.includes(roleId));
    }

    return {
      ...transition,
      allowedRoles: filteredRoles
    };
  });

  return {
    ...workflow,
    transitions: annotatedTransitions
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

export function filterWorkflowByStates(workflow, hiddenStateIds = []) {
  console.assert(workflow && typeof workflow === 'object', 'Workflow must be an object');
  console.assert(Array.isArray(workflow.states), 'Workflow.states must be an array');
  console.assert(Array.isArray(workflow.transitions), 'Workflow.transitions must be an array');
  console.assert(Array.isArray(hiddenStateIds), 'hiddenStateIds must be an array');

  // Filter out hidden states completely
  const filteredStates = workflow.states.filter(state => 
    !hiddenStateIds.includes(state.id)
  );
  
  // Filter out transitions that involve hidden states
  const filteredTransitions = workflow.transitions.filter(transition => {
    // Check if toState is hidden
    if (hiddenStateIds.includes(transition.toState)) {
      return false;
    }
    
    // Check if any fromState is hidden
    const hasHiddenFromState = transition.fromStates.some(stateId => hiddenStateIds.includes(stateId));
    if (hasHiddenFromState) {
      return false;
    }
    
    return true;
  });

  return {
    ...workflow,
    states: filteredStates,
    transitions: filteredTransitions
  };
}