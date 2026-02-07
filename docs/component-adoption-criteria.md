# Component Adoption Criteria

This guide defines when to reuse existing components and when to add new ones.

## Decision Rule
- Reuse first.
- Create new only when existing components cannot satisfy required behavior without breaking contracts.

## Reuse Checklist
- Existing component already supports required semantics.
- Required behavior can be implemented with props/slots.
- No additional accessibility debt is introduced.
- Visual language remains consistent with existing tokens.

## New Component Checklist
- Use case is recurring across at least two product domains.
- API can be explained in fewer than 8 core props.
- Keyboard and screen reader behavior are specified before implementation.
- Storybook stories include Do/Don't and interaction tests.
- Migration impact is documented (if overlapping component exists).

## Rejection Criteria
- New component only wraps one existing component with renamed props.
- Difference is only cosmetic and can be solved by token/variant extension.
- Behavior is domain-specific and better implemented in product layer.

## Governance Gate (PR)
- Link to this document in PR description.
- Include rationale: "reuse rejected because ..."
- Attach Storybook evidence for accessibility and interaction behavior.
