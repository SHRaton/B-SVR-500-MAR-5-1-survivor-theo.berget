import React from "react";
import './Header.css';

function Header({ isLoggedIn, toggleLogin }) {
  return (
    <div className="header">
      <div className="site-name">
        <h1>Soul connection</h1>
      </div>
      <div className="login-button">
        <button onClick={toggleLogin}>
          {isLoggedIn ? "Se Déconnecter" : "Se Connecter"}
        </button>
      </div>
    </div>
  );
}

export default Header;
