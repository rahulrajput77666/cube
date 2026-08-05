const mockKnowledge = [
  {
    id: 1,

    title: "WebLogic Domain Configuration Guide",

    description:
      "Step by step guide to create and configure WebLogic domain for FLEXCUBE deployment.",

    fullDescription: `
WebLogic Domain Configuration Guide

This document provides a complete guide for creating and managing a WebLogic domain used for Oracle FLEXCUBE deployment.

Prerequisites

1. Install JDK
2. Install Oracle WebLogic Server
3. Verify environment variables
4. Configure repository schemas

Domain Creation

Step 1:
Launch the Configuration Wizard.

Step 2:
Create a new domain.

Step 3:
Select the required templates.

Step 4:
Configure administration server.

Step 5:
Configure managed servers.

Step 6:
Configure machine settings.

Step 7:
Review configuration summary and create domain.

Deployment Process

Deploy EAR and WAR files.
Verify datasource connectivity.
Validate JMS configuration.
Restart managed servers.

Monitoring

Monitor server health.
Review logs regularly.
Check memory utilization.
Track JVM performance.

Troubleshooting

Common startup issues include:
- Port conflicts
- Incorrect datasource credentials
- Missing libraries
- Network connectivity failures

Best Practices

- Use separate domains for development and production.
- Configure backups regularly.
- Enable monitoring and alerting.
- Maintain deployment documentation.

Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Lorem ipsum dolor sit amet, consectetur adipiscing elit.

End of document.
`,

    chip1: "weblogic",
    chip2: "oracle",
    chip3: "domain",
    chip4: "deployment",

    uploadedBy: "admin",
    date: "12 May 2025",
    downloads: 256,

    attachments: [
      {
        id: 1,
        name: "weblogic_domain_guide.pdf",
        size: "1.25 MB",
        fileUrl: "/documents/weblogic_domain_guide.pdf",
        previewUrl:
          "/documents/weblogic_domain_guide.pdf",
      },
      {
        id: 2,
        name: "readme.txt",
        size: "2.34 KB",
        fileUrl: "/documents/readme.txt",
        previewUrl:
          "/documents/readme.txt",
      },
    ],
  },

  {
    id: 2,

    title: "FLEXCUBE Installation Guide",

    description:
      "Installation and deployment to create and  guide for FLEXCUBE application.",

    fullDescription: `
FLEXCUBE Installation Guide

This guide explains the complete installation process for Oracle FLEXCUBE.

Requirements

- Oracle Database
- WebLogic Server
- Java Runtime
- Application binaries

Installation Steps

1. Prepare database schemas.
2. Configure datasource connections.
3. Install middleware components.
4. Deploy FLEXCUBE artifacts.
5. Verify application startup.

Post Installation

- Configure users.
- Configure security roles.
- Validate interfaces.
- Run smoke testing.

Maintenance

Regular maintenance should include log review,
backup verification, and performance monitoring.
`,

    chip1: "flexcube",
    chip2: "oracle",
    chip3: "banking",
    chip4: "installation",

    uploadedBy: "john.doe",
    date: "10 May 2025",
    downloads: 189,

    attachments: [
      {
        id: 1,
        name: "flexcube_installation.pdf",
        size: "2.10 MB",
        fileUrl:
          "/documents/flexcube_installation.pdf",
        previewUrl:
          "/documents/flexcube_installation.pdf",
      },
      {
        id: 2,
        name: "prerequisites.docx",
        size: "120 KB",
        fileUrl:
          "/documents/prerequisites.docx",
        previewUrl:
          "/documents/prerequisites.docx",
      },
    ],
  },

  {
    id: 3,

    title: "ATM Daily Limit Configuration",

    description:
      "Guide for ATM withdrawal and transaction limit configuration.",

    fullDescription: `
ATM Daily Limit Configuration

This document explains ATM transaction limits and withdrawal configuration procedures.

Topics Covered

- Daily limit setup
- Customer level limits
- Branch overrides
- Emergency limit changes
- Reporting

Configuration changes should be approved according to operational policies before deployment.
`,

    chip1: "atm",
    chip2: "cash",
    chip3: "withdrawal",
    chip4: "limit",

    uploadedBy: "system.admin",
    date: "08 May 2025",
    downloads: 95,

    attachments: [
      {
        id: 1,
        name: "atm_limit_guide.pdf",
        size: "950 KB",
        fileUrl:
          "/documents/atm_limit_guide.pdf",
        previewUrl:
          "/documents/atm_limit_guide.pdf",
      },
    ],
  },
];

/*
BACKEND INTEGRATION

DELETE THIS FILE AFTER API INTEGRATION

GET /knowledge/search
GET /knowledge/{id}
GET /knowledge/{id}/attachments
GET /attachments/{attachmentId}/download
GET /attachments/{attachmentId}/preview

Expected Response Structure:

{
  id,
  title,
  description,
  fullDescription,
  uploadedBy,
  date,
  downloads,
  tags: [],
  attachments: [
    {
      id,
      name,
      size,
      fileUrl,
      previewUrl
    }
  ]
}
*/

export default mockKnowledge;