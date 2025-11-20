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

export default function UserTypeSelectionScreen() {
  const navigation = useNavigation();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const [fontsLoaded] = useFonts({
    "Inter-Regular": require("../assets/fonts/Inter_24pt-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter_24pt-Medium.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter_24pt-SemiBold.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter_24pt-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleSelectType = (type: string) => {
    setSelectedType(type);
  };

  const handleSelectUserType = async () => {
    if (!selectedType) {
      Alert.alert("Error", "Please select a user type");
      return;
    }

    try {
      const user = await authService.getCurrentUser();
      
      if (!user) {
        Alert.alert("Error", "Please sign in again");
        return;
      }

      await userService.updateProfile(user.id, {
        user_type: selectedType as "Listener" | "Artist" | "DJ",
      });

      if (selectedType === "Listener") {
        navigation.navigate("GenreSelection" as never);
      } else {
        Alert.alert("Coming Soon", `${selectedType} onboarding is coming soon!`);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to save user type");
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
        <Text style={styles.title}>Tell us more about yourself</Text>
        <Text style={styles.subtitle}>Are you a...</Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.optionButton,
            selectedType === "Listener" && styles.listenerButtonSelected,
          ]}
          onPress={() => handleSelectType("Listener")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.optionText,
              selectedType === "Listener" && styles.optionTextSelected,
            ]}
          >
            Listener{' '}🎶
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionButton,
            selectedType === "Artist" && styles.artistButtonSelected,
            selectedType !== "Artist" && styles.artistButton,
          ]}
          onPress={() => handleSelectType("Artist")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.optionText,
              selectedType === "Artist" && styles.optionTextSelected,
            ]}
          >
            Artist{' '}🎤
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionButton,
            selectedType === "DJ" && styles.djButtonSelected,
            selectedType !== "DJ" && styles.djButton,
          ]}
          onPress={() => handleSelectType("DJ")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.optionText,
              selectedType === "DJ" && styles.optionTextSelected,
            ]}
          >
            DJ{' '}🎧
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.selectButton}
        onPress={handleSelectUserType}
        activeOpacity={0.8}
      >
        <Text style={styles.selectButtonText}>Select user type</Text>
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
  optionsContainer: {
    width: "100%",
    gap: 16,
    marginBottom: 48,
    alignItems: "center",
  },
  optionButton: {
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
    gap: 10,
  },
  optionButtonSelected: {
    backgroundColor: "#A58ED4",
    borderColor: "#3E3451",
  },
  listenerButtonSelected: {
    backgroundColor: "#A25EC9",
    borderColor: "#745387",
  },
  artistButton: {
    borderColor: "#8C4E81",
  },
  artistButtonSelected: {
    backgroundColor: "#C95EB6",
    borderColor: "#8C4E81",
  },
  djButton: {
    borderColor: "#7B8446",
  },
  djButtonSelected: {
    backgroundColor: "#A3B730",
    borderColor: "#7B8446",
  },
  optionText: {
    color: "#F8F8FF",
    fontSize: 12,
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    lineHeight: 16,
    letterSpacing: 0,
    textAlign: "center",
  },
  optionTextSelected: {
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
});

