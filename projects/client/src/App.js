import axios from "axios";
import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import TenantRegister from "./pages/tenantRegister";
import TenantLogin from "./pages/tenantLogin";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import NewPassword from "./pages/NewPassword";
import TenantDashboard from "./pages/tenantDashboard";
import UserVerify from "./pages/UserVerify";
import EditUserDetail from "./pages/EditUserDetail";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/greetings`
      );
      setMessage(data?.message || "");
    })();
  }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/users/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/new-password/:id" element={<NewPassword />} />
        <Route path="/tenant/register" element={<TenantRegister />} />
        <Route path="/tenant/login" element={<TenantLogin />} />
        <Route path="/users/login" element={<Login />} />
        <Route path="/tenant/dashboard/:id" element={<TenantDashboard />} />
        <Route path="/users/verify" element={<UserVerify />} />
        <Route path="/users/edit-detail" element={<EditUserDetail />} />
      </Routes>
    </>
  );
}

export default App;
