import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, MapPin, Truck, ArrowRight as ArrowR } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHeroSlides, resolveImage } from "@/lib/queries";

export const Hero = () => {
  const { data: slides = [] } = useHeroSlides();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (!slides.length) return <div className="h-[80vh] bg-muted animate-pulse" />;
  const s = slides[i];

  return (
    <section className="relative w-full h-[88vh] min-h-[560px] overflow-hidden">
      {slides.map((slide, idx) => (
        <img
          key={slide.id}
          src={resolveImage(slide.image_url)}
          alt={slide.title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <div className="absolute inset-0 gradient-warm mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

      <div className="relative container h-full flex flex-col justify-center text-primary-foreground">
        {s.badge && (
          <span className="inline-flex items-center gap-2 self-start bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-4 py-1.5 text-sm font-semibold mb-6 animate-fade-up">
            <span className="size-1.5 rounded-full bg-white" /> {s.badge}
          </span>
        )}
        <h1 className="font-display font-extrabold text-5xl sm:text-7xl md:text-8xl leading-[0.95] max-w-3xl animate-fade-up">
          {s.title}
        </h1>
        {s.subtitle && (
          <p className="mt-6 text-xl sm:text-2xl text-white/90 max-w-xl animate-fade-up">{s.subtitle}</p>
        )}

        <div className="mt-8 flex items-center gap-6 text-sm font-medium animate-fade-up">
          {s.location && (
            <span className="flex items-center gap-2"><MapPin className="size-4" />{s.location}</span>
          )}
          <span className="h-px w-10 bg-white/40" />
          {s.delivery_text && (
            <span className="flex items-center gap-2"><Truck className="size-4" />{s.delivery_text}</span>
          )}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 max-w-md animate-fade-up">
          <Button asChild size="lg" className="rounded-full h-14 px-8 bg-white text-primary hover:bg-white/95 font-semibold text-base shadow-glow">
            <a href="#products">Explore Menu <ArrowR className="ml-2 size-5" /></a>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full h-14 px-8 border-2 border-white/70 bg-transparent text-white hover:bg-white/10 hover:text-white font-semibold">
            <a href="#locations"><MapPin className="mr-2 size-5" />Our Locations</a>
          </Button>
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button onClick={() => setI((i - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/15 backdrop-blur-md border border-white/25 grid place-items-center text-white hover:bg-white/25 transition-colors">
            <ArrowLeft className="size-5" />
          </button>
          <button onClick={() => setI((i + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/15 backdrop-blur-md border border-white/25 grid place-items-center text-white hover:bg-white/25 transition-colors">
            <ArrowRight className="size-5" />
          </button>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, idx) => (
              <button key={idx} onClick={() => setI(idx)}
                className={`h-1.5 rounded-full transition-all ${idx === i ? "w-10 bg-white" : "w-2 bg-white/50"}`} />
            ))}
          </div>
        </>
      )}
    </section>
  );
};
