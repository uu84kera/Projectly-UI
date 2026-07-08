import React, { useState } from "react";

function CreateSprintModal({ onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    onCreate({
      title: title.trim(),
      startDate,
      endDate,
    });
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="simple-modal" aria-labelledby="create-sprint-title" role="dialog" aria-modal="true">
        <header className="simple-modal-header">
          <h2 id="create-sprint-title">Create sprint</h2>
          <button className="modal-close-button" type="button" aria-label="Close create sprint" onClick={onClose}>
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

          <div className="sprint-date-grid">
            <label>
              <span>Start date</span>
              <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
            </label>
            <label>
              <span>End date</span>
              <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
            </label>
          </div>

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

export default CreateSprintModal;
