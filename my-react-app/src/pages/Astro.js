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
  const [percentageResult, setPercentageResult] = useState("");
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
    Aries: "/astro/aries.png",
    Taurus: "/astro/taurus.png",
    Gemini: "/astro/gemini.png",
    Cancer: "/astro/cancer.png",
    Leo: "/astro/leo.png",
    Virgo: "/astro/virgo.png",
    Libra: "/astro/libra.png",
    Scorpio: "/astro/scorpio.png",
    Sagittarius: "/astro/sagittarius.png",
    Capricorn: "/astro/capricorn.png",
    Aquarius: "/astro/aquarius.png",
    Pisces: "/astro/pisces.png",
  };

  const compatibilityMatrix = {
    Aries: { Aries: 77, Taurus: 42, Gemini: 68, Cancer: 39, Leo: 73, Virgo: 31, Libra: 52, Scorpio: 28, Sagittarius: 64, Capricorn: 22, Aquarius: 58, Pisces: 47 },
    Taurus: { Aries: 63, Taurus: 62, Gemini: 54, Cancer: 66, Leo: 37, Virgo: 71, Libra: 57, Scorpio: 50, Sagittarius: 52, Capricorn: 63, Aquarius: 41, Pisces: 53 },
    Gemini: { Aries: 69, Taurus: 55, Gemini: 64, Cancer: 41, Leo: 59, Virgo: 49, Libra: 78, Scorpio: 37, Sagittarius: 72, Capricorn: 48, Aquarius: 83, Pisces: 46 },
    Cancer: { Aries: 88, Taurus: 67, Gemini: 42, Cancer: 72, Leo: 47, Virgo: 62, Libra: 53, Scorpio: 79, Sagittarius: 38, Capricorn: 57, Aquarius: 44, Pisces: 66 },
    Leo: { Aries: 74, Taurus: 38, Gemini: 60, Cancer: 46, Leo: 81, Virgo: 36, Libra: 72, Scorpio: 48, Sagittarius: 77, Capricorn: 43, Aquarius: 66, Pisces: 56 },
    Virgo: { Aries: 62, Taurus: 72, Gemini: 50, Cancer: 63, Leo: 37, Virgo: 77, Libra: 52, Scorpio: 43, Sagittarius: 53, Capricorn: 78, Aquarius: 49, Pisces: 41 },
    Libra: { Aries: 99, Taurus: 57, Gemini: 77, Cancer: 54, Leo: 72, Virgo: 51, Libra: 68, Scorpio: 42, Sagittarius: 63, Capricorn: 49, Aquarius: 80, Pisces: 59 },
    Scorpio: { Aries: 89, Taurus: 48, Gemini: 37, Cancer: 79, Leo: 49, Virgo: 43, Libra: 42, Scorpio: 62, Sagittarius: 49, Capricorn: 56, Aquarius: 43, Pisces: 71 },
    Sagittarius: { Aries: 76, Taurus: 53, Gemini: 71, Cancer: 39, Leo: 76, Virgo: 52, Libra: 63, Scorpio: 48, Sagittarius: 87, Capricorn: 41, Aquarius: 56, Pisces: 50 },
    Capricorn: { Aries: 93, Taurus: 63, Gemini: 48, Cancer: 56, Leo: 44, Virgo: 79, Libra: 50, Scorpio: 57, Sagittarius: 42, Capricorn: 68, Aquarius: 52, Pisces: 33 },
    Aquarius: { Aries: 60, Taurus: 44, Gemini: 84, Cancer: 43, Leo: 67, Virgo: 51, Libra: 81, Scorpio: 43, Sagittarius: 57, Capricorn: 51, Aquarius: 75, Pisces: 48 },
    Pisces: { Aries: 68, Taurus: 54, Gemini: 46, Cancer: 67, Leo: 55, Virgo: 43, Libra: 59, Scorpio: 72, Sagittarius: 52, Capricorn: 31, Aquarius: 48, Pisces: 77 }
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
      const sign1 = selectedClient1.astrological_sign;
      const sign2 = selectedClient2.astrological_sign;
      // Obtenir le pourcentage à partir de compatibilityMatrix
      const compatibilityPercentage = compatibilityMatrix[sign1][sign2] || 'Unknown';
      if (sign1 === sign2) {
        setCompatibilityResult(`Great match! Both are ${sign1}s! Compatibility:`);
      } else {
        setCompatibilityResult(`${selectedClient1.name} (${sign1}) and ${selectedClient2.name} (${sign2}) have different signs. Compatibility:`);
      }
      setPercentageResult(`${compatibilityPercentage}%`);
    } else {
      setCompatibilityResult("Please select both clients.");
      setPercentageResult(``);
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
          <h1>{percentageResult}</h1>
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
