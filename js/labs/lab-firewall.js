window.CP = window.CP || {};
CP.labs = CP.labs || [];
CP.labs.push({
  id: "lab-firewall",
  title: "Firewall ACL Builder",
  module: "p1-m5",
  difficulty: "Intermediate",
  minutes: 30,
  skills: ["ACL design", "first-match rule ordering", "implicit deny", "network segmentation", "least privilege"],
  briefing: `<p><b>Scenario:</b> Example Retail Ltd is moving its online shop behind a new perimeter firewall. The old firewall had a single
  rule, <code>permit any any</code>. You must write the new ordered access control list (ACL). The firewall is <b>stateful</b>
  (return traffic for allowed connections is permitted automatically) and evaluates rules <b>top to bottom, first match wins</b>,
  ending in an <b>implicit deny</b>.</p>
  <p><b>Network:</b></p>
  <ul>
    <li><b>Internet</b>: everything not listed below.</li>
    <li><b>DMZ</b> <code>192.0.2.0/24</code>: public web server <code>192.0.2.10</code> (HTTPS 443, HTTP 80 for redirect).</li>
    <li><b>Internal LAN</b> <code>10.10.0.0/16</code>: workstations in <code>10.10.5.0/24</code>, database server <code>10.10.20.5</code> (PostgreSQL TCP 5432).</li>
    <li><b>Admin subnet</b> <code>10.10.99.0/24</code>: the IT jump hosts.</li>
    <li><b>Approved DNS resolver</b> (ISP): <code>198.51.100.53</code>.</li>
  </ul>
  <p><b>Requirements:</b></p>
  <ol>
    <li>Anyone on the internet may reach the web server on TCP 443 and TCP 80.</li>
    <li>Only the web server may reach the database, and only on TCP 5432.</li>
    <li>Only the admin subnet may SSH (TCP 22) to the web server and the database server.</li>
    <li>Internal hosts (10.10.0.0/16) may browse the web (TCP 443) and query DNS (UDP 53) <b>only</b> via the approved resolver.</li>
    <li>The DMZ must not initiate any other connections (a compromised web server should not be able to reach the LAN or download tools from the internet).</li>
    <li>Everything else is denied.</li>
  </ol>
  <p><b>Objective:</b> Build the ACL, run the 12 test packets, and get all of them to match the expected result. Fewer, tighter rules are better.</p>`,
  render(container, ctx) {
    container.classList.add("lab-lab-firewall");
    const style = document.createElement("style");
    style.textContent = `
      .lab-lab-firewall table input, .lab-lab-firewall table select { width: 100%; min-width: 70px; }
      .lab-lab-firewall .fw-diagram { font-family: monospace; white-space: pre; overflow-x: auto; background: var(--code-bg); padding: .75rem; border-radius: 6px; border: 1px solid var(--border); font-size: .85rem; line-height: 1.35; }
      .lab-lab-firewall .fw-tbl-wrap { overflow-x: auto; }
      .lab-lab-firewall td.fw-num { font-family: monospace; color: var(--muted); }
      .lab-lab-firewall .fw-ok { color: var(--good); font-weight: bold; }
      .lab-lab-firewall .fw-bad { color: var(--bad); font-weight: bold; }
    `;
    container.appendChild(style);
    const esc = ctx.escape;

    const TESTS = [
      { d: "Internet customer browses the shop (HTTPS)", src: "203.0.113.25", dst: "192.0.2.10", port: 443, proto: "tcp", exp: "allow" },
      { d: "Internet customer hits HTTP (redirect to HTTPS)", src: "198.51.100.140", dst: "192.0.2.10", port: 80, proto: "tcp", exp: "allow" },
      { d: "Internet attacker tries SSH on the web server", src: "198.51.100.77", dst: "192.0.2.10", port: 22, proto: "tcp", exp: "deny" },
      { d: "Internet attacker probes the database directly", src: "198.51.100.77", dst: "10.10.20.5", port: 5432, proto: "tcp", exp: "deny" },
      { d: "Web server queries the database", src: "192.0.2.10", dst: "10.10.20.5", port: 5432, proto: "tcp", exp: "allow" },
      { d: "Web server tries SMB to a workstation (lateral movement)", src: "192.0.2.10", dst: "10.10.5.20", port: 445, proto: "tcp", exp: "deny" },
      { d: "Web server downloads a tool from the internet (HTTPS)", src: "192.0.2.10", dst: "203.0.113.50", port: 443, proto: "tcp", exp: "deny" },
      { d: "Admin jump host SSHes to the web server", src: "10.10.99.7", dst: "192.0.2.10", port: 22, proto: "tcp", exp: "allow" },
      { d: "Admin jump host SSHes to the database", src: "10.10.99.7", dst: "10.10.20.5", port: 22, proto: "tcp", exp: "allow" },
      { d: "Workstation connects straight to the database", src: "10.10.5.20", dst: "10.10.20.5", port: 5432, proto: "tcp", exp: "deny" },
      { d: "Workstation browses an external site", src: "10.10.5.20", dst: "203.0.113.80", port: 443, proto: "tcp", exp: "allow" },
      { d: "Workstation DNS query to approved resolver", src: "10.10.5.20", dst: "198.51.100.53", port: 53, proto: "udp", exp: "allow" },
      { d: "Workstation DNS query to an unknown resolver (possible tunneling)", src: "10.10.5.20", dst: "203.0.113.53", port: 53, proto: "udp", exp: "deny" },
      { d: "Workstation SSHes to the database", src: "10.10.5.20", dst: "10.10.20.5", port: 22, proto: "tcp", exp: "deny" }
    ].slice(0, 14);

    const ipToInt = (s) => s.split(".").reduce((a, o) => (a * 256) + (+o), 0);
    function parseAddr(s) {
      s = String(s || "").trim().toLowerCase();
      if (s === "any" || s === "*" || s === "0.0.0.0/0") return { any: true };
      const m = s.match(/^(\d{1,3}(?:\.\d{1,3}){3})(?:\/(\d{1,2}))?$/);
      if (!m) return null;
      const octs = m[1].split(".").map(Number);
      if (octs.some((o) => o > 255)) return null;
      const p = m[2] === undefined ? 32 : +m[2];
      if (p > 32) return null;
      const size = Math.pow(2, 32 - p);
      const base = Math.floor(ipToInt(m[1]) / size) * size;
      return { base, size };
    }
    const inAddr = (a, ip) => a.any || (ipToInt(ip) >= a.base && ipToInt(ip) < a.base + a.size);
    function parsePort(s) {
      s = String(s || "").trim().toLowerCase();
      if (s === "any" || s === "*" || s === "") return { any: true };
      const r = s.match(/^(\d+)(?:-(\d+))?$/);
      if (!r) return null;
      const lo = +r[1], hi = r[2] ? +r[2] : lo;
      if (lo > 65535 || hi > 65535 || hi < lo) return null;
      return { lo, hi };
    }
    function evaluate(rules, pkt) {
      for (let i = 0; i < rules.length; i++) {
        const r = rules[i];
        const s = parseAddr(r.src), d = parseAddr(r.dst), p = parsePort(r.port);
        if (!s || !d || !p) continue;
        if (r.proto !== "any" && r.proto !== pkt.proto) continue;
        if (!inAddr(s, pkt.src) || !inAddr(d, pkt.dst)) continue;
        if (!p.any && (pkt.port < p.lo || pkt.port > p.hi)) continue;
        return { action: r.action, rule: i + 1 };
      }
      return { action: "deny", rule: null };
    }

    let rules = ctx.store("rules") || [
      { action: "allow", src: "any", dst: "192.0.2.10", port: "443", proto: "tcp" }
    ];

    const root = document.createElement("div");
    root.className = "stack";
    container.appendChild(root);
    root.innerHTML = `
      <div class="card"><div class="fw-diagram">
             INTERNET (any)                         ISP DNS 198.51.100.53
                  |
          +-------+--------+
          |   FIREWALL     |  stateful, first match, implicit deny
          +--+---------+---+
             |         |
   DMZ 192.0.2.0/24   LAN 10.10.0.0/16
   [web 192.0.2.10]    |-- workstations 10.10.5.0/24
                       |-- DB 10.10.20.5 (tcp/5432)
                       '-- admin jump hosts 10.10.99.0/24</div></div>
      <div class="card stack">
        <div class="row" style="justify-content:space-between"><h3 style="margin:0">Your ACL</h3>
          <div class="row"><button class="btn" id="fw-add">+ Add rule</button><button class="btn ghost" id="fw-clear">Clear all</button></div></div>
        <p class="muted">Addresses: <code>any</code>, a single IP, or CIDR (e.g. <code>10.10.99.0/24</code>). Port: <code>any</code>, a number, or a range like <code>8000-8080</code>.</p>
        <div class="fw-tbl-wrap"><table class="table"><thead><tr><th>#</th><th>Action</th><th>Source</th><th>Destination</th><th>Port</th><th>Proto</th><th></th></tr></thead><tbody id="fw-rules"></tbody>
        <tfoot><tr><td class="fw-num">*</td><td colspan="6" class="muted">implicit DENY any any any any</td></tr></tfoot></table></div>
        <div class="row"><button class="btn primary" id="fw-run">Run test packets</button><button class="btn" id="fw-submit">Submit ACL as final</button></div>
      </div>
      <div id="fw-results"></div>`;
    const tbody = root.querySelector("#fw-rules");

    function save() { ctx.store("rules", rules); }
    function draw() {
      tbody.innerHTML = rules.map((r, i) => {
        const bad = (k, fn) => fn(r[k]) ? "" : ` style="border-color:var(--bad)"`;
        return `<tr data-i="${i}">
        <td class="fw-num">${i + 1}</td>
        <td><select class="select" data-k="action"><option value="allow"${r.action === "allow" ? " selected" : ""}>ALLOW</option><option value="deny"${r.action === "deny" ? " selected" : ""}>DENY</option></select></td>
        <td><input class="input mono" data-k="src" value="${esc(r.src)}"${bad("src", parseAddr)}></td>
        <td><input class="input mono" data-k="dst" value="${esc(r.dst)}"${bad("dst", parseAddr)}></td>
        <td><input class="input mono" data-k="port" value="${esc(r.port)}"${bad("port", parsePort)} style="max-width:110px"></td>
        <td><select class="select" data-k="proto">${["tcp", "udp", "icmp", "any"].map((p) => `<option${r.proto === p ? " selected" : ""}>${p}</option>`).join("")}</select></td>
        <td style="white-space:nowrap"><button class="btn ghost" data-a="up" title="Move up" aria-label="Move up">&uarr;</button><button class="btn ghost" data-a="down" title="Move down" aria-label="Move down">&darr;</button><button class="btn ghost" data-a="del" title="Delete" aria-label="Delete">&times;</button></td></tr>`;
      }).join("") || `<tr><td colspan="7" class="muted">No rules: everything hits the implicit deny.</td></tr>`;
      tbody.querySelectorAll("[data-k]").forEach((el) => el.addEventListener("change", () => {
        const i = +el.closest("tr").dataset.i; rules[i][el.dataset.k] = el.value; save(); draw();
      }));
      tbody.querySelectorAll("[data-a]").forEach((b) => b.onclick = () => {
        const i = +b.closest("tr").dataset.i, a = b.dataset.a;
        if (a === "del") rules.splice(i, 1);
        if (a === "up" && i > 0) [rules[i - 1], rules[i]] = [rules[i], rules[i - 1]];
        if (a === "down" && i < rules.length - 1) [rules[i + 1], rules[i]] = [rules[i], rules[i + 1]];
        save(); draw();
      });
    }

    function run() {
      let pass = 0;
      const rows = TESTS.map((t) => {
        const r = evaluate(rules, t);
        const ok = r.action === t.exp;
        if (ok) pass++;
        return `<tr><td>${esc(t.d)}</td><td class="mono">${t.src} &rarr; ${t.dst}:${t.port}/${t.proto}</td><td>${t.exp.toUpperCase()}</td>
          <td>${r.action.toUpperCase()} <span class="muted">(${r.rule ? "rule " + r.rule : "implicit deny"})</span></td><td class="${ok ? "fw-ok" : "fw-bad"}">${ok ? "PASS" : "FAIL"}</td></tr>`;
      }).join("");
      const pct = Math.round((pass / TESTS.length) * 100);
      const hints = [];
      if (rules.some((r) => parseAddr(r.src) && parseAddr(r.src).any && parseAddr(r.dst) && parseAddr(r.dst).any && r.action === "allow")) hints.push("You have an ALLOW any &rarr; any rule. That defeats segmentation.");
      if (rules.some((r) => r.action === "allow" && /^(any|\*)$/i.test(String(r.port).trim()))) hints.push("An ALLOW rule with port <code>any</code> is rarely least privilege.");
      const invalid = rules.filter((r) => !parseAddr(r.src) || !parseAddr(r.dst) || !parsePort(r.port)).length;
      if (invalid) hints.push(`${invalid} rule(s) have invalid fields (red border) and are skipped.`);
      root.querySelector("#fw-results").innerHTML = `<div class="card stack">
        <div class="alert ${pass === TESTS.length ? "good" : "info"}">${pass} / ${TESTS.length} test packets behave as expected (${pct}%) using ${rules.length} rule(s).</div>
        ${hints.length ? `<div class="alert bad">${hints.join("<br>")}</div>` : ""}
        <div class="fw-tbl-wrap"><table class="table"><thead><tr><th>Test</th><th>Packet</th><th>Expected</th><th>Result</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>
        ${pass === TESTS.length ? `<div class="alert good"><b>All tests pass.</b> A model answer looks like:<pre class="mono">1 ALLOW any          192.0.2.10    443  tcp
2 ALLOW any          192.0.2.10    80   tcp
3 ALLOW 192.0.2.10   10.10.20.5    5432 tcp
4 ALLOW 10.10.99.0/24 192.0.2.10   22   tcp
5 ALLOW 10.10.99.0/24 10.10.20.5   22   tcp
6 ALLOW 10.10.0.0/16 198.51.100.53 53   udp
7 DENY  192.0.2.0/24 any           any  any   (explicit, logged)
8 ALLOW 10.10.0.0/16 any           443  tcp
* implicit deny</pre>Note the order: the DMZ deny (rule 7) must not be placed above rule 3. An explicit final deny with logging is good practice because implicit denies are often not logged.</div>` : ""}
      </div>`;
      if (pass === TESTS.length) ctx.complete(100);
      return pct;
    }

    root.querySelector("#fw-add").onclick = () => { rules.push({ action: "allow", src: "any", dst: "any", port: "any", proto: "tcp" }); save(); draw(); };
    root.querySelector("#fw-clear").onclick = () => { rules = []; save(); draw(); };
    root.querySelector("#fw-run").onclick = run;
    root.querySelector("#fw-submit").onclick = () => { const pct = run(); ctx.complete(pct); };
    draw();
  }
});
