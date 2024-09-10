import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import './Customers.css';
import { GlobalContext } from '../GlobalContext'; // Importez le contexte global

function Customers() {
  const [clients, setClients] = useState([]);
  const { isLoggedIn } = useContext(GlobalContext); // Accès aux setters globaux
  const [showMenu, setShowMenu] = useState(null); // Etat pour gérer le menu contextuel
  const navigate = useNavigate();
  
  if (!isLoggedIn) {
    navigate('/login'); // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  }
  useEffect(() => {
    fetch('http://localhost:5000/api/customers')
      .then(response => response.json())
      .then(data => setClients(data.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleClientClick = (clientId) => {
    navigate(`/customers/${clientId}`);
  };

  const handleMenuToggle = (clientId) => {
    setShowMenu(showMenu === clientId ? null : clientId); // Affiche ou cache le menu pour le client cliqué
  };

  const handleDeleteClient = async (clientId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/deleteCustomer/${clientId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setClients(clients.filter(client => client.id !== clientId)); // Mise à jour de la liste de clients après suppression
        setShowMenu(null); // Cacher le menu après suppression
      } else {
        alert('Failed to delete customer');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while deleting the customer');
    }
  };

  const handleEditClient = (clientId) => {
    navigate(`/customers/${clientId}/edit`); // Redirection vers la page de modification
  };

  const nb_customers = clients.length;

  return (
    <div className='mainCustom'>
      <div className="top-bar">
        <h1>Customer List</h1>
        <div className="addCustom">
          <div className="export" onClick={() => navigate("/addCustomers")}>
            <i className="pi pi-cloud-download"></i>
            <p>Export</p>
          </div>
          <div className="add" onClick={() => navigate("/addCustomers")}>
            <i className="pi pi-plus"></i>
          </div>
        </div>
      </div>
      <h2 className="subtitleCustom">You have {nb_customers} customers.</h2>
      <ul className='clients'>
        <div className='headerCustom1'>
          <div className="headerCustom2">
            <p>Customers</p>
            <p>Email</p>
            <p>Phone</p>
            <p>Payement Methods</p>
          </div>
          <div className='lastTitle'>
            <p>Actions</p>
          </div>
        </div>
        {clients.map(client => (
          <div className="blocMain" key={client.id}>
            <div onClick={() => handleClientClick(client.id)} className="bloc">
              <p>{client.name} {client.surname}</p>
              <p>{client.email}</p>
              <p>{client.phone_number}</p>
              <p>VISA</p>
            </div>
            <div className='last'>
              <p onClick={() => handleMenuToggle(client.id)}>...</p>
              {showMenu === client.id && (
                <div className="menu">
                  <p onClick={() => handleEditClient(client.id)}>Edit</p>
                  <p onClick={() => handleDeleteClient(client.id)} style={{ color: 'red' }}>Delete</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default Customers;
