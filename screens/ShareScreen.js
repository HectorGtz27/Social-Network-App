import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext"; // Obtener el token del contexto

const ShareScreen = ({ navigation }) => {
  const { authToken } = useContext(AuthContext); // Obtener el token de autenticación
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // Estado para el mensaje de éxito

  const handleCreatePost = async () => {
    if (!content) {
      Alert.alert("Error", "Please enter some content", [{ text: "OK" }]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://social-network-v7j7.onrender.com/api/posts",
        { content },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`, // Usar el token de autenticación
          },
        }
      );
      setSuccessMessage("Post created successfully!");
      Alert.alert("Success", "Post created successfully!", [{ text: "OK" }]);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not create post", [{ text: "OK" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Ajusta el comportamiento en función de la plataforma
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <TextInput
          style={styles.input}
          placeholder="Share your thoughts..."
          value={content}
          onChangeText={setContent}
          multiline={true}
          numberOfLines={6}
        />
        {successMessage ? (
          <Text style={styles.successMessage}>{successMessage}</Text>
        ) : null}

        <TouchableOpacity
          style={styles.button}
          onPress={handleCreatePost}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Post</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "top",
    padding: 20,
  },
  successMessage: {
    color: "#21c768",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    backgroundColor: "#fff",
    marginBottom: 10,
    height: 300,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ShareScreen;
