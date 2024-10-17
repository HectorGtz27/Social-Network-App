import React, { useEffect, useState, useContext } from "react";
import { 
  View, Text, FlatList, ActivityIndicator, 
  StyleSheet, TouchableOpacity, TextInput, Image, Alert 
} from "react-native";
import { fetchPosts, createPost, updatePost, deletePost, likePost, unlikePost } from "../services/ApiService"; 
import { AuthContext } from "../contexts/AuthContext"; 

const PostsScreen = ({ navigation }) => {
  const { authToken, userId, username } = useContext(AuthContext); 
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [editPostId, setEditPostId] = useState(null);

  // Cargar posts al inicio
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const response = await fetchPosts(authToken);
        setPosts(response.data);
      } catch (error) {
        console.error("Error al obtener los posts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (authToken) loadPosts();
  }, [authToken]);

  // Crear un nuevo post
  const handleCreatePost = async () => {
    if (!content.trim()) {
      Alert.alert("Error", "El contenido no puede estar vacío.", [{ text: "OK" }]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await createPost(content, authToken);
      const newPost = {
        ...response.data,
        username: username, // Asignar el nombre del usuario actual
        user_id: userId, // Asignar el ID del usuario actual
      };
      setPosts([newPost, ...posts]);
      setContent("");
      Alert.alert("Éxito", "Post creado correctamente.", [{ text: "OK" }]);
    } catch (error) {
      console.error("Error al crear el post:", error);
      Alert.alert("Error", "No se pudo crear el post.", [{ text: "OK" }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar un post
  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId, authToken);
      setPosts(posts.filter((post) => post.id !== postId));
      Alert.alert("Éxito", "Post eliminado correctamente.", [{ text: "OK" }]);
    } catch (error) {
      console.error("Error al eliminar el post:", error);
      Alert.alert("Error", "No se pudo eliminar el post.", [{ text: "OK" }]);
    }
  };

  // Iniciar la edición de un post
  const startEditingPost = (postId, postContent) => {
    setEditPostId(postId);
    setContent(postContent);
  };

  // Actualizar un post
  const handleEditPost = async () => {
    if (!editPostId || !content.trim()) return;

    setIsLoading(true);
    try {
      const response = await updatePost(editPostId, content, authToken);
      setPosts(
        posts.map((post) =>
          post.id === editPostId ? { ...post, content: response.data.content } : post
        )
      );
      setContent("");
      setEditPostId(null);
      Alert.alert("Éxito", "Post actualizado correctamente.", [{ text: "OK" }]);
    } catch (error) {
      console.error("Error al actualizar el post:", error);
      Alert.alert("Error", "No se pudo actualizar el post.", [{ text: "OK" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPost = ({ item }) => (
    <TouchableOpacity
      style={styles.postContainer}
      onPress={() =>
        item.user_id === userId
          ? navigation.navigate("User", { userId }) 
          : navigation.navigate("User", { userId: item.user_id })
      }
    >
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.content}>{item.content}</Text>
      <Text style={styles.timestamp}>
        {new Date(item.created_at).toLocaleString()}
      </Text>
      <View style={styles.likesContainer}>
        <TouchableOpacity onPress={() => handleLikeToggle(item)}>
          <Image
            source={
              item.liked
                ? require("../assets/like.png")
                : require("../assets/unlike.png")
            }
            style={styles.likeImage}
          />
        </TouchableOpacity>
        <Text style={styles.likesCount}>
          {item.likes > 0 ? `${item.likes} Likes` : '0 Likes'}
        </Text>
      </View>

      {item.user_id === userId && (
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => startEditingPost(item.id, item.content)}>
            <Text style={styles.editText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeletePost(item.id)}>
            <Text style={styles.deleteText}>Borrar</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="black" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu post..."
          value={content}
          onChangeText={setContent}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={editPostId ? handleEditPost : handleCreatePost}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {editPostId ? "Actualizar Post" : "Crear Post"}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPost}
        contentContainerStyle={styles.postsContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  form: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  postsContainer: {
    padding: 16,
  },
  postContainer: {
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  content: {
    fontSize: 14,
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    color: "gray",
  },
  likesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  likeImage: {
    width: 18,
    height: 18,
    marginRight: 5,
  },
  likesCount: {
    fontSize: 14,
    color: "gray",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  editText: {
    color: "blue",
    fontWeight: "bold",
  },
  deleteText: {
    color: "red",
    fontWeight: "bold",
  },
});

export default PostsScreen;
