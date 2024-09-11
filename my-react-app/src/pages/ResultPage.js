import React, { useContext } from 'react';
import { GlobalContext } from '../GlobalContext'; // Importez le contexte global
import { useNavigate } from "react-router-dom";

function ResultPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(GlobalContext); // Accès aux setters globaux
  if (!isLoggedIn) {
    navigate('/login'); // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
    return;
  }
  return (
    <div>
      <h1>Résultat</h1>
      {/* Vous pouvez afficher plus d'informations ici */}
    </div>
  );
}

export default ResultPage;
