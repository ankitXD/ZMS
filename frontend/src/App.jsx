import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "../src/pages/LandingPage";
import AboutUs from "../src/pages/AboutUs";
import Contact from "../src/pages/Contact";
import Animals from "../src/pages/Animals";
import BookTickets from "../src/pages/BookTickets";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="contact" element={<Contact />} />
        <Route path="animals" element={<Animals />} />
        <Route path="tickets" element={<BookTickets />} />
        {/* <Route path="about" element={<AboutUs />} /> */}
      </Route>
    </Routes>
  );
};

export default App;
