import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Coaches.css';

function Coaches() {
  const [coaches, setCoaches] = useState([]);
  const [showMenu, setShowMenu] = useState(null);
  const navigate = useNavigate();

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

  const nb_coaches = coaches.length;

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
            <div className="headerCustom2">
              <p>Cocahes</p>
              <p>Email</p>
            </div>
            <div className='lastTitle'>
              <p>Actions</p>
            </div>
          </div>
          {coaches.map(coache => (
            <div className="blocMain">
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
                    <p onClick={() => handleAssignClient(coache.id)}>Assign</p>
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