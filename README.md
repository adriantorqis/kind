# KIND — Dementia Care Companion

A working prototype of **KIND**, built against `KIND_Proposal_Draft.md`'s K.I.N.D. framework — a family-caregiving system for dementia that goes beyond task logging: it personalizes PLWD-facing engagement by dementia stage, structures caregiver education, bridges families to professional consultation, and coordinates the whole care circle. No wearable hardware required.

Originally scaffolded from the [ITECHNOCUP 2026 — Excelsior](https://www.figma.com/design/LgCFrMN0PqIP22sHxfxzAR/ITECHNOCUP-2026-%E2%80%94-Excelsior) Figma prototype, then built out to implement every pillar the written proposal describes, not just the screens Figma had finished.

## Stack

React + TypeScript + Vite + Tailwind CSS v4 + React Router. State lives in `src/state/store.tsx` (React Context) and persists to `localStorage` — recipients, tasks, memories, symptom logs, family circle, and consultations all survive a refresh.

## Run it

```bash
npm install
npm run dev
```

Open the printed localhost URL — the app renders in a phone-frame shell (desktop) or fills the viewport (mobile).

## The K.I.N.D. framework, as built

**K — Kindred Moments** (`/moments`) — stage-personalized PLWD engagement, mirroring the proposal's staging table:
- Early Stage → **Memory Match**, an interactive card-matching cognitive stimulation game
- Middle Stage → the **Life Memory Book**, a reminiscence timeline the caregiver curates (photos, decades, a "Memory of the Day" conversation-starter prompt) and an "Add Memory" form
- Late Stage → **Calm & Sensory**, a passive player (music, familiar photo slideshow, ocean sounds, a familiar voice)
- Every session ends at a shared **mood log** (😊/😐/😟ᐩ note), which feeds an AI recommendation shown on the Moments hub and in Today's Insight

**I — Informed Caregiving** (`/learn`) — the proposal's headline pillar, previously entirely missing:
- A content library of 11 articles tagged by dementia stage and specific symptom (sundowning, wandering, agitation, repetition, sleep, appetite, communication), defaulting to the selected recipient's stage
- An **early symptom recognition** module answering the proposal's own opening statistic (fewer than 1 in 100 diagnosed in Indonesia)
- **Ask KIND**, a rule-based assistant matched against a small, explainable phrase-to-symptom dictionary (not a black box) — it answers from the library and links the source article, or visibly hands off to **Book a Consultation** when the question is outside what it knows

**N — Network** (`/circle`) — family coordination:
- A shared task list (the same tasks shown in `/activity`) with per-task assignment across the family circle, tap to reassign
- Symptom logging (`/circle/log-symptom`) by category and severity — Moderate/Severe entries raise a **Circle-wide alert** with acknowledge, surfaced on both Home and Circle
- Add family members with a role (Primary/Secondary Caregiver, Extended Family)
- **Today's Insight** (`/ai-summary`) recap now built entirely from real store data — task completion, last Moments session mood, recent symptom logs — not fabricated numbers

**D — Direct-to-Professional** (`/consult`) — booking, not a full telehealth platform:
- Pick a specialist type (Geriatrician / Neurologist / Psychologist) → pick a slot → optionally attach recent activity & mood logs as context → confirm
- Reachable from Home, from any Learn article's "discuss with a professional" CTA (pre-fills the reason), from the assistant's hand-off, and from Circle alerts

**Connectivity** (cameras, wearable pairing, vitals) is demoted from the previous build to an optional integration reached from Home — it isn't a primary tab, since being wearable-optional and PLWD-active-not-monitored are two of the proposal's own stated differentiators from SEDAYA.

## Also implemented

- **Onboarding** — splash → sign up (name → email → verify → password, live validation) or sign in
- **Recipients** — select/switch, add, edit (name, age, relationship, dementia stage, notes, photo)
- **Full Schedule** (`/activity`) — the day-by-day medication/routine checklist, reachable from Home and Circle

## Notes / limitations

- This is a single-device prototype: there's no real multi-user auth, so "Circle" is one shared view rather than each family member logging in separately. Persona 2 (the secondary family member) is represented as data in the Circle, not as a distinct login.
- The assistant's matching is a small, curated phrase dictionary per symptom — deliberately not a general LLM call, per the proposal's own "explainable, not a black box" design principle.
- Consultation slots and specialists are static seed data; booking writes to real app state but there's no backend.
- Icons use `lucide-react` rather than exact Figma exports; photos were downloaded from Figma into `src/assets/images` so the app doesn't depend on Figma's short-lived asset URLs.
