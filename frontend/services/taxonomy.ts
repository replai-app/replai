import { supabase } from "../lib/supabase";
import type { Genre, Vibe, Soundscape, Artist } from "../lib/types";

export const taxonomyService = {
  async getGenres(): Promise<Genre[]> {
    const { data, error } = await supabase
      .from("genres")
      .select("*")
      .order("name");

    if (error) throw error;
    return data || [];
  },

  async getVibes(): Promise<Vibe[]> {
    const { data, error } = await supabase
      .from("vibes")
      .select("*")
      .order("name");

    if (error) throw error;
    return data || [];
  },

  async getSoundscapes(): Promise<Soundscape[]> {
    const { data, error } = await supabase
      .from("soundscapes")
      .select("*")
      .order("name");

    if (error) throw error;
    return data || [];
  },

  async getArtists(): Promise<Artist[]> {
    const { data, error } = await supabase
      .from("artists")
      .select("*")
      .order("name");

    if (error) throw error;
    return data || [];
  },
};

