import React from 'react';
import { useWorkflowContext } from '../../context/WorkflowContext.jsx';
import './HiddenStatesDisplay.css';

function HiddenStatesDisplay() {
  const { workflow, hiddenStateIds, updateHiddenStateIds } = useWorkflowContext();

  // Get hidden states data
  const hiddenStates = workflow.states.filter(state => 
    hiddenStateIds.includes(state.id)
  );

  // Don't render if no hidden states
  if (hiddenStates.length === 0) {
    return null;
  }

  const handleUnhideState = (stateId) => {
    updateHiddenStateIds(stateId, false);
  };

  return (
    <div className="hidden-states-display">
      <div className="hidden-states-list">
        {hiddenStates.map(state => (
          <button
            key={state.id}
            onClick={() => handleUnhideState(state.id)}
            className="hidden-state-item"
            title={`Show ${state.label}`}
            type="button"
          >
            <span className="hidden-state-label">{state.label}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

export default HiddenStatesDisplay;