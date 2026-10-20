window.CP = window.CP || {};
CP.labs = CP.labs || [];
CP.labs.push({
  id: "lab-subnet",
  title: "Subnetting Drills",
  module: "p0-m2",
  difficulty: "Beginner",
  minutes: 20,
  skills: ["IPv4 subnetting", "CIDR notation", "network/broadcast addresses", "usable host math"],
  briefing: `<p><b>Scenario:</b> You have just joined the network operations team at a mid-sized company. Before you are trusted
  to write firewall rules or read SIEM alerts, your lead wants proof you can carve up IPv4 address space quickly and correctly.
  SOC analysts subnet constantly: "Is 10.20.31.200 inside the 10.20.0.0/20 server range?" is a question you will answer weekly.</p>
  <p><b>Objectives:</b></p>
  <ul>
    <li>Convert a CIDR prefix (e.g. <code>/26</code>) to a dotted-decimal subnet mask.</li>
    <li>Find the network address, broadcast address, first and last usable host for any address/prefix.</li>
    <li>Calculate the number of usable hosts (2<sup>host bits</sup> &minus; 2).</li>
  </ul>
  <p>You will get <b>10 randomized rounds</b>. Each round asks one question; you get instant feedback and a worked solution.
  Tip: find the "interesting octet" (where the mask is not 255 or 0), compute the block size (256 &minus; mask value), and find the
  multiple of the block size at or below the address.</p>`,
  render(container, ctx) {
    container.classList.add("lab-lab-subnet");
    const style = document.createElement("style");
    style.textContent = `
      .lab-lab-subnet .sn-q { font-size: 1.15rem; }
      .lab-lab-subnet .sn-bin { font-family: monospace; white-space: pre; overflow-x: auto; background: var(--code-bg); padding: .6rem; border-radius: 6px; border: 1px solid var(--border); }
      .lab-lab-subnet .sn-progress { height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; }
      .lab-lab-subnet .sn-progress > div { height: 100%; background: var(--accent); transition: width .3s; }
      .lab-lab-subnet .sn-net { color: var(--accent); font-weight: bold; }
      .lab-lab-subnet .sn-host { color: var(--warn); }
    `;
    container.appendChild(style);

    const ROUNDS = 10;
    const ipToInt = (a) => ((a[0] << 24) >>> 0) + (a[1] << 16) + (a[2] << 8) + a[3];
    const intToIp = (n) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
    const maskInt = (p) => (p === 0 ? 0 : (0xFFFFFFFF << (32 - p)) >>> 0);
    const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
    const bin8 = (n) => n.toString(2).padStart(8, "0");
    const toBin = (n) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].map(bin8).join(".");

    const TYPES = [
      { key: "network", label: "network address" },
      { key: "broadcast", label: "broadcast address" },
      { key: "first", label: "first usable host" },
      { key: "last", label: "last usable host" },
      { key: "hosts", label: "number of usable hosts" },
      { key: "mask", label: "subnet mask (dotted decimal)" }
    ];

    function makeRound(i) {
      const type = TYPES[i % TYPES.length];
      let prefix = rnd(17, 30);
      if (type.key === "mask") prefix = rnd(8, 30);
      const firstOct = [10, 172, 192][rnd(0, 2)];
      const ip = firstOct === 10 ? [10, rnd(0, 255), rnd(0, 255), rnd(1, 254)]
        : firstOct === 172 ? [172, rnd(16, 31), rnd(0, 255), rnd(1, 254)]
        : [192, 168, rnd(0, 255), rnd(1, 254)];
      const ipn = ipToInt(ip);
      const m = maskInt(prefix);
      const net = (ipn & m) >>> 0;
      const bc = (net | (~m >>> 0)) >>> 0;
      const hosts = Math.pow(2, 32 - prefix) - 2;
      return {
        type, prefix, ip: ip.join("."), ipn, m, net, bc, hosts,
        answers: {
          network: intToIp(net), broadcast: intToIp(bc), first: intToIp(net + 1), last: intToIp(bc - 1),
          hosts: String(hosts), mask: intToIp(m)
        }
      };
    }

    function explain(r) {
      const maskStr = intToIp(r.m);
      const octs = maskStr.split(".").map(Number);
      let idx = octs.findIndex((o) => o !== 255);
      if (idx === -1) idx = 3;
      const block = 256 - octs[idx];
      const ipOct = r.ip.split(".").map(Number)[idx];
      const netOct = Math.floor(ipOct / block) * block;
      const hostBits = 32 - r.prefix;
      const bits = toBin(r.ipn);
      let colored = "";
      let count = 0;
      for (const ch of bits) {
        if (ch === ".") { colored += "."; continue; }
        colored += count < r.prefix ? `<span class="sn-net">${ch}</span>` : `<span class="sn-host">${ch}</span>`;
        count++;
      }
      return `<div class="stack">
        <div><b>Worked solution</b> for <code>${r.ip}/${r.prefix}</code>:</div>
        <ol>
          <li>/${r.prefix} means ${r.prefix} network bits and ${hostBits} host bits &rarr; mask <code>${maskStr}</code>.</li>
          <li>Interesting octet: octet ${idx + 1} (mask value ${octs[idx]}). Block size = 256 &minus; ${octs[idx]} = <b>${block}</b>.</li>
          <li>Address octet ${idx + 1} is ${ipOct}; the largest multiple of ${block} not above it is <b>${netOct}</b>. Later octets become 0 &rarr; network <code>${r.answers.network}</code>.</li>
          <li>Broadcast = next network &minus; 1 &rarr; <code>${r.answers.broadcast}</code>.</li>
          <li>First host = network + 1 = <code>${r.answers.first}</code>; last host = broadcast &minus; 1 = <code>${r.answers.last}</code>.</li>
          <li>Usable hosts = 2<sup>${hostBits}</sup> &minus; 2 = <b>${r.answers.hosts}</b> (minus the network and broadcast addresses).</li>
        </ol>
        <div class="sn-bin">${colored}   <span class="sn-net">network bits</span> | <span class="sn-host">host bits</span></div>
      </div>`;
    }

    let round = 0, score = 0, cur = null, answered = false;
    const rounds = Array.from({ length: ROUNDS }, (_, i) => makeRound(i)).sort(() => Math.random() - 0.5);

    const root = document.createElement("div");
    root.className = "stack";
    container.appendChild(root);

    function show() {
      if (round >= ROUNDS) return finish();
      cur = rounds[round];
      answered = false;
      const isMask = cur.type.key === "mask";
      root.innerHTML = `
        <div class="row" style="justify-content:space-between"><span class="tag">Round ${round + 1} / ${ROUNDS}</span><span class="tag good">Score: ${score}</span></div>
        <div class="sn-progress"><div style="width:${(round / ROUNDS) * 100}%"></div></div>
        <div class="card stack">
          <div class="sn-q">${isMask ? `What is the <b>subnet mask</b> for a <code>/${cur.prefix}</code> prefix?`
            : `Given host <code>${cur.ip}/${cur.prefix}</code>, what is the <b>${cur.type.label}</b>?`}</div>
          <div class="row">
            <input class="input mono" id="sn-ans" placeholder="${cur.type.key === "hosts" ? "e.g. 62" : "e.g. 192.168.1.0"}" autocomplete="off" style="max-width:260px">
            <button class="btn primary" id="sn-check">Check</button>
          </div>
          <div id="sn-fb"></div>
        </div>`;
      const inp = root.querySelector("#sn-ans");
      inp.focus();
      root.querySelector("#sn-check").onclick = check;
      inp.addEventListener("keydown", (e) => { if (e.key === "Enter") { answered ? next() : check(); } });
    }

    function normalize(s) { return s.trim().replace(/\s+/g, "").replace(/^\//, ""); }

    function check() {
      if (answered) return;
      const inp = root.querySelector("#sn-ans");
      const val = normalize(inp.value);
      if (!val) { root.querySelector("#sn-fb").innerHTML = `<div class="alert info">Enter an answer first.</div>`; return; }
      answered = true;
      const want = cur.answers[cur.type.key];
      let ok = val === want;
      if (cur.type.key === "hosts") ok = val.replace(/,/g, "") === want;
      if (ok) score++;
      inp.disabled = true;
      root.querySelector("#sn-check").remove();
      root.querySelector("#sn-fb").innerHTML = `
        <div class="alert ${ok ? "good" : "bad"}">${ok ? "Correct!" : `Not quite. You entered <code>${ctx.escape(val)}</code>; the answer is <code>${want}</code>.`}</div>
        ${explain(cur)}
        <div><button class="btn primary" id="sn-next">${round + 1 >= ROUNDS ? "Finish" : "Next round"}</button></div>`;
      root.querySelector("#sn-next").onclick = next;
      root.querySelector("#sn-next").focus();
    }

    function next() { round++; show(); }

    function finish() {
      const pct = Math.round((score / ROUNDS) * 100);
      const best = ctx.store("best") || 0;
      if (pct > best) ctx.store("best", pct);
      root.innerHTML = `<div class="card stack">
        <h3>Drill complete</h3>
        <div class="alert ${pct >= 70 ? "good" : "warn"}">You scored <b>${score} / ${ROUNDS}</b> (${pct}%). Best: ${Math.max(pct, best)}%.</div>
        <p class="muted">${pct >= 70 ? "Solid work. Speed comes with repetition; try for 10/10 in under five minutes." : "Review the block-size method in the worked solutions and try another set."}</p>
        <div><button class="btn" id="sn-again">New set of 10</button></div>
      </div>`;
      ctx.complete(pct);
      root.querySelector("#sn-again").onclick = () => {
        round = 0; score = 0;
        rounds.splice(0, rounds.length, ...Array.from({ length: ROUNDS }, (_, i) => makeRound(i)).sort(() => Math.random() - 0.5));
        show();
      };
    }

    show();
  }
});
