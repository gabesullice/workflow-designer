import React from 'react';
import WorkflowStates from '../workflow-states/WorkflowStates.jsx';
import WorkflowTransitions from '../workflow-transitions/WorkflowTransitions.jsx';
import WorkflowRoles from '../workflow-roles/WorkflowRoles.jsx';
import { WorkflowProvider, useWorkflowContext } from '../../context/WorkflowContext.jsx';

function WorkflowEditorContent() {
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

function WorkflowEditor({ initialWorkflow = { states: [], transitions: [], roles: [] } }) {
  return (
    <WorkflowProvider initialWorkflow={initialWorkflow}>
      <WorkflowEditorContent />
    </WorkflowProvider>
  );
}

export default WorkflowEditor;