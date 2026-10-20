window.CP = window.CP || {};
CP.flashcards = CP.flashcards || [];
// Flashcards for phases p3, p4, p5. IDs are generated as fc-<module>-NNN in order.
(function () {
  function add(mod, cards) {
    cards.forEach(function (c, i) {
      CP.flashcards.push({ id: "fc-" + mod + "-" + String(i + 1).padStart(3, "0"), module: mod, front: c[0], back: c[1] });
    });
  }

  // ---------------- p3-m1 Incident Response Lifecycle ----------------
  add("p3-m1", [
    ["What is NIST SP 800-61 Revision 3 (April 2025)?", "NIST's updated incident response guidance. It ties IR to the <b>CSF 2.0</b> functions (Govern, Identify, Protect, Detect, Respond, Recover) instead of a standalone lifecycle, and treats IR as part of overall cyber risk management."],
    ["What were the four phases of the classic NIST 800-61r2 lifecycle?", "1. Preparation 2. Detection &amp; Analysis 3. Containment, Eradication &amp; Recovery 4. Post-Incident Activity. Many organizations and exams still use them."],
    ["SANS incident response steps (PICERL)?", "Preparation, Identification, Containment, Eradication, Recovery, Lessons Learned."],
    ["Event vs incident?", "An <b>event</b> is any observable occurrence. An <b>incident</b> is an event that actually or imminently threatens the CIA of systems or data, or violates security policy."],
    ["What belongs in the Preparation phase?", "An IR plan and policy, roles (CSIRT), contact lists, playbooks, tooling (EDR, forensics kits), logging, training and tabletop exercises."],
    ["Short-term vs long-term containment?", "<b>Short-term</b>: stop the bleeding now (isolate the host, disable the account, block the IP). <b>Long-term</b>: temporary fixes that let the business run while eradication is planned (rebuilt segment, extra monitoring)."],
    ["What is eradication?", "Removing the attacker's presence: malware, persistence, backdoor accounts and compromised credentials, and fixing the root-cause vulnerability."],
    ["What must happen before recovery is declared complete?", "Systems are restored from known-good sources, hardened, patched and <b>monitored</b> for re-infection, and the business owner validates them."],
    ["Why use out-of-band communications during an incident?", "The attacker may be reading corporate email or chat. Use a separate, pre-arranged channel (e.g. a dedicated Signal group or phone bridge)."],
    ["What is a lessons-learned (post-incident) review?", "A blameless meeting soon after the incident covering what happened, the timeline, what worked and what didn't, and action items to improve controls, detections and the IR plan."],
    ["What is a tabletop exercise?", "A discussion-based simulation where the team walks through a scenario (e.g. ransomware) to test roles, decisions and communications without touching systems."],
    ["Why document chain of custody during IR?", "So evidence stays admissible and its integrity can be proven: who collected it, when, how, where it was stored and every transfer."],
    ["GDPR breach notification deadline?", "Notify the supervisory authority within <b>72 hours</b> of becoming aware of a personal data breach (Article 33), unless it is unlikely to pose a risk to individuals."],
    ["SEC cyber incident disclosure rule (public US companies)?", "Disclose a <b>material</b> cybersecurity incident on Form 8-K Item 1.05 within <b>4 business days</b> of determining materiality."],
    ["What is CIRCIA?", "The Cyber Incident Reporting for Critical Infrastructure Act (2022). It will require covered entities to report significant incidents to CISA within 72 hours and ransom payments within 24 hours, once CISA's final rule takes effect."],
    ["Key ransomware response principles?", "Isolate quickly, preserve evidence, identify the variant and entry point, check whether backups are intact and offline, engage legal/insurance/law enforcement, and do not rush to pay (CISA/FBI advise against paying)."],
    ["Why should you avoid immediately wiping a compromised machine?", "It destroys evidence needed to find the root cause, the scope and any persistence elsewhere. Capture memory and disk first if the incident warrants it."],
    ["What is a legal hold?", "An instruction to preserve all relevant data (and suspend deletion policies) because of expected litigation or investigation."],
    ["What drives incident severity classification?", "Functional impact, information impact (data type and volume), recoverability, number of systems or users affected, and regulatory or safety implications."],
    ["What is an IOC sweep (scoping)?", "Searching the whole environment (EDR, SIEM) for the IOCs and TTPs found during the investigation to find every affected host and account before eradication."]
  ]);

  // ---------------- p3-m2 Cyber Threat Intelligence ----------------
  add("p3-m2", [
    ["Steps of the intelligence lifecycle?", "Direction (requirements/planning) → Collection → Processing → Analysis → Dissemination → Feedback."],
    ["Strategic vs operational vs tactical vs technical intelligence?", "<b>Strategic</b>: high-level trends for executives. <b>Operational</b>: campaigns and actor intent. <b>Tactical</b>: TTPs for defenders. <b>Technical</b>: specific IOCs (hashes, IPs)."],
    ["IOC vs IOA?", "An <b>Indicator of Compromise</b> is evidence that a breach occurred (hash, IP, domain). An <b>Indicator of Attack</b> is behavior showing an attack in progress (e.g. LSASS access by an unsigned process)."],
    ["What are STIX and TAXII?", "<b>STIX 2.1</b>: a JSON language for describing threat intel objects (indicators, threat actors, attack patterns, relationships). <b>TAXII 2.1</b>: the protocol for exchanging STIX over HTTPS."],
    ["Traffic Light Protocol 2.0 labels?", "<b>TLP:RED</b> (named recipients only), <b>TLP:AMBER+STRICT</b> (recipient's organization only), <b>TLP:AMBER</b> (organization and its clients, need-to-know), <b>TLP:GREEN</b> (community), <b>TLP:CLEAR</b> (public)."],
    ["What is MISP?", "An open-source threat intelligence platform for storing, correlating and sharing IOCs and events among communities."],
    ["What are Priority Intelligence Requirements (PIRs)?", "The key questions stakeholders need answered (e.g. 'Which ransomware groups target our sector?'). They drive collection and keep CTI relevant."],
    ["Admiralty (NATO) grading system?", "Source reliability <b>A</b> (completely reliable) to <b>F</b> (cannot be judged), and information credibility <b>1</b> (confirmed) to <b>6</b> (cannot be judged), e.g. 'B2'."],
    ["What is an ISAC?", "An Information Sharing and Analysis Center: a sector-specific body (FS-ISAC, Health-ISAC, etc.) where members share threat intelligence."],
    ["What is OSINT?", "Open-Source Intelligence: information from publicly available sources such as websites, social media, DNS/WHOIS, code repositories, paste sites and public reports."],
    ["What is Analysis of Competing Hypotheses (ACH)?", "A structured analytic technique: list every hypothesis, evaluate the evidence against each, and look for evidence that <i>disproves</i> them. This reduces confirmation bias."],
    ["Why is attribution difficult and often unnecessary for a SOC?", "Actors share tools, use false flags and rent infrastructure. For defenders, the TTPs and the needed response matter more than naming the actor."],
    ["Why do threat actors have many names?", "Each vendor uses its own naming (e.g. Microsoft's weather-themed names such as Midnight Blizzard = APT29 = Cozy Bear). Use crosswalks like MITRE ATT&amp;CK group pages."],
    ["What makes a threat feed high quality?", "Relevance to your environment, timeliness, accuracy (low false positives), context (why it is malicious, confidence, TTPs) and an expiry or aging of indicators."],
    ["What is pivoting in CTI?", "Using one known data point (a domain, a certificate hash, an IP) to discover related infrastructure or samples through passive DNS, certificate transparency, WHOIS, etc."],
    ["Why do IOCs need expiration?", "IP addresses and domains get reassigned or cleaned. Old indicators cause false positives and bloat blocklists."],
    ["Where can you find free authoritative advisories?", "CISA Cybersecurity Advisories and KEV, vendor threat reports, ISAC bulletins, and national CERTs (e.g. NCSC UK)."],
    ["What is a threat intelligence platform (TIP)?", "A system (e.g. MISP, OpenCTI) that aggregates feeds, de-duplicates, scores and enriches indicators and pushes them to the SIEM, EDR and firewalls."],
    ["What is the difference between data, information and intelligence?", "Data is raw facts (an IP). Information is processed data (the IP hosted a phishing site). Intelligence is analyzed, contextual and actionable (the actor targeting our finance team uses this infrastructure; block it and hunt)."]
  ]);

  // ---------------- p3-m3 Digital Forensics ----------------
  add("p3-m3", [
    ["Order of volatility (RFC 3227), most to least volatile?", "CPU registers/cache → routing and ARP tables, process table, kernel stats, <b>memory</b> → temporary file systems → disk → remote logging/monitoring → physical configuration/topology → archival media."],
    ["What is a write blocker?", "A hardware or software device that allows read-only access to evidence media, so acquisition does not change the original."],
    ["How do you prove a forensic image matches the original?", "Hash both (e.g. SHA-256) at acquisition and verify the hashes match. Record them in the chain-of-custody documentation."],
    ["Raw (dd) vs E01 image formats?", "<b>Raw/dd</b>: a bit-for-bit copy with no metadata. <b>E01</b> (EnCase/Expert Witness): compressed, with embedded case metadata and hashes."],
    ["Tools for capturing RAM on Windows?", "WinPmem, Magnet RAM Capture, DumpIt, Belkasoft RAM Capturer, or EDR live-response memory collection. Use AVML or LiME on Linux."],
    ["Key Volatility 3 plugins?", "<code>windows.pslist</code>, <code>windows.pstree</code>, <code>windows.cmdline</code>, <code>windows.netscan</code>, <code>windows.malfind</code> (injected code), <code>windows.dlllist</code>."],
    ["What does Windows Prefetch tell you?", "That a program ran, its run count and last run times (up to 8 on Win8+), from <code>C:\\Windows\\Prefetch\\*.pf</code>. Prefetch is often disabled on servers."],
    ["What are Amcache and Shimcache (AppCompatCache)?", "Registry-based artifacts showing executables present on or run on a system, including paths and (for Amcache) SHA-1 hashes. Shimcache alone doesn't prove execution on newer Windows."],
    ["What is the $MFT?", "The NTFS Master File Table: one record per file, holding metadata such as $STANDARD_INFORMATION and $FILE_NAME timestamps, size and location."],
    ["How can you detect timestomping?", "Compare the $STANDARD_INFORMATION timestamps (easy to modify) with the $FILE_NAME timestamps (harder to modify) and look for zeroed sub-seconds."],
    ["What is the $UsnJrnl?", "The NTFS change journal, which records file creates, deletes, renames and modifications. It is great for proving deleted or renamed files."],
    ["What is a super timeline?", "A merged timeline of many artifacts (file system, event logs, registry, browser) built with tools such as <b>plaso/log2timeline</b> and viewed in Timesketch."],
    ["Which artifacts show user file and folder access on Windows?", "LNK files, Jump Lists, ShellBags, RecentDocs and UserAssist (GUI program execution), mostly in NTUSER.DAT and UsrClass.dat."],
    ["What is KAPE?", "Kroll Artifact Parser and Extractor: a triage tool that quickly collects key forensic artifacts (targets) and parses them (modules)."],
    ["What is slack space?", "Unused space between the end of a file's data and the end of its last allocated cluster. It may contain remnants of earlier data."],
    ["Key Linux forensic artifacts?", "<code>/var/log/*</code> (auth, syslog, journal), <code>~/.bash_history</code>, <code>/etc/passwd</code> and <code>/etc/shadow</code>, cron files, systemd units, <code>~/.ssh/authorized_keys</code>, <code>/tmp</code>."],
    ["Dead-box vs live forensics?", "<b>Dead-box</b>: analysis of a powered-off system's disk image. <b>Live</b>: collecting volatile data from a running system (memory, network connections), which changes the system slightly and must be documented."],
    ["Why might you NOT pull the plug on a running suspect system?", "You would lose memory evidence (keys, injected code, network state), and full-disk encryption may lock the disk. Capture volatile data first when you can."],
    ["What are common anti-forensics techniques?", "Log clearing (Event 1102), timestomping, secure deletion, encryption, fileless/in-memory execution, and using LOLBins to blend in."],
    ["What is the Locard exchange principle?", "Every contact leaves a trace: the perpetrator both takes something from and leaves something at the scene. In digital terms, attackers leave artifacts."]
  ]);

  // ---------------- p3-m4 Malware Analysis Fundamentals ----------------
  add("p3-m4", [
    ["Static vs dynamic analysis?", "<b>Static</b>: examining the file without running it (hashes, strings, PE headers, disassembly). <b>Dynamic</b>: running it in a controlled environment and observing its behavior."],
    ["Essential precautions for a malware lab?", "An isolated VM with snapshots, host-only or simulated networking (INetSim/FakeNet-NG), no shared folders or clipboard, and samples stored in password-protected archives (password 'infected')."],
    ["What can <code>strings</code> reveal?", "Embedded URLs, IPs, file paths, registry keys, commands, error messages and API names. FLOSS also recovers obfuscated and stack strings."],
    ["What does the PE Import Address Table (IAT) tell you?", "Which Windows APIs the binary uses, e.g. <code>VirtualAlloc</code>/<code>WriteProcessMemory</code>/<code>CreateRemoteThread</code> suggest injection, and <code>InternetOpenUrl</code> suggests network activity."],
    ["How can you tell if a sample is packed?", "High section entropy (about 7+), few imports (e.g. only LoadLibrary/GetProcAddress), unusual section names (UPX0), and a small raw size versus a large virtual size."],
    ["Common online sandboxes?", "ANY.RUN (interactive), Joe Sandbox, Hybrid Analysis, Triage, and self-hosted CAPE. Remember that uploads to public services may be visible to others and to the attacker."],
    ["What does Procmon capture?", "Sysinternals Process Monitor records real-time file system, registry, process/thread and network activity, which is useful for spotting dropped files and persistence."],
    ["What is CyberChef good for?", "The 'Cyber Swiss Army Knife': decoding and deobfuscating data (Base64, XOR, gzip, hex, regex extraction) through chained recipes in a browser."],
    ["Structure of a YARA rule?", "<code>rule Name { meta: ... strings: $a = \"evil\" $b = { 6A 40 68 } condition: $a and $b }</code>"],
    ["What is process injection / hollowing?", "Running malicious code inside another legitimate process to evade defenses (ATT&amp;CK T1055). <b>Hollowing</b> starts a suspended process, removes its code and replaces it with the payload."],
    ["Dropper vs loader vs downloader?", "A <b>dropper</b> carries the payload inside itself. A <b>downloader</b> fetches it from the internet. A <b>loader</b> loads or executes the next stage (often in memory) and may do either."],
    ["What is an infostealer?", "Malware that harvests browser passwords, cookies and session tokens, crypto wallets and system info (e.g. Lumma, RedLine). Stolen sessions often lead to account takeovers."],
    ["What anti-analysis tricks does malware use?", "VM/sandbox detection (checking for VMware tools, low RAM/CPU, no user activity), debugger checks, sleep delays, obfuscation and environment keying."],
    ["Common reverse engineering tools?", "Disassemblers/decompilers: <b>Ghidra</b> (NSA, free), IDA, Binary Ninja. Debuggers: <b>x64dbg</b>, WinDbg. .NET: dnSpyEx. PE viewers: PE-bear, pestudio, Detect It Easy."],
    ["What is C2 and common C2 channels?", "Command and Control: how malware receives tasks and sends data. Channels include HTTPS (most common), DNS, cloud services and social media. Frameworks: Cobalt Strike, Sliver, Havoc."],
    ["Typical ransomware behaviors before encryption?", "Deleting shadow copies (<code>vssadmin delete shadows</code>), stopping backup/database services, turning off security tools, exfiltrating data, then mass file renames with ransom notes."],
    ["Why do analysts record the hash and not just the filename?", "Filenames are trivial to change. Cryptographic hashes (SHA-256) uniquely identify a sample for sharing and lookups. Fuzzy hashes (ssdeep, TLSH) find similar variants."],
    ["What is an imphash?", "A hash of a PE file's import table. It can cluster samples built from the same source or by the same builder."],
    ["What should a malware analysis report include?", "Hashes, file type, capabilities, IOCs (network and host), persistence, ATT&amp;CK mapping, detection rules (YARA/Sigma) and remediation guidance."]
  ]);

  // ---------------- p3-m5 Threat Hunting ----------------
  add("p3-m5", [
    ["What is threat hunting?", "Proactive, human-led searching for threats that evaded existing detections, based on the assumption that a breach has already happened."],
    ["Hypothesis-driven vs intel-driven vs data-driven hunts?", "<b>Hypothesis</b>: 'If attackers did X, we'd see Y.' <b>Intel-driven</b>: based on new threat reports or IOCs/TTPs. <b>Data-driven/analytics</b>: explore anomalies and outliers in the data."],
    ["What is the PEAK framework?", "Splunk's hunting framework with three phases (Prepare, Execute, Act with Knowledge) and three hunt types: hypothesis-driven, baseline (exploratory) and model-assisted (M-ATH)."],
    ["What is the Hunting Maturity Model (HMM)?", "Sqrrl/David Bianco's model with levels HM0 Initial (relies on alerts) → HM1 Minimal (IOC searches) → HM2 Procedural → HM3 Innovative → HM4 Leading (automates successful hunts)."],
    ["What is stacking (long-tail analysis)?", "Counting how often each value occurs (process names, autoruns, user agents) across the fleet and investigating the rare outliers."],
    ["What is the output of a good hunt, even with no findings?", "Documented queries, data gaps found, a better baseline, and <b>new or improved automated detections</b>. Turning hunts into detections is the main value."],
    ["How do you hunt for Kerberoasting?", "Look at Event <b>4769</b> for service tickets with encryption type <b>0x17 (RC4)</b>, especially many SPNs requested by one account in a short time."],
    ["Indicators of pass-the-hash in Windows logs?", "4624 Logon Type 3 with NTLM authentication from unusual sources, or Logon Type 9 with logon process <code>seclogo</code> (overpass-the-hash, e.g. Mimikatz sekurlsa::pth)."],
    ["How might you hunt for a Golden Ticket?", "TGS requests (4769) with no matching TGT request (4768) on the DC, tickets with abnormal lifetimes, and account/domain field anomalies. The definitive fix is to rotate krbtgt twice."],
    ["How do you hunt for beaconing?", "Group connections by source/destination and analyze the time between connections for low variance, plus consistent bytes, rare destinations and long duration (tools: RITA)."],
    ["Hunting LOLBin abuse?", "Search process creation events for <code>certutil -urlcache</code>, <code>mshta http</code>, <code>rundll32</code> with unusual DLL paths, <code>regsvr32 /i:http</code>, and odd parents spawning these binaries."],
    ["What data do you need before starting a hunt?", "Relevant, retained telemetry (process creation with command lines, authentication, DNS, proxy, EDR), known baselines, and access to query it at scale."],
    ["Why is baselining essential for hunting?", "You can only spot abnormal if you know normal: typical admin tools, logon hours, service accounts and network destinations."],
    ["How does ATT&amp;CK support hunting?", "It gives a structured menu of techniques to form hypotheses, track which techniques have been hunted, and map findings and new detections."],
    ["What is the hunting loop?", "Create a hypothesis → investigate with tools and techniques → uncover new patterns and TTPs → inform and enrich analytics, then repeat."],
    ["Example hunting hypothesis for persistence?", "'An attacker created new services or scheduled tasks on servers in the last 30 days.' Hunt 7045/4697/4698 for rare names, odd binary paths (e.g. in <code>%TEMP%</code>) and unusual creators."],
    ["How do you hunt for suspicious DNS?", "Look for rare or newly seen domains, high-entropy/DGA-looking names, long subdomains, direct-to-IP lookups and excessive NXDOMAIN responses from one host."],
    ["How do you measure hunting program success?", "Hunts completed, detections created from hunts, incidents found by hunting, data gaps closed, and ATT&amp;CK techniques covered. Not just 'threats found'."]
  ]);

  // ---------------- p4-m1 Cloud Security ----------------
  add("p4-m1", [
    ["What is the shared responsibility model?", "The cloud provider secures the cloud (physical, hypervisor, core services). The customer secures what they put <i>in</i> the cloud: data, identities, configuration. How much the customer owns depends on IaaS, PaaS or SaaS."],
    ["IaaS vs PaaS vs SaaS: what does the customer manage?", "<b>IaaS</b>: OS, apps, data, network config. <b>PaaS</b>: apps and data. <b>SaaS</b>: data, users and access configuration. Data and identity are always the customer's."],
    ["NIST's five essential cloud characteristics (SP 800-145)?", "On-demand self-service, broad network access, resource pooling, rapid elasticity, measured service."],
    ["Cloud deployment models?", "Public, private, community and hybrid. Multi-cloud means using several providers."],
    ["What is the #1 cause of cloud breaches?", "<b>Misconfiguration and identity weaknesses</b>: public storage buckets, over-privileged roles, exposed access keys, missing MFA."],
    ["CSPM vs CWPP vs CNAPP?", "<b>CSPM</b> finds cloud misconfigurations. <b>CWPP</b> protects workloads (VMs, containers, serverless). <b>CNAPP</b> unifies both plus CIEM, IaC scanning and more in one platform."],
    ["What is a CASB?", "A Cloud Access Security Broker sits between users and SaaS to provide visibility (shadow IT), DLP, access control and threat protection."],
    ["AWS: key audit log and threat detection services?", "<b>CloudTrail</b> (API activity), <b>GuardDuty</b> (threat detection), <b>Security Hub</b> (aggregation/posture), VPC Flow Logs, AWS Config."],
    ["Azure: key logs and security services?", "<b>Activity Log</b> (control plane), Entra ID sign-in and audit logs, <b>Microsoft Defender for Cloud</b> (CSPM/CWPP), <b>Microsoft Sentinel</b> (SIEM)."],
    ["Google Cloud: key logs and security services?", "Cloud Audit Logs (Admin Activity, Data Access), <b>Security Command Center</b>, VPC Flow Logs, Google Security Operations (SIEM)."],
    ["Why enforce IMDSv2 on AWS EC2?", "IMDSv2 requires a session token (PUT request), which blocks most SSRF attacks that steal instance role credentials from <code>169.254.169.254</code> (as in the 2019 Capital One breach)."],
    ["Why are long-lived access keys dangerous?", "They leak through code repos, laptops and CI logs and never expire. Prefer short-lived credentials: IAM roles, workload identity federation, OIDC for CI/CD."],
    ["What is CIEM?", "Cloud Infrastructure Entitlement Management: analyzes cloud identities and their effective permissions to remove excessive privilege."],
    ["Key container/Kubernetes security controls?", "Scan images, use minimal base images, don't run as root, use Kubernetes RBAC, network policies, Pod Security Admission, secrets management, and audit logs."],
    ["What is IaC scanning?", "Static analysis of Infrastructure as Code (Terraform, CloudFormation, Bicep) to catch misconfigurations before deployment (e.g. Checkov, tfsec/Trivy)."],
    ["What is the CSA Cloud Controls Matrix (CCM)?", "The Cloud Security Alliance's cloud-specific control framework, mapped to ISO 27001, NIST and others. STAR is CSA's registry of provider assessments."],
    ["Customer-managed keys vs provider-managed keys?", "With <b>CMK</b> (in KMS/Key Vault) you control rotation, policies and revocation. BYOK/HYOK give still more control. Provider-managed keys are simpler but give you less control."],
    ["Common indicators of cloud account compromise?", "API calls from new geographies or Tor, sudden creation of access keys or users, disabled logging (e.g. CloudTrail <code>StopLogging</code>), crypto-mining instances, mass downloads from storage."],
    ["What is a serverless security concern?", "Over-privileged function roles, injection through event inputs, vulnerable dependencies, and limited visibility. Apply least privilege for each function."]
  ]);

  // ---------------- p4-m2 Application & API Security ----------------
  add("p4-m2", [
    ["OWASP Top 10 <b>2025</b>, A01–A05?", "A01 Broken Access Control, A02 Security Misconfiguration, A03 Software Supply Chain Failures, A04 Cryptographic Failures, A05 Injection."],
    ["OWASP Top 10 <b>2025</b>, A06–A10?", "A06 Insecure Design, A07 Authentication Failures, A08 Software or Data Integrity Failures, A09 Security Logging &amp; Alerting Failures, A10 Mishandling of Exceptional Conditions."],
    ["What changed for SSRF in the OWASP Top 10 2025?", "SSRF (its own category, A10, in 2021) was folded into <b>A01 Broken Access Control</b>."],
    ["What is IDOR?", "Insecure Direct Object Reference: changing an identifier (e.g. <code>/invoice?id=1002</code>) gives access to another user's data because the server does no authorization check. It is a form of broken access control."],
    ["OWASP API Security Top 10 (2023): API1 and API3?", "API1 <b>Broken Object Level Authorization (BOLA)</b>. API3 <b>Broken Object Property Level Authorization</b> (excessive data exposure plus mass assignment)."],
    ["OWASP API Security Top 10 (2023): API2, API4, API5?", "API2 Broken Authentication, API4 Unrestricted Resource Consumption, API5 Broken Function Level Authorization."],
    ["OWASP API Security Top 10 (2023): API6–API10?", "API6 Unrestricted Access to Sensitive Business Flows, API7 SSRF, API8 Security Misconfiguration, API9 Improper Inventory Management, API10 Unsafe Consumption of APIs."],
    ["Best defense against SQL injection?", "Parameterized queries / prepared statements (or a safe ORM), plus input validation and least-privilege database accounts."],
    ["Best defenses against XSS?", "Context-aware output encoding, framework auto-escaping, a Content Security Policy, sanitizing any HTML input, and <code>HttpOnly</code> cookies."],
    ["Secure cookie attributes?", "<code>Secure</code> (HTTPS only), <code>HttpOnly</code> (no JavaScript access), <code>SameSite=Lax/Strict</code> (CSRF defense), and narrow <code>Domain</code>/<code>Path</code>."],
    ["SAST vs DAST vs IAST vs SCA?", "<b>SAST</b> analyzes source code (white-box). <b>DAST</b> tests the running app from outside (black-box). <b>IAST</b> instruments the running app. <b>SCA</b> finds vulnerable third-party dependencies."],
    ["What is a JWT and a common mistake with it?", "A JSON Web Token: base64url header.payload.signature. Mistakes include accepting <code>alg: none</code>, weak HMAC secrets, not validating expiry or audience, and storing sensitive data in the (readable) payload."],
    ["What does CORS do, and what is a dangerous misconfiguration?", "Cross-Origin Resource Sharing lets servers allow specific cross-origin browser requests. Dangerous: reflecting any Origin while also sending <code>Access-Control-Allow-Credentials: true</code>."],
    ["What is SSRF?", "Server-Side Request Forgery: the attacker makes the server request internal resources (e.g. cloud metadata at 169.254.169.254). Defenses: allowlists, network egress restrictions, IMDSv2."],
    ["What is shift-left security?", "Building security into the earliest stages of development (threat modeling, secure coding, SAST in the IDE and CI) instead of testing only before release."],
    ["Why rate-limit APIs?", "To prevent brute force, credential stuffing, scraping and resource exhaustion (API4: Unrestricted Resource Consumption)."],
    ["What is mass assignment?", "The API binds client-supplied fields straight to object properties, so an attacker can set fields like <code>isAdmin=true</code>. Use explicit allowlists of writable fields."],
    ["Key security headers?", "<code>Content-Security-Policy</code>, <code>Strict-Transport-Security</code> (HSTS), <code>X-Content-Type-Options: nosniff</code>, <code>Referrer-Policy</code>, and frame protections (<code>frame-ancestors</code> / <code>X-Frame-Options</code>)."],
    ["What is threat modeling with STRIDE?", "Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege. Apply it to each data-flow element to find design flaws early."]
  ]);

  // ---------------- p4-m3 Governance, Risk & Compliance ----------------
  add("p4-m3", [
    ["Basic qualitative risk formula?", "<b>Risk = Likelihood × Impact</b> (often scored 1–5 on a heat map)."],
    ["How are SLE and ALE calculated?", "<b>SLE</b> = Asset Value × Exposure Factor. <b>ALE</b> = SLE × ARO (Annualized Rate of Occurrence)."],
    ["Example: asset $200k, EF 25%, ARO 0.5. What is the ALE?", "SLE = 200,000 × 0.25 = $50,000. ALE = 50,000 × 0.5 = <b>$25,000/year</b>."],
    ["Four risk treatment options?", "<b>Mitigate/reduce</b> (controls), <b>Transfer/share</b> (insurance, contracts), <b>Avoid</b> (stop the activity), <b>Accept</b> (a documented decision)."],
    ["Risk appetite vs risk tolerance?", "<b>Appetite</b>: the overall amount of risk the organization is willing to pursue. <b>Tolerance</b>: the acceptable deviation for a specific objective or risk."],
    ["Inherent vs residual risk?", "<b>Inherent</b>: risk before controls. <b>Residual</b>: risk remaining after controls. Residual risk must sit within appetite and be accepted by the risk owner."],
    ["NIST CSF 2.0 six functions?", "<b>Govern</b> (new in 2.0), <b>Identify</b>, <b>Protect</b>, <b>Detect</b>, <b>Respond</b>, <b>Recover</b>. Released February 2024."],
    ["NIST CSF Tiers?", "Tier 1 Partial, Tier 2 Risk Informed, Tier 3 Repeatable, Tier 4 Adaptive. They describe the rigor of cybersecurity risk governance and management."],
    ["What are CSF Profiles?", "A <b>Current Profile</b> (outcomes achieved today) and a <b>Target Profile</b> (desired outcomes). The gap between them drives the action plan."],
    ["NIST RMF (SP 800-37 Rev. 2) steps?", "Prepare, Categorize, Select, Implement, Assess, Authorize, Monitor."],
    ["ISO/IEC 27001:2022 Annex A structure?", "<b>93 controls</b> in 4 themes: Organizational (37), People (8), Physical (14), Technological (34). Organizations are certified against the ISMS requirements (clauses 4–10)."],
    ["SOC 2 Type I vs Type II?", "<b>Type I</b>: control design at a single point in time. <b>Type II</b>: design <i>and</i> operating effectiveness over a period (usually 6–12 months), which carries more assurance."],
    ["Current PCI DSS version?", "<b>PCI DSS v4.0.1</b>. v3.2.1 retired in March 2024, and the future-dated v4 requirements became mandatory on 31 March 2025."],
    ["Policy vs standard vs procedure vs guideline?", "<b>Policy</b>: high-level mandatory intent. <b>Standard</b>: mandatory specific requirements. <b>Procedure</b>: step-by-step instructions. <b>Guideline</b>: recommended, not mandatory."],
    ["HIPAA: what does it protect, and which rules matter?", "US health information (PHI). The Privacy Rule, the Security Rule (administrative, physical and technical safeguards for ePHI) and the Breach Notification Rule."],
    ["CIS Critical Security Controls?", "<b>18 controls</b> in v8/v8.1, prioritized into Implementation Groups IG1 (essential cyber hygiene), IG2 and IG3."],
    ["What is the EU NIS2 Directive?", "EU cybersecurity law for essential and important entities, applying from October 2024. It requires risk management, management accountability and an early warning within 24 hours of a significant incident."],
    ["What is DORA?", "The EU Digital Operational Resilience Act for financial entities, applying from 17 January 2025: ICT risk management, incident reporting, resilience testing and third-party (ICT provider) oversight."],
    ["What is third-party / vendor risk management?", "Assessing and monitoring suppliers' security through due diligence questionnaires, SOC 2/ISO reports, contract clauses (right to audit, breach notice), tiering by criticality and ongoing monitoring."],
    ["What is a risk register?", "A record of identified risks with description, owner, likelihood, impact, score, treatment, controls, residual risk and review dates."]
  ]);

  // ---------------- p4-m4 AI & LLM Security ----------------
  add("p4-m4", [
    ["OWASP Top 10 for LLM Applications <b>2025</b>, LLM01–LLM05?", "LLM01 Prompt Injection, LLM02 Sensitive Information Disclosure, LLM03 Supply Chain, LLM04 Data and Model Poisoning, LLM05 Improper Output Handling."],
    ["OWASP Top 10 for LLM Applications <b>2025</b>, LLM06–LLM10?", "LLM06 Excessive Agency, LLM07 System Prompt Leakage, LLM08 Vector and Embedding Weaknesses, LLM09 Misinformation, LLM10 Unbounded Consumption."],
    ["Direct vs indirect prompt injection?", "<b>Direct</b>: the user types malicious instructions. <b>Indirect</b>: instructions hidden in content the model processes (web pages, emails, documents, tool outputs) hijack its behavior."],
    ["Why is prompt injection hard to fully fix?", "LLMs mix instructions and data in the same channel, so no filter is perfect. Use defense in depth: least privilege for tools, human approval for risky actions, output validation, and treating model output as untrusted."],
    ["What is Excessive Agency (LLM06)?", "Giving an LLM agent too much functionality, permission or autonomy, so that a manipulated model can take damaging actions. Limit tools and scopes and require human confirmation."],
    ["What is Improper Output Handling (LLM05)?", "Passing LLM output to other systems without validation, which can lead to XSS, SQL injection or command execution. Treat model output like user input."],
    ["What is data / model poisoning?", "Manipulating training, fine-tuning or embedding data to insert backdoors, biases or vulnerabilities into a model's behavior."],
    ["What are vector and embedding weaknesses (LLM08)?", "Risks in RAG systems: unauthorized access across tenants in vector stores, poisoned documents, embedding inversion that leaks the source text."],
    ["What is MITRE ATLAS?", "Adversarial Threat Landscape for AI Systems: an ATT&amp;CK-style knowledge base of adversary tactics and techniques against ML/AI systems, with case studies."],
    ["NIST AI RMF (AI 100-1) core functions?", "<b>Govern</b>, <b>Map</b>, <b>Measure</b>, <b>Manage</b>. NIST AI 600-1 is its Generative AI profile (2024)."],
    ["What is ISO/IEC 42001?", "The international standard (2023) for an AI management system (AIMS). It is certifiable, much like ISO 27001 is for an ISMS."],
    ["What is the EU AI Act?", "The EU's risk-based AI law (in force August 2024, applying in phases from 2025). It bans unacceptable-risk practices, imposes strict duties on high-risk systems and sets obligations for general-purpose AI models."],
    ["What is a jailbreak?", "A prompt technique that gets a model to ignore its safety guidelines (role-play, obfuscation, many-shot). It is related to prompt injection but aimed at bypassing the model's own safeguards."],
    ["What are membership inference and model inversion?", "<b>Membership inference</b>: working out whether a given record was in the training data. <b>Model inversion</b>: reconstructing sensitive training data from model outputs. Both are privacy attacks."],
    ["What is System Prompt Leakage (LLM07)?", "The system prompt reveals secrets or internal logic. Never put credentials or authorization logic in prompts; enforce them outside the model."],
    ["How does the SOC use AI today?", "Alert summarization and triage, query generation (natural language to KQL/SPL), report drafting, and agentic investigation assistants. Analysts must verify outputs, because AI can hallucinate."],
    ["What is shadow AI and how do you control it?", "Staff using unapproved AI tools with corporate data. Control it with acceptable-use policy, approved enterprise tools, DLP/CASB monitoring and training."],
    ["What is Unbounded Consumption (LLM10)?", "Uncontrolled inference requests that cause denial of service, runaway costs ('denial of wallet') or model extraction. Mitigate with rate limits, quotas and input size limits."],
    ["Key controls for securing an LLM agent with tools (e.g. MCP servers)?", "Least-privilege tool scopes, allowlisted tools and servers, sandboxed execution, human-in-the-loop for sensitive actions, logging of prompts and tool calls, and treating retrieved content as untrusted."]
  ]);

  // ---------------- p4-m5 Landing the Job ----------------
  add("p4-m5", [
    ["What is the STAR method?", "A way to answer behavioral interview questions: <b>Situation</b>, <b>Task</b>, <b>Action</b>, <b>Result</b>. Quantify the result where you can."],
    ["What should an entry-level SOC resume emphasize?", "Hands-on skills (SIEM queries, log analysis, home lab projects), certifications, relevant tools, write-ups and quantified results, tailored to the job description's keywords for ATS."],
    ["Why build a home lab?", "It proves practical skill: e.g. an AD domain, a Sysmon-equipped Windows host, a SIEM (Splunk Free, Elastic, Wazuh, Sentinel trial) and attack simulation (Atomic Red Team). Document it publicly."],
    ["What makes a strong portfolio?", "A GitHub repo or blog with lab write-ups, detection rules, scripts, CTF/BTLO/LetsDefend walkthroughs, and an incident report written as if for a real manager."],
    ["Practice platforms for SOC skills?", "TryHackMe (SOC Level 1 path), LetsDefend, Blue Team Labs Online, CyberDefenders, Hack The Box Sherlocks, Splunk Boss of the SOC datasets."],
    ["Classic technical interview question: 'What happens when you type a URL?'", "DNS resolution → TCP handshake → TLS handshake → HTTP request → server response → browser rendering. Mention caching, certificates and where security controls inspect traffic."],
    ["How should you answer 'Walk me through how you'd triage this alert'?", "Read the alert and its logic → gather context (user, host, asset criticality) → check related logs and IOC reputation → decide TP/FP with your reasoning → contain/escalate per playbook → document."],
    ["Common entry-level security certifications?", "CompTIA Security+ (DoD 8140 baseline), CySA+, Blue Team Level 1, Microsoft SC-200, ISC2 CC (Certified in Cybersecurity), GIAC GSEC/GCIH for those with employer funding."],
    ["What is the ISC2 CC certification?", "Certified in Cybersecurity: an entry-level ISC2 credential that needs no experience. Useful as a first step toward the CISSP and the ISC2 community."],
    ["CISSP experience requirement?", "At least <b>5 years</b> of cumulative, paid, full-time work experience in 2 or more of the 8 CBK domains. A 4-year degree or an approved credential can waive 1 year."],
    ["What is the Associate of ISC2 path?", "Pass the CISSP exam without the required experience to become an <b>Associate of ISC2</b>. You then have 6 years to earn the 5 years of experience and get endorsed."],
    ["Good questions to ask the interviewer?", "Ask about SOC size and shift model, tooling (SIEM, EDR), alert volume, training and certification budget, career progression from Tier 1, and how success is measured."],
    ["How can you network effectively in security?", "Local BSides conferences, ISSA/ISC2/OWASP chapters, Discord/Slack communities, LinkedIn posts about your labs, and informational interviews."],
    ["What are 'soft skills' that SOC managers screen for?", "Clear written communication (tickets and reports), curiosity, calm under pressure, teamwork across shifts, attention to detail, and admitting what you don't know."],
    ["What is an ATS and how do you beat it?", "An Applicant Tracking System scans resumes for keywords. Use a simple format, standard headings and the job's actual terms (e.g. 'SIEM', 'Splunk', 'incident response')."],
    ["How should you handle a question you can't answer?", "Be honest, explain how you'd find the answer (documentation, lab test, a colleague) and connect it to something related you do know. Interviewers value your reasoning process."],
    ["What are CPEs?", "Continuing Professional Education credits, which keep certifications active, e.g. CISSP requires 120 CPEs per 3-year cycle (at least 40 per year) plus an annual maintenance fee."],
    ["Typical early-career progression in SecOps?", "SOC Analyst Tier 1 → Tier 2 / Incident Responder → specializations (threat hunting, detection engineering, DFIR, CTI, cloud security) or management (SOC lead, then manager)."]
  ]);

  // ---------------- p5-d1 Security & Risk Management ----------------
  add("p5-d1", [
    ["The four ISC2 Code of Ethics canons, in order?", "1. Protect society, the common good, necessary public trust and confidence, and the infrastructure. 2. Act honorably, honestly, justly, responsibly and legally. 3. Provide diligent and competent service to principals. 4. Advance and protect the profession."],
    ["Due care vs due diligence?", "<b>Due diligence</b>: investigating and understanding risks (doing your homework). <b>Due care</b>: acting on that knowledge, i.e. doing what a reasonable person would do (prudent person rule)."],
    ["Who is ultimately responsible for security in an organization?", "<b>Senior management</b> / the board. They can delegate tasks but not accountability."],
    ["Define MTD, RTO, RPO and WRT.", "<b>MTD</b>: the longest a process can be down before unacceptable harm. <b>RTO</b>: target time to restore the system. <b>RPO</b>: maximum tolerable data loss, measured in time. <b>WRT</b>: time to verify and resume work after restore. <b>RTO + WRT ≤ MTD</b>."],
    ["What is a Business Impact Analysis (BIA)?", "It identifies critical business processes, their dependencies and the impact of disruption over time, and from that sets MTD, RTO and RPO. It is the foundation of BCP."],
    ["How is the value of a safeguard calculated?", "<b>(ALE before − ALE after) − annual cost of the safeguard</b>. A positive value means the control is cost-justified."],
    ["Quantitative vs qualitative risk analysis?", "<b>Quantitative</b> uses monetary values (AV, EF, SLE, ARO, ALE). <b>Qualitative</b> uses ratings and scenarios (high/medium/low, Delphi technique). Most organizations combine them."],
    ["Criminal vs civil vs administrative law?", "<b>Criminal</b>: offenses against society (prison, fines; proof beyond reasonable doubt). <b>Civil</b>: disputes between parties (damages; preponderance of evidence). <b>Administrative</b>: regulations from government agencies."],
    ["Patent vs copyright vs trademark vs trade secret?", "<b>Patent</b>: inventions, 20 years from filing. <b>Copyright</b>: creative works, life of the author + 70 years (US). <b>Trademark</b>: brand identifiers, renewable indefinitely. <b>Trade secret</b>: protected as long as it is kept secret (NDAs)."],
    ["What are the GDPR data subject rights (examples)?", "Access, rectification, erasure ('right to be forgotten'), restriction, data portability, objection, and rights related to automated decision-making. Fines up to €20M or 4% of global turnover."],
    ["Personnel security controls for fraud prevention?", "Separation of duties, job rotation, mandatory vacation (can reveal fraud), least privilege, background checks, NDAs, and formal onboarding/offboarding."],
    ["What does BCP aim for, versus DRP?", "<b>BCP</b> keeps critical business functions running during and after a disruption (business-focused). <b>DRP</b> restores IT systems and data after a disaster (technology-focused). DRP is part of BCP."],
    ["What is supply chain risk management (SCRM)?", "Managing risks from suppliers, vendors and service providers: assessments, contract requirements, SBOMs, minimum security requirements, and monitoring of third parties' third parties."],
    ["Security governance documents: which is top-level?", "The <b>policy</b>, approved by senior management. Standards, baselines, procedures and guidelines support it."],
    ["What is a security control framework, and examples?", "A structured catalog of controls: NIST SP 800-53, ISO/IEC 27001/27002, CIS Controls, COBIT (IT governance), and NIST CSF for outcomes."],
    ["Name common threat modeling methodologies.", "STRIDE (Microsoft), PASTA (risk-centric, 7 stages), VAST, DREAD (rating), Trike, and attack trees."],
    ["Awareness vs training vs education?", "<b>Awareness</b>: changing attitudes and recognizing threats (posters, phishing simulations). <b>Training</b>: teaching job-specific skills. <b>Education</b>: deeper understanding of concepts (degrees, certifications)."],
    ["What is the 'reasonable/prudent person' rule?", "The legal standard for due care: would a reasonable person in the same situation have taken the same precautions? Failing it can mean negligence."],
    ["What is Wassenaar / export control relevance to security?", "Multilateral (and national, e.g. US EAR/ITAR) export controls cover some cryptography and intrusion software, which affects cross-border tools and products."]
  ]);

  // ---------------- p5-d2 Asset Security ----------------
  add("p5-d2", [
    ["US government data classification levels?", "<b>Top Secret</b> (exceptionally grave damage), <b>Secret</b> (serious damage), <b>Confidential</b> (damage), and Unclassified (including CUI)."],
    ["Typical commercial classification levels?", "Confidential/Proprietary, Private, Sensitive/Internal, Public. The names vary by organization."],
    ["Data owner vs custodian?", "The <b>owner</b> (a senior business role) is accountable: they classify data and approve access. The <b>custodian</b> (often IT) implements the protections day to day (backups, permissions)."],
    ["Data controller vs data processor (GDPR)?", "The <b>controller</b> decides the purposes and means of processing. The <b>processor</b> processes data on the controller's behalf (e.g. a cloud or payroll provider)."],
    ["What is a data steward?", "A role responsible for data quality, metadata and business usage according to governance policy."],
    ["Three states of data and example protections?", "<b>At rest</b>: full-disk or database encryption. <b>In transit</b>: TLS, IPsec. <b>In use</b>: access controls, confidential computing/secure enclaves, memory protections."],
    ["What is data remanence?", "Residual data left on media after deletion or formatting, which can be recovered unless the media is properly sanitized."],
    ["NIST SP 800-88 sanitization categories?", "<b>Clear</b> (logical overwrite; protects against simple recovery), <b>Purge</b> (protects against lab attacks, e.g. crypto erase, degaussing, block erase), <b>Destroy</b> (shred, disintegrate, incinerate)."],
    ["Does degaussing work on SSDs?", "No. Degaussing affects only magnetic media (HDDs, tapes). For SSDs use crypto erase, the vendor's secure erase/sanitize, or physical destruction."],
    ["What is crypto-shredding (cryptographic erasure)?", "Destroying the encryption keys so the encrypted data can no longer be read. It is common in cloud environments, where physical destruction is impossible."],
    ["Scoping vs tailoring a baseline?", "<b>Scoping</b>: choosing which baseline controls apply to the system. <b>Tailoring</b>: modifying the selected controls to fit the organization (parameters, compensating controls)."],
    ["Pseudonymization vs anonymization vs tokenization?", "<b>Pseudonymization</b> replaces identifiers but can be reversed with extra data (still personal data under GDPR). <b>Anonymization</b> is irreversible. <b>Tokenization</b> swaps data for a token held in a secure vault (common for PCI)."],
    ["Marking vs labeling?", "<b>Labeling</b>: system-readable classification metadata on data. <b>Marking</b>: human-readable classification (headers, stamps, physical labels on media)."],
    ["What does DLP do?", "Data Loss Prevention finds and controls sensitive data (by pattern, fingerprint or classification) at rest, in motion (email, web) and on endpoints (USB, print) to stop unauthorized exfiltration."],
    ["Typical data lifecycle phases?", "Create/collect → store → use → share → archive → destroy (CSA: Create, Store, Use, Share, Archive, Destroy)."],
    ["Why is data retention policy important?", "Keeping data too long increases breach impact and legal discovery exposure. Keeping it too short breaks legal and regulatory requirements. Define retention by data type and law."],
    ["What is DRM?", "Digital Rights Management: persistent controls (encryption plus usage policies) that travel with content and restrict copying, printing or forwarding."],
    ["EOL vs EOS for assets?", "<b>End of Life</b>: the vendor stops selling the product. <b>End of Support</b>: no more patches or support. EOS assets need replacement or compensating controls."],
    ["Why does asset classification come before control selection?", "The value and sensitivity of an asset determine how much protection is justified. Without classification you over- or under-protect."]
  ]);

  // ---------------- p5-d3 Security Architecture & Engineering ----------------
  add("p5-d3", [
    ["Bell-LaPadula model rules?", "A <b>confidentiality</b> model. Simple Security: <b>no read up</b>. Star (*) property: <b>no write down</b>. Strong star: read and write only at your own level."],
    ["Biba model rules?", "An <b>integrity</b> model. Simple Integrity: <b>no read down</b>. Star Integrity: <b>no write up</b>. (The inverse of Bell-LaPadula.)"],
    ["Clark-Wilson model key ideas?", "An integrity model for commercial use: well-formed transactions through <b>Transformation Procedures</b> acting on <b>Constrained Data Items</b>, checked by Integrity Verification Procedures, and the access triple (subject–program–object) with separation of duties."],
    ["Brewer-Nash model?", "The <b>Chinese Wall</b>: access controls that change dynamically to prevent conflicts of interest. Once you access one client's data, you are blocked from its competitors' data."],
    ["Other formal models to recognize?", "Graham-Denning (8 protection rights), Harrison-Ruzzo-Ullman (rights changes, safety problem), Take-Grant (directed graph), Lattice-based, State Machine, Information Flow, Non-interference."],
    ["What is the reference monitor concept?", "An abstract machine that mediates <b>all</b> subject access to objects. It must be tamper-proof, always invoked and small enough to verify. The <b>security kernel</b> implements it."],
    ["What is the Trusted Computing Base (TCB)?", "All the hardware, firmware and software components that enforce the security policy. The security perimeter separates it from the rest of the system."],
    ["Common Criteria EAL levels?", "EAL1 (functionally tested) to EAL7 (formally verified design and tested). The <b>Protection Profile</b> holds the requirements and the <b>Security Target</b> holds the vendor's claims. ISO/IEC 15408."],
    ["How many keys are needed for n users: symmetric vs asymmetric?", "Symmetric: <b>n(n−1)/2</b>. Asymmetric: <b>2n</b> (one key pair per user). E.g. 100 users = 4,950 symmetric keys vs 200 asymmetric."],
    ["Saltzer &amp; Schroeder secure design principles (examples)?", "Economy of mechanism, fail-safe defaults, complete mediation, open design, separation of privilege, least privilege, least common mechanism, psychological acceptability."],
    ["What are side-channel attacks?", "Attacks that exploit physical leakage (timing, power consumption, electromagnetic emanations, acoustic, cache behavior) instead of algorithm flaws, e.g. Spectre/Meltdown."],
    ["What is TEMPEST?", "Standards and countermeasures for unwanted electromagnetic emanations (shielding, Faraday cages, white noise, control zones)."],
    ["Fire extinguisher classes (US)?", "<b>A</b>: ordinary combustibles (water/foam). <b>B</b>: flammable liquids (CO₂, foam). <b>C</b>: electrical (CO₂, clean agent; no water). <b>D</b>: combustible metals (dry powder). <b>K</b>: cooking oils (wet chemical)."],
    ["Wet pipe vs dry pipe vs pre-action vs deluge sprinklers?", "<b>Wet</b>: always full of water. <b>Dry</b>: air-filled, for freezing areas. <b>Pre-action</b>: needs two triggers, so it suits data centers. <b>Deluge</b>: all heads open at once, for high-hazard areas."],
    ["What is CPTED?", "Crime Prevention Through Environmental Design: natural surveillance, natural access control and territorial reinforcement through layout, lighting and landscaping."],
    ["Key ICS/SCADA security concerns?", "Legacy unpatched systems, insecure protocols (Modbus, DNP3 have no authentication), availability and safety as top priorities, IT/OT convergence. Use segmentation (Purdue model) and IEC 62443."],
    ["Cryptanalytic attack types to know?", "Ciphertext-only, known-plaintext, chosen-plaintext, chosen-ciphertext, brute force, meet-in-the-middle (why 2DES fails), birthday attack (hash collisions), frequency analysis, side-channel."],
    ["Protection rings in CPU architecture?", "Ring 0 kernel, rings 1–2 drivers/OS services (rarely used), ring 3 user applications. Lower numbers have more privilege."],
    ["What is the purpose of a Hardware Security Module (HSM)?", "A tamper-resistant device that generates, stores and uses cryptographic keys so they never leave in plaintext. Often validated to <b>FIPS 140-3</b>."]
  ]);

  // ---------------- p5-d4 Communication & Network Security ----------------
  add("p5-d4", [
    ["OSI layers with their PDUs?", "L7–L5: data. L4 Transport: <b>segment</b> (TCP) / <b>datagram</b> (UDP). L3 Network: <b>packet</b>. L2 Data Link: <b>frame</b>. L1 Physical: <b>bits</b>."],
    ["Which OSI layer: TLS, IPsec, ARP, switches, routers?", "Routers and IPsec: L3. Switches: L2. ARP sits between L2 and L3 (usually called L2). TLS is commonly placed at L4–L7; exams often say Transport or Presentation/Session, so read the options carefully."],
    ["Which OSI layers do the TCP/IP model layers map to?", "Application = OSI 5–7. Transport = 4. Internet = 3. Network Access/Link = 1–2."],
    ["802.1X roles?", "<b>Supplicant</b> (client), <b>Authenticator</b> (switch or wireless AP), <b>Authentication server</b> (usually RADIUS). EAP carries the credentials."],
    ["EAP methods to know?", "EAP-TLS (mutual certificates, strongest), PEAP (TLS tunnel plus MSCHAPv2), EAP-TTLS, EAP-FAST. LEAP and EAP-MD5 are insecure."],
    ["WPA2 vs WPA3?", "WPA2 uses AES-CCMP with a PSK 4-way handshake that is vulnerable to offline cracking. WPA3 uses SAE (dragonfly) with forward secrecy, mandatory PMF and 192-bit Enterprise mode."],
    ["What are converged protocols?", "Protocols that carry specialty traffic over standard IP networks: <b>FCoE</b>, <b>iSCSI</b> (storage over IP), VoIP, and MPLS (label switching)."],
    ["What is Software-Defined Networking (SDN)?", "It separates the <b>control plane</b> (a centralized controller decides routing) from the <b>data plane</b> (switches forward traffic), making the network programmable. Securing the controller is critical."],
    ["SYN flood vs Smurf vs Teardrop vs Ping of Death?", "<b>SYN flood</b>: half-open connections exhaust state. <b>Smurf</b>: ICMP echo to a broadcast address with a spoofed victim source. <b>Teardrop</b>: overlapping IP fragments. <b>Ping of Death</b>: oversized ICMP packet."],
    ["What does DNSSEC provide (and not provide)?", "Origin authentication and <b>integrity</b> of DNS data through digital signatures (RRSIG, DNSKEY, DS). It does <b>not</b> provide confidentiality; for that use DoH or DoT."],
    ["Firewall generations / types?", "Packet filter (L3/L4 stateless), stateful inspection, circuit-level gateway (L5, e.g. SOCKS), application-level proxy (L7), and NGFW (application awareness plus IPS)."],
    ["Bluejacking vs bluesnarfing vs bluebugging?", "<b>Bluejacking</b>: sending unsolicited messages. <b>Bluesnarfing</b>: stealing data. <b>Bluebugging</b>: taking control of the device. All are Bluetooth attacks."],
    ["Cabling: which resists EMI best?", "<b>Fiber optic</b>: immune to EMI and hard to tap. Shielded twisted pair (STP) and coax resist EMI better than UTP."],
    ["What is a CDN's security benefit?", "A Content Delivery Network caches content at the edge, absorbs DDoS traffic, often provides a WAF, and hides the origin server's IP."],
    ["Network topologies and their weaknesses?", "<b>Bus</b>: single cable failure. <b>Star</b>: central hub/switch is a single point of failure. <b>Ring</b>: one break disrupts the ring (unless dual). <b>Mesh</b>: most redundant, most expensive."],
    ["Common VPN protocols?", "IPsec (L3), TLS/SSL VPNs, WireGuard (modern, simple, UDP), and L2TP (usually combined with IPsec). PPTP is obsolete and insecure."],
    ["What is network access control (NAC)?", "It checks device identity and posture (patch level, AV, compliance) before granting network access, and quarantines devices that don't comply. It often uses 802.1X."],
    ["What is a VLAN hopping attack?", "Gaining access to another VLAN through <b>switch spoofing</b> (negotiating a trunk via DTP) or <b>double tagging</b>. Mitigate by turning off DTP, setting unused ports to access mode and not using VLAN 1 as native."],
    ["Circuit switching vs packet switching?", "<b>Circuit</b>: a dedicated path for the whole session (classic telephone). <b>Packet</b>: data is split into packets that may take different paths (the internet). Packet switching is more efficient."]
  ]);

  // ---------------- p5-d5 Identity & Access Management ----------------
  add("p5-d5", [
    ["Kerberos authentication flow, steps 1–2?", "<b>AS-REQ</b>: the client sends a request to the Authentication Service (KDC). <b>AS-REP</b>: the AS returns a <b>TGT</b> (encrypted with the krbtgt key) and a session key encrypted with the user's key."],
    ["Kerberos authentication flow, steps 3–5?", "<b>TGS-REQ</b>: the client presents the TGT to the Ticket Granting Service and asks for a service. <b>TGS-REP</b>: it returns a <b>service ticket</b>. <b>AP-REQ</b>: the client presents the service ticket to the target server."],
    ["Kerberos components and weaknesses?", "The KDC = Authentication Service + Ticket Granting Service. It depends on time sync (default 5-minute skew), and the KDC is a single point of failure. Attacks: Golden/Silver Tickets, Kerberoasting, AS-REP roasting."],
    ["Authentication factor 'types' in CISSP terms?", "<b>Type 1</b>: something you know. <b>Type 2</b>: something you have. <b>Type 3</b>: something you are."],
    ["Type I vs Type II biometric errors?", "<b>Type I</b> = False Rejection (FRR). <b>Type II</b> = False Acceptance (FAR), the more dangerous one. Choose a system with a low <b>CER</b>."],
    ["What is accountability, and what does it require?", "Holding subjects responsible for their actions. It requires unique <b>identification</b>, <b>authentication</b>, and <b>auditing</b> (logging)."],
    ["Identity lifecycle stages?", "Provisioning (onboarding/enrollment) → maintenance/review (role changes, recertification) → deprovisioning (revocation, disabling, eventual deletion)."],
    ["What is authorization creep / aggregation?", "Users collect permissions over time as their roles change, which violates least privilege. Fix it with periodic access reviews."],
    ["Rule-based access control vs role-based?", "<b>Rule-based</b>: global rules apply to everyone (firewall ACLs, time-of-day). <b>Role-based</b>: permissions are tied to job roles. Both are non-discretionary."],
    ["What is risk-based (adaptive) access control?", "It evaluates real-time context (location, device, behavior, threat intel) to decide access or require step-up authentication."],
    ["Session management controls?", "Idle timeouts, absolute session lifetimes, re-authentication for sensitive actions, secure random session IDs, and invalidation at logout."],
    ["What is a SAML assertion?", "An XML document signed by the IdP that contains authentication, attribute and authorization decision statements about the user."],
    ["What is Identity as a Service (IDaaS)?", "Cloud-delivered identity (e.g. Entra ID, Okta) offering SSO, MFA, lifecycle management and federation."],
    ["What is credential management / password vaulting?", "Securely storing, rotating and checking out credentials, e.g. enterprise password managers and PAM vaults with check-in/check-out and session recording."],
    ["Physical vs logical access control examples?", "<b>Physical</b>: badges, mantraps/access control vestibules, guards, locks. <b>Logical</b>: passwords, ACLs, MFA, encryption. Both are needed for defense in depth."],
    ["What is a mantrap (access control vestibule)?", "A small space with two interlocking doors. Only one can open at a time, which prevents tailgating and piggybacking."],
    ["Centralized vs decentralized access control administration?", "<b>Centralized</b>: one authority (e.g. RADIUS, AD) gives consistency. <b>Decentralized</b>: local control is flexible but inconsistent."],
    ["What is SESAME?", "Secure European System for Applications in a Multi-vendor Environment: a Kerberos-like SSO system that uses public-key cryptography and Privileged Attribute Certificates (PACs)."],
    ["What is the 'need to know' principle versus clearance?", "Clearance permits access to a classification level. Need to know restricts access to only the specific information required for the job, even at that level."]
  ]);

  // ---------------- p5-d6 Security Assessment & Testing ----------------
  add("p5-d6", [
    ["What must exist before any penetration test?", "<b>Written authorization</b> from someone with authority, plus agreed scope and <b>rules of engagement</b> (targets, timing, techniques, contacts)."],
    ["Black box vs white box vs gray box testing?", "<b>Black</b>: no prior knowledge (zero knowledge). <b>White</b>: full knowledge (code, architecture). <b>Gray</b>: partial knowledge."],
    ["Typical penetration test phases?", "Planning → Discovery/reconnaissance → Attack/exploitation (gain access, escalate, pivot) → Reporting (NIST SP 800-115)."],
    ["SOC 1 vs SOC 2 vs SOC 3?", "<b>SOC 1</b>: controls relevant to financial reporting (ICFR). <b>SOC 2</b>: Trust Services Criteria (security, availability, processing integrity, confidentiality, privacy), restricted use. <b>SOC 3</b>: public summary of SOC 2."],
    ["Fuzzing: mutation vs generation?", "<b>Mutation (dumb)</b>: alters valid input samples. <b>Generation (intelligent)</b>: builds inputs from a model of the protocol or format. Fuzzing is dynamic testing for crashes and unexpected behavior."],
    ["Static vs dynamic testing?", "<b>Static</b>: reviewing code without running it (code review, SAST). <b>Dynamic</b>: testing running software (DAST, fuzzing, penetration tests)."],
    ["What is a misuse case?", "A use case written from the attacker's perspective, showing how functionality could be abused. It is used to derive security test cases."],
    ["Synthetic transactions vs Real User Monitoring?", "<b>Synthetic</b>: scripted, scheduled transactions that proactively test functionality and performance. <b>RUM</b>: passive monitoring of actual user interactions."],
    ["Regression testing?", "Retesting after changes to make sure previously working functionality, including security controls, still works."],
    ["Interface testing?", "Testing the points where components exchange data (APIs, UIs, physical interfaces) for proper handling of valid, invalid and boundary inputs."],
    ["Test coverage formula?", "<b>Coverage = number of use cases tested ÷ total number of use cases</b>, often expressed as a percentage. Also branch, statement, condition and function coverage."],
    ["KPI vs KRI?", "A <b>Key Performance Indicator</b> measures how well something is performing (e.g. patch SLA met). A <b>Key Risk Indicator</b> is an early warning that risk is rising (e.g. number of unpatched critical systems)."],
    ["Internal vs external vs third-party audits?", "<b>Internal</b>: by the organization's own audit staff. <b>External</b>: by an outside firm for the organization. <b>Third-party</b>: by an independent party for someone else (e.g. a regulator or customer)."],
    ["What is Breach and Attack Simulation (BAS)?", "Automated, continuous tools that safely simulate attacker techniques to validate that controls detect and block them."],
    ["Vulnerability assessment vs penetration test (CISSP)?", "A VA identifies and ranks vulnerabilities without exploiting them. A pentest exploits them to show real impact and attack paths."],
    ["What should an assessment report include?", "An executive summary, methodology, scope, findings with risk ratings and evidence, and actionable remediation recommendations. Tailor it to each audience."],
    ["Why review account management as an assessment activity?", "To verify that provisioning, privileges and terminations match policy, e.g. sample terminated users to confirm their accounts were disabled promptly."],
    ["What is code review: formal inspection vs peer review?", "A <b>Fagan inspection</b> is a formal, multi-stage process (planning, overview, preparation, inspection, rework, follow-up). Peer review and pair programming are lighter-weight alternatives."],
    ["What are 'audit trails' and why protect them?", "Chronological records of system activity. Protect them (WORM storage, separate log server, hashing) because attackers try to change or delete them."]
  ]);

  // ---------------- p5-d7 Security Operations ----------------
  add("p5-d7", [
    ["Best evidence vs secondary evidence?", "<b>Best evidence</b>: the original document or item. <b>Secondary</b>: copies or oral descriptions, admissible when the original isn't available."],
    ["Direct, circumstantial, corroborative, conclusive and hearsay evidence?", "<b>Direct</b>: proves a fact by itself (a witness's own observation). <b>Circumstantial</b>: implies a fact by inference. <b>Corroborative</b>: supports other evidence. <b>Conclusive</b>: incontrovertible. <b>Hearsay</b>: second-hand (computer logs may count as hearsay unless business-records exceptions apply)."],
    ["Requirements for evidence to be admissible?", "It must be <b>relevant</b>, <b>material</b> and <b>competent</b> (legally obtained and reliable), with an intact chain of custody."],
    ["Enticement vs entrapment?", "<b>Enticement</b> (legal): giving an opportunity to someone already intending to attack, e.g. a honeypot. <b>Entrapment</b> (illegal): inducing someone to commit a crime they otherwise wouldn't have."],
    ["Full vs incremental vs differential backups?", "<b>Full</b>: everything. <b>Incremental</b>: changes since the last backup of any type (fast backup, slow restore: full + every incremental). <b>Differential</b>: changes since the last full (restore = full + latest differential)."],
    ["RAID 0, 1, 5, 6, 10?", "<b>0</b>: striping, no redundancy. <b>1</b>: mirroring. <b>5</b>: striping with parity (survives 1 disk failure). <b>6</b>: double parity (survives 2). <b>10</b>: mirrored stripes (fast plus redundant)."],
    ["Hot vs warm vs cold site?", "<b>Hot</b>: fully equipped with current data, operational in minutes to hours; most expensive. <b>Warm</b>: hardware but no current data, ready in days. <b>Cold</b>: space and power only, ready in weeks; cheapest."],
    ["DR test types from least to most disruptive?", "Checklist/read-through → structured walk-through (tabletop) → simulation → <b>parallel</b> (the alternate site runs alongside production) → <b>full interruption</b> (production shut down; riskiest)."],
    ["ISC2 incident management steps?", "Detection → Response → Mitigation → Reporting → Recovery → Remediation → Lessons Learned."],
    ["Change management vs configuration management?", "<b>Change management</b> controls the process of requesting, reviewing, approving and documenting changes. <b>Configuration management</b> maintains known baselines and inventory of system settings."],
    ["What is two-person control vs split knowledge?", "<b>Two-person control</b>: two people must be present or approve together (e.g. vault access). <b>Split knowledge</b>: no one person knows the whole secret (e.g. key parts held by different custodians)."],
    ["What is egress monitoring?", "Watching outbound traffic for data exfiltration and C2 using DLP, proxy/firewall logs, steganography detection and watermarking."],
    ["MTBF vs MTTR?", "<b>Mean Time Between Failures</b>: expected operating time between failures (reliability). <b>Mean Time To Repair</b>: average time to fix a failed component."],
    ["Investigation types?", "Administrative (internal policy), criminal (law enforcement; beyond reasonable doubt), civil (between parties; preponderance), regulatory (by government agencies), and industry standards (e.g. PCI forensic investigations)."],
    ["What is a privileged account monitoring best practice?", "Use separate admin accounts, log and review all privileged activity, use PAM session recording, and alert on use outside approved change windows."],
    ["What is sandboxing in security operations?", "Running untrusted code or files in an isolated environment to observe behavior without risking production systems."],
    ["Why is mandatory vacation a detective control?", "When someone is absent, another person does their job, which can expose ongoing fraud or irregularities that need constant upkeep."],
    ["What is a whitelist/allowlist approach to operations security?", "Only explicitly approved applications, connections or users are permitted (default deny). It is stronger than blocklisting known-bad items."],
    ["What is the first priority in any emergency or disaster (CISSP)?", "<b>Human life and safety</b> always comes first, before data, systems or property."]
  ]);

  // ---------------- p5-d8 Software Development Security ----------------
  add("p5-d8", [
    ["Typical SDLC phases?", "Requirements/initiation → design → development/coding → testing → deployment/implementation → operations &amp; maintenance → disposal. Security belongs in <b>every</b> phase, starting at requirements."],
    ["Waterfall vs Agile vs DevSecOps?", "<b>Waterfall</b>: sequential phases. <b>Agile</b>: iterative sprints and customer collaboration. <b>DevSecOps</b>: security automated and integrated into continuous CI/CD pipelines."],
    ["Software Capability Maturity Model (SW-CMM) levels?", "1 Initial, 2 Repeatable, 3 Defined, 4 Managed, 5 Optimizing. CMMI uses similar levels."],
    ["What is OWASP SAMM?", "The Software Assurance Maturity Model: a measurable framework across business functions (Governance, Design, Implementation, Verification, Operations) for improving software security."],
    ["What is the NIST SSDF?", "The Secure Software Development Framework (<b>SP 800-218</b>): practices grouped as Prepare the Organization, Protect the Software, Produce Well-Secured Software, Respond to Vulnerabilities."],
    ["Database ACID properties?", "<b>Atomicity</b> (all or nothing), <b>Consistency</b> (valid states), <b>Isolation</b> (concurrent transactions don't interfere), <b>Durability</b> (committed changes persist)."],
    ["What is polyinstantiation?", "Keeping several versions of the same record at different classification levels, so lower-cleared users cannot infer that higher-classified data exists."],
    ["Aggregation vs inference?", "<b>Aggregation</b>: combining low-sensitivity data to produce sensitive information. <b>Inference</b>: deducing sensitive information from available data. Countermeasures include polyinstantiation, cell suppression and context-dependent access control."],
    ["Coupling and cohesion: what is desirable?", "<b>Low coupling</b> (modules depend little on each other) and <b>high cohesion</b> (each module does one focused thing). Both make code easier to secure and maintain."],
    ["What is a TOCTOU vulnerability?", "Time-of-Check to Time-of-Use: a race condition where the resource changes between the security check and its use (e.g. swapping a file through a symlink)."],
    ["OOP concepts to know for the exam?", "Encapsulation (data hiding), inheritance, polymorphism, objects, classes, methods and messages. Encapsulation supports security by limiting direct access to data."],
    ["Why is code signing used?", "It proves the software's origin (authenticity) and that it hasn't been modified (integrity) since signing. It does not prove the code is safe."],
    ["Risks of acquired / third-party software?", "Unknown vulnerabilities, vendor lock-in, end of support, malicious updates (supply chain). Mitigate with vendor assessment, SCA, SBOM, contracts, escrow and testing."],
    ["What is software escrow?", "A third party holds the source code. It is released to the customer if the vendor goes out of business or fails its obligations."],
    ["Security concerns with APIs in development?", "Authentication and authorization for every call, input validation, rate limiting, versioning and inventory, avoiding excessive data exposure, and logging."],
    ["What is the role of a change advisory board (CAB) in software releases?", "It reviews and approves changes for risk, testing and rollback plans before they go into production, as part of formal change management."],
    ["What is Infrastructure as Code (IaC) security risk?", "Misconfigurations and secrets in templates are copied at scale. Mitigate with code review, IaC scanners, policy-as-code, and keeping secrets out of repos."],
    ["Fourth-generation languages (4GL) and low-code: security concern?", "They speed up development and enable citizen developers, but they can hide insecure defaults and bypass formal SDLC and security review."],
    ["What is the best time to add security to a project?", "At the <b>start</b> (requirements and design). Fixing flaws later in the lifecycle is far more expensive."]
  ]);

  // ---------------- p5-m9 Exam Strategy & the Associate Path ----------------
  add("p5-m9", [
    ["CISSP English exam format?", "Computerized Adaptive Testing (CAT): <b>100–150 questions</b> in <b>3 hours</b>. You cannot go back to earlier questions."],
    ["CISSP passing score?", "<b>700 out of 1000</b> scaled points."],
    ["CISSP domain weights (outline effective April 2024)?", "D1 16%, D2 10%, D3 13%, D4 13%, D5 13%, D6 12%, D7 13%, D8 10%."],
    ["What does 'think like a manager' mean on the CISSP?", "Choose answers that address risk, policy, governance and business objectives over hands-on technical fixes. You are an advisor, not the one typing commands."],
    ["How should you handle 'BEST', 'FIRST' or 'MOST' questions?", "Several answers may be correct. Pick the one that best fits the question's perspective. For FIRST, think about process order (e.g. assess and understand before acting)."],
    ["What always takes priority in CISSP scenario answers?", "Human safety, then following senior-management-approved policy and laws, then protecting the business."],
    ["How does CAT scoring end the exam early?", "The exam ends once the algorithm is 95% confident you are above or below the passing standard, or when you reach 150 questions or run out of time."],
    ["CISSP experience and endorsement after passing?", "Five years in 2+ domains (1-year waiver possible). After passing you must be <b>endorsed</b> by an ISC2-certified member within 9 months, or become an Associate."],
    ["How long does an Associate of ISC2 have to gain experience for the CISSP?", "<b>6 years</b> from passing the exam."],
    ["CISSP maintenance requirements?", "<b>120 CPEs</b> over the 3-year cycle (at least 40 per year), the Annual Maintenance Fee, and following the Code of Ethics."],
    ["Which ISC2 canon wins when two conflict?", "The canons are in priority order. Protecting society and the common good (canon 1) outranks duties to principals and to the profession."],
    ["Good last-week study strategy?", "Take timed practice tests to build stamina, review mistakes by domain, revisit the weakest domain(s), memorize key lists (BCP metrics, models, evidence types, SDLC), and rest before exam day."],
    ["Why are practice question scores not the whole picture?", "Question banks vary in style and difficulty. Focus on <b>why</b> each answer is right or wrong and on the managerial mindset rather than memorizing items."],
    ["What should you do if you hit a question on an unfamiliar technology?", "Use principles: eliminate answers that are absolute, technical-only, illegal or risky to life, then choose the answer that best supports risk management and policy."],
    ["What is the 'broad and shallow' nature of the CISSP?", "It covers a very wide body of knowledge (the 8-domain CBK) at a conceptual, managerial depth. Breadth matters more than deep technical expertise."],
    ["Common CISSP 'first step' answers?", "Before buying controls: do a risk assessment, get senior management support, identify and classify assets, or perform a BIA (for BCP). Understand before you act."],
    ["Which official resources help prepare?", "The ISC2 CISSP Exam Outline, the ISC2 Official Study Guide and Practice Tests, the ISC2 CBK, and the free ISC2 CC course for fundamentals."],
    ["How is the CISSP different from Security+ in question style?", "Security+ often asks for technical recall or a configuration answer. CISSP scenarios ask for the most appropriate decision from a risk and governance perspective, often with several 'correct' options."]
  ]);
})();
