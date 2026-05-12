import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Features } from "@/components/site/Features";
import { Products } from "@/components/site/Products";
import { Promotions } from "@/components/site/Promotions";
import { Story } from "@/components/site/Story";
import { Locations } from "@/components/site/Locations";
import { Careers } from "@/components/site/Careers";
import { CTA } from "@/components/site/CTA";
import { Footer } from "@/components/site/Footer";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    document.title = "FoodStation";

    // Add favicon
    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement("link");
      favicon.setAttribute("rel", "icon");
      favicon.setAttribute("type", "image/jpg");
      favicon.setAttribute("href", "/url.png");
      document.head.appendChild(favicon);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Products sectionOnly />
        <Promotions sectionOnly />
        <Story sectionOnly />
        <Locations sectionOnly />
        <Careers sectionOnly />
        <CTA sectionOnly />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
