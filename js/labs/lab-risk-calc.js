window.CP = window.CP || {};
CP.labs = CP.labs || [];
CP.labs.push({
  id: "lab-risk-calc",
  title: "Quantitative Risk Analysis",
  module: "p4-m3",
  difficulty: "Beginner",
  minutes: 20,
  skills: ["SLE / ALE", "exposure factor", "ARO", "cost-benefit of controls", "risk treatment"],
  briefing: `<p><b>Scenario:</b> You support the risk team at <b>Example Manufacturing</b>. Leadership wants numbers, not adjectives, so you will
  run the classic quantitative risk formulas used on the CISSP and Security+ exams, then make a cost-benefit case for a control and pick a
  risk-treatment strategy.</p>
  <p><b>The formulas:</b></p>
  <ul>
    <li><b>SLE</b> (Single Loss Expectancy) = <b>AV</b> (Asset Value) &times; <b>EF</b> (Exposure Factor, as a decimal)</li>
    <li><b>ALE</b> (Annualized Loss Expectancy) = <b>SLE</b> &times; <b>ARO</b> (Annualized Rate of Occurrence)</li>
    <li><b>Value of a control</b> = ALE(before) &minus; ALE(after) &minus; annual cost of the control</li>
  </ul>
  <p><b>Objectives:</b> compute SLE and ALE for four scenarios, evaluate one control, and choose a treatment (accept / avoid / transfer / mitigate).
  Enter numeric answers; the lab checks them.</p>`,
  render(container, ctx) {
    container.classList.add("lab-lab-risk-calc");
    const style = document.createElement("style");
    style.textContent = `
      .lab-lab-risk-calc .rk-sc { border-left: 4px solid var(--accent); }
      .lab-lab-risk-calc .rk-in { width: 150px; }
      .lab-lab-risk-calc .rk-row { display: flex; flex-wrap: wrap; gap: .6rem; align-items: center; }
      .lab-lab-risk-calc .rk-row label { display: flex; flex-direction: column; font-size: .85rem; gap: .2rem; }
      .lab-lab-risk-calc .rk-given { font-family: monospace; }
    `;
    container.appendChild(style);
    const esc = ctx.escape;

    const SCEN = [
      { name: "Ransomware on the ERP server", av: 400000, efPct: 60, aro: 0.5,
        note: "Asset value $400,000; a successful event would destroy ~60% of its value; expected once every 2 years." },
      { name: "Laptop theft (fleet)", av: 1500, efPct: 100, aro: 20,
        note: "Each laptop worth $1,500; theft is a total loss (100%); about 20 laptops stolen per year." },
      { name: "Power outage to the plant floor", av: 250000, efPct: 10, aro: 4,
        note: "Dependent production value $250,000; an outage costs ~10% in lost output; roughly 4 outages per year." },
      { name: "Phishing leading to wire fraud", av: 80000, efPct: 75, aro: 0.25,
        note: "Potential fraudulent transfer exposure $80,000; ~75% typically lost before clawback; expected once every 4 years." }
    ];
    SCEN.forEach((s) => { s.ef = s.efPct / 100; s.sle = s.av * s.ef; s.ale = s.sle * s.aro; });

    // Control scenario: for ransomware, a backup+EDR program
    const CTRL = { target: 0, aleBefore: SCEN[0].ale, newAro: 0.1, cost: 35000 };
    CTRL.aleAfter = SCEN[0].sle * CTRL.newAro;
    CTRL.value = CTRL.aleBefore - CTRL.aleAfter - CTRL.cost;

    const money = (n) => "$" + Math.round(n).toLocaleString("en-US");
    const near = (a, b) => Math.abs(a - b) <= Math.max(1, Math.abs(b) * 0.005);

    const root = document.createElement("div");
    root.className = "stack";
    container.appendChild(root);
    root.innerHTML = `<div id="rk-scen" class="stack"></div>
      <div class="card stack" id="rk-ctrl"></div>
      <div class="card stack" id="rk-treat"></div>
      <div class="card stack"><div class="row"><button class="btn primary" id="rk-check">Check all answers</button></div><div id="rk-res"></div></div>`;

    root.querySelector("#rk-scen").innerHTML = `<h3>Part 1: SLE and ALE</h3>` + SCEN.map((s, i) => `
      <div class="card stack rk-sc" data-i="${i}">
        <b>Scenario ${i + 1}: ${esc(s.name)}</b>
        <div class="muted">${esc(s.note)}</div>
        <div class="rk-given">AV = ${money(s.av)} &nbsp; EF = ${s.efPct}% (${s.ef}) &nbsp; ARO = ${s.aro}</div>
        <div class="rk-row">
          <label>SLE = AV &times; EF <input class="input rk-in mono" data-f="sle" inputmode="numeric" placeholder="$"></label>
          <label>ALE = SLE &times; ARO <input class="input rk-in mono" data-f="ale" inputmode="numeric" placeholder="$"></label>
        </div>
        <div data-fb></div>
      </div>`).join("");

    root.querySelector("#rk-ctrl").innerHTML = `<h3>Part 2: cost-benefit of a control</h3>
      <p>For the ransomware risk (Scenario 1), a proposed backup + EDR program is expected to cut the frequency from ARO ${SCEN[0].aro} to <b>${CTRL.newAro}</b>
      (the exposure factor stays ${SCEN[0].efPct}%). The program costs <b>${money(CTRL.cost)}</b> per year.</p>
      <div class="rk-row">
        <label>ALE <i>before</i> the control <input class="input rk-in mono" data-c="before" placeholder="$"></label>
        <label>ALE <i>after</i> the control <input class="input rk-in mono" data-c="after" placeholder="$"></label>
        <label>Value of the control (per year) <input class="input rk-in mono" data-c="value" placeholder="$"></label>
      </div>
      <div class="muted">Value = ALE(before) &minus; ALE(after) &minus; annual cost. A positive value means the control is cost-justified.</div>
      <div data-cfb></div>`;

    root.querySelector("#rk-treat").innerHTML = `<h3>Part 3: risk treatment</h3>
      <p>Given your numbers, which treatment best fits each situation? (accept / mitigate / transfer / avoid)</p>
      ${[
        { id: "t1", q: "The backup + EDR program shows a clearly positive annual value for the ransomware risk.", a: "mitigate", why: "A cost-justified control that reduces likelihood/impact is risk mitigation (reduction)." },
        { id: "t2", q: "A rare event with very low ALE that would cost far more to control than it could ever save.", a: "accept", why: "When the cost of control exceeds the expected loss, formally accepting the residual risk is rational." },
        { id: "t3", q: "Residual financial loss from wire fraud that you cannot fully prevent, so you buy cyber-insurance for it.", a: "transfer", why: "Shifting the financial impact to a third party (insurance) is risk transfer." },
        { id: "t4", q: "A legacy internet-facing service so dangerous that the business decides to decommission it entirely.", a: "avoid", why: "Eliminating the activity/asset that creates the risk is risk avoidance." }
      ].map((t) => `<div class="stack" data-t="${t.id}"><div>${esc(t.q)}</div>
        <select class="select" data-treat="${t.id}" style="max-width:220px"><option value="">-- choose --</option>${["accept", "mitigate", "transfer", "avoid"].map((o) => `<option>${o}</option>`).join("")}</select>
        <div data-tfb></div></div>`).join("")}`;
    const TREAT = { t1: ["mitigate", "A cost-justified control that reduces likelihood/impact is risk mitigation (reduction)."], t2: ["accept", "When the cost of control exceeds the expected loss, formally accepting the residual risk is rational."], t3: ["transfer", "Shifting the financial impact to a third party (insurance) is risk transfer."], t4: ["avoid", "Eliminating the activity/asset that creates the risk is risk avoidance."] };

    function parseNum(s) { return parseFloat(String(s).replace(/[$,\s]/g, "")); }

    root.querySelector("#rk-check").onclick = () => {
      let correct = 0, total = 0;
      SCEN.forEach((s, i) => {
        const card = root.querySelector(`.rk-sc[data-i="${i}"]`);
        const sle = parseNum(card.querySelector('[data-f="sle"]').value);
        const ale = parseNum(card.querySelector('[data-f="ale"]').value);
        const sleOk = near(sle, s.sle), aleOk = near(ale, s.ale);
        total += 2; if (sleOk) correct++; if (aleOk) correct++;
        card.querySelector("[data-fb]").innerHTML = `<div class="alert ${sleOk && aleOk ? "good" : "bad"}">
          SLE = ${money(s.av)} &times; ${s.ef} = <b>${money(s.sle)}</b> ${sleOk ? "&#10003;" : "&#10007; (you: " + (isNaN(sle) ? "blank" : money(sle)) + ")"}.
          ALE = ${money(s.sle)} &times; ${s.aro} = <b>${money(s.ale)}</b> ${aleOk ? "&#10003;" : "&#10007; (you: " + (isNaN(ale) ? "blank" : money(ale)) + ")"}.</div>`;
      });
      const cb = parseNum(root.querySelector('[data-c="before"]').value), ca = parseNum(root.querySelector('[data-c="after"]').value), cv = parseNum(root.querySelector('[data-c="value"]').value);
      const cbOk = near(cb, CTRL.aleBefore), caOk = near(ca, CTRL.aleAfter), cvOk = near(cv, CTRL.value);
      total += 3; if (cbOk) correct++; if (caOk) correct++; if (cvOk) correct++;
      root.querySelector("[data-cfb]").innerHTML = `<div class="alert ${cbOk && caOk && cvOk ? "good" : "bad"}">
        ALE before = ${money(SCEN[0].sle)} &times; ${SCEN[0].aro} = <b>${money(CTRL.aleBefore)}</b> ${cbOk ? "&#10003;" : "&#10007;"}.
        ALE after = ${money(SCEN[0].sle)} &times; ${CTRL.newAro} = <b>${money(CTRL.aleAfter)}</b> ${caOk ? "&#10003;" : "&#10007;"}.
        Control value = ${money(CTRL.aleBefore)} &minus; ${money(CTRL.aleAfter)} &minus; ${money(CTRL.cost)} = <b>${money(CTRL.value)}</b> ${cvOk ? "&#10003;" : "&#10007;"} ${CTRL.value > 0 ? "(positive &rarr; the control pays for itself)" : ""}.</div>`;
      Object.entries(TREAT).forEach(([id, [ans, why]]) => {
        const sel = root.querySelector(`[data-treat="${id}"]`); const ok = sel.value === ans; total++; if (ok) correct++;
        root.querySelector(`[data-t="${id}"] [data-tfb]`).innerHTML = `<div class="alert ${ok ? "good" : "bad"}">Best treatment: <b>${ans}</b>. ${esc(why)}</div>`;
      });
      const pct = Math.round(correct / total * 100);
      root.querySelector("#rk-res").innerHTML = `<div class="alert ${pct >= 70 ? "good" : "info"}">${correct}/${total} correct. <b>Score: ${pct}%</b>.
        Quantitative risk gives leadership a defensible, dollar-based way to compare risks and justify (or reject) controls. Remember ALE is per year, which is what makes the control cost-benefit comparison apples-to-apples.</div>`;
      ctx.complete(pct);
    };
  }
});
