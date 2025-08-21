import React from "react";
import HeroSection from "./HeroSection";
import AnimalsCatalogue from "./AnimalsCatalogue";
import WhyVisitUs from "./WhyVisitUs";
import WantToBookTickets from "./WantToBookTickets";

const LandingPage = () => {
  return (
    <div>
      <HeroSection />
      <AnimalsCatalogue />
      <WhyVisitUs />
      <WantToBookTickets />
    </div>
  );
};

export default LandingPage;
