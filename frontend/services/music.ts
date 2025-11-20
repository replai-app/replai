import { supabase } from "../lib/supabase";
import type { Track } from "../lib/types";

export const musicService = {
  async searchMusic(query: string, provider: string = "Spotify", limit: number = 20) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("Not authenticated");
    }

    const { data, error } = await supabase.functions.invoke("music-search", {
      body: { query, provider, limit },
    });

    if (error) throw error;
    return data.tracks as Track[];
  },

  async exchangeToken(code: string, provider: string, redirectUri: string) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("Not authenticated");
    }

    const { data, error } = await supabase.functions.invoke("token-exchange", {
      body: { code, provider, redirectUri },
    });

    if (error) throw error;
    return data;
  },

};

