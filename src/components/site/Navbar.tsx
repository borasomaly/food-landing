import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.jpg";

const links = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Promotions", href: "/promotions" },
  { label: "Our Story", href: "/story" },
  { label: "Locations", href: "/locations" },
  { label: "Careers", href: "/careers" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const currentPath = pathname + (hash || "");

  return (
    <header className="sticky top-0 z-50 w-full bg-background/85 backdrop-blur-xl border-b border-border/60">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="FoodStation logo" className="h-10 w-auto rounded-full object-cover" />
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {links.map((l) => {
            const isActive = currentPath === l.href;
            return (
              <Link
                key={l.href}
                to={l.href}
                className={`transition-colors ${isActive ? "text-primary" : "text-foreground/80 hover:text-primary"}`}>
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <Button asChild variant="ghost" size="sm"><Link to="/auth">Sign in</Link></Button>
          <Button asChild size="sm" className="rounded-full px-5"><Link to="/#contact">Contact Us</Link></Button>
        </div>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border/60 bg-background animate-fade-up">
          <div className="container py-4 flex flex-col gap-1">
            {links.map((l) => {
              const isActive = currentPath === l.href;
              return (
                <Link
                  key={l.href}
                  to={l.href}
                  onClick={() => setOpen(false)}
                  className={`py-3 px-2 rounded-lg text-base font-medium transition-colors ${isActive ? "text-primary" : "text-foreground/80 hover:text-primary"}`}>
                  {l.label}
                </Link>
              );
            })}
            <Button asChild className="mt-3 w-full rounded-full"><Link to="/#contact" onClick={() => setOpen(false)}>Contact Us</Link></Button>
            <Button asChild variant="outline" className="mt-2 w-full rounded-full"><Link to="/auth" onClick={() => setOpen(false)}>Sign in</Link></Button>
          </div>
        </div>
      )}
    </header>
  );
};
