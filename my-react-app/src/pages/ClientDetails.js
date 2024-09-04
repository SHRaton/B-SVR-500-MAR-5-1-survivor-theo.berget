import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import './ClientDetails.css'

function ClientDetails() {
  const { id } = useParams(); // Récupère l'ID du client depuis l'URL
  const [client, setClients] = useState(id);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/api/customers/${id}`)
      .then(response => response.json())
      .then(data => setClients(data.data))
      .catch(error => console.error('Error fetching users:', error));
  }, [id]);

  if (!client) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="top-bar">
        <h1>Customer Details</h1>
        <div className="back" onClick={() => navigate("/customers")}></div>
      </div>
      <h1>{client.name}</h1>
      <p>{client.email}</p>
      <p>{client.phone_number}</p>
      {/* Affichez ici les autres informations du client */}
    </div>
  );
}

export default ClientDetails;
