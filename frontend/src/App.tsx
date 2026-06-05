import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Profiles from "./pages/Pricing/Profiles";
import CreateProfile from "./pages/Pricing/CreateProfile";
import EditProfile from "./pages/Pricing/EditProfile";
import Layout from "./components/Layout/Layout";
import axiosInstance from "./services/axios";
import ComingSoon from "./pages/ComingSoon/ComingSoon";

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

// Restore headers on app load
const savedEmail = getCookie("userEmail");
const savedPassword = getCookie("userPassword");
if (savedEmail && savedPassword) {
  axiosInstance.defaults.headers.common["email"] = savedEmail;
  axiosInstance.defaults.headers.common["password"] = savedPassword;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    getCookie("isAuthenticated") === "true",
  );

  function handleLogout() {
    document.cookie = "isAuthenticated=false; path=/; max-age=0";
    document.cookie = "userEmail=; path=/; max-age=0";
    document.cookie = "userPassword=; path=/; max-age=0";
    axiosInstance.defaults.headers.common["email"] = "";
    axiosInstance.defaults.headers.common["password"] = "";
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
          <Route path="dashboard" element={<ComingSoon />} />
          <Route path="orders" element={<ComingSoon />} />
          <Route path="customers" element={<ComingSoon />} />
          <Route path="products" element={<ComingSoon />} />
          <Route path="settings" element={<ComingSoon />} />
          <Route path="pricing" element={<Profiles />} />
          <Route path="pricing/create" element={<CreateProfile />} />
          <Route path="pricing/edit/:id" element={<EditProfile />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
