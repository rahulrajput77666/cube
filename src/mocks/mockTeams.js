const mockTeams = [
  {
    managerName: "Rahul Singh",
    department: "DMS",
    currentProject: "Knowledge Repository",
    lastProject: "Content Automation",

    leads: [
      {
        leadId: "L001",
        leadName: "Ravi Kumar",
        project: "DMS Enhancement",
        lastProject: "Knowledge Automation",
        rating: 4.5,

        employees: [
          {
            empId: "EMP001",
            name: "Rahul Rajput",
            department: "DMS",
            project: "Knowledge Repository",
            lastProject: "Content Automation",
            experience: 2,
            rating: 4.4,
          },
          {
            empId: "EMP002",
            name: "Amit Kumar",
            department: "DMS",
            project: "Upload Workflow",
            lastProject: "Knowledge Repository",
            experience: 3,
            rating: 4.2,
          },
          {
            empId: "EMP003",
            name: "Suresh Patel",
            department: "DMS",
            project: "Review Approval",
            lastProject: "Knowledge Repository",
            experience: 4,
            rating: 4.6,
          },
        ],
      },

      {
        leadId: "L002",
        leadName: "Vikas Sharma",
        project: "Issue Tracking",
        lastProject: "DMS Enhancement",
        rating: 4.3,

        employees: [
          {
            empId: "EMP004",
            name: "Kiran Kumar",
            department: "DMS",
            project: "Bug Resolution",
            lastProject: "Issue Tracking",
            experience: 2,
            rating: 4.0,
          },
          {
            empId: "EMP005",
            name: "Deepak Verma",
            department: "DMS",
            project: "Project Planning",
            lastProject: "Issue Tracking",
            experience: 5,
            rating: 4.7,
          },
        ],
      },
    ],
  },

  {
    managerName: "Guru Prasad",
    department: "DMS",
    currentProject: "SMS Module",
    lastProject: "Notification Service",

    leads: [
      {
        leadId: "L003",
        leadName: "Arjun Reddy",
        project: "SMS Module",
        lastProject: "Notification Service",
        rating: 4.4,

        employees: [
          {
            empId: "EMP006",
            name: "Manoj Kumar",
            department: "DMS",
            project: "SMS Integration",
            lastProject: "Notification Service",
            experience: 3,
            rating: 4.1,
          },
          {
            empId: "EMP007",
            name: "Praveen",
            department: "DMS",
            project: "Notification Service",
            lastProject: "SMS Module",
            experience: 4,
            rating: 4.3,
          },
        ],
      },
    ],
  },
];

export default mockTeams;