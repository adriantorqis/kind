# Kin — Dementia Care Companion

A working prototype built from the [ITECHNOCUP 2026 — Excelsior](https://www.figma.com/design/LgCFrMN0PqIP22sHxfxzAR/ITECHNOCUP-2026-%E2%80%94-Excelsior) Figma file's `PROTOTYPE` page: a caregiver app for people supporting someone with dementia.

## Stack

React + TypeScript + Vite + Tailwind CSS v4 + React Router. State lives in `src/state/store.tsx` (React Context) and persists to `localStorage`, so recipients, activity progress, memories, and connected cameras survive a refresh.

## Run it

```bash
npm install
npm run dev
```

Open the printed localhost URL — the app renders in a phone-frame shell (desktop) or fills the viewport (mobile).

## What's implemented

Every screen present in the Figma prototype, translated from absolute-positioned Figma layout into responsive flex/grid layout, and wired into a working flow:

- **Onboarding** — splash → sign up (name → email → verify → password, with live password-rule validation) or sign in
- **Recipients** — select/switch recipient, add new recipient, edit recipient (name, age, relationship, dementia stage, notes, photo upload)
- **Home dashboard** — recipient summary, next task, quick access grid (this screen wasn't in the Figma file as a finished frame — built to tie the designed features together, matching the app's established visual language)
- **Activity** — daily medication/care schedule grouped by Morning/Afternoon/Evening/Night, day picker, tap-to-complete tasks
- **Connectivity** — Home/Camera/Monitor tabs, heart rate & sleep vitals, live camera view with room switcher and Speaker/Mic/Capture/Record controls, 4-step "Add Camera" wizard (device → QR scan → Wi-Fi → name)
- **AI Summary** — daily recap and AI recommendation
- **Life Memory Book** — Life Timeline (grouped by decade, with a "Memory of the Day" conversation-starter prompt) and Key People tabs, plus a working "Add Memory" form that appends to the timeline

## Notes / next steps

- A few Figma frames were empty placeholders or unstyled "Lorem Ipsum" templates (e.g. an unfinished Calendar frame, an "Enhance Caregiver App Features" frame with no content) — these were filled in using the established design system rather than left blank.
- Icons use `lucide-react` rather than the exact Figma icon exports, to keep the app lightweight and maintainable.
- Photos (recipient photo, memory book photos, camera stills) were downloaded from Figma into `src/assets/images` so the app doesn't depend on Figma's short-lived asset URLs.
