/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest';
import { filterWorkflowByRoles, getInaccessibleTransitions } from './workflow-filter.js';

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
  it('returns original workflow when no roles are selected', () => {
    const result = filterWorkflowByRoles(mockWorkflow, []);
    expect(result).toEqual(mockWorkflow);
  });

  it('returns original workflow when empty selectedRoleIds array is passed', () => {
    const result = filterWorkflowByRoles(mockWorkflow);
    expect(result).toEqual(mockWorkflow);
  });

  it('filters transitions for writer role only', () => {
    const result = filterWorkflowByRoles(mockWorkflow, ['writer']);
    
    expect(result.states).toEqual(mockWorkflow.states);
    expect(result.transitions).toHaveLength(1);
    expect(result.transitions[0].id).toBe('submit_for_review');
    expect(result.roles).toEqual(mockWorkflow.roles);
  });

  it('filters transitions for editor role only', () => {
    const result = filterWorkflowByRoles(mockWorkflow, ['editor']);
    
    expect(result.states).toEqual(mockWorkflow.states);
    expect(result.transitions).toHaveLength(3);
    expect(result.transitions.map(t => t.id)).toEqual(['approve', 'send_back', 'publish']);
  });

  it('filters transitions for admin role (has all permissions)', () => {
    const result = filterWorkflowByRoles(mockWorkflow, ['admin']);
    
    expect(result.states).toEqual(mockWorkflow.states);
    expect(result.transitions).toEqual(mockWorkflow.transitions);
  });

  it('combines permissions when multiple roles are selected', () => {
    const result = filterWorkflowByRoles(mockWorkflow, ['writer', 'editor']);
    
    expect(result.states).toEqual(mockWorkflow.states);
    expect(result.transitions).toEqual(mockWorkflow.transitions);
  });

  it('handles partial role selection', () => {
    const result = filterWorkflowByRoles(mockWorkflow, ['writer']);
    
    expect(result.transitions).toHaveLength(1);
    expect(result.transitions[0].id).toBe('submit_for_review');
  });

  it('handles non-existent role IDs gracefully', () => {
    const result = filterWorkflowByRoles(mockWorkflow, ['non_existent_role']);
    
    expect(result.states).toEqual(mockWorkflow.states);
    expect(result.transitions).toHaveLength(0);
  });

  it('handles mixed valid and invalid role IDs', () => {
    const result = filterWorkflowByRoles(mockWorkflow, ['writer', 'non_existent_role']);
    
    expect(result.states).toEqual(mockWorkflow.states);
    expect(result.transitions).toHaveLength(1);
    expect(result.transitions[0].id).toBe('submit_for_review');
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

describe('edge cases and error handling', () => {
  it('handles empty workflow states', () => {
    const emptyStatesWorkflow = {
      ...mockWorkflow,
      states: []
    };
    
    const result = filterWorkflowByRoles(emptyStatesWorkflow, ['writer']);
    expect(result.states).toEqual([]);
    expect(result.transitions).toHaveLength(1);
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
    expect(result.transitions).toEqual([]);
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
    expect(result.transitions).toEqual([]);
  });

  it('handles transitions with multiple fromStates', () => {
    const result = filterWorkflowByRoles(mockWorkflow, ['editor']);
    const sendBackTransition = result.transitions.find(t => t.id === 'send_back');
    
    expect(sendBackTransition).toBeDefined();
    expect(sendBackTransition.fromStates).toEqual(['review', 'approved']);
  });
});