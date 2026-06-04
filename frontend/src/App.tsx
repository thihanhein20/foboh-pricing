import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Profiles from "./pages/Pricing/Profiles";
import CreateProfile from "./pages/Pricing/CreateProfile";
import Layout from "./components/Layout/Layout";

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    getCookie("isAuthenticated") === "true",
  );

  function handleLogout() {
    document.cookie = "isAuthenticated=false; path=/; max-age=0";
    setIsLoggedIn(false);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/pricing" />
            ) : (
              <Login onLogin={() => setIsLoggedIn(true)} />
            )
          }
        />
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Layout onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route index element={<Navigate to="/pricing" />} />
          <Route path="pricing" element={<Profiles />} />
          <Route path="pricing/create" element={<CreateProfile />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
