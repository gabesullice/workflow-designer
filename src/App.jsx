import React, { useState } from 'react';
import { WorkflowProvider } from './context/WorkflowContext.jsx';
import WorkflowEditor from './components/workflow-editor/WorkflowEditor.jsx';
import RoleFilter from './components/role-filter/RoleFilter.jsx';
import { DiagramVisualizer } from './components/diagram-visualizer/DiagramVisualizer.jsx';
import ConfirmationModal from './components/shared/ConfirmationModal.jsx';
import ShareButton from './components/ShareButton.jsx';
import HiddenStatesDisplay from './components/hidden-states-display/HiddenStatesDisplay.jsx';
import { generateWorkflowDiagram, getWorkflowRoleColors } from './utils/diagram-generator.js';
import { filterWorkflowByRoles, filterWorkflowByStates } from './utils/workflow-filter.js';
import { useWorkflowContext } from './context/WorkflowContext.jsx';
import { getWorkflowFromUrl } from './utils/workflow-sharing.js';
import useLocalStorage from './hooks/useLocalStorage.js';

function DiagramVisualizerContainer() {
  const { workflow, selectedRoleIds, hiddenStateIds } = useWorkflowContext();
  const roleFilteredWorkflow = filterWorkflowByRoles(workflow, selectedRoleIds);
  const stateFilteredWorkflow = filterWorkflowByStates(roleFilteredWorkflow, hiddenStateIds);
  const diagramDefinition = generateWorkflowDiagram(stateFilteredWorkflow, hiddenStateIds);
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
        <div className="app-header-content">
          <h1>Workflow Designer</h1>
          <p className="app-subtitle">Design and visualize your workflow states, transitions, and roles.</p>
        </div>
        <div className="app-header-actions">
          <ShareButton />
        </div>
      </header>
      
      <main className="app-main">
        <div className="diagram-section">
          <div className="card">
            {hasWorkflowData ? (
              <>
                <RoleFilter />
                <DiagramVisualizerContainer />
                <HiddenStatesDisplay />
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
      
      <div className="reset-section">
        <ResetWorkflowButton />
      </div>
      
      <footer className="app-footer">
        <a 
          href="https://github.com/gabesullice/workflow-designer" 
          target="_blank" 
          rel="noopener noreferrer"
          className="github-link"
          title="View source on GitHub"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z"/>
          </svg>
        </a>
      </footer>
    </div>
  );
}

function App({ initialWorkflow }) {
  // Try to get workflow from URL if no initialWorkflow provided
  const emptyWorkflow = { states: [], transitions: [], roles: [] };
  const workflowFromURL = getWorkflowFromUrl();
  const workflow = initialWorkflow || workflowFromURL || emptyWorkflow;
  useLocalStorage('workflow', workflow, !!workflowFromURL);

  return (
    <WorkflowProvider initialWorkflow={workflow}>
      <AppContent />
    </WorkflowProvider>
  );
}

export default App;
