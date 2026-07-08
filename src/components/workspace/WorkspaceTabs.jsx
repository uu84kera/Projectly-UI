import React from "react";

const workspaceTabs = [
  { id: "projects", label: "Projects" },
  { id: "members", label: "Members" },
  { id: "archived-projects", label: "Archived Projects" },
  { id: "settings", label: "Settings" },
];

function WorkspaceTab({ isActive = false, label, onClick }) {
  return (
    <button className={`workspace-tab ${isActive ? "is-active" : ""}`} type="button" onClick={onClick}>
      {label}
    </button>
  );
}

function WorkspaceTabs({ activeTab, onChangeTab, workspaceName }) {
  return (
    <nav className="workspace-tabs" aria-label={`${workspaceName} sections`}>
      {workspaceTabs.map((tab) => (
        <WorkspaceTab
          isActive={activeTab === tab.id}
          label={tab.label}
          key={tab.id}
          onClick={() => onChangeTab(tab.id)}
        />
      ))}
    </nav>
  );
}

export default WorkspaceTabs;
