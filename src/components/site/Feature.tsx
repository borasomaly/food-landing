import { useFeatures } from "@/lib/queries";
import * as Icons from "lucide-react";

const colorMap: Record<string, string> = {
  orange: "bg-orange-100 text-primary",
  green: "bg-emerald-100 text-emerald-600",
  blue: "bg-sky-100 text-sky-600",
  purple: "bg-violet-100 text-violet-600",
};

export const Features = () => {
  const { data: features = [] } = useFeatures();
  return (
    <section className="py-20 bg-background">
      <div className="container grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map((f) => {
          const Icon = (Icons as Record<string, unknown>)[f.icon] ?? Icons.Sparkles;
          return (
            <div key={f.id} className="bg-card rounded-3xl p-7 shadow-card border border-border/50 hover:-translate-y-1 hover:shadow-soft transition-all">
              <div className={`size-14 rounded-2xl grid place-items-center mb-5 ${colorMap[f.color] ?? colorMap.orange}`}>
                <Icon className="size-7" />
              </div>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
