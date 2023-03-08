import TenantRegister from "./pages/tenantRegister";
import TenantLogin from "./pages/tenantLogin";
import { Routes, Route } from "react-router-dom";
import TenantVerify from "./pages/tenantVerify";

function App() {
  return (
    <>
      <Routes>
        <Route path="/tenantRegister" element={<TenantRegister />} />
        <Route path="/tenantLogin" element={<TenantLogin />} />
        <Route path="/tenantVerify/:username" element={<TenantVerify />} />
      </Routes>
    </>
  );
}

export default App;
