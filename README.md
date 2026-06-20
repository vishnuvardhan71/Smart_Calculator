# SmartCalculator

A free, single-page web app bundling seven everyday calculators into one fast, clean interface — no sign-up, no backend, no ads.

**Live demo:** [add your Vercel URL here]

---

## Overview

SmartCalculator was built to solve a simple problem: searching for "EMI calculator" or "GST calculator" every time usually means landing on a page cluttered with ads and pop-ups for a tool that takes two seconds to use. This project puts the calculators people reach for most often in one place, with a consistent, distraction-free UI.

## Features

| # | Calculator | What it does |
|---|------------|---------------|
| 1 | **Age Calculator** | Exact age in years, months, and days between two dates, plus total days/weeks/months lived |
| 2 | **SGPA Calculator** | `SGPA = Σ(Credit × Grade Point) / Σ(Credits)` — add subjects dynamically |
| 3 | **CGPA Calculator** | Average CGPA from all semester SGPAs |
| 4 | **EMI Calculator** | Monthly installment, total interest, and total payable on a loan |
| 5 | **GST Calculator** | Add GST to a base amount or extract GST from a GST-inclusive amount, across all standard slabs |
| 6 | **Percentage / Discount Calculator** | Final price and amount saved after a percentage discount |
| 7 | **Split Bill Calculator** | Split a bill evenly across people, or by custom shares, with optional tip |

Additional details:
- Fully responsive, down to mobile screen widths
- No data leaves the browser — all calculations run client-side in JavaScript
- Calculators reset automatically each time they're opened, so there's never stale data from a previous session
- Built with accessible form elements and visible keyboard focus states

## Tech stack

- **HTML5** — structure (`index.html`)
- **CSS3** — styling, layout, and responsive design (`style.css`)
- **Vanilla JavaScript** — all calculation logic and UI interactivity (`script.js`)
- No frameworks, build tools, or external dependencies — runs by opening `index.html` in any browser

## Project structure

```
smartcalculator/
├── index.html      # Page structure and content for all 7 calculators
├── style.css       # All styling, design tokens, and responsive rules
├── script.js       # Calculator logic, panel navigation, and reset behavior
└── README.md       # This file
```

## Running locally

No installation or build step required.

```bash
git clone https://github.com/YOUR_USERNAME/smartcalculator.git
cd smartcalculator
open index.html      # or just double-click the file
```

For a local server (optional, useful for testing):
```bash
npx serve .
```

## Deployment

This project is deployed for free on [Vercel](https://vercel.com):

1. Push this repository to GitHub.
2. In Vercel, click **Add New → Project** and import the repo.
3. Framework preset: **Other** (static HTML, no build command needed).
4. Deploy — Vercel will serve `index.html` directly.

## Author

**[Your Full Name]**
📧 [your.email@example.com]

## License

This project is open source and available for personal and educational use.
