# Review Gate and Merge Policy

This repository blocks merge to `main` unless review requirements are satisfied.

## Implemented controls

- `Review Gate / gate` status check
  - Requires at least 1 approval.
  - Fails if any latest reviewer state is `CHANGES_REQUESTED`.
  - Runs on `pull_request`, `pull_request_review`, and manual dispatch.
- `CI / build` status check
  - Existing quality gate workflow.
- Branch protection preset
  - `.github/branch-protection.main.require-review-gate.json`
  - Enforces strict status checks, required approving reviews, and admin enforcement.

## How to apply branch protection

1. Set repository secret `ADMIN_TOKEN` with repository administration permission.
2. Run workflow `Admin - Apply Branch Protection Preset`.
3. Use preset `branch-protection.main.require-review-gate.json` and branch `main`.
4. Confirm `required_status_checks` includes:
   - `CI / build`
   - `Review Gate / gate`

## Notes

- Draft PRs are skipped by Review Gate until marked ready for review.
- Bot reviews are ignored by default in Review Gate (`IGNORE_BOT_REVIEWS=true`).
- Admin bypass is disabled in the preset (`enforce_admins: true`).
