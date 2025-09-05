/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest';
import { filterWorkflowByRoles, getInaccessibleTransitions, filterWorkflowByStates } from './workflow-filter.js';

const mockWorkflow = {
  states: [
    { id: 'draft', label: 'Draft' },
    { id: 'review', label: 'In Review' },
    { id: 'approved', label: 'Approved' },
    { id: 'published', label: 'Published' }
  ],
  transitions: [
    {
      id: 'submit_for_review',
      label: 'Submit for Review',
      fromStates: ['draft'],
      toState: 'review'
    },
    {
      id: 'approve',
      label: 'Approve',
      fromStates: ['review'],
      toState: 'approved'
    },
    {
      id: 'send_back',
      label: 'Send Back',
      fromStates: ['review', 'approved'],
      toState: 'draft'
    },
    {
      id: 'publish',
      label: 'Publish',
      fromStates: ['approved'],
      toState: 'published'
    }
  ],
  roles: [
    {
      id: 'writer',
      label: 'Writer',
      permissions: ['submit_for_review']
    },
    {
      id: 'editor',
      label: 'Editor',
      permissions: ['approve', 'send_back', 'publish']
    },
    {
      id: 'admin',
      label: 'Admin',
      permissions: ['submit_for_review', 'approve', 'send_back', 'publish']
    }
  ]
};

describe('filterWorkflowByRoles', () => {
  it('returns annotated workflow when no roles are selected', () => {
    const result = filterWorkflowByRoles(mockWorkflow, []);
    expect(result.states).toEqual(mockWorkflow.states);
    expect(result.roles).toEqual(mockWorkflow.roles);
    expect(result.transitions).toHaveLength(4);
    // All transitions should be accessible when no roles are selected (showing all)
    result.transitions.forEach(transition => {
      expect(transition.allowedRoles.length).toBeGreaterThan(0);
      expect(transition.allowedRoles).toEqual(
        expect.arrayContaining(mockWorkflow.roles
          .filter(role => role.permissions.includes(transition.id))
          .map(role => role.id))
      );
    });
  });

  it('returns annotated workflow when empty selectedRoleIds array is passed', () => {
    const result = filterWorkflowByRoles(mockWorkflow);
    expect(result.states).toEqual(mockWorkflow.states);
    expect(result.roles).toEqual(mockWorkflow.roles);
    expect(result.transitions).toHaveLength(4);
    // All transitions should be accessible when no roles are selected (showing all)
    result.transitions.forEach(transition => {
      expect(transition.allowedRoles.length).toBeGreaterThan(0);
    });
  });

  it('filters transitions for writer role only', () => {
    const result = filterWorkflowByRoles(mockWorkflow, ['writer']);
    
    expect(result.states).toEqual(mockWorkflow.states);
    expect(result.transitions).toHaveLength(4); // All transitions are included
    expect(result.roles).toEqual(mockWorkflow.roles);
    
    // Only submit_for_review should be accessible for writer
    const accessibleTransitions = result.transitions.filter(t => t.allowedRoles.length > 0);
    expect(accessibleTransitions).toHaveLength(1);
    expect(accessibleTransitions[0].id).toBe('submit_for_review');
    expect(accessibleTransitions[0].allowedRoles).toContain('writer');
  });

  it('filters transitions for editor role only', () => {
    const result = filterWorkflowByRoles(mockWorkflow, ['editor']);
    
    expect(result.states).toEqual(mockWorkflow.states);
    expect(result.transitions).toHaveLength(4); // All transitions are included
    
    // Editor should have access to approve, send_back, publish
    const accessibleTransitions = result.transitions.filter(t => t.allowedRoles.length > 0);
    expect(accessibleTransitions).toHaveLength(3);
    expect(accessibleTransitions.map(t => t.id)).toEqual(['approve', 'send_back', 'publish']);
  });

  it('filters transitions for admin role (has all permissions)', () => {
    const result = filterWorkflowByRoles(mockWorkflow, ['admin']);
    
    expect(result.states).toEqual(mockWorkflow.states);
    expect(result.transitions).toHaveLength(4);
    
    // Admin should have access to all transitions
    const accessibleTransitions = result.transitions.filter(t => t.allowedRoles.length > 0);
    expect(accessibleTransitions).toHaveLength(4);
    accessibleTransitions.forEach(transition => {
      expect(transition.allowedRoles).toContain('admin');
    });
  });

  it('combines permissions when multiple roles are selected', () => {
    const result = filterWorkflowByRoles(mockWorkflow, ['writer', 'editor']);
    
    expect(result.states).toEqual(mockWorkflow.states);
    expect(result.transitions).toHaveLength(4);
    
    // All transitions should be accessible when writer+editor are selected
    const accessibleTransitions = result.transitions.filter(t => t.allowedRoles.length > 0);
    expect(accessibleTransitions).toHaveLength(4);
  });

  it('handles partial role selection', () => {
    const result = filterWorkflowByRoles(mockWorkflow, ['writer']);
    
    expect(result.transitions).toHaveLength(4); // All transitions are included
    const accessibleTransitions = result.transitions.filter(t => t.allowedRoles.length > 0);
    expect(accessibleTransitions).toHaveLength(1);
    expect(accessibleTransitions[0].id).toBe('submit_for_review');
  });

  it('handles non-existent role IDs gracefully', () => {
    const result = filterWorkflowByRoles(mockWorkflow, ['non_existent_role']);
    
    expect(result.states).toEqual(mockWorkflow.states);
    expect(result.transitions).toHaveLength(4); // All transitions are included
    // No transitions should be accessible for non-existent role
    const accessibleTransitions = result.transitions.filter(t => t.allowedRoles.length > 0);
    expect(accessibleTransitions).toHaveLength(0);
  });

  it('handles mixed valid and invalid role IDs', () => {
    const result = filterWorkflowByRoles(mockWorkflow, ['writer', 'non_existent_role']);
    
    expect(result.states).toEqual(mockWorkflow.states);
    expect(result.transitions).toHaveLength(4); // All transitions are included
    const accessibleTransitions = result.transitions.filter(t => t.allowedRoles.length > 0);
    expect(accessibleTransitions).toHaveLength(1);
    expect(accessibleTransitions[0].id).toBe('submit_for_review');
  });

  it('preserves other workflow properties', () => {
    const workflowWithExtra = {
      ...mockWorkflow,
      metadata: { version: '1.0' },
      description: 'Test workflow'
    };
    
    const result = filterWorkflowByRoles(workflowWithExtra, ['writer']);
    
    expect(result.metadata).toEqual({ version: '1.0' });
    expect(result.description).toBe('Test workflow');
  });
});

describe('getInaccessibleTransitions', () => {
  it('returns empty array when no roles are selected', () => {
    const result = getInaccessibleTransitions(mockWorkflow, []);
    expect(result).toEqual([]);
  });

  it('returns empty array when empty selectedRoleIds array is passed', () => {
    const result = getInaccessibleTransitions(mockWorkflow);
    expect(result).toEqual([]);
  });

  it('returns inaccessible transitions for writer role', () => {
    const result = getInaccessibleTransitions(mockWorkflow, ['writer']);
    
    expect(result).toHaveLength(3);
    expect(result.map(t => t.id)).toEqual(['approve', 'send_back', 'publish']);
  });

  it('returns inaccessible transitions for editor role', () => {
    const result = getInaccessibleTransitions(mockWorkflow, ['editor']);
    
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('submit_for_review');
  });

  it('returns empty array for admin role (has all permissions)', () => {
    const result = getInaccessibleTransitions(mockWorkflow, ['admin']);
    expect(result).toEqual([]);
  });

  it('returns correct inaccessible transitions when multiple roles are selected', () => {
    const result = getInaccessibleTransitions(mockWorkflow, ['writer', 'editor']);
    expect(result).toEqual([]);
  });

  it('handles non-existent role IDs', () => {
    const result = getInaccessibleTransitions(mockWorkflow, ['non_existent_role']);
    expect(result).toEqual(mockWorkflow.transitions);
  });

  it('handles mixed valid and invalid role IDs', () => {
    const result = getInaccessibleTransitions(mockWorkflow, ['writer', 'non_existent_role']);
    
    expect(result).toHaveLength(3);
    expect(result.map(t => t.id)).toEqual(['approve', 'send_back', 'publish']);
  });
});

describe('filterWorkflowByStates', () => {
  it('returns workflow unchanged when no states are hidden', () => {
    const result = filterWorkflowByStates(mockWorkflow, []);
    expect(result.states).toEqual(mockWorkflow.states);
    expect(result.transitions).toEqual(mockWorkflow.transitions);
    expect(result.roles).toEqual(mockWorkflow.roles);
  });

  it('filters out transitions involving hidden states', () => {
    const result = filterWorkflowByStates(mockWorkflow, ['review']);
    
    // Hidden states should be filtered out completely
    expect(result.states).toHaveLength(3); // 4 original - 1 hidden = 3
    expect(result.states.map(s => s.id)).not.toContain('review');
    expect(result.transitions).toHaveLength(1); // Only 1 transition should remain
    
    // When 'review' is hidden:
    // submit_for_review goes TO review (filtered out)
    // approve comes FROM review (filtered out)  
    // send_back comes FROM review (filtered out)
    // Only publish remains (approved->published)
    const remainingTransitionIds = result.transitions.map(t => t.id);
    expect(remainingTransitionIds).toEqual(['publish']);
  });

  it('filters out transitions with hidden fromState', () => {
    const result = filterWorkflowByStates(mockWorkflow, ['approved']);
    
    // Hidden states should be filtered out completely
    expect(result.states).toHaveLength(3); // 4 original - 1 hidden = 3
    expect(result.states.map(s => s.id)).not.toContain('approved');
    // Should filter out transitions where 'approved' is in fromStates or toState
    const remainingTransitions = result.transitions.filter(t => 
      !t.fromStates.includes('approved') && t.toState !== 'approved'
    );
    expect(result.transitions).toHaveLength(remainingTransitions.length);
  });

  it('filters out transitions with hidden toState', () => {
    const result = filterWorkflowByStates(mockWorkflow, ['published']);
    
    // Hidden states should be filtered out completely
    expect(result.states).toHaveLength(3); // 4 original - 1 hidden = 3
    expect(result.states.map(s => s.id)).not.toContain('published');
    // Should filter out the 'publish' transition that goes to 'published'
    const publishTransition = result.transitions.find(t => t.id === 'publish');
    expect(publishTransition).toBeUndefined();
  });

  it('handles multiple hidden states', () => {
    const result = filterWorkflowByStates(mockWorkflow, ['review', 'approved']);
    
    // Hidden states should be filtered out completely
    expect(result.states).toHaveLength(2); // 4 original - 2 hidden = 2
    expect(result.states.map(s => s.id)).not.toContain('review');
    expect(result.states.map(s => s.id)).not.toContain('approved');
    // When both 'review' and 'approved' are hidden, all transitions are filtered out:
    // submit_for_review goes TO review (filtered out)
    // approve comes FROM review (filtered out)
    // send_back comes FROM review AND approved (filtered out)  
    // publish comes FROM approved (filtered out)
    expect(result.transitions).toHaveLength(0); // No transitions should remain
  });

  it('handles non-existent hidden state IDs gracefully', () => {
    const result = filterWorkflowByStates(mockWorkflow, ['non_existent_state']);
    
    expect(result.states).toEqual(mockWorkflow.states); // No states filtered
    expect(result.transitions).toEqual(mockWorkflow.transitions); // No filtering should occur
  });

  it('preserves other workflow properties', () => {
    const workflowWithExtra = {
      ...mockWorkflow,
      metadata: { version: '1.0' },
      description: 'Test workflow'
    };
    
    const result = filterWorkflowByStates(workflowWithExtra, ['review']);
    
    expect(result.metadata).toEqual({ version: '1.0' });
    expect(result.description).toBe('Test workflow');
  });
});

describe('edge cases and error handling', () => {
  it('handles empty workflow states', () => {
    const emptyStatesWorkflow = {
      ...mockWorkflow,
      states: []
    };
    
    const result = filterWorkflowByRoles(emptyStatesWorkflow, ['writer']);
    expect(result.states).toEqual([]);
    expect(result.transitions).toHaveLength(4); // All transitions are included
    const accessibleTransitions = result.transitions.filter(t => t.allowedRoles.length > 0);
    expect(accessibleTransitions).toHaveLength(1);
  });

  it('handles empty workflow transitions', () => {
    const emptyTransitionsWorkflow = {
      ...mockWorkflow,
      transitions: []
    };
    
    const result = filterWorkflowByRoles(emptyTransitionsWorkflow, ['writer']);
    expect(result.transitions).toEqual([]);
  });

  it('handles empty workflow roles', () => {
    const emptyRolesWorkflow = {
      ...mockWorkflow,
      roles: []
    };
    
    const result = filterWorkflowByRoles(emptyRolesWorkflow, ['writer']);
    expect(result.transitions).toHaveLength(4); // All transitions are included
    // No transitions should be accessible when no roles exist
    const accessibleTransitions = result.transitions.filter(t => t.allowedRoles.length > 0);
    expect(accessibleTransitions).toHaveLength(0);
  });

  it('handles role with empty permissions array', () => {
    const workflowWithEmptyPermissions = {
      ...mockWorkflow,
      roles: [
        ...mockWorkflow.roles,
        { id: 'viewer', label: 'Viewer', permissions: [] }
      ]
    };
    
    const result = filterWorkflowByRoles(workflowWithEmptyPermissions, ['viewer']);
    expect(result.transitions).toHaveLength(4); // All transitions are included
    // No transitions should be accessible for role with empty permissions
    const accessibleTransitions = result.transitions.filter(t => t.allowedRoles.length > 0);
    expect(accessibleTransitions).toHaveLength(0);
  });

  it('handles transitions with multiple fromStates', () => {
    const result = filterWorkflowByRoles(mockWorkflow, ['editor']);
    const sendBackTransition = result.transitions.find(t => t.id === 'send_back');
    
    expect(sendBackTransition).toBeDefined();
    expect(sendBackTransition.fromStates).toEqual(['review', 'approved']);
    expect(sendBackTransition.allowedRoles.length).toBeGreaterThan(0);
    expect(sendBackTransition.allowedRoles).toContain('editor');
  });
});