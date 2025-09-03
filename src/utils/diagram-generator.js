import he from 'he';

function sanitizeMermaidLabel(label) {
  if (!label) return '';
  
  // First manually replace colons to avoid double-encoding
  const withColons = label.replace(/:/g, '#58;');
  
  // Then use 'he' library to encode other HTML entities
  const encoded = he.encode(withColons, {
    useNamedReferences: true,
    decimal: false,
    encodeEverything: false
  });
  
  // Convert HTML entities to Mermaid's expected format (# instead of &)
  return encoded.replace(/&/g, '#');
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
  
  let diagram = "stateDiagram-v2\n    direction LR\n";
  
  workflow.transitions.forEach(transition => {
    console.assert(Array.isArray(transition.fromStates), `Transition ${transition.id} must have fromStates array`);
    console.assert(transition.toState, `Transition ${transition.id} must have toState`);
    
    const sanitizedTransitionLabel = sanitizeMermaidLabel(transition.label);
    
    transition.fromStates.forEach(fromStateId => {
      diagram += `    ${fromStateId} --> ${transition.toState} : ${sanitizedTransitionLabel}\n`;
    });
  });
  
  const referencedStates = new Set();
  workflow.transitions.forEach(t => {
    t.fromStates.forEach(s => referencedStates.add(s));
    referencedStates.add(t.toState);
  });
  
  // Add state label definitions for all states
  workflow.states.forEach(state => {
    const displayLabel = stateIdToLabel.get(state.id) || state.id;
    diagram += `    ${state.id} : ${displayLabel}\n`;
  });
  
  // Add orphaned states (states not referenced in transitions)
  workflow.states.forEach(state => {
    if (!referencedStates.has(state.id)) {
      diagram += `    ${state.id}\n`;
    }
  });
  
  return diagram;
}