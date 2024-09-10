import React, { useEffect, useState, useContext } from 'react';
import './Tips.css'; // Assurez-vous que le CSS est correctement importé
import { useNavigate } from 'react-router-dom';

// Import des images pour les flèches
import arrowDown from './down.png';
import arrowUp from './up.png';
import { GlobalContext } from '../GlobalContext'; // Importez le contexte global

function Tips() {
  const [openIndex, setOpenIndex] = useState(null);
  const { isLoggedIn } = useContext(GlobalContext); // Accès aux setters globaux
  const [tips, setTips] = useState([]);
  const navigate = useNavigate();
  
  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  if (!isLoggedIn) {
    navigate('/login'); // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  }

  // Utilisation de useEffect pour récupérer les tips depuis le backend
  useEffect(() => {
    fetch('http://localhost:5000/api/tips')
      .then(response => response.json())
      .then(data => setTips(data.data.slice(0, 5)))
      .catch(error => console.error('Error fetching tips:', error));
  }, []);

  return (
    <div className="tips-container">
      <h1 className="title">Tips for Coaches</h1>
      <div className="tips-list">
        {tips.map((tip, index) => (
          <div key={index} className="tip-item">
            <div 
              className="tip-header"
              onClick={() => toggleDropdown(index)}
            >
              <span className="tip-title">{tip.title}</span>
              <img 
                src={openIndex === index ? arrowUp : arrowDown} 
                alt="Toggle" 
                className="arrow-icon" 
              />
            </div>
            {openIndex === index && (
              <div className="tip-content">
                <p>{tip.tip}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tips;
