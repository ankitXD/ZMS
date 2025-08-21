import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "../src/pages/LandingPage";
import AboutUs from "../src/pages/AboutUs";
import Contact from "../src/pages/Contact";
import Animals from "../src/pages/Animals";
import BookTickets from "../src/pages/BookTickets";

import AdminLayout from "../src/pages/admin/Layout/AdminLayout";
import Login from "../src/pages/admin/auth/Login";
import SignUp from "../src/pages/admin/auth/SignUp";
import Dashboard from "../src/pages/admin/dashboard/Dashboard";
import Admins from "../src/pages/admin/users/Admins";
import Settings from "../src/pages/admin/settings/Settings";

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

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="admins" element={<Admins />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default App;
