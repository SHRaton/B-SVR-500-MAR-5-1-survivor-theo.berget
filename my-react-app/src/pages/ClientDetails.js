import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import 'primeicons/primeicons.css';
import './ClientDetails.css';
import { GlobalContext } from '../GlobalContext'; // Importez le contexte global

function ClientDetails() {
  const { id } = useParams(); // Récupère l'ID du client depuis l'URL
  const [clients, setClients] = useState(null);
  const [encounters, setEncounters] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [incomings, setIncomings] = useState([]);
  const [top, setTop] = useState([]);
  const [hat_cap, setHatCap] = useState([]);
  const [bottom, setBottom] = useState([]);
  const [shoes, setShoes] = useState([]);

  // État pour suivre l'index actif de chaque type de vêtement
  const [hatCapIndex, setHatCapIndex] = useState(0);
  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(0);
  const [shoesIndex, setShoesIndex] = useState(0);
  const { isLoggedIn } = useContext(GlobalContext); // Accès aux setters globaux

  const navigate = useNavigate();

  if (!isLoggedIn) {
    navigate('/login'); // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  }

  useEffect(() => {
    fetch(`http://localhost:5000/api/customers/${id}`)
      .then(response => response.json())
      .then(data => setClients(data.data))
      .catch(error => console.error('Error fetching users:', error));
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/encounters/${id}`)
      .then(response => response.json())
      .then(data => {
        // Trier les rencontres par date décroissante (les plus récentes en premier)
        const sortedEncounters = data.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        // Garder seulement les 5 premières rencontres
        setEncounters(sortedEncounters.slice(0, 5));
      })
      .catch(error => console.error('Error fetching encounters:', error));
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/encounters/rating/${id}`)
      .then(response => response.json())
      .then(data => setRatings(data.data))
      .catch(error => console.error('Error fetching ratings:', error));
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/encounters/not-pass/${id}`)
      .then(response => response.json())
      .then(data => setIncomings(data.data))
      .catch(error => console.error('Error fetching incomings:', error));
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/customers/${id}/clothes/top`)
      .then(response => response.json())
      .then(data => setTop(data.data))
      .catch(error => console.error('Error fetching top clothes:', error));
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/customers/${id}/clothes/hat-cap`)
      .then(response => response.json())
      .then(data => setHatCap(data.data))
      .catch(error => console.error('Error fetching hat-cap clothes:', error));
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/customers/${id}/clothes/bottom`)
      .then(response => response.json())
      .then(data => setBottom(data.data))
      .catch(error => console.error('Error fetching bottom clothes:', error));
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/customers/${id}/clothes/shoes`)
      .then(response => response.json())
      .then(data => setShoes(data.data))
      .catch(error => console.error('Error fetching shoes clothes:', error));
  }, [id]);

  if (!clients) {
    return <div>Loading...</div>;
  }

  // Fonctions pour changer l'index (carrousel)
  const handlePrev = (type) => {
    if (type === "hat_cap" && hat_cap.length > 0) {
      setHatCapIndex((prev) => (prev - 1 + hat_cap.length) % hat_cap.length);
    } else if (type === "top" && top.length > 0) {
      setTopIndex((prev) => (prev - 1 + top.length) % top.length);
    } else if (type === "bottom" && bottom.length > 0) {
      setBottomIndex((prev) => (prev - 1 + bottom.length) % bottom.length);
    } else if (type === "shoes" && shoes.length > 0) {
      setShoesIndex((prev) => (prev - 1 + shoes.length) % shoes.length);
    }
  };

  const handleNext = (type) => {
    if (type === "hat_cap" && hat_cap.length > 0) {
      setHatCapIndex((prev) => (prev + 1) % hat_cap.length);
    } else if (type === "top" && top.length > 0) {
      setTopIndex((prev) => (prev + 1) % top.length);
    } else if (type === "bottom" && bottom.length > 0) {
      setBottomIndex((prev) => (prev + 1) % bottom.length);
    } else if (type === "shoes" && shoes.length > 0) {
      setShoesIndex((prev) => (prev + 1) % shoes.length);
    }
  };

  // URLs des vêtements
  const customerImageUrl = `/customers/customer_${id}.png`;
  const customerHatCapUrl = hat_cap.length > 0 ? `/clothes/clothe_${hat_cap[hatCapIndex].id}.png` : null;
  const customerTopUrl = top.length > 0 ? `/clothes/clothe_${top[topIndex].id}.png` : null;
  const customerBottomUrl = bottom.length > 0 ? `/clothes/clothe_${bottom[bottomIndex].id}.png` : null;
  const customerShoesUrl = shoes.length > 0 ? `/clothes/clothe_${shoes[shoesIndex].id}.png` : null;

  // Fonction pour rediriger vers l'application de messagerie
  const redirectMail = () => {
    if (clients && clients.email) {
      window.location.href = `mailto:${clients.email}`;
    }
  };

  return (
    <div>
      <div className="top-bar">
        <h1>Customer Details</h1>
        <div className="back" onClick={() => navigate("/customers")}></div>
      </div>
      <div className="bloc-principal">
        <div className="profil">
          <div className="photo">
            <div className="photoCadre" style={{ backgroundImage: `url(${customerImageUrl})` }}></div>
            <p>{clients.name} {clients.surname}</p>
          </div>
          <div className="icone">
          <i className="pi pi-envelope" onClick={redirectMail} style={{ cursor: 'pointer' }}></i>
          <i className="pi pi-bookmark"></i>
          </div>
          <div className="encounters">
            <div className="left">
              <p className="numberBIG"> {encounters.length}</p>
              <p>Total Encounters</p>
            </div>
            <div className="middle">
              <p className="numberBIG"> {ratings.length}</p>
              <p>Positives</p>
            </div>
            <div className="right">
              <p className="numberBIG"> {incomings.length}</p>
              <p>In Progress</p>
            </div>
          </div>
          <div className="details">
            <p className="SD">Short details</p>
            <div className="infoSD">
              <div>
                <p className="titleSD">Email:</p>
                <p className="subtitleSD">{clients.email}</p>
              </div>
              <div>
                <p className="titleSD">Address:</p>
                <p className="subtitleSD">{clients.address}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="historyClientDetails">
          {/* Barre de titre */}
          <div className="titleBar">
            <div className="encounters1">
              <p>Date</p>
            </div>
            <div className="encounters2">
              <p>Rating</p>
            </div>
            <div className="encounters3">
              <p>Comment</p>
            </div>
            <div className="encounters4">
              <p>Source</p>
            </div>
          </div>
          {/* Détails des rencontres */}
          {encounters.map(encounter => (
            <div
              className="blocClientDetails"
              key={encounter.id}
            >
              <div className="encounters1">
                <p>{encounter.date}</p>
              </div>
              <div className="encounters2">
                <p>{encounter.rating}</p>
              </div>
              <div className="encounters3">
                <p>{encounter.comment}</p>
              </div>
              <div className="encounters4">
                <p>{encounter.source}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
      <div className="clothes">
        <div className="titleClothes">Choise of clothes</div>
        <div className="midBox">
          {/* Hat/Cap Section */}
          <div className="midBox1">
            <i className="pi pi-chevron-left" onClick={() => handlePrev("hat_cap")}></i>
            {hat_cap.length > 0 ? (
              <div className="photoBox" style={{ backgroundImage: `url(${customerHatCapUrl})` }}></div>
            ) : (
              <div className="photoBox">Pas d'habit de ce type</div>
            )}
            <i className="pi pi-chevron-right" onClick={() => handleNext("hat_cap")}></i>
          </div>

          {/* Top Section */}
          <div className="midBox2">
            <i className="pi pi-chevron-left" onClick={() => handlePrev("top")}></i>
            {top.length > 0 ? (
              <div className="photoBox" style={{ backgroundImage: `url(${customerTopUrl})` }}></div>
            ) : (
              <div className="photoBox">Pas d'habit de ce type</div>
            )}
            <i className="pi pi-chevron-right" onClick={() => handleNext("top")}></i>
          </div>

          {/* Bottom Section */}
          <div className="midBox3">
            <i className="pi pi-chevron-left" onClick={() => handlePrev("bottom")}></i>
            {bottom.length > 0 ? (
              <div className="photoBox" style={{ backgroundImage: `url(${customerBottomUrl})` }}></div>
            ) : (
              <div className="photoBox">Pas d'habit de ce type</div>
            )}
            <i className="pi pi-chevron-right" onClick={() => handleNext("bottom")}></i>
          </div>

          {/* Shoes Section */}
          <div className="midBox4">
            <i className="pi pi-chevron-left" onClick={() => handlePrev("shoes")}></i>
            {shoes.length > 0 ? (
              <div className="photoBox" style={{ backgroundImage: `url(${customerShoesUrl})` }}></div>
            ) : (
              <div className="photoBox">Pas d'habit de ce type</div>
            )}
            <i className="pi pi-chevron-right" onClick={() => handleNext("shoes")}></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientDetails;