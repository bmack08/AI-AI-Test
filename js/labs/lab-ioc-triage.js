window.CP = window.CP || {};
CP.labs = CP.labs || [];
CP.labs.push({
  id: "lab-ioc-triage",
  title: "IOC Triage & the Pyramid of Pain",
  module: "p3-m2",
  difficulty: "Beginner",
  minutes: 25,
  skills: ["indicators of compromise", "threat-intel enrichment", "Pyramid of Pain", "TLP 2.0"],
  briefing: `<p><b>Scenario:</b> A partner CERT shared a bulletin and your SIEM surfaced several indicators. As a junior CTI analyst you must
  triage 12 <b>indicators of compromise (IOCs)</b>: decide whether each is likely <b>malicious, benign or unknown</b>, place it on David Bianco's
  <b>Pyramid of Pain</b>, and assign a <b>TLP 2.0</b> sharing label.</p>
  <p><b>Objectives:</b></p>
  <ul>
    <li>Read a simulated enrichment panel (detection ratio, first-seen date, ASN, WHOIS/domain age) and form a verdict.</li>
    <li>Classify each IOC by Pyramid-of-Pain level: Hash values, IP addresses, Domain names, Network/Host artifacts, Tools, TTPs. Higher levels cause the adversary more "pain" to change.</li>
    <li>Apply <b>TLP 2.0</b> (CLEAR, GREEN, AMBER, AMBER+STRICT, RED) correctly for sharing.</li>
  </ul>
  <p>All indicators are fictional (documentation ranges and example domains).</p>`,
  render(container, ctx) {
    container.classList.add("lab-lab-ioc-triage");
    const style = document.createElement("style");
    style.textContent = `
      .lab-lab-ioc-triage .io-grid { display: grid; grid-template-columns: 1fr; gap: .6rem; }
      .lab-lab-ioc-triage .io-enrich { font-size: .82rem; }
      .lab-lab-ioc-triage .io-enrich div { display: flex; justify-content: space-between; gap: 1rem; border-bottom: 1px dotted var(--border); padding: .15rem 0; }
      .lab-lab-ioc-triage .io-val { font-family: monospace; word-break: break-all; }
      .lab-lab-ioc-triage .io-controls { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: .4rem; }
      .lab-lab-ioc-triage .io-step.bad { outline: 2px solid var(--bad); }
      .lab-lab-ioc-triage .io-step.ok { outline: 2px solid var(--good); }
    `;
    container.appendChild(style);
    const esc = ctx.escape;

    const POP = ["Hash values", "IP addresses", "Domain names", "Host/Network artifacts", "Tools", "TTPs"];
    const TLP = ["TLP:CLEAR", "TLP:GREEN", "TLP:AMBER", "TLP:AMBER+STRICT", "TLP:RED"];
    const VERDICTS = ["Malicious", "Benign", "Unknown"];

    const IOCS = [
      { type: "SHA-256 hash", val: "3f1a...c09e (fictional sample)", e: { "Detections": "58 / 72 engines", "First seen": "2026-10-12", "File type": "Win32 EXE, packed", "Signed": "No" },
        verdict: "Malicious", pop: "Hash values", tlp: "TLP:AMBER", why: "High detection ratio, recent, packed and unsigned. A hash is trivially evaded (one byte change), so it sits at the bottom of the pyramid. Share with partners who need it but not publicly: AMBER." },
      { type: "MD5 hash", val: "d41d8cd98f00b204e9800998ecf8427e", e: { "Detections": "0 / 70 engines", "First seen": "2015-03-01", "Note": "Hash of an empty file", "Signed": "n/a" },
        verdict: "Benign", pop: "Hash values", tlp: "TLP:CLEAR", why: "This is the well-known MD5 of a zero-byte file; zero detections. Benign noise. Harmless/ubiquitous facts can be TLP:CLEAR." },
      { type: "IPv4 address", val: "203.0.113.200", e: { "Detections": "communicating files: 14 malicious", "ASN": "AS64500 Example-BulletproofVPS", "First seen": "2026-10-18", "Country": "(documentation range)" },
        verdict: "Malicious", pop: "IP addresses", tlp: "TLP:AMBER", why: "Recently stood up on a bulletproof-hosting ASN with many malicious communicating files. IPs are cheap to rotate (second pyramid level). Share internally and with trusted partners: AMBER." },
      { type: "IPv4 address", val: "8.8.8.8", e: { "Detections": "0 malicious", "ASN": "AS15169 (public DNS resolver)", "First seen": "2009", "Note": "well-known public resolver" },
        verdict: "Benign", pop: "IP addresses", tlp: "TLP:CLEAR", why: "A famous public DNS resolver. Benign; blocking it would break name resolution. Public knowledge, TLP:CLEAR." },
      { type: "Domain", val: "update-sync.example", e: { "Domain age": "4 days", "Registrar": "cheap-reg.example", "WHOIS": "privacy-protected", "Resolves to": "203.0.113.200" },
        verdict: "Malicious", pop: "Domain names", tlp: "TLP:AMBER", why: "Newly-registered (4 days), privacy-masked, resolving to a known-bad IP: textbook C2 domain. Domains are the third pyramid level (slightly more painful to change than IPs)." },
      { type: "Domain", val: "www.example.com", e: { "Domain age": "27 years", "Registrar": "reputable", "WHOIS": "public, long-standing org", "Category": "reserved example domain" },
        verdict: "Benign", pop: "Domain names", tlp: "TLP:CLEAR", why: "Old, reputable, reserved documentation domain. Benign." },
      { type: "URL", val: "http://files.dropzone-example.net/upload.php?id=WS20", e: { "Detections": "19 / 90 engines", "First seen": "2026-10-19", "Hosted on": "203.0.113.200", "Note": "cleartext HTTP upload endpoint" },
        verdict: "Malicious", pop: "Domain names", tlp: "TLP:AMBER", why: "Exfiltration upload endpoint on the bad infrastructure. A full URL combines domain + path; treat at the domain-name level for pyramid purposes. AMBER for partner sharing." },
      { type: "Host artifact (mutex)", val: "Global\\ExampleLckr-7f3", e: { "Context": "created by the loader to prevent re-infection", "Prevalence": "rare", "First seen": "2026-10-14" },
        verdict: "Malicious", pop: "Host/Network artifacts", tlp: "TLP:AMBER", why: "A unique mutex the malware creates is a host artifact (fourth level). Changing it costs the adversary a little tooling effort, so detections here are more durable than a hash or IP." },
      { type: "Registry key", val: "HKCU\\...\\CurrentVersion\\Run\\OneDriveSync", e: { "Context": "autostart value pointing to AppData launcher", "Legit name?": "masquerades as OneDrive", "Prevalence": "suspicious value data" },
        verdict: "Malicious", pop: "Host/Network artifacts", tlp: "TLP:AMBER", why: "Persistence via a Run key is a host artifact. The key path itself is common, so detection must key on the suspicious value data, which is why artifacts sit above domains/IPs." },
      { type: "Registry key", val: "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion", e: { "Context": "standard Windows key present on every host", "Prevalence": "ubiquitous", "Malicious?": "no" },
        verdict: "Benign", pop: "Host/Network artifacts", tlp: "TLP:CLEAR", why: "A core Windows registry key present everywhere. Benign; alerting on it would be pure noise." },
      { type: "Tool", val: "Credential-dumping utility (operator tool)", e: { "Context": "used to read LSASS memory", "Detection": "flagged as hacktool by AV", "Note": "legit red-team tool also abused" },
        verdict: "Malicious", pop: "Tools", tlp: "TLP:AMBER", why: "Detecting the attacker's tooling (fifth level) is painful for them: they must retool. Note dual-use tools can appear in sanctioned red-team work, so context matters. Share with partners: AMBER." },
      { type: "Behaviour / TTP", val: "explorer.exe -> script host -> PowerShell downloader, then SMB admin-share lateral movement", e: { "ATT&CK": "T1204.002, T1059.001, T1021.002", "Detection": "behavioural analytic", "Durability": "very high" },
        verdict: "Malicious", pop: "TTPs", tlp: "TLP:GREEN", why: "A behavioural chain is a TTP, the apex of the pyramid: the adversary would have to change how they operate to evade it. The generalised TTP (not customer-specific) can often be shared more widely with the community: GREEN." }
    ];

    const state = ctx.store("io") || {};
    let submitted = false;
    const root = document.createElement("div");
    root.className = "stack";
    container.appendChild(root);
    root.innerHTML = `<div class="card"><p class="muted"><b>Pyramid of Pain</b> (easiest for the adversary to change at the bottom to hardest at the top):
      Hash values &rarr; IP addresses &rarr; Domain names &rarr; Host/Network artifacts &rarr; Tools &rarr; TTPs. Detections built higher up cost the adversary more.
      <b>TLP 2.0:</b> CLEAR = share freely; GREEN = community; AMBER = org + clients need-to-know; AMBER+STRICT = org only; RED = named recipients only.</p></div>
      <div class="io-grid" id="io-grid"></div>
      <div class="card stack"><div class="row"><button class="btn primary" id="io-submit">Submit triage</button></div><div id="io-res"></div></div>`;

    function draw() {
      root.querySelector("#io-grid").innerHTML = IOCS.map((o, i) => {
        const a = state[i] || (state[i] = { v: "", pop: "", tlp: "" });
        const correct = submitted && a.v === o.verdict && a.pop === o.pop && a.tlp === o.tlp;
        const cls = submitted ? (correct ? "ok" : "bad") : "";
        return `<div class="card stack io-step ${cls}" data-i="${i}">
          <div class="row" style="justify-content:space-between"><b>#${i + 1} ${esc(o.type)}</b><span class="tag">${esc(o.pop)}?</span></div>
          <div class="io-val">${esc(o.val)}</div>
          <details><summary>Enrichment</summary><div class="io-enrich">${Object.entries(o.e).map(([k, v]) => `<div><span class="muted">${esc(k)}</span><span>${esc(String(v))}</span></div>`).join("")}</div></details>
          <div class="io-controls">
            <select class="select" data-f="v"${submitted ? " disabled" : ""}><option value="">Verdict...</option>${VERDICTS.map((x) => `<option${a.v === x ? " selected" : ""}>${x}</option>`).join("")}</select>
            <select class="select" data-f="pop"${submitted ? " disabled" : ""}><option value="">Pyramid level...</option>${POP.map((x) => `<option${a.pop === x ? " selected" : ""}>${x}</option>`).join("")}</select>
            <select class="select" data-f="tlp"${submitted ? " disabled" : ""}><option value="">TLP label...</option>${TLP.map((x) => `<option${a.tlp === x ? " selected" : ""}>${x}</option>`).join("")}</select>
          </div>
          ${submitted ? `<div class="alert ${correct ? "good" : "bad"}">Answer: <b>${o.verdict}</b> / <b>${esc(o.pop)}</b> / <b>${o.tlp}</b>. ${esc(o.why)}</div>` : ""}
        </div>`;
      }).join("");
      root.querySelectorAll(".io-step").forEach((card) => {
        const i = +card.dataset.i;
        card.querySelectorAll("select[data-f]").forEach((sel) => sel.onchange = () => { state[i][sel.dataset.f] = sel.value; ctx.store("io", state); });
      });
    }

    root.querySelector("#io-submit").onclick = () => {
      if (submitted) return;
      const incomplete = IOCS.filter((o, i) => !state[i] || !state[i].v || !state[i].pop || !state[i].tlp).length;
      if (incomplete) { root.querySelector("#io-res").innerHTML = `<div class="alert info">Complete all three fields for every IOC (${incomplete} unfinished).</div>`; return; }
      submitted = true;
      let v = 0, p = 0, t = 0;
      IOCS.forEach((o, i) => { if (state[i].v === o.verdict) v++; if (state[i].pop === o.pop) p++; if (state[i].tlp === o.tlp) t++; });
      const pct = Math.round((v + p + t) / (IOCS.length * 3) * 100);
      ctx.store("io", state);
      root.querySelector("#io-res").innerHTML = `<div class="alert ${pct >= 70 ? "good" : "info"}">Verdicts ${v}/12, pyramid levels ${p}/12, TLP ${t}/12. <b>Score: ${pct}%</b>.
        Remember: invest detection effort as high up the pyramid as you can (artifacts, tools, TTPs) so your defences survive the adversary swapping hashes and IPs.</div>`;
      draw();
      ctx.complete(pct);
    };

    draw();
  }
});
