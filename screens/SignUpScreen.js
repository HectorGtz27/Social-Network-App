import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Estado para el mensaje de éxito

  const handleSignUp = async () => {
    try {
      const response = await axios.post(
        "https://social-network-v7j7.onrender.com/api/auth/signup",
        {
          username: username,
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
        setSuccessMessage("Sign up successful! Please login.");
        console.log("Token:", response.data.token);
      }
    } catch (error) {
      if (error.response) {
        console.log("Server Response:", error.response.data);
        Alert.alert(
          "Error",
          `Sign up failed: ${
            error.response.data.message || "Please try again."
          }`,
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
        console.log("Sign up error:", error.message);
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
      <Text style={styles.headerSignUp}>Create an Account</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
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
      {successMessage ? (
        <Text style={styles.successMessage}>{successMessage}</Text>
      ) : null}
      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpButtonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.linkText}>
          Already have an account?{" "}
          <Text style={styles.loginLinkText}>Login</Text>
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
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
    backgroundColor: "#fff",
  },
  linkText: {
    color: "black",
    marginTop: 15,
    textAlign: "center",
  },
  headerSignUp: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  signUpButton: {
    backgroundColor: "#21c768",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginLinkText: {
    color: "#007bff",
    fontWeight: "bold",
  },
  successMessage: {
    color: "#21c768",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SignUpScreen;
