import React, { createContext, useState } from "react";

// Crear el contexto
export const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);

  const login = (token) => {
    setAuthToken(token); // Guardar el token cuando el usuario inicia sesión
  };

  const logout = () => {
    setAuthToken(null); // Eliminar el token cuando el usuario cierra sesión
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
