import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [userId, setUserId] = useState(null);  // Aquí guardamos el userId
  
  const login = (token, id) => {
    setAuthToken(token);  // Guardamos el token
    setUserId(id);        // Guardamos el userId
  };

  const logout = () => {
    setAuthToken(null);
    setUserId(null);  // Al hacer logout, eliminamos los datos
  };

  return (
    <AuthContext.Provider value={{ authToken, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

