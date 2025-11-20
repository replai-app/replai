import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";

export default function WelcomeScreen() {
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    "Inter-Regular": require("../assets/fonts/Inter_24pt-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter_24pt-Medium.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter_24pt-SemiBold.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter_24pt-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleContinue = () => {
    navigation.navigate("Home" as never);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={require("../assets/images/LOGO.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.textContainer}>
        <Text style={styles.title}>Welcome to Replai</Text>
        <Text style={styles.subtitle}>A new way to enjoy music socially.</Text>
      </View>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleContinue}
        activeOpacity={0.8}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1C",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logo: {
    width: 305,
    height: 76.2,
    opacity: 1,
    marginBottom: 40,
  },
  textContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 40,
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
    fontFamily: "Inter-Regular",
    fontWeight: "400",
    fontStyle: "normal",
    textAlign: "center",
    lineHeight: 20,
    letterSpacing: 0,
  },
  continueButton: {
    minWidth: 143,
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
    gap: 10,
  },
  continueButtonText: {
    color: "#272727",
    fontSize: 15,
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: "center",
  },
});

