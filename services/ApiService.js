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
