import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../index.css'; 

const Profile = () => {
  const location = useLocation();
  const registeredData = location.state?.registeredData || null; // Retrieve passed data
  const [isAvailable, setIsAvailable] = useState(false); // State for availability toggle

  // Load availability status from localStorage
  useEffect(() => {
    const savedAvailability = JSON.parse(localStorage.getItem('availabilityStatus'));
    if (savedAvailability !== null) {
      setIsAvailable(savedAvailability);
    }
  }, []);

  // Save availability status to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('availabilityStatus', JSON.stringify(isAvailable));
  }, [isAvailable]);

  // Toggle availability
  const handleToggle = () => {
    setIsAvailable(!isAvailable);
  };

  if (!registeredData) {
    return <div>No Profile Data Available</div>;
  }

  return (
    <div className="profile-dialogue"> {/* Added dialogue box class */}
      <h2>User Profile</h2>
      <p><strong>Full Name:</strong> {registeredData.fullName}</p>
      <p><strong>Email:</strong> {registeredData.email}</p>
      <p><strong>Do you have a car?</strong> {registeredData.car}</p>
      <p><strong>Age:</strong> {registeredData.age}</p>
      <p><strong>Gender:</strong> {registeredData.gender}</p>
      <p><strong>Flat No./House No.:</strong> {registeredData.flatNumber}</p>
      <p><strong>Home Address:</strong> {registeredData.homeAddress}</p>
      <p><strong>Pincode:</strong> {registeredData.pincode}</p>
      <p><strong>Company:</strong> {registeredData.company}</p>
      <p><strong>Company Latitude:</strong> {registeredData.companyLat}</p>
      <p><strong>Company Longitude:</strong> {registeredData.companyLon}</p>
      <p><strong>Location Latitude:</strong> {registeredData.lat}</p>
      <p><strong>Location Longitude:</strong> {registeredData.lon}</p>

      {/* Availability Toggle */}
      <div className={`availability-container ${isAvailable ? 'available' : 'unavailable'}`}>
        <label className="switch">
          <input type="checkbox" checked={isAvailable} onChange={handleToggle} />
          <span className="slider"></span>
        </label>
        <span className="availability-status">
          {isAvailable ? 'Available' : 'Unavailable'}
        </span>
      </div>
    </div>
  );
};

export default Profile;
