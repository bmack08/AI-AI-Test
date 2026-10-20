// Persistent learner state. Saved to localStorage when available, in-memory otherwise.
(function () {
  const KEY = "cyberpath-progress-v1";
  const DAY = 86400000;

  function blank() {
    return { lessons: {}, papers: {}, labs: {}, quizzes: {}, exams: [], cards: {}, milestones: {}, activity: {}, xp: 0, labData: {} };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return Object.assign(blank(), JSON.parse(raw));
    } catch (e) { /* storage unavailable or corrupt */ }
    return blank();
  }

  let state = load();

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  function today() {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function addXP(n) {
    state.xp += n;
    const t = today();
    state.activity[t] = (state.activity[t] || 0) + n;
    save();
  }

  function streak() {
    let n = 0;
    const d = new Date();
    // Today counts if active; otherwise the streak may still be alive from yesterday.
    const key = (x) => x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0");
    if (!state.activity[key(d)]) d.setDate(d.getDate() - 1);
    while (state.activity[key(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  // Simplified SM-2. rating: 0 again, 1 hard, 2 good, 3 easy.
  function rateCard(id, rating) {
    const c = state.cards[id] || { ease: 2.5, interval: 0, reps: 0, due: 0, lapses: 0 };
    if (rating === 0) {
      c.reps = 0; c.interval = 0; c.lapses++; c.ease = Math.max(1.3, c.ease - 0.2);
      c.due = Date.now() + 60 * 1000;
    } else {
      if (c.reps === 0) c.interval = rating === 3 ? 4 : 1;
      else if (c.reps === 1) c.interval = rating === 1 ? 2 : rating === 3 ? 8 : 6;
      else c.interval = Math.round(c.interval * (rating === 1 ? 1.2 : rating === 3 ? c.ease * 1.3 : c.ease));
      c.ease = Math.max(1.3, c.ease + (rating === 1 ? -0.15 : rating === 3 ? 0.15 : 0));
      c.reps++;
      c.due = Date.now() + c.interval * DAY;
    }
    state.cards[id] = c;
    addXP(1);
    save();
    return c;
  }

  window.CPStore = {
    get state() { return state; },
    save,
    addXP,
    streak,
    today,
    completeLesson(id) { if (!state.lessons[id]) { state.lessons[id] = Date.now(); addXP(10); } save(); },
    uncompleteLesson(id) { delete state.lessons[id]; save(); },
    readPaper(id) { if (!state.papers[id]) { state.papers[id] = Date.now(); addXP(15); } save(); },
    recordLab(id, score) {
      const prev = state.labs[id];
      if (!prev) addXP(25);
      state.labs[id] = { best: Math.max(score, prev ? prev.best : 0), last: score, ts: Date.now() };
      save();
    },
    recordQuiz(module, pct) {
      const prev = state.quizzes[module] || { best: 0, attempts: 0 };
      state.quizzes[module] = { best: Math.max(prev.best, pct), attempts: prev.attempts + 1, ts: Date.now() };
      addXP(Math.round(pct / 10));
      save();
    },
    recordExam(result) { state.exams.unshift(result); state.exams = state.exams.slice(0, 50); addXP(30); save(); },
    rateCard,
    cardDue(id) { const c = state.cards[id]; return !c || c.due <= Date.now(); },
    cardSeen(id) { return !!state.cards[id]; },
    toggleMilestone(id) { state.milestones[id] = !state.milestones[id]; save(); },
    labStore(labId, key, value) {
      const bucket = state.labData[labId] || (state.labData[labId] = {});
      if (value === undefined) return bucket[key];
      bucket[key] = value; save(); return value;
    },
    export() { return JSON.stringify(state, null, 2); },
    import(json) { state = Object.assign(blank(), JSON.parse(json)); save(); },
    reset() { state = blank(); save(); }
  };
})();
