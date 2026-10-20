// CyberPath question bank B — Phase 5 CISSP domains (25 each) and exam strategy (10).
window.CP = window.CP || {};
CP.questions = CP.questions || [];
CP.questions.push(
  // ---- p5-d1 ----
  {
    id: "q-p5-d1-001",
    module: "p5-d1",
    difficulty: 2,
    q: "What is the PRIMARY purpose of an information security program?",
    options: [
      "To eliminate all risk to information assets",
      "To implement the newest security technologies",
      "To support the organization's mission and business objectives by managing risk to an acceptable level",
      "To pass the annual compliance audit"
    ],
    answer: 2,
    explanation: "Security exists to enable the business; governance aligns security with organizational goals and risk appetite. Eliminating all risk is impossible and would halt operations. Technology is a means, not the purpose. Compliance is one requirement among many and does not by itself mean risk is managed."
  },
  {
    id: "q-p5-d1-002",
    module: "p5-d1",
    difficulty: 2,
    q: "Who is ULTIMATELY accountable for the protection of an organization's information assets?",
    options: [
      "The CISO",
      "The system administrators",
      "The internal auditors",
      "Senior management (e.g., the board and CEO)"
    ],
    answer: 3,
    explanation: "Accountability for security cannot be delegated away; senior management owns risk decisions and due care. The CISO is responsible for running the program and advising leadership. Administrators implement controls as custodians. Auditors provide independent assurance but do not own the risk."
  },
  {
    id: "q-p5-d1-003",
    module: "p5-d1",
    difficulty: 2,
    q: "A company researches threats relevant to its industry and evaluates whether its controls are adequate, then implements and maintains the controls it selected. Which pairing BEST describes these two activities?",
    options: [
      "Researching and assessing is due diligence; implementing and maintaining reasonable controls is due care",
      "Both activities are due care",
      "Researching is due care; implementing is due diligence",
      "Both activities are risk transference"
    ],
    answer: 0,
    explanation: "Due diligence is the investigation and knowledge-gathering (\"do detect\"); due care is acting as a reasonable, prudent person would by implementing and maintaining protections (\"do correct\"). Swapping or merging the terms is a common exam trap. Neither activity transfers risk to a third party."
  },
  {
    id: "q-p5-d1-004",
    module: "p5-d1",
    difficulty: 3,
    q: "A risk has an ALE of $120,000. A proposed safeguard costs $30,000 per year and would reduce the ALE to $40,000. What is the annual value of the safeguard to the organization?",
    options: [
      "$80,000",
      "$50,000",
      "$90,000",
      "$10,000"
    ],
    answer: 1,
    explanation: "Safeguard value = (ALE before − ALE after) − annual cost of the safeguard = ($120,000 − $40,000) − $30,000 = $50,000, so it is cost-justified. $80,000 ignores the safeguard's cost. $90,000 subtracts the cost from the original ALE. $10,000 subtracts the residual ALE twice."
  },
  {
    id: "q-p5-d1-005",
    module: "p5-d1",
    difficulty: 3,
    q: "A business unit wants to launch a product quickly and accept a known high risk instead of fixing it. Who should formally approve the risk acceptance?",
    options: [
      "The security analyst who found the risk",
      "The external auditor",
      "The business owner or executive with the authority and accountability for that risk, documented in the risk register",
      "Any member of the development team"
    ],
    answer: 2,
    explanation: "Risk acceptance must be made by someone with authority over the affected assets and budget, recorded with rationale and a review date. Analysts identify and advise but do not own business risk. Auditors must remain independent. Developers lack the authority to accept organizational risk."
  },
  {
    id: "q-p5-d1-006",
    module: "p5-d1",
    difficulty: 2,
    q: "An organization is starting a formal security program. What should happen FIRST?",
    options: [
      "Purchase a SIEM",
      "Conduct a penetration test",
      "Write firewall rules",
      "Obtain senior management support and sponsorship"
    ],
    answer: 3,
    explanation: "Without executive commitment—authority, budget and policy backing—a security program cannot succeed; management support also comes before policy development. Tools, tests and technical rules come later, once objectives, scope and governance are defined."
  },
  {
    id: "q-p5-d1-007",
    module: "p5-d1",
    difficulty: 2,
    q: "During business continuity planning, which activity identifies critical business functions, their dependencies, and the impact of disruption over time?",
    options: [
      "Vulnerability assessment",
      "Business impact analysis (BIA)",
      "Penetration test",
      "Tabletop exercise"
    ],
    answer: 1,
    explanation: "The BIA determines criticality and establishes values such as maximum tolerable downtime (MTD), RTO and RPO, which drive recovery strategies. Vulnerability assessments and pentests examine technical weaknesses. A tabletop tests the plan after it has been written."
  },
  {
    id: "q-p5-d1-008",
    module: "p5-d1",
    difficulty: 3,
    q: "A BIA determines that the order-processing system has a maximum tolerable downtime (MTD) of 8 hours. Which recovery time objective (RTO) is acceptable?",
    options: [
      "6 hours",
      "8 hours and 30 minutes",
      "12 hours",
      "24 hours"
    ],
    answer: 0,
    explanation: "The RTO must be less than or equal to the MTD (ideally less, leaving margin for verification and work recovery time). Six hours is within the 8-hour MTD. 8.5, 12 and 24 hours all exceed the MTD, which would mean unacceptable harm to the business."
  },
  {
    id: "q-p5-d1-009",
    module: "p5-d1",
    difficulty: 3,
    q: "A CISSP's employer asks them to quietly delay disclosing a vulnerability in a product that is putting public safety at risk. Which ISC2 Code of Ethics canon takes precedence?",
    options: [
      "Provide diligent and competent service to principals",
      "Advance and protect the profession",
      "Act honorably, honestly, justly, responsibly, and legally",
      "Protect society, the common good, necessary public trust and confidence, and the infrastructure"
    ],
    answer: 3,
    explanation: "The canons are applied in order, and protecting society comes first, so public safety outweighs duty to an employer. Service to principals is the third canon. Advancing the profession is the fourth. Acting honorably (second) also matters, but the first canon is the deciding one when interests conflict."
  },
  {
    id: "q-p5-d1-010",
    module: "p5-d1",
    difficulty: 3,
    q: "Your organization is outsourcing payroll processing to a cloud provider. Which contract provision is MOST important for verifying the provider's security over time?",
    options: [
      "A right-to-audit clause, or a requirement to provide independent assurance reports such as a SOC 2 Type II",
      "A clause requiring the provider to use your company logo",
      "A discount for multi-year commitment",
      "A requirement that the provider use the same antivirus vendor as you"
    ],
    answer: 0,
    explanation: "Responsibility for the data stays with you, so you need a contractual mechanism to obtain ongoing assurance (audits, attestation reports, security SLAs, breach notification terms). Logos and discounts are commercial terms. Mandating a specific AV vendor is micromanagement and provides little assurance."
  },
  {
    id: "q-p5-d1-011",
    module: "p5-d1",
    difficulty: 2,
    q: "Under GDPR, a company decides why and how customer personal data is processed and hires a cloud vendor to store it. What are their respective roles?",
    options: [
      "The company is the processor; the vendor is the controller",
      "The company is the data controller; the vendor is the data processor",
      "Both are data subjects",
      "The vendor is the supervisory authority"
    ],
    answer: 1,
    explanation: "The controller determines the purposes and means of processing, and the processor processes data on the controller's behalf under a contract (Article 28). Data subjects are the individuals the data describes. Supervisory authorities are government regulators."
  },
  {
    id: "q-p5-d1-012",
    module: "p5-d1",
    difficulty: 2,
    q: "A company relies on a secret manufacturing formula that it never wants to disclose publicly. Which form of intellectual property protection is MOST appropriate?",
    options: [
      "Patent",
      "Copyright",
      "Trade secret",
      "Trademark"
    ],
    answer: 2,
    explanation: "Trade secrets protect valuable confidential information indefinitely, as long as reasonable measures (NDAs, access controls) keep it secret. Patents require public disclosure and expire (generally 20 years). Copyright protects expression, not formulas. Trademarks protect brand identifiers."
  },
  {
    id: "q-p5-d1-013",
    module: "p5-d1",
    difficulty: 2,
    q: "Which administrative control is MOST effective at DETECTING ongoing fraud by an employee who controls a process alone?",
    options: [
      "Separation of duties",
      "Mandatory vacations, during which someone else performs the job",
      "Nondisclosure agreements",
      "Background checks"
    ],
    answer: 1,
    explanation: "When another person performs the role during a mandatory vacation, irregularities that require constant concealment tend to surface—a detective control. Separation of duties is primarily preventive. NDAs protect information. Background checks screen candidates before hiring."
  },
  {
    id: "q-p5-d1-014",
    module: "p5-d1",
    difficulty: 3,
    q: "The CISO wants to know whether the new security awareness program is actually changing behavior. Which metric is BEST?",
    options: [
      "The trend in phishing simulation click rates and user reporting rates over time",
      "The number of training slides produced",
      "The percentage of employees who received the training email",
      "The training vendor's customer satisfaction score"
    ],
    answer: 0,
    explanation: "Behavioral outcomes (fewer clicks, more reports, faster reporting) show whether the program reduces risk. Slide counts and email delivery are activity measures, not outcomes. Vendor satisfaction scores say nothing about your employees' behavior."
  },
  {
    id: "q-p5-d1-015",
    module: "p5-d1",
    difficulty: 2,
    q: "A threat modeling session uses STRIDE. A threat in which an attacker modifies transaction records in transit falls into which category?",
    options: [
      "Spoofing",
      "Repudiation",
      "Tampering",
      "Information disclosure"
    ],
    answer: 2,
    explanation: "Tampering is unauthorized modification of data, violating integrity. Spoofing is impersonating an identity (authentication). Repudiation is denying having performed an action. Information disclosure is exposure of data to unauthorized parties (confidentiality)."
  },
  {
    id: "q-p5-d1-016",
    module: "p5-d1",
    difficulty: 3,
    q: "A critical supplier provides software embedded in your products. What is the BEST way to manage the security risk of this supply chain dependency?",
    options: [
      "Trust the supplier because they are well known",
      "Stop buying from all suppliers",
      "Ask the supplier to sign a statement that their software is secure",
      "Establish a supply chain risk management process: assess the supplier, include security requirements in contracts, obtain SBOMs and monitor continuously"
    ],
    answer: 3,
    explanation: "C-SCRM (e.g., NIST SP 800-161r1 and the CSF 2.0 GV.SC category) combines due diligence, contractual requirements, transparency (SBOM) and ongoing monitoring. Reputation is not assurance. Stopping all suppliers is not viable. A self-attestation with no verification provides little assurance on its own."
  },
  {
    id: "q-p5-d1-017",
    module: "p5-d1",
    difficulty: 3,
    q: "Your company plans to transfer EU customer data to a subsidiary outside the EU. What should the security manager do FIRST?",
    options: [
      "Consult legal/privacy counsel to determine applicable transfer requirements (e.g., adequacy decisions or standard contractual clauses)",
      "Encrypt the data and transfer it immediately",
      "Transfer the data, since it is within the same corporate group",
      "Ask IT to choose the cheapest data center"
    ],
    answer: 0,
    explanation: "Transborder data flow is a legal question; GDPR Chapter V restricts transfers unless a valid mechanism exists, so counsel must determine the basis first. Encryption is a useful safeguard but does not by itself satisfy legal requirements. Intra-group transfers are still regulated. Cost is irrelevant to legality."
  },
  {
    id: "q-p5-d1-018",
    module: "p5-d1",
    difficulty: 2,
    q: "A risk team gathers experts who anonymously rate risks over several rounds until they reach consensus. What is this qualitative technique called?",
    options: [
      "Monte Carlo simulation",
      "Annualized loss expectancy",
      "Fault tree analysis",
      "The Delphi technique"
    ],
    answer: 3,
    explanation: "The Delphi technique uses anonymous, iterative expert input to avoid groupthink. Monte Carlo simulation and ALE are quantitative. Fault tree analysis is a deductive, top-down failure analysis method."
  },
  {
    id: "q-p5-d1-019",
    module: "p5-d1",
    difficulty: 2,
    q: "In the NIST Risk Management Framework (SP 800-37 Rev. 2), which step follows \"Categorize\"?",
    options: [
      "Authorize the system",
      "Monitor",
      "Select controls",
      "Assess controls"
    ],
    answer: 2,
    explanation: "The RMF steps are Prepare, Categorize, Select, Implement, Assess, Authorize and Monitor. After categorizing the system's impact level (using FIPS 199), you select a baseline of controls from SP 800-53 and tailor it. Assess, Authorize and Monitor come later."
  },
  {
    id: "q-p5-d1-020",
    module: "p5-d1",
    difficulty: 3,
    q: "Business units keep making security decisions inconsistently, and conflicts between IT and the business are escalating. What is the BEST governance solution?",
    options: [
      "Let the security team make all decisions without business input",
      "Establish a security steering committee of senior business and IT leaders to set priorities and resolve conflicts",
      "Have each department write its own security policy",
      "Outsource all security decisions to a consultant"
    ],
    answer: 1,
    explanation: "A steering committee provides cross-functional governance, aligns security with business objectives, and gives decisions legitimacy. Security acting alone ignores business context. Departmental policies increase inconsistency. Consultants advise but cannot own organizational decisions."
  },
  {
    id: "q-p5-d1-021",
    module: "p5-d1",
    difficulty: 3,
    q: "A system administrator is being terminated today for misconduct. When should their access be revoked?",
    options: [
      "One week after the termination meeting",
      "Only after they return their laptop",
      "At the end of the month when accounts are reviewed",
      "At the same time the employee is notified of the termination, coordinated between HR and IT"
    ],
    answer: 3,
    explanation: "For high-risk terminations, access should be disabled simultaneously with notification so the person cannot retaliate (e.g., sabotage or data theft). Waiting a week, for equipment return, or for a monthly review leaves a dangerous window with privileged access."
  },
  {
    id: "q-p5-d1-022",
    module: "p5-d1",
    difficulty: 2,
    q: "An organization has implemented controls and still has some remaining risk. How should it decide whether this is acceptable?",
    options: [
      "Compare the residual risk with the organization's risk appetite and tolerance as defined by senior management",
      "Ensure residual risk is zero",
      "Accept it if the security team is tired",
      "Accept it if competitors have similar risk"
    ],
    answer: 0,
    explanation: "Residual risk is acceptable only if it falls within leadership's defined risk appetite and tolerance. Zero residual risk is unattainable. Fatigue is not a criterion. Competitors' risk positions do not define your organization's appetite."
  },
  {
    id: "q-p5-d1-023",
    module: "p5-d1",
    difficulty: 3,
    q: "A security manager learns of a suspected data breach at a foreign subsidiary that may involve criminal activity. What should they do FIRST?",
    options: [
      "Post details on social media to warn customers",
      "Notify and involve legal counsel to guide investigation, evidence handling and notification obligations",
      "Delete the affected data to limit exposure",
      "Confront the suspected employee directly"
    ],
    answer: 1,
    explanation: "Legal counsel determines jurisdictional requirements, privilege, evidence handling, regulatory notification and law enforcement involvement. Public posting is premature and uncontrolled. Deleting data destroys evidence and may violate the law. Confronting a suspect can compromise the investigation and safety."
  },
  {
    id: "q-p5-d1-024",
    module: "p5-d1",
    difficulty: 2,
    q: "Which framework is designed primarily for IT GOVERNANCE, aligning IT goals with business objectives?",
    options: [
      "OWASP ASVS",
      "CVSS",
      "COBIT",
      "STRIDE"
    ],
    answer: 2,
    explanation: "COBIT (ISACA) focuses on enterprise governance and management of IT. OWASP ASVS is an application security verification standard, CVSS scores vulnerability severity, and STRIDE is a threat modeling mnemonic."
  },
  {
    id: "q-p5-d1-025",
    module: "p5-d1",
    difficulty: 2,
    q: "Which type of investigation requires the HIGHEST standard of proof—\"beyond a reasonable doubt\"?",
    options: [
      "Civil",
      "Criminal",
      "Administrative (internal)",
      "Regulatory"
    ],
    answer: 1,
    explanation: "Criminal cases can lead to imprisonment and therefore require proof beyond a reasonable doubt. Civil cases use the \"preponderance of the evidence\" standard. Administrative investigations follow internal policy standards. Regulatory investigations vary but generally do not require the criminal standard."
  },
  // ---- p5-d2 ----
  {
    id: "q-p5-d2-001",
    module: "p5-d2",
    difficulty: 2,
    q: "Who is PRIMARILY responsible for determining the classification level of a set of business data?",
    options: [
      "The data owner",
      "The data custodian",
      "The end user",
      "The security auditor"
    ],
    answer: 0,
    explanation: "The data owner—typically a senior business manager—is accountable for the data and decides its classification and who may access it. Custodians (often IT) implement the controls the owner specifies. Users must follow handling rules. Auditors verify compliance."
  },
  {
    id: "q-p5-d2-002",
    module: "p5-d2",
    difficulty: 2,
    q: "Which role performs day-to-day tasks such as backups, applying access controls and maintaining storage, as directed by the data owner?",
    options: [
      "Data subject",
      "Data controller",
      "Data custodian",
      "Chief executive officer"
    ],
    answer: 2,
    explanation: "Custodians implement and maintain protective measures defined by the owner. A data subject is the person the data describes. A data controller (a GDPR term) determines the purposes of processing. The CEO has overall accountability but does not perform these tasks."
  },
  {
    id: "q-p5-d2-003",
    module: "p5-d2",
    difficulty: 2,
    q: "An organization wants to begin protecting its information assets. What should be done FIRST?",
    options: [
      "Encrypt all hard drives",
      "Install DLP on all endpoints",
      "Write the incident response plan",
      "Identify and inventory the assets, then classify them"
    ],
    answer: 3,
    explanation: "You cannot protect what you do not know you have; asset inventory and classification determine value and the appropriate protection levels. Encryption, DLP and IR planning are valid controls, but they should be scoped by inventory and classification."
  },
  {
    id: "q-p5-d2-004",
    module: "p5-d2",
    difficulty: 3,
    q: "A company is retiring 500 SSDs that held confidential data. Which sanitization approach is MOST appropriate?",
    options: [
      "Cryptographic erase (if the drives were encrypted) or physical destruction such as shredding, in line with NIST SP 800-88",
      "Degaussing the drives",
      "Deleting the files and emptying the recycle bin",
      "Formatting the drives with a quick format"
    ],
    answer: 0,
    explanation: "SSD wear leveling and over-provisioning leave data in cells that overwriting may not reach, so purge methods like cryptographic erase or vendor sanitize commands, or destruction, are appropriate. Degaussing does not work on flash memory. Deleting files and quick formats only remove references, leaving data recoverable."
  },
  {
    id: "q-p5-d2-005",
    module: "p5-d2",
    difficulty: 2,
    q: "Why should classified media be clearly LABELED (marked)?",
    options: [
      "To increase the value of the media",
      "So that people and systems know the required handling, storage and destruction requirements",
      "To make the media easier to steal",
      "Labels replace the need for access control"
    ],
    answer: 1,
    explanation: "Labels communicate classification and therefore handling rules, enabling consistent protection; in MAC systems, labels also drive access decisions. Labels do not add value or replace access controls, and good labeling practice weighs disclosure risk (e.g., using internal codes)."
  },
  {
    id: "q-p5-d2-006",
    module: "p5-d2",
    difficulty: 2,
    q: "Data being processed in a server's memory by an application is in which state?",
    options: [
      "Data at rest",
      "Data in transit",
      "Data in use",
      "Data in archive"
    ],
    answer: 2,
    explanation: "Data in use is being actively processed (in RAM or CPU), and confidential computing technologies such as secure enclaves protect it. Data at rest is stored on media, data in transit is moving across networks, and archived data is a type of data at rest."
  },
  {
    id: "q-p5-d2-007",
    module: "p5-d2",
    difficulty: 3,
    q: "Legal counsel says that customer records must be kept for 7 years after account closure. A business unit wants to keep them forever \"just in case.\" What is the BEST approach?",
    options: [
      "Keep all data forever because storage is cheap",
      "Delete the records immediately after account closure",
      "Let each employee decide how long to keep data",
      "Follow a documented retention schedule that keeps records for the required 7 years and then securely destroys them, unless a legal hold applies"
    ],
    answer: 3,
    explanation: "Retaining data longer than necessary increases breach impact, discovery costs and privacy violations (GDPR storage limitation), while early deletion breaks legal requirements. A defined schedule with secure destruction and legal-hold exceptions balances both. Individual discretion produces inconsistency."
  },
  {
    id: "q-p5-d2-008",
    module: "p5-d2",
    difficulty: 3,
    q: "An organization adopts the NIST SP 800-53 moderate baseline but removes controls that do not apply to its environment and adds specific parameters. What is this process called?",
    options: [
      "Risk transference",
      "Data remanence",
      "Defense in depth",
      "Scoping and tailoring"
    ],
    answer: 3,
    explanation: "Scoping removes baseline controls that do not apply (e.g., wireless controls where no wireless exists), and tailoring adjusts parameters and adds compensating controls to fit the mission. Risk transference shifts risk to others. Data remanence is residual data. Defense in depth is layering controls."
  },
  {
    id: "q-p5-d2-009",
    module: "p5-d2",
    difficulty: 3,
    q: "The company wants to stop employees from emailing documents labeled \"Confidential\" to personal webmail accounts. Which control BEST addresses this?",
    options: [
      "Full-disk encryption on laptops",
      "A stronger password policy",
      "A network/email DLP solution that inspects outbound content and blocks or quarantines labeled data",
      "An IDS on the internal network"
    ],
    answer: 2,
    explanation: "DLP identifies sensitive content (labels, patterns, fingerprints) leaving via email or web and enforces policy. Full-disk encryption protects lost devices, not deliberate sending. Passwords do not control data flow. An IDS detects attacks but is not designed to enforce data-handling policy."
  },
  {
    id: "q-p5-d2-010",
    module: "p5-d2",
    difficulty: 2,
    q: "What is the correct order of the data security lifecycle (Cloud Security Alliance model)?",
    options: [
      "Create, Store, Use, Share, Archive, Destroy",
      "Store, Create, Share, Use, Destroy, Archive",
      "Create, Destroy, Store, Use, Share, Archive",
      "Use, Create, Archive, Store, Share, Destroy"
    ],
    answer: 0,
    explanation: "Data is created, stored, used, shared, archived and finally destroyed; controls apply at each phase. The other sequences are illogical—data cannot be stored before it is created or destroyed before it is used."
  },
  {
    id: "q-p5-d2-011",
    module: "p5-d2",
    difficulty: 3,
    q: "A research team wants to share a dataset with partners so that individuals can NEVER be re-identified, which would place it outside GDPR's scope. Which technique is required?",
    options: [
      "Pseudonymization with a separately stored key",
      "True anonymization that irreversibly prevents identification",
      "Encrypting the dataset with AES-256",
      "Removing only the names column"
    ],
    answer: 1,
    explanation: "GDPR does not apply to genuinely anonymous data, but pseudonymized data is still personal data because re-identification is possible with the key. Encrypted data is still personal data. Removing only names often leaves quasi-identifiers (ZIP code, birth date, gender) that enable re-identification."
  },
  {
    id: "q-p5-d2-012",
    module: "p5-d2",
    difficulty: 2,
    q: "According to NIST SP 800-88, which sanitization category applies techniques that protect against laboratory-level recovery attacks while leaving the media reusable?",
    options: [
      "Clear",
      "Purge",
      "Destroy",
      "Archive"
    ],
    answer: 1,
    explanation: "Purge (e.g., cryptographic erase, block erase, degaussing for magnetic media) defeats laboratory recovery while the media can still be reused. Clear protects against simple, non-invasive recovery (overwriting). Destroy renders the media unusable. Archive is not a sanitization category."
  },
  {
    id: "q-p5-d2-013",
    module: "p5-d2",
    difficulty: 2,
    q: "Which role is MOST focused on the quality, definitions and business usage of data, rather than its technical protection?",
    options: [
      "Data custodian",
      "Data processor",
      "Data steward",
      "Firewall administrator"
    ],
    answer: 2,
    explanation: "Data stewards manage data quality, metadata and proper use according to governance policies. Custodians handle technical protection. A processor processes data on behalf of a controller. Firewall administrators manage network controls."
  },
  {
    id: "q-p5-d2-014",
    module: "p5-d2",
    difficulty: 3,
    q: "Several end-of-life servers are being sent to a third-party recycler. What is the MOST important step for asset security?",
    options: [
      "Sanitize or remove and destroy the storage media before disposal, and obtain a certificate of destruction from the vendor",
      "Remove the company asset tags only",
      "Wipe the servers' BIOS settings",
      "Ship them as-is because the recycler is reputable"
    ],
    answer: 0,
    explanation: "Data remanence is the key risk at disposal; media must be sanitized appropriately and the process documented with chain-of-custody and certificates of sanitization or destruction. Removing tags does nothing for the data. BIOS settings do not contain the business data. Reputation does not replace verification."
  },
  {
    id: "q-p5-d2-015",
    module: "p5-d2",
    difficulty: 2,
    q: "A merchant wants to reduce PCI DSS scope by replacing card numbers in its systems with surrogate values that have no mathematical relationship to the original PAN. Which technique is this?",
    options: [
      "Hashing with MD5",
      "Data masking on screen only",
      "Steganography",
      "Tokenization"
    ],
    answer: 3,
    explanation: "Tokenization replaces the PAN with a random token, keeping the real value in a secured vault, which can greatly reduce scope. Unsalted MD5 hashes of PANs are weak and are not tokenization. Screen masking still stores the full PAN. Steganography hides data rather than replacing it."
  },
  {
    id: "q-p5-d2-016",
    module: "p5-d2",
    difficulty: 3,
    q: "An organization terminates a SaaS contract and wants assurance that its data cannot be recovered from the provider's multi-tenant storage. Which method is MOST practical?",
    options: [
      "Degaussing the provider's disks",
      "Cryptographic erasure—destroying the encryption keys (ideally customer-managed) that protect the data",
      "Physically shredding the provider's storage arrays",
      "Asking the provider to delete the folder"
    ],
    answer: 1,
    explanation: "Customers cannot physically access cloud hardware, but if data is encrypted with keys they control, destroying the keys renders it unreadable everywhere, including backups. Degaussing and shredding shared infrastructure is not possible. A simple folder delete leaves backups and remnants."
  },
  {
    id: "q-p5-d2-017",
    module: "p5-d2",
    difficulty: 2,
    q: "A multinational must keep citizens' health records within the country where they were collected. Which concept does this describe?",
    options: [
      "Data minimization",
      "Data remanence",
      "Data sovereignty / data localization",
      "Data deduplication"
    ],
    answer: 2,
    explanation: "Data sovereignty means data is subject to the laws of the country where it resides; localization rules require it to stay there. Minimization limits collection to what is necessary. Remanence is residual data after deletion. Deduplication removes duplicate copies to save storage."
  },
  {
    id: "q-p5-d2-018",
    module: "p5-d2",
    difficulty: 3,
    q: "Individually, a department's project names and delivery dates are classified \"Internal,\" but combined they reveal a confidential acquisition. How should the combined dataset be classified?",
    options: [
      "At the lowest level of any individual element",
      "It should be declassified automatically",
      "It does not need any classification",
      "At the higher level reflecting the sensitivity of the aggregated information"
    ],
    answer: 3,
    explanation: "Aggregation can create information more sensitive than its parts, so the combined set should be classified according to the revealed sensitivity. Using the lowest level would underprotect it. Automatic declassification and no classification ignore the aggregation risk."
  },
  {
    id: "q-p5-d2-019",
    module: "p5-d2",
    difficulty: 2,
    q: "A publisher wants to control what licensed users can do with e-books after download, such as preventing printing and copying. Which technology fits BEST?",
    options: [
      "Digital rights management (DRM) / information rights management",
      "A web application firewall",
      "Full-disk encryption",
      "Network access control"
    ],
    answer: 0,
    explanation: "DRM/IRM enforces usage permissions that persist with the content wherever it goes. A WAF protects web apps. Full-disk encryption protects data on a lost device, not use after access. NAC controls network admission."
  },
  {
    id: "q-p5-d2-020",
    module: "p5-d2",
    difficulty: 2,
    q: "A cloud vendor processes data on behalf of your company. Under GDPR, what is one of the processor's key obligations?",
    options: [
      "Decide the purposes for which the data will be used",
      "Sell the data to third parties to cover costs",
      "Ignore breaches unless the controller asks",
      "Process personal data only on the controller's documented instructions and implement appropriate security measures"
    ],
    answer: 3,
    explanation: "Article 28 requires processors to act only on documented instructions, ensure confidentiality, implement security, and assist the controller (including notifying it of breaches without undue delay). Deciding purposes is the controller's role. Selling data or ignoring breaches would violate GDPR."
  },
  {
    id: "q-p5-d2-021",
    module: "p5-d2",
    difficulty: 2,
    q: "Which factor is MOST important when defining data classification levels?",
    options: [
      "The file size",
      "The file format",
      "The value and sensitivity of the data, including the impact to the organization if it is disclosed, altered or destroyed",
      "The number of employees who created it"
    ],
    answer: 2,
    explanation: "Classification reflects business value, sensitivity, legal and regulatory requirements and impact (as in FIPS 199's confidentiality, integrity and availability impact levels). File size, format and author count do not indicate harm if compromised."
  },
  {
    id: "q-p5-d2-022",
    module: "p5-d2",
    difficulty: 3,
    q: "A product launch is now public, and a document classified \"Confidential\" no longer needs that protection. What is the BEST action?",
    options: [
      "Leave it classified forever",
      "Follow the formal declassification process approved by the data owner and update the labels",
      "Let any employee relabel it as Public",
      "Delete the document"
    ],
    answer: 1,
    explanation: "Overclassification wastes resources and hampers sharing, so a controlled declassification process, authorized by the owner, keeps classification accurate. Indefinite classification is inefficient. Unauthorized relabeling breaks accountability. Deleting the document may violate retention requirements."
  },
  {
    id: "q-p5-d2-023",
    module: "p5-d2",
    difficulty: 2,
    q: "Why would an organization select a published security baseline such as the CIS Benchmarks or the NIST SP 800-53 baselines?",
    options: [
      "It provides a documented, minimum set of security controls or configurations as a consistent starting point",
      "It guarantees systems are unhackable",
      "It eliminates the need for risk assessment",
      "It is legally required for every organization"
    ],
    answer: 0,
    explanation: "Baselines give a tested minimum standard that can be scoped and tailored for consistency. No baseline guarantees security. Risk assessment is still needed to tailor controls. Most baselines are not universally mandated by law, although regulations may reference them."
  },
  {
    id: "q-p5-d2-024",
    module: "p5-d2",
    difficulty: 2,
    q: "Employees use many unsanctioned SaaS applications for storing company files. Which technology BEST provides visibility and control over this cloud data usage?",
    options: [
      "A hardware security module",
      "A degausser",
      "A Cloud Access Security Broker (CASB)",
      "A RAID array"
    ],
    answer: 2,
    explanation: "CASBs discover shadow IT, enforce policies such as DLP and access control, and monitor SaaS usage. HSMs protect cryptographic keys. Degaussers erase magnetic media. RAID provides storage redundancy."
  },
  {
    id: "q-p5-d2-025",
    module: "p5-d2",
    difficulty: 3,
    q: "A sales manager's smartphone containing customer data is lost. Which control, implemented beforehand, would have BEST protected the data?",
    options: [
      "A bright phone case",
      "Device encryption enforced through mobile device management (MDM), with remote wipe capability",
      "A longer screen timeout",
      "Installing more apps"
    ],
    answer: 1,
    explanation: "Encryption protects data even if the device is in someone else's hands, and MDM enforces it, along with strong passcodes and remote wipe. A phone case does not protect data, and a longer timeout weakens security. More apps increase risk."
  },
  // ---- p5-d3 ----
  {
    id: "q-p5-d3-001",
    module: "p5-d3",
    difficulty: 2,
    q: "A military system must prevent users from reading information above their clearance and from writing information to lower classification levels. Which model enforces this?",
    options: [
      "Biba",
      "Clark-Wilson",
      "Brewer-Nash",
      "Bell-LaPadula"
    ],
    answer: 3,
    explanation: "Bell-LaPadula is a confidentiality model: the simple security property (\"no read up\") and the star property (\"no write down\"). Biba protects integrity with the inverse rules. Clark-Wilson enforces integrity through well-formed transactions. Brewer-Nash prevents conflicts of interest."
  },
  {
    id: "q-p5-d3-002",
    module: "p5-d3",
    difficulty: 2,
    q: "Which model's rules are \"no read down\" and \"no write up,\" protecting data INTEGRITY?",
    options: [
      "Biba",
      "Bell-LaPadula",
      "Take-Grant",
      "Graham-Denning"
    ],
    answer: 0,
    explanation: "Biba's simple integrity axiom (no read down) prevents subjects from being contaminated by lower-integrity data, and the star integrity axiom (no write up) prevents corrupting higher-integrity data. Bell-LaPadula is about confidentiality. Take-Grant models rights transfer. Graham-Denning defines rules for creating and deleting objects and subjects and managing rights."
  },
  {
    id: "q-p5-d3-003",
    module: "p5-d3",
    difficulty: 3,
    q: "An accounting system ensures users can modify financial data only through authorized programs (transformation procedures), with separation of duties and auditing. Which model is this?",
    options: [
      "Bell-LaPadula",
      "Brewer-Nash",
      "Clark-Wilson",
      "State machine model"
    ],
    answer: 2,
    explanation: "Clark-Wilson uses the access triple (subject–program–object), constrained data items, transformation procedures and integrity verification procedures to enforce integrity in commercial settings. Bell-LaPadula addresses confidentiality. Brewer-Nash handles conflicts of interest. A state machine model is a general concept of secure states."
  },
  {
    id: "q-p5-d3-004",
    module: "p5-d3",
    difficulty: 2,
    q: "A consulting firm must prevent a consultant who has accessed one bank's data from accessing a competing bank's data. Which model applies?",
    options: [
      "Brewer-Nash (Chinese Wall)",
      "Biba",
      "Bell-LaPadula",
      "Lattice-based model"
    ],
    answer: 0,
    explanation: "Brewer-Nash dynamically restricts access based on what a subject has already accessed, preventing conflicts of interest. Biba and Bell-LaPadula use static labels. Lattice-based models define bounds of access but do not address dynamic conflict-of-interest classes."
  },
  {
    id: "q-p5-d3-005",
    module: "p5-d3",
    difficulty: 3,
    q: "During a power failure, a security system controlling a data center's interior doors must not allow unauthorized entry, but fire code requires egress doors to allow people to exit. Which design principle BEST guides this?",
    options: [
      "Fail-open on all doors to save money",
      "Fail securely where appropriate while ensuring life safety takes priority (e.g., fail-secure on entry, free egress on exit routes)",
      "Lock every door permanently during outages",
      "Disable the access control system to avoid complexity"
    ],
    answer: 1,
    explanation: "Systems should fail in a secure state, but human safety is always the top priority, so exit routes must allow egress, typically with fail-safe or mechanical free egress, while protected entries stay secure. Fail-open everywhere exposes assets. Locking people in violates life safety. Disabling controls removes protection entirely."
  },
  {
    id: "q-p5-d3-006",
    module: "p5-d3",
    difficulty: 2,
    q: "What does the Common Criteria (ISO/IEC 15408) provide?",
    options: [
      "A list of the most common web vulnerabilities",
      "A cloud pricing standard",
      "A law requiring encryption",
      "A framework for evaluating the security functionality and assurance of IT products against Protection Profiles, with Evaluation Assurance Levels"
    ],
    answer: 3,
    explanation: "Common Criteria evaluations measure a product (the Target of Evaluation) against a Security Target and Protection Profiles, with EAL1–EAL7 indicating assurance depth. It is not a vulnerability list, a pricing standard, or a law."
  },
  {
    id: "q-p5-d3-007",
    module: "p5-d3",
    difficulty: 3,
    q: "Which property of the reference monitor concept ensures that it cannot be bypassed?",
    options: [
      "It must be large and feature-rich",
      "It must be optional for administrators",
      "It must run in user mode",
      "Complete mediation—every access attempt must go through it"
    ],
    answer: 3,
    explanation: "A reference monitor must be tamperproof, always invoked (complete mediation) and small enough to be verified. Being large conflicts with verifiability. Optional or bypassable mediation defeats the purpose. It is implemented within the TCB (the security kernel), typically in a privileged mode."
  },
  {
    id: "q-p5-d3-008",
    module: "p5-d3",
    difficulty: 3,
    q: "Researchers recover an AES key from a smart card by precisely measuring its power consumption during encryption. What type of attack is this?",
    options: [
      "Brute-force attack",
      "Birthday attack",
      "Side-channel attack",
      "Social engineering"
    ],
    answer: 2,
    explanation: "Side-channel attacks exploit physical leakage such as power, timing, electromagnetic emissions or acoustics, rather than mathematical weaknesses. Brute force tries every key. Birthday attacks find hash collisions. Social engineering manipulates people."
  },
  {
    id: "q-p5-d3-009",
    module: "p5-d3",
    difficulty: 2,
    q: "Which algorithm is MOST appropriate for encrypting several terabytes of data at rest in a database?",
    options: [
      "AES-256",
      "RSA-4096",
      "SHA-512",
      "ECDSA P-384"
    ],
    answer: 0,
    explanation: "Symmetric AES is fast and appropriate for bulk encryption; asymmetric algorithms are typically used only to protect AES keys. RSA is far too slow for bulk data. SHA-512 is a hash and cannot be decrypted. ECDSA creates signatures; it does not encrypt."
  },
  {
    id: "q-p5-d3-010",
    module: "p5-d3",
    difficulty: 3,
    q: "An organization handles secrets that must remain confidential for 20 years and is planning its post-quantum migration. Which priority is MOST appropriate?",
    options: [
      "Wait until large quantum computers exist before doing anything",
      "Inventory cryptography, then prioritize quantum-resistant key establishment (ML-KEM, FIPS 203) for long-lived confidential data, planning for ML-DSA/SLH-DSA (FIPS 204/205) signatures",
      "Replace AES-256 with RSA-2048",
      "Switch all hashing from SHA-256 to MD5"
    ],
    answer: 1,
    explanation: "\"Harvest now, decrypt later\" means adversaries can record traffic today, so key exchange protecting long-lived data is the first priority; a crypto inventory and crypto agility support the migration (NIST IR 8547 plans to deprecate quantum-vulnerable algorithms by 2030 and disallow them by 2035). Waiting is too late for long-lived data. RSA is quantum-vulnerable, while AES-256 remains strong. MD5 is broken."
  },
  {
    id: "q-p5-d3-011",
    module: "p5-d3",
    difficulty: 2,
    q: "What security services does a digital signature provide?",
    options: [
      "Confidentiality only",
      "Availability and confidentiality",
      "Integrity, authentication of origin and non-repudiation",
      "Anonymity"
    ],
    answer: 2,
    explanation: "Signing a hash with a private key proves who signed it and that the data has not changed, and the signer cannot credibly deny it. Signatures do not encrypt the content, so they provide no confidentiality. They do not provide availability or anonymity."
  },
  {
    id: "q-p5-d3-012",
    module: "p5-d3",
    difficulty: 3,
    q: "To prevent any single administrator from recovering a master encryption key, the key is split into parts held by three people, and at least two must combine their parts. What are these concepts?",
    options: [
      "Key stretching",
      "Perfect forward secrecy",
      "Key escrow with a single custodian",
      "Split knowledge with M-of-N control"
    ],
    answer: 3,
    explanation: "Split knowledge divides a key so no individual knows it all; M-of-N (e.g., 2-of-3, often via Shamir's Secret Sharing) requires a quorum. Key stretching strengthens weak passwords. PFS protects past sessions. Single-custodian escrow is the opposite of dividing trust."
  },
  {
    id: "q-p5-d3-013",
    module: "p5-d3",
    difficulty: 3,
    q: "A company runs sensitive workloads on a public IaaS platform. Which risk is MOST specific to the multi-tenant virtualization model?",
    options: [
      "VM escape or cross-tenant side channels allowing one tenant to affect another",
      "Users choosing weak passwords",
      "Fire damaging the company's on-premises data center",
      "Phishing emails reaching employees"
    ],
    answer: 0,
    explanation: "Multi-tenancy introduces risks of hypervisor flaws (VM escape) and shared-hardware side channels (e.g., Spectre-class issues) between tenants. Weak passwords and phishing exist in any model. The on-premises data center is not the concern for an IaaS workload."
  },
  {
    id: "q-p5-d3-014",
    module: "p5-d3",
    difficulty: 3,
    q: "An industrial control system (ICS) operator is designing security for a plant. Which priority ordering is MOST typical for OT environments?",
    options: [
      "Confidentiality first, then integrity, then availability",
      "Safety and availability first, then integrity, then confidentiality",
      "Cost first, then confidentiality",
      "Confidentiality only"
    ],
    answer: 1,
    explanation: "In OT, disruption can endanger lives and the environment, so safety and availability lead, with segmentation (e.g., the Purdue model and ISA/IEC 62443 zones and conduits) protecting control networks. Confidentiality-first ordering is typical of traditional IT. Cost is not a security objective."
  },
  {
    id: "q-p5-d3-015",
    module: "p5-d3",
    difficulty: 2,
    q: "A company is deploying thousands of IoT sensors. Which practice is MOST important to reduce risk?",
    options: [
      "Connect them directly to the internet with public IPs for easy access",
      "Disable all logging to save bandwidth",
      "Use the same password on all devices for convenience",
      "Change default credentials, place devices on segmented networks, and ensure a secure update mechanism"
    ],
    answer: 3,
    explanation: "IoT devices often ship with default credentials and limited security, so unique credentials, segmentation and firmware update capability are key (the Mirai botnet exploited default passwords). Direct exposure, no logging and shared passwords all increase risk."
  },
  {
    id: "q-p5-d3-016",
    module: "p5-d3",
    difficulty: 3,
    q: "A data center needs fire suppression that will not damage electronic equipment and is safe for occupied spaces. Which option is BEST?",
    options: [
      "A wet-pipe sprinkler system only",
      "A clean-agent gaseous system (e.g., FM-200 or an inert gas such as Inergen), often paired with pre-action sprinklers",
      "Halon 1301 newly installed",
      "Portable water extinguishers"
    ],
    answer: 1,
    explanation: "Clean agents suppress fire without residue and are designed to be safe for people at design concentrations; pre-action sprinklers reduce the risk of accidental discharge. Wet-pipe systems can damage equipment. New Halon production is banned under the Montreal Protocol because it depletes ozone. Water extinguishers are unsafe on energized electrical equipment."
  },
  {
    id: "q-p5-d3-017",
    module: "p5-d3",
    difficulty: 2,
    q: "Which physical control is designed specifically to prevent tailgating/piggybacking into a secure area?",
    options: [
      "An access control vestibule (mantrap)",
      "A CCTV camera",
      "A \"No Entry\" sign",
      "A badge reader on a standard door"
    ],
    answer: 0,
    explanation: "A vestibule (mantrap) allows only one person through after authentication, physically preventing tailgating. CCTV detects rather than prevents. Signs only deter. A standard badge door can be held open for others."
  },
  {
    id: "q-p5-d3-018",
    module: "p5-d3",
    difficulty: 2,
    q: "Using US classifications, which fire class involves energized electrical equipment?",
    options: [
      "Class A",
      "Class B",
      "Class C",
      "Class K"
    ],
    answer: 2,
    explanation: "Class C fires involve energized electrical equipment and require non-conductive agents such as CO2 or clean agents. Class A is ordinary combustibles, Class B is flammable liquids and gases, and Class K is cooking oils and fats."
  },
  {
    id: "q-p5-d3-019",
    module: "p5-d3",
    difficulty: 2,
    q: "Which concept uses building layout, lighting and landscaping to naturally discourage criminal activity?",
    options: [
      "Crime Prevention Through Environmental Design (CPTED)",
      "Defense in depth for networks",
      "Security through obscurity",
      "Zero trust architecture"
    ],
    answer: 0,
    explanation: "CPTED relies on natural surveillance, natural access control and territorial reinforcement. Network defense in depth layers technical controls. Obscurity relies on hidden design. Zero trust is a network and identity architecture."
  },
  {
    id: "q-p5-d3-020",
    module: "p5-d3",
    difficulty: 3,
    q: "A development team moves to serverless functions. Which security consideration becomes MORE important compared with traditional servers?",
    options: [
      "Patching the underlying operating system",
      "Fine-grained IAM permissions for each function and secure handling of event inputs and dependencies",
      "Physical security of the server rack",
      "Configuring BIOS passwords"
    ],
    answer: 1,
    explanation: "With serverless, the provider manages the OS and hardware, so the customer's attack surface shifts to function permissions, event injection, secrets and third-party libraries. OS patching, rack security and BIOS settings belong to the provider."
  },
  {
    id: "q-p5-d3-021",
    module: "p5-d3",
    difficulty: 2,
    q: "Why does increasing the output length of a hash function make collision attacks harder?",
    options: [
      "Longer hashes are reversible",
      "Longer hashes use symmetric keys",
      "Collision attacks only affect passwords",
      "The birthday paradox means collisions are found in about 2^(n/2) attempts, so longer outputs raise the work factor exponentially"
    ],
    answer: 3,
    explanation: "For an n-bit hash, a generic birthday attack needs about 2^(n/2) operations, so SHA-256 offers roughly 128-bit collision resistance. Hashes are not reversible regardless of length. Plain hashes do not use keys. Collisions threaten signatures and certificates, not just passwords."
  },
  {
    id: "q-p5-d3-022",
    module: "p5-d3",
    difficulty: 2,
    q: "Kerckhoffs's principle states that a cryptographic system should be secure even if:",
    options: [
      "The key is published",
      "The algorithm is kept secret",
      "Everything about the system except the key is public knowledge",
      "Users choose short passwords"
    ],
    answer: 2,
    explanation: "Security should rely only on the secrecy of the key, which is why open, peer-reviewed algorithms like AES are trusted. Publishing the key breaks any system. Relying on a secret algorithm is security through obscurity. Short passwords weaken security."
  },
  {
    id: "q-p5-d3-023",
    module: "p5-d3",
    difficulty: 3,
    q: "How does Grover's algorithm on a future quantum computer affect symmetric cryptography such as AES?",
    options: [
      "It completely breaks all AES key sizes instantly",
      "It has no effect on any cryptography",
      "It roughly halves the effective key strength, so AES-256 remains appropriate for long-term security",
      "It only affects hash functions, not ciphers"
    ],
    answer: 2,
    explanation: "Grover provides a quadratic speedup for brute-force search, reducing AES-256 to about 128-bit effective strength—still considered secure. Shor's algorithm, not Grover's, breaks RSA and ECC. Quantum computing does affect cryptography. Grover applies to both key search and hash preimages."
  },
  {
    id: "q-p5-d3-024",
    module: "p5-d3",
    difficulty: 3,
    q: "Which combination of operating system protections makes memory-corruption exploits such as buffer overflows significantly harder to exploit?",
    options: [
      "Disk defragmentation and compression",
      "Screen savers and long passwords",
      "Larger hard drives",
      "Data Execution Prevention (DEP/NX) together with Address Space Layout Randomization (ASLR)"
    ],
    answer: 3,
    explanation: "DEP marks memory regions non-executable, and ASLR randomizes addresses, so attackers cannot easily run injected code or predict where gadgets reside (stack canaries and CFG add more protection). Defragmentation, screen savers and disk size have no effect on exploitation."
  },
  {
    id: "q-p5-d3-025",
    module: "p5-d3",
    difficulty: 2,
    q: "Why are data centers typically designed with positive air pressurization?",
    options: [
      "To increase cooling costs",
      "So that when doors open, air flows outward, keeping dust, smoke and contaminants out",
      "To make doors harder to open for attackers",
      "To pull outside air into the room"
    ],
    answer: 1,
    explanation: "Positive pressure pushes air out, preventing contaminants and smoke from being drawn in. Its purpose is not to increase costs or act as a barrier to attackers. Pulling outside air in describes negative pressure, the opposite."
  },
  // ---- p5-d4 ----
  {
    id: "q-p5-d4-001",
    module: "p5-d4",
    difficulty: 1,
    q: "At which OSI layer does a traditional network switch forward frames using MAC addresses?",
    options: [
      "Layer 2 – Data Link",
      "Layer 1 – Physical",
      "Layer 3 – Network",
      "Layer 4 – Transport"
    ],
    answer: 0,
    explanation: "Switches use MAC address tables at Layer 2. Layer 1 covers cables, signals and hubs. Layer 3 devices (routers and multilayer switches) route using IP addresses. Layer 4 deals with TCP/UDP ports."
  },
  {
    id: "q-p5-d4-002",
    module: "p5-d4",
    difficulty: 2,
    q: "Which IPsec protocol provides confidentiality through encryption?",
    options: [
      "Authentication Header (AH)",
      "Encapsulating Security Payload (ESP)",
      "Internet Key Exchange (IKE) only",
      "Generic Routing Encapsulation (GRE)"
    ],
    answer: 1,
    explanation: "ESP provides encryption, integrity and authentication. AH provides integrity and authentication but no encryption. IKE negotiates security associations and keys but does not protect the data itself. GRE is an unencrypted tunneling protocol."
  },
  {
    id: "q-p5-d4-003",
    module: "p5-d4",
    difficulty: 3,
    q: "A retailer wants to reduce the number of systems subject to PCI DSS assessment. Which approach is MOST effective?",
    options: [
      "Segment the cardholder data environment from other networks with strictly controlled, monitored connections",
      "Encrypt employees' laptops",
      "Install antivirus on every server",
      "Change Wi-Fi passwords monthly"
    ],
    answer: 0,
    explanation: "Effective segmentation isolates the cardholder data environment, so out-of-scope systems cannot affect it, reducing assessment scope and risk. Laptop encryption, antivirus and Wi-Fi password changes are good controls but do not reduce scope."
  },
  {
    id: "q-p5-d4-004",
    module: "p5-d4",
    difficulty: 2,
    q: "An enterprise wants strong Wi-Fi security with individual user authentication and no shared passphrase. Which configuration is BEST?",
    options: [
      "WPA2-Personal with a long passphrase",
      "WEP with a 128-bit key",
      "An open network with a captive portal",
      "WPA3-Enterprise using 802.1X with EAP-TLS"
    ],
    answer: 3,
    explanation: "WPA3-Enterprise with 802.1X authenticates each user or device (EAP-TLS uses certificates), with no shared secret to leak. WPA2-Personal uses a shared PSK. WEP is broken. Open networks with captive portals provide no encryption at the Wi-Fi layer."
  },
  {
    id: "q-p5-d4-005",
    module: "p5-d4",
    difficulty: 3,
    q: "A data center wants to centrally define network policies in software and dynamically restrict east-west traffic between workloads. Which technology BEST enables this?",
    options: [
      "Hubs instead of switches",
      "Static routes on each server",
      "Software-defined networking (SDN) with microsegmentation",
      "A single flat VLAN"
    ],
    answer: 2,
    explanation: "SDN separates the control plane from the data plane, enabling centralized, programmable policy and fine-grained microsegmentation. Hubs broadcast all traffic. Static routes do not enforce security policy. A flat VLAN permits unrestricted lateral movement."
  },
  {
    id: "q-p5-d4-006",
    module: "p5-d4",
    difficulty: 2,
    q: "What does DNSSEC provide?",
    options: [
      "Encryption of DNS queries for privacy",
      "Load balancing of web servers",
      "Origin authentication and integrity of DNS responses through digital signatures",
      "Faster DNS resolution"
    ],
    answer: 2,
    explanation: "DNSSEC signs DNS records so resolvers can validate that answers are authentic and unmodified, preventing cache poisoning. It does not encrypt queries—DoH, DoT and DoQ provide confidentiality. It is not load balancing and may add overhead rather than speed."
  },
  {
    id: "q-p5-d4-007",
    module: "p5-d4",
    difficulty: 2,
    q: "Which is an example of a converged protocol that carries storage traffic over standard IP networks?",
    options: [
      "iSCSI",
      "SMTP",
      "SNMP",
      "ARP"
    ],
    answer: 0,
    explanation: "iSCSI encapsulates SCSI storage commands in TCP/IP, converging storage and data networks (FCoE and VoIP are other examples). SMTP is email, SNMP is network management, and ARP resolves IP addresses to MAC addresses."
  },
  {
    id: "q-p5-d4-008",
    module: "p5-d4",
    difficulty: 3,
    q: "A company wants remote employees to access only specific internal applications based on identity and device health, rather than gaining broad network access. Which approach BEST meets this requirement?",
    options: [
      "A site-to-site IPsec VPN",
      "Publishing internal apps directly on the internet",
      "A full-tunnel SSL VPN with network-level access",
      "Zero Trust Network Access (ZTNA)"
    ],
    answer: 3,
    explanation: "ZTNA grants per-application access after continuous verification of user and device, consistent with NIST SP 800-207. Site-to-site VPNs connect networks, not individual users. Direct publishing exposes apps to the internet. A full-tunnel VPN typically grants broad network access."
  },
  {
    id: "q-p5-d4-009",
    module: "p5-d4",
    difficulty: 2,
    q: "What distinguishes a stateful firewall from a packet-filtering firewall?",
    options: [
      "It inspects only source IP addresses",
      "It tracks connection state and allows return traffic only for sessions that were legitimately established",
      "It cannot filter TCP traffic",
      "It operates only at Layer 1"
    ],
    answer: 1,
    explanation: "Stateful firewalls maintain a state table and understand whether packets belong to established sessions. Packet filters evaluate each packet in isolation using static rules. Stateful firewalls filter TCP, UDP and more, and they operate at Layers 3–4, not Layer 1."
  },
  {
    id: "q-p5-d4-010",
    module: "p5-d4",
    difficulty: 3,
    q: "An e-commerce company suffers a volumetric DDoS of 400 Gbps that saturates its internet links. Which mitigation is MOST effective?",
    options: [
      "Add more firewall rules on the on-premises firewall",
      "Use an upstream DDoS scrubbing service or CDN with capacity to absorb the traffic before it reaches the company's links",
      "Increase server CPU",
      "Reboot the web servers"
    ],
    answer: 1,
    explanation: "Volumetric attacks fill the pipe before traffic reaches on-premises devices, so mitigation must happen upstream in an ISP, scrubbing center or CDN with massive capacity. Local firewall rules, extra CPU and reboots cannot help when the links are already saturated."
  },
  {
    id: "q-p5-d4-011",
    module: "p5-d4",
    difficulty: 2,
    q: "Which technology provides END-TO-END confidentiality and integrity of email messages between sender and recipient?",
    options: [
      "STARTTLS between mail servers",
      "SPF",
      "DMARC",
      "S/MIME (or OpenPGP)"
    ],
    answer: 3,
    explanation: "S/MIME and PGP encrypt and sign the message itself, so it stays protected at rest and across all hops. STARTTLS protects only each hop in transit. SPF and DMARC are sender authentication mechanisms and do not encrypt anything."
  },
  {
    id: "q-p5-d4-012",
    module: "p5-d4",
    difficulty: 2,
    q: "In an 802.1X deployment, which component is the network switch or wireless access point?",
    options: [
      "The authenticator",
      "The supplicant",
      "The authentication server",
      "The certificate authority"
    ],
    answer: 0,
    explanation: "The authenticator controls port access and relays EAP messages. The supplicant is the client device. The authentication server (usually RADIUS) validates credentials. A CA may issue certificates for EAP-TLS but is not one of the three 802.1X roles."
  },
  {
    id: "q-p5-d4-013",
    module: "p5-d4",
    difficulty: 3,
    q: "A penetration tester sends double-tagged 802.1Q frames to reach a VLAN that should be isolated. Which configuration BEST mitigates this VLAN hopping attack?",
    options: [
      "Use longer Wi-Fi passwords",
      "Enable Telnet on switches",
      "Disable DTP/auto-trunking on access ports and set the trunk native VLAN to an unused VLAN that carries no user traffic",
      "Put all users in VLAN 1"
    ],
    answer: 2,
    explanation: "Double tagging exploits the native VLAN, and switch spoofing exploits automatic trunk negotiation; hard-coding access ports and using an unused native VLAN defeats both. Wi-Fi passwords are irrelevant. Telnet is insecure. VLAN 1 as the user VLAN is a well-known bad practice."
  },
  {
    id: "q-p5-d4-014",
    module: "p5-d4",
    difficulty: 2,
    q: "Which change in TLS 1.3 IMPROVES security compared with TLS 1.2?",
    options: [
      "It allows SSL 3.0 fallback",
      "It adds RC4 as a default cipher",
      "It disables certificate validation",
      "It removes static RSA key exchange and legacy ciphers, requiring forward-secret (EC)DHE key exchange"
    ],
    answer: 3,
    explanation: "TLS 1.3 trimmed insecure options, mandates ephemeral key exchange and AEAD ciphers, and encrypts more of the handshake. SSL fallback and RC4 are insecure and removed. Certificate validation remains essential."
  },
  {
    id: "q-p5-d4-015",
    module: "p5-d4",
    difficulty: 2,
    q: "Which transmission medium is MOST resistant to electromagnetic interference and the hardest to tap without detection?",
    options: [
      "Unshielded twisted pair (UTP)",
      "Fiber-optic cable",
      "Coaxial cable",
      "Wireless radio"
    ],
    answer: 1,
    explanation: "Fiber carries light, is immune to EMI, and does not radiate signals, so tapping requires physical intrusion that is often detectable. UTP and coax are susceptible to EMI and emanation. Wireless signals can be intercepted from a distance."
  },
  {
    id: "q-p5-d4-016",
    module: "p5-d4",
    difficulty: 3,
    q: "Attackers announce a more specific BGP prefix for your IP space, diverting your traffic. Which control BEST helps prevent this?",
    options: [
      "Resource Public Key Infrastructure (RPKI) with route origin validation",
      "DNSSEC on your web domain",
      "Stronger Wi-Fi encryption",
      "Antivirus on servers"
    ],
    answer: 0,
    explanation: "RPKI lets networks cryptographically validate which autonomous systems may originate a prefix, allowing invalid announcements to be rejected. DNSSEC protects DNS data, not routing. Wi-Fi encryption and antivirus are unrelated to inter-domain routing."
  },
  {
    id: "q-p5-d4-017",
    module: "p5-d4",
    difficulty: 3,
    q: "A third-party vendor needs network access to maintain your building management system. What is the BEST approach?",
    options: [
      "Give the vendor a permanent VPN account with full network access",
      "Share an employee's credentials with the vendor",
      "Provide access through a monitored jump host to only the required systems, with MFA, time-limited accounts and session recording",
      "Expose the building management system to the internet so the vendor can reach it directly"
    ],
    answer: 2,
    explanation: "Least privilege, strong authentication, time restriction and monitoring limit third-party risk (vendor access was the entry point in the 2013 Target breach). Permanent full access, shared credentials and internet exposure all greatly increase risk and remove accountability."
  },
  {
    id: "q-p5-d4-018",
    module: "p5-d4",
    difficulty: 2,
    q: "What is a primary SECURITY benefit of a content delivery network (CDN) for a public website?",
    options: [
      "It encrypts the company's internal database",
      "It replaces the need for secure coding",
      "It provides end-user antivirus",
      "It absorbs and distributes traffic, helping mitigate DDoS attacks while hiding the origin server's address"
    ],
    answer: 3,
    explanation: "CDNs cache content across many edge nodes, adding capacity and often WAF and DDoS protections in front of the origin. They do not encrypt internal databases, fix insecure code, or provide endpoint protection."
  },
  {
    id: "q-p5-d4-019",
    module: "p5-d4",
    difficulty: 2,
    q: "Administrators must manage servers in a protected network segment. Which design is MOST secure?",
    options: [
      "Allow direct RDP from the internet to each server",
      "Require admins to connect through a hardened, monitored bastion (jump) host with MFA",
      "Allow admin access from any workstation",
      "Use a shared admin account for all administrators"
    ],
    answer: 1,
    explanation: "A bastion host provides a single, controlled and logged entry point into the management network. Internet-exposed RDP is a top attack vector. Admin access from any workstation widens the attack surface. Shared accounts destroy accountability."
  },
  {
    id: "q-p5-d4-020",
    module: "p5-d4",
    difficulty: 2,
    q: "Which protocol protects VoIP media streams from eavesdropping?",
    options: [
      "SIP over UDP without TLS",
      "SNMPv1",
      "SRTP (Secure Real-time Transport Protocol)",
      "TFTP"
    ],
    answer: 2,
    explanation: "SRTP encrypts and authenticates RTP voice and video media; SIP signaling should also be protected with TLS. Plain SIP over UDP is unencrypted. SNMPv1 uses cleartext community strings. TFTP is an unauthenticated file transfer protocol."
  },
  {
    id: "q-p5-d4-021",
    module: "p5-d4",
    difficulty: 3,
    q: "Where should a network IDS sensor be placed to detect attacks that have already bypassed the perimeter firewall and are targeting internal servers?",
    options: [
      "On the internal network segments behind the firewall, such as server VLANs or data center core links",
      "Outside the firewall only",
      "On the guest Wi-Fi only",
      "On a printer"
    ],
    answer: 0,
    explanation: "Placing sensors behind the firewall shows traffic that actually reached internal assets, including lateral movement. Sensors outside the firewall see noisy internet scanning but not internal activity. Guest Wi-Fi and printers do not provide visibility into server traffic."
  },
  {
    id: "q-p5-d4-022",
    module: "p5-d4",
    difficulty: 2,
    q: "What is a key characteristic of SD-WAN?",
    options: [
      "It is a type of fiber cable",
      "It replaces all encryption",
      "It is a wireless encryption standard",
      "It uses centralized software control to route traffic across multiple WAN links (MPLS, broadband, LTE) based on policy"
    ],
    answer: 3,
    explanation: "SD-WAN abstracts and manages multiple transport links with application-aware policy and is often combined with security services in SASE. It is not a cable type, does not replace encryption, and is not a Wi-Fi standard."
  },
  {
    id: "q-p5-d4-023",
    module: "p5-d4",
    difficulty: 3,
    q: "A company's security tools only inspect IPv4, but its operating systems have IPv6 enabled by default. What is the MAIN risk?",
    options: [
      "IPv6 is always encrypted, so traffic cannot be read",
      "IPv6 makes networks faster, which is a risk",
      "Attackers could use IPv6 (including automatic tunneling) to communicate in ways that bypass IPv4-only monitoring and filtering",
      "IPv6 cannot be used on internal networks"
    ],
    answer: 2,
    explanation: "Unmonitored IPv6—such as rogue router advertisements, mitm6-style attacks, or tunnels like Teredo—can create blind spots, so either secure and monitor IPv6 or deliberately disable it. IPv6 is not automatically encrypted. Speed is not a security risk. IPv6 is widely used internally."
  },
  {
    id: "q-p5-d4-024",
    module: "p5-d4",
    difficulty: 3,
    q: "Attackers who compromised one server moved laterally to dozens of others in the same data center, and the perimeter firewall saw none of it. What is the BEST way to gain visibility?",
    options: [
      "Monitor east-west traffic with internal sensors or flow logs, and enforce microsegmentation",
      "Add more rules to the perimeter firewall",
      "Increase internet bandwidth",
      "Disable server logging"
    ],
    answer: 0,
    explanation: "Lateral movement is east-west traffic that never crosses the perimeter, so internal monitoring (flow logs, NDR, host telemetry) and segmentation are needed. Perimeter rules cannot see internal traffic. Bandwidth is unrelated. Disabling logging reduces visibility."
  },
  {
    id: "q-p5-d4-025",
    module: "p5-d4",
    difficulty: 2,
    q: "Employees often work from hotels and airports. Which control BEST protects their traffic on untrusted Wi-Fi?",
    options: [
      "Turning off the screen",
      "An always-on VPN or ZTNA client that encrypts traffic and enforces policy regardless of network",
      "Using the hotel's free Wi-Fi password",
      "Disabling the host firewall"
    ],
    answer: 1,
    explanation: "Always-on, encrypted connectivity protects against eavesdropping and rogue access points on untrusted networks. A dark screen does nothing for network traffic. A hotel's shared password provides little protection. Disabling the host firewall increases exposure."
  },
  // ---- p5-d5 ----
  {
    id: "q-p5-d5-001",
    module: "p5-d5",
    difficulty: 1,
    q: "A user types their username into a login screen. Which step of access control is this?",
    options: [
      "Authentication",
      "Identification",
      "Authorization",
      "Accountability"
    ],
    answer: 1,
    explanation: "Identification is claiming an identity, such as a username. Authentication proves that claim (password, token, biometric). Authorization determines what the authenticated identity may do. Accountability ties actions to identities through logging."
  },
  {
    id: "q-p5-d5-002",
    module: "p5-d5",
    difficulty: 2,
    q: "When comparing biometric systems, which metric indicates the point where false rejections equal false acceptances, with a lower value meaning a more accurate system?",
    options: [
      "False rejection rate (Type I) alone",
      "False acceptance rate (Type II) alone",
      "Throughput rate",
      "Crossover error rate (CER), also called equal error rate (EER)"
    ],
    answer: 3,
    explanation: "CER/EER is the point where FRR equals FAR and is used to compare overall accuracy. FRR (Type I) and FAR (Type II) individually change as sensitivity is tuned, so they are not comparable on their own. Throughput measures speed, not accuracy."
  },
  {
    id: "q-p5-d5-003",
    module: "p5-d5",
    difficulty: 2,
    q: "In a SAML web single sign-on flow, which entity authenticates the user and issues the assertion?",
    options: [
      "The identity provider (IdP)",
      "The service provider (SP)",
      "The user's browser",
      "The DNS server"
    ],
    answer: 0,
    explanation: "The IdP authenticates the user and issues a signed SAML assertion. The SP (the application) consumes the assertion and grants access. The browser relays messages between them. DNS is not part of the SAML trust relationship."
  },
  {
    id: "q-p5-d5-004",
    module: "p5-d5",
    difficulty: 3,
    q: "A government agency requires that access decisions be made by the system based on security labels and user clearances, and users must NOT be able to change permissions on their own files. Which model is required?",
    options: [
      "Discretionary access control (DAC)",
      "Role-based access control (RBAC)",
      "Mandatory access control (MAC)",
      "Rule-based access control"
    ],
    answer: 2,
    explanation: "MAC enforces system-defined labels and clearances, and owners cannot override them. DAC lets owners grant access at their discretion, which violates the requirement. RBAC assigns permissions by job function rather than labels. Rule-based access applies global rules such as firewall ACLs."
  },
  {
    id: "q-p5-d5-005",
    module: "p5-d5",
    difficulty: 3,
    q: "An audit finds many employees have accumulated access from previous roles. What is the BEST control to detect and correct this on an ongoing basis?",
    options: [
      "Periodic user access reviews (recertification) by managers or resource owners",
      "Require longer passwords",
      "Increase account lockout thresholds",
      "Install antivirus"
    ],
    answer: 0,
    explanation: "Privilege creep happens when access is added during role changes but never removed; regular recertification catches and removes unnecessary entitlements, supported by role-based provisioning for movers. Passwords, lockout settings and antivirus do not address excessive entitlements."
  },
  {
    id: "q-p5-d5-006",
    module: "p5-d5",
    difficulty: 2,
    q: "Which is a well-known weakness of Kerberos?",
    options: [
      "It sends passwords in cleartext across the network",
      "It cannot support single sign-on",
      "It works only on Linux",
      "The KDC is a single point of failure and high-value target, and the protocol depends on synchronized clocks"
    ],
    answer: 3,
    explanation: "If the KDC fails, authentication stops; if it is compromised (e.g., the krbtgt key is stolen), attackers can forge tickets (Golden Ticket). Time skew beyond the allowed tolerance (5 minutes by default in AD) breaks authentication. Kerberos does not send passwords over the network, enables SSO, and is cross-platform."
  },
  {
    id: "q-p5-d5-007",
    module: "p5-d5",
    difficulty: 2,
    q: "Which control BEST reduces the risk of an attacker using an unattended, logged-in workstation?",
    options: [
      "Longer password history",
      "Automatic session lock after a period of inactivity, requiring re-authentication",
      "Disabling MFA",
      "Using a wallpaper reminder"
    ],
    answer: 1,
    explanation: "Inactivity timeouts and screen locks protect unattended sessions. Password history prevents reuse but does not protect an active session. Disabling MFA weakens security. Reminders rely on users and are not enforcement."
  },
  {
    id: "q-p5-d5-008",
    module: "p5-d5",
    difficulty: 3,
    q: "A company wants to eliminate standing domain administrator privileges while still allowing admins to perform urgent tasks. Which approach is BEST?",
    options: [
      "Give all admins permanent Domain Admin membership",
      "Share a single Domain Admin password among the team",
      "Implement privileged access management with just-in-time elevation, approval workflow and session recording",
      "Remove all administrative capability from the organization"
    ],
    answer: 2,
    explanation: "JIT elevation through PAM provides time-bound, approved and monitored privilege, minimizing the window for abuse. Permanent membership keeps standing risk. Shared passwords destroy accountability. Removing all admin capability prevents operations."
  },
  {
    id: "q-p5-d5-009",
    module: "p5-d5",
    difficulty: 2,
    q: "Which practice BEST supports accountability for user actions on a system?",
    options: [
      "Requiring each user to have a unique identifier and logging actions against it",
      "Using shared generic accounts for convenience",
      "Disabling audit logs to improve performance",
      "Allowing anonymous access to sensitive data"
    ],
    answer: 0,
    explanation: "Accountability requires that actions be traceable to individuals, so unique IDs and audit logs are essential. Shared accounts, disabled logging and anonymous access all make attribution impossible."
  },
  {
    id: "q-p5-d5-010",
    module: "p5-d5",
    difficulty: 3,
    q: "Under NIST SP 800-63B, which authenticator choice is required to achieve Authenticator Assurance Level 3 (AAL3)?",
    options: [
      "A password alone",
      "SMS one-time codes",
      "Security questions",
      "A hardware-based, phishing-resistant cryptographic authenticator (e.g., a FIPS-validated security key or PIV card) used as part of multi-factor authentication"
    ],
    answer: 3,
    explanation: "AAL3 requires multi-factor authentication with a non-exportable, hardware-based cryptographic authenticator providing phishing resistance and verifier impersonation resistance. Passwords alone reach only AAL1. SMS OTP is restricted and cannot reach AAL3. Knowledge-based questions are not acceptable authenticators."
  },
  {
    id: "q-p5-d5-011",
    module: "p5-d5",
    difficulty: 2,
    q: "Before issuing credentials to a new remote employee, the organization verifies their government ID against authoritative sources. What is this process called?",
    options: [
      "Authorization",
      "Identity proofing",
      "Federation",
      "Provisioning a role"
    ],
    answer: 1,
    explanation: "Identity proofing (Identity Assurance Level in NIST SP 800-63A) establishes that a person is who they claim to be before credentials are issued. Authorization grants permissions. Federation links identity domains. Provisioning creates accounts after proofing."
  },
  {
    id: "q-p5-d5-012",
    module: "p5-d5",
    difficulty: 2,
    q: "A mobile app needs permission to access a user's calendar API on their behalf, without receiving the user's password. Which standard is designed for this?",
    options: [
      "Kerberos",
      "RADIUS",
      "OAuth 2.0",
      "LDAP"
    ],
    answer: 2,
    explanation: "OAuth 2.0 issues scoped access tokens for delegated authorization (OAuth 2.1 consolidates best practices such as PKCE). Kerberos is for enterprise network authentication. RADIUS is AAA for network access. LDAP is a directory protocol, and using it this way would require handling the user's credentials."
  },
  {
    id: "q-p5-d5-013",
    module: "p5-d5",
    difficulty: 3,
    q: "A bank wants users to log in without extra friction from known devices, but to require step-up MFA when logins come from new countries or unusual devices. Which approach is this?",
    options: [
      "Discretionary access control",
      "Risk-based (adaptive) authentication",
      "Single-factor authentication",
      "Static password policy"
    ],
    answer: 1,
    explanation: "Adaptive authentication evaluates context (device, location, behavior) and adjusts requirements based on risk. DAC is an authorization model. Single-factor authentication offers no step-up. Static password policies do not respond to context."
  },
  {
    id: "q-p5-d5-014",
    module: "p5-d5",
    difficulty: 2,
    q: "How can an IAM system enforce separation of duties between \"create vendor\" and \"approve payment\"?",
    options: [
      "Define mutually exclusive roles and prevent the same user from holding both (static SoD rules)",
      "Give all accounting staff both permissions",
      "Rely on employees to report themselves",
      "Use the same shared account for both functions"
    ],
    answer: 0,
    explanation: "Role conflict rules (static SoD) block toxic combinations at provisioning time, and dynamic SoD can restrict them per session. Granting both permissions defeats the purpose. Self-reporting is not a control. Shared accounts remove accountability."
  },
  {
    id: "q-p5-d5-015",
    module: "p5-d5",
    difficulty: 2,
    q: "A firewall permits traffic based on rules that apply equally to all users, such as \"deny all inbound traffic except TCP 443.\" Which access control model is this?",
    options: [
      "Role-based access control",
      "Mandatory access control",
      "Discretionary access control",
      "Rule-based access control"
    ],
    answer: 3,
    explanation: "Rule-based access control applies global rules regardless of user identity. RBAC is based on roles. MAC uses labels and clearances. DAC lets owners assign permissions."
  },
  {
    id: "q-p5-d5-016",
    module: "p5-d5",
    difficulty: 3,
    q: "A service account used by a critical application has a password that never changes and is known by four developers. What is the BEST improvement?",
    options: [
      "Write the password in the project wiki so it does not get lost",
      "Add the service account to Domain Admins to avoid permission errors",
      "Store the credential in a vault with automated rotation (or use managed identities), restrict interactive logon, and remove human knowledge of the secret",
      "Change it once and email it to the developers"
    ],
    answer: 2,
    explanation: "Vaulting, automatic rotation, group managed service accounts or cloud managed identities, plus denying interactive logon, reduce misuse and Kerberoasting risk. A wiki exposes the secret. Domain Admin membership violates least privilege. Emailing a new password repeats the problem."
  },
  {
    id: "q-p5-d5-017",
    module: "p5-d5",
    difficulty: 2,
    q: "Why are FIDO2/WebAuthn passkeys considered resistant to phishing?",
    options: [
      "They use a six-digit code that changes every 30 seconds",
      "They rely on SMS messages",
      "They require security questions",
      "The credential is bound to the legitimate origin, and the private key never leaves the authenticator, so a fake site cannot obtain a usable response"
    ],
    answer: 3,
    explanation: "Origin binding means a phishing domain receives no valid assertion, and there is no shared secret to steal. TOTP codes can be phished in real time. SMS is vulnerable to SIM swapping and phishing. Security questions are weak knowledge-based factors."
  },
  {
    id: "q-p5-d5-018",
    module: "p5-d5",
    difficulty: 3,
    q: "Contractors are hired for a 3-month project. What is the BEST way to manage their accounts?",
    options: [
      "Create accounts with automatic expiration dates matching the contract, with sponsor-based review for any extension",
      "Give them permanent accounts like employees",
      "Have them share one account",
      "Let them use employees' accounts"
    ],
    answer: 0,
    explanation: "Expiration dates and sponsorship ensure access ends when the business need ends, even if someone forgets to deprovision it. Permanent accounts create orphaned access. Shared or borrowed accounts violate accountability and policy."
  },
  {
    id: "q-p5-d5-019",
    module: "p5-d5",
    difficulty: 3,
    q: "An organization deploys SSO across 200 applications. What is the MOST significant new risk, and the BEST mitigation?",
    options: [
      "Users will forget more passwords, so disable SSO",
      "Compromise of one credential grants access to many apps, so protect SSO with phishing-resistant MFA and strong session controls",
      "SSO makes logging impossible, so turn off logs",
      "SSO prevents MFA, so remove MFA"
    ],
    answer: 1,
    explanation: "SSO concentrates risk at the identity provider (\"keys to the kingdom\"), so strong MFA, conditional access and monitoring are essential. SSO actually reduces the number of passwords. SSO centralizes logging rather than preventing it, and it works well with MFA."
  },
  {
    id: "q-p5-d5-020",
    module: "p5-d5",
    difficulty: 2,
    q: "What is Identity as a Service (IDaaS)?",
    options: [
      "A physical ID badge printer",
      "A type of firewall",
      "A cloud-delivered identity platform providing services such as SSO, MFA, provisioning and federation",
      "An encryption algorithm"
    ],
    answer: 2,
    explanation: "IDaaS (e.g., cloud identity providers) delivers IAM capabilities as a service and often integrates with HR systems and SaaS applications via SCIM and SAML/OIDC. It is not a badge printer, a firewall, or an algorithm."
  },
  {
    id: "q-p5-d5-021",
    module: "p5-d5",
    difficulty: 3,
    q: "An analyst with Secret clearance requests a Secret document from a project they are not assigned to. Under MAC with compartments, should access be granted?",
    options: [
      "Yes—matching clearance is always sufficient",
      "Yes—if the analyst's manager is on vacation",
      "No—clearance is necessary but not sufficient; the user also needs a need to know (compartment authorization) for that information",
      "No—Secret documents can never be read"
    ],
    answer: 2,
    explanation: "MAC typically requires both a clearance at or above the label and membership in the relevant category or compartment (need to know). Clearance alone is not enough. A manager's absence is irrelevant. Cleared users with need to know can read Secret documents."
  },
  {
    id: "q-p5-d5-022",
    module: "p5-d5",
    difficulty: 3,
    q: "A senior engineer with broad administrative access is being terminated after a dispute. What should be done to protect the organization?",
    options: [
      "Disable accounts a week later",
      "Coordinate with HR to disable all accounts, revoke tokens and keys, and collect devices at the moment of notification, then review recent activity",
      "Ask the engineer to delete their own accounts",
      "Rely on the engineer's non-disclosure agreement alone"
    ],
    answer: 1,
    explanation: "For high-risk departures, revocation must coincide with notification and include all credentials (SSO, VPN, API keys, SSH keys, cloud consoles), followed by a review for sabotage or exfiltration. Delays leave a window for misuse. Self-service deletion is unreliable. An NDA is a legal deterrent, not a technical control."
  },
  {
    id: "q-p5-d5-023",
    module: "p5-d5",
    difficulty: 2,
    q: "Which access control model makes decisions based on attributes of the subject, object, action and environment, such as \"doctors may view records of patients in their department during their shift\"?",
    options: [
      "Discretionary access control (DAC)",
      "Mandatory access control (MAC)",
      "Role-based access control (RBAC) alone",
      "Attribute-based access control (ABAC)"
    ],
    answer: 3,
    explanation: "ABAC evaluates policies combining multiple attributes, enabling fine-grained, context-aware decisions (NIST SP 800-162). DAC relies on owner discretion. MAC uses labels and clearances. RBAC alone cannot express conditions like department matching and time of shift without role explosion."
  },
  {
    id: "q-p5-d5-024",
    module: "p5-d5",
    difficulty: 2,
    q: "What is the PRIMARY purpose of an access control list (ACL) on a file?",
    options: [
      "To specify which subjects can access the object and what operations they may perform",
      "To encrypt the file",
      "To compress the file",
      "To back up the file"
    ],
    answer: 0,
    explanation: "An ACL is attached to an object and lists subjects and their permissions (read, write, execute). It does not encrypt, compress, or back up data. (Capability tables, by contrast, are attached to subjects.)"
  },
  {
    id: "q-p5-d5-025",
    module: "p5-d5",
    difficulty: 3,
    q: "Over a weekend, an attacker gains access to an account and changes its MFA phone number. Which IAM control would MOST likely have detected this change quickly?",
    options: [
      "Requiring users to change their password every 90 days",
      "Using a complex username format",
      "Disabling all logging on weekends",
      "Alerting on security-sensitive account changes (MFA method changes, password resets) with notification to the user and the SOC"
    ],
    answer: 3,
    explanation: "Monitoring and notifying on authentication factor changes is a key control against account takeover persistence. Periodic password changes do not detect MFA tampering. Username complexity is irrelevant. Disabling logging removes detection entirely."
  },
  // ---- p5-d6 ----
  {
    id: "q-p5-d6-001",
    module: "p5-d6",
    difficulty: 2,
    q: "What is the MAIN difference between a vulnerability assessment and a penetration test?",
    options: [
      "They are identical",
      "A vulnerability assessment identifies and prioritizes weaknesses; a penetration test actively exploits them to demonstrate real-world impact",
      "A penetration test is always automated",
      "A vulnerability assessment requires exploiting systems"
    ],
    answer: 1,
    explanation: "Vulnerability assessments (often scanner-driven) find and rank weaknesses. Penetration tests go further by attempting exploitation, chaining issues to show business impact. They are not the same, pentests involve significant manual work, and assessments generally do not exploit."
  },
  {
    id: "q-p5-d6-002",
    module: "p5-d6",
    difficulty: 3,
    q: "A security manager is planning an external penetration test. What must be obtained FIRST?",
    options: [
      "The testers' preferred tools list",
      "A list of all employees' passwords",
      "Written authorization from management, with a defined scope and rules of engagement",
      "A copy of the previous year's budget"
    ],
    answer: 2,
    explanation: "Testing without written permission can be illegal and disruptive; the scope, timing, rules of engagement and emergency contacts must be agreed in advance. Tool lists are secondary. Testers should never be given all passwords. Budgets do not authorize testing."
  },
  {
    id: "q-p5-d6-003",
    module: "p5-d6",
    difficulty: 2,
    q: "A tester is given network diagrams, source code and credentials before the assessment. Which type of test is this?",
    options: [
      "White-box (full knowledge) testing",
      "Black-box (zero knowledge) testing",
      "Gray-box (partial knowledge) testing",
      "Blind social engineering"
    ],
    answer: 0,
    explanation: "White-box testing provides full information for thorough coverage. Black-box testing provides no prior knowledge, simulating an external attacker. Gray-box testing provides partial knowledge, such as user credentials. Blind social engineering is unrelated."
  },
  {
    id: "q-p5-d6-004",
    module: "p5-d6",
    difficulty: 3,
    q: "You are selecting a SaaS provider and need independent evidence that its security controls operated effectively over the past year. Which document is BEST?",
    options: [
      "A SOC 1 Type I report",
      "The provider's marketing white paper",
      "A SOC 2 Type II report",
      "A self-completed questionnaire with no evidence"
    ],
    answer: 2,
    explanation: "SOC 2 Type II reports cover the Trust Services Criteria (security, availability, and more) and test operating effectiveness over a period. SOC 1 focuses on financial reporting controls, and Type I covers design at a point in time. Marketing papers and unsupported questionnaires lack independent assurance."
  },
  {
    id: "q-p5-d6-005",
    module: "p5-d6",
    difficulty: 2,
    q: "Why is independence important for auditors?",
    options: [
      "To ensure objective, unbiased findings that management and stakeholders can rely on",
      "To make audits cheaper",
      "Because auditors must also run operations",
      "So auditors can approve their own work"
    ],
    answer: 0,
    explanation: "Auditors must not audit work they designed or operate, because objectivity gives the results credibility. Independence is not about cost. Auditors should not perform the operations they review or approve their own work."
  },
  {
    id: "q-p5-d6-006",
    module: "p5-d6",
    difficulty: 2,
    q: "Which testing technique feeds malformed or random input to an application to discover crashes and unexpected behavior?",
    options: [
      "Code signing",
      "Regression testing",
      "Load balancing",
      "Fuzzing"
    ],
    answer: 3,
    explanation: "Fuzzing (mutation or generation based) is excellent at finding memory corruption and input-handling bugs. Code signing verifies integrity and publisher. Regression testing ensures changes did not break existing functionality. Load balancing distributes traffic."
  },
  {
    id: "q-p5-d6-007",
    module: "p5-d6",
    difficulty: 3,
    q: "During testing of a banking app, the team writes test cases for how an attacker might abuse the \"transfer funds\" feature, such as negative amounts or replayed requests. What is this called?",
    options: [
      "Use case testing only",
      "Misuse (abuse) case testing",
      "Penetration testing of the network layer",
      "Unit testing of the UI color scheme"
    ],
    answer: 1,
    explanation: "Misuse cases describe how features could be abused, deriving security requirements and tests from an attacker's perspective. Use cases cover intended behavior. Network penetration testing targets infrastructure. UI color tests are unrelated."
  },
  {
    id: "q-p5-d6-008",
    module: "p5-d6",
    difficulty: 2,
    q: "What does code coverage analysis measure?",
    options: [
      "The number of developers on the project",
      "The amount of disk space the code uses",
      "The proportion of code (e.g., statements, branches or functions) exercised by the test suite",
      "The number of security vulnerabilities found"
    ],
    answer: 2,
    explanation: "Coverage metrics show how much code has been tested, revealing untested paths. High coverage does not guarantee quality or security, but low coverage indicates gaps. It is not a team size, storage or vulnerability count metric."
  },
  {
    id: "q-p5-d6-009",
    module: "p5-d6",
    difficulty: 2,
    q: "Which testing type verifies that different components (for example, APIs between microservices) correctly exchange data and handle errors?",
    options: [
      "Penetration testing of physical locks",
      "Interface testing",
      "Static code analysis only",
      "Social engineering testing"
    ],
    answer: 1,
    explanation: "Interface testing validates APIs, user interfaces and physical interfaces, including error handling and security checks between components. Physical lock testing, static analysis and social engineering address other areas."
  },
  {
    id: "q-p5-d6-010",
    module: "p5-d6",
    difficulty: 2,
    q: "An e-commerce company runs scripted transactions every 5 minutes against its checkout page to measure availability and response time. What is this called?",
    options: [
      "Synthetic transaction monitoring",
      "Real user monitoring (RUM)",
      "Fuzzing",
      "Regression testing"
    ],
    answer: 0,
    explanation: "Synthetic monitoring uses scripted, simulated transactions to proactively detect problems. RUM measures actual users' experiences passively. Fuzzing sends malformed input to find bugs. Regression testing validates changes before release."
  },
  {
    id: "q-p5-d6-011",
    module: "p5-d6",
    difficulty: 3,
    q: "The board wants an early warning that the organization's exposure to ransomware is increasing. Which metric is the BEST key risk indicator (KRI)?",
    options: [
      "The number of firewalls purchased",
      "The size of the security team's office",
      "The number of security newsletters sent",
      "The percentage of internet-facing critical vulnerabilities older than the remediation SLA"
    ],
    answer: 3,
    explanation: "KRIs signal changes in risk exposure; overdue critical vulnerabilities on exposed systems directly increase the likelihood of ransomware. Firewalls purchased and newsletters sent are activity metrics. Office size is irrelevant."
  },
  {
    id: "q-p5-d6-012",
    module: "p5-d6",
    difficulty: 2,
    q: "Why should log reviews be performed regularly rather than only after incidents?",
    options: [
      "To detect anomalies, policy violations and attacks early, and to confirm that logging is actually working",
      "Because logs automatically delete themselves when reviewed",
      "To reduce the need for any other control",
      "Because regulations prohibit reviewing logs after incidents"
    ],
    answer: 0,
    explanation: "Proactive review catches issues sooner and confirms logging is functioning; gaps found during an incident are too late. Reviewing logs does not delete them. Logging complements other controls rather than replacing them. Post-incident review is expected, not prohibited."
  },
  {
    id: "q-p5-d6-013",
    module: "p5-d6",
    difficulty: 3,
    q: "A CISO wants continuous validation that security controls detect and block real attack techniques, beyond annual pentests. Which approach BEST fits?",
    options: [
      "Doubling the annual pentest budget only",
      "Breach and attack simulation (BAS) that safely emulates ATT&CK techniques on a regular schedule",
      "Relying on vendor marketing claims",
      "Turning off controls periodically to see what happens"
    ],
    answer: 1,
    explanation: "BAS platforms continuously run safe attack simulations and report which detections and preventions worked, supporting continuous control validation. A larger annual pentest is still point-in-time. Marketing claims are not evidence. Turning off controls creates real risk."
  },
  {
    id: "q-p5-d6-014",
    module: "p5-d6",
    difficulty: 3,
    q: "During an authorized penetration test, the tester finds evidence that the system is ALREADY compromised by a real attacker. What should the tester do FIRST?",
    options: [
      "Continue testing and mention it in the final report",
      "Try to remove the attacker's malware themselves",
      "Publish the finding on social media",
      "Stop the relevant testing and immediately notify the designated client contact according to the rules of engagement"
    ],
    answer: 3,
    explanation: "Discovery of an active compromise is a critical finding that typically triggers immediate escalation under the RoE so that the client's incident response can begin. Waiting for the report delays response. Unilateral cleanup may destroy evidence and exceed authorization. Public disclosure is unethical."
  },
  {
    id: "q-p5-d6-015",
    module: "p5-d6",
    difficulty: 3,
    q: "Which element of a security assessment report is MOST useful to senior management?",
    options: [
      "Raw scanner output of 4,000 pages",
      "The testers' personal opinions about the IT staff",
      "An executive summary that explains business risk, priorities and recommended actions in non-technical terms",
      "A list of every tool used, with version numbers"
    ],
    answer: 2,
    explanation: "Managers need risk-based conclusions to make decisions and allocate resources; technical details belong in appendices. Raw output is unusable for executives. Personal opinions are unprofessional. Tool lists matter for methodology but not for decision-making."
  },
  {
    id: "q-p5-d6-016",
    module: "p5-d6",
    difficulty: 2,
    q: "Backups complete successfully every night according to the backup software. What is the BEST way to verify that they meet recovery objectives?",
    options: [
      "Perform periodic test restores and measure whether data and timing meet the RPO and RTO",
      "Trust the \"success\" status messages",
      "Check that the backup tapes are labeled",
      "Ask the vendor whether backups usually work"
    ],
    answer: 0,
    explanation: "Only actual restores prove that backups are complete, uncorrupted and restorable in time. Success messages can hide incomplete or corrupt data. Labels say nothing about content. A vendor's general assurances do not prove your backups work."
  },
  {
    id: "q-p5-d6-017",
    module: "p5-d6",
    difficulty: 2,
    q: "Which disaster recovery test runs critical systems at the alternate site while the primary site continues normal processing?",
    options: [
      "Full interruption test",
      "Checklist (read-through) review",
      "Structured walk-through (tabletop)",
      "Parallel test"
    ],
    answer: 3,
    explanation: "A parallel test activates the recovery site and processes in parallel without disrupting production. A full interruption test shuts down the primary site—the most realistic and riskiest test. Checklist reviews and walk-throughs are discussion-based exercises."
  },
  {
    id: "q-p5-d6-018",
    module: "p5-d6",
    difficulty: 2,
    q: "After developers fix a bug, which testing ensures the fix did not break existing functionality?",
    options: [
      "Fuzzing",
      "Regression testing",
      "Acceptance of risk",
      "Penetration testing by a third party"
    ],
    answer: 1,
    explanation: "Regression testing re-runs existing test suites after changes to catch unintended side effects. Fuzzing finds input-handling bugs. Risk acceptance is a management decision. Third-party pentesting assesses security exposure rather than functional regressions."
  },
  {
    id: "q-p5-d6-019",
    module: "p5-d6",
    difficulty: 2,
    q: "What is a key advantage of static application security testing (SAST)?",
    options: [
      "It tests the application's runtime configuration in production",
      "It requires no access to source code or binaries",
      "It can find coding flaws early in development, before the application is deployed",
      "It eliminates the need for code review"
    ],
    answer: 2,
    explanation: "SAST analyzes source code, bytecode or binaries without execution, supporting shift-left security. Runtime configuration is assessed by DAST or IAST. SAST needs code or binaries. It complements, rather than replaces, manual review."
  },
  {
    id: "q-p5-d6-020",
    module: "p5-d6",
    difficulty: 3,
    q: "An internal audit identified 15 findings six months ago, but nobody knows which have been fixed. What is the BEST improvement?",
    options: [
      "Repeat the audit and ignore the old findings",
      "Close all findings because six months have passed",
      "Ask the auditor to fix the findings personally",
      "Track findings in a remediation register with owners, due dates and verification of closure, reported to management"
    ],
    answer: 3,
    explanation: "Findings management requires accountability and verification; reporting status to management drives completion. Ignoring old findings wastes the audit. Time passing does not fix anything. Auditors should not fix findings because that compromises their independence."
  },
  {
    id: "q-p5-d6-021",
    module: "p5-d6",
    difficulty: 3,
    q: "An auditor needs to verify that only authorized users have access to the payroll system, which has 3,000 accounts. What is the MOST efficient effective approach?",
    options: [
      "Review only the auditor's own account",
      "Select a statistically valid sample of accounts and compare their access against approved authorization records",
      "Ask the payroll manager whether access is fine",
      "Accept the system's default settings as compliant"
    ],
    answer: 1,
    explanation: "Sampling provides reasonable assurance efficiently when full review is impractical (and automated full-population analytics are even better when available). Reviewing a single account is insufficient. Verbal assurance is not evidence. Default settings prove nothing about who has access."
  },
  {
    id: "q-p5-d6-022",
    module: "p5-d6",
    difficulty: 2,
    q: "In security exercises, what is a purple team?",
    options: [
      "A collaborative approach in which red (offense) and blue (defense) teams work together to improve detections and controls",
      "A team that only writes policies",
      "A team that handles physical security only",
      "An external auditor group"
    ],
    answer: 0,
    explanation: "Purple teaming shares attack details in real time so defenders can tune detection and response, maximizing learning. It is not a policy, physical security, or audit function."
  },
  {
    id: "q-p5-d6-023",
    module: "p5-d6",
    difficulty: 3,
    q: "A vulnerability has a CVSS v4.0 Base score of 9.3, but the affected system is an isolated lab host with no sensitive data. Which CVSS mechanism helps reflect your organization's actual risk?",
    options: [
      "Ignoring CVSS entirely",
      "The vendor's marketing severity rating",
      "Environmental metrics (and Threat metrics) that adjust the score for your context and current exploit maturity",
      "Rounding the score down to 0"
    ],
    answer: 2,
    explanation: "CVSS v4.0 provides Threat metrics (e.g., Exploit Maturity) and Environmental metrics (security requirements and modified base metrics) to produce CVSS-BTE scores reflecting real context. Ignoring scoring loses consistency. Marketing ratings lack rigor. Arbitrary rounding is not a method."
  },
  {
    id: "q-p5-d6-024",
    module: "p5-d6",
    difficulty: 2,
    q: "What is the goal of information security continuous monitoring (ISCM), as described in NIST SP 800-137?",
    options: [
      "Performing a single audit every five years",
      "Maintaining ongoing awareness of security, vulnerabilities and threats to support risk management decisions",
      "Monitoring employees' personal social media",
      "Replacing all security controls with monitoring"
    ],
    answer: 1,
    explanation: "ISCM provides near-real-time insight into control effectiveness and risk posture. One audit every five years is point-in-time. Monitoring personal social media is outside its scope and raises legal concerns. Monitoring complements controls rather than replacing them."
  },
  {
    id: "q-p5-d6-025",
    module: "p5-d6",
    difficulty: 2,
    q: "A company launches a bug bounty program. What is MOST important to define before launch?",
    options: [
      "A rule that researchers may test any company system they find",
      "A plan to sue all researchers who report bugs",
      "A guarantee that no vulnerabilities exist",
      "A clear scope, rules, safe-harbor terms and reward structure, with an internal process to triage and fix reports"
    ],
    answer: 3,
    explanation: "Clear policies make testing legal and focused, while an internal triage and remediation workflow ensures reports lead to fixes. Unlimited scope invites disruption. Threatening researchers discourages reporting. No organization can guarantee the absence of vulnerabilities."
  },
  // ---- p5-d7 ----
  {
    id: "q-p5-d7-001",
    module: "p5-d7",
    difficulty: 2,
    q: "Which BEST ensures that digital evidence will be admissible in court?",
    options: [
      "Collecting it using sound forensic procedures and maintaining an unbroken chain of custody",
      "Storing it on the analyst's personal laptop",
      "Editing it to remove irrelevant information",
      "Collecting it without documentation to save time"
    ],
    answer: 0,
    explanation: "Evidence must be relevant, reliable and properly handled; documented procedures, hashing and chain of custody demonstrate integrity. Personal devices break custody. Editing evidence destroys its integrity. Undocumented collection can render evidence inadmissible."
  },
  {
    id: "q-p5-d7-002",
    module: "p5-d7",
    difficulty: 3,
    q: "A SOC analyst detects suspicious outbound traffic from a server. Following a typical incident response process, what should be done FIRST?",
    options: [
      "Immediately rebuild the server",
      "Notify the media",
      "Validate and triage the event to determine whether it is an actual incident and its scope",
      "Hold the lessons-learned meeting"
    ],
    answer: 2,
    explanation: "Detection is followed by analysis and validation, then containment, eradication and recovery, and finally lessons learned. Rebuilding first destroys evidence and may miss the root cause. Media notification is premature and handled by communications or legal. Lessons learned comes last."
  },
  {
    id: "q-p5-d7-003",
    module: "p5-d7",
    difficulty: 2,
    q: "What is the PRIMARY purpose of change management?",
    options: [
      "To prevent all changes",
      "To speed up changes by skipping approvals",
      "To ensure changes are reviewed, approved, tested and documented to minimize unintended impact on security and availability",
      "To track employees' vacation days"
    ],
    answer: 2,
    explanation: "Change management balances agility with stability and security through review, approval, testing, rollback planning and documentation. Its goal is not to block all change or to skip approvals, and it has nothing to do with HR leave tracking."
  },
  {
    id: "q-p5-d7-004",
    module: "p5-d7",
    difficulty: 3,
    q: "An attacker modifies a server configuration, and the change goes unnoticed for weeks. Which practice would MOST likely have detected it sooner?",
    options: [
      "Purchasing faster servers",
      "Configuration management with a defined baseline and automated drift/integrity monitoring",
      "Annual security awareness training",
      "Disabling logging to improve performance"
    ],
    answer: 1,
    explanation: "Secure baselines combined with configuration monitoring or file integrity monitoring detect unauthorized changes quickly. Hardware speed is irrelevant. Awareness training does not detect configuration drift. Disabling logging reduces visibility."
  },
  {
    id: "q-p5-d7-005",
    module: "p5-d7",
    difficulty: 2,
    q: "Why should patches be tested before deployment to production?",
    options: [
      "Because patches always contain malware",
      "To delay patching as long as possible",
      "Because vendors require customers to test every patch for a year",
      "To verify they do not break critical applications or cause instability, while still deploying within risk-based timelines"
    ],
    answer: 3,
    explanation: "Testing reduces the risk of outages, but timelines must reflect risk—for example, expediting known-exploited vulnerabilities. Patches do not \"always\" contain malware. Delaying indefinitely increases exposure. Vendors do not impose a year of testing."
  },
  {
    id: "q-p5-d7-006",
    module: "p5-d7",
    difficulty: 3,
    q: "A company takes a full backup on Sunday and differential backups Monday through Saturday. The server fails Thursday morning. Which backups are needed to restore?",
    options: [
      "Sunday's full backup and Wednesday's differential",
      "Sunday's full backup and every differential from Monday to Wednesday",
      "Only Wednesday's differential",
      "Only Sunday's full backup"
    ],
    answer: 0,
    explanation: "Each differential contains all changes since the last full backup, so you need the full backup plus the most recent differential. All daily backups would be needed with incremental backups, not differentials. A differential alone lacks the base data. The full backup alone loses Monday–Wednesday's changes."
  },
  {
    id: "q-p5-d7-007",
    module: "p5-d7",
    difficulty: 2,
    q: "Which RAID level uses striping with distributed parity and can survive the failure of one disk?",
    options: [
      "RAID 0",
      "RAID 5",
      "RAID 1",
      "JBOD"
    ],
    answer: 1,
    explanation: "RAID 5 stripes data with parity across three or more disks and tolerates a single disk failure (RAID 6 tolerates two). RAID 0 is striping with no redundancy. RAID 1 is mirroring, which also survives one failure but does not use parity. JBOD simply concatenates disks."
  },
  {
    id: "q-p5-d7-008",
    module: "p5-d7",
    difficulty: 3,
    q: "A business requires an RTO of under one hour for its trading platform, and cost is a secondary concern. Which recovery site is MOST appropriate?",
    options: [
      "Cold site with power and space only",
      "Warm site with partial equipment",
      "A reciprocal agreement with a competitor",
      "Hot site (or an active-active/cloud equivalent) with up-to-date systems and data"
    ],
    answer: 3,
    explanation: "Hot sites are fully equipped with near-current data and can take over within minutes to hours. Cold sites take days or weeks to equip. Warm sites typically need hours to days. Reciprocal agreements are hard to enforce and raise capacity and confidentiality issues."
  },
  {
    id: "q-p5-d7-009",
    module: "p5-d7",
    difficulty: 2,
    q: "During a building fire, what is the HIGHEST priority?",
    options: [
      "Protecting the servers",
      "Saving the backup tapes",
      "Ensuring the safety of people",
      "Preserving digital evidence"
    ],
    answer: 2,
    explanation: "Human life and safety always come first in CISSP thinking and in reality. Equipment, backups and evidence are important, but they are always secondary to personnel safety."
  },
  {
    id: "q-p5-d7-010",
    module: "p5-d7",
    difficulty: 2,
    q: "Which control requires that two authorized individuals be present to perform a highly sensitive operation, such as opening the vault containing root CA keys?",
    options: [
      "Two-person integrity (dual control)",
      "Job rotation",
      "Least privilege",
      "Mandatory vacation"
    ],
    answer: 0,
    explanation: "Two-person integrity or dual control prevents a single individual from performing a critical action alone. Job rotation moves people between roles. Least privilege limits access to the minimum required. Mandatory vacation helps detect fraud."
  },
  {
    id: "q-p5-d7-011",
    module: "p5-d7",
    difficulty: 3,
    q: "Analysts are overwhelmed correlating firewall, endpoint, identity and cloud logs manually. What is the BEST improvement?",
    options: [
      "Stop collecting cloud logs",
      "Hire one more analyst and keep manual review",
      "Centralize logs in a SIEM with correlation rules and automated enrichment and response (SOAR) for common scenarios",
      "Print the logs for easier reading"
    ],
    answer: 2,
    explanation: "A SIEM normalizes and correlates multiple sources, and SOAR automates repetitive steps, improving speed and consistency. Dropping log sources creates blind spots. One more analyst does not scale. Printing logs is impractical."
  },
  {
    id: "q-p5-d7-012",
    module: "p5-d7",
    difficulty: 2,
    q: "How should an organization BEST use threat intelligence in security operations?",
    options: [
      "Apply intelligence relevant to its industry and assets to prioritize detections, hunting and defenses",
      "Block every indicator from every free feed without review",
      "Ignore intelligence because it is often outdated",
      "Share internal passwords with intelligence partners"
    ],
    answer: 0,
    explanation: "Relevant, actionable intelligence informs priorities and detection engineering. Blind blocking produces false positives and outages. Ignoring intelligence wastes insight. Sharing passwords is a severe security violation."
  },
  {
    id: "q-p5-d7-013",
    module: "p5-d7",
    difficulty: 3,
    q: "Which control is MOST effective at detecting large-scale data exfiltration from the corporate network?",
    options: [
      "Ingress filtering only",
      "Locking server room doors",
      "Disabling all outbound traffic, including business-critical services",
      "Egress monitoring, such as DLP and network flow analysis of outbound traffic, with alerting on anomalies"
    ],
    answer: 3,
    explanation: "Egress monitoring analyzes data leaving the network for sensitive content and unusual volumes or destinations. Ingress filtering focuses on inbound threats. Physical locks do not see network exfiltration. Blocking all outbound traffic would halt the business."
  },
  {
    id: "q-p5-d7-014",
    module: "p5-d7",
    difficulty: 2,
    q: "What is the main security purpose of sandboxing in security operations?",
    options: [
      "Storing backup tapes",
      "Executing untrusted code or files in an isolated environment to observe behavior without risking production systems",
      "Compressing log files",
      "Encrypting emails"
    ],
    answer: 1,
    explanation: "Sandboxes isolate execution, enabling safe analysis and limiting damage (e.g., email attachment detonation). They are not used for backups, compression or email encryption."
  },
  {
    id: "q-p5-d7-015",
    module: "p5-d7",
    difficulty: 3,
    q: "A company deploys a honeypot to study attackers. Legal counsel warns about \"entrapment.\" Which practice keeps the honeypot on the right side of this line?",
    options: [
      "Advertising on hacker forums that the system contains free credit card numbers",
      "Hacking back into attackers' systems",
      "Passively making the system available (enticement) without actively inducing someone to commit a crime they would not otherwise commit",
      "Paying attackers to break in"
    ],
    answer: 2,
    explanation: "Enticement—letting attackers find a target they were already seeking—is generally legal and ethical, while inducing a crime (entrapment) is not, and the concept chiefly concerns law enforcement. Advertising bait or paying attackers induces criminal acts. Hacking back is illegal in most jurisdictions."
  },
  {
    id: "q-p5-d7-016",
    module: "p5-d7",
    difficulty: 2,
    q: "Which media management practice BEST protects backup tapes during transport to an off-site facility?",
    options: [
      "Labeling the tapes \"Top Secret\" in large letters",
      "Sending them by regular mail without tracking",
      "Leaving them in an employee's car overnight",
      "Encrypting the backups and using a bonded courier with chain-of-custody tracking"
    ],
    answer: 3,
    explanation: "Encryption protects data if media is lost, and tracked, bonded transport ensures accountability. Conspicuous labels attract attention. Untracked mail and unattended cars invite loss and theft."
  },
  {
    id: "q-p5-d7-017",
    module: "p5-d7",
    difficulty: 3,
    q: "Your company receives notice of a lawsuit related to a former employee's emails. What should happen FIRST regarding the relevant data?",
    options: [
      "Delete the emails to limit liability",
      "Issue a legal hold so that relevant data is preserved and normal deletion is suspended",
      "Wait for the court to request the data",
      "Move the mailbox to a personal account"
    ],
    answer: 1,
    explanation: "A legal hold, issued once litigation is reasonably anticipated, preserves potentially relevant information as part of eDiscovery (EDRM). Deletion constitutes spoliation and can lead to sanctions. Waiting risks losing data through routine retention. Moving data to personal accounts breaks custody and policy."
  },
  {
    id: "q-p5-d7-018",
    module: "p5-d7",
    difficulty: 2,
    q: "In an internal investigation of policy violations, which factor is MOST important?",
    options: [
      "Following documented procedures consistently and coordinating with HR and legal as appropriate",
      "Interrogating the employee without documentation",
      "Sharing suspicions with all staff",
      "Ignoring privacy laws to gather more information"
    ],
    answer: 0,
    explanation: "Administrative investigations must be fair, documented and lawful to support disciplinary action and avoid liability. Undocumented interrogations, broadcasting suspicions and violating privacy laws all create legal risk and undermine the outcome."
  },
  {
    id: "q-p5-d7-019",
    module: "p5-d7",
    difficulty: 3,
    q: "During a forensic investigation, why should an analyst work on a verified copy of the evidence rather than the original media?",
    options: [
      "Because copies are always faster to analyze",
      "Because originals must be destroyed after imaging",
      "Because analysis tools cannot read original disks",
      "To preserve the original's integrity; the copy's hash matches the original's, so findings remain defensible"
    ],
    answer: 3,
    explanation: "Analyzing a hash-verified forensic image prevents accidental modification of original evidence, which remains secured and unchanged. Speed is not the reason. Originals must be preserved, not destroyed. Tools can read originals; the concern is integrity."
  },
  {
    id: "q-p5-d7-020",
    module: "p5-d7",
    difficulty: 2,
    q: "Which perimeter control is designed to deter and delay intruders and is commonly 8 feet (2.4 m) or higher with barbed wire for serious intruders?",
    options: [
      "Motion-activated lighting only",
      "Security awareness posters",
      "Fencing",
      "Badge readers on interior doors"
    ],
    answer: 2,
    explanation: "Fence heights correspond to protection levels: about 3–4 feet deters casual trespassers, 6–7 feet is difficult to climb, and 8 feet with barbed wire deters determined intruders. Lighting supports detection. Posters target employees. Interior badge readers control internal zones."
  },
  {
    id: "q-p5-d7-021",
    module: "p5-d7",
    difficulty: 3,
    q: "After a disaster, the primary site has been restored. In what order should operations be moved back from the alternate site?",
    options: [
      "Move the least critical functions first to verify the primary site, then the most critical functions last",
      "Move the most critical functions first",
      "Move everything at once to save time",
      "Never return to the primary site"
    ],
    answer: 0,
    explanation: "Returning low-criticality functions first tests the restored site's stability without risking critical operations; critical functions move last, once confidence is established. Moving critical functions first risks a second outage. A big-bang move increases risk. Staying at the alternate site indefinitely may be costly or impractical."
  },
  {
    id: "q-p5-d7-022",
    module: "p5-d7",
    difficulty: 3,
    q: "To ensure recovery from a destructive ransomware attack that targets backups, which backup strategy is BEST?",
    options: [
      "Keep all backups on a network share accessible with domain admin credentials",
      "Maintain immutable and/or offline (air-gapped) backup copies, protected by separate credentials, and test restores regularly",
      "Back up only once per year",
      "Rely on RAID as the backup"
    ],
    answer: 1,
    explanation: "Modern ransomware deletes or encrypts reachable backups, so immutable, offline or logically separated copies (the 3-2-1-1-0 approach) with separate authentication survive. Domain-accessible shares are prime targets. Annual backups mean huge data loss. RAID provides availability, not backup—it faithfully replicates encrypted data."
  },
  {
    id: "q-p5-d7-023",
    module: "p5-d7",
    difficulty: 2,
    q: "A system has an MTBF of 10,000 hours and an MTTR of 4 hours. What does the MTTR describe?",
    options: [
      "The average time between failures",
      "The maximum tolerable downtime",
      "The average time required to repair the system and restore it to service after a failure",
      "The amount of data that can be lost"
    ],
    answer: 2,
    explanation: "Mean time to repair/restore is the average time from failure to recovery. MTBF is the average operating time between failures. MTD is a business tolerance limit. Data loss tolerance is the RPO."
  },
  {
    id: "q-p5-d7-024",
    module: "p5-d7",
    difficulty: 3,
    q: "Which program element is MOST effective for reducing insider threat risk?",
    options: [
      "Monitoring only the IT department",
      "A cross-functional insider risk program combining HR, legal and security, with user behavior analytics, least privilege and clear reporting channels",
      "Assuming all employees are trustworthy",
      "Publicly shaming employees suspected of wrongdoing"
    ],
    answer: 1,
    explanation: "Insider risk requires behavioral indicators from HR and security combined with technical controls and a fair, lawful process. Monitoring only IT misses other insiders. Blind trust ignores the risk. Public shaming is unethical and legally risky."
  },
  {
    id: "q-p5-d7-025",
    module: "p5-d7",
    difficulty: 2,
    q: "An executive is traveling to a high-risk country. Which practice BEST protects corporate data?",
    options: [
      "Take a regular laptop with full data and disable encryption to pass customs faster",
      "Leave the laptop unattended in the hotel room",
      "Use public kiosk computers for email",
      "Issue a clean loaner device with minimal data, use a VPN, and inspect or reimage the device on return"
    ],
    answer: 3,
    explanation: "Loaner devices limit exposure if seized or tampered with, and post-trip reimaging removes implants. Disabling encryption exposes data. Unattended devices are vulnerable to \"evil maid\" attacks. Public kiosks may be compromised."
  },
  // ---- p5-d8 ----
  {
    id: "q-p5-d8-001",
    module: "p5-d8",
    difficulty: 2,
    q: "When is the BEST time to integrate security into the software development life cycle (SDLC)?",
    options: [
      "From the earliest phase—requirements and design—and throughout every subsequent phase",
      "Only during final testing",
      "After deployment, when users report bugs",
      "Only when an auditor requests it"
    ],
    answer: 0,
    explanation: "Building security in from requirements onward is far cheaper and more effective than retrofitting (shift left). Waiting for testing, production or audits finds issues when they are costly to fix."
  },
  {
    id: "q-p5-d8-002",
    module: "p5-d8",
    difficulty: 2,
    q: "What is the core idea of DevSecOps?",
    options: [
      "Integrating security practices and automated security testing into DevOps pipelines as a shared responsibility",
      "Having a separate security team approve each release manually after development ends",
      "Removing security to speed up deployments",
      "Developing software without version control"
    ],
    answer: 0,
    explanation: "DevSecOps embeds security tooling (SAST, SCA, secrets scanning, IaC scanning) and culture into continuous delivery. Gatekeeping at the end slows delivery and misses earlier problems. Removing security or version control increases risk."
  },
  {
    id: "q-p5-d8-003",
    module: "p5-d8",
    difficulty: 2,
    q: "Which model is an open framework for assessing and improving an organization's software security practices across governance, design, implementation, verification and operations?",
    options: [
      "CVSS",
      "STRIDE",
      "TCP/IP model",
      "OWASP SAMM (Software Assurance Maturity Model)"
    ],
    answer: 3,
    explanation: "SAMM provides maturity levels across business functions and security practices (BSIMM is a similar but descriptive, data-driven model). CVSS scores vulnerabilities. STRIDE categorizes threats. TCP/IP is a networking model."
  },
  {
    id: "q-p5-d8-004",
    module: "p5-d8",
    difficulty: 3,
    q: "A developer pushes code directly to the production branch without review, introducing a vulnerability. Which control BEST prevents this?",
    options: [
      "A longer password for the developer",
      "More frequent backups",
      "Branch protection requiring peer review and passing automated security checks before merging",
      "A larger production server"
    ],
    answer: 2,
    explanation: "Enforced code review and CI checks make changes controlled and verified—part of software change management. Passwords, backups and server size do not stop unreviewed changes from reaching production."
  },
  {
    id: "q-p5-d8-005",
    module: "p5-d8",
    difficulty: 3,
    q: "The company plans to purchase a commercial off-the-shelf (COTS) application that will handle customer data. What should the security team do FIRST?",
    options: [
      "Buy it and scan it after deployment",
      "Assess the vendor's security practices and the product's security (e.g., questionnaires, attestation reports, SBOM, testing) before purchase",
      "Rely on the vendor's marketing claims",
      "Ask the vendor for its source code to rewrite it"
    ],
    answer: 1,
    explanation: "Software acquisition security requires due diligence before contracting, when leverage is greatest. Post-deployment scanning is late. Marketing claims are not assurance. Rewriting a COTS product is impractical and usually prohibited by the license."
  },
  {
    id: "q-p5-d8-006",
    module: "p5-d8",
    difficulty: 2,
    q: "Which practice BEST protects source code repositories?",
    options: [
      "Make all repositories public to encourage transparency",
      "Enforce MFA and least privilege, enable secret scanning and audit logs, and protect main branches",
      "Share one account for the whole development team",
      "Store production credentials in the repository for convenience"
    ],
    answer: 1,
    explanation: "Strong access control, monitoring, secret scanning and branch protection reduce the risk of tampering and leaks. Making proprietary code public exposes intellectual property. Shared accounts destroy accountability. Committed credentials are a top cause of breaches."
  },
  {
    id: "q-p5-d8-007",
    module: "p5-d8",
    difficulty: 3,
    q: "A public REST API returns full user objects, including password reset tokens, and the mobile app simply hides the unneeded fields. Which issue is this, and what is the BEST fix?",
    options: [
      "Cross-site scripting; add output encoding",
      "Weak TLS; upgrade ciphers",
      "Insufficient bandwidth; enable compression",
      "Excessive data exposure (broken object property level authorization); return only the fields each client is authorized to see, enforced server-side"
    ],
    answer: 3,
    explanation: "Relying on clients to filter sensitive data is a broken object property level authorization issue (OWASP API3:2023); servers must enforce response schemas. XSS, TLS strength and bandwidth do not address over-sharing data in responses."
  },
  {
    id: "q-p5-d8-008",
    module: "p5-d8",
    difficulty: 2,
    q: "Where must input validation be enforced to be effective?",
    options: [
      "On the server side (client-side checks are only for usability)",
      "Only in the browser with JavaScript",
      "Only in the database",
      "Only in the network firewall"
    ],
    answer: 0,
    explanation: "Attackers can bypass client-side checks by crafting requests directly, so the server must validate all input (using allowlists where possible). Database constraints and firewalls help but are not substitutes for application-level validation."
  },
  {
    id: "q-p5-d8-009",
    module: "p5-d8",
    difficulty: 3,
    q: "A user with access to non-sensitive aggregate salary statistics combines several queries to determine one executive's salary. Which database security problem is this, and which control helps?",
    options: [
      "Deadlock; mitigate with more locks",
      "Polyinstantiation; mitigate by deleting records",
      "Inference; mitigate with query restrictions, cell suppression or noise (e.g., differential privacy)",
      "SQL injection; mitigate with prepared statements"
    ],
    answer: 2,
    explanation: "Inference attacks deduce sensitive facts from permitted data; controls include minimum query set sizes, suppression, perturbation and differential privacy. Deadlock is a concurrency issue. Polyinstantiation is actually a defense against inference in multilevel databases. No injection occurred."
  },
  {
    id: "q-p5-d8-010",
    module: "p5-d8",
    difficulty: 2,
    q: "Which design characteristics generally indicate MORE secure and maintainable software modules?",
    options: [
      "Low cohesion and high coupling",
      "High coupling and high complexity",
      "No modularity at all",
      "High cohesion and low coupling"
    ],
    answer: 3,
    explanation: "Highly cohesive modules do one well-defined thing, and low coupling limits dependencies, so modules are easier to test, review and secure. The other combinations increase complexity and the ripple effects of changes."
  },
  {
    id: "q-p5-d8-011",
    module: "p5-d8",
    difficulty: 2,
    q: "What does code signing provide to users who install software?",
    options: [
      "Assurance that the code has no vulnerabilities",
      "Encryption of the code so no one can read it",
      "Assurance of the publisher's identity and that the code has not been altered since it was signed",
      "Faster execution"
    ],
    answer: 2,
    explanation: "A valid signature verifies integrity and authenticity, but not that the code is free of bugs or malicious intent (attackers have abused stolen signing keys). Signing does not encrypt code or improve performance."
  },
  {
    id: "q-p5-d8-012",
    module: "p5-d8",
    difficulty: 2,
    q: "A business depends on a small vendor's custom software. What protects the business if the vendor goes out of business?",
    options: [
      "A non-disclosure agreement",
      "A source code escrow agreement with a trusted third party",
      "A software license key",
      "A service level agreement for response time"
    ],
    answer: 1,
    explanation: "Escrow releases the source code to the customer under defined conditions, such as vendor bankruptcy, allowing continued maintenance. NDAs protect confidentiality. License keys enable use. SLAs define service levels but are worthless if the vendor ceases to exist."
  },
  {
    id: "q-p5-d8-013",
    module: "p5-d8",
    difficulty: 3,
    q: "A product team wants to use an open-source library. Which assessment is MOST important before adopting it?",
    options: [
      "Evaluate the license obligations, maintenance health, known vulnerabilities and the security of its dependency tree",
      "Check only how many stars it has on GitHub",
      "Use it without review because open source is always secure",
      "Copy the code into the project and remove the license notice"
    ],
    answer: 0,
    explanation: "Open-source risk includes license compliance (e.g., copyleft), abandonment, vulnerabilities and transitive dependencies; SCA tools and OpenSSF Scorecard help. Stars indicate popularity, not security. \"Many eyes\" is not a guarantee. Removing license notices violates license terms."
  },
  {
    id: "q-p5-d8-014",
    module: "p5-d8",
    difficulty: 3,
    q: "Developers increasingly use AI coding assistants. Which control BEST manages the security risk of AI-generated code?",
    options: [
      "Merge AI suggestions without review because AI does not make mistakes",
      "Ban all developers from writing code",
      "Disable the CI pipeline to speed up AI use",
      "Treat AI-generated code like any untrusted contribution: require code review, SAST/SCA scanning and testing, and verify suggested packages actually exist"
    ],
    answer: 3,
    explanation: "AI assistants can produce insecure patterns or hallucinate package names that attackers register (\"slopsquatting\"), so normal secure-SDLC controls must apply. AI is fallible. Banning coding is absurd. Disabling CI removes key safeguards."
  },
  {
    id: "q-p5-d8-015",
    module: "p5-d8",
    difficulty: 3,
    q: "An organization wants evidence that build artifacts were produced from the expected source by a trusted, tamper-resistant build process. Which framework addresses this?",
    options: [
      "SLSA (Supply-chain Levels for Software Artifacts) with signed build provenance",
      "ITIL",
      "PCI DSS",
      "The Bell-LaPadula model"
    ],
    answer: 0,
    explanation: "SLSA defines levels of build integrity and provenance attestation, defending against attacks like build-system compromise. ITIL is IT service management. PCI DSS covers payment card data. Bell-LaPadula is a confidentiality model."
  },
  {
    id: "q-p5-d8-016",
    module: "p5-d8",
    difficulty: 2,
    q: "Which testing approach instruments the application from within while it runs, combining aspects of SAST and DAST?",
    options: [
      "Static code review only",
      "Interactive application security testing (IAST)",
      "Network vulnerability scanning",
      "Social engineering assessment"
    ],
    answer: 1,
    explanation: "IAST agents observe code execution during functional tests, giving precise, low false-positive findings. Static review does not run code. Network scanners assess hosts and services. Social engineering tests people."
  },
  {
    id: "q-p5-d8-017",
    module: "p5-d8",
    difficulty: 3,
    q: "A company is starting a new high-risk product that will parse untrusted file formats. Which language choice BEST reduces an entire class of vulnerabilities?",
    options: [
      "Assembly language for maximum performance",
      "C without compiler protections",
      "A memory-safe language such as Rust, Go or Java, as recommended by CISA and NSA guidance",
      "Any language, as long as comments are detailed"
    ],
    answer: 2,
    explanation: "Memory-safe languages eliminate most buffer overflows and use-after-free bugs, which historically account for a majority of critical vulnerabilities in C/C++ code. Assembly and unprotected C maximize memory safety risk. Comments do not prevent vulnerabilities."
  },
  {
    id: "q-p5-d8-018",
    module: "p5-d8",
    difficulty: 2,
    q: "What is the NIST Secure Software Development Framework (SSDF), SP 800-218?",
    options: [
      "A programming language",
      "A list of all CVEs",
      "A set of high-level secure development practices grouped as Prepare the Organization, Protect the Software, Produce Well-Secured Software, and Respond to Vulnerabilities",
      "A firewall configuration standard"
    ],
    answer: 2,
    explanation: "The SSDF defines outcome-based practices (PO, PS, PW, RV) referenced by US federal software attestation requirements. It is not a language, a vulnerability database, or a firewall standard."
  },
  {
    id: "q-p5-d8-019",
    module: "p5-d8",
    difficulty: 2,
    q: "An application displays full stack traces and SQL errors to users when something fails. Why is this a security problem?",
    options: [
      "It makes the application run faster",
      "It encrypts the error messages",
      "It is required by OWASP",
      "Detailed errors disclose internal information (paths, queries, versions) that helps attackers; show generic messages to users and log details securely"
    ],
    answer: 3,
    explanation: "Verbose errors leak reconnaissance data and are part of mishandling exceptional conditions (OWASP A10:2025). Users should see generic messages, with details logged server-side. Errors do not improve speed or encrypt anything, and OWASP recommends against exposing them."
  },
  {
    id: "q-p5-d8-020",
    module: "p5-d8",
    difficulty: 3,
    q: "A CI/CD pipeline stores cloud deployment keys as plaintext variables visible to all project members, and pipelines run code from external pull requests. What is the BEST improvement?",
    options: [
      "Rotate the keys once a year and keep everything else the same",
      "Use short-lived, scoped credentials (e.g., OIDC federation to the cloud), restrict secrets to protected branches, and prevent untrusted pull requests from accessing secrets",
      "Print the keys in build logs for troubleshooting",
      "Give every pipeline administrator access to production"
    ],
    answer: 1,
    explanation: "Pipelines are high-value targets; ephemeral, least-privilege credentials and isolation of untrusted code paths limit compromise. Annual rotation leaves long-lived exposure. Printing secrets in logs leaks them. Broad admin access widens the blast radius."
  },
  {
    id: "q-p5-d8-021",
    module: "p5-d8",
    difficulty: 2,
    q: "Why should production data NOT be used in development and test environments?",
    options: [
      "Non-production environments usually have weaker controls, so real sensitive data there increases exposure; use synthetic or masked data",
      "Production data is too small for testing",
      "Test environments cannot store data",
      "Developers are not allowed to see any data at all"
    ],
    answer: 0,
    explanation: "Development and test systems often have broader access and fewer protections, and using real personal data may also breach privacy laws. Synthetic or masked data enables realistic testing. The other options are false generalizations."
  },
  {
    id: "q-p5-d8-022",
    module: "p5-d8",
    difficulty: 3,
    q: "Code checks a file's permissions and then opens it, but an attacker swaps the file with a symbolic link in between. What vulnerability is this, and what is the BEST fix?",
    options: [
      "SQL injection; parameterize queries",
      "Cross-site request forgery; add tokens",
      "Integer overflow; use larger integers",
      "A TOCTOU race condition; perform the check and the use atomically (e.g., open first, then check the opened handle)"
    ],
    answer: 3,
    explanation: "Time-of-check to time-of-use flaws arise when state changes between validation and use; atomic operations or validating the opened file descriptor removes the window. SQL injection, CSRF and integer overflow are different vulnerability classes."
  },
  {
    id: "q-p5-d8-023",
    module: "p5-d8",
    difficulty: 3,
    q: "Late in development, the business requests a major feature change that affects how customer data is processed. What should happen FIRST?",
    options: [
      "Implement it immediately to meet the deadline",
      "Reject all changes after design",
      "Submit the change through the change control process, including a security and privacy impact analysis",
      "Let the developer decide privately whether security is affected"
    ],
    answer: 2,
    explanation: "Formal change control evaluates the impact, including security and privacy, updates requirements and threat models, and obtains approval. Rushing skips risk evaluation. Blanket rejection is not business-friendly. Private decisions lack oversight."
  },
  {
    id: "q-p5-d8-024",
    module: "p5-d8",
    difficulty: 2,
    q: "Before a new system goes into production, management formally reviews the security assessment results and accepts the residual risk. What is this decision called?",
    options: [
      "Penetration testing",
      "Authorization (accreditation), based on the prior assessment (certification)",
      "Code signing",
      "Regression testing"
    ],
    answer: 1,
    explanation: "In the NIST RMF, an authorizing official grants an authorization to operate (historically \"accreditation\") after control assessment (\"certification\"). Penetration testing, code signing and regression testing are technical activities, not management risk acceptance decisions."
  },
  {
    id: "q-p5-d8-025",
    module: "p5-d8",
    difficulty: 2,
    q: "In object-oriented programming, which concept hides an object's internal data and exposes only defined methods, supporting security?",
    options: [
      "Encapsulation",
      "Polymorphism",
      "Inheritance",
      "Recursion"
    ],
    answer: 0,
    explanation: "Encapsulation (data hiding) restricts direct access to internal state, reducing misuse. Polymorphism lets objects be treated through a common interface. Inheritance reuses behavior from parent classes. Recursion is a function calling itself."
  },
  // ---- p5-m9 ----
  {
    id: "q-p5-m9-001",
    module: "p5-m9",
    difficulty: 1,
    q: "What is the format of the English-language CISSP exam?",
    options: [
      "Computerized Adaptive Testing (CAT) with 100–150 items and a 3-hour time limit",
      "A fixed 250-question exam over 6 hours",
      "An open-book essay exam",
      "A hands-on lab exam only"
    ],
    answer: 0,
    explanation: "The English CISSP uses CAT: 100–150 items (including unscored pretest items) in up to 3 hours. The 250-question, 6-hour linear format was retired years ago. The exam is not open-book or essay-based, and it has no hands-on lab component."
  },
  {
    id: "q-p5-m9-002",
    module: "p5-m9",
    difficulty: 2,
    q: "Many CISSP questions ask for the \"BEST\" or \"FIRST\" action. Which mindset is MOST helpful?",
    options: [
      "Pick the most technical, hands-on fix",
      "Choose the answer that costs the least, regardless of risk",
      "Always choose the option that involves calling law enforcement",
      "Think like a risk-focused manager or advisor: protect people first, align with business goals, follow process and choose the most comprehensive answer"
    ],
    answer: 3,
    explanation: "CISSP rewards a management perspective—governance, policy, risk and due care, with life safety above all—over low-level technical fixes. The cheapest answer ignores risk. Law enforcement involvement is appropriate only in specific situations, and usually through legal counsel."
  },
  {
    id: "q-p5-m9-003",
    module: "p5-m9",
    difficulty: 2,
    q: "A candidate passes the CISSP exam but has only two years of relevant experience. What can they become?",
    options: [
      "A full CISSP immediately",
      "An Associate of ISC2, with up to six years to earn the required experience",
      "Nothing; the exam result is voided",
      "A CISSP-ISSAP concentration holder"
    ],
    answer: 1,
    explanation: "Associate of ISC2 status lets candidates who pass without the full experience requirement earn it within six years and then apply for endorsement as a CISSP. Full certification requires the experience. The result is not voided. Concentrations (ISSAP/ISSEP/ISSMP) require holding the CISSP first."
  },
  {
    id: "q-p5-m9-004",
    module: "p5-m9",
    difficulty: 2,
    q: "What is the standard CISSP experience requirement, and what can reduce it?",
    options: [
      "One year in any IT job, with no waiver",
      "Ten years in all eight domains",
      "Five years of cumulative, paid work experience in two or more of the eight domains; a four-year degree or approved credential can waive one year",
      "No experience requirement"
    ],
    answer: 2,
    explanation: "ISC2 requires five years of cumulative paid experience in at least two domains; a qualifying degree or a credential from the approved list waives one year (maximum one year total). Part-time work and internships can count under ISC2 rules. The other options misstate the requirement."
  },
  {
    id: "q-p5-m9-005",
    module: "p5-m9",
    difficulty: 2,
    q: "After passing the exam, how long does a candidate have to complete the endorsement process?",
    options: [
      "Two weeks",
      "Nine months from the exam date",
      "Five years",
      "There is no deadline"
    ],
    answer: 1,
    explanation: "Candidates must submit endorsement—attested by an active ISC2-certified member in good standing, or by ISC2 itself—within nine months of passing. Two weeks is too short, five years is not the rule, and the deadline does exist."
  },
  {
    id: "q-p5-m9-006",
    module: "p5-m9",
    difficulty: 2,
    q: "Which is the correct order of the four ISC2 Code of Ethics canons?",
    options: [
      "Advance the profession; serve principals; act honorably; protect society",
      "Serve principals; protect society; advance the profession; act honorably",
      "Act honorably; advance the profession; protect society; serve principals",
      "Protect society; act honorably; provide diligent service to principals; advance and protect the profession"
    ],
    answer: 3,
    explanation: "The canons, applied in priority order, are: protect society, the common good, necessary public trust and confidence, and the infrastructure; act honorably, honestly, justly, responsibly and legally; provide diligent and competent service to principals; and advance and protect the profession. The other orders misrank them."
  },
  {
    id: "q-p5-m9-007",
    module: "p5-m9",
    difficulty: 3,
    q: "On an exam question, two answers look technically correct: one fixes the immediate technical issue, while the other addresses the policy or process gap that allowed it. Absent other clues, which is USUALLY the better CISSP answer?",
    options: [
      "The answer that addresses the underlying policy/process or root cause at a management level",
      "The quickest technical patch",
      "The answer with the most technical jargon",
      "The longest answer, regardless of content"
    ],
    answer: 0,
    explanation: "CISSP favors comprehensive, root-cause and governance-oriented responses that prevent recurrence, while still respecting \"FIRST\" sequencing when the question asks for it. Quick fixes treat symptoms. Jargon and length are not reliable indicators."
  },
  {
    id: "q-p5-m9-008",
    module: "p5-m9",
    difficulty: 2,
    q: "What are the ongoing requirements to maintain a CISSP in good standing?",
    options: [
      "Retake the exam every year",
      "Only pay a one-time fee",
      "Earn 120 CPE credits over each three-year cycle (minimum 40 per year), pay the annual maintenance fee, and adhere to the Code of Ethics",
      "Publish a book every three years"
    ],
    answer: 2,
    explanation: "CISSPs maintain certification through continuing professional education, annual maintenance fees and ethical conduct. Retesting each year is not required, the fee is annual rather than one-time, and publishing is optional (it can earn CPEs)."
  },
  {
    id: "q-p5-m9-009",
    module: "p5-m9",
    difficulty: 3,
    q: "A question asks what a security manager should do FIRST after discovering that a critical, internet-facing system lacks a required control. Options include implementing the control, informing management of the risk, buying a new tool and firing the administrator. Which approach is MOST consistent with CISSP thinking?",
    options: [
      "Fire the administrator immediately",
      "Inform management of the risk so the accountable owner can decide on treatment, unless the question indicates you already have authority to act",
      "Buy the tool before telling anyone",
      "Ignore it until the next audit"
    ],
    answer: 1,
    explanation: "Senior management owns risk decisions; the security professional's role is to identify, assess and advise, then implement approved treatments. Firing staff is punitive and unhelpful. Unapproved purchases bypass governance. Ignoring known risk violates due care."
  },
  {
    id: "q-p5-m9-010",
    module: "p5-m9",
    difficulty: 2,
    q: "What is the passing standard for the CISSP exam?",
    options: [
      "70% of questions answered correctly in each domain",
      "500 out of 1000",
      "Answering all 150 questions",
      "A scaled score of 700 out of 1000"
    ],
    answer: 3,
    explanation: "ISC2 reports CISSP results on a scaled score, with 700 of 1000 required to pass; with CAT, the exam ends when the algorithm is confident of the result, so many candidates finish before 150 items. There is no per-domain 70% rule, 500 is not the standard, and answering every possible question is not required."
  }
);
