import React, { useEffect, useState, useContext } from "react";
import { 
    View, Text, FlatList, ActivityIndicator, StyleSheet, 
    TouchableOpacity, TextInput, Image, Alert 
} from "react-native"; // Asegúrate de importar Alert aquí.
import { fetchPosts, likePost, unlikePost, createPost } from "../services/ApiService";
import { AuthContext } from "../contexts/AuthContext";

const PostsScreen = ({ navigation }) => {
    const { authToken, userId, username } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [content, setContent] = useState("");
    const [editingPostId, setEditingPostId] = useState(null); // Almacena el ID del post en edición.
    const [editingContent, setEditingContent] = useState("");

    useEffect(() => {
    const loadPosts = async () => {
        if (!authToken) {
            console.error("Auth token is missing.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetchPosts(authToken);
            const postsData = response.data.map(post => ({
                ...post,
                likes: Number(post.likes.toString().replace(",", "")) // Remover comas y convertir a número
            }));

            setPosts(postsData);

            // Imprimir la lista de likes con el formato corregido
            console.log("Lista de likes de cada post:");
            postsData.forEach((post) => {
                console.log(`Post ID: ${post.id}, Likes: ${post.likes}`);
            });

        } catch (error) {
            console.error("Error al obtener los posts:", error);
            Alert.alert("Error", "Failed to fetch posts", [{ text: "OK" }]);
        } finally {
            setLoading(false);
        }
    };

    loadPosts();
}, [authToken]);


    const handleCreatePost = async () => {
        if (!content.trim()) {
            Alert.alert("Error", "Please enter some content", [{ text: "OK" }]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await createPost(content, authToken);
            const newPost = response.data;

            setPosts((prevPosts) => [newPost, ...prevPosts]);
            setContent("");
            Alert.alert("Success", "Post created successfully!", [{ text: "OK" }]);
        } catch (error) {
            console.error("Error al crear el post:", error);
            Alert.alert("Error", "Could not create post", [{ text: "OK" }]);
        } finally {
            setIsLoading(false);
        }
    };

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
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {item.username ? item.username.charAt(0) : "?"}
                    </Text>
                </View>
                <View style={styles.postDetails}>
                    <Text style={styles.username}>{item.username || "Usuario desconocido"}</Text>
                    <Text style={styles.content}>{item.content || "Contenido no disponible"}</Text>
                </View>
            </View>
            <Text style={styles.timestamp}>{new Date(item.created_at).toLocaleString()}</Text>
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
                    {item.likes} {item.likes === 1 ? "Like" : "Likes"}
                </Text>
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
                    placeholder="Share your thoughts..."
                    value={content}
                    onChangeText={setContent}
                    multiline={true}
                    numberOfLines={6}
                    textAlignVertical="top"
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleCreatePost}
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
      flex: 1,
  },
  postsContainer: {
      padding: 16,
  },
  postContainer: {
      backgroundColor: "#fff",
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
  addButton: {
      position: "absolute",
      right: 20,
      bottom: 20,
      backgroundColor: "#007bff",
      width: 60,
      height: 60,
      borderRadius: 30,
      alignItems: "center",
      justifyContent: "center",
      elevation: 8,
  },
  addButtonText: {
      color: "#fff",
      fontSize: 30,
      fontWeight: "bold",
  },
  postActions: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10,
  },
  editText: {
      color: "blue",
      fontSize: 16,
  },
  deleteText: {
      color: "red",
      fontSize: 16,
  },
  checkText: {
      color: "green",
      fontSize: 24,
  },
  editableInput: {
      borderWidth: 1,
      borderColor: "#ddd",
      borderRadius: 8,
      padding: 10,
      fontSize: 16,
      backgroundColor: "#fff",
      marginBottom: 10,
  },
});

export default PostsScreen