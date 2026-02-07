# Wave Review Checklist

Use this checklist when closing each roadmap wave.

## Scope Completion
- [ ] All linked issue TODO items are either done or explicitly deferred.
- [ ] Deferred items have rationale and next owner.

## Quality Gates
- [ ] `npm run lint`
- [ ] `npm run type-check`
- [ ] `npm test -- --runInBand`
- [ ] `npm run test-storybook:ci`
- [ ] `npm run build`

## UX / A11y
- [ ] Keyboard flow validated for changed components.
- [ ] Focus-visible and screen-reader labels validated.
- [ ] Empty/loading/error states verified.

## Docs / Governance
- [ ] Storybook Do/Don't updated.
- [ ] Adoption criteria impact reviewed.
- [ ] Changelog entry follows `docs/changelog-template.md`.
- [ ] Deprecation impact evaluated against `docs/deprecation-policy.md`.

## Release Readiness
- [ ] Version bump strategy confirmed.
- [ ] Migration notes included for behavior/API changes.
- [ ] Release owner and rollback criteria documented.
