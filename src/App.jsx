import React, { useState } from 'react';
import { WorkflowProvider } from './context/WorkflowContext.jsx';
import WorkflowEditor from './components/workflow-editor/WorkflowEditor.jsx';
import RoleFilter from './components/role-filter/RoleFilter.jsx';
import { DiagramVisualizer } from './components/diagram-visualizer/DiagramVisualizer.jsx';
import ConfirmationModal from './components/shared/ConfirmationModal.jsx';
import { generateWorkflowDiagram, getWorkflowRoleColors } from './utils/diagram-generator.js';
import { filterWorkflowByRoles } from './utils/workflow-filter.js';
import { useWorkflowContext } from './context/WorkflowContext.jsx';

function DiagramVisualizerContainer() {
  const { workflow, selectedRoleIds } = useWorkflowContext();
  const filteredWorkflow = filterWorkflowByRoles(workflow, selectedRoleIds);
  const diagramDefinition = generateWorkflowDiagram(filteredWorkflow);
  const roleColors = getWorkflowRoleColors(workflow);
  
  return <DiagramVisualizer diagramDefinition={diagramDefinition} roleColors={roleColors} />;
}

function LoadSampleWorkflowButton() {
  const { loadSampleWorkflow } = useWorkflowContext();

  const handleLoadSample = () => {
    loadSampleWorkflow();
  };

  return (
    <div className="empty-workflow-container">
      <div className="empty-workflow-content">
        <h3 className="empty-workflow-title">Get Started</h3>
        <p className="empty-workflow-subtitle">Load a sample workflow to see how it works</p>
        <button
          className="btn btn-primary btn-lg"
          onClick={handleLoadSample}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14,2 14,8 20,8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10,9 9,9 8,9" />
          </svg>
          Load Sample Workflow
        </button>
      </div>
    </div>
  );
}

function ResetWorkflowButton() {
  const { resetWorkflow, workflow } = useWorkflowContext();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const hasWorkflowData = workflow.states.length > 0 || workflow.transitions.length > 0 || workflow.roles.length > 0;

  const handleResetClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmReset = () => {
    resetWorkflow();
    setShowConfirmModal(false);
  };

  const handleCancelReset = () => {
    setShowConfirmModal(false);
  };

  // Only render if there's workflow data to reset
  if (!hasWorkflowData) {
    return null;
  }

  return (
    <>
      <button
        className="btn btn-danger btn-lg"
        onClick={handleResetClick}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c0 1 1 2 2 2v2" />
        </svg>
        Reset Workflow
      </button>
      
      <ConfirmationModal
        isOpen={showConfirmModal}
        onConfirm={handleConfirmReset}
        onCancel={handleCancelReset}
        title="Reset Workflow"
        message="Are you sure you want to delete the entire workflow? This action cannot be undone and will remove all states, transitions, and roles."
        confirmText="Reset"
        cancelText="Cancel"
      />
    </>
  );
}

function AppContent() {
  const { workflow } = useWorkflowContext();
  const hasWorkflowData = workflow.states.length > 0 || workflow.transitions.length > 0 || workflow.roles.length > 0;

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Workflow Designer</h1>
        <p className="app-subtitle">Design and visualize your workflow states, transitions, and roles</p>
      </header>
      
      <main className="app-main">
        <div className="diagram-section">
          <div className="card">
            {hasWorkflowData ? (
              <>
                <RoleFilter />
                <DiagramVisualizerContainer />
              </>
            ) : (
              <LoadSampleWorkflowButton />
            )}
          </div>
        </div>
        
        <div className="editor-section">
          <div className="card">
            <WorkflowEditor />
          </div>
        </div>
      </main>
      
      <footer className="app-footer">
        <ResetWorkflowButton />
      </footer>
    </div>
  );
}

function App({ initialWorkflow }) {
  return (
    <WorkflowProvider initialWorkflow={initialWorkflow}>
      <AppContent />
    </WorkflowProvider>
  );
}

export default App;