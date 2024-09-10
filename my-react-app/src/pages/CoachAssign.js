import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GlobalContext } from '../GlobalContext'; // Importez le contexte global

const AssignCoach = () => {
  const { id } = useParams();  // ID du coach depuis l'URL
  const { isLoggedIn } = useContext(GlobalContext); // Accès aux setters globaux
  const [customers, setCustomers] = useState([]);  // Liste des clients
  const [coaches, setCoaches] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null); // Client sélectionné
  const navigate = useNavigate();
  
  if (!isLoggedIn) {
    navigate('/login'); // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  }

  // Charger la liste des customers
  useEffect(() => {
    fetch('http://localhost:5000/api/customers')
      .then(response => response.json())
      .then(data => setCustomers(data.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  // Récupére les infos du coach à partir de son ID
  useEffect(() => {
    fetch(`http://localhost:5000/api/coaches/${id}`)
      .then(response => response.json())
      .then(data => setCoaches(data.data))
      .catch(error => console.error('Error fetching coach:', error));
  }, [id]);

  // Gestion du clic sur le bouton "Link"
  const handleLinkCustomer = async () => {
    if (!selectedCustomerId) {
      alert('Veuillez sélectionner un client');
      return;
    }

    try {
      // Mettre à jour le coach_id du client sélectionné
      await axios.put(`http://localhost:5000/api/addCoachToCustomer/${selectedCustomerId}`, { coach_id: id });
      alert('Le client a été assigné au coach avec succès!');
      navigate(`/coaches/${id}`);
    } catch (error) {
      console.error('Erreur lors de l\'assignation du client', error);
      alert('Une erreur est survenue');
    }
  };

  const availableCustomers = customers.filter(customer => customer.coach_id === null);

  return (
    <div>
      <h2>Assignation des clients au coach : {coaches?.name}</h2>
      <div>
        <label htmlFor="customer-select">Sélectionner un client :</label>
        <select
          id="customer-select"
          value={selectedCustomerId}
          onChange={(e) => setSelectedCustomerId(e.target.value)}
        >
          <option value="">-- Choisir un client --</option>
          {availableCustomers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name} {customer.surname}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleLinkCustomer}>Link</button>
    </div>
  );
};

export default AssignCoach;
