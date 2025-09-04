Workflow Designer
---

### Overview

This project is an editorial workflow building tool. It allows users to
construct workflows by creating and composing states, transitions, roles, and
permissions via a Todo app-like set of tables with dropdowns.

Workflows can be visualized in real time via a directed graph diagram. As new
states and transitions are added, the diagram will be updated with new nodes
and edges, respectively.

Roles and permissions are represented via uniquely colored edges. That is, if a
single role has permission to perform a transition, a single edge will exist
between the transition's respective state nodes. If two roles have the same
permission, there will be two duplicate edges using two different colors. Each
role is assigned a unique color used for all of their allowed transitions.

Users of the designer can filter the diagram by role using a toggle button
group, selectively showing or hiding one or more sets of transitions. A
forbidden transition is simply omitted from the diagram unless no currently
activated role has permission to access the transition. In that case, the
transition and inaccessible state are represented via faded dashed lines and
outlines.

### Concepts

This tool is designed to create Drupal content moderation worflows. However,
this codebase has no Drupal dependencies or couplings. It merely uses Drupal
workflow concepts like:

- States: enumerated states in which an entity can exist. For example, a
  workflow might have states named _Draft_, _In review_, and _Published_.
- Transitions: enumerated transitions between states. For example, a workflow
  might have a transition named _Submit for review_ which updates an entity's
  state from _Draft_ to _In review_. Transitions are many-to-one, i.e., they
  allow entities in one or more states to be transitioned to a single, new state.
- Roles: enumerated user roles given to user accounts such as _Writer,
  _Reviewer_, or _Admin_.
- Permissions: Boolean value which allows or forbids a user role from executing
  a transition.

Once designed, users are expected to recreate the workflows in their projects
separately.