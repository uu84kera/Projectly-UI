import React from "react";
import { WorkItemCard } from "./ProjectBoard.jsx";

function EpicSprint({
  epic,
  isSprintExpanded,
  isSprintMenuOpen,
  onEditSprint,
  onCardDragStart,
  onDropCardToSprint,
  onOpenCard,
  onStartSprint,
  onStatusChange,
  onToggleSprint,
  onToggleSprintMenu,
  sprintMenuRef,
  sprintMoveActions,
  sprintStatusCounts,
  sprintStartDisabled,
}) {
  const sprint = epic.sprints?.[0] ?? null;
  const sprintCards = sprint?.cards ?? [];

  return (
    <section className="epic-sprint-section">
      {sprint ? (
        <section
          className="status-group epic-sprint-group drop-zone"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => onDropCardToSprint(event, epic.id)}
        >
          <header className="sprint-header">
            <div className="sprint-title-group">
              <button
                className="sprint-expand-button"
                type="button"
                aria-label={isSprintExpanded ? "Collapse sprint cards" : "Expand sprint cards"}
                aria-expanded={isSprintExpanded}
                onClick={() => onToggleSprint(epic.id)}
              >
                <svg
                  aria-hidden="true"
                  className={`chevron-icon ${isSprintExpanded ? "is-expanded" : ""}`}
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
              <div>
                <h3>{sprint.title}</h3>
                <span>{sprint.startDate && sprint.endDate ? `${sprint.startDate} - ${sprint.endDate}` : "No dates set"}</span>
              </div>
            </div>

            <div className="sprint-header-actions">
              <div className="sprint-status-counts" aria-label="Sprint card status counts">
                <span title="Todo">{sprintStatusCounts.todo}</span>
                <span title="In Progress">{sprintStatusCounts.inProgress}</span>
                <span title="Done">{sprintStatusCounts.done}</span>
              </div>
              <button
                className="start-sprint-button"
                type="button"
                onClick={() => onStartSprint(epic.id)}
                disabled={sprintStartDisabled}
              >
                {sprint.isStarted ? "Started" : "Start sprint"}
              </button>
              <div className="sprint-menu-wrapper" ref={sprintMenuRef}>
                <button
                  className="icon-button sprint-menu-button"
                  type="button"
                  aria-label="Open sprint menu"
                  aria-expanded={isSprintMenuOpen}
                  onClick={() => onToggleSprintMenu(epic.id)}
                >
                  ...
                </button>

                {isSprintMenuOpen && (
                  <div className="sprint-menu" role="menu">
                    <button type="button" role="menuitem" onClick={() => onEditSprint(epic.id)}>
                      Edit sprint
                    </button>
                    {sprintMoveActions.map((action) => (
                      <button type="button" role="menuitem" key={action}>
                        {action}
                      </button>
                    ))}
                    <button type="button" role="menuitem">
                      Delete sprint
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {isSprintExpanded && (
            <div className="status-card-list">
              {sprintCards.length > 0 ? (
                sprintCards.map((card) => (
                  <WorkItemCard
                    card={card}
                    draggable
                    onDragStart={(event) => onCardDragStart(event, card.id)}
                    onOpenCard={onOpenCard}
                    onStatusChange={onStatusChange}
                    key={card.id}
                  />
                ))
              ) : (
                <p className="empty-state">No cards in sprint yet.</p>
              )}
            </div>
          )}
        </section>
      ) : (
        <p className="empty-state">No sprint yet.</p>
      )}
    </section>
  );
}

function EpicBlock({
  epic,
  onOpenCard,
  onStatusChange,
  onSelectEpic,
  selected,
}) {
  return (
    <article className={`epic-block ${selected ? "is-selected" : ""}`}>
      <header className="epic-header">
        <div>
          <h3>{epic.name}</h3>
          {epic.deadline && <span>Deadline {epic.deadline}</span>}
        </div>
        <button className="small-action-button" type="button" onClick={() => onSelectEpic(epic.id)}>
          View sprint
        </button>
      </header>
      <div className="epic-card-list">
        {epic.cards.map((card) => (
          <WorkItemCard
            card={card}
            onOpenCard={onOpenCard}
            onStatusChange={onStatusChange}
            key={card.id}
          />
        ))}
      </div>
    </article>
  );
}

function ProjectBacklog({
  backlogCards,
  epics,
  getSprintStartDisabled,
  getSprintStatusCounts,
  isSprintExpanded,
  isSprintMenuOpen,
  onEditSprint,
  onCardDragStart,
  onDropCardToBacklog,
  onDropCardToSprint,
  onOpenCard,
  onOpenCreateEpic,
  onOpenCreateSprint,
  onOpenCreateCard,
  onStartSprint,
  onStatusChange,
  onSelectEpic,
  onToggleSprint,
  onToggleSprintMenu,
  selectedEpicId,
  sprintMenuRef,
  sprintMoveActions,
}) {
  const selectedEpic = epics.find((epic) => epic.id === selectedEpicId) ?? null;

  return (
    <div className="project-backlog-layout">
      <section className="backlog-panel" aria-labelledby="epics-title">
        <header className="backlog-panel-header">
          <h2 id="epics-title">Epic</h2>
          <button className="small-action-button" type="button" onClick={onOpenCreateEpic}>
            Create new epic
          </button>
        </header>
        <div className="epic-list">
          {epics.length > 0 ? (
            epics.map((epic) => (
              <EpicBlock
                epic={epic}
                onOpenCard={onOpenCard}
                onSelectEpic={onSelectEpic}
                selected={selectedEpicId === epic.id}
                key={epic.id}
              />
            ))
          ) : (
            <p className="empty-state">No epics yet.</p>
          )}
        </div>
      </section>

      <div className="planning-column">
        <section className="backlog-panel" aria-labelledby="sprint-title">
          <header className="backlog-panel-header">
            <h2 id="sprint-title">Sprint</h2>
            <button
              className="small-action-button"
              type="button"
              disabled={!selectedEpic}
              onClick={() => selectedEpic && onOpenCreateSprint(selectedEpic.id)}
            >
              Create sprint
            </button>
          </header>
          {selectedEpic ? (
            <EpicSprint
              epic={selectedEpic}
              isSprintExpanded={isSprintExpanded(selectedEpic.id)}
              isSprintMenuOpen={isSprintMenuOpen(selectedEpic.id)}
              onEditSprint={onEditSprint}
              onCardDragStart={onCardDragStart}
              onDropCardToSprint={onDropCardToSprint}
              onOpenCard={onOpenCard}
              onStatusChange={onStatusChange}
              onStartSprint={onStartSprint}
              onToggleSprint={onToggleSprint}
              onToggleSprintMenu={onToggleSprintMenu}
              sprintMenuRef={sprintMenuRef}
              sprintMoveActions={sprintMoveActions}
              sprintStartDisabled={getSprintStartDisabled(selectedEpic)}
              sprintStatusCounts={getSprintStatusCounts(selectedEpic)}
            />
          ) : (
            <p className="empty-state">Select an epic to view its sprint.</p>
          )}
        </section>

        <section className="backlog-panel" aria-labelledby="backlog-title">
          <header className="backlog-panel-header">
            <h2 id="backlog-title">Backlog</h2>
            <div className="panel-header-actions">
              <span className="panel-count">{backlogCards.length} cards</span>
              <button className="small-action-button" type="button" onClick={onOpenCreateCard}>
                Create card
              </button>
            </div>
          </header>

          <div
            className="status-card-list drop-zone"
            onDragOver={(event) => event.preventDefault()}
            onDrop={onDropCardToBacklog}
          >
            {backlogCards.length > 0 ? (
              backlogCards.map((card) => (
                <WorkItemCard
                  card={card}
                  draggable
                  onDragStart={(event) => onCardDragStart(event, card.id)}
                  onOpenCard={onOpenCard}
                  onStatusChange={onStatusChange}
                  key={card.id}
                />
              ))
            ) : (
              <p className="empty-state">No backlog cards yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProjectBacklog;
