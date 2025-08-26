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

// Auth loader (template)
const AuthLoader = () => (
  <div className="flex items-center justify-center h-screen bg-[#1a1a1a]">
    <p className="text-white text-lg">Checking authentication...</p>
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
    checkAuth();
  }, []);

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
      </Routes>
      <BackToTopButton />
    </>
  );
}

export default App;
