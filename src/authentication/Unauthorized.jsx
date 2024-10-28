import React from 'react';
import { useNavigate } from 'react-router-dom';
import  '../assets/css/Unauthorized.css'; // Optional: add some styles for the component

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/'); // Navigate back to the home page or login page
  };

  return (
    <div className="unauthorized-container">
      <h1>403 - Unauthorized</h1>
      <p>You do not have permission to view this page.</p>
      <button onClick={handleGoBack} className="btn-back-home">Go Back Home</button>
    </div>
  );
};

export default Unauthorized;
