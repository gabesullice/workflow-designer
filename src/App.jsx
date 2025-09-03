import React from 'react';
import { WorkflowProvider } from './context/WorkflowContext.jsx';
import WorkflowEditor from './components/workflow-editor/WorkflowEditor.jsx';
import { DiagramVisualizer } from './components/diagram-visualizer/DiagramVisualizer.jsx';
import { generateWorkflowDiagram } from './utils/diagram-generator.js';
import { useWorkflowContext } from './context/WorkflowContext.jsx';

function DiagramVisualizerContainer() {
  const { workflow } = useWorkflowContext();
  const diagramDefinition = generateWorkflowDiagram(workflow);
  
  return <DiagramVisualizer diagramDefinition={diagramDefinition} />;
}

function App({ initialWorkflow }) {
  return (
    <WorkflowProvider initialWorkflow={initialWorkflow}>
      <div>
        <h1>Workflow Designer</h1>
        <div>
          <div>
            <DiagramVisualizerContainer />
          </div>
          <div>
            <WorkflowEditor />
          </div>
        </div>
      </div>
    </WorkflowProvider>
  );
}

export default App;