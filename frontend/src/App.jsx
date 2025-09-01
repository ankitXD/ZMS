import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore.js";
import Layout from "./components/Layout";
import LandingPage from "../src/pages/LandingPage";
import AboutUs from "../src/pages/AboutUs";
import Contact from "../src/pages/Contact";
import Animals from "../src/pages/Animals.jsx";
import BookTickets from "../src/pages/BookTickets";
import AnimalDetail from "../src/pages/AnimalDetail.jsx";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import ScrollToTop, { BackToTopButton } from "./components/ScrollToTop";

import AdminLayout from "../src/pages/admin/Layout/AdminLayout";
import Login from "../src/pages/admin/auth/Login";
import Dashboard from "../src/pages/admin/dashboard/Dashboard";
import ViewAnimals from "../src/pages/admin/animals/ViewAnimals";
import AddAnimals from "../src/pages/admin/animals/AddAnimals";
import EditAnimals from "../src/pages/admin/animals/EditAnimals";
import Admins from "../src/pages/admin/users/Admins";
import ViewMessages from "../src/pages/admin/messages/ViewMessages";
import Orders from "../src/pages/admin/orders/Orders";
import Payments from "../src/pages/admin/payments/Payments";
import ViewReports from "../src/pages/admin/reports/ViewReports";
import Settings from "../src/pages/admin/settings/Settings";
import Custom404 from "./components/Custom404.jsx";

// Auth loader (circle animation)
const AuthLoader = () => (
  <div className="fixed inset-0 z-50 grid place-items-center bg-white/80 backdrop-blur-sm">
    <div className="flex flex-col items-center gap-3">
      <div
        className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"
        role="status"
        aria-label="Loading"
      />
      <p className="text-sm font-medium text-slate-700">Loading…</p>
    </div>
  </div>
);

// Protected route (template) – uses backend roles owner|admin|editor
const ProtectedRoute = ({ children }) => {
  const { authUser, isAuthCheck } = useAuthStore();
  if (isAuthCheck) return <AuthLoader />;
  if (!authUser) return <Navigate to="/login" replace />;
  if (["owner", "admin", "editor"].includes(authUser.role) === false) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const { isAuthCheck, checkAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // Only run full auth session check when user is on admin pages (or the login page).
    // This avoids calling /admin/current-user and /admin/refresh on the public site.
    if (
      location.pathname.startsWith("/admin") ||
      location.pathname === "/login"
    ) {
      checkAuth();
    } else {
      // mark auth check complete for public pages to avoid AuthLoader blocking render
      useAuthStore.setState({ isAuthCheck: false });
    }
    // return () => {
    //   console.log("UnMounting");
    // };
  }, [location.pathname, checkAuth]);

  // Set browser tab title
  useEffect(() => {
    if (location.pathname.startsWith("/admin/dashboard")) {
      document.title = "Admin Dashboard";
    } else {
      document.title = "Zoo Verse";
    }
  }, [location.pathname]);

  if (isAuthCheck) return <AuthLoader />;

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="animals" element={<Animals />} />
          <Route path="animals/:id" element={<AnimalDetail />} />
          <Route path="tickets" element={<BookTickets />} />
          <Route path="terms" element={<Terms />} />
          <Route path="privacy" element={<Privacy />} />
        </Route>

        <Route path="login" element={<Login />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="animals" element={<ViewAnimals />} />
          <Route path="add/animals" element={<AddAnimals />} />
          <Route path="animals/:id/edit" element={<EditAnimals />} />
          <Route path="admins" element={<Admins />} />
          <Route path="messages" element={<ViewMessages />} />
          <Route path="orders" element={<Orders />} />
          <Route path="payments" element={<Payments />} />
          <Route path="reports" element={<ViewReports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Custom404 />} />
      </Routes>
      <BackToTopButton />
    </>
  );
}

export default App;
