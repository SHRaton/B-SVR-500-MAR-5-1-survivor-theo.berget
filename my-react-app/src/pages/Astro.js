import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Astro.css';

function CompatibilityAnalysis() {
  const [clients, setClients] = useState([]); // Stocke tous les clients
  const [searchTerm1, setSearchTerm1] = useState(""); // Recherche pour le premier client
  const [searchTerm2, setSearchTerm2] = useState(""); // Recherche pour le deuxième client
  const [selectedClient1, setSelectedClient1] = useState(null); // Premier client sélectionné
  const [selectedClient2, setSelectedClient2] = useState(null); // Deuxième client sélectionné
  const [compatibilityResult, setCompatibilityResult] = useState(""); // Résultat de la compatibilité
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch tous les clients
    fetch(`http://localhost:5000/api/customers`)
      .then(response => response.json())
      .then(data => setClients(data.data))
      .catch(error => console.error('Error fetching clients:', error));
  }, []);

  // Map des signes astrologiques vers les images correspondantes
  const astroImages = {
    Aries: "/astrology-images/aries.png",
    Taurus: "/astrology-images/taurus.png",
    Gemini: "/astrology-images/gemini.png",
    Cancer: "/astrology-images/cancer.png",
    Leo: "/astrology-images/leo.png",
    Virgo: "/astrology-images/virgo.png",
    Libra: "/astrology-images/libra.png",
    Scorpio: "/astrology-images/scorpio.png",
    Sagittarius: "/astrology-images/sagittarius.png",
    Capricorn: "/astrology-images/capricorn.png",
    Aquarius: "/astrology-images/aquarius.png",
    Pisces: "/astrology-images/pisces.png",
  };

  // Filtrer les clients en fonction de la recherche pour la première barre
  const filteredClients1 = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm1.toLowerCase())
  );

  // Filtrer les clients en fonction de la recherche pour la deuxième barre
  const filteredClients2 = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm2.toLowerCase()) &&
    client.id !== selectedClient1?.id // Empêcher de sélectionner le même client dans la deuxième barre
  );

  // Fonction pour calculer la compatibilité
  const analyzeCompatibility = () => {
    if (selectedClient1 && selectedClient2) {
      // Exemple basique de calcul de compatibilité
      if (selectedClient1.astrologicalSign === selectedClient2.astrologicalSign) {
        setCompatibilityResult(`Great match! Both are ${selectedClient1.astrologicalSign}s!`);
      } else {
        setCompatibilityResult(`${selectedClient1.name} (${selectedClient1.astrologicalSign}) and ${selectedClient2.name} (${selectedClient2.astrologicalSign}) have different signs.`);
      }
    } else {
      setCompatibilityResult("Please select both clients.");
    }
  };

  return (
    <div>
      <div className="top-bar">
        <h1>Astrological Compatibility Analysis</h1>
      </div>

      {/* Bouton pour déclencher l'analyse de compatibilité */}
      <button onClick={analyzeCompatibility} className="analyze-button">
        Analyze Compatibility
      </button>
      
      {/* Affichage du résultat de compatibilité en haut */}
      {compatibilityResult && (
        <div className="result">
          <h2>Compatibility Result:</h2>
          <p>{compatibilityResult}</p>
        </div>
      )}

      <div className="search-container">
        {/* Barre de recherche pour le premier client */}
        <div className="search-section">
          <input
            type="text"
            placeholder="Search first client..."
            value={searchTerm1}
            onChange={(e) => setSearchTerm1(e.target.value)}
            className="search-bar"
          />
          <div className="client-list">
            {filteredClients1.map(client => (
              <div
                key={client.id}
                className={`client-item ${selectedClient1?.id === client.id ? 'selected' : ''}`}
                onClick={() => setSelectedClient1(client)}
              >
                <div>{client.name} {client.surname}</div>
                <div>
                  {client.astrological_sign}
                  {/* Affiche l'image correspondante au signe astrologique */}
                  <img
                    src={astroImages[client.astrological_sign]}
                    alt={client.astrological_sign}
                    className="astro-image"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Barre de recherche pour le deuxième client */}
        <div className="search-section">
          <input
            type="text"
            placeholder="Search second client..."
            value={searchTerm2}
            onChange={(e) => setSearchTerm2(e.target.value)}
            className="search-bar"
          />
          <div className="client-list">
            {filteredClients2.map(client => (
              <div
                key={client.id}
                className={`client-item ${selectedClient2?.id === client.id ? 'selected' : ''}`}
                onClick={() => setSelectedClient2(client)}
              >
                <div>{client.name} {client.surname}</div>
                <div>
                  {client.astrological_sign}
                  {/* Affiche l'image correspondante au signe astrologique */}
                  <img
                    src={astroImages[client.astrological_sign]}
                    alt={client.astrological_sign}
                    className="astro-image"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompatibilityAnalysis;
