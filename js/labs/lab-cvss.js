window.CP = window.CP || {};
CP.labs = CP.labs || [];
CP.labs.push({
  id: "lab-cvss",
  title: "CVSS v4.0 Scoring & Vulnerability Prioritization",
  module: "p1-m6",
  difficulty: "Intermediate",
  minutes: 30,
  skills: ["CVSS v4.0 base metrics", "vector strings", "CISA KEV", "EPSS", "risk-based prioritization"],
  briefing: `<p><b>Scenario:</b> Your vulnerability scanner just produced 4,000 findings. The patch team can handle maybe 40 this week.
  You need to (1) speak CVSS fluently so you can sanity-check vendor scores, and (2) prioritize with more than CVSS alone,
  using the <b>CISA Known Exploited Vulnerabilities (KEV)</b> catalog and <b>EPSS</b> (Exploit Prediction Scoring System) probabilities.</p>
  <p><b>Objectives:</b></p>
  <ul>
    <li>Use the CVSS v4.0 base metric groups: Exploitability (AV, AC, AT, PR, UI), Vulnerable System impact (VC, VI, VA) and Subsequent System impact (SC, SI, SA).</li>
    <li>Build vector strings such as <code>CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N</code>.</li>
    <li>Score three vulnerability scenarios and compare with the expected vector.</li>
    <li>Prioritize a patch queue using KEV status, EPSS and asset exposure.</li>
  </ul>
  <div class="callout warn"><b>Honesty note:</b> official CVSS v4.0 scores come from a lookup table of "macrovectors" plus interpolation,
  published by FIRST. The numeric score in this lab is an <b>approximation</b> built from the same equivalence classes. Always use the
  official FIRST calculator (<a href="https://www.first.org/cvss/calculator/4.0" target="_blank" rel="noopener">first.org/cvss/calculator/4.0</a>) for real scores.</div>`,
  render(container, ctx) {
    container.classList.add("lab-lab-cvss");
    const style = document.createElement("style");
    style.textContent = `
      .lab-lab-cvss .cv-metric { display: flex; flex-wrap: wrap; align-items: center; gap: .35rem; padding: .3rem 0; border-bottom: 1px solid var(--border); }
      .lab-lab-cvss .cv-metric > b { flex: 0 0 230px; font-weight: 600; }
      .lab-lab-cvss .cv-metric .btn { padding: .25rem .6rem; }
      .lab-lab-cvss .cv-metric .btn.on { background: var(--accent); color: #fff; }
      .lab-lab-cvss .cv-metric .btn.exp { outline: 2px solid var(--good); }
      .lab-lab-cvss .cv-metric .btn.wrongsel { background: var(--bad); color: #fff; }
      .lab-lab-cvss .cv-vec { font-family: monospace; word-break: break-all; background: var(--code-bg); border: 1px solid var(--border); padding: .5rem; border-radius: 6px; }
      .lab-lab-cvss .cv-score { font-size: 2rem; font-weight: bold; }
      .lab-lab-cvss .cv-tabs { display: flex; gap: .4rem; flex-wrap: wrap; }
      .lab-lab-cvss .cv-tabs .btn.active { background: var(--accent); color: #fff; }
      @media (max-width: 600px) { .lab-lab-cvss .cv-metric > b { flex-basis: 100%; } }
    `;
    container.appendChild(style);
    const esc = ctx.escape;

    const METRICS = [
      { k: "AV", n: "Attack Vector", g: "Exploitability", v: [["N", "Network"], ["A", "Adjacent"], ["L", "Local"], ["P", "Physical"]] },
      { k: "AC", n: "Attack Complexity", g: "Exploitability", v: [["L", "Low"], ["H", "High"]] },
      { k: "AT", n: "Attack Requirements", g: "Exploitability", v: [["N", "None"], ["P", "Present"]] },
      { k: "PR", n: "Privileges Required", g: "Exploitability", v: [["N", "None"], ["L", "Low"], ["H", "High"]] },
      { k: "UI", n: "User Interaction", g: "Exploitability", v: [["N", "None"], ["P", "Passive"], ["A", "Active"]] },
      { k: "VC", n: "Vulnerable System Confidentiality", g: "Vulnerable System", v: [["H", "High"], ["L", "Low"], ["N", "None"]] },
      { k: "VI", n: "Vulnerable System Integrity", g: "Vulnerable System", v: [["H", "High"], ["L", "Low"], ["N", "None"]] },
      { k: "VA", n: "Vulnerable System Availability", g: "Vulnerable System", v: [["H", "High"], ["L", "Low"], ["N", "None"]] },
      { k: "SC", n: "Subsequent System Confidentiality", g: "Subsequent System", v: [["H", "High"], ["L", "Low"], ["N", "None"]] },
      { k: "SI", n: "Subsequent System Integrity", g: "Subsequent System", v: [["H", "High"], ["L", "Low"], ["N", "None"]] },
      { k: "SA", n: "Subsequent System Availability", g: "Subsequent System", v: [["H", "High"], ["L", "Low"], ["N", "None"]] }
    ];
    const HELP = {
      AV: "How remote the attacker can be. N = across the internet/routed network; A = same local segment/Bluetooth; L = local access or tricking a user to open a file; P = must physically touch the device.",
      AC: "Measurable actions the attacker must take to defeat built-in defences (e.g. ASLR bypass, obtaining a secret). L = none needed.",
      AT: "Deployment/execution conditions outside the attacker's control (e.g. a race condition, a specific non-default configuration, man-in-the-middle position). New in v4.0.",
      PR: "Privileges the attacker needs BEFORE exploiting.",
      UI: "N = no human involvement; P = passive/limited interaction (e.g. a user simply views a page); A = active, conscious actions (e.g. clicking through warnings, importing a file).",
      VC: "Confidentiality impact on the vulnerable system itself.", VI: "Integrity impact on the vulnerable system.", VA: "Availability impact on the vulnerable system.",
      SC: "Impact on systems beyond the vulnerable one (e.g. the victim's browser for XSS, downstream hosts).", SI: "Integrity impact on subsequent systems.", SA: "Availability impact on subsequent systems."
    };
    const ORDER = { AV: ["N", "A", "L", "P"], AC: ["L", "H"], AT: ["N", "P"], PR: ["N", "L", "H"], UI: ["N", "P", "A"], VC: ["H", "L", "N"], VI: ["H", "L", "N"], VA: ["H", "L", "N"], SC: ["H", "L", "N"], SI: ["H", "L", "N"], SA: ["H", "L", "N"] };
    const vecStr = (m) => "CVSS:4.0/" + METRICS.map((x) => x.k + ":" + m[x.k]).join("/");

    // Approximation using the official equivalence classes (EQ1-EQ4) with additive penalties.
    function approx(m) {
      if (["VC", "VI", "VA", "SC", "SI", "SA"].every((k) => m[k] === "N")) return { score: 0, eq: "n/a" };
      let eq1;
      if (m.AV === "N" && m.PR === "N" && m.UI === "N") eq1 = 0;
      else if ((m.AV === "N" || m.PR === "N" || m.UI === "N") && m.AV !== "P") eq1 = 1;
      else eq1 = 2;
      const eq2 = (m.AC === "L" && m.AT === "N") ? 0 : 1;
      let eq3;
      if (m.VC === "H" && m.VI === "H") eq3 = 0;
      else if (m.VC === "H" || m.VI === "H" || m.VA === "H") eq3 = 1;
      else eq3 = 2;
      const eq4 = (m.SC === "H" || m.SI === "H" || m.SA === "H") ? 1 : 2; // level 0 needs MSI/MSA:S (environmental)
      let s = 10 - [0, 0.8, 2.2][eq1] - [0, 0.7][eq2] - [0, 0.6, 2.9][eq3] - [0, 0, 0.55][eq4];
      // small intra-class adjustment: distance below the most severe value allowed in each equivalence level
      const idx = (k) => ORDER[k].indexOf(m[k]);
      let steps = 0;
      if (eq1 === 1) steps += idx("AV") + idx("PR") + idx("UI");
      if (eq3 === 0) steps += idx("VA");
      if (eq3 === 1) steps += idx("VC") + idx("VI") + idx("VA") - 2;
      if (eq3 === 2) ["VC", "VI", "VA"].forEach((k) => steps += Math.max(0, idx(k) - 1));
      if (eq4 === 1) steps += idx("SC") + idx("SI") + idx("SA") - 2;
      if (eq4 === 2) ["SC", "SI", "SA"].forEach((k) => steps += Math.max(0, idx(k) - 1));
      s -= Math.max(0, steps) * 0.05;
      if (eq4 === 2 && ["SC", "SI", "SA"].every((k) => m[k] === "N")) s += 0.15; // all-None subsequent is the common case; keep 9.3 anchor
      if (eq2 === 1 && m.AC === "H" && m.AT === "P") s -= 0.3;
      s = Math.max(0.1, Math.min(10, Math.round(s * 10) / 10));
      return { score: s, eq: `${eq1}${eq2}${eq3}${eq4}00` };
    }
    const rating = (s) => s === 0 ? "None" : s < 4 ? "Low" : s < 7 ? "Medium" : s < 9 ? "High" : "Critical";
    const ratingTag = (s) => { const r = rating(s); return `<span class="tag ${r === "Critical" || r === "High" ? "bad" : r === "Medium" ? "warn" : "good"}">${r}</span>`; };

    function metricPanel(state, onChange, opts) {
      opts = opts || {};
      const wrap = document.createElement("div");
      wrap.className = "stack";
      let lastG = "";
      wrap.innerHTML = METRICS.map((x) => {
        const head = x.g !== lastG ? `<h4 style="margin:.6rem 0 0">${x.g} metrics</h4>` : "";
        lastG = x.g;
        return head + `<div class="cv-metric" data-k="${x.k}"><b title="${esc(HELP[x.k])}">${x.n} (${x.k})</b>${x.v.map(([c, l]) => `<button class="btn${state[x.k] === c ? " on" : ""}" data-v="${c}">${l} (${c})</button>`).join("")}</div>`;
      }).join("") + `<div class="muted" data-help>Hover a metric name for its definition.</div>`;
      wrap.querySelectorAll(".cv-metric").forEach((row) => {
        row.querySelectorAll(".btn").forEach((b) => b.onclick = () => {
          if (opts.locked && opts.locked()) return;
          state[row.dataset.k] = b.dataset.v;
          row.querySelectorAll(".btn").forEach((x) => x.classList.toggle("on", x === b));
          wrap.querySelector("[data-help]").textContent = row.dataset.k + ": " + HELP[row.dataset.k];
          onChange();
        });
      });
      return wrap;
    }

    const root = document.createElement("div");
    root.className = "stack";
    container.appendChild(root);
    const tabsDef = ["Calculator", "Scenarios (3)", "Prioritization"];
    const nav = document.createElement("div");
    nav.className = "cv-tabs";
    nav.innerHTML = tabsDef.map((t, i) => `<button class="btn" data-t="${i}">${t}</button>`).join("");
    root.appendChild(nav);
    const panes = tabsDef.map(() => { const d = document.createElement("div"); d.className = "card stack"; d.hidden = true; root.appendChild(d); return d; });
    const show = (i) => { panes.forEach((p, j) => p.hidden = i !== j); nav.querySelectorAll(".btn").forEach((b, j) => b.classList.toggle("active", i === j)); };
    nav.querySelectorAll(".btn").forEach((b) => b.onclick = () => show(+b.dataset.t));

    const results = { scen: [null, null, null], prio: null };
    function maybeComplete() {
      if (results.scen.every((x) => x !== null) && results.prio !== null) {
        const s = Math.round(0.6 * (results.scen.reduce((a, b) => a + b, 0) / 3) + 0.4 * results.prio);
        root.querySelector("#cv-final").innerHTML = `<div class="alert good">Lab complete: scenarios ${Math.round(results.scen.reduce((a, b) => a + b, 0) / 3)}%, prioritization ${results.prio}%. Overall ${s}%.</div>`;
        ctx.complete(s);
      }
    }
    const finalDiv = document.createElement("div");
    finalDiv.id = "cv-final";
    root.appendChild(finalDiv);

    // ---- Calculator
    const calc = { AV: "N", AC: "L", AT: "N", PR: "N", UI: "N", VC: "H", VI: "H", VA: "H", SC: "N", SI: "N", SA: "N" };
    panes[0].innerHTML = `<h3>CVSS v4.0 base metric calculator</h3>
      <div class="cv-vec" id="cv-vec"></div>
      <div class="row"><span class="cv-score" id="cv-score"></span><span id="cv-rating"></span><span class="muted" id="cv-eq"></span></div>
      <div class="alert info">Approximate score only. The official calculator maps the vector to a macrovector (EQ1&ndash;EQ6) and interpolates within a lookup table.
      Verify at <a href="https://www.first.org/cvss/calculator/4.0" target="_blank" rel="noopener">https://www.first.org/cvss/calculator/4.0</a>. This lab assumes Threat (E) and Environmental metrics are Not Defined.</div>
      <div class="row"><input class="input mono" id="cv-paste" placeholder="Paste a vector: CVSS:4.0/AV:N/AC:L/..." style="flex:1"><button class="btn" id="cv-parse">Load vector</button></div>
      <div id="cv-parse-fb"></div>`;
    let calcPanel;
    function updCalc() {
      const r = approx(calc);
      panes[0].querySelector("#cv-vec").textContent = vecStr(calc);
      panes[0].querySelector("#cv-score").textContent = "~" + r.score.toFixed(1);
      panes[0].querySelector("#cv-rating").innerHTML = ratingTag(r.score);
      panes[0].querySelector("#cv-eq").textContent = "approx. macrovector EQ1-EQ6: " + r.eq;
    }
    function mountCalc() {
      if (calcPanel) calcPanel.remove();
      calcPanel = metricPanel(calc, updCalc);
      panes[0].appendChild(calcPanel);
      updCalc();
    }
    panes[0].querySelector("#cv-parse").onclick = () => {
      const s = panes[0].querySelector("#cv-paste").value.trim();
      const fb = panes[0].querySelector("#cv-parse-fb");
      if (!/^CVSS:4\.0\//.test(s)) { fb.innerHTML = `<div class="alert bad">Vector must start with CVSS:4.0/</div>`; return; }
      const parts = s.slice(9).split("/"); const tmp = Object.assign({}, calc); let bad = [];
      parts.forEach((p) => { const [k, v] = p.split(":"); if (ORDER[k] && ORDER[k].includes(v)) tmp[k] = v; else if (k) bad.push(p); });
      Object.assign(calc, tmp); mountCalc();
      fb.innerHTML = bad.length ? `<div class="alert info">Ignored (not base metrics or invalid): ${esc(bad.join(", "))}</div>` : `<div class="alert good">Vector loaded.</div>`;
    };
    mountCalc();

    // ---- Scenarios
    const SCEN = [
      { t: "SQL injection in a public login page",
        d: "The <i>Example Shop</i> login form at shop.example.com concatenates the username into a SQL query. No account is needed. Any attacker on the internet can send a crafted request (no special conditions, no user involvement) and read or modify every table in the database, or drop tables to take the site down. The database runs on the same vulnerable system; no other systems are affected.",
        exp: { AV: "N", AC: "L", AT: "N", PR: "N", UI: "N", VC: "H", VI: "H", VA: "H", SC: "N", SI: "N", SA: "N" },
        why: "Remote, unauthenticated, no complexity and full CIA impact on the vulnerable system. The subsequent-system metrics stay None because the impact is confined to the app/DB." },
      { t: "Stored XSS in a help-desk ticket field",
        d: "A customer with a normal (low-privilege) portal account can submit a ticket containing a script. When a support agent simply opens the ticket in the agent console, the script runs in the agent's browser and can read the agent's session data and perform limited actions as them. The ticketing server itself is not compromised.",
        exp: { AV: "N", AC: "L", AT: "N", PR: "L", UI: "P", VC: "N", VI: "N", VA: "N", SC: "L", SI: "L", SA: "N" },
        why: "Low privileges needed to submit the ticket; viewing is passive user interaction. In v4.0 the impact of XSS lands on the subsequent system (the victim's browser/session), not the vulnerable web server." },
      { t: "Kernel driver race condition (local privilege escalation)",
        d: "A local user with a standard account on a workstation can exploit a race condition in a storage driver to gain SYSTEM privileges. Winning the race depends on timing conditions outside the attacker's control, so it may take many attempts, but no protections need bypassing beyond that. No user interaction is required. Only the local machine is affected.",
        exp: { AV: "L", AC: "L", AT: "P", PR: "L", UI: "N", VC: "H", VI: "H", VA: "H", SC: "N", SI: "N", SA: "N" },
        why: "Local vector, low privileges. The race condition is an Attack Requirement (AT:P) in v4.0, not Attack Complexity (which covers defeating defences like ASLR). Full impact on the vulnerable system." }
    ];
    panes[1].innerHTML = `<h3>Score the scenarios</h3><p>Select the metrics for each scenario, then check against the expected vector.</p>`;
    SCEN.forEach((sc, i) => {
      const box = document.createElement("div");
      box.className = "card stack";
      const st = { AV: "N", AC: "L", AT: "N", PR: "N", UI: "N", VC: "N", VI: "N", VA: "N", SC: "N", SI: "N", SA: "N" };
      let checked = false;
      box.innerHTML = `<h4>Scenario ${i + 1}: ${sc.t}</h4><p>${sc.d}</p><div class="cv-vec" data-vec></div>`;
      const upd = () => { box.querySelector("[data-vec]").textContent = vecStr(st) + "   (~" + approx(st).score.toFixed(1) + " " + rating(approx(st).score) + ")"; };
      const mp = metricPanel(st, upd, { locked: () => checked });
      box.appendChild(mp);
      const btnRow = document.createElement("div");
      btnRow.innerHTML = `<button class="btn primary">Check scenario ${i + 1}</button><div data-fb></div>`;
      box.appendChild(btnRow);
      btnRow.querySelector("button").onclick = () => {
        if (checked) return;
        checked = true;
        let ok = 0;
        mp.querySelectorAll(".cv-metric").forEach((row) => {
          const k = row.dataset.k;
          if (st[k] === sc.exp[k]) ok++;
          row.querySelectorAll(".btn").forEach((b) => { if (b.dataset.v === sc.exp[k]) b.classList.add("exp"); else if (b.classList.contains("on")) b.classList.add("wrongsel"); });
        });
        const pct = Math.round((ok / 11) * 100);
        results.scen[i] = pct;
        btnRow.querySelector("button").disabled = true;
        btnRow.querySelector("[data-fb]").innerHTML = `<div class="alert ${pct === 100 ? "good" : pct >= 70 ? "info" : "bad"}">${ok}/11 metrics match.
          Expected: <code>${vecStr(sc.exp)}</code> (approx. ${approx(sc.exp).score.toFixed(1)}, ${rating(approx(sc.exp).score)}). Green outline = expected value. ${sc.why}</div>`;
        maybeComplete();
      };
      upd();
      panes[1].appendChild(box);
    });

    // ---- Prioritization
    const VULNS = [
      { id: "EXV-2026-1101", sys: "Internet-facing VPN gateway", cvss: 9.3, epss: 0.94, kev: true, exp: "now",
        why: "Listed in CISA KEV (actively exploited), very high EPSS, internet-facing. This is the classic emergency patch. Under BOD 22-01 US federal agencies get a fixed deadline (often 2-3 weeks, sometimes days) for KEV entries; many organisations aim for 24-72 hours." },
      { id: "EXV-2026-0420", sys: "Internal HR web app (VPN only)", cvss: 9.8, epss: 0.02, kev: false, exp: "30",
        why: "Critical CVSS but low exploitation probability, not in KEV and not internet-exposed. Schedule within the normal critical SLA rather than treating as an emergency." },
      { id: "EXV-2025-7777", sys: "File-transfer server in DMZ", cvss: 7.5, epss: 0.71, kev: true, exp: "now",
        why: "Only 'High' by CVSS but known exploited and in the DMZ. KEV status and exposure trump the raw score; mass-exploitation of file-transfer products is a common ransomware path." },
      { id: "EXV-2026-3150", sys: "Developer laptop image (local only)", cvss: 5.5, epss: 0.004, kev: false, exp: "cycle",
        why: "Medium, local-only, negligible EPSS. Normal patch cycle." },
      { id: "EXV-2026-2002", sys: "Public marketing website CMS plugin", cvss: 6.1, epss: 0.38, kev: false, exp: "30",
        why: "Internet-facing and a meaningful EPSS (38% chance of exploitation in the next 30 days). Not yet in KEV, so prioritise ahead of the normal cycle but it is not an emergency. Watch for a KEV addition." }
    ];
    panes[2].innerHTML = `<h3>Prioritize the patch queue</h3>
      <p><b>CISA KEV</b> lists vulnerabilities with reliable evidence of active exploitation. <b>EPSS</b> (by FIRST) estimates the probability of exploitation activity in the next 30 days (0&ndash;1).
      CVSS measures <i>severity</i>, not <i>likelihood</i>. Combine them with asset exposure. Assign each finding a remediation window.</p>
      <div style="overflow-x:auto"><table class="table"><thead><tr><th>ID</th><th>Asset</th><th>CVSS</th><th>EPSS</th><th>KEV</th><th>Remediation window</th></tr></thead><tbody>
      ${VULNS.map((v, i) => `<tr><td class="mono">${v.id}</td><td>${v.sys}</td><td>${v.cvss} ${ratingTag(v.cvss)}</td><td>${(v.epss * 100).toFixed(1)}%</td><td>${v.kev ? `<span class="tag bad">YES</span>` : `<span class="tag">no</span>`}</td>
        <td><select class="select" data-i="${i}"><option value="">-- choose --</option><option value="now">Emergency (24-72h)</option><option value="30">Prioritised (within 30 days)</option><option value="cycle">Normal patch cycle</option></select></td></tr>`).join("")}
      </tbody></table></div>
      <div><button class="btn primary" id="cv-prio">Check prioritization</button></div><div id="cv-prio-fb"></div>`;
    panes[2].querySelector("#cv-prio").onclick = () => {
      const sels = panes[2].querySelectorAll("select[data-i]");
      if ([...sels].some((s) => !s.value)) { panes[2].querySelector("#cv-prio-fb").innerHTML = `<div class="alert info">Choose a window for every finding.</div>`; return; }
      let ok = 0;
      const fb = [...sels].map((s) => { const v = VULNS[+s.dataset.i]; const good = s.value === v.exp; if (good) ok++; return `<li><span class="tag ${good ? "good" : "bad"}">${good ? "OK" : "MISS"}</span> <b>${v.id}</b>: ${v.why}</li>`; });
      results.prio = Math.round((ok / VULNS.length) * 100);
      panes[2].querySelector("#cv-prio-fb").innerHTML = `<div class="alert ${ok === VULNS.length ? "good" : "info"}">${ok}/${VULNS.length} correct.</div><ul>${fb.join("")}</ul>
        <div class="alert info">Notice the highest CVSS (9.8) was <i>not</i> the top priority, while a 7.5 was. That is the core lesson of risk-based vulnerability management.</div>`;
      maybeComplete();
    };
    show(0);
  }
});
