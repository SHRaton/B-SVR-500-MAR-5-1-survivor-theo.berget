import React, { useEffect, useState } from 'react';
import './Tips.css'; // Assurez-vous que le CSS est correctement importé
import { useNavigate } from 'react-router-dom';
import arrowDown from './down.png';
import arrowUp from './up.png';
import Cookies from 'js-cookie';

function Tips() {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // État pour la barre de recherche
  const isLoggedIn = Cookies.get('isLoggedIn');
  const [tips, setTips] = useState([]);
  const navigate = useNavigate();

  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!isLoggedIn) {
    navigate('/login'); // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  }

  // Utilisation de useEffect pour récupérer tous les tips depuis le backend
  useEffect(() => {
    fetch('http://localhost:5000/api/tips')
      .then(response => response.json())
      .then(data => setTips(data.data)) // Récupérer tous les tips sans limite
      .catch(error => console.error('Error fetching tips:', error));
  }, []);

  // Filtrer les tips en fonction du terme de recherche
  const filteredTips = tips.filter((tip) =>
    tip.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="tips-container">
      <div className='top-bar'>
        <h1>Tips for Coaches</h1>
      </div>
      {/* Barre de recherche */}
      <input
        type="text"
        className="search-bar"
        placeholder="Search tips by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Met à jour le terme de recherche
      />

      <div className="tips-list">
        {filteredTips.map((tip, index) => (
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
