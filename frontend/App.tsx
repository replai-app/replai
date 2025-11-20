import { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import { authService } from "./services/auth";
import AuthScreen from "./screens/AuthScreen";
import SignUpScreen from "./screens/SignUpScreen";
import SignInScreen from "./screens/SignInScreen";
import UserTypeSelectionScreen from "./screens/UserTypeSelectionScreen";
import GenreSelectionScreen from "./screens/GenreSelectionScreen";
import VibeSelectionScreen from "./screens/VibeSelectionScreen";
import ArtistsSelectionScreen from "./screens/ArtistsSelectionScreen";
import SoundscapesSelectionScreen from "./screens/SoundscapesSelectionScreen";
import PartyPreferenceSelectionScreen from "./screens/PartyPreferenceSelectionScreen";
import ProfileCreationScreen from "./screens/ProfileCreationScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import HomeScreen from "./screens/HomeScreen";

const Stack = createStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    authService.getCurrentUser().then(async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    const { data: { subscription } } = authService.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: "#1C1C1C" },
        }}
      >
        <>
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{
              ...TransitionPresets.SlideFromRightIOS,
              transitionSpec: {
                open: {
                  animation: "timing",
                  config: {
                    duration: 300,
                    easing: (t: number) => t * (2 - t),
                  },
                },
                close: {
                  animation: "timing",
                  config: {
                    duration: 300,
                    easing: (t: number) => t * (2 - t),
                  },
                },
              },
            }}
          />
          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{
              ...TransitionPresets.SlideFromRightIOS,
              transitionSpec: {
                open: {
                  animation: "timing",
                  config: {
                    duration: 300,
                    easing: (t: number) => t * (2 - t),
                  },
                },
                close: {
                  animation: "timing",
                  config: {
                    duration: 300,
                    easing: (t: number) => t * (2 - t),
                  },
                },
              },
            }}
          />
          <Stack.Screen
            name="UserTypeSelection"
            component={UserTypeSelectionScreen}
            options={{
              ...TransitionPresets.SlideFromRightIOS,
              transitionSpec: {
                open: {
                  animation: "timing",
                  config: {
                    duration: 300,
                    easing: (t: number) => t * (2 - t),
                  },
                },
                close: {
                  animation: "timing",
                  config: {
                    duration: 300,
                    easing: (t: number) => t * (2 - t),
                  },
                },
              },
            }}
          />
          <Stack.Screen
            name="GenreSelection"
            component={GenreSelectionScreen}
            options={{
              ...TransitionPresets.SlideFromRightIOS,
              transitionSpec: {
                open: {
                  animation: "timing",
                  config: {
                    duration: 300,
                    easing: (t: number) => t * (2 - t),
                  },
                },
                close: {
                  animation: "timing",
                  config: {
                    duration: 300,
                    easing: (t: number) => t * (2 - t),
                  },
                },
              },
            }}
          />
          <Stack.Screen
            name="VibeSelection"
            component={VibeSelectionScreen}
            options={{
              ...TransitionPresets.SlideFromRightIOS,
              transitionSpec: {
                open: {
                  animation: "timing",
                  config: {
                    duration: 300,
                    easing: (t: number) => t * (2 - t),
                  },
                },
                close: {
                  animation: "timing",
                  config: {
                    duration: 300,
                    easing: (t: number) => t * (2 - t),
                  },
                },
              },
            }}
          />
          <Stack.Screen
            name="ArtistsSelection"
            component={ArtistsSelectionScreen}
            options={{
              ...TransitionPresets.SlideFromRightIOS,
              transitionSpec: {
                open: {
                  animation: "timing",
                  config: {
                    duration: 300,
                    easing: (t: number) => t * (2 - t),
                  },
                },
                close: {
                  animation: "timing",
                  config: {
                    duration: 300,
                    easing: (t: number) => t * (2 - t),
                  },
                },
              },
            }}
          />
          <Stack.Screen
            name="SoundscapesSelection"
            component={SoundscapesSelectionScreen}
            options={{
              ...TransitionPresets.SlideFromRightIOS,
              transitionSpec: {
                open: {
                  animation: "timing",
                  config: {
                    duration: 300,
                    easing: (t: number) => t * (2 - t),
                  },
                },
                close: {
                  animation: "timing",
                  config: {
                    duration: 300,
                    easing: (t: number) => t * (2 - t),
                  },
                },
              },
            }}
          />
          <Stack.Screen
            name="PartyPreferenceSelection"
            component={PartyPreferenceSelectionScreen}
            options={{
              ...TransitionPresets.SlideFromRightIOS,
              transitionSpec: {
                open: {
                  animation: "timing",
                  config: {
                    duration: 300,
                    easing: (t: number) => t * (2 - t),
                  },
                },
                close: {
                  animation: "timing",
                  config: {
                    duration: 300,
                    easing: (t: number) => t * (2 - t),
                  },
                },
              },
            }}
          />
          <Stack.Screen
            name="ProfileCreation"
            component={ProfileCreationScreen}
            options={{
              ...TransitionPresets.SlideFromRightIOS,
              transitionSpec: {
                open: {
                  animation: "timing",
                  config: {
                    duration: 300,
                    easing: (t: number) => t * (2 - t),
                  },
                },
                close: {
                  animation: "timing",
                  config: {
                    duration: 300,
                    easing: (t: number) => t * (2 - t),
                  },
                },
              },
            }}
          />
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{
              ...TransitionPresets.SlideFromRightIOS,
              transitionSpec: {
                open: {
                  animation: "timing",
                  config: {
                    duration: 300,
                    easing: (t: number) => t * (2 - t),
                  },
                },
                close: {
                  animation: "timing",
                  config: {
                    duration: 300,
                    easing: (t: number) => t * (2 - t),
                  },
                },
              },
            }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              ...TransitionPresets.SlideFromRightIOS,
              transitionSpec: {
                open: {
                  animation: "timing",
                  config: {
                    duration: 300,
                    easing: (t: number) => t * (2 - t),
                  },
                },
                close: {
                  animation: "timing",
                  config: {
                    duration: 300,
                    easing: (t: number) => t * (2 - t),
                  },
                },
              },
            }}
          />
        </>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1C",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#1C1C1C",
    justifyContent: "center",
    alignItems: "center",
  },
});

