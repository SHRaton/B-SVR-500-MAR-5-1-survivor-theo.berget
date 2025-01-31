import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Cookies from 'js-cookie';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const adminMail = process.env.REACT_APP_ADMIN_EMAIL;
  const urlDB = process.env.REACT_APP_DB_URL;

  useEffect(() => {
    fetch(`${urlDB}/api/users`) // URL correcte
      .then(response => response.json())
      .then(data => setUsers(data.data))
      .catch(error => console.error('Erreur lors de la récupération des utilisateurs :', error));
  }, []);

  const onButtonClick = () => {
    // Réinitialise les erreurs
    setEmailError('');
    setPasswordError('');
  
    if (email === adminMail) {
      Cookies.set('role', "admin", { expires: 1 });
      Cookies.set('mail', adminMail, { expires: 1 });
      Cookies.set('isLoggedIn', true, { expires: 1 });
      Cookies.set('name', "Admin", { expires: 1 });
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
  
    // Vérifier si l'utilisateur existe
    if (!user) {
      setEmailError('Email ou mot de passe incorrect');
      setPasswordError('Email ou mot de passe incorrect');
      return;  // Arrêter ici si l'utilisateur n'est pas trouvé
    }
  
    // Définir l'état global et rediriger vers le tableau de bord
    Cookies.set('mail', email, { expires: 1 });
    Cookies.set('role', user.work, { expires: 1 });
    Cookies.set('isLoggedIn', true, { expires: 1 });
    Cookies.set('name', user.name, { expires: 1 });
    navigate('/dashboard');
  };
  
  const onLogout = () => {
    Cookies.remove('mail');
    Cookies.remove('role');
    Cookies.remove('isLoggedIn');
    Cookies.remove('name');
    navigate('/login');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Bascule l'affichage du mot de passe
  };

  // Si l'utilisateur est connecté, afficher un bouton de déconnexion
  if (Cookies.get('isLoggedIn')) {
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
