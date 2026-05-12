import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { UtensilsCrossed } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Auth = () => {
  const nav = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { document.title = "Sign in — FoodStation"; }, []);
  useEffect(() => { if (user) nav("/admin"); }, [user, nav]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) toast.error(error.message);
    else { toast.success("Welcome back!"); nav("/admin"); }
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/admin`, data: { display_name: name } },
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success("Account created. Check your email to confirm.");
  };

  return (
    <div className="min-h-screen grid place-items-center bg-muted/30 px-4">
      <div className="w-full max-w-md bg-card rounded-3xl p-8 shadow-soft border border-border">
        <Link to="/" className="flex items-center gap-2 font-display font-extrabold text-xl justify-center mb-6">
          <span className="size-10 rounded-xl gradient-primary grid place-items-center text-primary-foreground"><UtensilsCrossed className="size-5" /></span>
          FoodStation
        </Link>
        <Tabs defaultValue="signin">
          <TabsList className="grid grid-cols-2 w-full mb-6">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Sign up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <form onSubmit={signIn} className="space-y-4">
              <div><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" /></div>
              <div><Label>Password</Label><Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" /></div>
              <Button type="submit" disabled={loading} className="w-full h-12 rounded-full">Sign in</Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={signUp} className="space-y-4">
              <div><Label>Display name</Label><Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" /></div>
              <div><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" /></div>
              <div><Label>Password</Label><Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" /></div>
              <Button type="submit" disabled={loading} className="w-full h-12 rounded-full">Create account</Button>
            </form>
            <p className="text-xs text-muted-foreground mt-4 text-center">Admin access is granted by an existing admin.</p>
          </TabsContent>
        </Tabs>
        <Link to="/" className="block text-center text-sm text-muted-foreground mt-6 hover:text-primary">← Back to site</Link>
      </div>
    </div>
  );
};

export default Auth;
