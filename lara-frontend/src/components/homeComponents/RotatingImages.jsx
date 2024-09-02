import React from 'react';
import './RotatingImages.css';
import centerImage from './hierarchical-structure.png'; // Replace with your center image path

const RotatingImages = () => {
  // List of skills to display
  const skills = [
    'Core Java',
    'SQL',
    'Data Structures and Algorithms',
    'JavaScript',
    'Angular',
    'Rest WebServices',
    'Spring Core',
    'Spring Boot',
    'Spring Data JPA',
    'Spring Security',
    'Spring MicroServices'
  ];

  return (
    <div className="rotating-container">
      {/* Center Image */}
      <div className="center-image">
        <img src={centerImage} alt="Center" />
      </div>

      {/* Rotating Skills */}
      {skills.map((skill, index) => (
        <div key={index} className={`rotating-skill rotating-skill-${index + 1}`}>
          <span>{skill}</span>
        </div>
      ))}
    </div>
  );
};

export default RotatingImages;
