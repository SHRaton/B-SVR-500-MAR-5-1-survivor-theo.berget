// GlobalContext.js
import React, { createContext, useState } from 'react';

// Crée le contexte
export const GlobalContext = createContext();

// Crée un provider pour partager l'état global
export const GlobalProvider = ({ children }) => {
  // Déclare les variables globales ici
  const [globalEmail, setGlobalEmail] = useState('');
  const [globalUserRole, setGlobalUserRole] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Ajoutez un état pour la connexion

  return (
    <GlobalContext.Provider value={{ globalEmail, setGlobalEmail, globalUserRole, setGlobalUserRole, isLoggedIn, setIsLoggedIn }}>
      {children}
    </GlobalContext.Provider>
  );
};
