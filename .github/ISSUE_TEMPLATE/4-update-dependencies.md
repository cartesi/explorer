---
name: ⬆️ Update Dependencies
about: Template for updating dependencies
title: ''
labels: type:chore
assignees: ''
---

## 📄 Context

Please provide a clean and concise description of what dependency/dependencies will be updated and the expected impacts.
What are the dependency or dependencies to be updated?
What are the parts of the code that will be affected by this action?
Why is that update relevant?

## 📈 Subtasks

-   [ ] Update the package.json to the new fixed version ( i.e. no ^ or ~ )
-   [ ] If an update requires major work, create the corresponding issue.
-   [ ] Make sure dependencies are updated in the lock file (yarn.lock).
-   [ ] Verify whether everything is working as expected.
