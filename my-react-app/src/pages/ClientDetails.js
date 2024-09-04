import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import 'primeicons/primeicons.css'
import './ClientDetails.css'

function ClientDetails() {
  const { id } = useParams(); // Récupère l'ID du client depuis l'URL
  const [clients, setClients] = useState(id);
  const [encounters, setEncounters] = useState(id);
  const [ratings, setRatings] = useState(id);
  const [incomings, setIncomings] = useState(id);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/api/customers/${id}`)
      .then(response => response.json())
      .then(data => setClients(data.data))
      .catch(error => console.error('Error fetching users:', error));
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/encounters/${id}`)
      .then(response => response.json())
      .then(data => setEncounters(data.data))
      .catch(error => console.error('Error fetching users:', error));
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/encounters/rating/${id}`)
      .then(response => response.json())
      .then(data => setRatings(data.data))
      .catch(error => console.error('Error fetching users:', error));
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/encounters/not-pass/${id}`)
      .then(response => response.json())
      .then(data => setIncomings(data.data))
      .catch(error => console.error('Error fetching users:', error));
  }, [id]);

  if (!clients) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="top-bar">
        <h1>Customer Details</h1>
        <div className="back" onClick={() => navigate("/customers")}></div>
      </div>
      <div className="bloc-principal">
        <div className="profil">
          <div className="photo">
            <p>{clients.name} {clients.surname}</p>
          </div>
          <div className="icone">
            <i className="pi pi-envelope"></i>
            <i className="pi pi-bookmark"></i>
          </div>
          <div className="encounters">
            <div className="numbersEncounters">
              <p> {encounters.length}</p>
              <p> {ratings.length}</p>
              <p> {incomings.length}</p>
            </div>
            <div className="textEncounters">
              <p>Total</p>
              <p>Positives</p>
              <p>In Progress</p>
            </div>
          </div>
          <div className="details">

          </div>
        </div>
        <div className="history"></div>
      </div>
      <h1>{clients.name}</h1>
      <p>{clients.email}</p>
      <p>{clients.phone_number}</p>
    </div>
  );
}

export default ClientDetails;
