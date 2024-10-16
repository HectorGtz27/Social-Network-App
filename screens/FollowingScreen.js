import React from "react";
import { View, Text, StyleSheet } from "react-native";

const FollowingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to the FollowingPage!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default FollowingScreen;