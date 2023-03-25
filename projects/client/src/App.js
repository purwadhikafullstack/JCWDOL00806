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
import UserChangePassword from "./pages/UserChangePassword";
import ChangeEmail from "./pages/ChangeEmail";
import TenantProperty from "./pages/TenantProperty";
import PassportLogin from "./pages/PassportLogin";
import UserDetail from "./pages/UserDetail";
import RoomUnavailable from "./pages/RoomUnavailable";
import RoomSpecial from "./pages/RoomSpecial";
import TenantRoom from "./pages/TenantRoom";
import CreateRoom from "./pages/CreateRoom";
import EditRoom from "./pages/EditRoom";
import Unauthorized from "./pages/Unauthorized";
import CalendarPage from "./pages/CalendarPage";
import PropertySearch from "./pages/PropertySearch";
import TenantPropertyRoomList from "./pages/TenantPropertyRoomList";
import NotFound from "./pages/NotFound";

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
        <Route path="/tenant/dashboard" element={<TenantDashboard />} />
        <Route path="/tenant/property" element={<TenantProperty />} />
        <Route path="/users/verify" element={<UserVerify />} />
        <Route path="/users/edit-detail" element={<EditUserDetail />} />
        <Route path="/users/change-password" element={<UserChangePassword />} />
        <Route path="/users/change-email" element={<ChangeEmail />} />
        <Route path="/passport-login" element={<PassportLogin />} />
        <Route path="/users/my-profile" element={<UserDetail />} />
        <Route
          path="/tenant/room/:propertyID/unavailable/:roomID"
          element={<RoomUnavailable />}
        />
        <Route
          path="/tenant/room/:propertyID/special-price/:roomID"
          element={<RoomSpecial />}
        />
        <Route path="/tenant/room/:propertyID" element={<TenantRoom />} />
        <Route
          path="/tenant/room/:propertyID/create"
          element={<CreateRoom />}
        />
        <Route
          path="/tenant/room/:propertyID/edit/:roomID"
          element={<EditRoom />}
        />
        <Route path="/401" element={<Unauthorized />} />
        <Route
          path="/tenant/calendar-view/:propertyID"
          element={<CalendarPage />}
        />
        <Route path="/search" element={<PropertySearch />} />
        <Route
          path="/tenant/all-property-room-list"
          element={<TenantPropertyRoomList />}
        />
        <Route path="/404" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
