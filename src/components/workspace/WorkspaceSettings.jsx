import React, { useState } from "react";

function WorkspaceSettings({ workspace }) {
  const [workspaceName, setWorkspaceName] = useState(workspace.name);

  return (
    <div className="workspace-settings-page">
      <section className="settings-panel">
        <h2>Rename workspace</h2>
        <p>Update the workspace name shown in the sidebar and workspace pages.</p>
        <label className="settings-field">
          <span>Workspace name</span>
          <input
            type="text"
            value={workspaceName}
            onChange={(event) => setWorkspaceName(event.target.value)}
          />
        </label>
        <div className="settings-actions">
          <button className="settings-save-button" type="button">
            Save changes
          </button>
        </div>
      </section>

      <section className="settings-panel">
        <h2>Delete workspace</h2>
        <p>Delete this workspace and its projects. This is a destructive action.</p>
        <button className="settings-delete-button" type="button">
          Delete workspace
        </button>
      </section>
    </div>
  );
}

export default WorkspaceSettings;
