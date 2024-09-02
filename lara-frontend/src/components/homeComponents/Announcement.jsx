import React from 'react';
import './announcement.css';

const Announcement = () => {
  return (
    <div className="announcement-container">
      <div className="rainbow">
        <span></span>
        <span></span>
      </div>
      <div className="announcement-wrapper">
        <div className="announcement-title">
            <ul>
                <li>
                    New Batch: Sept 16  
                </li>
                <li>
                Duration: 4 Months
                </li>
                <li>
                Monthly Easy Installments
                </li>
            </ul>
        </div>
      </div>
    </div>
  );
};

export default Announcement;
