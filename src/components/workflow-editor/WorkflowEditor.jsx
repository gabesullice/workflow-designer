import React, { useState } from 'react';
import './WorkflowEditor.css';
import WorkflowStates from '../workflow-states/WorkflowStates.jsx';
import WorkflowTransitions from '../workflow-transitions/WorkflowTransitions.jsx';
import WorkflowRoles from '../workflow-roles/WorkflowRoles.jsx';
import ConfirmationModal from '../shared/ConfirmationModal.jsx';
import { useWorkflowContext } from '../../context/WorkflowContext.jsx';

function WorkflowEditor() {
  const { 
    workflow, 
    addState, 
    removeState, 
    addTransition, 
    removeTransition,
    addRole,
    removeRole,
    togglePermission
  } = useWorkflowContext();
  
  // Validation state
  const [stateError, setStateError] = useState('');
  const [transitionError, setTransitionError] = useState('');
  const [roleError, setRoleError] = useState('');
  
  // Form expansion state
  const [stateFormExpanded, setStateFormExpanded] = useState(false);
  const [transitionFormExpanded, setTransitionFormExpanded] = useState(false);
  const [roleFormExpanded, setRoleFormExpanded] = useState(false);
  
  // Confirmation modal state
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    type: null, // 'transition' | 'state'
    targetId: null,
    targetLabel: '',
    affectedRoles: [],
    affectedTransitions: []
  });
  
  // Validation functions that call context and handle errors
  const handleAddState = (label) => {
    const result = addState(label);
    if (result.success) {
      setStateError('');
      setStateFormExpanded(false);
      return true;
    } else {
      setStateError(result.error);
      return false;
    }
  };
  
  const handleRemoveState = (stateId) => {
    const state = workflow.states.find(s => s.id === stateId);
    const referencingTransitions = workflow.transitions.filter(transition => 
      transition.fromStates.includes(stateId) || transition.toState === stateId
    );
    
    if (referencingTransitions.length > 0) {
      setConfirmationModal({
        isOpen: true,
        type: 'state',
        targetId: stateId,
        targetLabel: state.label,
        affectedTransitions: referencingTransitions.map(t => t.label)
      });
      return false;
    } else {
      const result = removeState(stateId);
      if (result.success) {
        setStateError('');
        return true;
      } else {
        setStateError(result.error);
        setStateFormExpanded(false);
        return false;
      }
    }
  };
  
  const handleAddTransition = (label, fromStates, toState) => {
    const result = addTransition(label, fromStates, toState);
    if (result.success) {
      setTransitionError('');
      setTransitionFormExpanded(false);
      return true;
    } else {
      setTransitionError(result.error);
      return false;
    }
  };
  
  const handleAddRole = (label) => {
    const result = addRole(label);
    if (result.success) {
      setRoleError('');
      setRoleFormExpanded(false);
      return true;
    } else {
      setRoleError(result.error);
      return false;
    }
  };
  
  const handleRemoveRole = (roleId) => {
    const result = removeRole(roleId);
    if (result.success) {
      setRoleError('');
      return true;
    } else {
      setRoleError(result.error);
      return false;
    }
  };
  
  const handleTogglePermission = (roleId, transitionId) => {
    togglePermission(roleId, transitionId);
  };
  
  // Helper functions for determining role permissions and affected roles
  const hasRolePermissions = (transitionId) => {
    return workflow.roles.some(role => role.permissions.includes(transitionId));
  };
  
  const getAffectedRoles = (transitionId) => {
    return workflow.roles
      .filter(role => role.permissions.includes(transitionId))
      .map(role => role.label);
  };
  
  const handleRemoveTransition = (transitionId) => {
    const transition = workflow.transitions.find(t => t.id === transitionId);
    
    if (hasRolePermissions(transitionId)) {
      const affectedRoles = getAffectedRoles(transitionId);
      setConfirmationModal({
        isOpen: true,
        type: 'transition',
        targetId: transitionId,
        targetLabel: transition.label,
        affectedRoles
      });
    } else {
      removeTransition(transitionId);
    }
  };
  
  const handleConfirmRemoval = () => {
    if (confirmationModal.type === 'transition') {
      removeTransition(confirmationModal.targetId);
    } else if (confirmationModal.type === 'state') {
      removeState(confirmationModal.targetId);
    }
    setConfirmationModal({
      isOpen: false,
      type: null,
      targetId: null,
      targetLabel: '',
      affectedRoles: [],
      affectedTransitions: []
    });
  };
  
  const handleCancelRemoval = () => {
    setConfirmationModal({
      isOpen: false,
      type: null,
      targetId: null,
      targetLabel: '',
      affectedRoles: [],
      affectedTransitions: []
    });
  };

  return (
    <div className="workflow-editor">
      <div className="roles-section">
        <WorkflowRoles
          onAddRole={handleAddRole}
          onRemoveRole={handleRemoveRole}
          onTogglePermission={handleTogglePermission}
          validationError={roleError}
          setValidationError={setRoleError}
          isFormExpanded={roleFormExpanded}
          setIsFormExpanded={setRoleFormExpanded}
        />
      </div>
      <div className="workflow-editor-grid">
        <div className="states-section">
          <WorkflowStates 
            onAddState={handleAddState}
            onRemoveState={handleRemoveState}
            validationError={stateError}
            setValidationError={setStateError}
            isFormExpanded={stateFormExpanded}
            setIsFormExpanded={setStateFormExpanded}
          />
        </div>
        
        <div className="transitions-section">
          <WorkflowTransitions 
            onAddTransition={handleAddTransition}
            onRemoveTransition={handleRemoveTransition}
            validationError={transitionError}
            setValidationError={setTransitionError}
            isFormExpanded={transitionFormExpanded}
            setIsFormExpanded={setTransitionFormExpanded}
          />
        </div>
      </div>
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onConfirm={handleConfirmRemoval}
        onCancel={handleCancelRemoval}
        title={confirmationModal.type === 'state' ? 'Remove State' : 'Remove Transition'}
        message={
          confirmationModal.type === 'state'
            ? `Removing "${confirmationModal.targetLabel}" will also remove these transitions: ${confirmationModal.affectedTransitions.join(', ')}. Are you sure you want to continue?`
            : `Removing "${confirmationModal.targetLabel}" will also remove permissions for these roles: ${confirmationModal.affectedRoles.join(', ')}. Are you sure you want to continue?`
        }
        confirmText="Remove"
        cancelText="Cancel"
      />
    </div>
  );
}

export default WorkflowEditor;