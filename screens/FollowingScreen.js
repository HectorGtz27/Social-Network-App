// FollowingScreen.js
import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { AuthContext } from "../contexts/AuthContext"; // Importa el contexto de autenticación
import { fetchFollowingPosts } from "../services/ApiService"; // Importa la función de ApiService

const FollowingScreen = () => {
  const { authToken } = useContext(AuthContext); // Obtener el token de autenticación
  const [followingPosts, setFollowingPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para obtener los posts de las personas seguidas
  const getFollowingPosts = async () => {
    setLoading(true);
    try {
      const response = await fetchFollowingPosts(authToken); // Llama a fetchFollowingPosts con el token
      setFollowingPosts(response.data); // Almacena los posts en el estado
    } catch (error) {
      console.error("Error al obtener los posts de los seguidos:", error);
      Alert.alert("Error", "Could not load following posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Llamar a getFollowingPosts cuando se monta el componente
  useEffect(() => {
    getFollowingPosts();
  }, []);

  // Renderizar cada post en la lista
  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.content}>{item.content}</Text>
      <Text style={styles.likes}>{item.likes.length} {item.likes.length === 1 ? "Like" : "Likes"}</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#007bff" style={styles.loading} />;
  }

  return (
    <FlatList
      data={followingPosts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderPost}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  postContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  username: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  content: {
    fontSize: 16,
    marginBottom: 10,
  },
  likes: {
    fontSize: 12,
    color: "#555",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FollowingScreen;
