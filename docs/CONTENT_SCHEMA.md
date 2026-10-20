# CyberPath Content Schema

All content lives in plain JavaScript files under `js/data/` and `js/labs/`, loaded with
`<script>` tags (no build step, works from `file://` and GitHub Pages). Every file must pass
`node --check <file>`.

Each file appends to a global registry. Always start a file with the guard line, e.g.:

```js
window.CP = window.CP || {};
CP.lessons = CP.lessons || [];
CP.lessons.push( /* objects */ );
```

Strings containing HTML use template literals. Inside them, never write a raw backtick or
`${` — escape as `\``, `\${`. Use `&lt;` `&gt;` `&amp;` for literal angle brackets/ampersands
inside HTML text (e.g. code samples).

## Curriculum IDs (fixed — use exactly these)

| Phase | Module IDs |
|---|---|
| `p0` Foundations — IT & Networking (CompTIA A+/Network+ level) | `p0-m1` How Computers & Operating Systems Work · `p0-m2` Networking Fundamentals · `p0-m3` Linux Command Line · `p0-m4` Windows & Active Directory · `p0-m5` Scripting for Security (Python, Bash, PowerShell) |
| `p1` Security Fundamentals (Security+ SY0-701) | `p1-m1` Core Security Concepts · `p1-m2` Threats, Vulnerabilities & Attacks · `p1-m3` Cryptography & PKI · `p1-m4` Identity & Access Management · `p1-m5` Secure Network Architecture & Zero Trust · `p1-m6` Vulnerability Management & Security Operations Basics |
| `p2` SOC Analyst (CySA+ / BTL1 / SC-200 level) | `p2-m1` Inside the SOC · `p2-m2` Log Sources & Log Analysis · `p2-m3` SIEM & Detection Engineering · `p2-m4` Network Traffic Analysis · `p2-m5` Endpoint Security & EDR · `p2-m6` Phishing & Email Analysis · `p2-m7` Threat Frameworks (ATT&CK, Kill Chain, Pyramid of Pain, Diamond) |
| `p3` Incident Response, Threat Intel & DFIR | `p3-m1` Incident Response Lifecycle · `p3-m2` Cyber Threat Intelligence · `p3-m3` Digital Forensics · `p3-m4` Malware Analysis Fundamentals · `p3-m5` Threat Hunting |
| `p4` Cloud, AppSec, GRC & Career | `p4-m1` Cloud Security · `p4-m2` Application & API Security · `p4-m3` Governance, Risk & Compliance · `p4-m4` AI & LLM Security · `p4-m5` Landing the Job |
| `p5` CISSP / Associate of ISC2 | `p5-d1` Security & Risk Management · `p5-d2` Asset Security · `p5-d3` Security Architecture & Engineering · `p5-d4` Communication & Network Security · `p5-d5` Identity & Access Management · `p5-d6` Security Assessment & Testing · `p5-d7` Security Operations · `p5-d8` Software Development Security · `p5-m9` Exam Strategy & the Associate Path |

Phase and module *metadata* (titles, summaries) is defined in `js/data/curriculum.js` (owned by the app shell).
Content files only provide lessons, cards, questions, labs and papers that reference these IDs.

## Lessons — `CP.lessons`

```js
{
  id: "p0-m2-l1",              // <module>-l<n>
  module: "p0-m2",
  title: "The OSI and TCP/IP Models",
  minutes: 15,
  objectives: ["Name the 7 OSI layers", "..."],
  html: `<p>...</p><h3>...</h3>...`,   // 500–1000 words. Use h3/h4, p, ul/ol, table, pre><code, and these callouts:
                                       // <div class="callout tip">, <div class="callout warn">, <div class="callout exam">, <div class="callout real">(real-world/on-the-job)
  keyTerms: [["Encapsulation", "Wrapping data with headers at each layer"], ...],
  standards: ["RFC 791", "NIST SP 800-41"],   // optional, real standards referenced
  labs: ["lab-subnet"],        // optional, lab ids that practice this lesson
  papers: ["paper-osi"]        // optional
}
```
3–4 lessons per module.

## Flashcards — `CP.flashcards`

```js
{ id: "fc-p1-m3-001", module: "p1-m3", front: "What does AES stand for and what type of cipher is it?", back: "Advanced Encryption Standard — a symmetric block cipher (128-bit blocks; 128/192/256-bit keys)." }
```
Fronts/backs may contain simple inline HTML (`<b>`, `<code>`, `<br>`).

## Questions — `CP.questions`

```js
{
  id: "q-p5-d1-001",
  module: "p5-d1",
  difficulty: 1,               // 1 = recall, 2 = apply, 3 = analyze/scenario (CISSP style "BEST/FIRST/MOST")
  q: "Which of the following is the BEST ...?",
  options: ["...", "...", "...", "..."],   // exactly 4
  answer: 2,                   // index into options
  explanation: "Why the right answer is right AND why the distractors are wrong."
}
```

## Labs — `CP.labs`

```js
{
  id: "lab-linux-terminal",
  title: "Linux Terminal Investigation",
  module: "p0-m3",             // primary module
  difficulty: "Beginner",      // Beginner | Intermediate | Advanced
  minutes: 20,
  skills: ["grep", "file permissions"],
  briefing: `<p>Scenario text…</p>`,
  render(container, ctx) {
    // Build the lab UI inside `container` (a DOM element). Pure DOM/vanilla JS, no libraries, no network.
    // Call ctx.complete(scorePercent) once the learner finishes (0–100).
    // ctx.escape(str) -> HTML-escaped string. ctx.store(key, value?) -> per-lab persistent storage (get when value omitted).
  }
}
```

Labs may use these shared CSS classes (from `css/styles.css`): `btn`, `btn primary`, `btn ghost`,
`input`, `select`, `textarea`, `card`, `grid-2`, `grid-3`, `tag`, `tag good`, `tag bad`, `tag warn`,
`alert good`, `alert bad`, `alert info`, `term` (terminal container, dark monospace), `term-line`,
`term-input`, `table` (on a `<table>`), `mono`, `muted`, `stack` (vertical gap), `row` (horizontal flex with gap).
If a lab needs more styling, inject one `<style>` element whose selectors are all prefixed with `.lab-<id>`
and add that class to the container. Use CSS variables `var(--bg)`, `var(--surface)`, `var(--text)`,
`var(--muted)`, `var(--accent)`, `var(--good)`, `var(--bad)`, `var(--warn)`, `var(--border)`, `var(--code-bg)`.

## Papers — `CP.papers`

```js
{
  id: "paper-nist-csf-2",
  title: "NIST Cybersecurity Framework 2.0: A Practitioner's Guide",
  module: "p4-m3",
  minutes: 20,
  summary: "One or two sentences.",
  html: `...`,                 // 1500–3000 words, long-form white-paper style with h3 sections
  references: [{ title: "NIST CSWP 29 — The NIST Cybersecurity Framework (CSF) 2.0", url: "https://..." }]
}
```
Only cite URLs you are confident are real, stable, official sources (nist.gov, cisa.gov, attack.mitre.org, owasp.org, isc2.org, etc.).
