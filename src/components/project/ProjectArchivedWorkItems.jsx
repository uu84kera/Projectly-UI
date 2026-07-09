import React from "react";

function ArchivedItem({ meta, title, type }) {
  return (
    <article className="archived-work-item">
      <div>
        <span className="archived-work-type">{type}</span>
        <h3>{title}</h3>
        {meta && <p>{meta}</p>}
      </div>
    </article>
  );
}

function ProjectArchivedWorkItems({ archivedCards, archivedEpics, archivedSprints }) {
  return (
    <div className="archived-work-page">
      <section className="archived-work-section" aria-labelledby="archived-cards-title">
        <h2 id="archived-cards-title">Archived cards</h2>
        <div className="archived-work-list">
          {archivedCards.length > 0 ? (
            archivedCards.map((card) => (
              <ArchivedItem
                meta={card.source}
                title={card.title}
                type="Card"
                key={card.id}
              />
            ))
          ) : (
            <p className="empty-state">No archived cards yet.</p>
          )}
        </div>
      </section>

      <section className="archived-work-section" aria-labelledby="archived-epics-title">
        <h2 id="archived-epics-title">Archived epics</h2>
        <div className="archived-work-list">
          {archivedEpics.length > 0 ? (
            archivedEpics.map((epic) => (
              <ArchivedItem
                meta={`${epic.cards.length} cards, ${(epic.sprints ?? []).length} sprints`}
                title={epic.name}
                type="Epic"
                key={epic.id}
              />
            ))
          ) : (
            <p className="empty-state">No archived epics yet.</p>
          )}
        </div>
      </section>

      <section className="archived-work-section" aria-labelledby="archived-sprints-title">
        <h2 id="archived-sprints-title">Archived sprints</h2>
        <div className="archived-work-list">
          {archivedSprints.length > 0 ? (
            archivedSprints.map((sprint) => (
              <ArchivedItem
                meta={`${sprint.epicName} · ${sprint.cards.length} cards`}
                title={sprint.title}
                type="Sprint"
                key={sprint.id}
              />
            ))
          ) : (
            <p className="empty-state">No archived sprints yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default ProjectArchivedWorkItems;
