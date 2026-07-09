import React, { useEffect, useRef, useState } from "react";

const themeOptions = ["Light mode", "Dark mode", "System preference"];
const themeStorageKey = "projectly-theme";

function getStoredTheme(fallbackTheme) {
  const storedTheme = window.localStorage.getItem(themeStorageKey);

  return themeOptions.includes(storedTheme) ? storedTheme : fallbackTheme;
}

function UserSettingsPage({ user }) {
  const [selectedTheme, setSelectedTheme] = useState(() =>
    getStoredTheme(user.theme ?? "System preference")
  );
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef(null);

  useEffect(() => {
    const systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function applyTheme() {
      const resolvedTheme =
        selectedTheme === "System preference"
          ? systemThemeQuery.matches
            ? "dark"
            : "light"
          : selectedTheme === "Dark mode"
            ? "dark"
            : "light";

      document.documentElement.dataset.theme = resolvedTheme;
    }

    applyTheme();
    window.localStorage.setItem(themeStorageKey, selectedTheme);
    systemThemeQuery.addEventListener("change", applyTheme);

    return () => {
      systemThemeQuery.removeEventListener("change", applyTheme);
    };
  }, [selectedTheme]);

  useEffect(() => {
    function closeThemeMenu(event) {
      if (!themeMenuRef.current || themeMenuRef.current.contains(event.target)) {
        return;
      }

      setIsThemeMenuOpen(false);
    }

    document.addEventListener("mousedown", closeThemeMenu);

    return () => {
      document.removeEventListener("mousedown", closeThemeMenu);
    };
  }, []);

  return (
    <section className="app-content" aria-labelledby="user-settings-title">
      <header className="page-header">
        <div>
          <h1 id="user-settings-title">User Settings</h1>
        </div>
      </header>

      <div className="user-settings-page">
        <section className="settings-panel">
          <h2>Profile</h2>
          <p>Update your avatar and username shown across workspaces and projects.</p>

          <div className="profile-avatar-row">
            <span className="profile-avatar">{user.initials}</span>
            <button className="settings-save-button" type="button">
              Change avatar
            </button>
          </div>

          <label className="settings-field">
            Username
            <input type="text" defaultValue={user.name} />
          </label>

          <div className="settings-actions">
            <button className="settings-save-button" type="button">
              Save profile
            </button>
          </div>
        </section>

        <section className="settings-panel user-email-panel">
          <div>
            <h2>Email</h2>
            <p>Used for login, notifications, and workspace invitations.</p>
            <strong>{user.email}</strong>
          </div>
          <button className="settings-save-button" type="button">
            Change email
          </button>
        </section>

        <section className="settings-panel">
          <h2>Theme</h2>
          <p>Choose how the app should appear.</p>

          <div className="theme-dropdown" ref={themeMenuRef}>
            <button
              className="settings-save-button theme-dropdown-trigger"
              type="button"
              aria-expanded={isThemeMenuOpen}
              onClick={() => setIsThemeMenuOpen((isOpen) => !isOpen)}
            >
              {selectedTheme}
              <svg
                aria-hidden="true"
                className="theme-dropdown-chevron"
                fill="none"
                height="14"
                viewBox="0 0 24 24"
                width="14"
              >
                <path
                  d="m6 9 6 6 6-6"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </button>

            {isThemeMenuOpen && (
              <div className="theme-dropdown-menu" role="menu">
                {themeOptions.map((themeOption) => (
                  <button
                    className={selectedTheme === themeOption ? "is-selected" : ""}
                    key={themeOption}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setSelectedTheme(themeOption);
                      setIsThemeMenuOpen(false);
                    }}
                  >
                    <span>{themeOption}</span>
                    {selectedTheme === themeOption && (
                      <svg
                        aria-hidden="true"
                        className="theme-option-check"
                        fill="none"
                        height="16"
                        viewBox="0 0 24 24"
                        width="16"
                      >
                        <path
                          d="m5 12 4 4 10-10"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.4"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}

export default UserSettingsPage;
