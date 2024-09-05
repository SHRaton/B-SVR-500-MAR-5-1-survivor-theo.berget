import React from "react";
import './Dashboard.css';

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome!</p>
      <div className="mainContainerDash">
        <div className="bloc1">
          <div className="d1">
            <p className="titleDash">Customers Overview</p>
            <p className="subtitleDash">When a customers have joined in the time.</p>
          </div>
          <div className="d2">
            <p className="titleDash">Events</p>
            <p className="subtitleDash">Our events and their status.</p>
          </div>
        </div>
        <div className="bloc2">
          <div className="d3">
            <p className="titleDash">Customers by Country</p>
          </div>
          <div className="d4">
            <p className="titleDash">Meetings top sources</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;