import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "https://social-network-v7j7.onrender.com/api/auth/login",
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.token) {
        Alert.alert("Success", `Welcome back, ${response.data.username}!`, [
          { text: "OK" },
        ]);
        navigation.navigate("Home"); // Redirigir al HomeScreen si el inicio de sesión es exitoso
        console.log("Token:", response.data.token);
        console.log("User ID:", response.data.userId);
      }
    } catch (error) {
      if (error.response) {
        // Imprimir el mensaje de error del servidor para ver la causa
        console.log("Server Response:", error.response.data);
        Alert.alert(
          "Error",
          error.response.data.error || "Invalid credentials. Please try again.",
          [{ text: "OK" }]
        );
      } else if (error.request) {
        console.log("Request Error:", error.request);
        Alert.alert(
          "Error",
          "No response from server. Please check your internet connection.",
          [{ text: "OK" }]
        );
      } else {
        console.log("Login error:", error.message);
        Alert.alert(
          "Error",
          "Unexpected error occurred. Please try again later.",
          [{ text: "OK" }]
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Login" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginVertical: 8,
  },
  linkText: {
    color: "blue",
    marginTop: 15,
    textAlign: "center",
  },
});

export default LoginScreen;
