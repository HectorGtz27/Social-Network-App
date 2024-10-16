import React, { useContext, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TextInput,
} from "react-native";
import { AuthContext } from "../contexts/AuthContext"; // Obtener el contexto de autenticación
import { useFocusEffect } from "@react-navigation/native"; // Importar useFocusEffect
import { fetchPosts, updatePost, deletePost } from "../services/ApiService"; // Importar funciones de ApiService

const HomeScreen = ({ navigation }) => {
  const { authToken } = useContext(AuthContext); // Obtener el token del contexto
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editPostId, setEditPostId] = useState(null);
  const [content, setContent] = useState("");

  // Función para obtener los posts al cargar la pantalla
  const getPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetchPosts(authToken); // Llamar a la función de ApiService para obtener posts
      setPosts(response.data); // Almacenar los posts en el estado
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not fetch posts", [{ text: "OK" }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Refrescar los posts cada vez que se vuelve a la pantalla Home
  useFocusEffect(
    React.useCallback(() => {
      getPosts(); // Cargar los posts cada vez que la pantalla tiene foco
    }, [])
  );

  // Editar un post existente
  const handleEditPost = async () => {
    if (!editPostId) return;
    setIsLoading(true);
    try {
      const response = await updatePost(editPostId, content, authToken); // Llamar a la función de ApiService para editar post
      setPosts(
        posts.map((post) =>
          post.id === editPostId
            ? { ...post, content: response.data.content }
            : post
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

  // Borrar un post existente
  const handleDeletePost = async (postId) => {
    setIsLoading(true);
    try {
      await deletePost(postId, authToken); // Llamar a la función de ApiService para eliminar post
      setPosts(posts.filter((post) => post.id !== postId));
      Alert.alert("Success", "Post deleted successfully!", [{ text: "OK" }]);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not delete post", [{ text: "OK" }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Iniciar el proceso de edición
  const startEditingPost = (postId, postContent) => {
    setEditPostId(postId);
    setContent(postContent);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Posts</Text>

      {editPostId && (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Edit your post..."
            value={content}
            onChangeText={setContent}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleEditPost}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Update Post</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Mostrar los posts */}
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

      {/* Botón de "+" para navegar a la pantalla Share */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("Share")}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
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
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007bff",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
  },
});

export default HomeScreen;
