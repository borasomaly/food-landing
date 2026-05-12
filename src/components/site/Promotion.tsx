import { Gift, Tag } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { usePromotions, resolveImage } from "@/lib/queries";

export const Promotions = () => {
  const { data: promos = [] } = usePromotions();
  const featured = promos.find((p: any) => p.featured) ?? promos[0];
  const others = promos.filter((p: any) => p.id !== featured?.id);

  if (!promos.length) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section id="promotions" className="bg-background">
          <div className="gradient-primary text-primary-foreground py-16">
            <div className="container text-center">
              <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-4 py-1.5 text-sm font-semibold">
                <Tag className="size-4" /> Hot Deals
              </span>
              <h2 className="mt-4 text-4xl sm:text-5xl font-extrabold">Special Promotions</h2>
              <p className="mt-3 text-lg text-white/90 max-w-xl mx-auto">Save big with our exclusive deals and limited-time offers</p>
            </div>
          </div>

          <div className="container py-14">
            {featured && (
              <>
                <h3 className="text-2xl font-bold flex items-center gap-3 mb-6">
                  <Gift className="size-6 text-primary" /> Deal of the Day
                </h3>
                <div className="bg-orange-50/60 dark:bg-card rounded-3xl overflow-hidden border border-border/60 grid md:grid-cols-2 gap-0 shadow-card">
                  <div className="relative aspect-[4/3] md:aspect-auto">
                    {featured.image_url && <img src={resolveImage(featured.image_url)} alt={featured.title} loading="lazy" className="w-full h-full object-cover" />}
                    {featured.discount && (
                      <span className="absolute top-5 left-5 bg-destructive text-destructive-foreground font-bold text-lg px-5 py-2 rounded-full shadow-lg">{featured.discount}</span>
                    )}
                  </div>
                  <div className="p-8 md:p-10 flex flex-col justify-center">
                    <h4 className="text-3xl font-extrabold">{featured.title}</h4>
                    <p className="mt-3 text-muted-foreground text-lg">{featured.description}</p>
                    {featured.expires_at && (
                      <p className="mt-6 text-sm font-medium text-primary">Expires: {new Date(featured.expires_at).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {others.length > 0 && (
              <div className="mt-10 grid sm:grid-cols-2 gap-5">
                {others.map((p: any) => (
                  <div key={p.id} className="bg-card rounded-2xl p-6 border border-border flex items-center gap-5 shadow-card">
                    {p.discount && <span className="text-2xl font-extrabold text-primary shrink-0">{p.discount}</span>}
                    <div>
                      <h5 className="font-bold text-lg">{p.title}</h5>
                      <p className="text-sm text-muted-foreground">{p.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
