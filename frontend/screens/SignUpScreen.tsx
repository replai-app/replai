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
import { ArrowLeft as ArrowLeftIcon } from "phosphor-react-native";
import { authService } from "../services/auth";
import { userService } from "../services/users";

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [fontsLoaded] = useFonts({
    "Inter-Regular": require("../assets/fonts/Inter_24pt-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter_24pt-Medium.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter_24pt-SemiBold.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter_24pt-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleCreateAccount = async () => {
    if (!email || !confirmEmail || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (email !== confirmEmail) {
      Alert.alert("Error", "Email addresses do not match");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      const { data, error } = await authService.signUp(email, password);

      if (error) {
        Alert.alert("Error", error.message);
        return;
      }

      if (data?.user) {
        const userId = data.user.id;
        const username = email.split("@")[0] + Math.floor(Math.random() * 1000);
        
        try {
          await userService.createProfile(userId, {
            username: username,
            display_name: null,
            bio: null,
            avatar_url: null,
            user_type: null,
            party_preference: null,
          });
          
          navigation.navigate("UserTypeSelection" as never);
        } catch (profileError: any) {
          console.error("Failed to create profile:", profileError);
          Alert.alert("Error", "Account created but failed to create profile. Please try signing in.");
        }
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create account");
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
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm email address</Text>
          <TextInput
            style={styles.input}
            value={confirmEmail}
            onChangeText={setConfirmEmail}
            placeholder="Confirm your email"
            placeholderTextColor="#999999"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
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
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm password</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
            placeholderTextColor="#999999"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateAccount}
          activeOpacity={0.8}
        >
          <Text style={styles.createButtonText} numberOfLines={1}>Create Account</Text>
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
  createButton: {
    width: 200,
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
    marginTop: 16,
    alignSelf: "center",
  },
  createButtonText: {
    color: "#272727",
    fontSize: 15,
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 15,
    letterSpacing: 0,
  },
});

