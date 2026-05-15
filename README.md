# Wayfinder

A mobile-first academic planning app for first-generation college students at CSU campuses. Wayfinder surfaces the "hidden curriculum" — deadlines, advising prep, course planning, and plain-language explanations of academic jargon — so students can navigate college with confidence.

**Live app:** https://luminous-selkie-4d61a2.netlify.app/

---

## Team

- Luis Reyes
- Leo Luna
- Christopher Dominguez
- Azim Qudrat

CSULB — CECS 448 Software Engineering, Spring 2026

---

## Features

- **Onboarding** — School selection, major, academic standing, transfer status, and financial aid status; personalizes the dashboard
- **Home Dashboard** — Urgent deadline alerts, weekly tasks, degree progress bar, and recent alerts
- **Deadlines** — Consolidated list sorted by urgency; each deadline includes a plain-language consequence and a step-by-step action checklist
- **Plan** — Semester course planning with prerequisite checking and degree progress tracking
- **Advising** — Prep sheet builder with system-suggested topics; post-meeting follow-up action recorder
- **Help** — Plain-language glossary of academic terms and CSULB support office contacts

---

## Tools & Technologies

| Tool | Purpose |
|---|---|
| React Native | Cross-platform UI |
| Expo (SDK 52) | Build toolchain, web export, routing |
| TypeScript | Type safety throughout |
| Expo Router | File-based navigation |
| AsyncStorage | On-device data persistence |
| React Context + Reducers | App-wide state management |

---

## Setup & Running Locally

**Prerequisites:** Node.js 18+, npm

```bash
# Clone the repo
git clone <repo-url>
cd wayfinder

# Install dependencies
npm install

# Start the dev server
npx expo start
```

From the dev server menu:
- Press `w` to open in browser
- Press `i` to open in iOS Simulator (requires Xcode)
- Press `a` to open in Android Emulator (requires Android Studio)
- Scan the QR code with the Expo Go app on your phone

**Build the static web export:**

```bash
npx expo export --platform web
# Output goes to dist/
```
