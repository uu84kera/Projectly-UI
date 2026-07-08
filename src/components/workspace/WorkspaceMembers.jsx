import React, { useEffect, useRef, useState } from "react";

function MemberAvatar({ initials }) {
  return <span className="member-avatar">{initials}</span>;
}

function RoleBadge({ role }) {
  return <span className={`member-role-badge ${role.toLowerCase()}`}>{role}</span>;
}

function WorkspaceMemberRow({ member }) {
  const isOwner = member.role === "Owner";

  return (
    <article className="member-row">
      <div className="member-profile">
        <MemberAvatar initials={member.initials} />
        <div>
          <div className="member-name-line">
            <strong>{member.name}</strong>
            <span>{member.username}</span>
          </div>
          <RoleBadge role={member.role} />
        </div>
      </div>
      <span className="member-type">{member.membership}</span>
      <button className={`member-row-action ${isOwner ? "" : "danger"}`} type="button">
        {isOwner ? "Leave" : "Remove"}
      </button>
    </article>
  );
}

function SingleBoardGuestRow({ guest }) {
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
  const projectMenuRef = useRef(null);

  useEffect(() => {
    function closeProjectMenuOnOutsideClick(event) {
      if (!projectMenuRef.current || projectMenuRef.current.contains(event.target)) {
        return;
      }

      setIsProjectMenuOpen(false);
    }

    document.addEventListener("mousedown", closeProjectMenuOnOutsideClick);

    return () => {
      document.removeEventListener("mousedown", closeProjectMenuOnOutsideClick);
    };
  }, []);

  return (
    <article className="member-row guest-row">
      <div className="member-profile">
        <MemberAvatar initials={guest.initials} />
        <div className="member-name-line">
          <strong>{guest.name}</strong>
          <span>{guest.username}</span>
        </div>
      </div>
      <span className="member-type">Last active {guest.lastActive}</span>
      <div className="guest-actions">
        <div className="guest-project-menu" ref={projectMenuRef}>
          <button
            className="member-row-action"
            type="button"
            aria-expanded={isProjectMenuOpen}
            onClick={() => setIsProjectMenuOpen((isOpen) => !isOpen)}
          >
            Projects ({guest.projects.length})
            <svg
              aria-hidden="true"
              className={`chevron-icon ${isProjectMenuOpen ? "is-expanded" : ""}`}
              fill="none"
              height="16"
              viewBox="0 0 24 24"
              width="16"
            >
              <path
                d="m9 6 6 6-6 6"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>
          {isProjectMenuOpen && (
            <div className="guest-project-dropdown">
              {guest.projects.map((project) => (
                <button type="button" key={project}>
                  {project}
                </button>
              ))}
            </div>
          )}
        </div>
        <button className="add-to-workspace-button" type="button">
          Add to Workspace
        </button>
        <button className="member-row-action danger" type="button">
          Remove
        </button>
      </div>
    </article>
  );
}

function WorkspaceMembers({ workspace }) {
  const [activeMemberTab, setActiveMemberTab] = useState("workspace-members");
  const members = workspace.members ?? [];
  const guests = workspace.singleBoardGuests ?? [];

  return (
    <div className="workspace-members-page">
      <nav className="member-tabs" aria-label="Workspace member sections">
        <button
          className={`member-tab ${activeMemberTab === "workspace-members" ? "is-active" : ""}`}
          type="button"
          onClick={() => setActiveMemberTab("workspace-members")}
        >
          Workspace members
        </button>
        <button
          className={`member-tab ${activeMemberTab === "single-project-guests" ? "is-active" : ""}`}
          type="button"
          onClick={() => setActiveMemberTab("single-project-guests")}
        >
          Single-project guests
        </button>
      </nav>

      {activeMemberTab === "workspace-members" ? (
        <section className="member-section" aria-label="Workspace members">
          <p className="member-description">
            Workspace members can access this workspace and manage projects according to their role.
          </p>
          <div className="member-toolbar">
            <input type="search" placeholder="Filter by name" aria-label="Filter workspace members by name" />
            <button className="invite-members-button" type="button">
              Invite workspace members
            </button>
          </div>
          <div className="member-list">
            {members.map((member) => (
              <WorkspaceMemberRow member={member} key={member.id} />
            ))}
          </div>
        </section>
      ) : (
        <section className="member-section" aria-label="Single-project guests">
          <p className="member-description">
            Single-project guests are members of only one Workspace project. Guests can only view and edit
            the projects to which they've been added.
          </p>
          <div className="member-toolbar">
            <input type="search" placeholder="Filter by name" aria-label="Filter single-project guests by name" />
          </div>
          <div className="member-list">
            {guests.map((guest) => (
              <SingleBoardGuestRow guest={guest} key={guest.id} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default WorkspaceMembers;
