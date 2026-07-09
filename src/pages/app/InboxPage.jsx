import React from "react";

function InboxItem({ item }) {
  return (
    <article className="inbox-item">
      <div className="inbox-item-avatar">{item.actor.charAt(0)}</div>
      <div>
        <div className="inbox-item-header">
          <strong>{item.actor}</strong>
          <span>{item.time}</span>
        </div>
        <p>{item.message}</p>
        <span className="inbox-item-meta">
          {item.type === "mention"
            ? `${item.projectName} · ${item.cardTitle}`
            : `${item.workspaceName} · ${item.projectName}`}
        </span>
      </div>
    </article>
  );
}

function InboxSection({ emptyText, items, title }) {
  return (
    <section className="inbox-section">
      <h2>{title}</h2>
      <div className="inbox-list">
        {items.length > 0 ? (
          items.map((item) => <InboxItem item={item} key={item.id} />)
        ) : (
          <p className="empty-state">{emptyText}</p>
        )}
      </div>
    </section>
  );
}

function InboxPage({ inboxItems }) {
  const mentions = inboxItems.filter((item) => item.type === "mention");
  const invitations = inboxItems.filter((item) => item.type === "project-invite");

  return (
    <section className="app-content" aria-labelledby="inbox-title">
      <header className="page-header">
        <div>
          <h1 id="inbox-title">Inbox</h1>
        </div>
      </header>

      <div className="inbox-page">
        <InboxSection emptyText="No mentions yet." items={mentions} title="Mentions" />
        <InboxSection emptyText="No project invitations yet." items={invitations} title="Project invitations" />
      </div>
    </section>
  );
}

export default InboxPage;
