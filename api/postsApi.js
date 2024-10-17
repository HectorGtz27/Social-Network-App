export const getRecentPosts = async (page = 1, limit = 10) => {
    try {
      const response = await fetch(
        `https://social-network-v7j7.onrender.com/api/posts?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwNiwiaWF0IjoxNzI5MTQ4NjkxLCJleHAiOjE3MjkxNTU4OTF9.aQp17uKl42e_tDLAAgCv67zLsJxBPoxcXeHpRwCTAy0',
          },
        }
      );
  
      console.log('Status de la respuesta:', response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al obtener los posts:', errorData);
        throw new Error('Error al obtener los posts');
      }
  
      const data = await response.json();
      console.log('Datos recibidos:', data); // Log para confirmar los datos recibidos
      return data;
  
    } catch (error) {
      console.error('Error en la solicitud:', error);
      return [];
    }
  };
  