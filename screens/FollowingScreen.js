import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

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