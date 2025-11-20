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
import {
  UserCircle as UserIcon,
  Gear as GearIcon,
  House as HouseIcon,
  MagnifyingGlass as SearchIcon,
  Bell as BellIcon,
  Headphones as HeadphonesIcon,
  Envelope as EmailIcon,
  NotePencil as NotePencilIcon,
} from "phosphor-react-native";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<"ForYou" | "Mutuals">("ForYou");

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
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => {}}
          activeOpacity={0.7}
        >
          <UserIcon size={24} color="#F8F8FF" weight="regular" />
        </TouchableOpacity>

        <Image
          source={require("../assets/images/LOGO.png")}
          style={styles.headerLogo}
          resizeMode="contain"
        />

        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => {}}
          activeOpacity={0.7}
        >
          <GearIcon size={24} color="#F8F8FF" weight="regular" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "ForYou" && styles.tabActive]}
          onPress={() => setActiveTab("ForYou")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "ForYou" && styles.tabTextActive,
            ]}
          >
            For You
          </Text>
          {activeTab === "ForYou" && <View style={styles.tabIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "Mutuals" && styles.tabActive]}
          onPress={() => setActiveTab("Mutuals")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Mutuals" && styles.tabTextActive,
            ]}
          >
            Mutuals
          </Text>
          {activeTab === "Mutuals" && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.bottomNavItem, styles.bottomNavItemActive]}
          onPress={() => {}}
          activeOpacity={0.7}
        >
          <HouseIcon size={24} color="#303030" weight="regular" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() => {}}
          activeOpacity={0.7}
        >
          <SearchIcon size={24} color="#F8F8FF" weight="regular" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() => {}}
          activeOpacity={0.7}
        >
          <BellIcon size={24} color="#F8F8FF" weight="regular" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() => {}}
          activeOpacity={0.7}
        >
          <HeadphonesIcon size={24} color="#F8F8FF" weight="regular" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() => {}}
          activeOpacity={0.7}
        >
          <EmailIcon size={24} color="#F8F8FF" weight="regular" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => {}}
        activeOpacity={0.8}
      >
        <NotePencilIcon size={24} color="#F8F8FF" weight="regular" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1C",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: "#1B1B1B",
  },
  headerIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerLogo: {
    width: 141,
    height: 35.2,
    opacity: 1,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2C2C2C",
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "transparent",
    position: "relative",
  },
  tabActive: {
    backgroundColor: "transparent",
  },
  tabText: {
    color: "#F8F8FF",
    fontSize: 14,
    fontFamily: "Inter-Regular",
    fontWeight: "400",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 0,
  },
  tabTextActive: {
    color: "#F8F8FF",
  },
  tabIndicator: {
    position: "absolute",
    bottom: -16,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#A58ED4",
  },
  content: {
    flex: 1,
    backgroundColor: "#121212",
  },
  contentContainer: {
    padding: 24,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 100,
  },
  emptyStateText: {
    color: "#999999",
    fontSize: 14,
    fontFamily: "Inter-Regular",
    fontWeight: "400",
    textAlign: "center",
  },
  bottomNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 32,
    backgroundColor: "#303030",
    borderTopWidth: 1,
    borderTopColor: "#2C2C2C",
  },
  bottomNavItem: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomNavItemActive: {
    backgroundColor: "#A58ED4",
    borderRadius: 6,
  },
  floatingButton: {
    position: "absolute",
    bottom: 100,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#303030",
    borderWidth: 1,
    borderColor: "#414141",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 4,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
});

