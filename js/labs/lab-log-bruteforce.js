window.CP = window.CP || {};
CP.labs = CP.labs || [];
CP.labs.push({
  id: "lab-log-bruteforce",
  title: "Brute-Force Detection in Windows Logon Events",
  module: "p2-m2",
  difficulty: "Beginner",
  minutes: 25,
  skills: ["Windows Security log", "Event IDs 4624/4625/4672", "logon types", "filtering & sorting", "incident response"],
  briefing: `
    <p><b>Scenario:</b> You are a Tier 1 analyst. At 04:05 a SIEM rule fired: <i>"Excessive failed logons followed by success - SRV-JUMP01"</i>.
    <code>SRV-JUMP01</code> is a Windows Server jump host that was (accidentally) left reachable over RDP from the internet during a firewall change.
    You have an export of its Security log covering 00:00-06:00 (about 200 events).</p>
    <p><b>Objectives:</b></p>
    <ul>
      <li>Separate normal internal logons from hostile activity using the filter box and sortable columns.</li>
      <li>Identify the attacker IP, the targeted account, the number of failures and the moment the attacker got in.</li>
      <li>Interpret the logon type and choose the right response.</li>
    </ul>
    <div class="callout tip"><b>Key events:</b> <code>4625</code> = failed logon (Status <code>0xC000006A</code> = bad password,
    <code>0xC0000064</code> = user does not exist), <code>4624</code> = successful logon, <code>4672</code> = special (admin) privileges assigned
    to a new logon, <code>4634</code> = logoff. <b>Logon types:</b> 2 interactive, 3 network, 5 service, 7 unlock, 10 RemoteInteractive (RDP).</div>
    <div class="callout exam">A brute force is <i>many passwords against one account</i>; password spraying is <i>one password against many accounts</i>.
    The tell-tale pattern for a successful attack is a burst of 4625s from one source followed by a 4624 from the same source.</div>
  `,
  render(container, ctx) {
    const esc = ctx.escape;
    container.classList.add("lab-lab-log-bruteforce");

    // ---------- data ----------
    let seed = 4625;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
    const pick = (a) => a[Math.floor(rnd() * a.length)];
    const pad = (n) => String(n).padStart(2, "0");
    const fmt = (s) => `2025-10-14 ${pad(Math.floor(s / 3600))}:${pad(Math.floor(s % 3600 / 60))}:${pad(s % 60)}`;

    const ATK_IP = "203.0.113.88", ATK_USER = "backup_admin", ATK_WS = "WIN-8K2QX0P1R3";
    const FAILS = 64;
    const events = [];
    const add = (t, o) => events.push(Object.assign({ t, time: fmt(t), account: "-", ip: "-", lt: "-", status: "-", ws: "-" }, o));

    // normal internal activity spread over the night (batch jobs, admins, service accounts)
    const users = [["svc_sql", "10.20.4.15", "SQL-02", 3], ["svc_monitor", "10.20.4.30", "MON-01", 3], ["a.nguyen", "10.20.8.41", "IT-LT-041", 10],
      ["r.patel", "10.20.8.57", "IT-LT-057", 10], ["SRV-JUMP01$", "-", "-", 5], ["svc_backup", "10.20.4.22", "BKP-01", 3]];
    let t = 0;
    while (t < 6 * 3600 - 300) {
      t += ri(120, 520);
      const u = pick(users);
      add(t, { id: 4624, account: u[0], ip: u[1], ws: u[2], lt: u[3] });
      if (u[3] === 10) { add(t + 1, { id: 4672, account: u[0] }); add(t + ri(300, 1500), { id: 4634, account: u[0], lt: u[3] }); }
      else if (rnd() < 0.5) add(t + ri(1, 30), { id: 4634, account: u[0], lt: u[3] });
    }
    // a couple of genuine typos by admins
    add(1 * 3600 + 610, { id: 4625, account: "a.nguyen", ip: "10.20.8.41", ws: "IT-LT-041", lt: 10, status: "0xC000006A" });
    add(4 * 3600 + 1430, { id: 4625, account: "r.patel", ip: "10.20.8.57", ws: "IT-LT-057", lt: 10, status: "0xC000006A" });
    // internet background noise (a scanner trying default names)
    ["administrator", "admin", "test", "user1", "administrator"].forEach((u, i) => {
      add(2 * 3600 + 900 + i * 47, { id: 4625, account: u, ip: "192.0.2.150", ws: "-", lt: 3, status: u === "administrator" ? "0xC000006A" : "0xC0000064" });
    });
    // the brute force: 03:40:00 onwards
    let at = 3 * 3600 + 40 * 60 + 2;
    for (let i = 0; i < FAILS; i++) {
      at += ri(4, 9);
      const acct = i < 4 ? ["administrator", "admin", "backup", "administrator"][i] : ATK_USER;
      add(at, { id: 4625, account: acct, ip: ATK_IP, ws: ATK_WS, lt: 3, status: acct === "admin" || acct === "backup" ? "0xC0000064" : "0xC000006A" });
    }
    // success
    const SUCCESS_T = 3 * 3600 + 47 * 60 + 21;
    // ensure success is after last failure
    const lastFail = at;
    const succT = Math.max(SUCCESS_T, lastFail + 3);
    add(succT, { id: 4624, account: ATK_USER, ip: ATK_IP, ws: ATK_WS, lt: 10 });
    add(succT + 1, { id: 4672, account: ATK_USER });
    add(succT + 2, { id: 4624, account: ATK_USER, ip: ATK_IP, ws: ATK_WS, lt: 10, note: "second RDP channel" });
    events.sort((a, b) => a.t - b.t);
    // trim / pad to ~200
    events.forEach((e, i) => { e.n = i + 1; });
    const SUCCESS_TIME = fmt(succT).slice(11);

    const DESC = {
      4624: "An account was successfully logged on.",
      4625: "An account failed to log on.",
      4634: "An account was logged off.",
      4672: "Special privileges assigned to new logon."
    };
    const LT = { 2: "Interactive", 3: "Network", 5: "Service", 7: "Unlock", 10: "RemoteInteractive" };
    const ST = { "0xC000006A": "Bad password", "0xC0000064": "No such user" };

    // ---------- questions ----------
    const Q = [
      { type: "text", q: "What is the attacker's source IP address?", a: [ATK_IP],
        why: `${ATK_IP} generated ${FAILS} failed logons in a few minutes and then a successful one. 192.0.2.150 is generic internet scanning (a handful of attempts, no success).` },
      { type: "text", q: "Which account was targeted (and ultimately compromised)?", a: [ATK_USER, "corp\\" + ATK_USER],
        why: `Almost every failure from ${ATK_IP} targets ${ATK_USER} - one account, many passwords = brute force. It is a privileged account (4672 follows its logon).` },
      { type: "text", q: `How many failed logons (4625) came from the attacker's IP?`, a: [String(FAILS)],
        why: `Filter on "4625 ${ATK_IP}": ${FAILS} rows. Counting precisely matters for the incident timeline and for tuning the detection threshold.` },
      { type: "text", q: "At what time (HH:MM:SS) did the attacker first log on successfully?", a: [SUCCESS_TIME, "2025-10-14 " + SUCCESS_TIME],
        why: `The first 4624 from ${ATK_IP} is at ${SUCCESS_TIME}. Everything after this moment is attacker-controlled activity that must be scoped.` },
      { type: "mc", q: "What logon type was the attacker's successful logon, and what does it mean?",
        options: ["Type 2 - Interactive (at the physical console)", "Type 3 - Network (e.g. SMB file share)", "Type 10 - RemoteInteractive (RDP session)", "Type 7 - Unlock of a locked workstation"],
        a: 2, why: "Logon type 10 is RemoteInteractive, i.e. a full RDP desktop session. (With Network Level Authentication, the failed attempts appear as type 3 because credentials are checked before the session is created.)" },
      { type: "mc", q: "What is the BEST immediate response?",
        options: ["Close the alert: the final logon succeeded, so the password must have been known", "Block the IP at the firewall only - the failures stopped, so the threat is over",
          `Disable/reset ${ATK_USER}, kill its RDP sessions, block ${ATK_IP} and remove internet RDP exposure, then escalate to IR to scope post-logon activity`, "Reboot SRV-JUMP01 to disconnect the attacker"],
        a: 2, why: "The attacker has valid privileged credentials and an interactive session: contain the account and access path, preserve evidence and escalate. Blocking only the IP leaves the stolen password usable from elsewhere; rebooting destroys volatile evidence and does not revoke credentials." }
    ];

    // ---------- UI ----------
    const style = document.createElement("style");
    style.textContent = `
      .lab-lab-log-bruteforce .bf-tablewrap { max-height: 420px; overflow:auto; border:1px solid var(--border); border-radius:8px; }
      .lab-lab-log-bruteforce table { width:100%; font-size:.85em; }
      .lab-lab-log-bruteforce th { position: sticky; top:0; background: var(--surface); cursor:pointer; user-select:none; white-space:nowrap; }
      .lab-lab-log-bruteforce td { white-space:nowrap; }
      .lab-lab-log-bruteforce tr.bf-fail td:nth-child(2) { color: var(--bad); font-weight:600; }
      .lab-lab-log-bruteforce tr.bf-ok td:nth-child(2) { color: var(--good); font-weight:600; }
      .lab-lab-log-bruteforce tbody tr { cursor:pointer; }
      .lab-lab-log-bruteforce tbody tr.bf-sel { outline: 2px solid var(--accent); }
      .lab-lab-log-bruteforce .bf-detail { white-space: pre-wrap; font-size:.85em; background: var(--code-bg); padding:10px; border-radius:6px; margin:0; }
      .lab-lab-log-bruteforce .bf-q { padding:10px 12px; }
      .lab-lab-log-bruteforce .bf-q label { display:block; margin:3px 0; cursor:pointer; }
      .lab-lab-log-bruteforce .bf-fb { margin-top:6px; font-size:.9em; }
    `;
    container.appendChild(style);

    container.insertAdjacentHTML("beforeend", `
      <div class="stack">
        <div class="card stack">
          <div class="row" style="flex-wrap:wrap">
            <input class="input" data-el="filter" placeholder="Filter (all words must match), e.g. 4625 203.0.113.88" style="flex:1;min-width:220px" aria-label="Filter events">
            <select class="select" data-el="eid" aria-label="Event ID filter">
              <option value="">All Event IDs</option><option>4624</option><option>4625</option><option>4634</option><option>4672</option>
            </select>
            <button class="btn ghost" data-el="clear" type="button">Reset</button>
            <span class="muted" data-el="count"></span>
          </div>
          <div class="muted" style="font-size:.85em">Click a column header to sort (click again to reverse). Click a row to see the full event.</div>
          <div class="bf-tablewrap"><table class="table"><thead><tr data-el="head"></tr></thead><tbody data-el="body"></tbody></table></div>
          <pre class="bf-detail mono" data-el="detail">Select an event to view its details.</pre>
        </div>
        <div class="card stack">
          <h3 style="margin:0">Questions</h3>
          <div class="stack" data-el="qs"></div>
          <div class="row"><button class="btn primary" data-el="check" type="button">Check answers</button></div>
          <div data-el="result"></div>
        </div>
      </div>`);
    const $ = (s) => container.querySelector(`[data-el="${s}"]`);

    const COLS = [["n", "#"], ["time", "Time"], ["id", "Event ID"], ["account", "Account"], ["ip", "Source IP"], ["lt", "Logon Type"], ["status", "Status"], ["ws", "Workstation"]];
    let sortKey = "n", sortDir = 1, selected = null;
    $("head").innerHTML = COLS.map((c) => `<th data-k="${c[0]}" scope="col">${esc(c[1])} <span data-arrow="${c[0]}"></span></th>`).join("");
    $("head").addEventListener("click", (e) => {
      const th = e.target.closest("th"); if (!th) return;
      const k = th.dataset.k;
      if (sortKey === k) sortDir = -sortDir; else { sortKey = k; sortDir = 1; }
      draw();
    });

    function rowText(e) { return [e.time, e.id, DESC[e.id], e.account, e.ip, e.lt, LT[e.lt] || "", e.status, ST[e.status] || "", e.ws].join(" ").toLowerCase(); }
    function draw() {
      const terms = $("filter").value.toLowerCase().split(/\s+/).filter(Boolean);
      const eid = $("eid").value;
      let rows = events.filter((e) => (!eid || String(e.id) === eid) && terms.every((t) => rowText(e).includes(t)));
      rows = rows.slice().sort((a, b) => {
        const x = a[sortKey], y = b[sortKey];
        const nx = typeof x === "number" ? x : parseFloat(x), ny = typeof y === "number" ? y : parseFloat(y);
        const c = (!isNaN(nx) && !isNaN(ny) && sortKey !== "ip" && sortKey !== "time") ? nx - ny : String(x).localeCompare(String(y), undefined, { numeric: true });
        return (c || a.n - b.n) * sortDir;
      });
      $("count").textContent = `${rows.length} of ${events.length} events`;
      COLS.forEach((c) => { container.querySelector(`[data-arrow="${c[0]}"]`).textContent = c[0] === sortKey ? (sortDir > 0 ? "▲" : "▼") : ""; });
      $("body").innerHTML = rows.map((e) => `<tr data-n="${e.n}" class="${e.id === 4625 ? "bf-fail" : e.id === 4624 ? "bf-ok" : ""}${selected === e.n ? " bf-sel" : ""}">
        <td>${e.n}</td><td class="mono">${esc(e.time)}</td><td>${e.id}</td><td>${esc(e.account)}</td><td class="mono">${esc(e.ip)}</td>
        <td>${esc(String(e.lt))}${LT[e.lt] ? " <span class='muted'>(" + esc(LT[e.lt]) + ")</span>" : ""}</td><td class="mono">${esc(e.status)}</td><td>${esc(e.ws)}</td></tr>`).join("");
    }
    $("body").addEventListener("click", (e) => {
      const tr = e.target.closest("tr"); if (!tr) return;
      selected = +tr.dataset.n;
      const ev = events.find((x) => x.n === selected);
      container.querySelectorAll("tbody tr.bf-sel").forEach((r) => r.classList.remove("bf-sel"));
      tr.classList.add("bf-sel");
      const lines = [`Log Name:      Security`, `Source:        Microsoft-Windows-Security-Auditing`, `Date:          ${ev.time}`, `Event ID:      ${ev.id}`,
        `Computer:      SRV-JUMP01.corp.example.com`, ``, DESC[ev.id], ``];
      if (ev.id === 4672) lines.push(`Subject:\n  Account Name:   ${ev.account}\n  Account Domain: CORP\nPrivileges:     SeBackupPrivilege, SeRestorePrivilege, SeDebugPrivilege,\n                SeTakeOwnershipPrivilege, SeImpersonatePrivilege`);
      else {
        lines.push(`Logon Type:    ${ev.lt}${LT[ev.lt] ? " (" + LT[ev.lt] + ")" : ""}`);
        lines.push(`${ev.id === 4625 ? "Account For Which Logon Failed" : "New Logon"}:\n  Account Name:   ${ev.account}\n  Account Domain: CORP`);
        if (ev.id === 4625) lines.push(`Failure Information:\n  Failure Reason: ${ev.status === "0xC0000064" ? "Unknown user name" : "Unknown user name or bad password."}\n  Status:         0xC000006D\n  Sub Status:     ${ev.status} (${ST[ev.status] || ""})`);
        lines.push(`Network Information:\n  Workstation Name:          ${ev.ws}\n  Source Network Address:    ${ev.ip}\n  Source Port:               ${ev.ip === "-" ? "-" : 49152 + (ev.n * 37) % 15000}`);
        if (ev.id !== 4634) lines.push(`Detailed Authentication Information:\n  Logon Process:  ${ev.lt === 10 || ev.lt === 3 ? "NtLmSsp" : "Advapi"}\n  Authentication Package: ${ev.lt === 3 && ev.ip.startsWith("10.") ? "Kerberos" : "NTLM"}`);
      }
      $("detail").textContent = lines.join("\n");
    });
    $("filter").addEventListener("input", draw);
    $("eid").addEventListener("change", draw);
    $("clear").addEventListener("click", () => { $("filter").value = ""; $("eid").value = ""; sortKey = "n"; sortDir = 1; draw(); });
    draw();

    const qs = $("qs");
    Q.forEach((q, i) => {
      const d = document.createElement("div");
      d.className = "card bf-q";
      d.innerHTML = `<div><b>${i + 1}.</b> ${esc(q.q)}</div>` + (q.type === "text"
        ? `<input class="input mono" data-q="${i}" placeholder="answer" style="margin-top:6px;width:100%">`
        : q.options.map((o, j) => `<label><input type="radio" name="bf-q${i}" value="${j}"> ${esc(o)}</label>`).join("")) + `<div class="bf-fb" data-fb="${i}"></div>`;
      qs.appendChild(d);
    });
    const norm = (s) => String(s).trim().toLowerCase();
    let done = false;
    $("check").addEventListener("click", () => {
      let correct = 0, answered = 0;
      Q.forEach((q, i) => {
        let v;
        if (q.type === "text") v = qs.querySelector(`[data-q="${i}"]`).value.trim();
        else { const r = qs.querySelector(`input[name="bf-q${i}"]:checked`); v = r ? +r.value : ""; }
        const fb = qs.querySelector(`[data-fb="${i}"]`);
        if (v === "") { fb.innerHTML = `<span class="tag warn">not answered</span>`; return; }
        answered++;
        const ok = q.type === "text" ? q.a.map(norm).includes(norm(v)) : v === q.a;
        if (ok) correct++;
        fb.innerHTML = `<span class="tag ${ok ? "good" : "bad"}">${ok ? "Correct" : "Incorrect"}</span> ${ok ? esc(q.why) : "Try again - filter the table to test your theory."}`;
      });
      if (answered < Q.length) { $("result").innerHTML = `<div class="alert info">${correct}/${answered} correct so far. Answer all ${Q.length} questions to finish.</div>`; return; }
      const score = Math.round(correct / Q.length * 100);
      Q.forEach((q, i) => {
        const fb = qs.querySelector(`[data-fb="${i}"]`);
        if (!fb.innerHTML.includes("Correct")) fb.innerHTML = `<span class="tag bad">Incorrect</span> Answer: <b>${esc(q.type === "text" ? q.a[0] : q.options[q.a])}</b> - ${esc(q.why)}`;
      });
      $("result").innerHTML = `<div class="alert ${score >= 70 ? "good" : "bad"}"><b>Score: ${score}%</b> (${correct}/${Q.length}).
        Timeline: 03:40 brute force begins from ${esc(ATK_IP)} &rarr; ${FAILS} bad-password failures against ${esc(ATK_USER)} &rarr; ${esc(SUCCESS_TIME)} RDP logon (type 10) with admin privileges (4672).
        Detection idea: alert when one source has &ge;10 4625 events in 5 minutes <i>and</i> a 4624 from the same source follows within 30 minutes.</div>`;
      if (!done) { done = true; ctx.complete(score); }
    });

    container._cpData = { events, FAILS, SUCCESS_TIME };
  }
});
