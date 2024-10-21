import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, TextInput, Image } from "react-native";
import { fetchPosts, createPost, likePost, unlikePost } from "../services/ApiService";
import { AuthContext } from "../contexts/AuthContext";

// Función para generar un color de avatar basado en el nombre de usuario
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

const PostsScreen = ({ navigation }) => {
  const { authToken, userId } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");

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

  const handleLikeToggle = async (post) => {
    const isLiked = post.liked;
    console.log(`Estado inicial del post ${post.id}: ${isLiked ? "Liked" : "Unliked"}`);
  
    try {
      if (isLiked) {
        console.log(`Deshaciendo like del post con ID: ${post.id}`);
        await unlikePost(post.id, authToken);
      } else {
        console.log(`Dando like al post con ID: ${post.id}`);
        await likePost(post.id, authToken);
      }
  
      // Asegura que 'likes' sea un número
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === post.id
            ? {
                ...p,
                liked: !isLiked,
                likes: Number(p.likes) + (isLiked ? -1 : 1), // Convirtiendo explícitamente a número
              }
            : p
        )
      );
  
      console.log(`Estado actualizado del post ${post.id}: ${!isLiked ? "Liked" : "Unliked"}`);
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
      <View style={styles.userInfo}>
        <View style={[styles.avatar, { backgroundColor: getAvatarColor(item.username) }]}>
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
          onPress={() => handleCreatePost(content)}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Creando..." : "Crear Post"}
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
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    flex: 1,
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
});

export default PostsScreen;
