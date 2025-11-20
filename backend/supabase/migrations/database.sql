CREATE TABLE public.artists (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  image_url text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT artists_pkey PRIMARY KEY (id)
);
CREATE TABLE public.follows (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  follower_id uuid NOT NULL,
  followed_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT follows_pkey PRIMARY KEY (id),
  CONSTRAINT follows_follower_id_fkey FOREIGN KEY (follower_id) REFERENCES public.users(id),
  CONSTRAINT follows_followed_id_fkey FOREIGN KEY (followed_id) REFERENCES public.users(id)
);
CREATE TABLE public.genres (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT genres_pkey PRIMARY KEY (id)
);
CREATE TABLE public.listening_parties (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  host_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'Pending'::text CHECK (status = ANY (ARRAY['Pending'::text, 'Live'::text, 'Ended'::text])),
  current_track_id text,
  current_track_name text,
  current_track_artist text,
  current_track_album_art text,
  playback_timestamp timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT listening_parties_pkey PRIMARY KEY (id),
  CONSTRAINT listening_parties_host_id_fkey FOREIGN KEY (host_id) REFERENCES public.users(id)
);
CREATE TABLE public.party_participants (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  party_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'Listener'::text CHECK (role = ANY (ARRAY['Host'::text, 'Co-host'::text, 'Listener'::text])),
  joined_at timestamp with time zone DEFAULT now(),
  CONSTRAINT party_participants_pkey PRIMARY KEY (id),
  CONSTRAINT party_participants_party_id_fkey FOREIGN KEY (party_id) REFERENCES public.listening_parties(id),
  CONSTRAINT party_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.party_queue (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  party_id uuid NOT NULL,
  track_id text NOT NULL,
  track_name text NOT NULL,
  track_artist text NOT NULL,
  track_album_art text,
  sequence_number integer NOT NULL,
  vote_count integer DEFAULT 0,
  added_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT party_queue_pkey PRIMARY KEY (id),
  CONSTRAINT party_queue_party_id_fkey FOREIGN KEY (party_id) REFERENCES public.listening_parties(id),
  CONSTRAINT party_queue_added_by_fkey FOREIGN KEY (added_by) REFERENCES public.users(id)
);
CREATE TABLE public.soundscapes (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT soundscapes_pkey PRIMARY KEY (id)
);
CREATE TABLE public.user_followed_artists (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  artist_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_followed_artists_pkey PRIMARY KEY (id),
  CONSTRAINT user_followed_artists_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT user_followed_artists_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES public.artists(id)
);
CREATE TABLE public.user_genres (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  genre_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_genres_pkey PRIMARY KEY (id),
  CONSTRAINT user_genres_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT user_genres_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES public.genres(id)
);
CREATE TABLE public.user_secrets (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  provider text NOT NULL CHECK (provider = ANY (ARRAY['Spotify'::text, 'Apple'::text, 'Amazon'::text])),
  refresh_token text NOT NULL,
  access_token text,
  token_expires_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_secrets_pkey PRIMARY KEY (id),
  CONSTRAINT user_secrets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.user_soundscapes (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  soundscape_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_soundscapes_pkey PRIMARY KEY (id),
  CONSTRAINT user_soundscapes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT user_soundscapes_soundscape_id_fkey FOREIGN KEY (soundscape_id) REFERENCES public.soundscapes(id)
);
CREATE TABLE public.user_vibes (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  vibe_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_vibes_pkey PRIMARY KEY (id),
  CONSTRAINT user_vibes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT user_vibes_vibe_id_fkey FOREIGN KEY (vibe_id) REFERENCES public.vibes(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL,
  username text NOT NULL UNIQUE,
  display_name text,
  bio text,
  avatar_url text,
  user_type text CHECK (user_type = ANY (ARRAY['Listener'::text, 'Artist'::text, 'DJ'::text])),
  party_preference text CHECK (party_preference = ANY (ARRAY['Host'::text, 'Join'::text, 'All of the above'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.vibes (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT vibes_pkey PRIMARY KEY (id)
);