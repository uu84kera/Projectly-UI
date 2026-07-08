import React from "react";

function ArchivedProjects({ projects }) {
  return (
    <div className="workspace-board-grid">
      {projects.length > 0 ? (
        projects.map((project) => (
          <button className="board-tile archived-project-tile" type="button" key={project.id}>
            <span>{project.name}</span>
          </button>
        ))
      ) : (
        <p className="empty-state">No archived projects yet.</p>
      )}
    </div>
  );
}

export default ArchivedProjects;
