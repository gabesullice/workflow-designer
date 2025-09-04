import React from 'react';
import './WorkflowEditor.css';
import WorkflowStates from '../workflow-states/WorkflowStates.jsx';
import WorkflowTransitions from '../workflow-transitions/WorkflowTransitions.jsx';
import WorkflowRoles from '../workflow-roles/WorkflowRoles.jsx';
import { useWorkflowContext } from '../../context/WorkflowContext.jsx';

function WorkflowEditor() {
  const { workflow } = useWorkflowContext();

  return (
    <div className="workflow-editor">
      <div className="roles-section">
        <WorkflowRoles
          initialRoles={workflow.roles}
          availableTransitions={workflow.transitions}
        />
      </div>
      <div className="workflow-editor-grid">
        <div className="states-section">
          <WorkflowStates />
        </div>
        
        <div className="transitions-section">
          <WorkflowTransitions 
            initialTransitions={workflow.transitions} 
            allowedStates={workflow.states} 
          />
        </div>
      </div>
    </div>
  );
}

export default WorkflowEditor;