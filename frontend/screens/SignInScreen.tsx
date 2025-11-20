import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import { authService } from "../services/auth";

export default function SignInScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await authService.signIn(email, password);

      if (error) {
        Alert.alert("Error", error.message);
        setLoading(false);
        return;
      }

      if (data?.user) {
        navigation.navigate("Home" as never);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to sign in");
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <StatusBar style="light" />
      <Image
        source={require("../assets/images/LOGO.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#999999"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            onPress={() => {}}
            activeOpacity={0.7}
            style={styles.forgotLink}
          >
            <Text style={styles.forgotLinkText}>Forgot your email?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor="#999999"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            onPress={() => {}}
            activeOpacity={0.7}
            style={styles.forgotLink}
          >
            <Text style={styles.forgotLinkText}>Forgot your password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.signInButton, loading && styles.signInButtonDisabled]}
          onPress={handleSignIn}
          activeOpacity={0.8}
          disabled={loading}
        >
          <Text style={styles.signInButtonText} numberOfLines={1}>
            {loading ? "Signing In..." : "Sign In"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.createAccountText}>New here? Create an account</Text>

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => navigation.navigate("SignUp" as never)}
          activeOpacity={0.8}
        >
          <Text style={styles.signUpButtonText} numberOfLines={1}>Sign Up</Text>
        </TouchableOpacity>
      </View>
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
  logo: {
    width: 243,
    height: 60,
    opacity: 1,
    marginBottom: 40,
  },
  formContainer: {
    width: "100%",
    gap: 48,
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
    marginTop: 16,
    alignSelf: "center",
  },
  signInButtonDisabled: {
    opacity: 0.6,
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
  forgotLink: {
    marginTop: 8,
    alignSelf: "flex-end",
  },
  forgotLinkText: {
    color: "#F8F8FF",
    fontSize: 12,
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    lineHeight: 12,
    letterSpacing: 0,
    textDecorationLine: "underline",
  },
  createAccountText: {
    color: "#F8F8FF",
    fontSize: 14,
    fontFamily: "Inter-Regular",
    fontWeight: "400",
    textAlign: "center",
    marginTop: 40,
    marginBottom: 40,
    alignSelf: "center",
  },
  signUpButton: {
    width: 143,
    height: 42,
    opacity: 1,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#3E3451",
    paddingTop: 12,
    paddingRight: 44,
    paddingBottom: 12,
    paddingLeft: 44,
    backgroundColor: "#A58ED4",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    alignSelf: "center",
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
});

