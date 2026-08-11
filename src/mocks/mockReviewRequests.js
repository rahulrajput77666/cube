const mockReviewRequests = [
  {
    id: 1,
    employeeName: "Rahul Rajput",
    submittedOn: "10 Aug 2026",
    status: "PENDING",

    title: "WebLogic Deployment Failure Fix",

    keys: [
      "weblogic",
      "oracle",
      "deployment",
      "datasource",
    ],

    description: `
Datasource was missing in WebLogic.

Steps:

1. Created datasource.
2. Targeted datasource.
3. Restarted managed server.
4. Redeployed application.

Deployment completed successfully.
    `,

    attachments: [
      {
        id: 1,
        name: "deployment-guide.pdf",
        size: "1.5 MB",
      },
      {
        id: 2,
        name: "error-log.txt",
        size: "120 KB",
      },
    ],
  },

  {
    id: 2,
    employeeName: "Amit Kumar",
    submittedOn: "09 Aug 2026",
    status: "PENDING",

    title: "Flexcube Batch Failure Resolution",

    keys: [
      "flexcube",
      "batch",
      "scheduler",
      "eod",
    ],

    description: `
Scheduler service was down.

Resolution:

1. Checked scheduler status.
2. Restarted service.
3. Re-ran EOD batch.
4. Verified logs.
    `,

    attachments: [
      {
        id: 3,
        name: "scheduler-guide.pdf",
        size: "2.2 MB",
      },
    ],
  },

  {
    id: 3,
    employeeName: "Suresh Kumar",
    submittedOn: "08 Aug 2026",
    status: "APPROVED",

    title: "ATM Daily Limit Configuration",

    keys: [
      "atm",
      "oracle",
      "cash",
      "limits",
    ],

    description: `
Configured ATM daily withdrawal limits.

Changes:

1. Updated transaction limits.
2. Applied customer level restrictions.
3. Validated branch overrides.
4. Completed UAT testing.

Configuration approved and published.
    `,

    attachments: [
      {
        id: 4,
        name: "atm-limit-guide.pdf",
        size: "850 KB",
      },
      {
        id: 5,
        name: "uat-results.xlsx",
        size: "320 KB",
      },
    ],
  },

  {
    id: 4,
    employeeName: "Veena Sharma",
    submittedOn: "07 Aug 2026",
    status: "REJECTED",

    title: "Security Audit Documentation",

    keys: [
      "security",
      "audit",
      "compliance",
      "risk",
    ],

    description: `
Security audit observations and findings.

Issues:

1. Missing remediation details.
2. Incomplete evidence documents.
3. Missing approval references.

Submission rejected and returned for corrections.
    `,

    attachments: [
      {
        id: 6,
        name: "security-audit.pdf",
        size: "3.1 MB",
      },
      {
        id: 7,
        name: "risk-analysis.docx",
        size: "1.4 MB",
      },
    ],
  },

  {
    id: 5,
    employeeName: "Priya Reddy",
    submittedOn: "06 Aug 2026",
    status: "APPROVED",

    title: "Oracle DataSource Troubleshooting Guide",

    keys: [
      "oracle",
      "datasource",
      "jdbc",
      "weblogic",
    ],

    description: `
Troubleshooting guide for datasource connection failures.

Covered:

1. JDBC URL validation.
2. Driver configuration.
3. Connection pool settings.
4. Server restart procedures.

Successfully reviewed and published.
    `,

    attachments: [
      {
        id: 8,
        name: "datasource-guide.pdf",
        size: "2.5 MB",
      },
    ],
  },

  {
    id: 6,
    employeeName: "Karthik N",
    submittedOn: "05 Aug 2026",
    status: "REJECTED",

    title: "Flexcube Interface Setup Notes",

    keys: [
      "flexcube",
      "interface",
      "integration",
    ],

    description: `
Interface setup document submitted.

Review comments:

1. Screenshots missing.
2. Configuration steps incomplete.
3. Validation evidence not attached.

Rejected for rework.
    `,

    attachments: [
      {
        id: 9,
        name: "interface-notes.docx",
        size: "500 KB",
      },
    ],
  },
];

export default mockReviewRequests;