import WorkflowTransitions from './WorkflowTransitions.jsx';
import { WorkflowProvider } from '../../context/WorkflowContext.jsx';

export default {
  title: 'Components/Subcomponents/WorkflowTransitions',
  component: WorkflowTransitions,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story, { args }) => (
      <WorkflowProvider initialWorkflow={{ 
        states: args.allowedStates || [], 
        transitions: args.initialTransitions || [], 
        roles: [] 
      }}>
        <Story />
      </WorkflowProvider>
    ),
  ],
};

export const Default = {
  args: {
    allowedStates: [
      { id: 'draft', label: 'Draft' },
      { id: 'in_review', label: 'In Review' },
      { id: 'approved', label: 'Approved' },
      { id: 'published', label: 'Published' }
    ],
    initialTransitions: [
      { 
        id: 'submit_for_review', 
        label: 'Submit for Review',
        fromStates: ['draft'],
        toState: 'in_review'
      },
      { 
        id: 'approve', 
        label: 'Approve',
        fromStates: ['in_review'],
        toState: 'approved'
      },
      { 
        id: 'publish', 
        label: 'Publish',
        fromStates: ['approved'],
        toState: 'published'
      },
      { 
        id: 'send_back', 
        label: 'Send Back',
        fromStates: ['in_review', 'approved'],
        toState: 'draft'
      }
    ]
  }
};