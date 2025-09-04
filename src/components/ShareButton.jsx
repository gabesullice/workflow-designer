import React, { useReducer } from 'react';
import { useWorkflowContext } from '../context/WorkflowContext.jsx';
import { generateShareableUrl, copyToClipboard } from '../utils/workflow-sharing.js';

const initialState = {
  status: 'idle',
  text: 'Share URL',
  className: 'btn btn-primary',
  disabled: false,
};

function shareReducer(state, action) {
  switch (action.type) {
    case 'START_COPYING':
      return {
        status: 'copying',
        text: 'Copying...',
        className: 'btn btn-primary',
        disabled: true,
      };
    case 'COPY_SUCCESS':
      return {
        status: 'success',
        text: 'Copied!',
        className: 'btn btn-success',
        disabled: false,
      };
    case 'COPY_ERROR':
      return {
        status: 'error',
        text: 'Failed',
        className: 'btn btn-danger',
        disabled: false,
      };
    case 'RESET':
      return {
        status: 'idle',
        text: 'Share URL',
        className: 'btn btn-primary',
        disabled: false,
      };
    default:
      return state;
  }
}

function ShareButton() {
  const { workflow } = useWorkflowContext();
  const [state, dispatch] = useReducer(shareReducer, initialState);
  
  const hasWorkflowData = workflow.states.length > 0 || workflow.transitions.length > 0 || workflow.roles.length > 0;
  
  const handleShare = async () => {
    if (!hasWorkflowData || state.disabled) {
      return;
    }
    
    dispatch({ type: 'START_COPYING' });
    
    try {
      const shareUrl = generateShareableUrl(workflow);
      if (!shareUrl) {
        dispatch({ type: 'COPY_ERROR' });
        setTimeout(() => dispatch({ type: 'RESET' }), 3000);
        return;
      }
      
      const success = await copyToClipboard(shareUrl);
      if (success) {
        dispatch({ type: 'COPY_SUCCESS' });
        setTimeout(() => dispatch({ type: 'RESET' }), 3000);
      } else {
        dispatch({ type: 'COPY_ERROR' });
        setTimeout(() => dispatch({ type: 'RESET' }), 3000);
      }
    } catch (error) {
      console.error('Error sharing workflow:', error);
      dispatch({ type: 'COPY_ERROR' });
      setTimeout(() => dispatch({ type: 'RESET' }), 3000);
    }
  };
  
  // Don't render if there's no workflow data
  if (!hasWorkflowData) {
    return null;
  }
  
  const getIcon = () => {
    if (state.status === 'success') {
      return (
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polyline points="20,6 9,17 4,12" />
        </svg>
      );
    }
    
    return (
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    );
  };

  return (
    <button
      className={state.className}
      onClick={handleShare}
      disabled={state.disabled}
      title="Copy shareable link to clipboard"
    >
      {getIcon()}
      {state.text}
    </button>
  );
}

export default ShareButton;