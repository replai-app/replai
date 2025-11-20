import { supabase } from "../lib/supabase";
import type { User } from "../lib/types";

export const userService = {
  async getProfile(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  },

  async createProfile(userId: string, profileData: Partial<User>) {
    const { data, error } = await supabase
      .from("users")
      .insert({ id: userId, ...profileData })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async uploadAvatar(userId: string, fileUri: string) {
    const fileName = `${userId}-${Date.now()}.jpg`;
    const file = await fetch(fileUri).then((r) => r.blob());

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(fileName);

    const { data: userData, error: userError } = await supabase
      .from("users")
      .update({ avatar_url: publicUrl })
      .eq("id", userId)
      .select()
      .single();

    if (userError) throw userError;
    return userData;
  },

  async setUserGenres(userId: string, genreIds: string[]) {
    const { error: deleteError } = await supabase
      .from("user_genres")
      .delete()
      .eq("user_id", userId);

    if (deleteError) throw deleteError;

    if (genreIds.length === 0) return;

    const { error: insertError } = await supabase
      .from("user_genres")
      .insert(genreIds.map((genreId) => ({ user_id: userId, genre_id: genreId })));

    if (insertError) throw insertError;
  },

  async setUserVibes(userId: string, vibeIds: string[]) {
    const { error: deleteError } = await supabase
      .from("user_vibes")
      .delete()
      .eq("user_id", userId);

    if (deleteError) throw deleteError;

    if (vibeIds.length === 0) return;

    const { error: insertError } = await supabase
      .from("user_vibes")
      .insert(vibeIds.map((vibeId) => ({ user_id: userId, vibe_id: vibeId })));

    if (insertError) throw insertError;
  },

  async setUserSoundscapes(userId: string, soundscapeIds: string[]) {
    const { error: deleteError } = await supabase
      .from("user_soundscapes")
      .delete()
      .eq("user_id", userId);

    if (deleteError) throw deleteError;

    if (soundscapeIds.length === 0) return;

    const { error: insertError } = await supabase
      .from("user_soundscapes")
      .insert(
        soundscapeIds.map((soundscapeId) => ({
          user_id: userId,
          soundscape_id: soundscapeId,
        }))
      );

    if (insertError) throw insertError;
  },

  async setUserFollowedArtists(userId: string, artistIds: string[]) {
    const { error: deleteError } = await supabase
      .from("user_followed_artists")
      .delete()
      .eq("user_id", userId);

    if (deleteError) throw deleteError;

    if (artistIds.length === 0) return;

    const { error: insertError } = await supabase
      .from("user_followed_artists")
      .insert(
        artistIds.map((artistId) => ({
          user_id: userId,
          artist_id: artistId,
        }))
      );

    if (insertError) throw insertError;
  },

  async getUserGenres(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from("user_genres")
      .select(`
        genres (
          name
        )
      `)
      .eq("user_id", userId);

    if (error) throw error;
    
    return data?.map((item: any) => item.genres?.name).filter(Boolean) || [];
  },
};

