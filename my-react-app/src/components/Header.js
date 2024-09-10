import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './Header.css';

function Header({ isLoggedIn, toggleLogin }) {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLoginClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      toggleLogin();
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => location.pathname === path;
  const isActivePartial = (path) => location.pathname.startsWith(path);

  return (
    <div className="header">
      <div className="site-name">
        <h1>Soul connection</h1>
      </div>

      <div className="middle-nav">
        <div
          className={`${isActive("/") ? "active" : ""}`}
          onClick={() => navigate("/")}
        >
          <h1>Dashboard</h1>
        </div>
        <div
          className={`${isActivePartial("/coaches") || location.pathname === "/addCoaches" ? "active" : ""}`}
          onClick={() => navigate("/coaches")}
        >
          <h1>Coaches</h1>
        </div>
        <div
          className={`${isActivePartial("/customers") || location.pathname === "/addCustomers" ? "active" : ""}`}
          onClick={() => navigate("/customers")}
        >
          <h1>Customers</h1>
        </div>
        <div
          className={`${isActive("/tips") ? "active" : ""}`}
          onClick={() => navigate("/tips")}
        >
          <h1>Tips</h1>
        </div>
        <div
          className={`${isActive("/events") ? "active" : ""}`}
          onClick={() => navigate("/events")}
        >
          <h1>Events</h1>
        </div>
        <div
          className={`${isActivePartial("/astro") ? "active" : ""}`}
          onClick={() => navigate("/astro")}
        >
          <h1>Astro</h1>
        </div>
      </div>

      {/* Menu burger pour mobiles */}
      <div className="burger-menu" onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      {isMenuOpen && (
        <div className="dropdown-menu">
          <div onClick={() => {navigate("/"); toggleMenu();}}>Dashboard</div>
          <div onClick={() => {navigate("/coaches"); toggleMenu();}}>Coaches</div>
          <div onClick={() => {navigate("/customers"); toggleMenu();}}>Customers</div>
          <div onClick={() => {navigate("/tips"); toggleMenu();}}>Tips</div>
          <div onClick={() => {navigate("/events"); toggleMenu();}}>Events</div>
          <div onClick={() => {navigate("/astro"); toggleMenu();}}>Astro</div>
          <div onClick={handleLoginClick}>Chat</div>
          <div onClick={handleLoginClick}>Langue</div>
        </div>
      )}

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
