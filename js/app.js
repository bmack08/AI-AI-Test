(function () {
  "use strict";

  const S = window.CPStore;
  const CP = window.CP || (window.CP = {});
  ["phases", "lessons", "flashcards", "questions", "labs", "papers", "milestones"].forEach((k) => { CP[k] = CP[k] || []; });

  // ---------- Indexes ----------
  const modules = [];
  const moduleById = {};
  const phaseById = {};
  CP.phases.forEach((p, pi) => {
    phaseById[p.id] = p;
    p.index = pi;
    p.modules.forEach((m) => { m.phase = p.id; modules.push(m); moduleById[m.id] = m; });
  });
  const byModule = (list) => {
    const out = {};
    list.forEach((x) => { (out[x.module] = out[x.module] || []).push(x); });
    return out;
  };
  const lessonNum = (id) => parseInt((id.match(/-l(\d+)$/) || [0, 0])[1], 10);
  const lessonsByModule = byModule(CP.lessons);
  Object.values(lessonsByModule).forEach((l) => l.sort((a, b) => lessonNum(a.id) - lessonNum(b.id)));
  const cardsByModule = byModule(CP.flashcards);
  const questionsByModule = byModule(CP.questions);
  const labsByModule = byModule(CP.labs);
  const papersByModule = byModule(CP.papers);
  const lessonById = {}, labById = {}, paperById = {};
  CP.lessons.forEach((l) => { lessonById[l.id] = l; });
  CP.labs.forEach((l) => { labById[l.id] = l; });
  CP.papers.forEach((p) => { paperById[p.id] = p; });
  const lessonOrder = [];
  modules.forEach((m) => (lessonsByModule[m.id] || []).forEach((l) => lessonOrder.push(l)));

  // ---------- Helpers ----------
  const view = document.getElementById("view");
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const stripTags = (s) => String(s || "").replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " ");
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pct = (n, d) => (d ? Math.round((n / d) * 100) : 0);
  const bar = (p) => `<div class="progress" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100"><span style="width:${p}%"></span></div>`;
  const fmtDate = (ts) => new Date(ts).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  const fmtTime = (sec) => { const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60; return (h ? h + ":" : "") + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0"); };
  const diffTag = (d) => `<span class="tag ${d === "Beginner" ? "good" : d === "Advanced" ? "bad" : "warn"}">${esc(d)}</span>`;
  function toast(msg) {
    const t = document.createElement("div");
    t.className = "toast"; t.textContent = msg; document.body.appendChild(t);
    setTimeout(() => t.remove(), 2200);
  }
  let cleanup = null; // teardown for timers in the current view
  function render(html) {
    if (cleanup) { cleanup(); cleanup = null; }
    view.innerHTML = html;
    window.scrollTo(0, 0);
  }

  // ---------- Progress math ----------
  const QUIZ_PASS = 80;
  function moduleProgress(m) {
    const ls = lessonsByModule[m.id] || [];
    const done = ls.filter((l) => S.state.lessons[l.id]).length;
    const hasQuiz = (questionsByModule[m.id] || []).length > 0;
    const quizPassed = hasQuiz && (S.state.quizzes[m.id] || {}).best >= QUIZ_PASS;
    const units = ls.length + (hasQuiz ? 1 : 0);
    const got = done + (quizPassed ? 1 : 0);
    return { done, total: ls.length, quizPassed, hasQuiz, pct: pct(got, units), complete: units > 0 && got === units };
  }
  function phaseProgress(p) {
    const ps = p.modules.map(moduleProgress);
    const total = ps.reduce((a, x) => a + x.total + (x.hasQuiz ? 1 : 0), 0);
    const got = ps.reduce((a, x) => a + x.done + (x.quizPassed ? 1 : 0), 0);
    return { pct: pct(got, total), complete: total > 0 && got === total, modulesDone: ps.filter((x) => x.complete).length };
  }
  function overall() {
    const lessonsDone = CP.lessons.filter((l) => S.state.lessons[l.id]).length;
    return {
      lessonsDone, lessonsTotal: CP.lessons.length,
      labsDone: CP.labs.filter((l) => S.state.labs[l.id]).length, labsTotal: CP.labs.length,
      papersDone: CP.papers.filter((p) => S.state.papers[p.id]).length, papersTotal: CP.papers.length,
      cardsSeen: CP.flashcards.filter((c) => S.cardSeen(c.id)).length, cardsTotal: CP.flashcards.length,
      cardsDue: CP.flashcards.filter((c) => S.cardSeen(c.id) && S.cardDue(c.id)).length,
      pct: pct(lessonsDone, CP.lessons.length)
    };
  }
  function nextLesson() { return lessonOrder.find((l) => !S.state.lessons[l.id]); }

  // ---------- Navigation ----------
  const NAV = [
    ["#/", "Dashboard", "M3 12l9-9 9 9M5 10v10h14V10"],
    ["#/roadmap", "Roadmap", "M3 6h18M3 12h18M3 18h12"],
    ["#/flashcards", "Flashcards", "M4 5h12v14H4zM8 3h12v14"],
    ["#/exams", "Practice Exams", "M9 11l3 3 8-8M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"],
    ["#/labs", "Interactive Labs", "M4 17l6-6-6-6M12 19h8"],
    ["#/library", "Library", "M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5zM20 17v4H6.5"],
    ["#/glossary", "Glossary", "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-5-5"],
    ["#/progress", "Progress", "M4 20V10M10 20V4M16 20v-7M22 20H2"]
  ];
  function drawNav(route) {
    const due = overall().cardsDue;
    document.getElementById("nav").innerHTML = NAV.map(([href, label, d]) => {
      const active = route === href.slice(1) || (href !== "#/" && route.startsWith(href.slice(1)));
      const badge = label === "Flashcards" && due ? `<span class="badge">${due}</span>` : "";
      return `<a href="${href}" class="${active ? "active" : ""}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>${label}${badge}</a>`;
    }).join("");
  }

  // ---------- Views ----------
  function viewDashboard() {
    const o = overall();
    const nl = nextLesson();
    const st = S.streak();
    const lastExam = S.state.exams[0];
    const ms = CP.milestones;
    const msDone = ms.filter((m) => S.state.milestones[m.id]).length;
    render(`
      <section class="hero">
        <h1>Zero to Security Analyst</h1>
        <p class="muted" style="max-width:720px;margin:0 0 14px">A structured path from no IT background to a job-ready SOC analyst — then on to the CISSP as an Associate of ISC2. Read the lesson, drill the flashcards, prove it in a lab, then pass the quiz.</p>
        <div class="row">
          ${nl ? `<a class="btn primary" href="#/lesson/${nl.id}">${o.lessonsDone ? "Continue" : "Start"}: ${esc(nl.title)}</a>` : `<a class="btn primary" href="#/exams">All lessons done — take a mock exam</a>`}
          ${o.cardsDue ? `<a class="btn" href="#/flashcards">Review ${o.cardsDue} due cards</a>` : `<a class="btn" href="#/flashcards">Study flashcards</a>`}
        </div>
      </section>
      <div class="grid-4">
        <div class="card"><div class="stat">${o.pct}%</div><div class="stat-label">Curriculum complete</div></div>
        <div class="card"><div class="stat">${st}</div><div class="stat-label">Day streak</div></div>
        <div class="card"><div class="stat">${S.state.xp}</div><div class="stat-label">XP earned</div></div>
        <div class="card"><div class="stat">${o.labsDone}/${o.labsTotal}</div><div class="stat-label">Labs completed</div></div>
      </div>
      <h2>Your path</h2>
      <div class="grid-3">
        ${CP.phases.map((p) => {
          const pp = phaseProgress(p);
          return `<a class="card link" href="#/phase/${p.id}">
            <div class="row"><span class="tag accent">Phase ${p.index}</span>${pp.complete ? '<span class="tag good">Complete</span>' : ""}</div>
            <h3 style="margin:10px 0 4px">${esc(p.title)}</h3>
            <div class="muted small mb">${esc(p.level)} · ${esc(p.weeks)}</div>
            ${bar(pp.pct)}<div class="muted small" style="margin-top:6px">${pp.pct}% · ${pp.modulesDone}/${p.modules.length} modules</div>
          </a>`;
        }).join("")}
      </div>
      <div class="grid-2 mt">
        <div class="card">
          <h3>Job-readiness checklist</h3>
          <p class="muted small">${msDone}/${ms.length} done. The curriculum teaches the skills; these prove them to an employer.</p>
          <div class="stack" id="milestones">
            ${ms.map((m) => `<label class="row" style="align-items:flex-start;gap:8px;cursor:pointer"><input type="checkbox" data-ms="${m.id}" ${S.state.milestones[m.id] ? "checked" : ""} style="margin-top:5px"> <span>${esc(m.text)}</span></label>`).join("")}
          </div>
        </div>
        <div class="card">
          <h3>At a glance</h3>
          <table>
            <tr><td>Lessons</td><td>${o.lessonsDone} / ${o.lessonsTotal}</td></tr>
            <tr><td>Flashcards studied</td><td>${o.cardsSeen} / ${o.cardsTotal}</td></tr>
            <tr><td>Papers read</td><td>${o.papersDone} / ${o.papersTotal}</td></tr>
            <tr><td>Question bank</td><td>${CP.questions.length} questions</td></tr>
            <tr><td>Last mock exam</td><td>${lastExam ? `${esc(lastExam.title)} — ${lastExam.pct}% (${fmtDate(lastExam.ts)})` : "None yet"}</td></tr>
          </table>
          <h4>How to use CyberPath</h4>
          <ol class="small">
            <li>Work through phases in order. Plan 8–12 hours a week.</li>
            <li>After each lesson, do its linked lab and review the module's flashcards daily.</li>
            <li>Pass each module quiz at ${QUIZ_PASS}%+ to mark the module complete.</li>
            <li>Book Security+ after Phase 1 mocks hit 85%+, and start applying during Phase 2.</li>
          </ol>
        </div>
      </div>`);
    view.querySelectorAll("[data-ms]").forEach((cb) => cb.addEventListener("change", () => S.toggleMilestone(cb.dataset.ms)));
  }

  function viewRoadmap() {
    render(`
      <h1>Roadmap</h1>
      <p class="muted reading">Six phases, ${modules.length} modules, ${CP.lessons.length} lessons. Phases 0–2 get you hired as a Tier 1 SOC analyst; Phases 3–4 make you a strong Tier 2 candidate; Phase 5 prepares you for the CISSP exam. Pass it before you have five years of experience and you become an <b>Associate of ISC2</b>, upgrading to full CISSP once your experience is endorsed.</p>
      <div class="stack mt">
        ${CP.phases.map((p) => {
          const pp = phaseProgress(p);
          return `<div class="card phase">
            <div class="phase-num ${pp.complete ? "done" : ""}">${p.index}</div>
            <div>
              <div class="row"><h2 style="margin:4px 0"><a href="#/phase/${p.id}">${esc(p.title)}</a></h2><span class="spacer"></span><span class="muted small">${esc(p.weeks)}</span></div>
              <p class="muted" style="margin:4px 0 8px">${esc(p.summary)}</p>
              <div class="row small mb">${p.certs.map((c) => `<span class="tag info">${esc(c)}</span>`).join("")}</div>
              ${bar(pp.pct)}
              <ul class="module-list">
                ${p.modules.map((m) => {
                  const mp = moduleProgress(m);
                  return `<li><span class="check ${mp.complete ? "on" : mp.pct ? "half" : ""}">${mp.complete ? "✓" : ""}</span><a href="#/module/${m.id}">${esc(m.title)}</a><span class="spacer"></span><span class="muted small">${mp.done}/${mp.total} lessons${mp.quizPassed ? " · quiz ✓" : ""}</span></li>`;
                }).join("")}
              </ul>
            </div>
          </div>`;
        }).join("")}
      </div>`);
  }

  function viewPhase(id) {
    const p = phaseById[id];
    if (!p) return notFound();
    const pp = phaseProgress(p);
    render(`
      <div class="crumbs"><a href="#/roadmap">Roadmap</a> / Phase ${p.index}</div>
      <h1>Phase ${p.index}: ${esc(p.title)}</h1>
      <p class="reading">${esc(p.summary)}</p>
      <div class="alert info reading"><b>Outcome:</b> ${esc(p.outcome)}</div>
      <div class="row mt small">${p.certs.map((c) => `<span class="tag info">${esc(c)}</span>`).join("")}<span class="spacer"></span><span class="muted">${esc(p.weeks)}</span></div>
      <div class="mt">${bar(pp.pct)}</div>
      <div class="grid-2 mt">
        ${p.modules.map((m) => {
          const mp = moduleProgress(m);
          const nLabs = (labsByModule[m.id] || []).length, nCards = (cardsByModule[m.id] || []).length, nQ = (questionsByModule[m.id] || []).length;
          return `<a class="card link" href="#/module/${m.id}">
            <div class="row"><span class="tag">${esc(m.id.toUpperCase())}</span>${mp.complete ? '<span class="tag good">Complete</span>' : ""}</div>
            <h3 style="margin:8px 0 4px">${esc(m.title)}</h3>
            <p class="muted small" style="margin:0 0 10px">${esc(m.summary)}</p>
            ${bar(mp.pct)}
            <div class="muted small" style="margin-top:6px">${mp.total} lessons · ${nCards} cards · ${nQ} questions${nLabs ? ` · ${nLabs} lab${nLabs > 1 ? "s" : ""}` : ""}</div>
          </a>`;
        }).join("")}
      </div>
      <div class="row mt">
        <a class="btn" href="#/flashcards?phase=${p.id}">Flashcards for this phase</a>
        <a class="btn" href="#/exam/phase-${p.id}">Phase ${p.index} practice exam</a>
      </div>`);
  }

  function viewModule(id) {
    const m = moduleById[id];
    if (!m) return notFound();
    const p = phaseById[m.phase];
    const ls = lessonsByModule[id] || [];
    const labs = labsByModule[id] || [];
    const papers = papersByModule[id] || [];
    const linkedLabs = new Set(labs.map((l) => l.id));
    ls.forEach((l) => (l.labs || []).forEach((x) => labById[x] && linkedLabs.add(x)));
    const linkedPapers = new Set(papers.map((x) => x.id));
    ls.forEach((l) => (l.papers || []).forEach((x) => paperById[x] && linkedPapers.add(x)));
    const mp = moduleProgress(m);
    const q = S.state.quizzes[id];
    const nQ = (questionsByModule[id] || []).length;
    render(`
      <div class="crumbs"><a href="#/roadmap">Roadmap</a> / <a href="#/phase/${p.id}">Phase ${p.index}</a> / ${esc(m.id.toUpperCase())}</div>
      <h1>${esc(m.title)}</h1>
      <p class="muted reading">${esc(m.summary)}</p>
      ${bar(mp.pct)}
      <div class="grid-2 mt">
        <div class="card">
          <h3>Lessons</h3>
          ${ls.length ? `<ul class="module-list">${ls.map((l) => `<li><span class="check ${S.state.lessons[l.id] ? "on" : ""}">${S.state.lessons[l.id] ? "✓" : ""}</span><a href="#/lesson/${l.id}">${esc(l.title)}</a><span class="spacer"></span><span class="muted small">${l.minutes} min</span></li>`).join("")}</ul>` : `<p class="muted">Lessons coming soon.</p>`}
        </div>
        <div class="stack">
          <div class="card">
            <h3>Module quiz</h3>
            <p class="muted small">${nQ} questions in the bank. Score ${QUIZ_PASS}%+ to complete the module.${q ? ` Best: <b>${q.best}%</b> (${q.attempts} attempt${q.attempts > 1 ? "s" : ""}).` : ""}</p>
            ${nQ ? `<a class="btn primary" href="#/quiz/${id}">${q ? "Retake quiz" : "Take quiz"}</a>` : ""}
            <a class="btn" href="#/flashcards?module=${id}">Flashcards (${(cardsByModule[id] || []).length})</a>
          </div>
          ${linkedLabs.size ? `<div class="card"><h3>Labs</h3><div class="stack">${[...linkedLabs].map((x) => labById[x]).map((l) => `<a href="#/lab/${l.id}">${esc(l.title)}</a>`).join("")}</div></div>` : ""}
          ${linkedPapers.size ? `<div class="card"><h3>Read</h3><div class="stack">${[...linkedPapers].map((x) => paperById[x]).map((x) => `<a href="#/paper/${x.id}">${esc(x.title)}</a>`).join("")}</div></div>` : ""}
        </div>
      </div>`);
  }

  function viewLesson(id) {
    const l = lessonById[id];
    if (!l) return notFound();
    const m = moduleById[l.module] || { title: l.module, id: l.module, phase: "p0" };
    const p = phaseById[m.phase];
    const i = lessonOrder.indexOf(l);
    const prev = lessonOrder[i - 1], next = lessonOrder[i + 1];
    const done = !!S.state.lessons[id];
    const siblings = lessonsByModule[l.module] || [];
    const lastInModule = siblings[siblings.length - 1] === l;
    render(`
      <div class="reading">
        <div class="crumbs"><a href="#/roadmap">Roadmap</a> / <a href="#/phase/${p.id}">Phase ${p.index}</a> / <a href="#/module/${m.id}">${esc(m.title)}</a></div>
        <h1>${esc(l.title)}</h1>
        <div class="row muted small mb"><span>${l.minutes} min read</span>${(l.standards || []).map((s) => `<span class="tag">${esc(s)}</span>`).join("")}</div>
        ${l.objectives && l.objectives.length ? `<div class="card mb"><b>You will be able to:</b><ul style="margin:6px 0 0">${l.objectives.map((o) => `<li>${esc(o)}</li>`).join("")}</ul></div>` : ""}
        <article class="lesson-body">${l.html}</article>
        ${l.keyTerms && l.keyTerms.length ? `<div class="card mt"><h3>Key terms</h3><dl class="keyterms">${l.keyTerms.map(([t, d]) => `<dt>${esc(t)}</dt><dd>${esc(d)}</dd>`).join("")}</dl></div>` : ""}
        ${(l.labs || []).filter((x) => labById[x]).length ? `<div class="alert info mt"><b>Practice it:</b> ${(l.labs || []).filter((x) => labById[x]).map((x) => `<a href="#/lab/${x}">${esc(labById[x].title)}</a>`).join(" · ")}</div>` : ""}
        ${(l.papers || []).filter((x) => paperById[x]).length ? `<div class="alert info mt"><b>Go deeper:</b> ${(l.papers || []).filter((x) => paperById[x]).map((x) => `<a href="#/paper/${x}">${esc(paperById[x].title)}</a>`).join(" · ")}</div>` : ""}
        <div class="row mt">
          <button class="btn ${done ? "" : "primary"}" id="mark">${done ? "✓ Completed — mark as not done" : "Mark lesson complete"}</button>
          ${lastInModule && (questionsByModule[l.module] || []).length ? `<a class="btn" href="#/quiz/${l.module}">Take the module quiz</a>` : ""}
        </div>
        <div class="pager">
          ${prev ? `<a class="btn ghost" href="#/lesson/${prev.id}">← ${esc(prev.title)}</a>` : "<span></span>"}
          ${next ? `<a class="btn ghost" href="#/lesson/${next.id}">${esc(next.title)} →</a>` : ""}
        </div>
      </div>`);
    document.getElementById("mark").addEventListener("click", () => {
      if (S.state.lessons[id]) { S.uncompleteLesson(id); viewLesson(id); }
      else { S.completeLesson(id); toast("+10 XP — lesson complete"); if (next) location.hash = "#/lesson/" + next.id; else viewLesson(id); }
    });
  }

  // ---------- Quiz / exam engine ----------
  // opts: { title, questions, mode: "practice"|"exam", minutes, passPct, onFinish(result), backHref }
  function runQuiz(opts) {
    const qs = opts.questions;
    const answers = new Array(qs.length).fill(null);
    const flagged = new Array(qs.length).fill(false);
    const revealed = new Array(qs.length).fill(false);
    let idx = 0;
    let finished = false;
    const started = Date.now();
    const limit = opts.minutes ? opts.minutes * 60 : 0;
    let timerId = null;

    function remaining() { return Math.max(0, limit - Math.floor((Date.now() - started) / 1000)); }

    function draw() {
      const q = qs[idx];
      const m = moduleById[q.module];
      const isExam = opts.mode === "exam";
      const show = !isExam && revealed[idx];
      render(`
        <div class="reading">
          <div class="row"><h2 style="margin:0">${esc(opts.title)}</h2><span class="spacer"></span>${limit ? `<span class="timer" id="timer">${fmtTime(remaining())}</span>` : ""}</div>
          <div class="muted small" style="margin:6px 0 10px">Question ${idx + 1} of ${qs.length}${m ? ` · ${esc(m.title)}` : ""}</div>
          ${bar(pct(answers.filter((a) => a !== null).length, qs.length))}
          <div class="card mt">
            <p style="font-size:1.05rem;margin-top:0"><b>${q.q}</b></p>
            ${q.options.map((o, i) => {
              let cls = "q-option";
              if (answers[idx] === i) cls += " selected";
              if (show) { if (i === q.answer) cls += " correct"; else if (answers[idx] === i) cls += " wrong"; }
              return `<button class="${cls}" data-opt="${i}" ${show ? "disabled" : ""}><b>${"ABCD"[i]}.</b> ${o}</button>`;
            }).join("")}
            ${show ? `<div class="alert ${answers[idx] === q.answer ? "good" : "bad"} mt"><b>${answers[idx] === q.answer ? "Correct." : "Not quite — the answer is " + "ABCD"[q.answer] + "."}</b> ${q.explanation}</div>` : ""}
          </div>
          <div class="row mt">
            <button class="btn" id="prev" ${idx === 0 ? "disabled" : ""}>← Back</button>
            ${isExam ? `<button class="btn ${flagged[idx] ? "warn" : ""}" id="flag">${flagged[idx] ? "Flagged" : "Flag for review"}</button>` : ""}
            <span class="spacer"></span>
            ${!isExam && !show ? `<button class="btn primary" id="check" ${answers[idx] === null ? "disabled" : ""}>Check answer</button>` : ""}
            ${idx < qs.length - 1 ? `<button class="btn ${!isExam && show ? "primary" : ""}" id="next">Next →</button>` : `<button class="btn primary" id="finish">Finish</button>`}
          </div>
          ${isExam ? `<div class="card mt"><div class="muted small mb">Jump to question (blue = answered, orange outline = flagged)</div><div class="q-nav">${qs.map((_, i) => `<button data-jump="${i}" class="${i === idx ? "current" : answers[i] !== null ? "answered" : ""} ${flagged[i] ? "flagged" : ""}">${i + 1}</button>`).join("")}</div></div>` : ""}
          <div class="mt"><a href="${opts.backHref}" class="muted small" id="quit">Quit without saving</a></div>
        </div>`);
      cleanup = () => { if (timerId) clearInterval(timerId); timerId = null; };
      if (limit) {
        timerId = setInterval(() => {
          const t = document.getElementById("timer");
          const r = remaining();
          if (t) t.textContent = fmtTime(r);
          if (r <= 0) { toast("Time is up"); finish(); }
        }, 1000);
      }
      view.querySelectorAll("[data-opt]").forEach((b) => b.addEventListener("click", () => {
        answers[idx] = Number(b.dataset.opt);
        if (isExam) draw(); else { view.querySelectorAll("[data-opt]").forEach((x) => x.classList.toggle("selected", x === b)); document.getElementById("check").disabled = false; }
      }));
      const on = (id, fn) => { const e = document.getElementById(id); if (e) e.addEventListener("click", fn); };
      on("prev", () => { idx--; draw(); });
      on("next", () => { idx++; draw(); });
      on("check", () => { revealed[idx] = true; draw(); });
      on("flag", () => { flagged[idx] = !flagged[idx]; draw(); });
      on("finish", () => {
        const unanswered = answers.filter((a) => a === null).length;
        if (unanswered && !confirm(`${unanswered} question(s) unanswered. Finish anyway?`)) return;
        finish();
      });
      view.querySelectorAll("[data-jump]").forEach((b) => b.addEventListener("click", () => { idx = Number(b.dataset.jump); draw(); }));
    }

    function finish() {
      if (finished) return;
      finished = true;
      if (cleanup) { cleanup(); cleanup = null; }
      const correct = qs.filter((q, i) => answers[i] === q.answer).length;
      const score = pct(correct, qs.length);
      const domains = {};
      qs.forEach((q, i) => {
        const d = domains[q.module] || (domains[q.module] = { c: 0, t: 0 });
        d.t++; if (answers[i] === q.answer) d.c++;
      });
      const result = { title: opts.title, pct: score, correct, total: qs.length, ts: Date.now(), seconds: Math.floor((Date.now() - started) / 1000), domains };
      if (opts.onFinish) opts.onFinish(result);
      drawResults(result);
    }

    function drawResults(r) {
      const pass = r.pct >= (opts.passPct || QUIZ_PASS);
      render(`
        <div class="reading">
          <h1>${esc(opts.title)} — results</h1>
          <div class="card">
            <div class="row"><div><div class="stat" style="color:var(${pass ? "--good" : "--bad"})">${r.pct}%</div><div class="stat-label">${r.correct} of ${r.total} correct · ${fmtTime(r.seconds)}</div></div><span class="spacer"></span><span class="tag ${pass ? "good" : "bad"}">${pass ? "PASS" : "Below target"} (target ${opts.passPct || QUIZ_PASS}%)</span></div>
            ${opts.note ? `<p class="muted small">${opts.note}</p>` : ""}
          </div>
          ${Object.keys(r.domains).length > 1 ? `<h3>By topic</h3><table><tr><th>Module / domain</th><th>Score</th><th style="width:30%"></th></tr>${Object.entries(r.domains).map(([k, d]) => `<tr><td><a href="#/module/${k}">${esc((moduleById[k] || {}).title || k)}</a></td><td>${d.c}/${d.t}</td><td>${bar(pct(d.c, d.t))}</td></tr>`).join("")}</table>` : ""}
          <h3>Review</h3>
          <div class="row mb"><button class="chip on" data-f="wrong">Missed only</button><button class="chip" data-f="all">All questions</button></div>
          <div id="review" class="stack"></div>
          <div class="row mt"><a class="btn primary" href="${opts.backHref}">Done</a><button class="btn" id="retry">Retry with new questions</button></div>
        </div>`);
      const drawReview = (filter) => {
        document.getElementById("review").innerHTML = qs.map((q, i) => ({ q, i })).filter(({ q, i }) => filter === "all" || answers[i] !== q.answer).map(({ q, i }) => `
          <div class="card">
            <div class="muted small">Q${i + 1} · ${esc((moduleById[q.module] || {}).title || q.module)}</div>
            <p><b>${q.q}</b></p>
            ${q.options.map((o, j) => `<div class="q-option ${j === q.answer ? "correct" : answers[i] === j ? "wrong" : ""}" style="cursor:default"><b>${"ABCD"[j]}.</b> ${o}</div>`).join("")}
            <p class="small">${answers[i] === null ? "<b>Not answered.</b> " : ""}${q.explanation}</p>
          </div>`).join("") || `<div class="empty">Perfect score — nothing to review.</div>`;
      };
      drawReview("wrong");
      view.querySelectorAll("[data-f]").forEach((c) => c.addEventListener("click", () => {
        view.querySelectorAll("[data-f]").forEach((x) => x.classList.toggle("on", x === c)); drawReview(c.dataset.f);
      }));
      document.getElementById("retry").addEventListener("click", () => route(true));
    }

    if (!qs.length) { render(`<div class="empty">No questions available yet for this selection.</div>`); return; }
    draw();
  }

  function viewQuiz(moduleId) {
    const m = moduleById[moduleId];
    if (!m) return notFound();
    const pool = questionsByModule[moduleId] || [];
    runQuiz({
      title: m.title + " quiz", mode: "practice", questions: shuffle(pool).slice(0, 10), passPct: QUIZ_PASS,
      backHref: "#/module/" + moduleId,
      onFinish: (r) => S.recordQuiz(moduleId, r.pct)
    });
  }

  // Practice exam definitions
  function phaseQs(ids) { return CP.questions.filter((q) => ids.includes((moduleById[q.module] || {}).phase)); }
  const EXAMS = [
    { id: "quick", title: "Quick 20", desc: "20 random questions from everything you've started. Good daily warm-up.", count: 20, minutes: 0, pass: 80,
      pool: () => { const started = new Set(Object.keys(S.state.lessons).map((l) => (lessonById[l] || {}).module)); const p = CP.questions.filter((q) => started.has(q.module)); return p.length >= 10 ? p : CP.questions; } },
    { id: "secplus", title: "Security+ style mock", desc: "Phases 0–1. 90 questions in 90 minutes, mirroring the SY0-701 length and time. The real exam is scaled (750/900) and adds performance-based questions — aim for 85%+ here before booking.", count: 90, minutes: 90, pass: 83, pool: () => phaseQs(["p0", "p1"]) },
    { id: "cysa", title: "CySA+ / SOC analyst mock", desc: "Phases 2–3. 85 questions, 165 minutes, matching CS0-003 length and time. Heavy on log analysis, triage, IR and threat intel.", count: 85, minutes: 165, pass: 80, pool: () => phaseQs(["p2", "p3"]) },
    { id: "cissp", title: "CISSP mock (domain-weighted)", desc: "125 questions across the 8 domains, weighted per the April 2024 ISC2 outline, 3-hour limit. The real CISSP is adaptive (CAT, 100–150 items) and scaled to 700/1000 — this is a linear approximation, so treat 75%+ as a strong signal.", count: 125, minutes: 180, pass: 75, cissp: true },
    { id: "cissp-quick", title: "CISSP sprint", desc: "50 domain-weighted CISSP questions in 60 minutes — think like a manager.", count: 50, minutes: 60, pass: 75, cissp: true }
  ];
  CP.phases.forEach((p) => EXAMS.push({ id: "phase-" + p.id, title: `Phase ${p.index} exam: ${p.short}`, desc: `Covers all modules in ${p.title}.`, count: 40, minutes: 50, pass: 80, pool: () => phaseQs([p.id]), hidden: true }));

  function cisspSet(n) {
    const doms = phaseById.p5.modules.filter((m) => m.weight);
    let out = [];
    doms.forEach((d) => {
      const want = Math.round((n * d.weight) / 100);
      out = out.concat(shuffle(questionsByModule[d.id] || []).slice(0, want));
    });
    return shuffle(out);
  }

  function viewExams() {
    const hist = S.state.exams;
    render(`
      <h1>Practice exams</h1>
      <p class="muted reading">Exam mode hides answers until the end, lets you flag and revisit questions, and runs a timer — like the real thing. Module quizzes (in each module) give instant feedback instead.</p>
      <div class="grid-2">
        ${EXAMS.filter((e) => !e.hidden).map((e) => {
          const avail = e.cissp ? CP.questions.filter((q) => /^p5-d/.test(q.module)).length : e.pool().length;
          return `<div class="card"><h3>${esc(e.title)}</h3><p class="muted small">${esc(e.desc)}</p><div class="row small muted mb">${Math.min(e.count, avail)} questions${e.minutes ? ` · ${e.minutes} min` : " · untimed"} · pass ${e.pass}%</div><a class="btn primary" href="#/exam/${e.id}">Start</a></div>`;
        }).join("")}
        <div class="card"><h3>Phase exams</h3><p class="muted small">40 questions from a single phase.</p><div class="row">${CP.phases.map((p) => `<a class="btn sm" href="#/exam/phase-${p.id}">Phase ${p.index}</a>`).join("")}</div></div>
      </div>
      <h2>History</h2>
      ${hist.length ? `<div class="table-wrap"><table><tr><th>Date</th><th>Exam</th><th>Score</th><th>Time</th></tr>${hist.map((h) => `<tr><td>${fmtDate(h.ts)}</td><td>${esc(h.title)}</td><td>${h.pct}% (${h.correct}/${h.total})</td><td>${fmtTime(h.seconds)}</td></tr>`).join("")}</table></div>` : `<p class="muted">No exams taken yet.</p>`}`);
  }

  function viewExam(id) {
    const e = EXAMS.find((x) => x.id === id);
    if (!e) return notFound();
    const qs = e.cissp ? cisspSet(e.count) : shuffle(e.pool()).slice(0, e.count);
    runQuiz({
      title: e.title, mode: "exam", questions: qs, minutes: e.minutes, passPct: e.pass, backHref: "#/exams",
      note: e.cissp ? "The real CISSP stops when the CAT engine is 95% confident you are above or below the passing standard. Use the domain table to find weak areas — every domain must be solid." : "",
      onFinish: (r) => S.recordExam(r)
    });
  }

  // ---------- Flashcards ----------
  function viewFlashcards(params) {
    const scopePhase = params.get("phase"), scopeModule = params.get("module");
    const mode = params.get("mode") || "srs";
    let pool = CP.flashcards;
    if (scopeModule) pool = pool.filter((c) => c.module === scopeModule);
    else if (scopePhase) pool = pool.filter((c) => (moduleById[c.module] || {}).phase === scopePhase);
    const due = pool.filter((c) => S.cardSeen(c.id) && S.cardDue(c.id));
    const fresh = pool.filter((c) => !S.cardSeen(c.id));
    const scopeLabel = scopeModule ? (moduleById[scopeModule] || {}).title : scopePhase ? phaseById[scopePhase].title : "All decks";

    if (!params.get("go")) {
      render(`
        <h1>Flashcards</h1>
        <p class="muted reading">Spaced repetition: cards you know come back in days or weeks; cards you miss come back in a minute. Ten minutes a day beats a two-hour cram.</p>
        <div class="card">
          <div class="row">
            <label>Deck <select class="select" id="deck">
              <option value="">All decks (${CP.flashcards.length})</option>
              ${CP.phases.map((p) => `<optgroup label="Phase ${p.index}: ${esc(p.short)}"><option value="phase:${p.id}" ${scopePhase === p.id && !scopeModule ? "selected" : ""}>Whole phase</option>${p.modules.map((m) => `<option value="module:${m.id}" ${scopeModule === m.id ? "selected" : ""}>${esc(m.title)} (${(cardsByModule[m.id] || []).length})</option>`).join("")}</optgroup>`).join("")}
            </select></label>
          </div>
          <div class="grid-3 mt">
            <div><div class="stat">${due.length}</div><div class="stat-label">Due for review</div></div>
            <div><div class="stat">${fresh.length}</div><div class="stat-label">New</div></div>
            <div><div class="stat">${pool.length - fresh.length}</div><div class="stat-label">Learned</div></div>
          </div>
          <div class="row mt">
            <button class="btn primary" id="go-srs" ${due.length + fresh.length ? "" : "disabled"}>Study (${due.length} due + up to ${Math.min(20, fresh.length)} new)</button>
            <button class="btn" id="go-cram" ${pool.length ? "" : "disabled"}>Cram whole deck (no scheduling)</button>
          </div>
        </div>`);
      const q = () => { const v = document.getElementById("deck").value; const [k, x] = v.split(":"); return v ? `${k}=${x}` : ""; };
      document.getElementById("deck").addEventListener("change", () => { location.hash = "#/flashcards" + (q() ? "?" + q() : ""); });
      document.getElementById("go-srs").addEventListener("click", () => { location.hash = "#/flashcards?" + [q(), "go=1"].filter(Boolean).join("&"); });
      document.getElementById("go-cram").addEventListener("click", () => { location.hash = "#/flashcards?" + [q(), "go=1", "mode=cram"].filter(Boolean).join("&"); });
      return;
    }

    let queue = mode === "cram" ? shuffle(pool) : shuffle(due).concat(shuffle(fresh).slice(0, 20));
    let reviewed = 0, again = 0;
    const back = "#/flashcards" + (scopeModule ? "?module=" + scopeModule : scopePhase ? "?phase=" + scopePhase : "");

    function next() {
      if (!queue.length) {
        render(`<div class="reading center"><h1>Session complete</h1><p>${reviewed} cards reviewed${again ? `, ${again} marked "Again"` : ""}.</p><a class="btn primary" href="${back}">Back to decks</a></div>`);
        return;
      }
      const c = queue[0];
      const m = moduleById[c.module];
      render(`
        <div class="row" style="max-width:640px;margin:0 auto 12px"><a href="${back}" class="muted small">← ${esc(scopeLabel)}</a><span class="spacer"></span><span class="muted small">${queue.length} left · ${mode === "cram" ? "cram" : "spaced repetition"}</span></div>
        <div class="flash" id="flash">
          <div class="flash-inner" tabindex="0" role="button" aria-label="Flip card">
            <div class="flash-face"><div><div class="muted small mb">${esc(m ? m.title : c.module)}</div>${c.front}</div></div>
            <div class="flash-face flash-back"><div>${c.back}</div></div>
          </div>
        </div>
        <p class="center muted small">Click the card or press Space to flip. Then rate: 1 Again · 2 Hard · 3 Good · 4 Easy</p>
        <div class="rate" id="rate" style="visibility:hidden">
          <button class="btn bad" data-r="0">Again</button><button class="btn warn" data-r="1">Hard</button><button class="btn good" data-r="2">Good</button><button class="btn primary" data-r="3">Easy</button>
        </div>`);
      const flash = document.getElementById("flash");
      const flip = () => { flash.classList.toggle("flipped"); document.getElementById("rate").style.visibility = "visible"; };
      flash.addEventListener("click", flip);
      const rate = (r) => {
        reviewed++;
        queue.shift();
        if (mode !== "cram") S.rateCard(c.id, r);
        if (r === 0) { again++; queue.splice(Math.min(queue.length, 3), 0, c); }
        next();
      };
      view.querySelectorAll("[data-r]").forEach((b) => b.addEventListener("click", () => rate(Number(b.dataset.r))));
      const onKey = (e) => {
        if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
        if (e.key === " ") { e.preventDefault(); flip(); }
        else if (["1", "2", "3", "4"].includes(e.key) && flash.classList.contains("flipped")) rate(Number(e.key) - 1);
      };
      document.addEventListener("keydown", onKey);
      cleanup = () => document.removeEventListener("keydown", onKey);
    }
    next();
  }

  // ---------- Labs ----------
  function viewLabs(params) {
    const f = params.get("level") || "all";
    const list = CP.labs.slice().sort((a, b) => modules.indexOf(moduleById[a.module]) - modules.indexOf(moduleById[b.module]));
    const shown = list.filter((l) => f === "all" || l.difficulty === f);
    render(`
      <h1>Interactive labs</h1>
      <p class="muted reading">Hands-on simulations that run entirely in your browser — a Linux shell, a mini SIEM, a packet viewer, a phishing inbox, a YARA engine and more. Nothing touches a real system.</p>
      <div class="filters">${["all", "Beginner", "Intermediate", "Advanced"].map((x) => `<a class="chip ${f === x ? "on" : ""}" href="#/labs${x === "all" ? "" : "?level=" + x}">${x === "all" ? "All" : x}</a>`).join("")}</div>
      ${shown.length ? `<div class="grid-2">${shown.map((l) => {
        const r = S.state.labs[l.id];
        const m = moduleById[l.module];
        return `<a class="card link" href="#/lab/${l.id}">
          <div class="row">${diffTag(l.difficulty)}<span class="tag">${esc(m ? "Phase " + phaseById[m.phase].index : "")}</span>${r ? `<span class="tag good">Best ${r.best}%</span>` : ""}<span class="spacer"></span><span class="muted small">${l.minutes} min</span></div>
          <h3 style="margin:10px 0 4px">${esc(l.title)}</h3>
          <div class="muted small">${esc(m ? m.title : "")}</div>
          <div class="row small mt">${(l.skills || []).slice(0, 5).map((s) => `<span class="tag">${esc(s)}</span>`).join("")}</div>
        </a>`;
      }).join("")}</div>` : `<div class="empty">No labs loaded yet.</div>`}`);
  }

  function viewLab(id) {
    const l = labById[id];
    if (!l) return notFound();
    const m = moduleById[l.module];
    const r = S.state.labs[id];
    render(`
      <div class="crumbs"><a href="#/labs">Labs</a>${m ? ` / <a href="#/module/${m.id}">${esc(m.title)}</a>` : ""}</div>
      <div class="row"><h1 style="margin:0">${esc(l.title)}</h1></div>
      <div class="row small mt mb">${diffTag(l.difficulty)}<span class="muted">${l.minutes} min</span>${(l.skills || []).map((s) => `<span class="tag">${esc(s)}</span>`).join("")}${r ? `<span class="tag good">Best score ${r.best}%</span>` : ""}</div>
      <div class="card reading">${l.briefing || ""}</div>
      <div id="lab-done"></div>
      <div class="lab-host" id="lab-host"></div>
      <div class="row mt no-print"><button class="btn ghost" id="lab-reset">Restart lab</button></div>`);
    const host = document.getElementById("lab-host");
    const ctx = {
      complete(score) {
        score = Math.max(0, Math.min(100, Math.round(Number(score) || 0)));
        S.recordLab(id, score);
        document.getElementById("lab-done").innerHTML = `<div class="alert good mt">Lab complete — score <b>${score}%</b>. ${score >= 80 ? "Nicely done." : "Review the feedback and try again to improve your score."} <a href="#/labs">More labs →</a></div>`;
        toast(`Lab complete: ${score}%`);
      },
      escape: esc,
      store: (key, value) => S.labStore(id, key, value)
    };
    try { l.render(host, ctx); } catch (err) {
      console.error(err);
      host.innerHTML = `<div class="alert bad">This lab failed to load: ${esc(err.message)}</div>`;
    }
    document.getElementById("lab-reset").addEventListener("click", () => viewLab(id));
  }

  // ---------- Library ----------
  function viewLibrary() {
    const list = CP.papers.slice().sort((a, b) => modules.indexOf(moduleById[a.module]) - modules.indexOf(moduleById[b.module]));
    render(`
      <h1>Library</h1>
      <p class="muted reading">Long-form papers that go deeper than the lessons — the kind of reading that makes you sound like a practitioner in an interview. Each one cites the official standards so you can go to the source.</p>
      ${list.length ? `<div class="grid-2">${list.map((p) => {
        const m = moduleById[p.module];
        return `<a class="card link" href="#/paper/${p.id}">
          <div class="row"><span class="tag accent">${esc(m ? "Phase " + phaseById[m.phase].index : "")}</span>${S.state.papers[p.id] ? '<span class="tag good">Read</span>' : ""}<span class="spacer"></span><span class="muted small">${p.minutes} min</span></div>
          <h3 style="margin:10px 0 4px">${esc(p.title)}</h3>
          <p class="muted small" style="margin:0">${esc(p.summary)}</p>
        </a>`;
      }).join("")}</div>` : `<div class="empty">No papers loaded yet.</div>`}`);
  }

  function viewPaper(id) {
    const p = paperById[id];
    if (!p) return notFound();
    const m = moduleById[p.module];
    const read = !!S.state.papers[id];
    render(`
      <div class="reading">
        <div class="crumbs"><a href="#/library">Library</a>${m ? ` / <a href="#/module/${m.id}">${esc(m.title)}</a>` : ""}</div>
        <h1>${esc(p.title)}</h1>
        <div class="muted small mb">${p.minutes} min read</div>
        <p class="muted"><i>${esc(p.summary)}</i></p>
        <article class="lesson-body">${p.html}</article>
        ${p.references && p.references.length ? `<div class="card mt"><h3>References</h3><ol class="small">${p.references.map((r) => `<li><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.title)}</a></li>`).join("")}</ol></div>` : ""}
        <div class="row mt no-print"><button class="btn ${read ? "" : "primary"}" id="read" ${read ? "disabled" : ""}>${read ? "✓ Read" : "Mark as read"}</button><button class="btn ghost" onclick="window.print()">Print / save as PDF</button></div>
      </div>`);
    document.getElementById("read").addEventListener("click", () => { S.readPaper(id); toast("+15 XP"); viewPaper(id); });
  }

  // ---------- Glossary & search ----------
  function glossary() {
    const map = new Map();
    CP.lessons.forEach((l) => (l.keyTerms || []).forEach(([t, d]) => {
      const k = t.toLowerCase();
      if (!map.has(k)) map.set(k, { term: t, def: d, lesson: l });
    }));
    return [...map.values()].sort((a, b) => a.term.localeCompare(b.term));
  }
  function viewGlossary(params) {
    const all = glossary();
    const qv = params.get("q") || "";
    render(`
      <h1>Glossary</h1>
      <p class="muted">${all.length} terms collected from every lesson.</p>
      <input class="input search" id="gq" placeholder="Search terms…" value="${esc(qv)}" autocomplete="off">
      <div id="gl" class="mt"></div>`);
    const draw = () => {
      const q = document.getElementById("gq").value.trim().toLowerCase();
      const items = all.filter((x) => !q || x.term.toLowerCase().includes(q) || x.def.toLowerCase().includes(q));
      document.getElementById("gl").innerHTML = items.length ? `<dl class="keyterms">${items.slice(0, 400).map((x) => `<dt>${esc(x.term)}</dt><dd>${esc(x.def)} <a class="small" href="#/lesson/${x.lesson.id}">— ${esc(x.lesson.title)}</a></dd>`).join("")}</dl>` : `<div class="empty">No matching terms.</div>`;
    };
    document.getElementById("gq").addEventListener("input", draw);
    draw();
  }

  // ---------- Progress ----------
  function viewProgress() {
    const o = overall();
    const days = [];
    for (let i = 83; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); const k = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); days.push([k, S.state.activity[k] || 0]); }
    const maxXP = Math.max(1, ...days.map((d) => d[1]));
    render(`
      <h1>Progress</h1>
      <div class="grid-4">
        <div class="card"><div class="stat">${o.lessonsDone}/${o.lessonsTotal}</div><div class="stat-label">Lessons</div></div>
        <div class="card"><div class="stat">${o.labsDone}/${o.labsTotal}</div><div class="stat-label">Labs</div></div>
        <div class="card"><div class="stat">${o.cardsSeen}/${o.cardsTotal}</div><div class="stat-label">Cards studied</div></div>
        <div class="card"><div class="stat">${S.state.xp}</div><div class="stat-label">XP</div></div>
      </div>
      <div class="card mt">
        <h3>Last 12 weeks</h3>
        <div style="display:grid;grid-template-columns:repeat(12,1fr);grid-auto-flow:column;grid-template-rows:repeat(7,14px);gap:3px;max-width:320px">
          ${days.map(([k, v]) => `<div title="${k}: ${v} XP" style="border-radius:3px;background:${v ? `color-mix(in srgb, var(--accent) ${Math.round(25 + (v / maxXP) * 75)}%, transparent)` : "var(--surface-2)"}"></div>`).join("")}
        </div>
      </div>
      <h2>Module quizzes</h2>
      <div class="table-wrap"><table><tr><th>Module</th><th>Lessons</th><th>Best quiz</th><th style="width:25%">Progress</th></tr>
        ${modules.map((m) => { const mp = moduleProgress(m); const q = S.state.quizzes[m.id]; return `<tr><td><a href="#/module/${m.id}">${esc(m.title)}</a></td><td>${mp.done}/${mp.total}</td><td>${q ? `<span class="tag ${q.best >= QUIZ_PASS ? "good" : "warn"}">${q.best}%</span>` : '<span class="muted">—</span>'}</td><td>${bar(mp.pct)}</td></tr>`; }).join("")}
      </table></div>
      <h2>Backup</h2>
      <p class="muted small">Progress lives in this browser only. Export it to move to another device.</p>
      <div class="row"><button class="btn" id="exp">Export progress (.json)</button><label class="btn">Import… <input type="file" id="imp" accept="application/json" hidden></label><span class="spacer"></span><button class="btn bad" id="rst">Reset all progress</button></div>`);
    document.getElementById("exp").addEventListener("click", () => {
      const blob = new Blob([S.export()], { type: "application/json" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "cyberpath-progress-" + S.today() + ".json"; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });
    document.getElementById("imp").addEventListener("change", (e) => {
      const f = e.target.files[0]; if (!f) return;
      f.text().then((t) => { try { S.import(t); toast("Progress imported"); viewProgress(); } catch (err) { alert("That file isn't a valid CyberPath export."); } });
    });
    document.getElementById("rst").addEventListener("click", () => { if (confirm("Erase all progress, XP, flashcard schedules and exam history?")) { S.reset(); toast("Progress reset"); viewProgress(); } });
  }

  function notFound() { render(`<div class="empty"><h2>Not found</h2><p><a href="#/">Back to the dashboard</a></p></div>`); }

  // ---------- Router ----------
  let lastRoute = "";
  function route(force) {
    const hash = location.hash.replace(/^#/, "") || "/";
    if (hash === lastRoute && !force) return;
    lastRoute = hash;
    const [path, qs] = hash.split("?");
    const params = new URLSearchParams(qs || "");
    const parts = path.split("/").filter(Boolean);
    drawNav(path);
    document.getElementById("sidebar").classList.remove("open");
    const scrim = document.querySelector(".scrim"); if (scrim) scrim.remove();
    const [a, b] = parts;
    switch (a) {
      case undefined: viewDashboard(); break;
      case "roadmap": viewRoadmap(); break;
      case "phase": viewPhase(b); break;
      case "module": viewModule(b); break;
      case "lesson": viewLesson(b); break;
      case "quiz": viewQuiz(b); break;
      case "exams": viewExams(); break;
      case "exam": viewExam(b); break;
      case "flashcards": viewFlashcards(params); break;
      case "labs": viewLabs(params); break;
      case "lab": viewLab(b); break;
      case "library": viewLibrary(); break;
      case "paper": viewPaper(b); break;
      case "glossary": viewGlossary(params); break;
      case "progress": viewProgress(); break;
      default: notFound();
    }
    view.focus({ preventScroll: true });
  }
  window.addEventListener("hashchange", () => route());

  document.getElementById("theme-toggle").addEventListener("click", () => {
    const root = document.documentElement;
    const isDark = root.getAttribute("data-theme") === "dark" || (!root.getAttribute("data-theme") && matchMedia("(prefers-color-scheme: dark)").matches);
    const t = isDark ? "light" : "dark";
    root.setAttribute("data-theme", t);
    try { localStorage.setItem("cp-theme", t); } catch (e) { /* ignore */ }
  });
  document.getElementById("menu-btn").addEventListener("click", () => {
    const sb = document.getElementById("sidebar");
    sb.classList.add("open");
    const scrim = document.createElement("div"); scrim.className = "scrim";
    scrim.addEventListener("click", () => { sb.classList.remove("open"); scrim.remove(); });
    document.body.appendChild(scrim);
  });

  route();
})();
