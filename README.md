# RoadReady

An interactive English–Bangla study app for practising the Great Britain Category B car theory test.

**Live app:** [hasansust32.github.io/RoadReady](https://hasansust32.github.io/RoadReady/)

[![Deploy RoadReady to GitHub Pages](https://github.com/hasansust32/RoadReady/actions/workflows/deploy.yml/badge.svg)](https://github.com/hasansust32/RoadReady/actions/workflows/deploy.yml)

## Features

- 648 bilingual practice questions: 640 workbook MCQs plus 8 CPR/AED update questions
- 165 English–Bangla learning rules across traffic signs, road safety, motorways, incidents, and more
- Smart practice by topic, mistakes, bookmarks, or mixed questions
- 50-question, 57-minute mock tests with flags, navigation, and a 43/50 pass target
- English, Bangla, and dual-language display modes
- Essential-number references for speed limits, stopping distances, and safety rules
- Driving-theory vocabulary cards with Bangla pronunciation and meaning
- Interactive hazard-perception timing demonstration
- Persistent scores, streaks, learned rules, mistakes, bookmarks, and mock-test results
- Responsive layout for desktop and mobile

Progress is saved in the browser using `localStorage`. No account or database is required.

## Content coverage

| Section | Topic | Questions | Rules |
| --- | --- | ---: | ---: |
| Week 3 | Traffic signs | 80 | 20 |
| Week 4 | Speed, signals, road markings, and key numbers | 80 | 20 |
| Week 5 | Junctions, roundabouts, and crossings | 80 | 20 |
| Week 6 | Overtaking, vulnerable road users, and following distance | 80 | 20 |
| Week 7 | Vehicle safety, passengers, and legal documents | 80 | 20 |
| Week 8 | Fitness to drive, distraction, and adverse weather | 80 | 20 |
| Week 9 | Motorway driving and signals | 80 | 20 |
| Week 10 | Breakdowns, incidents, and hazard perception | 80 | 20 |
| 2026 update | CPR and automated external defibrillators | 8 | 5 |

## Run locally

### Requirements

- Node.js 24
- pnpm 10.4.1

```bash
git clone https://github.com/hasansust32/RoadReady.git
cd RoadReady
corepack enable
corepack prepare pnpm@10.4.1 --activate
pnpm install
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

| Command | Purpose |
| --- | --- |
| `pnpm run dev` | Start the Vite development server |
| `pnpm run check` | Run TypeScript validation |
| `pnpm run build:client` | Build the static frontend into `dist/public` |
| `pnpm run preview` | Preview the production frontend locally |
| `pnpm run build` | Build the frontend and optional Express server |
| `pnpm run start` | Run the production Express build |
| `pnpm run format` | Format the project with Prettier |

## Project structure

```text
client/
├── public/
│   ├── questions.json          # Bilingual question bank
│   └── manifest.webmanifest    # Web-app metadata
└── src/
    ├── components/app/         # Dashboard and study modes
    ├── data/content.ts         # Rules, vocabulary, numbers, and updates
    ├── hooks/useLocalStorage.ts
    └── pages/Home.tsx          # Application shell and progress logic
server/index.ts                 # Optional production server
vite.config.ts                  # Vite build and GitHub Pages base path
.github/workflows/deploy.yml    # GitHub Pages deployment
```

## Deploy to GitHub Pages

The repository uses GitHub's official Pages artifact workflow.

1. Open **Settings → Pages** and select **GitHub Actions** as the source.
2. Push changes to `main`.
3. The workflow installs dependencies, builds `dist/public`, and publishes the artifact.
4. Follow the run under the **Actions** tab.

Successful deployments are published at [https://hasansust32.github.io/RoadReady/](https://hasansust32.github.io/RoadReady/).

The production base path in `vite.config.ts` must remain `/RoadReady/` while the repository uses that name.

## Data and privacy

- Study progress stays in the current browser.
- Clearing site data resets saved progress.
- The application does not require login credentials.
- The static GitHub Pages build does not require the optional Express server.

## Important notice

RoadReady is an independent revision aid. It is not affiliated with or endorsed by DVSA, and its practice questions are not copied from the live theory test. Rules and test requirements can change, so verify important information using:

- [The Highway Code](https://www.gov.uk/guidance/the-highway-code)
- [Theory test revision and practice](https://www.gov.uk/theory-test/revision-and-practice)
- [Official practice theory test](https://www.gov.uk/take-practice-theory-test)

The hazard demonstration teaches response timing but is not an official DVSA hazard-perception clip.

## Author

Created for **Hasan** · [@hasansust32](https://github.com/hasansust32)
