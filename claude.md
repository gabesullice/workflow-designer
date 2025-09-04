
### Architecture

This project is a single-page SPA. The states, transitions, roles, and
permissions are stored in a single JSON object using local storage.

The diagram definition is derived on-demand from the JSON object and not
stored.

#### Tech stack

The project is built with:

- [React](https://react.dev/reference/react): The UI framework
- [Tailwind CSS](https://tailwindcss.com/docs/installation/using-vite): The CSS
framework
library
- [Mermaid JS](https://mermaid.js.org/intro/getting-started.html#_4-calling-the-mermaid-javascript-api):
The diagram definition visualization library
- [Storybook](https://storybook.js.org/docs): The component development tool

### Development style guide

- Components should have Storybook pages.
- Use prettier for code formatting.
- Avoid empty newlines within function bodies; use comments on their own lines
to separate logical units of code.
- Use descriptive variable names.
- Files must always end with a single newline.
- Avoid inline styles if possible. Prefer to import CSS into the component.

### Rules

- ALWAYS start with a plan, then ask for refinements, then ask for approval
  before beginning a code implementation. DO NOT make edits before proposing a
  plan.
