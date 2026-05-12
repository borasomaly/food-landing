import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { useSiteSettings } from "@/lib/queries";

export const Story = () => {
  const { data: settings } = useSiteSettings();
  const brand = settings?.brand?.name ?? "FoodStation";
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section id="story" className="py-20 bg-muted/30">
          <div className="container max-w-4xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">Our Story</span>
            <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold">Crafted with passion since 2020</h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              {brand} began with a simple idea: deliver authentic, fresh, and lovingly prepared meals to every doorstep.
              We partner with local farms, hire passionate chefs, and obsess over every detail — from the first sizzle in the kitchen
              to the moment your order arrives, hot and ready.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              {[["50K+", "Happy customers"], ["120+", "Menu items"], ["30 min", "Avg delivery"]].map(([n, l]) => (
                <div key={l}>
                  <div className="text-3xl sm:text-4xl font-extrabold text-gradient">{n}</div>
                  <div className="text-sm text-muted-foreground mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
