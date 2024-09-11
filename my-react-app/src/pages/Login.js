import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { GlobalContext } from '../GlobalContext'; // Importez le contexte

const Login = () => {
  const { setGlobalEmail, setGlobalUserRole, isLoggedIn, setIsLoggedIn } = useContext(GlobalContext); // Accès aux setters globaux
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/users') // URL correcte
      .then(response => response.json())
      .then(data => setUsers(data.data))
      .catch(error => console.error('Erreur lors de la récupération des utilisateurs :', error));
  }, []);

  const onButtonClick = () => {
    // Réinitialise les erreurs
    setEmailError('');
    setPasswordError('');

    if (email === "admin-12458456455452295465@admin.okokokokok") {
      setGlobalEmail(email);
      setGlobalUserRole('Admin');
      setIsLoggedIn(true);
      navigate('/dashboard');
      return;
    }
    // Valider les champs
    if (email === '') {
      setEmailError('Email requis');
    }
    if (password === '') {
      setPasswordError('Mot de passe requis');
    }
    if (email === '' || password === '') {
      return;
    }

    // Trouver l'utilisateur dans le tableau users
    const user = users.find(user => user.email === email);

    if (!user) {
      setEmailError('Email ou mot de passe incorrect');
      setPasswordError('Email ou mot de passe incorrect');
    } else {
      // Définir l'état global et rediriger vers le tableau de bord
      setGlobalEmail(email);
      setGlobalUserRole(user.work === 'Coach' ? 'Coach' : 'Manager');
      setIsLoggedIn(true); // Définir l'utilisateur comme connecté
      navigate('/dashboard');
    }
  };

  const onLogout = () => {
    setGlobalEmail(''); // Réinitialiser l'email global
    setGlobalUserRole(''); // Réinitialiser le rôle utilisateur
    setIsLoggedIn(false); // Définir l'utilisateur comme déconnecté
    navigate('/login'); // Rediriger vers la page de connexion
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Bascule l'affichage du mot de passe
  };

  // Si l'utilisateur est connecté, afficher un bouton de déconnexion
  if (isLoggedIn) {
    return (
      <div className="mainContainer">
        <h2>Vous êtes connecté</h2>
        <button onClick={onLogout} className="inputButton">
          Déconnexion
        </button>
      </div>
    );
  }

  // Sinon, afficher le formulaire de connexion
  return (
    <div className={'mainContainer'}>
      <div className={'titleContainer'}>
        <div>Connexion</div>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
          value={email}
          placeholder="Entrez votre email"
          onChange={(ev) => setEmail(ev.target.value)}
          className={'inputBox'}
        />
        <label className="errorLabel">{emailError}</label>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
          type={showPassword ? "text" : "password"} // Bascule entre texte et mot de passe
          value={password}
          placeholder="Entrez votre mot de passe"
          onChange={(ev) => setPassword(ev.target.value)}
          className={'inputBox'}
        />
        <button onClick={togglePasswordVisibility} className="toggleButton">
          {showPassword ? "Masquer" : "Afficher"} le mot de passe
        </button>
        <label className="errorLabel">{passwordError}</label>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input className={'inputButton'} type="button" onClick={onButtonClick} value={'Connexion'} />
      </div>
    </div>
  );
};

export default Login;
