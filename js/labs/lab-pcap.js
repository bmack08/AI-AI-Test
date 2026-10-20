window.CP = window.CP || {};
CP.labs = CP.labs || [];
CP.labs.push({
  id: "lab-pcap",
  title: "Packet Capture Investigation",
  module: "p2-m4",
  difficulty: "Intermediate",
  minutes: 35,
  skills: ["Wireshark display filters", "TCP handshake & flags", "port scan detection", "DNS tunneling", "HTTP exfiltration"],
  briefing: `<p><b>Scenario:</b> The network IDS at Corp Example fired three alerts overnight: a possible <b>port scan</b>, <b>anomalous DNS</b>
  and a <b>large outbound HTTP upload</b>. The network team exported a short packet capture (about 80 packets) from the core switch SPAN port.
  Use the Wireshark-style viewer to investigate and answer the questions.</p>
  <p><b>Objectives:</b></p>
  <ul>
    <li>Use display filters: <code>ip.addr==</code>, <code>ip.src==</code>, <code>ip.dst==</code>, <code>tcp.port==</code>, <code>udp.port==</code>,
    <code>tcp.flags.syn==1</code>, <code>tcp.flags.ack==0</code>, protocol names (<code>dns</code>, <code>http</code>, <code>tls</code>), combined with <code>&amp;&amp;</code>, <code>||</code>, <code>!</code> and parentheses.</li>
    <li>Recognise a SYN (half-open) scan and identify open ports from SYN/ACK replies.</li>
    <li>Spot DNS tunneling by long, high-entropy subdomains and TXT queries.</li>
    <li>Find an HTTP POST used for data exfiltration and pull the key details out of the packet detail pane.</li>
  </ul>
  <p>Internal network: <code>10.1.1.0/24</code>. Internal DNS resolver: <code>10.1.1.2</code>. All other addresses are fictional documentation ranges.</p>`,
  render(container, ctx) {
    container.classList.add("lab-lab-pcap");
    const style = document.createElement("style");
    style.textContent = `
      .lab-lab-pcap .pc-list { max-height: 360px; overflow: auto; border: 1px solid var(--border); border-radius: 6px; }
      .lab-lab-pcap .pc-list table { width: 100%; border-collapse: collapse; font-family: monospace; font-size: .78rem; }
      .lab-lab-pcap .pc-list th { position: sticky; top: 0; background: var(--surface); text-align: left; padding: .3rem .4rem; border-bottom: 1px solid var(--border); z-index: 1; }
      .lab-lab-pcap .pc-list td { padding: .2rem .4rem; white-space: nowrap; border-bottom: 1px solid var(--border); }
      .lab-lab-pcap .pc-list td.pc-info { white-space: nowrap; max-width: 520px; overflow: hidden; text-overflow: ellipsis; }
      .lab-lab-pcap .pc-list tr { cursor: pointer; }
      .lab-lab-pcap .pc-list tr.sel td { background: var(--accent); color: #fff; }
      .lab-lab-pcap tr.p-TCP td { background: rgba(160, 120, 255, .07); }
      .lab-lab-pcap tr.p-DNS td { background: rgba(80, 170, 255, .09); }
      .lab-lab-pcap tr.p-HTTP td { background: rgba(80, 220, 120, .10); }
      .lab-lab-pcap tr.p-TLSv1-3 td { background: rgba(255, 200, 80, .08); }
      .lab-lab-pcap tr.pc-rst td { color: var(--bad); }
      .lab-lab-pcap .pc-filter.ok { border-color: var(--good); box-shadow: 0 0 0 1px var(--good); }
      .lab-lab-pcap .pc-filter.err { border-color: var(--bad); box-shadow: 0 0 0 1px var(--bad); }
      .lab-lab-pcap .pc-detail { font-family: monospace; font-size: .8rem; white-space: pre-wrap; word-break: break-all; max-height: 300px; overflow: auto; }
      .lab-lab-pcap .pc-detail details { margin-left: .2rem; }
      .lab-lab-pcap .pc-detail summary { cursor: pointer; }
      .lab-lab-pcap .pc-hex { font-family: monospace; font-size: .75rem; white-space: pre; overflow: auto; max-height: 180px; }
    `;
    container.appendChild(style);
    const esc = ctx.escape;

    // ---------- packet generation ----------
    const pk = [];
    let seqid = 0x1a20;
    function add(t, src, dst, l4, sport, dport, o) {
      o = o || {};
      pk.push(Object.assign({ t, src, dst, l4, sport, dport }, o));
    }
    const SCANNER = "203.0.113.66", TARGET = "10.1.1.50", WS = "10.1.1.20", DNS = "10.1.1.2", EXFIL = "203.0.113.200";
    // ARP + NTP background
    add(0.000, null, null, "ARP", null, null, { arp: "Who has 10.1.1.1? Tell 10.1.1.20", len: 42 });
    add(0.001, null, null, "ARP", null, null, { arp: "10.1.1.1 is at 00:1c:7e:aa:01:01", len: 42 });
    add(0.210, WS, "198.51.100.123", "UDP", 123, 123, { ntp: "NTP Version 4, client", len: 90 });
    add(0.236, "198.51.100.123", WS, "UDP", 123, 123, { ntp: "NTP Version 4, server", len: 90 });
    // normal TLS browse
    const q1 = seqid++;
    add(0.500, WS, DNS, "UDP", 53122, 53, { dns: { id: q1, q: "www.example.com", type: "A" }, len: 75 });
    add(0.512, DNS, WS, "UDP", 53, 53122, { dns: { id: q1, q: "www.example.com", type: "A", resp: true, ans: ["198.51.100.10"] }, len: 91 });
    add(0.530, WS, "198.51.100.10", "TCP", 51544, 443, { flags: "SYN", len: 66 });
    add(0.561, "198.51.100.10", WS, "TCP", 443, 51544, { flags: "SYN,ACK", len: 66 });
    add(0.562, WS, "198.51.100.10", "TCP", 51544, 443, { flags: "ACK", len: 54 });
    add(0.565, WS, "198.51.100.10", "TCP", 51544, 443, { flags: "PSH,ACK", tls: "Client Hello (SNI=www.example.com)", len: 571 });
    add(0.597, "198.51.100.10", WS, "TCP", 443, 51544, { flags: "PSH,ACK", tls: "Server Hello, Change Cipher Spec, Application Data", len: 1514 });
    add(0.640, WS, "198.51.100.10", "TCP", 51544, 443, { flags: "PSH,ACK", tls: "Application Data", len: 140 });
    add(0.702, "198.51.100.10", WS, "TCP", 443, 51544, { flags: "PSH,ACK", tls: "Application Data", len: 1200 });
    // intranet HTTP
    add(1.100, "10.1.1.30", "10.1.1.5", "TCP", 50211, 80, { flags: "SYN", len: 66 });
    add(1.101, "10.1.1.5", "10.1.1.30", "TCP", 80, 50211, { flags: "SYN,ACK", len: 66 });
    add(1.102, "10.1.1.30", "10.1.1.5", "TCP", 50211, 80, { flags: "ACK", len: 54 });
    add(1.103, "10.1.1.30", "10.1.1.5", "TCP", 50211, 80, { flags: "PSH,ACK", http: { method: "GET", uri: "/index.html", host: "intranet.corp.example", ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }, len: 412 });
    add(1.110, "10.1.1.5", "10.1.1.30", "TCP", 80, 50211, { flags: "PSH,ACK", http: { status: "200 OK", ctype: "text/html", clen: 5120 }, len: 1350 });
    // port scan
    const ports = [21, 22, 23, 25, 53, 80, 110, 135, 139, 143, 443, 445, 3389, 8080];
    const open = [22, 80, 445];
    let t = 2.000;
    ports.forEach((p, i) => {
      const sp = 40000 + i * 7;
      add(t, SCANNER, TARGET, "TCP", sp, p, { flags: "SYN", len: 58, scan: true });
      if (open.includes(p)) {
        add(t + 0.0011, TARGET, SCANNER, "TCP", p, sp, { flags: "SYN,ACK", len: 58 });
        add(t + 0.0021, SCANNER, TARGET, "TCP", sp, p, { flags: "RST", len: 54 });
      } else {
        add(t + 0.0009, TARGET, SCANNER, "TCP", p, sp, { flags: "RST,ACK", len: 54 });
      }
      t += 0.0137;
    });
    // DNS tunneling
    const chunks = ["mzxw6ytboi4dgnzt2kfrgwy3pnvsxi33t", "nfxgo2ldpmrqxe3dfpbuw45dfn5zgkzlr", "gm2tmnrxgezdgnbvgy3tqojqgezdgnbv", "on2gk3tfmvzxa5dbnzzwk4ltobqxe5dz", "kzuw45dsmv2gk43ufvzxi4tvmn2gc3dd", "ojsxg5dvojqw45dfmrqwiyltnfzgg33n", "mfzxi33mmfxgo3dfmruxi2lpnzzw2zlc", "pjzxi4tfmfwxg33onbuwk5dsn5qwy3dz"];
    t = 4.200;
    chunks.forEach((c, i) => {
      const id = seqid++;
      const name = `${c}.${(i + 1).toString(16).padStart(2, "0")}.t.exfil-cdn.example`;
      add(t, WS, DNS, "UDP", 60010 + i, 53, { dns: { id, q: name, type: "TXT" }, len: 60 + name.length });
      add(t + 0.044, DNS, WS, "UDP", 53, 60010 + i, { dns: { id, q: name, type: "TXT", resp: true, ans: ["\"ack-" + (i + 1) + "\""] }, len: 80 + name.length });
      t += 0.61;
    });
    // HTTP exfil
    const q2 = seqid++;
    add(9.500, WS, DNS, "UDP", 53800, 53, { dns: { id: q2, q: "files.dropzone-example.net", type: "A" }, len: 84 });
    add(9.517, DNS, WS, "UDP", 53, 53800, { dns: { id: q2, q: "files.dropzone-example.net", type: "A", resp: true, ans: [EXFIL] }, len: 100 });
    add(9.530, WS, EXFIL, "TCP", 52990, 80, { flags: "SYN", len: 66 });
    add(9.602, EXFIL, WS, "TCP", 80, 52990, { flags: "SYN,ACK", len: 66 });
    add(9.603, WS, EXFIL, "TCP", 52990, 80, { flags: "ACK", len: 54 });
    add(9.605, WS, EXFIL, "TCP", 52990, 80, { flags: "PSH,ACK", http: { method: "POST", uri: "/upload.php?id=WS20", host: "files.dropzone-example.net", ua: "curl/8.4.0", ctype: "multipart/form-data; boundary=----x9", clen: 48213, file: "finance_q3_backup.zip" }, len: 1514 });
    for (let i = 0; i < 4; i++) add(9.606 + i * 0.001, WS, EXFIL, "TCP", 52990, 80, { flags: "ACK", cont: true, len: 1514 });
    add(9.790, EXFIL, WS, "TCP", 80, 52990, { flags: "PSH,ACK", http: { status: "200 OK", ctype: "text/plain", clen: 2, body: "OK" }, len: 210 });
    add(9.792, WS, EXFIL, "TCP", 52990, 80, { flags: "FIN,ACK", len: 54 });
    add(9.861, EXFIL, WS, "TCP", 80, 52990, { flags: "FIN,ACK", len: 54 });
    add(9.862, WS, EXFIL, "TCP", 52990, 80, { flags: "ACK", len: 54 });
    // a few more background packets
    add(10.400, "10.1.1.30", DNS, "UDP", 53901, 53, { dns: { id: 0x2f01, q: "updates.example.org", type: "AAAA" }, len: 79 });
    add(10.414, DNS, "10.1.1.30", "UDP", 53, 53901, { dns: { id: 0x2f01, q: "updates.example.org", type: "AAAA", resp: true, ans: ["2001:db8::25"] }, len: 107 });
    add(10.420, WS, "198.51.100.10", "TCP", 51544, 443, { flags: "FIN,ACK", len: 54 });
    add(10.450, "198.51.100.10", WS, "TCP", 443, 51544, { flags: "FIN,ACK", len: 54 });

    pk.sort((a, b) => a.t - b.t);
    pk.forEach((p, i) => {
      p.no = i + 1;
      const f = p.flags ? p.flags.split(",") : [];
      p.f = { syn: f.includes("SYN") ? 1 : 0, ack: f.includes("ACK") ? 1 : 0, reset: f.includes("RST") ? 1 : 0, fin: f.includes("FIN") ? 1 : 0, push: f.includes("PSH") ? 1 : 0 };
      if (p.l4 === "ARP") { p.proto = "ARP"; p.info = p.arp; }
      else if (p.dns) {
        p.proto = "DNS";
        p.info = `Standard query ${p.dns.resp ? "response " : ""}0x${p.dns.id.toString(16).padStart(4, "0")} ${p.dns.type} ${p.dns.q}${p.dns.resp ? " " + p.dns.type + " " + p.dns.ans.join(" ") : ""}`;
      } else if (p.ntp) { p.proto = "NTP"; p.info = p.ntp; }
      else if (p.http) {
        p.proto = "HTTP";
        p.info = p.http.method ? `${p.http.method} ${p.http.uri} HTTP/1.1${p.http.file ? "  (multipart: " + p.http.file + ")" : ""}` : `HTTP/1.1 ${p.http.status}  (${p.http.ctype})`;
      } else if (p.tls) { p.proto = "TLSv1.3"; p.info = p.tls; }
      else {
        p.proto = "TCP";
        p.info = `${p.sport} → ${p.dport} [${p.flags.replace(/,/g, ", ")}] Seq=${p.f.syn && !p.f.ack ? 0 : 1} ${p.f.ack ? "Ack=1 " : ""}Win=${p.f.reset ? 0 : 64240} Len=${p.cont ? 1460 : 0}${p.cont ? "  [TCP segment of a reassembled PDU]" : ""}`;
      }
    });

    // ---------- display filter engine ----------
    function fieldValues(p, name) {
      const isTcp = p.l4 === "TCP", isUdp = p.l4 === "UDP", hasIp = !!p.src;
      switch (name) {
        case "ip": return hasIp ? [true] : [];
        case "ip.addr": return hasIp ? [p.src, p.dst] : [];
        case "ip.src": return hasIp ? [p.src] : [];
        case "ip.dst": return hasIp ? [p.dst] : [];
        case "tcp": return isTcp ? [true] : [];
        case "udp": return isUdp ? [true] : [];
        case "arp": return p.l4 === "ARP" ? [true] : [];
        case "ntp": return p.ntp ? [true] : [];
        case "tcp.port": return isTcp ? [p.sport, p.dport] : [];
        case "tcp.srcport": return isTcp ? [p.sport] : [];
        case "tcp.dstport": return isTcp ? [p.dport] : [];
        case "udp.port": return isUdp ? [p.sport, p.dport] : [];
        case "udp.srcport": return isUdp ? [p.sport] : [];
        case "udp.dstport": return isUdp ? [p.dport] : [];
        case "tcp.flags.syn": case "tcp.flags.ack": case "tcp.flags.reset": case "tcp.flags.fin": case "tcp.flags.push":
          return isTcp ? [p.f[name.split(".")[2]]] : [];
        case "tcp.len": return isTcp ? [p.cont ? 1460 : Math.max(0, p.len - 54)] : [];
        case "frame.len": return [p.len];
        case "frame.number": return [p.no];
        case "dns": return p.dns ? [true] : [];
        case "dns.qry.name": return p.dns ? [p.dns.q] : [];
        case "dns.qry.type": return p.dns ? [p.dns.type] : [];
        case "dns.flags.response": return p.dns ? [p.dns.resp ? 1 : 0] : [];
        case "http": return p.http ? [true] : [];
        case "http.request": return p.http && p.http.method ? [true] : [];
        case "http.response": return p.http && p.http.status ? [true] : [];
        case "http.request.method": return p.http && p.http.method ? [p.http.method] : [];
        case "http.request.uri": return p.http && p.http.uri ? [p.http.uri] : [];
        case "http.host": return p.http && p.http.host ? [p.http.host] : [];
        case "http.user_agent": return p.http && p.http.ua ? [p.http.ua] : [];
        case "http.content_length": return p.http && p.http.clen != null ? [p.http.clen] : [];
        case "tls": return p.tls ? [true] : [];
        case "tls.handshake.extensions_server_name": { const m = p.tls && p.tls.match(/SNI=([^)]+)/); return m ? [m[1]] : []; }
        default: return null;
      }
    }
    function tokenize(s) {
      const toks = []; let i = 0;
      while (i < s.length) {
        const c = s[i];
        if (/\s/.test(c)) { i++; continue; }
        const two = s.slice(i, i + 2);
        if (["&&", "||", "==", "!=", ">=", "<="].includes(two)) { toks.push({ t: "op", v: two }); i += 2; continue; }
        if ("()!<>".includes(c)) { toks.push({ t: "op", v: c }); i++; continue; }
        if (c === '"') {
          let j = i + 1, v = "";
          while (j < s.length && s[j] !== '"') { if (s[j] === "\\" && j + 1 < s.length) j++; v += s[j]; j++; }
          if (j >= s.length) throw new Error("Unterminated string");
          toks.push({ t: "str", v }); i = j + 1; continue;
        }
        const m = s.slice(i).match(/^[A-Za-z0-9_.:\-\/]+/);
        if (!m) throw new Error(`Unexpected character "${c}"`);
        const w = m[0];
        const lw = w.toLowerCase();
        if (lw === "and") toks.push({ t: "op", v: "&&" });
        else if (lw === "or") toks.push({ t: "op", v: "||" });
        else if (lw === "not") toks.push({ t: "op", v: "!" });
        else if (["eq", "ne", "gt", "lt", "ge", "le"].includes(lw)) toks.push({ t: "op", v: { eq: "==", ne: "!=", gt: ">", lt: "<", ge: ">=", le: "<=" }[lw] });
        else if (lw === "contains") toks.push({ t: "op", v: "contains" });
        else toks.push({ t: "word", v: w });
        i += w.length;
      }
      return toks;
    }
    function compile(src) {
      const toks = tokenize(src); let pos = 0;
      const peek = () => toks[pos], next = () => toks[pos++];
      const isOp = (v) => peek() && peek().t === "op" && peek().v === v;
      function parseOr() { let l = parseAnd(); while (isOp("||")) { next(); const r = parseAnd(); const a = l; l = (p) => a(p) || r(p); } return l; }
      function parseAnd() { let l = parseUnary(); while (isOp("&&")) { next(); const r = parseUnary(); const a = l; l = (p) => a(p) && r(p); } return l; }
      function parseUnary() {
        if (isOp("!")) { next(); const e = parseUnary(); return (p) => !e(p); }
        if (isOp("(")) { next(); const e = parseOr(); if (!isOp(")")) throw new Error("Missing )"); next(); return e; }
        return parseCmp();
      }
      function parseCmp() {
        const f = next();
        if (!f || f.t !== "word") throw new Error("Expected a field name");
        const name = f.v.toLowerCase();
        if (fieldValues(pk[0], name) === null) throw new Error(`Unknown field "${f.v}"`);
        const o = peek();
        if (o && o.t === "op" && ["==", "!=", ">", "<", ">=", "<=", "contains"].includes(o.v)) {
          next();
          const v = next();
          if (!v || (v.t !== "word" && v.t !== "str")) throw new Error(`Expected a value after ${o.v}`);
          const raw = v.v;
          const num = /^(0x[0-9a-f]+|\d+)$/i.test(raw) ? Number(raw) : null;
          if (/^tcp\.flags\./.test(name) && !/^(0|1|true|false)$/i.test(raw)) throw new Error("Flag fields take 0/1 or true/false");
          const want = /^true$/i.test(raw) ? 1 : /^false$/i.test(raw) ? 0 : raw;
          const eq = (x) => (typeof x === "number" && num !== null) ? x === num : (typeof x === "number" && typeof want === "number") ? x === want : String(x).toLowerCase() === String(want).toLowerCase();
          const cmp = (x, fn) => { const n = typeof x === "number" ? x : Number(x); const w = num !== null ? num : Number(want); return !isNaN(n) && !isNaN(w) && fn(n, w); };
          return (p) => {
            const vals = fieldValues(p, name);
            if (!vals.length) return false;
            switch (o.v) {
              case "==": return vals.some(eq);
              case "!=": return !vals.some(eq);
              case ">": return vals.some((x) => cmp(x, (a, b) => a > b));
              case "<": return vals.some((x) => cmp(x, (a, b) => a < b));
              case ">=": return vals.some((x) => cmp(x, (a, b) => a >= b));
              case "<=": return vals.some((x) => cmp(x, (a, b) => a <= b));
              case "contains": return vals.some((x) => String(x).toLowerCase().includes(String(raw).toLowerCase()));
            }
            return false;
          };
        }
        return (p) => fieldValues(p, name).length > 0 && fieldValues(p, name).some((x) => x !== 0);
      }
      const fn = parseOr();
      if (pos < toks.length) throw new Error(`Unexpected "${typeof toks[pos].v === "string" ? toks[pos].v : "token"}"`);
      return fn;
    }
    function applyFilter(text) {
      if (!text.trim()) return { ok: true, rows: pk.slice() };
      try { const fn = compile(text); return { ok: true, rows: pk.filter(fn) }; }
      catch (e) { return { ok: false, err: e.message, rows: pk.slice() }; }
    }

    // ---------- UI ----------
    const root = document.createElement("div");
    root.className = "stack";
    container.appendChild(root);
    root.innerHTML = `
      <div class="card stack">
        <div class="row"><input class="input mono pc-filter" id="pc-f" placeholder="Apply a display filter ... e.g. ip.src==203.0.113.66 && tcp.flags.syn==1" style="flex:1" aria-label="Display filter">
          <button class="btn primary" id="pc-apply">Apply</button><button class="btn ghost" id="pc-clear">Clear</button></div>
        <div class="row" style="flex-wrap:wrap">${["tcp.flags.syn==1 && tcp.flags.ack==0", "dns", "http", "tls", "dns.qry.name contains \"exfil\"", "http.request.method==\"POST\"", "ip.addr==10.1.1.50 && tcp.flags.reset==1"]
          .map((x) => `<button class="btn ghost mono" data-ex="${esc(x)}" style="font-size:.75rem">${esc(x)}</button>`).join("")}</div>
        <div class="muted" id="pc-status"></div>
        <div class="pc-list"><table><thead><tr><th>No.</th><th>Time</th><th>Source</th><th>Destination</th><th>Protocol</th><th>Length</th><th>Info</th></tr></thead><tbody id="pc-rows"></tbody></table></div>
        <div class="grid-2"><div class="card pc-detail" id="pc-detail">Select a packet to see its details.</div><div class="card pc-hex" id="pc-hex"></div></div>
      </div>
      <div class="card stack" id="pc-qs"></div>`;
    const $ = (s) => root.querySelector(s);
    let selected = null, shown = pk;

    function drawRows() {
      $("#pc-rows").innerHTML = shown.map((p) => `<tr data-no="${p.no}" class="p-${p.proto.replace(/\./g, "-")}${p.f.reset ? " pc-rst" : ""}${selected === p.no ? " sel" : ""}">
        <td>${p.no}</td><td>${p.t.toFixed(6)}</td><td>${p.src || "IntelCor_aa:01:14"}</td><td>${p.dst || "Broadcast"}</td><td>${p.proto}</td><td>${p.len}</td><td class="pc-info">${esc(p.info)}</td></tr>`).join("");
      $("#pc-rows").querySelectorAll("tr").forEach((tr) => tr.onclick = () => { selected = +tr.dataset.no; drawRows(); drawDetail(); });
    }
    function drawDetail() {
      const p = pk[selected - 1];
      if (!p) return;
      const sec = (title, lines, openIt) => `<details${openIt ? " open" : ""}><summary>${esc(title)}</summary>${lines.map((l) => "    " + esc(l)).join("\n")}</details>`;
      let h = sec(`Frame ${p.no}: ${p.len} bytes on wire (${p.len * 8} bits)`, [`Arrival time offset: ${p.t.toFixed(6)} s`, `Frame length: ${p.len}`, `Protocols in frame: eth:${p.src ? "ip:" + p.l4.toLowerCase() : "arp"}${p.dns ? ":dns" : p.http ? ":http" : p.tls ? ":tls" : ""}`]);
      h += sec("Ethernet II", ["Src: 00:1c:7e:aa:01:" + (p.no % 90 + 10), "Dst: 00:1c:7e:aa:01:01", `Type: ${p.src ? "IPv4 (0x0800)" : "ARP (0x0806)"}`]);
      if (p.l4 === "ARP") h += sec("Address Resolution Protocol", [p.arp], true);
      else {
        h += sec(`Internet Protocol Version 4, Src: ${p.src}, Dst: ${p.dst}`, [`Version: 4`, `Time to Live: ${p.src.startsWith("10.") ? 128 : p.src === SCANNER ? 41 : 52}`, `Protocol: ${p.l4} (${p.l4 === "TCP" ? 6 : 17})`, `Source Address: ${p.src}`, `Destination Address: ${p.dst}`]);
        if (p.l4 === "TCP") h += sec(`Transmission Control Protocol, Src Port: ${p.sport}, Dst Port: ${p.dport}`, [`Source Port: ${p.sport}`, `Destination Port: ${p.dport}`, `Flags: ${p.flags}`, `  SYN: ${p.f.syn}  ACK: ${p.f.ack}  RST: ${p.f.reset}  FIN: ${p.f.fin}  PSH: ${p.f.push}`, `Window: ${p.f.reset ? 0 : 64240}`], !p.http && !p.tls);
        else h += sec(`User Datagram Protocol, Src Port: ${p.sport}, Dst Port: ${p.dport}`, [`Source Port: ${p.sport}`, `Destination Port: ${p.dport}`, `Length: ${p.len - 34}`]);
      }
      if (p.dns) h += sec("Domain Name System (" + (p.dns.resp ? "response" : "query") + ")", [`Transaction ID: 0x${p.dns.id.toString(16).padStart(4, "0")}`, `Queries: ${p.dns.q}: type ${p.dns.type}, class IN`, `  Name length: ${p.dns.q.length}`, `  Label count: ${p.dns.q.split(".").length}`, ...(p.dns.resp ? [`Answers: ${p.dns.ans.join(", ")}`] : [])], true);
      if (p.http) h += sec("Hypertext Transfer Protocol", p.http.method
        ? [`${p.http.method} ${p.http.uri} HTTP/1.1\\r\\n`, `Host: ${p.http.host}\\r\\n`, `User-Agent: ${p.http.ua}\\r\\n`, ...(p.http.ctype ? [`Content-Type: ${p.http.ctype}\\r\\n`] : []), ...(p.http.clen ? [`Content-Length: ${p.http.clen}\\r\\n`] : []), ...(p.http.file ? ["", `------x9`, `Content-Disposition: form-data; name="f"; filename="${p.http.file}"`, `Content-Type: application/zip`, "", "PK\\x03\\x04 ... (zip data)"] : [])]
        : [`HTTP/1.1 ${p.http.status}\\r\\n`, `Content-Type: ${p.http.ctype}\\r\\n`, `Content-Length: ${p.http.clen}\\r\\n`, ...(p.http.body ? ["", p.http.body] : [])], true);
      if (p.tls) h += sec("Transport Layer Security", [`TLSv1.3 Record Layer: ${p.tls}`, ...(p.tls.includes("SNI") ? [`Extension: server_name: ${p.tls.match(/SNI=([^)]+)/)[1]}`] : [])], true);
      $("#pc-detail").innerHTML = h;
      // fake hex dump of a summary string
      const s = (p.src || "") + (p.dst || "") + p.info;
      let hex = "";
      for (let i = 0; i < Math.min(s.length, 128); i += 16) {
        const chunk = s.slice(i, i + 16);
        hex += i.toString(16).padStart(4, "0") + "  " + chunk.split("").map((c) => (c.charCodeAt(0) & 255).toString(16).padStart(2, "0")).join(" ").padEnd(48) + "  " + chunk.replace(/[^\x20-\x7e]/g, ".") + "\n";
      }
      $("#pc-hex").textContent = hex;
    }
    function apply() {
      const v = $("#pc-f").value;
      const r = applyFilter(v);
      const fi = $("#pc-f");
      fi.classList.toggle("ok", r.ok && !!v.trim());
      fi.classList.toggle("err", !r.ok);
      shown = r.rows;
      $("#pc-status").textContent = r.ok ? `Displayed: ${shown.length} of ${pk.length} packets` : `Invalid filter: ${r.err}`;
      drawRows();
    }
    $("#pc-apply").onclick = apply;
    $("#pc-f").addEventListener("keydown", (e) => { if (e.key === "Enter") apply(); });
    $("#pc-f").addEventListener("input", () => { const r = applyFilter($("#pc-f").value); $("#pc-f").classList.toggle("err", !r.ok); $("#pc-f").classList.toggle("ok", r.ok && !!$("#pc-f").value.trim()); });
    $("#pc-clear").onclick = () => { $("#pc-f").value = ""; apply(); };
    root.querySelectorAll("[data-ex]").forEach((b) => b.onclick = () => { $("#pc-f").value = b.dataset.ex; apply(); });

    // ---------- questions ----------
    const scanSyns = pk.filter((p) => p.scan).map((p) => p.no).join(",");
    const norm = (s) => s.trim().toLowerCase().replace(/\s+/g, "");
    const Q = [
      { q: "What source IP address performed the port scan?", ph: "x.x.x.x", check: (a) => norm(a) === SCANNER, ans: SCANNER,
        why: "203.0.113.66 sends SYNs to 14 different ports on 10.1.1.50 within ~0.2 s from sequential source ports. Filter: ip.src==203.0.113.66" },
      { q: "Which TCP ports are OPEN on 10.1.1.50? (comma-separated)", ph: "e.g. 21,25", check: (a) => norm(a).split(/[,;]+/).filter(Boolean).map(Number).sort((x, y) => x - y).join(",") === "22,80,445", ans: "22, 80, 445",
        why: "Open ports answer SYN with SYN/ACK; closed ports answer RST/ACK. The scanner then sends RST instead of completing the handshake (a half-open / SYN scan, e.g. nmap -sS). Filter: ip.src==10.1.1.50 && tcp.flags.syn==1" },
      { q: "Write a display filter that shows EXACTLY the scanner's 14 SYN probes (and nothing else).", ph: "display filter", filter: true,
        check: (a) => { const r = applyFilter(a); return r.ok && a.trim() && r.rows.map((p) => p.no).join(",") === scanSyns; }, ans: "ip.src==203.0.113.66 && tcp.flags.syn==1 && tcp.flags.ack==0",
        why: "Combine the source address with the SYN flag. Adding tcp.flags.ack==0 makes it robust: it excludes SYN/ACK replies." },
      { q: "Which parent domain is being used for DNS tunneling?", ph: "domain", check: (a) => /(^|\.)exfil-cdn\.example\.?$/.test(norm(a)) && norm(a).replace(/\.$/, "").split(".").length <= 4, ans: "t.exfil-cdn.example (exfil-cdn.example)",
        why: "Eight TXT queries with 32-character base32-looking labels plus a sequence counter (01..08) under t.exfil-cdn.example. Long random labels, TXT records and many unique subdomains are classic DNS tunneling signs." },
      { q: "Which internal host is compromised (the source of the tunneling and the upload)?", ph: "x.x.x.x", check: (a) => norm(a) === WS, ans: WS,
        why: "10.1.1.20 issues the tunneling queries and the HTTP POST upload." },
      { q: "What is the filename uploaded in the HTTP POST exfiltration?", ph: "filename", check: (a) => norm(a) === "finance_q3_backup.zip", ans: "finance_q3_backup.zip",
        why: "Filter http.request.method==\"POST\" and open the HTTP section of the detail pane: multipart form-data with filename finance_q3_backup.zip (48,213 bytes) to files.dropzone-example.net (203.0.113.200) using curl. A curl User-Agent from a Windows workstation is itself suspicious." },
      { q: "Which external IP received the exfiltrated file?", ph: "x.x.x.x", check: (a) => norm(a) === EXFIL, ans: EXFIL,
        why: "The DNS answer for files.dropzone-example.net and the TCP stream both point to 203.0.113.200 on port 80 (cleartext HTTP, so the content is fully visible)." }
    ];
    $("#pc-qs").innerHTML = `<h3>Investigation questions</h3>` + Q.map((q, i) => `<div class="stack" data-q="${i}"><div><b>${i + 1}.</b> ${esc(q.q)}</div>
      <input class="input mono" placeholder="${esc(q.ph)}" data-in="${i}"><div data-fb></div></div>`).join("") +
      `<div class="row"><button class="btn primary" id="pc-check">Check answers</button></div><div id="pc-res"></div>`;
    $("#pc-check").onclick = () => {
      let right = 0;
      Q.forEach((q, i) => {
        const v = root.querySelector(`[data-in="${i}"]`).value;
        const ok = !!v.trim() && q.check(v);
        if (ok) right++;
        root.querySelector(`[data-q="${i}"] [data-fb]`).innerHTML = `<div class="alert ${ok ? "good" : "bad"}">${ok ? "Correct." : "Not quite. Expected: <code>" + esc(q.ans) + "</code>."} ${esc(q.why)}</div>`;
      });
      const pct = Math.round((right / Q.length) * 100);
      $("#pc-res").innerHTML = `<div class="alert ${pct >= 70 ? "good" : "info"}">${right}/${Q.length} correct (${pct}%). Next steps in a real case: isolate 10.1.1.20 via EDR, block exfil-cdn.example and 203.0.113.200, and check whether the scan of 10.1.1.50 was followed by exploitation of SMB (445).</div>`;
      ctx.complete(pct);
    };

    apply();
  }
});
