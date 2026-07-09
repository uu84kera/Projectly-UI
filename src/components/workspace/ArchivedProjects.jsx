import React from "react";

function ArchivedProjects({ onRestoreProject, projects }) {
  return (
    <div className="workspace-board-grid">
      {projects.length > 0 ? (
        projects.map((project) => (
          <article className="board-tile archived-project-tile" key={project.id}>
            <span>{project.name}</span>
            <button className="restore-action-button" type="button" onClick={() => onRestoreProject(project.id)}>
              Restore
            </button>
          </article>
        ))
      ) : (
        <p className="empty-state">No archived projects yet.</p>
      )}
    </div>
  );
}

export default ArchivedProjects;
