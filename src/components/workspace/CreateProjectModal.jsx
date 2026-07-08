import React, { useState } from "react";

function CreateProjectModal({ onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function submitProject(event) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    onCreate({ title: title.trim(), description: description.trim() });
    onClose();
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="simple-modal" aria-labelledby="create-project-title" role="dialog" aria-modal="true">
        <header className="simple-modal-header">
          <h2 id="create-project-title">Create new project</h2>
          <button className="modal-close-button" type="button" aria-label="Close create project" onClick={onClose}>
            <svg aria-hidden="true" fill="none" height="22" viewBox="0 0 24 24" width="22">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
            </svg>
          </button>
        </header>

        <form className="simple-modal-form" onSubmit={submitProject}>
          <label className="modal-field modal-field-full">
            <span>
              Title <span className="required-mark">*</span>
            </span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              autoFocus
            />
          </label>

          <label className="modal-field modal-field-full">
            <span>Description <em>(optional)</em></span>
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} />
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

export default CreateProjectModal;
