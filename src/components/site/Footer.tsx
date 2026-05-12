import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useSiteSettings } from "@/lib/queries";
import logo from "@/assets/logo.jpg";

export const Footer = () => {
  const { data: settings } = useSiteSettings();
  const brand = settings?.brand ?? {};
  const contact = settings?.contact ?? {};
  const socials = settings?.socials ?? {};

  return (
    <footer id="contact" className="bg-[hsl(222_47%_11%)] text-white">
      <div className="container py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <h3 className="text-2xl font-extrabold">{brand.name ?? "FoodStation"}</h3>
          <p className="mt-3 text-white/70 text-sm leading-relaxed">{brand.tagline}</p>
          <div className="mt-5 flex gap-3">
            {socials.facebook && <a href={socials.facebook} aria-label="Facebook" className="size-10 rounded-full bg-white/10 grid place-items-center hover:bg-primary transition-colors"><Facebook className="size-4" /></a>}
            {socials.instagram && <a href={socials.instagram} aria-label="Instagram" className="size-10 rounded-full bg-white/10 grid place-items-center hover:bg-primary transition-colors"><Instagram className="size-4" /></a>}
            {socials.twitter && <a href={socials.twitter} aria-label="Twitter" className="size-10 rounded-full bg-white/10 grid place-items-center hover:bg-primary transition-colors"><Twitter className="size-4" /></a>}
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2.5 text-sm text-white/70">
            <li><a href="/" className="hover:text-primary">Home</a></li>
            <li><a href="#products" className="hover:text-primary">Products</a></li>
            <li><a href="#promotions" className="hover:text-primary">Promotions</a></li>
            <li><a href="#story" className="hover:text-primary">Our Story</a></li>
            <li><a href="#locations" className="hover:text-primary">Locations</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Company</h4>
          <ul className="space-y-2.5 text-sm text-white/70">
            <li><a href="#careers" className="hover:text-primary">Careers</a></li>
            <li><a href="#contact" className="hover:text-primary">Contact</a></li>
            <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
            <li><Link to="/admin" className="hover:text-primary">Admin Panel</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Contact Us</h4>
          <ul className="space-y-3 text-sm text-white/70">
            {contact.address && <li className="flex gap-3 items-start"><MapPin className="size-4 text-primary shrink-0 mt-0.5" />{contact.address}</li>}
            {contact.phone && <li className="flex gap-3 items-center"><Phone className="size-4 text-primary shrink-0" />{contact.phone}</li>}
            {contact.email && <li className="flex gap-3 items-center"><Mail className="size-4 text-primary shrink-0" />{contact.email}</li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container py-5 text-center text-sm text-white/50">© {new Date().getFullYear()} {brand.name ?? "FoodStation"}. All rights reserved.</div>
      </div>
    </footer>
  );
};
