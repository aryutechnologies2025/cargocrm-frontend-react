import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Roles from "./pages/Roles";
import Sitemap from "./pages/Sitemap";
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
import Collection_main from "./components/core entities component/Collection_main";
import EventList_main from "./components/core entities component/EventList_main";
import Receipt_main from "./components/receipt component/Receipt_main";
import Pdf_details from "./components/pdf component/Pdf_details";
import FormOrder from "./components/order form component/FormOrder";
import FormOrder_main from "./pages/FormOrder_main";
import ProtectedRoute from "./pages/ProtectedRoute";

function App() {
  const ROLES = {
    ADMIN: "Admin",
    AGENT: "Agent",
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        style={{ zIndex: 999999 }}
      />

      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/page-not-found" element={<PageNotFound />} />
          <Route path="sitemap" element={<Sitemap />} />
          <Route path="/" element={<Login />} />

          {/* Protected Routes - Accessible by all logged-in users */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.AGENT]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.AGENT]}>
                <Order_main />
              </ProtectedRoute>
            }
          />

          <Route
            path="/collection"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.AGENT]}>
                <Collection_main />
              </ProtectedRoute>
            }
          />

          <Route
            path="/run"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.AGENT]}>
                <Run_main />
              </ProtectedRoute>
            }
          />

          <Route
            path="/event"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.AGENT]}>
                <Event_main />
              </ProtectedRoute>
            }
          />

          <Route
            path="/event-master"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.AGENT]}>
                <EventList_main />
              </ProtectedRoute>
            }
          />

          <Route
            path="/receipt"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.AGENT]}>
                <Receipt_main />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pdf-download"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.AGENT]}>
                <Pdf_details />
              </ProtectedRoute>
            }
          />

          <Route
            path="/form-order"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.AGENT]}>
                <FormOrder_main />
              </ProtectedRoute>
            }
          />

          {/* Admin-only Routes (Restricted from Agents) */}
          <Route
            path="/roles"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <Roles />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <User_main />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <Customer_main />
              </ProtectedRoute>
            }
          />

          <Route
            path="/beneficiary"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <Beneficiary_main />
              </ProtectedRoute>
            }
          />

          <Route
            path="/parcel"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <Parcel_main />
              </ProtectedRoute>
            }
          />

          <Route
            path="/contact-us"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <ContactUs_main />
              </ProtectedRoute>
            }
          />

          <Route
            path="/audit-logs"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <LoginLog_main />
              </ProtectedRoute>
            }
          />

          <Route
            path="/system-setting"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <SystemSetting_Main />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Dashboard from "./pages/Dashboard";
// import Login from "./pages/Login";
// import PageNotFound from "./pages/PageNotFound";
// import Roles from "./pages/Roles";
// import Sitemap from "./pages/Sitemap";;
// import User_main from "./components/user component/User_main";
// import SystemSetting_Main from "./components/system setting component/SystemSetting_Main";
// import Customer_main from "./components/core entities component/Customer_main";
// import Beneficiary_main from "./components/core entities component/Beneficiary_main";
// import Parcel_main from "./components/core entities component/Parcel_main";
// import Event_main from "./components/core entities component/Event_main";
// import Order_main from "./components/core entities component/Order_main";
// import Run_main from "./components/core entities component/Run_main";
// import ContactUs_main from "./components/Contact us component/ContactUs_main";
// import LoginLog_main from "./components/Login logs component/LoginLog_main";
// import Collection_main from "./components/core entities component/Collection_main";
// import EventList_main from "./components/core entities component/EventList_main";
// import Receipt_main from "./components/receipt component/Receipt_main";
// import Pdf_details from "./components/pdf component/Pdf_details";
// import FormOrder from "./components/order form component/FormOrder";
// import FormOrder_main from "./pages/FormOrder_main";

// function App() {
//   return (
//     <>
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         style={{ zIndex: 999999 }} />

//       <BrowserRouter>
//         <Routes>
//           <Route path="*" element={<PageNotFound />} />
//           <Route path="sitemap" element={<Sitemap />} />
//           <Route path="/" element={<Login />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/roles" element={<Roles />} />
//           <Route path="/users" element={<User_main />} />
//           <Route path="/customer" element={<Customer_main />} />
//           <Route path="/beneficiary" element={<Beneficiary_main />} />
//           <Route path="/order" element={<Order_main />} />
//           <Route path="/parcel" element={<Parcel_main />} />
//           <Route path="/run" element={<Run_main />} />
//           <Route path="/collection" element={<Collection_main />} />
//           <Route path="/event" element={<Event_main />} />
//           <Route path="/event-master" element={<EventList_main />} />
//           <Route path="/receipt" element={<Receipt_main />} />
//           <Route path="/contact-us" element={<ContactUs_main />} />
//           <Route path="/audit-logs" element={<LoginLog_main />} />
//           <Route path="/pdf-download" element={<Pdf_details />} />
//           <Route path="/system-setting" element={<SystemSetting_Main />} />
//           <Route path="/form-order" element={<FormOrder_main />} />

//         </Routes>
//       </BrowserRouter>
//     </>
//   );
// }

// export default App;
