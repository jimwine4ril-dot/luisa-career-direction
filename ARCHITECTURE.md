# Architecture

This document describes the intended product architecture for Direction OS. It should be updated as implementation decisions are confirmed.

## Current Codebase Note

The workspace currently contains a React, Vite, and TypeScript app under `cv-tailor-app`. Direction OS should use that stack only if this app is being repurposed. If Direction OS becomes a separate product, confirm the final app folder before implementation.

## Recommended Stack

| Layer | Recommended choice | Notes |
| --- | --- | --- |
| Frontend | React + TypeScript | Keep the UI typed and component-based. |
| Build tooling | Vite | Already present in the workspace. |
| Routing | React Router | Suitable for participant, mentor, and admin route separation. |
| Styling | Tailwind CSS or existing design system | Choose one system and keep the interface calm and consistent. |
| Backend | Node/Express, Next.js API routes, or Supabase | Confirm before Phase 1 implementation. |
| Database | PostgreSQL | Recommended for relational access control and reporting. |
| Auth | Supabase Auth, Auth0, or a server-managed auth system | Must support roles and server-side checks. |
| AI | Server-side provider integration | Never call AI APIs directly from the browser. |

## User Roles

| Role | Description |
| --- | --- |
| `participant` | Receives guidance and sees only their own journey. |
| `mentor` | Guides assigned participants and sees only those relationships. |
| `admin` | Manages organisation-level setup and cohort views. |

Role checks in the UI are convenience only. Every protected API endpoint must validate the user's role and relationship to the requested resource.

## Core Data Model

### User

```text
id
email
name
role: participant | mentor | admin
organisation_id nullable
created_at
updated_at
```

### MentoringRelationship

```text
id
mentor_id -> User
participant_id -> User
status: active | paused | completed
started_at
ended_at nullable
created_at
updated_at
```

### Reflection

```text
id
participant_id -> User
relationship_id -> MentoringRelationship
stage: reflection | clarity | direction | action | review
content
prompts_used JSON nullable
created_at
updated_at
```

### Goal

```text
id
participant_id -> User
relationship_id -> MentoringRelationship
title
description nullable
status: active | achieved | dropped
created_at
updated_at
```

### Action

```text
id
goal_id -> Goal nullable
participant_id -> User
relationship_id -> MentoringRelationship
assigned_by -> User
title
description nullable
due_date nullable
status: pending | in_progress | completed | dropped
created_at
updated_at
```

### MeetingNote

```text
id
relationship_id -> MentoringRelationship
mentor_id -> User
content
meeting_date
is_shared_with_participant boolean default false
created_at
updated_at
```

### Resource

```text
id
created_by -> User
title
type: document | video | link | note
url nullable
content nullable
domain nullable
created_at
updated_at
```

### ResourceAssignment

```text
id
resource_id -> Resource
participant_id -> User
relationship_id -> MentoringRelationship
assigned_by -> User
stage: reflection | clarity | direction | action | review nullable
assigned_at
```

### Framework

```text
id
title
description
domain nullable
stages JSON
created_by -> User
is_public boolean default false
created_at
updated_at
```

### FrameworkAssignment

```text
id
framework_id -> Framework
participant_id -> User
relationship_id -> MentoringRelationship
assigned_by -> User
current_stage_index
status: in_progress | completed
started_at
completed_at nullable
```

## Page Map

### Participant Experience

| Route | Page | Purpose |
| --- | --- | --- |
| `/` | Landing or login | Auth entry point. |
| `/onboarding` | Onboarding reflection | Establishes the starting point. |
| `/dashboard` | Participant dashboard | Shows current focus, open actions, and next review. |
| `/reflect` | Reflection | Stage-appropriate prompts. |
| `/actions` | Action plan | Current and completed actions. |
| `/progress` | Progress log | Reflection and action history. |
| `/resources` | Resources | Mentor-assigned resources. |
| `/review` | Review | Structured progress review. |

### Mentor Experience

| Route | Page | Purpose |
| --- | --- | --- |
| `/mentor/dashboard` | Mentor dashboard | Quick view of assigned participants. |
| `/mentor/participants/:id` | Participant journey | Full view of one participant's current state. |
| `/mentor/participants/:id/notes` | Meeting notes | Private and shared notes. |
| `/mentor/participants/:id/plan` | Action plan editor | Goals and actions. |
| `/mentor/participants/:id/reflections` | Reflection review | Participant reflection history. |
| `/mentor/frameworks` | Framework library | Create, browse, and assign frameworks. |
| `/mentor/resources` | Resource library | Manage and assign resources. |

### Admin Experience

| Route | Page | Purpose |
| --- | --- | --- |
| `/admin/dashboard` | Admin dashboard | Cohort-level overview. |
| `/admin/mentors` | Mentor management | Add, remove, and assign mentors. |
| `/admin/participants` | Participant management | Manage participants and relationships. |
| `/admin/reports` | Reports | Aggregated outcomes only. |

## Access Control Rules

1. Auth is required on every route except the public landing or login route.
2. Participants can only access their own reflections, goals, actions, resources, and shared notes.
3. Mentors can only access participants connected through an active mentoring relationship.
4. Private mentor notes must never be returned to participant sessions.
5. Admins can manage organisations and assignments, but individual private content should remain permission-scoped.
6. Every API endpoint must validate role and relationship server-side.

## AI Rules

1. AI calls happen server-side only.
2. AI output is draft assistance, not final judgement.
3. Mentor review is required before AI recommendations reach participants.
4. AI outputs should explain what data they used and why they reached a suggestion.
5. Sensitive participant data must not be sent to an AI provider without explicit consent and a clear privacy basis.

## Implementation Rules

1. Keep the first implementation focused on the end-to-end mentoring cycle.
2. Prefer one source of truth per entity.
3. Add database schema changes through migrations.
4. Keep routes and data access scoped by relationship.
5. Make the participant experience calm and direct.
6. Make the mentor experience fast to scan and easy to update.
7. Avoid abstractions until repetition proves they are needed.
