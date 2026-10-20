# CyberPath — Zero to Security Analyst

A free, self-paced training platform that takes someone with **no IT background** to a
**job-ready SOC / Security Analyst**, then on to the **CISSP** exam (Associate of ISC2).

Everything runs in the browser — no server, no accounts, no build step.

## What's inside

| | |
|---|---|
| **Roadmap** | 6 phases · 37 modules · 130 lessons, from "what is an IP address" to the 8 CISSP domains |
| **Flashcards** | 709 cards with spaced repetition (SM-2 style: Again / Hard / Good / Easy) |
| **Question bank** | 490 multiple-choice questions with full explanations; module quizzes and timed mock exams (Security+, CySA+, domain-weighted CISSP) |
| **Interactive labs** | 22 browser-based simulations: Linux shell investigation, mini-SIEM with an SPL-like query language, Wireshark-style packet analysis, phishing inbox, Windows Event triage, YARA engine, firewall ACL builder, IR tabletop, cloud IAM review, OWASP web vulns, prompt injection and more |
| **Library** | 18 long-form papers citing the official standards |
| **Progress** | XP, streaks, per-module completion, exam history, job-readiness checklist, export/import |

### Phases

| # | Phase | Aligns with |
|---|---|---|
| 0 | Foundations: IT & Networking | CompTIA A+ / Network+ |
| 1 | Security Fundamentals | CompTIA Security+ SY0-701 |
| 2 | SOC Analyst | CompTIA CySA+ CS0-003, BTL1, Microsoft SC-200 |
| 3 | Incident Response, Threat Intel & DFIR | GCIH / GCIA concepts |
| 4 | Cloud, AppSec, GRC & Career | AWS/Azure security, OWASP, NIST CSF 2.0, ISO 27001 |
| 5 | CISSP — Associate of ISC2 | ISC2 CISSP outline (effective April 2024) |

### Standards & frameworks covered

NIST CSF 2.0 · NIST SP 800-61r3 · NIST SP 800-53r5 / RMF · NIST SP 800-63B · NIST SP 800-207 (Zero Trust) ·
FIPS 203/204/205 (post-quantum) · NIST AI RMF · MITRE ATT&CK · D3FEND · ATLAS · Cyber Kill Chain ·
Pyramid of Pain · Diamond Model · OWASP Top 10 2025 · OWASP API Security Top 10 · OWASP LLM Top 10 2025 ·
CIS Controls v8.1 · ISO/IEC 27001:2022 · SOC 2 · PCI DSS v4.0.1 · HIPAA · GDPR · EU AI Act ·
CVSS v4.0 · EPSS · CISA KEV · STIX/TAXII · TLP 2.0 · Sigma · YARA · NICE Framework.

## Running it

Open `index.html` in any modern browser. That's it.

To share it, enable **GitHub Pages** (Settings → Pages → deploy from the `main` branch, root folder).

Or serve locally:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

Progress is stored in the browser's localStorage. Use **Progress → Export** to back it up or move devices.

## Project layout

```
index.html            app entry
css/styles.css        styling (light + dark)
js/store.js           progress, XP, spaced-repetition scheduling
js/app.js             router and all views (dashboard, roadmap, lessons, quizzes, exams, flashcards, labs, library)
js/data/              curriculum map, lessons, flashcards, questions, papers
js/labs/              one file per interactive lab
docs/CONTENT_SCHEMA.md  how to add lessons, cards, questions, labs and papers
```

## Adding content

See [`docs/CONTENT_SCHEMA.md`](docs/CONTENT_SCHEMA.md). Content is plain JavaScript data, so contributions
are a single-file change. New lab files also need a `<script>` tag in `index.html`.

## Disclaimer

CyberPath is an independent study resource and is not affiliated with or endorsed by CompTIA, ISC2,
MITRE, NIST, OWASP, or any other organization named. Practice exams approximate, but do not reproduce,
real exam content. All lab data is fictional.
