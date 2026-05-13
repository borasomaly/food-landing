import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

// Resolve image URLs that may be local /src/assets/ paths (seeded) or remote URLs.
const assetModules = import.meta.glob("/src/assets/*", { eager: true, query: "?url", import: "default" }) as Record<string, string>;

export function resolveImage(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("/src/assets/")) return assetModules[url] ?? url;
  return url;
}

export const useHeroSlides = () =>
  useQuery({
    queryKey: ["hero_slides"],
    queryFn: async () => {
      const { data, error } = await supabase.from("hero_slides").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

export const useFeatures = () =>
  useQuery({
    queryKey: ["features"],
    queryFn: async () => {
      const { data, error } = await supabase.from("features").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

export const useProducts = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*, categories(name,slug)").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const usePromotions = () =>
  useQuery({
    queryKey: ["promotions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("promotions").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const useLocations = () =>
  useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("locations").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

export const useJobs = () =>
  useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("jobs").select("*").eq("active", true).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const useSiteSettings = () =>
  useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*");
      if (error) throw error;
      const map: Record<string, unknown> = {};
      data?.forEach((row) => (map[row.key] = row.value));
      return map;
    },
  });
