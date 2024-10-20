import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { fetchUserInfo, fetchUserPosts, followUser, unfollowUser } from "../services/ApiService";

// Reutilizamos la función para obtener el color de avatar
const UserScreen = ({ route, navigation }) => {
  const { authToken, userId } = useContext(AuthContext);
  const profileUserId = route?.params?.userId || userId;

  const [userInfo, setUserInfo] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  // Función para generar un color de avatar basado en el nombre de usuario
// Función para generar un color basado en el nombre de usuario
const getAvatarColor = (username) => {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Convertir el hash a un valor RGB
  const r = (hash >> 16) & 0xff;
  const g = (hash >> 8) & 0xff;
  const b = hash & 0xff;

  return `rgb(${r}, ${g}, ${b})`;
};


  const loadUserData = async () => {
    setLoading(true);
    try {
      const userInfoResponse = await fetchUserInfo(profileUserId, authToken);
      setUserInfo(userInfoResponse);
      setIsFollowing(userInfoResponse.is_following);
      const userPostsResponse = await fetchUserPosts(profileUserId, authToken);
      setUserPosts(userPostsResponse);
    } catch (error) {
      console.error("Error al obtener la información del usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [profileUserId]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(profileUserId, authToken);
        setIsFollowing(false);
        Alert.alert("Unfollowed", `You have unfollowed ${userInfo.username}.`);
      } else {
        await followUser(profileUserId, authToken);
        setIsFollowing(true);
        Alert.alert("Followed", `You are now following ${userInfo.username}.`);
      }
      await loadUserData();
    } catch (error) {
      console.error("Error al cambiar el estado de seguimiento:", error);
      Alert.alert("Error", "No se pudo actualizar el estado de seguimiento.");
    }
  };

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <View style={styles.userInfo}>
        <View style={[styles.avatar, { backgroundColor: getAvatarColor(userInfo.username) }]}>
          <Text style={styles.avatarText}>{userInfo.username.charAt(0)}</Text>
        </View>
        <View style={styles.postDetails}>
          <Text style={styles.postUsername}>{userInfo.username}</Text>
          <Text style={styles.content}>{item.content}</Text>
        </View>
      </View>
      <Text style={styles.likes}>{item.likes.length} {item.likes.length === 1 ? "like" : "likes"}</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#007bff" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      {userInfo && (
        <View style={styles.profileContainer}>
          <View style={[styles.avatar, { backgroundColor: getAvatarColor(userInfo.username) }]}>
            <Text style={styles.avatarText}>{userInfo.username.charAt(0)}</Text>
          </View>
          <Text style={styles.username}>{userInfo.username}</Text>
          <Text style={styles.followInfo}>
            Followers: {userInfo.follower_count} | Following: {userInfo.following_count}
          </Text>
          <TouchableOpacity
            style={[styles.followButton, isFollowing ? styles.unfollowButton : styles.followButton]}
            onPress={handleFollowToggle}
          >
            <Text style={styles.followButtonText}>{isFollowing ? "Unfollow" : "Follow"}</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.postsHeader}>Posts</Text>
      <FlatList
        data={userPosts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPost}
        contentContainerStyle={styles.postsContainer}
        ListFooterComponent={<Text style={styles.noMorePosts}>No more posts</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
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
    fontSize: 20,
    fontWeight: "bold",
  },
  username: {
    fontSize: 26,
    fontWeight: "bold",
  },
  followInfo: {
    fontSize: 16,
    color: "gray",
    marginVertical: 5,
  },
  followButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  unfollowButton: {
    backgroundColor: "#aaa",
  },
  followButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  postsHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  postsContainer: {
    paddingBottom: 20,
  },
  postContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  postUsername: { 
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  content: {
    fontSize: 16,
    marginBottom: 10,
  },
  likes: {
    fontSize: 14,
    color: "gray",
  },
  noMorePosts: {
    textAlign: "center",
    color: "gray",
    marginTop: 10,
  },
});

export default UserScreen;
