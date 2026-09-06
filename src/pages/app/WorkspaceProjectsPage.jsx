import React, { useEffect, useRef, useState } from "react";
import ArchivedProjects from "../../components/workspace/ArchivedProjects.jsx";
import CreateProjectModal from "../../components/workspace/CreateProjectModal.jsx";
import WorkspaceMembers from "../../components/workspace/WorkspaceMembers.jsx";
import WorkspaceProjects, { CreateProjectButton } from "../../components/workspace/WorkspaceProjects.jsx";
import WorkspaceSettings from "../../components/workspace/WorkspaceSettings.jsx";
import WorkspaceTabs from "../../components/workspace/WorkspaceTabs.jsx";
import { askWorkspaceRag } from "../../lib/api.js";

function formatRagScore(value) {
  return typeof value === "number" ? value.toFixed(2) : null;
}

function formatWorkspaceRagSource(source) {
  const details = [
    `Attachment #${source.attachment_id}`,
    `card #${source.card_id}`,
    `chunk #${source.chunk_index}`,
  ];
  const rerankScore = formatRagScore(source.rerank_score);
  const bm25Score = formatRagScore(source.bm25_score);

  if (rerankScore) {
    details.push(`rerank ${rerankScore}`);
  }

  if (bm25Score) {
    details.push(`BM25 ${bm25Score}`);
  }

  return details.join(", ");
}

function WorkspaceProjectsPage({
  archivedProjects = [],
  canManageWorkspace = true,
  createProjectRequestId,
  currentUserId,
  initialTab = "projects",
  onArchiveProject,
  onArchiveWorkspace,
  onCreateProject,
  onMembersChanged,
  onOpenProject,
  onPermanentlyDeleteProject,
  onRenameWorkspace,
  onRestoreProject,
  pendingArchivedActionKey,
  shouldOpenCreateProject = false,
  workspace,
}) {
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState(initialTab ?? "projects");
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isRagMenuOpen, setIsRagMenuOpen] = useState(false);
  const [ragQuestion, setRagQuestion] = useState("");
  const [ragMessages, setRagMessages] = useState([]);
  const [isAskingRag, setIsAskingRag] = useState(false);
  const ragMenuRef = useRef(null);
  const activeProjects = workspace.projects.filter((project) => !project.archived);

  useEffect(() => {
    if (canManageWorkspace && shouldOpenCreateProject) {
      setIsCreatingProject(true);
    }
  }, [canManageWorkspace, createProjectRequestId, shouldOpenCreateProject]);

  useEffect(() => {
    if (!canManageWorkspace && ["archived-projects", "settings"].includes(activeWorkspaceTab)) {
      setActiveWorkspaceTab("projects");
    }
  }, [activeWorkspaceTab, canManageWorkspace]);

  useEffect(() => {
    function closeRagMenuOnOutsideClick(event) {
      if (ragMenuRef.current && !ragMenuRef.current.contains(event.target)) {
        setIsRagMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", closeRagMenuOnOutsideClick);

    return () => {
      document.removeEventListener("mousedown", closeRagMenuOnOutsideClick);
    };
  }, []);

  async function askRagQuestion(event) {
    event.preventDefault();

    const normalizedQuestion = ragQuestion.trim();
    if (!normalizedQuestion) {
      return;
    }

    setRagMessages((messages) => [
      ...messages,
      {
        id: `user-${Date.now()}`,
        role: "user",
        content: normalizedQuestion,
      },
    ]);
    setRagQuestion("");
    setIsAskingRag(true);

    try {
      const result = await askWorkspaceRag(workspace.id, {
        query: normalizedQuestion,
        topK: 5,
      });
      setRagMessages((messages) => [
        ...messages,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: result.answer,
          sources: result.sources ?? [],
        },
      ]);
    } catch (error) {
      setRagMessages((messages) => [
        ...messages,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          content: error.message,
          isError: true,
        },
      ]);
    } finally {
      setIsAskingRag(false);
    }
  }

  return (
    <section className="app-content" aria-labelledby="workspace-projects-title">
      <header className="page-header">
        <div className="workspace-page-title">
          <span className="workspace-board-avatar">{workspace.name.charAt(0)}</span>
          <h1 id="workspace-projects-title">{workspace.name}</h1>
        </div>
        <div className="workspace-header-actions">
          <div className="card-rag-wrapper" ref={ragMenuRef}>
            <button
              className={`icon-button ${isRagMenuOpen ? "is-active" : ""}`}
              type="button"
              aria-label="Ask workspace attachments"
              aria-expanded={isRagMenuOpen}
              onClick={() => setIsRagMenuOpen((isOpen) => !isOpen)}
            >
              <svg aria-hidden="true" className="icon-svg" fill="none" height="18" viewBox="0 0 24 24" width="18">
                <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                <path d="M8 9h8M8 13h5" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
              </svg>
            </button>
            {isRagMenuOpen && (
              <div className="card-rag-menu" role="dialog" aria-label="Ask workspace attachments">
                <div className="card-rag-messages" aria-live="polite">
                  {ragMessages.length === 0 ? (
                    <p className="card-rag-empty">Ask anything about this workspace.</p>
                  ) : (
                    ragMessages.map((message) => (
                      <div
                        className={`card-rag-message card-rag-message-${message.role} ${message.isError ? "is-error" : ""}`}
                        key={message.id}
                      >
                        <p>{message.content}</p>
                        {message.sources?.length > 0 && (
                          <div className="card-rag-sources">
                            <span>Sources</span>
                            {message.sources.map((source) => (
                              <small key={`${source.chunk_id}-${source.chunk_index}`}>
                                {formatWorkspaceRagSource(source)}
                              </small>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                  {isAskingRag && (
                    <div className="card-rag-message card-rag-message-assistant">
                      <p>Thinking...</p>
                    </div>
                  )}
                </div>
                <form className="card-rag-form" onSubmit={askRagQuestion}>
                  <label>
                    <textarea
                      value={ragQuestion}
                      onChange={(event) => setRagQuestion(event.target.value)}
                      placeholder="Ask anything about this workspace"
                      rows={2}
                    />
                  </label>
                  <button type="submit" disabled={isAskingRag || !ragQuestion.trim()}>
                    {isAskingRag ? "Asking..." : "Ask"}
                  </button>
                </form>
              </div>
            )}
          </div>
          {canManageWorkspace && activeWorkspaceTab === "projects" && (
            <CreateProjectButton onClick={() => setIsCreatingProject(true)} />
          )}
        </div>
      </header>

      <WorkspaceTabs
        activeTab={activeWorkspaceTab}
        canManageWorkspace={canManageWorkspace}
        onChangeTab={setActiveWorkspaceTab}
        workspaceName={workspace.name}
      />

      {activeWorkspaceTab === "members" ? (
        <WorkspaceMembers currentUserId={currentUserId} onMembersChanged={onMembersChanged} workspace={workspace} />
      ) : activeWorkspaceTab === "projects" ? (
        <WorkspaceProjects
          canManageWorkspace={canManageWorkspace}
          onArchiveProject={onArchiveProject}
          onCreateProject={() => setIsCreatingProject(true)}
          onOpenProject={onOpenProject}
          projects={activeProjects}
        />
      ) : activeWorkspaceTab === "settings" ? (
        <WorkspaceSettings
          onArchiveWorkspace={onArchiveWorkspace}
          onRenameWorkspace={onRenameWorkspace}
          workspace={workspace}
        />
      ) : activeWorkspaceTab === "archived-projects" ? (
        <ArchivedProjects
          onPermanentlyDeleteProject={onPermanentlyDeleteProject}
          onRestoreProject={onRestoreProject}
          pendingActionKey={pendingArchivedActionKey}
          projects={archivedProjects}
        />
      ) : null}

      {canManageWorkspace && isCreatingProject && (
        <CreateProjectModal
          onClose={() => setIsCreatingProject(false)}
          onCreate={(projectInput) => onCreateProject(workspace.id, projectInput)}
        />
      )}
    </section>
  );
}

export default WorkspaceProjectsPage;
