import React from 'react';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

function ResultPage() {
  const navigate = useNavigate();
  const isLoggedIn = Cookies.get('isLoggedIn'); // Vérifiez si l'utilisateur est connecté
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
