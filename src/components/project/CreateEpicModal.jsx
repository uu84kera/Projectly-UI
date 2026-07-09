import React, { useState } from "react";

function CreateEpicModal({
  initialDeadline = "",
  initialTitle = "",
  mode = "create",
  onClose,
  onCreate,
}) {
  const [title, setTitle] = useState(initialTitle);
  const [deadline, setDeadline] = useState(initialDeadline);
  const modalTitle = mode === "edit" ? "Edit epic" : "Create new epic";
  const submitLabel = mode === "edit" ? "Save" : "Create";

  function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    onCreate({
      title: title.trim(),
      deadline,
    });
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="simple-modal" aria-labelledby="create-epic-title" role="dialog" aria-modal="true">
        <header className="simple-modal-header">
          <h2 id="create-epic-title">{modalTitle}</h2>
          <button className="modal-close-button" type="button" aria-label="Close create epic" onClick={onClose}>
            <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
            </svg>
          </button>
        </header>

        <form className="simple-modal-form" onSubmit={handleSubmit}>
          <label className="modal-field">
            <strong>
              Title <span className="required-mark">*</span>
            </strong>
            <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} autoFocus />
          </label>

          <label className="modal-field">
            <strong>Deadline</strong>
            <input type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} />
          </label>

          <footer className="sprint-modal-footer">
            <button className="modal-cancel-button" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="modal-update-button" type="submit">
              {submitLabel}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default CreateEpicModal;
