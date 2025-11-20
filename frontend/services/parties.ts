import { supabase } from "../lib/supabase";
import type { ListeningParty, PartyQueue, PartyParticipant, Track } from "../lib/types";

export const partyService = {
  async createParty(hostId: string) {
    const { data, error } = await supabase
      .from("listening_parties")
      .insert({
        host_id: hostId,
        status: "Pending",
      })
      .select()
      .single();

    if (error) throw error;

    const { error: participantError } = await supabase
      .from("party_participants")
      .insert({
        party_id: data.id,
        user_id: hostId,
        role: "Host",
      });

    if (participantError) throw participantError;

    return data;
  },

  async getParty(partyId: string): Promise<ListeningParty | null> {
    const { data, error } = await supabase
      .from("listening_parties")
      .select("*")
      .eq("id", partyId)
      .single();

    if (error) throw error;
    return data;
  },

  async updatePartyStatus(partyId: string, hostId: string, status: "Pending" | "Live" | "Ended") {
    const { data, error } = await supabase
      .from("listening_parties")
      .update({ status })
      .eq("id", partyId)
      .eq("host_id", hostId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCurrentTrack(
    partyId: string,
    hostId: string,
    track: Track,
    playbackTimestamp: string
  ) {
    const { data, error } = await supabase
      .from("listening_parties")
      .update({
        current_track_id: track.id,
        current_track_name: track.name,
        current_track_artist: track.artist,
        current_track_album_art: track.album_art,
        playback_timestamp: playbackTimestamp,
      })
      .eq("id", partyId)
      .eq("host_id", hostId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getPartyQueue(partyId: string): Promise<PartyQueue[]> {
    const { data, error } = await supabase
      .from("party_queue")
      .select("*")
      .eq("party_id", partyId)
      .order("sequence_number", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async addToQueue(partyId: string, track: Track, addedBy: string) {
    const queue = await this.getPartyQueue(partyId);
    const nextSequence = queue.length > 0 ? Math.max(...queue.map((q) => q.sequence_number)) + 1 : 1;

    const { data, error } = await supabase
      .from("party_queue")
      .insert({
        party_id: partyId,
        track_id: track.id,
        track_name: track.name,
        track_artist: track.artist,
        track_album_art: track.album_art,
        sequence_number: nextSequence,
        added_by: addedBy,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async joinParty(partyId: string, userId: string) {
    const { data, error } = await supabase
      .from("party_participants")
      .insert({
        party_id: partyId,
        user_id: userId,
        role: "Listener",
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async leaveParty(partyId: string, userId: string) {
    const { error } = await supabase
      .from("party_participants")
      .delete()
      .eq("party_id", partyId)
      .eq("user_id", userId);

    if (error) throw error;
  },

  async getPartyParticipants(partyId: string): Promise<PartyParticipant[]> {
    const { data, error } = await supabase
      .from("party_participants")
      .select("*")
      .eq("party_id", partyId);

    if (error) throw error;
    return data || [];
  },

  subscribeToParty(partyId: string, callback: (party: ListeningParty) => void) {
    return supabase
      .channel(`party:${partyId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "listening_parties",
          filter: `id=eq.${partyId}`,
        },
        (payload) => {
          callback(payload.new as ListeningParty);
        }
      )
      .subscribe();
  },

  subscribeToQueue(partyId: string, callback: (queue: PartyQueue[]) => void) {
    return supabase
      .channel(`queue:${partyId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "party_queue",
          filter: `party_id=eq.${partyId}`,
        },
        async () => {
          const queue = await this.getPartyQueue(partyId);
          callback(queue);
        }
      )
      .subscribe();
  },
};

