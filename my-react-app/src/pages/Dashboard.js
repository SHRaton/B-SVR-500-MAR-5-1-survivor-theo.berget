import React from "react";
import './Dashboard.css';

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome!</p>
      <div className="mainContainer">
        <div className="container">
          <div className="bloc1"></div>
          <div className="bloc2"></div>
          <div className="bloc3"></div>
          <div className="bloc4"></div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;