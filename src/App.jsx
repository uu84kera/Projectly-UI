import React, { useState } from "react";
import AppShell from "./components/app/AppShell.jsx";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";

function App() {
  const [page, setPage] = useState("login");

  if (page === "register") {
    return <RegisterPage onNavigate={setPage} />;
  }

  if (page === "forgot") {
    return <ForgotPasswordPage onNavigate={setPage} />;
  }

  if (page === "app") {
    return <AppShell />;
  }

  return <LoginPage onNavigate={setPage} />;
}

export default App;
