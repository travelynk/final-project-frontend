import * as React from "react";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <HeroSection />
      {/* <MenuSection />
      <ResultSection /> */}
    </>
  );
}

const HeroSection = () => {
  return (
    <>
      <div className="bg-darkblue03">
        <div className="hero">
          
        </div>
      </div>
    </>
  );
};
