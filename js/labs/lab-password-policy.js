window.CP = window.CP || {};
CP.labs = CP.labs || [];
CP.labs.push({
  id: "lab-password-policy",
  title: "Password Policy Audit (NIST SP 800-63B)",
  module: "p1-m4",
  difficulty: "Beginner",
  minutes: 20,
  skills: ["NIST SP 800-63B-4", "password policy", "MFA", "entropy estimation"],
  briefing: `<p><b>Scenario:</b> The IT director at Northwind Example Corp hands you the current password policy, written in 2012:
  "8 characters, one uppercase, one number, one symbol, change every 60 days, lock after 3 tries, security question for resets".
  Auditors now want alignment with <b>NIST SP 800-63B Revision 4</b> (Digital Identity Guidelines, Authentication and Authenticator
  Management, finalized in 2025). Your job is to redesign the policy and justify every setting.</p>
  <p><b>Objectives:</b></p>
  <ul>
    <li>Toggle policy settings and watch a live compliance score with explanations for each control.</li>
    <li>Understand why modern guidance favours <b>length over complexity</b>, <b>no forced periodic rotation</b>, <b>blocklist screening</b> and <b>MFA</b>.</li>
    <li>Use the entropy estimator to compare "P@ssw0rd1!" with a long passphrase.</li>
  </ul>
  <p>Reach a compliance score of at least 90% and press <b>Submit policy</b> to complete the lab.</p>`,
  render(container, ctx) {
    container.classList.add("lab-lab-password-policy");
    const style = document.createElement("style");
    style.textContent = `
      .lab-lab-password-policy .pp-meter { height: 14px; background: var(--border); border-radius: 7px; overflow: hidden; }
      .lab-lab-password-policy .pp-meter > div { height: 100%; transition: width .3s, background .3s; }
      .lab-lab-password-policy .pp-row { display: flex; justify-content: space-between; align-items: center; gap: .75rem; padding: .45rem 0; border-bottom: 1px solid var(--border); flex-wrap: wrap; }
      .lab-lab-password-policy .pp-row label { flex: 1 1 260px; }
      .lab-lab-password-policy .pp-findings li { margin-bottom: .4rem; }
      .lab-lab-password-policy .pp-big { font-size: 2rem; font-weight: bold; }
    `;
    container.appendChild(style);
    const esc = ctx.escape;

    const DEFAULT = { minLen: 8, maxLen: 16, composition: true, rotation: 60, blocklist: false, hints: false, kba: true, paste: false, mfa: false, rateLimit: true, lockout3: true, truncate: false, showPw: false, unicode: false, storage: "sha1" };
    const RECOMMENDED = { minLen: 15, maxLen: 64, composition: false, rotation: 0, blocklist: true, hints: false, kba: false, paste: true, mfa: true, rateLimit: true, lockout3: false, truncate: false, showPw: true, unicode: true, storage: "kdf" };
    let pol = Object.assign({}, DEFAULT, ctx.store("policy") || {});

    function evaluate(p) {
      const f = [];
      const add = (ok, w, title, why) => f.push({ ok, w, title, why });
      const minNeeded = p.mfa ? 8 : 15;
      add(p.minLen >= minNeeded, 15, `Minimum length ${p.minLen}`, p.mfa
        ? "With MFA, Rev 4 requires at least 8 characters for a password used as one factor; 15 is still a good choice. Length is the single biggest driver of guessing resistance."
        : "Rev 4 requires a minimum of 15 characters when the password is the only authentication factor (8 if it is part of MFA). Length beats complexity.");
      add(p.maxLen >= 64, 8, `Maximum length ${p.maxLen}`, "Verifiers SHOULD permit a maximum of at least 64 characters so passphrases and password-manager output fit.");
      add(!p.composition, 12, p.composition ? "Composition rules required" : "No composition rules", "Rev 4: verifiers SHALL NOT impose composition rules (e.g. mixtures of character types). They push users to predictable patterns like Summer2026!");
      add(p.rotation === 0, 12, p.rotation ? `Forced change every ${p.rotation} days` : "No periodic rotation", "Rev 4: verifiers SHALL NOT require periodic password changes. Force a change only on evidence of compromise. Rotation leads to Password1 -> Password2.");
      add(p.blocklist, 12, p.blocklist ? "Blocklist screening on" : "No blocklist screening", "Verifiers SHALL compare new passwords against a blocklist of commonly used, expected or compromised values (breach corpuses, dictionary words, the service name, the username).");
      add(!p.hints, 5, p.hints ? "Password hints allowed" : "No password hints", "Verifiers SHALL NOT permit storage of hints accessible to unauthenticated users.");
      add(!p.kba, 8, p.kba ? "Security questions used" : "No knowledge-based questions", "Verifiers SHALL NOT prompt for knowledge-based authentication (\"mother's maiden name\") when choosing passwords or for recovery. Answers are often public on social media.");
      add(p.paste, 5, p.paste ? "Paste / password managers allowed" : "Paste blocked", "Guidance is to allow password managers and autofill (including paste); blocking paste discourages long, unique passwords.");
      add(p.mfa, 12, p.mfa ? "MFA required" : "No MFA", "Passwords alone reach only AAL1. AAL2 needs two factors, and phishing-resistant authenticators (FIDO2/passkeys, PIV) are strongly preferred.");
      add(p.rateLimit, 5, p.rateLimit ? "Failed-attempt rate limiting" : "No rate limiting", "Verifiers SHALL implement rate limiting of failed attempts (NIST allows up to 100 consecutive failures before lockout).");
      add(!p.lockout3, 2, p.lockout3 ? "Hard lockout after 3 failures" : "No aggressive lockout", "A 3-strike hard lockout is not required by NIST and invites denial-of-service and help-desk load. Prefer throttling, CAPTCHAs or risk-based checks.");
      add(!p.truncate, 4, p.truncate ? "Passwords truncated" : "No truncation", "Verifiers SHALL NOT truncate passwords; the entire password must be verified.");
      add(p.showPw, 2, p.showPw ? "Show-password option" : "No show-password option", "Offering an option to display the password while typing reduces typos and encourages longer passwords.");
      add(p.unicode, 3, p.unicode ? "All printable ASCII, space and Unicode accepted" : "Restricted character set", "Verifiers SHOULD accept all printing ASCII characters, the space character and Unicode.");
      add(p.storage === "kdf", 10, { sha1: "Stored as unsalted SHA-1", md5: "Stored as MD5", plain: "Stored reversibly / plaintext", kdf: "Salted, approved password-hashing function" }[p.storage],
        "Passwords SHALL be stored salted and hashed with an approved, deliberately slow key-derivation function (e.g. PBKDF2 with high iteration count, or a memory-hard function like Argon2id/scrypt). Fast hashes like MD5/SHA-1 are cracked at billions of guesses per second.");
      const total = f.reduce((s, x) => s + x.w, 0), got = f.filter((x) => x.ok).reduce((s, x) => s + x.w, 0);
      return { findings: f, score: Math.round((got / total) * 100) };
    }

    const root = document.createElement("div");
    root.className = "stack";
    container.appendChild(root);
    root.innerHTML = `
      <div class="grid-2">
        <div class="card stack">
          <h3>Policy settings</h3>
          <div class="pp-row"><label for="pp-min">Minimum length</label><input class="input" type="number" min="4" max="64" id="pp-min" style="width:90px"></div>
          <div class="pp-row"><label for="pp-max">Maximum length allowed</label><input class="input" type="number" min="8" max="256" id="pp-max" style="width:90px"></div>
          <div class="pp-row"><label for="pp-rot">Forced rotation (days, 0 = never)</label><select class="select" id="pp-rot"><option value="0">Never (change on compromise)</option><option value="30">30</option><option value="60">60</option><option value="90">90</option><option value="365">365</option></select></div>
          <div class="pp-row"><label for="pp-sto">Password storage</label><select class="select" id="pp-sto"><option value="plain">Reversible encryption / plaintext</option><option value="md5">MD5</option><option value="sha1">Unsalted SHA-1</option><option value="kdf">Salted PBKDF2 / Argon2id / scrypt</option></select></div>
          ${[["composition", "Require upper + lower + digit + symbol"], ["blocklist", "Screen against breached/common password blocklist"], ["mfa", "Require multi-factor authentication"], ["hints", "Allow password hints"], ["kba", "Use security questions for reset"], ["paste", "Allow paste / password managers"], ["rateLimit", "Rate-limit failed attempts"], ["lockout3", "Hard lockout after 3 failures"], ["truncate", "Truncate passwords longer than max"], ["showPw", "Offer \"show password\" toggle"], ["unicode", "Accept spaces and Unicode characters"]]
            .map(([k, l]) => `<div class="pp-row"><label for="pp-${k}">${l}</label><input type="checkbox" id="pp-${k}" data-k="${k}"></div>`).join("")}
          <div class="row"><button class="btn ghost" id="pp-reset">Reset to 2012 policy</button></div>
        </div>
        <div class="card stack">
          <h3>Compliance score</h3>
          <div class="pp-big" id="pp-score"></div>
          <div class="pp-meter"><div id="pp-bar"></div></div>
          <ul class="pp-findings" id="pp-find"></ul>
          <div class="row"><button class="btn primary" id="pp-submit">Submit policy</button></div>
          <div id="pp-subfb"></div>
        </div>
      </div>
      <div class="card stack">
        <h3>Password entropy estimator</h3>
        <p class="muted">A naive estimate: length &times; log<sub>2</sub>(character pool), with penalties for blocklisted values, dictionary words, sequences, repeats and years.
        Real crackers use wordlists and rules, so "complex" short passwords score far lower than the naive math suggests. Do not type a real password.</p>
        <input class="input mono" id="pp-pw" placeholder="Try: P@ssw0rd1!   vs   maple-otter-cinema-thunder" autocomplete="off">
        <div id="pp-ent"></div>
      </div>`;

    const $ = (s) => root.querySelector(s);
    function load() {
      $("#pp-min").value = pol.minLen; $("#pp-max").value = pol.maxLen; $("#pp-rot").value = String(pol.rotation); $("#pp-sto").value = pol.storage;
      root.querySelectorAll("input[data-k]").forEach((c) => c.checked = !!pol[c.dataset.k]);
    }
    function update() {
      ctx.store("policy", pol);
      const r = evaluate(pol);
      $("#pp-score").textContent = r.score + "%";
      const bar = $("#pp-bar");
      bar.style.width = r.score + "%";
      bar.style.background = r.score >= 90 ? "var(--good)" : r.score >= 60 ? "var(--warn)" : "var(--bad)";
      $("#pp-find").innerHTML = r.findings.sort((a, b) => a.ok - b.ok || b.w - a.w)
        .map((x) => `<li><span class="tag ${x.ok ? "good" : "bad"}">${x.ok ? "PASS" : "FAIL"}</span> <b>${esc(x.title)}</b><br><span class="muted">${esc(x.why)}</span></li>`).join("");
      return r;
    }
    $("#pp-min").addEventListener("input", (e) => { pol.minLen = Math.max(1, parseInt(e.target.value, 10) || 0); update(); });
    $("#pp-max").addEventListener("input", (e) => { pol.maxLen = Math.max(1, parseInt(e.target.value, 10) || 0); update(); });
    $("#pp-rot").addEventListener("change", (e) => { pol.rotation = +e.target.value; update(); });
    $("#pp-sto").addEventListener("change", (e) => { pol.storage = e.target.value; update(); });
    root.querySelectorAll("input[data-k]").forEach((c) => c.addEventListener("change", () => { pol[c.dataset.k] = c.checked; update(); }));
    $("#pp-reset").onclick = () => { pol = Object.assign({}, DEFAULT); load(); update(); };
    $("#pp-submit").onclick = () => {
      const r = update();
      if (r.score >= 90) {
        $("#pp-subfb").innerHTML = `<div class="alert good">Policy accepted at ${r.score}% alignment. Good work: long passwords, blocklists, no rotation or composition rules, MFA, and slow salted hashing are the core of modern guidance.</div>`;
        ctx.complete(r.score);
      } else {
        $("#pp-subfb").innerHTML = `<div class="alert bad">At ${r.score}% the auditors will push back. Fix the FAIL items at the top of the list (highest weight first) and resubmit.</div>`;
      }
    };

    const COMMON = ["password", "123456", "12345678", "qwerty", "letmein", "welcome", "admin", "iloveyou", "monkey", "dragon", "football", "baseball", "sunshine", "princess", "master", "shadow", "superman", "trustno1", "abc123", "passw0rd", "p@ssw0rd", "p@ssword", "winter", "summer", "spring", "autumn", "company", "northwind", "changeme", "secret", "login"];
    const WORDS = ["love", "pass", "word", "admin", "user", "test", "hello", "money", "secret", "dragon", "monkey", "summer", "winter", "spring", "fall", "football", "soccer", "qwerty", "welcome", "star", "baby", "angel", "jesus", "god"];
    function deleet(s) { return s.toLowerCase().replace(/@/g, "a").replace(/0/g, "o").replace(/1/g, "i").replace(/3/g, "e").replace(/\$/g, "s").replace(/5/g, "s").replace(/7/g, "t").replace(/!/g, "i"); }
    function estimate(pw) {
      if (!pw) return null;
      let pool = 0;
      if (/[a-z]/.test(pw)) pool += 26;
      if (/[A-Z]/.test(pw)) pool += 26;
      if (/[0-9]/.test(pw)) pool += 10;
      if (/[^a-zA-Z0-9]/.test(pw)) pool += 33;
      let bits = pw.length * Math.log2(pool || 1);
      const notes = [];
      const base = deleet(pw).replace(/[^a-z]/g, "");
      if (COMMON.some((c) => deleet(pw).replace(/[^a-z0-9]/g, "").startsWith(deleet(c)) || base === deleet(c).replace(/[^a-z]/g, ""))) {
        bits = Math.min(bits, 10); notes.push("Matches/derives from a common blocklisted password. Leetspeak substitutions (@ for a, 0 for o) are in every cracking ruleset.");
      }
      WORDS.forEach((w) => { if (deleet(pw).includes(w) && bits > 10) { bits -= 8; notes.push(`Contains dictionary word "${w}".`); } });
      if (/(19|20)\d\d/.test(pw)) { bits -= 6; notes.push("Contains a year (very common pattern)."); }
      if (/(.)\1\1/.test(pw)) { bits -= 6; notes.push("Repeated characters."); }
      if (/(abc|bcd|cde|123|234|345|456|567|678|789|qwe|wer|asd)/i.test(pw)) { bits -= 6; notes.push("Keyboard or alphabetic sequence."); }
      if (/^[A-Z][a-z]+\d+[^a-zA-Z0-9]?$/.test(pw)) { bits -= 8; notes.push("Classic Capital-word-digits-symbol shape that composition rules produce."); }
      const words = pw.split(/[\s\-_.]+/).filter((w) => /^[a-zA-Z]{3,}$/.test(w));
      if (words.length >= 4) notes.push(`Looks like a ${words.length}-word passphrase. If the words are chosen randomly from a 7,776-word list that is about ${(words.length * 12.9).toFixed(0)} bits - and easy to remember.`);
      bits = Math.max(0, bits);
      const guessesPerSec = 1e10; // offline attack on a fast hash with GPUs
      const secs = Math.pow(2, bits) / 2 / guessesPerSec;
      return { bits, pool, notes, secs };
    }
    function human(s) {
      if (s < 1) return "less than a second";
      const u = [["years", 31557600], ["days", 86400], ["hours", 3600], ["minutes", 60], ["seconds", 1]];
      for (const [n, v] of u) if (s >= v) { const x = s / v; return x > 1e9 ? "billions of " + n : (x > 1e6 ? (x / 1e6).toFixed(1) + " million " : Math.round(x).toLocaleString() + " ") + n; }
      return "seconds";
    }
    $("#pp-pw").addEventListener("input", (e) => {
      const r = estimate(e.target.value);
      if (!r) { $("#pp-ent").innerHTML = ""; return; }
      const cls = r.bits >= 70 ? "good" : r.bits >= 45 ? "info" : "bad";
      $("#pp-ent").innerHTML = `<div class="alert ${cls}"><b>~${r.bits.toFixed(0)} bits</b> (length ${e.target.value.length}, pool ${r.pool}). Time to crack offline at 10 billion guesses/s against a fast unsalted hash: <b>${human(r.secs)}</b>.
        ${r.notes.length ? `<ul>${r.notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>` : ""}</div>`;
    });

    load();
    update();
    void RECOMMENDED;
  }
});
