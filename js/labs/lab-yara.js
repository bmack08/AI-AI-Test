window.CP = window.CP || {};
CP.labs = CP.labs || [];
CP.labs.push({
  id: "lab-yara",
  title: "Write a YARA Detection Rule",
  module: "p3-m4",
  difficulty: "Advanced",
  minutes: 40,
  skills: ["YARA rule syntax", "string & hex signatures", "rule conditions", "avoiding false positives"],
  briefing: `<p><b>Scenario:</b> Malware analysis has produced three related samples from a campaign and a set of clean files that triggered false
  positives on a colleague's sloppy rule. Your job is to write a <b>YARA rule</b> that matches the three malicious samples and <b>none</b> of the
  clean ones. The lab includes a mini YARA engine that evaluates your rule live.</p>
  <p><b>Objectives:</b></p>
  <ul>
    <li>Define text strings (<code>$a = "text"</code>) with modifiers <code>nocase</code> and <code>wide</code>, and hex strings (<code>$h = { 4D 5A ?? 90 }</code> with <code>??</code> wildcards).</li>
    <li>Write conditions: <code>any of them</code>, <code>all of them</code>, <code>N of them</code>, <code>$a and $b</code>, <code>$a or $b</code>,
    <code>filesize &lt; N</code>, and <code>uint16(0) == 0x5A4D</code> (the "MZ" PE magic).</li>
    <li>Iterate until you match exactly the 3 malicious samples with zero false positives.</li>
  </ul>
  <div class="callout tip">Good rules combine a format anchor (magic/filesize) with two or more content strings so a single coincidental string does not cause a hit.</div>`,
  render(container, ctx) {
    container.classList.add("lab-lab-yara");
    const style = document.createElement("style");
    style.textContent = `
      .lab-lab-yara .ya-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
      @media (max-width: 820px) { .lab-lab-yara .ya-cols { grid-template-columns: 1fr; } }
      .lab-lab-yara textarea.ya-rule { width: 100%; min-height: 240px; font-family: monospace; font-size: .85rem; white-space: pre; }
      .lab-lab-yara .ya-file { border: 1px solid var(--border); border-radius: 8px; padding: .5rem .7rem; margin-bottom: .5rem; }
      .lab-lab-yara .ya-file.hit { border-color: var(--good); box-shadow: 0 0 0 1px var(--good); }
      .lab-lab-yara .ya-file.miss { opacity: .75; }
      .lab-lab-yara .ya-file .ya-hex { font-family: monospace; font-size: .74rem; white-space: pre-wrap; word-break: break-all; color: var(--muted); max-height: 110px; overflow: auto; }
      .lab-lab-yara .ya-badge { font-family: monospace; }
    `;
    container.appendChild(style);
    const esc = ctx.escape;

    // ---------- sample files ----------
    // Each file is a byte array. We build from strings + explicit byte prefixes.
    function bytes(prefix, text) { return prefix.concat(Array.from(text).map((c) => c.charCodeAt(0) & 255)); }
    // wide (UTF-16LE) encoding helper
    function wideOf(text) { const out = []; for (const c of text) { out.push(c.charCodeAt(0) & 255, 0); } return out; }
    const MZ = [0x4D, 0x5A, 0x90, 0x00];
    const ELF = [0x7F, 0x45, 0x4C, 0x46];

    const FILES = [
      { name: "sample_01.bin", mal: true, desc: "Dropper (PE)", bytes: MZ.concat(bytes([0x03, 0x00], "This program cannot be run in DOS mode."), bytes([0x00], "ExampleLckr config: beacon=cdn-sync.example"), wideOf("InstallService")) },
      { name: "sample_02.bin", mal: true, desc: "Loader (PE)", bytes: MZ.concat(bytes([0x50, 0x45, 0x00, 0x00], "cmd /c beacon=cdn-sync.example"), bytes([0x00], "ExampleLckr"), wideOf("InstallService runonce")) },
      { name: "sample_03.bin", mal: true, desc: "Payload (PE)", bytes: MZ.concat(bytes([0x11, 0x22], "harmless looking header"), bytes([0x00], "beacon=cdn-sync.example / ExampleLckr mutex"), wideOf("InstallService")) },
      { name: "clean_notes.txt", mal: false, desc: "User text file", bytes: bytes([], "Meeting notes: discuss the new install service process and CDN sync schedule. Nothing to see here.") },
      { name: "clean_app.bin", mal: false, desc: "Legit PE installer", bytes: MZ.concat(bytes([0x03, 0x00], "This program cannot be run in DOS mode."), wideOf("InstallService"), bytes([0x00], "Acme Setup 3.2")) },
      { name: "clean_elf.bin", mal: false, desc: "Linux ELF binary", bytes: ELF.concat(bytes([0x01, 0x01], "beacon=cdn-sync.example mentioned in a comment"), bytes([0x00], "ExampleLckr string present but not a PE")) },
      { name: "clean_config.bin", mal: false, desc: "Config blob (PE)", bytes: MZ.concat(bytes([0x00], "cdn-sync.example"), bytes(new Array(400).fill(0x41), "padding")) },
      { name: "clean_doc.txt", mal: false, desc: "Doc mentioning keywords", bytes: bytes([], "The lab sample ExampleLckr and beacon=cdn-sync.example are discussed here as IOCs, but this is just a report.") }
    ];
    FILES.forEach((f) => { f.data = Uint8Array.from(f.bytes); f.size = f.data.length; });
    const toHexDump = (data) => {
      let s = "";
      for (let i = 0; i < Math.min(data.length, 96); i += 16) {
        const row = Array.from(data.slice(i, i + 16));
        s += i.toString(16).padStart(4, "0") + "  " + row.map((b) => b.toString(16).padStart(2, "0")).join(" ").padEnd(47) + "  " + row.map((b) => (b >= 32 && b < 127) ? String.fromCharCode(b) : ".").join("") + "\n";
      }
      if (data.length > 96) s += "... (" + data.length + " bytes total)\n";
      return s;
    };

    // ---------- YARA mini engine ----------
    function parseRule(src) {
      const m = src.match(/rule\s+([A-Za-z_]\w*)\s*(?::[^\{]*)?\{([\s\S]*)\}\s*$/);
      if (!m) throw new Error('Expected: rule Name { ... }');
      const name = m[1];
      const body = m[2];
      const strings = {};
      const sm = body.match(/strings\s*:([\s\S]*?)(?:condition\s*:)/i);
      const strSec = sm ? sm[1] : "";
      const condMatch = body.match(/condition\s*:([\s\S]*)$/i);
      if (!condMatch) throw new Error('Rule needs a "condition:" section');
      const cond = condMatch[1].trim();
      // parse string definitions
      const lineRe = /\$([A-Za-z_]\w*|\*?)\s*=\s*(.+)$/;
      strSec.split("\n").forEach((raw) => {
        const line = raw.trim();
        if (!line) return;
        const dm = line.match(/^\$(\w+)\s*=\s*([\s\S]+)$/);
        if (!dm) throw new Error('Cannot parse string definition: "' + line + '"');
        const id = "$" + dm[1];
        let rest = dm[2].trim();
        if (rest.startsWith('"')) {
          const q = rest.match(/^"((?:[^"\\]|\\.)*)"(.*)$/);
          if (!q) throw new Error("Unterminated string literal for " + id);
          const text = q[1].replace(/\\"/g, '"').replace(/\\\\/g, "\\").replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\r/g, "\r");
          const mods = q[2].trim().split(/\s+/).filter(Boolean);
          strings[id] = { kind: "text", text, nocase: mods.includes("nocase"), wide: mods.includes("wide"), ascii: mods.includes("ascii") || !mods.includes("wide") };
        } else if (rest.startsWith("{")) {
          const h = rest.match(/^\{([^}]*)\}/);
          if (!h) throw new Error("Unterminated hex string for " + id);
          const toks = h[1].trim().split(/\s+/).filter(Boolean);
          const pat = toks.map((tk) => {
            if (tk === "??") return { any: true };
            if (/^[0-9a-fA-F]{2}$/.test(tk)) return { b: parseInt(tk, 16) };
            if (/^[0-9a-fA-F?]{2}$/.test(tk)) return { nib: tk };
            throw new Error('Invalid hex token "' + tk + '" in ' + id + ' (use byte pairs like 4D or wildcard ??)');
          });
          strings[id] = { kind: "hex", pat };
        } else if (rest.startsWith("/")) {
          throw new Error("This mini-engine does not support regex strings; use text or hex strings.");
        } else {
          throw new Error('String ' + id + ' must be "text", { hex } ');
        }
      });
      return { name, strings, cond };
    }

    function textMatch(data, s) {
      const encs = [];
      if (s.ascii) encs.push(Array.from(s.text).map((c) => c.charCodeAt(0) & 255));
      if (s.wide) { const w = []; for (const c of s.text) w.push(c.charCodeAt(0) & 255, 0); encs.push(w); }
      const hay = s.nocase ? data.map((b) => (b >= 65 && b <= 90) ? b + 32 : b) : data;
      return encs.some((seq) => {
        const needle = s.nocase ? seq.map((b) => (b >= 65 && b <= 90) ? b + 32 : b) : seq;
        return indexOfSeq(hay, needle, (a, b) => a === b) >= 0;
      });
    }
    function hexMatch(data, s) {
      return indexOfSeq(data, s.pat, (byte, tok) => {
        if (tok.any) return true;
        if (tok.b != null) return byte === tok.b;
        if (tok.nib) { const hi = tok.nib[0], lo = tok.nib[1]; const bh = (byte >> 4).toString(16), bl = (byte & 15).toString(16); return (hi === "?" || hi.toLowerCase() === bh) && (lo === "?" || lo.toLowerCase() === bl); }
        return false;
      }) >= 0;
    }
    function indexOfSeq(hay, needle, eq) {
      if (!needle.length) return -1;
      for (let i = 0; i + needle.length <= hay.length; i++) {
        let ok = true;
        for (let j = 0; j < needle.length; j++) { if (!eq(hay[i + j], needle[j])) { ok = false; break; } }
        if (ok) return i;
      }
      return -1;
    }

    function evalFile(rule, file) {
      const data = Array.from(file.data);
      const hits = {};
      for (const id in rule.strings) {
        const s = rule.strings[id];
        hits[id] = s.kind === "text" ? textMatch(data, s) : hexMatch(data, s);
      }
      const ctxEval = {
        filesize: file.size,
        uint8: (o) => data[o] || 0,
        uint16: (o) => (data[o] || 0) | ((data[o + 1] || 0) << 8),
        uint32: (o) => ((data[o] || 0) | ((data[o + 1] || 0) << 8) | ((data[o + 2] || 0) << 16) | ((data[o + 3] || 0) << 24)) >>> 0
      };
      return evalCond(rule.cond, hits, ctxEval);
    }

    // Recursive-descent evaluator for the supported condition grammar.
    function evalCond(src, hits, c) {
      const ids = Object.keys(hits);
      const toks = tokenizeCond(src);
      let pos = 0;
      const peek = () => toks[pos], eat = () => toks[pos++];
      const is = (v) => peek() && peek().toLowerCase() === v;
      function parseOr() { let l = parseAnd(); while (is("or")) { eat(); const r = parseAnd(); const a = l; l = a || r; } return l; }
      function parseAnd() { let l = parseNot(); while (is("and")) { eat(); const r = parseNot(); const a = l; l = a && r; } return l; }
      function parseNot() { if (is("not")) { eat(); return !parseNot(); } return parseCmp(); }
      function parseCmp() {
        let l = parsePrimaryNumOrBool();
        if (peek() && ["==", "!=", "<", ">", "<=", ">="].includes(peek())) {
          const op = eat(); const r = parsePrimaryNumOrBool();
          switch (op) { case "==": return l === r; case "!=": return l !== r; case "<": return l < r; case ">": return l > r; case "<=": return l <= r; case ">=": return l >= r; }
        }
        return typeof l === "boolean" ? l : !!l;
      }
      function countHits(which) { const set = which === "them" ? ids : which; return set.filter((id) => hits[id]).length; }
      function parsePrimaryNumOrBool() {
        const t = peek();
        if (t === undefined) throw new Error("Unexpected end of condition");
        if (t === "(") { eat(); const v = parseOr(); if (peek() !== ")") throw new Error("Missing )"); eat(); return v; }
        const low = t.toLowerCase();
        // quantifiers: "all of them", "any of them", "N of them", "all of ($a,$b)"
        if (low === "all" || low === "any" || /^\d+$/.test(low)) {
          // could also just be a number in a comparison
          if ((low === "all" || low === "any" || /^\d+$/.test(low)) && toks[pos + 1] && toks[pos + 1].toLowerCase() === "of") {
            eat(); eat(); // quantifier + 'of'
            let set;
            const nx = peek();
            if (nx && nx.toLowerCase() === "them") { eat(); set = "them"; }
            else if (nx === "(") { eat(); set = []; while (peek() && peek() !== ")") { const id = eat(); if (id !== ",") set.push(id.startsWith("$") ? id : "$" + id); } if (peek() === ")") eat(); }
            else throw new Error('Expected "them" or (list) after "of"');
            const n = countHits(set);
            const total = set === "them" ? ids.length : set.length;
            if (low === "all") return n === total && total > 0;
            if (low === "any") return n > 0;
            return n >= parseInt(low, 10);
          }
          if (/^\d+$/.test(low)) { eat(); return parseInt(low, 10); }
        }
        if (/^0x[0-9a-f]+$/i.test(low)) { eat(); return parseInt(low, 16); }
        if (low === "filesize") { eat(); return c.filesize; }
        if (low === "true") { eat(); return true; }
        if (low === "false") { eat(); return false; }
        const fn = low.match(/^(uint8|uint16|uint32)$/);
        if (fn) { eat(); if (peek() !== "(") throw new Error("Expected ( after " + low); eat(); const off = parsePrimaryNumOrBool(); if (peek() !== ")") throw new Error("Missing ) for " + low); eat(); return c[fn[1]](off); }
        if (t.startsWith("$")) { eat(); if (!(t in hits)) throw new Error("Unknown string identifier " + t); return hits[t]; }
        // size suffixes like KB/MB not supported minimally -> error
        throw new Error('Unexpected token "' + t + '" in condition');
      }
      const result = parseOr();
      if (pos < toks.length) throw new Error('Unexpected "' + toks[pos] + '" in condition');
      return !!result;
    }
    function tokenizeCond(s) {
      const out = []; let i = 0;
      while (i < s.length) {
        const c = s[i];
        if (/\s/.test(c)) { i++; continue; }
        const two = s.slice(i, i + 2);
        if (["==", "!=", "<=", ">="].includes(two)) { out.push(two); i += 2; continue; }
        if ("()<>,".includes(c)) { out.push(c); i++; continue; }
        const m = s.slice(i).match(/^[A-Za-z0-9_$.]+/);
        if (!m) throw new Error('Unexpected character "' + c + '" in condition');
        out.push(m[0]); i += m[0].length;
      }
      return out;
    }

    // ---------- UI ----------
    const STARTER = `rule ExampleLckr_Campaign\n{\n    strings:\n        $mz = { 4D 5A ?? 00 }\n        $a  = "ExampleLckr"\n        $b  = "beacon=cdn-sync.example"\n        $w  = "InstallService" wide\n\n    condition:\n        // edit this so it matches the 3 malicious PE files only\n        uint16(0) == 0x5A4D and 2 of ($a, $b, $w)\n}`;
    const root = document.createElement("div");
    root.className = "stack";
    container.appendChild(root);
    root.innerHTML = `<div class="ya-cols">
      <div class="card stack"><h3>Your YARA rule</h3>
        <textarea class="textarea ya-rule" id="ya-rule" spellcheck="false">${esc(ctx.store("rule") || STARTER)}</textarea>
        <div class="row"><button class="btn primary" id="ya-run">Scan samples</button><button class="btn ghost" id="ya-reset">Reset</button><button class="btn ghost" id="ya-hint">Hint</button></div>
        <div id="ya-parse"></div><div id="ya-hintbox"></div>
      </div>
      <div class="card stack"><h3>Sample set (3 malicious, 5 clean)</h3><div id="ya-files"></div></div>
    </div>
    <div class="card stack"><div id="ya-score"></div></div>`;
    const $ = (s) => root.querySelector(s);

    function drawFiles(verdicts) {
      $("#ya-files").innerHTML = FILES.map((f, i) => {
        const hit = verdicts ? verdicts[i] : null;
        const cls = hit === null ? "" : hit ? "hit" : "miss";
        const badge = hit === null ? "" : hit ? `<span class="tag good ya-badge">MATCH</span>` : `<span class="tag ya-badge">no match</span>`;
        const truth = `<span class="tag ${f.mal ? "bad" : ""}">${f.mal ? "malicious" : "clean"}</span>`;
        return `<div class="ya-file ${cls}"><div class="row" style="justify-content:space-between"><b>${esc(f.name)}</b><span>${truth} ${badge}</span></div>
          <div class="muted">${esc(f.desc)} · ${f.size} bytes</div>
          <details><summary>hex</summary><div class="ya-hex">${esc(toHexDump(f.data))}</div></details></div>`;
      }).join("");
    }

    function run() {
      ctx.store("rule", $("#ya-rule").value);
      let rule;
      try { rule = parseRule($("#ya-rule").value); $("#ya-parse").innerHTML = `<div class="alert good">Parsed rule <code>${esc(rule.name)}</code> with ${Object.keys(rule.strings).length} string(s).</div>`; }
      catch (e) { $("#ya-parse").innerHTML = `<div class="alert bad">Parse/condition error: ${esc(e.message)}</div>`; drawFiles(null); return; }
      let verdicts, evalErr = null;
      try { verdicts = FILES.map((f) => evalFile(rule, f)); }
      catch (e) { evalErr = e.message; }
      if (evalErr) { $("#ya-parse").innerHTML += `<div class="alert bad">Condition evaluation error: ${esc(evalErr)}</div>`; drawFiles(null); return; }
      drawFiles(verdicts);
      let tp = 0, fp = 0, fn = 0, tn = 0;
      FILES.forEach((f, i) => { if (f.mal && verdicts[i]) tp++; else if (f.mal && !verdicts[i]) fn++; else if (!f.mal && verdicts[i]) fp++; else tn++; });
      const perfect = tp === 3 && fp === 0;
      const pct = Math.round((tp * 2 + tn) / (3 * 2 + 5) * 100);
      $("#ya-score").innerHTML = `<div class="alert ${perfect ? "good" : fp ? "bad" : "info"}">
        True positives ${tp}/3, false positives ${fp}, missed malicious ${fn}. <b>Score: ${pct}%</b>.
        ${perfect ? "Perfect: all 3 malicious samples matched and no clean file did. This is a deployable rule." : fp ? "You have false positives on clean files (e.g. the ELF, the text report, or the legit installer). Add a format anchor and require more than one content string." : fn ? "You are missing malicious samples. Check your string spellings and that your quantifier is not too strict." : ""}</div>
        ${perfect ? "" : `<div class="muted">Why clean files trip weak rules: <code>clean_elf.bin</code> contains the strings but is not a PE (no MZ magic); <code>clean_doc.txt</code>/<code>clean_notes.txt</code> are reports mentioning the IOCs; <code>clean_app.bin</code> is a real PE with only the generic <code>InstallService</code> string; <code>clean_config.bin</code> has only one campaign string. Anchoring on <code>uint16(0) == 0x5A4D</code> plus <b>2 of</b> the campaign strings separates them.</div>`}`;
      if (perfect) ctx.complete(100);
      else ctx.complete(pct);
    }

    $("#ya-run").onclick = run;
    $("#ya-reset").onclick = () => { $("#ya-rule").value = STARTER; ctx.store("rule", STARTER); $("#ya-parse").innerHTML = ""; $("#ya-score").innerHTML = ""; drawFiles(null); };
    $("#ya-hint").onclick = () => { $("#ya-hintbox").innerHTML = `<div class="alert info">Try a condition like:<pre class="mono">uint16(0) == 0x5A4D and filesize &lt; 1000 and 2 of ($a, $b, $w)</pre>
      The PE magic bytes are "MZ" = 0x4D 0x5A, read little-endian by <code>uint16(0)</code> as <code>0x5A4D</code>. Requiring 2 of 3 campaign strings avoids matching a clean PE that happens to contain just one.</div>`; };

    drawFiles(null);
  }
});
