import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router

const HeroSection = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  // Function to handle navigation to the Find a Ride page
  const handleFindaRide = () => {
    navigate('/findaride'); // Navigate to the /findaride route
  };

  // Function to handle navigation to the Start Carpooling page
  const handleStartCarpooling = () => {
    navigate('/startcarpooling'); // Navigate to the /startcarpooling route
  };

  return (
    <section className="hero">
      <h2>Join the Carpool Revolution!</h2>
      <p>Save the planet, save money, and make your commute better with MarioPool.</p>
      <div className="cta-buttons">
        <button onClick={handleFindaRide}>Find a Ride</button>
        <button onClick={handleStartCarpooling}>Start Carpooling</button> {/* Button navigates to Start Carpooling */}
      </div>
    </section>
  );
};

export default HeroSection;
