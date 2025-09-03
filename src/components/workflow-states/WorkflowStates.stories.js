import WorkflowStates from './WorkflowStates.jsx';

export default {
  title: 'Components/WorkflowStates',
  component: WorkflowStates,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
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

