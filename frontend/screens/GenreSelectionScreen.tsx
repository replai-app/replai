import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft as ArrowLeftIcon, CaretDown } from "phosphor-react-native";
import { taxonomyService } from "../services/taxonomy";
import { authService } from "../services/auth";
import { userService } from "../services/users";
import { Alert } from "react-native";
import type { Genre } from "../lib/types";

const genreCategories = {
  "Popular 🔊": ["Hip-Hop", "R&B", "Pop", "Dance", "Reggaeton", "Afrobeats", "Trap", "Drill"],
  "Global Sounds 🌎": ["Amapiano", "UK Garage", "Grime", "Dancehall", "Baile Funk", "K-Pop", "J-Pop", "Arabic Pop", "Desi Beats", "Afrohouse", "Latin Trap"],
  "Indie 🎸": ["Indie Pop", "Alt Hip-Hop", "Bedroom Pop", "Shoegaze", "Chillhop", "Indie Rock", "Alt R&B"],
  "Instrumental 🧠": ["Lo-fi", "Ambient", "Soundtrack", "Chillwave", "Experimental", "Jazzhop", "Neo-Soul"],
  "Lyric Driven 🎤": ["Conscious Rap", "Singer-Songwriter", "Folk", "Spoken Word"],
  "Underground 💣": ["Techno", "DnB", "Experimental Club", "Industrial", "Hardcore", "House", "Jungle"],
};

export default function GenreSelectionScreen() {
  const navigation = useNavigation();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [availableGenres, setAvailableGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    taxonomyService
      .getGenres()
      .then((genres) => {
        setAvailableGenres(genres);
      })
      .catch((error) => {
        console.error("Failed to load genres:", error);
        Alert.alert("Error", "Failed to load genres. Please try again.");
      });
  }, []);

  const [fontsLoaded] = useFonts({
    "Inter-Regular": require("../assets/fonts/Inter_24pt-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter_24pt-Medium.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter_24pt-SemiBold.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter_24pt-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleSelectGenres = async () => {
    if (selectedGenres.length === 0) {
      Alert.alert("Error", "Please select at least one genre");
      return;
    }

    setLoading(true);
    try {
      const user = await authService.getCurrentUser();
      
      if (!user) {
        Alert.alert("Error", "Please sign in again");
        setLoading(false);
        return;
      }

      const genreNameToId = new Map(availableGenres.map((g) => [g.name, g.id]));
      const genreIds = selectedGenres
        .map((name) => genreNameToId.get(name))
        .filter((id): id is string => id !== undefined);

      if (genreIds.length === 0) {
        Alert.alert("Error", "Could not find genre IDs. Please try again.");
        setLoading(false);
        return;
      }

      await userService.setUserGenres(user.id, genreIds);
      
      navigation.navigate("VibeSelection" as never);
    } catch (error: any) {
      console.error("Failed to save genres:", error);
      Alert.alert("Error", error.message || "Failed to save genres. Please try again.");
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
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
        <Text style={styles.title}>What kind of music do you listen to?</Text>
        <Text style={styles.subtitle}>Are you a fan of...</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.genreContainer}>
          {Object.entries(genreCategories).map(([categoryName, genres]) => (
            <View key={categoryName} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{categoryName}</Text>
              <View style={styles.genreButtonsContainer}>
                {genres.map((genre) => {
                  const isSelected = selectedGenres.includes(genre);
                  const isPopular = categoryName === "Popular 🔊";
                  const isGlobalSounds = categoryName === "Global Sounds 🌎";
                  const isIndie = categoryName === "Indie 🎸";
                  const isInstrumental = categoryName === "Instrumental 🧠";
                  const isLyricDriven = categoryName === "Lyric Driven 🎤";
                  const isUnderground = categoryName === "Underground 💣";
                  return (
                    <TouchableOpacity
                      key={genre}
                      style={[
                        styles.genreButton,
                        isPopular && styles.popularGenreButton,
                        isGlobalSounds && styles.globalSoundsGenreButton,
                        isIndie && styles.indieGenreButton,
                        isInstrumental && styles.instrumentalGenreButton,
                        isLyricDriven && styles.lyricDrivenGenreButton,
                        isUnderground && styles.undergroundGenreButton,
                        isPopular && isSelected && styles.popularGenreButtonSelected,
                        isGlobalSounds && isSelected && styles.globalSoundsGenreButtonSelected,
                        isIndie && isSelected && styles.indieGenreButtonSelected,
                        isInstrumental && isSelected && styles.instrumentalGenreButtonSelected,
                        isLyricDriven && isSelected && styles.lyricDrivenGenreButtonSelected,
                        isUnderground && isSelected && styles.undergroundGenreButtonSelected,
                        !isPopular && !isGlobalSounds && !isIndie && !isInstrumental && !isLyricDriven && !isUnderground && isSelected && styles.genreButtonSelected,
                      ]}
                      onPress={() => toggleGenre(genre)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.genreButtonText,
                          isSelected && styles.genreButtonTextSelected,
                        ]}
                      >
                        {genre}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.scrollIndicator}>
        <CaretDown size={24} color="#F8F8FF" weight="regular" />
      </View>

      <TouchableOpacity
        style={[styles.selectButton, loading && styles.selectButtonDisabled]}
        onPress={handleSelectGenres}
        activeOpacity={0.8}
        disabled={loading}
      >
        <Text style={styles.selectButtonText}>
          {loading ? "Saving..." : "Select genres"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1C",
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
  scrollView: {
    flex: 1,
    maxHeight: 300,
    marginBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  logo: {
    width: 141,
    height: 35.2,
    opacity: 1,
    marginTop: 60,
    marginBottom: 96,
    alignSelf: "center",
  },
  textContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  title: {
    color: "#F8F8FF",
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
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
    textAlign: "center",
    lineHeight: 14,
    letterSpacing: 0,
  },
  genreContainer: {
    width: "100%",
    gap: 32,
  },
  categorySection: {
    width: "100%",
    gap: 16,
  },
  categoryTitle: {
    color: "#F8F8FF",
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    lineHeight: 20,
    letterSpacing: 0,
    paddingTop: 4,
  },
  genreButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  genreButton: {
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
  popularGenreButton: {
    borderColor: "#BA3434",
  },
  popularGenreButtonSelected: {
    backgroundColor: "#DC3A3A",
    borderColor: "#BA3434",
  },
  globalSoundsGenreButton: {
    borderColor: "#2A8C1F",
  },
  globalSoundsGenreButtonSelected: {
    backgroundColor: "#449A46",
    borderColor: "#2A8C1F",
  },
  indieGenreButton: {
    borderColor: "#1F728C",
  },
  indieGenreButtonSelected: {
    backgroundColor: "#4A9FB5",
    borderColor: "#1F728C",
  },
  instrumentalGenreButton: {
    borderColor: "#691F8C",
  },
  instrumentalGenreButtonSelected: {
    backgroundColor: "#A55EC9",
    borderColor: "#691F8C",
  },
  lyricDrivenGenreButton: {
    borderColor: "#8C3C1F",
  },
  lyricDrivenGenreButtonSelected: {
    backgroundColor: "#DC6A3A",
    borderColor: "#8C3C1F",
  },
  undergroundGenreButton: {
    borderColor: "#8C1F7D",
  },
  undergroundGenreButtonSelected: {
    backgroundColor: "#C95EB6",
    borderColor: "#8C1F7D",
  },
  genreButtonSelected: {
    backgroundColor: "#A25EC9",
    borderColor: "#745387",
  },
  genreButtonText: {
    color: "#F8F8FF",
    fontSize: 12,
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    lineHeight: 12,
    letterSpacing: 0,
    textAlign: "center",
  },
  genreButtonTextSelected: {
    color: "#272727",
  },
  scrollIndicator: {
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 24,
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

