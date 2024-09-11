import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import 'primeicons/primeicons.css';
import './CoacheDetails.css';
import Cookies from 'js-cookie';

function CoacheDetails() {
  const { id } = useParams(); // Récupère l'ID du coach depuis l'URL
  const [coaches, setCoaches] = useState(null); // État pour les détails du coach
  const [nbCustomers, setNbCustomers] = useState([]); // État pour la liste des clients associés au coach

  const isLoggedIn = Cookies.get('isLoggedIn'); // Vérifie si l'utilisateur est connecté
  const navigate = useNavigate();

  // Rediriger l'utilisateur vers la page d'un client lorsqu'on clique sur son nom
  const handleClick = (customerId) => {
    navigate(`/customers/${customerId}`);
  };

  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  if (!isLoggedIn) {
    navigate('/login');
  }

  // Récupérer les informations du coach
  useEffect(() => {
    fetch(`http://localhost:5000/api/users/${id}`)
      .then(response => response.json())
      .then(data => setCoaches(data.data))
      .catch(error => console.error('Error fetching users:', error));
  }, [id]);

  // Récupérer la liste des clients associés au coach
  useEffect(() => {
    fetch(`http://localhost:5000/api/customersByCoach/${id}`)
      .then(response => response.json())
      .then(data => setNbCustomers(data.data))
      .catch(error => console.error('Error fetching customers:', error));
  }, [id]);

  // Fonction pour rediriger vers l'application de messagerie
  const redirectMail = () => {
    if (coaches && coaches.email) {
      window.location.href = `mailto:${coaches.email}`;
    }
  };

  // URL de l'image du coach
  const coachesImageUrl = `/employees/employee_${id}.png`;

  if (!coaches) {
    return <div>Loading...</div>; // Afficher un message de chargement si les données ne sont pas encore prêtes
  }

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
              <p>{customer.name} {customer.surname}</p>
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
