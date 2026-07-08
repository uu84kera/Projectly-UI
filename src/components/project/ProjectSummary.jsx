import React from "react";

function SummaryMetric({ label, value }) {
  return (
    <article className="summary-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function ProjectSummary({ cardStatusCounts, epicStats, sprintStats }) {
  return (
    <div className="project-summary-page">
      <section className="summary-section" aria-labelledby="summary-work-title">
        <h2 id="summary-work-title">Work items</h2>
        <div className="summary-metric-grid">
          <SummaryMetric label="Todo" value={cardStatusCounts.todo} />
          <SummaryMetric label="In Progress" value={cardStatusCounts.inProgress} />
          <SummaryMetric label="Done" value={cardStatusCounts.done} />
        </div>
      </section>

      <section className="summary-section" aria-labelledby="summary-epic-title">
        <h2 id="summary-epic-title">Epics</h2>
        <div className="summary-metric-grid">
          <SummaryMetric label="Completed epics" value={epicStats.completed} />
          <SummaryMetric label="Incomplete epics" value={epicStats.incomplete} />
        </div>
      </section>

      <section className="summary-section" aria-labelledby="summary-sprint-title">
        <h2 id="summary-sprint-title">Sprints</h2>
        <div className="summary-metric-grid">
          <SummaryMetric label="Completed sprints" value={sprintStats.completed} />
          <SummaryMetric label="Incomplete sprints" value={sprintStats.incomplete} />
        </div>
      </section>
    </div>
  );
}

export default ProjectSummary;
