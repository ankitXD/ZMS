import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "../src/pages/LandingPage";
import AboutUs from "../src/pages/AboutUs";
import Contact from "../src/pages/Contact";
import Animals from "../src/pages/Animals";
import BookTickets from "../src/pages/BookTickets";
import AnimalDetail from "./pages/AnimalDetail";

import AdminLayout from "../src/pages/admin/Layout/AdminLayout";
import Login from "../src/pages/admin/auth/Login";
import SignUp from "../src/pages/admin/auth/SignUp";
import Dashboard from "../src/pages/admin/dashboard/Dashboard";
import ViewAnimals from "../src/pages/admin/animals/ViewAnimals";
import AddAnimals from "../src/pages/admin/animals/AddAnimals";
import EditAnimals from "../src/pages/admin/animals/EditAnimals";
import Admins from "../src/pages/admin/users/Admins";
import ViewMessages from "../src/pages/admin/messages/ViewMessages";
import Orders from "../src/pages/admin/orders/Orders";
import Payments from "../src/pages/admin/payments/Payments";
import Settings from "../src/pages/admin/settings/Settings";
import RequireAuth from "../src/pages/admin/Layout/RequireAuth";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="contact" element={<Contact />} />
        <Route path="animals" element={<Animals />} />
        <Route path="tickets" element={<BookTickets />} />
      </Route>

      <Route path="login" element={<Login />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route
        path="/admin/dashboard"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route
          index
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="animals"
          element={
            <RequireAuth>
              <ViewAnimals />
            </RequireAuth>
          }
        />
        <Route
          path="add/animals"
          element={
            <RequireAuth>
              <AddAnimals />
            </RequireAuth>
          }
        />
        <Route
          path="animals/:id/edit"
          element={
            <RequireAuth>
              <EditAnimals />
            </RequireAuth>
          }
        />
        <Route
          path="admins"
          element={
            <RequireAuth>
              <Admins />
            </RequireAuth>
          }
        />
        <Route
          path="messages"
          element={
            <RequireAuth>
              <ViewMessages />
            </RequireAuth>
          }
        />
        <Route
          path="orders"
          element={
            <RequireAuth>
              <Orders />
            </RequireAuth>
          }
        />
        <Route
          path="payments"
          element={
            <RequireAuth>
              <Payments />
            </RequireAuth>
          }
        />
        <Route
          path="settings"
          element={
            <RequireAuth>
              <Settings />
            </RequireAuth>
          }
        />
      </Route>
      <Route path="/animals/:slug" element={<AnimalDetail />} />
    </Routes>
  );
};

export default App;
