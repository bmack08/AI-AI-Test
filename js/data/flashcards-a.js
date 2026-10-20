window.CP = window.CP || {};
CP.flashcards = CP.flashcards || [];
// Flashcards for phases p0, p1, p2. IDs are generated as fc-<module>-NNN in order.
(function () {
  function add(mod, cards) {
    cards.forEach(function (c, i) {
      CP.flashcards.push({ id: "fc-" + mod + "-" + String(i + 1).padStart(3, "0"), module: mod, front: c[0], back: c[1] });
    });
  }

  // ---------------- p0-m1 How Computers & Operating Systems Work ----------------
  add("p0-m1", [
    ["What does the CPU do?", "The Central Processing Unit fetches, decodes and executes instructions. Clock speed, core count and cache size drive its performance."],
    ["Why is RAM described as <b>volatile</b>?", "Its contents disappear when power is lost. That is why memory must be captured <i>before</i> shutting down a suspect machine."],
    ["What is the operating system <b>kernel</b>?", "The core of the OS. It manages CPU scheduling, memory, devices and system calls, and it runs with the highest privilege."],
    ["User mode vs kernel mode?", "Apps run in restricted <b>user mode</b> (ring 3). The kernel and drivers run in privileged <b>kernel mode</b> (ring 0). A bug or exploit in kernel mode can compromise the whole system."],
    ["Process vs thread?", "A <b>process</b> is a running program with its own memory space. A <b>thread</b> is a unit of execution inside a process, and threads share that process's memory."],
    ["What is virtual memory / paging?", "The OS gives each process its own virtual address space and maps it to physical RAM. Inactive pages can be moved to disk (pagefile.sys on Windows, swap on Linux)."],
    ["BIOS vs UEFI?", "UEFI is the modern replacement for legacy BIOS firmware. It supports GPT disks larger than 2 TB, faster boot and <b>Secure Boot</b>, which checks the signatures of bootloaders."],
    ["What does a TPM provide?", "A Trusted Platform Module is a hardware chip that stores keys securely, measures the boot process and backs features such as BitLocker. Windows 11 requires TPM 2.0."],
    ["Common file systems by OS?", "Windows: <b>NTFS</b> (permissions, journaling). Linux: <b>ext4</b>, XFS. macOS: <b>APFS</b>. Removable media: FAT32 (4 GB max file size) and exFAT."],
    ["How many bits are in a byte, and how many bits does one hex digit represent?", "8 bits = 1 byte. One hex digit = 4 bits (a nibble), so one byte is written as 2 hex digits, e.g. <code>0xFF</code> = 255."],
    ["Type 1 vs Type 2 hypervisor?", "<b>Type 1</b> (bare-metal) runs directly on hardware, e.g. ESXi, Hyper-V, KVM. <b>Type 2</b> (hosted) runs on top of an OS, e.g. VirtualBox, VMware Workstation."],
    ["Virtual machine vs container?", "A VM virtualizes hardware and runs a full guest OS. A container shares the host kernel and isolates processes with namespaces/cgroups, so it is lighter but the isolation is weaker."],
    ["What is a device driver?", "Software that lets the OS talk to hardware. Drivers often run in kernel mode, so a malicious or vulnerable driver is very dangerous (e.g. BYOVD, 'bring your own vulnerable driver' attacks)."],
    ["Basic boot sequence of a PC?", "Power-on → firmware (UEFI/BIOS) POST → bootloader (e.g. Windows Boot Manager, GRUB) → kernel loads → init/system services → user logon."],
    ["Why should daily work be done with a standard (non-admin) account?", "Least privilege: malware that runs under a standard user cannot easily install drivers, change system files or turn off security tools."],
    ["What is an end-of-life (EOL) operating system and why is it a risk?", "An OS the vendor no longer patches (e.g. Windows 10 reached end of support on 14 Oct 2025, with paid ESU only). New vulnerabilities in it stay open."],
    ["32-bit vs 64-bit addressing?", "A 32-bit system can directly address only 4 GB of memory. A 64-bit system can address vastly more, and all modern desktop/server OSes are 64-bit."],
    ["SSD vs HDD: why does it matter to security/forensics?", "SSDs use wear leveling and TRIM, so deleted data may be erased internally and recovery is unreliable. Overwriting does not guarantee sanitization; use crypto-erase or the vendor's secure erase."],
    ["What is the difference between a shell, a CLI and a GUI?", "A <b>shell</b> (bash, PowerShell, cmd) interprets commands. A <b>CLI</b> is a text interface built on it. A <b>GUI</b> is graphical. Analysts rely on the CLI for speed and scripting."]
  ]);

  // ---------------- p0-m2 Networking Fundamentals ----------------
  add("p0-m2", [
    ["List the 7 OSI layers from 1 to 7.", "Physical, Data Link, Network, Transport, Session, Presentation, Application.<br>Mnemonic: <i>Please Do Not Throw Sausage Pizza Away</i>."],
    ["Name the 4 layers of the TCP/IP model.", "Network Access (Link), Internet, Transport, Application."],
    ["Describe the TCP three-way handshake.", "Client sends <b>SYN</b> → server replies <b>SYN-ACK</b> → client sends <b>ACK</b>. The connection is then established."],
    ["TCP vs UDP?", "TCP is connection-oriented and reliable: ordered, acknowledged, retransmitted. UDP is connectionless and best-effort with lower overhead (DNS, DHCP, VoIP, streaming)."],
    ["Ports: SSH, Telnet, SMTP, DNS, HTTP, HTTPS?", "SSH 22, Telnet 23, SMTP 25 (submission 587), DNS 53, HTTP 80, HTTPS 443."],
    ["Ports: SMB, RDP, LDAP, LDAPS, Kerberos?", "SMB 445, RDP 3389, LDAP 389, LDAPS 636, Kerberos 88."],
    ["Ports: POP3, IMAP and their TLS versions?", "POP3 110 / POP3S 995. IMAP 143 / IMAPS 993."],
    ["Ports: NTP, SNMP, Syslog, DHCP?", "NTP UDP 123. SNMP UDP 161 (traps 162). Syslog UDP 514 (TLS syslog 6514). DHCP UDP 67 server / 68 client."],
    ["Ports: MS SQL, MySQL, PostgreSQL, FTP?", "MS SQL 1433, MySQL 3306, PostgreSQL 5432, FTP 21 (control) and 20 (active data)."],
    ["What are the RFC 1918 private IPv4 ranges?", "<code>10.0.0.0/8</code>, <code>172.16.0.0/12</code>, <code>192.168.0.0/16</code>."],
    ["How many usable hosts are in a /24? A /26?", "/24 = 256 − 2 = <b>254</b> usable. /26 = 64 − 2 = <b>62</b> usable. Formula: 2<sup>(32−prefix)</sup> − 2."],
    ["What does ARP do?", "Address Resolution Protocol maps an IPv4 address to a MAC address on the local network. It has no authentication, which makes ARP spoofing / on-path attacks possible."],
    ["DHCP lease process (DORA)?", "<b>D</b>iscover → <b>O</b>ffer → <b>R</b>equest → <b>A</b>cknowledge."],
    ["Common DNS record types?", "A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail), TXT (SPF/DKIM/DMARC/verification), NS (name server), PTR (reverse lookup), SOA (zone authority)."],
    ["What is NAT/PAT?", "Network Address Translation rewrites private addresses to public ones at the edge. PAT (overload) maps many internal hosts to one public IP using different source ports."],
    ["How long are IPv4, IPv6 and MAC addresses?", "IPv4 = 32 bits. IPv6 = 128 bits. MAC = 48 bits (the first 24 bits are the vendor OUI)."],
    ["What are the loopback addresses?", "IPv4 <code>127.0.0.0/8</code> (usually 127.0.0.1). IPv6 <code>::1</code>."],
    ["Name the main TCP flags.", "SYN, ACK, FIN, RST, PSH, URG (plus ECE/CWR). A large number of SYNs with no ACKs suggests a scan or a SYN flood."],
    ["Which protocol do <code>ping</code> and <code>traceroute</code> use?", "ICMP. Ping uses Echo Request/Reply (type 8/0). Traceroute relies on TTL expiry (Time Exceeded, type 11); Linux traceroute sends UDP probes by default, Windows <code>tracert</code> uses ICMP."],
    ["Switch vs router vs VLAN?", "A <b>switch</b> forwards frames by MAC address (Layer 2). A <b>router</b> forwards packets between networks by IP address (Layer 3). A <b>VLAN</b> logically splits one switch into separate broadcast domains (802.1Q tagging)."]
  ]);

  // ---------------- p0-m3 Linux Command Line ----------------
  add("p0-m3", [
    ["What does <code>ls -la</code> show?", "A long listing of every file, including hidden dot-files, with permissions, owner, group, size and modification time."],
    ["What do the permissions in <code>chmod 755 file</code> mean?", "Owner rwx (7), group r-x (5), others r-x (5). r=4, w=2, x=1."],
    ["What does <code>chmod 600 id_rsa</code> do and why?", "Gives the owner read/write and nobody else any access. SSH refuses to use private keys that other users can read."],
    ["What is stored in <code>/etc/passwd</code> vs <code>/etc/shadow</code>?", "<code>/etc/passwd</code>: world-readable account info (user, UID, GID, home, shell). <code>/etc/shadow</code>: password hashes and aging, readable only by root."],
    ["What is the SUID bit and how do you find SUID files?", "SUID makes a program run with its owner's privileges (often root), so a vulnerable SUID binary can be used to escalate privileges. Find them with <code>find / -perm -4000 -type f 2&gt;/dev/null</code>."],
    ["Search recursively and case-insensitively for 'failed' in /var/log.", "<code>grep -ri 'failed' /var/log</code>"],
    ["Where are SSH and sudo authentication events logged?", "Debian/Ubuntu: <code>/var/log/auth.log</code>. RHEL/Fedora: <code>/var/log/secure</code>. On systemd hosts you can also use <code>journalctl -u ssh</code> (sshd on RHEL)."],
    ["Command to watch a log file live?", "<code>tail -f /var/log/auth.log</code> (or <code>journalctl -f</code>)."],
    ["How do you list listening ports and their owning processes?", "<code>ss -tulpn</code> (older: <code>netstat -tulpn</code>). t=TCP, u=UDP, l=listening, p=process, n=numeric."],
    ["How do you see every running process?", "<code>ps aux</code>, or <code>ps -ef</code>. Use <code>top</code>/<code>htop</code> for an interactive view and <code>pstree</code> to see parent/child relationships."],
    ["What do <code>|</code>, <code>&gt;</code> and <code>&gt;&gt;</code> do?", "<code>|</code> pipes stdout into the next command. <code>&gt;</code> redirects output to a file and overwrites it. <code>&gt;&gt;</code> appends to the file. <code>2&gt;</code> redirects stderr."],
    ["Count unique source IPs in a log (classic one-liner)?", "<code>awk '{print $1}' access.log | sort | uniq -c | sort -nr | head</code>"],
    ["What does <code>sudo</code> do, and where is it configured?", "Runs one command as another user (root by default) and logs it. It is configured in <code>/etc/sudoers</code>; always edit with <code>visudo</code>. Check your own rights with <code>sudo -l</code>."],
    ["How do you manage services on a systemd system?", "<code>systemctl status|start|stop|restart|enable|disable &lt;service&gt;</code>. Use <code>systemctl list-units --type=service</code> to list them."],
    ["Where do cron jobs live and why do attackers like them?", "In <code>crontab -l</code> (per-user), <code>/etc/crontab</code>, <code>/etc/cron.d/</code> and the <code>/etc/cron.*</code> folders. They give attackers easy scheduled persistence."],
    ["How do you compute a file's SHA-256 hash?", "<code>sha256sum file</code>. Compare the result against threat intel or known-good values."],
    ["What does <code>chown alice:devs file</code> do?", "Changes the file's owner to <code>alice</code> and its group to <code>devs</code>."],
    ["Where is a user's command history kept?", "<code>~/.bash_history</code> (or <code>~/.zsh_history</code>). Attackers often clear it or set <code>HISTFILE=/dev/null</code>, and a missing history file can itself be suspicious."],
    ["How do you get help for a command?", "<code>man &lt;cmd&gt;</code>, <code>&lt;cmd&gt; --help</code>, or <code>tldr &lt;cmd&gt;</code> if it is installed."],
    ["What are the key Linux directories for investigators?", "<code>/etc</code> (config), <code>/var/log</code> (logs), <code>/home</code> (users), <code>/tmp</code> and <code>/dev/shm</code> (world-writable, common malware drop spots), <code>/root</code>."]
  ]);

  // ---------------- p0-m4 Windows & Active Directory ----------------
  add("p0-m4", [
    ["What is a Domain Controller?", "A Windows server running AD DS. It stores the directory database (NTDS.dit), authenticates users (Kerberos/NTLM) and applies Group Policy."],
    ["What is the default authentication protocol in an AD domain?", "<b>Kerberos</b> (TCP/UDP 88). NTLM is the legacy fallback, for example when connecting by IP address or to non-domain resources."],
    ["Why is NTLM considered weak?", "It is challenge-response with no mutual authentication by default, and it is vulnerable to pass-the-hash and relay attacks. Microsoft is phasing NTLM out in favor of Kerberos."],
    ["Forest vs tree vs domain vs OU?", "A <b>forest</b> is the top security boundary. It contains <b>trees</b> of <b>domains</b> that share a namespace. <b>OUs</b> are containers inside a domain used to delegate admin rights and link GPOs."],
    ["What is a Group Policy Object (GPO)?", "A set of configuration settings (password policy, audit policy, software, scripts) linked to sites, domains or OUs. GPOs are processed in LSDOU order: Local, Site, Domain, OU."],
    ["What is a SID, and what does RID 500 mean?", "A Security Identifier uniquely identifies a security principal. The last part is the RID. RID <b>500</b> is the built-in Administrator account; 501 is Guest."],
    ["What is LSASS and why do attackers target it?", "The Local Security Authority Subsystem Service (lsass.exe) handles authentication and holds credentials in memory. Dumping it (e.g. with Mimikatz) is OS Credential Dumping, T1003."],
    ["What is NTDS.dit?", "The Active Directory database on each DC. It holds every domain account's password hash, so stealing it (or DCSync) compromises the whole domain."],
    ["What is the SAM?", "The Security Account Manager registry hive, which stores <i>local</i> account password hashes (<code>C:\\Windows\\System32\\config\\SAM</code>)."],
    ["What is the krbtgt account?", "The account whose key signs every Kerberos TGT. If its hash is stolen, attackers can forge Golden Tickets; recovery means resetting it twice."],
    ["Most privileged built-in AD groups?", "<b>Enterprise Admins</b> (forest-wide), <b>Domain Admins</b> (domain-wide), Schema Admins and Administrators. Membership changes should always raise an alert."],
    ["Common registry Run keys used for persistence?", "<code>HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run</code> and <code>HKLM\\...\\Run</code> (plus RunOnce). Programs listed there start at logon."],
    ["What are the three classic Windows event logs?", "<b>Security</b> (logons, privilege use, auditing), <b>System</b> (services, drivers), <b>Application</b>. Each is stored as an .evtx file in <code>C:\\Windows\\System32\\winevt\\Logs</code>."],
    ["What is UAC?", "User Account Control. Even admins run with a filtered token until they approve elevation. It reduces silent privilege use, but Microsoft says it is <i>not</i> a security boundary."],
    ["What did Azure AD get renamed to?", "<b>Microsoft Entra ID</b> (renamed in 2023). It is Microsoft's cloud identity service, which is different from on-premises AD DS."],
    ["How do AD and DNS relate?", "AD depends on DNS. Clients find DCs through SRV records (e.g. <code>_ldap._tcp.dc._msdcs.domain</code>), so broken DNS breaks domain logons."],
    ["What are FSMO roles?", "Five single-master operations roles: Schema Master, Domain Naming Master (forest-wide), and RID Master, PDC Emulator, Infrastructure Master (per domain)."],
    ["Useful Windows commands to enumerate a host?", "<code>whoami /all</code>, <code>ipconfig /all</code>, <code>net user</code>, <code>net localgroup administrators</code>, <code>tasklist /v</code>, <code>netstat -ano</code>, <code>systeminfo</code>. Attackers run these too during discovery."],
    ["What are the LAPS and tiered-admin models for?", "<b>Windows LAPS</b> gives every machine a unique, rotated local admin password, which stops lateral movement with one shared password. <b>Tiering</b> keeps Tier 0 (DC) credentials off workstations."]
  ]);

  // ---------------- p0-m5 Scripting for Security ----------------
  add("p0-m5", [
    ["Python: list vs dictionary?", "A list is an ordered sequence <code>[1, 2, 3]</code>. A dict maps keys to values <code>{'ip': '10.0.0.5', 'count': 3}</code>, which makes it ideal for counting IPs or users."],
    ["Python: read a log file line by line safely?", "<code>with open('auth.log') as f:<br>&nbsp;&nbsp;for line in f:<br>&nbsp;&nbsp;&nbsp;&nbsp;...</code><br>The <code>with</code> block closes the file automatically."],
    ["Python: which module counts items easily?", "<code>collections.Counter</code>, e.g. <code>Counter(ips).most_common(10)</code>."],
    ["Python: which module handles regex, and what is a simple IPv4 pattern?", "<code>re</code>. A simple pattern: <code>r'\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b'</code>. It also matches invalid values like 999.1.1.1, so validate afterwards with the <code>ipaddress</code> module."],
    ["Python: how do you hash a file?", "<code>hashlib.sha256(open(p,'rb').read()).hexdigest()</code>. For large files, read in chunks."],
    ["Python: how do you call a REST API (e.g. a threat-intel lookup)?", "Use the <code>requests</code> library: <code>r = requests.get(url, headers={'x-apikey': key}, timeout=10); data = r.json()</code>. Keep API keys in environment variables, not in code."],
    ["What does the shebang line do?", "The first line, e.g. <code>#!/usr/bin/env python3</code> or <code>#!/bin/bash</code>, tells the OS which interpreter should run the script."],
    ["Bash: how do you access script arguments?", "<code>$1</code>, <code>$2</code>, … for each argument, <code>$@</code> for all of them, <code>$#</code> for the count, and <code>$0</code> for the script name."],
    ["Bash: what does exit code 0 mean, and how do you check it?", "0 = success; non-zero = error. Check with <code>$?</code> or chain commands with <code>&amp;&amp;</code> and <code>||</code>."],
    ["Bash: loop over a file of IPs?", "<code>while read ip; do ping -c1 \"$ip\"; done &lt; ips.txt</code>"],
    ["PowerShell cmdlet naming convention?", "<b>Verb-Noun</b>, e.g. <code>Get-Process</code>, <code>Stop-Service</code>, <code>Get-WinEvent</code>. Use <code>Get-Command</code> and <code>Get-Help</code> to explore."],
    ["How does the PowerShell pipeline differ from the Bash pipeline?", "PowerShell passes <b>objects</b> with properties, not text, e.g. <code>Get-Process | Where-Object CPU -gt 100 | Select Name,Id</code>."],
    ["PowerShell: pull failed logons from the Security log?", "<code>Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625} -MaxEvents 50</code>"],
    ["Is the PowerShell execution policy a security control?", "No. Microsoft states it is <i>not</i> a security boundary; it is easily bypassed (<code>-ExecutionPolicy Bypass</code>). Use WDAC/AppLocker and logging instead."],
    ["Which Event ID records PowerShell script block logging?", "<b>4104</b> in Microsoft-Windows-PowerShell/Operational. It records the de-obfuscated script content. Module logging is 4103."],
    ["What does <code>powershell -enc</code> indicate?", "<code>-EncodedCommand</code> runs a Base64-encoded UTF-16LE script. It has legitimate uses, but it is a classic red flag for obfuscation (Command and Scripting Interpreter, T1059.001)."],
    ["How do you decode Base64 on Linux and in Python?", "Linux: <code>echo 'aGk=' | base64 -d</code>. Python: <code>base64.b64decode(s)</code>. For PowerShell <code>-enc</code> payloads, decode as UTF-16LE."],
    ["Why use a Python virtual environment?", "<code>python3 -m venv .venv</code> isolates each project's dependencies, which avoids version conflicts and keeps tooling reproducible."],
    ["Python: parse JSON logs?", "<code>import json; event = json.loads(line)</code>, then read fields like <code>event['src_ip']</code>. Use <code>json.dumps(obj, indent=2)</code> to pretty-print."]
  ]);

  // ---------------- p1-m1 Core Security Concepts ----------------
  add("p1-m1", [
    ["What is the CIA triad?", "<b>Confidentiality</b> (only authorized users can see data), <b>Integrity</b> (data is accurate and unaltered), <b>Availability</b> (systems and data are accessible when needed)."],
    ["What is the DAD triad?", "The opposite of CIA: <b>Disclosure</b>, <b>Alteration</b>, <b>Destruction/Denial</b>."],
    ["What is non-repudiation?", "Assurance that someone cannot deny an action, usually provided by digital signatures and strong audit logs."],
    ["What does AAA stand for?", "<b>Authentication</b>, <b>Authorization</b>, <b>Accounting</b>. Many texts list Identification first."],
    ["Define defense in depth.", "Layering several independent controls (physical, technical, administrative) so that one failure does not lead to compromise."],
    ["Define least privilege.", "Give users and processes only the minimum access they need to do their job, for only as long as they need it."],
    ["Define separation of duties.", "Split critical tasks among several people so that no single person can commit and hide fraud, e.g. one person requests a payment and another approves it."],
    ["Security+ control <b>categories</b>?", "<b>Technical</b>, <b>Managerial</b>, <b>Operational</b>, <b>Physical</b>."],
    ["Security+ control <b>types</b>?", "Preventive, Deterrent, Detective, Corrective, Compensating, Directive."],
    ["Example of a compensating control?", "An alternative control used when the primary one isn't feasible, e.g. isolating an unpatchable legacy system on its own segment with strict ACLs."],
    ["Example of a deterrent vs a detective control?", "Deterrent: warning signs or login banners that discourage attackers. Detective: IDS alerts, log reviews, CCTV review, which identify an event during or after it happens."],
    ["What is the implicit deny principle?", "Anything not explicitly allowed is blocked, for example the final 'deny all' rule in a firewall ACL."],
    ["What are the three main authentication factor types?", "Something you <b>know</b> (password), something you <b>have</b> (token, phone, security key), something you <b>are</b> (biometrics). Location and behavior are sometimes added as attributes."],
    ["Why does MFA require <i>different</i> factor types?", "A password plus a PIN is two 'know' factors, so it is not MFA. MFA requires factors from at least two different categories."],
    ["What is a gap analysis?", "Comparing the current security posture against a target state or framework (e.g. NIST CSF, ISO 27001) to find missing controls."],
    ["Why does change management matter to security?", "Unreviewed changes cause outages and misconfigurations. A formal process with approval, impact analysis, a backout plan and documentation reduces that risk."],
    ["Define threat, vulnerability and risk.", "<b>Threat</b>: a potential cause of harm. <b>Vulnerability</b>: a weakness. <b>Risk</b>: the likelihood that a threat exploits a vulnerability, combined with the impact."],
    ["How do hashing and encryption map to the CIA triad?", "Encryption protects <b>confidentiality</b>. Hashing verifies <b>integrity</b>. Redundancy, backups and DDoS protection support <b>availability</b>."],
    ["What is the AIC / 'availability first' nuance in OT/ICS?", "In industrial and safety systems, availability and safety usually come before confidentiality, because downtime can endanger life or production."]
  ]);

  // ---------------- p1-m2 Threats, Vulnerabilities & Attacks ----------------
  add("p1-m2", [
    ["Virus vs worm vs trojan?", "A <b>virus</b> attaches to files and needs a user to run it. A <b>worm</b> spreads by itself over networks. A <b>trojan</b> pretends to be legitimate software."],
    ["What is ransomware and what is 'double extortion'?", "Malware that encrypts data and demands payment. <b>Double extortion</b> also steals the data first and threatens to leak it."],
    ["What is a rootkit?", "Malware that hides itself and keeps privileged access, often at kernel or firmware level, by subverting the OS's own reporting."],
    ["What is a logic bomb?", "Malicious code that runs when a condition is met (a date, an employee being removed from payroll). It is often planted by insiders."],
    ["Spear phishing vs whaling vs vishing vs smishing?", "<b>Spear phishing</b> targets specific people. <b>Whaling</b> targets executives. <b>Vishing</b> uses voice calls. <b>Smishing</b> uses SMS."],
    ["What is Business Email Compromise (BEC)?", "Fraud using a compromised or spoofed business email account (often an executive or a vendor) to trick staff into wiring money or sending data. It is one of the costliest cybercrimes in FBI IC3 reports."],
    ["Social engineering principles attackers exploit?", "Authority, intimidation, consensus/social proof, scarcity, familiarity, trust and urgency."],
    ["What is SQL injection?", "Untrusted input is inserted into a SQL query and changes its logic, e.g. <code>' OR 1=1--</code>. Prevent it with parameterized queries / prepared statements."],
    ["Stored vs reflected vs DOM-based XSS?", "<b>Stored</b>: the script is saved on the server and served to every viewer. <b>Reflected</b>: the script bounces off the server from a crafted URL. <b>DOM</b>: client-side JavaScript writes untrusted data into the page."],
    ["What is CSRF?", "Cross-Site Request Forgery tricks a logged-in user's browser into sending an unwanted request. Defenses: anti-CSRF tokens and SameSite cookies."],
    ["What is a buffer overflow?", "Writing more data than a buffer holds, which overwrites adjacent memory and can lead to code execution. Mitigations: ASLR, DEP/NX, stack canaries and memory-safe languages."],
    ["What is an on-path (man-in-the-middle) attack?", "An attacker secretly relays or alters traffic between two parties, e.g. through ARP spoofing, a rogue Wi-Fi access point or TLS stripping."],
    ["What is a DDoS amplification attack?", "The attacker sends small spoofed requests to open servers (DNS, NTP, memcached) that send large responses to the victim."],
    ["What is a zero-day?", "A vulnerability that is exploited before the vendor has a patch, or before defenders know about it."],
    ["Threat actor types (Security+)?", "Nation-state (APT), unskilled attacker, hacktivist, insider threat, organized crime, shadow IT."],
    ["Password spraying vs credential stuffing vs brute force?", "<b>Spraying</b>: a few common passwords tried against many accounts. <b>Stuffing</b>: leaked username/password pairs reused on other sites. <b>Brute force</b>: many guesses against one account. All map to ATT&amp;CK T1110 (Brute Force)."],
    ["What is a supply chain attack?", "Compromising a trusted vendor, software update or dependency to reach its customers, e.g. SolarWinds (2020) and the XZ Utils backdoor (2024)."],
    ["Watering hole vs typosquatting?", "<b>Watering hole</b>: compromising a site the targets already visit. <b>Typosquatting</b>: registering misspelled domains (e.g. <code>rnicrosoft.com</code>) to catch typos."],
    ["What is privilege escalation (vertical vs horizontal)?", "<b>Vertical</b>: gaining higher rights (user → admin). <b>Horizontal</b>: accessing another user's resources at the same privilege level."],
    ["What is an attack surface?", "Every point where an attacker could try to enter or extract data: open ports, apps, APIs, users, cloud assets, third parties. Reducing it is a core hardening goal."]
  ]);

  // ---------------- p1-m3 Cryptography & PKI ----------------
  add("p1-m3", [
    ["Symmetric vs asymmetric encryption?", "<b>Symmetric</b> uses one shared key; it is fast and suits bulk data (AES). <b>Asymmetric</b> uses a public/private key pair; it is slower and used for key exchange and signatures (RSA, ECC)."],
    ["What does AES stand for and what are its parameters?", "Advanced Encryption Standard: a symmetric block cipher with 128-bit blocks and 128/192/256-bit keys."],
    ["Recommended minimum RSA key size today?", "2048 bits minimum. 3072 bits gives about 128-bit security. NIST plans to deprecate RSA/ECC (quantum-vulnerable) after 2030 and disallow them after 2035."],
    ["Why is ECC attractive?", "Elliptic Curve Cryptography gives equal security with much smaller keys: a 256-bit ECC key is roughly as strong as 3072-bit RSA. That makes it faster and better for mobile/IoT."],
    ["What are NIST's first post-quantum standards (Aug 2024)?", "FIPS 203 <b>ML-KEM</b> (key encapsulation, from Kyber), FIPS 204 <b>ML-DSA</b> (signatures, from Dilithium), FIPS 205 <b>SLH-DSA</b> (hash-based signatures, from SPHINCS+)."],
    ["What properties must a cryptographic hash have?", "Fixed-length output, one-way (preimage resistant) and collision resistant. Examples: SHA-256, SHA-3."],
    ["Why are MD5 and SHA-1 no longer acceptable for security?", "Practical collisions exist for both (SHA-1 'SHAttered', 2017). They are still used as non-security identifiers, e.g. malware hashes in threat intel."],
    ["What is salting and why use it?", "Adding a unique random value to each password before hashing, which defeats rainbow tables and makes identical passwords produce different hashes."],
    ["Name password-hashing / key-stretching algorithms.", "<b>Argon2id</b> (preferred by OWASP), scrypt, bcrypt and PBKDF2. They are deliberately slow to resist cracking."],
    ["How is a digital signature created and verified?", "The sender hashes the message and signs the hash with their <b>private key</b>. The recipient verifies it with the sender's <b>public key</b>. This provides integrity, authentication and non-repudiation."],
    ["What does a Certificate Authority do?", "It verifies identities and issues signed X.509 certificates that bind a public key to a subject. Trust is anchored in root CAs and passed down through intermediate CAs."],
    ["CRL vs OCSP vs OCSP stapling?", "A <b>CRL</b> is a downloadable list of revoked certificates. <b>OCSP</b> is a real-time revocation query. <b>Stapling</b> lets the server attach a signed OCSP response itself. (Let's Encrypt ended OCSP in 2025 in favor of CRLs.)"],
    ["What is Diffie-Hellman for?", "Securely agreeing on a shared secret over an untrusted channel. On its own it provides no authentication, so it is combined with signatures/certificates."],
    ["What is Perfect Forward Secrecy?", "Using ephemeral key exchange (DHE/ECDHE) so that a stolen long-term private key cannot decrypt past sessions. It is mandatory in TLS 1.3."],
    ["What changed in TLS 1.3?", "A 1-RTT handshake, only AEAD ciphers (AES-GCM, ChaCha20-Poly1305), forward secrecy required, and RSA key exchange, CBC and other legacy options removed. TLS 1.0/1.1 are deprecated (RFC 8996)."],
    ["What is an HMAC?", "A hash-based message authentication code: a hash combined with a secret key. It proves both integrity and authenticity, but not non-repudiation, because the key is shared."],
    ["Why is ECB mode bad, and what is preferred?", "ECB encrypts identical blocks to identical ciphertext, so patterns leak (the 'ECB penguin'). Prefer authenticated modes like <b>GCM</b>."],
    ["What is Kerckhoffs's principle?", "A cryptosystem should stay secure even if everything except the key is public. Security through obscurity is not enough."],
    ["Key escrow vs key recovery?", "<b>Escrow</b>: a trusted third party holds copies of keys. <b>Recovery</b>: a process (e.g. BitLocker recovery keys stored in AD/Entra) to regain access to encrypted data."],
    ["What is steganography?", "Hiding data inside other media (images, audio), which conceals that the message exists at all. It is sometimes used for C2 or exfiltration."]
  ]);

  // ---------------- p1-m4 Identity & Access Management ----------------
  add("p1-m4", [
    ["Identification vs authentication vs authorization vs accounting?", "Claiming an identity (username) → proving it (password, MFA) → being granted permissions → logging what was done."],
    ["SAML vs OAuth 2.0 vs OpenID Connect?", "<b>SAML</b>: XML-based SSO/federation, common in enterprises. <b>OAuth 2.0</b>: delegated <i>authorization</i> (access tokens). <b>OIDC</b>: an <i>authentication</i> layer on top of OAuth 2.0 (ID tokens as JWTs)."],
    ["In SAML, what are the IdP and SP?", "The <b>Identity Provider</b> authenticates the user and issues a signed assertion. The <b>Service Provider</b> (the app) trusts that assertion and grants access."],
    ["What is SSO and its main risk?", "Single Sign-On: one authentication grants access to many apps. Risk: one compromised credential or IdP opens everything, so protect it with strong MFA."],
    ["RBAC vs ABAC?", "<b>RBAC</b> grants rights by job role. <b>ABAC</b> decides using attributes (user department, device health, time, data label), which is more granular."],
    ["DAC vs MAC?", "<b>DAC</b>: the data owner decides access (NTFS permissions). <b>MAC</b>: the system enforces labels and clearances (e.g. SELinux, military systems), and users cannot change it."],
    ["What is Privileged Access Management (PAM)?", "Tools and processes that vault, rotate, broker and record privileged credentials and sessions, often with just-in-time elevation."],
    ["What is Just-in-Time (JIT) access?", "Privileges granted only when needed, for a limited time, and then removed automatically. This removes standing admin rights (e.g. Entra PIM)."],
    ["What makes MFA <b>phishing-resistant</b>?", "Cryptographic binding to the real site's origin, as with <b>FIDO2/WebAuthn passkeys</b> and smart cards (PIV). OTP codes and push approvals can be phished or relayed."],
    ["What is MFA fatigue (push bombing)?", "An attacker with a valid password floods the user with push prompts until they approve one. Mitigations: number matching, phishing-resistant MFA and alerting on repeated denials."],
    ["Current NIST SP 800-63B password guidance?", "Prefer length (min 8, ideally 15+ for password-only), allow at least 64 characters, check new passwords against breached lists, and do <b>not</b> force periodic changes or composition rules. Change passwords on evidence of compromise."],
    ["What are provisioning and deprovisioning?", "Creating and adjusting accounts when people join or move, and promptly disabling them when they leave. Orphaned accounts are a major risk."],
    ["What is privilege creep and how is it controlled?", "Users collect rights as they change roles. Control it with periodic <b>access reviews/recertification</b> and role-based provisioning."],
    ["RADIUS vs TACACS+?", "<b>RADIUS</b>: UDP 1812/1813, encrypts only the password, combines authentication and authorization. Used for network access/VPN/Wi-Fi. <b>TACACS+</b>: TCP 49, encrypts the whole payload, separates AAA. Used for device administration."],
    ["What is federation?", "A trust relationship that lets identities from one domain (IdP) access resources in another (SP) without separate accounts, using SAML, OIDC or WS-Fed."],
    ["Biometrics: FAR, FRR and CER?", "<b>FAR</b>: impostors wrongly accepted (Type II). <b>FRR</b>: legitimate users wrongly rejected (Type I). <b>CER/EER</b>: the point where they are equal; a lower CER means a more accurate system."],
    ["What is a service account and why is it risky?", "A non-human account that applications use. Such accounts are often over-privileged, never expire and are excluded from MFA. Use managed identities/gMSA and rotate secrets."],
    ["What is a passkey?", "A FIDO2 credential (a public/private key pair) that replaces passwords. The private key never leaves the device or sync provider, and it is phishing-resistant."],
    ["What does conditional access do?", "Policy that grants, blocks or requires MFA depending on signals such as user, location, device compliance and risk. It is a core zero-trust building block."]
  ]);

  // ---------------- p1-m5 Secure Network Architecture & Zero Trust ----------------
  add("p1-m5", [
    ["What is a screened subnet (DMZ)?", "A network segment between the internet and the internal LAN that hosts public-facing services, so a compromise there does not directly expose internal systems."],
    ["Stateless vs stateful firewall?", "<b>Stateless</b> filters each packet on its own (ACLs). <b>Stateful</b> tracks connection state and allows return traffic automatically."],
    ["What does an NGFW add?", "A next-generation firewall adds application awareness (Layer 7), user identity, IPS, TLS inspection and threat-intel feeds on top of stateful filtering."],
    ["What does a WAF protect?", "A Web Application Firewall inspects HTTP(S) traffic to block attacks such as SQLi and XSS in front of web apps and APIs."],
    ["IDS vs IPS?", "An <b>IDS</b> watches and alerts (passive, often on a SPAN/TAP). An <b>IPS</b> sits inline and can block traffic. False positives on an IPS can block legitimate traffic."],
    ["IPsec AH vs ESP?", "<b>AH</b> provides integrity and authentication only (no encryption, and it breaks with NAT). <b>ESP</b> provides confidentiality plus integrity, and it is the one normally used."],
    ["IPsec transport vs tunnel mode?", "<b>Transport</b> protects only the payload (host-to-host). <b>Tunnel</b> encapsulates the whole original packet (site-to-site VPN gateways)."],
    ["What is IKE?", "Internet Key Exchange (UDP 500, 4500 for NAT-T). It negotiates IPsec security associations and keys. IKEv2 is the current version."],
    ["What is 802.1X?", "Port-based network access control. The <b>supplicant</b> (client) authenticates through the <b>authenticator</b> (switch or AP) to an <b>authentication server</b> (RADIUS) using EAP."],
    ["Which NIST publication defines Zero Trust Architecture?", "<b>NIST SP 800-207</b>. Its core idea: never trust implicitly based on network location; authenticate and authorize every request. Implementation guidance is in SP 1800-35 (2025)."],
    ["Zero trust: PDP vs PEP?", "The <b>Policy Decision Point</b> (policy engine plus administrator) decides whether access is allowed. The <b>Policy Enforcement Point</b> enforces that decision in the data path."],
    ["What is microsegmentation?", "Fine-grained segmentation down to the workload or application level, so attackers cannot move laterally even inside one data center or VLAN."],
    ["What is SASE?", "Secure Access Service Edge: networking (SD-WAN) and security (SWG, CASB, ZTNA, FWaaS) delivered as one cloud service. SSE is the security-only part."],
    ["ZTNA vs traditional VPN?", "A VPN usually puts the user 'on the network'. ZTNA grants per-application access after checking identity and device posture, so the network is not exposed."],
    ["What is a jump server (bastion host)?", "A hardened, monitored host that admins must go through to reach sensitive systems. It centralizes access control and session logging."],
    ["Forward proxy vs reverse proxy?", "A <b>forward</b> proxy acts for clients going out (web filtering). A <b>reverse</b> proxy sits in front of servers (load balancing, TLS termination, WAF)."],
    ["What is the strongest Wi-Fi security today?", "<b>WPA3</b>, which uses SAE (Simultaneous Authentication of Equals) for Personal and 192-bit mode for Enterprise. It protects against offline dictionary attacks on the handshake."],
    ["Fail-open vs fail-closed?", "<b>Fail-open</b> lets traffic through when a device fails (favors availability). <b>Fail-closed/secure</b> blocks traffic (favors confidentiality and integrity)."],
    ["What is a honeypot / honeynet?", "Decoy systems or networks that attract attackers so you can detect and study them. Any interaction with them is suspicious, so they give high-fidelity alerts."],
    ["What is an air gap?", "Physical isolation from other networks. It is still vulnerable to removable media and insiders (Stuxnet crossed one with USB drives)."]
  ]);

  // ---------------- p1-m6 Vulnerability Management & SecOps Basics ----------------
  add("p1-m6", [
    ["What is a CVE?", "Common Vulnerabilities and Exposures: a unique ID for a publicly disclosed vulnerability, e.g. CVE-2021-44228 (Log4Shell). The program is run by MITRE and funded by CISA."],
    ["What is CWE?", "Common Weakness Enumeration: a catalog of <i>types</i> of software weakness, e.g. CWE-79 XSS, CWE-89 SQL injection."],
    ["CVSS severity ranges?", "None 0.0, Low 0.1–3.9, Medium 4.0–6.9, High 7.0–8.9, Critical 9.0–10.0. The current version is <b>CVSS v4.0</b> (Nov 2023)."],
    ["What is EPSS?", "The Exploit Prediction Scoring System (FIRST) estimates the probability that a CVE will be exploited in the next 30 days, which helps prioritize beyond CVSS severity."],
    ["What is the CISA KEV catalog?", "Known Exploited Vulnerabilities: CVEs with confirmed exploitation in the wild. BOD 22-01 requires US federal agencies to fix them by set due dates. Everyone else should prioritize them too."],
    ["Credentialed vs non-credentialed scan?", "A <b>credentialed</b> scan logs in and sees missing patches and configuration, so it is more accurate. A <b>non-credentialed</b> scan shows the outside-attacker view and has more false positives and negatives."],
    ["False positive vs false negative in scanning?", "A <b>false positive</b> reports a vulnerability that isn't there. A <b>false negative</b> misses a real one, which is more dangerous because it gives false assurance."],
    ["What is the first prerequisite for vulnerability management?", "An accurate <b>asset inventory</b>. You cannot scan or patch what you don't know exists."],
    ["Steps of the vulnerability management lifecycle?", "Discover assets → scan/assess → prioritize (risk) → remediate or mitigate → verify (rescan) → report, then repeat continuously."],
    ["Remediation vs mitigation vs acceptance?", "<b>Remediation</b> removes the vulnerability (patch). <b>Mitigation</b> reduces its risk (WAF rule, segmentation). <b>Acceptance</b> is a documented, approved decision to live with it."],
    ["What is a risk exception / exemption?", "A formal, time-limited approval to leave a vulnerability unfixed, usually requiring compensating controls and sign-off by the risk owner."],
    ["Vulnerability scan vs penetration test?", "A <b>scan</b> is automated and broad, and it identifies potential weaknesses. A <b>pentest</b> is human-led, actively exploits weaknesses to prove impact and needs written authorization."],
    ["What is an SBOM?", "A Software Bill of Materials: an inventory of the components and dependencies in software (formats SPDX, CycloneDX). It lets you quickly answer 'are we affected by CVE-X?'"],
    ["What is SCAP?", "Security Content Automation Protocol (NIST): standards such as CVE, CPE, CVSS, XCCDF and OVAL that let tools exchange vulnerability and configuration data automatically."],
    ["Why rescan after patching?", "To validate that the fix was applied and worked, and to close the ticket with evidence."],
    ["Common vulnerability scanners?", "Tenable Nessus, Qualys VMDR, Rapid7 InsightVM, open-source OpenVAS/Greenbone, and Nuclei for templated web checks."],
    ["Factors in risk-based vulnerability prioritization?", "Exploitability (KEV, EPSS, public exploit), asset criticality, internet exposure, data sensitivity, compensating controls, and CVSS severity."],
    ["What is a typical remediation SLA?", "It varies by organization; commonly Critical within 7–15 days, High within 30, Medium within 60–90. KEV and internet-facing issues often get faster deadlines."],
    ["What is configuration hardening and which benchmarks help?", "Reducing the attack surface by disabling unneeded services and enforcing secure settings, using <b>CIS Benchmarks</b> or <b>DISA STIGs</b>."]
  ]);

  // ---------------- p2-m1 Inside the SOC ----------------
  add("p2-m1", [
    ["Typical SOC tiers?", "<b>Tier 1</b>: alert triage and initial investigation. <b>Tier 2</b>: deeper investigation and incident response. <b>Tier 3</b>: threat hunting, detection engineering and advanced IR/forensics. A SOC manager oversees all three."],
    ["What does a Tier 1 analyst do on each alert?", "Validates it (true or false positive), enriches it (user, host, IP reputation), scopes it, documents findings, then closes it or escalates according to the playbook."],
    ["True positive vs false positive vs false negative vs true negative?", "TP: real threat, alerted. FP: benign activity, alerted. FN: real threat, <b>no</b> alert (the worst case). TN: benign activity, no alert."],
    ["What is a 'benign true positive'?", "The detection logic fired correctly on the activity it targets, but the activity was authorized, e.g. an admin's approved scan. Usually handled with tuning or an allowlist."],
    ["What is MTTD?", "Mean Time to Detect: average time from the start of malicious activity to its detection."],
    ["What is MTTR?", "Mean Time to Respond (or Recover/Remediate): average time from detection to containment or resolution. Always define which one you mean."],
    ["What is MTTA?", "Mean Time to Acknowledge: average time from an alert firing to an analyst picking it up. It measures queue health and staffing."],
    ["What is dwell time?", "How long an attacker is in the environment before being detected. Mandiant M-Trends reported a global median of about 10–11 days in recent years."],
    ["What is alert fatigue and how do you fight it?", "Analysts become desensitized by high volumes of low-value alerts. Fight it with tuning, deduplication, risk-based alerting, automation (SOAR) and retiring noisy rules."],
    ["Playbook vs runbook?", "A <b>playbook</b> is the high-level response workflow for a scenario (e.g. phishing). A <b>runbook</b> gives the detailed, step-by-step technical procedures, which are often automated."],
    ["What does SOAR do?", "Security Orchestration, Automation and Response: it connects tools and automates enrichment, ticketing and response actions (e.g. block an IP, isolate a host) through playbooks."],
    ["MSSP vs MDR?", "An <b>MSSP</b> manages security devices and monitoring, often alert-forwarding. <b>MDR</b> provides 24/7 detection <i>and</i> hands-on investigation and response, usually built on EDR/XDR."],
    ["Severity vs priority?", "<b>Severity</b> is the potential impact of the threat. <b>Priority</b> is the order of handling, which also considers asset criticality, scope and business context."],
    ["What should an alert ticket record?", "Timeline, IOCs, affected users and hosts, queries run, evidence, analysis reasoning, actions taken, and the verdict with its justification, so another analyst can reproduce your work."],
    ["Why is shift handover important?", "In a 24/7 SOC, open investigations, ongoing incidents and pending actions must pass to the next shift cleanly. A dropped handover can let an attacker continue."],
    ["What is a detection use case?", "A defined scenario to detect (e.g. 'brute force followed by successful logon'), with its data sources, logic, response steps and ATT&amp;CK mapping."],
    ["When should a Tier 1 analyst escalate?", "When the alert is a confirmed or likely true positive beyond Tier 1 scope: privileged accounts, multiple hosts, data exfiltration, ransomware signs, or uncertainty past the SLA. When in doubt, escalate and document."],
    ["What are good SOC metrics beyond alert counts?", "MTTD/MTTR, false positive rate per rule, ATT&amp;CK detection coverage, escalation accuracy, automation rate, and incidents caught internally versus externally reported."],
    ["What is the 'assume breach' mindset?", "Operate as if attackers are already inside: monitor internal and east-west activity, limit the blast radius and verify continuously, rather than trusting the perimeter alone."]
  ]);

  // ---------------- p2-m2 Log Sources & Log Analysis ----------------
  add("p2-m2", [
    ["Windows Event ID <b>4624</b>?", "An account was successfully logged on. Check the <b>Logon Type</b>, source IP/workstation and authentication package."],
    ["Windows Event ID <b>4625</b>?", "An account failed to log on. The Status/SubStatus codes give the reason, e.g. 0xC000006A bad password, 0xC0000064 unknown user."],
    ["Windows Logon Types 2, 3, 4, 5, 7, 10?", "2 Interactive (console), 3 Network (SMB, etc.), 4 Batch (scheduled task), 5 Service, 7 Unlock, 10 RemoteInteractive (RDP). Type 9 NewCredentials appears with <code>runas /netonly</code>."],
    ["Windows Event ID <b>4672</b>?", "Special privileges assigned to a new logon, meaning an admin-equivalent logon. Correlate it with 4624."],
    ["Windows Event ID <b>4688</b>?", "A new process has been created. Enable 'Include command line in process creation events' to capture the full command line."],
    ["Windows Event IDs <b>4720</b>, <b>4726</b>?", "4720: a user account was created. 4726: a user account was deleted."],
    ["Windows Event IDs <b>4728</b>, <b>4732</b>, <b>4756</b>?", "A member was added to a security-enabled <b>global</b> (4728), <b>local</b> (4732) or <b>universal</b> (4756) group. Watch these for privileged groups."],
    ["Windows Event ID <b>4740</b>?", "A user account was locked out. A spike across many accounts suggests password spraying."],
    ["Windows Event ID <b>1102</b>?", "The Security audit log was cleared. This is a strong anti-forensics indicator (Indicator Removal, T1070.001). In the System log, the equivalent is Event 104."],
    ["Kerberos Event IDs <b>4768</b>, <b>4769</b>, <b>4771</b>?", "4768: TGT requested (AS). 4769: service ticket requested (TGS); look for RC4 (0x17) for Kerberoasting. 4771: Kerberos pre-authentication failed."],
    ["Windows Event ID <b>4776</b>?", "The DC attempted to validate credentials (<b>NTLM</b> authentication). Useful for spotting NTLM brute force and legacy authentication."],
    ["Windows Event IDs <b>7045</b> and <b>4697</b>?", "A new service was installed: 7045 in the System log, 4697 in the Security log. Attackers use services for persistence and lateral movement (e.g. PsExec)."],
    ["Windows Event ID <b>4698</b>?", "A scheduled task was created, which is a common persistence and execution technique (T1053.005)."],
    ["Syslog severity levels 0–7?", "0 Emergency, 1 Alert, 2 Critical, 3 Error, 4 Warning, 5 Notice, 6 Informational, 7 Debug."],
    ["Key fields in a web server access log?", "Client IP, timestamp, method, URI, HTTP status, bytes, referrer, user-agent. Watch for many 404s (scanning), unusual 500s, and payloads like <code>../</code> or <code>UNION SELECT</code>."],
    ["HTTP status classes?", "1xx informational, 2xx success (200), 3xx redirect (301/302), 4xx client error (401 unauthorized, 403 forbidden, 404 not found), 5xx server error (500, 503)."],
    ["Why is time synchronization critical for log analysis?", "Correlating events across systems requires consistent timestamps. Use NTP everywhere and normalize to <b>UTC</b>."],
    ["What is log normalization?", "Mapping different log formats into a common schema (e.g. Elastic ECS, Splunk CIM, Microsoft ASIM, OCSF), so one query works across sources."],
    ["Which log sources matter most to a SOC?", "Identity (AD, Entra ID), endpoint (EDR, Sysmon), network (firewall, proxy, DNS), email, cloud control plane (CloudTrail, Azure Activity) and critical applications."],
    ["Linux: what does an SSH brute force look like in auth.log?", "Many <code>Failed password for [invalid user] X from &lt;IP&gt;</code> lines from one IP. A following <code>Accepted password</code> from that IP is a critical finding."]
  ]);

  // ---------------- p2-m3 SIEM & Detection Engineering ----------------
  add("p2-m3", [
    ["Core functions of a SIEM?", "Collect and aggregate logs, normalize/parse, correlate events, alert, provide dashboards and search, and retain data for investigations and compliance."],
    ["What is a correlation rule?", "Logic that links several events, possibly from different sources, into one alert, e.g. 10 × 4625 then 4624 for the same user within 5 minutes."],
    ["Splunk SPL: count failed logons by source IP?", "<code>index=wineventlog EventCode=4625 | stats count by src_ip | sort -count</code>"],
    ["KQL (Sentinel/Defender): count failed sign-ins by user?", "<code>SigninLogs | where ResultType != 0 | summarize count() by UserPrincipalName | order by count_ desc</code>"],
    ["What is Sigma?", "A generic, vendor-neutral YAML format for log-based detection rules that can be converted into SPL, KQL, Elastic queries, etc. ('YARA for logs')."],
    ["What is YARA used for?", "Pattern-matching rules (strings, byte patterns, conditions) to identify and classify <b>files or memory</b>, i.e. malware. A rule has meta, strings and condition sections."],
    ["What is Snort/Suricata rule syntax used for?", "Network IDS signatures, e.g. <code>alert tcp any any -&gt; $HOME_NET 445 (msg:\"...\"; content:\"...\"; sid:1000001;)</code>."],
    ["What is detection-as-code?", "Managing detections like software: version control, peer review, automated testing and CI/CD deployment to the SIEM."],
    ["Signature/threshold vs anomaly-based detection?", "<b>Signature/threshold</b>: known-bad patterns or counts; precise but misses novel attacks. <b>Anomaly</b>: deviation from a baseline; finds the unknown but is noisier."],
    ["What is UEBA?", "User and Entity Behavior Analytics: it baselines normal behavior for users and hosts and flags deviations, such as impossible travel or unusual data access."],
    ["What is risk-based alerting (RBA)?", "Instead of alerting on each low-fidelity event, add risk scores to an entity (user or host) and alert when the cumulative score crosses a threshold. This sharply reduces noise."],
    ["How should you tune a noisy rule safely?", "Find the benign pattern, add the narrowest possible exclusion (specific host + process + user, not a broad wildcard), document why, and review exclusions periodically."],
    ["What makes a high-quality alert?", "High fidelity, clear title and description, ATT&amp;CK mapping, enrichment (asset, user, reputation), severity, and a linked response playbook."],
    ["How do you test that a detection actually works?", "Emulate the technique, e.g. with <b>Atomic Red Team</b> tests or a purple-team exercise, and confirm the alert fires. Rerun after changes."],
    ["Splunk: what are index and sourcetype?", "An <b>index</b> is where data is stored (a repository). A <b>sourcetype</b> describes the data's format and parsing. Always filter on both for performance."],
    ["KQL operators: <code>where</code>, <code>project</code>, <code>summarize</code>, <code>extend</code>?", "<code>where</code> filters rows, <code>project</code> selects columns, <code>summarize</code> aggregates, <code>extend</code> adds computed columns."],
    ["What is ATT&amp;CK coverage mapping?", "Tagging each detection with technique IDs and visualizing them (e.g. in ATT&amp;CK Navigator) to find gaps. Coverage of a technique does not guarantee all of its procedures are detected."],
    ["Detection engineering lifecycle?", "Requirement/intel → research the technique → identify data sources → write logic → test/emulate → deploy → tune → measure → retire or update."],
    ["Why must you check log source health?", "A silent log source (an agent stopped, a parser broken) creates blind spots. Alert on missing data or sudden volume drops."]
  ]);

  // ---------------- p2-m4 Network Traffic Analysis ----------------
  add("p2-m4", [
    ["Full packet capture vs NetFlow?", "<b>PCAP</b> holds the complete packets and payload; it is rich but takes a lot of storage. <b>NetFlow/IPFIX</b> holds connection metadata only (who, when, how much), which is cheap to keep long-term."],
    ["Wireshark filter: traffic to/from one IP?", "<code>ip.addr == 10.0.0.5</code> (use <code>ip.src</code>/<code>ip.dst</code> for direction)."],
    ["Wireshark filter: HTTP requests only? DNS only?", "<code>http.request</code> and <code>dns</code>. For a port: <code>tcp.port == 443</code>."],
    ["Wireshark filter: SYN packets without ACK (scans)?", "<code>tcp.flags.syn == 1 &amp;&amp; tcp.flags.ack == 0</code>"],
    ["How do you rebuild a conversation in Wireshark?", "Right-click → Follow → TCP Stream (or HTTP/TLS Stream). Use File → Export Objects → HTTP to carve transferred files."],
    ["tcpdump: capture on eth0 to a file, only port 53?", "<code>sudo tcpdump -i eth0 -w dns.pcap port 53</code> (add <code>-nn</code> to skip name and port resolution when reading)."],
    ["Key Zeek logs?", "<code>conn.log</code> (every connection), <code>dns.log</code>, <code>http.log</code>, <code>ssl.log</code>, <code>files.log</code>, <code>x509.log</code>, <code>notice.log</code>."],
    ["What is beaconing and how do you spot it?", "Malware checking in with C2 at regular intervals. Look for consistent intervals (with jitter), similar packet sizes, and long-running repeated connections to one destination."],
    ["Signs of DNS tunneling?", "Long, high-entropy subdomains, high query volume to one domain, many TXT/NULL records, and unusual query lengths. Tools such as iodine and dnscat2 generate it."],
    ["What are JA3 and JA4?", "TLS client fingerprints built from ClientHello parameters. They help identify malware families or tools even when traffic is encrypted. JA4+ is the newer suite."],
    ["What does TLS SNI reveal?", "The Server Name Indication shows the requested hostname in the ClientHello, so you can see destination domains without decryption (Encrypted ClientHello hides it)."],
    ["What does an Nmap SYN scan look like on the wire?", "Many SYNs to many ports. Open ports reply SYN-ACK and the scanner sends RST. Closed ports reply RST-ACK."],
    ["How do you spot ARP spoofing?", "One MAC address claiming several IPs (often the gateway's), gratuitous ARP floods, or Wireshark's 'duplicate use of IP' warnings."],
    ["Indicators of data exfiltration in traffic?", "Large outbound transfers, uploads to cloud storage or paste sites, abnormal hours, unusual protocols (DNS, ICMP) carrying data, and traffic asymmetry (more bytes out than in)."],
    ["Suricata vs Zeek?", "<b>Suricata</b> is a signature-based IDS/IPS that produces alerts. <b>Zeek</b> is a network security monitor that produces rich protocol logs for analysis and hunting. They complement each other."],
    ["Why is 'long connection' analysis useful?", "Connections lasting hours (e.g. a persistent C2 or reverse shell) are rare for normal clients. Sort conn.log by duration to find them."],
    ["How can TTL values help analysis?", "Default initial TTLs hint at the OS (Linux about 64, Windows 128, network devices 255), and sudden TTL changes can reveal spoofing or an on-path device."],
    ["What can you analyze in encrypted traffic without decrypting?", "Metadata: IPs, ports, SNI, certificate details (issuer, self-signed, validity), JA3/JA4, timing, sizes and volume."],
    ["Where do you place sensors to capture traffic?", "Use a network <b>TAP</b> (passive, reliable) or a switch <b>SPAN</b>/mirror port, at chokepoints such as the internet edge, between zones and at data center cores."]
  ]);

  // ---------------- p2-m5 Endpoint Security & EDR ----------------
  add("p2-m5", [
    ["Traditional AV vs EDR?", "AV mainly blocks known-bad files by signature. EDR continuously records endpoint telemetry (processes, network, registry, files), detects by behavior and enables investigation and response such as host isolation."],
    ["What is XDR?", "Extended Detection and Response: it correlates telemetry beyond the endpoint (identity, email, cloud, network) in one platform, e.g. Microsoft Defender XDR."],
    ["Sysmon Event ID <b>1</b>?", "Process creation, with command line, hashes, parent process and user."],
    ["Sysmon Event ID <b>3</b>?", "Network connection: the process, source/destination IP and port."],
    ["Sysmon Event IDs <b>7</b> and <b>8</b>?", "7: image (DLL) loaded. 8: CreateRemoteThread, a common sign of process injection."],
    ["Sysmon Event ID <b>10</b>?", "ProcessAccess. Look for access to <code>lsass.exe</code> (GrantedAccess such as 0x1010), which indicates credential dumping (T1003.001)."],
    ["Sysmon Event IDs <b>11</b>, <b>12–14</b>?", "11: file created. 12/13/14: registry object create/delete, value set, and rename."],
    ["Sysmon Event ID <b>22</b>?", "DNS query, i.e. which process looked up which domain. Very useful for C2 and phishing investigations."],
    ["Suspicious parent-child process examples?", "<code>winword.exe</code> → <code>powershell.exe</code>, <code>excel.exe</code> → <code>cmd.exe</code>, <code>w3wp.exe</code> → <code>cmd.exe</code> (web shell), <code>services.exe</code> spawning odd binaries."],
    ["What are LOLBins? Give examples.", "Living-off-the-land binaries: legitimate signed OS tools abused by attackers, e.g. <code>certutil</code> (download/decode), <code>rundll32</code>, <code>mshta</code>, <code>regsvr32</code>, <code>bitsadmin</code>. See the LOLBAS project."],
    ["What is AMSI?", "The Antimalware Scan Interface lets security products scan script content (PowerShell, VBScript, JScript, Office VBA) at runtime after de-obfuscation. Attackers try to bypass it."],
    ["What does host isolation do in EDR?", "It cuts the endpoint off from the network except for its connection to the EDR console. This contains the threat while keeping evidence and remote investigation possible."],
    ["AppLocker vs WDAC?", "Both provide application allowlisting on Windows. <b>WDAC</b> (App Control for Business) is the stronger, kernel-enforced option Microsoft recommends. <b>AppLocker</b> is older and easier to deploy."],
    ["Common Windows persistence locations to check?", "Run/RunOnce keys, Startup folder, scheduled tasks, services, WMI event subscriptions, and DLL search-order hijacks."],
    ["Hash-based vs behavioral detection?", "Hashes match exact files and break with one changed byte. Behavioral detection looks at actions (e.g. Office spawning a script host) and resists trivial changes."],
    ["What are the first EDR triage steps for a suspicious process?", "Review the process tree, command line, hash reputation, signer, network connections, files written, user context and prevalence across the fleet."],
    ["What is the role of Microsoft Defender ASR rules?", "Attack Surface Reduction rules block risky behaviors such as Office apps creating child processes or credential stealing from LSASS."],
    ["Why should EDR have tamper protection?", "Attackers try to stop or uninstall security agents (Impair Defenses, T1562). Tamper protection stops even local admins from turning off the agent."],
    ["What is fileless malware?", "Malware that runs mainly in memory or abuses built-in tools (PowerShell, WMI, registry-stored payloads) and leaves few files, so behavioral and memory detection are required."]
  ]);

  // ---------------- p2-m6 Phishing & Email Analysis ----------------
  add("p2-m6", [
    ["What does SPF do?", "Sender Policy Framework: a DNS TXT record listing the IPs allowed to send mail for a domain. It checks the envelope sender (Return-Path / MAIL FROM), not the visible From."],
    ["What does DKIM do?", "DomainKeys Identified Mail: the sending server signs headers and body with a private key, and receivers verify with the public key published in DNS (<code>selector._domainkey</code>)."],
    ["What does DMARC do and what are its policies?", "It requires SPF or DKIM to pass <i>and align</i> with the visible From domain, and tells receivers what to do: <code>p=none</code> (monitor), <code>quarantine</code>, <code>reject</code>. It also provides aggregate reports (<code>rua</code>)."],
    ["Which header shows the SPF/DKIM/DMARC verdicts?", "<code>Authentication-Results</code>, added by the receiving mail server."],
    ["In which order do you read <code>Received:</code> headers?", "From <b>bottom to top</b>. The lowest header is the first hop (closest to the real sender). Upper ones can be trusted only if they were added by your own servers."],
    ["What do From vs Return-Path vs Reply-To mismatches suggest?", "Possible spoofing or BEC. A Reply-To pointing to an outside free-mail address is a classic red flag."],
    ["What is defanging and why do it?", "Making IOCs non-clickable in reports, e.g. <code>hxxps://evil[.]com</code>, <code>10.0.0[.]5</code>, to avoid accidental clicks or auto-linking."],
    ["What is the MITRE ATT&amp;CK technique for phishing?", "<b>T1566</b> Phishing, with sub-techniques .001 Spearphishing Attachment, .002 Spearphishing Link, .003 via Service, .004 Voice."],
    ["What is AiTM phishing?", "Adversary-in-the-Middle kits (e.g. Evilginx-style reverse proxies) relay the real login page and steal the <b>session cookie</b>, which bypasses OTP and push MFA. FIDO2 passkeys resist it."],
    ["What is quishing?", "QR-code phishing. The malicious URL is hidden in an image, which evades URL scanners and moves the victim to a less protected mobile device."],
    ["What is HTML smuggling?", "An HTML attachment or page uses JavaScript to build a malicious file (e.g. ZIP/ISO) inside the browser, which bypasses email and proxy file scanning."],
    ["Common malicious attachment types today?", "Macro-free lures such as ISO/IMG, LNK, OneNote, HTML/SVG, password-protected ZIPs, and PDFs with links. VBA macros declined after Microsoft blocked internet macros by default (2022)."],
    ["What is a homoglyph / lookalike domain?", "A domain using similar-looking characters (e.g. Cyrillic 'а', <code>rn</code> for <code>m</code>, <code>paypa1.com</code>) to impersonate a brand. IDN punycode starts with <code>xn--</code>."],
    ["Tools to analyze a suspicious URL or file safely?", "urlscan.io, VirusTotal, an Any.run / Joe Sandbox detonation, URL unshorteners, and WHOIS/domain-age lookups. Never open them on your own workstation."],
    ["Standard phishing triage steps?", "Analyze headers and authentication → analyze URLs/attachments in a sandbox → decide the verdict → find every recipient (message trace) → purge emails → block IOCs → check who clicked or entered credentials → reset passwords and revoke sessions."],
    ["What should you do if a user entered credentials on a phishing page?", "Reset the password, <b>revoke active sessions/tokens</b>, review MFA methods and inbox rules for tampering, check sign-in logs for attacker access, and scope for lateral phishing."],
    ["Why are new mailbox forwarding/inbox rules a red flag?", "Attackers who take over accounts create rules that forward mail or hide replies (e.g. move messages containing 'invoice' to RSS Feeds) to support BEC."],
    ["Why is a domain's age useful in phishing analysis?", "Phishing domains are often registered days before a campaign. A very young domain plus urgent content is highly suspicious."],
    ["What is the value of a user 'Report Phish' button?", "It turns users into sensors, gives the SOC quick samples, and with automation can cluster and purge similar emails from every mailbox."]
  ]);

  // ---------------- p2-m7 Threat Frameworks ----------------
  add("p2-m7", [
    ["List the 14 MITRE ATT&amp;CK Enterprise tactics in order.", "Reconnaissance, Resource Development, Initial Access, Execution, Persistence, Privilege Escalation, Defense Evasion, Credential Access, Discovery, Lateral Movement, Collection, Command and Control, Exfiltration, Impact."],
    ["ATT&amp;CK tactic vs technique vs procedure?", "<b>Tactic</b>: the adversary's goal (the 'why'). <b>Technique/sub-technique</b>: how they achieve it. <b>Procedure</b>: the specific implementation a group used in the wild."],
    ["ATT&amp;CK <b>T1059</b>?", "Command and Scripting Interpreter, e.g. .001 PowerShell, .003 Windows Command Shell, .004 Unix Shell. Tactic: Execution."],
    ["ATT&amp;CK <b>T1566</b>?", "Phishing. Tactic: Initial Access."],
    ["ATT&amp;CK <b>T1003</b>?", "OS Credential Dumping, e.g. .001 LSASS Memory, .002 SAM, .003 NTDS, .006 DCSync. Tactic: Credential Access."],
    ["ATT&amp;CK <b>T1078</b>?", "Valid Accounts: using legitimate credentials. It spans Initial Access, Persistence, Privilege Escalation and Defense Evasion."],
    ["ATT&amp;CK <b>T1110</b>?", "Brute Force, including .001 Password Guessing, .003 Password Spraying, .004 Credential Stuffing. Tactic: Credential Access."],
    ["ATT&amp;CK <b>T1486</b>?", "Data Encrypted for Impact, i.e. ransomware encryption. Tactic: Impact."],
    ["ATT&amp;CK <b>T1021</b>?", "Remote Services (e.g. .001 RDP, .002 SMB/Windows Admin Shares, .006 WinRM). Tactic: Lateral Movement."],
    ["Lockheed Martin Cyber Kill Chain, 7 phases?", "Reconnaissance, Weaponization, Delivery, Exploitation, Installation, Command &amp; Control, Actions on Objectives."],
    ["Pyramid of Pain levels, bottom to top?", "Hash values → IP addresses → Domain names → Network/Host artifacts → Tools → <b>TTPs</b>. Higher levels cost the adversary more pain to change."],
    ["Why are TTPs at the top of the Pyramid of Pain?", "Behaviors are hard for adversaries to change, while hashes and IPs are trivial to rotate. Detecting TTPs forces attackers to retool."],
    ["Four vertices of the Diamond Model?", "<b>Adversary</b>, <b>Capability</b>, <b>Infrastructure</b>, <b>Victim</b>. Each intrusion event links them, which lets analysts pivot from one to another."],
    ["What is MITRE D3FEND?", "A knowledge graph of <i>defensive</i> countermeasure techniques that maps to ATT&amp;CK offensive techniques."],
    ["What is ATT&amp;CK Navigator?", "A web tool for creating layered heatmaps of ATT&amp;CK, used for coverage mapping, threat-actor profiles and gap analysis."],
    ["How are ATT&amp;CK groups and software identified?", "Groups use <b>G</b>-IDs (e.g. G0016 APT29), software uses <b>S</b>-IDs, mitigations use <b>M</b>-IDs, and data sources use <b>DS</b>-IDs."],
    ["What is the Unified Kill Chain?", "Paul Pols's 18-phase model combining the Kill Chain and ATT&amp;CK, grouped into In (initial foothold), Through (network propagation) and Out (actions on objectives)."],
    ["Main limitation of the Cyber Kill Chain?", "It focuses on perimeter, malware-centric intrusions, and handles insider threats, credential-only attacks and post-compromise lateral movement poorly."],
    ["Besides Enterprise, what ATT&amp;CK matrices exist?", "<b>Mobile</b> and <b>ICS</b>. Enterprise also has platform views (Windows, Linux, macOS, Cloud/IaaS, SaaS, Identity, Network, Containers). MITRE ATLAS covers AI systems."]
  ]);
})();
