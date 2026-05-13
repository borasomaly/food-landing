import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { CrudTable } from "@/components/admin/CrudTable";
import { Package, Tag, Image, Sparkles, Gift, MapPin, Briefcase, Settings, LogOut, UtensilsCrossed, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSiteSettings } from "@/lib/queries";
import { useQueryClient } from "@tanstack/react-query";

type Section = "products" | "categories" | "hero" | "features" | "promotions" | "locations" | "jobs" | "settings" | "admins";

type IconType = React.ComponentType<{ className?: string }>;

const nav: { key: Section; label: string; icon: IconType }[] = [
  { key: "products", label: "Products", icon: Package },
  { key: "categories", label: "Categories", icon: Tag },
  { key: "hero", label: "Hero Slides", icon: Image },
  { key: "features", label: "Features", icon: Sparkles },
  { key: "promotions", label: "Promotions", icon: Gift },
  { key: "locations", label: "Locations", icon: MapPin },
  { key: "jobs", label: "Jobs", icon: Briefcase },
  { key: "admins", label: "Admin Access", icon: ShieldAlert },
  { key: "settings", label: "Site Settings", icon: Settings },
];

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const nav2 = useNavigate();
  const [section, setSection] = useState<Section>("products");

  useEffect(() => { document.title = "Admin — FoodStation"; }, []);
  useEffect(() => { if (!loading && !user) nav2("/auth"); }, [loading, user, nav2]);

  if (loading) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading...</div>;
  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center bg-muted/30 px-4">
        <div className="bg-card rounded-3xl p-8 shadow-soft border border-border max-w-md text-center">
          <ShieldAlert className="size-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Admin access required</h1>
          <p className="text-muted-foreground mt-3">Your account ({user.email}) is signed in but not an admin yet.</p>
          <div className="bg-muted rounded-xl p-4 mt-5 text-left text-xs font-mono break-all">
            User ID: {user.id}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            To grant admin: open Lovable Cloud → SQL Editor and run:<br />
            <code className="block bg-muted rounded p-2 mt-2 text-left text-xs">
              INSERT INTO user_roles(user_id, role) VALUES ('{user.id}', 'admin');
            </code>
          </p>
          <Button variant="outline" onClick={async () => { await signOut(); nav2("/auth"); }} className="mt-5 rounded-full">Sign out</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="w-64 bg-[hsl(222_47%_11%)] text-white p-5 hidden md:flex flex-col">
        <Link to="/" className="flex items-center gap-2 font-display font-extrabold text-lg mb-8">
          <span className="size-9 rounded-xl gradient-primary grid place-items-center"><UtensilsCrossed className="size-5" /></span>
          FoodStation
        </Link>
        <nav className="space-y-1 flex-1">
          {nav.map((n) => (
            <button key={n.key} onClick={() => setSection(n.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${section === n.key ? "bg-primary text-primary-foreground" : "text-white/70 hover:text-white hover:bg-white/5"}`}>
              <n.icon className="size-4" />{n.label}
            </button>
          ))}
        </nav>
        <Button variant="ghost" onClick={async () => { await signOut(); nav2("/"); }} className="text-white/70 hover:text-white hover:bg-white/5 justify-start">
          <LogOut className="size-4 mr-2" />Sign out
        </Button>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="md:hidden bg-card border-b border-border p-4 flex items-center justify-between">
          <Link to="/" className="font-extrabold">FoodStation Admin</Link>
          <Button size="sm" variant="ghost" onClick={async () => { await signOut(); nav2("/"); }}><LogOut className="size-4" /></Button>
        </header>
        <div className="md:hidden bg-card border-b border-border p-3 overflow-x-auto">
          <div className="flex gap-2">
            {nav.map((n) => (
              <button key={n.key} onClick={() => setSection(n.key)}
                className={`shrink-0 px-3 py-2 rounded-full text-xs font-semibold ${section === n.key ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                {n.label}
              </button>
            ))}
          </div>
        </div>

        <main className="p-6 md:p-10 max-w-6xl">
          {section === "products" && <CrudTable table="products" title="Products" displayFields={["name", "price", "rating", "featured"]} orderBy={{ column: "created_at", ascending: false }}
            fields={[
              { name: "name", label: "Name", type: "text" },
              { name: "description", label: "Description", type: "textarea" },
              { name: "price", label: "Price", type: "number" },
              { name: "image_url", label: "Image URL", type: "text", placeholder: "https://..." },
              { name: "category_id", label: "Category ID (optional)", type: "text" },
              { name: "rating", label: "Rating", type: "number" },
              { name: "badge", label: "Badge", type: "text" },
              { name: "featured", label: "Featured", type: "boolean" },
            ]} />}
          {section === "categories" && <CrudTable table="categories" title="Categories" displayFields={["name", "slug", "sort_order"]} orderBy={{ column: "sort_order" }}
            fields={[
              { name: "name", label: "Name", type: "text" },
              { name: "slug", label: "Slug", type: "text" },
              { name: "sort_order", label: "Sort order", type: "number" },
            ]} />}
          {section === "hero" && <CrudTable table="hero_slides" title="Hero Slides" displayFields={["title", "badge", "sort_order"]} orderBy={{ column: "sort_order" }}
            fields={[
              { name: "title", label: "Title", type: "text" },
              { name: "subtitle", label: "Subtitle", type: "text" },
              { name: "badge", label: "Badge", type: "text" },
              { name: "image_url", label: "Image URL", type: "text" },
              { name: "location", label: "Location", type: "text" },
              { name: "delivery_text", label: "Delivery text", type: "text" },
              { name: "sort_order", label: "Sort order", type: "number" },
            ]} />}
          {section === "features" && <CrudTable table="features" title="Features" displayFields={["title", "icon", "color", "sort_order"]} orderBy={{ column: "sort_order" }}
            fields={[
              { name: "title", label: "Title", type: "text" },
              { name: "description", label: "Description", type: "textarea" },
              { name: "icon", label: "Lucide icon name", type: "text", placeholder: "Truck, Shield, Headphones..." },
              { name: "color", label: "Color (orange/green/blue/purple)", type: "text" },
              { name: "sort_order", label: "Sort order", type: "number" },
            ]} />}
          {section === "promotions" && <CrudTable table="promotions" title="Promotions" displayFields={["title", "discount", "featured"]} orderBy={{ column: "created_at", ascending: false }}
            fields={[
              { name: "title", label: "Title", type: "text" },
              { name: "description", label: "Description", type: "textarea" },
              { name: "discount", label: "Discount label", type: "text", placeholder: "-30%" },
              { name: "image_url", label: "Image URL", type: "text" },
              { name: "expires_at", label: "Expires at", type: "datetime" },
              { name: "featured", label: "Featured (deal of the day)", type: "boolean" },
            ]} />}
          {section === "locations" && <CrudTable table="locations" title="Locations" displayFields={["name", "badge", "phone", "sort_order"]} orderBy={{ column: "sort_order" }}
            fields={[
              { name: "name", label: "Name", type: "text" },
              { name: "badge", label: "Badge", type: "text" },
              { name: "address", label: "Address", type: "textarea" },
              { name: "phone", label: "Phone", type: "text" },
              { name: "hours", label: "Hours", type: "text" },
              { name: "map_url", label: "Map URL", type: "text" },
              { name: "sort_order", label: "Sort order", type: "number" },
            ]} />}
          {section === "jobs" && <CrudTable table="jobs" title="Jobs" displayFields={["title", "department", "location", "active"]} orderBy={{ column: "created_at", ascending: false }}
            fields={[
              { name: "title", label: "Title", type: "text" },
              { name: "department", label: "Department", type: "text" },
              { name: "location", label: "Location", type: "text" },
              { name: "type", label: "Type", type: "text" },
              { name: "description", label: "Description", type: "textarea" },
              { name: "active", label: "Active", type: "boolean" },
            ]} />}
          {section === "admins" && <AdminAccessManager />}
          {section === "settings" && <SiteSettingsEditor />}
        </main>
      </div>
    </div>
  );
};

const SiteSettingsEditor = () => {
  const { data: settings } = useSiteSettings();
  const qc = useQueryClient();
  const [brand, setBrand] = useState({ name: "", tagline: "" });
  const [contact, setContact] = useState({ address: "", phone: "", email: "" });
  const [socials, setSocials] = useState({ facebook: "", instagram: "", twitter: "" });

  useEffect(() => {
    if (settings?.brand) setBrand({ name: settings.brand.name ?? "", tagline: settings.brand.tagline ?? "" });
    if (settings?.contact) setContact({ address: settings.contact.address ?? "", phone: settings.contact.phone ?? "", email: settings.contact.email ?? "" });
    if (settings?.socials) setSocials({ facebook: settings.socials.facebook ?? "", instagram: settings.socials.instagram ?? "", twitter: settings.socials.twitter ?? "" });
  }, [settings]);

  const save = async () => {
    const upserts = [
      { key: "brand", value: brand },
      { key: "contact", value: contact },
      { key: "socials", value: socials },
    ];
    const { error } = await supabase.from("site_settings").upsert(upserts);
    if (error) toast.error(error.message);
    else { toast.success("Settings saved"); qc.invalidateQueries(); }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Site Settings</h2>
      <div className="grid gap-6 max-w-2xl">
        <section className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-bold mb-4">Brand</h3>
          <div className="space-y-3">
            <div><Label>Name</Label><Input value={brand.name} onChange={(e) => setBrand({ ...brand, name: e.target.value })} className="mt-1.5" /></div>
            <div><Label>Tagline</Label><Textarea value={brand.tagline} onChange={(e) => setBrand({ ...brand, tagline: e.target.value })} className="mt-1.5" /></div>
          </div>
        </section>
        <section className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-bold mb-4">Contact</h3>
          <div className="space-y-3">
            <div><Label>Address</Label><Input value={contact.address} onChange={(e) => setContact({ ...contact, address: e.target.value })} className="mt-1.5" /></div>
            <div><Label>Phone</Label><Input value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} className="mt-1.5" /></div>
            <div><Label>Email</Label><Input value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} className="mt-1.5" /></div>
          </div>
        </section>
        <section className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-bold mb-4">Social Links</h3>
          <div className="space-y-3">
            <div><Label>Facebook</Label><Input value={socials.facebook} onChange={(e) => setSocials({ ...socials, facebook: e.target.value })} className="mt-1.5" /></div>
            <div><Label>Instagram</Label><Input value={socials.instagram} onChange={(e) => setSocials({ ...socials, instagram: e.target.value })} className="mt-1.5" /></div>
            <div><Label>Twitter</Label><Input value={socials.twitter} onChange={(e) => setSocials({ ...socials, twitter: e.target.value })} className="mt-1.5" /></div>
          </div>
        </section>
        <Button onClick={save} className="rounded-full self-start h-12 px-8">Save Settings</Button>
      </div>
    </div>
  );
};

const AdminAccessManager = () => {
  const [adminEmails, setAdminEmails] = useState<string[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingAdmins, setLoadingAdmins] = useState(true);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoadingAdmins(true);
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");

      if (error) throw error;

      const adminIds = new Set(data?.map((r) => r.user_id) ?? []);
      
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id");

      if (profilesError) throw profilesError;

      const adminProfileIds = profiles
        ?.filter((p) => adminIds.has(p.id))
        .map((p) => p.id) ?? [];

      setAdminEmails(adminProfileIds);
    } catch (err) {
      console.error("[v0] Error fetching admins:", err);
      toast.error("Failed to load admin users");
    } finally {
      setLoadingAdmins(false);
    }
  };

  const grantAdminAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) {
      toast.error("Please enter a user email or ID");
      return;
    }

    setLoading(true);
    try {
      // Try to find user by email first in profiles
      const { data: profile, error: searchError } = await supabase
        .from("profiles")
        .select("id")
        .ilike("id", newAdminEmail.trim())
        .maybeSingle();

      if (searchError) throw searchError;

      const userId = profile?.id;
      if (!userId) {
        toast.error("User not found. Make sure they have an account and have logged in once.");
        return;
      }

      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({
          user_id: userId,
          role: "admin",
        });

      if (roleError) {
        if (roleError.message.includes("unique")) {
          toast.error("This user is already an admin");
        } else {
          throw roleError;
        }
      } else {
        toast.success("Admin access granted");
        setNewAdminEmail("");
        fetchAdmins();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to grant admin access";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const revokeAdminAccess = async (userId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", "admin");

      if (error) throw error;

      toast.success("Admin access revoked");
      fetchAdmins();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to revoke admin access";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Admin Access Manager</h2>

      <div className="grid gap-6">
        {/* Grant Admin Access */}
        <section className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <ShieldAlert className="size-5 text-primary" /> Grant Admin Access
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Users must have created an account first. Enter their user ID to grant admin access.
          </p>
          <form onSubmit={grantAdminAccess} className="flex gap-3">
            <Input
              placeholder="User ID (UUID format)"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              disabled={loading}
              className="flex-1 font-mono text-xs"
            />
            <Button disabled={loading} className="rounded-full shrink-0">
              {loading ? "Granting..." : "Grant Admin"}
            </Button>
          </form>
          <div className="mt-4 bg-muted/30 rounded-lg p-3 border border-border/50">
            <p className="text-xs text-muted-foreground font-mono">
              <strong>How to get a User ID:</strong><br />
              1. User signs up on the Auth page<br />
              2. They sign in to view their ID in the Access Denied screen<br />
              3. Copy their ID and paste it here
            </p>
          </div>
        </section>

        {/* Current Admins */}
        <section className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-bold mb-4">Current Admin Users</h3>
          {loadingAdmins ? (
            <p className="text-muted-foreground">Loading admins...</p>
          ) : adminEmails.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No admin users yet. Create a user account and grant admin access above.
            </p>
          ) : (
            <div className="space-y-2">
              {adminEmails.map((userId) => (
                <div
                  key={userId}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
                >
                  <code className="text-xs font-mono text-foreground">{userId}</code>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => revokeAdminAccess(userId)}
                    disabled={loading}
                  >
                    Revoke Admin
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Admin;
