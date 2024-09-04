import React, { useState } from "react";
import './Tips.css'; // Assurez-vous que le CSS est correctement importé

// Import des images pour les flèches
import arrowDown from './down.png';
import arrowUp from './up.png';

function Tips() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const tipsData = [
    { title: "Tip 1", text: "Test1" },
    { title: "Tip 2", text: "Test2" },
    { title: "Tip 3", text: "Test3" }
  ];

  return (
    <div className="tips-container">
      <h1>Tips Page</h1>
      <p>Statistiques des performances ici.</p>
      <div className="tips-list">
        {tipsData.map((tip, index) => (
          <div key={index} className="tip-item">
            <div 
              className="tip-header"
              onClick={() => toggleDropdown(index)}
            >
              <span className="tip-title">{tip.title}</span>
              <img 
                src={openIndex === index ? arrowUp : arrowDown} 
                alt="Toggle" 
                className="arrow-icon" 
              />
            </div>
            {openIndex === index && (
              <div className="tip-content">
                <p>{tip.text}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tips;
