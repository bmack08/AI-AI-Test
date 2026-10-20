window.CP = window.CP || {};
CP.papers = CP.papers || [];

CP.papers.push({
  id: "paper-how-the-internet-works",
  title: "How the Internet Works: From Packets to Protocols",
  module: "p0-m2",
  minutes: 18,
  summary: "A defender's walk through what actually happens when you type a URL: encapsulation, IP routing, DNS resolution, the TCP three-way handshake and the TLS 1.3 handshake, with the security relevance of each step.",
  html: `
<p>Every alert a SOC analyst will ever triage is, at bottom, a story about packets. A phishing link is a DNS lookup followed by a TCP connection followed by a TLS session. A data exfiltration is a long-lived flow carrying more bytes outbound than anyone expected. Command-and-control beaconing is a rhythm of small connections to the same destination. If you understand what "normal" looks like at each layer, the abnormal starts to jump out at you. This paper follows a single request, <code>https://www.example.com/</code>, from your keyboard to a web server and back, and stops at each step to ask: what can a defender see here, and what can an attacker abuse?</p>

<h3>1. Layers and encapsulation</h3>
<p>Networking is organized in layers so that each piece of the system only needs to understand its neighbors. The two models you will hear constantly are the seven-layer OSI model (a teaching and vocabulary tool) and the four-layer TCP/IP model (what the internet actually implements).</p>
<table>
<thead><tr><th>OSI layer</th><th>TCP/IP layer</th><th>Unit of data</th><th>Examples</th><th>What defenders watch</th></tr></thead>
<tbody>
<tr><td>7 Application, 6 Presentation, 5 Session</td><td>Application</td><td>Message</td><td>HTTP, DNS, SMTP, TLS</td><td>URLs, domains, user agents, certificates</td></tr>
<tr><td>4 Transport</td><td>Transport</td><td>Segment / datagram</td><td>TCP, UDP, QUIC (over UDP)</td><td>Ports, flags, session duration</td></tr>
<tr><td>3 Network</td><td>Internet</td><td>Packet</td><td>IPv4, IPv6, ICMP</td><td>Source/destination IPs, TTL, geolocation</td></tr>
<tr><td>2 Data link, 1 Physical</td><td>Link</td><td>Frame / bits</td><td>Ethernet, Wi-Fi (802.11), ARP</td><td>MAC addresses, ARP anomalies, rogue APs</td></tr>
</tbody>
</table>
<p><b>Encapsulation</b> is the process of each layer wrapping the data from the layer above with its own header. Your browser produces an HTTP request; TLS encrypts it into records; TCP chops the stream into segments and adds ports and sequence numbers; IP adds source and destination addresses; Ethernet or Wi-Fi adds MAC addresses for the next hop only. At the receiving end, each layer strips its header and passes the payload upward. The practical consequence for defenders is that different tools see different layers: a firewall log might show only layer 3 and 4 (IPs and ports), a proxy log shows layer 7 (URLs), and a packet capture shows everything that is not encrypted.</p>

<h3>2. Addressing: MAC, IP and ports</h3>
<p>Three kinds of address cooperate to deliver your request:</p>
<ul>
<li><b>MAC addresses</b> (48-bit, e.g. <code>3c:22:fb:12:ab:cd</code>) identify network interfaces on the local link. They change at every router hop because each hop is a new link.</li>
<li><b>IP addresses</b> identify hosts end to end. IPv4 addresses are 32 bits (<code>93.184.215.14</code>); IPv6 addresses are 128 bits (<code>2606:2800:21f:cb07:6820:80da:af6b:8b2c</code>). Private IPv4 ranges defined in RFC 1918 (<code>10.0.0.0/8</code>, <code>172.16.0.0/12</code>, <code>192.168.0.0/16</code>) are not routed on the public internet, so home and corporate networks use Network Address Translation (NAT) to share a public address.</li>
<li><b>Ports</b> (16-bit numbers) identify the application on a host. Servers listen on well-known ports (443 for HTTPS, 53 for DNS, 22 for SSH); clients use a random high "ephemeral" port for each connection.</li>
</ul>
<p>Before your laptop can send anything to the internet it needs to reach its default gateway. If it knows the gateway's IP but not its MAC, it broadcasts an ARP request ("who has 192.168.1.1?") and the router replies. ARP has no authentication, which is why <b>ARP spoofing</b> lets an attacker on the same LAN claim to be the gateway and sit in the middle of traffic. Defenses include Dynamic ARP Inspection on managed switches and, more fundamentally, encrypting everything at higher layers so that a man-in-the-middle sees only ciphertext.</p>

<h3>3. Routing: how packets cross the world</h3>
<p>The internet is a network of networks. Each independently operated network (an ISP, a cloud provider, a large enterprise) is an <b>Autonomous System</b> with a number (ASN). Autonomous systems tell each other which IP prefixes they can reach using the <b>Border Gateway Protocol (BGP)</b>. Each router on the path looks at the destination IP, finds the most specific matching route in its table, decrements the packet's TTL (Time To Live, called Hop Limit in IPv6) and forwards it. If TTL reaches zero, the packet is discarded and an ICMP "time exceeded" message goes back to the sender, which is exactly how <code>traceroute</code> maps a path.</p>
<p>BGP was designed on trust. A misconfigured or malicious AS can announce someone else's prefixes, a <b>BGP hijack</b>, and draw traffic toward itself. Resource Public Key Infrastructure (RPKI) route origin validation is the industry's main mitigation and its deployment has grown steadily; as an analyst you will rarely touch BGP, but you should know that "the IP is in the expected country" is not proof of anything.</p>

<h3>4. DNS: turning names into addresses</h3>
<p>Humans type names; packets need addresses. The Domain Name System (RFC 1034 and RFC 1035) is a globally distributed, hierarchical database that answers the question "what is the IP address of www.example.com?" Resolution typically looks like this:</p>
<ol>
<li><b>Local cache.</b> The browser and operating system check their caches and the <code>hosts</code> file. If a fresh answer exists, no network traffic is generated.</li>
<li><b>Stub resolver to recursive resolver.</b> Your OS sends a query, usually over UDP port 53, to a configured recursive resolver: your ISP's, your company's, or a public one. Increasingly this hop is encrypted with DNS over HTTPS (DoH, RFC 8484) or DNS over TLS (DoT, RFC 7858).</li>
<li><b>Root servers.</b> If the recursive resolver has nothing cached, it asks one of the 13 named root server identities (served by hundreds of anycast instances). The root does not know the answer but refers the resolver to the servers for <code>.com</code>.</li>
<li><b>TLD servers.</b> The <code>.com</code> servers refer the resolver to the authoritative name servers for <code>example.com</code>.</li>
<li><b>Authoritative server.</b> The authoritative server returns the A (IPv4) or AAAA (IPv6) record, with a TTL saying how long it may be cached.</li>
<li><b>Answer and cache.</b> The recursive resolver caches the answer and returns it to your machine.</li>
</ol>
<p>Common record types you will meet in investigations:</p>
<table>
<thead><tr><th>Record</th><th>Purpose</th><th>Security relevance</th></tr></thead>
<tbody>
<tr><td>A / AAAA</td><td>Name to IPv4 / IPv6 address</td><td>Where a suspicious domain points; fast-flux shows rapidly changing answers</td></tr>
<tr><td>CNAME</td><td>Alias to another name</td><td>Dangling CNAMEs to deleted cloud resources enable subdomain takeover</td></tr>
<tr><td>MX</td><td>Mail servers for a domain</td><td>Email routing and spoofing investigations</td></tr>
<tr><td>TXT</td><td>Free text</td><td>Holds SPF, DKIM and DMARC policies; also abused for DNS tunneling</td></tr>
<tr><td>NS</td><td>Authoritative name servers</td><td>Changes can indicate domain hijacking</td></tr>
<tr><td>PTR</td><td>Reverse lookup, IP to name</td><td>Mail server reputation checks</td></tr>
</tbody>
</table>
<p>DNS is a gold mine for defenders because almost every malicious action starts with a lookup. Watch for newly registered domains, algorithmically generated names (DGA) such as <code>qx7kzv0p2m.biz</code>, unusually long or high-entropy subdomains (a sign of DNS tunneling, where data is smuggled out inside query names), and clients that bypass the corporate resolver. Attackers, for their part, abuse DNS through cache poisoning, typosquatting and tunneling. DNSSEC adds cryptographic signatures to records so resolvers can verify they were not tampered with, though it does not encrypt queries.</p>

<h3>5. TCP: reliable streams and the three-way handshake</h3>
<p>Once the browser has an IP address, it opens a connection. Classic HTTPS (HTTP/1.1 and HTTP/2) runs over the Transmission Control Protocol, now specified in RFC 9293. TCP gives applications a reliable, ordered byte stream on top of IP, which itself may drop, duplicate or reorder packets. It achieves this with sequence numbers, acknowledgments, retransmission and flow control. Before data flows, the two sides synchronize sequence numbers with the <b>three-way handshake</b>:</p>
<pre><code>Client 192.168.1.20:51544                Server 93.184.215.14:443
   | ---- SYN      seq=1000           ----&gt; |
   | &lt;--- SYN-ACK  seq=5000 ack=1001  ----- |
   | ---- ACK      seq=1001 ack=5001  ----&gt; |
   |        (connection ESTABLISHED)        |</code></pre>
<p>Connections end with FIN packets from each side (a graceful close) or a RST (an abrupt reset). The TCP flags are some of the most useful fields in network forensics:</p>
<ul>
<li>A burst of SYNs to many ports with no completed handshakes is a <b>port scan</b> (for example <code>nmap -sS</code>, the "half-open" scan).</li>
<li>A flood of SYNs from spoofed sources that never complete is a <b>SYN flood</b> denial of service; SYN cookies are the classic server-side mitigation.</li>
<li>Many RSTs from a host can mean it is refusing connections to closed ports, or that a security device is injecting resets to kill sessions.</li>
</ul>
<p>UDP, by contrast, has no handshake and no reliability. It just sends datagrams. DNS, NTP, VoIP and streaming use it because speed matters more than retransmission. Because UDP has no handshake, source addresses are easy to spoof, which is the root of <b>reflection and amplification</b> DDoS attacks that abuse open DNS, NTP or memcached servers.</p>
<div class="callout tip"><p>HTTP/3 runs over QUIC (RFC 9000), which uses UDP port 443 and builds its own reliability and TLS 1.3 encryption on top. Many enterprise proxies cannot inspect QUIC, so some organizations block UDP 443 to force browsers back to TCP. If your network telemetry shows lots of UDP 443, that is QUIC, not something exotic.</p></div>

<h3>6. TLS 1.3: privacy and authenticity</h3>
<p>Transport Layer Security wraps the TCP stream in encryption and authentication. TLS 1.3 (RFC 8446, 2018) is the current version and was a substantial redesign: it removed legacy algorithms such as RSA key transport, static Diffie-Hellman, RC4, CBC-mode ciphers and SHA-1 in signatures, and it cut the handshake from two round trips to one. TLS 1.2 is still widely deployed and acceptable when configured well; TLS 1.0 and 1.1 are deprecated (RFC 8996).</p>
<p>A simplified TLS 1.3 handshake:</p>
<ol>
<li><b>ClientHello.</b> The client sends supported cipher suites (e.g. <code>TLS_AES_128_GCM_SHA256</code>), supported key-exchange groups, a <b>key share</b> (an ephemeral Diffie-Hellman public value, commonly X25519, and increasingly a hybrid post-quantum share such as X25519MLKEM768), and the <b>Server Name Indication (SNI)</b> extension naming the site it wants.</li>
<li><b>ServerHello.</b> The server picks a cipher suite and returns its own key share. Both sides can now compute the same shared secret. From this point everything is encrypted.</li>
<li><b>EncryptedExtensions, Certificate, CertificateVerify, Finished.</b> The server proves its identity by sending its X.509 certificate chain and a signature over the handshake transcript made with the certificate's private key. The client validates the chain up to a trusted root CA, checks that the name matches, and checks validity dates.</li>
<li><b>Client Finished.</b> The client confirms the transcript, and application data (the HTTP request) flows encrypted.</li>
</ol>
<p>Because the key exchange uses ephemeral keys, TLS 1.3 provides <b>forward secrecy</b>: stealing the server's private key later does not decrypt recorded past sessions. TLS 1.3 also supports 0-RTT resumption, which lets returning clients send data immediately at the cost of possible replay, so servers should only accept idempotent requests in 0-RTT.</p>
<h4>What defenders can still see</h4>
<p>Encryption hides content but not everything. Without decryption, network sensors can still observe the destination IP and port, the SNI hostname (unless Encrypted Client Hello, ECH, is in use, which is now supported by major browsers and some CDNs), the timing and size of flows, and fingerprints of the ClientHello such as JA3 or the newer JA4 family. A JA4 fingerprint that matches a known malware family, or an SNI of a freshly registered domain, can be enough to escalate an alert. Organizations that need content visibility deploy TLS inspection at a proxy, which re-signs certificates with an internal CA; this brings privacy, legal and certificate-pinning complications that must be governed carefully.</p>

<h3>7. The HTTP request and the response</h3>
<p>Inside the TLS tunnel the browser finally sends its request:</p>
<pre><code>GET / HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...
Accept: text/html
Cookie: session=8f2c...</code></pre>
<p>The server replies with a status code (200 OK, 301 redirect, 404 not found, 500 server error), headers and a body. Proxy and web server logs record the method, URL, status, bytes, user agent and referrer, which is the evidence you will use to answer questions like "did the user actually download the payload?" (look for a 200 with a large byte count) or "is this web shell being used?" (look for POST requests to an unusual script).</p>

<h3>8. Putting it together: a worked trace</h3>
<p>Here is how one page load might appear across different log sources in a SOC:</p>
<table>
<thead><tr><th>Time</th><th>Source</th><th>Event</th></tr></thead>
<tbody>
<tr><td>09:14:02.101</td><td>DNS resolver log</td><td>Client 10.20.4.17 queried A www.example.com, answer 93.184.215.14, TTL 300</td></tr>
<tr><td>09:14:02.140</td><td>Firewall</td><td>Allow TCP 10.20.4.17:51544 to 93.184.215.14:443 (SYN)</td></tr>
<tr><td>09:14:02.190</td><td>NDR / Zeek ssl.log</td><td>TLSv1.3, SNI www.example.com, cert issuer valid public CA, JA4 matches Chrome</td></tr>
<tr><td>09:14:02.260</td><td>Web proxy</td><td>GET https://www.example.com/ 200 1,256 bytes, user jdoe</td></tr>
<tr><td>09:14:07.900</td><td>Firewall</td><td>Session closed, 4.1 KB out, 38 KB in, duration 5.7 s</td></tr>
</tbody>
</table>
<p>Now imagine the same trace with a domain registered yesterday, a self-signed certificate, a JA4 that matches no browser in your fleet, and a connection that repeats every 60 seconds with identical byte counts. Nothing in that list required decrypting a single packet, yet together it is a strong indicator of command-and-control beaconing. That is why fundamentals matter.</p>

<h3>9. Common attacks mapped to layers</h3>
<table>
<thead><tr><th>Layer</th><th>Attack</th><th>Primary defense</th></tr></thead>
<tbody>
<tr><td>Link</td><td>ARP spoofing, MAC flooding, rogue Wi-Fi access points</td><td>Dynamic ARP Inspection, port security, 802.1X, WPA3</td></tr>
<tr><td>Network</td><td>IP spoofing, BGP hijacking, ICMP tunneling</td><td>Ingress/egress filtering (BCP 38), RPKI, ICMP rate limiting</td></tr>
<tr><td>Transport</td><td>SYN floods, port scanning, session hijacking</td><td>SYN cookies, firewalls, IDS, randomized sequence numbers</td></tr>
<tr><td>Application</td><td>DNS poisoning and tunneling, phishing sites, web exploits</td><td>DNSSEC, protective DNS, TLS, WAF, secure coding</td></tr>
</tbody>
</table>

<h3>Key takeaways</h3>
<ul>
<li>Data is encapsulated layer by layer; different security tools see different layers, so correlate firewall, DNS, proxy and endpoint logs to get the full picture.</li>
<li>DNS resolution walks from cache to recursive resolver to root, TLD and authoritative servers. DNS logs are one of the highest-value, lowest-cost data sources a SOC can collect.</li>
<li>The TCP three-way handshake (SYN, SYN-ACK, ACK) underlies most connections; incomplete handshakes reveal scans and floods.</li>
<li>TLS 1.3 completes in one round trip, mandates forward secrecy and removes legacy algorithms; post-quantum hybrid key exchange is already rolling out in browsers.</li>
<li>Encryption hides payloads, but metadata such as SNI, certificates, JA4 fingerprints, timing and volume still powers effective detection.</li>
<li>Many protocols (ARP, BGP, classic DNS, UDP) were built on trust. Knowing where trust is assumed tells you where attackers will strike.</li>
</ul>
`,
  references: [
    { title: "RFC 8446 — The Transport Layer Security (TLS) Protocol Version 1.3", url: "https://www.rfc-editor.org/rfc/rfc8446" },
    { title: "RFC 9293 — Transmission Control Protocol (TCP)", url: "https://www.rfc-editor.org/rfc/rfc9293" },
    { title: "RFC 1034 — Domain Names: Concepts and Facilities", url: "https://www.rfc-editor.org/rfc/rfc1034" },
    { title: "RFC 1035 — Domain Names: Implementation and Specification", url: "https://www.rfc-editor.org/rfc/rfc1035" },
    { title: "RFC 9000 — QUIC: A UDP-Based Multiplexed and Secure Transport", url: "https://www.rfc-editor.org/rfc/rfc9000" }
  ]
});

CP.papers.push({
  id: "paper-linux-for-defenders",
  title: "Linux for Defenders: Logs, Permissions, Persistence and Triage",
  module: "p0-m3",
  minutes: 18,
  summary: "Why Linux literacy is non-negotiable for analysts, and a practical guide to the file system, users and permissions, logging, common persistence mechanisms and a repeatable live-triage workflow.",
  html: `
<p>Most of the internet runs on Linux. Web servers, cloud workloads, containers, network appliances, firewalls, and the very security tools you will use in a SOC (Zeek, Suricata, many SIEM collectors, most forensic distributions) are Linux-based. Attackers know this: cryptominers, botnets, ransomware variants for VMware ESXi and Linux, and web shells on compromised servers are everyday findings. A defender who can only work in a Windows GUI is missing half the battlefield. This paper focuses on the Linux knowledge that matters most when you are defending systems rather than administering them.</p>

<h3>1. The file system as evidence</h3>
<p>Linux follows the Filesystem Hierarchy Standard. Knowing what normally lives where tells you what is out of place.</p>
<table>
<thead><tr><th>Path</th><th>Contents</th><th>Why a defender cares</th></tr></thead>
<tbody>
<tr><td><code>/etc</code></td><td>System configuration</td><td>Users (<code>passwd</code>, <code>shadow</code>, <code>group</code>), <code>sudoers</code>, SSH config, cron, services</td></tr>
<tr><td><code>/var/log</code></td><td>Log files</td><td>Authentication, system and application history</td></tr>
<tr><td><code>/home/&lt;user&gt;</code>, <code>/root</code></td><td>User home directories</td><td>Shell history, <code>.ssh/authorized_keys</code>, dotfile persistence</td></tr>
<tr><td><code>/tmp</code>, <code>/var/tmp</code>, <code>/dev/shm</code></td><td>Temporary, world-writable storage</td><td>Favorite drop zones for malware and staged tools</td></tr>
<tr><td><code>/bin</code>, <code>/usr/bin</code>, <code>/sbin</code></td><td>Executables</td><td>Trojanized binaries replacing <code>ls</code>, <code>ps</code> or <code>sshd</code></td></tr>
<tr><td><code>/proc</code></td><td>Virtual view of running processes and kernel</td><td>Live process details even when the binary was deleted</td></tr>
<tr><td><code>/etc/systemd/system</code>, <code>/lib/systemd/system</code></td><td>Service unit files</td><td>Malicious services for persistence</td></tr>
</tbody>
</table>
<p>A core idea is that in Linux "everything is a file." Processes appear as directories under <code>/proc/&lt;PID&gt;</code>; <code>/proc/&lt;PID&gt;/exe</code> is a link to the running binary and <code>/proc/&lt;PID&gt;/cmdline</code> holds its arguments. If malware deletes its own executable after launch, <code>ls -l /proc/&lt;PID&gt;/exe</code> will show <code>(deleted)</code>, and you can still copy the binary out of <code>/proc</code> for analysis. That single trick has saved many investigations.</p>

<h3>2. Users, groups and permissions</h3>
<p>Every file has an owner, a group and three sets of permission bits: read (r=4), write (w=2) and execute (x=1) for the owner, the group and everyone else.</p>
<pre><code>$ ls -l /usr/bin/passwd /etc/shadow /tmp/.x
-rwsr-xr-x 1 root root   68208 Mar 14 2025 /usr/bin/passwd
-rw-r----- 1 root shadow  1342 Oct  2 08:11 /etc/shadow
-rwxrwxrwx 1 www-data www-data 912384 Oct 19 02:47 /tmp/.x</code></pre>
<p>Reading that output like an analyst:</p>
<ul>
<li><code>/usr/bin/passwd</code> has the <b>SUID</b> bit (the <code>s</code> in the owner execute position), so it runs with the owner's (root's) privileges. That is legitimate here, but an unexpected SUID binary is a classic privilege-escalation backdoor. Hunt for them with <code>find / -perm -4000 -type f 2&gt;/dev/null</code> and compare against a known-good baseline.</li>
<li><code>/etc/shadow</code> stores password hashes and should be readable only by root and the shadow group. World-readable shadow files are a critical finding.</li>
<li><code>/tmp/.x</code> is a hidden (leading dot), world-writable, executable, recently created ~900 KB file owned by the web server account. On a web server that pattern strongly suggests a dropped payload following a web exploit.</li>
</ul>
<p>Account files deserve regular scrutiny. In <code>/etc/passwd</code>, any account other than root with UID 0 is effectively root and almost always malicious. Service accounts such as <code>www-data</code> should have a non-interactive shell like <code>/usr/sbin/nologin</code>; one that suddenly has <code>/bin/bash</code> is suspicious. In <code>/etc/sudoers</code> and <code>/etc/sudoers.d/</code>, watch for entries granting <code>NOPASSWD: ALL</code>.</p>
<div class="callout tip"><p>The principle of least privilege on Linux means: services run as dedicated unprivileged users, administrators use <code>sudo</code> for individual commands rather than logging in as root, SSH root login is disabled (<code>PermitRootLogin no</code>), and key-based authentication replaces passwords.</p></div>

<h3>3. Where the logs are</h3>
<p>Linux logging comes from two broad systems: the traditional syslog family (rsyslog, syslog-ng) writing text files under <code>/var/log</code>, and the systemd journal, a binary log queried with <code>journalctl</code>. Most modern distributions run both, though some newer releases default to journal-only.</p>
<table>
<thead><tr><th>Log</th><th>Distribution family</th><th>Contains</th></tr></thead>
<tbody>
<tr><td><code>/var/log/auth.log</code></td><td>Debian, Ubuntu</td><td>SSH logins, sudo, su, PAM authentication</td></tr>
<tr><td><code>/var/log/secure</code></td><td>RHEL, Fedora, Rocky, Alma</td><td>Same as auth.log</td></tr>
<tr><td><code>/var/log/syslog</code> or <code>/var/log/messages</code></td><td>Debian / RHEL</td><td>General system messages</td></tr>
<tr><td><code>/var/log/wtmp</code>, <code>btmp</code>, <code>lastlog</code></td><td>All</td><td>Binary records of logins, failed logins and last login (read with <code>last</code>, <code>lastb</code>, <code>lastlog</code>)</td></tr>
<tr><td><code>/var/log/audit/audit.log</code></td><td>Where auditd is installed</td><td>Kernel audit events: syscalls, file watches, executions</td></tr>
<tr><td><code>/var/log/apache2/</code>, <code>/var/log/nginx/</code></td><td>Web servers</td><td>Access and error logs, essential for web attacks</td></tr>
</tbody>
</table>
<p>Typical triage commands:</p>
<pre><code># Failed SSH password attempts, top source IPs
grep "Failed password" /var/log/auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -rn | head

# Successful logins
grep "Accepted" /var/log/auth.log

# Everything sshd logged in the last two hours
journalctl -u ssh --since "2 hours ago"

# Who used sudo and for what
grep "sudo:" /var/log/auth.log | grep COMMAND</code></pre>
<p>Note that the SSH unit is called <code>ssh</code> on Debian-family systems and <code>sshd</code> on RHEL-family systems. A brute-force pattern looks like hundreds of "Failed password" lines from one IP; the critical question is always whether any "Accepted" line from that same IP follows.</p>
<div class="callout warn"><p>Local logs can be edited or wiped by an attacker with root. Gaps in timestamps, truncated files, or a cleared <code>.bash_history</code> symlinked to <code>/dev/null</code> are themselves indicators. This is why production systems should forward logs in near real time to a SIEM the attacker cannot reach.</p></div>
<h4>auditd: the Linux equivalent of detailed process auditing</h4>
<p>The Linux Audit framework can record every program execution, changes to sensitive files and use of privileged syscalls. Two example rules:</p>
<pre><code>-w /etc/passwd -p wa -k identity
-a always,exit -F arch=b64 -S execve -k exec</code></pre>
<p>The first watches writes and attribute changes to <code>/etc/passwd</code>; the second logs every 64-bit program execution. Execution logging is noisy but extremely valuable, and many EDR agents for Linux now use eBPF to collect similar telemetry with less overhead.</p>

<h3>4. Processes and network connections</h3>
<p>During live response you need to answer "what is running and who is it talking to?"</p>
<pre><code>ps auxf                     # full process tree with users and arguments
ps -eo pid,ppid,user,lstart,cmd --sort=lstart | tail -20   # newest processes
ss -tulpn                   # listening TCP/UDP sockets and owning processes
ss -tpn state established   # active connections
lsof -p 4242                # files and sockets opened by PID 4242
ls -l /proc/4242/exe; cat /proc/4242/cmdline | tr '\\0' ' '</code></pre>
<p>Red flags include a process named like a kernel thread (in brackets, such as <code>[kworker/0:1]</code>) but with a real executable path and a parent other than <code>kthreadd</code>; a web server process (<code>apache2</code>, <code>nginx</code>, <code>php-fpm</code>) spawning a shell such as <code>/bin/sh -c</code> followed by <code>curl</code> or <code>wget</code>; processes running from <code>/tmp</code> or <code>/dev/shm</code>; and sustained high CPU from an unknown binary connecting to port 3333 or 4444, which is typical of cryptomining pools.</p>

<h3>5. Persistence: how attackers stay</h3>
<p>After initial access, adversaries want to survive reboots and password changes. MITRE ATT&amp;CK catalogs these techniques; the Linux favorites are below.</p>
<table>
<thead><tr><th>Mechanism</th><th>Where to look</th><th>ATT&amp;CK</th></tr></thead>
<tbody>
<tr><td>Cron jobs</td><td><code>/etc/crontab</code>, <code>/etc/cron.*</code>, <code>/var/spool/cron/</code>, <code>crontab -l -u &lt;user&gt;</code></td><td>T1053.003</td></tr>
<tr><td>systemd services and timers</td><td><code>/etc/systemd/system/</code>, <code>~/.config/systemd/user/</code>, <code>systemctl list-timers</code></td><td>T1543.002</td></tr>
<tr><td>SSH authorized keys</td><td><code>~/.ssh/authorized_keys</code> for every user, including root</td><td>T1098.004</td></tr>
<tr><td>Shell startup files</td><td><code>~/.bashrc</code>, <code>~/.profile</code>, <code>/etc/profile.d/</code></td><td>T1546.004</td></tr>
<tr><td>New or modified accounts</td><td><code>/etc/passwd</code>, <code>/etc/shadow</code>, <code>/etc/sudoers.d/</code></td><td>T1136.001</td></tr>
<tr><td>Dynamic linker hijacking</td><td><code>/etc/ld.so.preload</code>, <code>LD_PRELOAD</code> variables</td><td>T1574.006</td></tr>
<tr><td>Web shells</td><td>Web roots such as <code>/var/www/</code>; recently modified <code>.php</code>, <code>.jsp</code> files</td><td>T1505.003</td></tr>
</tbody>
</table>
<p>A useful hunting command finds files changed recently in places they rarely change:</p>
<pre><code>find /etc /var/www /usr/bin /usr/sbin -type f -mtime -3 -ls 2&gt;/dev/null
cat /etc/ld.so.preload 2&gt;/dev/null      # normally absent or empty</code></pre>
<p>Remember that timestamps can be forged with <code>touch</code>, so treat modification times as leads rather than proof. The inode change time (ctime, visible with <code>stat</code>) is harder to fake without changing the system clock.</p>

<h3>6. A repeatable live-triage workflow</h3>
<p>When an alert fires on a Linux server, follow the order of volatility (the most short-lived evidence first), document every command you run, and avoid changing the system more than necessary:</p>
<ol>
<li><b>Record context.</b> Hostname, IP, current time and timezone (<code>date -u</code>, <code>timedatectl</code>), uptime, who is logged in (<code>w</code>).</li>
<li><b>Capture volatile state.</b> Processes (<code>ps auxf</code>), network connections (<code>ss -tupan</code>), open files (<code>lsof</code>), loaded kernel modules (<code>lsmod</code>). If memory acquisition is in scope, use a tool such as AVML or LiME before anything else.</li>
<li><b>Review authentication.</b> <code>last</code>, <code>lastb</code>, auth logs and the journal for the alert window.</li>
<li><b>Check persistence.</b> Cron, systemd, authorized_keys, shell profiles, accounts, ld.so.preload.</li>
<li><b>Hunt for artifacts.</b> Recent files in temporary and web directories, unexpected SUID binaries, hidden directories.</li>
<li><b>Verify binaries.</b> On Debian-family systems <code>debsums -c</code>, on RPM systems <code>rpm -Va</code>, to detect modified package files. A tampered <code>ps</code> or <code>netstat</code> means you should use statically compiled trusted tools instead.</li>
<li><b>Preserve and escalate.</b> Hash and copy suspicious files (<code>sha256sum</code>), export logs, and hand off according to your incident response plan.</li>
</ol>
<div class="callout real"><p>On the job you will often triage through an EDR console or a SIEM rather than an interactive shell, but the questions are identical. Knowing what <code>auth.log</code> and <code>ps auxf</code> would show makes you far faster at reading the same data in any tool.</p></div>

<h3>7. Hardening essentials</h3>
<p>Defense starts before an incident. A short baseline that blocks a large share of real-world Linux compromises:</p>
<ul>
<li>Patch promptly using the package manager and enable automatic security updates where appropriate.</li>
<li>Disable SSH password authentication and root login; use keys, and consider MFA or certificate-based SSH for administrators.</li>
<li>Run only required services; check with <code>ss -tulpn</code> and disable the rest with <code>systemctl disable --now</code>.</li>
<li>Enforce mandatory access control with SELinux or AppArmor in enforcing mode rather than disabling it when something breaks.</li>
<li>Mount <code>/tmp</code> and <code>/dev/shm</code> with <code>noexec,nosuid,nodev</code> where workloads allow.</li>
<li>Forward logs off-host, enable auditd or an EDR sensor, and baseline normal so deviations are visible.</li>
<li>Apply a recognized hardening benchmark and scan for drift.</li>
</ul>

<h3>Key takeaways</h3>
<ul>
<li>Linux runs most servers, cloud workloads and security tooling, so analysts must be comfortable reading its files, logs and process data.</li>
<li>Permissions tell stories: unexpected SUID binaries, extra UID 0 accounts, world-writable executables and interactive shells on service accounts are high-value findings.</li>
<li>Authentication evidence lives in <code>auth.log</code> or <code>secure</code>, the binary <code>wtmp</code>/<code>btmp</code> files, and the systemd journal; forward it off-host because attackers with root can erase it.</li>
<li><code>/proc</code> lets you inspect and recover running processes, even when the binary has been deleted.</li>
<li>Check the common persistence locations every time: cron, systemd, authorized_keys, shell profiles, accounts, ld.so.preload and web roots.</li>
<li>Triage in order of volatility, document every command, and verify system binaries before trusting their output.</li>
</ul>
`,
  references: [
    { title: "MITRE ATT&CK — Scheduled Task/Job: Cron (T1053.003)", url: "https://attack.mitre.org/techniques/T1053/003/" },
    { title: "MITRE ATT&CK — Account Manipulation: SSH Authorized Keys (T1098.004)", url: "https://attack.mitre.org/techniques/T1098/004/" },
    { title: "MITRE ATT&CK — Server Software Component: Web Shell (T1505.003)", url: "https://attack.mitre.org/techniques/T1505/003/" },
    { title: "NIST SP 800-123 — Guide to General Server Security", url: "https://csrc.nist.gov/pubs/sp/800/123/final" },
    { title: "NIST SP 800-86 — Guide to Integrating Forensic Techniques into Incident Response", url: "https://csrc.nist.gov/pubs/sp/800/86/final" }
  ]
});

CP.papers.push({
  id: "paper-active-directory-attacks",
  title: "Active Directory Under Attack: Kerberos, NTLM and How to Defend Them",
  module: "p0-m4",
  minutes: 20,
  summary: "How Active Directory authentication works, how attackers abuse it with Kerberoasting, AS-REP roasting, pass-the-hash and forged tickets, and the layered defenses (tiering, Windows LAPS, Protected Users, monitoring) that stop them.",
  html: `
<p>Active Directory (AD) is the identity backbone of most enterprises. It decides who can log on, which servers trust which users, and who can administer what. That makes it the single most valuable target inside a corporate network: in ransomware intrusions, the path from one phished workstation to encrypting the whole estate almost always runs through AD. Defenders who understand how Kerberos and NTLM actually work can recognize these attacks in logs and, more importantly, design environments where they fail.</p>

<h3>1. The building blocks</h3>
<ul>
<li><b>Domain controllers (DCs)</b> host the directory database (<code>NTDS.dit</code>) and run the Kerberos Key Distribution Center (KDC). Whoever controls a DC controls the domain.</li>
<li><b>Accounts</b> include users, computers (every domain-joined machine has an account with its own password, rotated automatically), service accounts, and the special <code>krbtgt</code> account whose key signs every Kerberos ticket-granting ticket.</li>
<li><b>Groups</b> such as Domain Admins, Enterprise Admins and Administrators confer sweeping privileges. Membership in these groups should be tiny and closely monitored.</li>
<li><b>Group Policy Objects (GPOs)</b> push configuration to machines. Write access to a GPO linked to many machines is effectively code execution on all of them.</li>
<li><b>Service Principal Names (SPNs)</b> identify services (for example <code>MSSQLSvc/sql01.corp.local:1433</code>) and the account they run as. SPNs are central to Kerberoasting.</li>
</ul>

<h3>2. NTLM: the legacy challenge-response protocol</h3>
<p>NTLM authenticates without sending the password. The server sends a random challenge; the client computes a response using the <b>NT hash</b> of the password (an unsalted MD4 hash); the server, or a DC on its behalf, verifies it. The critical weakness is that the NT hash itself is the secret. Anyone who obtains the hash can compute valid responses without ever knowing the password. That is <b>pass-the-hash</b>.</p>
<p>NTLM has other problems: it does not authenticate the server to the client in its basic form, it is vulnerable to <b>relay attacks</b> (an attacker in the middle forwards a victim's authentication to another server), and captured NTLMv1/v2 exchanges can be cracked offline. Microsoft has formally deprecated NTLM and has been adding controls to audit and block it, with the stated direction of disabling it by default in future Windows releases. That transition is still evolving, so organizations should inventory NTLM use now (the "NTLM Operational" event log and Event ID 4776 on DCs help) rather than wait.</p>

<h3>3. Kerberos: tickets instead of passwords</h3>
<p>Kerberos is AD's default protocol. It relies on a trusted third party, the KDC, and on time-limited, encrypted <b>tickets</b>. The flow, simplified:</p>
<ol>
<li><b>AS-REQ / AS-REP (Authentication Service).</b> The user's machine sends a request with a timestamp encrypted with a key derived from the user's password (pre-authentication). The KDC verifies it and returns a <b>Ticket-Granting Ticket (TGT)</b> encrypted with the <code>krbtgt</code> account's key, plus a session key. Event ID <b>4768</b> on the DC.</li>
<li><b>TGS-REQ / TGS-REP (Ticket-Granting Service).</b> To access a service, the client presents the TGT and asks for a <b>service ticket</b> for an SPN. The KDC returns a ticket encrypted with the <b>service account's</b> key. Event ID <b>4769</b>.</li>
<li><b>AP-REQ.</b> The client presents the service ticket to the server, which decrypts it with its own key and reads the user's identity and group memberships from the Privilege Attribute Certificate (PAC) inside.</li>
</ol>
<p>Two design facts drive nearly every Kerberos attack. First, <b>any authenticated user can request a service ticket for any SPN</b>, and part of that ticket is encrypted with the service account's password-derived key. Second, <b>whoever holds the krbtgt key can forge TGTs</b>, and whoever holds a service account's key can forge service tickets for that service.</p>

<h3>4. The attack catalog</h3>
<h4>Kerberoasting (ATT&amp;CK T1558.003)</h4>
<p>An attacker with any domain user account enumerates accounts that have SPNs, requests service tickets for them, and takes the tickets offline to crack the service account's password. No special privileges are needed, and the KDC does nothing unusual, so the attack is quiet. It works best when service accounts are user accounts with weak, human-chosen passwords that never change, and when the ticket uses the older RC4 encryption type, which is much faster to crack than AES.</p>
<p><b>Detection:</b> Event 4769 with ticket encryption type <code>0x17</code> (RC4) where your environment normally uses AES (<code>0x11</code>/<code>0x12</code>); one account requesting tickets for many different SPNs in a short period; and honeypot SPN accounts that no legitimate process ever requests.</p>
<h4>AS-REP roasting (T1558.004)</h4>
<p>Accounts with the "Do not require Kerberos pre-authentication" flag will hand out an AS-REP containing material encrypted with the user's key to anyone who asks. Attackers crack it offline. The fix is simple: find and clear that flag (<code>Get-ADUser -Filter 'DoesNotRequirePreAuth -eq $true'</code>).</p>
<h4>Pass-the-hash (T1550.002) and pass-the-ticket (T1550.003)</h4>
<p>After gaining local administrator rights on one machine, attackers dump credentials from LSASS memory with tools such as Mimikatz. They then reuse NT hashes (pass-the-hash) or stolen Kerberos tickets (pass-the-ticket) to authenticate elsewhere. The most damaging scenario is a shared local administrator password: compromise one workstation and the same hash opens every workstation. A related technique, <b>overpass-the-hash</b>, uses an NT hash to request a legitimate Kerberos TGT.</p>
<p><b>Detection:</b> network logons (Event 4624, logon type 3) using NTLM from workstations to many other workstations; logon type 9 (NewCredentials) with the seclogo process; and EDR alerts for LSASS memory access.</p>
<h4>Golden ticket (T1558.001)</h4>
<p>With the <code>krbtgt</code> hash (usually obtained via DCSync or by stealing <code>NTDS.dit</code> from a DC), an attacker can forge a TGT for any user with any group memberships and a lifetime of their choosing. It is total, persistent domain compromise. Resetting regular passwords does nothing; the krbtgt password must be reset <b>twice</b> (because AD keeps the current and previous key), with enough time between resets for replication and ticket expiry.</p>
<h4>Silver ticket (T1558.002)</h4>
<p>With a service or computer account's key, an attacker forges service tickets for that one service without contacting the KDC at all, so there is no 4769 event on the DC. Silver tickets are narrower than golden tickets but stealthier. PAC validation and ticket-signature hardening Microsoft has introduced in recent years have made forged tickets harder to use undetected.</p>
<h4>DCSync (T1003.006)</h4>
<p>Accounts with the "Replicating Directory Changes" and "Replicating Directory Changes All" rights can ask a DC to replicate password data, exactly as another DC would. Attackers with Domain Admin or a misdelegated account use this to pull every hash, including krbtgt. <b>Detection:</b> Event 4662 with the replication GUIDs from a source that is not a domain controller, or network detection of DRSUAPI replication requests from non-DC IPs.</p>
<h4>Other paths worth knowing</h4>
<ul>
<li><b>Delegation abuse:</b> unconstrained delegation lets a server impersonate any user who connects to it; constrained and resource-based constrained delegation can be misconfigured into escalation paths.</li>
<li><b>AD Certificate Services (AD CS) abuse:</b> misconfigured certificate templates (the "ESC" family of issues) can let a normal user enroll for a certificate that authenticates as a Domain Admin.</li>
<li><b>ACL abuse:</b> permissions such as GenericAll or WriteDACL on privileged objects create hidden paths, the kind graph tools like BloodHound visualize for both attackers and defenders.</li>
</ul>

<h3>5. A typical intrusion path</h3>
<table>
<thead><tr><th>Stage</th><th>Attacker action</th><th>Evidence you might see</th></tr></thead>
<tbody>
<tr><td>Initial access</td><td>Phishing payload runs on a workstation</td><td>EDR process alert, proxy log to new domain</td></tr>
<tr><td>Discovery</td><td>Enumerates users, groups, SPNs, ACLs via LDAP</td><td>Bursts of LDAP queries from a workstation</td></tr>
<tr><td>Credential access</td><td>Kerberoasts a SQL service account; dumps LSASS</td><td>4769 RC4 burst; LSASS access alert</td></tr>
<tr><td>Lateral movement</td><td>Pass-the-hash with shared local admin password</td><td>4624 type 3 NTLM logons across many hosts</td></tr>
<tr><td>Privilege escalation</td><td>Finds a Domain Admin session on a server and steals its token</td><td>Admin account logging on to a non-admin tier</td></tr>
<tr><td>Domain dominance</td><td>DCSync, golden ticket</td><td>4662 replication from non-DC; TGTs with abnormal lifetimes</td></tr>
<tr><td>Impact</td><td>GPO pushes ransomware to all hosts</td><td>GPO modification events (5136), mass service creation</td></tr>
</tbody>
</table>

<h3>6. Defenses that actually work</h3>
<h4>Administrative tiering</h4>
<p>The most important architectural control is preventing highly privileged credentials from ever touching machines where they can be stolen. Microsoft's classic three-tier model, now evolved into the Enterprise Access Model, separates Tier 0 (DCs, AD CS, identity systems and the accounts that manage them), Tier 1 (servers and applications) and Tier 2 (workstations and user devices). Administrators have separate accounts per tier, Tier 0 accounts log on only to Tier 0 systems from Privileged Access Workstations, and logon restrictions (GPO "Deny log on" rights or authentication policies and silos) enforce it. If a Domain Admin never logs on to a workstation, there is no Domain Admin hash in that workstation's memory to steal.</p>
<h4>Windows LAPS</h4>
<p>The Local Administrator Password Solution gives every machine a unique, randomly generated, regularly rotated local administrator password, stored in AD (or Microsoft Entra ID) with access controlled by ACLs. Windows LAPS has been built into supported Windows versions since April 2023, replacing the older downloadable "legacy LAPS," and adds password encryption and history. It kills the shared-local-admin pass-the-hash path almost single-handedly.</p>
<h4>The Protected Users group</h4>
<p>Adding privileged human accounts to the Protected Users security group applies non-configurable protections: members cannot authenticate with NTLM, Kerberos will not use DES or RC4 for pre-authentication, credentials are not cached for offline logon, accounts cannot be delegated, and TGTs are limited to a four-hour lifetime by default. Test before broad rollout, because applications that depend on NTLM will break for those users, and do not add service or computer accounts.</p>
<h4>Service account hygiene</h4>
<ul>
<li>Use <b>group Managed Service Accounts (gMSAs)</b> or delegated Managed Service Accounts, whose long random passwords are rotated automatically and are effectively uncrackable by Kerberoasting.</li>
<li>Where a user-style service account must exist, give it a long random password (25+ characters), enforce AES-only encryption types, and remove unused SPNs.</li>
<li>Phase out RC4. Microsoft has announced changes to retire RC4 as a Kerberos default; check current guidance for your Windows Server versions, as this is actively changing.</li>
</ul>
<h4>Credential protection on endpoints</h4>
<p>Enable <b>Credential Guard</b> (virtualization-based isolation of secrets, now on by default on many qualifying Windows 11 systems), run LSASS as a protected process (RunAsPPL), enable Attack Surface Reduction rules that block credential stealing from LSASS, and disable WDigest. Require SMB signing and LDAP signing and channel binding to defeat NTLM relay.</p>
<h4>Monitoring</h4>
<table>
<thead><tr><th>Event ID</th><th>Meaning</th><th>Use</th></tr></thead>
<tbody>
<tr><td>4768</td><td>TGT requested</td><td>Baseline; failures and unusual encryption types</td></tr>
<tr><td>4769</td><td>Service ticket requested</td><td>Kerberoasting (RC4, many SPNs, honeypot SPN)</td></tr>
<tr><td>4771</td><td>Kerberos pre-authentication failed</td><td>Password spraying</td></tr>
<tr><td>4776</td><td>NTLM credential validation</td><td>NTLM inventory and spraying</td></tr>
<tr><td>4624 / 4625</td><td>Logon success / failure</td><td>Logon type 3 lateral movement, type 10 RDP</td></tr>
<tr><td>4662</td><td>Operation on a directory object</td><td>DCSync from non-DC sources</td></tr>
<tr><td>4728 / 4732 / 4756</td><td>Member added to a security-enabled group</td><td>Privileged group changes</td></tr>
<tr><td>5136</td><td>Directory object modified</td><td>GPO and ACL tampering</td></tr>
</tbody>
</table>
<div class="callout real"><p>Many organizations also run identity-specific detection (for example Microsoft Defender for Identity or comparable products) on DCs. These tools detect Kerberoasting, DCSync and golden-ticket anomalies out of the box, but an analyst still needs the protocol knowledge above to judge whether an alert is real.</p></div>
<h4>Recovery readiness</h4>
<p>Keep offline, tested backups of at least one DC per domain and a documented forest-recovery plan. After any suspected Tier 0 compromise, assume the attacker holds krbtgt and plan the double reset, rotation of all privileged credentials, and review of persistence such as rogue certificates, new trusts and modified AdminSDHolder permissions.</p>

<h3>Key takeaways</h3>
<ul>
<li>NTLM's NT hash is password-equivalent, enabling pass-the-hash and relay; NTLM is deprecated and should be inventoried and reduced now.</li>
<li>Kerberos attacks exploit two facts: any user can request service tickets encrypted with service account keys, and the krbtgt key can forge any TGT.</li>
<li>Kerberoasting and AS-REP roasting are offline cracking attacks; long random or managed service account passwords and AES-only encryption defeat them.</li>
<li>Golden tickets require a double krbtgt reset to remediate; silver tickets bypass the DC entirely.</li>
<li>Tiering keeps privileged credentials off exposed machines; Windows LAPS removes shared local admin passwords; Protected Users strips NTLM, RC4, delegation and caching from privileged accounts.</li>
<li>Know the key DC event IDs (4768, 4769, 4771, 4776, 4624, 4662, 5136) and what abnormal looks like in each.</li>
</ul>
`,
  references: [
    { title: "MITRE ATT&CK — Steal or Forge Kerberos Tickets: Kerberoasting (T1558.003)", url: "https://attack.mitre.org/techniques/T1558/003/" },
    { title: "MITRE ATT&CK — Use Alternate Authentication Material: Pass the Hash (T1550.002)", url: "https://attack.mitre.org/techniques/T1550/002/" },
    { title: "MITRE ATT&CK — Steal or Forge Kerberos Tickets: Golden Ticket (T1558.001)", url: "https://attack.mitre.org/techniques/T1558/001/" },
    { title: "MITRE ATT&CK — OS Credential Dumping: DCSync (T1003.006)", url: "https://attack.mitre.org/techniques/T1003/006/" },
    { title: "RFC 4120 — The Kerberos Network Authentication Service (V5)", url: "https://www.rfc-editor.org/rfc/rfc4120" }
  ]
});

CP.papers.push({
  id: "paper-security-plus-roadmap",
  title: "The Security+ SY0-701 Roadmap: What It Covers and How to Pass",
  module: "p1-m1",
  minutes: 16,
  summary: "A domain-by-domain map of CompTIA Security+ SY0-701, how performance-based questions work, how the exam fits into a SOC career, and a practical eight-to-ten-week study plan.",
  html: `
<p>CompTIA Security+ is the most common first security certification in the world, and for good reason. It is vendor-neutral, it is recognized by employers and by the U.S. Department of Defense for many information assurance roles (under the DoD 8140 workforce framework), and it gives you a shared vocabulary that every later step in this curriculum builds on. It is not, by itself, proof that you can do the job, but it opens doors to interviews where you can prove that. This paper explains what the current version, SY0-701, covers, how the exam is delivered, and how to prepare efficiently.</p>

<h3>1. Exam facts at a glance</h3>
<table>
<thead><tr><th>Item</th><th>Detail</th></tr></thead>
<tbody>
<tr><td>Exam code</td><td>SY0-701 (launched November 2023)</td></tr>
<tr><td>Questions</td><td>Maximum of 90, a mix of multiple choice and performance-based questions (PBQs)</td></tr>
<tr><td>Time</td><td>90 minutes</td></tr>
<tr><td>Passing score</td><td>750 on a scale of 100 to 900</td></tr>
<tr><td>Recommended experience</td><td>CompTIA suggests Network+ and about two years of IT administration with a security focus; neither is required</td></tr>
<tr><td>Delivery</td><td>Pearson VUE test centers or online proctored</td></tr>
<tr><td>Renewal</td><td>Valid for three years; renew with 50 continuing education units (CEUs), a higher-level certification, or CompTIA's CertMaster CE course</td></tr>
</tbody>
</table>
<div class="callout warn"><p>CompTIA typically refreshes Security+ roughly every three years. As of late 2026 SY0-701 is the current exam, but a successor version is expected and CompTIA publishes retirement dates well in advance. Check the official exam page before you book, and if you are close to a transition, pick the version whose study materials are mature and finish before its retirement date.</p></div>

<h3>2. The five domains</h3>
<p>SY0-701 reorganized the material into five domains. The weighting tells you where to spend time.</p>
<table>
<thead><tr><th>Domain</th><th>Weight</th><th>Core content</th></tr></thead>
<tbody>
<tr><td>1.0 General Security Concepts</td><td>12%</td><td>Control categories and types, CIA triad, AAA, zero trust concepts, physical security, deception, change management, cryptography and PKI fundamentals</td></tr>
<tr><td>2.0 Threats, Vulnerabilities, and Mitigations</td><td>22%</td><td>Threat actors and motivations, threat vectors and attack surfaces, vulnerability types, indicators of malicious activity, mitigation techniques</td></tr>
<tr><td>3.0 Security Architecture</td><td>18%</td><td>Architecture models (cloud, IaC, serverless, microservices, ICS/OT, IoT), secure enterprise infrastructure, data protection, resilience and recovery</td></tr>
<tr><td>4.0 Security Operations</td><td>28%</td><td>Hardening, asset management, vulnerability management, monitoring and alerting, enterprise security tools, IAM, automation and orchestration, incident response, investigation data sources</td></tr>
<tr><td>5.0 Security Program Management and Oversight</td><td>20%</td><td>Governance, risk management, third-party risk, compliance, audits and assessments, security awareness</td></tr>
</tbody>
</table>
<p>Two observations matter for a future SOC analyst. First, Security Operations is the heaviest domain at 28%, and it is exactly the work you are training for: alerts, logs, vulnerability scans and incident response. Second, Program Management and Oversight at 20% is larger than many candidates expect. Governance, risk and compliance questions are often where technically strong candidates lose points, so do not skip them.</p>

<h3>3. What each domain really asks of you</h3>
<h4>Domain 1: General Security Concepts</h4>
<p>Expect to classify controls along two axes: <b>category</b> (technical, managerial, operational, physical) and <b>type</b> (preventive, deterrent, detective, corrective, compensating, directive). A typical question: "A company posts signs warning that the area is under video surveillance. Which control type is this?" (Deterrent, and the category is physical.) You will also need the zero trust vocabulary (policy engine, policy administrator, policy enforcement point, control plane and data plane), change management concepts, and introductory cryptography: symmetric versus asymmetric, hashing, salting, digital signatures, certificates and key escrow.</p>
<h4>Domain 2: Threats, Vulnerabilities, and Mitigations</h4>
<p>This domain is about recognizing attacks. Know threat actor types (nation-state, unskilled attacker, hacktivist, insider, organized crime, shadow IT) and their motivations. Be able to identify an attack from a description or a log snippet: SQL injection (<code>' OR 1=1--</code>), cross-site scripting, buffer overflows, privilege escalation, password spraying versus brute force, on-path attacks, DNS attacks, ransomware, and social engineering variants such as pretexting, smishing, vishing and business email compromise. Mitigations include segmentation, access control, application allow listing, isolation, patching, encryption, monitoring, least privilege and hardening.</p>
<h4>Domain 3: Security Architecture</h4>
<p>Here you compare architectures and their security implications. Know the shared responsibility model for IaaS, PaaS and SaaS; infrastructure as code; why ICS/SCADA and embedded systems are hard to patch; network appliance placement (jump servers, proxies, IPS/IDS, load balancers, sensors); port security and 802.1X; firewall types including WAF, UTM and NGFW; VPNs and SASE/SD-WAN. Data protection covers data states (at rest, in transit, in use), classification, sovereignty, and methods such as encryption, hashing, masking, tokenization and obfuscation. Resilience covers high availability, site types (hot, warm, cold), backups, and power.</p>
<h4>Domain 4: Security Operations</h4>
<p>The largest domain. You should be able to choose the right tool or process for a situation: secure baselines and hardening for workstations, servers, mobile devices and cloud; MDM deployment models (BYOD, COPE, CYOD); asset lifecycle and secure disposal; vulnerability scanning, penetration testing, CVSS and CVE; SIEM, SOAR, DLP, EDR/XDR, NetFlow and SNMP; email security (SPF, DKIM, DMARC); identity concepts (SSO, federation, SAML, OAuth, MFA, privileged access management); and the incident response process with its phases, tabletop exercises, root cause analysis, threat hunting and digital forensics concepts such as legal hold, chain of custody and order of volatility.</p>
<h4>Domain 5: Security Program Management and Oversight</h4>
<p>Policies, standards, procedures and guidelines and how they differ; roles such as data owner, controller, processor and custodian; risk management terms (risk register, risk appetite and tolerance, SLE, ARO, ALE, risk transfer, acceptance, avoidance, mitigation); business impact analysis (RTO, RPO, MTTR, MTBF); vendor assessment and agreement types (SLA, MOU, MSA, SOW, NDA, BPA); compliance consequences; audit types; and security awareness programs including phishing simulations.</p>
<div class="callout exam"><p>Memorize the quantitative risk formulas: <b>SLE = Asset Value x Exposure Factor</b>, and <b>ALE = SLE x ARO</b>. Example: a $200,000 server with a 25% exposure factor gives an SLE of $50,000; if the event is expected once every two years (ARO 0.5), the ALE is $25,000. A control costing more than $25,000 per year to stop that one risk is hard to justify.</p></div>

<h3>4. Performance-based questions</h3>
<p>PBQs are interactive tasks that usually appear at the start of the exam. Formats include drag-and-drop matching (attack to mitigation), configuring firewall rules in a table, identifying malicious entries in a log, placing devices on a network diagram, or selecting the right certificate type. They are worth more than standard questions and take longer.</p>
<p>Proven tactics:</p>
<ul>
<li><b>Flag and skip.</b> If a PBQ looks lengthy, flag it, answer the multiple choice questions first, and return with your remaining time. Many candidates fail because they spend 25 minutes on the first PBQ.</li>
<li><b>Partial credit is generally believed to be possible</b>, so complete every part you can rather than leaving the whole task blank.</li>
<li><b>Practice the shapes.</b> Write firewall rules in order (rules are processed top to bottom, with an implicit deny at the end), read log extracts to spot brute force or injection strings, and match attacks to controls until it is automatic.</li>
</ul>

<h3>5. A realistic study plan</h3>
<p>For someone who has worked through the foundations phase of this curriculum (networking, Linux, Windows), eight to ten weeks at 8 to 10 hours per week is realistic. Adjust to your pace.</p>
<table>
<thead><tr><th>Week</th><th>Focus</th><th>Activities</th></tr></thead>
<tbody>
<tr><td>1</td><td>Orientation and Domain 1</td><td>Download the official exam objectives; read them end to end; study control types and the CIA triad; start a flashcard deck</td></tr>
<tr><td>2–3</td><td>Domain 2</td><td>Attack types, threat actors and indicators; practice identifying attacks from log lines and short scenarios</td></tr>
<tr><td>4</td><td>Domain 3</td><td>Cloud models, network architecture, data protection, resilience; draw a secure network diagram from memory</td></tr>
<tr><td>5–6</td><td>Domain 4</td><td>Tools, IAM, vulnerability management, incident response; do the hands-on labs in this phase</td></tr>
<tr><td>7</td><td>Domain 5</td><td>Governance, risk calculations, agreements, compliance; practice ALE and BIA questions</td></tr>
<tr><td>8</td><td>Practice exams</td><td>Take two full timed practice exams; review every wrong answer and the reason each distractor was wrong</td></tr>
<tr><td>9–10</td><td>Gap closing and booking</td><td>Revisit weak objectives; book the exam once you score consistently above about 85% on reputable practice tests</td></tr>
</tbody>
</table>
<h4>Study techniques that work</h4>
<ul>
<li><b>Use the objectives as your checklist.</b> Every exam question maps to a bullet in the official objectives. If you can explain every bullet in plain language, you are ready.</li>
<li><b>Active recall and spaced repetition.</b> Flashcards reviewed on a spaced schedule beat re-reading notes. This platform's flashcards are organized by module for exactly this reason.</li>
<li><b>Hands-on reinforcement.</b> Configure a firewall rule, run a vulnerability scan against a lab VM, read a real SIEM alert. Concepts stick far better when you have touched them.</li>
<li><b>Explain the distractors.</b> For each practice question, articulate why each wrong answer is wrong. CompTIA writes plausible distractors, and this habit is what turns 70% into 85%.</li>
<li><b>Read the question twice.</b> Words like BEST, MOST, FIRST and LEAST change the answer. Two options may both be true; only one is best for the scenario described.</li>
</ul>

<h3>6. Exam-day strategy</h3>
<ol>
<li>Arrive (or log in) early; online proctoring requires a clear desk, a webcam room scan and a stable connection.</li>
<li>Skim the PBQs; do any short ones; flag long ones.</li>
<li>Work through the multiple choice at roughly one minute per question, flagging uncertain items rather than agonizing.</li>
<li>Return to PBQs with your banked time, then to flagged questions.</li>
<li>Never leave a question blank; there is no penalty for guessing.</li>
</ol>

<h3>7. Where Security+ fits in your career</h3>
<p>Security+ proves breadth. Employers hiring Tier 1 SOC analysts typically look for Security+ plus evidence of hands-on skill: a home lab, write-ups of labs and capture-the-flag exercises, or a more practical certification. After Security+, common next steps on the analyst track include CompTIA CySA+, vendor-specific credentials such as Microsoft SC-200, or practical blue-team certifications. Each later phase of CyberPath maps to one of these. Long term, the CISSP is the management-level credential, and the Associate of ISC2 route lets you pass that exam before you have the full experience requirement.</p>
<div class="callout real"><p>In interviews, hiring managers rarely ask you to recite port numbers. They ask scenario questions: "You see 500 failed logins followed by one success from the same IP. What do you do?" Security+ gives you the vocabulary; practice turning it into a clear, step-by-step answer.</p></div>

<h3>Key takeaways</h3>
<ul>
<li>SY0-701 has five domains; Security Operations (28%) and Threats, Vulnerabilities, and Mitigations (22%) together make up half the exam.</li>
<li>The exam has up to 90 questions in 90 minutes with a passing score of 750 on a 100–900 scale; certifications renew every three years.</li>
<li>Do not neglect governance and risk: Domain 5 is 20% and includes calculations such as SLE and ALE.</li>
<li>Manage PBQs by flagging long ones and returning after the multiple choice section.</li>
<li>Study from the official objectives, use spaced repetition, do hands-on labs, and explain why every distractor is wrong.</li>
<li>Exam versions refresh roughly every three years; always confirm the current version and retirement dates on CompTIA's site.</li>
</ul>
`,
  references: [
    { title: "CompTIA Security+ certification overview", url: "https://www.comptia.org/certifications/security" },
    { title: "NIST SP 800-30 Rev. 1 — Guide for Conducting Risk Assessments", url: "https://csrc.nist.gov/pubs/sp/800/30/r1/final" },
    { title: "NIST SP 800-53 Rev. 5 — Security and Privacy Controls for Information Systems and Organizations", url: "https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final" }
  ]
});

CP.papers.push({
  id: "paper-cryptography-explained",
  title: "Cryptography Explained: From AES to Post-Quantum",
  module: "p1-m3",
  minutes: 20,
  summary: "A plain-language guide to symmetric and asymmetric encryption, hashing, digital signatures, PKI and TLS, and to the post-quantum transition built on FIPS 203 (ML-KEM), FIPS 204 (ML-DSA) and FIPS 205 (SLH-DSA).",
  html: `
<p>Cryptography is the mathematics that lets strangers trust each other over a hostile network. It protects your bank session, verifies that a software update really came from its vendor, keeps laptop disks unreadable when stolen, and underpins every certificate warning a user clicks through. Security analysts do not need to design ciphers, but they constantly have to judge whether cryptography is being used correctly: is this TLS configuration weak, is this file hash a match, is this certificate legitimate, did this ransomware actually encrypt or just rename files? This paper builds that judgment from the ground up and finishes with the biggest cryptographic migration in decades: the move to post-quantum algorithms.</p>

<h3>1. What cryptography provides</h3>
<p>Cryptographic tools deliver four properties, and it helps to ask which one a given mechanism supplies:</p>
<ul>
<li><b>Confidentiality</b>: only intended parties can read the data (encryption).</li>
<li><b>Integrity</b>: any change to the data is detectable (hashes, MACs, signatures).</li>
<li><b>Authentication</b>: you know who you are talking to or who created something (signatures, certificates, MACs).</li>
<li><b>Non-repudiation</b>: a signer cannot credibly deny having signed (digital signatures with private keys only the signer holds).</li>
</ul>
<p>A foundational principle, Kerckhoffs's principle, says a system should be secure even if everything about it except the key is public. Never trust "secret" proprietary algorithms; trust openly analyzed, standardized ones.</p>

<h3>2. Symmetric encryption</h3>
<p>Symmetric algorithms use the same key to encrypt and decrypt. They are fast and are used for bulk data. The modern standard is <b>AES</b> (Advanced Encryption Standard, FIPS 197), a block cipher operating on 128-bit blocks with 128, 192 or 256-bit keys. <b>ChaCha20</b> is a fast stream cipher popular on mobile devices without AES hardware acceleration.</p>
<p>A block cipher needs a <b>mode of operation</b> to encrypt more than one block:</p>
<table>
<thead><tr><th>Mode</th><th>Notes</th><th>Verdict</th></tr></thead>
<tbody>
<tr><td>ECB</td><td>Encrypts each block independently; identical plaintext blocks produce identical ciphertext, leaking patterns</td><td>Never use</td></tr>
<tr><td>CBC</td><td>Chains blocks with an IV; needs separate integrity protection; padding-oracle attacks have plagued it</td><td>Legacy</td></tr>
<tr><td>CTR</td><td>Turns a block cipher into a stream cipher; parallelizable; no built-in integrity</td><td>Fine as a building block</td></tr>
<tr><td>GCM</td><td>CTR plus authentication: an <b>AEAD</b> mode (authenticated encryption with associated data)</td><td>Preferred</td></tr>
</tbody>
</table>
<p>AEAD modes such as AES-GCM and ChaCha20-Poly1305 are the modern default because they provide confidentiality and integrity together. The cardinal rule with GCM is never to reuse a nonce with the same key; doing so can destroy both properties.</p>
<p>The weakness of symmetric crypto is <b>key distribution</b>. If Alice and Bob have never met, how do they agree on a shared key over a network an attacker is watching? With <i>n</i> parties communicating pairwise you also need <i>n(n-1)/2</i> keys. Asymmetric cryptography solves both problems.</p>

<h3>3. Asymmetric (public-key) cryptography</h3>
<p>Each party has a key pair: a <b>public key</b> anyone may know and a <b>private key</b> kept secret. What one key does, only the other can undo. This enables two critical operations:</p>
<ul>
<li><b>Key establishment.</b> Parties agree on a shared symmetric key without ever sending it. Diffie-Hellman (and its elliptic-curve form ECDH, commonly with Curve25519, known as X25519) lets each side combine its private value with the other's public value to reach the same secret. RSA can also wrap a key with the recipient's public key, though TLS 1.3 dropped RSA key transport because it lacks forward secrecy.</li>
<li><b>Digital signatures.</b> The signer uses the private key to sign a hash of the message; anyone with the public key can verify it. Common algorithms are RSA (with PSS padding), ECDSA and EdDSA (Ed25519).</li>
</ul>
<p>Asymmetric operations are far slower than symmetric ones, so real systems are <b>hybrid</b>: public-key crypto establishes or protects a symmetric session key, and the symmetric cipher encrypts the data. TLS, SSH, S/MIME, PGP and Signal all work this way.</p>
<table>
<thead><tr><th>Algorithm</th><th>Security based on</th><th>Typical size for roughly 128-bit security</th></tr></thead>
<tbody>
<tr><td>RSA</td><td>Difficulty of factoring large integers</td><td>3072-bit modulus</td></tr>
<tr><td>ECDH / ECDSA</td><td>Elliptic-curve discrete logarithm</td><td>256-bit curve (P-256, Curve25519)</td></tr>
<tr><td>AES</td><td>Symmetric key search</td><td>128-bit key</td></tr>
</tbody>
</table>

<h3>4. Hashing, MACs and password storage</h3>
<p>A <b>cryptographic hash function</b> maps input of any size to a fixed-size digest. Good hashes are one-way (you cannot recover the input), collision-resistant (you cannot find two inputs with the same digest) and show an avalanche effect (a one-bit change flips about half the output bits). Use SHA-256, SHA-384, SHA-512 or SHA-3. <b>MD5 and SHA-1 are broken for collision resistance</b> and must not be used for signatures or integrity against attackers, though you will still see MD5 in malware databases as a lookup identifier.</p>
<pre><code>$ echo -n "invoice.pdf contents" | sha256sum
9c1e...(64 hex characters)</code></pre>
<p>Analysts use hashes daily: to check a file against threat intelligence, to prove evidence has not changed during an investigation (hash at acquisition, hash again before analysis), and to allow-list software.</p>
<p>A hash alone does not prove who created data, because anyone can compute it. A <b>MAC</b> (message authentication code) such as HMAC-SHA256 mixes in a secret key, so only key holders can produce a valid tag. A <b>digital signature</b> uses a private key, adding non-repudiation.</p>
<div class="callout warn"><p>Passwords must never be stored with a plain fast hash. Attackers with GPUs can try billions of SHA-256 guesses per second. Use a slow, salted <b>password hashing function</b> such as Argon2id, scrypt, bcrypt or PBKDF2 with a high iteration count. A unique <b>salt</b> per password defeats precomputed rainbow tables and ensures identical passwords produce different hashes.</p></div>

<h3>5. Public Key Infrastructure</h3>
<p>Public keys solve key distribution, but raise a new question: how do you know a public key really belongs to your bank and not an attacker? <b>PKI</b> answers with trusted third parties called <b>Certificate Authorities (CAs)</b>. A CA verifies an identity and signs an <b>X.509 certificate</b> binding a public key to a name.</p>
<ul>
<li><b>Chain of trust.</b> A root CA (whose certificate is pre-installed in operating systems and browsers) signs intermediate CA certificates, which sign end-entity (leaf) certificates. Root keys are kept offline.</li>
<li><b>Key fields.</b> Subject, issuer, validity period (not before / not after), public key, Subject Alternative Names (the hostnames the certificate is valid for), key usage and the CA's signature.</li>
<li><b>Validation levels.</b> Domain Validated (DV) proves control of a domain; Organization Validated (OV) and Extended Validation (EV) add identity checks about the organization.</li>
<li><b>Revocation.</b> Compromised certificates are revoked through Certificate Revocation Lists or OCSP. Revocation checking has always been unreliable in practice, which is one reason the industry is moving to shorter certificate lifetimes. The CA/Browser Forum has approved a phased reduction of maximum public TLS certificate validity from 398 days down to 47 days by 2029, making automated issuance (for example with the ACME protocol) essential.</li>
<li><b>Certificate Transparency.</b> Public CAs log every certificate they issue in append-only CT logs. Defenders can monitor these logs to spot certificates issued for their domains or look-alike phishing domains.</li>
</ul>
<p>Enterprises also run <b>private CAs</b> for internal services, device authentication, VPNs and smart cards. These are high-value targets: misconfigured internal certificate services can let attackers mint credentials.</p>

<h3>6. Putting it together: TLS</h3>
<p>A TLS 1.3 connection shows every primitive working together:</p>
<ol>
<li><b>Key exchange (asymmetric):</b> client and server perform ephemeral ECDH, or a hybrid post-quantum exchange, to derive a shared secret with forward secrecy.</li>
<li><b>Authentication (signatures and PKI):</b> the server presents its certificate chain and signs the handshake transcript with its private key; the client validates the chain to a trusted root.</li>
<li><b>Key derivation (hashing):</b> HKDF, built on HMAC, derives traffic keys from the shared secret and the transcript hash.</li>
<li><b>Bulk encryption (symmetric AEAD):</b> AES-GCM or ChaCha20-Poly1305 protects application data.</li>
</ol>
<p>When reviewing a server configuration, red flags include support for SSL 3.0, TLS 1.0 or 1.1; CBC-mode or RC4 cipher suites; RSA key exchange without forward secrecy; certificates signed with SHA-1; expired or self-signed certificates on public services; and missing HTTP Strict Transport Security.</p>

<h3>7. The quantum threat</h3>
<p>A sufficiently large, fault-tolerant quantum computer running <b>Shor's algorithm</b> could efficiently factor integers and compute discrete logarithms, breaking RSA, Diffie-Hellman, ECDH and ECDSA entirely. <b>Grover's algorithm</b> offers only a square-root speedup against symmetric keys and hashes, so AES-256 and SHA-384 or larger remain comfortable; even AES-128 is generally considered acceptable for now.</p>
<p>No such quantum computer is publicly known to exist, and estimates of when one might arrive vary widely. The urgency comes from <b>"harvest now, decrypt later"</b>: an adversary can record encrypted traffic today and decrypt it once quantum capability arrives. Data that must remain secret for ten or more years is already at risk. Signatures face a different timeline: they only need to resist forgery while they are being relied on, but long-lived roots of trust such as firmware signing keys need to migrate early.</p>

<h3>8. NIST's post-quantum standards</h3>
<p>After an eight-year public competition, NIST published its first three post-quantum Federal Information Processing Standards in August 2024:</p>
<table>
<thead><tr><th>Standard</th><th>Algorithm (original name)</th><th>Purpose</th><th>Basis</th></tr></thead>
<tbody>
<tr><td>FIPS 203</td><td>ML-KEM (CRYSTALS-Kyber)</td><td>Key encapsulation, replacing ECDH/RSA key exchange</td><td>Module lattices</td></tr>
<tr><td>FIPS 204</td><td>ML-DSA (CRYSTALS-Dilithium)</td><td>General-purpose digital signatures</td><td>Module lattices</td></tr>
<tr><td>FIPS 205</td><td>SLH-DSA (SPHINCS+)</td><td>Stateless hash-based signatures; a conservative backup based only on hash-function security</td><td>Hash functions</td></tr>
</tbody>
</table>
<p>Each comes in parameter sets at different security levels, for example ML-KEM-512, ML-KEM-768 and ML-KEM-1024. Post-quantum keys and signatures are larger than their elliptic-curve equivalents (an ML-KEM-768 public key is about 1.2 KB versus 32 bytes for X25519, and SLH-DSA signatures run to several kilobytes or more), which affects protocols, packet sizes and constrained devices.</p>
<p>The program is continuing. A fourth signature standard based on FALCON (to be called FN-DSA, FIPS 206) has been in development, and in March 2025 NIST selected HQC, a code-based algorithm, as a backup key-encapsulation mechanism to ML-KEM, with a draft standard to follow. NIST has also published draft transition guidance (NIST IR 8547) proposing that quantum-vulnerable algorithms be deprecated around 2030 and disallowed by 2035 for federal use. Treat those dates as the direction of travel and check the final guidance, as details are still being refined.</p>
<h4>Hybrid deployment is already here</h4>
<p>Rather than trusting new algorithms alone, early deployments combine classical and post-quantum key exchange so that an attacker must break both. Major browsers and large CDNs already negotiate hybrid TLS key exchange such as X25519MLKEM768 by default, and OpenSSH has adopted hybrid post-quantum key exchange as well. If you inspect TLS handshakes in 2026, you will see these groups in a large share of traffic.</p>

<h3>9. What organizations should do now</h3>
<ol>
<li><b>Build a cryptographic inventory.</b> Find where RSA and ECC are used: TLS endpoints, VPNs, code signing, PKI, SSH, databases, hardware security modules, vendor products.</li>
<li><b>Prioritize by data lifetime.</b> Systems protecting long-lived secrets (health records, intellectual property, government data) move first because of harvest-now-decrypt-later.</li>
<li><b>Pursue crypto-agility.</b> Prefer libraries, protocols and products that can swap algorithms through configuration rather than redesign.</li>
<li><b>Ask vendors for roadmaps.</b> Much of the migration will arrive through software and hardware updates; procurement language should require PQC support plans.</li>
<li><b>Keep symmetric strength high.</b> Use AES-256 and SHA-384 or stronger where long-term protection matters.</li>
</ol>
<div class="callout exam"><p>For Security+ and CISSP, know which primitive provides which property, that asymmetric crypto is used to exchange or protect symmetric keys, that hashing is not encryption, and that salting defeats rainbow tables. Expect at least awareness-level questions on quantum risk and post-quantum cryptography.</p></div>

<h3>Key takeaways</h3>
<ul>
<li>Symmetric encryption (AES, ChaCha20) is fast and handles bulk data; prefer AEAD modes like GCM and never reuse nonces.</li>
<li>Asymmetric cryptography solves key distribution and enables digital signatures; real systems are hybrids of both.</li>
<li>Hashes provide integrity, MACs add a shared secret, and signatures add non-repudiation. MD5 and SHA-1 are broken for collision resistance. Store passwords with salted, slow functions like Argon2id or bcrypt.</li>
<li>PKI binds identities to public keys through CA-signed X.509 certificates; certificate lifetimes are shrinking toward 47 days, so automation is mandatory.</li>
<li>Quantum computers would break RSA and ECC; harvest-now-decrypt-later makes the threat current for long-lived data.</li>
<li>FIPS 203 (ML-KEM), FIPS 204 (ML-DSA) and FIPS 205 (SLH-DSA) are the first NIST PQC standards; hybrid post-quantum TLS is already widely deployed. Start with inventory and crypto-agility.</li>
</ul>
`,
  references: [
    { title: "FIPS 203 — Module-Lattice-Based Key-Encapsulation Mechanism Standard", url: "https://csrc.nist.gov/pubs/fips/203/final" },
    { title: "FIPS 204 — Module-Lattice-Based Digital Signature Standard", url: "https://csrc.nist.gov/pubs/fips/204/final" },
    { title: "FIPS 205 — Stateless Hash-Based Digital Signature Standard", url: "https://csrc.nist.gov/pubs/fips/205/final" },
    { title: "NIST Post-Quantum Cryptography project", url: "https://csrc.nist.gov/projects/post-quantum-cryptography" },
    { title: "RFC 8446 — The Transport Layer Security (TLS) Protocol Version 1.3", url: "https://www.rfc-editor.org/rfc/rfc8446" }
  ]
});

CP.papers.push({
  id: "paper-zero-trust",
  title: "Zero Trust Architecture: NIST SP 800-207 and the CISA Maturity Model",
  module: "p1-m5",
  minutes: 18,
  summary: "What zero trust really means, the seven tenets and logical components of NIST SP 800-207, the five pillars and four maturity stages of the CISA Zero Trust Maturity Model v2.0, and how to plan a realistic migration.",
  html: `
<p>For decades, enterprise security followed a castle-and-moat model: a hard perimeter of firewalls and VPNs around a soft interior where anything "inside" was trusted. That model was already failing before cloud computing, mobile devices and remote work finished it off. Attackers who phish one user land inside the moat and move laterally with little resistance. <b>Zero trust</b> is the response. It is not a product you buy; it is a set of design principles that treats every access request as potentially hostile, regardless of where it comes from, and makes a fresh, evidence-based decision for each one.</p>

<h3>1. The core idea</h3>
<p>NIST Special Publication 800-207, <i>Zero Trust Architecture</i> (August 2020), defines zero trust as a collection of concepts designed to minimize uncertainty in enforcing accurate, least-privilege, per-request access decisions in the face of a network viewed as compromised. Three phrases in that definition carry the weight:</p>
<ul>
<li><b>Per-request:</b> access is decided for each session to each resource, not once at the network edge.</li>
<li><b>Least privilege:</b> subjects get only the access they need, for only as long as they need it.</li>
<li><b>Network viewed as compromised:</b> being on the corporate network grants no implicit trust. Assume breach.</li>
</ul>
<p>The common slogan is "never trust, always verify," but a more useful framing for practitioners is: <i>move the trust decision from the network location to the identity, device and context of each request, and keep re-evaluating it.</i></p>

<h3>2. The seven tenets of SP 800-207</h3>
<table>
<thead><tr><th>#</th><th>Tenet (paraphrased)</th><th>What it looks like in practice</th></tr></thead>
<tbody>
<tr><td>1</td><td>All data sources and computing services are considered resources</td><td>Laptops, SaaS apps, APIs, IoT devices and cloud functions are all protected resources</td></tr>
<tr><td>2</td><td>All communication is secured regardless of network location</td><td>Encrypt and authenticate traffic even on the internal LAN</td></tr>
<tr><td>3</td><td>Access to individual resources is granted on a per-session basis</td><td>Logging into the HR app does not grant access to the finance app</td></tr>
<tr><td>4</td><td>Access is determined by dynamic policy, including identity, application, device state and behavioral or environmental attributes</td><td>Conditional access: an unmanaged device from an unusual country gets blocked or limited</td></tr>
<tr><td>5</td><td>The enterprise monitors and measures the integrity and security posture of all owned and associated assets</td><td>Continuous device health checks via MDM and EDR</td></tr>
<tr><td>6</td><td>All resource authentication and authorization are dynamic and strictly enforced before access is allowed</td><td>Continuous re-authentication and session re-evaluation, MFA</td></tr>
<tr><td>7</td><td>The enterprise collects as much information as possible about assets, network infrastructure and communications and uses it to improve its security posture</td><td>Telemetry feeds analytics that refine policy</td></tr>
</tbody>
</table>

<h3>3. Logical components</h3>
<p>SP 800-207 describes an abstract architecture split into a <b>control plane</b> (where decisions are made) and a <b>data plane</b> (where application traffic flows).</p>
<ul>
<li><b>Policy Engine (PE):</b> the brain. It evaluates enterprise policy plus inputs from external sources and decides to grant, deny or revoke access.</li>
<li><b>Policy Administrator (PA):</b> executes the PE's decision by establishing or tearing down the communication path, for example issuing a session token or configuring the enforcement point.</li>
<li><b>Policy Enforcement Point (PEP):</b> the gatekeeper in the data plane that enables, monitors and terminates connections between a subject and a resource. A PEP may be an identity-aware proxy, a gateway, an agent on the endpoint, or a combination.</li>
</ul>
<p>The PE and PA together are often called the Policy Decision Point (PDP). The PE draws on <b>policy information points</b> such as:</p>
<ul>
<li>Continuous diagnostics and mitigation (CDM) systems reporting device posture</li>
<li>Industry compliance requirements</li>
<li>Threat intelligence feeds</li>
<li>Network and system activity logs</li>
<li>Data access policies</li>
<li>Enterprise PKI</li>
<li>Identity management systems</li>
<li>SIEM systems</li>
</ul>
<div class="callout exam"><p>A classic exam question: "Which zero trust component makes the access decision?" The Policy Engine. "Which component enforces it in the data path?" The Policy Enforcement Point. The Policy Administrator sits between them and executes the decision.</p></div>

<h3>4. Deployment approaches</h3>
<p>SP 800-207 describes several ways to build a zero trust architecture, and real organizations usually combine them:</p>
<ul>
<li><b>Enhanced identity governance:</b> identity and its attributes are the primary policy input. This is the natural starting point for SaaS-heavy organizations.</li>
<li><b>Micro-segmentation:</b> resources are placed in small segments protected by gateways or host firewalls, limiting lateral movement.</li>
<li><b>Network infrastructure and software-defined perimeters:</b> an overlay network where the PA configures the path for each authorized session; resources are invisible until a subject is authorized.</li>
</ul>
<p>It also describes deployment models such as device agent/gateway, enclave gateway, resource portal and application sandboxing. Vendor categories you will encounter map onto these ideas: Zero Trust Network Access (ZTNA) replacing VPNs, identity providers with conditional access, Secure Access Service Edge (SASE) combining networking and security as a cloud service, and micro-segmentation platforms.</p>
<p>NIST's National Cybersecurity Center of Excellence followed up with SP 1800-35, <i>Implementing a Zero Trust Architecture</i>, finalized in 2025, which documents many example builds using commercial products. It is a useful bridge from the abstract model to concrete designs.</p>

<h3>5. The CISA Zero Trust Maturity Model v2.0</h3>
<p>Where SP 800-207 describes the architecture, the CISA Zero Trust Maturity Model (ZTMM), version 2.0 published in April 2023, describes how to measure progress. It was written to help U.S. federal agencies meet the zero trust goals of OMB memorandum M-22-09, but it is widely used in the private sector.</p>
<h4>Five pillars</h4>
<table>
<thead><tr><th>Pillar</th><th>Focus</th><th>Example of "Optimal"</th></tr></thead>
<tbody>
<tr><td>Identity</td><td>Users and entities, authentication, risk assessment, access management</td><td>Continuous, phishing-resistant authentication with real-time risk analysis</td></tr>
<tr><td>Devices</td><td>Hardware, software and firmware of every asset, including BYOD and IoT</td><td>Continuous device posture verification informing every access decision</td></tr>
<tr><td>Networks</td><td>Segmentation, traffic management, encryption, resilience</td><td>Fully distributed micro-perimeters with just-in-time, just-enough connectivity; all traffic encrypted</td></tr>
<tr><td>Applications and Workloads</td><td>Access to apps, threat protection, secure development, application security testing</td><td>Applications available over public networks with continuous authorization; security integrated across the SDLC</td></tr>
<tr><td>Data</td><td>Inventory, categorization, availability, access, encryption</td><td>Automated data inventory and labeling with dynamic, least-privilege access and encryption everywhere</td></tr>
</tbody>
</table>
<h4>Three cross-cutting capabilities</h4>
<p>Every pillar also depends on <b>Visibility and Analytics</b>, <b>Automation and Orchestration</b>, and <b>Governance</b>. These are where SOC teams live: the telemetry, detection and automated response that make dynamic policy possible.</p>
<h4>Four maturity stages</h4>
<ol>
<li><b>Traditional:</b> manual configuration, static policies, siloed enforcement, limited visibility.</li>
<li><b>Initial:</b> starting automation, some cross-pillar integration, early least-privilege adjustments. (Version 2.0 added this stage to make the first steps more achievable.)</li>
<li><b>Advanced:</b> centralized visibility and identity control, automated policy enforcement where available, cross-pillar coordination.</li>
<li><b>Optimal:</b> fully automated, just-in-time lifecycles, dynamic least privilege, continuous monitoring and self-reporting across pillars.</li>
</ol>
<p>Maturity is assessed per pillar and per function within a pillar, so an organization might be Advanced in Identity, Initial in Data and Traditional in Networks. That unevenness is normal and is exactly what a roadmap should address.</p>

<h3>6. A worked example: replacing the VPN</h3>
<p>Consider a 2,000-person company whose remote staff connect over a traditional VPN that drops them onto a flat internal network.</p>
<table>
<thead><tr><th>Before</th><th>After a zero trust redesign</th></tr></thead>
<tbody>
<tr><td>VPN with password and SMS code grants full network access</td><td>Identity provider with phishing-resistant MFA (FIDO2 passkeys) and conditional access policies</td></tr>
<tr><td>Any device with the VPN client can connect</td><td>Access requires a managed, compliant device; EDR health and patch level are policy inputs</td></tr>
<tr><td>Once connected, users can reach any internal IP</td><td>ZTNA brokers per-application sessions; apps are invisible to unauthorized users</td></tr>
<tr><td>Internal traffic between servers is unrestricted</td><td>Micro-segmentation limits each workload to required flows</td></tr>
<tr><td>Logs scattered across VPN, firewalls and servers</td><td>Centralized telemetry in the SIEM; risk signals can revoke sessions automatically</td></tr>
</tbody>
</table>
<p>Now replay a phishing attack. The attacker steals a password but cannot satisfy FIDO2 MFA, because passkeys are bound to the legitimate site's origin. Suppose instead malware lands on a managed laptop: EDR flags it, the device's posture score drops, the policy engine revokes its sessions, and micro-segmentation limits what the laptop could reach anyway. The breach is contained to a much smaller blast radius.</p>

<h3>7. Common misconceptions and pitfalls</h3>
<ul>
<li><b>"Zero trust means trusting nothing, so nothing works."</b> It means trust is explicit, earned and continuously re-evaluated, not that access is impossible.</li>
<li><b>"We bought a ZTNA product, so we are zero trust."</b> A single product addresses part of one or two pillars. Zero trust is an architecture and an operating model.</li>
<li><b>"It's a network project."</b> Identity and device health are usually the highest-leverage starting points; data protection is often the hardest pillar.</li>
<li><b>Ignoring legacy systems.</b> Mainframes, OT and old applications that cannot do modern authentication need compensating controls such as enclave gateways and tight segmentation.</li>
<li><b>Big-bang rollouts.</b> Successful programs start with a few high-value applications or user groups, measure, and expand.</li>
<li><b>Policy without telemetry.</b> Dynamic policy is only as good as the signals feeding it; invest in visibility and analytics.</li>
</ul>

<h3>8. A pragmatic roadmap</h3>
<ol>
<li><b>Identify protect surfaces.</b> Inventory critical data, applications, assets and services, and map how they are accessed.</li>
<li><b>Strengthen identity.</b> Consolidate on a central identity provider, enforce phishing-resistant MFA (prioritizing administrators), and remove standing privileged access in favor of just-in-time elevation.</li>
<li><b>Know your devices.</b> Achieve a complete device inventory and feed device compliance into access decisions.</li>
<li><b>Broker application access.</b> Move high-value applications behind identity-aware proxies or ZTNA; retire broad VPN access group by group.</li>
<li><b>Segment.</b> Use micro-segmentation to restrict east-west traffic, starting with crown-jewel systems.</li>
<li><b>Protect data.</b> Classify and label data, encrypt it, and apply data-centric access policies.</li>
<li><b>Automate and measure.</b> Use the CISA ZTMM to score each pillar periodically and drive the next tranche of work.</li>
</ol>
<div class="callout real"><p>As a SOC analyst in a zero trust environment you will see more, richer alerts: impossible-travel sign-ins, device compliance failures, conditional access blocks and session revocations. Understanding the policy logic behind them is what lets you tell a real attack from a user on a new phone.</p></div>

<h3>Key takeaways</h3>
<ul>
<li>Zero trust removes implicit trust based on network location and makes per-request, least-privilege decisions using identity, device and context; it assumes breach.</li>
<li>NIST SP 800-207 defines seven tenets and a control plane with a Policy Engine (decides), Policy Administrator (executes) and Policy Enforcement Point (enforces).</li>
<li>Deployment approaches include enhanced identity governance, micro-segmentation and software-defined perimeters; most organizations combine them.</li>
<li>The CISA ZTMM v2.0 has five pillars (Identity, Devices, Networks, Applications and Workloads, Data), three cross-cutting capabilities, and four stages (Traditional, Initial, Advanced, Optimal).</li>
<li>Zero trust is a journey measured pillar by pillar; start with identity, phishing-resistant MFA and device posture, then broker applications and segment.</li>
</ul>
`,
  references: [
    { title: "NIST SP 800-207 — Zero Trust Architecture", url: "https://csrc.nist.gov/pubs/sp/800/207/final" },
    { title: "CISA Zero Trust Maturity Model", url: "https://www.cisa.gov/zero-trust-maturity-model" },
    { title: "NIST SP 1800-35 — Implementing a Zero Trust Architecture", url: "https://csrc.nist.gov/pubs/sp/1800/35/final" }
  ]
});

CP.papers.push({
  id: "paper-vuln-management",
  title: "Modern Vulnerability Management: CVE, CVSS v4.0, EPSS, KEV and SSVC",
  module: "p1-m6",
  minutes: 20,
  summary: "How vulnerabilities are identified, scored and prioritized today: the CVE program, CVSS v4.0 metric groups, EPSS exploit probability, the CISA Known Exploited Vulnerabilities catalog and BOD 22-01, and SSVC decision trees.",
  html: `
<p>Every year tens of thousands of new vulnerabilities are published. In 2024 alone the CVE program published roughly 40,000 records, and the pace has continued to climb. No organization can patch everything immediately, and trying to do so by severity score alone wastes effort on vulnerabilities attackers never use while real threats slip through. Modern vulnerability management is therefore a <b>prioritization</b> discipline: combining what a flaw could do, how likely it is to be exploited, whether it is already being exploited, and how much it matters to <i>your</i> environment. This paper explains the building blocks and how to combine them.</p>

<h3>1. The vulnerability management lifecycle</h3>
<ol>
<li><b>Asset discovery.</b> You cannot protect what you do not know. Maintain an inventory of hardware, software, cloud resources and internet-facing services, with owners and criticality.</li>
<li><b>Identification.</b> Authenticated scanners, agents, software composition analysis for code dependencies, cloud posture tools and external attack surface management find vulnerabilities.</li>
<li><b>Prioritization.</b> Decide what to fix first using the scoring systems below plus business context.</li>
<li><b>Remediation or mitigation.</b> Patch, upgrade, reconfigure, or apply compensating controls (isolation, WAF rules, disabling a feature) when a patch is not possible.</li>
<li><b>Verification.</b> Rescan to confirm the fix worked.</li>
<li><b>Reporting and improvement.</b> Track metrics such as mean time to remediate by severity, SLA compliance and exposure windows for exploited vulnerabilities.</li>
</ol>

<h3>2. CVE: a common name for every flaw</h3>
<p>The <b>Common Vulnerabilities and Exposures</b> program, operated by MITRE with sponsorship from CISA, assigns unique identifiers such as <code>CVE-2021-44228</code> (Log4Shell). Identifiers are issued by CVE Numbering Authorities (CNAs), which include major vendors, open-source projects, researchers and coordinators. A CVE record contains a description, affected products and references; increasingly CNAs add CVSS scores, CWE weakness types and affected-version data directly.</p>
<p>The <b>National Vulnerability Database (NVD)</b>, run by NIST, enriches CVE records with scores and product identifiers (CPE). In 2024 the NVD fell significantly behind on enrichment, and CISA launched its "Vulnrichment" effort to add data to records. In April 2025 the CVE program itself briefly faced a lapse in its federal contract before CISA extended funding, prompting wider discussion of the program's governance and long-term funding, including the formation of an independent CVE Foundation. The practical lesson for analysts: do not depend on a single enrichment source, and expect the governance of this ecosystem to keep evolving.</p>
<div class="callout tip"><p>A CVE describes a specific flaw in a specific product. A <b>CWE</b> (Common Weakness Enumeration) describes the class of mistake, for example CWE-79 cross-site scripting or CWE-787 out-of-bounds write. CWE helps developers fix root causes; CVE helps operators find affected systems.</p></div>

<h3>3. CVSS v4.0: describing severity</h3>
<p>The <b>Common Vulnerability Scoring System</b>, maintained by FIRST, produces a 0 to 10 score describing a vulnerability's characteristics. Version 4.0 was published in November 2023 and is being adopted progressively alongside the still-common v3.1.</p>
<h4>Metric groups</h4>
<table>
<thead><tr><th>Group</th><th>What it captures</th><th>Who sets it</th></tr></thead>
<tbody>
<tr><td>Base</td><td>Intrinsic qualities: how it is exploited and what it impacts</td><td>Vendor or CNA</td></tr>
<tr><td>Threat</td><td>Exploit Maturity: is there evidence of attack or proof-of-concept code?</td><td>Consumer, updated over time</td></tr>
<tr><td>Environmental</td><td>Your security requirements and modified base metrics for your deployment</td><td>Consumer</td></tr>
<tr><td>Supplemental</td><td>Extra context that does not change the score: Safety, Automatable, Recovery, Value Density, Vulnerability Response Effort, Provider Urgency</td><td>Vendor or consumer</td></tr>
</tbody>
</table>
<p>CVSS v4.0 introduced naming that makes clear which groups were used: <b>CVSS-B</b> (Base only), <b>CVSS-BT</b> (Base and Threat), <b>CVSS-BE</b> (Base and Environmental) and <b>CVSS-BTE</b> (all three). Most published scores are CVSS-B, which FIRST stresses is a measure of severity, not of risk.</p>
<h4>Base metrics in v4.0</h4>
<ul>
<li><b>Exploitability:</b> Attack Vector (Network, Adjacent, Local, Physical), Attack Complexity (Low, High), the new <b>Attack Requirements</b> (None, Present: conditions such as a race condition or specific configuration), Privileges Required (None, Low, High) and User Interaction, now split into None, Passive and Active.</li>
<li><b>Impact:</b> confidentiality, integrity and availability are scored separately for the <b>Vulnerable System</b> (VC, VI, VA) and <b>Subsequent Systems</b> (SC, SI, SA). This replaces v3.1's confusing Scope metric.</li>
</ul>
<p>An example v4.0 vector:</p>
<pre><code>CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N</code></pre>
<p>This describes a network-reachable flaw, low complexity, no special conditions, no privileges, no user interaction and high impact to the vulnerable system: an unauthenticated remote code execution, scoring in the Critical range (9.0 to 10.0). Severity bands are None (0.0), Low (0.1 to 3.9), Medium (4.0 to 6.9), High (7.0 to 8.9) and Critical (9.0 to 10.0).</p>
<div class="callout warn"><p>The single biggest mistake in vulnerability management is treating the CVSS base score as risk. A CVSS 9.8 in a library function your code never calls, on an isolated test server, may matter less than a CVSS 6.5 authentication bypass on your internet-facing VPN that criminals are exploiting today.</p></div>

<h3>4. EPSS: how likely is exploitation?</h3>
<p>The <b>Exploit Prediction Scoring System</b>, also from FIRST, estimates the probability that a vulnerability will see exploitation activity in the wild in the next 30 days. It is a data-driven model trained on observed exploitation, vulnerability characteristics, exploit code availability, social media and other signals, and it is recalculated daily for every published CVE. EPSS version 4 was released in March 2025.</p>
<p>EPSS gives two numbers: a <b>probability</b> (for example 0.94, meaning about a 94% chance of exploitation activity in the next 30 days) and a <b>percentile</b> (how that score ranks against all other CVEs). Because the overwhelming majority of CVEs are never observed being exploited, most have very low EPSS scores. EPSS is especially useful for triaging the long tail of high-CVSS findings: a vulnerability with CVSS 9.8 and EPSS 0.002 is a lower priority than one with CVSS 7.5 and EPSS 0.6.</p>
<p>EPSS has limits. It predicts exploitation activity broadly, not targeted attacks against you; it says nothing about your asset's importance; and it lags on brand-new vulnerabilities with little data. Use it as one input, not an oracle.</p>

<h3>5. CISA KEV: what is being exploited right now</h3>
<p>The <b>Known Exploited Vulnerabilities (KEV) catalog</b> is CISA's authoritative list of vulnerabilities with reliable evidence of active exploitation. Each entry requires an assigned CVE, evidence of exploitation in the wild, and clear remediation guidance. Entries include a due date for federal agencies and a field noting known use in ransomware campaigns. The catalog has grown to well over a thousand entries and is available as CSV and JSON feeds, making it easy to join with scanner output.</p>
<h4>BOD 22-01</h4>
<p>CISA <b>Binding Operational Directive 22-01</b>, <i>Reducing the Significant Risk of Known Exploited Vulnerabilities</i>, issued in November 2021, requires U.S. federal civilian executive branch agencies to remediate KEV-listed vulnerabilities on their systems within the deadlines CISA sets. At launch, the timelines were two weeks for CVEs assigned in 2021 or later and six months for older CVEs; for newly added entries, CISA sets a due date, commonly three weeks after addition and sometimes much shorter for emergencies. The directive also requires agencies to update their internal vulnerability management procedures accordingly.</p>
<p>BOD 22-01 is legally binding only on federal agencies, but CISA strongly encourages every organization to use the KEV catalog as a prioritization input, and many private-sector programs have adopted "KEV within two to three weeks" as a policy. If you take one thing from this paper: <b>anything in KEV that exists in your environment, especially on internet-facing systems, goes to the top of the queue.</b></p>

<h3>6. SSVC: decisions instead of scores</h3>
<p>Scores still leave a human asking "so what do we do?" <b>Stakeholder-Specific Vulnerability Categorization (SSVC)</b>, developed by Carnegie Mellon University's Software Engineering Institute with CISA, replaces a number with a <b>decision</b> reached through a short decision tree. CISA's version for vulnerability management uses these decision points:</p>
<table>
<thead><tr><th>Decision point</th><th>Values</th></tr></thead>
<tbody>
<tr><td>Exploitation</td><td>None, Public PoC, Active</td></tr>
<tr><td>Technical Impact</td><td>Partial, Total</td></tr>
<tr><td>Automatable</td><td>No, Yes (can an attacker reliably exploit it at scale without human interaction?)</td></tr>
<tr><td>Mission Prevalence</td><td>Minimal, Support, Essential</td></tr>
<tr><td>Public Well-being Impact</td><td>Minimal, Material, Irreversible</td></tr>
</tbody>
</table>
<p>The tree yields one of four outcomes:</p>
<ul>
<li><b>Track:</b> no action required now; remediate within standard update timelines.</li>
<li><b>Track*:</b> contains specific characteristics that warrant closer monitoring for changes; remediate within standard timelines.</li>
<li><b>Attend:</b> requires attention from supervisory or leadership levels; may involve requesting assistance or publishing notifications; remediate sooner than standard timelines.</li>
<li><b>Act:</b> requires leadership attention and immediate action; remediate as soon as possible.</li>
</ul>
<p>SSVC's strength is that it forces explicit use of exploitation status and business context, and it produces outcomes that map directly onto service levels and escalation paths.</p>

<h3>7. Combining the signals: a practical prioritization model</h3>
<p>Here is a simple, defensible model many teams use, expressed as tiers with remediation targets. Adapt the numbers to your risk appetite.</p>
<table>
<thead><tr><th>Priority</th><th>Criteria</th><th>Target</th></tr></thead>
<tbody>
<tr><td>P1 Emergency</td><td>In CISA KEV (or vendor confirms active exploitation) AND on an internet-facing or critical asset; or SSVC "Act"</td><td>48–72 hours, or mitigate immediately</td></tr>
<tr><td>P2 High</td><td>In KEV on internal assets; or EPSS above a chosen threshold (for example 0.1) with CVSS High/Critical; or SSVC "Attend"</td><td>7–14 days</td></tr>
<tr><td>P3 Medium</td><td>CVSS High/Critical without exploitation evidence and low EPSS</td><td>30 days</td></tr>
<tr><td>P4 Low</td><td>Everything else</td><td>Next maintenance cycle or 90 days</td></tr>
</tbody>
</table>
<h4>Worked example</h4>
<p>A weekly scan returns three findings:</p>
<ol>
<li><b>CVE A</b> in a PDF library on 400 workstations: CVSS-B 9.3, EPSS 0.01, not in KEV, requires opening a malicious file. Priority P3; patch through the normal monthly cycle and make sure email attachment filtering is in place.</li>
<li><b>CVE B</b> in your SSL VPN appliance: CVSS-B 8.7, EPSS 0.92, added to KEV last week with known ransomware use. Priority P1. Patch tonight; if impossible, apply vendor mitigations, then hunt for signs of prior compromise, since exploitation may have preceded your patch.</li>
<li><b>CVE C</b> in an internal wiki server: CVSS-B 6.9, EPSS 0.35, public proof of concept, not in KEV, hosts sensitive engineering documents. Priority P2.</li>
</ol>
<p>Notice that the highest CVSS score ended up lowest priority. That is the point.</p>

<h3>8. Beyond patching</h3>
<ul>
<li><b>Compensating controls.</b> When no patch exists, or an end-of-life system cannot be patched, isolate it, restrict access, add detection, or apply virtual patching with a WAF or IPS. Document the residual risk and an owner who accepts it.</li>
<li><b>Exceptions with expiry.</b> Risk acceptances should be time-bound and reviewed, not permanent.</li>
<li><b>Configuration is a vulnerability too.</b> Default credentials, exposed management interfaces and public cloud storage buckets are often more dangerous than missing patches.</li>
<li><b>Feed the SOC.</b> When a KEV item hits your environment, give the SOC detection logic and indicators so they can hunt for exploitation that happened before remediation.</li>
</ul>

<h3>Key takeaways</h3>
<ul>
<li>Vulnerability management is a lifecycle of discovery, identification, prioritization, remediation, verification and reporting; prioritization is where most value is won or lost.</li>
<li>CVE names flaws; CWE names weakness classes; the NVD and CISA Vulnrichment add data, and the governance of the CVE ecosystem is still evolving.</li>
<li>CVSS v4.0 adds Attack Requirements, splits impact into vulnerable and subsequent systems, adds Threat and Supplemental groups, and labels scores as CVSS-B, BT, BE or BTE. The base score measures severity, not risk.</li>
<li>EPSS estimates the probability of exploitation activity in the next 30 days and is recalculated daily.</li>
<li>CISA KEV lists vulnerabilities exploited in the wild; BOD 22-01 makes remediation mandatory for federal agencies and is best practice for everyone.</li>
<li>SSVC turns exploitation status, impact, automatability and mission context into Track, Track*, Attend or Act decisions.</li>
</ul>
`,
  references: [
    { title: "FIRST — Common Vulnerability Scoring System v4.0", url: "https://www.first.org/cvss/v4-0/" },
    { title: "FIRST — Exploit Prediction Scoring System (EPSS)", url: "https://www.first.org/epss/" },
    { title: "CISA Known Exploited Vulnerabilities Catalog", url: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog" },
    { title: "CISA BOD 22-01 — Reducing the Significant Risk of Known Exploited Vulnerabilities", url: "https://www.cisa.gov/news-events/directives/bod-22-01-reducing-significant-risk-known-exploited-vulnerabilities" },
    { title: "CISA — Stakeholder-Specific Vulnerability Categorization (SSVC)", url: "https://www.cisa.gov/ssvc" }
  ]
});

CP.papers.push({
  id: "paper-day-in-the-soc",
  title: "A Day in the SOC: The Tier 1 Analyst's Shift, Triage and Documentation",
  module: "p2-m1",
  minutes: 17,
  summary: "What a Tier 1 SOC analyst actually does hour by hour, a repeatable alert triage methodology, how escalation works, and how to write case notes that the next analyst, incident responder or auditor can rely on.",
  html: `
<p>Job descriptions for "SOC Analyst I" tend to list tools: SIEM, EDR, SOAR, ticketing. They rarely describe the work itself. This paper follows a composite Tier 1 analyst through a realistic day shift at a mid-sized enterprise SOC, then distills what they do into a triage methodology and documentation standard you can practice before your first day. The details vary between in-house SOCs and managed security service providers (MSSPs), but the rhythm is remarkably consistent.</p>

<h3>1. How a SOC is organized</h3>
<table>
<thead><tr><th>Role</th><th>Primary responsibilities</th></tr></thead>
<tbody>
<tr><td>Tier 1 analyst</td><td>Monitor queues, triage alerts, enrich and classify, close false positives, escalate likely incidents, handle routine requests (phishing reports, account lockouts)</td></tr>
<tr><td>Tier 2 analyst / incident responder</td><td>Deep investigation, scoping, containment actions, coordinating with IT, writing incident reports</td></tr>
<tr><td>Tier 3 / threat hunter</td><td>Proactive hunting, advanced forensics and malware analysis, handling major incidents</td></tr>
<tr><td>Detection engineer</td><td>Build and tune detections, own detection quality and coverage</td></tr>
<tr><td>SOC manager / shift lead</td><td>Staffing, metrics, escalation decisions, stakeholder communication</td></tr>
</tbody>
</table>
<p>Many modern SOCs blur the tiers, with analysts owning alerts end to end and automation absorbing the most repetitive Tier 1 work. That shift raises the bar: entry-level analysts are increasingly expected to investigate, not just forward.</p>

<h3>2. The shift, hour by hour</h3>
<h4>07:45 Shift handover</h4>
<p>Maya, a Tier 1 analyst, joins the handover call with the night shift. The outgoing analyst summarizes open cases: an ongoing investigation into suspicious PowerShell on a finance laptop (now with Tier 2), a noisy detection that fired 300 times overnight because of a software update, and a CISA advisory about a new VPN vulnerability that the vulnerability team is tracking. Maya reads the shift log and the case notes for anything assigned to her. <b>Good handovers are written, not just spoken.</b></p>
<h4>08:00 Situational awareness</h4>
<p>She checks the SOC dashboard for queue depth, SLA timers and any health alerts (a log source that stopped sending is itself an incident waiting to happen). She skims the threat intelligence digest: a phishing campaign impersonating a payroll provider is targeting her industry. She notes the sender domains and subject lines.</p>
<h4>08:15 to 10:30 Working the queue</h4>
<p>Alerts arrive prioritized by severity. In the first two hours Maya handles:</p>
<ul>
<li>Six user-reported phishing emails. Four are marketing spam, one is a credential-phishing page impersonating the payroll provider from the intel digest, and one is a simulated phish from the awareness team. For the real one she checks whether anyone clicked (proxy logs), whether anyone submitted credentials (a POST to the phishing domain), purges the message from all mailboxes with the email security tool, and blocks the domain.</li>
<li>An "impossible travel" sign-in alert: a user signed in from Chicago and, 20 minutes later, from Frankfurt. Enrichment shows the Frankfurt IP belongs to the company's own cloud proxy egress. False positive; she documents it and requests a tuning exclusion.</li>
<li>An EDR alert for a credential-dumping tool on a server. This one gets her full attention.</li>
</ul>
<h4>10:30 A real one</h4>
<p>The EDR alert shows <code>rundll32.exe</code> accessing LSASS memory using the <code>comsvcs.dll MiniDump</code> technique on a file server, run under a service account. Maya confirms the alert is not a known administrative activity, checks for other activity from that account in the last 24 hours, finds a new scheduled task created two hours earlier and an RDP logon from a workstation in marketing. Following the runbook, she isolates the server through the EDR (her SOC pre-authorizes Tier 1 to isolate non-critical servers for this alert type), opens an incident, escalates to Tier 2 by phone and in the ticket, and keeps writing timestamped notes. Within 30 minutes Tier 2 confirms a compromised workstation and begins scoping.</p>
<h4>12:30 Lunch, then requests</h4>
<p>Afternoons often bring service work: an executive's account locked by failed logins (password spraying or a stale password on a phone?), a request to check whether a vendor's domain appears in threat intel, and a question from IT about whether a blocked file is safe.</p>
<h4>14:00 Improvement time</h4>
<p>Healthy SOCs reserve time for something other than the queue. Maya writes a tuning request for the noisy software-update detection, with evidence: the parent process, the signed binary hash and the count of alerts. She then works through a lab on a new detection platform feature.</p>
<h4>15:45 Handover</h4>
<p>She updates every open case, writes the shift log, and briefs the next shift on the active incident, the blocked phishing domain and the tuning request.</p>

<h3>3. A triage methodology you can repeat</h3>
<p>Every alert, regardless of source, can be worked through the same questions. Memorize them until they become habit.</p>
<ol>
<li><b>Understand the alert.</b> What detection fired and why? Read the rule logic or description. What behavior is it designed to catch, and which ATT&amp;CK technique does it map to?</li>
<li><b>Validate the data.</b> Is the event real and complete? Check the raw log, not just the alert summary. Confirm timestamps and time zones.</li>
<li><b>Identify the entities.</b> Who (user), what (host, process, file hash), where (IPs, domains), when (time window).</li>
<li><b>Enrich.</b> Look up each entity: asset criticality and owner, user role and recent activity, IP and domain reputation, file hash reputation, related alerts on the same entities.</li>
<li><b>Establish context.</b> Is this normal for this user, host or application? Has it happened before? Is there a change ticket or known maintenance?</li>
<li><b>Look left and right.</b> What happened just before (the parent process, the email, the logon) and just after (network connections, child processes, file writes)? This is the step that separates good analysts from button-pushers.</li>
<li><b>Decide.</b> Classify the alert and choose the next action.</li>
<li><b>Document.</b> Record what you checked, what you found and why you decided as you did.</li>
</ol>
<h4>Classification outcomes</h4>
<table>
<thead><tr><th>Outcome</th><th>Meaning</th><th>Typical action</th></tr></thead>
<tbody>
<tr><td>True positive (malicious)</td><td>The detection fired correctly on malicious activity</td><td>Escalate or open incident; contain per runbook</td></tr>
<tr><td>Benign true positive</td><td>The behavior occurred as detected, but it was authorized (a pentest, an admin script)</td><td>Close with evidence; consider an exception</td></tr>
<tr><td>False positive</td><td>The detection fired on activity that does not match its intent</td><td>Close; submit tuning request</td></tr>
<tr><td>Undetermined</td><td>Insufficient data to decide</td><td>Escalate or request more data; never silently close</td></tr>
</tbody>
</table>
<div class="callout warn"><p>The most dangerous phrase in a SOC is "probably a false positive." If you cannot articulate the evidence that makes it benign, it is undetermined. Missed true positives in breach reports often trace back to alerts closed on assumption.</p></div>

<h3>4. Escalation: when and how</h3>
<p>Your runbooks and severity matrix define escalation, but common triggers include confirmed malicious execution, evidence of credential theft, lateral movement, data exfiltration indicators, any activity involving privileged accounts or Tier 0 systems, and anything you are unsure about with high potential impact.</p>
<p>A good escalation is a short, complete package that lets the next person act without re-doing your work:</p>
<pre><code>ESCALATION - INC-2026-1042 - Severity: High
Summary: Credential dumping (LSASS MiniDump via comsvcs.dll) on FS-03
         under svc_backup at 10:21 UTC. Host isolated 10:38 UTC.
Entities: FS-03 (10.10.5.23, file server, owner IT-Infra)
          svc_backup (service acct, member of Backup Operators)
          WS-MKT-114 (10.20.8.44) RDP source at 08:12 UTC
Evidence: EDR alert ID 88213; scheduled task "UpdateCheck" created 08:19 UTC
          running C:\\ProgramData\\upd.exe (SHA256 4f1a...); no change ticket.
Done:     Isolated FS-03; collected task XML and binary hash; checked
          svc_backup logons (3 hosts in 24h, list in case).
Ask:      Scope WS-MKT-114; decide on svc_backup credential reset.</code></pre>
<p>Notice the structure: summary, entities, evidence, actions already taken, and a clear ask. Time stamps in UTC avoid confusion across shifts and regions.</p>

<h3>5. Documentation standards</h3>
<p>Case notes are evidence. They may be read by the next shift, an incident responder, legal counsel, an auditor or a regulator months later. Write accordingly.</p>
<ul>
<li><b>Be factual and specific.</b> "Checked proxy logs 09:00 to 11:00 UTC for user jdoe; no connections to evil-payroll[.]com" beats "no clicks."</li>
<li><b>Record what you did not find.</b> Negative results show scope and prevent duplicate work.</li>
<li><b>Show your reasoning.</b> State why you classified the alert as you did, with the decisive evidence.</li>
<li><b>Defang indicators.</b> Write <code>hxxps://evil[.]com</code> and <code>203.0.113[.]5</code> so no one clicks them by accident and ticketing systems do not auto-link them.</li>
<li><b>Use UTC and consistent formats.</b> ISO 8601 times (<code>2026-10-20T10:21:00Z</code>).</li>
<li><b>Preserve, do not paste, sensitive data.</b> Reference evidence locations rather than pasting passwords or personal data into tickets.</li>
<li><b>Close the loop.</b> Every case ends with a disposition, the actions taken and any follow-ups (tuning requests, user notifications).</li>
</ul>

<h3>6. Metrics that shape your day</h3>
<table>
<thead><tr><th>Metric</th><th>What it measures</th><th>Caveat</th></tr></thead>
<tbody>
<tr><td>Mean time to acknowledge (MTTA)</td><td>How quickly alerts are picked up</td><td>Encourages speed; must be balanced with quality</td></tr>
<tr><td>Mean time to detect / respond (MTTD / MTTR)</td><td>How quickly threats are found and contained</td><td>Definitions vary; be consistent</td></tr>
<tr><td>False positive rate per detection</td><td>Detection quality</td><td>High rates cause alert fatigue</td></tr>
<tr><td>Escalation accuracy</td><td>Share of escalations Tier 2 confirms as warranted</td><td>Too low wastes Tier 2; too high may mean under-escalation</td></tr>
<tr><td>SLA compliance</td><td>Alerts handled within target times by severity</td><td>Can incentivize closing too fast</td></tr>
</tbody>
</table>
<p>Metrics should drive improvement, not punish analysts. If you are measured purely on alerts closed per hour, you will be tempted to close undetermined alerts. Raise that concern; it is a known anti-pattern.</p>

<h3>7. Surviving and thriving</h3>
<ul>
<li><b>Alert fatigue is real.</b> Take breaks, rotate tasks, and push for tuning. Every false positive you document with evidence makes tomorrow better.</li>
<li><b>Learn the environment.</b> Knowing which servers are domain controllers, which service accounts run backups and which teams use PowerShell daily lets you triage in minutes instead of hours.</li>
<li><b>Use automation, understand it.</b> SOAR playbooks enrich and sometimes close alerts automatically. Know what they check so you can spot what they miss.</li>
<li><b>Ask early.</b> Escalating a question costs minutes; sitting on a real intrusion costs far more.</li>
<li><b>Keep a personal notebook</b> of queries, log locations and lessons. It becomes your most valuable tool.</li>
</ul>
<div class="callout real"><p>In interviews, describe your triage process using the eight questions above and walk through a lab you completed. Hiring managers are looking for structured thinking and clear writing far more than tool names.</p></div>

<h3>Key takeaways</h3>
<ul>
<li>A Tier 1 shift combines handover, situational awareness, queue work, real incidents, service requests and improvement time.</li>
<li>Triage every alert with the same steps: understand, validate, identify entities, enrich, establish context, look left and right, decide, document.</li>
<li>Classify alerts as true positive, benign true positive, false positive or undetermined; never close undetermined alerts on assumption.</li>
<li>Escalations should contain a summary, entities, evidence, actions taken and a clear ask, with UTC timestamps.</li>
<li>Case notes are evidence: be factual, record negative results, show reasoning and defang indicators.</li>
<li>Metrics should improve the SOC, not encourage closing alerts too fast; documented tuning requests reduce alert fatigue.</li>
</ul>
`,
  references: [
    { title: "NIST SP 800-61 Rev. 3 — Incident Response Recommendations and Considerations for Cybersecurity Risk Management", url: "https://csrc.nist.gov/pubs/sp/800/61/r3/final" },
    { title: "MITRE ATT&CK — Enterprise Matrix", url: "https://attack.mitre.org/" },
    { title: "NIST SP 800-92 — Guide to Computer Security Log Management", url: "https://csrc.nist.gov/pubs/sp/800/92/final" }
  ]
});

CP.papers.push({
  id: "paper-detection-engineering",
  title: "Detection Engineering: Detection-as-Code, Sigma, Coverage and Alert Quality",
  module: "p2-m3",
  minutes: 20,
  summary: "How mature SOCs build detections like software: the detection lifecycle, detection-as-code pipelines, writing portable Sigma rules, measuring ATT&CK coverage honestly, tuning, and the metrics that define alert quality.",
  html: `
<p>A SIEM with no good detections is an expensive log archive. A SIEM with thousands of poorly built detections is worse: it buries analysts in noise until the real attack slips through unnoticed. <b>Detection engineering</b> is the discipline of deliberately designing, testing, deploying and maintaining the logic that turns telemetry into actionable alerts. Over the past several years it has adopted the practices of software engineering (version control, peer review, automated testing and continuous deployment) under the banner of <b>detection-as-code</b>. This paper explains the lifecycle, the tools and the metrics.</p>

<h3>1. The detection lifecycle</h3>
<ol>
<li><b>Requirement.</b> Every detection starts with a reason: a threat intelligence report about an actor targeting your sector, a gap found in ATT&amp;CK coverage, a red team finding, an incident post-mortem, or a new technology being deployed.</li>
<li><b>Research.</b> Understand the behavior. How does the technique work? What artifacts does it leave? Which data sources capture them? Reproduce it in a lab if you can.</li>
<li><b>Data validation.</b> Confirm the required telemetry exists, is parsed correctly and arrives reliably. Many detections fail silently because a field is named differently than assumed or a log source was never onboarded.</li>
<li><b>Development.</b> Write the logic, choosing the right approach (see section 3).</li>
<li><b>Testing.</b> Run it against known-malicious samples (true positive tests) and against weeks of production data to estimate false positive volume.</li>
<li><b>Peer review and deployment.</b> Another engineer reviews logic, documentation and test results; the rule deploys through a pipeline.</li>
<li><b>Monitoring and tuning.</b> Track alert volume and outcomes; tune exclusions; refine logic.</li>
<li><b>Retirement.</b> Remove detections that no longer provide value or whose data source is gone.</li>
</ol>

<h3>2. Detection-as-code</h3>
<p>Detection-as-code treats detection rules as source code stored in a version control repository. A typical pipeline:</p>
<pre><code>detections/
  windows/
    proc_creation_lsass_minidump_comsvcs.yml
    ...
  tests/
    proc_creation_lsass_minidump_comsvcs/
      true_positive.json
      benign_admin_activity.json
  pipeline/
    validate.py    # schema, required metadata, ATT&amp;CK tags
    convert.sh     # Sigma -&gt; SIEM query language
    deploy.py      # push via SIEM API</code></pre>
<p>A pull request triggers automated checks: the rule parses, required metadata (author, description, ATT&amp;CK mapping, severity, false positive notes, a runbook link) is present, the rule matches its true positive test data and does not match its benign test data. After review and merge, the pipeline converts and deploys the rule. Benefits include:</p>
<ul>
<li><b>Change history and accountability</b>: who changed what, when and why.</li>
<li><b>Peer review</b>: a second pair of eyes catches logic errors and performance problems.</li>
<li><b>Regression testing</b>: tuning one rule cannot silently break it.</li>
<li><b>Portability and recovery</b>: detections can be redeployed to a new SIEM or tenant.</li>
<li><b>Collaboration</b>: rules can be shared with peers and the community.</li>
</ul>

<h3>3. Approaches to detection logic</h3>
<table>
<thead><tr><th>Approach</th><th>Example</th><th>Strengths</th><th>Weaknesses</th></tr></thead>
<tbody>
<tr><td>Atomic indicator matching</td><td>Connection to a known C2 IP; known malicious hash</td><td>Simple, precise</td><td>Trivially evaded; indicators age quickly</td></tr>
<tr><td>Behavioral / TTP-based</td><td><code>rundll32</code> loading <code>comsvcs.dll</code> with "MiniDump" in the command line</td><td>Durable; targets what attackers must do</td><td>Needs good telemetry and tuning</td></tr>
<tr><td>Threshold / aggregation</td><td>More than 20 failed logons for distinct users from one IP in 5 minutes</td><td>Catches spraying and brute force</td><td>Threshold choice is a trade-off</td></tr>
<tr><td>Sequence / correlation</td><td>New service installed followed by outbound connection from that service within 2 minutes</td><td>High fidelity</td><td>More complex; can miss reordered steps</td></tr>
<tr><td>Anomaly / statistical</td><td>User downloads 50 times their 30-day average from SharePoint</td><td>Finds unknown patterns</td><td>Noisy; needs baselines and context</td></tr>
</tbody>
</table>
<p>David Bianco's <b>Pyramid of Pain</b> explains why behavioral detections are worth the effort: changing a hash or an IP costs an attacker almost nothing, while changing their tools and techniques (TTPs) is expensive. Good detection programs invest most heavily near the top of the pyramid.</p>

<h3>4. Sigma: a portable rule format</h3>
<p><b>Sigma</b> is an open, YAML-based format for describing log-based detections in a vendor-neutral way, maintained by the open-source SigmaHQ project. A Sigma rule can be converted (with the pySigma toolchain and backends) into queries for many SIEMs and data platforms. That makes Sigma the lingua franca for sharing detections. An example:</p>
<pre><code>title: LSASS Memory Dump via Comsvcs.dll
id: 2b7c1d1e-6f3a-4c55-9d7e-0a8f3b9e1c42
status: test
description: Detects use of rundll32 with comsvcs.dll MiniDump to dump process memory, commonly LSASS.
references:
  - https://attack.mitre.org/techniques/T1003/001/
author: CyberPath Detection Team
date: 2026-10-01
tags:
  - attack.credential-access
  - attack.t1003.001
logsource:
  category: process_creation
  product: windows
detection:
  selection_img:
    Image|endswith: '\\rundll32.exe'
  selection_cli:
    CommandLine|contains|all:
      - 'comsvcs'
      - 'MiniDump'
  condition: selection_img and selection_cli
falsepositives:
  - Rare legitimate troubleshooting by administrators
level: high</code></pre>
<p>Key elements: <b>logsource</b> abstracts where the data comes from (Sysmon Event ID 1, Windows Security 4688 with command-line logging, or an EDR's process table); <b>detection</b> contains named selections using field modifiers such as <code>endswith</code>, <code>contains</code> and <code>all</code>; <b>condition</b> combines selections with boolean logic; <b>tags</b> map to ATT&amp;CK; <b>falsepositives</b> and <b>level</b> guide triage. Sigma also supports correlation rules (counts, sequences) for multi-event logic.</p>
<div class="callout tip"><p>The public SigmaHQ repository contains thousands of community rules. Treat them as a starting point, not a deployment: test each against your data, because field names, logging configuration and normal behavior differ in every environment.</p></div>

<h3>5. Measuring ATT&amp;CK coverage honestly</h3>
<p>Mapping detections to MITRE ATT&amp;CK techniques lets you visualize coverage, typically as a heat map in the ATT&amp;CK Navigator. It is one of the most useful and most abused tools in detection engineering.</p>
<h4>Pitfalls</h4>
<ul>
<li><b>One rule does not equal coverage.</b> A technique such as T1059.001 PowerShell has many procedures. A single rule for encoded commands does not cover download cradles, AMSI bypasses or obfuscated scripts.</li>
<li><b>Mapping is not validation.</b> A rule tagged with a technique has not been proven to fire until you test it.</li>
<li><b>All techniques are not equal.</b> Prioritize techniques used by threat actors relevant to you and techniques that appear frequently across intrusions.</li>
<li><b>Coverage depends on data.</b> If a data source is missing on half your hosts, so is your coverage.</li>
</ul>
<h4>A better model</h4>
<p>Score each technique on a scale rather than a binary: for example 0 (no data), 1 (data available, no detection), 2 (detection exists, untested), 3 (detection tested with emulation), 4 (detection tested and tuned with low false positives across procedures). Validate with adversary emulation, running safe, scripted versions of techniques (open-source libraries of atomic tests are widely used for this) and checking which alerts fire. Repeat on a schedule, because environments drift. Recent ATT&amp;CK releases have also restructured detection guidance into reusable detection strategies and analytics, which can help you reason about procedures rather than technique labels.</p>

<h3>6. Tuning without blinding yourself</h3>
<p>Tuning reduces false positives, but every exclusion is also a potential blind spot that attackers can exploit. Principles for safe tuning:</p>
<ul>
<li><b>Exclude narrowly.</b> Exclude a specific signed binary hash and parent process on specific hosts, not "anything in C:\\Program Files." Attackers love to drop tools in excluded paths.</li>
<li><b>Prefer immutable attributes.</b> Code-signing certificate and hash are harder to fake than file name or path.</li>
<li><b>Document every exclusion</b> with a reason, the requester, a date and a review date.</li>
<li><b>Review exclusions periodically</b> and remove those no longer needed.</li>
<li><b>Consider lowering severity</b> or routing to a hunting queue instead of suppressing completely.</li>
<li><b>Use risk-based alerting.</b> Instead of alerting on each low-fidelity event, add risk points to the user or host entity and alert when an entity's cumulative risk crosses a threshold. This turns many weak signals into a few strong ones.</li>
</ul>

<h3>7. Alert quality metrics</h3>
<table>
<thead><tr><th>Metric</th><th>Definition</th><th>Use</th></tr></thead>
<tbody>
<tr><td>Precision (true positive rate of alerts)</td><td>True positives divided by all alerts from the rule</td><td>Primary quality indicator per rule</td></tr>
<tr><td>Alert volume per rule</td><td>Alerts per day or week</td><td>Spot noisy rules and sudden changes</td></tr>
<tr><td>Benign true positive share</td><td>Correct firings on authorized activity</td><td>High values suggest the rule needs context or exclusions</td></tr>
<tr><td>Mean time to triage per rule</td><td>Average analyst time per alert</td><td>Reveals rules lacking context or runbooks</td></tr>
<tr><td>Detection latency</td><td>Time from event to alert</td><td>Ingestion and scheduling delays</td></tr>
<tr><td>Validated coverage</td><td>Prioritized techniques with tested detections</td><td>Program-level progress</td></tr>
<tr><td>Silent rule rate</td><td>Rules that have never fired and have not been tested recently</td><td>May indicate broken data or logic</td></tr>
</tbody>
</table>
<p>Recall (the share of real attacks you detect) is the metric everyone wants and nobody can measure directly. Emulation exercises, purple teaming and post-incident reviews are the best proxies: every incident should end with the question "which detection should have caught this earlier?"</p>

<h3>8. Writing an alert an analyst can use</h3>
<p>A detection is not done when it fires; it is done when an analyst can act on it quickly. Every alert should carry:</p>
<ul>
<li>A clear title stating the behavior, not just the rule ID.</li>
<li>The key entities (user, host, process, command line, parent, destination).</li>
<li>Why it matters, the ATT&amp;CK mapping and expected false positives.</li>
<li>A link to a runbook with triage steps and containment options.</li>
<li>Pivot links or queries to the surrounding activity.</li>
</ul>
<div class="callout real"><p>Detection engineering is one of the most common promotion paths out of Tier 1. Analysts who submit well-evidenced tuning requests and propose new detections from incidents they worked are effectively doing the job already. Keep a portfolio of rules you have written and tested in your home lab.</p></div>

<h3>Key takeaways</h3>
<ul>
<li>Detection engineering is a lifecycle: requirement, research, data validation, development, testing, review, deployment, tuning and retirement.</li>
<li>Detection-as-code brings version control, peer review, automated tests and CI/CD to detection rules.</li>
<li>Behavioral (TTP-based) detections are more durable than indicator matching, as the Pyramid of Pain illustrates.</li>
<li>Sigma is the vendor-neutral YAML format for sharing log detections; always test community rules against your own data.</li>
<li>ATT&amp;CK coverage maps are useful only when graded and validated with adversary emulation; a tag is not coverage.</li>
<li>Tune narrowly using immutable attributes, document and review exclusions, and use risk-based alerting to combine weak signals.</li>
<li>Track per-rule precision, volume, triage time and latency; use incidents and emulation to estimate what you miss.</li>
</ul>
`,
  references: [
    { title: "MITRE ATT&CK — OS Credential Dumping: LSASS Memory (T1003.001)", url: "https://attack.mitre.org/techniques/T1003/001/" },
    { title: "MITRE ATT&CK — Enterprise Matrix", url: "https://attack.mitre.org/" },
    { title: "MITRE D3FEND — A knowledge graph of cybersecurity countermeasures", url: "https://d3fend.mitre.org/" },
    { title: "NIST SP 800-92 — Guide to Computer Security Log Management", url: "https://csrc.nist.gov/pubs/sp/800/92/final" }
  ]
});

