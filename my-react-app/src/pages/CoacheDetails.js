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
  const [nbCustomers, setNbCustomers] = useState([]);

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
    fetch(`http://localhost:5000/api/customersByCoach/${id}`)
      .then(response => response.json())
      .then(data => setNbCustomers(data.data))
      .catch(error => console.error('Error fetching shoes clothes:', error));
  }, [id]);

  if (!coaches) {
    return <div>Loading...</div>;
  }

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
              <p className="numberBIG">{nbCustomers.length}</p>
              <p>Total customers</p>
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
        <div className="history">
          {nbCustomers.map(customer => (
            <div className="blocMain" key={customer.id}>
              <p>{customer.name}</p>
              <p>{customer.surname}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CoacheDetails;
