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
import type { Vibe } from "../lib/types";

const vibeEmojis: Record<string, string> = {
  "Background energy": "👏",
  "Escape": "🏃‍♀️",
  "Healing": "🌻",
  "Hype": "🔥",
  "Romance": "💑",
  "Grief": "🩹",
  "Identity": "👤",
  "Memory": "🧠",
};

export default function VibeSelectionScreen() {
  const navigation = useNavigation();
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [availableVibes, setAvailableVibes] = useState<Vibe[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    taxonomyService
      .getVibes()
      .then((vibes) => {
        setAvailableVibes(vibes);
      })
      .catch((error) => {
        console.error("Failed to load vibes:", error);
        Alert.alert("Error", "Failed to load vibes. Please try again.");
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

  const toggleVibe = (vibe: string) => {
    if (selectedVibes.includes(vibe)) {
      setSelectedVibes(selectedVibes.filter((v) => v !== vibe));
    } else {
      setSelectedVibes([...selectedVibes, vibe]);
    }
  };

  const handleSelectVibes = async () => {
    if (selectedVibes.length === 0) {
      Alert.alert("Error", "Please select at least one vibe");
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

      const vibeNameToId = new Map(availableVibes.map((v) => [v.name, v.id]));
      const vibeIds = selectedVibes
        .map((name) => vibeNameToId.get(name))
        .filter((id): id is string => id !== undefined);

      if (vibeIds.length === 0) {
        Alert.alert("Error", "Could not find vibe IDs. Please try again.");
        setLoading(false);
        return;
      }

          await userService.setUserVibes(user.id, vibeIds);
          
          navigation.navigate("ArtistsSelection" as never);
    } catch (error: any) {
      console.error("Failed to save vibes:", error);
      Alert.alert("Error", error.message || "Failed to save vibes. Please try again.");
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
        <Text style={styles.title}>What does music feel like for you right now?</Text>
        <Text style={styles.subtitle}>What's your current vibe?</Text>
      </View>

      <View style={styles.vibesContainer}>
        {availableVibes
          .filter((v) => v.name === "Background energy")
          .map((vibe) => {
            const isSelected = selectedVibes.includes(vibe.name);
            const emoji = vibeEmojis[vibe.name] || "";
            return (
              <View key={vibe.id} style={styles.aloneButtonWrapper}>
                <TouchableOpacity
                  style={[
                    styles.vibeButton,
                    styles.backgroundEnergyButton,
                    isSelected && styles.vibeButtonSelected,
                  ]}
                  onPress={() => toggleVibe(vibe.name)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.vibeButtonText,
                      isSelected && styles.vibeButtonTextSelected,
                    ]}
                  >
                    {vibe.name} {emoji}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        
        <View style={styles.pairedRow}>
          {availableVibes
            .filter((v) => v.name === "Escape" || v.name === "Healing")
            .sort((a, b) => (a.name === "Escape" ? -1 : 1))
            .map((vibe) => {
              const isSelected = selectedVibes.includes(vibe.name);
              const emoji = vibeEmojis[vibe.name] || "";
              return (
                <View key={vibe.id} style={styles.pairedButtonWrapper}>
                  <TouchableOpacity
                    style={[
                      styles.vibeButton,
                      isSelected && styles.vibeButtonSelected,
                    ]}
                    onPress={() => toggleVibe(vibe.name)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.vibeButtonText,
                        isSelected && styles.vibeButtonTextSelected,
                      ]}
                    >
                      {vibe.name} {emoji}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
        </View>

        <View style={styles.pairedRow}>
          {availableVibes
            .filter((v) => v.name === "Hype" || v.name === "Romance")
            .sort((a, b) => (a.name === "Hype" ? -1 : 1))
            .map((vibe) => {
              const isSelected = selectedVibes.includes(vibe.name);
              const emoji = vibeEmojis[vibe.name] || "";
              return (
                <View key={vibe.id} style={styles.pairedButtonWrapper}>
                  <TouchableOpacity
                    style={[
                      styles.vibeButton,
                      isSelected && styles.vibeButtonSelected,
                    ]}
                    onPress={() => toggleVibe(vibe.name)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.vibeButtonText,
                        isSelected && styles.vibeButtonTextSelected,
                      ]}
                    >
                      {vibe.name} {emoji}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
        </View>

        <View style={styles.pairedRow}>
          {availableVibes
            .filter((v) => v.name === "Grief" || v.name === "Identity")
            .sort((a, b) => (a.name === "Grief" ? -1 : 1))
            .map((vibe) => {
              const isSelected = selectedVibes.includes(vibe.name);
              const emoji = vibeEmojis[vibe.name] || "";
              return (
                <View key={vibe.id} style={styles.pairedButtonWrapper}>
                  <TouchableOpacity
                    style={[
                      styles.vibeButton,
                      isSelected && styles.vibeButtonSelected,
                    ]}
                    onPress={() => toggleVibe(vibe.name)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.vibeButtonText,
                        isSelected && styles.vibeButtonTextSelected,
                      ]}
                    >
                      {vibe.name} {emoji}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
        </View>

        <View style={styles.pairedRow}>
          {availableVibes
            .filter((v) => v.name === "Memory")
            .map((vibe) => {
              const isSelected = selectedVibes.includes(vibe.name);
              const emoji = vibeEmojis[vibe.name] || "";
              return (
                <View key={vibe.id} style={styles.memoryButtonWrapper}>
                  <TouchableOpacity
                    style={[
                      styles.vibeButton,
                      isSelected && styles.vibeButtonSelected,
                    ]}
                    onPress={() => toggleVibe(vibe.name)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.vibeButtonText,
                        isSelected && styles.vibeButtonTextSelected,
                      ]}
                    >
                      {vibe.name} {emoji}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.selectButton, loading && styles.selectButtonDisabled]}
        onPress={handleSelectVibes}
        activeOpacity={0.8}
        disabled={loading}
      >
        <Text style={styles.selectButtonText}>
          {loading ? "Saving..." : "Select vibes"}
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
  vibesContainer: {
    width: "100%",
    marginBottom: 48,
    alignItems: "stretch",
    paddingLeft: 64,
  },
  aloneButtonWrapper: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  pairedRow: {
    width: "100%",
    flexDirection: "row",
    marginBottom: 16,
    justifyContent: "flex-start",
    gap: 8,
    paddingHorizontal: 0,
    flexWrap: "wrap",
  },
  pairedButtonWrapper: {
    alignItems: "flex-start",
  },
  memoryButtonWrapper: {
    alignItems: "flex-start",
  },
  vibeButton: {
    minHeight: 40,
    opacity: 1,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#348DBA",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  backgroundEnergyButton: {
    width: "60%",
  },
  vibeButtonSelected: {
    backgroundColor: "#54B0DE",
    borderColor: "#348DBA",
  },
  vibeButtonText: {
    color: "#F8F8FF",
    fontSize: 12,
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    lineHeight: 16,
    letterSpacing: 0,
    textAlign: "center",
  },
  vibeButtonTextSelected: {
    color: "#272727",
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

