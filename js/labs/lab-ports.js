window.CP = window.CP || {};
CP.labs = CP.labs || [];
CP.labs.push({
  id: "lab-ports",
  title: "Port & Protocol Speed Match",
  module: "p0-m2",
  difficulty: "Beginner",
  minutes: 10,
  skills: ["well-known ports", "TCP vs UDP", "service identification"],
  briefing: `<p><b>Scenario:</b> A firewall log scrolls past: <code>DENY TCP 198.51.100.23:51544 &rarr; 203.0.113.10:3389</code>.
  A good analyst instantly knows that is someone trying RDP from the internet. Port numbers are the vocabulary of network
  security, and the exams (Network+, Security+, CySA+) expect you to know them cold.</p>
  <p><b>Objectives:</b></p>
  <ul>
    <li>Identify the service that normally listens on ~30 well-known and registered ports.</li>
    <li>Know whether each service primarily uses TCP, UDP, or both.</li>
    <li>Recognise which ports are high-risk when exposed to the internet.</li>
  </ul>
  <p><b>How it works:</b> 15 random rounds, 20 seconds each. Pick the service <i>and</i> the transport. Full credit needs both
  correct and a time bonus rewards speed. Your score percentage is based on correct answers.</p>`,
  render(container, ctx) {
    container.classList.add("lab-lab-ports");
    const style = document.createElement("style");
    style.textContent = `
      .lab-lab-ports .pt-port { font-size: 3rem; font-family: monospace; font-weight: bold; text-align: center; color: var(--accent); }
      .lab-lab-ports .pt-timer { height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; }
      .lab-lab-ports .pt-timer > div { height: 100%; background: var(--good); transition: width .1s linear; }
      .lab-lab-ports .pt-timer.low > div { background: var(--bad); }
      .lab-lab-ports .pt-opts { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: .5rem; }
      .lab-lab-ports .pt-opts .btn.sel { outline: 2px solid var(--accent); }
      .lab-lab-ports .pt-opts .btn.right { background: var(--good); color: #fff; }
      .lab-lab-ports .pt-opts .btn.wrong { background: var(--bad); color: #fff; }
    `;
    container.appendChild(style);

    const PORTS = [
      [20, "FTP (data)", "TCP", "Legacy cleartext file transfer; active-mode data channel."],
      [21, "FTP (control)", "TCP", "Cleartext credentials; prefer SFTP/FTPS."],
      [22, "SSH / SFTP", "TCP", "Encrypted remote shell; heavily brute-forced when internet-facing."],
      [23, "Telnet", "TCP", "Cleartext remote shell; should never be exposed."],
      [25, "SMTP", "TCP", "Mail transfer between servers."],
      [53, "DNS", "TCP/UDP", "UDP for most queries, TCP for zone transfers and large responses."],
      [67, "DHCP (server)", "UDP", "Clients broadcast from 68 to server 67."],
      [69, "TFTP", "UDP", "Trivial FTP, no authentication; used for network boot/config."],
      [80, "HTTP", "TCP", "Cleartext web traffic."],
      [88, "Kerberos", "TCP/UDP", "Active Directory authentication; watch for Kerberoasting."],
      [110, "POP3", "TCP", "Mail retrieval (cleartext)."],
      [123, "NTP", "UDP", "Time sync; abused for amplification DDoS."],
      [135, "MS RPC (Endpoint Mapper)", "TCP", "Windows RPC; used in lateral movement."],
      [137, "NetBIOS Name Service", "UDP", "Legacy Windows name resolution."],
      [143, "IMAP", "TCP", "Mail retrieval (cleartext)."],
      [161, "SNMP", "UDP", "Device monitoring; v1/v2c use cleartext community strings."],
      [389, "LDAP", "TCP/UDP", "Directory queries (AD)."],
      [443, "HTTPS", "TCP/UDP", "TLS-protected web; UDP 443 carries HTTP/3 (QUIC)."],
      [445, "SMB", "TCP", "Windows file sharing; EternalBlue/WannaCry vector."],
      [514, "Syslog", "UDP", "Traditional log shipping (TCP 514/6514 also used)."],
      [587, "SMTP Submission", "TCP", "Authenticated mail submission from clients (STARTTLS)."],
      [636, "LDAPS", "TCP", "LDAP over TLS."],
      [993, "IMAPS", "TCP", "IMAP over TLS."],
      [995, "POP3S", "TCP", "POP3 over TLS."],
      [1433, "Microsoft SQL Server", "TCP", "Database; should not be internet-facing."],
      [1812, "RADIUS (auth)", "UDP", "Network access authentication (802.1X, VPN)."],
      [3306, "MySQL", "TCP", "Database; frequent target of credential stuffing."],
      [3389, "RDP", "TCP/UDP", "Remote Desktop; a top ransomware initial access vector."],
      [5060, "SIP", "TCP/UDP", "VoIP call signalling."],
      [5985, "WinRM (HTTP)", "TCP", "PowerShell remoting; lateral movement."],
      [8080, "HTTP alternate / proxy", "TCP", "Common for web proxies and dev servers."]
    ];
    const TRANSPORTS = ["TCP", "UDP", "TCP/UDP"];
    const ROUNDS = 15, TIME = 20;

    const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

    let deck, idx, correct, points, timer, remaining, locked, pickSvc, pickProto, log;
    const root = document.createElement("div");
    root.className = "stack";
    container.appendChild(root);

    function intro() {
      root.innerHTML = `<div class="card stack">
        <p>Ready? 15 ports, ${TIME} seconds each. Select a service and a transport, then press <b>Submit</b> (or both selections auto-submit).</p>
        <div class="row"><button class="btn primary" id="pt-start">Start</button>
        <button class="btn ghost" id="pt-ref">Show reference table</button></div>
        <div id="pt-reftable"></div>
        ${ctx.store("best") != null ? `<div class="muted">Your best: ${ctx.store("best")}%</div>` : ""}
      </div>`;
      root.querySelector("#pt-start").onclick = start;
      root.querySelector("#pt-ref").onclick = () => {
        root.querySelector("#pt-reftable").innerHTML = `<table class="table"><thead><tr><th>Port</th><th>Service</th><th>Transport</th><th>Note</th></tr></thead><tbody>
          ${PORTS.map((p) => `<tr><td class="mono">${p[0]}</td><td>${p[1]}</td><td>${p[2]}</td><td class="muted">${p[3]}</td></tr>`).join("")}</tbody></table>`;
      };
    }

    function start() {
      deck = shuffle(PORTS).slice(0, ROUNDS);
      idx = 0; correct = 0; points = 0; log = [];
      showRound();
    }

    function showRound() {
      if (idx >= ROUNDS) return finish();
      const p = deck[idx];
      locked = false; pickSvc = null; pickProto = null;
      const distract = shuffle(PORTS.filter((x) => x[1] !== p[1])).slice(0, 5).map((x) => x[1]);
      const opts = shuffle([p[1], ...distract]);
      root.innerHTML = `<div class="row" style="justify-content:space-between"><span class="tag">Round ${idx + 1} / ${ROUNDS}</span><span class="tag good">Points: ${points}</span></div>
        <div class="pt-timer" id="pt-timer"><div style="width:100%"></div></div>
        <div class="card stack">
          <div class="pt-port">${p[0]}</div>
          <div><b>Service</b></div>
          <div class="pt-opts" id="pt-svc">${opts.map((o) => `<button class="btn" data-v="${o}">${o}</button>`).join("")}</div>
          <div><b>Transport</b></div>
          <div class="pt-opts" id="pt-proto">${TRANSPORTS.map((o) => `<button class="btn" data-v="${o}">${o}</button>`).join("")}</div>
          <div id="pt-fb"></div>
        </div>`;
      root.querySelectorAll("#pt-svc .btn").forEach((b) => b.onclick = () => { if (locked) return; pickSvc = b.dataset.v; mark("#pt-svc", b); maybeSubmit(); });
      root.querySelectorAll("#pt-proto .btn").forEach((b) => b.onclick = () => { if (locked) return; pickProto = b.dataset.v; mark("#pt-proto", b); maybeSubmit(); });
      remaining = TIME * 10;
      clearInterval(timer);
      timer = setInterval(() => {
        if (!root.isConnected) { clearInterval(timer); return; }
        remaining--;
        const bar = root.querySelector("#pt-timer");
        if (bar) { bar.firstElementChild.style.width = (remaining / (TIME * 10)) * 100 + "%"; bar.classList.toggle("low", remaining < 50); }
        if (remaining <= 0) { clearInterval(timer); submit(true); }
      }, 100);
    }

    function mark(sel, btn) { root.querySelectorAll(sel + " .btn").forEach((b) => b.classList.remove("sel")); btn.classList.add("sel"); }
    function maybeSubmit() { if (pickSvc && pickProto) submit(false); }

    function submit(timeout) {
      if (locked) return;
      locked = true;
      clearInterval(timer);
      const p = deck[idx];
      const svcOk = pickSvc === p[1], protoOk = pickProto === p[2];
      const ok = svcOk && protoOk;
      if (ok) { correct++; points += 100 + Math.round(remaining / 2); }
      else if (svcOk) points += 40;
      log.push({ p, pickSvc, pickProto, ok });
      root.querySelectorAll("#pt-svc .btn").forEach((b) => { if (b.dataset.v === p[1]) b.classList.add("right"); else if (b.dataset.v === pickSvc) b.classList.add("wrong"); });
      root.querySelectorAll("#pt-proto .btn").forEach((b) => { if (b.dataset.v === p[2]) b.classList.add("right"); else if (b.dataset.v === pickProto) b.classList.add("wrong"); });
      root.querySelector("#pt-fb").innerHTML = `<div class="alert ${ok ? "good" : "bad"}">${timeout ? "Time's up! " : ""}${ok ? "Correct." : svcOk ? "Right service, wrong transport (partial points)." : "Incorrect."}
        Port <b>${p[0]}</b> = <b>${p[1]}</b> over <b>${p[2]}</b>. ${p[3]}</div>
        <button class="btn primary" id="pt-next">${idx + 1 >= ROUNDS ? "See results" : "Next"}</button>`;
      root.querySelector("#pt-next").onclick = () => { idx++; showRound(); };
    }

    function finish() {
      const pct = Math.round((correct / ROUNDS) * 100);
      const best = ctx.store("best");
      if (best == null || pct > best) ctx.store("best", pct);
      root.innerHTML = `<div class="card stack">
        <h3>Results</h3>
        <div class="alert ${pct >= 70 ? "good" : "info"}">${correct} / ${ROUNDS} fully correct (${pct}%), ${points} points.</div>
        <table class="table"><thead><tr><th>Port</th><th>Answer</th><th>You picked</th><th></th></tr></thead><tbody>
        ${log.map((l) => `<tr><td class="mono">${l.p[0]}</td><td>${l.p[1]} (${l.p[2]})</td><td>${l.pickSvc || "&mdash;"} (${l.pickProto || "&mdash;"})</td><td>${l.ok ? `<span class="tag good">OK</span>` : `<span class="tag bad">miss</span>`}</td></tr>`).join("")}
        </tbody></table>
        <div><button class="btn" id="pt-again">Play again</button></div></div>`;
      root.querySelector("#pt-again").onclick = start;
      ctx.complete(pct);
    }

    intro();
  }
});
