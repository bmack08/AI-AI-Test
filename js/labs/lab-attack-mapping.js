window.CP = window.CP || {};
CP.labs = CP.labs || [];
CP.labs.push({
  id: "lab-attack-mapping",
  title: "Map an Intrusion to MITRE ATT&CK",
  module: "p2-m7",
  difficulty: "Intermediate",
  minutes: 25,
  skills: ["MITRE ATT&CK Enterprise", "tactics vs techniques", "sub-techniques", "incident reporting"],
  briefing: `<p><b>Scenario:</b> Last week a ransomware affiliate hit Example Logistics. The DFIR team has pieced together the timeline below
  from email gateway logs, EDR telemetry, Windows event logs and proxy logs. Leadership wants the incident report to use
  <b>MITRE ATT&amp;CK</b> so detections can be prioritised and the attack compared with threat-intel reports.</p>
  <p><b>Objectives:</b></p>
  <ul>
    <li>Distinguish a <b>tactic</b> (the adversary's goal, the "why", e.g. TA0006 Credential Access) from a <b>technique</b> (the "how", e.g. T1003 OS Credential Dumping) and a <b>sub-technique</b> (e.g. T1003.001 LSASS Memory).</li>
    <li>Map each of 8 observed steps to the correct tactic and technique ID.</li>
    <li>Learn which log sources reveal each technique from the explanations.</li>
  </ul>
  <p>Reference: <a href="https://attack.mitre.org/" target="_blank" rel="noopener">attack.mitre.org</a>.</p>`,
  render(container, ctx) {
    container.classList.add("lab-lab-attack-mapping");
    const style = document.createElement("style");
    style.textContent = `
      .lab-lab-attack-mapping .am-step { border-left: 4px solid var(--accent); }
      .lab-lab-attack-mapping .am-step.ok { border-left-color: var(--good); }
      .lab-lab-attack-mapping .am-step.bad { border-left-color: var(--bad); }
      .lab-lab-attack-mapping .am-ev { font-family: monospace; font-size: .8rem; white-space: pre-wrap; word-break: break-all; background: var(--code-bg); border: 1px solid var(--border); border-radius: 6px; padding: .5rem; }
      .lab-lab-attack-mapping .am-sel { display: grid; grid-template-columns: 1fr 1.4fr; gap: .5rem; }
      @media (max-width: 640px) { .lab-lab-attack-mapping .am-sel { grid-template-columns: 1fr; } }
      .lab-lab-attack-mapping .am-chain { display: flex; flex-wrap: wrap; gap: .3rem; align-items: center; }
      .lab-lab-attack-mapping .am-chain .tag { font-family: monospace; }
    `;
    container.appendChild(style);
    const esc = ctx.escape;

    const TACTICS = [["TA0043", "Reconnaissance"], ["TA0042", "Resource Development"], ["TA0001", "Initial Access"], ["TA0002", "Execution"], ["TA0003", "Persistence"], ["TA0004", "Privilege Escalation"], ["TA0005", "Defense Evasion"], ["TA0006", "Credential Access"], ["TA0007", "Discovery"], ["TA0008", "Lateral Movement"], ["TA0009", "Collection"], ["TA0011", "Command and Control"], ["TA0010", "Exfiltration"], ["TA0040", "Impact"]];
    const TECH = [
      ["T1566.001", "Phishing: Spearphishing Attachment"], ["T1566.002", "Phishing: Spearphishing Link"],
      ["T1204.001", "User Execution: Malicious Link"], ["T1204.002", "User Execution: Malicious File"],
      ["T1059.001", "Command and Scripting Interpreter: PowerShell"], ["T1059.003", "Command and Scripting Interpreter: Windows Command Shell"],
      ["T1547.001", "Boot or Logon Autostart Execution: Registry Run Keys / Startup Folder"], ["T1053.005", "Scheduled Task/Job: Scheduled Task"],
      ["T1003.001", "OS Credential Dumping: LSASS Memory"], ["T1003.003", "OS Credential Dumping: NTDS"], ["T1110.003", "Brute Force: Password Spraying"],
      ["T1021.001", "Remote Services: Remote Desktop Protocol"], ["T1021.002", "Remote Services: SMB/Windows Admin Shares"],
      ["T1071.001", "Application Layer Protocol: Web Protocols"], ["T1071.004", "Application Layer Protocol: DNS"],
      ["T1041", "Exfiltration Over C2 Channel"], ["T1486", "Data Encrypted for Impact"], ["T1490", "Inhibit System Recovery"],
      ["T1055", "Process Injection"], ["T1078", "Valid Accounts"]
    ].sort((a, b) => a[0].localeCompare(b[0]));

    const STEPS = [
      { title: "The lure", text: "An accounts-payable clerk receives an email from a spoofed freight partner with an attached archive <code>Shipment_Invoice_4471.zip</code> containing a disguised script.",
        ev: "Email gateway: from=billing@freight-partner.example to=ap.clerk@logistics.example attach=Shipment_Invoice_4471.zip verdict=delivered",
        tac: "TA0001", tech: "T1566.001", why: "Initial Access via a malicious attachment is Spearphishing Attachment (T1566.001). A link instead of an attachment would be T1566.002. Data sources: email gateway and mail logs." },
      { title: "The click", text: "The clerk extracts the archive and double-clicks the enclosed script, believing it to be a document.",
        ev: "EDR process create: parent=explorer.exe child=wscript.exe cmd=[opened downloaded script from Downloads folder]",
        tac: "TA0002", tech: "T1204.002", why: "The adversary relies on a user opening a malicious file: User Execution: Malicious File (T1204.002), tactic Execution. explorer.exe spawning a script host on a freshly downloaded file is a high-fidelity detection." },
      { title: "Second stage", text: "The script launches PowerShell with an obfuscated command that pulls a loader and runs it in memory.",
        ev: "EDR process create: parent=wscript.exe child=powershell.exe cmd=[no-profile, hidden window, encoded command]  (Script Block Logging EID 4104 captured the decoded downloader)",
        tac: "TA0002", tech: "T1059.001", why: "Command and Scripting Interpreter: PowerShell (T1059.001). Hidden windows and encoded commands are classic. Enable PowerShell Script Block Logging (EID 4104) to recover the decoded script." },
      { title: "Staying put", text: "The loader adds an autostart value under the current user's Run key pointing to a launcher.",
        ev: "EDR registry set: key=HKCU\\...\\CurrentVersion\\Run\\OneDriveSync value=[launcher in AppData\\Roaming]",
        tac: "TA0003", tech: "T1547.001", why: "Boot or Logon Autostart Execution: Registry Run Keys / Startup Folder (T1547.001), tactic Persistence. Masquerading as 'OneDriveSync' is Defense Evasion, but the Run-key behaviour itself maps here." },
      { title: "Harvesting secrets", text: "An operator tool reads the memory of the Local Security Authority process to recover cached credentials on the beachhead host.",
        ev: "EDR alert: suspicious handle (0x1010) opened to lsass.exe by a non-system process; memory read observed",
        tac: "TA0006", tech: "T1003.001", why: "OS Credential Dumping: LSASS Memory (T1003.001), tactic Credential Access. Detect via Sysmon EID 10 (ProcessAccess) for handles to lsass.exe, or Microsoft's LSA protection and Credential Guard to prevent it." },
      { title: "Spreading out", text: "Using the recovered administrator credentials, the attacker connects to a file server over SMB and copies tools to the admin share.",
        ev: "Windows Security EID 4624 logon type 3 to FILESRV01 from WKS-AP01; files written to \\\\FILESRV01\\ADMIN$",
        tac: "TA0008", tech: "T1021.002", why: "Remote Services: SMB/Windows Admin Shares (T1021.002), tactic Lateral Movement. Logon type 3 plus writes to ADMIN$/C$ are the tell. T1021.001 would be RDP instead." },
      { title: "Calling home", text: "The loader beacons to a server over HTTPS, blending with normal web traffic and receiving commands.",
        ev: "Proxy log: periodic POSTs to https://cdn-sync.example/api/v2/health, ~every 60s, small jittered payloads, rare destination for this host",
        tac: "TA0011", tech: "T1071.001", why: "Application Layer Protocol: Web Protocols (T1071.001), tactic Command and Control. Regular beacons with jitter to an uncommon HTTPS destination are the signal. DNS-based beaconing would be T1071.004." },
      { title: "The payoff", text: "Overnight the ransomware encrypts files across the file server and workstations and appends a new extension, then drops ransom notes.",
        ev: "EDR: mass file renames/writes with extension '.examplecrypt' across many directories; shadow copies deleted beforehand",
        tac: "TA0040", tech: "T1486", why: "Data Encrypted for Impact (T1486), tactic Impact. The shadow-copy deletion seen just before is a separate technique, Inhibit System Recovery (T1490)." }
    ];

    const state = ctx.store("map") || {};
    let submitted = false;
    const root = document.createElement("div");
    root.className = "stack";
    container.appendChild(root);
    root.innerHTML = `<div class="card"><div class="am-chain" id="am-chain"></div></div>
      <div id="am-steps" class="stack"></div>
      <div class="card stack"><div class="row"><button class="btn primary" id="am-submit">Submit mapping</button></div><div id="am-res"></div></div>`;

    const tacName = (id) => (TACTICS.find((x) => x[0] === id) || ["", "?"])[1];
    const techName = (id) => (TECH.find((x) => x[0] === id) || ["", "?"])[1];

    function drawChain() {
      root.querySelector("#am-chain").innerHTML = `<span class="muted">Kill-chain so far:</span>` + STEPS.map((s, i) => {
        const a = state[i];
        const done = a && a.tac && a.tech;
        const cls = submitted ? (done && a.tac === s.tac && a.tech === s.tech ? "good" : "bad") : done ? "warn" : "";
        return `<span class="tag ${cls}">${i + 1}. ${done ? esc(a.tech) : "?"}</span>${i < STEPS.length - 1 ? '<span aria-hidden="true">&rarr;</span>' : ""}`;
      }).join("");
    }

    function drawSteps() {
      root.querySelector("#am-steps").innerHTML = STEPS.map((s, i) => {
        const a = state[i] || (state[i] = { tac: "", tech: "" });
        const correct = submitted && a.tac === s.tac && a.tech === s.tech;
        const cls = submitted ? (correct ? "ok" : "bad") : "";
        return `<div class="card stack am-step ${cls}" data-i="${i}">
          <div><b>Step ${i + 1}: ${esc(s.title)}</b></div>
          <div>${s.text}</div>
          <div class="am-ev">${esc(s.ev)}</div>
          <div class="am-sel">
            <label>Tactic (goal)<select class="select" data-f="tac"${submitted ? " disabled" : ""}><option value="">-- tactic --</option>${TACTICS.map(([id, n]) => `<option value="${id}"${a.tac === id ? " selected" : ""}>${id} ${n}</option>`).join("")}</select></label>
            <label>Technique (how)<select class="select" data-f="tech"${submitted ? " disabled" : ""}><option value="">-- technique --</option>${TECH.map(([id, n]) => `<option value="${id}"${a.tech === id ? " selected" : ""}>${id} ${n}</option>`).join("")}</select></label>
          </div>
          ${submitted ? `<div class="alert ${correct ? "good" : "bad"}">Answer: <b>${s.tac} ${esc(tacName(s.tac))}</b> / <b>${s.tech} ${esc(techName(s.tech))}</b>. ${esc(s.why)}</div>` : ""}
        </div>`;
      }).join("");
      root.querySelectorAll(".am-step").forEach((card) => {
        const i = +card.dataset.i;
        card.querySelectorAll("select[data-f]").forEach((sel) => sel.onchange = () => { state[i][sel.dataset.f] = sel.value; ctx.store("map", state); drawChain(); });
      });
    }

    root.querySelector("#am-submit").onclick = () => {
      if (submitted) return;
      const unfilled = STEPS.filter((s, i) => !state[i] || !state[i].tac || !state[i].tech).length;
      if (unfilled) { root.querySelector("#am-res").innerHTML = `<div class="alert info">Fill in a tactic and technique for every step (${unfilled} incomplete).</div>`; return; }
      submitted = true;
      let tac = 0, tech = 0;
      STEPS.forEach((s, i) => { if (state[i].tac === s.tac) tac++; if (state[i].tech === s.tech) tech++; });
      const pct = Math.round((0.4 * tac + 0.6 * tech) / STEPS.length * 100);
      ctx.store("map", state);
      root.querySelector("#am-res").innerHTML = `<div class="alert ${pct >= 70 ? "good" : "info"}">Tactics: ${tac}/${STEPS.length}. Techniques: ${tech}/${STEPS.length}. <b>Score: ${pct}%</b>.
        A finished ATT&CK mapping like this feeds a Navigator layer so the SOC can see which techniques they can already detect and where the gaps are.</div>`;
      drawSteps(); drawChain();
      ctx.complete(pct);
    };

    drawSteps();
    drawChain();
  }
});
