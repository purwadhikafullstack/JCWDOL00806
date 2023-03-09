import TenantRegister from "./pages/tenantRegister";
import TenantLogin from "./pages/tenantLogin";
import { Routes, Route } from "react-router-dom";
import TenantVerify from "./pages/tenantVerify";
import TenantDashboard from "./pages/tenantDashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/tenantRegister" element={<TenantRegister />} />
        <Route path="/tenantLogin" element={<TenantLogin />} />
        <Route path="/tenantVerify/:username" element={<TenantVerify />} />
        <Route path="/tenantDashboard" element={<TenantDashboard />} />
      </Routes>
    </>
  );
}

export default App;
