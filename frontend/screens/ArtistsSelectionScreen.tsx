import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft as ArrowLeftIcon, MagnifyingGlass as MagnifyingGlassIcon } from "phosphor-react-native";
import { taxonomyService } from "../services/taxonomy";
import { authService } from "../services/auth";
import { userService } from "../services/users";
import type { Artist } from "../lib/types";

export default function ArtistsSelectionScreen() {
  const navigation = useNavigation();
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [availableArtists, setAvailableArtists] = useState<Artist[]>([]);
  const [suggestedArtists, setSuggestedArtists] = useState<Artist[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Artist[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadArtistSuggestions = async () => {
      try {
        const localArtists = await taxonomyService.getArtists();
        if (localArtists.length > 0) {
          setSuggestedArtists(localArtists.slice(0, 3));
          setAvailableArtists(localArtists);
        }
      } catch (error) {
        console.error("Failed to load artists:", error);
      }
    };

    loadArtistSuggestions();
  }, []);

  useEffect(() => {
    const searchArtists = () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      if (searchQuery.length < 2) {
        return;
      }

      setIsSearching(true);
      const query = searchQuery.toLowerCase();
      const filtered = availableArtists.filter((artist) =>
        artist.name.toLowerCase().includes(query)
      );
      setSearchResults(filtered);
      setIsSearching(false);
    };

    const timeoutId = setTimeout(searchArtists, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, availableArtists]);

  const [fontsLoaded] = useFonts({
    "Inter-Regular": require("../assets/fonts/Inter_24pt-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter_24pt-Medium.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter_24pt-SemiBold.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter_24pt-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  const toggleArtist = (artistName: string) => {
    if (selectedArtists.includes(artistName)) {
      setSelectedArtists(selectedArtists.filter((name) => name !== artistName));
    } else {
      setSelectedArtists([...selectedArtists, artistName]);
    }
  };

  const handleConnectSpotify = async () => {
  };

  const handleConnectAppleMusic = async () => {
  };

  const handleConnectAmazonMusic = async () => {
  };

  const handleSelectArtists = async () => {
    setLoading(true);
    try {
      const user = await authService.getCurrentUser();
      
      if (!user) {
        Alert.alert("Error", "Please sign in again");
        setLoading(false);
        return;
      }

      if (selectedArtists.length > 0) {
        const allArtists = [...availableArtists, ...searchResults];
        const uniqueArtists = Array.from(new Map(allArtists.map((a) => [a.id, a])).values());
        
        const artistNameToId = new Map(uniqueArtists.map((a) => [a.name, a.id]));
        const artistIds: string[] = [];

        for (const artistName of selectedArtists) {
          const artist = uniqueArtists.find((a) => a.name === artistName);
          if (artist) {
            artistIds.push(artist.id);
          }
        }

        if (artistIds.length > 0) {
          await userService.setUserFollowedArtists(user.id, artistIds);
        }
      }
      
      setLoading(false);
      navigation.navigate("SoundscapesSelection" as never);
    } catch (error: any) {
      console.error("Failed to save artists:", error);
      Alert.alert("Error", error.message || "Failed to save artists. Please try again.");
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <StatusBar style="light" />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <ArrowLeftIcon size={24} color="#F8F8FF" weight="regular" />
      </TouchableOpacity>

      <Image
        source={require("../assets/images/LOGO.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.textContainer}>
        <Text style={styles.title}>Select artists to follow</Text>
        <Text style={styles.subtitle}>Tell us your faves</Text>
      </View>

      <View style={styles.suggestionsContainer}>
        <Text style={styles.sectionTitle}>Artist suggestions</Text>
        <View style={styles.artistButtonsContainer}>
          {suggestedArtists.map((artist) => {
            const isSelected = selectedArtists.includes(artist.name);
            return (
              <TouchableOpacity
                key={artist.id}
                style={[styles.artistButton, isSelected && styles.artistButtonSelected]}
                onPress={() => toggleArtist(artist.name)}
                activeOpacity={0.8}
              >
                <Text
                  style={[styles.artistButtonText, isSelected && styles.artistButtonTextSelected]}
                >
                  {artist.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search artists"
            placeholderTextColor="#999999"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <MagnifyingGlassIcon size={20} color="#F8F8FF" weight="regular" style={styles.searchIcon} />
        </View>
      </View>

      <View style={styles.dividerContainer}>
        <Text style={styles.dividerText}>or</Text>
      </View>

      <View style={styles.connectContainer}>
        <Text style={styles.connectTitle}>Connect to your music app</Text>
        <TouchableOpacity
          style={[styles.connectButton, styles.spotifyButton]}
          onPress={handleConnectSpotify}
          activeOpacity={0.8}
        >
          <Text style={styles.connectButtonText}>Spotify</Text>
          <Image
            source={require("../assets/images/spotify.png")}
            style={styles.buttonIconImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.connectButton, styles.appleMusicButton]}
          onPress={handleConnectAppleMusic}
          activeOpacity={0.8}
        >
          <Text style={styles.connectButtonText}>Apple Music</Text>
          <Image
            source={require("../assets/images/apple-music.png")}
            style={styles.buttonIconImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.connectButton, styles.amazonMusicButton]}
          onPress={handleConnectAmazonMusic}
          activeOpacity={0.8}
        >
          <Text style={styles.connectButtonText}>Amazon Music</Text>
          <Image
            source={require("../assets/images/amazon-music.png")}
            style={styles.buttonIconImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.selectButton, loading && styles.selectButtonDisabled]}
        onPress={handleSelectArtists}
        activeOpacity={0.8}
        disabled={loading}
      >
        <Text style={styles.selectButtonText}>
          {loading ? "Saving..." : "Select artists"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1C",
  },
  contentContainer: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 24,
    zIndex: 10,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 141,
    height: 35.2,
    opacity: 1,
    marginBottom: 96,
  },
  textContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    color: "#F8F8FF",
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    fontStyle: "normal",
    textAlign: "center",
    lineHeight: 16,
    letterSpacing: 0,
    marginBottom: 48,
  },
  subtitle: {
    color: "#F8F8FF",
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    fontStyle: "normal",
    textAlign: "center",
    lineHeight: 14,
    letterSpacing: 0,
  },
  suggestionsContainer: {
    width: "100%",
    marginBottom: 24,
    alignItems: "flex-start",
  },
  sectionTitle: {
    color: "#F8F8FF",
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 0,
    marginBottom: 16,
  },
  artistButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    width: "100%",
  },
  artistButton: {
    minHeight: 40,
    opacity: 1,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#745387",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  artistButtonSelected: {
    backgroundColor: "#A25EC9",
    borderColor: "#745387",
  },
  artistButtonText: {
    color: "#F8F8FF",
    fontSize: 12,
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    lineHeight: 12,
    letterSpacing: 0,
    textAlign: "center",
  },
  artistButtonTextSelected: {
    color: "#272727",
  },
  noResultsText: {
    color: "#999999",
    fontSize: 14,
    fontFamily: "Inter-Regular",
    fontWeight: "400",
    textAlign: "center",
    paddingVertical: 16,
  },
  searchContainer: {
    width: "100%",
    marginBottom: 24,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    backgroundColor: "transparent",
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#F8F8FF",
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginLeft: 12,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    color: "#F8F8FF",
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
  dividerContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerText: {
    color: "#F8F8FF",
    fontSize: 14,
    fontFamily: "Inter-Regular",
    fontWeight: "400",
    textAlign: "center",
  },
  connectContainer: {
    width: "100%",
    marginBottom: 48,
    alignItems: "center",
    gap: 16,
  },
  connectTitle: {
    color: "#F8F8FF",
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  connectButton: {
    height: 42,
    opacity: 1,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#348DBA",
    paddingTop: 12,
    paddingRight: 20,
    paddingBottom: 12,
    paddingLeft: 20,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    flexDirection: "row",
    alignSelf: "center",
  },
  spotifyButton: {
    borderColor: "#2D6E2F",
  },
  appleMusicButton: {
    borderColor: "#8F2E3A",
  },
  amazonMusicButton: {
    borderColor: "#1F728C",
  },
  buttonIcon: {
    marginLeft: 8,
  },
  buttonIconImage: {
    width: 20,
    height: 20,
    marginLeft: 8,
  },
  connectButtonText: {
    color: "#F8F8FF",
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 14,
    letterSpacing: 0,
  },
  selectButton: {
    width: 220,
    height: 41,
    opacity: 1,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#5B7214",
    paddingTop: 12,
    paddingRight: 56,
    paddingBottom: 12,
    paddingLeft: 56,
    backgroundColor: "#AAD129",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    alignSelf: "center",
    marginBottom: 40,
  },
  selectButtonText: {
    color: "#272727",
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    lineHeight: 14,
    letterSpacing: 0,
    textAlign: "center",
  },
  selectButtonDisabled: {
    opacity: 0.6,
  },
});

