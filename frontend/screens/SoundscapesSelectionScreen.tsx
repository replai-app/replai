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
import { ArrowLeft as ArrowLeftIcon } from "phosphor-react-native";
import { taxonomyService } from "../services/taxonomy";
import { authService } from "../services/auth";
import { userService } from "../services/users";
import { Alert } from "react-native";
import type { Soundscape } from "../lib/types";

const soundscapeEmojis: Record<string, string> = {
  "Summer Glow": "☀️",
  "Late Night Nostalgia": "💾",
  "Real Yearner Anthems": "💘",
  "Afrobeats Classics": "🇳🇬",
};

export default function SoundscapesSelectionScreen() {
  const navigation = useNavigation();
  const [selectedSoundscapes, setSelectedSoundscapes] = useState<string[]>([]);
  const [availableSoundscapes, setAvailableSoundscapes] = useState<Soundscape[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    taxonomyService
      .getSoundscapes()
      .then((soundscapes) => {
        const customOrder = ["Summer Glow", "Late Night Nostalgia", "Real Yearner Anthems", "Afrobeats Classics"];
        const sorted = [...soundscapes].sort((a, b) => {
          const indexA = customOrder.indexOf(a.name);
          const indexB = customOrder.indexOf(b.name);
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        });
        setAvailableSoundscapes(sorted);
      })
      .catch((error) => {
        console.error("Failed to load soundscapes:", error);
        Alert.alert("Error", "Failed to load soundscapes. Please try again.");
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

  const toggleSoundscape = (soundscapeName: string) => {
    if (selectedSoundscapes.includes(soundscapeName)) {
      setSelectedSoundscapes(selectedSoundscapes.filter((name) => name !== soundscapeName));
    } else {
      setSelectedSoundscapes([...selectedSoundscapes, soundscapeName]);
    }
  };

  const handleSelectSoundscapes = async () => {
    if (selectedSoundscapes.length === 0) {
      Alert.alert("Error", "Please select at least one soundscape");
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

      const soundscapeNameToId = new Map(availableSoundscapes.map((s) => [s.name, s.id]));
      const soundscapeIds: string[] = [];

      for (const soundscapeName of selectedSoundscapes) {
        const soundscapeId = soundscapeNameToId.get(soundscapeName);
        if (soundscapeId) {
          soundscapeIds.push(soundscapeId);
        }
      }

      if (soundscapeIds.length === 0) {
        Alert.alert("Error", "Could not find soundscape IDs. Please try again.");
        setLoading(false);
        return;
      }

      await userService.setUserSoundscapes(user.id, soundscapeIds);
      
      navigation.navigate("PartyPreferenceSelection" as never);
    } catch (error: any) {
      console.error("Failed to save soundscapes:", error);
      Alert.alert("Error", error.message || "Failed to save soundscapes. Please try again.");
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
        <Text style={styles.title}>Which of these soundscapes resonates with you?</Text>
        <Text style={styles.subtitle}>How are you feeling?</Text>
      </View>

      <View style={styles.soundscapesContainer}>
        {availableSoundscapes.map((soundscape) => {
          const isSelected = selectedSoundscapes.includes(soundscape.name);
          const emoji = soundscapeEmojis[soundscape.name] || "";
          return (
            <TouchableOpacity
              key={soundscape.id}
              style={[styles.soundscapeButton, isSelected && styles.soundscapeButtonSelected]}
              onPress={() => toggleSoundscape(soundscape.name)}
              activeOpacity={0.8}
            >
              <Text
                style={[styles.soundscapeButtonText, isSelected && styles.soundscapeButtonTextSelected]}
              >
                {soundscape.name} {emoji}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={[styles.selectButton, loading && styles.selectButtonDisabled]}
        onPress={handleSelectSoundscapes}
        activeOpacity={0.8}
        disabled={loading}
      >
        <Text style={styles.selectButtonText}>
          {loading ? "Saving..." : "Select soundscapes"}
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
    marginBottom: 48,
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
    marginBottom: 24,
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
  soundscapesContainer: {
    width: "100%",
    gap: 16,
    marginBottom: 48,
    alignItems: "center",
  },
  soundscapeButton: {
    minHeight: 40,
    opacity: 1,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#6234BA",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  soundscapeButtonSelected: {
    backgroundColor: "#A25EC9",
    borderColor: "#6234BA",
  },
  soundscapeButtonText: {
    color: "#F8F8FF",
    fontSize: 12,
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    lineHeight: 16,
    letterSpacing: 0,
    textAlign: "center",
    paddingTop: 2,
  },
  soundscapeButtonTextSelected: {
    color: "#272727",
  },
  selectButton: {
    minWidth: 220,
    minHeight: 41,
    opacity: 1,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#5B7214",
    paddingVertical: 12,
    paddingHorizontal: 56,
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
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: "center",
  },
  selectButtonDisabled: {
    opacity: 0.6,
  },
});

