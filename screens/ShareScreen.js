import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import { AuthContext } from "./AuthContext"; // Obtener el token del contexto

const ShareScreen = ({ navigation }) => {
  const { authToken } = useContext(AuthContext); // Obtener el token de autenticación
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      Alert.alert("Success", "Post created successfully!", [{ text: "OK" }]);
      navigation.navigate("Home"); // Redirigir a Home después de crear el post
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not create post", [{ text: "OK" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Write your post here..."
        value={content}
        onChangeText={setContent}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleCreatePost}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>Share Post</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
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
