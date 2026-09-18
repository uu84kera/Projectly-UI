import React, { useEffect, useRef, useState } from "react";

import { askGeneralRag } from "../../lib/api.js";

function createMessageId(role) {
  return `${role}-${crypto.randomUUID()}`;
}

function formatSourceType(sourceType) {
  return (sourceType ?? "source")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatSource(source) {
  const sourceName =
    source.title ||
    `${formatSourceType(source.source_type)} #${source.source_id}`;

  const location = [
    source.workspace_id ? `Workspace #${source.workspace_id}` : null,
    source.project_id ? `Project #${source.project_id}` : null,
    source.card_id ? `Card #${source.card_id}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return {
    name: sourceName,
    location,
  };
}

function GeneralRagChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [isAsking, setIsAsking] = useState(false);

  const chatRef = useRef(null);
  const messageEndRef = useRef(null);

  useEffect(() => {
    function closeOnOutsideClick(event) {
      if (
        isOpen &&
        chatRef.current &&
        !chatRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    function closeOnEscape(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messageEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [isOpen, isAsking, messages]);

  async function askQuestion(event) {
    event.preventDefault();

    const normalizedQuestion = question.trim();

    if (!normalizedQuestion || isAsking) {
      return;
    }

    const userMessage = {
      id: createMessageId("user"),
      role: "user",
      content: normalizedQuestion,
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setQuestion("");
    setIsAsking(true);

    try {
      const result = await askGeneralRag({
        query: normalizedQuestion,
        topK: 5,
      });

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: createMessageId("assistant"),
          role: "assistant",
          content: result.answer,
          sources: result.sources ?? [],
        },
      ]);
    } catch (error) {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: createMessageId("assistant-error"),
          role: "assistant",
          content: error.message,
          isError: true,
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  }

  function handleQuestionKeyDown(event) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <div className="general-rag-chat" ref={chatRef}>
      {isOpen && (
        <section
          className="general-rag-panel"
          role="dialog"
          aria-label="Projectly AI assistant"
        >
          <header className="general-rag-header">
            <div>
              <h2>Projectly AI</h2>
              <p>Ask anything about your work</p>
            </div>

            <button
              className="icon-button"
              type="button"
              aria-label="Close chat"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </header>

          <div className="general-rag-messages" aria-live="polite">
            {messages.length === 0 ? (
              <p className="general-rag-empty">Ask anything about your work.</p>
            ) : (
              messages.map((message) => (
                <article
                  className={`general-rag-message general-rag-message-${message.role} ${
                    message.isError ? "is-error" : ""
                  }`}
                  key={message.id}
                >
                  <p>{message.content}</p>

                  {message.sources?.length > 0 && (
                    <details className="general-rag-sources">
                      <summary>{message.sources.length} sources</summary>

                      <div>
                        {message.sources.map((source) => {
                          const formattedSource = formatSource(source);

                          return (
                            <div
                              className="general-rag-source"
                              key={source.chunk_id}
                            >
                              <strong>{formattedSource.name}</strong>

                              {formattedSource.location && (
                                <span>{formattedSource.location}</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </details>
                  )}
                </article>
              ))
            )}

            {isAsking && (
              <article className="general-rag-message general-rag-message-assistant">
                <p>Thinking...</p>
              </article>
            )}

            <div ref={messageEndRef} />
          </div>

          <form className="general-rag-form" onSubmit={askQuestion}>
            <textarea
              aria-label="Ask Projectly AI"
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={handleQuestionKeyDown}
              placeholder="Ask anything about your work"
              rows={2}
              value={question}
            />

            <button type="submit" disabled={isAsking || !question.trim()}>
              Ask
            </button>
          </form>
        </section>
      )}

      <button
        className={`general-rag-trigger ${isOpen ? "is-active" : ""}`}
        type="button"
        aria-label="Open Projectly AI"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        <svg
          aria-hidden="true"
          fill="none"
          height="20"
          viewBox="0 0 24 24"
          width="20"
        >
          <path
            d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="M8 9h8M8 13h5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
          />
        </svg>
      </button>
    </div>
  );
}

export default GeneralRagChat;
