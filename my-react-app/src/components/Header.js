import React from "react";
import { useNavigate } from "react-router-dom";
import './Header.css';

function Header({ isLoggedIn, toggleLogin }) {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      toggleLogin();
    }
  };

  return (
    <div className="header">
      <div className="site-name">
        <h1>Soul connection</h1>
      </div>
      <div className="username">
        <h1>Unknown</h1>
      </div>
      <div className="login-button">
        <button onClick={handleLoginClick}>
          {isLoggedIn ? "Se Déconnecter" : "Se Connecter"}
        </button>
      </div>
    </div>
  );
}

export default Header;
