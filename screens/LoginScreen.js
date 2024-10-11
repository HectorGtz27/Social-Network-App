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
      <Text style={styles.headerLogin}>Welcome Back!</Text>
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
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.linkText}>
          Don't have an account?{" "}
          <Text style={styles.signLinkText}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
    backgroundColor: "#fff",
  },
  loginButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkText: {
    color: "black",
    marginTop: 15,
    textAlign: "center",
  },
  headerLogin: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  signLinkText: {
    color: "#007bff",
    fontWeight: "bold",
  },
});

export default LoginScreen;
