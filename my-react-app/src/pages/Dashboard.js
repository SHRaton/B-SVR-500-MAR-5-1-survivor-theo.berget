import React from "react";
import './Dashboard.css';

function Dashboard() {
  return (
    <div className={'dash'}>
      <h1>Dashboard</h1>
      <p>Welcome!</p>
      <div className="dashBloc">
        <div className="blocTop">
          <div className="bloc1">QQQ</div>
          <div className="bloc2">DDD</div>
        </div>
        <div className="blocBot">
          <div className="bloc3">ZZZ</div>
          <div className="bloc4">AAA</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;