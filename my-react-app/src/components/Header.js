import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './Header.css';

function Header({ isLoggedIn, toggleLogin }) {
  const navigate = useNavigate();
  const location = useLocation(); // Hook pour obtenir la route active

  const handleLoginClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      toggleLogin();
    }
  };

  // Fonction pour vérifier si le chemin actuel correspond à celui passé en paramètre
  const isActive = (path) => location.pathname === path;
  const isActiveCustomers = (path) => location.pathname.startsWith(path);

  return (
    <div className="header">
      {/* Aligné à gauche */}
      <div className="site-name">
        <h1>Soul connection</h1>
      </div>

      {/* Centré */}
      <div className="middle-nav">
        <div
          className={`${isActive("/") ? "active" : ""}`}
          onClick={() => navigate("/")}
        >
          <h1>Dashboard</h1>
        </div>
        <div
          className={`coaches ${isActive("/coaches") ? "active" : ""}`}
          onClick={() => navigate("/coaches")}
        >
          <h1>Coaches</h1>
        </div>
        <div
          className={`custom ${isActiveCustomers("/customers") ? "active" : ""}`}
          onClick={() => navigate("/customers")}
        >
          <h1>Customers</h1>
        </div>
        <div
          className={`tips ${isActive("/tips") ? "active" : ""}`}
          onClick={() => navigate("/tips")}
        >
          <h1>Tips</h1>
        </div>
        <div
          className={`events ${isActive("/events") ? "active" : ""}`}
          onClick={() => navigate("/events")}
        >
          <h1>Events</h1>
        </div>
      </div>

      {/* Aligné à droite */}
      <div className="right-nav">
        <div className="login-button">
          <button className="chat" onClick={handleLoginClick}>
          </button>
          <button className="langue" onClick={handleLoginClick}>
          </button>
          <button className="login" onClick={handleLoginClick}>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
