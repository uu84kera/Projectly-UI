import React, { useState } from "react";
import { guestWorkspaces, inboxItems, user, workspaces } from "../../data/mockWorkspaceData.js";
import AllProjectsPage from "../../pages/app/AllProjectsPage.jsx";
import InboxPage from "../../pages/app/InboxPage.jsx";
import ProjectBacklogPage from "../../pages/app/ProjectBacklogPage.jsx";
import UserSettingsPage from "../../pages/app/UserSettingsPage.jsx";
import WorkspaceProjectsPage from "../../pages/app/WorkspaceProjectsPage.jsx";
import Sidebar from "./Sidebar.jsx";

function AppShell() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [activePage, setActivePage] = useState({ name: "all-projects" });
  const [archivedProjectIds, setArchivedProjectIds] = useState([]);
  const activeWorkspace =
    workspaces.find((workspace) => workspace.id === activePage.workspaceId) ?? workspaces[0];
  const allProjects = workspaces.flatMap((workspace) => workspace.projects);
  const activeProject =
    allProjects.find((project) => project.id === activePage.projectId) ?? allProjects[0];
  const activeProjectWorkspace =
    workspaces.find((workspace) =>
      workspace.projects.some((project) => project.id === activeProject.id)
    ) ?? workspaces[0];
  function archiveProject(projectId) {
    setArchivedProjectIds((projectIds) =>
      projectIds.includes(projectId) ? projectIds : [...projectIds, projectId]
    );

    const projectWorkspace = workspaces.find((workspace) =>
      workspace.projects.some((project) => project.id === projectId)
    );

    if (projectWorkspace) {
      setActivePage({
        name: "workspace-projects",
        workspaceId: projectWorkspace.id,
        workspaceTab: "archived-projects",
      });
    }
  }

  function restoreProject(projectId) {
    setArchivedProjectIds((projectIds) => projectIds.filter((archivedProjectId) => archivedProjectId !== projectId));
  }

  function openAllProjects() {
    setActivePage({ name: "all-projects" });
  }

  function openInbox() {
    setActivePage({ name: "inbox" });
  }

  function openUserSettings() {
    setActivePage({ name: "user-settings" });
  }

  function openWorkspaceProjects(workspaceId, workspaceTab = "projects", options = {}) {
    setActivePage({
      name: "workspace-projects",
      workspaceId,
      workspaceTab,
      openCreateProject: options.openCreateProject ?? false,
    });
  }

  function openProject(projectId) {
    const projectWorkspace = workspaces.find((workspace) =>
      workspace.projects.some((project) => project.id === projectId)
    );

    setActivePage({
      name: "project-backlog",
      projectId,
      workspaceId: projectWorkspace?.id,
    });
  }

  return (
    <main className={`app-layout ${isSidebarVisible ? "" : "is-sidebar-hidden"}`}>
      {isSidebarVisible && (
        <Sidebar
          activePage={activePage}
          onOpenAllProjects={openAllProjects}
          onOpenInbox={openInbox}
          onOpenProject={openProject}
          onOpenUserSettings={openUserSettings}
          onOpenWorkspaceProjects={openWorkspaceProjects}
          user={user}
          guestWorkspaces={guestWorkspaces}
          workspaces={workspaces}
        />
      )}
      <button
        className="sidebar-toggle-button"
        type="button"
        aria-label={isSidebarVisible ? "Hide sidebar" : "Show sidebar"}
        aria-pressed={!isSidebarVisible}
        onClick={() => setIsSidebarVisible((isVisible) => !isVisible)}
      >
        <svg
          aria-hidden="true"
          className="icon-svg"
          fill="none"
          height="18"
          viewBox="0 0 24 24"
          width="18"
        >
          <rect
            height="16"
            rx="3"
            stroke="currentColor"
            strokeWidth="2"
            width="18"
            x="3"
            y="4"
          />
          <path d="M9 5v14" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
        </svg>
      </button>
      {activePage.name === "inbox" ? (
        <InboxPage inboxItems={inboxItems} />
      ) : activePage.name === "user-settings" ? (
        <UserSettingsPage user={user} />
      ) : activePage.name === "project-backlog" ? (
        <ProjectBacklogPage
          onArchiveProject={archiveProject}
          project={activeProject}
          workspace={activeProjectWorkspace}
        />
      ) : activePage.name === "workspace-projects" ? (
        <WorkspaceProjectsPage
          archivedProjectIds={archivedProjectIds}
          initialTab={activePage.workspaceTab}
          shouldOpenCreateProject={activePage.openCreateProject}
          onArchiveProject={archiveProject}
          onOpenProject={openProject}
          onRestoreProject={restoreProject}
          workspace={activeWorkspace}
        />
      ) : (
        <AllProjectsPage
          guestWorkspaces={guestWorkspaces}
          onOpenProject={openProject}
          onOpenWorkspaceProjects={openWorkspaceProjects}
          workspaces={workspaces}
        />
      )}
    </main>
  );
}

export default AppShell;
