import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export const CTA = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main>
      <section className="py-24 bg-orange-50/40 dark:bg-background">
        <div className="container text-center max-w-3xl">
          <h2 className="text-5xl sm:text-6xl font-extrabold leading-tight">
            Ready to Satisfy Your <span className="text-gradient">Cravings?</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Join 50,000+ happy customers who trust FoodStation for their daily meals.
            Order now and get your first delivery free!
          </p>
          <Button asChild size="lg" className="mt-10 h-14 px-10 rounded-full gradient-primary text-base font-semibold shadow-glow">
            <a href="#products">Start Ordering Now <ArrowRight className="ml-2 size-5" /></a>
          </Button>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);
