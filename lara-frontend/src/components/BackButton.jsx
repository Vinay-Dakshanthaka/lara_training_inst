import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';

const BackButton = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back one step in the history
  };

  return (
    <div style={{ position: 'absolute', top: '5rem', left: '1rem', cursor: 'pointer' }}>
      <BsArrowLeft size={28} onClick={handleGoBack} />
    </div>
  );
};

export default BackButton;
