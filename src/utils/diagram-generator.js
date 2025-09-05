import he from 'he';
import { getRoleColor, getRoleClassName } from './role-colors.js';

function sanitizeMermaidLabel(label) {
  // Then use 'he' library to encode other HTML entities
  const encoded = he.encode(label, {
    useNamedReferences: true,
    decimal: true,
    encodeEverything: true
  });

  // Convert HTML entities to Mermaid's expected format (# instead of &)
  const entityEncoded = encoded.replace(/&#?/g, '#');

  return entityEncoded;
}

export function getWorkflowRoleColors(workflow) {
  const colors = {};
  if (workflow.roles) {
    workflow.roles.forEach(role => {
      colors[role.id] = getRoleColor(role.id);
    });
  }
  return colors;
}

export function generateWorkflowDiagram(workflow) {
  console.assert(workflow && typeof workflow === 'object', 'Workflow must be an object');
  console.assert(Array.isArray(workflow.states), 'Workflow.states must be an array');
  console.assert(Array.isArray(workflow.transitions), 'Workflow.transitions must be an array');
  
  // Create mapping from state ID to display label
  const stateIdToLabel = new Map();
  workflow.states.forEach(state => {
    const displayLabel = state.label || state.id;
    stateIdToLabel.set(state.id, displayLabel);
  });
  
  let diagram = "flowchart LR\n";
  
  // Add modern node styling
  diagram += "    classDef default fill:transparent,stroke:#e1e8ed,stroke-width:2px,font-weight:600\n";
  
  workflow.transitions.forEach(transition => {
    console.assert(Array.isArray(transition.fromStates), `Transition ${transition.id} must have fromStates array`);
    console.assert(transition.toState, `Transition ${transition.id} must have toState`);
    console.assert(Array.isArray(transition.allowedRoles), `Transition ${transition.id} must have allowedRoles array`);
    const sanitizedTransitionLabel = sanitizeMermaidLabel(transition.label);
    
    if (transition.allowedRoles.length > 0) {
      // Create one edge per role per fromState
      transition.fromStates.forEach(fromStateId => {
        transition.allowedRoles.forEach(roleId => {
          const edgeId = `${fromStateId}-${transition.toState}-${roleId}`;
          diagram += `    ${fromStateId} ${edgeId}@-->|${sanitizedTransitionLabel}| ${transition.toState}\n`;
        });
      });
    } else {
      // Show inaccessible transitions as dashed/faded
      transition.fromStates.forEach(fromStateId => {
        const edgeId = `${fromStateId}-${transition.toState}-inaccessible`;
        diagram += `    ${fromStateId} ${edgeId}@-.->|${sanitizedTransitionLabel}| ${transition.toState}\n`;
      });
    }
  });
  
  const referencedStates = new Set();
  workflow.transitions.forEach(t => {
    t.fromStates.forEach(s => referencedStates.add(s));
    referencedStates.add(t.toState);
  });
  
  // Add state label definitions for all states
  workflow.states.forEach(state => {
    const displayLabel = stateIdToLabel.get(state.id) || state.id;
    const sanitizedLabel = sanitizeMermaidLabel(displayLabel);
    diagram += `    ${state.id}(${sanitizedLabel})\n`;
  });
  
  // Add orphaned states (states not referenced in transitions)
  workflow.states.forEach(state => {
    if (!referencedStates.has(state.id)) {
      const displayLabel = stateIdToLabel.get(state.id) || state.id;
      const sanitizedLabel = sanitizeMermaidLabel(displayLabel);
      diagram += `    ${state.id}(${sanitizedLabel})\n`;
    }
  });
  
  return diagram;
}