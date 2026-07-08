import React, { useEffect, useRef, useState } from "react";
import CardDetailModal from "../../components/project/CardDetailModal.jsx";
import CreateCardModal from "../../components/project/CreateCardModal.jsx";
import CreateEpicModal from "../../components/project/CreateEpicModal.jsx";
import CreateSprintModal from "../../components/project/CreateSprintModal.jsx";
import ProjectBacklog from "../../components/project/ProjectBacklog.jsx";
import ProjectBoard from "../../components/project/ProjectBoard.jsx";
import ProjectMembers from "../../components/project/ProjectMembers.jsx";
import ProjectSettings from "../../components/project/ProjectSettings.jsx";
import ProjectSummary from "../../components/project/ProjectSummary.jsx";
import ProjectTabs from "../../components/project/ProjectTabs.jsx";
import SprintEditModal from "../../components/project/SprintEditModal.jsx";

function formatStatusLabel(status) {
  const labels = {
    todo: "Todo",
    "in-progress": "In Progress",
    done: "Done",
  };

  return labels[status] ?? "Todo";
}

function ProjectBacklogPage({ onArchiveProject, project, workspace }) {
  const [activeTab, setActiveTab] = useState("Backlog");
  const [expandedEpicId, setExpandedEpicId] = useState(null);
  const [localEpics, setLocalEpics] = useState(project.epics ?? []);
  const [isCreatingEpic, setIsCreatingEpic] = useState(false);
  const [isCreatingSprint, setIsCreatingSprint] = useState(false);
  const [isEditingSprint, setIsEditingSprint] = useState(false);
  const [sprintMenuEpicId, setSprintMenuEpicId] = useState(null);
  const [activeSprintEpicId, setActiveSprintEpicId] = useState(null);
  const [sprintName, setSprintName] = useState("");
  const [sprintDuration, setSprintDuration] = useState("custom");
  const [sprintStartDate, setSprintStartDate] = useState("");
  const [sprintEndDate, setSprintEndDate] = useState("");
  const [sprintStartTime, setSprintStartTime] = useState("00:00");
  const [sprintEndTime, setSprintEndTime] = useState("00:00");
  const [autoScheduleSprint, setAutoScheduleSprint] = useState(false);
  const [moveOpenWorkTo, setMoveOpenWorkTo] = useState("SCRUM Sprint 1");
  const [sprintGoal, setSprintGoal] = useState("");
  const [createdCards, setCreatedCards] = useState([]);
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const sprintMenuRef = useRef(null);
  const epics = localEpics;
  const activeEpic = epics.find((epic) => epic.id === activeSprintEpicId) ?? null;
  const sprint = activeEpic?.sprints?.[0] ?? null;
  const projectCards = [
    ...epics.flatMap((epic) => epic.cards),
    ...createdCards,
  ];
  const backlogCards = projectCards.filter((card) => !card.sprintId);
  const allSprintCards = epics.flatMap((epic) => epic.sprints?.flatMap((epicSprint) => epicSprint.cards) ?? []);
  const sprintCards = sprint?.cards ?? [];
  const startedSprintCards = epics.flatMap((epic) =>
    epic.sprints?.flatMap((epicSprint) => (epicSprint.isStarted ? epicSprint.cards : [])) ?? []
  );
  const cardStatusCounts = {
    todo: projectCards.filter((card) => card.status === "todo").length,
    inProgress: projectCards.filter((card) => card.status === "in-progress").length,
    done: projectCards.filter((card) => card.status === "done" || card.completed).length,
  };
  const sprintStatusCounts = {
    todo: sprintCards.filter((card) => card.status === "todo").length,
    inProgress: sprintCards.filter((card) => card.status === "in-progress").length,
    done: sprintCards.filter((card) => card.status === "done" || card.completed).length,
  };
  const boardColumns = [
    { title: "Todo", cards: startedSprintCards.filter((card) => card.status === "todo") },
    {
      title: "In Progress",
      cards: startedSprintCards.filter((card) => card.status === "in-progress"),
    },
    {
      title: "Done",
      cards: startedSprintCards.filter((card) => card.status === "done" || card.completed),
    },
  ];
  const sprintIndex = 0;
  const sprintCount = activeEpic?.sprints?.length ?? 0;
  const sprintMoveActions = [
    ...(sprintIndex > 0 ? ["Move sprint up", "Move sprint to top"] : []),
    ...(sprintIndex < sprintCount - 1 ? ["Move sprint down", "Move sprint to bottom"] : []),
  ];
  const projectMembers = [
    ...(workspace.members ?? []),
    ...(workspace.singleBoardGuests ?? []).filter((guest) => guest.projects.includes(project.name)),
  ];
  const completedEpics = epics.filter(
    (epic) => epic.cards.length > 0 && epic.cards.every((card) => card.completed || card.status === "done")
  ).length;
  const epicStats = {
    completed: completedEpics,
    incomplete: epics.length - completedEpics,
  };
  const sprintIsComplete =
    allSprintCards.length > 0 && allSprintCards.every((card) => card.completed || card.status === "done");
  const sprintStats = {
    completed: sprintIsComplete ? 1 : 0,
    incomplete: allSprintCards.length > 0 && !sprintIsComplete ? 1 : 0,
  };
  const sprintStartDisabled =
    !sprint || sprint.isStarted || sprintCards.length === 0 || !sprint.startDate || !sprint.endDate;
  const sprintOptions = epics.flatMap((epic) =>
    (epic.sprints ?? []).map((epicSprint) => ({
      id: epicSprint.id,
      title: epicSprint.title,
      epicName: epic.name,
    }))
  );

  function findCardById(cardId) {
    const backlogCard = createdCards.find((card) => card.id === cardId);

    if (backlogCard) {
      return backlogCard;
    }

    for (const epic of epics) {
      const epicCard = epic.cards.find((card) => card.id === cardId);

      if (epicCard) {
        return epicCard;
      }

      for (const epicSprint of epic.sprints ?? []) {
        const sprintCard = epicSprint.cards.find((card) => card.id === cardId);

        if (sprintCard) {
          return sprintCard;
        }
      }
    }

    return null;
  }

  function removeCardFromProject(cardId) {
    setCreatedCards((cards) => cards.filter((card) => card.id !== cardId));
    setLocalEpics((currentEpics) =>
      currentEpics.map((epic) => ({
        ...epic,
        cards: epic.cards.filter((card) => card.id !== cardId),
        sprints: (epic.sprints ?? []).map((epicSprint) => ({
          ...epicSprint,
          cards: epicSprint.cards.filter((card) => card.id !== cardId),
        })),
      }))
    );
  }

  function updateCardStatus(cardId, status) {
    setCreatedCards((cards) =>
      cards.map((card) => (card.id === cardId ? { ...card, listName: formatStatusLabel(status), status } : card))
    );
    setLocalEpics((currentEpics) =>
      currentEpics.map((epic) => ({
        ...epic,
        cards: epic.cards.map((card) =>
          card.id === cardId ? { ...card, listName: formatStatusLabel(status), status } : card
        ),
        sprints: (epic.sprints ?? []).map((epicSprint) => ({
          ...epicSprint,
          cards: epicSprint.cards.map((card) =>
            card.id === cardId ? { ...card, listName: formatStatusLabel(status), status } : card
          ),
        })),
      }))
    );
    setSelectedCard((card) =>
      card?.id === cardId ? { ...card, listName: formatStatusLabel(status), status } : card
    );
  }

  function handleCardDragStart(event, cardId) {
    event.dataTransfer.setData("text/plain", cardId);
    event.dataTransfer.effectAllowed = "move";
  }

  function moveCardToBacklog(event) {
    event.preventDefault();
    const cardId = event.dataTransfer.getData("text/plain");
    const card = findCardById(cardId);

    if (!card) {
      return;
    }

    removeCardFromProject(cardId);
    setCreatedCards((cards) => [
      ...cards,
      {
        ...card,
        sprintId: null,
        status: card.status ?? "todo",
      },
    ]);
  }

  function moveCardToSprint(event, epicId) {
    event.preventDefault();
    const cardId = event.dataTransfer.getData("text/plain");
    const card = findCardById(cardId);

    if (!card) {
      return;
    }

    removeCardFromProject(cardId);
    setLocalEpics((currentEpics) =>
      currentEpics.map((epic) => {
        if (epic.id !== epicId) {
          return epic;
        }

        const targetSprint = epic.sprints?.[0];

        if (!targetSprint) {
          return epic;
        }

        return {
          ...epic,
          sprints: epic.sprints.map((epicSprint, index) =>
            index === 0
              ? {
                  ...epicSprint,
                  cards: [
                    ...epicSprint.cards,
                    {
                      ...card,
                      listName: "Todo",
                      sprintId: epicSprint.id,
                      status: card.status ?? "todo",
                    },
                  ],
                }
              : epicSprint
          ),
        };
      })
    );
  }

  useEffect(() => {
    function closeSprintMenuOnOutsideClick(event) {
      if (!sprintMenuRef.current || sprintMenuRef.current.contains(event.target)) {
        return;
      }

      setSprintMenuEpicId(null);
    }

    document.addEventListener("mousedown", closeSprintMenuOnOutsideClick);

    return () => {
      document.removeEventListener("mousedown", closeSprintMenuOnOutsideClick);
    };
  }, []);

  return (
    <section className="app-content" aria-labelledby="project-title">
      <header className="page-header">
        <div>
          <h1 id="project-title">{project.name}</h1>
        </div>
      </header>

      <ProjectTabs activeTab={activeTab} onChangeTab={setActiveTab} projectName={project.name} />

      {activeTab === "Summary" ? (
        <ProjectSummary
          cardStatusCounts={cardStatusCounts}
          epicStats={epicStats}
          sprintStats={sprintStats}
        />
      ) : activeTab === "Members" ? (
        <ProjectMembers project={project} workspace={workspace} />
      ) : activeTab === "Settings" ? (
        <ProjectSettings onArchiveProject={onArchiveProject} project={project} />
      ) : activeTab === "Board" ? (
        <ProjectBoard
          boardColumns={boardColumns}
          onOpenCard={setSelectedCard}
          onStatusChange={updateCardStatus}
        />
      ) : activeTab === "Backlog" ? (
        <ProjectBacklog
          backlogCards={backlogCards}
          epics={epics}
          isSprintExpanded={(epicId) => expandedEpicId === epicId}
          isSprintMenuOpen={(epicId) => sprintMenuEpicId === epicId}
          onEditSprint={(epicId) => {
            const selectedEpic = epics.find((epic) => epic.id === epicId);
            const selectedSprint = selectedEpic?.sprints?.[0];

            if (!selectedSprint) {
              return;
            }

            setActiveSprintEpicId(epicId);
            setSprintName(selectedSprint.title);
            setSprintStartDate(selectedSprint.startDate);
            setSprintEndDate(selectedSprint.endDate);
            setIsEditingSprint(true);
            setSprintMenuEpicId(null);
          }}
          onCardDragStart={handleCardDragStart}
          onDropCardToBacklog={moveCardToBacklog}
          onDropCardToSprint={moveCardToSprint}
          onOpenCard={setSelectedCard}
          onOpenCreateEpic={() => setIsCreatingEpic(true)}
          onOpenCreateCard={() => setIsCreatingCard(true)}
          onOpenCreateSprint={(epicId) => {
            setActiveSprintEpicId(epicId);
            setIsCreatingSprint(true);
          }}
          onSelectEpic={(epicId) => {
            setActiveSprintEpicId(epicId);
            setExpandedEpicId(epicId);
          }}
          onStartSprint={(epicId) => {
            const selectedEpic = epics.find((epic) => epic.id === epicId);
            const selectedSprint = selectedEpic?.sprints?.[0];
            const selectedSprintCards = selectedSprint?.cards ?? [];
            const selectedSprintStartDisabled =
              !selectedSprint ||
              selectedSprint.isStarted ||
              selectedSprintCards.length === 0 ||
              !selectedSprint.startDate ||
              !selectedSprint.endDate;

            if (selectedSprintStartDisabled) {
              return;
            }

            setLocalEpics((currentEpics) =>
              currentEpics.map((epic) =>
                epic.id === epicId
                  ? {
                      ...epic,
                      sprints: epic.sprints.map((epicSprint, index) =>
                        index === 0 ? { ...epicSprint, isStarted: true } : epicSprint
                      ),
                    }
                  : epic
              )
            );
            setActiveTab("Board");
          }}
          onStatusChange={updateCardStatus}
          onToggleSprint={(epicId) => {
            setExpandedEpicId((currentEpicId) => (currentEpicId === epicId ? null : epicId));
          }}
          onToggleSprintMenu={(epicId) => {
            setSprintMenuEpicId((currentEpicId) => (currentEpicId === epicId ? null : epicId));
          }}
          selectedEpicId={activeSprintEpicId}
          sprintMenuRef={sprintMenuRef}
          sprintMoveActions={sprintMoveActions}
          getSprintStartDisabled={(epic) => {
            const epicSprint = epic.sprints?.[0];
            const epicSprintCards = epicSprint?.cards ?? [];
            return (
              !epicSprint ||
              epicSprint.isStarted ||
              epicSprintCards.length === 0 ||
              !epicSprint.startDate ||
              !epicSprint.endDate
            );
          }}
          getSprintStatusCounts={(epic) => {
            const epicSprintCards = epic.sprints?.[0]?.cards ?? [];
            return {
              todo: epicSprintCards.filter((card) => card.status === "todo").length,
              inProgress: epicSprintCards.filter((card) => card.status === "in-progress").length,
              done: epicSprintCards.filter((card) => card.status === "done" || card.completed).length,
            };
          }}
        />
      ) : (
        <div className="board-view-panel">
          <p className="empty-state">{activeTab} content will be added later.</p>
        </div>
      )}

      {isEditingSprint && (
        <SprintEditModal
          autoSchedule={autoScheduleSprint}
          duration={sprintDuration}
          endDate={sprintEndDate}
          endTime={sprintEndTime}
          goal={sprintGoal}
          moveOpenWorkTo={moveOpenWorkTo}
          name={sprintName}
          onAutoScheduleChange={setAutoScheduleSprint}
          onClose={() => setIsEditingSprint(false)}
          onDurationChange={setSprintDuration}
          onEndDateChange={setSprintEndDate}
          onEndTimeChange={setSprintEndTime}
          onGoalChange={setSprintGoal}
          onMoveOpenWorkToChange={setMoveOpenWorkTo}
          onNameChange={setSprintName}
          onStartDateChange={setSprintStartDate}
          onStartTimeChange={setSprintStartTime}
          onUpdate={() => {
            setLocalEpics((currentEpics) =>
              currentEpics.map((epic) =>
                epic.id === activeSprintEpicId
                  ? {
                      ...epic,
                      sprints: (epic.sprints ?? []).map((epicSprint, index) =>
                        index === 0
                          ? {
                              ...epicSprint,
                              title: sprintName,
                              startDate: sprintStartDate,
                              endDate: sprintEndDate,
                            }
                          : epicSprint
                      ),
                    }
                  : epic
              )
            );
            setIsEditingSprint(false);
          }}
          startDate={sprintStartDate}
          startTime={sprintStartTime}
        />
      )}

      {isCreatingEpic && (
        <CreateEpicModal
          onClose={() => setIsCreatingEpic(false)}
          onCreate={({ title, deadline }) => {
            setLocalEpics((currentEpics) => [
              ...currentEpics,
              {
                id: `epic-${Date.now()}`,
                name: title,
                deadline,
                cards: [],
                sprints: [],
              },
            ]);
            setIsCreatingEpic(false);
          }}
        />
      )}

      {isCreatingSprint && (
        <CreateSprintModal
          onClose={() => setIsCreatingSprint(false)}
          onCreate={({ title, startDate, endDate }) => {
            setLocalEpics((currentEpics) =>
              currentEpics.map((epic) =>
                epic.id === activeSprintEpicId
                  ? {
                      ...epic,
                      sprints: [
                        ...(epic.sprints ?? []),
                        {
                          id: `sprint-${Date.now()}`,
                          title,
                          startDate,
                          endDate,
                          isStarted: false,
                          cards: [],
                        },
                      ],
                    }
                  : epic
              )
            );
            setIsCreatingSprint(false);
          }}
        />
      )}

      {isCreatingCard && (
        <CreateCardModal
          onClose={() => setIsCreatingCard(false)}
          onCreate={({ title, description }) => {
            setCreatedCards((cards) => [
              ...cards,
              {
                id: `created-card-${Date.now()}`,
                title,
                description,
                completed: false,
                listName: "Todo",
                sprintId: null,
                status: "todo",
              },
            ]);
          }}
        />
      )}

      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onStatusChange={updateCardStatus}
          projectMembers={projectMembers}
          sprintOptions={sprintOptions}
        />
      )}
    </section>
  );
}

export default ProjectBacklogPage;
