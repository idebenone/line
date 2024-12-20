"use client";

import { Inria_Sans } from "next/font/google";

import WaterMark from "@/components/watermark";
import HeroSection from "@/components/wrapped/hero-section";
import ParticleCanvas from "@/components/wrapped/ParticleCanvas";
import TopRepositories from "@/components/wrapped/TopRepositories";

const inriaSans = Inria_Sans({
  style: "normal",
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  display: "swap",
});

/**
 * TODO
 * TOP LANGUAGES
 * TOP REPOSITOIRES - WITH TOTAL CONTRIBUTIONS
 * TOTAL CONTRIBUTIONS
 * MOST PRODUCTIVE DAY, MOST PRODUCTIVE TIME, DATE
 * PR MERGED
 * ISSUES OPENED
 * LONGEST STREAK
 * ADD COOL ANIMATIONS
 */

export default function Wrapped() {
  return (
    <div className={`${inriaSans.className} w-full h-full`}>
      <ParticleCanvas />
      <HeroSection />
      <WaterMark />
      <TopRepositories />
    </div>
  );
}
