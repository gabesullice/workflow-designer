import { generateWorkflowDiagram, getWorkflowRoleColors } from './diagram-generator.js';
import { DiagramVisualizer } from '../components/diagram-visualizer/DiagramVisualizer.jsx';

// Import test fixtures
import basicWorkflow from './test-fixtures/basic-workflow.json';
import multipleFromStates from './test-fixtures/multiple-from-states.json';
import orphanedStates from './test-fixtures/orphaned-states.json';
import emptyWorkflow from './test-fixtures/empty-workflow.json';
import statesOnly from './test-fixtures/states-only.json';
import specialCharacters from './test-fixtures/special-characters.json';
import multiRoleEdges from './test-fixtures/multi-role-edges.json';

export default {
  title: 'Utils/Diagram Generator',
  parameters: {
    layout: 'padded',
  },
};

const workflows = {
  'Basic Workflow': basicWorkflow,
  'Multiple From States': multipleFromStates,
  'Orphaned States': orphanedStates,
  'Empty Workflow': emptyWorkflow,
  'States Only': statesOnly,
  'Special Characters': specialCharacters,
  'Multi-Role Edges': multiRoleEdges
};

function DiagramDisplay({ workflow, title }) {
  const diagramDefinition = generateWorkflowDiagram(workflow);
  const roleColors = getWorkflowRoleColors(workflow);
  
  return (
    <div style={{ padding: '20px' }}>
      <h3>{title}</h3>
      <div style={{ marginBottom: '20px' }}>
        <h4>Rendered Diagram:</h4>
        <div style={{ 
          border: '1px solid #ddd', 
          padding: '20px',
          backgroundColor: '#fafafa'
        }}>
          <DiagramVisualizer 
            diagramDefinition={diagramDefinition} 
            roleColors={roleColors}
          />
        </div>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <h4>Generated Mermaid Definition:</h4>
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '10px', 
          border: '1px solid #ddd',
          fontSize: '12px',
          fontFamily: 'monospace'
        }}>
          {diagramDefinition}
        </pre>
      </div>
      <div>
        <h4>Workflow Data:</h4>
        <pre style={{ 
          background: '#f0f8ff', 
          padding: '10px', 
          border: '1px solid #ddd',
          fontSize: '12px',
          fontFamily: 'monospace'
        }}>
          {JSON.stringify(workflow, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export const BasicWorkflow = () => (
  <DiagramDisplay 
    workflow={workflows['Basic Workflow']} 
    title="Basic Editorial Workflow"
  />
);

export const MultipleFromStates = () => (
  <DiagramDisplay 
    workflow={workflows['Multiple From States']} 
    title="Workflow with Multiple From States"
  />
);

export const OrphanedStates = () => (
  <DiagramDisplay 
    workflow={workflows['Orphaned States']} 
    title="Workflow with Orphaned States"
  />
);

export const EmptyWorkflow = () => (
  <DiagramDisplay 
    workflow={workflows['Empty Workflow']} 
    title="Empty Workflow"
  />
);

export const StatesOnly = () => (
  <DiagramDisplay 
    workflow={workflows['States Only']} 
    title="Workflow with States Only (No Transitions)"
  />
);

export const SpecialCharacters = () => (
  <DiagramDisplay 
    workflow={workflows['Special Characters']} 
    title="Workflow with Special Characters in Labels"
  />
);

export const MultiRoleEdges = () => (
  <DiagramDisplay 
    workflow={workflows['Multi-Role Edges']} 
    title="Multi-Role Transition with Colored Edges"
  />
);