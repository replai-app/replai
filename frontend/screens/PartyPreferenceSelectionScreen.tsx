import React, { useState } from "react";
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
import { authService } from "../services/auth";
import { userService } from "../services/users";
import { Alert } from "react-native";

const preferenceOptions = [
  { value: "Host", label: "Host listening parties", emoji: "🎧" },
  { value: "Join", label: "Join listening parties", emoji: "📻" },
  { value: "All of the above", label: "All of the above", emoji: "🎶" },
];

export default function PartyPreferenceSelectionScreen() {
  const navigation = useNavigation();
  const [selectedPreference, setSelectedPreference] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    "Inter-Regular": require("../assets/fonts/Inter_24pt-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter_24pt-Medium.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter_24pt-SemiBold.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter_24pt-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleSelectPreference = async () => {
    if (!selectedPreference) {
      Alert.alert("Error", "Please select a preference");
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

      await userService.updateProfile(user.id, { party_preference: selectedPreference as "Host" | "Join" | "All of the above" });
      
      setLoading(false);
      navigation.navigate("ProfileCreation" as never);
    } catch (error: any) {
      console.error("Failed to save preference:", error);
      Alert.alert("Error", error.message || "Failed to save preference. Please try again.");
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
        <Text style={styles.title}>Would you like to host or join listening parties?</Text>
        <Text style={styles.subtitle}>Take your pick!</Text>
      </View>

      <View style={styles.preferencesContainer}>
        {preferenceOptions.map((option) => {
          const isSelected = selectedPreference === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              style={[styles.preferenceButton, isSelected && styles.preferenceButtonSelected]}
              onPress={() => setSelectedPreference(option.value)}
              activeOpacity={0.8}
            >
              <Text
                style={[styles.preferenceButtonText, isSelected && styles.preferenceButtonTextSelected]}
              >
                {option.label} {option.emoji}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={[styles.selectButton, loading && styles.selectButtonDisabled]}
        onPress={handleSelectPreference}
        activeOpacity={0.8}
        disabled={loading}
      >
        <Text style={styles.selectButtonText}>
          {loading ? "Saving..." : "Select preference"}
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
  preferencesContainer: {
    width: "100%",
    gap: 16,
    marginBottom: 48,
    alignItems: "center",
  },
  preferenceButton: {
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
  preferenceButtonSelected: {
    backgroundColor: "#A25EC9",
    borderColor: "#6234BA",
  },
  preferenceButtonText: {
    color: "#F8F8FF",
    fontSize: 12,
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    lineHeight: 16,
    letterSpacing: 0,
    textAlign: "center",
    paddingTop: 2,
  },
  preferenceButtonTextSelected: {
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

