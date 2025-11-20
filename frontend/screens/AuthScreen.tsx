import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";

export default function AuthScreen() {
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

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <Image
          source={require("../assets/images/LOGO.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => navigation.navigate("SignUp" as never)}
            activeOpacity={0.8}
          >
            <Text style={styles.signUpButtonText} numberOfLines={1}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => navigation.navigate("SignIn" as never)}
            activeOpacity={0.8}
          >
            <Text style={styles.signInButtonText} numberOfLines={1}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1C",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  logo: {
    width: 305,
    height: 76.2,
    opacity: 1,
    marginBottom: 80,
  },
  buttonContainer: {
    width: "100%",
    gap: 40,
    alignItems: "center",
  },
  signUpButton: {
    width: 143,
    minHeight: 42,
    opacity: 1,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#3E3451",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#A58ED4",
    alignItems: "center",
    justifyContent: "center",
  },
  signUpButtonText: {
    color: "#272727",
    fontSize: 15,
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 15,
    letterSpacing: 0,
  },
  signInButton: {
    width: 143,
    height: 42,
    opacity: 1,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#5F3A22",
    paddingTop: 12,
    paddingRight: 44,
    paddingBottom: 12,
    paddingLeft: 44,
    backgroundColor: "#E68F55",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  signInButtonText: {
    color: "#272727",
    fontSize: 15,
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 15,
    letterSpacing: 0,
  },
});

