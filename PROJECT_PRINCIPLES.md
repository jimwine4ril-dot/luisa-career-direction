# Project Principles

These principles are decision rules for building Direction OS. When a feature, design, or technical choice is unclear, use this document to decide.

## 1. Simplicity First

When two viable solutions both work, choose the simpler one. Complexity requires justification. Simplicity does not.

Apply this by:

- Choosing the workflow with fewer steps when it still gives the user enough clarity.
- Keeping data structures as flat as possible.
- Challenging features that add interface weight without improving the mentoring journey.

## 2. Human First

Users are people, not projects. The platform should never reduce a person to goals, tasks, metrics, or scores.

Apply this by:

- Organising information around people and journeys.
- Using language a thoughtful mentor would use.
- Avoiding admin-panel language in participant-facing screens.

## 3. Clarity Before Activity

The platform should help users think clearly before asking them to act.

Apply this by:

- Starting new journeys with reflection.
- Connecting goals and actions to what the participant has already clarified.
- Avoiding busy dashboards that show activity without direction.

## 4. Action Must Follow Reflection

Every major workflow should lead toward a clear next action or review point.

Apply this by:

- Ending reflection flows with a next-step prompt.
- Showing the participant their current focus and next action prominently.
- Treating reports as prompts for decisions, not passive information displays.

## 5. Mentors Are Guides

Mentors provide listening, wisdom, structure, and accountability. They are not controllers or task managers.

Apply this by:

- Making notes quick and flexible.
- Keeping participant progress scannable.
- Avoiding tools that encourage micromanagement.

## 6. Reusable Across Domains

The framework must work across career, business, ministry, leadership, education, life transitions, and personal growth.

Apply this by:

- Making templates configurable.
- Avoiding hard-coded domain assumptions.
- Treating domain-specific content as resources or frameworks, not core product structure.

## 7. Progress Over Engagement

Progress is measured by clarity gained, decisions made, actions completed, and lessons learned. It is not measured by time spent, page views, or feature usage.

Apply this by:

- Avoiding streaks, badges, points, and gamified completion pressure.
- Designing notifications around meaningful action.
- Surfacing outcomes rather than vanity metrics.

## 8. Privacy By Default

Mentor notes are private. Participant information is protected. Sensitive information must never rely on front-end-only security.

Apply this by:

- Enforcing roles and relationships server-side.
- Never returning private mentor notes to participant sessions unless explicitly shared.
- Treating "hidden in the UI" as cosmetic, not secure.

## 9. AI Assists Thinking

AI can assist reflection, synthesis, and preparation. It must not replace mentor judgement or participant agency.

Apply this by:

- Requiring mentor review before AI-generated recommendations are shown to participants.
- Keeping AI outputs explainable and editable.
- Calling AI services only from authenticated server-side endpoints.

## 10. Build The Journey, Not The Database

The experience should feel like "I have a guide helping me move forward," not "I am filling out a management system."

Apply this by:

- Designing around Reflection, Clarity, Direction, Action, and Review.
- Naming screens around user intent rather than backend entities.
- Keeping forms purposeful and short.
