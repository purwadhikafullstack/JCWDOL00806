import axios from "axios";
import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import {Routes, Route, Navigate} from 'react-router-dom'
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import TenantRegister from "./pages/tenantRegister";
import TenantLogin from "./pages/tenantLogin";
import TenantVerify from "./pages/tenantVerify";
import Login from './pages/Login'

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
        <Route path="/" element={<HomePage/>} />
        <Route path="/users/register" element={<RegisterPage />} />
        <Route path="/tenantRegister" element={<TenantRegister />} />
        <Route path="/tenantLogin" element={<TenantLogin />} />
        <Route path="/tenantVerify/:username" element={<TenantVerify />} />
        <Route path='/users/login' element={<Login />} />
    </Routes>
    </>
  );
}

export default App