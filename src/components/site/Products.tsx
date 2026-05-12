import { useState, useMemo } from "react";
import { Search, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { useCategories, useProducts, resolveImage } from "@/lib/queries";

interface ProductsProps {
  sectionOnly?: boolean;
}

export const Products = ({ sectionOnly = false }: ProductsProps) => {
  const { data: categories = [] } = useCategories();
  const { data: products = [] } = useProducts();
  const [active, setActive] = useState<string>("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return products.filter((p: any) => {
      const matchCat = active === "all" || p.categories?.slug === active;
      const matchQ = !q || p.name.toLowerCase().includes(q.toLowerCase());
      return matchCat && matchQ;
    });
  }, [products, active, q]);

  const section = (
    <section id="products" className="bg-muted/30">
      <div className="gradient-primary text-primary-foreground py-16">
        <div className="container">
          <h2 className="text-4xl sm:text-5xl font-extrabold">Our Products</h2>
          <p className="mt-3 text-lg text-white/90 max-w-xl">Discover our delicious selection of fresh, quality food</p>
        </div>
      </div>

      <div className="container py-10 -mt-8 relative">
        <div className="bg-card rounded-2xl shadow-soft p-2 flex items-center gap-3 border border-border max-w-2xl mx-auto">
          <Search className="size-5 text-muted-foreground ml-3" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products..." className="border-0 focus-visible:ring-0 h-12 text-base" />
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-thin">
          {[{ slug: "all", name: "All" }, ...categories].map((c: any) => (
            <button key={c.slug} onClick={() => setActive(c.slug)}
              className={`shrink-0 px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${active === c.slug ? "bg-primary text-primary-foreground shadow-soft" : "bg-card text-foreground border border-border hover:border-primary/40"}`}>
              {c.name}
            </button>
          ))}
        </div>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p: any) => (
            <article key={p.id} className="bg-card rounded-3xl overflow-hidden shadow-card border border-border/50 group hover:-translate-y-1 transition-transform">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={resolveImage(p.image_url)} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {p.badge && (
                  <span className="absolute top-4 left-4 bg-white/95 backdrop-blur text-primary font-semibold text-xs px-3 py-1.5 rounded-full">{p.badge}</span>
                )}
                <span className="absolute top-4 right-4 bg-white/95 backdrop-blur text-foreground font-semibold text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                  <Star className="size-3.5 fill-yellow-400 text-yellow-400" />{p.rating}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold">{p.name}</h3>
                <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">{p.description}</p>
                <p className="mt-4 text-2xl font-extrabold text-primary">${Number(p.price).toFixed(2)}</p>
              </div>
            </article>
          ))}
        </div>

        {!filtered.length && <p className="text-center text-muted-foreground py-16">No products found.</p>}
      </div>
    </section>
  );

  if (sectionOnly) {
    return section;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {section}
      </main>
      <Footer />
    </div>
  );
};
