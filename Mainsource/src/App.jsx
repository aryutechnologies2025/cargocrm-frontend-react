import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Roles from "./pages/Roles";
import Sitemap from "./pages/Sitemap";;
import User_main from "./components/user component/User_main";
import SystemSetting_Main from "./components/system setting component/SystemSetting_Main";
import Customer_main from "./components/core entities component/Customer_main";
import Beneficiary_main from "./components/core entities component/Beneficiary_main";
import Parcel_main from "./components/core entities component/Parcel_main";
import Event_main from "./components/core entities component/Event_main";
import Order_main from "./components/core entities component/Order_main";
import Run_main from "./components/core entities component/Run_main";
import ContactUs_main from "./components/Contact us component/ContactUs_main";
import LoginLog_main from "./components/Login logs component/LoginLog_main";

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        style={{ zIndex: 999999 }} />
        
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<PageNotFound />} />
          <Route path="sitemap" element={<Sitemap />} />
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/users" element={<User_main />} />
          <Route path="/customer" element={<Customer_main />} />
          <Route path="/beneficiary" element={<Beneficiary_main />} />
          <Route path="/order" element={<Order_main />} />
          <Route path="/parcel" element={<Parcel_main />} />
          <Route path="/run" element={<Run_main />} />
          <Route path="/event" element={<Event_main />} />
          <Route path="/contact-us" element={<ContactUs_main />} />
          <Route path="/login-logs" element={<LoginLog_main />} />
          <Route path="/system-setting" element={<SystemSetting_Main />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
