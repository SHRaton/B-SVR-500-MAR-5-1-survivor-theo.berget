import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import './Header.css';
import { GlobalContext } from '../GlobalContext';

function Header({ toggleLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn } = useContext(GlobalContext);
  const [coaches, setCoaches] = useState([]);
  const { globalEmail, globalUserRole } = useContext(GlobalContext);

  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then(response => response.json())
      .then(data => setCoaches(data.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleLoginClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  const handleBlogClick = () => {
    if (!isLoggedIn) {
      navigate("/blog");
    } else {
      navigate("/blog");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => location.pathname === path;
  const isActivePartial = (path) => location.pathname.startsWith(path);


  const filteredCoaches = globalUserRole === 'Coach' ? 
    coaches.filter(coach => coach.email === globalEmail) : 
    coaches;

  return (
    <div className="header">
      <div className="site-name">
        <h1 onClick={() => navigate("/dashboard")}>Soul connection</h1>
      </div>

      {/* Affichage du menu uniquement si l'utilisateur est connecté */}
      {isLoggedIn && (
        <div className="middle-nav">
          <div
            className={`${isActive("/dashboard") ? "active" : ""}`}
            onClick={() => navigate("/dashboard")}
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
      )}

      {isLoggedIn && (
        <div className="burger-menu" onClick={toggleMenu}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}

      {isMenuOpen && (
        <div className="dropdown-menu">
          <div onClick={() => {navigate("/dashboard"); toggleMenu();}}>Dashboard</div>
          <div onClick={() => {navigate("/coaches"); toggleMenu();}}>Coaches</div>
          <div onClick={() => {navigate("/customers"); toggleMenu();}}>Customers</div>
          <div onClick={() => {navigate("/tips"); toggleMenu();}}>Tips</div>
          <div onClick={() => {navigate("/events"); toggleMenu();}}>Events</div>
          <div onClick={() => {navigate("/astro"); toggleMenu();}}>Astro</div>
          <div onClick={handleBlogClick}>Chat</div>
          <div onClick={handleLoginClick}>Langue</div>
        </div>
      )}

      <div className="right-nav">
        <div className="login-button">
          {isLoggedIn && (
            <button className="chat" onClick={handleBlogClick}>
            </button>
          )}
          <button className="langue" onClick={handleLoginClick}>
          </button>
          {isLoggedIn && (
            <div className="nameHeader">
              <p>{filteredCoaches[0].name} {filteredCoaches[0].surname}</p>
            </div>
          )}
          <button className="login" onClick={handleLoginClick}>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
