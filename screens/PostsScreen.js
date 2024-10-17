import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { getRecentPosts } from '../api/postsApi';

const PostsScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getRecentPosts();
      console.log('Posts recibidos:', data);
      setPosts(data);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const renderPost = ({ item }) => (
    <TouchableOpacity
      style={styles.postContainer}
      onPress={() => navigation.navigate('User', { userId: item.user_id })}
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
    backgroundColor: '#f2f2f2',
  },
  postContainer: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    padding: 12,
    borderRadius: 10,

    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,

    // Sombra para Android
    elevation: 8,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  content: {
    marginTop: 8,
    fontSize: 14,
  },
  timestamp: {
    marginTop: 4,
    fontSize: 12,
    color: 'gray',
  },
});

export default PostsScreen;

