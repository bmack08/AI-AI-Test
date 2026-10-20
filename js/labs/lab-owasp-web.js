window.CP = window.CP || {};
CP.labs = CP.labs || [];
CP.labs.push({
  id: "lab-owasp-web",
  title: "Web App Vulnerability Hunt (OWASP Top 10)",
  module: "p4-m2",
  difficulty: "Intermediate",
  minutes: 35,
  skills: ["SQL injection", "reflected XSS", "IDOR / broken access control", "parameterized queries", "output encoding", "OWASP Top 10 2025"],
  briefing: `<p><b>Scenario:</b> You are testing <b>Example Bank's</b> customer portal in a safe sandbox. Nothing here makes real network
  requests: a tiny simulated backend shows you the SQL it would build and renders attacker input <b>inertly</b> so you can see what would
  happen without anything actually executing. Find three classes of flaw, then pick the correct fix and map each to the
  <b>OWASP Top 10 (2025)</b>.</p>
  <p><b>Objectives:</b></p>
  <ul>
    <li><b>SQL injection</b> on the login form: craft input that makes the constructed query always true.</li>
    <li><b>Reflected XSS</b> in the search box: inject markup and see a "would execute" indicator (the payload is shown as text, never run).</li>
    <li><b>IDOR / broken access control</b>: change the <code>?id=</code> in a fake URL bar to read another customer's record.</li>
    <li>Choose the right remediation for each and map to the correct OWASP category.</li>
  </ul>
  <div class="callout warn">This sandbox never executes injected script and sends no requests. It is a teaching model of how these bugs behave.</div>`,
  render(container, ctx) {
    container.classList.add("lab-lab-owasp-web");
    const style = document.createElement("style");
    style.textContent = `
      .lab-lab-owasp-web .ow-tabs { display: flex; flex-wrap: wrap; gap: .4rem; }
      .lab-lab-owasp-web .ow-tabs .btn.active { background: var(--accent); color: #fff; }
      .lab-lab-owasp-web .ow-app { border: 1px solid var(--border); border-radius: 8px; padding: 1rem; background: var(--bg); }
      .lab-lab-owasp-web .ow-urlbar { display: flex; gap: .4rem; align-items: center; font-family: monospace; background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: .3rem .8rem; }
      .lab-lab-owasp-web pre.ow-sql { background: var(--code-bg); border: 1px solid var(--border); border-radius: 6px; padding: .6rem; white-space: pre-wrap; word-break: break-all; font-size: .82rem; }
      .lab-lab-owasp-web .ow-render { border: 1px dashed var(--border); border-radius: 6px; padding: .6rem; background: var(--surface); }
      .lab-lab-owasp-web .ow-exec { font-weight: bold; }
      .lab-lab-owasp-web .ow-done { font-size: .8rem; }
      .lab-lab-owasp-web .ow-fix label { display: block; font-weight: normal; margin: .2rem 0; }
    `;
    container.appendChild(style);
    const esc = ctx.escape;

    const done = ctx.store("done") || { sqli: false, xss: false, idor: false };
    const fixes = ctx.store("fixes") || { sqli: -1, xss: -1, idor: -1 };

    const root = document.createElement("div");
    root.className = "stack";
    container.appendChild(root);
    const tabs = ["1. SQL Injection", "2. Reflected XSS", "3. IDOR", "4. Fixes & OWASP mapping"];
    const nav = document.createElement("div");
    nav.className = "ow-tabs";
    nav.innerHTML = tabs.map((t, i) => `<button class="btn" data-t="${i}">${t}</button>`).join("");
    root.appendChild(nav);
    const panes = tabs.map(() => { const d = document.createElement("div"); d.className = "card stack"; d.hidden = true; root.appendChild(d); return d; });
    const show = (i) => { panes.forEach((p, j) => p.hidden = i !== j); nav.querySelectorAll(".btn").forEach((b, j) => b.classList.toggle("active", i === j)); };
    nav.querySelectorAll(".btn").forEach((b) => b.onclick = () => show(+b.dataset.t));
    const status = document.createElement("div");
    root.appendChild(status);

    function updateStatus() {
      const n = Object.values(done).filter(Boolean).length;
      status.innerHTML = `<div class="alert ${n === 3 ? "good" : "info"}">Vulnerabilities found: <b>${n} / 3</b>. ${n === 3 ? "Now complete tab 4 (fixes & OWASP mapping)." : "Keep hunting."}</div>`;
    }

    // ---- SQLi
    panes[0].innerHTML = `<h3>Login form</h3>
      <p>The backend builds this query by string concatenation (the vulnerable pattern):</p>
      <pre class="ow-sql">SELECT * FROM users\nWHERE username = '<span id="ow-u">?</span>'\n  AND password = '<span id="ow-p">?</span>';</pre>
      <div class="ow-app stack">
        <label>Username <input class="input mono" id="ow-sqlu" value="admin" autocomplete="off"></label>
        <label>Password <input class="input mono" id="ow-sqlp" placeholder="try something clever" autocomplete="off"></label>
        <div class="row"><button class="btn primary" id="ow-sqlgo">Log in</button></div>
      </div>
      <div id="ow-sqlout"></div>
      <div class="callout tip">Hint: the query uses single quotes around your input. What happens if your password contains a quote and a condition that is always true, plus a comment? Try something like <code>' OR '1'='1</code> in a field.</div>`;
    function sqlEscapePreview(s) { return esc(s); }
    function buildSql(u, p) { return `SELECT * FROM users\nWHERE username = '${u}'\n  AND password = '${p}';`; }
    // Detect classic tautology injection: odd number of quotes that break out AND an always-true OR, or a comment.
    function isInjection(u, p) {
      const combined = (u + "\u0000" + p);
      const hasQuoteBreak = /'/.test(u) || /'/.test(p);
      const tautology = /'\s*or\s*'?\s*('?\d+'?\s*=\s*'?\d+'?|'[^']*'\s*=\s*'[^']*'|true)/i.test(combined) || /or\s+1\s*=\s*1/i.test(combined);
      const comment = /(--|#|\/\*)/.test(combined);
      return hasQuoteBreak && (tautology || comment);
    }
    panes[0].querySelector("#ow-sqlgo").onclick = () => {
      const u = panes[0].querySelector("#ow-sqlu").value, p = panes[0].querySelector("#ow-sqlp").value;
      panes[0].querySelector("#ow-u").textContent = u || "?";
      panes[0].querySelector("#ow-p").textContent = p || "?";
      const sql = buildSql(u, p);
      const inj = isInjection(u, p);
      const legit = u === "admin" && p === "S3cureBankPw!";
      panes[0].querySelector("#ow-sqlout").innerHTML = `<p>Constructed query (what the server would run):</p><pre class="ow-sql">${sqlEscapePreview(sql)}</pre>
        ${inj ? `<div class="alert bad"><b>Authentication bypassed.</b> Your input broke out of the quotes and turned the WHERE clause into an always-true condition (or commented out the password check), so the query returns the first user row without a valid password. This is SQL injection.</div>`
          : legit ? `<div class="alert good">Logged in with the real credentials (no injection needed here).</div>`
          : `<div class="alert info">Login failed: the query returned no rows. (Try to make the WHERE clause always true by injecting through the quotes.)</div>`}`;
      if (inj && !done.sqli) { done.sqli = true; ctx.store("done", done); updateStatus(); panes[0].querySelector("#ow-sqlout").innerHTML += `<div class="alert good ow-done">Vulnerability 1 found: SQL injection.</div>`; }
    };

    // ---- XSS
    panes[1].innerHTML = `<h3>Search</h3>
      <p>The results page echoes your query back <b>without encoding</b>: <code>&lt;p&gt;Results for: <i>[your input]</i>&lt;/p&gt;</code>.</p>
      <div class="ow-app stack">
        <label>Search <input class="input mono" id="ow-xssq" placeholder="e.g. invoices  then try injecting a tag" autocomplete="off" style="width:100%"></label>
        <div class="row"><button class="btn primary" id="ow-xssgo">Search</button></div>
      </div>
      <div id="ow-xssout"></div>
      <div class="callout tip">Hint: inject an HTML tag that would run script, e.g. <code>&lt;img src=x onerror=...&gt;</code> or <code>&lt;script&gt;...&lt;/script&gt;</code>. The sandbox shows your markup as inert text and flags whether a browser WOULD have executed it.</div>`;
    function wouldExecute(s) {
      return /<\s*script\b/i.test(s) || /on\w+\s*=/i.test(s) || /<\s*(img|svg|iframe|body|video|audio|object|embed|details|a)\b[^>]*\b(onerror|onload|onclick|onmouseover|onfocus|href\s*=\s*["']?\s*javascript:)/i.test(s) || /javascript:/i.test(s) || /<\s*iframe\b/i.test(s);
    }
    panes[1].querySelector("#ow-xssgo").onclick = () => {
      const q = panes[1].querySelector("#ow-xssq").value;
      const exec = wouldExecute(q);
      panes[1].querySelector("#ow-xssout").innerHTML = `
        <p><b>Vulnerable rendering</b> (input concatenated into HTML). Shown here as escaped text so nothing runs:</p>
        <div class="ow-render mono">&lt;p&gt;Results for: ${esc(q)}&lt;/p&gt;</div>
        <p>Browser verdict:</p>
        <div class="alert ${exec ? "bad" : "info"}"><span class="ow-exec">${exec ? "WOULD EXECUTE" : "Inert"}</span> &mdash; ${exec ? "a real browser receiving this un-encoded HTML would parse your injected markup and run the script/event handler. That is reflected XSS." : "no active markup detected. Try injecting a tag with an event handler or a script element."}</div>
        <p class="muted">Safe rendering (output-encoded), for comparison &mdash; the tag becomes visible text, not markup:</p>
        <div class="ow-render">Results for: ${esc(q)}</div>`;
      if (exec && !done.xss) { done.xss = true; ctx.store("done", done); updateStatus(); panes[1].querySelector("#ow-xssout").innerHTML += `<div class="alert good ow-done">Vulnerability 2 found: reflected XSS.</div>`; }
    };

    // ---- IDOR
    const ACCOUNTS = {
      1001: { name: "You (j.customer)", bal: "$2,540.19", owner: true },
      1002: { name: "Dana Whitfield", bal: "$11,984.00", owner: false },
      1003: { name: "Sam Okafor", bal: "$402.75", owner: false },
      1007: { name: "Example Corp Payroll", bal: "$318,220.44", owner: false }
    };
    panes[2].innerHTML = `<h3>My account</h3>
      <p>You are logged in as customer <b>1001</b>. The app loads records by the <code>id</code> in the URL and never checks that the record belongs to you.</p>
      <div class="ow-urlbar"><span>https://portal.example-bank/account?id=</span><input class="input mono" id="ow-id" value="1001" style="width:90px;border-radius:12px"><button class="btn" id="ow-idgo">Go</button></div>
      <div id="ow-idout"></div>
      <div class="callout tip">Hint: you are id 1001. What if you request a different id?</div>`;
    panes[2].querySelector("#ow-idgo").onclick = () => {
      const id = panes[2].querySelector("#ow-id").value.trim();
      const acct = ACCOUNTS[id];
      if (!acct) { panes[2].querySelector("#ow-idout").innerHTML = `<div class="alert info">No account ${esc(id)} found. Known ids in this sandbox: 1001, 1002, 1003, 1007.</div>`; return; }
      panes[2].querySelector("#ow-idout").innerHTML = `<div class="ow-render stack"><div><b>Account ${esc(id)}</b></div><div>Holder: ${esc(acct.name)}</div><div>Balance: ${esc(acct.bal)}</div></div>
        ${acct.owner ? `<div class="alert info">This is your own account. Now try another id.</div>` : `<div class="alert bad"><b>Broken access control (IDOR).</b> You just read customer ${esc(id)}'s private balance even though you are logged in as 1001. The server returned it with no ownership check.</div>`}`;
      if (!acct.owner && !done.idor) { done.idor = true; ctx.store("done", done); updateStatus(); panes[2].querySelector("#ow-idout").innerHTML += `<div class="alert good ow-done">Vulnerability 3 found: IDOR / broken access control.</div>`; }
    };

    // ---- Fixes & mapping
    const FIX = {
      sqli: { title: "SQL injection fix", owasp: "A03:2025 Injection",
        opts: [
          { t: "Use parameterized queries / prepared statements (bind variables) so input is never treated as SQL. Validate input and apply least-privilege DB accounts as defense in depth.", ok: true },
          { t: "Escape single quotes by doubling them and keep building the query as a string.", ok: false },
          { t: "Hide the login error messages so attackers cannot tell it worked.", ok: false }
        ], why: "Parameterization separates code from data: the engine binds the value, so <code>' OR '1'='1</code> becomes a literal username, not logic. Manual escaping is fragile and misses edge cases." },
      xss: { title: "Reflected XSS fix", owasp: "A03:2025 Injection (Cross-Site Scripting)",
        opts: [
          { t: "Contextually output-encode all user data when rendering (HTML-encode for HTML context), add a strict Content-Security-Policy, and prefer frameworks that auto-escape.", ok: true },
          { t: "Strip the word 'script' from input with a blocklist.", ok: false },
          { t: "Only validate input length.", ok: false }
        ], why: "Encoding on output turns <code>&lt;img onerror&gt;</code> into harmless text for that context. CSP is defense in depth. Blocklisting 'script' is trivially bypassed (e.g. event handlers, SVG)." },
      idor: { title: "IDOR / access-control fix", owasp: "A01:2025 Broken Access Control",
        opts: [
          { t: "Enforce server-side authorization on every request: check that the authenticated user owns or may access the requested object (object-level access control). Deny by default.", ok: true },
          { t: "Use non-sequential UUIDs for ids so they are hard to guess.", ok: false },
          { t: "Hide the id in a POST body instead of the query string.", ok: false }
        ], why: "The only real fix is a server-side ownership/authorization check on each object access. UUIDs and hiding the parameter are obscurity, not access control." }
    };
    function drawFixes() {
      panes[3].innerHTML = `<h3>Choose the correct fix and OWASP category</h3>
        ${Object.entries(FIX).map(([k, f]) => `<div class="card stack" data-k="${k}"><b>${f.title}</b>
          <div class="ow-fix">${f.opts.map((o, i) => `<label><input type="radio" name="owf-${k}" value="${i}"${fixes[k] === i ? " checked" : ""}> ${esc(o.t)}</label>`).join("")}</div></div>`).join("")}
        <div class="row"><button class="btn primary" id="ow-submit">Submit</button></div><div id="ow-fixres"></div>`;
      panes[3].querySelectorAll("input[type=radio]").forEach((r) => r.onchange = () => { fixes[r.name.replace("owf-", "")] = +r.value; ctx.store("fixes", fixes); });
      panes[3].querySelector("#ow-submit").onclick = () => {
        const foundN = Object.values(done).filter(Boolean).length;
        const keys = Object.keys(FIX);
        if (keys.some((k) => fixes[k] < 0)) { panes[3].querySelector("#ow-fixres").innerHTML = `<div class="alert info">Choose a fix for all three.</div>`; return; }
        let fixOk = 0;
        keys.forEach((k) => { if (FIX[k].opts[fixes[k]].ok) fixOk++; });
        const pct = Math.round((foundN / 3 * 50) + (fixOk / 3 * 50));
        panes[3].querySelector("#ow-fixres").innerHTML = keys.map((k) => `<div class="alert ${FIX[k].opts[fixes[k]].ok ? "good" : "bad"}"><b>${FIX[k].title}</b> &rarr; ${FIX[k].owasp}. ${FIX[k].why}</div>`).join("")
          + `<div class="alert ${pct >= 70 ? "good" : "info"}">Found ${foundN}/3 vulnerabilities, ${fixOk}/3 correct fixes. <b>Score: ${pct}%</b>.
            Mapping recap: SQLi and XSS both fall under <b>A03 Injection</b> in the OWASP Top 10 2025; IDOR is the canonical <b>A01 Broken Access Control</b>.</div>`;
        ctx.complete(pct);
      };
    }
    drawFixes();

    updateStatus();
    show(0);
  }
});
