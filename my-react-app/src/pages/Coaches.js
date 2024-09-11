import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Coaches.css';
import Cookies from 'js-cookie';

function Coaches() {
  const isLoggedIn = Cookies.get('isLoggedIn'); // Vérifiez si l'utilisateur est connecté
  const globalUserRole = Cookies.get('role');
  const globalEmail = Cookies.get('mail');
  const [coaches, setCoaches] = useState([]);
  const [showMenu, setShowMenu] = useState(null);
  const navigate = useNavigate();

  if (!isLoggedIn) {
    navigate('/login'); // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  }

  useEffect(() => {
    fetch('http://localhost:5000/api/users')
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

  const handleAssignClient = (coachId) => {
    navigate(`/coaches/${coachId}/assign`);
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
          {globalUserRole !== 'Coach' && ( // N'affichez le bouton d'ajout que si l'utilisateur n'est pas un coach
            <>
              <div className="export" onClick={() => navigate("/addCoaches")}>
                <i className="pi pi-cloud-download"></i>
                <p>Export</p>
              </div>
              <div className="add" onClick={() => navigate("/addCoaches")}>
                <i className="pi pi-plus"></i>
              </div>
            </>
          )}
        </div>
      </div>
      <h2 className="subtitleCustom">You have {nb_coaches} coach{nb_coaches > 1 ? 'es' : ''}.</h2>
      <ul className='clients'>
        <div className='headerCustom1'>
          <div className="headerCustom2">
            <p>Coaches</p>
            <p>Email</p>
          </div>
          <div className='lastTitle'>
            <p>Actions</p>
          </div>
        </div>
        {filteredCoaches.map(coach => (
          <div className="blocMain" key={coach.id}>
            <div onClick={() => handleCoachesClick(coach.id)} className="bloc">
              <p>
                {coach.name} {coach.surname}
              </p>
              <p>
                {coach.email}
              </p>
            </div>
            <div className='last'>
              <p onClick={() => handleMenuToggle(coach.id)}>...</p>
              {showMenu === coach.id && (
                <div className="menu">
                  <p onClick={() => handleAssignClient(coach.id)}>Assign</p>
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
