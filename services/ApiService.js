import axios from "axios";

// Definir la URL base de la API
const API_URL = "https://social-network-v7j7.onrender.com/api";

// Función para hacer login
export const login = async (email, password) => {
  return axios.post(
    `${API_URL}/auth/login`,
    { email, password },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

// Función para hacer signup
export const signUp = async (username, email, password) => {
  return axios.post(
    `${API_URL}/auth/signup`,
    { username, email, password },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

// Obtener todos los posts
export const fetchPosts = async (token) => {
  return axios.get(`${API_URL}/posts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Obtener la informacion del usuario 
export const fetchUserInfo = async (userId, token) => {
  const response = await axios.get(`${API_URL}/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Obtener los posts de un usuario
export const fetchUserPosts = async (userId, token, page = 1, limit = 10) => {
  const response = await axios.get(
    `${API_URL}/users/${userId}/posts?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Crear un nuevo post
export const createPost = async (content, token) => {
  return axios.post(
    `${API_URL}/posts`,
    { content },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Editar un post existente
export const updatePost = async (postId, content, token) => {
  return axios.patch(
    `${API_URL}/posts/${postId}`,
    { content },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Eliminar un post
export const deletePost = async (postId, token) => {
  return axios.delete(`${API_URL}/posts/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Dar Like a un post
export const likePost = async (postId, token) => {
  return axios.put(`${API_URL}/posts/${postId}/like`, {}, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};

// Quitar Like (Unlike) a un post
export const unlikePost = async (postId, token) => {
  return axios.delete(`${API_URL}/posts/${postId}/like`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchFollowingPosts = async (token, page = 1, limit = 10) => {
    return axios.get(`${API_URL}/feed?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  };