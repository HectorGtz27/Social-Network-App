import React, { useEffect, useState, useContext } from "react";
import { 
  View, Text, FlatList, ActivityIndicator, 
  StyleSheet, TouchableOpacity 
} from "react-native";
import { fetchUserInfo, fetchUserPosts } from "../services/ApiService";
import { AuthContext } from "../contexts/AuthContext";

const UserScreen = ({ route, navigation }) => {
  const { authToken } = useContext(AuthContext); // Acceder al token desde el contexto
  const { userId } = route.params; // Recibir el userId desde la navegación
  const [userInfo, setUserInfo] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Llamar a la API para obtener la información del usuario
        const userData = await fetchUserInfo(userId, authToken);
        setUserInfo(userData);

        // Llamar a la API para obtener los posts del usuario
        const postsData = await fetchUserPosts(userId, authToken);
        setUserPosts(postsData);
      } catch (error) {
        console.error("Error en la solicitud:", error);
      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
      fetchUserData();
    }
  }, [authToken, userId]);

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <Text style={styles.content}>{item.content}</Text>
      <Text style={styles.timestamp}>
        {new Date(item.created_at).toLocaleString()}
      </Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="black" />;
  }

  if (!userInfo) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error al cargar la información del usuario.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <Text style={styles.username}>{userInfo.username}</Text>
        <Text>Seguidores: {userInfo.follower_count}</Text>
        <Text>Seguidos: {userInfo.following_count}</Text>
      </View>

      <FlatList
        data={userPosts}
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
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  userInfoContainer: {
    marginBottom: 24,
    alignItems: "center",
  },
  username: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 8,
  },
  postsContainer: {
    paddingBottom: 16,
  },
  postContainer: {
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Sombra para Android
  },
  content: {
    fontSize: 16,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: "gray",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UserScreen;
