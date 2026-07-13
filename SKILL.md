---
name: open-source-repo-analysis
description: Analyze referenced open-source repositories by reusing or cloning them into the project's git-ignored tmp directory. Use when the user references GitHub links, open-source repositories, external codebases, or asks to compare, inspect, understand, or learn from another repository.
---

# Open Source Repo Analysis

## Workflow

When the user references an open-source project, such as a GitHub link, first decide whether the user's purpose requires code analysis.

Use code analysis when the user asks to:

- Understand architecture, implementation, APIs, or patterns.
- Compare this project with another repository.
- Reuse, port, or adapt logic from an open-source project.
- Investigate how a feature, bug fix, or tool works in another codebase.

Do not clone when a general explanation, package metadata, release note, or documentation lookup is enough.

## Repository Cache

Use the project-local `tmp/` directory as the cache for cloned repositories. This directory is git ignored and should hold temporary external code only.

1. Normalize the repository name from the URL, for example `https://github.com/org/repo` becomes `tmp/org-repo`.
2. Check whether the target directory already exists in `tmp/`.
3. If it exists, analyze the existing local copy directly.
4. If it does not exist, clone the repository into that target directory.
5. Read and analyze files from the cloned repository as needed for the user's question.
6. After completing the analysis, ask the user whether they want to delete the cloned temporary repository.

## Guardrails

- Do not copy code from the external repository into this project unless the user explicitly asks.
- Prefer shallow clones when full history is not needed.
- Avoid running install, build, or test commands inside the cloned repository unless the user asks or runtime evidence is necessary.
- Clearly distinguish findings from the external repository from findings about the current project.
