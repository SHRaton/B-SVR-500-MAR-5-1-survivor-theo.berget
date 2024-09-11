import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GlobalContext } from '../GlobalContext'; // Importez le contexte global

const EditCustomer = () => {
  const { isLoggedIn } = useContext(GlobalContext); // Accès aux setters globaux
  const { id } = useParams();  // ID du client depuis l'URL
  const navigate = useNavigate();
  
  // State pour stocker les informations du client
  const [customer, setCustomer] = useState({
    name: '',
    surname: '',
    email: '',
    gender: '',
    address: '',
    phone_number: '',
    birth_date: '',
    astrological_sign: '',
    description: '',
    coach_id: null,
  });
  
  if (!isLoggedIn) {
    navigate('/login'); // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  }
  // Charger les informations du client
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/customers/${id}`);
        setCustomer(response.data.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des informations du client', error);
      }
    };

    fetchCustomer();
  }, [id]);

  // Gestion des changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer({
      ...customer,
      [name]: value,
    });
  };

  // Soumission du formulaire pour mettre à jour les informations du client
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:5000/api/customersEdit/${id}`, customer);
      alert('Les informations du client ont été mises à jour avec succès!');
      navigate('/customers');  // Redirection après la mise à jour
    } catch (error) {
      console.error('Erreur lors de la mise à jour des informations du client', error);
      alert('Une erreur est survenue lors de la mise à jour');
    }
  };

  return (
    <div>
      <h2>Éditer le client : {customer.name} {customer.surname}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nom :</label>
          <input
            type="text"
            id="name"
            name="name"
            value={customer.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="surname">Prénom :</label>
          <input
            type="text"
            id="surname"
            name="surname"
            value={customer.surname}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email :</label>
          <input
            type="email"
            id="email"
            name="email"
            value={customer.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="gender">Genre :</label>
          <select
            id="gender"
            name="gender"
            value={customer.gender}
            onChange={handleInputChange}
            required
          >
            <option value="">-- Choisir un genre --</option>
            <option value="male">Homme</option>
            <option value="female">Femme</option>
            <option value="other">Autre</option>
          </select>
        </div>

        <div>
          <label htmlFor="address">Adresse :</label>
          <input
            type="text"
            id="address"
            name="address"
            value={customer.address}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="phone_number">Numéro de téléphone :</label>
          <input
            type="text"
            id="phone_number"
            name="phone_number"
            value={customer.phone_number}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="birth_date">Date de naissance :</label>
          <input
            type="date"
            id="birth_date"
            name="birth_date"
            value={customer.birth_date}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="astrological_sign">Signe astrologique :</label>
          <input
            type="text"
            id="astrological_sign"
            name="astrological_sign"
            value={customer.astrological_sign}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description :</label>
          <textarea
            id="description"
            name="description"
            value={customer.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="coach_id">Coach ID :</label>
          <input
            type="text"
            id="coach_id"
            name="coach_id"
            value={customer.coach_id || ''}
            onChange={handleInputChange}
            disabled
          />
        </div>

        <button type="submit">Mettre à jour</button>
      </form>
    </div>
  );
};

export default EditCustomer;
