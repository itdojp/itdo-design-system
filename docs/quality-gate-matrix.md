# Quality Gate Matrix

This document defines the minimum quality gate set for pull requests.

## Required Gates
- `lint`: static lint checks for TypeScript/React patterns.
- `type-check`: TypeScript compile-time contract validation.
- `test-storybook:ci`: interaction + a11y checks on Storybook stories.
- `test`: component/unit behavior regression checks.
- `build:lib`: package output build verification.
- `build-storybook`: documentation artifact build verification.

## Gate Intent
- `lint` prevents style and unsafe-pattern drift.
- `type-check` prevents broken public or internal contracts.
- `test-storybook:ci` validates usage scenarios and accessibility regressions.
- `test` validates pure component behavior and hooks logic.
- `build:lib` ensures distributable package integrity.
- `build-storybook` ensures docs can be published without breakage.

## Failure Triage
1. Reproduce locally with the same command.
2. Isolate whether the failure is deterministic or environment-specific.
3. If deterministic, fix and add/adjust regression test.
4. If environment-specific, capture logs and add guardrails in workflow/docs.

## Command Bundle
Use the consolidated script below for local preflight:

```bash
npm run test:quality-gate
```
