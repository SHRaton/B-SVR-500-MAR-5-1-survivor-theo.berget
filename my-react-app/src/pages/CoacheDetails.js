import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import 'primeicons/primeicons.css';
import './CoacheDetails.css';
import Cookies from 'js-cookie';

function CoacheDetails() {
  const { id } = useParams(); // Récupère l'ID du coache depuis l'URL
  const [coaches, setCoaches] = useState(null);
  const [nbCustomers, setNbCustomers] = useState([]);
  const isLoggedIn = Cookies.get('isLoggedIn');
  const navigate = useNavigate();
  const urlDB = process.env.REACT_APP_DB_URL;

  const handleClick = (customerId) => {
    navigate(`/customers/${customerId}`);
  };

  if (!isLoggedIn) {
    navigate('/login');
  }

  useEffect(() => {
    fetch(`${urlDB}/api/users/${id}`)
      .then(response => response.json())
      .then(data => setCoaches(data.data))
      .catch(error => console.error('Error fetching users:', error));
  }, [id]);


  useEffect(() => {
    fetch(`${urlDB}/api/customersByCoach/${id}`)
      .then(response => response.json())
      .then(data => setNbCustomers(data.data))
      .catch(error => console.error('Error fetching customers:', error));
  }, [id]);

  if (!coaches) {
    return <div>Loading...</div>;
  }

  // URLs des vêtements
  const coachesImageUrl = `/employees/employee_${id}.png`;

  // Fonction pour rediriger vers l'application de messagerie
  const redirectMail = () => {
    if (coaches && coaches.email) {
      window.location.href = `mailto:${coaches.email}`;
    }
  };

  return (
    <div>
      <div className="top-bar">
        <h1>Coach Details</h1>
        <div className="back" onClick={() => navigate("/coaches")}></div>
      </div>
      <div className="bloc-principal">
        <div className="profil">
          <div className="photo">
            <div className="photoCadre" style={{ backgroundImage: `url(${coachesImageUrl})` }}></div>
            <p>{coaches.name} {coaches.surname}</p>
          </div>
          <div className="icone">
          <i className="pi pi-envelope" onClick={redirectMail} style={{ cursor: 'pointer' }}></i>
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
        <div className="historyDetails">
          {nbCustomers.map(customer => (
            <div
              className="blocDetails"
              key={customer.id}
              onClick={() => handleClick(customer.id)}
            >
              <p>{customer.name}</p>
              <p>{customer.surname}</p>
              <p>{customer.email}</p>
              <p>{customer.phone_number}</p>
              <p>{customer.astrological_sign}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CoacheDetails;
