import React, { useEffect, useState, useContext } from "react";
import { 
  View, Text, FlatList, ActivityIndicator, 
  StyleSheet, TouchableOpacity, Image 
} from "react-native";
import { fetchUserInfo, fetchUserPosts, likePost, unlikePost } from "../services/ApiService";
import { AuthContext } from "../contexts/AuthContext";

const UserScreen = ({ route, navigation }) => {
  const { authToken, userId } = useContext(AuthContext); 
  const { userId: profileUserId } = route.params;
  const [userInfo, setUserInfo] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, [authToken, profileUserId]);

  const fetchUserData = async () => {
    try {
      const userData = await fetchUserInfo(profileUserId, authToken);
      setUserInfo(userData);

      const postsData = await fetchUserPosts(profileUserId, authToken);
      setUserPosts(postsData);
    } catch (error) {
      console.error("Error en la solicitud:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeToggle = async (post) => {
    const isLiked = post.liked;
    try {
      if (isLiked) {
        await unlikePost(post.id, authToken);
      } else {
        await likePost(post.id, authToken);
      }

      // Actualizar la lista de posts para reflejar los cambios
      setUserPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === post.id
            ? { ...p, liked: !isLiked, likes: Math.max(0, p.likes + (isLiked ? -1 : 1)) }
            : p
        )
      );
    } catch (error) {
      console.error("Error al cambiar el estado del like:", error);
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
          {item.likes > 0 ? `${item.likes} ${item.likes === 1 ? 'Like' : 'Likes'}` : '0 Likes'}
        </Text>
      </View>
    </TouchableOpacity>
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
    backgroundColor: "#f2f2f2",
  },
  userInfoContainer: {
    marginBottom: 24,
    alignItems: "center",
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UserScreen;
