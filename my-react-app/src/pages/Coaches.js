import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './Coaches.css';


function Coaches() {
  const { id } = useParams(); // Récupère l'ID du client depuis l'URL
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    fetch(`http://localhost:5000/api/users/`)
      .then(response => response.json())
      .then(data => setUsers(data.data))
      .catch(error => console.error('Error fetching users:', error));
  }, [id]);

  const handleClientClick = (clientId) => {
    navigate(`/customers/${clientId}`);
  };

  const nb_coaches = users.length;

  return (
    <div>
      <div className="top-bar">
        <h1>Coaches List</h1>
        <div className="addCustom">
          <div className="export" onClick={() => navigate("/addCustomers")}></div>
          <div className="add" onClick={() => navigate("/addCustomers")}></div>
        </div>
      </div>
        <h2 className="subtitleCustom">You have {nb_coaches} coaches.</h2>
        <ul className='clients'>
          <div className="headerCustom">
            <p>Customers</p>
            <p>Email</p>
            <p>Actions</p>
          </div>
          {users.map(user => (
            <div key={user.id} onClick={() => handleClientClick(user.id)} className="bloc">
              <p>
                {user.name} {user.surname}
              </p>
              <p>
                {user.email}
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

export default Coaches;