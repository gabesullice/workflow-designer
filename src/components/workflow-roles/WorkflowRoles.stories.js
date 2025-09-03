import WorkflowRoles from './WorkflowRoles.jsx';

export default {
  title: 'Components/WorkflowRoles',
  component: WorkflowRoles,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export const Default = {
  args: {
    initialRoles: [
      { id: 'writer', label: 'Writer' },
      { id: 'reviewer', label: 'Reviewer' },
      { id: 'admin', label: 'Admin' }
    ]
  }
};