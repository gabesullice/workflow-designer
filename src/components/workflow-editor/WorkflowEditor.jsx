import React from 'react';
import WorkflowStates from '../workflow-states/WorkflowStates.jsx';
import WorkflowTransitions from '../workflow-transitions/WorkflowTransitions.jsx';
import WorkflowRoles from '../workflow-roles/WorkflowRoles.jsx';
import { useWorkflowContext } from '../../context/WorkflowContext.jsx';

function WorkflowEditor() {
  const { workflow } = useWorkflowContext();

  return (
    <div>
      <h1>Workflow Editor</h1>
      
      <WorkflowStates />
      
      <WorkflowTransitions 
        initialTransitions={workflow.transitions} 
        allowedStates={workflow.states} 
      />
      
      <WorkflowRoles 
        initialRoles={workflow.roles} 
        availableTransitions={workflow.transitions} 
      />
    </div>
  );
}

export default WorkflowEditor;