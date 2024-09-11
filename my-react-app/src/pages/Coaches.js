import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import './Coaches.css';
import Cookies from 'js-cookie';

function Coaches() {
  const isLoggedIn = Cookies.get('isLoggedIn');
  const globalUserRole = Cookies.get('role');
  const globalEmail = Cookies.get('mail');
  const [coaches, setCoaches] = useState([]);
  const [showMenu, setShowMenu] = useState(null);
  const navigate = useNavigate();
  const urlDB = process.env.REACT_APP_DB_URL;

  if (!isLoggedIn) {
    navigate('/login'); // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  }

  useEffect(() => {
    fetch(`${urlDB}/api/users`)
      .then(response => response.json())
      .then(data => setCoaches(data.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleCoachesClick = (coachId) => {
    navigate(`/coaches/${coachId}`);
  };

  const handleMenuToggle = (coachId) => {
    setShowMenu(showMenu === coachId ? null : coachId);
  };

  const handleAssignCoach = (coachId) => {
    navigate(`/coaches/${coachId}/assign`);
  };

  const handleDeleteCoach = async (coachId) => {
    try {
      const response = await fetch(`${urlDB}/api/deleteUser/${coachId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setCoaches(coaches.filter(coach => coach.id !== coachId));
        setShowMenu(null);
      } else {
        alert('Failed to delete customer');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while deleting the customer');
    }
  };

  // Si l'utilisateur est un coach, filtrez la liste pour n'afficher que son propre email
  const filteredCoaches = globalUserRole === 'Coach' ? 
    coaches.filter(coach => coach.email === globalEmail) : 
    coaches;

  const nb_coaches = filteredCoaches.length;

  return (
    <div className='mainCustom'>
      <div className="top-bar">
        <h1>Coaches List</h1>
        <div className="addCustom">
          <div className="export" onClick={() => navigate("/addCoaches")}>
            <i className="pi pi-cloud-download"></i>
            <p>Export</p>
          </div>
          <div className="add" onClick={() => navigate("/addCoaches")}>
            <i className="pi pi-plus"></i>
          </div>
        </div>
      </div>
        <h2 className="subtitleCustom">You have {nb_coaches} coaches.</h2>
        <ul className='clients'>
          <div className='headerCustom1'>
            <div className='firstTitle'>
              <p>Picture</p>
            </div>
            <div className="headerCustom2">
              <p>Coaches</p>
              <p>Email</p>
            </div>
            <div className='lastTitle'>
              <p>Actions</p>
            </div>
          </div>
          {filteredCoaches.map(coache => (
            <div className="blocMain">
              <div className='first' style={{ backgroundImage: `url("/employees/employee_${coache.id}.png")` }}>
              </div>
              <div key={coache.id} onClick={() => handleCoachesClick(coache.id)} className="bloc">
                <p>
                  {coache.name} {coache.surname}
                </p>
                <p>
                  {coache.email}
                </p>
              </div>
              <div className='last'>
                <p onClick={() => handleMenuToggle(coache.id)}>...</p>
                {showMenu === coache.id && (
                  <div className="menu">
                    <p onClick={() => handleAssignCoach(coache.id)}>Assign</p>
                    <p onClick={() => handleDeleteCoach(coache.id)} style={{ color: 'red' }}>Delete</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </ul>
    </div>
  );
}

export default Coaches;