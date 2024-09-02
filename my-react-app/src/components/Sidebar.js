import React from "react";
import { Link } from "react-router-dom";
// import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>BzzHelper</h2>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/clients">Clients</Link></li>
        <li><Link to="/stats">Stats</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;
