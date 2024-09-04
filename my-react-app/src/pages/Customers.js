import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Customers.css';

function Customers() {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/customers')
      .then(response => response.json())
      .then(data => setClients(data.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);


  const handleClientClick = (clientId) => {
    navigate(`/customers/${clientId}`);
  };

  const nb_customers = clients.length;

  return (
    <div>
      <div className="top-bar">
        <h1>Customer List</h1>
        <div className="addCustom">
          <div className="export" onClick={() => navigate("/addCustomers")}></div>
          <div className="add" onClick={() => navigate("/addCustomers")}></div>
        </div>
      </div>
        <h2 className="subtitleCustom">You have {nb_customers} customers.</h2>
        <ul className='clients'>
          <div className="headerCustom">
            <p>Customers</p>
            <p>Email</p>
            <p>Phone</p>
            <p>Payement Methods</p>
            <p>Actions</p>
          </div>
          {clients.map(client => (
            <div key={client.id} onClick={() => handleClientClick(client.id)} className="bloc">
              <p>
                {client.name} {client.surname}
              </p>
              <p>
                {client.email}
              </p>
              <p>
                {client.phone_number}
              </p>
              <p>
                VISA
              </p>
              <p>
                ...
              </p>
            </div>
          ))}
        </ul>
    </div>
  );
}

export default Customers;