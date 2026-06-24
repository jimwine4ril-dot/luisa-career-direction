# Roadmap

Each phase has a clear goal and exit criterion. Do not begin the next phase until the previous phase works end to end.

## Phase 1: Foundation

Goal: a working mentoring platform where a mentor can guide a participant through one complete action cycle.

Build:

- User accounts with participant and mentor roles
- Participant invitation or onboarding flow
- Initial reflection
- Participant dashboard with current focus, open actions, and next review date
- Mentor dashboard with participant list and quick status summaries
- Goal creation and tracking
- Action plan creation, assignment, and completion
- Mentor-only meeting notes
- Progress log

Exit criterion: a mentor can invite a participant, the participant completes an onboarding reflection, the mentor creates an action plan, the participant marks actions complete, and the mentor reviews progress without errors.

## Phase 2: Mentoring Frameworks

Goal: mentors can run structured journeys without rebuilding their process for every person.

Build:

- Configurable reflection template library
- Reusable five-stage framework structure
- Starter frameworks for career planning, business planning, leadership development, ministry development, and personal growth
- Mentor ability to assign a framework to a participant
- Framework progress view

Exit criterion: a mentor can assign a framework and the participant can move through each stage with reflections and actions tracked against that framework.

## Phase 3: Resource Centre

Goal: mentors can enrich a participant's journey with curated resources.

Build:

- Resource library for documents, videos, links, and notes
- Mentor ability to recommend resources to a participant
- Participant view of recommended resources
- Resource organisation by domain and journey stage

Exit criterion: a mentor can add a resource, assign it to a participant, and the participant sees it in context on their dashboard or stage page.

## Phase 4: AI Assistance

Goal: AI reduces mentor workload and helps participants reflect more deeply without replacing judgement.

Build:

- Reflection summaries for mentors
- Meeting preparation summaries
- Progress pattern detection
- Goal or direction suggestions for mentor review

Constraints:

- AI output must be reviewed by the mentor before being shown to a participant.
- AI must not generate final action plans autonomously.
- AI calls must happen server-side only.
- Sensitive participant data must be handled according to explicit consent and privacy rules.

Exit criterion: a mentor can generate, review, edit, and use an AI summary of recent participant activity inside the platform.

## Phase 5: Organisations And Scale

Goal: the platform supports multiple mentors, participants, and organisations with appropriate permissions.

Build:

- Organisation accounts
- Multiple mentors per organisation
- Participant assignment across mentors
- Organisation admin role
- Cohort-level reporting
- Permission tiers for admin, mentor, and participant
- Outcome-focused analytics

Constraints:

- Aggregated reporting must not expose individual participant data to unauthorised mentors or admins.
- Analytics must measure outcomes, not engagement for its own sake.

Exit criterion: an organisation admin can manage mentors and participants, view cohort-level progress, and adjust permissions without accessing private individual notes outside their permission scope.

## What Not To Build Yet

Do not prioritise these before the core journey works:

- Social feeds
- Public profiles
- Recruitment workflows
- Full LMS functionality
- Gamification
- Complex CRM pipelines
- Organisation-wide analytics before privacy rules are proven
