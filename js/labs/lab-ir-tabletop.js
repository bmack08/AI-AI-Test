window.CP = window.CP || {};
CP.labs = CP.labs || [];
CP.labs.push({
  id: "lab-ir-tabletop",
  title: "Ransomware Tabletop Exercise",
  module: "p3-m1",
  difficulty: "Intermediate",
  minutes: 30,
  skills: ["NIST SP 800-61r3", "CSF 2.0 functions", "incident containment", "evidence preservation", "crisis communications"],
  briefing: `<p><b>Scenario:</b> You are the incident commander at <b>Example Health Group</b>, a regional clinic network. It is 06:40 on a Monday.
  The helpdesk is flooded: staff cannot open patient records, and several screens show a ransom note demanding payment in cryptocurrency.
  You will make a series of decisions. Each choice moves an <b>impact meter</b> and is scored against incident-response best practice.</p>
  <p><b>Objectives:</b></p>
  <ul>
    <li>Follow the incident-response lifecycle aligned with <b>NIST SP 800-61 Revision 3</b>, framed around the <b>CSF 2.0</b> functions
    (Govern, Identify, Protect, Detect, Respond, Recover).</li>
    <li>Practice the hard trade-offs: contain before you eradicate, preserve evidence, loop in legal and communications, and reason about the ransom decision.</li>
    <li>Read the debrief to see why each option helps or hurts.</li>
  </ul>
  <p>There are no trick questions, but several choices are defensible. The meter and debrief reward the response that best balances
  safety, evidence and recovery. Fictional scenario; not legal advice.</p>`,
  render(container, ctx) {
    container.classList.add("lab-lab-ir-tabletop");
    const style = document.createElement("style");
    style.textContent = `
      .lab-lab-ir-tabletop .ir-meter { height: 20px; border-radius: 10px; background: linear-gradient(90deg, var(--good), var(--warn), var(--bad)); position: relative; }
      .lab-lab-ir-tabletop .ir-meter > div { position: absolute; top: -4px; width: 4px; height: 28px; background: var(--text); border-radius: 2px; transition: left .4s; }
      .lab-lab-ir-tabletop .ir-phase { letter-spacing: .04em; text-transform: uppercase; font-size: .75rem; color: var(--accent); font-weight: 700; }
      .lab-lab-ir-tabletop .ir-opt { text-align: left; display: block; width: 100%; margin-bottom: .5rem; }
      .lab-lab-ir-tabletop .ir-log li { margin-bottom: .3rem; }
    `;
    container.appendChild(style);
    const esc = ctx.escape;

    // delta: positive = more damage (worse). pts: best-practice points (0..2)
    const NODES = [
      { phase: "Respond · Analysis", q: "First 10 minutes. The ransom note is on multiple endpoints and a shared drive is encrypting in real time. What is your very first move?",
        opts: [
          { t: "Declare an incident, activate the IR plan and convene the response team on the out-of-band bridge.", d: -10, p: 2, why: "Correct. Formally declaring triggers roles, authority and the communications plan. Using an out-of-band channel (phones, separate chat) assumes the primary network may be compromised or monitored." },
          { t: "Immediately start deleting the ransom notes and re-imaging the loudest machines to get staff working.", d: 25, p: 0, why: "This destroys evidence and tips off nothing useful while the spread continues. Never start eradication before scoping and containment." },
          { t: "Quietly investigate alone for an hour so you do not cause panic before you understand it.", d: 18, p: 0, why: "Delay lets encryption spread. Ransomware is a time-critical event; escalate immediately." }
        ] },
      { phase: "Respond · Containment", q: "Encryption is actively spreading across the file servers. How do you contain it?",
        opts: [
          { t: "Isolate affected segments: pull/disable network links and quarantine hosts via EDR, but leave them powered on.", d: -12, p: 2, why: "Best practice. Network isolation stops the spread; keeping systems powered on preserves volatile evidence (memory, encryption keys sometimes in RAM) for forensics." },
          { t: "Hard power-off every machine in the building as fast as possible.", d: 2, p: 1, why: "Stops spread but destroys volatile memory evidence and can corrupt partially-encrypted files. A blunt last resort, not the first choice when EDR isolation is available." },
          { t: "Do nothing to the network yet; you do not want to disrupt the clinics during morning appointments.", d: 30, p: 0, why: "Availability matters, but unchecked encryption will take the clinics down entirely. Contain now." }
        ] },
      { phase: "Govern · Notify", q: "Who do you bring in now?",
        opts: [
          { t: "Legal/privacy counsel, executive leadership, and your cyber-insurance carrier (and prepare to engage the DFIR retainer).", d: -8, p: 2, why: "Correct. Counsel guides privileged investigation and breach obligations; insurers often require early notification and provide approved IR firms. This is a health provider, so regulatory clocks may be running." },
          { t: "Only the IT team; keep it technical until you have fully fixed it.", d: 15, p: 0, why: "Siloing IR from legal, leadership and insurance creates legal and financial exposure and usually voids insurance cooperation clauses." },
          { t: "Post a notice on social media right away describing the attack in detail.", d: 20, p: 0, why: "Premature, unapproved public detail can be inaccurate, aid the attacker and create liability. Communications must be coordinated with counsel and leadership." }
        ] },
      { phase: "Respond · Evidence", q: "A junior analyst asks what to do with the compromised systems before cleanup.",
        opts: [
          { t: "Preserve evidence first: capture memory and disk images, export relevant logs to protected storage, and document a chain of custody.", d: -6, p: 2, why: "Correct. Forensic images and preserved logs support root-cause analysis, potential law-enforcement action and insurance/legal needs. Chain of custody keeps evidence admissible." },
          { t: "Skip imaging to save time; just note the file names and move on.", d: 14, p: 0, why: "Without images and logs you cannot determine the entry point or scope, and you may reinfect from a missed foothold." }
        ] },
      { phase: "Identify · Scope", q: "DFIR needs to understand how bad it is. What do you prioritise finding out?",
        opts: [
          { t: "Determine the initial access vector, what accounts/systems are affected, whether data was exfiltrated, and the ransomware family.", d: -8, p: 2, why: "Correct. Scope drives everything: known-good restore points, whether this is also a data-breach (double extortion), and which detections/IOCs to hunt for across the estate." },
          { t: "Assume it is only the machines showing notes and plan to restore just those.", d: 16, p: 0, why: "Ransomware typically has broader footholds (stolen credentials, backdoors). Under-scoping leads to reinfection right after recovery." }
        ] },
      { phase: "Respond · Ransom decision", q: "Threat actors demand payment and claim they also stole patient data (double extortion). Leadership asks for your recommendation.",
        opts: [
          { t: "Do not rush to pay. Assess viable backups, treat stolen-data claims as a breach regardless, check legal/sanctions exposure, and preserve the option only as a last resort with counsel and law enforcement.", d: -10, p: 2, why: "Best practice. Paying does not guarantee decryption or deletion of stolen data, funds crime, may be unlawful if the actor is sanctioned, and the breach-notification duty exists whether or not you pay. Decision factors: backup viability, safety-of-life, legal/sanctions review, insurer and law-enforcement guidance." },
          { t: "Pay immediately and quietly to make the problem disappear.", d: 22, p: 0, why: "Rushing to pay risks sanctions violations, no guarantee of recovery, repeat targeting, and still leaves breach obligations. Payment is never the first move." },
          { t: "Refuse to even discuss it and publicly taunt the attackers.", d: 12, p: 0, why: "Keeping options open is prudent; antagonising the actor can escalate (e.g. faster data leak). Keep the decision measured and counsel-led." }
        ] },
      { phase: "Recover", q: "Backups exist. How do you restore?",
        opts: [
          { t: "Rebuild from known-clean images/backups into a hardened environment, reset credentials, validate integrity, and restore in a staged, monitored way after confirming the foothold is gone.", d: -12, p: 2, why: "Correct. Eradicate the root cause and rotate credentials first, restore to clean/patched systems, and monitor closely so you detect reinfection. Prioritise clinical-critical systems." },
          { t: "Restore the most recent backups straight onto the existing machines to be fast.", d: 18, p: 0, why: "Restoring onto still-compromised hosts, or from a backup made after the intrusion, reinfects you. Verify backups are clean and systems are rebuilt first." }
        ] },
      { phase: "Recover · Lessons learned", q: "Systems are back. What closes out the incident?",
        opts: [
          { t: "Hold a blameless lessons-learned review, update the IR plan and detections, track remediation of the root cause, and report as required to regulators and affected individuals.", d: -10, p: 2, why: "Correct. The post-incident activity phase turns pain into improvement: fix the gaps that allowed initial access, improve backups/segmentation/MFA, and meet notification duties (critical for a healthcare provider)." },
          { t: "Declare victory and move on; nobody wants to relive it.", d: 12, p: 0, why: "Skipping the review guarantees a repeat and can breach regulatory reporting obligations." }
        ] }
    ];

    let idx = 0, impact = 50, pts = 0, maxPts = NODES.length * 2;
    const log = [];
    const root = document.createElement("div");
    root.className = "stack";
    container.appendChild(root);
    root.innerHTML = `<div class="card stack">
        <div class="row" style="justify-content:space-between"><span class="ir-phase" id="ir-phase"></span><span class="tag" id="ir-step"></span></div>
        <div>Impact / damage meter <span class="muted">(lower is better)</span></div>
        <div class="ir-meter"><div id="ir-needle"></div></div>
        <div id="ir-stage"></div>
      </div>
      <div class="card stack"><b>Decision log</b><ul class="ir-log" id="ir-log"><li class="muted">No decisions yet.</li></ul></div>`;

    function setMeter() { root.querySelector("#ir-needle").style.left = Math.max(0, Math.min(100, impact)) + "%"; }

    function render() {
      setMeter();
      if (idx >= NODES.length) return finish();
      const n = NODES[idx];
      root.querySelector("#ir-phase").textContent = n.phase;
      root.querySelector("#ir-step").textContent = `Decision ${idx + 1} / ${NODES.length}`;
      const order = n.opts.map((o, i) => i).sort(() => Math.random() - 0.5);
      root.querySelector("#ir-stage").innerHTML = `<p><b>${esc(n.q)}</b></p>` + order.map((i) => `<button class="btn ir-opt" data-i="${i}">${esc(n.opts[i].t)}</button>`).join("") + `<div id="ir-fb"></div>`;
      root.querySelectorAll("#ir-stage [data-i]").forEach((b) => b.onclick = () => choose(+b.dataset.i));
    }

    function choose(i) {
      const n = NODES[idx], o = n.opts[i];
      impact = Math.max(0, Math.min(100, impact + o.d));
      pts += o.p;
      log.push({ phase: n.phase, choice: o.t, p: o.p, why: o.why });
      root.querySelectorAll("#ir-stage [data-i]").forEach((b) => b.disabled = true);
      root.querySelector("#ir-fb").innerHTML = `<div class="alert ${o.p === 2 ? "good" : o.p === 1 ? "info" : "bad"}">${o.p === 2 ? "Strong call. " : o.p === 1 ? "Workable, with caveats. " : "This hurt the response. "}${esc(o.why)}</div>
        <button class="btn primary" id="ir-next">${idx + 1 >= NODES.length ? "See debrief" : "Continue"}</button>`;
      renderLog();
      setMeter();
      root.querySelector("#ir-next").onclick = () => { idx++; render(); };
    }

    function renderLog() {
      root.querySelector("#ir-log").innerHTML = log.map((l, i) => `<li><span class="tag ${l.p === 2 ? "good" : l.p === 1 ? "warn" : "bad"}">${l.p}/2</span> <b>${esc(l.phase)}</b>: ${esc(l.choice)}</li>`).join("");
    }

    function finish() {
      const pct = Math.round((pts / maxPts) * 100);
      root.querySelector("#ir-phase").textContent = "Recover · Debrief";
      root.querySelector("#ir-step").textContent = "Complete";
      const verdict = impact < 35 ? ["good", "Contained quickly with evidence intact and obligations met. This is close to a model response."]
        : impact < 60 ? ["info", "The organisation recovered, but avoidable damage occurred. Review the red items below."]
        : ["bad", "A rough incident: spread, lost evidence or legal exposure piled up. Study the best-practice choices and run it again."];
      root.querySelector("#ir-stage").innerHTML = `<div class="alert ${verdict[0]}">Final impact: <b>${Math.round(impact)}/100</b> (lower is better). Best-practice score: <b>${pts}/${maxPts}</b> (${pct}%). ${verdict[1]}</div>
        <div class="alert info"><b>The throughline:</b> declare early and communicate out-of-band; <b>contain before you eradicate</b>; <b>preserve evidence</b> (images, logs, chain of custody); bring in <b>legal, leadership and insurance</b> promptly; treat the ransom as a measured, counsel-led last resort and remember that stolen-data duties apply whether or not you pay; restore to <b>clean, hardened</b> systems after rotating credentials; and finish with a <b>blameless lessons-learned</b> review and required notifications.</div>
        <div><button class="btn" id="ir-again">Run the exercise again</button></div>`;
      root.querySelector("#ir-again").onclick = () => { idx = 0; impact = 50; pts = 0; log.length = 0; renderLog(); render(); };
      ctx.complete(pct);
    }

    render();
  }
});
