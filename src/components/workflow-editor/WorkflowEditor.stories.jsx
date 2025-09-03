import WorkflowEditor from './WorkflowEditor';

export default {
  title: 'Components/WorkflowEditor',
  component: WorkflowEditor,
};

export const Empty = {
  args: {}
};

export const Default = {
  args: {
    initialWorkflow: {
      states: [
        { id: 'draft', label: 'Draft' },
        { id: 'review', label: 'In Review' },
        { id: 'approved', label: 'Approved' },
        { id: 'published', label: 'Published' }
      ],
      transitions: [
        {
          id: 'submit_for_review',
          label: 'Submit for Review',
          fromStates: ['draft'],
          toState: 'review'
        },
        {
          id: 'approve',
          label: 'Approve',
          fromStates: ['review'],
          toState: 'approved'
        },
        {
          id: 'send_back',
          label: 'Send Back',
          fromStates: ['review', 'approved'],
          toState: 'draft'
        },
        {
          id: 'publish',
          label: 'Publish',
          fromStates: ['approved'],
          toState: 'published'
        }
      ],
      roles: [
        {
          id: 'writer',
          label: 'Writer',
          permissions: ['submit_for_review']
        },
        {
          id: 'editor',
          label: 'Editor',
          permissions: ['approve', 'send_back', 'publish']
        },
        {
          id: 'admin',
          label: 'Admin',
          permissions: ['submit_for_review', 'approve', 'send_back', 'publish']
        }
      ]
    }
  }
};