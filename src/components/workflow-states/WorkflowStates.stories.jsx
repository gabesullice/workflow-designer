import WorkflowStates from './WorkflowStates.jsx';
import { WorkflowProvider } from '../../context/WorkflowContext.jsx';

export default {
  title: 'Components/WorkflowStates',
  component: WorkflowStates,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story, { args }) => (
      <WorkflowProvider initialWorkflow={{ states: args.initialStates || [], transitions: [], roles: [] }}>
        <Story />
      </WorkflowProvider>
    ),
  ],
};

export const Default = {
  args: {
    initialStates: [
      { id: 'draft', label: 'Draft' },
      { id: 'in_review', label: 'In Review' },
      { id: 'approved', label: 'Approved' },
      { id: 'published', label: 'Published' }
    ]
  }
};

export const Empty = {
  args: {
    initialStates: []
  }
};

