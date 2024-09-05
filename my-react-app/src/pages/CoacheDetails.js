import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import 'primeicons/primeicons.css';
import './CoacheDetails.css';

function CoacheDetails() {
  const { id } = useParams(); // Récupère l'ID du coache depuis l'URL
  const [coaches, setCoaches] = useState(null);
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

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/api/users/${id}`)
      .then(response => response.json())
      .then(data => setCoaches(data.data))
      .catch(error => console.error('Error fetching users:', error));
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/encounters/${id}`)
      .then(response => response.json())
      .then(data => setEncounters(data.data))
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
    fetch(`http://localhost:5000/api/users/${id}/clothes/top`)
      .then(response => response.json())
      .then(data => setTop(data.data))
      .catch(error => console.error('Error fetching top clothes:', error));
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/users/${id}/clothes/hat-cap`)
      .then(response => response.json())
      .then(data => setHatCap(data.data))
      .catch(error => console.error('Error fetching hat-cap clothes:', error));
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/users/${id}/clothes/bottom`)
      .then(response => response.json())
      .then(data => setBottom(data.data))
      .catch(error => console.error('Error fetching bottom clothes:', error));
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/users/${id}/clothes/shoes`)
      .then(response => response.json())
      .then(data => setShoes(data.data))
      .catch(error => console.error('Error fetching shoes clothes:', error));
  }, [id]);

  if (!coaches) {
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
  const coachesImageUrl = `/employees/employee_${id}.png`;

  return (
    <div>
      <div className="top-bar">
        <h1>Customer Details</h1>
        <div className="back" onClick={() => navigate("/coaches")}></div>
      </div>
      <div className="bloc-principal">
        <div className="profil">
          <div className="photo">
            <div className="photoCadre" style={{ backgroundImage: `url(${coachesImageUrl})` }}></div>
            <p>{coaches.name} {coaches.surname}</p>
          </div>
          <div className="icone">
            <i className="pi pi-envelope"></i>
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
                <p className="subtitleSD">{coaches.email}</p>
              </div>
              <div>
                <p className="titleSD">Birth Date:</p>
                <p className="subtitleSD">{coaches.birth_date}</p>
              </div>
              <div>
                <p className="titleSD">Gender:</p>
                <p className="subtitleSD">{coaches.gender}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="history"></div>
      </div>
    </div>
  );
}

export default CoacheDetails;
