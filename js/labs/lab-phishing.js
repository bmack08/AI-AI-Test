window.CP = window.CP || {};
CP.labs = CP.labs || [];
CP.labs.push({
  id: "lab-phishing",
  title: "Phishing Inbox Triage",
  module: "p2-m6",
  difficulty: "Beginner",
  minutes: 25,
  skills: ["email header analysis", "SPF/DKIM/DMARC", "lookalike domains", "URL inspection", "malicious attachment types"],
  briefing: `<p><b>Scenario:</b> You are on shift in the SOC at <b>Corp Example</b> (<code>corp.example.com</code>). Eight messages were reported
  through the "Report Phish" button this morning. For each one, decide whether it is <b>phishing</b> or <b>legitimate</b>, and tick the
  indicators that support your decision.</p>
  <p><b>Objectives:</b></p>
  <ul>
    <li>Read raw headers: the <code>Received</code> chain (read bottom-up), <code>Return-Path</code>, <code>Reply-To</code> and <code>Authentication-Results</code>.</li>
    <li>Interpret SPF, DKIM and DMARC results, and remember that <b>"pass" only proves the domain is authentic, not that the domain is trustworthy</b>.</li>
    <li>Hover links to reveal their real destination, and recognise risky attachment types (<code>.html</code>, <code>.iso</code>, <code>.one</code>, macro documents).</li>
    <li>Spot lookalike domains and Reply-To mismatches typical of business email compromise (BEC).</li>
  </ul>
  <p>All domains and addresses are fictional. Links are inert.</p>`,
  render(container, ctx) {
    container.classList.add("lab-lab-phishing");
    const style = document.createElement("style");
    style.textContent = `
      .lab-lab-phishing .ph-wrap { display: grid; grid-template-columns: minmax(220px, 300px) 1fr; gap: 1rem; }
      @media (max-width: 760px) { .lab-lab-phishing .ph-wrap { grid-template-columns: 1fr; } }
      .lab-lab-phishing .ph-list { display: flex; flex-direction: column; gap: .35rem; }
      .lab-lab-phishing .ph-item { text-align: left; padding: .55rem .7rem; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); color: var(--text); cursor: pointer; }
      .lab-lab-phishing .ph-item.active { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent); }
      .lab-lab-phishing .ph-item .ph-from { font-weight: 600; font-size: .9rem; }
      .lab-lab-phishing .ph-item .ph-subj { font-size: .85rem; color: var(--muted); }
      .lab-lab-phishing .ph-body { border: 1px solid var(--border); border-radius: 8px; padding: 1rem; background: var(--bg); }
      .lab-lab-phishing .ph-link { color: var(--accent); text-decoration: underline; cursor: pointer; }
      .lab-lab-phishing .ph-status { font-family: monospace; font-size: .8rem; min-height: 1.4em; padding: .2rem .5rem; background: var(--code-bg); border: 1px solid var(--border); border-radius: 4px; word-break: break-all; }
      .lab-lab-phishing pre.ph-hdr { white-space: pre-wrap; word-break: break-all; font-size: .78rem; max-height: 320px; overflow: auto; }
      .lab-lab-phishing .ph-att { display: inline-block; padding: .3rem .6rem; border: 1px dashed var(--border); border-radius: 6px; font-family: monospace; font-size: .85rem; margin-right: .4rem; }
      .lab-lab-phishing .ph-ind { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: .25rem .75rem; }
      .lab-lab-phishing .ph-ind label { font-weight: normal; }
    `;
    container.appendChild(style);
    const esc = ctx.escape;

    const IND = {
      spf: "SPF fail / softfail",
      dkim: "DKIM fail or missing",
      dmarc: "DMARC fail",
      replyto: "Reply-To differs from From",
      returnpath: "Return-Path domain mismatch",
      lookalike: "Lookalike / typosquatted domain",
      url: "Link text does not match real URL",
      attach: "Risky attachment type",
      urgency: "Urgency, pressure or secrecy",
      received: "Unexpected sending infrastructure in Received chain"
    };

    const hdr = (o) => [
      `Received: from ${o.r1} by mx1.corp.example.com (Postfix) with ESMTPS id 4Q${o.id}; ${o.date}`,
      `Received: from ${o.r2}; ${o.date}`,
      `Return-Path: <${o.rp}>`,
      `Authentication-Results: mx1.corp.example.com;\n    spf=${o.spf} smtp.mailfrom=${o.rp.split("@")[1]};\n    dkim=${o.dkim};\n    dmarc=${o.dmarc} header.from=${o.from.split("@")[1]}`,
      `From: ${o.disp} <${o.from}>`,
      o.replyTo ? `Reply-To: ${o.replyTo}` : null,
      `To: ${o.to || "j.analyst@corp.example.com"}`,
      `Subject: ${o.subj}`,
      `Date: ${o.date}`,
      `Message-ID: <${o.id}.${Math.abs(o.id.length * 7919)}@${o.from.split("@")[1]}>`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/mixed; boundary="b1_${o.id}"`
    ].filter(Boolean).join("\n");

    const link = (text, real) => `<span class="ph-link" tabindex="0" data-real="${real}">${text}</span>`;

    const MAILS = [
      { id: "A1", disp: "Microsoft 365 Security", from: "no-reply@rnicrosoft-security.example", rp: "bounce@rnicrosoft-security.example", subj: "Action required: your password expires in 2 hours",
        date: "Tue, 20 Oct 2026 07:12:44 +0000", r1: "mail.rnicrosoft-security.example (unknown [203.0.113.45])", r2: "localhost (localhost [127.0.0.1]) by mail.rnicrosoft-security.example",
        spf: "fail (203.0.113.45 is not permitted)", dkim: "none (no signature)", dmarc: "fail (p=reject)",
        body: `<p>Dear user,</p><p>Your Microsoft 365 password will <b>expire in 2 hours</b>. To avoid losing access to email and Teams, keep your current password now:</p>
          <p>${link("https://login.microsoftonline.com/keep-password", "http://login.rnicrosoft-security.example/o365/keep.php?u=j.analyst%40corp.example.com")}</p><p>Microsoft 365 Team</p>`,
        att: [], phish: true, ind: ["spf", "dkim", "dmarc", "lookalike", "url", "urgency"],
        exp: "Lookalike domain (\"rn\" imitating \"m\"), SPF/DKIM/DMARC all fail, and the visible link text hides a credential-harvesting URL. Classic credential phish with time pressure." },
      { id: "B2", disp: "Corp Example IT", from: "it-news@corp.example.com", rp: "it-news@corp.example.com", subj: "October IT newsletter: new VPN client rollout",
        date: "Tue, 20 Oct 2026 06:30:01 +0000", r1: "mailout.corp.example.com (mailout.corp.example.com [192.0.2.25])", r2: "intranet-app01.corp.example.com ([10.10.4.12]) by mailout.corp.example.com",
        spf: "pass", dkim: "pass header.d=corp.example.com", dmarc: "pass",
        body: `<p>Hi all,</p><p>The new VPN client will be pushed automatically by Intune over the next two weeks. No action is needed. Details and FAQ are on the intranet:</p>
          <p>${link("https://intranet.corp.example.com/it/vpn-rollout", "https://intranet.corp.example.com/it/vpn-rollout")}</p><p>Remember: IT will never ask for your password by email.</p><p>&mdash; IT Service Desk</p>`,
        att: [], phish: false, ind: [],
        exp: "Internal domain, internal sending server, all authentication passes, link matches its text, and it asks for no action. Legitimate." },
      { id: "C3", disp: "Dana Whitfield (CEO)", from: "dana.whitfield@corp-example.com", rp: "dana.whitfield@corp-example.com", replyTo: "dana.ceo.private@freemail.example", subj: "Quick favour - confidential",
        date: "Tue, 20 Oct 2026 08:02:10 +0000", r1: "smtp.corp-example.com (smtp.corp-example.com [198.51.100.91])", r2: "[198.51.100.91] by smtp.corp-example.com",
        spf: "pass", dkim: "pass header.d=corp-example.com", dmarc: "pass",
        body: `<p>Are you at your desk? I need you to process an urgent wire of $48,500 to a new supplier before 11am. I'm in board meetings all day so reply by email only, do not call. Keep this between us until the deal is announced.</p><p>Dana<br>Sent from my phone</p>`,
        att: [], phish: true, ind: ["lookalike", "replyto", "urgency"],
        exp: "Business email compromise. corp-example.com (hyphen) is a lookalike of corp.example.com. SPF/DKIM/DMARC pass because the attacker owns the lookalike domain: authentication proves the sender controls that domain, not that it is yours. Reply-To diverts responses to a free-mail account. Urgency + secrecy + do not call = verify out-of-band." },
      { id: "D4", disp: "eSign Notifications", from: "billing@docs-esign.example", rp: "mailer@bulk-sender.example", subj: "Invoice #8841 awaiting your signature",
        date: "Tue, 20 Oct 2026 05:48:33 +0000", r1: "vps-2231.bulk-sender.example (unknown [203.0.113.118])", r2: "ubuntu ([127.0.0.1]) by vps-2231.bulk-sender.example",
        spf: "softfail (domain of transitioning mailer@bulk-sender.example does not designate 203.0.113.118)", dkim: "none", dmarc: "fail (p=none) header.from=docs-esign.example",
        body: `<p>You have received a document to review and sign.</p><p><b>Invoice_8841</b> (1 page) &mdash; Sender: Accounts Payable</p><p>Please open the attached secure document to view.</p>`,
        att: ["Invoice_8841.html"], phish: true, ind: ["spf", "dkim", "dmarc", "returnpath", "attach", "received"],
        exp: "An .html attachment is a common HTML-smuggling / local credential-phish technique. Return-Path domain differs from From, SPF softfails, no DKIM, DMARC fails, and the message came from a generic VPS host." },
      { id: "E5", disp: "Parcel Express", from: "notifications@parcelexpress.example", rp: "bounces@parcelexpress.example", subj: "Your delivery CPX-77120 is scheduled for Thursday",
        date: "Tue, 20 Oct 2026 04:15:00 +0000", r1: "out-12.mail.parcelexpress.example (out-12.mail.parcelexpress.example [198.51.100.12])", r2: "app-notify-3.parcelexpress.example ([10.2.0.8]) by out-12.mail.parcelexpress.example",
        spf: "pass", dkim: "pass header.d=parcelexpress.example", dmarc: "pass",
        body: `<p>Hello,</p><p>Your parcel from Office Supplies Example is scheduled for delivery on Thursday between 9am and 1pm.</p>
          <p>Track it: ${link("https://track.parcelexpress.example/CPX-77120", "https://track.parcelexpress.example/CPX-77120")}</p><p>No signature required.</p>`,
        att: [], phish: false, ind: [],
        exp: "Expected vendor (the procurement team uses Parcel Express), aligned authentication, consistent Received chain from the vendor's own mail servers, and the link goes to the vendor's domain. Legitimate." },
      { id: "F6", disp: "Harbor Payroll Services", from: "support@harborpayroll.example", rp: "support@harborpayroll.example", subj: "RE: October payslip correction - open today",
        date: "Tue, 20 Oct 2026 07:55:19 +0000", r1: "mail.harborpayroll.example (mail.harborpayroll.example [198.51.100.200])", r2: "[10.0.0.15] by mail.harborpayroll.example",
        spf: "pass", dkim: "pass header.d=harborpayroll.example", dmarc: "pass",
        body: `<p>Hi,</p><p>Due to a tax-code error your October payslip was recalculated. Please open the attached corrected payslip <b>today</b> to confirm your bank details before the payroll cutoff.</p><p>Password for the file: 2026</p><p>Harbor Payroll Support</p>`,
        att: ["Payslip_Oct_Corrected.iso"], phish: true, ind: ["attach", "urgency"],
        exp: "Likely sent from a compromised but real partner mailbox, so all authentication passes. The giveaway is the .iso disk image (used to bypass Mark-of-the-Web and deliver malware loaders) plus deadline pressure. Verify with the vendor through a known phone number." },
      { id: "G7", disp: "Accounts - Northwind Supplies", from: "accounts@northwind-supplies.example", rp: "x91@mail-relay.badhost.example", subj: "Remittance advice 10/20",
        date: "Tue, 20 Oct 2026 06:01:57 +0000", r1: "relay.badhost.example (unknown [203.0.113.77])", r2: "WIN-8QK2LMP ([203.0.113.77]) by relay.badhost.example",
        spf: "fail (domain of x91@mail-relay.badhost.example does not designate 203.0.113.77)", dkim: "none", dmarc: "fail (p=quarantine) header.from=northwind-supplies.example",
        body: `<p>Good morning,</p><p>Please find attached remittance advice for the payment released today. Double-click the "View Remittance" button inside the notebook to load the document.</p><p>Regards,<br>Accounts Receivable</p>`,
        att: ["Remittance_1020.one"], phish: true, ind: ["spf", "dkim", "dmarc", "returnpath", "attach", "received"],
        exp: "OneNote (.one) files with embedded \"click to view\" buttons were heavily abused to launch scripts. Return-Path on an unrelated domain, an origin host named like a fresh Windows install, SPF/DKIM/DMARC failures." },
      { id: "H8", disp: "Corp Example HR Benefits", from: "benefits@corp.example.com", rp: "benefits@corp.example.com", subj: "Reminder: open enrolment closes Friday",
        date: "Mon, 19 Oct 2026 16:20:40 +0000", r1: "mailout.corp.example.com (mailout.corp.example.com [192.0.2.25])", r2: "hr-portal.corp.example.com ([10.10.7.30]) by mailout.corp.example.com",
        spf: "pass", dkim: "pass header.d=corp.example.com", dmarc: "pass",
        body: `<p>Hi,</p><p>This is a reminder that benefits open enrolment closes <b>this Friday</b>. If you do nothing, your current elections roll over.</p>
          <p>Review your options on the HR portal (single sign-on): ${link("https://benefits.corp.example.com/enrol", "https://benefits.corp.example.com/enrol")}</p><p>HR Team</p>`,
        att: [], phish: false, ind: [],
        exp: "There is a deadline, but urgency alone is not proof of phishing. Internal sender, internal infrastructure, aligned SPF/DKIM/DMARC, link to the real internal domain, no credentials requested in email. Legitimate." }
    ];

    const state = ctx.store("answers") || {};
    let cur = 0, submitted = false;
    const root = document.createElement("div");
    root.className = "stack";
    container.appendChild(root);
    root.innerHTML = `<div class="ph-wrap"><div class="ph-list" id="ph-list"></div><div class="stack" id="ph-view"></div></div>
      <div class="card stack"><div class="row"><button class="btn primary" id="ph-submit">Submit triage for all 8</button><span class="muted" id="ph-count"></span></div><div id="ph-result"></div></div>`;
    const $ = (s) => root.querySelector(s);

    function drawList() {
      $("#ph-list").innerHTML = MAILS.map((m, i) => {
        const a = state[m.id];
        const tag = submitted ? (a && a.v === (m.phish ? "phish" : "legit") ? `<span class="tag good">correct</span>` : `<span class="tag bad">wrong</span>`)
          : a && a.v ? `<span class="tag ${a.v === "phish" ? "bad" : "good"}">${a.v === "phish" ? "phishing" : "legit"}</span>` : `<span class="tag">unreviewed</span>`;
        return `<button class="ph-item${i === cur ? " active" : ""}" data-i="${i}"><div class="ph-from">${esc(m.disp)}</div><div class="ph-subj">${esc(m.subj)}</div>${tag}</button>`;
      }).join("");
      $("#ph-list").querySelectorAll(".ph-item").forEach((b) => b.onclick = () => { cur = +b.dataset.i; drawList(); drawView(); });
      $("#ph-count").textContent = `${MAILS.filter((m) => state[m.id] && state[m.id].v).length} / ${MAILS.length} classified`;
    }

    function drawView() {
      const m = MAILS[cur];
      const a = state[m.id] || (state[m.id] = { v: "", ind: [] });
      $("#ph-view").innerHTML = `<div class="card stack">
        <div><b>From:</b> ${esc(m.disp)} &lt;${esc(m.from)}&gt;</div>
        ${m.replyTo ? `<div class="muted"><b>Reply-To:</b> ${esc(m.replyTo)}</div>` : ""}
        <div><b>Subject:</b> ${esc(m.subj)}</div><div class="muted">${esc(m.date)}</div>
        <div class="ph-body">${m.body}</div>
        ${m.att.length ? `<div><b>Attachments:</b> ${m.att.map((x) => `<span class="ph-att">&#128206; ${esc(x)}</span>`).join("")}</div>` : ""}
        <div class="ph-status" id="ph-status" aria-live="polite">Hover or focus a link to see where it really goes.</div>
        <details><summary>View raw headers</summary><pre class="term ph-hdr">${esc(hdr(m))}</pre>
          <div class="muted">Tip: Received headers are added by each hop, so the bottom one is closest to the true origin.</div></details>
      </div>
      <div class="card stack">
        <div class="row"><b>Verdict:</b>
          <button class="btn${a.v === "phish" ? " primary" : ""}" data-v="phish"${submitted ? " disabled" : ""}>Phishing</button>
          <button class="btn${a.v === "legit" ? " primary" : ""}" data-v="legit"${submitted ? " disabled" : ""}>Legitimate</button></div>
        <div><b>Indicators observed</b> <span class="muted">(tick all that apply)</span></div>
        <div class="ph-ind">${Object.entries(IND).map(([k, l]) => `<label><input type="checkbox" data-k="${k}"${a.ind.includes(k) ? " checked" : ""}${submitted ? " disabled" : ""}> ${l}</label>`).join("")}</div>
        ${submitted ? `<div class="alert ${a.v === (m.phish ? "phish" : "legit") ? "good" : "bad"}"><b>${m.phish ? "PHISHING" : "LEGITIMATE"}.</b> ${m.exp}
          ${m.phish ? `<br><b>Key indicators:</b> ${m.ind.map((k) => IND[k]).join("; ")}.` : ""}</div>` : ""}
        <div class="row"><button class="btn ghost" id="ph-prev"${cur === 0 ? " disabled" : ""}>&larr; Previous</button><button class="btn ghost" id="ph-next"${cur === MAILS.length - 1 ? " disabled" : ""}>Next &rarr;</button></div>
      </div>`;
      const status = $("#ph-status");
      $("#ph-view").querySelectorAll(".ph-link").forEach((l) => {
        const showReal = () => { status.textContent = l.dataset.real; };
        l.addEventListener("mouseenter", showReal); l.addEventListener("focus", showReal);
        l.addEventListener("click", (e) => { e.preventDefault(); status.textContent = "Blocked (training lab): " + l.dataset.real; });
      });
      $("#ph-view").querySelectorAll("[data-v]").forEach((b) => b.onclick = () => { a.v = b.dataset.v; ctx.store("answers", state); drawList(); drawView(); });
      $("#ph-view").querySelectorAll("input[data-k]").forEach((c) => c.onchange = () => {
        a.ind = a.ind.filter((x) => x !== c.dataset.k); if (c.checked) a.ind.push(c.dataset.k); ctx.store("answers", state);
      });
      $("#ph-prev").onclick = () => { if (cur > 0) { cur--; drawList(); drawView(); } };
      $("#ph-next").onclick = () => { if (cur < MAILS.length - 1) { cur++; drawList(); drawView(); } };
    }

    $("#ph-submit").onclick = () => {
      if (submitted) return;
      const missing = MAILS.filter((m) => !state[m.id] || !state[m.id].v);
      if (missing.length) { $("#ph-result").innerHTML = `<div class="alert info">Classify all messages first (${missing.length} left).</div>`; return; }
      submitted = true;
      let verdictPts = 0, indPts = 0, phishCount = 0;
      MAILS.forEach((m) => {
        const a = state[m.id];
        if (a.v === (m.phish ? "phish" : "legit")) verdictPts++;
        if (m.phish) {
          phishCount++;
          const hit = a.ind.filter((k) => m.ind.includes(k)).length, fp = a.ind.filter((k) => !m.ind.includes(k)).length;
          indPts += Math.max(0, (hit - fp * 0.5) / m.ind.length);
        }
      });
      const pct = Math.round(60 * verdictPts / MAILS.length + 40 * indPts / phishCount);
      $("#ph-result").innerHTML = `<div class="alert ${pct >= 70 ? "good" : "info"}">Verdicts: ${verdictPts}/${MAILS.length} correct. Indicator accuracy on phishing messages: ${Math.round(100 * indPts / phishCount)}%. <b>Score: ${pct}%</b>.
        Review each message for the explanation.</div>
        <div class="alert info"><b>Takeaways:</b> SPF checks the envelope sender (Return-Path) IP; DKIM checks a signature for the signing domain; DMARC requires one of them to pass <i>and align</i> with the visible From domain.
        Attackers using their own lookalike domains or compromised real accounts will pass all three, so content, context and out-of-band verification still matter.</div>`;
      ctx.store("answers", state);
      drawList(); drawView();
      ctx.complete(pct);
    };

    drawList();
    drawView();
  }
});
