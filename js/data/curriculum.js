window.CP = window.CP || {};

// Phase & module map. Content files (lessons, flashcards, questions, labs, papers)
// reference these IDs. See docs/CONTENT_SCHEMA.md.
CP.phases = [
  {
    id: "p0",
    title: "Foundations: IT & Networking",
    short: "Foundations",
    level: "Zero → IT literate",
    weeks: "4–6 weeks",
    certs: ["CompTIA A+ (optional)", "CompTIA Network+ (optional)"],
    summary: "How computers, operating systems and networks actually work. Every security skill sits on top of this — you can't defend what you don't understand.",
    outcome: "You can explain how a packet gets from a browser to a server, navigate Linux and Windows from the command line, and write a small script.",
    modules: [
      { id: "p0-m1", title: "How Computers & Operating Systems Work", summary: "Hardware, binary and hex, processes, memory, file systems and what an OS does." },
      { id: "p0-m2", title: "Networking Fundamentals", summary: "OSI and TCP/IP, IP addressing and subnetting, ports, DNS, DHCP, routing and switching." },
      { id: "p0-m3", title: "Linux Command Line", summary: "Navigating, permissions, processes, logs and the commands every analyst uses daily." },
      { id: "p0-m4", title: "Windows & Active Directory", summary: "Windows internals, the registry, Event Viewer, AD, Group Policy, Kerberos and NTLM." },
      { id: "p0-m5", title: "Scripting for Security", summary: "Python, Bash and PowerShell basics for automating analysis and parsing logs." }
    ]
  },
  {
    id: "p1",
    title: "Security Fundamentals",
    short: "Security+",
    level: "IT literate → Security literate",
    weeks: "8–10 weeks",
    certs: ["CompTIA Security+ (SY0-701)"],
    summary: "The vocabulary and core concepts of the whole field, aligned to CompTIA Security+ — the baseline cert most entry-level security job postings ask for.",
    outcome: "You can pass Security+ and talk fluently about threats, controls, crypto, identity and secure architecture.",
    modules: [
      { id: "p1-m1", title: "Core Security Concepts", summary: "CIA triad, AAA, risk vocabulary, control types and categories, defense in depth." },
      { id: "p1-m2", title: "Threats, Vulnerabilities & Attacks", summary: "Threat actors, malware families, social engineering, application and network attacks." },
      { id: "p1-m3", title: "Cryptography & PKI", summary: "Symmetric, asymmetric, hashing, certificates, TLS and post-quantum cryptography." },
      { id: "p1-m4", title: "Identity & Access Management", summary: "Authentication factors, MFA, passkeys, SSO, federation and access control models." },
      { id: "p1-m5", title: "Secure Network Architecture & Zero Trust", summary: "Firewalls, segmentation, VPNs, wireless security, IDS/IPS and zero trust." },
      { id: "p1-m6", title: "Vulnerability Management & SecOps Basics", summary: "Scanning, CVE/CVSS/EPSS/KEV, patching, hardening and security operations basics." }
    ]
  },
  {
    id: "p2",
    title: "SOC Analyst",
    short: "SOC Analyst",
    level: "Security literate → Job ready (Tier 1)",
    weeks: "10–12 weeks",
    certs: ["CompTIA CySA+ (CS0-003)", "Security Blue Team BTL1", "Microsoft SC-200", "Splunk Core Certified User"],
    summary: "The day job. Logs, SIEM queries, network and endpoint telemetry, phishing analysis and the frameworks SOCs use to describe attacks.",
    outcome: "You can work a SOC alert queue: triage, investigate with SIEM/EDR, write up findings and escalate correctly.",
    modules: [
      { id: "p2-m1", title: "Inside the SOC", summary: "Tiers, shifts, the alert lifecycle, ticketing, SOAR, metrics and writing good notes." },
      { id: "p2-m2", title: "Log Sources & Log Analysis", summary: "Windows Event IDs, Sysmon, Linux and web logs, normalization and timelines." },
      { id: "p2-m3", title: "SIEM & Detection Engineering", summary: "Splunk SPL, Sentinel KQL, Sigma rules, correlation, tuning and detection-as-code." },
      { id: "p2-m4", title: "Network Traffic Analysis", summary: "Wireshark, Zeek, Suricata, NetFlow, and spotting scans, beacons and exfiltration." },
      { id: "p2-m5", title: "Endpoint Security & EDR", summary: "EDR telemetry, process trees, PowerShell abuse, persistence and LOLBins." },
      { id: "p2-m6", title: "Phishing & Email Analysis", summary: "Headers, SPF/DKIM/DMARC, URL and attachment analysis, and user-reported phish." },
      { id: "p2-m7", title: "Threat Frameworks", summary: "MITRE ATT&CK, D3FEND, Cyber Kill Chain, Pyramid of Pain and the Diamond Model." }
    ]
  },
  {
    id: "p3",
    title: "Incident Response, Threat Intel & DFIR",
    short: "IR & DFIR",
    level: "Tier 1 → Tier 2 analyst",
    weeks: "8–10 weeks",
    certs: ["GIAC GCIH", "GIAC GCIA", "BTL2 (stretch)"],
    summary: "What happens after the alert is real: handling incidents, using threat intelligence, collecting evidence, analyzing malware and hunting proactively.",
    outcome: "You can lead the technical side of an incident, preserve evidence properly and run a hypothesis-driven hunt.",
    modules: [
      { id: "p3-m1", title: "Incident Response Lifecycle", summary: "NIST SP 800-61r3 with CSF 2.0, SANS PICERL, playbooks, comms and lessons learned." },
      { id: "p3-m2", title: "Cyber Threat Intelligence", summary: "The CTI lifecycle, IOCs vs TTPs, STIX/TAXII, TLP 2.0, MISP and enrichment." },
      { id: "p3-m3", title: "Digital Forensics", summary: "Order of volatility, chain of custody, disk and memory forensics and timelines." },
      { id: "p3-m4", title: "Malware Analysis Fundamentals", summary: "Static and dynamic analysis, sandboxes, YARA and ransomware internals." },
      { id: "p3-m5", title: "Threat Hunting", summary: "Hypothesis-driven hunting, the PEAK framework, baselining and turning hunts into detections." }
    ]
  },
  {
    id: "p4",
    title: "Cloud, AppSec, GRC & Career",
    short: "Cloud & GRC",
    level: "Well-rounded analyst",
    weeks: "6–8 weeks",
    certs: ["AWS Certified Cloud Practitioner / Security Specialty", "Microsoft SC-900", "ISC2 CC (entry)"],
    summary: "Modern environments are cloud-first, run web apps and APIs, answer to regulators — and now include AI. Plus the practical steps to land the job.",
    outcome: "You can review cloud IAM, explain the OWASP Top 10, map controls to frameworks and walk into an interview with a portfolio.",
    modules: [
      { id: "p4-m1", title: "Cloud Security", summary: "Shared responsibility, IAM, cloud logging (CloudTrail, Entra ID), CSPM/CNAPP, containers." },
      { id: "p4-m2", title: "Application & API Security", summary: "OWASP Top 10 2025, API Security Top 10, SAST/DAST/SCA, SBOM and supply chain." },
      { id: "p4-m3", title: "Governance, Risk & Compliance", summary: "NIST CSF 2.0, RMF/800-53, ISO 27001, SOC 2, PCI DSS, HIPAA, GDPR and risk math." },
      { id: "p4-m4", title: "AI & LLM Security", summary: "OWASP LLM Top 10 2025, prompt injection, MITRE ATLAS, NIST AI RMF and the EU AI Act." },
      { id: "p4-m5", title: "Landing the Job", summary: "Resume, home lab, portfolio, cert roadmap, NICE work roles and interview practice." }
    ]
  },
  {
    id: "p5",
    title: "CISSP — Associate of ISC2",
    short: "CISSP",
    level: "Analyst → Security professional",
    weeks: "12–16 weeks",
    certs: ["ISC2 CISSP (Associate of ISC2 until experience is met)"],
    summary: "The 8 domains of the CISSP Common Body of Knowledge, per the ISC2 exam outline effective April 2024. Pass the exam now, earn the full credential as your experience grows.",
    outcome: "You can pass the CISSP exam and think like a security manager: risk-first, business-aligned, policy-driven.",
    modules: [
      { id: "p5-d1", title: "Domain 1: Security & Risk Management", summary: "Ethics, governance, compliance, legal, BCP/BIA, risk management, awareness. (16%)", weight: 16 },
      { id: "p5-d2", title: "Domain 2: Asset Security", summary: "Classification, ownership, data lifecycle, data states, retention and handling. (10%)", weight: 10 },
      { id: "p5-d3", title: "Domain 3: Security Architecture & Engineering", summary: "Secure design, security models, evaluation criteria, crypto, physical security. (13%)", weight: 13 },
      { id: "p5-d4", title: "Domain 4: Communication & Network Security", summary: "Secure network design, protocols, components and channels. (13%)", weight: 13 },
      { id: "p5-d5", title: "Domain 5: Identity & Access Management", summary: "Identification, authentication, authorization models, federation, lifecycle. (13%)", weight: 13 },
      { id: "p5-d6", title: "Domain 6: Security Assessment & Testing", summary: "Assessment strategies, testing types, audits, SOC reports and metrics. (12%)", weight: 12 },
      { id: "p5-d7", title: "Domain 7: Security Operations", summary: "Investigations, logging, IR, change/config/patch management, DR and BCP. (13%)", weight: 13 },
      { id: "p5-d8", title: "Domain 8: Software Development Security", summary: "SDLC, maturity models, secure coding, software supply chain. (10%)", weight: 10 },
      { id: "p5-m9", title: "Exam Strategy & the Associate Path", summary: "Think like a manager, CAT format, question tactics, endorsement and a 12-week plan." }
    ]
  }
];

// Job-readiness checklist shown on the dashboard. Each item checked manually by the learner.
CP.milestones = [
  { id: "ms-homelab", text: "Build a home lab (VirtualBox/Proxmox + Windows + Linux + a SIEM like Splunk Free, Wazuh or Elastic)" },
  { id: "ms-github", text: "Publish 3 write-ups (lab, CTF or detection) on GitHub or a blog" },
  { id: "ms-secplus", text: "Pass CompTIA Security+ (SY0-701)" },
  { id: "ms-ctf", text: "Complete 20+ blue-team rooms/challenges (TryHackMe SOC Level 1, LetsDefend, Blue Team Labs Online, CyberDefenders)" },
  { id: "ms-soccert", text: "Earn a hands-on SOC cert (CySA+, BTL1 or SC-200)" },
  { id: "ms-resume", text: "Write a one-page, keyword-matched resume with a Projects section" },
  { id: "ms-linkedin", text: "Update LinkedIn and connect with 50 security practitioners / local ISSA, ISC2 or BSides chapters" },
  { id: "ms-apply", text: "Apply to 30+ roles (SOC Analyst, Security Analyst, IT Security Specialist, NOC/Help Desk with security duties)" },
  { id: "ms-cissp", text: "Pass the CISSP exam (Associate of ISC2)" }
];
