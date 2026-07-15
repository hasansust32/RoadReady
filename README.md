# RoadReady — UK Driving Theory বাংলা

An interactive English–Bangla study application for the Great Britain Category B car theory test. It turns Hasan's complete bilingual workbook into a responsive practice system that works on desktop and mobile.

## What is included

- 640 original bilingual workbook MCQs across Weeks 3–10
- 160 core rules with English and Bangla explanations
- 8 supplementary 2026 CPR/AED questions and 5 update rules
- Smart Practice: mixed topics, individual weeks, mistakes, or bookmarks
- A 50-question, 57-minute mock test with flags, question map, and 43/50 pass target
- Persistent progress, learned rules, score, streak, mistakes, bookmarks, and best mock score
- Essential-numbers reference, including stopping distances and speed limits
- English driving-theory vocabulary cards with Bangla pronunciation and meaning
- Interactive developing-hazard timing demonstration
- English-only, Bangla-only, and dual-language display modes
- Responsive mobile navigation and installable web-app metadata

Progress is stored in the browser with `localStorage`; no account or database is required.

## Run locally

Requirements: Node.js 20 or newer and pnpm.

```bash
git clone https://github.com/hasansust32/RoadReady.git
cd RoadReady
pnpm install
pnpm run dev
```

Open `http://localhost:3000`.
  ➜  Local:   `http://localhost:3001/`
  ➜  Network: `http://10.5.0.2:3001/`
  ➜  Network: `http://192.168.1.227:3001/`

Useful commands:

```bash
pnpm run check          # TypeScript validation
pnpm run build:client   # Production web build
pnpm run preview        # Preview the production build
```

## Learning workflow

1. Open **Learn** and understand each rule in Bangla.
2. Say the English keyword and rule aloud, then mark it learned.
3. Use **Practice** in dual-language mode and review the explanation after every answer.
4. Repeat saved mistakes in English-only mode.
5. Take the **Mock test** and aim for at least 43/50.
6. Practise official video hazard clips separately; the app's hazard scene teaches timing but is not an official test clip.

The real theory test is not available in Bangla. It can be taken in English, Welsh, or British Sign Language.

## Content map

| Week | Topic | Questions | Rules |
| --- | --- | ---: | ---: |
| 3 | Traffic signs | 80 | 20 |
| 4 | Speed, signals, markings and numbers | 80 | 20 |
| 5 | Junctions, roundabouts and crossings | 80 | 20 |
| 6 | Overtaking, vulnerable road users and following distance | 80 | 20 |
| 7 | Vehicle safety, occupants and legal documents | 80 | 20 |
| 8 | Fitness to drive, distraction and adverse weather | 80 | 20 |
| 9 | Motorway driving and signals | 80 | 20 |
| 10 | Breakdowns, incidents and hazard perception | 80 | 20 |
| 2026 update | CPR and automated external defibrillators | 8 | 5 |

The workbook questions are original practice material, not questions copied from the live DVSA test.

## Project structure

```text
client/
  public/
    questions.json          640 bilingual workbook questions
    manifest.webmanifest    installable app metadata
  src/
    components/app/         dashboard and seven learning modes
    data/content.ts         vocabulary, numbers, metadata, 2026 update
    hooks/useLocalStorage.ts
    pages/Home.tsx          app shell and persistent progress logic
    index.css               responsive visual system
server/index.ts             optional production server
.github/workflows/deploy.yml
```

## GitHub Pages

Pushing to `main` runs the included workflow. It type-checks the application, builds the client with the correct repository base path, and publishes `dist/public` to the `gh-pages` branch.

In the repository settings, set **Pages → Build and deployment → Source** to **Deploy from a branch**, then select `gh-pages` and `/ (root)`.

## Official references

Study materials and test rules can change. Check these primary sources alongside this app:

- [Theory test revision and practice](https://www.gov.uk/theory-test/revision-and-practice)
- [The Highway Code](https://www.gov.uk/guidance/the-highway-code)
- [Free official practice test](https://www.gov.uk/take-practice-theory-test)
- [2026 CPR and defibrillator question update](https://www.gov.uk/government/news/new-theory-test-questions-aim-to-boost-cardiac-arrest-survival-rate)

## Author

Prepared for **Hasan** · [@hasansust32](https://github.com/hasansust32)
