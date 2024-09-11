import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GlobalContext } from '../GlobalContext'; // Import global context
import './CoachAssign.css'; // Import the CSS for styling

const AssignCoach = () => {
  const { id } = useParams();  // Coach ID from URL
  const { isLoggedIn } = useContext(GlobalContext); // Access to global context
  const [customers, setCustomers] = useState([]);  // List of customers
  const [coaches, setCoaches] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null); // Selected customer
  const navigate = useNavigate();
  
  if (!isLoggedIn) {
    navigate('/login'); // Redirect to login if the user is not logged in
  }

  // Fetch customers
  useEffect(() => {
    fetch('http://localhost:5000/api/customers')
      .then(response => response.json())
      .then(data => setCustomers(data.data))
      .catch(error => console.error('Error fetching customers:', error));
  }, []);

  // Fetch coach info by ID
  useEffect(() => {
    fetch(`http://localhost:5000/api/coaches/${id}`)
      .then(response => response.json())
      .then(data => setCoaches(data.data))
      .catch(error => console.error('Error fetching coach:', error));
  }, [id]);

  // Handle customer assignment
  const handleLinkCustomer = async () => {
    if (!selectedCustomerId) {
      alert('Veuillez sélectionner un client');
      return;
    }

    try {
      // Update customer's coach_id
      await axios.put(`http://localhost:5000/api/addCoachToCustomer/${selectedCustomerId}`, { coach_id: id });
      alert('Le client a été assigné au coach avec succès!');
      navigate(`/coaches/${id}`);
    } catch (error) {
      console.error('Erreur lors de l\'assignation du client', error);
      alert('Une erreur est survenue');
    }
  };

  // Filter customers with no assigned coach
  const availableCustomers = customers.filter(customer => customer.coach_id === null);

  return (
    <div className="assign-container">
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
