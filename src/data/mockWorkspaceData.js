export const user = {
  name: "John",
  initials: "JO",
  email: "john@example.com",
  theme: "System preference",
};

export const workspaces = [
  {
    id: "workspace-1",
    name: "Workspace 1",
    members: [
      {
        id: "member-1",
        name: "John",
        username: "@john",
        initials: "JO",
        role: "Owner",
        membership: "Workspace member",
      },
      {
        id: "member-2",
        name: "Amy",
        username: "@amy",
        initials: "AM",
        role: "Admin",
        membership: "Workspace member",
      },
    ],
    singleBoardGuests: [
      {
        id: "guest-1",
        name: "Kera",
        username: "@kera2",
        initials: "K",
        lastActive: "Jun 2026",
        projects: ["Project2"],
      },
    ],
    projects: [
      {
        id: "project-1",
        name: "Project1",
        epics: [],
      },
      {
        id: "project-2",
        name: "Project2",
        epics: [],
      },
    ],
  },
  {
    id: "workspace-2",
    name: "Workspace 2",
    projects: [{ id: "project-3", name: "w2-Project1" }],
  },
];

export const guestWorkspaces = [
  {
    id: "guest-workspace1",
    name: "Guest workspace1",
    projects: [{ id: "guest-project-1", name: "Invited Project" }],
  },
];

export const inboxItems = [
  {
    id: "mention-1",
    type: "mention",
    actor: "Amy",
    projectName: "Project1",
    cardTitle: "card1-1",
    message: "@john can you review this card before the sprint starts?",
    time: "Today",
  },
  {
    id: "mention-2",
    type: "mention",
    actor: "Kera",
    projectName: "Project2",
    cardTitle: "Guest access setup",
    message: "@john I added the first checklist item in comments and activity.",
    time: "Yesterday",
  },
  {
    id: "invite-1",
    type: "project-invite",
    actor: "Kera",
    workspaceName: "Guest workspace1",
    projectName: "Invited Project",
    message: "Kera invited you to join Invited Project.",
    time: "Jun 2026",
  },
];
