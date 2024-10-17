import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import axios from "axios";
import { AuthContext } from "./AuthContext";

const HomeScreen = () => {
  const { authToken } = useContext(AuthContext); // Obtener el token del contexto
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editPostId, setEditPostId] = useState(null);

  const handleCreatePost = async () => {
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
      setPosts([...posts, response.data]);
      setContent("");
      Alert.alert("Success", "Post created successfully!", [{ text: "OK" }]);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not create post", [{ text: "OK" }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Editar un post existente
  const handleEditPost = async () => {
    if (!editPostId) return;
    setIsLoading(true);
    try {
      await axios.put(
        `https://social-network-v7j7.onrender.com/api/posts/${editPostId}`,
        { content },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer {your_token_here}", // Reemplazar con el token de autenticación
          },
        }
      );
      setPosts(
        posts.map((post) =>
          post.id === editPostId ? { ...post, content } : post
        )
      );
      setContent("");
      setEditPostId(null);
      Alert.alert("Success", "Post updated successfully!", [{ text: "OK" }]);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not update post", [{ text: "OK" }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Borrar un post
  const handleDeletePost = async (postId) => {
    setIsLoading(true);
    try {
      await axios.delete(
        `https://social-network-v7j7.onrender.com/api/posts/${postId}`,
        {
          headers: {
            Authorization: "Bearer {your_token_here}", // Reemplazar con el token de autenticación
          },
        }
      );
      setPosts(posts.filter((post) => post.id !== postId)); // Eliminar el post de la lista
      Alert.alert("Success", "Post deleted successfully!", [{ text: "OK" }]);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not delete post", [{ text: "OK" }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para manejar la edición
  const startEditingPost = (postId, postContent) => {
    setEditPostId(postId);
    setContent(postContent);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Posts</Text>

      <TextInput
        style={styles.input}
        placeholder="Write a post..."
        value={content}
        onChangeText={setContent}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={editPostId ? handleEditPost : handleCreatePost}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {editPostId ? "Update Post" : "Create Post"}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <Text style={styles.postContent}>{item.content}</Text>
            <View style={styles.postActions}>
              <TouchableOpacity
                onPress={() => startEditingPost(item.id, item.content)}
              >
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeletePost(item.id)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
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
  postContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  postContent: {
    fontSize: 16,
    marginBottom: 10,
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editText: {
    color: "#007bff",
  },
  deleteText: {
    color: "red",
  },
});

export default HomeScreen;
