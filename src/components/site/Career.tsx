import { Briefcase, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { useJobs } from "@/lib/queries";

interface Job {
  id: string;
  title: string;
  department?: string;
  location?: string;
  type?: string;
  description: string;
}

export const Careers = () => {
  const { data: jobs = [] } = useJobs();
  if (!jobs.length) return null;
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section id="careers" className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">Join the team</span>
              <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold">Careers at FoodStation</h2>
              <p className="mt-4 text-muted-foreground text-lg">We're always looking for passionate people to join our family.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
              {(jobs as Job[]).map((j) => (
                <div key={j.id} className="bg-card rounded-2xl p-6 border border-border shadow-card overflow-hidden group hover:-translate-y-1 transition-transform">
                  <h3 className="text-xl font-bold">{j.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {j.department && <span className="flex items-center gap-1.5"><Briefcase className="size-4" />{j.department}</span>}
                    {j.location && <span className="flex items-center gap-1.5"><MapPin className="size-4" />{j.location}</span>}
                  </div>
                  {j.type && <span className="inline-block mt-3 bg-orange-100 text-primary text-xs font-semibold px-3 py-1 rounded-full">{j.type}</span>}
                  <p className="mt-4 text-muted-foreground text-sm leading-relaxed">{j.description}</p>
                  <Button asChild className="mt-5 w-full rounded-full h-12"><a href={`mailto:careers@foodstation.com?subject=${encodeURIComponent("Application: " + j.title)}`}>Apply Now</a></Button>
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
