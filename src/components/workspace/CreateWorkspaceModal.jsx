import React, { useState } from "react";

function CreateWorkspaceModal({ onClose, onCreate }) {
  const [name, setName] = useState("");

  function submitWorkspace(event) {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    onCreate({ name: name.trim() });
    onClose();
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="simple-modal" aria-labelledby="create-workspace-title" role="dialog" aria-modal="true">
        <header className="simple-modal-header">
          <h2 id="create-workspace-title">Create new workspace</h2>
          <button className="modal-close-button" type="button" aria-label="Close create workspace" onClick={onClose}>
            <svg aria-hidden="true" fill="none" height="22" viewBox="0 0 24 24" width="22">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
            </svg>
          </button>
        </header>

        <form className="simple-modal-form" onSubmit={submitWorkspace}>
          <label className="modal-field modal-field-full">
            <span>
              Workspace name <span className="required-mark">*</span>
            </span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoFocus
            />
          </label>

          <footer className="sprint-modal-footer">
            <button className="modal-cancel-button" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="modal-update-button" type="submit">
              Create
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default CreateWorkspaceModal;
