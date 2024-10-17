import React, { useEffect, useState, useContext } from "react";
import { 
  View, Text, FlatList, ActivityIndicator, 
  StyleSheet, TouchableOpacity 
} from "react-native";
import { AuthContext } from "./AuthContext"; // Importar el contexto

const PostsScreen = ({ navigation }) => {
  const { authToken } = useContext(AuthContext); // Acceder al token desde el contexto
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `https://social-network-v7j7.onrender.com/api/posts?page=1&limit=10`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`, // Usar el token dinámicamente
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener los posts");
        }

        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error en la solicitud:", error);
      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
      fetchPosts(); // Solo llamar si el token está disponible
    }
  }, [authToken]);

  const renderPost = ({ item }) => (
    <TouchableOpacity
      style={styles.postContainer}
      onPress={() => navigation.navigate("User", { userId: item.user_id })}
    >
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.content}>{item.content}</Text>
      <Text style={styles.timestamp}>
         {new Date(item.created_at).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="black" />;
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderPost}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f2f2f2",
  },
  postContainer: {
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
    padding: 15,
    borderRadius: 10,
    margin: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8, // Sombra para Android
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  content: {
    marginTop: 3,
    fontSize: 14,
    marginBottom: 5,
  },
  timestamp: {
    marginTop: 5,

    fontSize: 12,
    color: "gray",
  },
});

export default PostsScreen;
