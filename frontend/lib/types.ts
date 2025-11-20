export interface User {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  user_type: "Listener" | "Artist" | "DJ" | null;
  party_preference: "Host" | "Join" | "All of the above" | null;
  created_at: string;
  updated_at: string;
}

export interface Genre {
  id: string;
  name: string;
  created_at: string;
}

export interface Vibe {
  id: string;
  name: string;
  created_at: string;
}

export interface Soundscape {
  id: string;
  name: string;
  created_at: string;
}

export interface Artist {
  id: string;
  name: string;
  image_url: string | null;
  created_at: string;
}

export interface ListeningParty {
  id: string;
  host_id: string;
  status: "Pending" | "Live" | "Ended";
  current_track_id: string | null;
  current_track_name: string | null;
  current_track_artist: string | null;
  current_track_album_art: string | null;
  playback_timestamp: string | null;
  created_at: string;
  updated_at: string;
}

export interface PartyQueue {
  id: string;
  party_id: string;
  track_id: string;
  track_name: string;
  track_artist: string;
  track_album_art: string | null;
  sequence_number: number;
  vote_count: number;
  added_by: string | null;
  created_at: string;
}

export interface PartyParticipant {
  id: string;
  party_id: string;
  user_id: string;
  role: "Host" | "Co-host" | "Listener";
  joined_at: string;
}

export interface Track {
  id: string;
  name: string;
  artist: string;
  album_art: string | null;
  preview_url?: string | null;
  duration_ms?: number;
  external_url?: string;
}

