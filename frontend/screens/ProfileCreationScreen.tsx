import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft as ArrowLeftIcon, UserCircle as UserCircleIcon } from "phosphor-react-native";
import { authService } from "../services/auth";
import { userService } from "../services/users";
import { Alert } from "react-native";

export default function ProfileCreationScreen() {
  const navigation = useNavigation();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
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

  const handleAddPhoto = () => {
  };

  const handleCreateProfile = async () => {
    if (!username) {
      Alert.alert("Error", "Please enter a username");
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

      await userService.updateProfile(user.id, {
        username: username.trim(),
        display_name: displayName.trim() || null,
        bio: bio.trim() || null,
      });
      
      setLoading(false);
      navigation.navigate("Welcome" as never);
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      Alert.alert("Error", error.message || "Failed to create profile. Please try again.");
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
        <Text style={styles.title}>Create your profile</Text>
        <Text style={styles.subtitle}>Show us your best selfie</Text>
      </View>

      <TouchableOpacity
        style={styles.photoButton}
        onPress={handleAddPhoto}
        activeOpacity={0.8}
      >
        <UserCircleIcon size={64} color="#F8F8FF" weight="regular" />
        <Text style={styles.photoButtonText}>Add a photo</Text>
      </TouchableOpacity>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Display name</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="What do people call you?"
            placeholderTextColor="#999999"
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Choose your handle"
            placeholderTextColor="#999999"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us about yourself"
            placeholderTextColor="#999999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.createButton, loading && styles.createButtonDisabled]}
        onPress={handleCreateProfile}
        activeOpacity={0.8}
        disabled={loading}
      >
        <Text style={styles.createButtonText}>
          {loading ? "Creating..." : "Create profile"}
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
  photoButton: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 48,
    gap: 12,
  },
  photoButtonText: {
    color: "#F8F8FF",
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    lineHeight: 14,
    letterSpacing: 0,
  },
  formContainer: {
    width: "100%",
    gap: 48,
    marginBottom: 48,
  },
  inputGroup: {
    width: "100%",
    gap: 8,
  },
  label: {
    color: "#F8F8FF",
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    lineHeight: 14,
    letterSpacing: 0,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#F8F8FF",
    borderRadius: 8,
    paddingHorizontal: 16,
    color: "#000000",
    fontSize: 16,
    fontFamily: "Inter-Regular",
    borderWidth: 1,
    borderColor: "#BDBDBD",
  },
  bioInput: {
    height: 120,
    paddingTop: 16,
  },
  createButton: {
    minWidth: 200,
    minHeight: 42,
    opacity: 1,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#5B7214",
    paddingVertical: 12,
    paddingHorizontal: 44,
    backgroundColor: "#AAD129",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 40,
  },
  createButtonText: {
    color: "#272727",
    fontSize: 15,
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    lineHeight: 15,
    letterSpacing: 0,
    textAlign: "center",
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
});

