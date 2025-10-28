import React from "react";
import HeroSection from "./HeroSection";
import AnimalsCatalogue from "./AnimalsCatalogue";
import WhyVisitUs from "./WhyVisitUs";
import Reels from "./Reels";
import WantToBookTickets from "./WantToBookTickets";

const LandingPage = () => {
  return (
    <div>
      <HeroSection />
      <AnimalsCatalogue />
      <WhyVisitUs />
      <Reels/>
      <WantToBookTickets />
    </div>
  );
};

export default LandingPage;
