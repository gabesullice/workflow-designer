import React from 'react';
import { WorkflowProvider } from './context/WorkflowContext.jsx';
import WorkflowEditor from './components/workflow-editor/WorkflowEditor.jsx';
import RoleFilter from './components/role-filter/RoleFilter.jsx';
import { DiagramVisualizer } from './components/diagram-visualizer/DiagramVisualizer.jsx';
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

function App({ initialWorkflow }) {
  return (
    <WorkflowProvider initialWorkflow={initialWorkflow}>
      <div className="app-container">
        <header className="app-header">
          <h1>Workflow Designer</h1>
          <p className="app-subtitle">Design and visualize your workflow states, transitions, and roles</p>
        </header>
        
        <main className="app-main">
          <div className="diagram-section">
            <div className="card">
              <RoleFilter />
              <DiagramVisualizerContainer />
            </div>
          </div>
          
          <div className="editor-section">
            <div className="card">
              <WorkflowEditor />
            </div>
          </div>
        </main>
      </div>
    </WorkflowProvider>
  );
}

export default App;