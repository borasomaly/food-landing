import { MapPin, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { useLocations } from "@/lib/queries";

interface Location {
  id: string;
  name: string;
  badge?: string;
  address?: string;
  phone?: string;
  hours?: string;
  map_url?: string;
}

interface LocationsProps {
  sectionOnly?: boolean;
}

export const Locations = ({ sectionOnly = false }: LocationsProps) => {
  const { data: locations = [] } = useLocations();

  const section = (
    <section id="locations" className="py-20 bg-background">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Find Us</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold">Our Locations</h2>
          <p className="mt-4 text-muted-foreground text-lg">Visit us at any of our cozy spots across the city.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {(locations as Location[]).map((loc, i) => (
            <div key={loc.id} className={`rounded-3xl p-7 shadow-card overflow-hidden group hover:-translate-y-1 transition-transform transition-all ${i === 0 ? "border-2 bg-card" : "border border-border bg-card"}`}>
              {loc.badge && <span className="inline-block bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full mb-3">{loc.badge}</span>}
              <h3 className="text-2xl font-extrabold">{loc.name}</h3>
              <div className="mt-5 space-y-3 text-sm">
                {loc.address && <p className="flex gap-3 items-start"><MapPin className="size-5 text-primary shrink-0 mt-0.5" />{loc.address}</p>}
                {loc.phone && <p className="flex gap-3 items-center"><Phone className="size-5 text-primary shrink-0" />{loc.phone}</p>}
                {loc.hours && <p className="flex gap-3 items-center"><Clock className="size-5 text-primary shrink-0" />{loc.hours}</p>}
              </div>
              <Button asChild className="mt-6 w-full rounded-full h-12">
                <a href={loc.map_url ?? `https://maps.google.com/?q=${encodeURIComponent(loc.address ?? loc.name)}`} target="_blank" rel="noreferrer">Get Directions</a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  if (sectionOnly) {
    return section;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>{section}</main>
      <Footer />
    </div>
  );
};
