import Image from "next/image";


import Hero from "./components/Hero";
import Artwork from "./components/Artwork";

import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
    <div className="gradient-bg-hero">


      <Hero />
    </div>
    <Artwork />
    <Footer />
  </div>

  );
}