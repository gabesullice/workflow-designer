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
      { id: 'writer', label: 'Writer', permissions: ['submit_for_review'] },
      { id: 'reviewer', label: 'Reviewer', permissions: ['approve', 'send_back'] },
      { id: 'admin', label: 'Admin', permissions: ['submit_for_review', 'approve', 'publish', 'send_back'] }
    ],
    availableTransitions: [
      { id: 'submit_for_review', label: 'Submit for Review' },
      { id: 'approve', label: 'Approve' },
      { id: 'publish', label: 'Publish' },
      { id: 'send_back', label: 'Send Back' }
    ]
  }
};