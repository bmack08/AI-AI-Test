window.CP = window.CP || {};
CP.labs = CP.labs || [];
CP.labs.push({
  id: "lab-cloud-iam",
  title: "AWS IAM Policy Review",
  module: "p4-m1",
  difficulty: "Intermediate",
  minutes: 30,
  skills: ["AWS IAM", "least privilege", "S3 bucket policies", "CloudTrail analysis", "privilege escalation"],
  briefing: `<p><b>Scenario:</b> You are doing a cloud-security review for <b>Example Cloud Co</b> in AWS account <code>111122223333</code>.
  You have five IAM/bucket policy documents and a short slice of CloudTrail events. Find the overly permissive statements, then pick the
  least-privilege fix for each. Everything is fictional and read-only.</p>
  <p><b>Objectives:</b></p>
  <ul>
    <li>Spot the usual suspects: <code>"Action":"*"</code>, <code>"Resource":"*"</code>, wildcard principals, public S3 bucket policies, missing conditions, and privilege-escalation paths like <code>iam:PassRole</code> with <code>*</code>.</li>
    <li>Correlate a policy with CloudTrail to see the risk being used.</li>
    <li>Choose the correct remediation for each finding.</li>
  </ul>`,
  render(container, ctx) {
    container.classList.add("lab-lab-cloud-iam");
    const style = document.createElement("style");
    style.textContent = `
      .lab-lab-cloud-iam pre.ci-json { background: var(--code-bg); border: 1px solid var(--border); border-radius: 6px; padding: .6rem; font-size: .8rem; overflow-x: auto; white-space: pre; }
      .lab-lab-cloud-iam .ci-tok-key { color: var(--accent); }
      .lab-lab-cloud-iam .ci-flag { background: rgba(255,80,80,.18); outline: 1px solid var(--bad); border-radius: 3px; cursor: pointer; padding: 0 2px; }
      .lab-lab-cloud-iam .ci-flag.picked { background: var(--warn); color: #000; }
      .lab-lab-cloud-iam .ci-ct { font-family: monospace; font-size: .78rem; }
      .lab-lab-cloud-iam .ci-fix label { display: block; font-weight: normal; margin: .2rem 0; }
    `;
    container.appendChild(style);
    const esc = ctx.escape;

    // Each policy has JSON lines; flaggable lines are marked. Learner clicks the bad lines, then picks a fix.
    const POLICIES = [
      { id: "P1", title: "Role: ci-deployer (attached to the build pipeline)",
        lines: [
          `{`, `  "Version": "2012-10-17",`, `  "Statement": [{`, `    "Effect": "Allow",`,
          { t: `    "Action": "*",`, bad: true, key: "action" },
          { t: `    "Resource": "*"`, bad: true, key: "resource" },
          `  }]`, `}`],
        ct: `eventName=CreateUser userIdentity.arn=.../ci-deployer  (the pipeline created a new IAM user!)`,
        fixes: [
          { t: "Replace with only the specific deploy actions (e.g. s3:PutObject, lambda:UpdateFunctionCode) on the specific build-artifact and function ARNs.", ok: true },
          { t: "Keep Action:* but add Resource restricted to one bucket.", ok: false },
          { t: "Leave it; CI systems need admin to be reliable.", ok: false }
        ],
        why: "Action:* with Resource:* is full administrator. CloudTrail shows the pipeline using it to create IAM users, a privilege-escalation path. Scope to the exact actions and resource ARNs the pipeline needs." },
      { id: "P2", title: "S3 bucket policy: example-patient-reports",
        lines: [
          `{`, `  "Version": "2012-10-17",`, `  "Statement": [{`, `    "Effect": "Allow",`,
          { t: `    "Principal": "*",`, bad: true, key: "principal" },
          `    "Action": "s3:GetObject",`,
          { t: `    "Resource": "arn:aws:s3:::example-patient-reports/*"`, bad: false },
          `  }]`, `}`],
        ct: `eventName=GetObject sourceIPAddress=203.0.113.9 (unauthenticated) key=reports/patient_0012.pdf`,
        fixes: [
          { t: "Set Principal to the specific roles/accounts that need access, remove public access, and enable S3 Block Public Access.", ok: true },
          { t: "Change Action to s3:* to be safe.", ok: false },
          { t: "Add a condition requiring TLS but keep Principal:*.", ok: false }
        ],
        why: "Principal:* on a GetObject statement makes the bucket world-readable: anyone on the internet can read patient reports. CloudTrail confirms anonymous reads. Remove the public principal and turn on Block Public Access." },
      { id: "P3", title: "Role: lambda-exec with PassRole",
        lines: [
          `{`, `  "Version": "2012-10-17",`, `  "Statement": [{`, `    "Effect": "Allow",`,
          `    "Action": ["iam:PassRole", "lambda:CreateFunction"],`,
          { t: `    "Resource": "*"`, bad: true, key: "passrole" },
          `  }]`, `}`],
        ct: `eventName=PassRole requestParameters.roleArn=.../AdminRole  then CreateFunction with that role`,
        fixes: [
          { t: "Restrict iam:PassRole to only the specific low-privilege execution-role ARN(s), and add a condition on iam:PassedToService.", ok: true },
          { t: "Remove lambda:CreateFunction only.", ok: false },
          { t: "It is fine because PassRole itself does nothing.", ok: false }
        ],
        why: "iam:PassRole on Resource:* lets this role attach ANY role (including AdminRole) to a new Lambda and then run as it: a classic privilege-escalation chain. Restrict PassRole to specific roles and condition on the service." },
      { id: "P4", title: "Role: analyst-readonly",
        lines: [
          `{`, `  "Version": "2012-10-17",`, `  "Statement": [{`, `    "Effect": "Allow",`,
          `    "Action": ["s3:GetObject", "s3:ListBucket"],`,
          `    "Resource": ["arn:aws:s3:::example-reports", "arn:aws:s3:::example-reports/*"],`,
          `    "Condition": {"IpAddress": {"aws:SourceIp": "198.51.100.0/24"}}`,
          `  }]`, `}`],
        ct: `eventName=GetObject sourceIPAddress=198.51.100.44 (corporate range) key=reports/weekly.csv`,
        fixes: [
          { t: "No change needed: scoped actions, scoped resource, and a source-IP condition. This is least privilege.", ok: true },
          { t: "Add Action:* so analysts are not blocked later.", ok: false },
          { t: "Remove the Condition to simplify.", ok: false }
        ],
        why: "This is the good example: specific read actions, specific bucket ARNs, and a network condition. Recognising a sound policy is as important as finding bad ones. No change required." },
      { id: "P5", title: "Role: backup-service",
        lines: [
          `{`, `  "Version": "2012-10-17",`, `  "Statement": [{`, `    "Effect": "Allow",`,
          { t: `    "Action": ["s3:*"],`, bad: true, key: "s3star" },
          `    "Resource": ["arn:aws:s3:::example-backups", "arn:aws:s3:::example-backups/*"]`,
          `  }]`, `}`],
        ct: `eventName=DeleteBucket requestParameters.bucketName=example-backups (backups wiped)`,
        fixes: [
          { t: "Replace s3:* with just the actions backups need (s3:PutObject, s3:GetObject, s3:ListBucket) so the role cannot delete the bucket or change its policy.", ok: true },
          { t: "Add Resource:* so it can back up everything.", ok: false },
          { t: "Keep s3:* but add MFA.", ok: false }
        ],
        why: "Even with the resource scoped to one bucket, s3:* includes s3:DeleteBucket and s3:PutBucketPolicy. CloudTrail shows the backups being deleted. A backup role should not be able to destroy or re-permission its target. Scope the actions." }
    ];

    const state = ctx.store("ci") || {};
    let submitted = false;
    const root = document.createElement("div");
    root.className = "stack";
    container.appendChild(root);
    root.innerHTML = `<p class="muted">For each policy: click the problematic line(s) to flag them, then choose the best fix. Policy P4 may have no problems.</p>
      <div id="ci-pols" class="stack"></div>
      <div class="card stack"><div class="row"><button class="btn primary" id="ci-submit">Submit review</button></div><div id="ci-res"></div></div>`;

    function draw() {
      root.querySelector("#ci-pols").innerHTML = POLICIES.map((p, pi) => {
        const a = state[pi] || (state[pi] = { picks: [], fix: -1 });
        const body = p.lines.map((ln, li) => {
          if (typeof ln === "string") return `<span>${esc(ln)}</span>`;
          const flagged = a.picks.includes(li);
          const resultCls = submitted ? (ln.bad ? "picked" : "") : "";
          return `<span class="ci-flag ${flagged ? "picked" : ""} ${resultCls}" data-p="${pi}" data-l="${li}">${esc(ln.t)}</span>`;
        }).join("\n");
        return `<div class="card stack" data-p="${pi}">
          <b>${esc(p.id)}: ${esc(p.title)}</b>
          <pre class="ci-json">${body}</pre>
          <div class="ci-ct"><b>CloudTrail:</b> ${esc(p.ct)}</div>
          <div class="ci-fix"><b>Best fix:</b>${p.fixes.map((f, fi) => `<label><input type="radio" name="fix${pi}" value="${fi}"${a.fix === fi ? " checked" : ""}${submitted ? " disabled" : ""}> ${esc(f.t)}</label>`).join("")}</div>
          ${submitted ? `<div class="alert ${a.fix >= 0 && p.fixes[a.fix].ok && sameFlags(pi) ? "good" : "bad"}">${esc(p.why)}</div>` : ""}
        </div>`;
      }).join("");
      root.querySelectorAll(".ci-flag").forEach((el) => el.onclick = () => {
        if (submitted) return;
        const pi = +el.dataset.p, li = +el.dataset.l, a = state[pi];
        const i = a.picks.indexOf(li);
        if (i >= 0) a.picks.splice(i, 1); else a.picks.push(li);
        ctx.store("ci", state); el.classList.toggle("picked");
      });
      root.querySelectorAll("input[type=radio]").forEach((r) => r.onchange = () => {
        const pi = +r.name.replace("fix", ""); state[pi].fix = +r.value; ctx.store("ci", state);
      });
    }
    function sameFlags(pi) {
      const p = POLICIES[pi], a = state[pi];
      const want = p.lines.map((ln, li) => (typeof ln === "object" && ln.bad) ? li : -1).filter((x) => x >= 0).sort();
      const got = a.picks.slice().sort();
      return want.length === got.length && want.every((x, i) => x === got[i]);
    }

    root.querySelector("#ci-submit").onclick = () => {
      if (submitted) return;
      const noFix = POLICIES.filter((p, i) => !state[i] || state[i].fix < 0).length;
      if (noFix) { root.querySelector("#ci-res").innerHTML = `<div class="alert info">Choose a fix for every policy (${noFix} missing).</div>`; return; }
      submitted = true;
      let flagScore = 0, fixScore = 0;
      POLICIES.forEach((p, i) => { if (sameFlags(i)) flagScore++; if (state[i].fix >= 0 && p.fixes[state[i].fix].ok) fixScore++; });
      const pct = Math.round((flagScore + fixScore) / (POLICIES.length * 2) * 100);
      ctx.store("ci", state);
      root.querySelector("#ci-res").innerHTML = `<div class="alert ${pct >= 70 ? "good" : "info"}">Correctly flagged lines on ${flagScore}/${POLICIES.length} policies; correct fix on ${fixScore}/${POLICIES.length}. <b>Score: ${pct}%</b>.
        Core principles: grant specific actions on specific resource ARNs, never <code>Action:*</code>/<code>Resource:*</code>; block public S3; restrict <code>iam:PassRole</code>; and watch that even resource-scoped <code>service:*</code> can include destructive actions.</div>`;
      draw();
      ctx.complete(pct);
    };

    draw();
  }
});
