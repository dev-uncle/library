import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SidebarProvider, useSidebar } from "./context/SidebarContext";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";

import AdminNavbar from "./navbar/AdminNavbar";
import Sidebar from "./sidebar/Sidebar";

import PagenotFound from "./404-pageNotFoundADMIN/PagenotFound";
import AdminHome from "./adminHome/AdminHome";
import ManageBooks from "./manageBooks/ManageBooks";
import ViewUsers from "./viewUsers/ViewUsers";
import IssuedBooks from "./issuedBooks/IssuedBooks";
import BooksRequests from "./booksRequests/BooksRequests";
import ReturnedBooks from "./returnedBooks/ReturnedBooks";
import EditBookForm from "./manageBooks/EditBookForm";
import AddNewBook from "./addNewBook/AddNewBook";
import AdminLogout from "./adminLogout/AdminLogout";
import UserIndividualPage from "./viewUsers/UserIndividualPage";
import IssueBookToUser from "./issuedBooks/IssueBookToUser";
import AdminSignup from "./createAdminAccount/AdminSignup";
import AdminOtpForm from "./adminOTP/AdminOtpForm";
import ActivityLog from "./activityLog/ActivityLog";

import "./admin-layout.css";

/* Inner layout that can read the sidebar context */
const AdminLayout = () => {
  const { isOpen, toggle } = useSidebar();

  React.useEffect(() => {
    // Save original styles
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlHeight = document.documentElement.style.height;
    const originalBodyHeight = document.body.style.height;

    // Disable viewport-level scrolling for the admin layout
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.height = "100vh";
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";

    return () => {
      // Revert styles when leaving the admin layout
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.documentElement.style.height = originalHtmlHeight;
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.height = originalBodyHeight;
    };
  }, []);

  return (
    <div className={`admin-shell ${isOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <AdminNavbar />
      <Sidebar />
      {/* Mobile backdrop — tap to close sidebar */}
      <div className="sidebar-backdrop" onClick={toggle} />
      <main className="admin-main">
        <Routes>
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/logout" element={<AdminLogout />} />
          <Route path="/admin/managebooks" element={<ManageBooks />} />
          <Route path="/admin/viewusers" element={<ViewUsers />} />
          <Route path="/admin/viewusers/:id" element={<UserIndividualPage />} />
          <Route path="/admin/issuedbooks" element={<IssuedBooks />} />
          <Route path="/admin/issuebooktouser" element={<IssueBookToUser />} />
          <Route path="/admin/booksrequests" element={<BooksRequests />} />
          <Route path="/admin/returnedbooks" element={<ReturnedBooks />} />
          <Route path="/admin/addnewbook" element={<AddNewBook />} />
          <Route path="/admin/activitylog" element={<ActivityLog />} />
          <Route path="/admin/managebooks/:id" element={<EditBookForm />} />
          <Route path="/admin/adminsignup" element={<AdminSignup />} />
          <Route path="/admin/otp" element={<AdminOtpForm />} />
          <Route path="*" element={<PagenotFound />} />
        </Routes>
      </main>
    </div>
  );
};

const AdminAPP = () => {
  return (
    <Router>
      <ThemeProvider>
        <NotificationProvider>
          <SidebarProvider>
            <AdminLayout />
          </SidebarProvider>
        </NotificationProvider>
      </ThemeProvider>
    </Router>
  );
};

export default AdminAPP;
