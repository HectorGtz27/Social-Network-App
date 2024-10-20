import React, { useEffect, useState, useContext } from "react";
import {View, Text, FlatList,StyleSheet, ActivityIndicator} from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { fetchUserInfo, fetchUserPosts } from "../services/ApiService";

const getAvatarColor = (username) => {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }

  const r = (hash >> 16) & 0xff;
  const g = (hash >> 8) & 0xff;
  const b = hash & 0xff;

  return `rgb(${r}, ${g}, ${b})`;
};

const ProfileScreen = () => {
  const { authToken, userId } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const userInfoResponse = await fetchUserInfo(userId, authToken);
      setUserInfo(userInfoResponse);
      const userPostsResponse = await fetchUserPosts(userId, authToken);
      setUserPosts(userPostsResponse);
    } catch (error) {
      console.error("Error al obtener la información del usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <View style={styles.userInfo}>
        <View style={[styles.postAvatar, { backgroundColor: getAvatarColor(userInfo.username) }]}>
          <Text style={styles.postAvatarText}>{userInfo.username.charAt(0)}</Text>
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
          <View style={[styles.profileAvatar, { backgroundColor: getAvatarColor(userInfo.username) }]}>
            <Text style={styles.profileAvatarText}>{userInfo.username.charAt(0)}</Text>
          </View>
          <Text style={styles.username}>{userInfo.username}</Text>
          <Text style={styles.followInfo}>
            Followers: {userInfo.follower_count} | Following: {userInfo.following_count}
          </Text>
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

  profileAvatar: {
    width: 80, 
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  postAvatar: {
    width: 40, 
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  
  profileAvatarText: {
    color: "#fff",
    fontSize: 36, 
    fontWeight: "bold",
  },

  postAvatarText: {
    color: "#fff",
    fontSize: 18, 
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
  postsHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  postsContainer: {
    paddingBottom: 20,
  },
  postContainer: {
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  postDetails: {
    flex: 1,
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
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileScreen;
