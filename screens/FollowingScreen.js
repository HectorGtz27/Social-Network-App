// FollowingScreen.js
import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { fetchFollowingPosts, likePost, unlikePost } from "../services/ApiService";

const FollowingScreen = ({ navigation }) => {
  const { authToken, userId } = useContext(AuthContext);
  const [followingPosts, setFollowingPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para obtener los posts de los usuarios seguidos
  const getFollowingPosts = async () => {
    setLoading(true);
    try {
      const response = await fetchFollowingPosts(authToken);
      setFollowingPosts(response.data);
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

  // Función para alternar el estado de Like y Unlike
  const handleLikeToggle = async (post) => {
    const isLiked = post.liked;
    try {
      if (isLiked) {
        await unlikePost(post.id, authToken);
      } else {
        await likePost(post.id, authToken);
      }
      setFollowingPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === post.id
            ? {
                ...p,
                liked: !isLiked,
                likes: Math.max(0, p.likes + (isLiked ? -1 : 1)),
              }
            : p
        )
      );
    } catch (error) {
      console.error("Error al cambiar el estado del like:", error);
    }
  };

  // Renderizar cada post en la lista, reutilizando el estilo de PostsScreen
  const renderPost = ({ item }) => (
    <TouchableOpacity
      style={styles.postContainer}
      onPress={() =>
        item.user_id === userId
          ? navigation.navigate("User", { userId })
          : navigation.navigate("User", { userId: item.user_id })
      }
    >
      <View style={styles.userInfo}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.username.charAt(0)}</Text>
                </View>
                <View style={styles.postDetails}>
                    <Text style={styles.username}>{item.username}</Text>
                    <Text style={styles.content}>{item.content}</Text>
                </View>
            </View>
            <Text style={styles.timestamp}>{new Date(item.created_at).toLocaleString()}</Text>
            <View style={styles.likesContainer}>
                <TouchableOpacity onPress={() => handleLikeToggle(item)}>
                    <Image
                        source={item.liked ? require("../assets/like.png") : require("../assets/unlike.png")}
                        style={styles.likeImage}
                    />
                </TouchableOpacity>
                <Text style={styles.likesCount}>{item.likes} {item.likes === 1 ? "Like" : "Likes"}</Text>
            </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#007bff" style={styles.loading} />;
  }

  if (!loading && followingPosts.length === 0) {
    return (
      <View style={styles.noFollowingContainer}>
        <Text style={styles.noFollowingText}>No sigues a nadie aún.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={followingPosts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderPost}
      contentContainerStyle={styles.postsContainer}
    />
  );
};

const styles = StyleSheet.create({
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
  userInfo: {
    flexDirection: "row",  // Alinear avatar y detalles del post en una fila
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#d4a017",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  postDetails: {
    flex: 1,  // Ocupa todo el espacio restante después del avatar
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
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noFollowingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noFollowingText: {
    fontSize: 18,
    color: "#888",
  },
});

export default FollowingScreen;
