window.CP = window.CP || {};
CP.labs = CP.labs || [];
CP.labs.push({
  id: "lab-alert-triage",
  title: "SOC Queue: Triage Your Shift",
  module: "p2-m1",
  difficulty: "Beginner",
  minutes: 30,
  skills: ["alert triage", "true/false positive", "severity", "escalation", "enrichment", "SOC workflow"],
  briefing: `
    <p><b>Scenario:</b> You are the Tier 1 analyst on the morning shift. Ten alerts are waiting in the queue, each with the context an analyst
    actually gets: the user and host, how critical the asset is, enrichment (IP reputation, geolocation, threat intel) and the user's recent history.
    Work the queue the way you would on shift.</p>
    <p><b>For each alert decide three things:</b></p>
    <ul>
      <li><b>Verdict</b> - <span class="tag bad">True Positive</span> (real malicious activity),
        <span class="tag good">False Positive</span> (the detection misfired; nothing really happened), or
        <span class="tag warn">Benign True Positive</span> (the activity is real and matches the rule, but it is authorised/expected - e.g. a sanctioned pentest or a sysadmin).</li>
      <li><b>Severity</b> - Low / Medium / High / Critical, weighing asset criticality and blast radius.</li>
      <li><b>Action</b> - Escalate to Tier 2 / IR, or Close with a reason.</li>
    </ul>
    <div class="callout tip">Rule of thumb: a confirmed True Positive on a <b>crown-jewel</b> asset (domain controller, finance, production DB) escalates.
    A False Positive or a Benign True Positive is closed - but a Benign TP should be closed with a note so detections can be tuned, not deleted.</div>
    <div class="callout real">Analysts are measured on accuracy and on <b>MTTD/MTTR</b> (mean time to detect/respond). Over-escalating burns Tier 2;
    wrongly closing a real incident is far worse. When genuinely unsure, escalating is the safer error.</div>
  `,
  render(container, ctx) {
    const esc = ctx.escape;
    container.classList.add("lab-lab-alert-triage");

    // verdict: TP / FP / BTP ; sev: low/med/high/crit ; action: esc/close
    const A = [
      { title: "EDR: Mimikatz signature on endpoint", user: "mali", host: "WS-ENG-14 (workstation)", crit: "Medium",
        enrich: ["Process: powershell.exe -> Invoke-Mimikatz -DumpCreds", "Parent: a download cradle 3 min earlier", "User history: developer, no admin duties", "No change ticket; no pentest scheduled"],
        verdict: "TP", sev: "high", action: "esc",
        why: "Confirmed credential-dumping tool run by a regular developer with no authorisation - a real intrusion. High (not Critical) because it is a single workstation, but it must escalate to IR for containment and credential rotation." },
      { title: "Threat intel: outbound to known C2 IP", user: "svc_web", host: "APP-PROD-01 (production app server)", crit: "Critical",
        enrich: ["Dest 203.0.113.66 on CTI C2 feed (confidence: high)", "Beaconing every 60s, uniform payload size", "Asset: internet-facing production app server", "No proxy/business reason for this destination"],
        verdict: "TP", sev: "crit", action: "esc",
        why: "Periodic beaconing to a high-confidence C2 address from a crown-jewel production server is a real compromise with large blast radius - Critical, escalate immediately." },
      { title: "Impossible travel sign-in", user: "kchen", host: "M365 / cloud identity", crit: "High",
        enrich: ["Login from US (09:02) then Brazil (09:19)", "Brazil IP is a known commercial VPN exit", "User confirmed via chat: 'yes, I turned my VPN on'", "MFA satisfied on both logins"],
        verdict: "FP", sev: "low", action: "close",
        why: "The 'impossible travel' is explained by a corporate/commercial VPN and the user confirmed it, with MFA satisfied. The detection misfired on VPN geolocation - a False Positive. Close (and consider allow-listing the VPN range)." },
      { title: "Authorized penetration test: port scan from internal host", user: "pentest_svc", host: "RT-KALI-01 (red-team box)", crit: "Low",
        enrich: ["Nmap SYN scan across 10.10.0.0/16", "Source is the sanctioned red-team subnet", "Change ticket CHG-5582: 'External pentest 10/13-10/17'", "Rules of engagement on file"],
        verdict: "BTP", sev: "low", action: "close",
        why: "The scan really happened and matched the rule (a true positive), but it is authorised red-team activity covered by a change ticket - a Benign True Positive. Close with a note referencing CHG-5582; do not page IR." },
      { title: "Multiple failed logons then success", user: "backup_admin", host: "SRV-JUMP01 (internet-facing jump host)", crit: "High",
        enrich: ["62 x 4625 from 203.0.113.88 (foreign hoster) in 6 min", "Followed by 4624 type 10 (RDP) from same IP", "No change ticket; outside business hours", "Account is privileged"],
        verdict: "TP", sev: "crit", action: "esc",
        why: "A brute force that succeeded against a privileged account on an internet-facing host, from a hostile IP, out of hours - a confirmed compromise with a privileged foothold. Critical, escalate; contain the account and the access path." },
      { title: "Antivirus quarantined EICAR test file", user: "lpark", host: "WS-HR-03 (workstation)", crit: "Medium",
        enrich: ["Detection: EICAR-Test-File (standard AV test string)", "File quarantined successfully, not executed", "User was following an AV-verification KB article", "No other indicators on the host"],
        verdict: "BTP", sev: "low", action: "close",
        why: "EICAR is the harmless industry test string; AV correctly detected and quarantined it. The event is real and matched the rule but represents no threat (and here was deliberate) - a Benign True Positive. Close, no escalation." },
      { title: "PowerShell with -ExecutionPolicy Bypass", user: "svc_deploy", host: "FS-01 (file server)", crit: "Medium",
        enrich: ["powershell -ExecutionPolicy Bypass -File \\\\FS-01\\deploy$\\Install-Agent.ps1", "Runs nightly via Task Scheduler (seen for months)", "Service account used only for deployments", "Script is signed and on the internal share"],
        verdict: "FP", sev: "low", action: "close",
        why: "ExecutionPolicy Bypass is normal for scripts run from a share and this is a long-standing, signed, scheduled deployment by its service account. The rule is noisy; nothing bad happened - a False Positive. Close and tune the rule to exclude this known-good job." },
      { title: "New admin account created on domain controller", user: "svc_sql", host: "DC-01 (domain controller)", crit: "Critical",
        enrich: ["4720 then 4732: 'helpdesk_tmp' added to Administrators", "Created by svc_sql - a SQL service account", "No IAM/change ticket for this account", "Service accounts should never create users"],
        verdict: "TP", sev: "crit", action: "esc",
        why: "A service account creating a new admin on the domain controller with no ticket is classic persistence/privilege escalation on the most critical asset in the domain - Critical, escalate to IR at once." },
      { title: "User reported phishing email", user: "jortiz", host: "Email / M365", crit: "Medium",
        enrich: ["User forwarded a 'DocuShare invoice' email to abuse@", "Link resolves to docs-invoice-share.example (newly registered)", "Sender domain fails DMARC", "No click recorded in proxy logs yet"],
        verdict: "TP", sev: "med", action: "esc",
        why: "A real phishing email (newly registered lookalike domain, DMARC fail) reached a user. It is a genuine threat but no compromise yet - Medium. Escalate to email security / Tier 2 to purge the message tenant-wide and block the domain; thank the reporter." },
      { title: "Port 3389 open to internet flagged by vuln scanner", user: "n/a", host: "SRV-JUMP01 (internet-facing jump host)", crit: "High",
        enrich: ["Scanner finding: RDP (3389) reachable from 0.0.0.0/0", "Confirmed by external port check", "Introduced during last week's firewall change", "This is the same host as the brute-force alert"],
        verdict: "TP", sev: "high", action: "esc",
        why: "The exposure is real (and is exactly what enabled the brute force). It is a confirmed true-positive misconfiguration on a sensitive host - High. Escalate to the firewall/infra team to remove internet RDP; it is not a false positive just because it is 'only' a config issue." }
    ];

    const VERD = [["TP", "True Positive", "bad"], ["FP", "False Positive", "good"], ["BTP", "Benign True Positive", "warn"]];
    const SEV = [["low", "Low"], ["med", "Medium"], ["high", "High"], ["crit", "Critical"]];
    const ACT = [["esc", "Escalate to Tier 2 / IR"], ["close", "Close (with reason)"]];
    const sevIdx = (s) => ["low", "med", "high", "crit"].indexOf(s);

    const style = document.createElement("style");
    style.textContent = `
      .lab-lab-alert-triage .at-card { padding:12px 14px; }
      .lab-lab-alert-triage .at-head { display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap; align-items:baseline; }
      .lab-lab-alert-triage .at-ctx { font-size:.85em; margin:6px 0; }
      .lab-lab-alert-triage .at-ctx li { margin:2px 0; }
      .lab-lab-alert-triage .at-controls { display:grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap:10px; margin-top:8px; }
      .lab-lab-alert-triage .at-controls label.ttl { display:block; font-size:.8em; color:var(--muted); margin-bottom:3px; }
      .lab-lab-alert-triage .at-fb { margin-top:8px; font-size:.9em; }
      .lab-lab-alert-triage .at-summary td, .lab-lab-alert-triage .at-summary th { padding:4px 8px; }
    `;
    container.appendChild(style);

    const wrap = document.createElement("div");
    wrap.className = "stack";
    container.appendChild(wrap);
    const intro = document.createElement("div");
    intro.className = "muted";
    intro.innerHTML = `Queue: <b>${A.length}</b> alerts. Set verdict, severity and action for each, then submit your shift.`;
    wrap.appendChild(intro);

    A.forEach((a, i) => {
      const card = document.createElement("div");
      card.className = "card at-card stack";
      const critTag = a.crit === "Critical" ? "bad" : a.crit === "High" ? "warn" : "";
      card.innerHTML = `
        <div class="at-head"><b>#${i + 1} &middot; ${esc(a.title)}</b>
          <span class="tag ${critTag}">asset: ${esc(a.crit)}</span></div>
        <div class="muted" style="font-size:.85em">User: ${esc(a.user)} &middot; Host: ${esc(a.host)}</div>
        <ul class="at-ctx">${a.enrich.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>
        <div class="at-controls">
          <div><label class="ttl">Verdict</label><select class="select" data-v="${i}">${["<option value=''>- verdict -</option>"].concat(VERD.map((v) => `<option value="${v[0]}">${v[1]}</option>`)).join("")}</select></div>
          <div><label class="ttl">Severity</label><select class="select" data-s="${i}">${["<option value=''>- severity -</option>"].concat(SEV.map((v) => `<option value="${v[0]}">${v[1]}</option>`)).join("")}</select></div>
          <div><label class="ttl">Action</label><select class="select" data-a="${i}">${["<option value=''>- action -</option>"].concat(ACT.map((v) => `<option value="${v[0]}">${v[1]}</option>`)).join("")}</select></div>
        </div>
        <div class="at-fb" data-fb="${i}"></div>`;
      wrap.appendChild(card);
    });

    const bar = document.createElement("div");
    bar.className = "row";
    bar.innerHTML = `<button class="btn primary" data-el="check" type="button">Submit shift</button><span class="muted" data-el="prog"></span>`;
    wrap.appendChild(bar);
    const result = document.createElement("div");
    wrap.appendChild(result);

    const prog = () => {
      const n = A.filter((_, i) => wrap.querySelector(`[data-v="${i}"]`).value && wrap.querySelector(`[data-s="${i}"]`).value && wrap.querySelector(`[data-a="${i}"]`).value).length;
      container.querySelector('[data-el="prog"]').textContent = `${n}/${A.length} triaged`;
    };
    wrap.addEventListener("change", prog); prog();

    let done = false;
    container.querySelector('[data-el="check"]').addEventListener("click", () => {
      let verdictHits = 0, actionHits = 0, sevClose = 0, points = 0, answered = 0;
      A.forEach((a, i) => {
        const v = wrap.querySelector(`[data-v="${i}"]`).value;
        const s = wrap.querySelector(`[data-s="${i}"]`).value;
        const act = wrap.querySelector(`[data-a="${i}"]`).value;
        const fb = wrap.querySelector(`[data-fb="${i}"]`);
        if (!v || !s || !act) { fb.innerHTML = `<span class="tag warn">set verdict, severity and action</span>`; return; }
        answered++;
        const vOk = v === a.verdict;
        const aOk = act === a.action;
        const sDiff = Math.abs(sevIdx(s) - sevIdx(a.sev));
        const sOk = sDiff === 0;
        const sClose = sDiff <= 1;
        if (vOk) verdictHits++;
        if (aOk) actionHits++;
        if (sClose) sevClose++;
        // weight: verdict .45, action .3, severity .25 (half credit if within one level)
        points += (vOk ? 0.45 : 0) + (aOk ? 0.3 : 0) + (sOk ? 0.25 : sClose ? 0.125 : 0);
        fb.innerHTML = `<span class="tag ${vOk ? "good" : "bad"}">verdict: ${vOk ? "correct" : VERD.find((x) => x[0] === a.verdict)[1]}</span>
          <span class="tag ${sOk ? "good" : sClose ? "warn" : "bad"}">severity: ${sOk ? "correct" : (sClose ? "close - " : "") + SEV.find((x) => x[0] === a.sev)[1]}</span>
          <span class="tag ${aOk ? "good" : "bad"}">action: ${aOk ? "correct" : ACT.find((x) => x[0] === a.action)[1]}</span>
          <div class="muted" style="margin-top:4px">${esc(a.why)}</div>`;
      });
      if (answered < A.length) { result.innerHTML = `<div class="alert info">Triage all ${A.length} alerts to close out the shift.</div>`; return; }
      const score = Math.round(points / A.length * 100);
      const escN = A.filter((_, i) => wrap.querySelector(`[data-a="${i}"]`).value === "esc").length;
      const trueEsc = A.filter((a) => a.action === "esc").length;
      result.innerHTML = `<div class="alert ${score >= 70 ? "good" : "bad"}"><b>Shift score: ${score}%</b>
        <table class="table at-summary" style="margin-top:8px"><tbody>
          <tr><th>Verdict accuracy</th><td>${verdictHits}/${A.length}</td></tr>
          <tr><th>Action accuracy</th><td>${actionHits}/${A.length}</td></tr>
          <tr><th>Severity within one level</th><td>${sevClose}/${A.length}</td></tr>
          <tr><th>You escalated</th><td>${escN} alerts (correct answer: ${trueEsc})</td></tr>
        </tbody></table>
        <div style="margin-top:6px">Scoring weights verdict 45%, action 30%, severity 25% (half credit for being within one level).
        The six true positives (incl. the exposed-RDP misconfiguration and the reported phish) needed escalation; impossible-travel-via-VPN and the
        signed scheduled script were false positives; the sanctioned pentest and the EICAR test were benign true positives - closed with a tuning note.</div></div>`;
      if (!done) { done = true; ctx.complete(score); }
    });

    container._cpExpected = A.map((a) => ({ verdict: a.verdict, sev: a.sev, action: a.action }));
  }
});
